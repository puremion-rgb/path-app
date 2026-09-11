"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Spinner from "@/components/Spinner";
import { searchPlacesNearby, listFavorites, addFavorite, removeFavorite, getTrip } from "@/lib/apiClient";
import { getCurrentTripId } from "@/lib/tripStore";

const FILTERS = { 맛집: "restaurant", 카페: "cafe", 관광지: "tourist_attraction" };
const TOKYO_STATION = { lat: 35.681236, lng: 139.767125 };

export default function NearbyPage() {
  const [filter, setFilter] = useState("맛집");
  const [places, setPlaces] = useState([]);
  const [liked, setLiked] = useState(new Set());
  const [center, setCenter] = useState(TOKYO_STATION);
  const [centerName, setCenterName] = useState("도쿄역");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const tripId = getCurrentTripId();
      if (tripId) {
        try {
          const { trip } = await getTrip(tripId);
          const first = trip.itinerary?.mapPoints?.[0];
          if (first) {
            setCenter({ lat: first.lat, lng: first.lng });
            setCenterName(first.name);
          }
        } catch {}
      }
      try {
        const favData = await listFavorites();
        setLiked(new Set((favData.favorites || []).map((f) => f.placeId)));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    searchPlacesNearby({ lat: center.lat, lng: center.lng, radius: 1200, type: FILTERS[filter] })
      .then((data) => setPlaces(data.places || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filter, center]);

  async function toggleLike(p) {
    const isLiked = liked.has(p.placeId);
    setLiked((prev) => {
      const next = new Set(prev);
      isLiked ? next.delete(p.placeId) : next.add(p.placeId);
      return next;
    });
    try {
      if (isLiked) {
        await removeFavorite(p.placeId);
      } else {
        await addFavorite({
          placeId: p.placeId,
          name: p.name,
          category: p.category,
          area: p.address,
          lat: p.location?.lat,
          lng: p.location?.lng,
        });
      }
    } catch {
      // 실패 시 표시만 원복
      setLiked((prev) => {
        const next = new Set(prev);
        isLiked ? next.add(p.placeId) : next.delete(p.placeId);
        return next;
      });
    }
  }

  return (
    <div className="pz-shell flex min-h-dvh w-full bg-[var(--bg)] lg:bg-white">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:mx-auto lg:max-w-2xl lg:border-x lg:border-line">
        <header className="hidden shrink-0 items-center gap-2 border-b border-line px-10 py-6 lg:flex">
          <span className="text-[15px] font-medium text-muted">지도</span>
          <h1 className="text-[20px] font-bold text-navy-deep">주변 {filter} 추천</h1>
        </header>
        <Header title={`주변 ${filter} 추천`} className="lg:hidden" showHome />

        <div className="screen-scroll no-tab">
          <div className="container">
            <div className="h1" style={{ fontSize: 20 }}>
              {centerName} 주변에서 추천해요
            </div>
            <div className="body-sm" style={{ marginTop: 6 }}>
              Google Places로 실제 검색한 결과예요.
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {Object.keys(FILTERS).map((f) => (
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

            {error && <p className="body-sm" style={{ color: "var(--red)", marginTop: 14 }}>{error}</p>}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
                <Spinner size={20} />
                <p className="body-sm">검색 중...</p>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
              {!loading && places.length === 0 && (
                <p className="body-sm">주변에서 결과를 찾지 못했어요.</p>
              )}
              {places.map((p) => (
                <div
                  key={p.placeId}
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
                    href={`/ai/place/${p.placeId}`}
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
                    {filter.toUpperCase()}
                  </Link>
                  <Link href={`/ai/place/${p.placeId}`} style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15.5 }}>{p.name}</div>
                    {p.rating != null && (
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
                        <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>({p.userRatingCount ?? 0})</span>
                      </div>
                    )}
                    <div className="body-sm" style={{ marginTop: 2 }}>
                      {p.category}
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleLike(p)}
                    aria-label="찜"
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      color: liked.has(p.placeId) ? "var(--red)" : "var(--text-faint)",
                    }}
                  >
                    <Icon name="heart" size={20} filled={liked.has(p.placeId)} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, background: "var(--bg-flat)", borderRadius: 16, padding: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: "var(--navy)" }}>AI 추천 이유</div>
              <div className="body-sm" style={{ marginTop: 6, lineHeight: 1.6 }}>
                {centerName}에서 도보로 이동하기 좋은 거리의 실제 장소들이에요.
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
          <Link href="/favorites">
            <Button variant="primary">찜 목록 보기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
