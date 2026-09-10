import { getDb, nowIso } from "../db.js";
import { createId } from "../id.js";

export function countKnowledgeDocs() {
  const db = getDb();
  return db.prepare(`SELECT COUNT(*) AS c FROM KnowledgeDoc`).get().c;
}

export function insertKnowledgeDoc({ title, category, content, embedding }) {
  const db = getDb();
  const id = createId("kb_");
  db.prepare(
    `INSERT INTO KnowledgeDoc (id, title, category, content, embedding, createdAt)
     VALUES (@id, @title, @category, @content, @embedding, @ts)`
  ).run({
    id,
    title,
    category: category || null,
    content,
    embedding: JSON.stringify(embedding),
    ts: nowIso(),
  });
  return id;
}

export function getAllKnowledgeDocs() {
  const db = getDb();
  return db.prepare(`SELECT * FROM KnowledgeDoc`).all();
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// 가장 단순한 형태의 "벡터 검색": 문서 수가 적은(수십~수백 건) RAG 지식베이스이므로
// 별도 Vector DB(Pinecone 등) 없이 코사인 유사도 전수비교로 top-k를 구합니다.
export function searchKnowledgeByEmbedding(queryEmbedding, topK = 3) {
  const docs = getAllKnowledgeDocs();
  const scored = docs.map((doc) => ({
    doc,
    score: cosineSimilarity(queryEmbedding, JSON.parse(doc.embedding)),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(({ doc, score }) => ({
    id: doc.id,
    title: doc.title,
    category: doc.category,
    content: doc.content,
    score,
  }));
}
