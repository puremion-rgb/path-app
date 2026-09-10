import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "PATH — 일본 여행 AI 에이전트",
  description:
    "한국인 자유여행자를 위한 AI 여행·대중교통 에이전트, PATH. 자연어 한마디로 도쿄 여행 일정과 이동경로를 만들고 수정하세요.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1e2761",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <div className="app-viewport">
            <div className="app-screen">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

