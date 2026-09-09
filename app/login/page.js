"use client";

// path_zip 프로토타입의 로그인 화면을 그대로 사용합니다.
// 모바일: 세로형 카드 레이아웃 / PC: 좌측 브랜드 패널 + 우측 폼의 2단 레이아웃
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { setLoggedIn } from "@/components/AuthGuard";

function LoginForm({ tab, setTab, onAuth, size = "base" }) {
  const big = size === "lg";
  return (
    <>
      <div className={`grid grid-cols-2 gap-0 rounded-full bg-[#eef2fb] p-1 ${big ? "mt-10" : "mt-8"}`}>
        <button
          onClick={() => setTab("login")}
          className={`h-12 rounded-full text-[15px] font-bold transition ${
            tab === "login" ? "bg-navy text-white" : "bg-transparent text-navy-deep/60"
          }`}
        >
          로그인
        </button>
        <button
          onClick={() => setTab("signup")}
          className={`h-12 rounded-full text-[15px] font-bold transition ${
            tab === "signup" ? "bg-navy text-white" : "bg-transparent text-navy-deep/60"
          }`}
        >
          회원가입
        </button>
      </div>

      <form
        className="mt-6 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          onAuth();
        }}
      >
        {tab === "signup" && (
          <input
            type="text"
            placeholder="이름"
            className="h-14 rounded-2xl border border-line bg-white px-5 text-[15px] outline-none focus:border-navy"
          />
        )}
        <input
          type="email"
          placeholder="이메일"
          className="h-14 rounded-2xl border border-line bg-white px-5 text-[15px] outline-none focus:border-navy"
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="h-14 rounded-2xl border border-line bg-white px-5 text-[15px] outline-none focus:border-navy"
        />

        <label className="mt-1 flex items-center gap-2 text-[13px] text-navy-deep/80">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-white">
            ✓
          </span>
          {tab === "login" ? "로그인 상태 유지" : "이용약관에 동의합니다"}
        </label>

        <button
          type="submit"
          className="mt-3 flex h-14 w-full items-center justify-center rounded-2xl bg-navy text-[16px] font-bold text-white"
        >
          {tab === "login" ? "로그인" : "가입하기"}
        </button>
      </form>

      <div className="my-7 flex items-center gap-3 text-[13px] text-muted">
        <span className="h-px flex-1 bg-line" />
        또는
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className={`flex justify-center gap-4 ${big ? "" : "pb-16"}`}>
        <button className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-white text-[18px] font-bold text-[#4285F4]">
          G
        </button>
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-[18px]">
          💬
        </button>
      </div>
    </>
  );
}

export default function LoginPage() {
  const [tab, setTab] = useState("login"); // login | signup
  const router = useRouter();

  function handleAuth() {
    setLoggedIn(true);
    let next = "/home";
    try {
      const q = new URLSearchParams(window.location.search).get("next");
      if (q && q.startsWith("/")) next = q;
    } catch {}
    router.replace(next);
  }

  return (
    <div className="pz-fullbleed">
      {/* 모바일: 기존 세로형 카드 레이아웃 */}
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-[#f7f9fd] px-7 pt-16 lg:hidden">
        <div className="flex flex-col items-center">
          <Image src="/logo/logo-mark.svg" alt="PATH" width={227} height={258} className="h-20 w-auto" />
          <h2 className="mt-5 text-[17px] font-extrabold text-navy-deep">
            AI와 함께, 일본 여행의 가장 확실한 길
          </h2>
          <p className="mt-1 text-[13px] text-muted">여행 계획부터 이동경로까지 한 번에</p>
        </div>
        <LoginForm tab={tab} setTab={setTab} onAuth={handleAuth} />
      </div>

      {/* PC: 좌측 브랜드 패널 + 우측 로그인 폼의 2단 레이아웃 */}
      <div className="hidden min-h-dvh w-full lg:flex">
        <div className="relative flex w-1/2 flex-col items-center justify-center overflow-hidden bg-navy px-10 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), transparent 45%), radial-gradient(circle at 75% 70%, rgba(244,162,104,0.35), transparent 40%)",
            }}
          />
          <Image
            src="/logo/logo-text.svg"
            alt="PATH"
            width={270}
            height={63}
            className="relative h-11 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <h1 className="relative mt-8 max-w-md text-center text-[28px] font-extrabold leading-snug">
            AI와 함께,
            <br />
            일본 여행의 가장 확실한 길
          </h1>
          <p className="relative mt-3 text-[15px] text-white/70">
            여행 계획부터 이동경로까지 한 번에
          </p>
        </div>

        <div className="flex w-1/2 justify-center overflow-y-auto bg-[#f7f9fd] px-10 py-20">
          <div className="h-fit w-full max-w-[380px]">
            <p className="text-[22px] font-extrabold text-navy-deep">
              {tab === "login" ? "로그인" : "회원가입"}
            </p>
            <p className="mt-1 text-[14px] text-muted">
              {tab === "login" ? "다시 만나서 반가워요." : "몇 가지 정보만 입력하면 시작할 수 있어요."}
            </p>
            <LoginForm tab={tab} setTab={setTab} onAuth={handleAuth} size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
