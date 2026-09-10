import { verifyPassword, createSessionToken, sessionCookieOptions } from "@/lib/auth";
import { getUserByEmail, toPublicUser } from "@/lib/repo/users";
import { jsonOk, ApiError, withApiError } from "@/lib/apiUtils";

export const POST = withApiError(async (req) => {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  const user = getUserByEmail(email);
  if (!user) {
    throw new ApiError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new ApiError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);
  }

  const token = await createSessionToken(user.id);
  const res = jsonOk({ user: toPublicUser(user) });
  const opts = sessionCookieOptions();
  res.cookies.set(opts.name, token, opts);
  return res;
});
