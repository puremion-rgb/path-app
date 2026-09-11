"use client";

import { useState } from "react";
import Link from "next/link";
import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { faqItems } from "@/lib/mockData";
import styles from "./page.module.css";

const SUPPORT_EMAIL = "support@path-travel.com";

export default function SupportPage() {
  // 자주 묻는 질문을 눌렀을 때 답변이 펼쳐지도록, 지금 열려있는 질문의
  // 인덱스만 기억합니다. 같은 질문을 다시 누르면 접힙니다.
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <TabShell crumb="MY" title="고객센터">
      <Header title="고객센터" backHref="/my" className="lg:hidden" />
      <div className="screen-scroll">
        <div className="container">
          <div className="h2" style={{ marginBottom: 10 }}>
            자주 묻는 질문
          </div>
          {/* 설정(app/my/settings) 화면의 목록 카드/글씨 스타일과 동일하게 맞추기 위해
              카드 안쪽 여백은 좌우 18px(설정과 동일), 각 질문 줄은 위아래 16px 여백에
              14.5px/600 굵기 글씨(styles.faqRow)를 그대로 재사용합니다. */}
          <Card padded={false} style={{ padding: "0 18px" }}>
            {faqItems.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={item.q}
                  style={{
                    borderBottom: i < faqItems.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className={styles.faqRow}
                  >
                    {item.q}
                    <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
                      <Icon name="chevronRight" size={16} />
                    </span>
                  </button>
                  {isOpen && <div className={styles.answer}>{item.a}</div>}
                </div>
              );
            })}
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 26 }}>
            <Link href="/my/support/tips">
              <Button variant="secondary" icon={<Icon name="sparkle" size={17} filled />}>
                일본 여행 팁
              </Button>
            </Link>
            <Button
              variant="primary"
              icon={<Icon name="headset" size={17} />}
              onClick={() => {
                window.location.href = `mailto:${SUPPORT_EMAIL}`;
              }}
            >
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
