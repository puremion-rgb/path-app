// 이동 경로의 각 구간(leg)에 어떤 아이콘을 붙일지 결정합니다.
// leg.mode는 lib/google/routes.js의 VEHICLE_LABEL(버스/지하철/기차 등)이나
// AI가 직접 적은 한국어 문구("도보 이동", "택시로 이동" 등)를 담고 있어서,
// 정확한 enum이 아니라 문구에 포함된 키워드로 판단합니다.
export function legIconName(mode = "") {
  const text = String(mode || "");
  if (text.includes("도보") || text.includes("걷기")) return "walk";
  if (text.includes("지하철") || text.includes("메트로")) return "subway";
  if (text.includes("버스")) return "bus";
  if (text.includes("택시")) return "taxi";
  if (text.includes("비행기") || text.includes("항공")) return "plane";
  // 기차/전철/트램/모노레일 등 그 외 대중교통은 기존 범용 열차 아이콘을 사용합니다.
  return "train";
}
