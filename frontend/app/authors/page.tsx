"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import { MOCK_AUTHORS, type AuthorItem } from "@/lib/mockAuthors";
import styles from "./page.module.css";

type Tab = "popular" | "thisWeek";

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function AuthorRow({
  author,
  rank,
  showWeeklyGain,
}: {
  author: AuthorItem;
  rank: number;
  showWeeklyGain: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Link href={`/authors/${author.id}`} className={styles.card}>
      <span className={`${styles.rank} ${rank <= 3 ? styles.rankTop : ""}`}>
        {rank}
      </span>

      <div
        className={styles.avatar}
        style={{ backgroundColor: author.avatarColor }}
      >
        {getInitials(author.displayName)}
      </div>

      <div className={styles.info}>
        <p className={styles.displayName}>{author.displayName}</p>
        <p className={styles.username}>@{author.username}</p>
      </div>

      <div className={styles.stats}>
        <span className={styles.subscribers}>
          {formatCount(author.subscribers)} {t("authors.subscribersSuffix")}
        </span>
        {showWeeklyGain && (
          <span className={styles.weeklyGain}>
            {t("authors.weeklyGainPrefix")}
            {formatCount(author.weeklyGain)} {t("authors.subscribersSuffix")}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function AuthorsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("popular");

  const sorted: AuthorItem[] =
    tab === "popular"
      ? [...MOCK_AUTHORS].sort((a, b) => b.subscribers - a.subscribers)
      : [...MOCK_AUTHORS].sort((a, b) => b.weeklyGain - a.weeklyGain);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 px-6 py-10 ${styles.main}`}>
        <div className="max-w-2xl mx-auto">
          {/* Heading */}
          <div className={styles.pageHeading}>
            <h1 className={styles.pageTitle}>{t("nav.authors")}</h1>
            <div className={styles.pageUnderline} />
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === "popular" ? styles.tabActive : ""}`}
              onClick={() => setTab("popular")}
            >
              {t("authors.popular")}
            </button>
            <button
              className={`${styles.tab} ${tab === "thisWeek" ? styles.tabActive : ""}`}
              onClick={() => setTab("thisWeek")}
            >
              {t("authors.thisWeek")}
            </button>
          </div>

          {/* List */}
          <div className={styles.list}>
            {sorted.map((author, i) => (
              <AuthorRow
                key={author.id}
                author={author}
                rank={i + 1}
                showWeeklyGain={tab === "thisWeek"}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
