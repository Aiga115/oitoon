"use client";

import { useState } from "react";
import Header from "@/components/Header";
import StoryCard, { type StoryItem } from "@/components/StoryCard";
import StoryFilters, { type Filters, DEFAULT_FILTERS } from "@/components/StoryFilters";

const MOCK_STORIES: StoryItem[] = [
  {
    id: 1,
    title: "Хроники Тёмного Леса",
    author: "Артём Белов",
    genres: ["Фэнтези", "Приключения"],
    year: 2023,
    country: "Россия",
    status: "ongoing",
    pages: 120,
    chapters: 18,
    rating: 4.8,
    description:
      "Молодой охотник обнаруживает в глубине проклятого леса древний артефакт, пробуждающий силы, которые не должны были вернуться.",
  },
  {
    id: 2,
    title: "Город Снов",
    author: "Мария Соколова",
    genres: ["Мистика", "Триллер"],
    year: 2022,
    country: "Казахстан",
    status: "completed",
    pages: 85,
    chapters: 34,
    rating: 4.5,
    description:
      "Детектив расследует серию странных исчезновений, которые связаны с загадочным городом, существующим только во снах.",
  },
  {
    id: 3,
    title: "Механический Рыцарь",
    author: "Дмитрий Орлов",
    genres: ["Стимпанк", "Научная фантастика"],
    year: 2024,
    country: "Россия",
    status: "ongoing",
    pages: 200,
    chapters: 52,
    rating: 4.2,
    description:
      "В мире пара и шестерёнок одинокий изобретатель создаёт боевого голема, чтобы защитить свой город от надвигающейся армии.",
  },
  {
    id: 4,
    title: "Алая Луна",
    author: "Наталья Ким",
    genres: ["Романтика", "Фэнтези"],
    year: 2023,
    country: "Кыргызстан",
    status: "completed",
    pages: 65,
    chapters: 29,
    rating: 4.6,
    description:
      "Под кровавой луной двое врагов вынуждены объединиться, чтобы выжить, и постепенно открывают в себе чувства сильнее ненависти.",
  },
  {
    id: 5,
    title: "Звёздный Странник",
    author: "Игорь Зайцев",
    genres: ["Научная фантастика", "Приключения"],
    year: 2024,
    country: "Россия",
    status: "ongoing",
    pages: 350,
    chapters: 11,
    rating: 4.9,
    description:
      "Капитан заброшенного звездолёта получает сигнал с планеты, которой нет ни на одной карте. Это может быть спасение — или ловушка.",
  },
  {
    id: 6,
    title: "Тайны Подземелья",
    author: "Ольга Федорова",
    genres: ["Приключения", "Мистика"],
    year: 2021,
    country: "Узбекистан",
    status: "completed",
    pages: 145,
    chapters: 7,
    rating: 4.3,
    description:
      "Группа студентов-археологов проникает в запретные катакомбы под Москвой и сталкивается с историей, которую власти хотели скрыть.",
  },
  {
    id: 7,
    title: "Сердце Дракона",
    author: "Павел Морозов",
    genres: ["Фэнтези", "Романтика"],
    year: 2024,
    country: "Казахстан",
    status: "ongoing",
    pages: 280,
    chapters: 61,
    rating: 4.7,
    description:
      "Принцесса, проклятая с рождения, отправляется на край света, чтобы найти последнего дракона — единственного, кто может её исцелить.",
  },
  {
    id: 8,
    title: "Последний Самурай",
    author: "Анна Петрова",
    genres: ["Историческое", "Боевик"],
    year: 2022,
    country: "Россия",
    status: "completed",
    pages: 420,
    chapters: 23,
    rating: 4.4,
    description:
      "Эпическая история воина, который отказывается принять новый порядок и в одиночку бросает вызов целой империи, чтобы сохранить честь.",
  },
];

const ALL_GENRES = [...new Set(MOCK_STORIES.flatMap((s) => s.genres))].sort();
const ALL_YEARS = [...new Set(MOCK_STORIES.map((s) => s.year))];

