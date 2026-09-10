import { getEffectiveUser } from "@/lib/auth";
import { runAgent } from "@/lib/agent/runAgent";
import { normalizeItinerary } from "@/lib/agent/normalize";
import { planningSystemPrompt } from "@/lib/agent/prompts";
import { createTrip, updateTripItinerary, toPublicTrip, deleteTrip } from "@/lib/repo/trips";
import { addChatMessage } from "@/lib/repo/chat";
import { createNdjsonStream } from "@/lib/ndjsonStream";

// AI 여행 일정 생성 — NDJSON 스트리밍으로 진행 단계를 실시간 전달합니다.
// 각 줄: {type:"step", step:"places", status:"active"|"done"|"error", detail} 또는
//        {type:"result", trip:{...}} 또는 {type:"error", message}
//
// 로그인 없이도 사용할 수 있습니다 — 로그인 안 한 사용자는 브라우저별 "게스트" 계정으로
// 자동 연결되어(getEffectiveUser) 그 계정 아래에 일정이 저장됩니다. 실제 계정으로
// 로그인해야만 볼 수 있는 화면은 찜(/favorites)·MY(/my)뿐입니다.
export async function POST(req) {
  const user = await getEffectiveUser();

  const body = await req.json().catch(() => ({}));
  const message = String(body.message || "").trim();
  const conditions = Array.isArray(body.conditions) ? body.conditions : [];
  const origin = body.origin ? String(body.origin) : null;

  if (!message) {
    return new Response(JSON.stringify({ type: "error", message: "여행 요청 내용을 입력해주세요." }) + "\n", {
      status: 400,
    });
  }

  return createNdjsonStream(async (send) => {
    const fullMessage = conditions.length
      ? `${message}\n\n(빠른 조건: ${conditions.join(", ")})`
      : message;

    // Tool 호출 로그(ToolLog)를 이 여행 일정에 바로 연결하기 위해, 먼저 빈 일정으로
    // Trip을 만들고 Agent 실행이 끝나면 실제 일정으로 채웁니다.
    const placeholder = createTrip({
      userId: user.id,
      title: "AI가 일정을 만드는 중...",
      requestText: message,
      conditions,
      origin,
      itinerary: { summary: "", days: [], routeSummary: null, travelTips: [], placesById: {}, mapPoints: [] },
    });

    let itinerary, collectedPlaces, collectedRoutes, collectedTransitInfo;
    try {
      ({ itinerary, collectedPlaces, collectedRoutes, collectedTransitInfo } = await runAgent({
        systemPrompt: planningSystemPrompt({ origin }),
        userMessage: fullMessage,
        userId: user.id,
        tripId: placeholder.id,
        onEvent: (step, patch) => send({ type: "step", step, ...patch }),
      }));
    } catch (e) {
      deleteTrip(placeholder.id, user.id);
      throw e;
    }

    const normalized = normalizeItinerary({ itinerary, collectedPlaces, collectedRoutes, collectedTransitInfo });
    const trip = updateTripItinerary(placeholder.id, normalized, {
      title: normalized.summary?.slice(0, 40) || "새 여행 일정",
    });

    addChatMessage({ userId: user.id, tripId: trip.id, role: "user", text: message });
    addChatMessage({
      userId: user.id,
      tripId: trip.id,
      role: "ai",
      text: normalized.summary || "요청하신 여행 일정을 만들었어요.",
    });

    send({ type: "result", trip: toPublicTrip(trip) });
  });
}
