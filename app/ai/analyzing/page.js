"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { StepChecklist, ToolBar } from "@/components/Steps";
import { analysisSteps } from "@/lib/mockData";

// 실제 백엔드 없이도 실패 UI가 "실제로" 동작하도록, 분석 중 일정 확률로
// 네트워크 오류 상황을 시뮬레이션합니다. (QA/데모용으로 ?fail=1 을 붙이면 강제로 재현 가능)
const RANDOM_FAILURE_RATE = 0.2;

export default function AiAnalyzingPage() {
  return (
    <Suspense fallback={null}>
      <AiAnalyzingInner />
    </Suspense>
  );
}

function AiAnalyzingInner() {
  const router = useRouter();
  const params = useSearchParams();
  const forcedFail = params.get("fail") === "1";
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState(false);

  // 이번 시도에서 실패가 발생할지, 발생한다면 어느 단계에서 발생할지를
  // 최초 1회만 결정합니다(리렌더될 때마다 확률이 바뀌지 않도록).
  const failPlan = useRef(null);
  if (failPlan.current === null) {
    if (forcedFail) {
      failPlan.current = 0;
    } else {
      const willFail = Math.random() < RANDOM_FAILURE_RATE;
      failPlan.current = willFail ? Math.floor(Math.random() * analysisSteps.length) : -1;
    }
  }

  useEffect(() => {
    if (failed) return;

    if (failPlan.current !== -1 && step === failPlan.current) {
      const t = setTimeout(() => setFailed(true), 600);
      return () => clearTimeout(t);
    }

    if (step >= analysisSteps.length) {
      const t = setTimeout(() => router.push("/ai/result"), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 750);
    return () => clearTimeout(t);
  }, [step, failed, router]);

  function retry() {
    // 재시도 버튼을 누르면 새 분석 요청으로 취급해 처음부터 다시 진행합니다.
    // (강제 실패용 ?fail=1 파라미터가 있었다면 제거해 다음 시도는 정상적으로 재시뮬레이션합니다.)
    router.replace("/ai/analyzing");
    const willFail = Math.random() < RANDOM_FAILURE_RATE;
    failPlan.current = willFail ? Math.floor(Math.random() * analysisSteps.length) : -1;
    setStep(0);
    setFailed(false);
  }

  return (
    <div className="screen-scroll no-tab">
      <Header title="AI 분석 중" backHref="/ai" />
      <div className="container">
        {failed ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "60px 10px 0" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#fde3e3",
                color: "var(--red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Icon name="alert" size={34} strokeWidth={2.6} />
            </div>
            <div className="h2">일정을 만들지 못했어요</div>
            <div className="body-sm" style={{ marginTop: 6, marginBottom: 22 }}>
              네트워크 오류가 발생했어요
              <br />
              잠시 후 다시 시도해주세요
            </div>
            <Button
              variant="primary"
              onClick={retry}
              style={{ width: "auto", paddingLeft: 30, paddingRight: 30, borderRadius: 999 }}
            >
              재시도
            </Button>
            <button
              style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 13, marginTop: 14 }}
              onClick={() => router.push("/ai")}
            >
              조건을 바꿔서 다시 요청하기
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20, marginBottom: 14, color: "var(--navy)" }}>
              <Icon name="sparkle" size={34} />
            </div>
            <div className="h2" style={{ textAlign: "center" }}>
              여행 일정을 분석하고 있어요
            </div>
            <div className="body-sm" style={{ textAlign: "center", marginTop: 4, marginBottom: 30 }}>
              잠시만 기다려주세요.
            </div>

            <StepChecklist steps={analysisSteps} activeIndex={step} />

            <Card style={{ marginTop: 26 }}>
              <ToolBar />
              <div className="body-sm" style={{ marginTop: 6 }}>
                필요한 정보를 조합해 일정에 반영하고 있어요.
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
