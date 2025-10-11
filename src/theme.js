export const THEMES = [
  {
    id: "nebula",
    label: "極光湛藍",
    description: "深藍與霧光強調科技與專業，維持既有視覺調性。",
    preview: {
      accent: "#38bdf8",
      surface: "rgba(15, 23, 42, 0.72)",
      background: "#020617",
      text: "#f8fafc",
    },
  },
  {
    id: "sunrise",
    label: "暮光琥珀",
    description: "暖色漸層與亮橘行動色，營造充滿活力的學習氛圍。",
    preview: {
      accent: "#f97316",
      surface: "rgba(93, 35, 63, 0.88)",
      background: "#1f0f23",
      text: "#fff7ed",
    },
  },
  {
    id: "forest",
    label: "森霧翠綠",
    description: "沉穩深綠搭配薄荷行動色，凸顯信任與韌性的打造。",
    preview: {
      accent: "#34d399",
      surface: "rgba(21, 64, 40, 0.9)",
      background: "#03170c",
      text: "#ecfdf5",
    },
  },
];

export const DEFAULT_THEME_ID = THEMES[0].id;

export function isValidTheme(themeId) {
  return THEMES.some((theme) => theme.id === themeId);
}

export function resolveThemeId(themeId) {
  return isValidTheme(themeId) ? themeId : DEFAULT_THEME_ID;
}

export function applyTheme(themeId) {
  const resolved = resolveThemeId(themeId);
  if (typeof document !== "undefined" && document.body) {
    document.body.setAttribute("data-theme", resolved);
  }
  return resolved;
}

export function getThemeMeta(themeId) {
  return THEMES.find((theme) => theme.id === themeId) || THEMES[0];
}
