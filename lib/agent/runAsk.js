import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { buildChatModel } from "@/lib/agent/model";

/**
 * "AI에게 질문하기"(번역/일반 여행 지식 질문) 전용 호출입니다.
 *
 * runAgent.js와 달리 Tool 호출 루프가 전혀 없는 단순 1회 호출입니다 — 이 화면은
 * 일정 데이터를 바꾸거나 참고할 필요가 없어서, 현재 일정 JSON을 프롬프트에
 * 넣거나 search_places/compute_route 같은 Tool을 등록할 필요가 없습니다.
 * 그만큼 매 요청이 더 가볍고 빠릅니다.
 *
 * imageDataUrl: 사진(메뉴판·표지판 등)을 첨부한 경우 "data:image/jpeg;base64,..." 형태의
 * data URL. Gemini는 멀티모달 입력을 지원해서, LangChain의 표준 콘텐츠 배열 형식
 * ([{type:"text",...}, {type:"image_url",...}])으로 넣어주면 별도 OCR 없이도
 * 사진 속 글자를 직접 읽어서 답합니다.
 *
 * 반환: 답변 텍스트(string)
 */
export async function runAsk({ systemPrompt, userMessage, imageDataUrl }) {
  const model = buildChatModel();
  const humanContent = imageDataUrl
    ? [
        { type: "text", text: userMessage || "이 사진 속 일본어 텍스트를 읽어서 한국어로 번역해줘." },
        { type: "image_url", image_url: { url: imageDataUrl } },
      ]
    : userMessage;
  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage({ content: humanContent }),
  ]);
  const text = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
  return text.trim();
}
