"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import PlaceThumb from "@/components/PlaceThumb";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { places, placeIcon } from "@/lib/mockData";

export default function PlaceDetailPage({ params }) {
  const place = places[params.id] || Object.values(places)[0];
  const [saved, setSaved] = useState(false);

  return (
    <div className="screen-scroll no-tab">
      <Header title="장소 상세" backHref="/ai/result" />
      <div className="container">
        <div style={{ borderRadius: 20, overflow: "hidden", height: 190, marginBottom: 16 }}>
          <PlaceThumb tone={place.tone} icon={placeIcon[place.id]} radius={20} />
        </div>

        <div className="h1" style={{ fontSize: 20 }}>{place.name}</div>
        <div
          className="body-sm"
          style={{ marginTop: 6, marginBottom: 12, display: "flex", gap: 10, alignItems: "center" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="sparkle" size={14} /> {place.category}
          </span>
          <span>·</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="pin" size={14} /> {place.area}
          </span>
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{place.desc}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          <div style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--text-muted)" }}>
            <Icon name="clock" size={16} /> {place.hours}
          </div>
          <div style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--text-muted)" }}>
            <Icon name="location" size={16} /> {place.address}
          </div>
        </div>

        <div className="h2" style={{ marginBottom: 10 }}>주변 추천 장소</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
          {place.nearby.map((n) => (
            <span
              key={n}
              style={{
                padding: "9px 14px",
                borderRadius: 999,
                border: "1.5px solid var(--border-strong)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {n}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <Button variant="secondary" onClick={() => setSaved((v) => !v)} icon={<Icon name="heart" size={17} filled={saved} />}>
            {saved ? "찜 완료" : "찜하기"}
          </Button>
          <Button variant="primary">일정 추가</Button>
        </div>

        {place.fromPrev && (
          <>
            <div className="h2" style={{ marginBottom: 10 }}>이 장소로 이동</div>
            <div
              style={{
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 16,
                marginBottom: 18,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 6 }}>
                {place.fromPrev.from} → {place.fromPrev.to}
              </div>
              <div className="body-sm">
                {place.fromPrev.duration} · {place.fromPrev.transfer} · {place.fromPrev.walk}
              </div>
            </div>
          </>
        )}

        <Link href="/ai/route">
          <Button variant="primary">길찾기 시작</Button>
        </Link>
      </div>
    </div>
  );
}
