// mtn-tokens.ts
// MTN Nigeria brand design system — light mode, presentation-grade
// Single source of truth for ALL components across the project

export const M = {
  // ── Core brand ──────────────────────────────────────────────────────────
  yellow:      "#FFCC00",
  yellowDark:  "#E6B800",
  yellowDeep:  "#CC9900",
  yellowLight: "#FFF5B8",
  yellowMid:   "#FFF0A0",
  yellowDim:   "#FFFAE6",

  black:       "#1A1A1A",
  gold:        "#1A1A1A",
  goldDim:     "#2C2C2C",
  blackSoft:   "#2C2C2C",
  blackMid:    "#3D3D3D",

  // ── Backgrounds ─────────────────────────────────────────────────────────
  bg:          "#FAFAF8",       // warm white, not cold
  surface:     "#FFFFFF",
  surfaceAlt:  "#F5F4F0",
  surfaceWarm: "#FFF9E6",       // yellow-tinted surface

  // ── Borders ─────────────────────────────────────────────────────────────
  border:      "#E8E6DF",
  borderMid:   "#D4D0C4",
  borderDark:  "#BFBB9E",
  borderYellow:"#FFCC0060",
  borderLight: "#254275",

  // ── Text ────────────────────────────────────────────────────────────────
  text:        "#1A1A1A",
  textSoft:    "#3D3D3D",
  textMuted:   "#6B6757",
  textFaint:   "#A89F8A",
  textOnYellow:"#1A1A1A",       // text on yellow backgrounds

  // ── Semantic colours (presentation-legible on white) ────────────────────
  success:     "#16A34A",
  successLight:"#DCFCE7",
  successBorder:"#86EFAC",

  danger:      "#DC2626",
  dangerLight: "#FEE2E2",
  dangerBorder:"#FCA5A5",

  warning:     "#D97706",
  warningLight:"#FEF3C7",
  warningBorder:"#FCD34D",

  info:        "#0369A1",
  infoLight:   "#E0F2FE",
  infoBorder:  "#7DD3FC",

  purple:      "#7C3AED",
  purpleLight: "#EDE9FE",
  purpleBorder:"#C4B5FD",

  rose: "#FB7185",
  amber: "#FB923C",
  sky: "#38BDF8",
  green: "#4ADE80",
  teal: "#2DD4BF",

  // ── Shadows (yellow-tinted for brand warmth) ────────────────────────────
  shadow:      "0 1px 3px rgba(26,26,26,0.08), 0 1px 2px rgba(26,26,26,0.06)",
  shadowMd:    "0 4px 12px rgba(26,26,26,0.10), 0 2px 4px rgba(26,26,26,0.06)",
  shadowLg:    "0 12px 32px rgba(26,26,26,0.12), 0 4px 8px rgba(26,26,26,0.06)",
  shadowYellow:"0 8px 24px rgba(255,204,0,0.30)",
} as const;
