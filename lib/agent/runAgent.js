import { HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { buildChatModel } from "@/lib/agent/model";
import { buildTools } from "@/lib/agent/tools";
import { addToolLog } from "@/lib/repo/toolLog";

const MAX_ITERATIONS = 8;

/**
 * LangChain ChatGoogleGenerativeAI + Tool Calling으로 동작하는 여행 Agent 루프.
 *
 * options:
 *   systemPrompt: string
 *   userMessage: string
 *   userId, tripId: 로그/기록용
 *   onEvent(stepId, patch): 진행 단계 스트리밍 콜백 (intent|places|routes|transit|rag|done)
 *
 * 반환: { itinerary, raw } — itinerary는 finalize_itinerary Tool 호출 인자 그대로.
 */
export async function runAgent({ systemPrompt, userMessage, userId, tripId, onEvent }) {
  onEvent?.("intent", { status: "active" });

  const collectedPlaces = [];
  const collectedRoutes = [];
  const collectedTransitInfo = [];

  const model = buildChatModel();
  const tools = buildTools({ userId, tripId, onEvent, collectedPlaces, collectedRoutes, collectedTransitInfo });
  const modelWithTools = model.bindTools(tools);
  const toolByName = Object.fromEntries(tools.map((t) => [t.name, t]));

  const messages = [new SystemMessage(systemPrompt), new HumanMessage(userMessage)];

  onEvent?.("intent", { status: "done" });

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await modelWithTools.invoke(messages);
    messages.push(response);

    const toolCalls = response.tool_calls || [];
    if (toolCalls.length === 0) {
      // Tool을 호출하지 않고 텍스트만 준 경우 -> finalize_itinerary를 강제로 호출하도록 유도
      messages.push(
        new HumanMessage(
          "설명은 이해했습니다. 이제 반드시 finalize_itinerary Tool을 호출해서 최종 일정을 구조화된 JSON으로 제출해주세요."
        )
      );
      continue;
    }

    const finalizeCall = toolCalls.find((c) => c.name === "finalize_itinerary");

    for (const call of toolCalls) {
      const toolFn = toolByName[call.name];
      let content;
      if (!toolFn) {
        content = JSON.stringify({ error: `알 수 없는 tool: ${call.name}` });
      } else {
        try {
          content = await toolFn.func(call.args);
        } catch (e) {
          content = JSON.stringify({ error: e.message });
        }
      }
      messages.push(new ToolMessage({ tool_call_id: call.id, name: call.name, content }));
    }

    if (finalizeCall) {
      try {
        addToolLog({
          userId,
          tripId,
          tool: "finalize_itinerary",
          input: {},
          output: { summary: finalizeCall.args?.summary },
        });
      } catch {}
      return { itinerary: finalizeCall.args, collectedPlaces, collectedRoutes, collectedTransitInfo };
    }
  }

  throw new Error(
    "AI가 정해진 시도 횟수 안에 일정을 확정하지 못했습니다. 요청을 조금 더 구체적으로 입력해서 다시 시도해주세요."
  );
}
