import { getDb, nowIso } from "../db.js";
import { createId } from "../id.js";

export function addRouteHistory({ userId, tripId, origin, destination, mode, result }) {
  const db = getDb();
  const id = createId("route_");
  db.prepare(
    `INSERT INTO RouteHistory (id, userId, tripId, origin, destination, mode, resultJson, createdAt)
     VALUES (@id, @userId, @tripId, @origin, @destination, @mode, @resultJson, @ts)`
  ).run({
    id,
    userId,
    tripId: tripId || null,
    origin,
    destination,
    mode: mode || null,
    resultJson: JSON.stringify(result || {}),
    ts: nowIso(),
  });
  return id;
}

export function listRouteHistoryByUser(userId, limit = 20) {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM RouteHistory WHERE userId = ? ORDER BY createdAt DESC LIMIT ?`)
    .all(userId, limit);
}
