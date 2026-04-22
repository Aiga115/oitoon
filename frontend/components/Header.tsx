import Link from "next/link";

const NAV_ITEMS = [
  { label: "Рассказы", href: "/stories", icon: "📖" },
  { label: "Фанфики", href: "/fanfics", icon: "✨" },
  { label: "Комиксы", href: "/comics", icon: "🎨" },
  { label: "Авторы", href: "/authors", icon: "🖊️" },
  { label: "Рейтинги", href: "/ratings", icon: "🏆" },
  { label: "Я хочу быть автором", href: "/become-author", icon: "🚀", special: true },
];

export default function Header() {
  return (
    <div>
      {/* Top bar: logo + auth */}
      <header
        className="py-4 px-6"
        style={{ backgroundColor: "#13102b", borderBottom: "1px solid #2a2060" }}
      >
        <div className="flex max-w-6xl mx-auto items-center justify-between">
          <Link href="/" className="text-3xl tracking-wider leading-none">
            <span style={{ color: "#a855f7", fontFamily: "var(--font-roboto-mono)" }}>oi</span>
            <span style={{ color: "#f97316", fontFamily: "var(--font-roboto-mono)" }}>toon</span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-bold px-5 py-2 rounded-xl transition-colors"
              style={{
                color: "#f97316",
                backgroundColor: "rgba(249,115,22,0.12)",
                border: "1.5px solid rgba(249,115,22,0.4)",
              }}
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold px-5 py-2 rounded-xl text-white transition-colors"
              style={{ backgroundColor: "#a855f7" }}
            >
              Регистрация
            </Link>
          </nav>
        </div>
      </header>

      {/* Sub-header: nav + search */}
      <div
        className="px-6"
        style={{ backgroundColor: "#13102b", borderBottom: "1px solid #2a2060" }}
      >
        <div className="flex max-w-6xl mx-auto items-center justify-between">
          <nav className="flex items-center gap-1 flex-wrap">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-xl whitespace-nowrap transition-colors"
                style={
                  item.special
                    ? {
                        color: "#f97316",
                        backgroundColor: "rgba(249,115,22,0.10)",
                        border: "1px solid rgba(249,115,22,0.25)",
                      }
                    : {
                        color: "#c4b5d4",
                      }
                }
              >
                <span style={{ fontSize: "15px" }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative flex items-center shrink-0">
            <svg
              className="absolute left-3 w-4 h-4 pointer-events-none"
              style={{ color: "#6d5fa0" }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="search"
              placeholder="Поиск..."
              className="pl-9 pr-4 py-2 text-sm rounded-xl outline-none text-zinc-200 placeholder-zinc-500 focus:ring-1 focus:ring-purple-500"
              style={{
                backgroundColor: "#1e1a3a",
                border: "1.5px solid #3b2f6e",
                width: "200px",
                fontFamily: "var(--font-roboto-mono)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}