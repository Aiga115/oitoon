import Link from "next/link";

const NAV_ITEMS = [
  { label: "Рассказы", href: "/stories" },
  { label: "Фанфики", href: "/fanfics" },
  { label: "Комиксы", href: "/comics" },
  { label: "Авторы", href: "/authors" },
  { label: "Рейтинги", href: "/ratings" },
  { label: "Я хочу быть автором", href: "/become-author" },
];

export default function Header() {
  return (
    <div>
      {/* Top bar: logo + auth */}
      <header
        className="py-3 px-6"
        style={{ backgroundColor: "#1a1630", borderBottom: "1px solid #2e2550" }}
      >
        <div className="flex max-w-6xl mx-auto items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-wider">
            <span style={{ color: "#7c3aed", fontFamily: "var(--font-roboto-mono)" }}>oi</span>
            <span style={{ color: "#ff8c42", fontFamily: "var(--font-roboto-mono)" }}>toon</span>
          </Link>

          <nav className="flex items-center text-sm font-medium">
            <Link href="/login" className="text-[#ff8c42] hover:text-[#ff9c42] transition-colors">
              Войти
            </Link>
            <span className="mx-3" style={{ color: "#2e2550" }}>|</span>
            <Link href="/register" className="text-[#9f67ff] hover:text-[#b78fff] transition-colors">
              Регистрация
            </Link>
          </nav>
        </div>
      </header>

      {/* Sub-header: nav + search */}
      <div
        className="px-6 py-2"
        style={{ backgroundColor: "#150f2e", borderBottom: "1px solid #2e2550" }}
      >
        <div className="flex max-w-6xl mx-auto items-center gap-6 flex-wrap">
          <nav className="flex items-center gap-5 flex-wrap flex-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-300 hover:text-white transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative flex items-center shrink-0">
            <svg
              className="absolute left-3 w-4 h-4 pointer-events-none"
              style={{ color: "#7c3aed" }}
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
              className="pl-9 pr-4 py-1.5 text-sm rounded bg-transparent outline-none text-zinc-200 placeholder-zinc-500 focus:ring-1"
              style={{
                border: "1px solid #2e2550",
                width: "200px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
