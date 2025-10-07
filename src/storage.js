const STORAGE_KEY = "ai-course-progress-v1";
const TEACHER_STATE_KEY = "ai-course-teacher-state-v1";
const UNIT_ACCESS_KEY = "ai-course-unit-access-v1";

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
