import { getEffectiveUser } from "@/lib/auth";
import { listTripsByUser, toPublicTrip } from "@/lib/repo/trips";
import { jsonOk, withApiError } from "@/lib/apiUtils";

// 로그인 없이도(게스트 계정으로) 자신이 만든 일정 목록을 볼 수 있습니다.
export const GET = withApiError(async () => {
  const user = await getEffectiveUser();
  const trips = listTripsByUser(user.id).map(toPublicTrip);
  return jsonOk({ trips });
});
