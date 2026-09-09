"use client";

// path_zip 프로토타입의 모바일 상단바(뒤로가기 + 제목)를 그대로 사용합니다.
// 기존 화면들은 <Header ... /> 를 그대로 쓰면 되고, PC(TabShell) 화면에서는
// className="lg:hidden" 을 넘겨 데스크톱 헤더와 중복되지 않게 합니다.
import StackHeader from "./StackHeader";

export default function Header({ title, onBack, backHref, right, className = "" }) {
  return (
    <StackHeader
      title={title}
      onBack={onBack}
      backHref={backHref}
      right={right}
      className={className}
    />
  );
}
