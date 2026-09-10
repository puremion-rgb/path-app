"use client";

// 화면 간 이동(예: /ai/analyzing -> /ai/result -> /ai/route)에서 현재 보고 있는
// tripId를 공유하기 위한 아주 작은 sessionStorage 헬퍼입니다.
const KEY = "path_current_trip_id";
const PENDING_KEY = "path_pending_request";

export function setCurrentTripId(id) {
  try {
    sessionStorage.setItem(KEY, id);
  } catch {}
}

export function getCurrentTripId() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

// /ai (요청 입력) -> /ai/analyzing 으로 넘어갈 때 아직 tripId가 없으므로
// 요청 내용 자체를 잠깐 들고 있습니다.
export function setPendingRequest(payload) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  } catch {}
}

export function getPendingRequest() {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPendingRequest() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {}
}

// /ai/chat -> /ai/reanalyzing 으로 넘어갈 때 쓰는 "수정 요청" 버전
const PENDING_MOD_KEY = "path_pending_modification";
const LAST_CHANGE_KEY = "path_last_change";

export function setPendingModification(payload) {
  try {
    sessionStorage.setItem(PENDING_MOD_KEY, JSON.stringify(payload));
  } catch {}
}

export function getPendingModification() {
  try {
    const raw = sessionStorage.getItem(PENDING_MOD_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPendingModification() {
  try {
    sessionStorage.removeItem(PENDING_MOD_KEY);
  } catch {}
}

export function setLastChangeDiff(payload) {
  try {
    sessionStorage.setItem(LAST_CHANGE_KEY, JSON.stringify(payload));
  } catch {}
}

export function getLastChangeDiff() {
  try {
    const raw = sessionStorage.getItem(LAST_CHANGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
