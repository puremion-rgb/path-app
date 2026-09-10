import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getUserById, createUser } from "@/lib/repo/users";
import { createId } from "@/lib/id.js";

const COOKIE_NAME = "path_session";
const SESSION_DAYS = 30;

// "게스트" 세션: 로그인 안 해도 AI 여행 일정을 만들고/보고, 장소를 검색할 수 있도록
// 브라우저별로 발급하는 내부용 임시 계정입니다. path_session(진짜 로그인)과는
// 완전히 다른 쿠키를 쓰기 때문에, 게스트 상태로는 절대 /favorites, /my 같은
// "진짜 로그인"이 필요한 화면·API에 들어갈 수 없습니다 (그 화면들은 getSessionUser()만 사용).
const GUEST_COOKIE_NAME = "path_guest";
const GUEST_SESSION_DAYS = 180;

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET 환경변수가 설정되지 않았습니다. .env 파일에 AUTH_SECRET을 추가하세요."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(userId) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

// Route Handler(app/api/**/route.js)에서 로그인한 사용자를 가져올 때 사용합니다.
export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload?.sub) return null;
  const user = getUserById(payload.sub);
  return user || null;
}

export function sessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;

// 이미 발급된 게스트 쿠키가 있으면 그 계정을, 없으면 새 게스트 계정을 만들어서
// 쿠키를 심고 반환합니다. 비밀번호로는 로그인할 수 없는 내부 전용 계정입니다.
// Route Handler(app/api/**/route.js) 안에서만 호출하세요 (쿠키를 써야 하므로).
export async function getOrCreateGuestUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_COOKIE_NAME)?.value;

  if (token) {
    const payload = await verifySessionToken(token);
    if (payload?.sub) {
      const existing = getUserById(payload.sub);
      if (existing) return existing;
    }
  }

  const guest = createUser({
    email: `guest_${createId()}@guest.path.local`,
    passwordHash: await hashPassword(createId()),
    name: "게스트",
  });
  const newToken = await createSessionToken(guest.id);
  cookieStore.set(GUEST_COOKIE_NAME, newToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GUEST_SESSION_DAYS * 24 * 60 * 60,
  });
  return guest;
}

// 로그인이 되어 있으면 실제 계정을, 아니면 게스트 계정을 돌려줍니다.
// AI 여행 일정 생성/조회, 대화형 수정, 장소 검색처럼 "로그인 없이도 되는" 기능에서
// getSessionUser() 대신 이 함수를 사용하세요. (찜 · MY처럼 실제 로그인이 꼭 필요한
// 화면/API는 계속 getSessionUser()를 그대로 사용해서 게스트를 걸러내야 합니다.)
export async function getEffectiveUser() {
  const real = await getSessionUser();
  if (real) return real;
  return getOrCreateGuestUser();
}

// getEffectiveUser()와 같은 역할이지만, 게스트 쿠키가 "아직 없을 때 새로 만들지는" 않습니다.
// (쿠키를 만들려면 cookies().set()이 필요한데, 이건 Route Handler에서만 허용되고
// 홈 화면 같은 서버 컴포넌트 렌더링 중에는 호출하면 에러가 납니다.)
// 이미 AI 여행 만들기 등에서 게스트 쿠키가 발급된 사용자라면 그 계정을 그대로 돌려주고,
// 게스트 쿠키가 전혀 없으면 null을 돌려줍니다 — 서버 컴포넌트(app/**/page.js)에서
// "로그인 여부와 상관없이 내 여행 정보를 읽기만" 할 때 사용하세요.
export async function getEffectiveUserReadOnly() {
  const real = await getSessionUser();
  if (real) return real;

  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload?.sub) return null;
  return getUserById(payload.sub) || null;
}

// ==== 테스트 전용 스위치 ====
// .env에 DISABLE_LOGIN_GATE="true" 를 넣으면 찜(favorites)·MY 화면/API도
// 로그인 없이(게스트 계정으로) 열어볼 수 있습니다. 개발 중 매번 로그인하기 번거로울 때만
// 잠깐 켜두는 용도이고, 과제 제출/배포 전에는 반드시 .env에서 이 줄을 지우거나
// "false"로 바꿔서 찜·MY가 다시 실제 로그인을 요구하도록 되돌리세요.
function isLoginGateDisabled() {
  return process.env.DISABLE_LOGIN_GATE === "true";
}

// 찜(favorites)·MY처럼 원래는 getSessionUser()만 써야 하는 화면/API에서 사용하세요.
// DISABLE_LOGIN_GATE가 꺼져 있으면 getSessionUser()와 완전히 동일하게(실제 로그인만 인정) 동작합니다.
export async function getGatedUser() {
  if (isLoginGateDisabled()) return getEffectiveUser();
  return getSessionUser();
}
