import { getEffectiveUser } from "@/lib/auth";
import { runAsk } from "@/lib/agent/runAsk";
import { askSystemPrompt } from "@/lib/agent/prompts";
import { getTripById } from "@/lib/repo/trips";
import { addAskMessage } from "@/lib/repo/ask";
import { jsonOk, ApiError, withApiError } from "@/lib/apiUtils";
import { getJpyToKrwRate } from "@/lib/exchangeRate";

// "AI에게 질문하기" — 번역/일반 여행 지식 질문 전용 화면입니다. 일정 수정
// (/api/agent/modify)과는 완전히 분리되어 있고, 현재 일정 내용을 참고하지도
// 바꾸지도 않습니다. Tool 호출 루프 없이 Gemini를 한 번만 호출하는 훨씬
// 가벼운 요청이라, 진행 단계 스트리밍 없이 답변을 한 번에 반환합니다.
// tripId는 이 질문·답변을 어느 여행 아래에 기록해둘지 정하는 용도로만 씁니다
// (일정 내용 자체는 프롬프트에 포함되지 않습니다).
// 사진 첨부 시 base64 데이터 크기 상한 (약 6MB 원본 기준, base64로는 더 커짐).
// 클라이언트에서 이미 리사이즈해서 보내지만, 그래도 서버에서 한 번 더 막아둡니다.
const MAX_IMAGE_DATA_URL_LENGTH = 8_000_000;

export const POST = withApiError(async (req) => {
  const user = await getEffectiveUser();

  const body = await req.json().catch(() => ({}));
  const tripId = String(body.tripId || "");
  const message = String(body.message || "").trim();
  const image = typeof body.image === "string" ? body.image : "";

  const trip = getTripById(tripId);
  if (!trip || trip.userId !== user.id) {
    throw new ApiError("여행 일정을 찾을 수 없습니다.", 404);
  }
  if (!message && !image) {
    throw new ApiError("질문 내용을 입력하거나 사진을 첨부해주세요.", 400);
  }
  if (image) {
    if (!/^data:image\/(jpeg|jpg|png|webp);base64,/.test(image)) {
      throw new ApiError("지원하지 않는 이미지 형식이에요.", 400);
    }
    if (image.length > MAX_IMAGE_DATA_URL_LENGTH) {
      throw new ApiError("사진 용량이 너무 커요. 더 작은 사진으로 다시 시도해주세요.", 400);
    }
  }

  // 사진은 지금 단계에서는 DB(AskMessage)에 저장하지 않고, 이번 요청에만
  // 사용합니다 (스키마 변경 없이 가볍게 붙이기 위한 선택). 대화 기록에는
  // 사용자가 사진을 보냈다는 사실만 텍스트로 남겨서, 새로고침 후에도
  // "언제 사진을 물어봤었는지" 맥락은 알 수 있게 합니다.
  const historyText = image ? `[사진 첨부]${message ? ` ${message}` : ""}` : message;
  addAskMessage({ userId: user.id, tripId, role: "user", text: historyText });

  // 환율 질문에 "참고용" 안내 대신 실제 값으로 답할 수 있도록, 매 요청마다
  // (내부적으로 캐시된) 실시간 엔화-원화 환율을 조회해서 프롬프트에 넣어줍니다.
  // 조회에 실패해도 null만 반환되고 예외는 나지 않으므로, 질문 답변 자체는
  // 항상 정상적으로 진행됩니다 (실패 시 예전과 같은 참고용 안내로 자동 대체).
  const exchangeRateInfo = await getJpyToKrwRate();

  const answer = await runAsk({
    systemPrompt: askSystemPrompt({ exchangeRateInfo }),
    userMessage: message,
    imageDataUrl: image || undefined,
  });

  addAskMessage({ userId: user.id, tripId, role: "ai", text: answer || "" });

  return jsonOk({ answer });
});
