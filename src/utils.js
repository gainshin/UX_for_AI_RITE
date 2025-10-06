export function formatDateTime(isoString) {
  if (!isoString) return "--";
  const dt = new Date(isoString);
  if (Number.isNaN(dt.getTime())) return "--";
  return dt.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toPercentage(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function shuffle(array) {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}
