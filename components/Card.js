"use client";

import styles from "./Card.module.css";

export default function Card({ children, padded = true, className = "", ...rest }) {
  const cls = [styles.card, padded ? styles.padded : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}
