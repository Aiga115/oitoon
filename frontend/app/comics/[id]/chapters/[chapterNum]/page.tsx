"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LayoutList } from "lucide-react";
import Header from "@/components/Header";
import { MOCK_COMICS } from "@/lib/mockComics";
import { getComicExtra, getComicPanels } from "@/lib/mockComicDetails";
import styles from "./page.module.css";

export default function ComicChapterPage() {
  const { id, chapterNum } = useParams<{ id: string; chapterNum: string }>();

  const comicId = parseInt(id, 10);
  const chNum   = parseInt(chapterNum, 10);

  const comic  = MOCK_COMICS.find((c) => c.id === comicId);
  const extra  = getComicExtra(comicId);
  const panels = getComicPanels(comicId, chNum);

  const totalChapters = comic?.chapters ?? 0;
  const chapterTitle  = extra.chapters[chNum - 1] ?? `Chapter ${chNum}`;
  const progress      = totalChapters > 0 ? (chNum / totalChapters) * 100 : 0;

  if (!comic || panels.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className={styles.notFound}>
          <p>Chapter not found.</p>
          <Link href={`/comics/${id}`} className={styles.backLink}>
            <ArrowLeft size={14} /> Back to comic
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {/* ── Top bar ── */}
      <header className={styles.topBar}>
        <Link href={`/comics/${comicId}`} className={styles.topBackLink}>
          <ArrowLeft size={15} />
          <span className={styles.topBackTitle}>{comic.title}</span>
        </Link>

        <div className={styles.topCenter}>
          <span className={styles.topChapter}>
            Ch.{chNum} / {totalChapters}
          </span>
          <span className={styles.topChapterTitle}>{chapterTitle}</span>
        </div>

        <Link href={`/comics/${comicId}`} className={styles.topChaptersLink} title="Chapter list">
          <LayoutList size={16} />
        </Link>
      </header>

      {/* ── Progress bar ── */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {/* ── Vertical panel strip ── */}
      <main className={styles.reader}>
        <div className={styles.strip}>
          {panels.map((src, i) => (
            <div key={i} className={styles.panel}>
              {/* plain <img> for webtoon panels — no forced dimensions, true height: auto */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Panel ${i + 1}`}
                className={styles.panelImg}
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* ── Chapter navigation ── */}
        <nav className={styles.nav}>
          {chNum > 1 ? (
            <Link
              href={`/comics/${comicId}/chapters/${chNum - 1}`}
              className={styles.navBtn}
            >
              <ArrowLeft size={14} /> Previous chapter
            </Link>
          ) : (
            <div className={styles.navPlaceholder} />
          )}

          <Link href={`/comics/${comicId}`} className={styles.navHome}>
            All chapters
          </Link>

          {chNum < totalChapters ? (
            <Link
              href={`/comics/${comicId}/chapters/${chNum + 1}`}
              className={styles.navBtn}
            >
              Next chapter <ArrowRight size={14} />
            </Link>
          ) : (
            <div className={styles.navPlaceholder} />
          )}
        </nav>
      </main>
    </div>
  );
}
