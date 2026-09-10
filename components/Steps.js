"use client";

import Icon from "./Icon";
import styles from "./Steps.module.css";

export function ToolBar({ tools = ["Places", "Routes", "ODPT", "RAG"] }) {
  return (
    <div className={styles.toolBar}>
      {tools.map((t, i) => (
        <span key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span className={styles.dot} />}
          {t}
        </span>
      ))}
    </div>
  );
}

// statusMap: { [stepId]: "pending"|"active"|"done"|"error" } — 실제 Agent Tool 호출
// 이벤트로 각 단계 상태를 개별적으로 갱신할 때 사용합니다. 지정하지 않으면
// activeIndex 기준으로 순차 진행하는 기존 방식을 그대로 사용합니다.
export function StepChecklist({ steps, activeIndex, statusMap }) {
  return (
    <div className={styles.stepList}>
      {steps.map((step, i) => {
        const status = statusMap
          ? statusMap[step.id] || "pending"
          : i < activeIndex
          ? "done"
          : i === activeIndex
          ? "active"
          : "pending";
        return (
          <div className={styles.step} key={step.id}>
            <div className={styles.stepLine} />
            <div className={`${styles.stepMarker} ${styles[status]}`}>
              {status === "done" && <Icon name="check" size={14} strokeWidth={2.6} />}
              {status === "active" && <span className={styles.pulse} />}
              {status === "error" && <Icon name="alert" size={14} strokeWidth={2.6} />}
            </div>
            <div>
              <div className={`${styles.stepTitle} ${status === "pending" ? styles.pending : ""}`}>
                {step.title}
              </div>
              <div className={styles.stepDesc}>{step.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
