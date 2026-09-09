"use client";

// 실제 지도 타일 대신, PATH 톤(연그린 배경 + 그리드)에 맞춘 스타일화된 지도 배경입니다.
// viewBox를 화면 비율에 맞게 바꿔 쓸 수 있도록 일반화했습니다. (기존 호출부는
// viewBox 기본값(0 0 360 320)이 그대로 유지되어 동작이 바뀌지 않습니다.)
export default function MapArt({
  markers = [],
  path,
  paths,
  parks = [],
  height = 320,
  className = "",
  viewBox = "0 0 360 320",
  preserveAspectRatio = "xMidYMid slice",
  // fill=true면 부모(칸이 position:relative인 요소)를 완전히 덮는
  // position:absolute; inset:0 요소로 렌더링합니다. 이전에는 호출부에서
  // className="absolute inset-0"를 넘겨 처리했는데, 이 컴포넌트 자체의
  // 인라인 style에 position:"relative"가 박혀 있어 className으로 넘어온
  // "absolute"가 항상 무시되고(인라인 style이 클래스보다 우선) 실제로는
  // relative(=일반 흐름)로 렌더링되는 버그가 있었습니다. 그 결과 지도가
  // 문서 흐름에 실제 높이를 차지하게 되어, 지도+카드 전체 높이가 한 화면을
  // 넘어가고 하단 탭바 영역까지 밀려 내려가는 문제가 있었습니다.
  fill = false,
}) {
  const [vx, vy, vw, vh] = viewBox.split(" ").map(Number);
  const polylines = paths || (path ? [path] : []);

  const cell = 45;
  const cols = Math.round(vw / cell);
  const rows = Math.round(vh / cell);
  const vLines = Array.from({ length: cols + 1 }, (_, i) => vx + (vw / cols) * i);
  const hLines = Array.from({ length: rows + 1 }, (_, i) => vy + (vh / rows) * i);

  const gridStroke = vw * 0.0028;
  const pathStroke = vw * 0.0083;
  const markerR = vw * 0.0194;
  const markerStroke = vw * 0.0069;

  return (
    <div
      className={className}
      style={
        fill
          ? {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              background: "#dcebe0",
              overflow: "hidden",
            }
          : {
              position: "relative",
              width: "100%",
              height,
              background: "#dcebe0",
              overflow: "hidden",
            }
      }
    >
      <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio={preserveAspectRatio}>
        <rect x={vx} y={vy} width={vw} height={vh} fill="#dfeee3" />
        {vLines.map((x) => (
          <line key={`v${x}`} x1={x} y1={vy} x2={x} y2={vy + vh} stroke="#cfe3d5" strokeWidth={gridStroke} />
        ))}
        {hLines.map((y) => (
          <line key={`h${y}`} x1={vx} y1={y} x2={vx + vw} y2={y} stroke="#cfe3d5" strokeWidth={gridStroke} />
        ))}
        {parks.map((p, i) => (
          <rect
            key={i}
            x={p.x}
            y={p.y}
            width={p.w}
            height={p.h}
            rx={p.rx ?? vw * 0.035}
            fill="#cfe3d0"
          />
        ))}
        {polylines.map((p, i) => (
          <polyline
            key={i}
            points={p.map((pt) => `${pt.x},${pt.y}`).join(" ")}
            fill="none"
            stroke="#1e2761"
            strokeWidth={pathStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {markers.map((m, i) => (
          <g key={i} transform={`translate(${m.x} ${m.y})`}>
            <circle r={markerR} fill={m.color || "#1e2761"} stroke="#fff" strokeWidth={markerStroke} />
          </g>
        ))}
      </svg>
      {markers.map((m, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${((m.x - vx) / vw) * 100}%`,
            top: `${((m.y - vy) / vh) * 100}%`,
            transform: "translate(10px, -50%)",
            background: "#fff",
            borderRadius: 999,
            padding: "5px 10px",
            fontSize: 12,
            fontWeight: 700,
            color: "#1b1f2a",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            whiteSpace: "nowrap",
          }}
        >
          {m.label}
        </div>
      ))}
    </div>
  );
}
