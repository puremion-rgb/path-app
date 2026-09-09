"use client";

import styles from "./Chip.module.css";

export function Chip({ children, active, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${active ? styles.active : ""}`}
      onClick={onClick}
      aria-pressed={!!active}
    >
      {children}
    </button>
  );
}

export function ChipRow({ children }) {
  return <div className={styles.row}>{children}</div>;
}
