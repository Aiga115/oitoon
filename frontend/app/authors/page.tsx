"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSubscriptions } from "@/lib/subscriptions";
import { MOCK_AUTHORS, type AuthorItem } from "@/lib/mockAuthors";
import styles from "./page.module.css";

type AuthorsTab = "all" | "subscribed";

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
}: {
  author: AuthorItem;
  rank: number;
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
      </div>
    </Link>
  );
}

export default function AuthorsPage() {
  const { t } = useTranslation();
  const { isSubscribed } = useSubscriptions();
  const [tab, setTab] = useState<AuthorsTab>("all");

  const authors =
    tab === "subscribed"
      ? MOCK_AUTHORS.filter((author) => isSubscribed(author.id))
      : MOCK_AUTHORS;

  return (
    <div className={`px-6 py-10 ${styles.main}`}>
        <div className="max-w-2xl mx-auto">
          {/* Heading */}
          <div className={styles.pageHeading}>
            <h1 className={styles.pageTitle}>{t("nav.authors")}</h1>
            <div className={styles.pageUnderline} />
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === "all" ? styles.tabActive : ""}`}
              onClick={() => setTab("all")}
            >
              {t("authors.tabAll")}
            </button>
            <button
              className={`${styles.tab} ${tab === "subscribed" ? styles.tabActive : ""}`}
              onClick={() => setTab("subscribed")}
            >
              {t("authors.tabSubscribed")}
            </button>
          </div>

          {/* List */}
          {authors.length === 0 ? (
            <p className={styles.empty}>{t("authors.noSubscriptions")}</p>
          ) : (
            <div className={styles.list}>
              {authors.map((author, i) => (
                <AuthorRow key={author.id} author={author} rank={i + 1} />
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
