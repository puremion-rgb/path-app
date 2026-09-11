"use client";

import { readNdjsonStream } from "@/lib/ndjsonStream";

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `요청에 실패했습니다 (${res.status})`);
  }
  return data;
}

// ---- 인증 ----
export function register({ email, password, name }) {
  return jsonFetch("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password, name }) });
}
export function login({ email, password }) {
  return jsonFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}
export function logout() {
  return jsonFetch("/api/auth/logout", { method: "POST" });
}
export function me() {
  return jsonFetch("/api/auth/me");
}
export function updateProfile({ name }) {
  return jsonFetch("/api/auth/me", { method: "PATCH", body: JSON.stringify({ name }) });
}

// ---- 여행 일정 (Agent) ----
// onStep(stepId, patch) 콜백으로 진행 단계를 실시간 전달받습니다.
async function streamAgent(url, body, onStep) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.body) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || data.error || "요청에 실패했습니다.");
  }

  let result = null;
  let answer = null;
  let errorMessage = null;
  await readNdjsonStream(res, (line) => {
    if (line.type === "step") onStep?.(line.step, line);
    else if (line.type === "result") result = line.trip;
    else if (line.type === "answer") answer = line.answer;
    else if (line.type === "error") errorMessage = line.message;
  });

  if (!res.ok && !errorMessage) {
    errorMessage = "요청 처리 중 오류가 발생했습니다.";
  }
  if (errorMessage) throw new Error(errorMessage);
  if (!result && answer == null) throw new Error("AI가 응답을 만들지 못했습니다. 다시 시도해주세요.");
  return { trip: result, answer };
}

export function planTrip({ message, conditions, origin }, onStep) {
  return streamAgent("/api/agent/plan", { message, conditions, origin }, onStep).then((r) => r.trip);
}

// 반환값: { trip, answer } — 일정을 바꾼 경우 trip이 채워집니다.
export function modifyTrip({ tripId, message }, onStep) {
  return streamAgent("/api/agent/modify", { tripId, message }, onStep);
}

// ---- AI에게 질문하기 (번역/일반 여행 지식 질문 — 일정 수정과는 별개) ----
// Tool 호출 루프가 없는 단순 요청이라 스트리밍이 아닌 일반 JSON 응답입니다.
export function askAi({ tripId, message }) {
  return jsonFetch("/api/agent/ask", { method: "POST", body: JSON.stringify({ tripId, message }) }).then(
    (data) => data.answer
  );
}

// ---- 여행 조회 ----
export function listTrips() {
  return jsonFetch("/api/trips");
}
export function getTrip(id) {
  return jsonFetch(`/api/trips/${id}`);
}
export function renameTrip(id, title) {
  return jsonFetch(`/api/trips/${id}`, { method: "PATCH", body: JSON.stringify({ title }) });
}
export function setTripStatus(id, status) {
  return jsonFetch(`/api/trips/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
}
export function deleteTrip(id) {
  return jsonFetch(`/api/trips/${id}`, { method: "DELETE" });
}

// ---- 찜(즐겨찾기) ----
export function listFavorites() {
  return jsonFetch("/api/favorites");
}
export function addFavorite(payload) {
  return jsonFetch("/api/favorites", { method: "POST", body: JSON.stringify(payload) });
}
export function removeFavorite(placeId) {
  return jsonFetch(`/api/favorites?placeId=${encodeURIComponent(placeId)}`, { method: "DELETE" });
}

// ---- 장소 ----
export function searchPlacesByText(q, near) {
  const params = new URLSearchParams({ q });
  if (near) {
    params.set("lat", near.lat);
    params.set("lng", near.lng);
  }
  return jsonFetch(`/api/places/search?${params.toString()}`);
}
export function searchPlacesNearby({ lat, lng, radius, type }) {
  const params = new URLSearchParams({ lat, lng });
  if (radius) params.set("radius", radius);
  if (type) params.set("type", type);
  return jsonFetch(`/api/places/search?${params.toString()}`);
}
export function getPlaceDetails(placeId) {
  return jsonFetch(`/api/places/${encodeURIComponent(placeId)}`);
}
export function placePhotoUrl(photoName, width = 640) {
  if (!photoName) return null;
  return `/api/places/photo?name=${encodeURIComponent(photoName)}&w=${width}`;
}
