"use client";

import { useState } from "react";
import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import styles from "./page.module.css";

function Switch({ on, onToggle }) {
  return (
    <button
      className={`${styles.switch} ${on ? styles.switchOn : ""}`}
      onClick={onToggle}
      role="switch"
      aria-checked={on}
    >
      <span className={`${styles.knob} ${on ? styles.knobOn : ""}`} />
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div className={styles.group}>
      <div className={styles.groupTitle}>{title}</div>
      <div className={styles.card}>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [push, setPush] = useState(true);
  const [tripAlert, setTripAlert] = useState(false);

  return (
    <TabShell crumb="MY" title="설정">
      <Header title="설정" backHref="/my" className="lg:hidden" />
      <div className="screen-scroll">
        <div className="container">
          <Section title="알림">
            <div className={styles.row}>
              푸시 알림
              <Switch on={push} onToggle={() => setPush((v) => !v)} />
            </div>
            <div className={styles.row}>
              여행 일정 알림
              <Switch on={tripAlert} onToggle={() => setTripAlert((v) => !v)} />
            </div>
          </Section>

          <Section title="계정">
            <div className={styles.row}>
              언어 설정
              <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>한국어</span>
            </div>
            <div className={styles.row}>
              비밀번호 변경
              <Icon name="chevronRight" size={16} />
            </div>
          </Section>

          <Section title="기타">
            <div className={styles.row}>
              문의하기
              <Icon name="chevronRight" size={16} />
            </div>
            <div className={styles.row} style={{ color: "var(--red)" }}>
              회원 탈퇴
            </div>
          </Section>
        </div>
      </div>
    </TabShell>
  );
}
