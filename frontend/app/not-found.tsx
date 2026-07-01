"use client";

import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import styles from "./not-found.module.css";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <BookOpen size={56} className={styles.icon} />
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>{t("notFound.title")}</p>
      <Link href="/" className={styles.back}>
        <ArrowLeft size={14} />
        {t("notFound.goHome")}
      </Link>
    </div>
  );
}
