import Link from "next/link";
import TabShell from "@/components/TabShell";
import LogoHeader from "@/components/LogoHeader";
import Card from "@/components/Card";
import PlacePhoto from "@/components/PlacePhoto";
import { IconSparkle, IconChevronRight } from "@/components/Icons";
import ContinueChatCard from "@/components/ContinueChatCard";
import { getEffectiveUserReadOnly } from "@/lib/auth";
import { searchPlacesText } from "@/lib/google/places";
import { listTripsByUser, toPublicTrip } from "@/lib/repo/trips";
import { listChatByTrip } from "@/lib/repo/chat";

// 서버 컴포넌트에서 바로 Google Places(New)를 호출합니다 — 클라이언트로 API 키가
// 나가지 않고, 로딩 상태 없이 첫 화면에 실제 추천 스팟이 바로 렌더링됩니다.
async function loadSpots() {
  try {
    const places = await searchPlacesText({
      query: "도쿄 인기 관광지",
      maxResultCount: 4,
    });
    return places.map((p) => ({ id: p.placeId, name: p.name, time: p.category || "관광지" }));
  } catch (e) {
    // 이 섹션은 "있으면 좋은" 정보라 홈 화면 전체가 깨지지 않도록 실패하면 조용히 숨깁니다.
    // 대신 원인은 서버 콘솔(npm run dev를 실행 중인 터미널)에 남겨서 진단할 수 있게 합니다.
    console.error("[home] '지금, 도쿄는 어때요?' 섹션용 장소 불러오기 실패:", e.message);
    return [];
  }
}

export default async function HomePage() {
  // 로그인 여부와 상관없이(게스트로 만든 여행이라도) "내 여행 요약"에 보여주기 위해
  // 실제 로그인만 인정하는 getSessionUser() 대신 이 함수를 씁니다.
  const user = await getEffectiveUserReadOnly();
  const [spots, latestTrip] = await Promise.all([
    loadSpots(),
    user ? Promise.resolve(listTripsByUser(user.id)[0]) : Promise.resolve(null),
  ]);
  const trip = latestTrip ? toPublicTrip(latestTrip) : null;

  // "AI와 대화하며 일정 수정하기" 카드에 실제 마지막 대화 내용을 보여주기 위해
  // 해당 여행의 채팅 기록에서 사용자가 마지막으로 보낸 메시지를 찾습니다.
  // 아직 대화 기록이 없다면(막 생성 직후 등) 여행을 만들 때 입력했던 원문으로 대체합니다.
  let lastMessage = null;
  if (trip) {
    const chat = listChatByTrip(trip.id);
    const lastUserChat = [...chat].reverse().find((m) => m.role === "user");
    lastMessage = lastUserChat?.text || trip.requestText || null;
  }

  return (
    <TabShell title="홈">
      <LogoHeader />
      {/* 다른 탭 화면들처럼 .screen-scroll로 감싸지 않아서, 여행이 여러 개
          쌓이거나 추천 스팟이 많아 내용이 길어지면 스크롤이 전혀 안 되는
          문제가 생길 수 있었습니다(같은 원인의 문제가 교통 팁 화면에서도
          발견됨). */}
      <div className="screen-scroll">
      <main className="flex flex-col gap-6 px-5 pt-2 lg:px-0">
        <Link
          href="/ai"
          className="flex items-center justify-between rounded-3xl bg-navy px-6 py-6 text-white shadow-lg shadow-navy/20"
        >
          <div>
            <p className="flex items-center gap-2 text-[18px] font-bold">
              <IconSparkle className="h-5 w-5 text-accent-orange" />
              AI 여행 만들기
            </p>
            <p className="mt-2 text-[14px] text-white/80">
              &ldquo;신주쿠에서 걷기 최소로&rdquo; 한마디면 끝
            </p>
          </div>
          <IconChevronRight className="h-5 w-5 shrink-0 text-white" />
        </Link>

        {spots.length > 0 && (
          <section>
            <h2 className="mb-3 text-[17px] font-bold text-navy-deep">지금, 도쿄는 어때요?</h2>

            <div className="grid grid-cols-3 gap-3 lg:hidden">
              {spots.slice(0, 3).map((s) => (
                <Link key={s.id} href={`/ai/place/${s.id}`}>
                  <PlacePhoto name={s.name} className="aspect-square rounded-2xl" />
                </Link>
              ))}
            </div>

            <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
              {spots.map((s) => (
                <Link key={s.id} href={`/ai/place/${s.id}`} className="block">
                  <PlacePhoto name={s.name} className="aspect-[4/3] w-full rounded-2xl" labelClassName="hidden" />
                  <p className="mt-2.5 text-[15px] font-bold text-navy-deep">{s.name}</p>
                  <p className="mt-0.5 text-[13px] text-muted">{s.time}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-4 pb-6 lg:grid-cols-2">
          <Link href="/my/trips" className="block min-w-0">
            <Card className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[13px] text-muted">내 여행 요약</p>
                <p className="mt-1 truncate text-[16px] font-bold text-navy-deep">
                  {trip ? trip.title : "아직 만든 여행이 없어요"}
                </p>
                {trip && (
                  <p className="mt-0.5 hidden text-[13px] text-muted lg:block">
                    {(trip.itinerary?.days || []).map((d) => d.date).filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <span className="hidden shrink-0 rounded-xl bg-navy px-5 py-3 text-[14px] font-bold text-white lg:block">
                일정 보기
              </span>
              <IconChevronRight className="h-5 w-5 shrink-0 text-navy lg:hidden" />
            </Card>
          </Link>

          <ContinueChatCard trip={trip} lastMessage={lastMessage} />
        </div>
      </main>
      </div>
    </TabShell>
  );
}
