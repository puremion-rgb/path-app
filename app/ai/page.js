"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import BottomNav from "@/components/BottomNav";
import { quickTags, suggestedPrompts } from "@/lib/mockData";
import { setPendingRequest } from "@/lib/tripStore";
import styles from "./page.module.css";

const PROMPT_PLACEHOLDER =
  "예: 내일 오전 9시 신주쿠에서 출발해서 센소지와 스카이트리를 가고 싶어. 부모님과 함께라 많이 걷지 않는 일정으로 만들어줘.";

const PC_CONDITIONS = ["도보 최소", "환승 최소", "맛집 포함"];

// 빠른 조건 태그를 누르면 그 문구를 대화창(요청 텍스트) 끝에 붙여주고,
// 다시 누르면 그 문구만 정확히 찾아서 지워줍니다 — 버튼이 눌렸는지 아닌지는
// "그 단어가 대화창 안에 있는지"로 판단하기 때문에, 사용자가 텍스트를 직접 지워도
// 다음 클릭부터는 다시 정상적으로 추가/삭제됩니다.
function appendTagToText(current, tag) {
  const trimmed = current.trimEnd();
  if (!trimmed) return tag;
  if (trimmed.includes(tag)) return current; // 이미 들어있으면 중복 추가하지 않음
  const sep = /[.!?]$/.test(trimmed) ? " " : ", ";
  return `${trimmed}${sep}${tag}`;
}

function removeTagFromText(current, tag) {
  if (current.includes(`, ${tag}`)) return current.replace(`, ${tag}`, "").trimEnd();
  if (current.includes(` ${tag}`)) return current.replace(` ${tag}`, "").trimEnd();
  return current.replace(tag, "").trimEnd();
}

export default function AiRequestPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [tags, setTags] = useState(() => new Set());
  const [pcTags, setPcTags] = useState(() => new Set());

  function toggleTag(tag) {
    setTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
        setText((t) => removeTagFromText(t, tag));
      } else {
        next.add(tag);
        setText((t) => appendTagToText(t, tag));
      }
      return next;
    });
  }

  function togglePcTag(tag) {
    setPcTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
        setText((t) => removeTagFromText(t, tag));
      } else {
        next.add(tag);
        setText((t) => appendTagToText(t, tag));
      }
      return next;
    });
  }

  function submit() {
    if (!text.trim()) return;
    // 조건 문구는 이미 위에서 text에 반영되어 있으므로, message 하나만 보내면 됩니다.
    setPendingRequest({ message: text.trim(), conditions: [...tags, ...pcTags] });
    router.push("/ai/analyzing");
  }

  return (
    <>
      {/* ---------- 모바일 ---------- */}
      {/* "AI 여행"은 하단 탭바의 5개 탭 중 하나(탭 루트 화면)라 다른 4개
          탭(홈/지도/찜/MY)과 마찬가지로 하단바가 계속 보여야 다른 탭으로
          바로 이동할 수 있습니다. (기존에는 no-tab이라 이 화면에 들어오면
          하단바가 사라져서 홈으로 돌아가기 불편했습니다) */}
      <div className="screen-scroll lg:hidden">
        <Header title="AI 여행 만들기" />
        <div className="container">
          <div className="h1">어떤 여행을 도와드릴까요?</div>
          <div className="body-sm" style={{ marginTop: 4, marginBottom: 14 }}>
            평소 말하듯 편하게 입력해주세요.
          </div>

          <div className={styles.prompt}>
            <textarea
              className={styles.textarea}
              value={text}
              maxLength={500}
              placeholder={PROMPT_PLACEHOLDER}
              onChange={(e) => setText(e.target.value)}
            />
            <div className={styles.promptFooter}>
              <span className={styles.count}>{text.length} / 500</span>
              <button
                className={styles.sendBtn}
                onClick={submit}
                disabled={!text.trim()}
                aria-label="일정 만들기"
              >
                <Icon name="send" size={18} />
              </button>
            </div>
          </div>

          <div className={styles.sectionTitle}>빠른 조건</div>
          <div className={styles.quickGrid}>
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={tags.has(tag)}
                className={`${styles.quickChip} ${tags.has(tag) ? styles.quickChipActive : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className={styles.sectionTitle}>이런 요청도 많이 해요</div>
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              className={styles.suggestItem}
              onClick={() => setText((t) => appendTagToText(t, p))}
            >
              {p}
            </button>
          ))}
        </div>

        <div className={styles.footer}>
          <Button variant="primary" onClick={submit} icon={<Icon name="sparkle" size={17} filled />}>
            여행 일정 만들기
          </Button>
        </div>
      </div>

      {/* ---------- PC (프로토타입 "PC AI 여행 만들기": 좌 요청폼 / 우 미리보기) ---------- */}
      <div className="hidden flex-1 flex-col lg:flex">
        <header className="flex shrink-0 items-center border-b border-line px-10 py-6">
          <h1 className="text-[20px] font-bold text-navy-deep">AI 여행 만들기</h1>
        </header>

        <div className="flex flex-1 gap-8 bg-[#eef2fb] px-10 py-8">
          <div className="flex w-[500px] shrink-0 flex-col">
            <h2 className="text-[14px] font-bold text-navy-deep">AI에게 요청하는 내용</h2>
            <div className="mt-3 rounded-2xl border border-line bg-white p-5">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                maxLength={500}
                placeholder="텍스트 입력"
                className="w-full resize-none text-[15px] leading-7 text-navy-deep outline-none placeholder:text-muted"
              />
            </div>

            <h2 className="mt-6 text-[14px] font-bold text-navy-deep">추천 조건</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {PC_CONDITIONS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => togglePcTag(tag)}
                  aria-pressed={pcTags.has(tag)}
                  className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold transition ${
                    pcTags.has(tag)
                      ? "border-navy bg-[#dfe6fb] text-navy-deep"
                      : "border-line bg-white text-navy-deep/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <h2 className="mt-6 text-[14px] font-bold text-navy-deep">사진으로 알려주기</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex h-24 items-center justify-center rounded-2xl bg-[#e4e9f4] text-[13px] text-muted"
                >
                  이미지 첨부
                </div>
              ))}
            </div>

            <button
              onClick={submit}
              className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-navy text-[15px] font-bold text-white"
            >
              AI에게 일정 만들기 →
            </button>
          </div>

          <div className="flex flex-1 flex-col">
            <h2 className="text-[14px] font-bold text-navy-deep">이런 여행은 어때요? (미리보기)</h2>
            <div className="mt-3 flex flex-1 items-center justify-center rounded-2xl bg-[#e4e9f4] text-[15px] text-muted">
              지도 · 추천 코스 미리보기
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2">
        <BottomNav />
      </div>
    </>
  );
}
