"use client";

import Link from "next/link";
import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import MapArt from "@/components/MapArt";
import { routeDetail } from "@/lib/mockData";

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

const legs = [
  { color: "#2f6fed", label: "JR 야마노테선", route: "신주쿠 → 우에노역" },
  { color: "#2f6fed", label: "도쿄 메트로", route: "우에노역 → 아사쿠사역" },
  { color: "#12173f", label: "도보", route: "아사쿠사역 → 센소지" },
];

function RouteLegs() {
  return (
    <>
      {legs.map((leg, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
            fontSize: 13.5,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: leg.color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: 700 }}>{leg.label}</span>
          <span style={{ color: "var(--text-muted)" }}>{leg.route}</span>
        </div>
      ))}
    </>
  );
}

// 모바일 지도 배경: 지도 탭 메인 화면(/map)과 동일한 톤(격자 배경 + 핀
// 마커)으로 통일했습니다. (기존에는 SVG 기반 MapArt를 썼지만, /map과
// 화면이 서로 달라 보인다는 피드백에 따라 같은 .map-grid 배경으로 교체)
const mobilePins = [
  { name: "스카이트리", top: "20%", left: "60%", color: "#2f6fb0" },
  { name: "센소지", top: "34%", left: "76%", color: "#f4a268" },
  { name: "신주쿠", top: "62%", left: "26%", color: "#24a36a" },
];

function MobileMap() {
  return (
    <div className="map-grid absolute inset-0 overflow-hidden">
      {mobilePins.map((p) => (
        <div
          key={p.name}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
          style={{ top: p.top, left: p.left }}
        >
          <span
            className="shrink-0 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: p.color, width: 14, height: 14 }}
          />
          <span className="whitespace-nowrap rounded-full bg-white/90 px-2.5 py-1 text-[13px] font-bold text-navy-deep shadow">
            {p.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function MapRoutePage() {
  return (
    <TabShell crumb="지도" title="이동 경로" hideMobileNav>
      {/* 모바일: 뒤로가기가 있는 상세 화면이라 하단 탭바 없이 전체 화면을
          지도로 씁니다(ai/route와 동일 구성). /ai/route와 같은 "길찾기
          상세보기" 카드(아이콘 뱃지형 노선 목록)를 그대로 사용하고, 지도
          배경도 /map 메인 화면과 같은 스타일로 맞췄습니다. */}
      <div className="flex flex-1 flex-col lg:hidden">
        <div style={{ background: "var(--bg)" }}>
          <Header title="이동 경로" backHref="/map" />
        </div>

        <div className="screen-scroll no-tab" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", flex: "1 1 auto", minHeight: 260 }}>
            <MobileMap />
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
      </div>

      {/* 데스크톱: 기존 레이아웃(지도 고정 높이 + 카드) 그대로 유지 */}
      <div className="hidden flex-1 flex-col lg:flex">
        <MapArt markers={markers} paths={paths} height={280} />

        <div className="container" style={{ marginTop: 16 }}>
          <Card>
            <div style={{ fontWeight: 800, fontSize: 15 }}>신주쿠역 → 센소지</div>
            <div className="body-sm" style={{ marginTop: 4, marginBottom: 14 }}>
              약 45분 · 환승 1회
            </div>

            <RouteLegs />

            <Button variant="primary" style={{ marginTop: 6 }}>
              길찾기 상세 보기
            </Button>
          </Card>

          <div className="body-sm" style={{ textAlign: "center", marginTop: 14 }}>
            교통 공공데이터 출처: 東京都交通局 / 공공교통오픈데이터協議会
          </div>
        </div>
      </div>
    </TabShell>
  );
}
