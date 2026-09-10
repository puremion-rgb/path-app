// Google Places API (New) 래퍼
// 문서: https://developers.google.com/maps/documentation/places/web-service/text-search
//       https://developers.google.com/maps/documentation/places/web-service/nearby-search

const BASE = "https://places.googleapis.com/v1";

function apiKey() {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) {
    const err = new Error(
      "GOOGLE_MAPS_SERVER_KEY가 설정되지 않았습니다. .env 파일에 Google Cloud API 키를 넣고 Places API (New)를 사용 설정하세요."
    );
    err.code = "MISSING_API_KEY";
    throw err;
  }
  return key;
}

const PLACE_FIELDS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.types",
  "places.primaryTypeDisplayName",
  "places.regularOpeningHours",
  "places.photos",
  "places.googleMapsUri",
  "places.priceLevel",
].join(",");

function mapPlace(p) {
  return {
    placeId: p.id,
    name: p.displayName?.text || "",
    address: p.formattedAddress || "",
    location: p.location ? { lat: p.location.latitude, lng: p.location.longitude } : null,
    rating: p.rating ?? null,
    userRatingCount: p.userRatingCount ?? null,
    types: p.types || [],
    category: p.primaryTypeDisplayName?.text || (p.types || [])[0] || "",
    openNow: p.regularOpeningHours?.openNow ?? null,
    photoName: p.photos?.[0]?.name || null,
    mapsUri: p.googleMapsUri || null,
    priceLevel: p.priceLevel || null,
  };
}

// 자연어 텍스트로 장소 검색 (관광지/맛집/역 등). Agent의 search_places Tool이 사용합니다.
export async function searchPlacesText({
  query,
  languageCode = "ko",
  regionCode = "JP",
  maxResultCount = 8,
  locationBias,
}) {
  const key = apiKey();
  const body = {
    textQuery: query,
    languageCode,
    regionCode,
    maxResultCount,
  };
  if (locationBias) {
    body.locationBias = {
      circle: {
        center: { latitude: locationBias.lat, longitude: locationBias.lng },
        radius: locationBias.radius || 8000,
      },
    };
  }

  const res = await fetch(`${BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": PLACE_FIELDS,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Google Places 검색 실패 (${res.status}): ${data?.error?.message || "알 수 없는 오류"}`
    );
  }
  return (data.places || []).map(mapPlace);
}

// 좌표 주변 장소 검색 (지도 화면의 "주변 맛집/관광지")
export async function searchPlacesNearby({
  lat,
  lng,
  radius = 1500,
  includedTypes,
  languageCode = "ko",
  maxResultCount = 12,
}) {
  const key = apiKey();
  const body = {
    languageCode,
    maxResultCount,
    locationRestriction: {
      circle: { center: { latitude: lat, longitude: lng }, radius },
    },
  };
  if (includedTypes?.length) body.includedTypes = includedTypes;

  const res = await fetch(`${BASE}/places:searchNearby`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": PLACE_FIELDS,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Google Places 주변검색 실패 (${res.status}): ${data?.error?.message || "알 수 없는 오류"}`
    );
  }
  return (data.places || []).map(mapPlace);
}

export async function getPlaceDetails(placeId, { languageCode = "ko" } = {}) {
  const key = apiKey();
  const res = await fetch(`${BASE}/places/${encodeURIComponent(placeId)}?languageCode=${languageCode}`, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": PLACE_FIELDS.replace(/places\./g, ""),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Google Places 상세조회 실패 (${res.status}): ${data?.error?.message || "알 수 없는 오류"}`
    );
  }
  return mapPlace(data);
}

// 장소 사진 바이너리를 서버에서 대신 받아옵니다 (API 키를 브라우저에 노출하지 않기 위함)
export async function fetchPlacePhoto(photoName, { maxWidthPx = 640 } = {}) {
  const key = apiKey();
  const res = await fetch(
    `${BASE}/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${key}`,
    { redirect: "follow" }
  );
  if (!res.ok) {
    throw new Error(`장소 사진을 가져오지 못했습니다 (${res.status})`);
  }
  return res;
}
