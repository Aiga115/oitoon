"use client";

import { useTranslation } from "react-i18next";

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
    name: t("auth.fields.name"),
    email: t("auth.fields.email"),
    password: t("auth.fields.password"),
    namePlaceholder: t("auth.fields.namePlaceholder"),
    emailPlaceholder: t("auth.fields.emailPlaceholder"),
    passwordPlaceholder: t("auth.fields.passwordPlaceholder"),
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-md space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">{content.title}</h1>
          <p>{content.description}</p>
        </header>

        <form className="space-y-4">
          {mode === "register" ? (
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                {fields.name}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder={fields.namePlaceholder}
                className="w-full rounded border px-3 py-2"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              {fields.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={fields.emailPlaceholder}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              {fields.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder={fields.passwordPlaceholder}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <button type="submit" className="w-full rounded border px-4 py-2">
            {content.buttonLabel}
          </button>
        </form>

        <p className="text-sm">
          {content.alternateLabel}{" "}
          <a href={content.alternateHref} className="underline">
            {content.alternateAction}
          </a>
        </p>
      </section>
    </main>
  );
}