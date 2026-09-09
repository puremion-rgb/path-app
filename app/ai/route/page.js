"use client";

import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import MapArt from "@/components/MapArt";
import { routeDetail } from "@/lib/mockData";
import Link from "next/link";

const markers = [
  { x: 90, y: 150, label: "신주쿠", color: "#2f6fed" },
  { x: 250, y: 100, label: "센소지", color: "#f4a268" },
  { x: 190, y: 230, label: "스카이트리", color: "#24a36a" },
];
const paths = [
  [
    { x: 90, y: 150 },
    { x: 190, y: 230 },
  ],
  [
    { x: 250, y: 100 },
    { x: 190, y: 230 },
  ],
];

export default function AiRoutePage() {
  return (
    <div className="screen-scroll no-tab" style={{ display: "flex", flexDirection: "column" }}>
      <Header title="이동 경로" backHref="/ai/result" />

      {/* 뒤로가기가 있는 상세 화면이라 하단 탭바 없이 전체 화면을 지도로
          씁니다. 지도 배경이 카드 아래 남는 공간을 모두 채우도록 flex-1로
          늘어나게 합니다. (카드는 그대로 아래 일반 흐름에 위치) */}
      <div style={{ position: "relative", flex: "1 1 auto", minHeight: 260 }}>
        <MapArt markers={markers} paths={paths} fill />
      </div>

      <div className="container" style={{ marginTop: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ fontWeight: 800, fontSize: 18 }}>
            {routeDetail.from} → {routeDetail.to}
          </div>
          <div className="body-sm" style={{ marginTop: 4, marginBottom: 18 }}>
            {routeDetail.duration} · {routeDetail.transfers}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            {routeDetail.legs.map((leg, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    display: "flex",
                    height: 30,
                    width: 30,
                    flexShrink: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    background: leg.color,
                    color: "#fff",
                  }}
                >
                  <Icon name={leg.mode === "도보" ? "walk" : "train"} size={16} strokeWidth={2} />
                </span>
                <span style={{ fontWeight: 700, fontSize: 14.5 }}>{leg.mode}</span>
                <span
                  className="body-sm"
                  style={{ marginLeft: "auto", textAlign: "right", flexShrink: 0 }}
                >
                  {leg.detail}
                </span>
              </div>
            ))}
          </div>

          <Link href="/ai/result">
            <Button variant="primary">길찾기 상세 보기</Button>
          </Link>

          <p
            className="body-sm"
            style={{ marginTop: 16, textAlign: "center", fontSize: 11.5 }}
          >
            {routeDetail.source}
          </p>
        </Card>
      </div>
    </div>
  );
}
