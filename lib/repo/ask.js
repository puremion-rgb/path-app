// "AI에게 질문하기" 화면(번역/일반 여행 지식 질문) 전용 대화 기록 저장소입니다.
// 일정 수정 대화(lib/repo/chat.js)와는 완전히 별개의 테이블(AskMessage)을 씁니다.
import { getDb, nowIso } from "../db.js";
import { createId } from "../id.js";

export function addAskMessage({ userId, tripId, role, text }) {
  const db = getDb();
  const id = createId("ask_");
  db.prepare(
    `INSERT INTO AskMessage (id, userId, tripId, role, text, createdAt)
     VALUES (@id, @userId, @tripId, @role, @text, @ts)`
  ).run({ id, userId, tripId: tripId || null, role, text, ts: nowIso() });
  return id;
}

export function listAskByTrip(tripId) {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM AskMessage WHERE tripId = ? ORDER BY createdAt ASC`)
    .all(tripId);
}
