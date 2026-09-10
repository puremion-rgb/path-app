"use client";

import { useEffect, useState } from "react";
import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { useAuth } from "@/components/AuthProvider";
import { updateProfile } from "@/lib/apiClient";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      await updateProfile({ name });
      await refresh();
      setMessage("저장되었습니다.");
    } catch (e) {
      setMessage(e.message || "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

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
          disabled
          title="데모 범위 밖입니다"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-faint)",
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={user?.email || ""}
            disabled
          />

          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "저장 중..." : "저장하기"}
          </Button>
          {message && (
            <div className="body-sm" style={{ textAlign: "center", marginTop: 14 }}>
              {message}
            </div>
          )}
        </div>
      </div>
      </div>
    </TabShell>
  );
}
