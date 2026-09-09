"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Card from "@/components/Card";
import { StepChecklist, ToolBar } from "@/components/Steps";
import { reanalysisSteps } from "@/lib/mockData";

export default function AiReanalyzingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= reanalysisSteps.length) {
      const t = setTimeout(() => router.push("/ai/changed"), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [step, router]);

  return (
    <div className="screen-scroll no-tab">
      <Header title="AI 재분석 중" backHref="/ai/chat" />
      <div className="container">
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20, marginBottom: 14, color: "var(--navy)" }}>
          <Icon name="sparkle" size={34} />
        </div>
        <div className="h2" style={{ textAlign: "center" }}>
          변경사항을 반영해서
          <br />
          다시 계산하고 있어요
        </div>
        <div className="body-sm" style={{ textAlign: "center", marginTop: 4, marginBottom: 30 }}>
          잠시만 기다려주세요.
        </div>

        <StepChecklist steps={reanalysisSteps} activeIndex={step} />

        <Card style={{ marginTop: 26 }}>
          <ToolBar />
          <div className="body-sm" style={{ marginTop: 6 }}>
            필요한 정보를 조합해 일정에 반영하고 있어요.
          </div>
        </Card>
      </div>
    </div>
  );
}
