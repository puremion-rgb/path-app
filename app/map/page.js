"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import LogoHeader from "@/components/LogoHeader";
import PlacePhoto from "@/components/PlacePhoto";
import Icon from "@/components/Icon";
import GoogleMapView from "@/components/GoogleMapView";
import Spinner from "@/components/Spinner";
import { searchPlacesByText, searchPlacesNearby } from "@/lib/apiClient";

const FILTERS = ["전체", "관광지", "맛집", "숙소"];
const FILTER_TYPE = { 관광지: "tourist_attraction", 맛집: "restaurant", 숙소: "lodging" };
const TOKYO_STATION = { lat: 35.681236, lng: 139.767125 };

export default function MapPage() {
  const [filter, setFilter] = useState("전체");
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runSearch() {
    setLoading(true);
    setError("");
    try {
      let result;
      if (query.trim()) {
        result = await searchPlacesByText(query.trim(), TOKYO_STATION);
      } else {
        result = await searchPlacesNearby({
          lat: TOKYO_STATION.lat,
          lng: TOKYO_STATION.lng,
          radius: 2000,
          type: filter === "전체" ? undefined : FILTER_TYPE[filter],
        });
      }
      setPlaces(result.places || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const filteredList = query.trim()
    ? places
    : places.filter((p) => filter === "전체" || p.category?.includes(filter) || true);

  const mapPoints = filteredList
    .filter((p) => p.location)
    .map((p) => ({ placeId: p.placeId, name: p.name, lat: p.location.lat, lng: p.location.lng }));

  return (
    <div className="pz-shell flex min-h-dvh w-full flex-col bg-transparent lg:min-h-0 lg:flex-row lg:bg-white">
      <Sidebar />

      {/* ---------- 모바일 ---------- */}
      <div className="relative w-full lg:hidden" style={{ height: "calc(100dvh - 92px)" }}>
        <div className="absolute inset-0">
          <GoogleMapView points={mapPoints} height="100%" fallbackCenter={TOKYO_STATION} />
        </div>

        <div className="absolute inset-x-0 top-0 z-10">
          <div className="bg-[var(--bg)]">
            <LogoHeader />
          </div>
          <div className="px-5 pb-4 pt-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-[0_6px_20px_rgba(30,39,97,0.08)]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                placeholder="어디로 여행할까요?"
                className="w-full border-none bg-transparent text-[15px] text-navy-deep outline-none placeholder:text-muted focus:outline-none focus:ring-0"
                style={{ WebkitTapHighlightColor: "transparent", boxShadow: "none" }}
              />
              <button onClick={runSearch} aria-label="검색">
                <Icon name="search" size={20} className="shrink-0 text-navy" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- PC ---------- */}
      <div className="hidden min-w-0 flex-1 flex-col lg:flex">
        <header className="flex shrink-0 items-center border-b border-line px-10 py-6">
          <h1 className="text-[20px] font-bold text-navy-deep">지도</h1>
        </header>
        <div className="flex flex-1 bg-[#eef2fb]">
          <div className="flex w-[420px] shrink-0 flex-col gap-5 px-10 py-8 overflow-y-auto">
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3.5 text-muted">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                placeholder="검색"
                className="w-full bg-transparent text-[15px] text-navy-deep outline-none placeholder:text-muted"
              />
              <button onClick={runSearch} aria-label="검색">
                <Icon name="search" size={18} />
              </button>
            </div>
            <div className="flex gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-4 py-2 text-[13px] font-bold transition ${
                    filter === f ? "border-navy bg-navy text-white" : "border-navy/40 bg-white text-navy"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {error && <p className="text-[13px] text-red-500">{error}</p>}
            {loading && (
              <div className="flex items-center justify-center gap-2.5 py-6">
                <Spinner size={20} />
                <p className="text-[13px] text-muted">검색 중...</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {!loading && filteredList.length === 0 ? (
                <p className="py-10 text-center text-[13px] text-muted">검색 결과가 없어요.</p>
              ) : (
                filteredList.map((p) => (
                  <Link
                    key={p.placeId}
                    href={`/ai/place/${p.placeId}`}
                    className="flex gap-4 rounded-2xl border border-line bg-white p-3"
                  >
                    <PlacePhoto name={p.name} className="h-16 w-16 shrink-0 rounded-xl" labelClassName="hidden" />
                    <div>
                      <span className="inline-block rounded-full bg-[#eef2fb] px-2.5 py-0.5 text-[11px] font-bold text-muted">
                        {p.category || "장소"}
                      </span>
                      <p className="mt-1 text-[16px] font-extrabold text-navy-deep">{p.name}</p>
                      <p className="mt-0.5 text-[13px] text-muted">
                        {p.rating != null ? `⭐ ${p.rating} (${p.userRatingCount ?? 0})` : p.address}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
          <div className="relative flex-1">
            <GoogleMapView points={mapPoints} height="100%" fallbackCenter={TOKYO_STATION} />
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2">
        <BottomNav />
      </div>
    </div>
  );
}
