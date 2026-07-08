export type PriceMode = "NORMAL" | "TOURNAMENT";

export const THEME_MODE = {
  NORMAL: {
    label: "Normal",
    accent: "#3B82F6",
  },
  TOURNAMENT: {
    label: "Tournament",
    accent: "#D4AF37",
  },
} as const;