// Google Routes API (v2 computeRoutes) 래퍼
// 문서: https://developers.google.com/maps/documentation/routes/compute_route_directions
//       https://developers.google.com/maps/documentation/routes/transit-route

const ENDPOINT = "https://routes.googleapis.com/directions/v2:computeRoutes";

function apiKey() {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) {
    const err = new Error(
      "GOOGLE_MAPS_SERVER_KEY가 설정되지 않았습니다. .env 파일에 Google Cloud API 키를 넣고 Routes API를 사용 설정하세요."
    );
    err.code = "MISSING_API_KEY";
    throw err;
  }
  return key;
}

function toWaypoint(place) {
  if (!place) return null;
  if (typeof place === "string") return { address: place };
  if (place.lat != null && place.lng != null) {
    return { location: { latLng: { latitude: place.lat, longitude: place.lng } } };
  }
  if (place.placeId) return { placeId: place.placeId };
  if (place.address) return { address: place.address };
  return null;
}

function formatDuration(durationStr) {
  // "1234s" 형태 -> "약 20분"
  const seconds = parseInt(String(durationStr).replace("s", ""), 10) || 0;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `약 ${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `약 ${h}시간 ${m}분` : `약 ${h}시간`;
}

const VEHICLE_LABEL = {
  BUS: "버스",
  RAIL: "기차",
  SUBWAY: "지하철",
  TRAM: "트램",
  HEAVY_RAIL: "전철",
  COMMUTER_TRAIN: "통근열차",
  HIGH_SPEED_TRAIN: "고속열차",
  METRO_RAIL: "지하철",
  FERRY: "페리",
  CABLE_CAR: "케이블카",
  MONORAIL: "모노레일",
};

function summarizeSteps(steps = []) {
  const legs = [];
  let transferCount = 0;
  for (const step of steps) {
    if (step.travelMode === "WALK") {
      const meters = step.distanceMeters || 0;
      legs.push({
        mode: "도보",
        detail: meters > 0 ? `도보 이동 (${meters}m)` : "도보 이동",
      });
    } else if (step.travelMode === "TRANSIT" && step.transitDetails) {
      const td = step.transitDetails;
      const vehicleType = td.transitLine?.vehicle?.type;
      const label = VEHICLE_LABEL[vehicleType] || td.transitLine?.vehicle?.name?.text || "대중교통";
      const lineName = td.transitLine?.name || td.transitLine?.shortName || "";
      legs.push({
        mode: `${label}${lineName ? ` · ${lineName}` : ""}`,
        detail: `${td.stopDetails?.departureStop?.name || "출발역"} → ${
          td.stopDetails?.arrivalStop?.name || "도착역"
        }`,
        headsign: td.headsign || null,
      });
      transferCount += 1;
    }
  }
  // 첫 탑승은 "환승"이 아니라 "첫 이동"이므로 -1 (0 이하 방지)
  const transfers = Math.max(0, transferCount - 1);
  return { legs, transfers };
}

export async function computeRoute({
  origin,
  destination,
  travelMode = "TRANSIT",
  departureTime,
  languageCode = "ko",
}) {
  const key = apiKey();
  const body = {
    origin: toWaypoint(origin),
    destination: toWaypoint(destination),
    travelMode,
    languageCode,
    units: "METRIC",
  };
  if (!body.origin || !body.destination) {
    throw new Error("경로 조회를 위한 출발지/도착지 정보가 부족합니다.");
  }

  if (travelMode === "TRANSIT") {
    body.transitPreferences = { routingPreference: "LESS_WALKING" };
    if (departureTime) body.departureTime = departureTime;
  } else if (travelMode === "DRIVE") {
    body.routingPreference = "TRAFFIC_AWARE";
  }

  const fieldMask = [
    "routes.duration",
    "routes.distanceMeters",
    "routes.polyline.encodedPolyline",
    "routes.legs.steps.travelMode",
    "routes.legs.steps.distanceMeters",
    "routes.legs.steps.staticDuration",
    "routes.legs.steps.transitDetails",
    "routes.legs.steps.navigationInstruction",
  ].join(",");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": fieldMask,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Google Routes 조회 실패 (${res.status}): ${data?.error?.message || "알 수 없는 오류"}`
    );
  }
  const route = data.routes?.[0];
  if (!route) {
    throw new Error("이동 경로를 찾을 수 없습니다. 출발지/도착지를 다시 확인해주세요.");
  }

  const allSteps = (route.legs || []).flatMap((l) => l.steps || []);
  const { legs, transfers } = summarizeSteps(allSteps);

  return {
    durationText: formatDuration(route.duration),
    durationSeconds: parseInt(String(route.duration).replace("s", ""), 10) || 0,
    distanceMeters: route.distanceMeters || 0,
    transfers,
    transferText: transfers > 0 ? `환승 ${transfers}회` : "환승 없음",
    legs,
    encodedPolyline: route.polyline?.encodedPolyline || null,
  };
}
