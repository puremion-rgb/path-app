"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

// 실제 로그인 세션(/api/auth/me, httpOnly 쿠키)을 확인하는 라우트 가드입니다.
export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/home")}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) return null;
  return children;
}
