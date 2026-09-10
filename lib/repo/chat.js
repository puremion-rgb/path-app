import { getDb, nowIso } from "../db.js";
import { createId } from "../id.js";

export function addChatMessage({ userId, tripId, role, text }) {
  const db = getDb();
  const id = createId("msg_");
  db.prepare(
    `INSERT INTO ChatMessage (id, userId, tripId, role, text, createdAt)
     VALUES (@id, @userId, @tripId, @role, @text, @ts)`
  ).run({ id, userId, tripId: tripId || null, role, text, ts: nowIso() });
  return id;
}

export function listChatByTrip(tripId) {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM ChatMessage WHERE tripId = ? ORDER BY createdAt ASC`)
    .all(tripId);
}
