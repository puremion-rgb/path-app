"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Card from "@/components/Card";
import { StepChecklist, ToolBar } from "@/components/Steps";
import { reanalysisSteps } from "@/lib/mockData";
import { modifyTrip, getTrip } from "@/lib/apiClient";
import {
  getPendingModification,
  clearPendingModification,
  setLastChangeDiff,
} from "@/lib/tripStore";

export default function AiReanalyzingPage() {
  const router = useRouter();
  const [statusMap, setStatusMap] = useState({});
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const startedRef = useRef(false);

  function start() {
    const pending = getPendingModification();
    if (!pending?.tripId || !pending?.message) {
      router.replace("/ai/chat");
      return;
    }
    setFailed(false);
    setErrorMessage("");
    setStatusMap({});

    getTrip(pending.tripId)
      .then((data) => {
        const beforeItinerary = data.trip.itinerary;
        return modifyTrip(pending, (stepId, patch) => {
          setStatusMap((prev) => ({ ...prev, [stepId]: patch.status }));
        }).then((trip) => ({ trip, beforeItinerary }));
      })
      .then(({ trip, beforeItinerary }) => {
        clearPendingModification();
        setLastChangeDiff({ beforeItinerary, trip });
        setStatusMap((prev) => {
          const next = { ...prev };
          for (const s of reanalysisSteps) if (!next[s.id]) next[s.id] = "done";
          return next;
        });
        setTimeout(() => router.push("/ai/changed"), 400);
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

  return (
    <div className="screen-scroll no-tab">
      <Header title="AI 재분석 중" backHref="/ai/chat" />
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
            <div className="h2">일정을 수정하지 못했어요</div>
            <div className="body-sm" style={{ marginTop: 6, marginBottom: 22 }}>
              {errorMessage}
            </div>
            <Card style={{ width: "100%", display: "flex", gap: 10, justifyContent: "center", padding: 14 }}>
              <button
                style={{ background: "var(--navy)", color: "#fff", border: "none", borderRadius: 999, padding: "12px 28px", fontWeight: 700 }}
                onClick={() => {
                  startedRef.current = true;
                  start();
                }}
              >
                재시도
              </button>
              <button
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 13 }}
                onClick={() => router.push("/ai/chat")}
              >
                다시 요청하기
              </button>
            </Card>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20, marginBottom: 14, color: "var(--navy)" }}>
              <Icon name="sparkle" size={34} filled />
            </div>
            <div className="h2" style={{ textAlign: "center" }}>
              변경사항을 반영해서
              <br />
              다시 계산하고 있어요
            </div>
            <div className="body-sm" style={{ textAlign: "center", marginTop: 4, marginBottom: 30 }}>
              잠시만 기다려주세요.
            </div>

            <StepChecklist steps={reanalysisSteps} statusMap={statusMap} />

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
