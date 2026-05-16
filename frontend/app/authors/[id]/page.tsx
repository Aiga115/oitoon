"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, BookMarked, Layers, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import { MOCK_AUTHORS } from "@/lib/mockAuthors";
import { MOCK_STORIES } from "@/lib/mockStories";
import {
  GENRE_STYLES,
  DEFAULT_GENRE_STYLE,
  STATUS_STYLES,
  DEFAULT_STATUS_STYLE,
} from "@/lib/genreStyles";
import type { StoryItem } from "@/components/StoryCard";
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
  const primaryGenre = story.genres[0] ?? "";
  const gs = GENRE_STYLES[primaryGenre] ?? DEFAULT_GENRE_STYLE;
  const ss = STATUS_STYLES[story.status] ?? DEFAULT_STATUS_STYLE;

  return (
    <Link href={`/stories/${story.id}`} className={styles.storyCard}>
      {/* Cover */}
      <div className={styles.cardCover} style={{ background: gs.gradient }}>
        <div className={styles.cardCoverOverlay} />
        <BookOpen
          size={26}
          className={styles.cardCoverIcon}
          style={{ color: gs.iconColor }}
        />
        <span
          className={styles.cardBadge}
          style={{ background: ss.badgeBg, color: ss.badgeColor }}
        >
          {t(`storyCard.${story.status}`, { defaultValue: story.status })}
        </span>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <div className={styles.cardTopLeft}>
            <h3 className={styles.cardTitle}>{story.title}</h3>
            <div className={styles.cardPills}>
              {story.genres.map((g) => {
                const s = GENRE_STYLES[g] ?? DEFAULT_GENRE_STYLE;
                return (
                  <span
                    key={g}
                    className={styles.cardPill}
                    style={{ background: s.badgeBg, color: s.badgeColor }}
                  >
                    {t(`genreNames.${g}`, { defaultValue: g })}
                  </span>
                );
              })}
            </div>
          </div>
          <span className={styles.cardRating}>★ {story.rating.toFixed(1)}</span>
        </div>

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
  const [tab, setTab] = useState<StoryTab>("all");
  const [following, setFollowing] = useState(false);

  const author = MOCK_AUTHORS.find((a) => a.id === Number(id));
  if (!author) {
    notFound();
    return null;
  }

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
    <div className="flex flex-col min-h-screen">
      <Header />
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
              <button
                className={`${styles.btnFollow} ${following ? styles.btnFollowActive : ""}`}
                onClick={() => setFollowing((f) => !f)}
              >
                <UserPlus size={14} />
                {following
                  ? t("authorProfile.following")
                  : t("authorProfile.follow")}
              </button>
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
