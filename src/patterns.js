import { patternFilters, patternCatalog } from "./data/cases.js";
import {
  loadThemePreference,
  loadCaseLibraryState,
  saveCaseLibraryState,
  loadAdminLibrary,
  STORAGE_KEYS,
} from "./storage.js";
import { applyTheme, resolveThemeId } from "./theme.js";

const ALL_FILTER_IDS = patternFilters.map((filter) => filter.id);

const storedState = loadCaseLibraryState() || {};
const adminLibraryState = loadAdminLibrary();

const state = {
  theme: resolveThemeId(loadThemePreference()),
  activeFilters: new Set(
    Array.isArray(storedState.filters) && storedState.filters.length
      ? storedState.filters
      : ALL_FILTER_IDS
  ),
  searchTerm: typeof storedState.search === "string" ? storedState.search : "",
  customPatterns: sanitizeCustomPatterns(adminLibraryState.patterns),
  patternOverrides: buildPatternOverrides(adminLibraryState.patterns),
};

applyTheme(state.theme);

const filterLabelMap = patternFilters.reduce((acc, filter) => {
  acc[filter.id] = filter.label;
  return acc;
}, {});

function sanitizeCustomPatterns(entries) {
  if (!Array.isArray(entries)) return [];
  return entries
    .filter((entry) => entry && entry.source !== "override")
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const id = typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : null;
      const title = typeof entry.title === "string" ? entry.title.trim() : "";
      if (!id || !title) return null;
      return {
        id,
        title,
        summary: typeof entry.summary === "string" ? entry.summary.trim() : "",
        subtitle: typeof entry.subtitle === "string" ? entry.subtitle.trim() : "",
        filters: Array.isArray(entry.filters)
          ? entry.filters
              .map((filterId) => (typeof filterId === "string" ? filterId.trim() : ""))
              .filter(Boolean)
          : [],
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : null,
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : null,
        source: "custom",
      };
    })
    .filter(Boolean);
}

function buildPatternOverrides(entries) {
  const map = new Map();
  if (!Array.isArray(entries)) {
    return map;
  }
  entries.forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    if (entry.source !== "override") return;
    const id = typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : null;
    if (!id) return;
    map.set(id, { ...entry });
  });
  return map;
}

const elements = {
  filterList: document.querySelector("#pattern-filter-list"),
  patternGrid: document.querySelector("#pattern-grid"),
  patternSummary: document.querySelector("#pattern-summary"),
  searchInput: document.querySelector("#pattern-search"),
  resetFilters: document.querySelector("#pattern-reset"),
  liveRegion: document.querySelector("#pattern-live-region"),
};

function init() {
  renderPatternFilters();
  renderPatternGrid();
  hydrateSearch();
  bindReset();
}

function persistState() {
  const current = loadCaseLibraryState() || {};
  saveCaseLibraryState({
    ...current,
    filters: Array.from(state.activeFilters),
    search: state.searchTerm,
  });
}

