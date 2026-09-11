"use client";

import { useRouter } from "next/navigation";
import { IconChevronLeft, IconHome } from "./Icons";

// showHome: AI 대화/질문 화면처럼 하단 탭바가 아예 없는 화면에서, 뒤로가기를
// 여러 번 누르지 않고도 바로 홈으로 이동할 수 있게 헤더 오른쪽에 홈 버튼을
// 하나 더 보여줍니다. right가 함께 넘어오면 right를 우선합니다.
export default function StackHeader({ title, backHref, onBack, right = null, showHome = false, className = "" }) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) return onBack();
    // 히스토리가 있으면 "직전에 보던 화면"으로 돌아갑니다.
    // (홈에서 들어온 경우 홈으로, 다른 화면에서 들어온 경우 그 화면으로)
    if (typeof window !== "undefined" && window.history.length > 1) return router.back();
    if (backHref) return router.push(backHref);
    router.push("/home");
  };

  return (
    <header className={`flex items-center gap-3 px-4 pt-6 pb-3 ${className}`}>
      <button
        onClick={handleBack}
        aria-label="뒤로가기"
        className="flex h-9 w-9 items-center justify-center rounded-full text-navy active:bg-navy/5"
      >
        <IconChevronLeft className="h-6 w-6" />
      </button>
      <h1 className="flex-1 text-[19px] font-bold text-navy-deep">{title}</h1>
      {right}
      {!right && showHome && (
        // 뒤로가기 버튼(h-9 w-9, 아이콘 h-6 w-6)과 같은 크기로 맞춰서, 나란히
        // 봤을 때 홈 버튼만 유독 작아 보이지 않도록 했습니다.
        <button
          onClick={() => router.push("/home")}
          aria-label="홈으로"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-flat)] text-navy active:bg-navy/10"
        >
          <IconHome className="h-6 w-6" />
        </button>
      )}
    </header>
  );
}
