"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IconHomeFilled, IconMap, IconSparkleDual, IconHeart, IconUser } from "./Icons";

const TABS = [
  { href: "/home", label: "홈", icon: IconHomeFilled, fixed: true },
  { href: "/map", label: "지도", icon: IconMap },
  { href: "/ai", label: "AI 여행", icon: IconSparkleDual, fixed: true },
  { href: "/favorites", label: "찜", icon: IconHeart },
  { href: "/my", label: "MY", icon: IconUser },
];

// MY 탭 아래에서만 펼쳐지는 서브메뉴 — PC 프로토타입과 동일.
const MY_SUBMENU = [
  { href: "/my/trips", label: "내 여행 일정" },
  { href: "/my/profile", label: "프로필 수정" },
  { href: "/my/settings", label: "설정" },
  { href: "/my/support", label: "고객센터" },
  { href: "/onboarding", label: "앱 소개" },
  { href: "/login", label: "로그아웃" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const inMy = pathname.startsWith("/my");
  // MY 서브메뉴 중 하나가 활성 상태면, 표시줄은 MY 행이 아니라
  // 그 서브메뉴 행을 따라가야 한다.
  const activeSubHref = inMy
    ? MY_SUBMENU.find((sub) => pathname === sub.href || pathname.startsWith(sub.href + "/"))?.href
    : undefined;

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-line bg-white px-6 py-8">
      <Link href="/home" className="mb-10 block w-28">
        <Image src="/logo/logo-text.svg" alt="PATH" width={270} height={63} className="w-full h-auto" />
      </Link>
      <ul className="flex flex-col gap-1">
        {TABS.map(({ href, label, icon: Icon, fixed }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          // MY 서브메뉴가 활성화된 상태라면 MY 행 자체에는 표시줄을 그리지 않는다.
          const showIndicator = active && !(href === "/my" && activeSubHref);
          return (
            <li key={href} className="relative">
              {showIndicator && (
                <span className="absolute -left-6 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-navy" />
              )}
              <Link
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition ${
                  fixed ? "text-navy" : active ? "text-navy" : "text-muted hover:text-navy"
                }`}
              >
                <Icon className="h-6 w-6" />
                {label}
              </Link>

              {href === "/my" && inMy && (
                <ul className="mt-1 flex flex-col gap-0.5 pl-11">
                  {MY_SUBMENU.map((sub) => {
                    const subActive = sub.href === activeSubHref;
                    return (
                      <li key={sub.href} className="relative">
                        {subActive && (
                          <span className="absolute -left-[68px] top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-navy" />
                        )}
                        <Link
                          href={sub.href}
                          className={`block rounded-lg px-2 py-1.5 text-[14px] transition ${
                            subActive ? "font-bold text-navy-deep" : "text-muted hover:text-navy-deep"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
