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
import { resizeImageFile } from "@/lib/resizeImage";
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
  const [pendingImage, setPendingImage] = useState(null); // 전송 전 미리보기 (resize된 data URL)
  const [imageError, setImageError] = useState("");
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // 사진 선택 → 용량을 줄여서 미리보기로 띄워둡니다. 실제 전송은 "전송" 버튼을
  // 눌렀을 때 이루어집니다(사진만 먼저 첨부해두고 설명을 마저 입력할 수 있게).
  async function handlePickImage(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // 같은 파일을 다시 선택해도 onChange가 다시 발생하도록 초기화
    if (!file) return;
    setImageError("");
    try {
      const resized = await resizeImageFile(file);
      setPendingImage(resized);
    } catch (err) {
      console.error("[ai-ask] 이미지 처리 실패:", err);
      setImageError(err.message || "사진을 처리하지 못했어요.");
    }
  }

  async function submit() {
    const userText = text.trim();
    if ((!userText && !pendingImage) || !tripId || sending) return;
    const imageToSend = pendingImage;
    setText("");
    setPendingImage(null);
    setImageError("");
    setSendError("");
    setSending(true);
    setMessages((prev) => [...prev, { role: "user", text: userText, image: imageToSend }]);

    try {
      const answer = await askAi({ tripId, message: userText, image: imageToSend });
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
          일정은 바뀌지 않아요. 메뉴판·표지판 사진을 올리면 그 안의 일본어도 읽어서 번역해드려요.
        </div>

        {error && <div className="body-sm" style={{ color: "var(--red)", marginBottom: 16 }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {messages.length === 0 && (
            <div className="body-sm">
              아직 질문한 내역이 없어요. 예: &ldquo;이 문장 일본어로 번역해줘: 화장실이 어디예요?&rdquo;,
              &ldquo;오사카는 뭐가 유명해?&rdquo;, 또는 메뉴판 사진을 찍어서 올려보세요.
            </div>
          )}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div className={styles.msgUser} key={i}>
                {m.image && (
                  // eslint-disable-next-line @next/next/no-img-element -- 리사이즈된 data URL이라 next/image 최적화 대상이 아님
                  <img src={m.image} alt="첨부한 사진" className={styles.msgImage} />
                )}
                {m.text && <div className={m.image ? styles.msgTextWithImage : undefined}>{m.text}</div>}
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

      {imageError && (
        <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="body-sm" style={{ color: "var(--red)", margin: "8px 0 0" }}>{imageError}</div>
        </div>
      )}

      {pendingImage && (
        <div className={styles.imagePreviewBar}>
          <img src={pendingImage} alt="첨부할 사진 미리보기" className={styles.imagePreviewThumb} />
          <span className="body-sm">사진 1장 첨부됨</span>
          <button
            type="button"
            className={styles.imagePreviewRemove}
            onClick={() => setPendingImage(null)}
            aria-label="첨부한 사진 삭제"
            disabled={sending}
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      <div className={styles.inputBar}>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handlePickImage}
          style={{ display: "none" }}
        />
        <button
          type="button"
          className={styles.attachBtn}
          onClick={() => fileInputRef.current?.click()}
          aria-label="사진 첨부"
          disabled={sending}
        >
          <Icon name="camera" size={16} />
        </button>
        <input
          placeholder="번역하거나 궁금한 걸 물어보세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={sending}
        />
        <button
          className={styles.sendBtn}
          onClick={submit}
          aria-label="전송"
          disabled={sending || (!text.trim() && !pendingImage)}
        >
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
