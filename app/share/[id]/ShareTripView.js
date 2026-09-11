"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Timeline from "@/components/Timeline";
import styles from "./page.module.css";

// 방문지 항목을 눌렀을 때 /ai/place/[id]로 이동하는 기능은 로그인/세션이
// 있는 화면 전용입니다. 이 공유 화면은 로그인 없이 누구나 볼 수 있어야 하므로,
// placeId를 지워서 Timeline이 항상 링크가 아닌 일반 텍스트 줄로 그려지게 합니다.
function toReadOnlyItems(items) {
  return (items || []).map((item) => ({ ...item, placeId: undefined }));
}

export default function ShareTripView({ trip }) {
  const [dayIdx, setDayIdx] = useState(0);
  const days = trip.itinerary?.days || [];
  const day = days[dayIdx] || days[0];

  return (
    <div className="screen-scroll no-tab">
      <Header title={trip.title || "여행 일정"} backHref="/" />
      <div className="container">
        <div className={styles.shareBadge}>PATH가 만든 여행 일정이에요 · 읽기 전용</div>

        {trip.itinerary?.summary && (
          <div className="body-sm" style={{ marginTop: 14, marginBottom: 14 }}>{trip.itinerary.summary}</div>
        )}

        {days.length > 0 && (
          <div className={styles.dayTabs}>
            {days.map((d, i) => (
              <button
                key={d.label + i}
                className={`${styles.dayTab} ${i === dayIdx ? styles.dayTabActive : ""}`}
                onClick={() => setDayIdx(i)}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}

        {day ? (
          <>
            <div className={styles.dateRow}>{day.date}</div>
            {day.condition && (
              <div className="body-sm" style={{ marginTop: 4, marginBottom: 28 }}>
                {day.condition}
              </div>
            )}
            <Timeline items={toReadOnlyItems(day.items)} />
          </>
        ) : (
          <div className="body-sm" style={{ padding: "40px 0", textAlign: "center" }}>
            아직 생성된 일정이 없어요.
          </div>
        )}

        {(() => {
          const tips = day?.travelTips?.length ? day.travelTips : trip.itinerary?.travelTips || [];
          if (tips.length === 0) return null;
          return (
            <div style={{ marginTop: 20 }}>
              <div className={styles.dateRow} style={{ fontSize: 16 }}>
                여행 팁
              </div>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
                {tips.map((tip, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", gap: 8, fontSize: 13.5, lineHeight: 1.7, color: "var(--text-muted)" }}
                  >
                    <span aria-hidden="true" style={{ flexShrink: 0 }}>·</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      <div className={styles.footer}>
        <Link href="/" style={{ flex: 1 }}>
          <Button variant="primary">PATH로 나만의 일정 만들어보기</Button>
        </Link>
      </div>
    </div>
  );
}
