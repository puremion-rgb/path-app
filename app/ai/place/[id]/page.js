"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Spinner from "@/components/Spinner";
import { getPlaceDetails, searchPlacesNearby, listFavorites, addFavorite, removeFavorite, placePhotoUrl } from "@/lib/apiClient";

export default function PlaceDetailPage({ params }) {
  const [placeId, setPlaceId] = useState(null);
  const [place, setPlace] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { id } = await params;
      setPlaceId(id);
      try {
        const [{ place: p }, favData] = await Promise.all([getPlaceDetails(id), listFavorites().catch(() => ({ favorites: [] }))]);
        setPlace(p);
        setSaved((favData.favorites || []).some((f) => f.placeId === id));
        if (p.location) {
          const near = await searchPlacesNearby({ lat: p.location.lat, lng: p.location.lng, radius: 800 }).catch(() => ({ places: [] }));
          setNearby((near.places || []).filter((n) => n.placeId !== id).slice(0, 5));
        }
      } catch (e) {
        setError(e.message || "장소 정보를 불러오지 못했습니다.");
      }
    })();
  }, [params]);

  async function toggleSave() {
    if (!place) return;
    setBusy(true);
    try {
      if (saved) {
        await removeFavorite(place.placeId);
        setSaved(false);
      } else {
        await addFavorite({
          placeId: place.placeId,
          name: place.name,
          category: place.category,
          area: place.address,
          lat: place.location?.lat,
          lng: place.location?.lng,
        });
        setSaved(true);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <div className="screen-scroll no-tab">
        <Header title="장소 상세" backHref="/ai/result" showHome />
        <div className="container" style={{ paddingTop: 40, textAlign: "center" }}>
          <div className="body-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="screen-scroll no-tab">
        <Header title="장소 상세" backHref="/ai/result" showHome />
        <div className="container" style={{ paddingTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Spinner />
          <div className="body-sm">불러오는 중...</div>
        </div>
      </div>
    );
  }

  const photoUrl = placePhotoUrl(place.photoName, 640);

  return (
    <div className="screen-scroll no-tab">
      <Header title="장소 상세" backHref="/ai/result" showHome />
      <div className="container">
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            height: 190,
            marginBottom: 16,
            background: "var(--bg-flat)",
          }}
        >
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              사진 없음
            </div>
          )}
        </div>

        <div className="h1" style={{ fontSize: 20 }}>{place.name}</div>
        <div className="body-sm" style={{ marginTop: 6, marginBottom: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {place.category && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="sparkle" size={14} filled /> {place.category}
            </span>
          )}
          {place.rating != null && (
            <>
              <span>·</span>
              <span>⭐ {place.rating} ({place.userRatingCount ?? 0})</span>
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {place.openNow != null && (
            <div style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--text-muted)" }}>
              <Icon name="clock" size={16} /> {place.openNow ? "영업 중" : "영업 종료"}
            </div>
          )}
          {place.address && (
            <div style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--text-muted)" }}>
              <Icon name="location" size={16} /> {place.address}
            </div>
          )}
        </div>

        {nearby.length > 0 && (
          <>
            <div className="h2" style={{ marginBottom: 10 }}>주변 추천 장소</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
              {nearby.map((n) => (
                <Link
                  key={n.placeId}
                  href={`/ai/place/${n.placeId}`}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 999,
                    border: "1.5px solid var(--border-strong)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {n.name}
                </Link>
              ))}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <Button variant="secondary" onClick={toggleSave} disabled={busy} icon={<Icon name="heart" size={17} filled={saved} />}>
            {saved ? "찜 완료" : "찜하기"}
          </Button>
          {place.mapsUri && (
            <a href={place.mapsUri} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
              <Button variant="primary">Google 지도에서 보기</Button>
            </a>
          )}
        </div>

        <Link href="/ai/route">
          <Button variant="primary">길찾기 시작</Button>
        </Link>
      </div>
    </div>
  );
}
