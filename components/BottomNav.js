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
    <nav className="px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5 lg:hidden">
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
  );
}
