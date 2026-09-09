"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { onboardingSlides } from "@/lib/mockData";
import styles from "./page.module.css";

const SCENES = {
  mountain: "/images/onboarding-1-scene.png",
  map: "/images/onboarding-2-scene.png",
  chat: "/images/onboarding-3-scene.png",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const slide = onboardingSlides[idx];
  const isLast = idx === onboardingSlides.length - 1;

  // 앱 소개는 MY > "앱 소개"에서 열리는 화면입니다. 끝나면 MY로 돌아갑니다.
  function done() {
    router.push("/my");
  }

  function next() {
    if (isLast) done();
    else setIdx((v) => v + 1);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <button className={styles.skip} onClick={done}>
          건너뛰기
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.eyebrow}>{slide.eyebrow}</div>
        <div className={styles.title}>
          {slide.title.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        <div className={styles.desc}>{slide.desc}</div>
      </div>

      <div className={styles.scene}>
        <Image
          src={SCENES[slide.scene]}
          alt=""
          width={800} /* 원본 해상도를 커버할 수 있는 넉넉한 기본값 지정 */
          height={
            800
          } /* 실제 렌더링 시에는 height: 'auto'가 비율을 맞춰줍니다 */
          sizes="100vw" /* 화면 너비에 맞는 고해상도 이미지를 불러오도록 수정 */
          quality={100} /* Next.js 기본 압축률을 낮춰 최고 화질로 렌더링 */
          style={{
            width: "100%",
            height: "auto",
          }} /* 가로는 꽉 채우고, 세로는 안 잘리게 원본 비율 유지 */
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.dots}>
          {onboardingSlides.map((s, i) => (
            <span
              key={s.id}
              className={`${styles.dot} ${i === idx ? styles.dotActive : ""}`}
            />
          ))}
        </div>
        <Button variant="primary" onClick={next}>
          {isLast ? "확인" : "다음"}
        </Button>
      </div>
    </div>
  );
}
