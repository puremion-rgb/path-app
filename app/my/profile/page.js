"use client";

import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import Button from "@/components/Button";

export default function ProfilePage() {
  return (
    <TabShell crumb="MY" title="프로필 수정">
      <Header title="프로필 수정" backHref="/my" className="lg:hidden" />
      <div className="screen-scroll">
      <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "var(--bg-flat)",
            marginTop: 8,
          }}
        />
        <button
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: 13,
            marginTop: 10,
          }}
        >
          사진 변경하기
        </button>

        <div style={{ width: "100%", marginTop: 30 }}>
          <label className="body-sm" style={{ display: "block", marginBottom: 6 }}>
            이름
          </label>
          <input
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 14,
              border: "1.5px solid var(--border-strong)",
              marginBottom: 18,
              fontSize: 14.5,
            }}
            placeholder="이름을 입력하세요"
          />

          <label className="body-sm" style={{ display: "block", marginBottom: 6 }}>
            이메일
          </label>
          <input
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 14,
              border: "1.5px solid var(--border-strong)",
              marginBottom: 24,
              fontSize: 14.5,
              background: "var(--bg-flat)",
              color: "var(--text-muted)",
            }}
            defaultValue="user@path-travel.com"
            disabled
          />

          <Button variant="primary">저장하기</Button>
          <div className="body-sm" style={{ textAlign: "center", marginTop: 14 }}>
            가입일 2026.01.15 · 마지막 로그인 오늘
          </div>
        </div>
      </div>
      </div>
    </TabShell>
  );
}
