"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// AI 여행 플로우도 PC에서는 path_zip처럼 좌측 사이드바를 함께 보여줍니다.
// /ai(요청 만들기)는 프로토타입처럼 좌우 2단(요청 폼/미리보기)이 실제로
// 구현돼 있어 폭 제한 없이 전체 폭을 씁니다. /ai/chat도 원래는 같은 2단
// (대화/미리보기)으로 계획됐지만 실제로는 모바일과 동일한 1단 대화 화면만
// 있어서, 전체 폭을 그대로 쓰면 입력창·버튼이 화면 끝까지 늘어나 어색해
// 보였습니다. 다른 AI 플로우 화면들과 똑같이 가운데 정렬 폭으로 맞춥니다.
const WIDE_ROUTES = ["/ai"];

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
