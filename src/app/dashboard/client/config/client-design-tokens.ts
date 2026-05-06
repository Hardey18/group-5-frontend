// client-design-tokens.ts
// Shared design system tokens for the Client Dashboard
// Consistent with ChatSection's deep-space teal-indigo aesthetic

export const D = {
  bg:         "#fff",
  surface:    "#cde3c14c",
  surfaceAlt: "#fff",
  border:     "#1A3050",
  borderLight:"#1E3A5F",

  // Primary accents
  teal:   "#00C9B1",
  indigo: "#818CF8",
  sky:    "#38BDF8",

  // Semantic
  green: "#4ADE80",
  rose:  "#FB7185",
  amber: "#FB923C",
  gold:  "#F5C842",

  // Text
  text:      "#050A14",
  textMuted: "#5B8A8A",
  textFaint: "#2A4A4A",
} as const;
