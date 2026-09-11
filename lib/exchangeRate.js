// 엔화(JPY) → 원화(KRW) 실시간 환율 조회입니다. ("AI에게 질문하기"에서 환율을
// 물어보면 "참고용" 안내만 하고 끝내지 않고, 실제 값으로 바로 답할 수 있게
// 붙였습니다.)
//
// Frankfurter(https://frankfurter.dev)를 씁니다 — 회원가입/API 키가 전혀
// 필요 없는 무료 공개 API라, .env에 새 키를 추가하지 않아도 바로 동작합니다.
// (유럽중앙은행 등 공식 환율 소스를 모아 매일 갱신됩니다.)
//
// 매 질문마다 외부 API를 호출하지 않도록 서버 메모리에 잠깐 캐시해둡니다.
// 값이 갱신되는 주기(하루 1회)보다 훨씬 짧은 시간만 캐시하므로, 서버가
// 오래 떠 있어도 값이 크게 오래된 채로 남아있지는 않습니다.
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6시간
let cache = { rate: null, date: null, fetchedAt: 0 };

/**
 * 반환: { rate, date } (rate = 1엔당 원화 값) 또는 조회 실패 시 null.
 * 실패해도 예외를 던지지 않습니다 — 환율 조회는 "있으면 더 정확하게 답하는"
 * 보조 기능이라, 실패했다고 질문 답변 자체가 막히면 안 되기 때문입니다.
 */
export async function getJpyToKrwRate() {
  const now = Date.now();
  if (cache.rate && now - cache.fetchedAt < CACHE_TTL_MS) {
    return { rate: cache.rate, date: cache.date };
  }

  try {
    const res = await fetch("https://api.frankfurter.dev/v1/latest?base=JPY&symbols=KRW", {
      signal: AbortSignal.timeout(5000), // 환율 API가 느리거나 막혀 있어도 질문 답변 전체가 오래 걸리지 않도록
    });
    if (!res.ok) throw new Error(`환율 API 응답 오류 (${res.status})`);
    const data = await res.json();
    const rate = data?.rates?.KRW;
    if (typeof rate !== "number") throw new Error("응답에서 KRW 환율 값을 찾지 못했습니다.");

    cache = { rate, date: data.date || null, fetchedAt: now };
    return { rate, date: cache.date };
  } catch (err) {
    console.error("[exchangeRate] 실시간 환율 조회 실패 (참고용 안내로 대체됩니다):", err.message);
    return null;
  }
}
