import Link from "next/link";
import { BookOpen, Sparkles, Palette, PenLine, Trophy, Rocket, Search } from "lucide-react";

const NAV_ITEMS = [
  { label: "Рассказы", href: "/stories", icon: <BookOpen size={14} />, active: true },
  { label: "Фанфики", href: "/fanfics", icon: <Sparkles size={14} /> },
  { label: "Комиксы", href: "/comics", icon: <Palette size={14} /> },
  { label: "Авторы", href: "/authors", icon: <PenLine size={14} /> },
  { label: "Рейтинги", href: "/ratings", icon: <Trophy size={14} /> },
];

const BORDER = "0.5px solid rgba(255,255,255,0.07)";
const BG = "#13102b";

export default function Header() {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
      {/* Top bar: logo + search + auth */}
      <header
        style={{
          backgroundColor: BG,
          borderBottom: BORDER,
          padding: "0 28px",
          height: "58px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            background: "linear-gradient(135deg,#c4b5fd,#a78bfa,#f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "var(--font-roboto-mono)",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          oitoon
        </Link>

        <div style={{ position: "relative", flex: 1, maxWidth: "240px", marginLeft: "8px" }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b6887",
              pointerEvents: "none",
            }}
          />
          <input
            type="search"
            placeholder="Поиск историй, авторов..."
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: BORDER,
              borderRadius: "8px",
              padding: "7px 12px 7px 30px",
              fontSize: "12px",
              color: "#f1f0fa",
              outline: "none",
              fontFamily: "var(--font-roboto-mono)",
            }}
          />
        </div>

        <div style={{ flex: 1 }} />

        <Link
          href="/login"
          style={{
            background: "transparent",
            border: "0.5px solid rgba(249,115,22,0.5)",
            color: "#f97316",
            padding: "7px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Войти
        </Link>
        <Link
          href="/register"
          style={{
            backgroundColor: "#a78bfa",
            color: "#fff",
            padding: "7px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Регистрация
        </Link>
      </header>

      {/* Subnav */}
      <div
        style={{
          backgroundColor: BG,
          borderBottom: BORDER,
          padding: "0 28px",
          height: "46px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-1.5 whitespace-nowrap transition-colors"
            style={{
              fontSize: "13px",
              color: item.active ? "#a78bfa" : "#6b6887",
              padding: "6px 12px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        <div style={{ marginLeft: "auto" }}>
          <Link
            href="/become-author"
            className="flex items-center gap-1.5"
            style={{
              backgroundColor: "rgba(249,115,22,0.12)",
              border: "0.5px solid rgba(249,115,22,0.35)",
              color: "#f97316",
              fontSize: "12px",
              fontWeight: 500,
              padding: "6px 14px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            <Rocket size={13} />
            Я хочу быть автором
          </Link>
        </div>
      </div>
    </div>
  );
}
