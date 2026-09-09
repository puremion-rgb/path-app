"use client";

import Icon from "./Icon";
import styles from "./EmptyState.module.css";

// variant="icon" (default): 원형 배경 + 라인 아이콘 (찜, 에러 화면 등에서 사용)
// variant="dots": 둥근 사각형 배경 + 점 3개 (아직 데이터가 전혀 없는 "빈 상태" 목록에서 사용,
//                 예: 내 여행 일정이 하나도 없을 때)
export default function EmptyState({ icon = "heart", variant = "icon", title, desc, action }) {
  return (
    <div className={styles.wrap}>
      {variant === "dots" ? (
        <div className={styles.iconBoxSquare}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      ) : (
        <div className={styles.iconBox}>
          <Icon name={icon} size={56} strokeWidth={1.7} />
        </div>
      )}
      <div className={styles.title}>{title}</div>
      {desc && <div className={styles.desc}>{desc}</div>}
      {action}
    </div>
  );
}
