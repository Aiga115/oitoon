"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, ThumbsUp, ThumbsDown, Star,
  BookMarked, ArrowLeft, Send,
  Camera, MessageCircle, Play, ExternalLink,
  Hash, Heart, BookmarkPlus, BookmarkCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import { MOCK_STORIES } from "@/lib/mockStories";
import { getStoryExtra, generateChapters } from "@/lib/mockStoryDetails";
import {
  GENRE_STYLES, DEFAULT_GENRE_STYLE,
  STATUS_STYLES, DEFAULT_STATUS_STYLE,
} from "@/lib/genreStyles";
import styles from "./page.module.css";

/* ── helpers ── */
type CommentItem = {
  id: number;
  user: string;
  text: string;
  date: string;
  score: number;
  userVote: "up" | "down" | null;
};

const AVATAR_GRADIENTS = [
  { bg: "linear-gradient(135deg,#2d1b69,#1a0a40)", color: "#c4b5fd" },
  { bg: "linear-gradient(135deg,#3a0a2a,#6b1a50)", color: "#f9a8d4" },
  { bg: "linear-gradient(135deg,#052830,#0d4a5c)", color: "#5eead4" },
  { bg: "linear-gradient(135deg,#2a1200,#5c2800)", color: "#fb923c" },
  { bg: "linear-gradient(135deg,#0a1a2a,#1a3a5c)", color: "#7dd3fc" },
  { bg: "linear-gradient(135deg,#1a0a1a,#3d1050)", color: "#e879f9" },
  { bg: "linear-gradient(135deg,#001a0e,#003d20)", color: "#6ee7b7" },
  { bg: "linear-gradient(135deg,#1a1400,#3a2e00)", color: "#FDE68A" },
];

function avatarStyle(name: string) {
  return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "instagram") return <Camera size={13} />;
  if (platform === "twitter")   return <MessageCircle size={13} />;
  if (platform === "youtube")   return <Play size={13} />;
  if (platform === "telegram")  return <Send size={13} />;
  if (platform === "vk")        return <Hash size={13} />;
  return <ExternalLink size={13} />;
}

function platformLabel(p: string) {
  return ({ vk:"VK", telegram:"Telegram", instagram:"Instagram",
            twitter:"Twitter", youtube:"YouTube", website:"Website" }[p] ?? p);
}

const MOCK_SCORES = [71, 48, 38];

