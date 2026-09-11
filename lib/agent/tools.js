import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { searchPlacesText } from "@/lib/google/places";
import { computeRoute } from "@/lib/google/routes";
import { embedText } from "@/lib/gemini";
import { searchKnowledgeByEmbedding } from "@/lib/repo/knowledge";
import { checkTransitOperations } from "@/lib/odpt";
import { addToolLog } from "@/lib/repo/toolLog";
import { addRouteHistory } from "@/lib/repo/routeHistory";

// UI(StepChecklist)의 5단계와 Tool 이름을 매핑합니다.
// (lib/mockData.js의 analysisSteps id: intent | places | routes | transit | rag)
export const TOOL_TO_STEP = {
  search_places: "places",
  compute_route: "routes",
  check_transit_operations: "transit",
  search_travel_knowledge: "rag",
};

// ctx: { userId, tripId, onEvent(stepId, patch) }
export function buildTools(ctx) {
  const log = (toolName, input, output, ok = true) => {
    try {
      addToolLog({ userId: ctx.userId, tripId: ctx.tripId, tool: toolName, input, output, ok });
    } catch (e) {
      console.error("[tool-log-failed]", e);
    }
  };

  const searchPlaces = tool(
    async ({ query, lat, lng }) => {
      const stepId = TOOL_TO_STEP.search_places;
      ctx.onEvent?.(stepId, { status: "active", detail: query });
      try {
        const places = await searchPlacesText({
          query,
          locationBias: lat && lng ? { lat, lng } : undefined,
        });
        log("search_places", { query }, { count: places.length, places });
        ctx.collectedPlaces?.push(...places);
        ctx.onEvent?.(stepId, { status: "done", detail: `"${query}" 검색 결과 ${places.length}건` });
        return JSON.stringify({ places });
      } catch (e) {
        log("search_places", { query }, { error: e.message }, false);
        ctx.onEvent?.(stepId, { status: "error", detail: e.message });
        return JSON.stringify({ error: e.message });
      }
    },
    {
      name: "search_places",
      description:
        "Google Places로 실제 관광지/맛집/역 등을 검색합니다. 사용자가 언급한 장소 이름이나 '신주쿠 근처 스시 맛집'처럼 자연어로 질의하세요.",
      schema: z.object({
        query: z.string().describe("검색어 (예: '아사쿠사 센소지', '신주쿠역 근처 스시 맛집')"),
        lat: z.number().optional().describe("검색 기준 위도 (있으면 그 주변으로 편향 검색)"),
        lng: z.number().optional().describe("검색 기준 경도"),
      }),
    }
  );

  const computeRouteTool = tool(
    async ({ origin, destination, travelMode }) => {
      const stepId = TOOL_TO_STEP.compute_route;
      ctx.onEvent?.(stepId, { status: "active", detail: `${origin} → ${destination}` });
      try {
        const route = await computeRoute({
          origin,
          destination,
          travelMode: travelMode || "TRANSIT",
        });
        log("compute_route", { origin, destination, travelMode }, route);
        ctx.collectedRoutes?.push({ origin, destination, travelMode: travelMode || "TRANSIT", ...route });
        try {
          addRouteHistory({
            userId: ctx.userId,
            tripId: ctx.tripId,
            origin,
            destination,
            mode: travelMode || "TRANSIT",
            result: route,
          });
        } catch {}
        ctx.onEvent?.(stepId, {
          status: "done",
          detail: `${origin} → ${destination} · ${route.durationText} · ${route.transferText}`,
        });
        return JSON.stringify(route);
      } catch (e) {
        log("compute_route", { origin, destination, travelMode }, { error: e.message }, false);
        ctx.onEvent?.(stepId, { status: "error", detail: e.message });
        return JSON.stringify({ error: e.message });
      }
    },
    {
      name: "compute_route",
      description:
        "Google Routes로 두 지점 사이의 실제 이동경로(대중교통/도보/자동차)와 소요시간, 환승 횟수를 계산합니다. 일정에 들어가는 모든 이동 구간마다 호출하세요.",
      schema: z.object({
        origin: z.string().describe("출발지 이름 또는 주소 (예: '신주쿠역')"),
        destination: z.string().describe("도착지 이름 또는 주소 (예: '센소지')"),
        travelMode: z
          .enum(["TRANSIT", "WALK", "DRIVE"])
          .default("TRANSIT")
          .describe("이동수단. 특별한 언급이 없으면 TRANSIT(대중교통)"),
      }),
    }
  );

  const searchKnowledge = tool(
    async ({ query }) => {
      const stepId = TOOL_TO_STEP.search_travel_knowledge;
      ctx.onEvent?.(stepId, { status: "active", detail: query });
      try {
        const embedding = await embedText(query);
        const docs = searchKnowledgeByEmbedding(embedding, 3);
        log("search_travel_knowledge", { query }, { docs: docs.map((d) => d.title) });
        ctx.onEvent?.(stepId, {
          status: "done",
          detail: docs.length ? `참고 문서 ${docs.length}건 확인` : "관련 문서 없음",
        });
        return JSON.stringify({ docs });
      } catch (e) {
        log("search_travel_knowledge", { query }, { error: e.message }, false);
        ctx.onEvent?.(stepId, { status: "error", detail: e.message });
        return JSON.stringify({ error: e.message });
      }
    },
    {
      name: "search_travel_knowledge",
      description:
        "일본 교통 이용법, Suica/PASMO, 여행 매너, 지역 팁 등을 담은 RAG 지식베이스에서 관련 문서를 검색합니다(실시간 길찾기가 아닌 여행 상식용). 여행 조건(가족 동반, 도보 최소 등)에 참고할 만한 팁이 있는지 최소 1회는 확인하세요.",
      schema: z.object({
        query: z.string().describe("검색할 여행 지식 질문 (예: '일본 지하철 처음 타는 주의사항')"),
      }),
    }
  );

  const checkTransit = tool(
    async ({ query }) => {
      const stepId = TOOL_TO_STEP.check_transit_operations;
      ctx.onEvent?.(stepId, { status: "active", detail: query || "실시간 운행정보 확인" });
      try {
        const info = await checkTransitOperations(query || "");
        log("check_transit_operations", { query }, info);
        // ODPT가 실제로 설정되어 있어서 출처 표시가 필요한 경우, 그 출처 문구를
        // normalizeItinerary가 나중에 확실히 쓸 수 있도록 원본 그대로 모아둡니다.
        // (AI가 finalize_itinerary에 옮겨적을 때 문구를 다르게 쓰거나 빠뜨릴 수 있어서,
        //  이 원본 데이터를 신뢰할 수 있는 값으로 사용합니다.)
        if (info.configured && info.attribution) {
          ctx.collectedTransitInfo?.push({ attribution: info.attribution });
        }
        ctx.onEvent?.(stepId, {
          status: "done",
          detail: info.configured
            ? `실시간 운행정보 ${info.results?.length || 0}건 확인`
            : "ODPT 미설정 - Google Routes 결과만 사용",
        });
        return JSON.stringify(info);
      } catch (e) {
        log("check_transit_operations", { query }, { error: e.message }, false);
        ctx.onEvent?.(stepId, { status: "error", detail: e.message });
        return JSON.stringify({ error: e.message });
      }
    },
    {
      name: "check_transit_operations",
      description:
        "(선택) 일본 공공교통 오픈데이터(ODPT)로 도쿄메트로/도에이 지하철의 실시간 운행 상황(지연/운휴)을 확인합니다. ODPT가 설정되지 않았으면 자동으로 건너뜁니다.",
      schema: z.object({
        query: z.string().optional().describe("확인할 노선/사업자 키워드 (예: '메트로', '도에이')"),
      }),
    }
  );

  // finalize_itinerary는 "종료 신호" 역할의 Tool입니다. 실행 로직은 특별히 없고
  // Agent 루프(runAgent.js)가 이 Tool 호출을 감지하면 args를 최종 결과로 사용하고 멈춥니다.
  const finalizeItinerary = tool(
    async (args) => {
      ctx.onEvent?.("done", { status: "done" });
      return "확정되었습니다.";
    },
    {
      name: "finalize_itinerary",
      description:
        "필요한 Tool 호출(search_places, compute_route, search_travel_knowledge 등)을 모두 마치고, 최종 여행 일정을 구조화된 형태로 확정할 때 호출합니다. 반드시 마지막에 한 번 호출해야 합니다.",
      schema: z.object({
        summary: z.string().describe("이번 일정/변경사항에 대한 한 문장 요약 (한국어)"),
        days: z
          .array(
            z.object({
              label: z.string().describe("예: '1일차'"),
              date: z.string().describe("예: '4월 12일 (토)' 또는 상대적 표현"),
              condition: z.string().describe("예: '도보 최소 · 환승 최대 1회 기준'"),
              travelTips: z
                .array(z.string())
                .optional()
                .describe(
                  "이 날짜에만 해당하는 여행 팁 1~3개. search_travel_knowledge로 그날 방문지/이동수단에 맞게 검색해서 채우세요(예: 사찰 방문이 있는 날은 사찰 예절, 지하철로 여러 번 갈아타는 날은 IC카드 팁). 모든 날짜에 똑같은 팁을 복사해 넣지 마세요."
                ),
              items: z.array(
                z.object({
                  time: z.string().describe("HH:MM 형식"),
                  title: z.string(),
                  desc: z.string().optional(),
                  changed: z
                    .boolean()
                    .optional()
                    .describe(
                      "일정을 수정하는 요청일 때만 사용: 이번 수정으로 실제로 내용이 바뀐 항목이면 true로 표시하세요. 처음 만드는 일정이거나 이번에 안 바뀐 항목에는 표시하지 마세요(생략 또는 false)."
                    ),
                  placeId: z.string().optional().describe("compute_route/search_places에서 얻은 Google placeId"),
                  placeName: z.string().optional(),
                  category: z
                    .enum(["관광", "맛집", "카페", "쇼핑", "숙소", "이동"])
                    .optional()
                    .describe(
                      "이 항목의 종류. 일정 요약(예: '관광 4곳 · 맛집 2곳 · 환승 1회')을 만드는 데 쓰이니 items 배열의 모든 항목에 빠짐없이 지정하세요. 실제 방문 장소가 아니라 단순 이동/환승 안내면 '이동'으로 표시하세요."
                    ),
                })
              ),
            })
          )
          .describe("일자별 세부 일정"),
        routeSummary: z
          .object({
            from: z.string(),
            to: z.string(),
            duration: z.string(),
            transfers: z.string(),
            legs: z
              .array(z.object({ mode: z.string(), detail: z.string() }))
              .optional(),
            source: z.string().optional().describe("실제 사용한 데이터 출처 (Google Routes/ODPT 등)"),
          })
          .optional()
          .describe("대표 구간(예: 출발지→첫 목적지)의 상세 경로 요약"),
      }),
    }
  );

  return [searchPlaces, computeRouteTool, searchKnowledge, checkTransit, finalizeItinerary];
}
