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

export function StepChecklist({ steps, activeIndex }) {
  return (
    <div className={styles.stepList}>
      {steps.map((step, i) => {
        const status = i < activeIndex ? "done" : i === activeIndex ? "active" : "pending";
        return (
          <div className={styles.step} key={step.id}>
            <div className={styles.stepLine} />
            <div className={`${styles.stepMarker} ${styles[status]}`}>
              {status === "done" && <Icon name="check" size={14} strokeWidth={2.6} />}
              {status === "active" && <span className={styles.pulse} />}
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
