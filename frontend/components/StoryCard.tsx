"use client";

import { useState } from "react";
import { BookOpen, Info, Star } from "lucide-react";

export type StoryItem = {
  id: number;
  title: string;
  author: string;
  genres: string[];
  year: number;
  country: string;
  status: "ongoing" | "completed";
  pages: number;
  chapters: number;
  rating: number;
  description: string;
};

type GenreStyle = {
  gradient: string;
  iconColor: string;
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
};

const GENRE_STYLES: Record<string, GenreStyle> = {
  "Фэнтези":            { gradient: "linear-gradient(160deg,#1a0a40 0%,#2d1b69 50%,#1a1035 100%)", iconColor: "#c4b5fd", badgeBg: "rgba(167,139,250,0.2)",  badgeColor: "#c4b5fd", badgeBorder: "rgba(167,139,250,0.3)"  },
  "Научная фантастика": { gradient: "linear-gradient(160deg,#052830 0%,#0d4a5c 50%,#052030 100%)", iconColor: "#5eead4", badgeBg: "rgba(45,212,191,0.2)",   badgeColor: "#5eead4", badgeBorder: "rgba(45,212,191,0.3)"   },
  "Стимпанк":           { gradient: "linear-gradient(160deg,#052830 0%,#0d4a5c 50%,#052030 100%)", iconColor: "#5eead4", badgeBg: "rgba(45,212,191,0.2)",   badgeColor: "#5eead4", badgeBorder: "rgba(45,212,191,0.3)"   },
  "Романтика":          { gradient: "linear-gradient(160deg,#3a0a2a 0%,#6b1a50 50%,#2a0820 100%)", iconColor: "#f9a8d4", badgeBg: "rgba(244,114,182,0.2)", badgeColor: "#f9a8d4", badgeBorder: "rgba(244,114,182,0.3)"  },
  "Приключения":        { gradient: "linear-gradient(160deg,#2a1200 0%,#5c2800 50%,#1a0c00 100%)", iconColor: "#fb923c", badgeBg: "rgba(249,115,22,0.2)",   badgeColor: "#fb923c", badgeBorder: "rgba(249,115,22,0.3)"   },
  "Боевик":             { gradient: "linear-gradient(160deg,#2a1200 0%,#5c2800 50%,#1a0c00 100%)", iconColor: "#fb923c", badgeBg: "rgba(249,115,22,0.2)",   badgeColor: "#fb923c", badgeBorder: "rgba(249,115,22,0.3)"   },
  "Мистика":            { gradient: "linear-gradient(160deg,#0a1a2a 0%,#1a3a5c 50%,#081018 100%)", iconColor: "#7dd3fc", badgeBg: "rgba(56,189,248,0.2)",   badgeColor: "#7dd3fc", badgeBorder: "rgba(56,189,248,0.3)"   },
  "Триллер":            { gradient: "linear-gradient(160deg,#1a0a0a 0%,#3d1010 50%,#0a0505 100%)", iconColor: "#fca5a5", badgeBg: "rgba(239,68,68,0.2)",    badgeColor: "#fca5a5", badgeBorder: "rgba(239,68,68,0.3)"    },
  "Историческое":       { gradient: "linear-gradient(160deg,#0a1a2a 0%,#1a3a5c 50%,#081018 100%)", iconColor: "#7dd3fc", badgeBg: "rgba(56,189,248,0.2)",   badgeColor: "#7dd3fc", badgeBorder: "rgba(56,189,248,0.3)"   },
};

const DEFAULT_STYLE: GenreStyle = {
  gradient: "linear-gradient(160deg,#1a0a40 0%,#2d1b69 50%,#1a1035 100%)",
  iconColor: "#c4b5fd",
  badgeBg: "rgba(167,139,250,0.2)",
  badgeColor: "#c4b5fd",
  badgeBorder: "rgba(167,139,250,0.3)",
};

export default function StoryCard({ story }: { story: StoryItem }) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const primaryGenre = story.genres[0] ?? "";
  const gs = GENRE_STYLES[primaryGenre] ?? DEFAULT_STYLE;

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-visible"
      style={{
        width: "180px",
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
          {primaryGenre}
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
          aria-label="Информация"
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
          {story.status === "ongoing" ? "Выходит" : "Завершено"}
        </span>

        {/* Tooltip */}
        {tooltipVisible && (
          <div
            className="absolute z-50 rounded-xl text-left"
            style={{
              top: 0,
              right: "30px",
              width: "220px",
              backgroundColor: "#2a2060",
              border: "0.5px solid rgba(167,139,250,0.30)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              padding: "14px",
            }}
          >
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

            <div className="flex flex-wrap gap-1 mb-2">
              {story.genres.map((g) => {
                const gStyle = GENRE_STYLES[g] ?? DEFAULT_STYLE;
                return (
                  <span
                    key={g}
                    style={{
                      fontSize: "9px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase" as const,
                      padding: "3px 7px",
                      borderRadius: "4px",
                      backgroundColor: gStyle.badgeBg,
                      color: gStyle.badgeColor,
                      border: `0.5px solid ${gStyle.badgeBorder}`,
                    }}
                  >
                    {g}
                  </span>
                );
              })}
            </div>

            <p className="text-xs mb-2" style={{ color: "#6b6887" }}>
              Автор: <span style={{ color: "#a09cbe" }}>{story.author}</span>
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#a09cbe" }}>
              {story.description}
            </p>
          </div>
        )}
      </div>

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
          <span style={{ fontSize: "10px", color: "#6b6887" }}>{story.chapters} глав</span>
        </div>
      </div>
    </div>
  );
}

