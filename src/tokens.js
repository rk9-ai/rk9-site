// Design tokens: palettes, font pairs, scales.
// All exposed as CSS custom properties via applyTokens().

export const PALETTES = {
  ink: {
    name: { fi: "Muste", en: "Ink" },
    bg: "#f4f2ec",       // warm paper
    surface: "#ebe8df",  // slightly deeper paper
    ink: "#14130f",      // near-black
    inkSoft: "#3a372f",
    subtle: "#75705f",
    rule: "#d8d3c4",
    accent: "#1d3a6a",   // deep Finnish blue
    accentInk: "#f4f2ec",
    ok: "#2a6f4a",
    warn: "#a85a1a",
  },
  slate: {
    name: { fi: "Liuske", en: "Slate" },
    bg: "#0b0b0e",
    surface: "#14141a",
    ink: "#ededf0",
    inkSoft: "#c7c7cc",
    subtle: "#7b7b85",
    rule: "#23232b",
    accent: "#a5c4ff",
    accentInk: "#0b0b0e",
    ok: "#9fd3a6",
    warn: "#f0b97c",
  },
  pine: {
    name: { fi: "Petäjä", en: "Pine" },
    bg: "#ecead9",
    surface: "#e0deca",
    ink: "#181f1a",
    inkSoft: "#34403a",
    subtle: "#5d6b62",
    rule: "#c5c3ad",
    accent: "#2d5f4f",
    accentInk: "#ecead9",
    ok: "#2d5f4f",
    warn: "#a85a1a",
  },
};

export const FONT_PAIRS = {
  editorial: {
    name: { fi: "Editoriaali", en: "Editorial" },
    display: '"Instrument Serif", "Source Serif 4", Georgia, serif',
    body: '"Geist", ui-sans-serif, system-ui, sans-serif',
    mono: '"Geist Mono", ui-monospace, "JetBrains Mono", monospace',
    googleImport: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
    displayWeight: 400,
    displayLetterSpacing: "-0.01em",
    bodyLetterSpacing: "-0.005em",
  },
  technical: {
    name: { fi: "Tekninen", en: "Technical" },
    display: '"Geist", ui-sans-serif, system-ui, sans-serif',
    body: '"Geist", ui-sans-serif, system-ui, sans-serif',
    mono: '"Geist Mono", ui-monospace, monospace',
    googleImport: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
    displayWeight: 500,
    displayLetterSpacing: "-0.035em",
    bodyLetterSpacing: "-0.005em",
  },
  academic: {
    name: { fi: "Akateeminen", en: "Academic" },
    display: '"Source Serif 4", "Newsreader", Georgia, serif',
    body: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
    googleImport: "https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500;8..60,600&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
    displayWeight: 400,
    displayLetterSpacing: "-0.015em",
    bodyLetterSpacing: "0",
  },
};

export function applyTokens(palKey, fontKey) {
  const p = PALETTES[palKey] || PALETTES.ink;
  const f = FONT_PAIRS[fontKey] || FONT_PAIRS.editorial;
  const root = document.documentElement;
  root.style.setProperty("--bg", p.bg);
  root.style.setProperty("--surface", p.surface);
  root.style.setProperty("--ink", p.ink);
  root.style.setProperty("--ink-soft", p.inkSoft);
  root.style.setProperty("--subtle", p.subtle);
  root.style.setProperty("--rule", p.rule);
  root.style.setProperty("--accent", p.accent);
  root.style.setProperty("--accent-ink", p.accentInk);
  root.style.setProperty("--ok", p.ok);
  root.style.setProperty("--warn", p.warn);
  root.style.setProperty("--font-display", f.display);
  root.style.setProperty("--font-body", f.body);
  root.style.setProperty("--font-mono", f.mono);
  root.style.setProperty("--display-weight", f.displayWeight);
  root.style.setProperty("--display-tracking", f.displayLetterSpacing);
  root.style.setProperty("--body-tracking", f.bodyLetterSpacing);
  // dark mode detection for slate
  root.dataset.theme = palKey === "slate" ? "dark" : "light";

  // Inject Google Fonts import (one link tag, swapped)
  let link = document.getElementById("__rk9_fonts");
  if (!link) {
    link = document.createElement("link");
    link.id = "__rk9_fonts";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  if (link.href !== f.googleImport) link.href = f.googleImport;
}
