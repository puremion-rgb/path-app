import AuthGuard from "@/components/AuthGuard";

// MY 및 하위 화면(내 여행 일정 / 프로필 / 설정 / 고객센터 등)은 로그인 후에만 접근 가능.
export default function MyLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
