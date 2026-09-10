"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import PlacePhoto from "@/components/PlacePhoto";
import Icon from "@/components/Icon";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import { listFavorites, removeFavorite } from "@/lib/apiClient";

const FILTERS = ["전체", "관광지", "맛집", "숙소"];

export default function FavoritesPage() {
  const [filter, setFilter] = useState("전체");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listFavorites()
      .then((data) => setItems(data.favorites || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const visible = items.filter((i) => filter === "전체" || i.category === filter);

  async function toggle(item) {
    setItems((prev) => prev.filter((i) => i.placeId !== item.placeId));
    try {
      await removeFavorite(item.placeId);
    } catch (e) {
      // 실패 시 목록 복원
      setItems((prev) => [item, ...prev]);
      setError(e.message);
    }
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
                  filter === f ? "border-navy bg-navy text-white" : "border-navy/40 bg-white text-navy"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {error && <p className="mb-4 text-[13px] text-red-500">{error}</p>}

          {loading ? (
            <p className="body-sm">불러오는 중...</p>
          ) : visible.length === 0 ? (
            <EmptyState
              icon="heart"
              title="아직 찜한 장소가 없어요"
              desc="마음에 드는 관광지나 맛집을 찜해보세요"
              action={
                <Link href="/map">
                  <Button variant="primary" style={{ width: "auto", paddingLeft: 30, paddingRight: 30, borderRadius: 999 }}>
                    장소 둘러보기 →
                  </Button>
                </Link>
              }
            />
          ) : (
            <>
              <div className="flex flex-col gap-4 pb-6 lg:hidden">
                {visible.map((item) => (
                  <div key={item.placeId} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
                    <Link href={`/ai/place/${item.placeId}`} className="shrink-0">
                      <PlacePhoto name={item.name} className="h-24 w-24 rounded-2xl" labelClassName="hidden" />
                    </Link>
                    <Link href={`/ai/place/${item.placeId}`} className="flex-1">
                      <p className="text-[16px] font-extrabold text-navy-deep">{item.name}</p>
                      <p className="mt-0.5 text-[13px] text-muted">
                        {[item.area, item.category].filter(Boolean).join(" · ")}
                      </p>
                    </Link>
                    <button onClick={() => toggle(item)} aria-label="찜 해제">
                      <Icon name="heart" size={26} filled className="text-red" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="hidden grid-cols-4 gap-5 pb-10 lg:grid">
                {visible.map((item) => (
                  <div key={item.placeId}>
                    <div className="relative">
                      <PlacePhoto name={item.name} className="aspect-[4/3] w-full rounded-2xl" labelClassName="hidden" />
                      {item.category && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-navy-deep">
                          {item.category}
                        </span>
                      )}
                      <button
                        onClick={() => toggle(item)}
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
