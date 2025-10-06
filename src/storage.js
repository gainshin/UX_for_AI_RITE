const STORAGE_KEY = "ai-course-progress-v1";

export function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    console.warn("無法載入學習記錄：", err);
    return {};
  }
}

export function saveProgress(progress) {
  try {
    const safe = JSON.stringify(progress);
    window.localStorage.setItem(STORAGE_KEY, safe);
  } catch (err) {
    console.warn("無法儲存學習記錄：", err);
  }
}

export function updateUnitProgress(unitId, partial) {
  const current = loadProgress();
  const unitRecord = current[unitId] || { attempts: 0 };
  const updated = {
    ...current,
    [unitId]: {
      ...unitRecord,
      ...partial,
    },
  };
  saveProgress(updated);
  return updated;
}
