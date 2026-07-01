"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { Plus, BookOpen, BookMarked, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { MOCK_AUTHORS } from "@/lib/mockAuthors";
import { MOCK_STORIES, addStory, incrementChapterCount } from "@/lib/mockStories";
import { addChapterToStory, getStoryExtra } from "@/lib/mockStoryDetails";
import { GENRE_BADGE } from "@/lib/genreStyles";
import type { StoryItem } from "@/components/StoryListItem";
import profileStyles from "../page.module.css";
import styles from "./page.module.css";

const GENRE_OPTIONS = [
  "fantasy", "adventure", "mystery", "thriller", "steampunk", "scifi",
  "romance", "action", "historical", "horror", "drama", "dystopia",
  "comedy", "poetry",
];

const LANGUAGE_OPTIONS = ["en", "ru", "ky"];

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("");
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function DashboardStoryCard({ story }: { story: StoryItem }) {
  const { t } = useTranslation();
  const languageList = story.language
    .map((l) => t(`languageNames.${l}`, { defaultValue: l }))
    .join(", ");

  return (
    <Link href={`/stories/${story.id}`} className={profileStyles.storyCard}>
      <div className={profileStyles.cardCover}>
        <div className={profileStyles.cardCoverOverlay} />
        <BookOpen size={32} className={profileStyles.cardCoverIcon} />
        <div className={profileStyles.cardBadges}>
          <span className={profileStyles.cardBadge}>
            {t(`storyCard.${story.status}`, { defaultValue: story.status })}
          </span>
        </div>
      </div>
      <div className={profileStyles.cardBody}>
        <div className={profileStyles.cardTitleRow}>
          <h3 className={profileStyles.cardTitle}>{story.title}</h3>
          <span className={profileStyles.cardRating}>★ {story.rating.toFixed(1)}</span>
        </div>

        <div className={profileStyles.cardMeta}>
          <span>{story.author}</span>
          <span className={profileStyles.cardMetaDot} />
          <span>{story.year}</span>
        </div>

        <div className={profileStyles.cardPills}>
          {story.genres.map((g) => (
            <span
              key={g}
              className={profileStyles.cardPill}
              style={{ background: GENRE_BADGE.bg, color: GENRE_BADGE.color, borderColor: GENRE_BADGE.border }}
            >
              {t(`genreNames.${g}`, { defaultValue: g })}
            </span>
          ))}
        </div>

        <p className={profileStyles.cardLanguages}>{languageList}</p>

        <p className={profileStyles.cardDesc}>{story.description}</p>
        <div className={profileStyles.cardFooter}>
          <div className={profileStyles.cardStats}>
            <span className={profileStyles.cardStat}>
              <BookMarked size={12} />
              {story.chapters} {t("storyCard.chaptersSuffix")}
            </span>
            <span className={profileStyles.cardStat}>
              <Layers size={12} />
              {story.pages} {t("storyCard.pagesSuffix")}
            </span>
          </div>
          <span className={profileStyles.cardReadBtn}>{t("storyList.readButton")}</span>
        </div>
      </div>
    </Link>
  );
}

