import { getDb, nowIso } from "../db.js";
import { createId } from "../id.js";

export function createTrip({ userId, title, requestText, conditions, origin, itinerary }) {
  const db = getDb();
  const id = createId("trip_");
  const ts = nowIso();
  db.prepare(
    `INSERT INTO Trip (id, userId, title, requestText, conditions, origin, status, itinerary, createdAt, updatedAt)
     VALUES (@id, @userId, @title, @requestText, @conditions, @origin, 'active', @itinerary, @ts, @ts)`
  ).run({
    id,
    userId,
    title,
    requestText,
    conditions: conditions ? JSON.stringify(conditions) : null,
    origin: origin || null,
    itinerary: JSON.stringify(itinerary),
    ts,
  });
  return getTripById(id);
}

export function getTripById(id) {
  const db = getDb();
  return db.prepare(`SELECT * FROM Trip WHERE id = ?`).get(id);
}

export function listTripsByUser(userId) {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM Trip WHERE userId = ? ORDER BY updatedAt DESC`)
    .all(userId);
}

export function updateTripItinerary(id, itinerary, { title } = {}) {
  const db = getDb();
  const ts = nowIso();
  if (title) {
    db.prepare(`UPDATE Trip SET itinerary = ?, title = ?, updatedAt = ? WHERE id = ?`).run(
      JSON.stringify(itinerary),
      title,
      ts,
      id
    );
  } else {
    db.prepare(`UPDATE Trip SET itinerary = ?, updatedAt = ? WHERE id = ?`).run(
      JSON.stringify(itinerary),
      ts,
      id
    );
  }
  return getTripById(id);
}

// 일정(itinerary)은 그대로 두고 제목만 사용자가 직접 바꿀 때 사용합니다
// (AI가 자동으로 요약해서 붙인 제목을 사용자가 원하는 이름으로 고칠 수 있게 해줍니다).
export function renameTrip(id, userId, title) {
  const db = getDb();
  db.prepare(`UPDATE Trip SET title = ?, updatedAt = ? WHERE id = ? AND userId = ?`).run(
    title,
    nowIso(),
    id,
    userId
  );
  return getTripById(id);
}

// 진행중 ↔ 완료 상태를 사용자가 직접 바꿀 때 사용합니다.
export function setTripStatus(id, userId, status) {
  const db = getDb();
  db.prepare(`UPDATE Trip SET status = ?, updatedAt = ? WHERE id = ? AND userId = ?`).run(
    status,
    nowIso(),
    id,
    userId
  );
  return getTripById(id);
}

export function deleteTrip(id, userId) {
  const db = getDb();
  db.prepare(`DELETE FROM Trip WHERE id = ? AND userId = ?`).run(id, userId);
}

export function toPublicTrip(trip) {
  if (!trip) return null;
  return {
    id: trip.id,
    title: trip.title,
    requestText: trip.requestText,
    conditions: trip.conditions ? JSON.parse(trip.conditions) : [],
    origin: trip.origin,
    status: trip.status,
    itinerary: JSON.parse(trip.itinerary),
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  };
}
