import { jsonOk, withApiError } from "@/lib/apiUtils";
import { sessionCookieOptions } from "@/lib/auth";

export const POST = withApiError(async () => {
  const res = jsonOk({});
  const opts = sessionCookieOptions();
  res.cookies.set(opts.name, "", { ...opts, maxAge: 0 });
  return res;
});
