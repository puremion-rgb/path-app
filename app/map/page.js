"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import LogoHeader from "@/components/LogoHeader";
import PlacePhoto from "@/components/PlacePhoto";
import Icon from "@/components/Icon";

const FILTERS = ["전체", "관광지", "맛집", "숙소"];

const PINS = [
  { name: "스카이트리", tag: "관광지", top: "32%", left: "34%", color: "#2f6fb0" },
  { name: "센소지", tag: "관광지", top: "40%", left: "20%", color: "#f4a268" },
  { name: "신주쿠", tag: "관광지", top: "56%", left: "22%", color: "#24a36a" },
];

const PLACE_LIST = [
  { name: "센소지", tag: "관광지", walk: "도보 6분" },
  { name: "이치란 라멘", tag: "맛집", walk: "도보 3분" },
  { name: "시부야 스크램블", tag: "숙소", walk: "도보 5분" },
];

function Pins({ big }) {
  return PINS.map((p) => (
    <Link
      key={p.name}
      href="/map/route"
      className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
      style={{ top: p.top, left: p.left }}
    >
      <span
        className="shrink-0 rounded-full border-2 border-white shadow"
        style={{ backgroundColor: p.color, width: big ? 16 : 14, height: big ? 16 : 14 }}
      />
      <span className="whitespace-nowrap rounded-full bg-white/90 px-2.5 py-1 text-[13px] font-bold text-navy-deep shadow">
        {p.name}
      </span>
    </Link>
  ));
}

export default function MapPage() {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");

  const filteredList = useMemo(
    () =>
      PLACE_LIST.filter((p) => {
        const q = query.trim().toLowerCase();
        const okQ = q ? p.name.toLowerCase().includes(q) : true;
        const okF = filter === "전체" ? true : p.tag === filter;
        return okQ && okF;
      }),
    [query, filter]
  );

  return (
    <div className="pz-shell flex min-h-dvh w-full flex-col bg-transparent lg:min-h-0 lg:flex-row lg:bg-white">
      <Sidebar />

      {/* ---------- 모바일: 지도만 크게 (하단 메뉴 없음) ---------- */}
      <div className="relative w-full lg:hidden" style={{ height: "calc(100dvh - 92px)" }}>
        {/* 지도를 상단바 바로 아래부터 전체 영역에 꽉 채움 */}
        <div className="map-grid absolute inset-0">
          <Pins />
        </div>

        {/* 상단바(로고)만 배경이 있고, 검색창은 지도 위에 떠 있는 형태 */}
        <div className="absolute inset-x-0 top-0 z-10">
          <div className="bg-[var(--bg)]">
            <LogoHeader />
          </div>
          <div className="px-5 pb-4 pt-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-[0_6px_20px_rgba(30,39,97,0.08)]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="어디로 여행할까요?"
                className="w-full border-none bg-transparent text-[15px] text-navy-deep outline-none placeholder:text-muted focus:outline-none focus:ring-0"
                style={{ WebkitTapHighlightColor: "transparent", boxShadow: "none" }}
              />
              <Icon name="search" size={20} className="shrink-0 text-navy" />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- PC: 좌측 리스트 + 우측 지도 (프로토타입 "PC 지도") ---------- */}
      <div className="hidden min-w-0 flex-1 flex-col lg:flex">
        <header className="flex shrink-0 items-center border-b border-line px-10 py-6">
          <h1 className="text-[20px] font-bold text-navy-deep">지도</h1>
        </header>
        <div className="flex flex-1 bg-[#eef2fb]">
          <div className="flex w-[420px] shrink-0 flex-col gap-5 px-10 py-8">
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3.5 text-muted">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색"
                className="w-full bg-transparent text-[15px] text-navy-deep outline-none placeholder:text-muted"
              />
              <Icon name="search" size={18} />
            </div>
            <div className="flex gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-4 py-2 text-[13px] font-bold transition ${
                    filter === f
                      ? "border-navy bg-navy text-white"
                      : "border-navy/40 bg-white text-navy"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {filteredList.length === 0 ? (
                <p className="py-10 text-center text-[13px] text-muted">
                  &ldquo;{query}&rdquo; 검색 결과가 없어요.
                </p>
              ) : (
                filteredList.map((p) => (
                  <Link
                    key={p.name}
                    href="/map/route"
                    className="flex gap-4 rounded-2xl border border-line bg-white p-3"
                  >
                    <PlacePhoto
                      name={p.name}
                      className="h-16 w-16 shrink-0 rounded-xl"
                      labelClassName="hidden"
                    />
                    <div>
                      <span className="inline-block rounded-full bg-[#eef2fb] px-2.5 py-0.5 text-[11px] font-bold text-muted">
                        {p.tag}
                      </span>
                      <p className="mt-1 text-[16px] font-extrabold text-navy-deep">{p.name}</p>
                      <p className="mt-0.5 text-[13px] text-muted">{p.walk}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <Link
              href="/map/route"
              className="mt-auto flex items-center justify-center rounded-2xl bg-navy px-5 py-3.5 text-[15px] font-bold text-white"
            >
              이동 경로 보기
            </Link>
          </div>
          <div className="map-grid relative flex-1">
            <Pins big />
          </div>
        </div>
      </div>

      {/* 모바일 하단 탭 */}
      <div className="lg:hidden fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2">
        <BottomNav />
      </div>
    </div>
  );
}
