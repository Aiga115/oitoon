"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
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
  const content = {
    title: t(`auth.${mode}.title`),
    description: t(`auth.${mode}.description`),
    buttonLabel: t(`auth.${mode}.buttonLabel`),
    alternateLabel: t(`auth.${mode}.alternateLabel`),
    alternateHref: mode === "login" ? "/register" : "/login",
    alternateAction: t(`auth.${mode}.alternateAction`),
  };
  const fields = {
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

        <form>
          <div className={styles.fieldGroup}>
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

          <button type="submit" className={styles.submitBtn}>
            {content.buttonLabel}
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