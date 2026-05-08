"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import StoryCard from "@/components/StoryCard";
import StoryFilters, { type Filters, DEFAULT_FILTERS } from "@/components/StoryFilters";
import { MOCK_STORIES } from "@/lib/mockStories";

const SORTED_BY_RATING = [...MOCK_STORIES].sort((a, b) => b.rating - a.rating);
const TOP_10_IDS = new Set(SORTED_BY_RATING.slice(0, 10).map((s) => s.id));
const TOP_10_STORIES = SORTED_BY_RATING.slice(0, 10);
const REST_STORIES = MOCK_STORIES.filter((s) => !TOP_10_IDS.has(s.id));

const ALL_GENRES = [...new Set(REST_STORIES.flatMap((s) => s.genres))].sort();
const ALL_LANGUAGES = [...new Set(REST_STORIES.flatMap((s) => s.language))].sort();
const ALL_YEARS = [...new Set(REST_STORIES.map((s) => s.year))];

function matchesPages(pages: number, bucket: Filters["pages"]): boolean {
  if (bucket === "all") return true;
  if (bucket === "0-50") return pages <= 50;
  if (bucket === "51-200") return pages >= 51 && pages <= 200;
  if (bucket === "201-500") return pages >= 201 && pages <= 500;
  if (bucket === "500+") return pages > 500;
  return true;
}

export default function Home() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filtered = REST_STORIES.filter((story) => {
    if (
      filters.genres.length > 0 &&
      !filters.genres.some((g) => story.genres.includes(g))
    )
      return false;
    if (
      filters.languages.length > 0 &&
      !filters.languages.some((l) => story.language.includes(l))
    )
      return false;
    if (filters.year !== "all" && story.year !== parseInt(filters.year))
      return false;
    if (filters.country !== "all" && story.country !== filters.country)
      return false;
    if (filters.status !== "all" && story.status !== filters.status)
      return false;
    if (!matchesPages(story.pages, filters.pages)) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-6 py-10" style={{ backgroundColor: "#0d0b1e", position: "relative", zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">

          {/* Hero Banner */}
          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "32px",
              position: "relative",
              height: "200px",
              display: "flex",
              alignItems: "flex-end",
              background: "linear-gradient(135deg,#1a0a3b 0%,#2a1060 40%,#1a2060 70%,#0a1a3b 100%)",
              border: "0.5px solid rgba(167,139,250,0.2)",
            }}
          >
            {/* Decorative orbs */}
            <div style={{ position: "absolute", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.18) 0%,transparent 70%)", top: "-60px", left: "200px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.12) 0%,transparent 70%)", top: "-30px", right: "120px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle,rgba(45,212,191,0.10) 0%,transparent 70%)", bottom: "10px", left: "60px", pointerEvents: "none" }} />
            {/* Grid lines overlay */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 2, padding: "28px 32px", flex: 1 }}>
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2dd4bf", marginBottom: "8px" }}>
                {t("hero.recommended")}
              </p>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#f1f0fa", letterSpacing: "-0.4px", marginBottom: "10px", lineHeight: 1.25 }}>
                {t("hero.title")}
              </h1>
              <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
                {["Фэнтези", "Стимпанк", "Романтика"].map((tag) => (
                  <span key={tag} style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", padding: "3px 9px", borderRadius: "4px", backgroundColor: "rgba(167,139,250,0.15)", color: "#c4b5fd", border: "0.5px solid rgba(167,139,250,0.3)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                style={{ fontSize: "12px", fontWeight: 600, padding: "8px 18px", borderRadius: "8px", backgroundColor: "#a78bfa", color: "#fff", border: "none", cursor: "pointer" }}
              >
                {t("hero.readNow")}
              </button>
            </div>

            {/* Rating display */}
            <div style={{ position: "absolute", right: "32px", bottom: "28px", textAlign: "center", zIndex: 2 }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#fbbf24", lineHeight: 1 }}>4.8</div>
              <div style={{ fontSize: "10px", color: "#6b6887", marginTop: "3px" }}>★★★★★</div>
              <div style={{ fontSize: "9px", color: "#6b6887", marginTop: "1px" }}>{t("home.ratingLabel")}</div>
            </div>
          </div>

          {/* Top 10 Section */}
          <div style={{ display: "inline-block", position: "relative", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.3px", color: "#f1f0fa" }}>
              {t("home.mostPopular")}
              <span style={{ marginLeft: "6px", fontSize: "14px", fontWeight: 400, color: "#6b6887" }}>
                · {TOP_10_STORIES.length} {t("home.storiesCountSuffix")}
              </span>
            </h2>
            <div style={{ position: "absolute", bottom: "-4px", left: 0, width: "32px", height: "2px", backgroundColor: "#fbbf24", borderRadius: "1px" }} />
          </div>

          <div className="flex flex-wrap gap-5" style={{ marginBottom: "48px" }}>
            {TOP_10_STORIES.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {/* Explore / All Stories Section */}
          <div style={{ display: "inline-block", position: "relative", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.3px", color: "#f1f0fa" }}>
              {t("home.explore")}
              <span style={{ marginLeft: "6px", fontSize: "14px", fontWeight: 400, color: "#6b6887" }}>
                · {filtered.length} {t("home.storiesCountSuffix")}
              </span>
            </h2>
            <div style={{ position: "absolute", bottom: "-4px", left: 0, width: "32px", height: "2px", backgroundColor: "#a78bfa", borderRadius: "1px" }} />
          </div>

          <StoryFilters
            filters={filters}
            availableGenres={ALL_GENRES}
            availableLanguages={ALL_LANGUAGES}
            availableYears={ALL_YEARS}
            onChange={setFilters}
          />

          {filtered.length > 0 ? (
            <div className="flex flex-wrap gap-5">
              {filtered.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <p className="text-sm mt-8" style={{ color: "#6b6887" }}>
              {t("home.emptyFilter")}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
