"use client";

import { useState } from "react";
import Link from "next/link";
import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import PlacePhoto from "@/components/PlacePhoto";
import Icon from "@/components/Icon";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

const FILTERS = ["전체", "관광지", "맛집", "숙소"];

// 프로토타입("찜" / "PC 찜") 기준 목록 — 자막은 "지역 · 카테고리" 형식입니다.
const ITEMS = [
  { id: "senso", name: "센소지", area: "아사쿠사 · 관광지" },
  { id: "ichiran", name: "이치란 라멘", area: "신주쿠 · 맛집" },
  { id: "ueno", name: "우에노 공원", area: "우에노 · 관광지" },
  { id: "shibuya", name: "시부야 스크램블", area: "시부야 · 관광지" },
  { id: "shinjukuGyoen", name: "신주쿠 교엔", area: "신주쿠 · 관광지" },
  { id: "izakaya", name: "이자카야 하나", area: "신주쿠 · 맛집" },
  { id: "skytree", name: "스카이트리", area: "스미다 · 관광지" },
  { id: "guesthouse", name: "아사쿠사 게스트하우스", area: "아사쿠사 · 숙소" },
];

function categoryOf(item) {
  return item.area.split(" · ")[1];
}

export default function FavoritesPage() {
  const [filter, setFilter] = useState("전체");
  const [liked, setLiked] = useState(() =>
    Object.fromEntries(ITEMS.map((i) => [i.id, true]))
  );

  const visible = ITEMS.filter(
    (i) => liked[i.id] && (filter === "전체" || categoryOf(i) === filter)
  );

  function toggle(id) {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <TabShell title="찜">
      <Header title="찜" backHref="/home" className="lg:hidden" />
      <div className="screen-scroll">
        <div className="px-5 pt-4 lg:px-0 lg:pt-0">
          <div className="mb-6 flex gap-2 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition ${
                  filter === f
                    ? "border-navy bg-navy text-white"
                    : "border-navy/40 bg-white text-navy"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon="heart"
              title="아직 찜한 장소가 없어요"
              desc="마음에 드는 관광지나 맛집을 찜해보세요"
              action={
                <Link href="/map">
                  <Button
                    variant="primary"
                    style={{ width: "auto", paddingLeft: 30, paddingRight: 30, borderRadius: 999 }}
                  >
                    장소 둘러보기 →
                  </Button>
                </Link>
              }
            />
          ) : (
            <>
              {/* 모바일: 세로 리스트 */}
              <div className="flex flex-col gap-4 pb-6 lg:hidden">
                {visible.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4"
                  >
                    <Link href={`/ai/place/${item.id}`} className="shrink-0">
                      <PlacePhoto
                        name={item.name}
                        className="h-24 w-24 rounded-2xl"
                        labelClassName="hidden"
                      />
                    </Link>
                    <Link href={`/ai/place/${item.id}`} className="flex-1">
                      <p className="text-[16px] font-extrabold text-navy-deep">{item.name}</p>
                      <p className="mt-0.5 text-[13px] text-muted">{item.area}</p>
                    </Link>
                    <button onClick={() => toggle(item.id)} aria-label="찜 해제">
                      <Icon name="heart" size={26} filled className="text-red" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 데스크톱: 포토 카드 4열 그리드 */}
              <div className="hidden grid-cols-4 gap-5 pb-10 lg:grid">
                {visible.map((item) => (
                  <div key={item.id}>
                    <div className="relative">
                      <PlacePhoto
                        name={item.name}
                        className="aspect-[4/3] w-full rounded-2xl"
                        labelClassName="hidden"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-navy-deep">
                        {categoryOf(item)}
                      </span>
                      <button
                        onClick={() => toggle(item.id)}
                        aria-label="찜 해제"
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-accent-orange"
                      >
                        <Icon name="heart" size={16} filled />
                      </button>
                    </div>
                    <p className="mt-3 text-[15px] font-extrabold text-navy-deep">{item.name}</p>
                    <p className="mt-0.5 text-[13px] text-muted">{item.area}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </TabShell>
  );
}
