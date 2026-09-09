"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { chatMessages } from "@/lib/mockData";
import styles from "./page.module.css";

export default function AiChatPage() {
  const router = useRouter();
  const [text, setText] = useState("");

  function submit() {
    router.push("/ai/reanalyzing");
  }

  return (
    <div className="screen-scroll no-tab" style={{ display: "flex", flexDirection: "column" }}>
      <Header title="AI와 대화하기" backHref="/ai/result" />
      <div className="container">
        <div className="h1">AI에게 원하는 내용을 말해주세요.</div>
        <div className="body-sm" style={{ marginTop: 6, marginBottom: 22 }}>
          현재 일정은 자동으로 유지하면서 수정합니다.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {chatMessages.map((m, i) =>
            m.role === "user" ? (
              <div className={styles.msgUser} key={i}>
                {m.text}
              </div>
            ) : (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className={styles.msgAiRow}>
                  <div className={styles.botIcon}>AI</div>
                  <div className={styles.msgAi}>{m.text}</div>
                </div>

                {(m.checklist || m.result) && (
                  <Card className={styles.summaryCard}>
                    {m.checklist?.map((c) => (
                      <div className={styles.checkItem} key={c}>
                        <Icon name="check" size={16} strokeWidth={3} /> {c}
                      </div>
                    ))}
                    {m.result && (
                      <div className={styles.resultBox}>
                        <div className={styles.resultLabel}>{m.result.title}</div>
                        <div className={styles.resultDesc}>{m.result.desc}</div>
                        <div className={styles.resultMeta}>{m.result.meta}</div>
                      </div>
                    )}
                  </Card>
                )}
              </div>
            )
          )}
        </div>
      </div>

      <div className={styles.inputBar}>
        <input
          placeholder="추가로 요청해보세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className={styles.sendBtn} onClick={submit} aria-label="전송">
          <Icon name="send" size={16} />
        </button>
      </div>

      <div className="container" style={{ marginTop: 20, paddingBottom: 24 }}>
        <Button variant="primary" onClick={submit}>
          변경사항을 일정에 적용
        </Button>
      </div>
    </div>
  );
}
