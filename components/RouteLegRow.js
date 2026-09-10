"use client";

import Icon from "@/components/Icon";
import { legIconName } from "@/lib/transitIcon";

// "이동 경로" 화면(app/ai/route, app/map/route)에서 구간(leg) 한 줄을 보여주는
// 공용 컴포넌트입니다. 예전에는 두 화면이 각자 따로 마크업을 짜서 아이콘 유무 등
// 디자인이 서로 달랐고, 오른쪽 설명(detail) 텍스트가 길면 화면 밖으로 넘치는
// 버그도 있었습니다. 아이콘은 leg.mode 문구(버스/지하철/택시/비행기/도보 등)를 보고
// 자동으로 골라주고, 텍스트는 길어지면 줄바꿈되도록(overflow 방지) 만들었습니다.
export default function RouteLegRow({ leg }) {
  const isWalk = leg.mode?.includes("도보");
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span
        style={{
          display: "flex",
          height: 30,
          width: 30,
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: isWalk ? "#12173f" : "#2f6fed",
          color: "#fff",
        }}
      >
        <Icon name={legIconName(leg.mode)} size={16} strokeWidth={2} />
      </span>
      <span style={{ fontWeight: 700, fontSize: 14.5, flexShrink: 0, paddingTop: 6, minWidth: 0 }}>
        {leg.mode}
      </span>
      <span
        className="body-sm"
        style={{
          marginLeft: "auto",
          textAlign: "right",
          minWidth: 0,
          overflowWrap: "anywhere",
          paddingTop: 6,
        }}
      >
        {leg.detail}
      </span>
    </div>
  );
}
