"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import RouteLegRow from "@/components/RouteLegRow";
import GoogleMapView from "@/components/GoogleMapView";
import Spinner from "@/components/Spinner";
import { getTrip } from "@/lib/apiClient";
import { getCurrentTripId } from "@/lib/tripStore";

export default function AiRoutePage() {
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const tripId = getCurrentTripId();
    if (!tripId) {
      router.replace("/ai");
      return;
    }
    getTrip(tripId)
      .then((data) => setTrip(data.trip))
      .catch((e) => setError(e.message));
  }, [router]);

  const routeSummary = trip?.itinerary?.routeSummary;
  const mapPoints = trip?.itinerary?.mapPoints || [];

  return (
    <div className="screen-scroll no-tab" style={{ display: "flex", flexDirection: "column" }}>
      <Header title="이동 경로" backHref="/ai/result" showHome />

      <div style={{ position: "relative", flex: "1 1 auto", minHeight: 260 }}>
        <GoogleMapView points={mapPoints} polyline={routeSummary?.encodedPolyline} height="100%" />
      </div>

      <div className="container" style={{ marginTop: 16, marginBottom: 16 }}>
        {error && <div className="body-sm" style={{ color: "var(--red)", marginBottom: 10 }}>{error}</div>}
        {!trip ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Spinner size={20} />
            <div className="body-sm">불러오는 중...</div>
          </div>
        ) : routeSummary ? (
          <Card>
            <div style={{ fontWeight: 800, fontSize: 18 }}>
              {routeSummary.from} → {routeSummary.to}
            </div>
            <div className="body-sm" style={{ marginTop: 4, marginBottom: 18 }}>
              {routeSummary.duration} · {routeSummary.transfers}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
              {(routeSummary.legs || []).map((leg, i) => (
                <RouteLegRow key={i} leg={leg} />
              ))}
            </div>

            <Link href="/ai/result">
              <Button variant="primary">일정으로 돌아가기</Button>
            </Link>

            {routeSummary.source && (
              <p className="body-sm" style={{ marginTop: 16, textAlign: "center", fontSize: 11.5 }}>
                {routeSummary.source}
              </p>
            )}
          </Card>
        ) : (
          <Card>
            <div className="body-sm">이 여행에는 대표 경로 요약이 없어요.</div>
            <Link href="/ai/result">
              <Button variant="primary" style={{ marginTop: 14 }}>
                일정으로 돌아가기
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
