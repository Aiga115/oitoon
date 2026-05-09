"use client";

import { useState } from "react";
import { BookOpen, User, Calendar, Globe, MapPin, BookMarked, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GENRE_STYLES, DEFAULT_GENRE_STYLE } from "@/lib/genreStyles";
import type { StoryItem } from "@/components/StoryCard";
import styles from "./StoryListItem.module.css";

export default function StoryListItem({ story }: { story: StoryItem }) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const primaryGenre = story.genres[0] ?? "";
  const gs = GENRE_STYLES[primaryGenre] ?? DEFAULT_GENRE_STYLE;

  return (
    <div
      className={styles.item}
      style={{
        border: hovered
          ? "0.5px solid rgba(167,139,250,0.35)"
          : "0.5px solid rgba(255,255,255,0.07)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.45)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Cover ──────────────────────────────────────────────────── */}
      <div className={styles.cover} style={{ background: gs.gradient }}>
        {/* gradient overlay */}
        <div className={styles.coverOverlay} />

        <BookOpen size={40} style={{ color: gs.iconColor, opacity: 0.45, position: "relative", zIndex: 1 }} />

        {/* Primary genre badge */}
        <span
          className={styles.genreBadge}
          style={{
            backgroundColor: gs.badgeBg,
            color: gs.badgeColor,
            border: `0.5px solid ${gs.badgeBorder}`,
          }}
        >
          {t(`genreNames.${primaryGenre}`, { defaultValue: primaryGenre })}
        </span>

        {/* Status badge */}
        <span
          className={styles.statusBadge}
          style={
            story.status === "ongoing"
              ? { backgroundColor: "rgba(45,212,191,0.18)", color: "#2dd4bf" }
              : { backgroundColor: "rgba(167,139,250,0.18)", color: "#a78bfa" }
          }
        >
          {story.status === "ongoing" ? t("storyCard.ongoing") : t("storyCard.completed")}
        </span>
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className={styles.content}>
        {/* Title + Rating row */}
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{story.title}</h2>
          <span className={styles.rating}>★ {story.rating.toFixed(1)}</span>
        </div>

        {/* Meta row */}
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <User size={11} style={{ color: "#a78bfa" }} />
            <span>{story.author}</span>
          </span>
          <span className={styles.metaDot} />
          <span className={styles.metaItem}>
            <Calendar size={11} style={{ color: "#6b6887" }} />
            <span>{story.year}</span>
          </span>
          <span className={styles.metaDot} />
          <span className={styles.metaItem}>
            <Globe size={11} style={{ color: "#6b6887" }} />
            <span>
              {story.language
                .map((l) => t(`languageNames.${l}`, { defaultValue: l }))
                .join(", ")}
            </span>
          </span>
          <span className={styles.metaDot} />
          <span className={styles.metaItem}>
            <MapPin size={11} style={{ color: "#6b6887" }} />
            <span>{t(`countries.${story.country}`, { defaultValue: story.country })}</span>
          </span>
        </div>

        {/* All genre tags */}
        <div className={styles.genreTags}>
          {story.genres.map((genre) => {
            const s = GENRE_STYLES[genre] ?? DEFAULT_GENRE_STYLE;
            return (
              <span
                key={genre}
                className={styles.genreTag}
                style={{
                  backgroundColor: s.badgeBg,
                  color: s.badgeColor,
                  border: `0.5px solid ${s.badgeBorder}`,
                }}
              >
                {t(`genreNames.${genre}`, { defaultValue: genre })}
              </span>
            );
          })}
        </div>

        {/* Description */}
        <p className={styles.description}>{story.description}</p>

        {/* Footer: chapters, pages, read button */}
        <div className={styles.footer}>
          <div className={styles.stats}>
            <span className={styles.statItem}>
              <BookMarked size={12} style={{ color: "#6b6887" }} />
              <span>{story.chapters} {t("storyCard.chaptersSuffix")}</span>
            </span>
            <span className={styles.statItem}>
              <Layers size={12} style={{ color: "#6b6887" }} />
              <span>{story.pages} {t("storyCard.pagesSuffix")}</span>
            </span>
          </div>
          <button className={styles.readButton}>{t("storyList.readButton")}</button>
        </div>
      </div>
    </div>
  );
}
