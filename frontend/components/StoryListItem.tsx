"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, BookMarked, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GENRE_STYLES, DEFAULT_GENRE_STYLE, STATUS_STYLES, DEFAULT_STATUS_STYLE } from "@/lib/genreStyles";
import type { StoryItem } from "@/components/StoryCard";
import styles from "./StoryListItem.module.css";

export default function StoryListItem({ story }: { story: StoryItem }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const primaryGenre = story.genres[0] ?? "";
  const gs = GENRE_STYLES[primaryGenre] ?? DEFAULT_GENRE_STYLE;
  const ss = STATUS_STYLES[story.status] ?? DEFAULT_STATUS_STYLE;

  const handleClick = () => router.push(`/stories/${story.id}`);
  const handleRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/stories/${story.id}`);
  };

  const languageList = story.language
    .map((l) => t(`languageNames.${l}`, { defaultValue: l }))
    .join(", ");

  return (
    <div
      className={styles.item}
      style={{
        borderColor: hovered
          ? "rgba(167,139,250,0.35)"
          : "rgba(255,255,255,0.07)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.45)" : "none",
      }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Cover ── */}
      <div className={styles.cover} style={{ background: gs.gradient }}>
        <div className={styles.coverOverlay} />

        <BookOpen
          size={32}
          className={styles.coverIcon}
          style={{ color: gs.iconColor }}
        />

        <div className={styles.coverBadges}>
          <span
            className={styles.statusBadge}
            style={{ background: ss.badgeBg, color: ss.badgeColor }}
          >
            {t(`storyCard.${story.status}`, { defaultValue: story.status })}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className={styles.content}>

        {/* Title + rating */}
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{story.title}</h2>
          <span className={styles.rating}>★ {story.rating.toFixed(1)}</span>
        </div>

        {/* Author / year / country */}
        <div className={styles.meta}>
          <span>{story.author}</span>
          <span className={styles.metaDot} />
          <span>{story.year}</span>
          <span className={styles.metaDot} />
          <span>{t(`countries.${story.country}`, { defaultValue: story.country })}</span>
        </div>

        {/* Genre tags */}
        <div className={styles.genreTags}>
          {story.genres.map((genre) => {
            const s = GENRE_STYLES[genre] ?? DEFAULT_GENRE_STYLE;
            return (
              <span
                key={genre}
                className={styles.genreTag}
                style={{ background: s.badgeBg, color: s.badgeColor }}
              >
                {t(`genreNames.${genre}`, { defaultValue: genre })}
              </span>
            );
          })}
        </div>

        {/* Languages */}
        <p className={styles.languages}>
          {languageList}
        </p>

        {/* Description */}
        <p className={styles.description}>{story.description}</p>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.stats}>
            <span className={styles.statItem}>
              <BookMarked size={12} />
              {story.chapters} {t("storyCard.chaptersSuffix")}
            </span>
            <span className={styles.statItem}>
              <Layers size={12} />
              {story.pages} {t("storyCard.pagesSuffix")}
            </span>
          </div>

          <button
            className={styles.readButton}
            style={{ background: gs.badgeBg, color: gs.badgeColor }}
            onClick={handleRead}
          >
            {t("storyList.readButton")}
          </button>
        </div>

      </div>
    </div>
  );
}
