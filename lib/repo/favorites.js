import { getDb, nowIso } from "../db.js";
import { createId } from "../id.js";

export function listFavorites(userId) {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM Favorite WHERE userId = ? ORDER BY createdAt DESC`)
    .all(userId);
}

export function addFavorite({ userId, placeId, name, category, area, lat, lng }) {
  const db = getDb();
  const existing = db
    .prepare(`SELECT * FROM Favorite WHERE userId = ? AND placeId = ?`)
    .get(userId, placeId);
  if (existing) return existing;
  const id = createId("fav_");
  db.prepare(
    `INSERT INTO Favorite (id, userId, placeId, name, category, area, lat, lng, createdAt)
     VALUES (@id, @userId, @placeId, @name, @category, @area, @lat, @lng, @ts)`
  ).run({
    id,
    userId,
    placeId,
    name,
    category: category || null,
    area: area || null,
    lat: lat ?? null,
    lng: lng ?? null,
    ts: nowIso(),
  });
  return db.prepare(`SELECT * FROM Favorite WHERE id = ?`).get(id);
}

export function removeFavorite({ userId, placeId }) {
  const db = getDb();
  db.prepare(`DELETE FROM Favorite WHERE userId = ? AND placeId = ?`).run(userId, placeId);
}
