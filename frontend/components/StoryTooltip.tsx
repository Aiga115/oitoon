"use client";

import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GENRE_STYLES, DEFAULT_GENRE_STYLE } from "@/lib/genreStyles";
import type { StoryItem } from "@/components/StoryCard";
import styles from "./StoryTooltip.module.css";

export default function StoryTooltip({
  story,
  onMouseEnter,
  onMouseLeave,
}: {
  story: StoryItem;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={styles.tooltip}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Stars + rating */}
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            style={{
              color: i < Math.round(story.rating) ? "#fbbf24" : "#3d3880",
              fill: i < Math.round(story.rating) ? "#fbbf24" : "#3d3880",
            }}
          />
        ))}
        <span className={`text-xs ml-1 ${styles.ratingValue}`}>
          {story.rating.toFixed(1)}
        </span>
      </div>

      {/* Genre badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {story.genres.map((g) => {
          const gStyle = GENRE_STYLES[g] ?? DEFAULT_GENRE_STYLE;
          return (
            <span
              key={g}
              className={styles.genreBadge}
              style={{
                backgroundColor: gStyle.badgeBg,
                color: gStyle.badgeColor,
                border: `0.5px solid ${gStyle.badgeBorder}`,
              }}
            >
              {t(`genreNames.${g}`, { defaultValue: g })}
            </span>
          );
        })}
      </div>

      {/* Language badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {story.language.map((l) => (
          <span
            key={l}
            className={styles.langBadge}
          >
            {t(`languageNames.${l}`, { defaultValue: l })}
          </span>
        ))}
      </div>

      {/* Author */}
      <p className={`text-xs mb-2 ${styles.authorLabel}`}>
        {t("storyCard.authorLabel")}:{" "}
        <span className={styles.authorName}>{story.author}</span>
      </p>

      {/* Description — no clamping, expands fully */}
      <p className={`text-xs leading-relaxed ${styles.description}`}>
        {story.description}
      </p>
    </div>
  );
}
