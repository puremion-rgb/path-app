"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { getTrip } from "@/lib/apiClient";
import { getCurrentTripId, setPendingModification } from "@/lib/tripStore";
import styles from "./page.module.css";

export default function AiChatPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [tripId, setTripId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = getCurrentTripId();
    if (!id) {
      router.replace("/ai");
      return;
    }
    setTripId(id);
    getTrip(id)
      .then((data) => setMessages(data.chat || []))
      .catch((e) => setError(e.message));
  }, [router]);

  function submit() {
    if (!text.trim() || !tripId) return;
    setPendingModification({ tripId, message: text.trim() });
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

        {error && <div className="body-sm" style={{ color: "var(--red)", marginBottom: 16 }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {messages.length === 0 && (
            <div className="body-sm">아직 대화 내역이 없어요. 예: &ldquo;점심은 스시로 바꾸고 환승도 최대 한 번으로 해줘.&rdquo;</div>
          )}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div className={styles.msgUser} key={i}>
                {m.text}
              </div>
            ) : (
              <div className={styles.msgAiRow} key={i}>
                <div className={styles.botIcon}>
                  <Image src="/images/ai-avatar.png" alt="AI" width={40} height={40} />
                </div>
                <div className={styles.msgAi}>{m.text}</div>
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
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button className={styles.sendBtn} onClick={submit} aria-label="전송">
          <Icon name="send" size={16} />
        </button>
      </div>

      <div className="container" style={{ marginTop: 20, paddingBottom: 24 }}>
        <Button variant="primary" onClick={submit} disabled={!text.trim()}>
          AI에게 수정 요청 보내기
        </Button>
      </div>
    </div>
  );
}
