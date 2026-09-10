// ODPT(공공교통 오픈데이터, https://www.odpt.org) 연동 — 선택 기능
//
// 팀 계획서에도 정리했듯, ODPT는 별도 사이트 가입/승인(최대 영업일 2일)이 필요하고
// 사업자(Tobu 등)에 따라 라이선스가 갈립니다. 이 프로젝트에서는:
//   - ODPT_API_KEY가 없으면 이 Tool은 그냥 "설정 안 됨"을 반환하고 Agent는
//     Google Routes 결과만으로 경로를 안내합니다 (MVP 기본 동작).
//   - 키가 있으면 도쿄메트로/도에이 지하철의 실시간 운행정보(odpt:TrainInformation)를
//     조회해 지연/운休 여부 같은 "실시간성"을 덧붙입니다.
//
// 실시간 데이터는 ODPT 가이드라인에 따라 생성시각(dc:date)을 함께 표시해야 하므로
// 응답에 generatedAt을 그대로 포함합니다.

const BASE = "https://api.odpt.org/api/v4";

const OPERATOR_MAP = {
  metro: "odpt.Operator:TokyoMetro",
  tokyometro: "odpt.Operator:TokyoMetro",
  메트로: "odpt.Operator:TokyoMetro",
  도쿄메트로: "odpt.Operator:TokyoMetro",
  toei: "odpt.Operator:Toei",
  도영: "odpt.Operator:Toei",
  도에이: "odpt.Operator:Toei",
};

export function isOdptConfigured() {
  return Boolean(process.env.ODPT_API_KEY);
}

function guessOperators(text = "") {
  const lower = text.toLowerCase();
  const found = new Set();
  for (const [kw, operator] of Object.entries(OPERATOR_MAP)) {
    if (lower.includes(kw)) found.add(operator);
  }
  // 키워드가 없으면 MVP 범위(팀 계획서 기준)인 도쿄메트로+도에이 모두 조회
  if (found.size === 0) {
    found.add("odpt.Operator:TokyoMetro");
    found.add("odpt.Operator:Toei");
  }
  return [...found];
}

export async function checkTransitOperations(queryText = "") {
  if (!isOdptConfigured()) {
    return {
      configured: false,
      message:
        "ODPT가 설정되지 않아 이 단계는 건너뜁니다. Google Routes의 실제 노선 계산 결과를 기준으로 안내합니다.",
    };
  }

  const key = process.env.ODPT_API_KEY;
  const operators = guessOperators(queryText);
  const results = [];
  for (const operator of operators) {
    try {
      const url = `${BASE}/odpt:TrainInformation?odpt:operator=${encodeURIComponent(
        operator
      )}&acl:consumerKey=${encodeURIComponent(key)}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      for (const item of data || []) {
        results.push({
          operator,
          railway: item["odpt:railway"],
          status: item["odpt:trainInformationText"]?.ja || item["odpt:trainInformationText"] || "정상 운행",
          generatedAt: item["dc:date"],
        });
      }
    } catch {
      // ODPT 쪽 문제는 전체 흐름을 막지 않고 조용히 건너뜁니다.
    }
  }

  return {
    configured: true,
    attribution: "교통 공공데이터 출처: 東京都交通局 / 公共交通オープンデータ協議会",
    results,
  };
}
