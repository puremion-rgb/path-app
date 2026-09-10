import { hashPassword, createSessionToken, sessionCookieOptions } from "@/lib/auth";
import { createUser, getUserByEmail, toPublicUser } from "@/lib/repo/users";
import { jsonOk, jsonError, ApiError, withApiError } from "@/lib/apiUtils";

export const POST = withApiError(async (req) => {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = body.name ? String(body.name).trim() : null;

  if (!email || !email.includes("@")) {
    throw new ApiError("올바른 이메일 주소를 입력해주세요.", 400);
  }
  if (password.length < 6) {
    throw new ApiError("비밀번호는 6자 이상이어야 합니다.", 400);
  }
  if (getUserByEmail(email)) {
    throw new ApiError("이미 가입된 이메일입니다.", 409);
  }

  const passwordHash = await hashPassword(password);
  const user = createUser({ email, passwordHash, name });
  const token = await createSessionToken(user.id);

  const res = jsonOk({ user: toPublicUser(user) }, { status: 201 });
  const opts = sessionCookieOptions();
  res.cookies.set(opts.name, token, opts);
  return res;
});
