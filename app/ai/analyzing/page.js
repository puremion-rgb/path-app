"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { StepChecklist, ToolBar } from "@/components/Steps";
import { analysisSteps } from "@/lib/mockData";
import { planTrip } from "@/lib/apiClient";
import { getPendingRequest, clearPendingRequest, setCurrentTripId } from "@/lib/tripStore";

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
  const [statusMap, setStatusMap] = useState({});
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const startedRef = useRef(false);

  function start() {
    const pending = getPendingRequest();
    if (!pending?.message) {
      router.replace("/ai");
      return;
    }
    setFailed(false);
    setErrorMessage("");
    setStatusMap({});

    planTrip(pending, (stepId, patch) => {
      setStatusMap((prev) => ({ ...prev, [stepId]: patch.status }));
    })
      .then((trip) => {
        clearPendingRequest();
        setCurrentTripId(trip.id);
        setStatusMap((prev) => {
          const next = { ...prev };
          for (const s of analysisSteps) if (!next[s.id]) next[s.id] = "done";
          return next;
        });
        setTimeout(() => router.push("/ai/result"), 400);
      })
      .catch((err) => {
        setErrorMessage(err.message || "네트워크 오류가 발생했어요");
        setFailed(true);
      });
  }

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function retry() {
    startedRef.current = true;
    start();
  }

  return (
    <div className="screen-scroll no-tab">
      <Header title="AI 분석 중" backHref="/ai" showHome />
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
              {errorMessage || "네트워크 오류가 발생했어요"}
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
              <Icon name="sparkle" size={34} filled />
            </div>
            <div className="h2" style={{ textAlign: "center" }}>
              여행 일정을 분석하고 있어요
            </div>
            <div className="body-sm" style={{ textAlign: "center", marginTop: 4, marginBottom: 30 }}>
              AI가 실제 지도·경로 데이터를 조회하는 중이에요. 잠시만 기다려주세요.
            </div>

            <StepChecklist steps={analysisSteps} statusMap={statusMap} />

            <Card style={{ marginTop: 26 }}>
              <ToolBar tools={["Google Places", "Google Routes", "ODPT", "RAG"]} />
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
