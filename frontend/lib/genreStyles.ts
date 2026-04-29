export type GenreStyle = {
  gradient: string;
  iconColor: string;
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
};

export const GENRE_STYLES: Record<string, GenreStyle> = {
  "fantasy":    { gradient: "linear-gradient(160deg,#1a0a40 0%,#2d1b69 50%,#1a1035 100%)", iconColor: "#c4b5fd", badgeBg: "rgba(167,139,250,0.2)",  badgeColor: "#c4b5fd", badgeBorder: "rgba(167,139,250,0.3)"  },
  "scifi":      { gradient: "linear-gradient(160deg,#052830 0%,#0d4a5c 50%,#052030 100%)", iconColor: "#5eead4", badgeBg: "rgba(45,212,191,0.2)",   badgeColor: "#5eead4", badgeBorder: "rgba(45,212,191,0.3)"   },
  "steampunk":  { gradient: "linear-gradient(160deg,#052830 0%,#0d4a5c 50%,#052030 100%)", iconColor: "#5eead4", badgeBg: "rgba(45,212,191,0.2)",   badgeColor: "#5eead4", badgeBorder: "rgba(45,212,191,0.3)"   },
  "romance":    { gradient: "linear-gradient(160deg,#3a0a2a 0%,#6b1a50 50%,#2a0820 100%)", iconColor: "#f9a8d4", badgeBg: "rgba(244,114,182,0.2)",  badgeColor: "#f9a8d4", badgeBorder: "rgba(244,114,182,0.3)"  },
  "adventure":  { gradient: "linear-gradient(160deg,#2a1200 0%,#5c2800 50%,#1a0c00 100%)", iconColor: "#fb923c", badgeBg: "rgba(249,115,22,0.2)",   badgeColor: "#fb923c", badgeBorder: "rgba(249,115,22,0.3)"   },
  "action":     { gradient: "linear-gradient(160deg,#2a1200 0%,#5c2800 50%,#1a0c00 100%)", iconColor: "#fb923c", badgeBg: "rgba(249,115,22,0.2)",   badgeColor: "#fb923c", badgeBorder: "rgba(249,115,22,0.3)"   },
  "mystery":    { gradient: "linear-gradient(160deg,#0a1a2a 0%,#1a3a5c 50%,#081018 100%)", iconColor: "#7dd3fc", badgeBg: "rgba(56,189,248,0.2)",   badgeColor: "#7dd3fc", badgeBorder: "rgba(56,189,248,0.3)"   },
  "thriller":   { gradient: "linear-gradient(160deg,#1a0a0a 0%,#3d1010 50%,#0a0505 100%)", iconColor: "#fca5a5", badgeBg: "rgba(239,68,68,0.2)",    badgeColor: "#fca5a5", badgeBorder: "rgba(239,68,68,0.3)"    },
  "historical": { gradient: "linear-gradient(160deg,#0a1a2a 0%,#1a3a5c 50%,#081018 100%)", iconColor: "#7dd3fc", badgeBg: "rgba(56,189,248,0.2)",   badgeColor: "#7dd3fc", badgeBorder: "rgba(56,189,248,0.3)"   },
};

export const DEFAULT_GENRE_STYLE: GenreStyle = {
  gradient: "linear-gradient(160deg,#1a0a40 0%,#2d1b69 50%,#1a1035 100%)",
  iconColor: "#c4b5fd",
  badgeBg: "rgba(167,139,250,0.2)",
  badgeColor: "#c4b5fd",
  badgeBorder: "rgba(167,139,250,0.3)",
};
