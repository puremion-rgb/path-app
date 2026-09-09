"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

// 프로토타입(12_주변_맛집_추천) 기준 화면.
// 현재 일정의 이동 경로를 고려해 "센소지 주변" 맛집을 추천하는 맥락형 화면입니다.
// 하단 탭 없이 "일정에 추가" CTA 로 끝나는 스택형 화면입니다.
const FILTERS = ["맛집", "카페", "관광지"];

const PLACES = [
  { id: "sushidai", name: "스시 다이", cat: "스시", area: "츠키지", rating: 4.6, count: "2,345" },
  { id: "ramen", name: "이마카리 라멘", cat: "라멘", area: "아사쿠사", rating: 4.5, count: "1,234" },
  { id: "udon", name: "우동 명가", cat: "우동", area: "아사쿠사", rating: 4.5, count: "698" },
];

export default function NearbyPage() {
  const [filter, setFilter] = useState("맛집");
  const [liked, setLiked] = useState(() => new Set());

  function toggleLike(id) {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="pz-shell flex min-h-dvh w-full bg-[var(--bg)] lg:bg-white">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:mx-auto lg:max-w-2xl lg:border-x lg:border-line">
        <header className="hidden shrink-0 items-center gap-2 border-b border-line px-10 py-6 lg:flex">
          <span className="text-[15px] font-medium text-muted">지도</span>
          <h1 className="text-[20px] font-bold text-navy-deep">주변 맛집 추천</h1>
        </header>
        <Header title="주변 맛집 추천" className="lg:hidden" />

        <div className="screen-scroll no-tab">
          <div className="container">
            <div className="h1" style={{ fontSize: 20 }}>
              센소지 주변에서 추천해요
            </div>
            <div className="body-sm" style={{ marginTop: 6 }}>
              현재 일정의 이동 경로를 고려했어요.
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 700,
                    border: "1.5px solid",
                    borderColor: filter === f ? "var(--navy)" : "var(--border-strong)",
                    background: filter === f ? "var(--navy)" : "var(--white)",
                    color: filter === f ? "var(--white)" : "var(--navy)",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
              {PLACES.map((p) => (
                <div
                  key={p.id}
                  style={{
                    position: "relative",
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                    background: "var(--white)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    padding: 14,
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <Link
                    href={`/ai/place/${p.id}`}
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: 12,
                      flexShrink: 0,
                      background: "var(--bg-flat)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-faint)",
                    }}
                  >
                    FOOD
                  </Link>
                  <Link href={`/ai/place/${p.id}`} style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15.5 }}>{p.name}</div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--orange)",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      ★ {p.rating.toFixed(1)}{" "}
                      <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>({p.count})</span>
                    </div>
                    <div className="body-sm" style={{ marginTop: 2 }}>
                      {p.cat} · {p.area}
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleLike(p.id)}
                    aria-label="찜"
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      color: liked.has(p.id) ? "var(--red)" : "var(--text-faint)",
                    }}
                  >
                    <Icon name="heart" size={20} filled={liked.has(p.id)} />
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                background: "var(--bg-flat)",
                borderRadius: 16,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 13.5, color: "var(--navy)" }}>AI 추천 이유</div>
              <div className="body-sm" style={{ marginTop: 6, lineHeight: 1.6 }}>
                센소지에서 이동이 편하고,
                <br />
                현재 일정의 점심 시간과 잘 맞아요.
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "var(--bg)",
            borderTop: "1px solid var(--border)",
            padding: "12px 20px calc(12px + env(safe-area-inset-bottom))",
          }}
        >
          <Button variant="primary">일정에 추가</Button>
        </div>
      </div>
    </div>
  );
}
