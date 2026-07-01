"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./StoryFilters.module.css";

export type Filters = {
  genres: string[];
  languages: string[];
  year: string;
  status: "all" | "ongoing" | "completed";
};

export const DEFAULT_FILTERS: Filters = {
  genres: [],
  languages: [],
  year: "all",
  status: "all",
};

type Props = {
  filters: Filters;
  availableGenres: string[];
  availableLanguages: string[];
  availableYears: number[];
  onChange: (filters: Filters) => void;
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
        className={`${styles.filterBtn} ${selected.length > 0 ? styles.filterBtnActive : ""}`}
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
            color: "#888888",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
          }}
        />
      </button>

      {open && (
        <div className={styles.dropdown}>
          {options.map((opt) => {
            const checked = selected.includes(opt);
            return (
              <label
                key={opt}
                className={`${styles.dropdownItem} ${checked ? styles.dropdownItemChecked : ""}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt)}
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
        className={`${styles.filterBtn} ${active ? styles.filterBtnActive : ""}`}
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
            color: "#888888",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
          }}
        />
      </button>

      {open && (
        <div className={`${styles.dropdown} ${styles.dropdownNarrow}`}>
          {options.map((opt) => {
            const checked = value === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`${styles.dropdownItem} ${checked ? styles.dropdownItemChecked : ""}`}
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

export default function StoryFilters({
  filters,
  availableGenres,
  availableLanguages,
  availableYears,
  onChange,
}: Props) {
  const { t } = useTranslation();

  const STATUS_OPTIONS: { label: string; value: Filters["status"] }[] = [
    { label: t("filters.status.all"), value: "all" },
    { label: t("filters.status.ongoing"), value: "ongoing" },
    { label: t("filters.status.completed"), value: "completed" },
  ];

  const hasAnyFilter =
    filters.genres.length > 0 ||
    filters.languages.length > 0 ||
    filters.year !== "all" ||
    filters.status !== "all";

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
      <div className="flex flex-wrap items-center gap-2">
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

      </div>

      {/* Status pills */}
      <div className={styles.statusGroup}>
        {STATUS_OPTIONS.map((opt) => {
          const active = filters.status === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, status: opt.value })}
              className={`${styles.statusPill} ${active ? styles.statusPillActive : ""}`}
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
          className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl transition-colors ${styles.resetBtn}`}
        >
          <X size={12} />
          {t("filters.reset")}
        </button>
      )}
    </div>
  );
}
