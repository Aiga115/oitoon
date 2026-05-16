"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import { MOCK_STORIES } from "@/lib/mockStories";
import { getStoryExtra, getChapterContent } from "@/lib/mockStoryDetails";
import styles from "./page.module.css";

export default function ChapterPage() {
  const { id, chapterNum } = useParams<{ id: string; chapterNum: string }>();

  const storyId = parseInt(id, 10);
  const chNum   = parseInt(chapterNum, 10);

  const story   = MOCK_STORIES.find((s) => s.id === storyId);
  const extra   = getStoryExtra(storyId);
  const content = getChapterContent(storyId, chNum);

  const title         = extra.chapters?.[chNum - 1] ?? `Chapter ${chNum}`;
  const totalChapters = story?.chapters ?? 0;
  const progress      = totalChapters > 0 ? (chNum / totalChapters) * 100 : 0;

  if (!story || !content) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className={styles.notFound}>
          <BookOpen size={48} style={{ color: "#4b4870" }} />
          <p>Chapter not found.</p>
          <Link href={`/stories/${id}`} className={styles.backLink}>
            <ArrowLeft size={14} />
            Back to story
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>

          <Link href={`/stories/${id}`} className={styles.backLink}>
            <ArrowLeft size={15} />
            {story.title}
          </Link>

          <div className={styles.chapterHeader}>
            <div className={styles.progressRow}>
              <span className={styles.chapterBadge}>
                Chapter {chNum} of {totalChapters}
              </span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <h1 className={styles.chapterTitle}>{title}</h1>
          </div>

          <hr className={styles.divider} />

          <article className={styles.content}>
            {content.map((para, i) => (
              <p key={i} className={styles.paragraph}>{para}</p>
            ))}
          </article>

          <nav className={styles.nav}>
            {chNum > 1 ? (
              <Link
                href={`/stories/${id}/chapters/${chNum - 1}`}
                className={styles.navBtn}
              >
                <ArrowLeft size={14} />
                Previous
              </Link>
            ) : (
              <div className={styles.navPlaceholder} />
            )}

            {chNum < totalChapters ? (
              <Link
                href={`/stories/${id}/chapters/${chNum + 1}`}
                className={styles.navBtn}
              >
                Next
                <ArrowRight size={14} />
              </Link>
            ) : (
              <div className={styles.navPlaceholder} />
            )}
          </nav>

        </div>
      </main>
    </div>
  );
}
