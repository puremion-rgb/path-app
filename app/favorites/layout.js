import AuthGuard from "@/components/AuthGuard";

// 찜 화면은 로그인 후에만 접근 가능.
export default function FavoritesLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
