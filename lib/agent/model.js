import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export function buildChatModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error(
      "GEMINI_API_KEY가 설정되지 않았습니다. .env 파일에 Gemini API 키를 넣어주세요."
    );
    err.code = "MISSING_API_KEY";
    throw err;
  }
  return new ChatGoogleGenerativeAI({
    apiKey,
    model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
    temperature: 0.4,
  });
}
