import { getEffectiveUser } from "@/lib/auth";
import { fetchPlacePhoto } from "@/lib/google/places";

// GET /api/places/photo?name=places/xxx/photos/yyy&w=640
// 브라우저에 Google Maps 서버 키를 노출하지 않기 위한 이미지 프록시입니다.
// 로그인 없이도(게스트 계정으로) 사진을 볼 수 있습니다.
export async function GET(req) {
  await getEffectiveUser();

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const w = Number(searchParams.get("w") || 640);
  if (!name) return new Response("name is required", { status: 400 });

  try {
    const upstream = await fetchPlacePhoto(name, { maxWidthPx: w });
    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    return new Response(e.message, { status: 502 });
  }
}
