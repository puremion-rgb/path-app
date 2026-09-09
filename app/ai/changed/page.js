"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Timeline from "@/components/Timeline";
import Button from "@/components/Button";
import { changedSchedule } from "@/lib/mockData";

export default function AiChangedPage() {
  const { summary, before, after, date, items } = changedSchedule;
  return (
    <div className="screen-scroll no-tab">
      <Header title="변경된 일정" backHref="/ai/chat" />
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
          {summary}
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>변경 전</div>
            <Card>
              <div className="body-sm">{before.title}</div>
              <div style={{ fontWeight: 800, fontSize: 15, marginTop: 2 }}>{before.value}</div>
              <div className="body-sm" style={{ marginTop: 14 }}>{before.metaLabel}</div>
              <div style={{ fontWeight: 800, fontSize: 15, marginTop: 2 }}>{before.metaValue}</div>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8, color: "#f97316" }}>변경 후</div>
            <Card style={{ border: "1.5px solid var(--orange)" }}>
              <div className="body-sm" style={{ color: "#f97316" }}>{after.title}</div>
              <div style={{ fontWeight: 800, fontSize: 15, marginTop: 2, color: "var(--navy)" }}>{after.value}</div>
              <div className="body-sm" style={{ marginTop: 14, color: "#f97316" }}>{after.metaLabel}</div>
              <div style={{ fontWeight: 800, fontSize: 15, marginTop: 2, color: "var(--navy)" }}>{after.metaValue}</div>
            </Card>
          </div>
        </div>

        <Card>
          <div style={{ fontWeight: 800, marginBottom: 14 }}>{date}</div>
          <Timeline items={items} />
        </Card>

        <Link href="/ai/result">
          <Button variant="primary" style={{ marginTop: 20 }}>
            변경된 일정 확인하기
          </Button>
        </Link>
      </div>
    </div>
  );
}
