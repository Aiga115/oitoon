"use client";

import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GENRE_STYLES, DEFAULT_GENRE_STYLE } from "@/lib/genreStyles";
import type { StoryItem } from "@/components/StoryCard";

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
      className="absolute z-50 rounded-xl text-left"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        top: "36px",
        right: "8px",
        width: "240px",
        backgroundColor: "#2a2060",
        border: "0.5px solid rgba(167,139,250,0.30)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        padding: "14px",
      }}
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
        <span className="text-xs ml-1" style={{ color: "#a09cbe" }}>
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
              style={{
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "3px 7px",
                borderRadius: "4px",
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
            style={{
              fontSize: "9px",
              fontWeight: 500,
              letterSpacing: "0.03em",
              padding: "3px 8px",
              borderRadius: "20px",
              backgroundColor: "rgba(99,102,241,0.15)",
              color: "#a5b4fc",
              border: "0.5px solid rgba(99,102,241,0.30)",
            }}
          >
            {t(`languageNames.${l}`, { defaultValue: l })}
          </span>
        ))}
      </div>

      {/* Author */}
      <p className="text-xs mb-2" style={{ color: "#6b6887" }}>
        {t("storyCard.authorLabel")}:{" "}
        <span style={{ color: "#a09cbe" }}>{story.author}</span>
      </p>

      {/* Description — no clamping, expands fully */}
      <p className="text-xs leading-relaxed" style={{ color: "#a09cbe" }}>
        {story.description}
      </p>
    </div>
  );
}
