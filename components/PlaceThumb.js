"use client";

// 실제 사진 대신, 장소 톤에 맞춘 플랫 일러스트 썸네일을 그립니다.
// (저작권이 있는 사진 자산을 쓰지 않기 위한 대체 표현입니다.)

const TONES = {
  sunset: { from: "#f4a268", to: "#c9557a", sky: "#ffd9a8" },
  twilight: { from: "#334094", to: "#1e2761", sky: "#8fa3e6" },
  night: { from: "#12173f", to: "#1e2761", sky: "#3a4a8c" },
};

export default function PlaceThumb({ tone = "sunset", icon = "pagoda", radius = 16, className = "" }) {
  const c = TONES[tone] || TONES.sunset;
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={{ display: "block", width: "100%", height: "100%", borderRadius: radius }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`g-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.sky} />
          <stop offset="1" stopColor={c.from} />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#g-${tone})`} />
      <circle cx="90" cy="28" r="14" fill="rgba(255,255,255,0.55)" />
      {icon === "pagoda" && (
        <g fill={c.to} opacity="0.92">
          <rect x="52" y="70" width="16" height="30" />
          <polygon points="40,72 80,72 74,60 46,60" />
          <polygon points="44,60 76,60 70,49 50,49" />
          <polygon points="48,49 72,49 66,39 54,39" />
          <rect x="58" y="20" width="4" height="19" />
        </g>
      )}
      {icon === "tower" && (
        <g fill={c.to} opacity="0.92">
          <polygon points="60,20 66,60 72,100 48,100 54,60" />
          <rect x="50" y="100" width="20" height="6" />
          <rect x="56" y="14" width="8" height="10" />
        </g>
      )}
      {icon === "city" && (
        <g fill={c.to} opacity="0.92">
          <rect x="30" y="55" width="14" height="45" />
          <rect x="48" y="40" width="16" height="60" />
          <rect x="68" y="62" width="14" height="38" />
          <rect x="86" y="50" width="12" height="50" />
        </g>
      )}
      {icon === "food" && (
        <g fill={c.to} opacity="0.92">
          <ellipse cx="60" cy="72" rx="26" ry="10" />
          <rect x="34" y="60" width="52" height="14" rx="7" />
          <circle cx="60" cy="60" r="18" />
        </g>
      )}
      {icon === "garden" && (
        <g fill={c.to} opacity="0.92">
          <ellipse cx="40" cy="88" rx="18" ry="8" />
          <ellipse cx="78" cy="92" rx="22" ry="9" />
          <circle cx="40" cy="60" r="16" />
          <circle cx="78" cy="55" r="20" />
          <rect x="38" y="70" width="4" height="18" />
          <rect x="76" y="66" width="4" height="26" />
        </g>
      )}
    </svg>
  );
}
