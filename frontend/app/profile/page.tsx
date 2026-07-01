"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCircle2, BookOpen, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { getOrCreateAuthorByUsername } from "@/lib/mockAuthors";
import { MOCK_STORIES } from "@/lib/mockStories";
import styles from "./page.module.css";

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

function getInitials(firstName: string | null, lastName: string | null, username: string): string {
  if (firstName || lastName) {
    return [firstName, lastName]
      .filter(Boolean)
      .map((w) => w![0].toUpperCase())
      .join("")
      .slice(0, 2);
  }
  return username.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "#7c3aed", "#db2777", "#0891b2", "#d97706",
  "#059669", "#e11d48", "#0369a1", "#be185d",
];

function avatarColor(username: string): string {
  let hash = 0;
  for (const ch of username) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, isLoggedIn, updateUser } = useAuth();

  const [username,  setUsername]  = useState(user?.username   ?? "");
  const [email,     setEmail]     = useState(user?.email      ?? "");
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName,  setLastName]  = useState(user?.last_name  ?? "");
  const [saved, setSaved] = useState(false);

  if (!isLoggedIn || !user) {
    return (
      <main className={styles.main}>
        <div className={styles.notLoggedIn}>
          <UserCircle2 size={48} style={{ color: "#444444" }} />
          <p>You need to be signed in to view your profile.</p>
          <Link href="/login" className={styles.loginLink}>Sign in</Link>
        </div>
      </main>
    );
  }

  const isAuthor    = user.role === "author" || user.role === "admin";
  const authorRecord = isAuthor ? getOrCreateAuthorByUsername(user.username) : null;
  const authorStories = authorRecord
    ? MOCK_STORIES.filter((s) => s.author === authorRecord.displayName && s.status !== "draft")
    : [];

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;
  const initials    = getInitials(user.first_name, user.last_name, user.username);
  const color       = avatarColor(user.username);

  function handleSave() {
    updateUser({
      username:   username.trim()   || user!.username,
      email:      email.trim()      || user!.email,
      first_name: firstName.trim()  || null,
      last_name:  lastName.trim()   || null,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const dirty =
    username.trim()             !== user.username   ||
    email.trim()                !== user.email      ||
    (firstName.trim() || null)  !== user.first_name ||
    (lastName.trim()  || null)  !== user.last_name;

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* ── Avatar + name ── */}
        <div className={styles.profileHeader}>
          <div className={styles.avatar} style={{ backgroundColor: color }}>
            {initials}
          </div>
          <div>
            <h1 className={styles.displayName}>{displayName}</h1>
            <p className={styles.handle}>@{user.username} · {t("authorProfile.memberSince")} {user.member_since}</p>
          </div>
        </div>

        {/* ── Edit profile ── */}
        <div className={styles.card}>
          <p className={styles.cardTitle}>Edit profile</p>

          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              id="username"
              className={styles.input}
              value={username}
              onChange={(e) => { setUsername(e.target.value); setSaved(false); }}
              placeholder="username"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setSaved(false); }}
              placeholder="email@example.com"
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="firstName" className={styles.label}>First name</label>
              <input
                id="firstName"
                className={styles.input}
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setSaved(false); }}
                placeholder="First name"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="lastName" className={styles.label}>Last name</label>
              <input
                id="lastName"
                className={styles.input}
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setSaved(false); }}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Member since</span>
            <span className={styles.infoValue}>{user.member_since}</span>
          </div>

          <div className={styles.saveRow}>
            <button
              className={styles.btnSave}
              onClick={handleSave}
              disabled={!dirty}
            >
              Save changes
            </button>
            {saved && <span className={styles.savedNote}>Saved!</span>}
          </div>
        </div>

        {/* ── Author section ── */}
        {authorRecord ? (
          <div className={styles.card}>
            <p className={styles.cardTitle}>Author profile</p>

            <div className={styles.authorStats}>
              <div className={styles.stat}>
                <span className={styles.statVal} style={{ color: "#a78bfa" }}>
                  {authorStories.length}
                </span>
                <span className={styles.statLbl}>{t("authorProfile.stories")}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statVal} style={{ color: "#4ade80" }}>
                  {formatCount(authorRecord.subscribers)}
                </span>
                <span className={styles.statLbl}>{t("authorProfile.followers")}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statVal} style={{ color: "#f97316" }}>
                  {formatCount(authorRecord.totalReads)}
                </span>
                <span className={styles.statLbl}>{t("authorProfile.totalReads")}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Link href={`/authors/${authorRecord.id}`} className={styles.btnAuthorLink}>
                <BookOpen size={13} />
                Public profile
              </Link>
              <Link href={`/authors/${authorRecord.id}/dashboard`} className={styles.btnAuthorLink}>
                <Settings size={13} />
                {t("authorDashboard.manageStories")}
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.card}>
            <p className={styles.cardTitle}>Author</p>
            <p style={{ fontSize: 13, color: "#888888", margin: 0 }}>
              You don&apos;t have an author profile yet.
            </p>
            <Link
              href="/login?redirect=become-author"
              className={styles.btnBecomeAuthor}
            >
              Become an Author
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
