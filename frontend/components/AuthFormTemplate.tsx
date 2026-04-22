type AuthFormTemplateProps = {
  mode: "login" | "register";
};

const contentByMode = {
  login: {
    title: "Login",
    description: "Template page for signing in.",
    buttonLabel: "Sign in",
    alternateLabel: "Need an account?",
    alternateHref: "/register",
    alternateAction: "Create one",
  },
  register: {
    title: "Register",
    description: "Template page for creating an account.",
    buttonLabel: "Create account",
    alternateLabel: "Already have an account?",
    alternateHref: "/login",
    alternateAction: "Sign in",
  },
} as const;

export default function AuthFormTemplate({ mode }: AuthFormTemplateProps) {
  const content = contentByMode[mode];

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
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                className="w-full rounded border px-3 py-2"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
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