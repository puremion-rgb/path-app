// PATH 프로젝트 데이터베이스 레이어
//
// Prisma나 better-sqlite3 같은 별도 패키지 대신, Node.js 22+에 내장된
// node:sqlite(DatabaseSync)를 사용합니다. 이유:
//  - npm install 시 네이티브 모듈을 컴파일/다운로드할 필요가 전혀 없습니다
//    (better-sqlite3 같은 네이티브 addon은 학교/실습실 네트워크가 막혀 있거나
//    빌드 도구가 없는 PC에서 설치가 실패하는 경우가 있는데, node:sqlite는 Node.js
//    자체에 포함되어 있어 그런 문제가 없습니다).
//  - 코드 생성/마이그레이션 CLI 없이 앱을 켜는 즉시 테이블이 만들어져
//    "설치 → 바로 실행"이 확실히 보장됩니다.
//  - 팀플 계획서의 USER/TRIP/ROUTE_HISTORY/FAVORITE/CHAT_HISTORY + TOOL_LOG 요구사항을
//    그대로 테이블로 옮겼습니다.
//
// (주의) node:sqlite는 Node 22.5+ 에서 사용 가능하며 아직 "experimental" 딱지가
// 붙어있어 실행 시 경고 메시지가 한 번 출력될 수 있습니다 — 정상입니다.
//
// MySQL/Supabase로 옮기고 싶다면 README의 "데이터베이스 교체" 섹션을 참고하세요 —
// 이 파일의 SQL 스키마를 거의 그대로 사용할 수 있고, node:sqlite 대신 mysql2/pg를
// 쓰도록 아래 export 함수들의 구현부만 바꾸면 나머지 코드(lib/repo/*, app/api/*)는
// 수정할 필요가 없도록 설계했습니다.

import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DATABASE_FILE = process.env.DATABASE_FILE || "./data/app.db";

function resolveDbPath() {
  const resolved = path.isAbsolute(DATABASE_FILE)
    ? DATABASE_FILE
    : path.join(process.cwd(), DATABASE_FILE);
  const dir = path.dirname(resolved);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return resolved;
}

let _db = null;

function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      name TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Trip (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      requestText TEXT NOT NULL,
      conditions TEXT,
      origin TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      itinerary TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_trip_user ON Trip(userId);

    CREATE TABLE IF NOT EXISTS RouteHistory (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
      tripId TEXT REFERENCES Trip(id) ON DELETE SET NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      mode TEXT,
      resultJson TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_routehistory_user ON RouteHistory(userId);

    CREATE TABLE IF NOT EXISTS Favorite (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
      placeId TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      area TEXT,
      lat REAL,
      lng REAL,
      createdAt TEXT NOT NULL,
      UNIQUE(userId, placeId)
    );
    CREATE INDEX IF NOT EXISTS idx_favorite_user ON Favorite(userId);

    CREATE TABLE IF NOT EXISTS ChatMessage (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
      tripId TEXT REFERENCES Trip(id) ON DELETE SET NULL,
      role TEXT NOT NULL,
      text TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_chatmessage_trip ON ChatMessage(tripId);

    CREATE TABLE IF NOT EXISTS ToolLog (
      id TEXT PRIMARY KEY,
      userId TEXT REFERENCES User(id) ON DELETE SET NULL,
      tripId TEXT REFERENCES Trip(id) ON DELETE SET NULL,
      tool TEXT NOT NULL,
      input TEXT NOT NULL,
      output TEXT NOT NULL,
      ok INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_toollog_trip ON ToolLog(tripId);

    CREATE TABLE IF NOT EXISTS KnowledgeDoc (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT,
      content TEXT NOT NULL,
      embedding TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
}

export function getDb() {
  if (_db) return _db;
  const dbPath = resolveDbPath();
  _db = new DatabaseSync(dbPath);
  _db.exec("PRAGMA journal_mode = WAL");
  _db.exec("PRAGMA foreign_keys = ON");
  createSchema(_db);
  return _db;
}

export function nowIso() {
  return new Date().toISOString();
}
