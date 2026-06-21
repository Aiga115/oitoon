"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import GB from "country-flag-icons/react/3x2/GB";
import RU from "country-flag-icons/react/3x2/RU";
import KG from "country-flag-icons/react/3x2/KG";
import styles from "./AuthFormTemplate.module.css";

const LANGUAGES = [
  { code: "en", label: "EN", Flag: GB },
  { code: "ru", label: "RU", Flag: RU },
  { code: "ky", label: "KY", Flag: KG },
];

function changeLanguage(code: string) {
  i18n.changeLanguage(code);
  localStorage.setItem("oitoon-lang", code);
}

type AuthFormTemplateProps = {
  mode: "login" | "register";
};

export default function AuthFormTemplate({ mode }: AuthFormTemplateProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/auth/${mode === "login" ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            mode === "login"
              ? { identifier, password }
              : { username, email, password, first_name: firstName || null, last_name: lastName || null }
          ),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Something went wrong");
        return;
      }
      login(data.user, data.access_token);
      router.push("/");
    } catch {
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };
  const content = {
    title: t(`auth.${mode}.title`),
    description: t(`auth.${mode}.description`),
    buttonLabel: t(`auth.${mode}.buttonLabel`),
    alternateLabel: t(`auth.${mode}.alternateLabel`),
    alternateHref: mode === "login" ? "/register" : "/login",
    alternateAction: t(`auth.${mode}.alternateAction`),
  };
  const fields = {
    firstName: t("auth.fields.firstName"),
    lastName: t("auth.fields.lastName"),
    firstNamePlaceholder: t("auth.fields.firstNamePlaceholder"),
    lastNamePlaceholder: t("auth.fields.lastNamePlaceholder"),
    username: t("auth.fields.username"),
    email: t("auth.fields.email"),
    usernameOrEmail: t("auth.fields.usernameOrEmail"),
    password: t("auth.fields.password"),
    confirmPassword: t("auth.fields.confirmPassword"),
    usernamePlaceholder: t("auth.fields.usernamePlaceholder"),
    emailPlaceholder: t("auth.fields.emailPlaceholder"),
    usernameOrEmailPlaceholder: t("auth.fields.usernameOrEmailPlaceholder"),
    passwordPlaceholder: t("auth.fields.passwordPlaceholder"),
    confirmPasswordPlaceholder: t("auth.fields.confirmPasswordPlaceholder"),
  };

  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.topBar}>
        <Link href="/" className={styles.topBrand}>
          oitoon
        </Link>
        <div className={styles.langSwitcher}>
          {LANGUAGES.map((lang) => {
            const active = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                title={lang.label}
                className={`${styles.langBtn} ${active ? styles.langBtnActive : ""}`}
              >
                <lang.Flag className={styles.flag} />
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.card}>
        <h1 className={styles.heading}>{content.title}</h1>
        <p className={styles.subheading}>{content.description}</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            {mode === "register" && (
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="firstName" className={styles.label}>
                    {fields.firstName}
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder={fields.firstNamePlaceholder}
                    className={styles.input}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="lastName" className={styles.label}>
                    {fields.lastName}
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder={fields.lastNamePlaceholder}
                    className={styles.input}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {mode === "register" && (
              <div className={styles.field}>
                <label htmlFor="username" className={styles.label}>
                  {fields.username}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder={fields.usernamePlaceholder}
                  className={styles.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="identifier" className={styles.label}>
                {mode === "login" ? fields.usernameOrEmail : fields.email}
              </label>
              <input
                id="identifier"
                name={mode === "login" ? "identifier" : "email"}
                type={mode === "login" ? "text" : "email"}
                autoComplete={mode === "login" ? "username" : "email"}
                placeholder={mode === "login" ? fields.usernameOrEmailPlaceholder : fields.emailPlaceholder}
                className={styles.input}
                value={mode === "login" ? identifier : email}
                onChange={(e) => mode === "login" ? setIdentifier(e.target.value) : setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                {fields.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                placeholder={fields.passwordPlaceholder}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mode === "register" && (
              <div className={styles.field}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  {fields.confirmPassword}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder={fields.confirmPasswordPlaceholder}
                  className={styles.input}
                />
              </div>
            )}
          </div>

          {error && <p style={{ color: "#f87171", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{error}</p>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "..." : content.buttonLabel}
          </button>
        </form>

        <div className={styles.divider} />

        <p className={styles.altText}>
          {content.alternateLabel}{" "}
          <Link href={content.alternateHref} className={styles.altLink}>
            {content.alternateAction}
          </Link>
        </p>
      </div>
    </div>
  );
}