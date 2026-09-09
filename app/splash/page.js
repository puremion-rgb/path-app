"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import styles from "./page.module.css";

export default function SplashPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.scene}>
        <Image
          src="/images/splash-bg.jpg"
          alt="AI와 함께, 일본 여행의 가장 확실한 길"
          fill
          priority
          sizes="480px"
          style={{ objectFit: "cover" }}
        />
        <div className={styles.scrim} />

        <div className={styles.footer}>
          <Link href="/home">
            <Button variant="primary">시작하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