function renderPatternFilters() {
  const container = elements.filterList;
  if (!container) return;
  container.innerHTML = "";

  patternFilters.forEach((filter) => {
    const id = `pattern-filter-${filter.id}`;
    const wrapper = document.createElement("div");
    wrapper.className = "pattern-filter-item";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.name = filter.id;
    input.checked = state.activeFilters.has(filter.id);
    input.addEventListener("change", () => toggleFilter(filter.id, input.checked));

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = filter.label;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

function toggleFilter(filterId, isChecked) {
  if (isChecked) {
    state.activeFilters.add(filterId);
  } else {
    state.activeFilters.delete(filterId);
  }

  if (state.activeFilters.size === 0) {
    ALL_FILTER_IDS.forEach((id) => state.activeFilters.add(id));
  }

  persistState();
  renderPatternGrid();
}

function hydrateSearch() {
  if (!elements.searchInput) return;
  elements.searchInput.value = state.searchTerm;
  elements.searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    persistState();
    renderPatternGrid();
  });
}

function bindReset() {
  if (!elements.resetFilters) return;
  elements.resetFilters.addEventListener("click", (event) => {
    event.preventDefault();
    state.activeFilters = new Set(ALL_FILTER_IDS);
    state.searchTerm = "";
    if (elements.searchInput) {
      elements.searchInput.value = "";
    }
    persistState();
    renderPatternFilters();
    renderPatternGrid();
  });
}

function getPatternCatalogWithOverrides() {
  return patternCatalog.map((pattern) => {
    const override = state.patternOverrides.get(pattern.id);
    if (!override) {
      return pattern;
    }
    const filters = Array.isArray(override.filters) && override.filters.length
      ? override.filters
      : pattern.filters;
    return {
      ...pattern,
      title: override.title && override.title.trim() ? override.title.trim() : pattern.title,
      summary: override.summary && override.summary.trim() ? override.summary.trim() : pattern.summary,
      subtitle: override.subtitle && override.subtitle.trim() ? override.subtitle.trim() : pattern.subtitle,
      filters,
      isOverride: true,
      overrideMeta: {
        updatedAt: override.updatedAt || null,
        createdAt: override.createdAt || null,
      },
    };
  });
}

function getAllPatterns() {
  const basePatterns = getPatternCatalogWithOverrides();
  const customPatterns = state.customPatterns.map((pattern) => ({ ...pattern, isCustom: true }));
  return [...basePatterns, ...customPatterns];
}

function getFilteredPatterns() {
  const search = state.searchTerm.trim().toLowerCase();
  return getAllPatterns().filter((pattern) => {
    const validFilters = Array.isArray(pattern.filters) ? pattern.filters : [];
    const matchesFilter = validFilters.some((filterId) => state.activeFilters.has(filterId));
    const text = `${pattern.title} ${pattern.subtitle ?? ""} ${pattern.summary ?? ""}`.toLowerCase();
    const matchesSearch = !search || text.includes(search);
    return matchesFilter && matchesSearch;
  });
}

function renderPatternGrid() {
  const container = elements.patternGrid;
  if (!container) return;
  container.innerHTML = "";

  const results = getFilteredPatterns();

  if (elements.patternSummary) {
    const filtersSelected = state.activeFilters.size;
    const summaryText = `${results.length} 個模式 · 篩選條件 ${filtersSelected}/${ALL_FILTER_IDS.length}`;
    elements.patternSummary.textContent = summaryText;
  }

  if (results.length === 0) {
    const empty = document.createElement("p");
    empty.className = "status-text info";
    empty.textContent = "沒有符合的模式，請調整篩選條件或關鍵字。";
    container.appendChild(empty);
    return;
  }

  results.forEach((pattern) => {
    const card = document.createElement("article");
    card.className = "pattern-card";
    card.setAttribute("role", "listitem");
    if (pattern.isCustom) {
      card.classList.add("custom-pattern-card");
      const badge = document.createElement("span");
      badge.className = "pattern-custom-badge";
      badge.textContent = "管理者新增";
      card.appendChild(badge);
    } else if (pattern.isOverride) {
      card.classList.add("override-pattern-card");
      const badge = document.createElement("span");
      badge.className = "pattern-override-badge";
      badge.textContent = "管理者覆寫";
      card.appendChild(badge);
    }

    const title = document.createElement("h4");
    title.textContent = pattern.title;
    card.appendChild(title);

    if (pattern.subtitle) {
      const subtitle = document.createElement("p");
      subtitle.className = "pattern-subtitle";
      subtitle.textContent = pattern.subtitle;
      card.appendChild(subtitle);
    }

    const body = document.createElement("p");
    body.className = "pattern-summary";
    body.textContent = pattern.summary ?? "";
    card.appendChild(body);

    if (pattern.filters?.length) {
      const tagList = document.createElement("ul");
      tagList.className = "pattern-tag-list";
      pattern.filters.forEach((filterId) => {
        const li = document.createElement("li");
        li.textContent = filterLabelMap[filterId] || filterId;
        tagList.appendChild(li);
      });
      card.appendChild(tagList);
    }

    const actionBar = document.createElement("div");
    actionBar.className = "pattern-actions";

    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.className = "tertiary-btn";
    viewBtn.textContent = "查看指引";
    viewBtn.addEventListener("click", () => handlePatternAction(pattern, "view"));

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "tertiary-btn";
    copyBtn.textContent = "複製摘要";
    copyBtn.addEventListener("click", () => handlePatternAction(pattern, "copy"));

    actionBar.appendChild(viewBtn);
    actionBar.appendChild(copyBtn);
    card.appendChild(actionBar);

    container.appendChild(card);
  });
}

function handlePatternAction(pattern, action) {
  if (action === "copy") {
    const text = `${pattern.title} — ${pattern.summary}`;
    navigator.clipboard?.writeText?.(text);
    announce(`已複製「${pattern.title}」摘要。`);
  } else if (action === "view") {
    announce(`模式「${pattern.title}」主要用途：${pattern.summary}`);
  }
}

function announce(message) {
  if (!elements.liveRegion) return;
  elements.liveRegion.textContent = "";
  window.setTimeout(() => {
    if (!elements.liveRegion) return;
    elements.liveRegion.textContent = message;
  }, 50);
}

window.addEventListener("storage", (event) => {
  if (!event.key) return;
  if (event.key === STORAGE_KEYS.theme) {
    state.theme = resolveThemeId(loadThemePreference());
    applyTheme(state.theme);
  } else if (event.key === STORAGE_KEYS.caseLibrary) {
    const updated = loadCaseLibraryState();
    if (!updated) return;
    if (Array.isArray(updated.filters)) {
      state.activeFilters = new Set(
        updated.filters.length ? updated.filters : ALL_FILTER_IDS
      );
      renderPatternFilters();
      renderPatternGrid();
    }
    if (typeof updated.search === "string" && updated.search !== state.searchTerm) {
      state.searchTerm = updated.search;
      if (elements.searchInput) {
        elements.searchInput.value = state.searchTerm;
      }
      renderPatternGrid();
    }
  } else if (event.key === STORAGE_KEYS.adminLibrary) {
    const updatedAdmin = loadAdminLibrary();
    state.customPatterns = sanitizeCustomPatterns(updatedAdmin.patterns);
    state.patternOverrides = buildPatternOverrides(updatedAdmin.patterns);
    renderPatternGrid();
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
