import { notFound } from "next/navigation";
import { getTripById, toPublicTrip } from "@/lib/repo/trips";
import ShareTripView from "./ShareTripView";

// 로그인 없이 누구나 열어볼 수 있는 "일정 공유" 읽기 전용 페이지입니다.
// middleware.js가 로그인을 요구하는 경로는 /favorites, /my 뿐이라 /share는
// 원래도 막혀있지 않았고, 이 페이지 자체도 클라이언트 세션(sessionStorage의
// tripId)이나 로그인 여부를 전혀 확인하지 않습니다 — 그냥 트립 ID로 서버에서
// 바로 조회합니다. 링크 자체가 추측하기 어려운 20자리 랜덤 문자열(lib/id.js)이라
// 별도의 공개/비공개 설정 없이도 "링크를 아는 사람만 볼 수 있는" 정도의
// 보호는 됩니다.
//
// 매 요청마다 최신 상태(수정된 일정 등)를 보여줘야 하므로 정적 캐싱하지 않습니다.
export const dynamic = "force-dynamic";

// 개인 여행 일정이 검색엔진에 노출되지 않도록 막아둡니다.
export const metadata = {
  robots: { index: false, follow: false },
};

export default async function SharedTripPage({ params }) {
  const { id } = await params;
  const raw = getTripById(id);
  if (!raw) return notFound();

  const trip = toPublicTrip(raw);
  return <ShareTripView trip={trip} />;
}
