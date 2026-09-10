import { getEffectiveUser } from "@/lib/auth";
import { getTripById, toPublicTrip, deleteTrip, renameTrip, setTripStatus } from "@/lib/repo/trips";
import { listChatByTrip } from "@/lib/repo/chat";
import { listToolLogsByTrip } from "@/lib/repo/toolLog";
import { jsonOk, ApiError, withApiError } from "@/lib/apiUtils";

// 로그인 없이도(게스트 계정으로) 자신이 방금 만든 일정을 조회/삭제할 수 있습니다.
export const GET = withApiError(async (_req, { params }) => {
  const user = await getEffectiveUser();
  const { id } = await params;
  const trip = getTripById(id);
  if (!trip || trip.userId !== user.id) throw new ApiError("여행 일정을 찾을 수 없습니다.", 404);

  const chat = listChatByTrip(id).map((m) => ({ role: m.role, text: m.text, createdAt: m.createdAt }));
  const toolLogs = listToolLogsByTrip(id).map((l) => ({
    tool: l.tool,
    ok: !!l.ok,
    createdAt: l.createdAt,
  }));

  return jsonOk({ trip: toPublicTrip(trip), chat, toolLogs });
});

// 여행 제목 수정, 진행중 ↔ 완료 상태 변경을 처리합니다.
// (title, status 중 하나만 보내도 되고 둘 다 보내도 됩니다.)
export const PATCH = withApiError(async (req, { params }) => {
  const user = await getEffectiveUser();
  const { id } = await params;
  const existing = getTripById(id);
  if (!existing || existing.userId !== user.id) throw new ApiError("여행 일정을 찾을 수 없습니다.", 404);

  const body = await req.json().catch(() => ({}));
  if (body.title === undefined && body.status === undefined) {
    throw new ApiError("수정할 내용이 없습니다.", 400);
  }

  let updated = existing;

  if (body.title !== undefined) {
    const title = String(body.title || "").trim();
    if (!title) throw new ApiError("제목을 입력해주세요.", 400);
    if (title.length > 60) throw new ApiError("제목은 60자 이내로 입력해주세요.", 400);
    updated = renameTrip(id, user.id, title);
  }

  if (body.status !== undefined) {
    if (!["active", "archived"].includes(body.status)) {
      throw new ApiError("올바르지 않은 상태 값입니다.", 400);
    }
    updated = setTripStatus(id, user.id, body.status);
  }

  return jsonOk({ trip: toPublicTrip(updated) });
});

export const DELETE = withApiError(async (_req, { params }) => {
  const user = await getEffectiveUser();
  const { id } = await params;
  deleteTrip(id, user.id);
  return jsonOk({});
});
