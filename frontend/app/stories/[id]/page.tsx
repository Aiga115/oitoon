"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Globe,
  Star,
  Layers,
  BookMarked,
  ArrowLeft,
  Send,
  Camera,
  MessageCircle,
  Play,
  ExternalLink,
  Hash,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import { MOCK_STORIES } from "@/lib/mockStories";
import { getStoryExtra, generateChapters } from "@/lib/mockStoryDetails";
import { GENRE_STYLES, DEFAULT_GENRE_STYLE, STATUS_STYLES, DEFAULT_STATUS_STYLE } from "@/lib/genreStyles";
import styles from "./page.module.css";

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "instagram") return <Camera size={14} />;
  if (platform === "twitter") return <MessageCircle size={14} />;
  if (platform === "youtube") return <Play size={14} />;
  if (platform === "telegram") return <Send size={14} />;
  if (platform === "vk") return <Hash size={14} />;
  return <ExternalLink size={14} />;
}

function platformLabel(platform: string): string {
  const labels: Record<string, string> = {
    vk: "VK",
    telegram: "Telegram",
    instagram: "Instagram",
    twitter: "Twitter",
    youtube: "YouTube",
    website: "Website",
  };
  return labels[platform] ?? platform;
}

export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const storyId = parseInt(id, 10);
  const story = MOCK_STORIES.find((s) => s.id === storyId);
  const extra = getStoryExtra(storyId);
  const chapters = generateChapters(story?.chapters ?? 0);

  const [likes, setLikes] = useState(extra.likes);
  const [dislikes, setDislikes] = useState(extra.dislikes);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);
  const [comments, setComments] = useState(extra.comments);
  const [commentText, setCommentText] = useState("");

  if (!story) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className={styles.notFound}>
          <BookOpen size={48} style={{ color: "#4b4870", marginBottom: 16 }} />
          <p>{t("storyDetail.notFound", { defaultValue: "Story not found." })}</p>
          <Link href="/stories" className={styles.backLink}>
            <ArrowLeft size={14} />
            {t("storyDetail.backToStories", { defaultValue: "Back to stories" })}
          </Link>
        </main>
      </div>
    );
  }

  const primaryGenre = story.genres[0] ?? "";
  const gs = GENRE_STYLES[primaryGenre] ?? DEFAULT_GENRE_STYLE;
  const ss = STATUS_STYLES[story.status] ?? DEFAULT_STATUS_STYLE;

  function handleLike() {
    if (userVote === "like") {
      setLikes((l) => l - 1);
      setUserVote(null);
    } else {
      if (userVote === "dislike") setDislikes((d) => d - 1);
      setLikes((l) => l + 1);
      setUserVote("like");
    }
  }

  function handleDislike() {
    if (userVote === "dislike") {
      setDislikes((d) => d - 1);
      setUserVote(null);
    } else {
      if (userVote === "like") setLikes((l) => l - 1);
      setDislikes((d) => d + 1);
      setUserVote("dislike");
    }
  }

  function handleSubmitComment() {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    setComments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        user: t("storyDetail.you", { defaultValue: "You" }),
        text: trimmed,
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setCommentText("");
  }

  function chapterTitle(index: number, total: number): string {
    if (index === 0) return t("storyDetail.prologue", { defaultValue: "Prologue" });
    if (index === total - 1 && total > 2)
      return t("storyDetail.epilogue", { defaultValue: "Epilogue" });
    return `${t("storyDetail.chapter", { defaultValue: "Chapter" })} ${index + 1}`;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>

          {/* Back link */}
          <Link href="/stories" className={styles.backLink}>
            <ArrowLeft size={15} />
            {t("storyDetail.backToStories", { defaultValue: "Back to stories" })}
          </Link>

          {/* ── Hero ──────────────────────────────────────────────────── */}
          <div className={styles.hero}>
            {/* Cover */}
            <div className={styles.cover} style={{ background: gs.gradient }}>
              <div className={styles.coverOverlay} />
              <BookOpen
                size={72}
                style={{ color: gs.iconColor, opacity: 0.45, position: "relative", zIndex: 1 }}
              />
            </div>

            {/* Hero info */}
            <div className={styles.heroInfo}>
              {/* Genre + status badges */}
              <div className={styles.badgeRow}>
                {story.genres.map((genre) => {
                  const s = GENRE_STYLES[genre] ?? DEFAULT_GENRE_STYLE;
                  return (
                    <span
                      key={genre}
                      className={styles.genreBadge}
                      style={{
                        backgroundColor: s.badgeBg,
                        color: s.badgeColor,
                        border: `0.5px solid ${s.badgeBorder}`,
                      }}
                    >
                      {t(`genreNames.${genre}`, { defaultValue: genre })}
                    </span>
                  );
                })}
                <span
                  className={styles.statusBadge}
                  style={{
                    backgroundColor: ss.badgeBg,
                    color: ss.badgeColor,
                    border: `0.5px solid ${ss.badgeBorder}`,
                  }}
                >
                  {t(`storyCard.${story.status}`, { defaultValue: story.status })}
                </span>
              </div>

              {/* Title */}
              <h1 className={styles.title}>{story.title}</h1>

              {/* Author */}
              <p className={styles.authorLine}>
                {t("storyCard.authorLabel", { defaultValue: "Author" })} ·{" "}
                <span className={styles.authorName}>{story.author}</span>
              </p>

              {/* Stats row */}
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <Star size={15} className={styles.starIcon} />
                  <span className={styles.ratingValue}>{story.rating.toFixed(1)}</span>
                  <span className={styles.statLabel}>{t("home.ratingLabel", { defaultValue: "rating" })}</span>
                </div>

                <span className={styles.statDivider} />

                <div className={styles.statItem}>
                  <BookMarked size={14} style={{ color: "#a78bfa" }} />
                  <span>{story.chapters}</span>
                  <span className={styles.statLabel}>{t("storyCard.chaptersSuffix", { defaultValue: "ch." })}</span>
                </div>

                <span className={styles.statDivider} />

                <div className={styles.statItem}>
                  <Layers size={14} style={{ color: "#6b6887" }} />
                  <span>{story.pages}</span>
                  <span className={styles.statLabel}>{t("storyCard.pagesSuffix", { defaultValue: "pages" })}</span>
                </div>

                <span className={styles.statDivider} />

                <div className={styles.statItem}>
                  <Globe size={14} style={{ color: "#6b6887" }} />
                  <span>
                    {story.language
                      .map((l) => t(`languageNames.${l}`, { defaultValue: l }))
                      .join(", ")}
                  </span>
                </div>
              </div>

              {/* Year + Country */}
              <p className={styles.metaLine}>
                {story.year} · {t(`countries.${story.country}`, { defaultValue: story.country })}
              </p>
            </div>
          </div>

          {/* ── Description ───────────────────────────────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {t("storyDetail.description", { defaultValue: "Description" })}
            </h2>
            <p className={styles.description}>{story.description}</p>
          </section>

          {/* ── Author ────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {t("storyDetail.aboutAuthor", { defaultValue: "About the Author" })}
            </h2>
            <div className={styles.authorCard}>
              <div className={styles.authorAvatar}>{story.author.charAt(0)}</div>
              <div className={styles.authorDetails}>
                <p className={styles.authorCardName}>{story.author}</p>
                {extra.authorNote && (
                  <p className={styles.authorNote}>{extra.authorNote}</p>
                )}
                {extra.authorLinks.length > 0 && (
                  <div className={styles.authorLinks}>
                    {extra.authorLinks.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.authorLink}
                      >
                        <PlatformIcon platform={link.platform} />
                        {platformLabel(link.platform)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Rate ──────────────────────────────────────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {t("storyDetail.rateStory", { defaultValue: "Rate this story" })}
            </h2>
            <div className={styles.voteRow}>
              <button
                className={`${styles.voteBtn} ${userVote === "like" ? styles.voteBtnLikeActive : ""}`}
                onClick={handleLike}
              >
                <ThumbsUp size={17} />
                <span>{likes.toLocaleString()}</span>
              </button>
              <button
                className={`${styles.voteBtn} ${userVote === "dislike" ? styles.voteBtnDislikeActive : ""}`}
                onClick={handleDislike}
              >
                <ThumbsDown size={17} />
                <span>{dislikes.toLocaleString()}</span>
              </button>
            </div>
          </section>

          {/* ── Chapters ──────────────────────────────────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <BookMarked size={17} />
              {t("storyDetail.chapters", { defaultValue: "Chapters" })} ({story.chapters})
            </h2>
            <div className={styles.chapterGrid}>
              {chapters.map((chapter, idx) => (
                <div key={chapter.id} className={styles.chapterItem}>
                  <span className={styles.chapterNumber}>{chapter.number}</span>
                  <span className={styles.chapterTitle}>
                    {chapterTitle(idx, chapters.length)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Comments ──────────────────────────────────────────────── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <MessageSquare size={17} />
              {t("storyDetail.comments", { defaultValue: "Comments" })} ({comments.length})
            </h2>

            {/* Write a comment */}
            <div className={styles.commentForm}>
              <textarea
                className={styles.commentInput}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t("storyDetail.commentPlaceholder", { defaultValue: "Share your thoughts…" })}
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmitComment();
                }}
              />
              <button
                className={styles.commentSubmit}
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                <Send size={13} />
                {t("storyDetail.submitComment", { defaultValue: "Post comment" })}
              </button>
            </div>

            {/* Comment list */}
            <div className={styles.commentList}>
              {comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentAvatar}>
                    {comment.user.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.commentContent}>
                    <div className={styles.commentHeader}>
                      <span className={styles.commentUser}>{comment.user}</span>
                      <span className={styles.commentDate}>{comment.date}</span>
                    </div>
                    <p className={styles.commentText}>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
