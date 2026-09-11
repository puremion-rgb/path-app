import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

// Wraps the five bottom-tab root screens (홈/지도/AI 여행/찜/MY).
// Renders a left sidebar nav on desktop and a bottom tab bar on mobile,
// exactly like the PC / mobile prototype pair.
//
// `crumb`: optional light-grey prefix shown before the bold title on
// desktop, e.g. crumb="MY" title="내 여행 일정" -> "MY   내 여행 일정".
//
// `hideMobileNav`: 뒤로가기가 있는 상세 화면(예: 이동 경로)에서 모바일
// 하단 탭바를 감추고 싶을 때 true로 넘깁니다. 데스크톱 사이드바는 그대로
// 유지됩니다(데스크톱은 항상 사이드바 내비게이션이라 탭바와 무관).
export default function TabShell({ title, crumb, children, hideMobileNav = false }) {
  // 이전에는 이 루트 요소가 min-h-dvh(최소 높이)만 정해져 있어서, 내용이
  // 뷰포트보다 길어지면 이 요소 자체가 뷰포트보다 커지고, 그 안의
  // .screen-scroll(각 화면에서 실제 스크롤을 담당)은 "채워야 할 남은 공간"이
  // 정해지지 않아 그냥 내용 높이만큼 커져버렸습니다. 그 결과 화면 전체를
  // 감싸는 .app-screen의 overflow:hidden에 의해 넘치는 부분이 스크롤 없이
  // 그냥 잘려 보이지 않는 문제(예: 교통 팁, 홈 화면)가 있었습니다.
  // h-dvh(고정 높이) + 각 단계의 min-h-0(자식이 내용 크기보다 작아질 수
  // 있도록 허용)를 함께 줘야, flex-1인 자손(.screen-scroll)이 정확히
  // "남은 공간만큼의 높이"를 갖게 되고 그 안에서 내부적으로 스크롤됩니다.
  return (
    <div className="pz-shell flex h-dvh w-full flex-col overflow-hidden bg-transparent lg:flex-row lg:bg-white">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {title && (
          <header className="hidden shrink-0 items-center gap-2 border-b border-line px-10 py-6 lg:flex">
            {crumb && <span className="text-[15px] font-medium text-muted">{crumb}</span>}
            <h1 className="text-[20px] font-bold text-navy-deep">{title}</h1>
          </header>
        )}
        <div className="flex min-h-0 flex-1 flex-col lg:items-start lg:bg-[#eef2fb]">
          <div className="flex min-h-0 w-full flex-1 flex-col lg:mx-auto lg:max-w-none lg:px-10 lg:py-8">
            {children}
          </div>
        </div>
      </div>
      {!hideMobileNav && (
        <div className="lg:hidden fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
