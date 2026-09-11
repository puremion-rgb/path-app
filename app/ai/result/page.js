"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Spinner from "@/components/Spinner";
import { getTrip } from "@/lib/apiClient";
import { getCurrentTripId } from "@/lib/tripStore";
import styles from "./page.module.css";

export default function AiResultPage() {
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [dayIdx, setDayIdx] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const tripId = getCurrentTripId();
    if (!tripId) {
      router.replace("/ai");
      return;
    }
    getTrip(tripId)
      .then((data) => setTrip(data.trip))
      .catch((e) => setError(e.message || "여행 일정을 불러오지 못했습니다."));
  }, [router]);

  if (error) {
    return (
      <div className="screen-scroll no-tab">
        <Header title="추천 여행 일정" backHref="/ai" showHome />
        <div className="container" style={{ paddingTop: 40, textAlign: "center" }}>
          <div className="body-sm">{error}</div>
          <Link href="/ai">
            <Button variant="primary" style={{ marginTop: 20 }}>
              새 요청 만들기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="screen-scroll no-tab">
        <Header title="추천 여행 일정" backHref="/ai" showHome />
        <div className="container" style={{ paddingTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Spinner />
          <div className="body-sm">불러오는 중...</div>
        </div>
      </div>
    );
  }

  const days = trip.itinerary.days || [];
  const day = days[dayIdx] || days[0];

  return (
    <div className="screen-scroll no-tab">
      <Header title="추천 여행 일정" backHref="/ai" showHome />
      <div className="container">
        {trip.itinerary.summary && (
          <div className="body-sm" style={{ marginBottom: 14 }}>{trip.itinerary.summary}</div>
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
            <div className="body-sm" style={{ marginTop: 4, marginBottom: 28 }}>
              {day.condition}
            </div>
            <Timeline items={day.items || []} />
          </>
        ) : (
          <div className="body-sm" style={{ padding: "40px 0", textAlign: "center" }}>
            아직 생성된 일정이 없어요.
          </div>
        )}

        {(() => {
          // 예전에는 여행 팁이 트립 전체에 하나만 있어서 날짜를 바꿔도 항상 같은
          // 내용이 보였습니다. 이제는 날짜(day)마다 그 날 일정에 맞는 팁을 따로
          // 받아오므로 day.travelTips를 우선 보여주고, 이 기능 이전에 만들어진
          // 옛날 일정처럼 날짜별 팁이 없는 경우에만 예전 방식(트립 전체 공통 팁)으로
          // 대체합니다.
          const tips = day?.travelTips?.length ? day.travelTips : trip.itinerary.travelTips || [];
          if (tips.length === 0) return null;
          return (
            <div style={{ marginTop: 20 }}>
              <div className={styles.dateRow}>여행 팁 (RAG)</div>
              {/* 기본 <ul> 글머리 기호 여백(paddingLeft)이 다른 텍스트보다 더
                  안쪽에서 시작돼 보이는 문제가 있어서, 다른 문단과 왼쪽 기준선이
                  맞도록 직접 배치했습니다. */}
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

        {trip.itinerary.routeSummary && (
          <Link href="/ai/route">
            <Button variant="secondary" style={{ marginTop: 24 }} icon={<Icon name="sparkle" size={17} filled />}>
              지도에서 전체 경로 보기
            </Button>
          </Link>
        )}
      </div>

      <div className={styles.footer}>
        <Link href="/ai/chat" style={{ flex: 1 }}>
          <Button variant="primary">AI와 대화하기</Button>
        </Link>
        <Link href="/ai/added" style={{ flex: 1 }}>
          <Button variant="primary">일정 추가</Button>
        </Link>
      </div>
    </div>
  );
}
