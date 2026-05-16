"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import StoryCard from "@/components/StoryCard";
import StoryFilters, { type Filters, DEFAULT_FILTERS } from "@/components/StoryFilters";
import { MOCK_STORIES } from "@/lib/mockStories";
import styles from "./page.module.css";

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
      <main className={`flex-1 px-6 py-10 ${styles.main}`}>
        <div className="max-w-6xl mx-auto">

          {/* Top 10 Section */}
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>
              {t("home.mostPopular")}
              <span className={styles.sectionCount}>
                · {TOP_10_STORIES.length} {t("home.storiesCountSuffix")}
              </span>
            </h2>
            <div className={styles.sectionUnderlineYellow} />
          </div>

          <div className={`flex flex-wrap gap-5 ${styles.top10Grid}`}>
            {TOP_10_STORIES.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {/* Explore / All Stories Section */}
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>
              {t("home.explore")}
              <span className={styles.sectionCount}>
                · {filtered.length} {t("home.storiesCountSuffix")}
              </span>
            </h2>
            <div className={styles.sectionUnderlinePurple} />
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
            <p className={`text-sm mt-8 ${styles.emptyText}`}>
              {t("home.emptyFilter")}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
