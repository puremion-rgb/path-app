// Agent가 finalize_itinerary로 제출한 구조화 결과(LLM 출력)에,
// 실제 Tool 호출 결과(collectedPlaces/collectedRoutes — LLM이 손으로 옮겨적지 않은
// 원본 좌표/폴리라인)를 덧붙여 프론트가 지도에 바로 그릴 수 있는 형태로 만듭니다.
// (좌표·인코딩된 polyline처럼 긴 문자열은 LLM이 옮겨적다 오류를 낼 수 있어,
//  Tool 원본 데이터를 그대로 재사용하는 편이 훨씬 안전합니다.)

// item.placeId는 finalize_itinerary 스키마에서 optional이라, AI가 항목마다
// 빠짐없이 채워 넣는다는 보장이 없습니다(실제로 어떤 일정은 항목마다 다 채워져서
// 눌러서 장소 상세로 들어갈 수 있는데, 어떤 일정은 하나도 안 채워져서 아무 것도
// 안 눌리는 문제가 있었습니다). placeId가 비어 있어도 search_places로 실제 검색해
// 확인된 장소(collectedPlaces)라면 이름으로 매칭해 최대한 채워 넣습니다.
function findPlaceIdByName(name, collectedPlaces) {
  const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
  const target = norm(name);
  if (!target) return null;
  const match = collectedPlaces.find((p) => {
    const pname = norm(p.name);
    return pname && (pname.includes(target) || target.includes(pname));
  });
  return match?.placeId || null;
}

export function normalizeItinerary({
  itinerary,
  collectedPlaces = [],
  collectedRoutes = [],
  collectedTransitInfo = [],
}) {
  const placesById = {};
  for (const p of collectedPlaces) {
    if (p.placeId && !placesById[p.placeId]) placesById[p.placeId] = p;
  }

  // "이동"(단순 이동/환승 안내) 항목은 애초에 특정 장소가 아니므로 매칭 대상에서 제외합니다.
  const days = (itinerary.days || []).map((day) => ({
    ...day,
    items: (day.items || []).map((item) => {
      if (item.placeId || item.category === "이동") return item;
      const backfilled = findPlaceIdByName(item.placeName || item.title, collectedPlaces);
      return backfilled ? { ...item, placeId: backfilled } : item;
    }),
  }));

  let routeSummary = itinerary.routeSummary || null;
  if (routeSummary) {
    const { from, to } = routeSummary;
    const norm = (s) => (s || "").toLowerCase();
    const match =
      collectedRoutes.find(
        (r) => from && to && norm(r.origin).includes(norm(from)) && norm(r.destination).includes(norm(to))
      ) ||
      collectedRoutes.find((r) => to && norm(r.destination).includes(norm(to))) ||
      collectedRoutes[0] ||
      null;

    // 출처 표시: ODPT(공공교통 오픈데이터)를 실제로 사용했다면 반드시 그 출처
    // 문구를 보여줘야 하므로, AI가 옮겨적은 텍스트 대신 check_transit_operations가
    // 돌려준 원본 attribution을 최우선으로 사용합니다. ODPT를 안 썼으면 실제로 경로를
    // 계산한 Google Routes를 출처로 표시하고, 그마저도 없을 때만 AI가 적은 문구를 씁니다.
    const transitAttribution = collectedTransitInfo.find((t) => t.attribution)?.attribution;
    const source = transitAttribution || (match ? "Google Routes API (실시간 계산)" : routeSummary.source || null);

    routeSummary = {
      ...routeSummary,
      // 구간별 상세 이동 정보(legs)도 AI가 손으로 옮겨적으면 "TRANSIT" 같은 원본
      // enum 값이 그대로 남거나, 여러 구간을 한 줄로 뭉뚱그려 화면을 넘치게 만들 수
      // 있어서, compute_route가 실제로 계산해 둔 legs(이동수단 한글 라벨 + 역 이름
      // 형태로 이미 정리되어 있음)를 우선 사용합니다.
      legs: match?.legs?.length ? match.legs : routeSummary.legs || [],
      // 환승 횟수는 LLM이 손으로 적은 값("0~1회" 같은 부정확한 추정치) 대신,
      // compute_route Tool이 Google Routes API로 실제 계산한 값을 우선 사용합니다.
      transfers: match?.transferText || routeSummary.transfers || null,
      encodedPolyline: match?.encodedPolyline || null,
      source,
    };
  }

  const mapPoints = [];
  const seen = new Set();
  for (const day of days) {
    for (const item of day.items || []) {
      if (item.placeId && placesById[item.placeId] && !seen.has(item.placeId)) {
        seen.add(item.placeId);
        const p = placesById[item.placeId];
        if (p.location) {
          mapPoints.push({
            placeId: item.placeId,
            name: p.name || item.placeName || item.title,
            lat: p.location.lat,
            lng: p.location.lng,
          });
        }
      }
    }
  }

  return {
    summary: itinerary.summary || "",
    days,
    routeSummary,
    travelTips: itinerary.travelTips || [],
    placesById,
    mapPoints,
  };
}
