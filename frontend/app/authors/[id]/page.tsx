"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, BookMarked, Layers, UserPlus, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { useSubscriptions } from "@/lib/subscriptions";
import { MOCK_AUTHORS } from "@/lib/mockAuthors";
import { MOCK_STORIES } from "@/lib/mockStories";
import { GENRE_BADGE } from "@/lib/genreStyles";
import type { StoryItem } from "@/components/StoryListItem";
import styles from "./page.module.css";

type StoryTab = "all" | "ongoing" | "completed";

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function AuthorStoryCard({ story }: { story: StoryItem }) {
  const { t } = useTranslation();
  const languageList = story.language
    .map((l) => t(`languageNames.${l}`, { defaultValue: l }))
    .join(", ");

  return (
    <Link href={`/stories/${story.id}`} className={styles.storyCard}>
      {/* Cover */}
      <div className={styles.cardCover}>
        <div className={styles.cardCoverOverlay} />
        <BookOpen size={32} className={styles.cardCoverIcon} />
        <div className={styles.cardBadges}>
          <span className={styles.cardBadge}>
            {t(`storyCard.${story.status}`, { defaultValue: story.status })}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <div className={styles.cardTitleRow}>
          <h3 className={styles.cardTitle}>{story.title}</h3>
          <span className={styles.cardRating}>★ {story.rating.toFixed(1)}</span>
        </div>

        <div className={styles.cardMeta}>
          <span>{story.author}</span>
          <span className={styles.cardMetaDot} />
          <span>{story.year}</span>
        </div>

        <div className={styles.cardPills}>
          {story.genres.map((g) => {
            return (
              <span
                key={g}
                className={styles.cardPill}
                style={{ background: GENRE_BADGE.bg, color: GENRE_BADGE.color, borderColor: GENRE_BADGE.border }}
              >
                {t(`genreNames.${g}`, { defaultValue: g })}
              </span>
            );
          })}
        </div>

        <p className={styles.cardLanguages}>{languageList}</p>

        <p className={styles.cardDesc}>{story.description}</p>

        <div className={styles.cardFooter}>
          <div className={styles.cardStats}>
            <span className={styles.cardStat}>
              <BookMarked size={12} />
              {story.chapters} {t("storyCard.chaptersSuffix")}
            </span>
            <span className={styles.cardStat}>
              <Layers size={12} />
              {story.pages} {t("storyCard.pagesSuffix")}
            </span>
          </div>
          <span className={styles.cardReadBtn}>{t("storyList.readButton")}</span>
        </div>
      </div>
    </Link>
  );
}

export default function AuthorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const { isSubscribed, toggleSubscription } = useSubscriptions();
  const [tab, setTab] = useState<StoryTab>("all");

  const author = MOCK_AUTHORS.find((a) => a.id === Number(id));
  if (!author) {
    notFound();
    return null;
  }

  const following = isSubscribed(author.id);

  const isOwner = isLoggedIn && user?.username === author.username;

  const authorStories = MOCK_STORIES.filter(
    (s) => s.author === author.displayName
  );
  const ongoingCount = authorStories.filter((s) => s.status === "ongoing").length;
  const completedCount = authorStories.filter((s) => s.status === "completed").length;

  const filteredStories =
    tab === "all"
      ? authorStories
      : authorStories.filter((s) => s.status === tab);

  return (
    <div>
      <main className={styles.main}>
        <div className={styles.container}>

          {/* ── Profile ── */}
          <section className={styles.profile}>
            <div
              className={styles.avatar}
              style={{ backgroundColor: author.avatarColor }}
            >
              {getInitials(author.displayName)}
            </div>

            <div className={styles.profileText}>
              <h1 className={styles.profileName}>{author.displayName}</h1>
              <p className={styles.profileHandle}>
                @{author.username} · {t("authorProfile.memberSince")}{" "}
                {author.memberSince}
              </p>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.pstat}>
                <span className={styles.pstatVal} style={{ color: "#a78bfa" }}>
                  {authorStories.length}
                </span>
                <span className={styles.pstatLbl}>
                  {t("authorProfile.stories")}
                </span>
              </div>
              <div className={styles.pstat}>
                <span className={styles.pstatVal} style={{ color: "#4ade80" }}>
                  {formatCount(author.subscribers)}
                </span>
                <span className={styles.pstatLbl}>
                  {t("authorProfile.followers")}
                </span>
              </div>
              <div className={styles.pstat}>
                <span className={styles.pstatVal} style={{ color: "#f97316" }}>
                  {formatCount(author.totalReads)}
                </span>
                <span className={styles.pstatLbl}>
                  {t("authorProfile.totalReads")}
                </span>
              </div>
            </div>

            <div className={styles.profileActions}>
              {isOwner ? (
                <Link href={`/authors/${id}/dashboard`} className={styles.btnFollow}>
                  <Settings size={14} />
                  {t("authorDashboard.manageStories")}
                </Link>
              ) : (
                <button
                  className={`${styles.btnFollow} ${following ? styles.btnFollowActive : ""}`}
                  onClick={() => toggleSubscription(author.id)}
                >
                  <UserPlus size={14} />
                  {following
                    ? t("authorProfile.following")
                    : t("authorProfile.follow")}
                </button>
              )}
            </div>
          </section>

          {/* ── Tabs ── */}
          <div className={`${styles.tabs} justify-self-center`}>
            <button
              className={`${styles.tab} ${tab === "all" ? styles.tabOn : ""}`}
              onClick={() => setTab("all")}
            >
              {t("authorProfile.allStories")}
              <span
                className={`${styles.tabCount} ${tab === "all" ? styles.tabCountOn : ""}`}
              >
                {authorStories.length}
              </span>
            </button>
            <button
              className={`${styles.tab} ${tab === "ongoing" ? styles.tabOn : ""}`}
              onClick={() => setTab("ongoing")}
            >
              {t("authorProfile.inProgress")}
              <span
                className={`${styles.tabCount} ${tab === "ongoing" ? styles.tabCountOn : ""}`}
              >
                {ongoingCount}
              </span>
            </button>
            <button
              className={`${styles.tab} ${tab === "completed" ? styles.tabOn : ""}`}
              onClick={() => setTab("completed")}
            >
              {t("authorProfile.completed")}
              <span
                className={`${styles.tabCount} ${tab === "completed" ? styles.tabCountOn : ""}`}
              >
                {completedCount}
              </span>
            </button>
          </div>

          {/* ── Story list ── */}
          <div className={styles.stories}>
            {filteredStories.length === 0 ? (
              <p className={styles.empty}>{t("authorProfile.noStories")}</p>
            ) : (
              filteredStories.map((story) => (
                <AuthorStoryCard key={story.id} story={story} />
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
