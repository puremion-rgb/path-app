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
 * 반환: 답변 텍스트(string)
 */
export async function runAsk({ systemPrompt, userMessage }) {
  const model = buildChatModel();
  const response = await model.invoke([new SystemMessage(systemPrompt), new HumanMessage(userMessage)]);
  const text = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
  return text.trim();
}
