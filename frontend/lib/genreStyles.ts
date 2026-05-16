export type GenreStyle = {
  gradient: string;
  iconColor: string;
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
};

export type StatusStyle = {
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
};

export const GENRE_STYLES: Record<string, GenreStyle> = {
  "fantasy":    { gradient: "linear-gradient(160deg,#1a0a40 0%,#2d1b69 50%,#1a1035 100%)", iconColor: "#c4b5fd", badgeBg: "#A78BFA", badgeColor: "#2E1065", badgeBorder: "#A78BFA" },
  "scifi":      { gradient: "linear-gradient(160deg,#052830 0%,#0d4a5c 50%,#052030 100%)", iconColor: "#5eead4", badgeBg: "#22D3EE", badgeColor: "#083344", badgeBorder: "#22D3EE" },
  "steampunk":  { gradient: "linear-gradient(160deg,#2a1a00 0%,#4a3000 50%,#1a0f00 100%)", iconColor: "#FCD34D", badgeBg: "#FCD34D", badgeColor: "#451A03", badgeBorder: "#FCD34D" },
  "romance":    { gradient: "linear-gradient(160deg,#3a0a2a 0%,#6b1a50 50%,#2a0820 100%)", iconColor: "#f9a8d4", badgeBg: "#F472B6", badgeColor: "#500724", badgeBorder: "#F472B6" },
  "adventure":  { gradient: "linear-gradient(160deg,#2a1200 0%,#5c2800 50%,#1a0c00 100%)", iconColor: "#fb923c", badgeBg: "#FB923C", badgeColor: "#431407", badgeBorder: "#FB923C" },
  "action":     { gradient: "linear-gradient(160deg,#2a1200 0%,#5c2800 50%,#1a0c00 100%)", iconColor: "#fb923c", badgeBg: "#F87171", badgeColor: "#450A0A", badgeBorder: "#F87171" },
  "mystery":    { gradient: "linear-gradient(160deg,#0a1a2a 0%,#1a3a5c 50%,#081018 100%)", iconColor: "#7dd3fc", badgeBg: "#60A5FA", badgeColor: "#172554", badgeBorder: "#60A5FA" },
  "thriller":   { gradient: "linear-gradient(160deg,#1a0a1a 0%,#3d1050 50%,#0a0510 100%)", iconColor: "#e879f9", badgeBg: "#E879F9", badgeColor: "#3B0764", badgeBorder: "#E879F9" },
  "historical": { gradient: "linear-gradient(160deg,#1a1400 0%,#3a2e00 50%,#0f0c00 100%)", iconColor: "#FDE68A", badgeBg: "#FBB040", badgeColor: "#431407", badgeBorder: "#FBB040" },
  "poetry":     { gradient: "linear-gradient(160deg,#001a0e 0%,#003d20 50%,#000f08 100%)", iconColor: "#6ee7b7", badgeBg: "#4ADE80", badgeColor: "#052E16", badgeBorder: "#4ADE80" },
};

export const DEFAULT_GENRE_STYLE: GenreStyle = {
  gradient: "linear-gradient(160deg,#1a0a40 0%,#2d1b69 50%,#1a1035 100%)",
  iconColor: "#c4b5fd",
  badgeBg: "#A78BFA",
  badgeColor: "#2E1065",
  badgeBorder: "#A78BFA",
};

export const STATUS_STYLES: Record<string, StatusStyle> = {
  "completed": { badgeBg: "#14532d", badgeColor: "#86efac", badgeBorder: "#166534" },
  "ongoing":   { badgeBg: "#78350f", badgeColor: "#fde68a", badgeBorder: "#92400e" },
  "upcoming":  { badgeBg: "#1e3a5f", badgeColor: "#93c5fd", badgeBorder: "#1e40af" },
  "hiatus":    { badgeBg: "#1f2937", badgeColor: "#9ca3af", badgeBorder: "#374151" },
};

export const DEFAULT_STATUS_STYLE: StatusStyle = {
  badgeBg: "#1f2937",
  badgeColor: "#9ca3af",
  badgeBorder: "#374151",
};
