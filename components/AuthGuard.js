"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// 프로토타입용 간이 로그인 게이트.
// 실제 백엔드가 없으므로 localStorage("path_auth") 플래그로만 판단합니다.
// 로그인 화면(app/login/page.js)에서 로그인/가입 시 이 값을 "1"로 설정합니다.
export function isLoggedIn() {
  try {
    return typeof window !== "undefined" && localStorage.getItem("path_auth") === "1";
  } catch {
    return false;
  }
}

export function setLoggedIn(v) {
  try {
    if (v) localStorage.setItem("path_auth", "1");
    else localStorage.removeItem("path_auth");
  } catch {}
}

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      setReady(true);
    } else {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/home")}`);
    }
  }, [router, pathname]);

  if (!ready) return null;
  return children;
}
