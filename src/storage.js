const STORAGE_KEY = "ai-course-progress-v1";
const TEACHER_STATE_KEY = "ai-course-teacher-state-v1";
const UNIT_ACCESS_KEY = "ai-course-unit-access-v1";
const BUTTON_CONFIG_KEY = "ai-course-button-config-v1";

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

export function loadTeacherState() {
  try {
    const raw = window.localStorage.getItem(TEACHER_STATE_KEY);
    if (!raw) {
      return { enabled: false, notes: {} };
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return { enabled: false, notes: {} };
    }
    return {
      enabled: Boolean(parsed.enabled),
      notes: parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {},
    };
  } catch (err) {
    console.warn("無法載入教師狀態：", err);
    return { enabled: false, notes: {} };
  }
}

export function saveTeacherState(state) {
  try {
    const safe = JSON.stringify(state);
    window.localStorage.setItem(TEACHER_STATE_KEY, safe);
  } catch (err) {
    console.warn("無法儲存教師狀態：", err);
  }
}

export function setTeacherMode(enabled) {
  const current = loadTeacherState();
  const updated = { ...current, enabled: Boolean(enabled) };
  saveTeacherState(updated);
  return updated;
}

export function updateTeacherNote(unitId, questionId, referenceNote) {
  const current = loadTeacherState();
  const unitNotes = current.notes?.[unitId] || {};
  const updatedNotes = {
    ...current.notes,
    [unitId]: {
      ...unitNotes,
      [questionId]: {
        referenceNote,
        updatedAt: new Date().toISOString(),
      },
    },
  };
  const updated = { ...current, notes: updatedNotes };
  saveTeacherState(updated);
  return updated;
}

export function removeTeacherNote(unitId, questionId) {
  const current = loadTeacherState();
  const unitNotes = { ...(current.notes?.[unitId] || {}) };
  if (unitNotes[questionId]) {
    delete unitNotes[questionId];
  }
  const updatedNotes = { ...current.notes };
  if (Object.keys(unitNotes).length === 0) {
    delete updatedNotes[unitId];
  } else {
    updatedNotes[unitId] = unitNotes;
  }
  const updated = { ...current, notes: updatedNotes };
  saveTeacherState(updated);
  return updated;
}

export function getTeacherNote(unitId, questionId) {
  const current = loadTeacherState();
  const note = current.notes?.[unitId]?.[questionId];
  return note?.referenceNote || "";
}

function sanitizeButtonData(input) {
  if (!input || typeof input !== "object") return null;
  const label = typeof input.label === "string" ? input.label.trim() : "";
  const url = typeof input.url === "string" ? input.url.trim() : "";
  if (!label && !url) return null;
  return { label, url };
}

function normalizeButtonConfig(raw) {
  const safe = { globals: {}, units: {} };
  if (!raw || typeof raw !== "object") {
    return safe;
  }

  const globals = raw.globals && typeof raw.globals === "object" ? raw.globals : {};
  Object.entries(globals).forEach(([key, value]) => {
    const sanitized = sanitizeButtonData(value);
    if (sanitized) {
      safe.globals[key] = sanitized;
    }
  });

  const units = raw.units && typeof raw.units === "object" ? raw.units : {};
  Object.entries(units).forEach(([unitId, config]) => {
    if (!config || typeof config !== "object") return;
    const cleaned = {};
    Object.entries(config).forEach(([buttonKey, value]) => {
      const sanitized = sanitizeButtonData(value);
      if (sanitized) {
        cleaned[buttonKey] = sanitized;
      }
    });
    if (Object.keys(cleaned).length > 0) {
      safe.units[unitId] = cleaned;
    }
  });

  return safe;
}

function persistButtonConfig(config) {
  const normalized = normalizeButtonConfig(config);
  try {
    window.localStorage.setItem(BUTTON_CONFIG_KEY, JSON.stringify(normalized));
  } catch (err) {
    console.warn("無法儲存按鈕設定：", err);
  }
  return normalized;
}

export function loadButtonConfig() {
  try {
    const raw = window.localStorage.getItem(BUTTON_CONFIG_KEY);
    if (!raw) return { globals: {}, units: {} };
    const parsed = JSON.parse(raw);
    return normalizeButtonConfig(parsed);
  } catch (err) {
    console.warn("無法載入按鈕設定：", err);
    return { globals: {}, units: {} };
  }
}

export function saveButtonConfig(config) {
  return persistButtonConfig(config);
}

export function setGlobalButtonConfig(buttonKey, config) {
  const current = loadButtonConfig();
  const next = { ...current, globals: { ...current.globals } };
  const sanitized = sanitizeButtonData(config);
  if (!sanitized) {
    delete next.globals[buttonKey];
  } else {
    next.globals[buttonKey] = sanitized;
  }
  return persistButtonConfig(next);
}

export function setUnitButtonConfig(unitId, buttonKey, config) {
  const current = loadButtonConfig();
  const next = {
    ...current,
    units: {
      ...current.units,
      [unitId]: { ...(current.units?.[unitId] || {}) },
    },
  };
  const sanitized = sanitizeButtonData(config);
  if (!sanitized) {
    delete next.units[unitId][buttonKey];
    if (Object.keys(next.units[unitId]).length === 0) {
      delete next.units[unitId];
    }
  } else {
    next.units[unitId][buttonKey] = sanitized;
  }
  return persistButtonConfig(next);
}

export function loadUnitAccess() {
  try {
    const raw = window.localStorage.getItem(UNIT_ACCESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    console.warn("無法載入單元解鎖狀態：", err);
    return {};
  }
}

export function saveUnitAccess(access) {
  try {
    window.localStorage.setItem(UNIT_ACCESS_KEY, JSON.stringify(access));
  } catch (err) {
    console.warn("無法儲存單元解鎖狀態：", err);
  }
}

export function markUnitUnlocked(unitId) {
  const current = loadUnitAccess();
  if (current[unitId]) return current;
  const updated = { ...current, [unitId]: true };
  saveUnitAccess(updated);
  return updated;
}

export const STORAGE_KEYS = {
  progress: STORAGE_KEY,
  teacherState: TEACHER_STATE_KEY,
  unitAccess: UNIT_ACCESS_KEY,
  buttonConfig: BUTTON_CONFIG_KEY,
};
