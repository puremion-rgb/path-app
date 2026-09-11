"use client";

import { useEffect, useState } from "react";
import TabShell from "@/components/TabShell";
import StackHeader from "@/components/StackHeader";
import { IconChevronRight } from "@/components/Icons";

const TIPS = [
  {
    id: "ic-card",
    emoji: "🚋",
    title: "일본 전철 이용 방법",
    desc: "IC카드 · 승강장 · 행선지 확인법",
    content: (
      <>
        <p>
          Suica·PASMO 같은 IC카드 한 장이면 개찰구에 태그만 해도 요금이 자동으로
          정산돼요. 편의점, 자판기에서도 그대로 쓸 수 있어서 여행 내내 이 카드
          하나면 충분해요.
        </p>
        <p className="mt-2">
          승강장은 노선별 색상과 알파벳 기호(예: 야마노테선 JY, 긴자선 G)로
          구분되고, 안내판에는 종점역 이름이 방향 표시로 쓰여요. 내가 갈 방향의
          종점역 이름을 미리 확인해두면 헷갈리지 않아요.
        </p>
      </>
    ),
  },
  {
    id: "transfer",
    emoji: "🔁",
    title: "환승하는 방법",
    desc: "노선이 달라질 때 이동하는 법",
    content: (
      <>
        <p>
          같은 회사(예: 도쿄 메트로 내 노선끼리) 환승은 개찰구를 나가지 않고
          색깔 표지판만 따라가면 되고, 추가 태그도 필요 없어요.
        </p>
        <p className="mt-2">
          JR ↔ 지하철처럼 운영 회사가 다르면 한 번 개찰구를 나갔다가 다시 태그하고
          들어가야 하는 경우가 많아요. 환승 통로 표지판의 노선 색상과 번호를
          따라가면 길을 잃을 일이 거의 없어요.
        </p>
      </>
    ),
  },
  {
    id: "transit-pass",
    emoji: "🎫",
    title: "교통패스 알아보기",
    desc: "도쿄 여행에 맞는 패스 선택",
    content: (
      <>
        <ul className="flex flex-col gap-3">
          <li>
            <p className="font-bold text-navy-deep">Suica / PASMO (IC카드)</p>
            <p className="mt-0.5 text-muted">
              충전식 교통카드. 노선 상관없이 태그만 하면 되고 편의점 결제도
              가능해 가장 무난한 선택이에요.
            </p>
          </li>
          <li>
            <p className="font-bold text-navy-deep">도쿄 지하철 승차권 (Tokyo Subway Ticket)</p>
            <p className="mt-0.5 text-muted">
              도쿄 메트로 + 도영 지하철 전 노선 무제한. 24시간권 800엔 · 48시간권
              1,200엔 · 72시간권 1,500엔 (요금은 변동될 수 있어요).
            </p>
          </li>
          <li>
            <p className="font-bold text-navy-deep">도쿄 메트로 패스</p>
            <p className="mt-0.5 text-muted">
              도쿄 메트로 13개 노선·최대 250개 역을 24/48/72시간 단위로 무제한
              이용. 신주쿠·시부야·아사쿠사·긴자 등 인기 관광지 위주로 다닐 때
              유리해요.
            </p>
          </li>
          <li>
            <p className="font-bold text-navy-deep">도쿄 프리 킷푸</p>
            <p className="mt-0.5 text-muted">
              도쿄 메트로 + 도영 지하철 + 도영 버스 + JR 도쿄 23구 구간까지 하루
              동안 전부 무제한 이용. 하루에 여러 번, 여러 노선을 옮겨 다닐
              계획이라면 가장 폭넓은 선택이에요.
            </p>
          </li>
        </ul>
        <p className="mt-3 text-[12px] text-muted">
          하루 3~4회 이상 지하철을 탈 계획이면 패스가, 그보다 적으면 IC카드가
          보통 더 경제적이에요.
        </p>
      </>
    ),
  },
  {
    id: "walking",
    emoji: "🚶",
    title: "도보 이동 팁",
    desc: "역 출구와 지상 이동 주의사항",
    content: (
      <>
        <p>
          같은 역이라도 출구 번호에 따라 지상 위치가 크게 달라져요. 목적지와
          가까운 출구 번호를 미리 확인하고 나가면 걷는 거리를 크게 줄일 수
          있어요.
        </p>
        <p className="mt-2">
          역 안 이동 거리도 생각보다 길 수 있어서, 환승이나 출구 이동에 여유
          시간을 5~10분 정도 넉넉히 잡아두는 걸 추천해요.
        </p>
      </>
    ),
  },
];

export default function TipsPage() {
  const [openId, setOpenId] = useState(null);

  // URL 해시(#transit-pass 등)로 들어오면 해당 항목을 펼치고 그 위치로 스크롤합니다.
  // (홈의 "교통패스 알아보기" → 교통패스 항목이 열린 채로 보이도록)
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (TIPS.some((t) => t.id === hash)) {
        setOpenId(hash);
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ block: "center", behavior: "smooth" });
        });
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <TabShell crumb="고객센터" title="일본 여행 팁">
      {/* 다른 MY 하위 메뉴(설정/프로필 수정/고객센터)와 똑같이, 화면 제목은
          헤더 바에만 보여줍니다. 예전에는 헤더 제목을 비워두고 본문에 큰
          문구("처음 가도 걱정 없는 ...")를 따로 넣어서 이 화면만 패턴이
          달랐는데, 통일감을 위해 헤더 제목을 채우고 본문 큰 문구는 뺐습니다. */}
      <StackHeader title="일본 여행 팁" backHref="/my/support" className="lg:hidden" />
      {/* 다른 TabShell 화면들처럼 .screen-scroll로 감싸지 않아서, 앱 프레임을
          overflow:hidden으로 고정한 이후(스크롤 안 되는 문제 수정 때) 이 화면만
          내용이 길어져도 스크롤이 전혀 안 되던 문제가 있었습니다. */}
      <div className="screen-scroll">
      <div className="px-5 pt-5 lg:max-w-xl lg:px-0 lg:pt-0">
        <div className="flex flex-col gap-4">
          {TIPS.map((t) => {
            const open = openId === t.id;
            return (
              <div key={t.id} id={t.id} className="rounded-2xl border border-line bg-white p-5">
                <button
                  onClick={() => setOpenId(open ? null : t.id)}
                  className="flex w-full items-center gap-4 text-left"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dfe6fb] text-[20px]">
                    {t.emoji}
                  </span>
                  <span className="flex-1">
                    <p className="text-[15px] font-bold text-navy-deep">{t.title}</p>
                    <p className="mt-0.5 text-[13px] text-muted">{t.desc}</p>
                  </span>
                  <IconChevronRight
                    className={`h-5 w-5 shrink-0 text-navy-deep/40 transition-transform ${
                      open ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {open && (
                  <div className="mt-4 border-t border-line pt-4 text-[13px] leading-6 text-navy-deep/90">
                    {t.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl bg-[#fce9dd] p-5">
          <p className="text-[13px] font-extrabold text-accent-orange">PATH AI</p>
          <p className="mt-1 text-[13px] text-navy-deep">여행 조건에 맞는 교통 팁도 함께 알려드려요.</p>
        </div>
      </div>
      </div>
    </TabShell>
  );
}
