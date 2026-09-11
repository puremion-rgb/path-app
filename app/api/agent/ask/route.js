import { getEffectiveUser } from "@/lib/auth";
import { runAsk } from "@/lib/agent/runAsk";
import { askSystemPrompt } from "@/lib/agent/prompts";
import { getTripById } from "@/lib/repo/trips";
import { addAskMessage } from "@/lib/repo/ask";
import { jsonOk, ApiError, withApiError } from "@/lib/apiUtils";

// "AI에게 질문하기" — 번역/일반 여행 지식 질문 전용 화면입니다. 일정 수정
// (/api/agent/modify)과는 완전히 분리되어 있고, 현재 일정 내용을 참고하지도
// 바꾸지도 않습니다. Tool 호출 루프 없이 Gemini를 한 번만 호출하는 훨씬
// 가벼운 요청이라, 진행 단계 스트리밍 없이 답변을 한 번에 반환합니다.
// tripId는 이 질문·답변을 어느 여행 아래에 기록해둘지 정하는 용도로만 씁니다
// (일정 내용 자체는 프롬프트에 포함되지 않습니다).
export const POST = withApiError(async (req) => {
  const user = await getEffectiveUser();

  const body = await req.json().catch(() => ({}));
  const tripId = String(body.tripId || "");
  const message = String(body.message || "").trim();

  const trip = getTripById(tripId);
  if (!trip || trip.userId !== user.id) {
    throw new ApiError("여행 일정을 찾을 수 없습니다.", 404);
  }
  if (!message) {
    throw new ApiError("질문 내용을 입력해주세요.", 400);
  }

  addAskMessage({ userId: user.id, tripId, role: "user", text: message });

  const answer = await runAsk({ systemPrompt: askSystemPrompt(), userMessage: message });

  addAskMessage({ userId: user.id, tripId, role: "ai", text: answer || "" });

  return jsonOk({ answer });
});
