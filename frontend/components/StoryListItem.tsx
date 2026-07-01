"use client";

import Link from "next/link";
import { BookOpen, BookMarked, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GENRE_BADGE } from "@/lib/genreStyles";
export type StoryItem = {
  id: number;
  title: string;
  author: string;
  genres: string[];
  language: string[];
  year: number;
  status: "ongoing" | "completed" | "upcoming" | "hiatus" | "draft";
  pages: number;
  chapters: number;
  rating: number;
  description: string;
};
import styles from "./StoryListItem.module.css";

export default function StoryListItem({
  story,
  basePath = "/stories",
}: {
  story: StoryItem;
  basePath: string;
}) {
  const { t } = useTranslation();

  const languageList = story.language
    .map((l) => t(`languageNames.${l}`, { defaultValue: l }))
    .join(", ");

  return (
    <Link
      href={`${basePath}/${story.id}`}
      className={styles.item}
    >
      {/* ── Cover ── */}
      <div className={styles.cover}>
        <div className={styles.coverOverlay} />

        <BookOpen
          size={32}
          className={styles.coverIcon}
        />

        <div className={styles.coverBadges}>
          <span className={styles.statusBadge}>
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

        {/* Author / year */}
        <div className={styles.meta}>
          <span>{story.author}</span>
          <span className={styles.metaDot} />
          <span>{story.year}</span>
        </div>

        {/* Genre tags */}
        <div className={styles.genreTags}>
          {story.genres.map((genre) => {
            return (
              <span
                key={genre}
                className={styles.genreTag}
                style={{ background: GENRE_BADGE.bg, color: GENRE_BADGE.color, borderColor: GENRE_BADGE.border }}
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

          <span
            className={styles.readButton}
          >
            {t("storyList.readButton")}
          </span>
        </div>

      </div>
    </Link>
  );
}
