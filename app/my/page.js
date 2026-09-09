"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import { setLoggedIn } from "@/components/AuthGuard";

const MENU = [
  { href: "/my/trips", label: "내 여행 일정" },
  { href: "/my/settings", label: "설정" },
  { href: "/my/support", label: "고객센터" },
  { href: "/onboarding", label: "앱 소개" },
  { action: "logout", label: "로그아웃" },
];

export default function MyPage() {
  const router = useRouter();

  function handleLogout() {
    setLoggedIn(false);
    router.replace("/login");
  }

  return (
    <TabShell title="MY">
      <Header title="MY" backHref="/home" className="lg:hidden" />
      <div className="screen-scroll">
        <div className="container">
          <Link href="/my/profile">
            <Card style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "var(--bg-flat)",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16 }}>이름</div>
                <div className="body-sm">이메일</div>
              </div>
              <Icon name="chevronRight" size={20} />
            </Card>
          </Link>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {MENU.map((m) => {
              const inner = (
                <Card
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    color: m.action === "logout" ? "var(--red)" : "var(--text)",
                  }}
                >
                  {m.label}
                  <Icon name="chevronRight" size={18} />
                </Card>
              );
              if (m.action === "logout") {
                return (
                  <button
                    key="logout"
                    onClick={handleLogout}
                    style={{ width: "100%", textAlign: "left", font: "inherit", display: "block" }}
                  >
                    {inner}
                  </button>
                );
              }
              return (
                <Link href={m.href} key={m.href}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </TabShell>
  );
}
