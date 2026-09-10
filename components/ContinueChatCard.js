"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import { IconChevronRight } from "@/components/Icons";
import { setCurrentTripId } from "@/lib/tripStore";

// 카드 한 줄에 다 들어가지 않을 만큼 긴 메시지는 일부만 보여주고 나머지는 생략합니다.
const PREVIEW_MAX_LENGTH = 24;
function previewText(text) {
  if (!text) return text;
  const trimmed = text.trim();
  return trimmed.length > PREVIEW_MAX_LENGTH ? `${trimmed.slice(0, PREVIEW_MAX_LENGTH)}…` : trimmed;
}

export default function ContinueChatCard({ trip, lastMessage }) {
  const router = useRouter();

  function go() {
    if (trip) {
      setCurrentTripId(trip.id);
      router.push("/ai/chat");
    } else {
      router.push("/ai");
    }
  }

  // 실제로 사용자가 마지막에 보낸 메시지가 있으면 그걸(일부만) 보여주고,
  // 없으면(대화 기록이 없는 경우) 안내 문구로 대체합니다.
  const quote = trip
    ? (lastMessage ? `"${previewText(lastMessage)}"` : "이어서 대화해보세요")
    : "AI에게 여행을 물어보세요";

  return (
    <button onClick={go} className="block min-w-0 w-full text-left">
      <Card className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[13px] text-muted">
            {trip ? "최근 AI 대화 이어하기" : "아직 만든 일정이 없어요"}
          </p>
          <p className="mt-1 truncate text-[16px] font-bold text-navy-deep">{quote}</p>
        </div>
        <span className="hidden shrink-0 rounded-xl bg-navy px-5 py-3 text-[14px] font-bold text-white lg:block">
          {trip ? "이어서 대화하기" : "시작하기"}
        </span>
        <IconChevronRight className="h-5 w-5 shrink-0 text-navy lg:hidden" />
      </Card>
    </button>
  );
}
