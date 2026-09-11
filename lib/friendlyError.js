// Gemini/Google API 쪽 원본 오류 메시지는 429 Too Many Requests 같은 아주 길고
// 기술적인 문구(할당량 세부 JSON 포함)를 그대로 담고 있어서, 그걸 그대로
// 채팅창에 보여주면 사용자가 무슨 뜻인지 알기 어렵습니다. 자주 나오는 원인만
// 한국어로 알기 쉽게 바꿔주고, 나머지는 너무 길지 않게 정리해서 보여줍니다.
// (app/ai/chat, app/ai/ask 두 화면에서 공통으로 사용합니다.)
export function friendlyErrorMessage(raw) {
  const msg = String(raw || "");
  if (/429|Too Many Requests|quota|RESOURCE_EXHAUSTED/i.test(msg)) {
    return "지금 AI 사용량이 많아서(무료 사용량 한도 초과) 답변을 받지 못했어요. 잠시 후 다시 시도해주세요.";
  }
  if (/GEMINI_API_KEY/i.test(msg)) {
    return "AI 서비스 설정에 문제가 있어요. 잠시 후 다시 시도해주세요.";
  }
  if (msg.length > 120) {
    return "AI 응답을 받아오는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
  }
  return msg || "요청 처리 중 오류가 발생했어요. 다시 시도해주세요.";
}
