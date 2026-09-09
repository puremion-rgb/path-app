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
  return (
    <svg viewBox="-14 -14 28 28" fill="none" className={className}>
      <path d="M0 -8L11 1V11.5C11 13.4 9.4 15 7.5 15H-7.5C-9.4 15-11 13.4-11 11.5V1L0-8Z" fill="currentColor" />
      <path d="M-3 15V7H3V15" fill="white" />
    </svg>
  );
}

// Two-tone sparkle glyph — matches the bottom-nav / sidebar "AI 여행" icon
// exactly (a large navy sparkle with a small orange sparkle overlapping it).
export function IconSparkleDual({ className = "" }) {
  return (
    <svg viewBox="-18 -18 36 36" fill="none" className={className}>
      <path d="M0-14C1.5-5 5-1.5 14 0C5 1.5 1.5 5 0 14C-1.5 5-5 1.5-14 0C-5-1.5-1.5-5 0-14Z" fill="#1e2761" />
      <path d="M12-3C12.8.4 14.5 2.2 18 3C14.5 3.8 12.8 5.6 12 9C11.2 5.6 9.5 3.8 6 3C9.5 2.2 11.2.4 12-3Z" fill="#f4a268" />
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
      <path d="M12 2c.6 3.6 1.8 4.9 5.4 5.5-3.6.6-4.8 1.9-5.4 5.5-.6-3.6-1.8-4.9-5.4-5.5C10.2 6.9 11.4 5.6 12 2Z" />
      <path d="M19 14c.3 1.8.9 2.4 2.7 2.7-1.8.3-2.4.9-2.7 2.7-.3-1.8-.9-2.4-2.7-2.7 1.8-.3 2.4-.9 2.7-2.7Z" />
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
