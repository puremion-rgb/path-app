"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { itineraryDays } from "@/lib/mockData";
import styles from "./page.module.css";

export default function AiResultPage() {
  const [dayIdx, setDayIdx] = useState(0);
  const day = itineraryDays[dayIdx];

  return (
    <div className="screen-scroll no-tab">
      <Header title="추천 여행 일정" backHref="/ai" />
      <div className="container">
        <div className={styles.dayTabs}>
          {itineraryDays.map((d, i) => (
            <button
              key={d.id}
              className={`${styles.dayTab} ${i === dayIdx ? styles.dayTabActive : ""}`}
              onClick={() => setDayIdx(i)}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className={styles.dateRow}>{day.date}</div>
        <div className="body-sm" style={{ marginTop: 4, marginBottom: 28 }}>
          {day.condition}
        </div>

        <Timeline items={day.items} />

        <Link href="/ai/route">
          <Button variant="secondary" style={{ marginTop: 24 }} icon={<Icon name="sparkle" size={17} />}>
            지도에서 전체 경로 보기
          </Button>
        </Link>
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
