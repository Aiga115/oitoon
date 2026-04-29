"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export type Filters = {
  genres: string[];
  languages: string[];
  year: string;
  country: string;
  status: "all" | "ongoing" | "completed";
  pages: "all" | "0-50" | "51-200" | "201-500" | "500+";
};

export const DEFAULT_FILTERS: Filters = {
  genres: [],
  languages: [],
  year: "all",
  country: "all",
  status: "all",
  pages: "all",
};

type Props = {
  filters: Filters;
  availableGenres: string[];
  availableLanguages: string[];
  availableYears: number[];
  onChange: (filters: Filters) => void;
};

const COUNTRY_KEYS = ["Russia", "Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"];

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

// ── Generic multi-select dropdown ────────────────────────────────────────────
function MultiSelectDropdown({
  selected,
  options,
  onChange,
  placeholder,
  getOptionLabel,
}: {
  selected: string[];
  options: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  getOptionLabel: (key: string) => string;
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

  function toggle(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  }

  const label =
    selected.length === 0
      ? placeholder
      : selected.length === 1
      ? getOptionLabel(selected[0])
      : `${placeholder} (${selected.length})`;

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
            minWidth: "160px",
            backgroundColor: "#252145",
            border: "1px solid rgba(167,139,250,0.20)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {options.map((opt) => {
            const checked = selected.includes(opt);
            return (
              <label
                key={opt}
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
                  onChange={() => toggle(opt)}
                  className="accent-violet-400"
                  style={{ accentColor: "#a78bfa" }}
                />
                {getOptionLabel(opt)}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Styled single-select dropdown ────────────────────────────────────────────
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

  const active = value !== "all";
  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm"
        style={{
          ...selectStyle,
          color: active ? "#a78bfa" : "#a09cbe",
          border: active
            ? "0.5px solid rgba(167,139,250,0.40)"
            : "0.5px solid rgba(255,255,255,0.07)",
          paddingRight: "10px",
        }}
      >
        <span>{active ? selectedLabel : placeholder}</span>
        {active && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange("all");
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
            minWidth: "140px",
            backgroundColor: "#252145",
            border: "1px solid rgba(167,139,250,0.20)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {options.map((opt) => {
            const checked = value === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="px-3 py-2 cursor-pointer text-sm transition-colors"
                style={{
                  color: checked ? "#a78bfa" : "#a09cbe",
                  backgroundColor: checked ? "rgba(167,139,250,0.08)" : "transparent",
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StoryFilters({
  filters,
  availableGenres,
  availableLanguages,
  availableYears,
  onChange,
}: Props) {
  const { t } = useTranslation();

  const PAGE_BUCKETS: { label: string; value: Filters["pages"] }[] = [
    { label: t("filters.pageBuckets.all"), value: "all" },
    { label: t("filters.pageBuckets.upTo50"), value: "0-50" },
    { label: t("filters.pageBuckets.from50to200"), value: "51-200" },
    { label: t("filters.pageBuckets.from200to500"), value: "201-500" },
    { label: t("filters.pageBuckets.moreThan500"), value: "500+" },
  ];

  const STATUS_OPTIONS: { label: string; value: Filters["status"] }[] = [
    { label: t("filters.status.all"), value: "all" },
    { label: t("filters.status.ongoing"), value: "ongoing" },
    { label: t("filters.status.completed"), value: "completed" },
  ];

  const translatedCountries = t("countries", { returnObjects: true }) as string[];
  const COUNTRY_OPTIONS = COUNTRY_KEYS.map((key, i) => ({
    label: translatedCountries[i] ?? key,
    value: key,
  }));

  const hasAnyFilter =
    filters.genres.length > 0 ||
    filters.languages.length > 0 ||
    filters.year !== "all" ||
    filters.country !== "all" ||
    filters.status !== "all" ||
    filters.pages !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {/* Genre multi-select */}
      <MultiSelectDropdown
        selected={filters.genres}
        options={availableGenres}
        onChange={(genres) => onChange({ ...filters, genres })}
        placeholder={t("filters.genres")}
        getOptionLabel={(g) => t(`genreNames.${g}`, { defaultValue: g })}
      />

      {/* Language multi-select */}
      <MultiSelectDropdown
        selected={filters.languages}
        options={availableLanguages}
        onChange={(languages) => onChange({ ...filters, languages })}
        placeholder={t("filters.language")}
        getOptionLabel={(l) => t(`languageNames.${l}`, { defaultValue: l })}
      />

      {/* Year */}
      <FilterSelect
        value={filters.year}
        placeholder={t("filters.year")}
        options={availableYears
          .sort((a, b) => b - a)
          .map((y) => ({ label: String(y), value: String(y) }))}
        onChange={(year) => onChange({ ...filters, year })}
      />

      {/* Country */}
      <FilterSelect
        value={filters.country}
        placeholder={t("filters.country")}
        options={COUNTRY_OPTIONS}
        onChange={(country) => onChange({ ...filters, country })}
      />

      {/* Pages */}
      <FilterSelect
        value={filters.pages}
        placeholder={t("filters.pages")}
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
          {t("filters.reset")}
        </button>
      )}
    </div>
  );
}
