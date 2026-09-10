import { getDb, nowIso } from "../db.js";
import { createId } from "../id.js";

export function addToolLog({ userId, tripId, tool, input, output, ok = true }) {
  const db = getDb();
  const id = createId("log_");
  db.prepare(
    `INSERT INTO ToolLog (id, userId, tripId, tool, input, output, ok, createdAt)
     VALUES (@id, @userId, @tripId, @tool, @input, @output, @ok, @ts)`
  ).run({
    id,
    userId: userId || null,
    tripId: tripId || null,
    tool,
    input: typeof input === "string" ? input : JSON.stringify(input),
    output: typeof output === "string" ? output : JSON.stringify(output),
    ok: ok ? 1 : 0,
    ts: nowIso(),
  });
  return id;
}

export function listToolLogsByTrip(tripId) {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM ToolLog WHERE tripId = ? ORDER BY createdAt ASC`)
    .all(tripId);
}