function matchesPages(pages: number, bucket: Filters["pages"]): boolean {
  if (bucket === "all") return true;
  if (bucket === "0-50") return pages <= 50;
  if (bucket === "51-200") return pages >= 51 && pages <= 200;
  if (bucket === "201-500") return pages >= 201 && pages <= 500;
  if (bucket === "500+") return pages > 500;
  return true;
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filtered = MOCK_STORIES.filter((story) => {
    if (
      filters.genres.length > 0 &&
      !filters.genres.some((g) => story.genres.includes(g))
    )
      return false;
    if (filters.year !== "all" && story.year !== parseInt(filters.year))
      return false;
    if (filters.country !== "all" && story.country !== filters.country)
      return false;
    if (filters.status !== "all" && story.status !== filters.status)
      return false;
    if (!matchesPages(story.pages, filters.pages)) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-6 py-10" style={{ backgroundColor: "#0d0b1e", position: "relative", zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">

          {/* Hero Banner */}
          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "32px",
              position: "relative",
              height: "200px",
              display: "flex",
              alignItems: "flex-end",
              background: "linear-gradient(135deg,#1a0a3b 0%,#2a1060 40%,#1a2060 70%,#0a1a3b 100%)",
              border: "0.5px solid rgba(167,139,250,0.2)",
            }}
          >
            {/* Decorative orbs */}
            <div style={{ position: "absolute", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle,rgba(167,139,250,0.18) 0%,transparent 70%)", top: "-60px", left: "200px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.12) 0%,transparent 70%)", top: "-30px", right: "120px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle,rgba(45,212,191,0.10) 0%,transparent 70%)", bottom: "10px", left: "60px", pointerEvents: "none" }} />
            {/* Grid lines overlay */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 2, padding: "28px 32px", flex: 1 }}>
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2dd4bf", marginBottom: "8px" }}>
                ⭐ Рекомендуем сегодня
              </p>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#f1f0fa", letterSpacing: "-0.4px", marginBottom: "10px", lineHeight: 1.25 }}>
                Откройте новые истории
              </h1>
              <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
                {["Фэнтези", "Стимпанк", "Романтика"].map((tag) => (
                  <span key={tag} style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", padding: "3px 9px", borderRadius: "4px", backgroundColor: "rgba(167,139,250,0.15)", color: "#c4b5fd", border: "0.5px solid rgba(167,139,250,0.3)" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <button
                style={{ fontSize: "12px", fontWeight: 600, padding: "8px 18px", borderRadius: "8px", backgroundColor: "#a78bfa", color: "#fff", border: "none", cursor: "pointer" }}
              >
                Читать сейчас
              </button>
            </div>

            {/* Rating display */}
            <div style={{ position: "absolute", right: "32px", bottom: "28px", textAlign: "center", zIndex: 2 }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#fbbf24", lineHeight: 1 }}>4.8</div>
              <div style={{ fontSize: "10px", color: "#6b6887", marginTop: "3px" }}>★★★★★</div>
              <div style={{ fontSize: "9px", color: "#6b6887", marginTop: "1px" }}>рейтинг</div>
            </div>
          </div>

          {/* Section heading */}
          <div style={{ display: "inline-block", position: "relative", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.3px", color: "#f1f0fa" }}>
              Популярное
              <span style={{ marginLeft: "6px", fontSize: "14px", fontWeight: 400, color: "#6b6887" }}>
                · {filtered.length} историй
              </span>
            </h2>
            <div style={{ position: "absolute", bottom: "-4px", left: 0, width: "32px", height: "2px", backgroundColor: "#a78bfa", borderRadius: "1px" }} />
          </div>

          <StoryFilters
            filters={filters}
            availableGenres={ALL_GENRES}
            availableYears={ALL_YEARS}
            onChange={setFilters}
          />

          {filtered.length > 0 ? (
            <div className="flex flex-wrap gap-5">
              {filtered.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <p className="text-sm mt-8" style={{ color: "#6b6887" }}>
              Ничего не найдено. Попробуйте изменить фильтры.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
