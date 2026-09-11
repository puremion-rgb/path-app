"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import RouteLegRow from "@/components/RouteLegRow";
import GoogleMapView from "@/components/GoogleMapView";
import { getTrip } from "@/lib/apiClient";
import { getCurrentTripId } from "@/lib/tripStore";

// app/ai/route 화면과 같은 구간(leg) 행 디자인(아이콘 원 + 굵은 이동수단 + 설명)을
// 그대로 재사용합니다. 예전에는 이 화면만 아이콘 없는 작은 점(dot) 스타일이라
// 두 "이동 경로" 화면의 디자인이 서로 달랐는데, 통일했습니다.
function RouteLegs({ legs = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {legs.map((leg, i) => (
        <RouteLegRow key={i} leg={leg} />
      ))}
    </div>
  );
}

export default function MapRoutePage() {
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const tripId = getCurrentTripId();
    if (!tripId) return;
    getTrip(tripId)
      .then((data) => setTrip(data.trip))
      .catch((e) => setError(e.message));
  }, []);

  const routeSummary = trip?.itinerary?.routeSummary;
  const mapPoints = trip?.itinerary?.mapPoints || [];

  const body = !trip ? (
    <div className="body-sm" style={{ padding: 24, textAlign: "center" }}>
      {error || "먼저 AI 여행 탭에서 일정을 만들어주세요."}
    </div>
  ) : !routeSummary ? (
    <div className="body-sm" style={{ padding: 24, textAlign: "center" }}>이 여행에는 대표 경로 요약이 없어요.</div>
  ) : (
    <Card>
      <div style={{ fontWeight: 800, fontSize: 15 }}>
        {routeSummary.from} → {routeSummary.to}
      </div>
      <div className="body-sm" style={{ marginTop: 4, marginBottom: 14 }}>
        {routeSummary.duration} · {routeSummary.transfers}
      </div>
      <div style={{ marginBottom: 18 }}>
        <RouteLegs legs={routeSummary.legs} />
      </div>
      <Link href="/ai/result">
        <Button variant="primary">길찾기 상세 보기</Button>
      </Link>
      {routeSummary.source && (
        <div className="body-sm" style={{ textAlign: "center", marginTop: 14 }}>
          {routeSummary.source}
        </div>
      )}
    </Card>
  );

  return (
    <TabShell crumb="지도" title="이동 경로" hideMobileNav>
      <div className="flex flex-1 flex-col lg:hidden">
        <div style={{ background: "var(--bg)" }}>
          <Header title="이동 경로" backHref="/map" showHome />
        </div>

        <div className="screen-scroll no-tab" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", flex: "1 1 auto", minHeight: 260 }}>
            <GoogleMapView points={mapPoints} polyline={routeSummary?.encodedPolyline} height="100%" />
          </div>
          <div className="container" style={{ marginTop: 16, marginBottom: 16 }}>{body}</div>
        </div>
      </div>

      <div className="hidden flex-1 flex-col lg:flex">
        <div style={{ position: "relative", height: 280 }}>
          <GoogleMapView points={mapPoints} polyline={routeSummary?.encodedPolyline} height="100%" />
        </div>
        <div className="container" style={{ marginTop: 16 }}>{body}</div>
      </div>
    </TabShell>
  );
}
