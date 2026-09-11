"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHomeFilled,
  IconMap,
  IconSparkleDual,
  IconHeart,
  IconUser,
} from "./Icons";

// 5개 탭 모두 같은 규칙을 씁니다: 지금 보고 있는 화면(active)일 때만 아이콘/라벨이
// 네이비로 바뀌고 뒤에 알약형 하이라이트가 깔립니다. (예전에는 "홈"과 "AI 여행"만
// 활성 여부와 무관하게 항상 같은 스타일을 쓰도록 따로 처리해서, 홈 라벨이 선택
// 여부와 상관없이 항상 굵게 나오고 AI 여행은 하이라이트가 아예 안 생기는 등
// 다른 탭과 스타일이 어긋나 있었습니다.)
const TABS = [
  { href: "/home", label: "홈", icon: IconHomeFilled },
  { href: "/map", label: "지도", icon: IconMap },
  { href: "/ai", label: "AI 여행", icon: IconSparkleDual },
  { href: "/favorites", label: "찜", icon: IconHeart },
  { href: "/my", label: "MY", icon: IconUser },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* 하단바가 둥근 알약 모양이라 모서리 바깥/틈으로 스크롤되는 목록 내용이
          그대로 다 보여서 부자연스러웠던 부분을, 하단바 위쪽 내용이 위로
          갈수록 배경색으로 옅어지는 그라데이션으로 자연스럽게 가려줍니다.
          (이 컴포넌트를 담는 바깥 wrapper가 항상 position:fixed라서, 여기서
          absolute + 하단바보다 큰 높이로 잡아주면 하단바 자체 높이를 넘어
          위쪽까지 자연스럽게 페이드가 이어집니다.) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 lg:hidden"
        style={{ background: "linear-gradient(to top, var(--bg) 0%, var(--bg) 30%, transparent 100%)" }}
      />
      <nav className="relative px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 lg:hidden">
        <ul
        className="flex items-stretch justify-between rounded-[28px] border border-[#e7ecf4] bg-white py-2"
        style={{ boxShadow: "0 6px 16px 0 rgba(38,58,90,0.16)" }}
      >
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          const iconColor = active ? "text-[#264d91]" : "text-[#425979]";
          const labelClass = active
            ? "font-bold text-[#244b90]"
            : "font-medium text-[#425979]";

          return (
            <li key={href} className="flex-1">
              <Link href={href} className="flex flex-col items-center gap-1.5 py-0.5">
                <span
                  className={`flex h-[45px] w-12 items-center justify-center rounded-2xl ${
                    active ? "bg-gradient-to-br from-[#edf4ff] to-[#f7f9fd]" : ""
                  }`}
                >
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </span>
                <span className={`text-[11px] leading-none ${labelClass}`}>{label}</span>
              </Link>
            </li>
          );
        })}
        </ul>
      </nav>
    </>
  );
}
