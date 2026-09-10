import { getDb, nowIso } from "../db.js";
import { createId } from "../id.js";

export function createUser({ email, passwordHash, name }) {
  const db = getDb();
  const id = createId("usr_");
  const ts = nowIso();
  db.prepare(
    `INSERT INTO User (id, email, passwordHash, name, createdAt, updatedAt)
     VALUES (@id, @email, @passwordHash, @name, @ts, @ts)`
  ).run({ id, email: email.toLowerCase(), passwordHash, name: name || null, ts });
  return getUserById(id);
}

export function getUserByEmail(email) {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM User WHERE email = ?`)
    .get(String(email).toLowerCase());
}

export function getUserById(id) {
  const db = getDb();
  return db.prepare(`SELECT * FROM User WHERE id = ?`).get(id);
}

export function updateUserProfile(id, { name }) {
  const db = getDb();
  db.prepare(`UPDATE User SET name = ?, updatedAt = ? WHERE id = ?`).run(
    name ?? null,
    nowIso(),
    id
  );
  return getUserById(id);
}

export function toPublicUser(user) {
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}
