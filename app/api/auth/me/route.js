import { getGatedUser } from "@/lib/auth";
import { toPublicUser, updateUserProfile } from "@/lib/repo/users";
import { jsonOk, ApiError, withApiError } from "@/lib/apiUtils";

// 평소엔 실제 로그인만 인정합니다. .env에 DISABLE_LOGIN_GATE="true"가 있을 때만
// (테스트용) 게스트 계정도 "로그인된 사용자"로 인정해줍니다 — lib/auth.js의 getGatedUser 참고.
export const GET = withApiError(async () => {
  const user = await getGatedUser();
  if (!user) throw new ApiError("로그인이 필요합니다.", 401);
  return jsonOk({ user: toPublicUser(user) });
});

export const PATCH = withApiError(async (req) => {
  const user = await getGatedUser();
  if (!user) throw new ApiError("로그인이 필요합니다.", 401);
  const body = await req.json().catch(() => ({}));
  const updated = updateUserProfile(user.id, { name: body.name?.trim() || user.name });
  return jsonOk({ user: toPublicUser(updated) });
});
