// 실제 촬영 사진을 사용하는 장소 썸네일. (my-app 참고)
// 매칭되는 사진이 없으면 브랜드 톤 그라디언트로 대체됩니다.
const PHOTOS = {
  센소지: "/images/sensoji.jpg",
  스카이트리: "/images/skytree.jpg",
  시부야: "/images/shibuya.jpg",
  "시부야 스크램블": "/images/shibuya.jpg",
  "이치란 라멘": "/images/ichiran.jpg",
  "이마카리 라멘": "/images/ichiran.jpg",
  "우에노 공원": "/images/ueno.jpg",
  "신주쿠 교엔": "/images/shinjuku.jpg",
  신주쿠: "/images/shinjuku.jpg",
  "이자카야 하나": "/images/izakaya.jpg",
  "아사쿠사 게스트하우스": "/images/guesthouse.jpg",
  "스시 다이": "/images/izakaya.jpg",
};

const GRADIENTS = {
  센소지: "linear-gradient(160deg,#3a0d0d,#7a1f1f 55%,#c0432b)",
  스카이트리: "linear-gradient(160deg,#0b1f3a,#123a63 55%,#2f6fb0)",
  시부야: "linear-gradient(160deg,#101010,#28324a 55%,#4f7cc9)",
  "우에노 공원": "linear-gradient(160deg,#0f2a1c,#1f4a2e 55%,#5a9a5f)",
  신주쿠: "linear-gradient(160deg,#0d1f3d,#1c3a63 55%,#3f6ea6)",
  default: "linear-gradient(160deg,#16215c,#2d3f8f)",
};

export default function PlacePhoto({ name, className = "", labelClassName = "" }) {
  const photo = PHOTOS[name];

  return (
    <div
      className={`relative flex items-end overflow-hidden ${className}`}
      style={!photo ? { background: GRADIENTS[name] ?? GRADIENTS.default } : undefined}
    >
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={name} className="absolute inset-0 h-full w-full object-cover" />
      )}
      <span className={`relative z-10 px-3 pb-2.5 text-[14px] font-bold text-white ${labelClassName}`}>
        {name}
      </span>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
    </div>
  );
}
