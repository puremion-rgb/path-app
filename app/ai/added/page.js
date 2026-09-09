"use client";

import Link from "next/link";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

// 추천 여행 일정에서 "일정 추가"를 누르면 나오는 완료 화면 (프로토타입 "일정 추가 완료" / my-app 참고)
export default function AiAddedPage() {
  return (
    <main
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "72px 20px 40px",
        textAlign: "center",
      }}
    >
      <span
        style={{
          display: "flex",
          height: 96,
          width: 96,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "var(--green)",
          color: "#fff",
        }}
      >
        <Icon name="check" size={44} strokeWidth={3} />
      </span>

      <h1 style={{ marginTop: 32, fontSize: 22, fontWeight: 800, color: "var(--navy)" }}>
        여행 일정이 준비되었어요!
      </h1>
      <p className="body-sm" style={{ marginTop: 8 }}>
        AI가 장소와 경로를 연결해 최적의 일정을 만들었어요.
      </p>

      <div
        style={{
          marginTop: 40,
          width: "100%",
          borderRadius: 16,
          border: "1px solid var(--border)",
          background: "var(--white)",
          padding: 24,
          textAlign: "left",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <p style={{ fontSize: 18, fontWeight: 800 }}>도쿄 2박 3일</p>
        <p className="body-sm" style={{ marginTop: 8 }}>
          4월 12일(토) ~ 4월 14일(월)
        </p>
        <p style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: "var(--navy-dark)" }}>
          관광 4곳 · 맛집 2곳 · 환승 1회
        </p>
      </div>

      <div style={{ marginTop: 56, display: "flex", width: "100%", flexDirection: "column", gap: 12 }}>
        <Link href="/my/trips">
          <Button variant="primary">일정 확인하기</Button>
        </Link>
        <Link href="/map">
          <Button variant="secondary">지도에서 보기</Button>
        </Link>
      </div>
    </main>
  );
}
