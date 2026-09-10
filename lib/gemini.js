// Gemini API 관련 저수준 유틸 (임베딩). 채팅/에이전트 모델 호출은
// lib/agent 아래에서 LangChain(@langchain/google-genai)을 통해 이뤄집니다.
// 문서: https://ai.google.dev/api/embeddings

const EMBED_ENDPOINT = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent`;

function apiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    const err = new Error(
      "GEMINI_API_KEY가 설정되지 않았습니다. .env 파일에 Gemini API 키를 넣어주세요."
    );
    err.code = "MISSING_API_KEY";
    throw err;
  }
  return key;
}

export async function embedText(text) {
  const model = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
  const res = await fetch(EMBED_ENDPOINT(model), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey(),
    },
    body: JSON.stringify({
      model: `models/${model}`,
      content: { parts: [{ text }] },
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Gemini 임베딩 실패 (${res.status}): ${data?.error?.message || "알 수 없는 오류"}`
    );
  }
  const values = data.embedding?.values;
  if (!Array.isArray(values)) {
    throw new Error("Gemini 임베딩 응답 형식이 올바르지 않습니다.");
  }
  return values;
}
