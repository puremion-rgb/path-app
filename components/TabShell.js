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
  return (
    <div className="pz-shell flex min-h-dvh w-full flex-col bg-transparent lg:flex-row lg:bg-white">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {title && (
          <header className="hidden shrink-0 items-center gap-2 border-b border-line px-10 py-6 lg:flex">
            {crumb && <span className="text-[15px] font-medium text-muted">{crumb}</span>}
            <h1 className="text-[20px] font-bold text-navy-deep">{title}</h1>
          </header>
        )}
        <div className="flex flex-1 flex-col lg:items-start lg:bg-[#eef2fb]">
          <div className="flex w-full flex-1 flex-col lg:mx-auto lg:max-w-none lg:px-10 lg:py-8">
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
