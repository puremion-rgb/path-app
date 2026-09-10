"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { getTrip } from "@/lib/apiClient";
import { getCurrentTripId } from "@/lib/tripStore";

// 추천 여행 일정에서 "일정 추가"를 누르면 나오는 완료 화면.
// 일정은 AI가 만드는 시점에 이미 DB(Trip)에 저장되어 있으므로, 여기서는
// 방금 만든 일정 요약을 실제 데이터로 보여주기만 합니다.
export default function AiAddedPage() {
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const id = getCurrentTripId();
    if (!id) return;
    getTrip(id).then((data) => setTrip(data.trip)).catch(() => {});
  }, []);

  const days = trip?.itinerary?.days || [];

  // "관광 4곳 · 맛집 2곳 · 환승 1회"처럼 종류별로 몇 곳인지 보여줍니다.
  // AI가 각 항목에 붙인 category(관광/맛집/카페/쇼핑/숙소/이동)를 기준으로 세고,
  // "이동"(단순 이동/환승 안내)은 방문지가 아니므로 개수에서 제외합니다.
  const CATEGORY_ORDER = ["관광", "맛집", "카페", "쇼핑", "숙소"];
  const categoryCounts = {};
  let totalVisitCount = 0;
  for (const d of days) {
    for (const item of d.items || []) {
      if (item.category === "이동") continue;
      totalVisitCount += 1;
      if (item.category) categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  }
  const categorySummary = CATEGORY_ORDER
    .filter((c) => categoryCounts[c] > 0)
    .map((c) => `${c} ${categoryCounts[c]}곳`);
  // 옛날에 만든 일정처럼 category 정보가 아예 없으면 전체 방문지 수로 대체합니다.
  const visitSummary =
    categorySummary.length > 0 ? categorySummary.join(" · ") : `방문지 ${totalVisitCount}곳`;
  const transfers = trip?.itinerary?.routeSummary?.transfers;

  return (
    <main
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "72px 20px 40px",
        textAlign: "center",
      }}
    >
      <span
        style={{
          display: "flex",
          height: 96,
          width: 96,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "var(--green)",
          color: "#fff",
        }}
      >
        <Icon name="check" size={44} strokeWidth={3} />
      </span>

      <h1 style={{ marginTop: 32, fontSize: 22, fontWeight: 800, color: "var(--navy)" }}>
        여행 일정이 준비되었어요!
      </h1>
      <p className="body-sm" style={{ marginTop: 8 }}>
        AI가 장소와 경로를 연결해 최적의 일정을 만들었어요.
      </p>

      <div
        style={{
          marginTop: 40,
          width: "100%",
          borderRadius: 16,
          border: "1px solid var(--border)",
          background: "var(--white)",
          padding: 24,
          textAlign: "left",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <p style={{ fontSize: 18, fontWeight: 800 }}>{trip?.title || "새 여행 일정"}</p>
        <p className="body-sm" style={{ marginTop: 8 }}>
          {days.map((d) => d.date).filter(Boolean).join(" · ") || "일정을 불러오는 중..."}
        </p>
        <p style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: "var(--navy-dark)" }}>
          {visitSummary}{transfers ? ` · ${transfers}` : ""}
        </p>
      </div>

      <div style={{ marginTop: 56, display: "flex", width: "100%", flexDirection: "column", gap: 12 }}>
        <Link href="/my/trips">
          <Button variant="primary">일정 확인하기</Button>
        </Link>
        <Link href="/map">
          <Button variant="secondary">지도에서 보기</Button>
        </Link>
      </div>
    </main>
  );
}
