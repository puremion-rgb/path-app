import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// 로그인이 필요한 "개인적인" 화면만 여기서 막습니다 (찜, MY).
// 홈/AI 여행/지도는 로그인 없이도 둘러볼 수 있어야 하므로 보호 대상에서 제외했습니다.
// (해당 화면 안에서 실제로 개인 데이터가 필요한 동작—AI 일정 생성/저장, 찜 추가 등—을
//  시도하면 각 API 라우트(app/api/**)가 자체적으로 401을 반환하고, 화면은 이를
//  "로그인이 필요합니다" 메시지로 보여줍니다.)
const PROTECTED_PREFIXES = ["/favorites", "/my"];

async function isValidSession(token) {
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req) {
  // 테스트 전용: .env에 DISABLE_LOGIN_GATE="true"가 있으면 찜·MY 페이지 진입도 막지 않습니다
  // (대신 app/api/auth/me, app/api/favorites가 게스트 계정을 "로그인된 사용자"로 인정해줍니다).
  // 과제 제출/배포 전에는 반드시 .env에서 이 값을 지우거나 "false"로 바꾸세요.
  if (process.env.DISABLE_LOGIN_GATE === "true") return NextResponse.next();

  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("path_session")?.value;
  const valid = await isValidSession(token);
  if (valid) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/favorites/:path*", "/my/:path*"],
};
