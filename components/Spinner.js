import styles from "./Spinner.module.css";

// 화면 곳곳의 "불러오는 중..." / "검색 중..." 텍스트 옆에 붙이는 공통 로딩
// 아이콘입니다. size(전체 지름)만 넘기면 두께(thickness)는 자동으로 비례
// 계산되고, 색은 이 앱의 메인 남색(--navy) 하나로 고정입니다.
export default function Spinner({ size = 28, className = "", style }) {
  const thickness = Math.max(Math.round(size * 0.16), 3);
  return (
    <div
      className={`${styles.spinner} ${className}`}
      style={{ width: size, height: size, "--thickness": `${thickness}px`, ...style }}
      role="status"
      aria-label="로딩 중"
    >
      <div className={styles.highlight} />
    </div>
  );
}
