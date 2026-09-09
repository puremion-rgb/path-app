"use client";

import Link from "next/link";
import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { faqItems } from "@/lib/mockData";

export default function SupportPage() {
  return (
    <TabShell crumb="MY" title="고객센터">
      <Header title="고객센터" backHref="/my" className="lg:hidden" />
      <div className="screen-scroll">
        <div className="container">
          <div className="h2" style={{ marginBottom: 10 }}>
            자주 묻는 질문
          </div>
          <Card padded={false}>
            {faqItems.map((q, i) => (
              <div
                key={q}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 16px",
                  borderBottom: i < faqItems.length - 1 ? "1px solid var(--border)" : "none",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {q}
                <Icon name="chevronRight" size={16} />
              </div>
            ))}
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 26 }}>
            <Link href="/my/support/tips">
              <Button variant="secondary" icon={<Icon name="sparkle" size={17} />}>
                일본 여행 팁
              </Button>
            </Link>
            <Button variant="primary" icon={<Icon name="headset" size={17} />}>
              1:1 문의하기
            </Button>
          </div>

          <div className="body-sm" style={{ textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
            이메일 support@path-travel.com
            <br />
            운영시간 평일 09:00 - 18:00 (점심시간 12:00-13:00)
            <br />
            주말·공휴일 휴무
          </div>
        </div>
      </div>
    </TabShell>
  );
}
