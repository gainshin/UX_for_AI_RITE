const STORAGE_KEY = "ai-course-progress-v1";
const TEACHER_STATE_KEY = "ai-course-teacher-state-v1";
const UNIT_ACCESS_KEY = "ai-course-unit-access-v1";
const BUTTON_CONFIG_KEY = "ai-course-button-config-v1";
const THEME_KEY = "ai-course-theme-v1";
const CASE_LIBRARY_KEY = "ai-course-case-library-state-v1";
const ADMIN_LIBRARY_KEY = "ai-course-admin-library-v1";

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

export function loadThemePreference() {
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (!stored) return null;
    return typeof stored === "string" ? stored : null;
  } catch (err) {
    console.warn("無法載入主題設定：", err);
    return null;
  }
}

export function saveThemePreference(themeId) {
  try {
    if (!themeId) {
      window.localStorage.removeItem(THEME_KEY);
      return null;
    }
    window.localStorage.setItem(THEME_KEY, themeId);
    return themeId;
  } catch (err) {
    console.warn("無法儲存主題設定：", err);
    return null;
  }
}

export function loadCaseLibraryState() {
  try {
    const raw = window.localStorage.getItem(CASE_LIBRARY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (err) {
    console.warn("無法載入案例庫狀態：", err);
    return null;
  }
}

export function saveCaseLibraryState(state) {
  try {
    if (!state || typeof state !== "object") {
      window.localStorage.removeItem(CASE_LIBRARY_KEY);
      return null;
    }
    const payload = JSON.stringify(state);
    window.localStorage.setItem(CASE_LIBRARY_KEY, payload);
    return state;
  } catch (err) {
    console.warn("無法儲存案例庫狀態：", err);
    return null;
  }
}

function sanitizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => {
      if (!item || seen.has(item)) return false;
      seen.add(item);
      return true;
    });
}

function sanitizeResourceEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const label = typeof entry.label === "string" ? entry.label.trim() : "";
  const href = typeof entry.href === "string" ? entry.href.trim() : "";
  const fallbackUrl = typeof entry.url === "string" ? entry.url.trim() : "";
  const finalHref = href || fallbackUrl;
  if (!label && !finalHref) return null;
  const description = typeof entry.description === "string" ? entry.description.trim() : "";
  return {
    label: label || finalHref,
    href: finalHref,
    description,
  };
}

function sanitizeMethodEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const id = typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : null;
  const title = typeof entry.title === "string" ? entry.title.trim() : "";
  if (!id || !title) return null;
  const source = entry.source === "override" ? "override" : "custom";
  return {
    id,
    title,
    chapter: typeof entry.chapter === "string" ? entry.chapter.trim() : "",
    summary: typeof entry.summary === "string" ? entry.summary.trim() : "",
    lead: typeof entry.lead === "string" ? entry.lead.trim() : "",
    notes: typeof entry.notes === "string" ? entry.notes.trim() : "",
    tags: sanitizeStringArray(entry.tags),
    resources: Array.isArray(entry.resources)
      ? entry.resources.map(sanitizeResourceEntry).filter(Boolean)
      : [],
    createdAt: typeof entry.createdAt === "string" ? entry.createdAt : null,
    updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : null,
    source,
  };
}

function sanitizePatternEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const id = typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : null;
  const title = typeof entry.title === "string" ? entry.title.trim() : "";
  if (!id || !title) return null;
  const source = entry.source === "override" ? "override" : "custom";
  return {
    id,
    title,
    summary: typeof entry.summary === "string" ? entry.summary.trim() : "",
    subtitle: typeof entry.subtitle === "string" ? entry.subtitle.trim() : "",
    filters: sanitizeStringArray(entry.filters),
    createdAt: typeof entry.createdAt === "string" ? entry.createdAt : null,
    updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : null,
    source,
  };
}

function sanitizeToolEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const id = typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : null;
  const title = typeof entry.title === "string" ? entry.title.trim() : "";
  if (!id || !title) return null;
  const summary = typeof entry.summary === "string" ? entry.summary.trim() : "";
  const screenshotUrl = typeof entry.screenshotUrl === "string" ? entry.screenshotUrl.trim() : "";
  const websiteUrl = typeof entry.websiteUrl === "string" ? entry.websiteUrl.trim() : "";
  const learnMoreUrl = typeof entry.learnMoreUrl === "string" ? entry.learnMoreUrl.trim() : "";
  const source = entry.source === "override" ? "override" : "custom";
  return {
    id,
    title,
    summary,
    description: typeof entry.description === "string" ? entry.description.trim() : "",
    categories: sanitizeStringArray(entry.categories),
    highlights: sanitizeStringArray(entry.highlights),
    screenshotUrl,
    websiteUrl,
    learnMoreUrl,
    createdAt: typeof entry.createdAt === "string" ? entry.createdAt : null,
    updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : null,
    source,
  };
}

function normalizeAdminLibrary(input) {
  if (!input || typeof input !== "object") {
    return { methods: [], patterns: [], tools: [] };
  }
  return {
    methods: Array.isArray(input.methods)
      ? input.methods.map(sanitizeMethodEntry).filter(Boolean)
      : [],
    patterns: Array.isArray(input.patterns)
      ? input.patterns.map(sanitizePatternEntry).filter(Boolean)
      : [],
    tools: Array.isArray(input.tools)
      ? input.tools.map(sanitizeToolEntry).filter(Boolean)
      : [],
  };
}

export function loadAdminLibrary() {
  try {
    const raw = window.localStorage.getItem(ADMIN_LIBRARY_KEY);
    if (!raw) {
      return { methods: [], patterns: [], tools: [] };
    }
    const parsed = JSON.parse(raw);
    return normalizeAdminLibrary(parsed);
  } catch (err) {
    console.warn("無法載入管理資源庫：", err);
    return { methods: [], patterns: [], tools: [] };
  }
}

export function saveAdminLibrary(library) {
  const normalized = normalizeAdminLibrary(library);
  try {
    window.localStorage.setItem(ADMIN_LIBRARY_KEY, JSON.stringify(normalized));
  } catch (err) {
    console.warn("無法儲存管理資源庫：", err);
  }
  return normalized;
}

export const STORAGE_KEYS = {
  progress: STORAGE_KEY,
  teacherState: TEACHER_STATE_KEY,
  unitAccess: UNIT_ACCESS_KEY,
  buttonConfig: BUTTON_CONFIG_KEY,
  theme: THEME_KEY,
  caseLibrary: CASE_LIBRARY_KEY,
  adminLibrary: ADMIN_LIBRARY_KEY,
};
