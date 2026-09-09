"use client";

import Link from "next/link";
import styles from "./Timeline.module.css";

export default function Timeline({ items }) {
  return (
    <div className={styles.timeline}>
      {items.map((item, i) => {
        const descLines = item.desc
          ? item.desc.split("·").map((s) => s.trim()).filter(Boolean)
          : [];

        const body = (
          <>
            <div className={styles.headRow}>
              <span className={`${styles.dot} ${styles[item.tone] || ""}`} />
              <span className={styles.time}>{item.time}</span>
              <span className={styles.title}>{item.title}</span>
            </div>
            {descLines.length > 0 && (
              <div className={styles.descWrap}>
                {descLines.map((line, j) => (
                  <div className={styles.desc} key={j}>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </>
        );
        const Wrapper = item.placeId ? Link : "div";
        const wrapperProps = item.placeId
          ? { href: `/ai/place/${item.placeId}` }
          : {};
        return (
          <Wrapper className={styles.row} key={i} {...wrapperProps}>
            <div className={styles.rail} />
            {body}
          </Wrapper>
        );
      })}
    </div>
  );
}
