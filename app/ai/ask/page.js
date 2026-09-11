"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { getTrip, askAi } from "@/lib/apiClient";
import { getCurrentTripId } from "@/lib/tripStore";
import { friendlyErrorMessage } from "@/lib/friendlyError";
import styles from "./page.module.css";

// "AI에게 질문하기" — 번역/여행 상식 같은 일반 질문 전용 화면입니다.
// "AI와 대화하기"(일정 수정, /ai/chat)와는 완전히 분리되어 있습니다:
// 현재 일정 내용을 전혀 참고하지 않고, Tool 호출 없이 Gemini를 한 번만
// 호출하는 가벼운 요청이라 응답도 더 빠릅니다. 대화 기록은 여행별로
// 서버에 저장되어(AskMessage) 다음에 다시 들어와도 이어볼 수 있습니다.
export default function AiAskPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [tripId, setTripId] = useState(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const id = getCurrentTripId();
    if (!id) {
      router.replace("/ai");
      return;
    }
    setTripId(id);
    getTrip(id)
      .then((data) => setMessages(data.ask || []))
      .catch((e) => setError(e.message));
  }, [router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, sendError]);

  async function submit() {
    if (!text.trim() || !tripId || sending) return;
    const userText = text.trim();
    setText("");
    setSendError("");
    setSending(true);
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    try {
      const answer = await askAi({ tripId, message: userText });
      setMessages((prev) => [...prev, { role: "ai", text: answer }]);
    } catch (e) {
      console.error("[ai-ask] 질문 요청 실패:", e);
      setSendError(friendlyErrorMessage(e.message));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="screen-scroll no-tab" style={{ display: "flex", flexDirection: "column" }} ref={scrollRef}>
      <Header title="AI에게 질문하기" backHref="/ai/chat" showHome />
      <div className="container">
        <div className="h1">번역이나 여행 관련 질문을 물어보세요.</div>
        <div className="body-sm" style={{ marginTop: 6, marginBottom: 22 }}>
          일정은 바뀌지 않아요. 순수하게 궁금한 걸 물어보는 화면이에요.
        </div>

        {error && <div className="body-sm" style={{ color: "var(--red)", marginBottom: 16 }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {messages.length === 0 && (
            <div className="body-sm">
              아직 질문한 내역이 없어요. 예: &ldquo;이 문장 일본어로 번역해줘: 화장실이 어디예요?&rdquo;,
              &ldquo;오사카는 뭐가 유명해?&rdquo;, &ldquo;일본 콘센트 모양이 어떻게 돼?&rdquo;
            </div>
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
          {sending && (
            <div className={styles.msgAiRow}>
              <div className={styles.botIcon}>
                <Image src="/images/ai-avatar.png" alt="AI" width={40} height={40} />
              </div>
              <div className={styles.msgAi} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Spinner size={16} />
                <span>AI가 답변을 준비하고 있어요...</span>
              </div>
            </div>
          )}
          {!sending && sendError && (
            <div className={styles.msgAiRow}>
              <div className={styles.botIcon}>
                <Image src="/images/ai-avatar.png" alt="AI" width={40} height={40} />
              </div>
              <div className={styles.msgAi} style={{ color: "var(--red)" }}>
                {sendError}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.inputBar}>
        <input
          placeholder="번역하거나 궁금한 걸 물어보세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={sending}
        />
        <button className={styles.sendBtn} onClick={submit} aria-label="전송" disabled={sending || !text.trim()}>
          <Icon name="send" size={16} />
        </button>
      </div>

      <div className="container" style={{ marginTop: 20, paddingBottom: 24 }}>
        {/* 입력창 옆 전송 아이콘과 기능이 겹치던 버튼이라, 질문을 한 번 더
            보내는 용도 대신 일정 수정 화면으로 이동하는 용도로 바꿨습니다. */}
        <Link href="/ai/chat">
          <Button variant="primary">AI에게 일정 수정 요청하기</Button>
        </Link>
      </div>
    </div>
  );
}
