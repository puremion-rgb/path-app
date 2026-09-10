import { getEffectiveUser } from "@/lib/auth";
import { getPlaceDetails } from "@/lib/google/places";
import { jsonOk, withApiError } from "@/lib/apiUtils";

// 로그인 없이도(게스트 계정으로) 장소 상세 정보를 볼 수 있습니다.
export const GET = withApiError(async (_req, { params }) => {
  await getEffectiveUser();
  const { placeId } = await params;
  const place = await getPlaceDetails(placeId);
  return jsonOk({ place });
});