/* ─────────────────────────────────────────────── */
export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t }  = useTranslation();

  const storyId  = parseInt(id, 10);
  const story    = MOCK_STORIES.find((s) => s.id === storyId);
  const extra    = getStoryExtra(storyId);
  const chapters = generateChapters(story?.chapters ?? 0);

  /* story rating */
  const [likes,     setLikes]     = useState(extra.likes);
  const [dislikes,  setDislikes]  = useState(extra.dislikes);
  const [userVote,  setUserVote]  = useState<"like" | "dislike" | null>(null);

  /* library */
  const [inLibrary, setInLibrary] = useState(false);

  /* comments */
  const [comments, setComments] = useState<CommentItem[]>(() =>
    extra.comments.map((c, i) => ({
      ...c,
      score:    MOCK_SCORES[i] ?? Math.floor(Math.random() * 40) + 5,
      userVote: null,
    }))
  );
  const [commentText, setCommentText] = useState("");
  const [sortOrder,   setSortOrder]   = useState<"best" | "newest">("best");

  const sortedComments = useMemo(() =>
    [...comments].sort((a, b) =>
      sortOrder === "best"
        ? b.score - a.score
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    ), [comments, sortOrder]);

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
  const ss = STATUS_STYLES[story.status]  ?? DEFAULT_STATUS_STYLE;

  /* story rating handlers */
  function handleLike() {
    if (userVote === "like") { setLikes(l => l - 1); setUserVote(null); return; }
    if (userVote === "dislike") setDislikes(d => d - 1);
    setLikes(l => l + 1); setUserVote("like");
  }
  function handleDislike() {
    if (userVote === "dislike") { setDislikes(d => d - 1); setUserVote(null); return; }
    if (userVote === "like") setLikes(l => l - 1);
    setDislikes(d => d + 1); setUserVote("dislike");
  }

  /* comment vote handler */
  function handleCommentVote(id: number, vote: "up" | "down") {
    setComments(prev => prev.map(c => {
      if (c.id !== id) return c;
      const undo   = c.userVote === vote;
      const change = vote === "up" ? 1 : -1;
      const revert = c.userVote ? (c.userVote === "up" ? -1 : 1) : 0;
      return undo
        ? { ...c, score: c.score - change, userVote: null }
        : { ...c, score: c.score + change + revert, userVote: vote };
    }));
  }

  /* submit comment */
  function handleSubmitComment() {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    setComments(prev => [...prev, {
      id:       prev.length + 1,
      user:     t("storyDetail.you", { defaultValue: "You" }),
      text:     trimmed,
      date:     new Date().toISOString().split("T")[0],
      score:    0,
      userVote: null,
    }]);
    setCommentText("");
  }

  function chapterTitle(idx: number, total: number) {
    if (idx === 0)              return t("storyDetail.prologue", { defaultValue: "Prologue" });
    if (idx === total - 1 && total > 2)
                                return t("storyDetail.epilogue", { defaultValue: "Epilogue" });
    return `${t("storyDetail.chapter", { defaultValue: "Chapter" })} ${idx + 1}`;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>

          <Link href="/stories" className={styles.backLink}>
            <ArrowLeft size={15} />
            {t("storyDetail.backToStories", { defaultValue: "Back to stories" })}
          </Link>

          {/* ── Banner ── */}
          <div className={styles.banner} style={{ background: gs.gradient }}>
            <BookOpen
              size={180}
              className={styles.bannerBgIcon}
              style={{ color: gs.iconColor }}
            />

            <div className={styles.bannerBadges}>
              {story.genres.map((genre) => {
                const s = GENRE_STYLES[genre] ?? DEFAULT_GENRE_STYLE;
                return (
                  <span key={genre} className={styles.genreBadge}
                    style={{ background: s.badgeBg, color: s.badgeColor }}>
                    {t(`genreNames.${genre}`, { defaultValue: genre })}
                  </span>
                );
              })}
              <span className={styles.statusBadge}
                style={{ background: ss.badgeBg, color: ss.badgeColor }}>
                {t(`storyCard.${story.status}`, { defaultValue: story.status })}
              </span>
            </div>

            <h1 className={styles.bannerTitle}>{story.title}</h1>
            <p className={styles.bannerAuthor}>
              {t("storyDetail.by", { defaultValue: "by" })}{" "}
              {story.author}
            </p>

            <div className={styles.bannerStats}>
              <span className={styles.bannerStat}>
                <Star size={13} style={{ color: "#fcd34d" }} />
                <strong>{story.rating.toFixed(1)}</strong>
              </span>
              <span className={styles.bannerSep}>·</span>
              <span className={styles.bannerStat}>
                <strong>{story.chapters}</strong>{" "}
                {t("storyCard.chaptersSuffix", { defaultValue: "ch." })}
              </span>
              <span className={styles.bannerSep}>·</span>
              <span className={styles.bannerStat}>
                <strong>{story.pages}</strong>{" "}
                {t("storyCard.pagesSuffix", { defaultValue: "pp." })}
              </span>
              <span className={styles.bannerSep}>·</span>
              <span className={styles.bannerStat}>
                {story.year} · {t(`countries.${story.country}`, { defaultValue: story.country })}
              </span>
            </div>

            <div className={styles.bannerActions}>
              <button
                className={styles.btnPrimary}
                disabled
              >
                {t("storyDetail.readNow", { defaultValue: "Read now" })}
              </button>
              <button
                className={styles.btnGhost}
                onClick={() => setInLibrary(v => !v)}
              >
                {inLibrary
                  ? <><BookmarkCheck size={14} /> {t("storyDetail.inLibrary", { defaultValue: "In library" })}</>
                  : <><BookmarkPlus  size={14} /> {t("storyDetail.addToLibrary", { defaultValue: "Add to library" })}</>
                }
              </button>
            </div>
          </div>

          {/* ── Two-column body ── */}
          <div className={styles.body}>

            {/* Main */}
            <div className={styles.main2}>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {t("storyDetail.description", { defaultValue: "Description" })}
                </h2>
                <p className={styles.descText}>{story.description}</p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {t("storyDetail.aboutAuthor", { defaultValue: "About the Author" })}
                </h2>
                <div className={styles.authorCard}>
                  {(() => {
                    const av = avatarStyle(story.author);
                    return (
                      <div className={styles.authorAvatar}
                        style={{ background: av.bg }}>
                        <div className={styles.avatarStripes} />
                        <span className={styles.avatarLetter}
                          style={{ color: av.color }}>
                          {story.author.charAt(0)}
                        </span>
                      </div>
                    );
                  })()}
                  <div className={styles.authorDetails}>
                    <p className={styles.authorName}>{story.author}</p>
                    {extra.authorNote && (
                      <p className={styles.authorNote}>{extra.authorNote}</p>
                    )}
                    {extra.authorLinks.length > 0 && (
                      <div className={styles.authorLinks}>
                        {extra.authorLinks.map((link) => (
                          <a key={link.platform} href={link.url}
                            target="_blank" rel="noopener noreferrer"
                            className={styles.authorLink}>
                            <PlatformIcon platform={link.platform} />
                            {platformLabel(link.platform)}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {t("storyDetail.rateStory", { defaultValue: "Rate this story" })}
                </h2>
                <div className={styles.voteRow}>
                  <button
                    className={`${styles.voteBtn} ${userVote === "like" ? styles.voteLikeActive : ""}`}
                    onClick={handleLike}>
                    <ThumbsUp size={16} />
                    <span>{likes.toLocaleString()}</span>
                  </button>
                  <button
                    className={`${styles.voteBtn} ${userVote === "dislike" ? styles.voteDislikeActive : ""}`}
                    onClick={handleDislike}>
                    <ThumbsDown size={16} />
                    <span>{dislikes.toLocaleString()}</span>
                  </button>
                </div>
              </section>
            </div>

            {/* Aside */}
            <aside className={styles.aside}>
              <div className={styles.statBoxes}>
                <div className={styles.statBox}>
                  <div className={styles.statBoxValue} style={{ color: "#fcd34d" }}>
                    {story.rating.toFixed(1)}
                  </div>
                  <div className={styles.statBoxLabel}>
                    {t("home.ratingLabel", { defaultValue: "Rating" })}
                  </div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxValue}>{story.chapters}</div>
                  <div className={styles.statBoxLabel}>
                    {t("storyCard.chaptersSuffix", { defaultValue: "Chapters" })}
                  </div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxValue}>{story.pages}</div>
                  <div className={styles.statBoxLabel}>
                    {t("storyCard.pagesSuffix", { defaultValue: "Pages" })}
                  </div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statBoxValue}>{story.year}</div>
                  <div className={styles.statBoxLabel}>
                    {t("storyDetail.year", { defaultValue: "Year" })}
                  </div>
                </div>
              </div>

              <div className={styles.asideDivider} />

              <div>
                <h2 className={styles.sectionTitle}>
                  {t("storyDetail.languages", { defaultValue: "Languages" })}
                </h2>
                <p className={styles.langText}>
                  {story.language
                    .map((l) => t(`languageNames.${l}`, { defaultValue: l }))
                    .join(", ")}
                </p>
              </div>
            </aside>
          </div>

          {/* ── Chapters ── */}
          <section className={styles.fullSection}>
            <h2 className={styles.sectionTitle}>
              <BookMarked size={14} />
              {t("storyDetail.chapters", { defaultValue: "Chapters" })} ({story.chapters})
            </h2>
            <div className={styles.chapterGrid}>
              {chapters.map((ch, idx) => (
                <div key={ch.id}
                  className={styles.chapterItem}>
                  <span className={styles.chapterNum}>{ch.number}</span>
                  <span className={styles.chapterName}>
                    {chapterTitle(idx, chapters.length)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Comments ── */}
          <section className={styles.fullSection}>
            <h2 className={styles.sectionTitle}>
              {t("storyDetail.comments", { defaultValue: "Comments" })} ({comments.length})
            </h2>

            {/* Input */}
            <div className={styles.commentInputWrap}>
              <label htmlFor="comment-input" className={styles.commentLabel}>
                {t("storyDetail.shareThoughts", { defaultValue: "Share your thoughts" })}
              </label>
              <textarea
                id="comment-input"
                className={styles.commentTextarea}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t("storyDetail.commentPlaceholder",
                  { defaultValue: "What did you think of this story?" })}
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey))
                    handleSubmitComment();
                }}
              />
              <div className={styles.commentInputFooter}>
                <button className={styles.postBtn}
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}>
                  <Send size={12} />
                  {t("storyDetail.submitComment", { defaultValue: "Post" })}
                </button>
              </div>
            </div>

            {/* Sort tabs */}
            <div className={styles.sortTabs}>
              <button
                className={`${styles.sortTab} ${sortOrder === "best" ? styles.sortTabActive : ""}`}
                onClick={() => setSortOrder("best")}>
                ↓ {t("storyDetail.sortBest", { defaultValue: "Best" })}
              </button>
              <button
                className={`${styles.sortTab} ${sortOrder === "newest" ? styles.sortTabActive : ""}`}
                onClick={() => setSortOrder("newest")}>
                ↓ {t("storyDetail.sortNewest", { defaultValue: "Newest" })}
              </button>
            </div>

            {/* Comment list */}
            <div className={styles.commentList}>
              {sortedComments.map((comment) => {
                const av = avatarStyle(comment.user);
                return (
                  <div key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentAvatar}
                      style={{ background: av.bg }}>
                      <div className={styles.avatarStripes} />
                      <span className={styles.avatarLetter}
                        style={{ color: av.color }}>
                        {comment.user.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className={styles.commentBody}>
                      <div className={styles.commentTop}>
                        <span className={styles.commentUser}>{comment.user}</span>
                        <span className={styles.commentDate}>{comment.date}</span>
                      </div>
                      <p className={styles.commentText}>{comment.text}</p>
                      <div className={styles.commentActions}>
                        <button className={styles.replyBtn}>
                          ↩ {t("storyDetail.reply", { defaultValue: "Reply" })}
                        </button>
                        <div className={styles.voteGroup}>
                          <button
                            aria-label="Dislike comment"
                            className={`${styles.heartBtn} ${comment.userVote === "down" ? styles.heartBtnDislikeActive : ""}`}
                            onClick={() => handleCommentVote(comment.id, "down")}>
                            <ThumbsDown size={15} />
                          </button>
                          <span className={styles.voteScore}>
                            {comment.score > 0 ? `+${comment.score}` : comment.score}
                          </span>
                          <button
                            aria-label="Like comment"
                            className={`${styles.heartBtn} ${comment.userVote === "up" ? styles.heartBtnLikeActive : ""}`}
                            onClick={() => handleCommentVote(comment.id, "up")}>
                            <Heart size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

