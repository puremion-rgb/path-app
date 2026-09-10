import { getEffectiveUser } from "@/lib/auth";
import { searchPlacesText, searchPlacesNearby } from "@/lib/google/places";
import { jsonOk, ApiError, withApiError } from "@/lib/apiUtils";

// GET /api/places/search?q=신주쿠+맛집
// GET /api/places/search?lat=35.69&lng=139.70&radius=1500&type=tourist_attraction
// 로그인 없이도(게스트 계정으로) 검색할 수 있습니다.
export const GET = withApiError(async (req) => {
  await getEffectiveUser();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  let places;
  if (q) {
    places = await searchPlacesText({
      query: q,
      locationBias: lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined,
    });
  } else if (lat && lng) {
    const type = searchParams.get("type");
    places = await searchPlacesNearby({
      lat: Number(lat),
      lng: Number(lng),
      radius: Number(searchParams.get("radius") || 1500),
      includedTypes: type ? [type] : undefined,
    });
  } else {
    throw new ApiError("검색어(q) 또는 좌표(lat,lng)가 필요합니다.", 400);
  }

  return jsonOk({ places });
});
