import { NextResponse } from "next/server";

export function jsonOk(data, init) {
  return NextResponse.json({ ok: true, ...data }, init);
}

export function jsonError(message, status = 400, extra) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

// API 라우트 핸들러를 감싸서 예외를 일관된 JSON 에러 응답으로 변환합니다.
export function withApiError(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof ApiError) {
        return jsonError(err.message, err.status);
      }
      console.error("[api-error]", err);
      return jsonError(
        err?.message || "서버 오류가 발생했습니다.",
        500
      );
    }
  };
}
