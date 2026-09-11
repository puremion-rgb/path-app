"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TabShell from "@/components/TabShell";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import Icon from "@/components/Icon";
import Spinner from "@/components/Spinner";
import { ChipRow, Chip } from "@/components/Chip";
import { listTrips, listFavorites, renameTrip, deleteTrip, setTripStatus, placePhotoUrl } from "@/lib/apiClient";
import { setCurrentTripId } from "@/lib/tripStore";
import styles from "./page.module.css";

const FILTERS = ["전체", "active", "archived"];
const FILTER_LABEL = { 전체: "전체", active: "진행중", archived: "완료" };

// 일정에 포함된 실제 장소 중 사진이 있는 첫 장소를 찾아 카드 썸네일로 씁니다.
// (Google Places에서 실제로 받아온 사진이라 장소가 없거나 사진이 없으면 조용히 생략됩니다.)
function getTripPhotoName(trip) {
  const placesById = trip.itinerary?.placesById || {};
  for (const day of trip.itinerary?.days || []) {
    for (const item of day.items || []) {
      const place = item.placeId ? placesById[item.placeId] : null;
      if (place?.photoName) return place.photoName;
    }
  }
  return null;
}

export default function MyTripsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("전체");
  const [trips, setTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  useEffect(() => {
    Promise.all([listTrips(), listFavorites()])
      .then(([tripsData, favData]) => {
        setTrips(tripsData.trips || []);
        setFavorites(favData.favorites || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const list = filter === "전체" ? trips : trips.filter((t) => t.status === filter);

  function openTrip(t) {
    setCurrentTripId(t.id);
    router.push("/ai/result");
  }

  function toggleMenu(t, e) {
    e.stopPropagation();
    setMenuOpenId((prev) => (prev === t.id ? null : t.id));
  }

  function startEdit(t, e) {
    e.stopPropagation();
    setMenuOpenId(null);
    setEditingId(t.id);
    setEditTitle(t.title);
  }

  function cancelEdit(e) {
    e.stopPropagation();
    setEditingId(null);
    setEditTitle("");
  }

  async function saveEdit(t, e) {
    e.stopPropagation();
    const title = editTitle.trim();
    if (!title) return;
    setBusyId(t.id);
    try {
      const { trip } = await renameTrip(t.id, title);
      setTrips((prev) => prev.map((x) => (x.id === t.id ? trip : x)));
      setEditingId(null);
      setEditTitle("");
    } catch (err) {
      alert(err.message || "제목 수정에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(t, e) {
    e.stopPropagation();
    setMenuOpenId(null);
    if (!window.confirm(`"${t.title}" 일정을 삭제할까요?\n삭제하면 되돌릴 수 없어요.`)) return;
    setBusyId(t.id);
    try {
      await deleteTrip(t.id);
      setTrips((prev) => prev.filter((x) => x.id !== t.id));
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleStatus(t, e) {
    e.stopPropagation();
    setMenuOpenId(null);
    const nextStatus = t.status === "active" ? "archived" : "active";
    setBusyId(t.id);
    try {
      const { trip } = await setTripStatus(t.id, nextStatus);
      setTrips((prev) => prev.map((x) => (x.id === t.id ? trip : x)));
    } catch (err) {
      alert(err.message || "상태 변경에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleShare(t, e) {
    e.stopPropagation();
    setMenuOpenId(null);
    const shareData = {
      title: t.title,
      text: `PATH로 만든 여행 일정: ${t.title}`,
      url: typeof window !== "undefined" ? `${window.location.origin}/my/trips` : undefined,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert("일정 링크를 클립보드에 복사했어요.");
      } else {
        alert("이 브라우저에서는 공유하기를 지원하지 않아요.");
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        alert("공유하기에 실패했어요.");
      }
    }
  }

  return (
    <TabShell crumb="MY" title="내 여행 일정">
      <Header title="내 여행 일정" backHref="/my" className="lg:hidden" />
      <div className="screen-scroll">
        <div className="container">
          <ChipRow>
            {FILTERS.map((f) => (
              <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
                {FILTER_LABEL[f]}
              </Chip>
            ))}
          </ChipRow>

          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20 }}>
              <Spinner size={20} />
              <p className="body-sm">불러오는 중...</p>
            </div>
          ) : list.length === 0 ? (
            <EmptyState
              variant="dots"
              title="아직 계획한 여행이 없어요"
              desc="AI에게 말하면 첫 여행 일정을 만들어드려요"
              action={
                <Link href="/ai">
                  <Button variant="primary" style={{ width: "auto", paddingLeft: 30, paddingRight: 30, borderRadius: 999 }}>
                    AI에게 물어보기 →
                  </Button>
                </Link>
              }
            />
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
                {list.map((t) => {
                  const isEditing = editingId === t.id;
                  const isBusy = busyId === t.id;
                  const isMenuOpen = menuOpenId === t.id;
                  const photoName = getTripPhotoName(t);

                  return (
                    <div
                      key={t.id}
                      onClick={() => !isEditing && openTrip(t)}
                      style={{ width: "100%", cursor: isEditing ? "default" : "pointer" }}
                    >
                      <Card className={styles.tripCard}>
                        <div className={styles.cardHeader}>
                          <div className="body-sm" style={{ minWidth: 0 }}>
                            {(t.itinerary?.days || []).map((d) => d.date).filter(Boolean).join(" · ") || t.requestText}
                          </div>

                          {!isEditing && (
                            <div className={styles.headerActions}>
                              <div className={styles.menuWrap}>
                                <button
                                  onClick={(e) => toggleMenu(t, e)}
                                  disabled={isBusy}
                                  aria-label="일정 옵션 더보기"
                                  className={styles.moreBtn}
                                >
                                  <Icon name="more" size={18} filled />
                                </button>

                                {isMenuOpen && (
                                  <>
                                    <div className={styles.menuOverlay} onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); }} />
                                    <div onClick={(e) => e.stopPropagation()} className={styles.menu}>
                                      <button onClick={(e) => startEdit(t, e)} className={styles.menuItem}>
                                        <Icon name="edit" size={16} />
                                        일정 수정
                                      </button>
                                      <button onClick={(e) => handleToggleStatus(t, e)} className={styles.menuItem}>
                                        <Icon name={t.status === "active" ? "check" : "refresh"} size={16} />
                                        {t.status === "active" ? "완료로 표시" : "완료 취소"}
                                      </button>
                                      <button onClick={(e) => handleShare(t, e)} className={styles.menuItem}>
                                        <Icon name="share" size={16} />
                                        일정 공유
                                      </button>
                                      <div className={styles.menuDivider} />
                                      <button
                                        onClick={(e) => handleDelete(t, e)}
                                        className={`${styles.menuItem} ${styles.menuItemDanger}`}
                                      >
                                        <Icon name="trash" size={16} />
                                        일정 삭제
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                              <span className={styles.divider} />
                              <Icon name="chevronRight" size={20} className="text-navy" />
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          <div onClick={(e) => e.stopPropagation()} className={styles.editRow}>
                            <input
                              autoFocus
                              value={editTitle}
                              maxLength={60}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit(t, e);
                                if (e.key === "Escape") cancelEdit(e);
                              }}
                              className={styles.titleInput}
                            />
                            <button
                              onClick={(e) => saveEdit(t, e)}
                              disabled={isBusy}
                              aria-label="제목 저장"
                              className={`${styles.actionBtn} ${styles.saveBtn}`}
                            >
                              <Icon name="check" size={18} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={isBusy}
                              aria-label="수정 취소"
                              className={`${styles.actionBtn} ${styles.cancelBtn}`}
                            >
                              <Icon name="close" size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className={styles.tripTitle}>{t.title}</div>
                        )}

                        <span
                          className={`${styles.statusPill} ${
                            t.status === "active" ? styles.statusActive : styles.statusArchived
                          }`}
                        >
                          {FILTER_LABEL[t.status] || t.status}
                        </span>

                        {photoName && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={placePhotoUrl(photoName, 640)} alt={t.title} className={styles.tripImage} />
                        )}
                      </Card>
                    </div>
                  );
                })}
              </div>

              <Link href="/ai">
                <Button variant="primary" style={{ marginTop: 28 }} icon={<Icon name="plus" size={18} />}>
                  새 여행 만들기
                </Button>
              </Link>

              {favorites.length > 0 && (
                <>
                  <div className="h2" style={{ marginTop: 32, marginBottom: 20 }}>
                    최근 저장한 장소
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {favorites.slice(0, 3).map((f) => (
                      <Link href={`/ai/place/${f.placeId}`} key={f.placeId}>
                        <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 700 }}>{f.name}</span>
                          <Icon name="chevronRight" size={18} />
                        </Card>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </TabShell>
  );
}
