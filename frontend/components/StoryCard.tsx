"use client";

import { useState } from "react";
import { BookOpen, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GENRE_STYLES, DEFAULT_GENRE_STYLE } from "@/lib/genreStyles";
import StoryTooltip from "@/components/StoryTooltip";

export type StoryItem = {
  id: number;
  title: string;
  author: string;
  genres: string[];
  language: string[];
  year: number;
  country: string;
  status: "ongoing" | "completed";
  pages: number;
  chapters: number;
  rating: number;
  description: string;
};



export default function StoryCard({ story }: { story: StoryItem }) {
  const { t } = useTranslation();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const primaryGenre = story.genres[0] ?? "";
  const gs = GENRE_STYLES[primaryGenre] ?? DEFAULT_GENRE_STYLE;

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-visible"
      style={{
        minWidth: "250px",
        backgroundColor: "#252145",
        border: hovered ? "0.5px solid rgba(167,139,250,0.3)" : "0.5px solid rgba(255,255,255,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.4)" : "none",
        transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover */}
      <div
        className="relative flex items-center justify-center rounded-t-2xl overflow-hidden"
        style={{ height: "240px", background: gs.gradient }}
      >
        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.6) 100%)" }}
        />

        <BookOpen size={52} style={{ color: gs.iconColor, opacity: 0.5, position: "relative", zIndex: 1 }} />

        {/* Genre badge — top left */}
        <span
          className="absolute top-2 left-2"
          style={{
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
            padding: "3px 7px",
            borderRadius: "4px",
            backgroundColor: gs.badgeBg,
            color: gs.badgeColor,
            border: `0.5px solid ${gs.badgeBorder}`,
          }}
        >
          {t(`genreNames.${primaryGenre}`, { defaultValue: primaryGenre })}
        </span>

        {/* Info button — top right */}
        <button
          className="absolute top-2 right-2 flex items-center justify-center rounded-full"
          style={{
            width: "22px",
            height: "22px",
            backgroundColor: "rgba(0,0,0,0.4)",
            border: "0.5px solid rgba(255,255,255,0.15)",
          }}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          aria-label={t("storyCard.infoLabel")}
        >
          <Info size={12} style={{ color: "rgba(255,255,255,0.6)" }} />
        </button>

        {/* Status badge — bottom right */}
        <span
          className="absolute bottom-2 right-2"
          style={{
            fontSize: "9px",
            fontWeight: 500,
            padding: "2px 7px",
            borderRadius: "3px",
            ...(story.status === "ongoing"
              ? { backgroundColor: "rgba(45,212,191,0.15)", color: "#2dd4bf" }
              : { backgroundColor: "rgba(167,139,250,0.15)", color: "#a78bfa" }),
          }}
        >
          {story.status === "ongoing" ? t("storyCard.ongoing") : t("storyCard.completed")}
        </span>
      </div>

      {tooltipVisible && (
        <StoryTooltip
          story={story}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        />
      )}

      {/* Body */}
      <div style={{ padding: "11px 12px 12px" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            lineHeight: 1.35,
            color: "#f1f0fa",
            marginBottom: "4px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}
        >
          {story.title}
        </p>
        <p style={{ fontSize: "11px", color: "#6b6887", marginBottom: "7px" }}>{story.author}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 500 }}>
            ★ {story.rating.toFixed(1)}
          </span>
          <span style={{ fontSize: "10px", color: "#6b6887" }}>{story.chapters} {t("storyCard.chaptersSuffix")}</span>
        </div>
      </div>
    </div>
  );
}

