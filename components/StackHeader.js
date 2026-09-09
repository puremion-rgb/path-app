"use client";

import { useRouter } from "next/navigation";
import { IconChevronLeft } from "./Icons";

export default function StackHeader({ title, backHref, onBack, right = null, className = "" }) {
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
    </header>
  );
}
