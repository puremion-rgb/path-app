"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { getTrip, modifyTrip } from "@/lib/apiClient";
import { getCurrentTripId, setLastChangeDiff } from "@/lib/tripStore";
import { friendlyErrorMessage } from "@/lib/friendlyError";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import styles from "./page.module.css";

// 진행 단계(step) id별로 대화창 안에 잠깐 보여줄 안내 문구입니다.
const STEP_LABELS = {
  places: "방문 장소를 확인하고 있어요...",
  routes: "이동 경로를 계산하고 있어요...",
  transit: "교통 정보를 확인하고 있어요...",
  rag: "여행 팁을 찾고 있어요...",
};

// 이 화면은 "일정 수정" 전용입니다. 번역/여행 상식 같은 일반 질문은
// 별도의 "AI에게 질문하기"(/ai/ask) 화면에서 처리합니다 — 한 화면에서 AI가
// 매번 "이게 수정 요청인지 질문인지"를 판단하게 하는 대신, 화면 자체를
// 나눠서 목적을 명확히 하고, 질문 쪽은 일정 데이터 없이 훨씬 가볍게 처리합니다.
export default function AiChatPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [tripId, setTripId] = useState(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingLabel, setPendingLabel] = useState("");
  const [sendError, setSendError] = useState("");
  const scrollRef = useRef(null);

  // 걸어다니면서 타이핑하기 어려울 때 말로 입력할 수 있도록 브라우저 내장
  // 음성 인식을 붙였습니다. 인식된 문장은 입력창에 채워지기만 하고, 전송은
  // 기존처럼 사용자가 직접 "전송" 버튼을 눌러야 합니다(잘못 인식된 문장이
  // 바로 전송되지 않도록).
  const { supported: micSupported, listening, error: micError, toggle: toggleMic } = useSpeechRecognition({
    onResult: (transcript) => {
      setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    },
  });

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

  // 대화가 길어져서 화면이 다 안 보일 때도, 새 메시지·로딩 표시·오류가 화면
  // 아래쪽(입력창 바로 위)에 나타나면 놓치지 않도록 자동으로 맨 아래로
  // 스크롤합니다. (오류를 못 보고 "아무 반응 없다"고 느끼는 걸 방지)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, sendError]);

  // 예전에는 메시지를 보내면 별도의 "AI 재분석 중" 화면으로 이동해서 처리했는데,
  // 응답이 오래 걸릴 때 화면을 나갔다 들어오면 같은 메시지가 중복 전송되는
  // 문제가 있었습니다. 그래서 지금은 이 채팅 화면을 벗어나지 않고, 로딩 표시만
  // 대화 안에 보여준 뒤 일정이 바뀌면 결과 화면으로 이동합니다.
  async function submit() {
    if (!text.trim() || !tripId || sending) return;
    const userText = text.trim();
    setText("");
    setSendError("");
    setSending(true);
    setPendingLabel("AI가 답변을 준비하고 있어요...");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    try {
      const beforeTrip = await getTrip(tripId);
      const beforeItinerary = beforeTrip.trip.itinerary;

      const res = await modifyTrip({ tripId, message: userText }, (stepId, patch) => {
        if (patch.status === "active" && STEP_LABELS[stepId]) {
          setPendingLabel(STEP_LABELS[stepId]);
        }
      });

      if (res.trip) {
        setLastChangeDiff({ beforeItinerary, trip: res.trip });
        router.push("/ai/changed");
        return;
      }
    } catch (e) {
      // 원본 오류(Gemini 429 등 기술적인 긴 메시지)는 콘솔에 남겨서 나중에
      // 확인할 수 있게 하고, 화면에는 알기 쉬운 문구만 보여줍니다.
      console.error("[ai-chat] modify 요청 실패:", e);
      setSendError(friendlyErrorMessage(e.message));
    } finally {
      setSending(false);
      setPendingLabel("");
    }
  }

  return (
    <div className="screen-scroll no-tab" style={{ display: "flex", flexDirection: "column" }} ref={scrollRef}>
      <Header title="AI와 대화하기" backHref="/ai/result" showHome />
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
          {sending && (
            <div className={styles.msgAiRow}>
              <div className={styles.botIcon}>
                <Image src="/images/ai-avatar.png" alt="AI" width={40} height={40} />
              </div>
              <div className={styles.msgAi} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Spinner size={16} />
                <span>{pendingLabel || "AI가 답변을 준비하고 있어요..."}</span>
              </div>
            </div>
          )}
          {!sending && sendError && (
            // 답변을 기다리는 위치와 같은 자리(대화 맨 아래)에 오류를 보여줘야
            // 대화를 쭉 내려서 보고 있던 사용자도 놓치지 않고 바로 알아챌 수 있습니다.
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

      {micError && (
        <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="body-sm" style={{ color: "var(--red)", margin: "8px 0 0" }}>{micError}</div>
        </div>
      )}

      <div className={styles.inputBar}>
        {micSupported && (
          <button
            type="button"
            className={`${styles.micBtn} ${listening ? styles.micBtnActive : ""}`}
            onClick={toggleMic}
            aria-label={listening ? "음성 입력 중지" : "음성으로 입력"}
            disabled={sending}
          >
            <Icon name="mic" size={16} />
          </button>
        )}
        <input
          placeholder={listening ? "듣고 있어요..." : "추가로 요청해보세요..."}
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
        {/* 입력창 옆 전송 아이콘과 기능이 겹치던 버튼이라, 수정 요청을 한 번 더
            보내는 용도 대신 번역/일반 질문 전용 화면으로 이동하는 용도로 바꿨습니다. */}
        <Link href="/ai/ask">
          <Button variant="primary">AI에게 질문하기</Button>
        </Link>
      </div>
    </div>
  );
}
