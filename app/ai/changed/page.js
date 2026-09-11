"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Timeline from "@/components/Timeline";
import Button from "@/components/Button";
import { getLastChangeDiff } from "@/lib/tripStore";

export default function AiChangedPage() {
  const router = useRouter();
  const [diff, setDiff] = useState(null);

  useEffect(() => {
    const d = getLastChangeDiff();
    if (!d?.trip) {
      router.replace("/ai/result");
      return;
    }
    setDiff(d);
  }, [router]);

  if (!diff) return null;

  const { trip, beforeItinerary } = diff;
  const days = trip.itinerary.days || [];
  const beforeDays = beforeItinerary?.days || [];
  const day = days[0];

  return (
    <div className="screen-scroll no-tab">
      <Header title="변경된 일정" backHref="/ai/chat" showHome />
      <div className="container">
        <div
          style={{
            background: "var(--orange-soft)",
            color: "#f97316",
            fontWeight: 700,
            fontSize: 14,
            padding: "18px 16px",
            borderRadius: 14,
            marginBottom: 18,
            textAlign: "center",
          }}
        >
          {trip.itinerary.summary || "일정이 변경되었습니다."}
        </div>

        {beforeDays.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>변경 전 요약</div>
              <Card>
                <div className="body-sm">{beforeItinerary.summary || "-"}</div>
              </Card>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, color: "#f97316" }}>변경 후 요약</div>
              <Card style={{ border: "1.5px solid var(--orange)" }}>
                <div className="body-sm" style={{ color: "var(--navy)" }}>{trip.itinerary.summary || "-"}</div>
              </Card>
            </div>
          </div>
        )}

        {day && (
          <Card>
            <div style={{ fontWeight: 800, marginBottom: 14 }}>
              {day.label} · {day.date}
            </div>
            <Timeline items={day.items || []} />
          </Card>
        )}

        <Link href="/ai/result">
          <Button variant="primary" style={{ marginTop: 20 }}>
            변경된 일정 확인하기
          </Button>
        </Link>
      </div>
    </div>
  );
}
