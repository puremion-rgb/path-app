"use client";

// 라인 스타일 아이콘 세트. 외부 아이콘 패키지 없이 프로젝트 톤에 맞춰 직접 정의합니다.
const paths = {
  home: (
    <path d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
  ),
  map: (
    <>
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  ai: (
    <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7 10.4 12.2 5 10.6 10.4 9 12 3.5Z" />
  ),
  heart: (
    <path d="M12 20.5s-7.2-4.5-9.7-9C.7 8 2 4.5 5.4 4A5 5 0 0 1 12 6.7 5 5 0 0 1 18.6 4C22 4.5 23.3 8 21.7 11.5c-2.5 4.5-9.7 9-9.7 9Z" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </>
  ),
  back: <path d="M15 5 8 12l7 7" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </>
  ),
  send: <path d="M4 12 20 4l-6 16-3-7-7-3Z" />,
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  sparkle: (
    <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7 10.4 12.2 5 10.6 10.4 9 12 3.5Z" />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  bell: (
    <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9ZM10 18a2 2 0 0 0 4 0" />
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.1-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2.1 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.3-.9c.6.5 1.3.9 2.1 1.2L10 21h4l.5-2.6a7 7 0 0 0 2.1-1.2l2.3.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z" />
    </>
  ),
  headset: (
    <path d="M4 13v-1a8 8 0 0 1 16 0v1M4 13v4a2 2 0 0 0 2 2h1v-6H5a1 1 0 0 0-1 1Zm16 0v4a2 2 0 0 1-2 2h-1v-6h2a1 1 0 0 1 1 1Z" />
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  train: (
    <>
      <rect x="6" y="4" width="12" height="13" rx="4" />
      <path d="M6 13h12M9 21l-2-2M15 21l2-2M9.5 8.5h.01M14.5 8.5h.01" />
    </>
  ),
  swap: <path d="M7 7h11l-3-3M17 17H6l3 3M7 7v10M17 17V7" />,
  ticket: (
    <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1.6 1.6 0 0 0 0 3v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1.6 1.6 0 0 0 0-3V8Zm7-1v10" />
  ),
  walk: (
    <>
      <circle cx="13" cy="4" r="1.6" />
      <path d="M10 21l1.5-6-2-1.5.5-4L14 8l2 3-1.5 1L16 21M9.5 9.5 7 11" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6-5.2 6-10a6 6 0 0 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </>
  ),
  route: <path d="M5 19c3 0 3-6 6-6s3 6 6 6M6 5l6 6M18 5l-6 6" />,
  logout: (
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M15 16l4-4-4-4M8 12h11" />
  ),
  bot: (
    <>
      <rect x="5" y="8" width="14" height="10" rx="4" />
      <path d="M12 4v3M9 13h.01M15 13h.01" />
    </>
  ),
  warn: (
    <>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  refresh: <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M4 4v5h5M20 20v-5h-5" />,
  alert: <path d="M12 7v6M12 17h.01" />,
};

export default function Icon({ name, size = 22, strokeWidth = 1.8, className = "", filled = false }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {d}
    </svg>
  );
}
