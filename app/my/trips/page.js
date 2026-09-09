"use client";

import { useState } from "react";
import Link from "next/link";
import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import { ChipRow, Chip } from "@/components/Chip";
import { trips, favorites } from "@/lib/mockData";

const FILTERS = ["전체", "예정", "진행중", "완료"];

export default function MyTripsPage() {
  const [filter, setFilter] = useState("전체");
  const list = filter === "전체" ? trips : trips.filter((t) => t.status === filter);

  return (
    <TabShell crumb="MY" title="내 여행 일정">
      <Header title="내 여행 일정" backHref="/my" className="lg:hidden" />
      <div className="screen-scroll">
        <div className="container">
          <ChipRow>
            {FILTERS.map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f}
              </Chip>
            ))}
          </ChipRow>

          {list.length === 0 ? (
            <EmptyState
              variant="dots"
              title="아직 계획한 여행이 없어요"
              desc="AI에게 말하면 첫 여행 일정을 만들어드려요"
              action={
                <Link href="/ai">
                  <Button
                    variant="primary"
                    style={{ width: "auto", paddingLeft: 30, paddingRight: 30, borderRadius: 999 }}
                  >
                    AI에게 물어보기 →
                  </Button>
                </Link>
              }
            />
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
                {list.map((t) => (
                  <Link href="/ai/result" key={t.id}>
                    <Card
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "26px 22px",
                      }}
                    >
                      <div>
                        <div className="body-sm">{t.range}</div>
                        <div style={{ fontWeight: 800, fontSize: 16, marginTop: 6 }}>{t.title}</div>
                        <span
                          style={{
                            display: "inline-block",
                            marginTop: 16,
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--navy)",
                            border: "1.5px solid var(--navy)",
                            borderRadius: 999,
                            padding: "6px 16px",
                          }}
                        >
                          {t.status}
                        </span>
                      </div>
                      <Icon name="chevronRight" size={20} />
                    </Card>
                  </Link>
                ))}
              </div>

              <Link href="/ai">
                <Button variant="primary" style={{ marginTop: 28 }} icon={<Icon name="plus" size={18} />}>
                  새 여행 만들기
                </Button>
              </Link>

              <div className="h2" style={{ marginTop: 32, marginBottom: 20 }}>
                최근 저장한 장소
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {favorites.slice(0, 3).map((f) => (
                  <Link href={`/ai/place/${f.id}`} key={f.id}>
                    <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700 }}>{f.name}</span>
                      <Icon name="chevronRight" size={18} />
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </TabShell>
  );
}
