import { getGatedUser } from "@/lib/auth";
import { listFavorites, addFavorite, removeFavorite } from "@/lib/repo/favorites";
import { jsonOk, ApiError, withApiError } from "@/lib/apiUtils";

// 평소엔 실제 로그인만 인정합니다. .env에 DISABLE_LOGIN_GATE="true"가 있을 때만
// (테스트용) 게스트 계정도 "로그인된 사용자"로 인정해줍니다 — lib/auth.js의 getGatedUser 참고.
export const GET = withApiError(async () => {
  const user = await getGatedUser();
  if (!user) throw new ApiError("로그인이 필요합니다.", 401);
  return jsonOk({ favorites: listFavorites(user.id) });
});

export const POST = withApiError(async (req) => {
  const user = await getGatedUser();
  if (!user) throw new ApiError("로그인이 필요합니다.", 401);
  const body = await req.json().catch(() => ({}));
  if (!body.placeId || !body.name) throw new ApiError("placeId와 name이 필요합니다.", 400);
  const fav = addFavorite({
    userId: user.id,
    placeId: body.placeId,
    name: body.name,
    category: body.category,
    area: body.area,
    lat: body.lat,
    lng: body.lng,
  });
  return jsonOk({ favorite: fav }, { status: 201 });
});

export const DELETE = withApiError(async (req) => {
  const user = await getGatedUser();
  if (!user) throw new ApiError("로그인이 필요합니다.", 401);
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("placeId");
  if (!placeId) throw new ApiError("placeId가 필요합니다.", 400);
  removeFavorite({ userId: user.id, placeId });
  return jsonOk({});
});
