// Simple inline SVG icon set matching the PATH prototype's line-icon style.
export function IconHome({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v5h3a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Filled navy house glyph — matches the bottom-nav / sidebar "홈" icon in the
// PATH prototype exactly (always solid-filled, regardless of active state).
export function IconHomeFilled({ className = "" }) {
  // 아이콘 도형(지붕 꼭짓점 y=-8 ~ 바닥 y=15)이 이전 viewBox(-14 -14 28 28)의
  // 세로 중앙(0)보다 아래로 3.5만큼 치우쳐 있어서, 다른 하단바 아이콘들과 달리
  // 살짝 작고 아래로 처져 보였습니다. viewBox의 세로 시작점을 도형 중심(3.5)에
  // 맞춰 옮겨서 정중앙에 오도록 고쳤습니다.
  return (
    <svg viewBox="-14 -10.5 28 28" fill="none" className={className}>
      <path d="M0 -8L11 1V11.5C11 13.4 9.4 15 7.5 15H-7.5C-9.4 15-11 13.4-11 11.5V1L0-8Z" fill="currentColor" />
      <path d="M-3 15V7H3V15" fill="white" />
    </svg>
  );
}

// Two-tone sparkle glyph — matches the bottom-nav / sidebar "AI 여행" icon
// exactly (a large navy sparkle with a small orange sparkle overlapping it).
// 모양은 ai-travel02-solid.svg를 그대로 따르되, 하단바 브랜드 톤(네이비+오렌지
// 2색)은 그대로 유지합니다.
export function IconSparkleDual({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M1 11.0004C1 10.7409 1.18479 10.5193 1.4377 10.4612C5.90986 9.43336 9.43336 5.90986 10.4612 1.4377C10.5193 1.18479 10.7409 1 11.0004 1C11.2596 1 11.481 1.18428 11.5394 1.43676C12.5743 5.90935 16.0903 9.43327 20.5623 10.4612C20.8152 10.5193 21 10.7409 21 11.0004C21 11.2596 20.8157 11.481 20.5632 11.5394C16.0905 12.5743 12.5665 16.0905 11.5387 20.5627C11.4807 20.8154 11.2593 21 11 21C10.7407 21 10.5193 20.8154 10.4613 20.5627C9.43348 16.0905 5.90949 12.5743 1.43676 11.5394C1.18428 11.481 1 11.2596 1 11.0004Z"
        fill="#1e2761"
      />
      <path
        d="M15 19.0002C15 18.8964 15.0739 18.8077 15.1751 18.7845C16.9639 18.3733 18.3733 16.9639 18.7845 15.1751C18.8077 15.0739 18.8964 15 19.0002 15C19.1038 15 19.1924 15.0737 19.2158 15.1747C19.6297 16.9637 21.0361 18.3733 22.8249 18.7845C22.9261 18.8077 23 18.8964 23 19.0002C23 19.1038 22.9263 19.1924 22.8253 19.2158C21.0362 19.6297 19.6266 21.0362 19.2155 22.8251C19.1923 22.9262 19.1037 23 19 23C18.8963 23 18.8077 22.9262 18.7845 22.8251C18.3734 21.0362 16.9638 19.6297 15.1747 19.2158C15.0737 19.1924 15 19.1038 15 19.0002Z"
        fill="#f4a268"
      />
    </svg>
  );
}

// viewBox tightened from the default 0 0 24 24 so the glyph fills the same
// visual proportion as the other bottom-nav / sidebar icons (they were
// rendering noticeably smaller than IconHomeFilled/IconSparkleDual otherwise).
export function IconMap({ className = "" }) {
  return (
    <svg viewBox="1 1 22 22" fill="none" className={className}>
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconSparkle({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M1 11.0004C1 10.7409 1.18479 10.5193 1.4377 10.4612C5.90986 9.43336 9.43336 5.90986 10.4612 1.4377C10.5193 1.18479 10.7409 1 11.0004 1C11.2596 1 11.481 1.18428 11.5394 1.43676C12.5743 5.90935 16.0903 9.43327 20.5623 10.4612C20.8152 10.5193 21 10.7409 21 11.0004C21 11.2596 20.8157 11.481 20.5632 11.5394C16.0905 12.5743 12.5665 16.0905 11.5387 20.5627C11.4807 20.8154 11.2593 21 11 21C10.7407 21 10.5193 20.8154 10.4613 20.5627C9.43348 16.0905 5.90949 12.5743 1.43676 11.5394C1.18428 11.481 1 11.2596 1 11.0004Z" />
      <path d="M15 19.0002C15 18.8964 15.0739 18.8077 15.1751 18.7845C16.9639 18.3733 18.3733 16.9639 18.7845 15.1751C18.8077 15.0739 18.8964 15 19.0002 15C19.1038 15 19.1924 15.0737 19.2158 15.1747C19.6297 16.9637 21.0361 18.3733 22.8249 18.7845C22.9261 18.8077 23 18.8964 23 19.0002C23 19.1038 22.9263 19.1924 22.8253 19.2158C21.0362 19.6297 19.6266 21.0362 19.2155 22.8251C19.1923 22.9262 19.1037 23 19 23C18.8963 23 18.8077 22.9262 18.7845 22.8251C18.3734 21.0362 16.9638 19.6297 15.1747 19.2158C15.0737 19.1924 15 19.1038 15 19.0002Z" />
    </svg>
  );
}

// 찜 목록에서 쓰는(더 예쁜) 하트 모양으로 통일 — 하단바에서는 항상
// 색이 채워지지 않은(outline) 버전으로 사용합니다.
export function IconHeart({ className = "", filled = false }) {
  return (
    <svg viewBox="0 2 24 20" fill={filled ? "currentColor" : "none"} className={className}>
      <path d="M12 20.5s-7.2-4.5-9.7-9C.7 8 2 4.5 5.4 4A5 5 0 0 1 12 6.7 5 5 0 0 1 18.6 4C22 4.5 23.3 8 21.7 11.5c-2.5 4.5-9.7 9-9.7 9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function IconUser({ className = "" }) {
  return (
    <svg viewBox="1 1 22 22" fill="none" className={className}>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevronLeft({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronRight({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSend({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 12 20 4l-6 16-3-7-7-1Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fill="currentColor" />
    </svg>
  );
}

export function IconSearch({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="m5 13 4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPin({ className = "", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill={color} />
      <circle cx="12" cy="12" r="4" fill="white" />
    </svg>
  );
}
