"use client";

import Link from "next/link";
import styles from "./Timeline.module.css";

// 처음엔 카테고리 6개를 색 6개로 전부 다르게 나눴는데, 이 앱의 남색+주황
// 중심 톤에 비해 너무 알록달록해 보여서 3톤(기본/식사·카페/이동)으로
// 단순화했습니다. category가 없는 옛날 일정은 기본값(남색)으로 표시됩니다.
const CATEGORY_TONE = {
  관광: "primary",
  숙소: "primary",
  쇼핑: "primary",
  맛집: "food",
  카페: "food",
  이동: "transit",
};

function dotToneClass(item) {
  // AI가 이번 수정으로 새로 바뀐 항목이라고 표시한 경우, 카테고리 색보다
  // 우선해서 빨간 점으로 강조합니다.
  if (item.changed) return styles.changed;
  return styles[CATEGORY_TONE[item.category]] || styles.primary;
}

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
              <span className={`${styles.dot} ${dotToneClass(item)}`} />
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
