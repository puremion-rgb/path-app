"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Icon from "@/components/Icon";
import Card from "@/components/Card";
import Spinner from "@/components/Spinner";
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
        }).then((res) => ({ ...res, beforeItinerary }));
      })
      .then(({ trip, answer, beforeItinerary }) => {
        clearPendingModification();
        // 번역/일반 질문 답변은 일정을 바꾸지 않으므로, 변경 diff 화면 대신
        // 채팅 화면으로 바로 돌아가 답변을 대화 형태로 보여줍니다. 이때는 일정
        // 체크리스트를 "완료"로 채우지 않습니다 — 그렇게 하면 화면을 뜨기 직전
        // 순간적으로 일정 재계산 체크리스트가 보였다가 사라지게 되기 때문입니다.
        if (answer != null) {
          setTimeout(() => router.push("/ai/chat"), 300);
          return;
        }
        setStatusMap((prev) => {
          const next = { ...prev };
          for (const s of reanalysisSteps) if (!next[s.id]) next[s.id] = "done";
          return next;
        });
        setLastChangeDiff({ beforeItinerary, trip });
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

  // 번역/일반 질문에 대한 답변은 search_places/compute_route 같은 일정 관련 Tool을
  // 전혀 쓰지 않습니다. 그래서 이 단계들 중 하나라도 진행된 적이 있어야만 "진짜 일정
  // 재계산" 화면(체크리스트 + Google Places/Routes 등 표시)을 보여주고, 그렇지 않으면
  // (번역/질문일 가능성이 높으면) 아래 일정 전용 UI 대신 단순 로딩 표시만 보여줍니다.
  const hasScheduleToolActivity = reanalysisSteps.some((s) => statusMap[s.id]);

  return (
    <div className="screen-scroll no-tab">
      <Header title={hasScheduleToolActivity ? "AI 재분석 중" : "AI 응답 중"} backHref="/ai/chat" showHome />
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
        ) : hasScheduleToolActivity ? (
          <>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20, marginBottom: 14, color: "var(--navy)" }}>
              <Icon name="sparkle" size={34} filled />
            </div>
            <div className="h2" style={{ textAlign: "center" }}>
              요청하신 내용을
              <br />
              확인하고 있어요
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
        ) : (
          // 번역/일반 질문처럼 일정 관련 Tool이 전혀 실행되지 않는 요청은, 일정을
          // 다시 계산하는 것처럼 보이는 체크리스트 화면 대신 단순 로딩 표시만 보여줍니다.
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "90px 10px 0",
            }}
          >
            <Spinner size={40} />
            <div className="body-sm" style={{ marginTop: 18 }}>
              AI가 답변을 준비하고 있어요...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
