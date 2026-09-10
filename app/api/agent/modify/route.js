import { getEffectiveUser } from "@/lib/auth";
import { runAgent } from "@/lib/agent/runAgent";
import { normalizeItinerary } from "@/lib/agent/normalize";
import { modificationSystemPrompt } from "@/lib/agent/prompts";
import { getTripById, updateTripItinerary, toPublicTrip } from "@/lib/repo/trips";
import { addChatMessage } from "@/lib/repo/chat";
import { createNdjsonStream } from "@/lib/ndjsonStream";

// 대화형 일정 수정 — "점심은 스시로 바꿔줘" 같은 자연어 요청을 받아 기존 Trip을 갱신합니다.
// 일정 생성과 마찬가지로 로그인 없이(게스트 계정으로) 사용할 수 있습니다.
export async function POST(req) {
  const user = await getEffectiveUser();

  const body = await req.json().catch(() => ({}));
  const tripId = String(body.tripId || "");
  const message = String(body.message || "").trim();

  const trip = getTripById(tripId);
  if (!trip || trip.userId !== user.id) {
    return new Response(JSON.stringify({ type: "error", message: "여행 일정을 찾을 수 없습니다." }) + "\n", {
      status: 404,
    });
  }
  if (!message) {
    return new Response(JSON.stringify({ type: "error", message: "수정 요청 내용을 입력해주세요." }) + "\n", {
      status: 400,
    });
  }

  return createNdjsonStream(async (send) => {
    const currentItinerary = JSON.parse(trip.itinerary);
    addChatMessage({ userId: user.id, tripId, role: "user", text: message });

    const { itinerary, collectedPlaces, collectedRoutes, collectedTransitInfo } = await runAgent({
      systemPrompt: modificationSystemPrompt({ origin: trip.origin, currentItinerary }),
      userMessage: message,
      userId: user.id,
      tripId,
      onEvent: (step, patch) => send({ type: "step", step, ...patch }),
    });

    // 새로 검색/계산되지 않은 기존 장소도 지도에 계속 표시되도록,
    // 이전 회차에서 모아둔 장소 정보를 이번 회차 결과와 합쳐줍니다.
    const prevPlaces = Object.values(currentItinerary.placesById || {});
    const normalized = normalizeItinerary({
      itinerary,
      collectedPlaces: [...prevPlaces, ...collectedPlaces],
      collectedRoutes,
      collectedTransitInfo,
    });

    const updated = updateTripItinerary(tripId, normalized, {
      title: normalized.summary?.slice(0, 40) || trip.title,
    });

    addChatMessage({
      userId: user.id,
      tripId,
      role: "ai",
      text: normalized.summary || "요청하신 대로 일정을 수정했어요.",
    });

    send({ type: "result", trip: toPublicTrip(updated) });
  });
}
