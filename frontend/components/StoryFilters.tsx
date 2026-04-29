"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

export type Filters = {
  genres: string[];
  year: string;
  country: string;
  status: "all" | "ongoing" | "completed";
  pages: "all" | "0-50" | "51-200" | "201-500" | "500+";
};

export const DEFAULT_FILTERS: Filters = {
  genres: [],
  year: "all",
  country: "all",
  status: "all",
  pages: "all",
};

type Props = {
  filters: Filters;
  availableGenres: string[];
  availableYears: number[];
  onChange: (filters: Filters) => void;
};

const COUNTRIES = [
  "Россия",
  "Казахстан",
  "Узбекистан",
  "Кыргызстан",
  "Таджикистан",
  "Туркменистан",
];

const PAGE_BUCKETS: { label: string; value: Filters["pages"] }[] = [
  { label: "Все", value: "all" },
  { label: "до 50", value: "0-50" },
  { label: "50–200", value: "51-200" },
  { label: "200–500", value: "201-500" },
  { label: "500+", value: "500+" },
];

const STATUS_OPTIONS: { label: string; value: Filters["status"] }[] = [
  { label: "Все", value: "all" },
  { label: "Выходит", value: "ongoing" },
  { label: "Завершено", value: "completed" },
];

// ── shared style helpers ──────────────────────────────────────────────────────
const selectStyle: React.CSSProperties = {
  backgroundColor: "#252145",
  border: "0.5px solid rgba(255,255,255,0.07)",
  color: "#a09cbe",
  borderRadius: "8px",
  padding: "7px 12px",
  fontSize: "12px",
  outline: "none",
  cursor: "pointer",
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
};

// ── Genre multi-select dropdown ───────────────────────────────────────────────
function GenreDropdown({
  selected,
  options,
  onChange,
}: {
  selected: string[];
  options: string[];
  onChange: (genres: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function toggle(genre: string) {
    onChange(
      selected.includes(genre)
        ? selected.filter((g) => g !== genre)
        : [...selected, genre]
    );
  }

  const label =
    selected.length === 0
      ? "Жанры"
      : selected.length === 1
      ? selected[0]
      : `Жанры (${selected.length})`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm"
        style={{
          ...selectStyle,
          color: selected.length > 0 ? "#a78bfa" : "#a09cbe",
          border:
            selected.length > 0
              ? "0.5px solid rgba(167,139,250,0.40)"
              : "0.5px solid rgba(255,255,255,0.07)",
          paddingRight: "10px",
        }}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
            className="flex items-center"
          >
            <X size={12} style={{ color: "#a78bfa" }} />
          </span>
        )}
        <ChevronDown
          size={13}
          style={{
            color: "#6b6887",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute z-40 mt-1 rounded-xl overflow-hidden"
          style={{
            minWidth: "180px",
            backgroundColor: "#252145",
            border: "1px solid rgba(167,139,250,0.20)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {options.map((genre) => {
            const checked = selected.includes(genre);
            return (
              <label
                key={genre}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors"
                style={{
                  color: checked ? "#a78bfa" : "#a09cbe",
                  backgroundColor: checked
                    ? "rgba(167,139,250,0.08)"
                    : "transparent",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(genre)}
                  className="accent-violet-400"
                  style={{ accentColor: "#a78bfa" }}
                />
                {genre}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Styled native select ──────────────────────────────────────────────────────
function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
}) {
  const active = value !== "all";
  return (
    <div className="relative flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...selectStyle,
          paddingRight: "28px",
          color: active ? "#f1f0fa" : "#a09cbe",
          border: active
            ? "0.5px solid rgba(249,115,22,0.40)"
            : "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        <option value="all">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-2"
        style={{ color: "#6b6887" }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StoryFilters({
  filters,
  availableGenres,
  availableYears,
  onChange,
}: Props) {
  const hasAnyFilter =
    filters.genres.length > 0 ||
    filters.year !== "all" ||
    filters.country !== "all" ||
    filters.status !== "all" ||
    filters.pages !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {/* Genre multi-select */}
      <GenreDropdown
        selected={filters.genres}
        options={availableGenres}
        onChange={(genres) => onChange({ ...filters, genres })}
      />

      {/* Year */}
      <FilterSelect
        value={filters.year}
        placeholder="Год"
        options={availableYears
          .sort((a, b) => b - a)
          .map((y) => ({ label: String(y), value: String(y) }))}
        onChange={(year) => onChange({ ...filters, year })}
      />

      {/* Country */}
      <FilterSelect
        value={filters.country}
        placeholder="Страна"
        options={COUNTRIES.map((c) => ({ label: c, value: c }))}
        onChange={(country) => onChange({ ...filters, country })}
      />

      {/* Pages */}
      <FilterSelect
        value={filters.pages}
        placeholder="Страниц"
        options={PAGE_BUCKETS.filter((b) => b.value !== "all").map((b) => ({
          label: b.label,
          value: b.value,
        }))}
        onChange={(pages) =>
          onChange({ ...filters, pages: pages as Filters["pages"] })
        }
      />

      {/* Divider */}
      <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.07)" }} />

      {/* Status pills */}
      <div
        style={{ display: "flex", gap: "2px", backgroundColor: "#252145", borderRadius: "8px", padding: "3px", border: "0.5px solid rgba(255,255,255,0.07)" }}
      >
        {STATUS_OPTIONS.map((opt) => {
          const active = filters.status === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, status: opt.value })}
              className="transition-colors"
              style={{
                padding: "5px 14px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                backgroundColor: active ? "#a78bfa" : "transparent",
                color: active ? "#fff" : "#6b6887",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Reset */}
      {hasAnyFilter && (
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl transition-colors"
          style={{
            color: "#ef4444",
            backgroundColor: "rgba(239,68,68,0.10)",
            border: "0.5px solid rgba(239,68,68,0.25)",
          }}
        >
          <X size={12} />
          Сбросить
        </button>
      )}
    </div>
  );
}