export default function AuthorDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  const author = MOCK_AUTHORS.find((a) => a.id === Number(id));
  const isOwner = !!author && isLoggedIn && user?.username === author.username;

  const [stories, setStories] = useState<StoryItem[]>(
    () => (author ? MOCK_STORIES.filter((s) => s.author === author.displayName) : [])
  );

  // Story creation form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([i18n.language]);

  // Chapter management
  const [managingChapterId, setManagingChapterId] = useState<number | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");

  useEffect(() => {
    if (author && !isOwner) {
      router.replace(`/authors/${id}`);
    }
  }, [author, isOwner, id, router]);

  if (!author) {
    notFound();
    return null;
  }
  if (!isOwner) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGenres([]);
    setLanguages([i18n.language]);
    setShowForm(false);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || genres.length === 0 || languages.length === 0) return;
    const story = addStory({
      title: title.trim(),
      author: author.displayName,
      description: description.trim(),
      genres,
      language: languages,
      status: "ongoing",
    });
    setStories((prev) => [story, ...prev]);
    resetForm();
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || genres.length === 0 || languages.length === 0) return;
    const story = addStory({
      title: title.trim(),
      author: author.displayName,
      description: description.trim(),
      genres,
      language: languages,
      status: "draft",
    });
    setStories((prev) => [story, ...prev]);
    resetForm();
  };

  const handleAddChapter = (storyId: number) => {
    if (!chapterTitle.trim()) return;
    addChapterToStory(storyId, chapterTitle.trim(), chapterContent.trim());
    incrementChapterCount(storyId);
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, chapters: s.chapters + 1 } : s))
    );
    setChapterTitle("");
    setChapterContent("");
  };

  const toggleChapterManager = (storyId: number) => {
    setManagingChapterId((prev) => (prev === storyId ? null : storyId));
    setChapterTitle("");
    setChapterContent("");
  };

  return (
    <div>
      <main className={profileStyles.main}>
        <div className={profileStyles.container}>
          <section className={profileStyles.profile}>
            <div className={profileStyles.avatar} style={{ backgroundColor: author.avatarColor }}>
              {getInitials(author.displayName)}
            </div>
            <div className={profileStyles.profileText}>
              <h1 className={profileStyles.profileName}>{author.displayName}</h1>
              <p className={profileStyles.profileHandle}>
                @{author.username} · {t("authorProfile.memberSince")} {author.memberSince}
              </p>
            </div>
            <div className={profileStyles.statsRow}>
              <div className={profileStyles.pstat}>
                <span className={profileStyles.pstatVal} style={{ color: "#a78bfa" }}>{stories.length}</span>
                <span className={profileStyles.pstatLbl}>{t("authorProfile.stories")}</span>
              </div>
              <div className={profileStyles.pstat}>
                <span className={profileStyles.pstatVal} style={{ color: "#4ade80" }}>{author.subscribers}</span>
                <span className={profileStyles.pstatLbl}>{t("authorProfile.followers")}</span>
              </div>
              <div className={profileStyles.pstat}>
                <span className={profileStyles.pstatVal} style={{ color: "#f97316" }}>{author.totalReads}</span>
                <span className={profileStyles.pstatLbl}>{t("authorProfile.totalReads")}</span>
              </div>
            </div>
            <div className={profileStyles.profileActions}>
              <button className={profileStyles.btnFollow} onClick={() => setShowForm((v) => !v)}>
                <Plus size={14} />
                {t("authorDashboard.addStory")}
              </button>
              <Link href={`/authors/${id}`} className={profileStyles.btnMessage}>
                {t("authorDashboard.viewPublicProfile")}
              </Link>
            </div>
          </section>

          {showForm && (
            <form className={styles.form} onSubmit={handlePublish}>
              <h2 className={styles.formTitle}>{t("authorDashboard.formTitle")}</h2>

              <div className={styles.field}>
                <label className={styles.label}>{t("authorDashboard.titleLabel")}</label>
                <input
                  className={styles.input}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("authorDashboard.titlePlaceholder")}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{t("authorDashboard.descriptionLabel")}</label>
                <textarea
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("authorDashboard.descriptionPlaceholder")}
                  rows={3}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{t("authorDashboard.genresLabel")}</label>
                <div className={styles.chips}>
                  {GENRE_OPTIONS.map((g) => (
                    <button
                      type="button"
                      key={g}
                      className={`${styles.chip} ${genres.includes(g) ? styles.chipOn : ""}`}
                      onClick={() => setGenres((prev) => toggle(prev, g))}
                    >
                      {t(`genreNames.${g}`, { defaultValue: g })}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{t("authorDashboard.languagesLabel")}</label>
                <div className={styles.chips}>
                  {LANGUAGE_OPTIONS.map((l) => (
                    <button
                      type="button"
                      key={l}
                      className={`${styles.chip} ${languages.includes(l) ? styles.chipOn : ""}`}
                      onClick={() => setLanguages((prev) => toggle(prev, l))}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.btnCancel} onClick={resetForm}>
                  {t("authorDashboard.cancelAdd")}
                </button>
                <button type="button" className={styles.btnDraft} onClick={handleSaveDraft}>
                  {t("authorDashboard.saveDraft")}
                </button>
                <button type="submit" className={styles.btnSubmit}>
                  {t("authorDashboard.submit")}
                </button>
              </div>
            </form>
          )}

          <div className={profileStyles.stories}>
            {stories.length === 0 ? (
              <p className={profileStyles.empty}>{t("authorDashboard.noStories")}</p>
            ) : (
              stories.map((story) => {
                const isManaging = managingChapterId === story.id;
                const allChapters = getStoryExtra(story.id).chapters ?? [];

                return (
                  <div key={story.id} className={styles.storyWrapper}>
                    <DashboardStoryCard story={story} />

                    <button
                      className={`${styles.btnChapters} ${isManaging ? styles.btnChaptersActive : ""}`}
                      onClick={() => toggleChapterManager(story.id)}
                    >
                      <BookMarked size={13} />
                      {t("authorDashboard.manageChapters")} · {story.chapters}
                      {isManaging ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    {isManaging && (
                      <div className={styles.chapterManager}>
                        {allChapters.length === 0 ? (
                          <p className={styles.noChapters}>{t("authorDashboard.noChapters")}</p>
                        ) : (
                          <ol className={styles.chapterList}>
                            {allChapters.map((ch, i) => (
                              <li key={i} className={styles.chapterItem}>
                                <span className={styles.chapterNum}>{i + 1}</span>
                                <span>{ch}</span>
                              </li>
                            ))}
                          </ol>
                        )}

                        <div className={styles.addChapterForm}>
                          <div className={styles.field}>
                            <label className={styles.label}>{t("authorDashboard.chapterTitleLabel")}</label>
                            <input
                              className={styles.input}
                              value={chapterTitle}
                              onChange={(e) => setChapterTitle(e.target.value)}
                              placeholder={t("authorDashboard.chapterTitlePlaceholder")}
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>{t("authorDashboard.chapterContentLabel")}</label>
                            <textarea
                              className={styles.textarea}
                              value={chapterContent}
                              onChange={(e) => setChapterContent(e.target.value)}
                              placeholder={t("authorDashboard.chapterContentPlaceholder")}
                              rows={5}
                            />
                          </div>
                          <div className={styles.formActions}>
                            <button
                              type="button"
                              className={styles.btnCancel}
                              onClick={() => toggleChapterManager(story.id)}
                            >
                              {t("authorDashboard.cancelChapters")}
                            </button>
                            <button
                              type="button"
                              className={styles.btnSubmit}
                              onClick={() => handleAddChapter(story.id)}
                              disabled={!chapterTitle.trim()}
                            >
                              {t("authorDashboard.addChapterSubmit")}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
