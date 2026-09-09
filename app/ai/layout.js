"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// AI 여행 플로우도 PC에서는 path_zip처럼 좌측 사이드바를 함께 보여줍니다.
// /ai 와 /ai/chat 은 프로토타입처럼 좌우 2단(요청/미리보기, 대화/미리보기)
// 이므로 폭 제한 없이 전체 폭을 쓰고, 나머지 플로우 화면은 가운데 정렬합니다.
const WIDE_ROUTES = ["/ai", "/ai/chat"];

export default function AiLayout({ children }) {
  const pathname = usePathname();
  const wide = WIDE_ROUTES.includes(pathname);

  return (
    <div className="pz-shell flex min-h-dvh w-full bg-[var(--bg)] lg:bg-white">
      <Sidebar />
      <div
        className={
          "flex min-w-0 flex-1 flex-col" +
          (wide ? "" : " lg:mx-auto lg:max-w-2xl lg:border-x lg:border-line")
        }
      >
        {children}
      </div>
    </div>
  );
}
