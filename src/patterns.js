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
      : []
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

  // Allow empty filter selection to show guidance message
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
    state.activeFilters = new Set([]);
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

function renderGuidanceMessage(container) {
  const guidance = document.createElement("div");
  guidance.className = "pattern-guidance";
  guidance.innerHTML = `
    <div class="guidance-header">
      <h3>🎯 如何使用設計模式牆</h3>
      <p>選擇一個或多個篩選條件，探索 AI 設計模式的不同面向與組合應用。</p>
    </div>

    <div class="guidance-section">
      <h4>💡 建議組合範例</h4>
      <div class="guidance-examples">
        <div class="guidance-example">
          <strong>暗黑模式 + 治理器</strong>
          <p>了解如何識別與防範 AI 系統中的操縱性設計，並建立治理機制。</p>
          <button class="tertiary-btn" onclick="window.applyFilterCombo(['dark-patterns', 'governors'])">套用此組合</button>
        </div>
        
        <div class="guidance-example">
          <strong>提示動作 + 調整器</strong>
          <p>探索使用者可如何與 AI 互動，以及如何調整 AI 的行為與輸出。</p>
          <button class="tertiary-btn" onclick="window.applyFilterCombo(['prompt-actions', 'tuners'])">套用此組合</button>
        </div>

        <div class="guidance-example">
          <strong>引導器 + 信任建立</strong>
          <p>設計有效的使用者引導流程，同時建立透明度與信任感。</p>
          <button class="tertiary-btn" onclick="window.applyFilterCombo(['wayfinders', 'trust-builders'])">套用此組合</button>
        </div>
      </div>
    </div>

    <div class="guidance-section">
      <h4>📚 深入案例研究</h4>
      <p>查看結合多個模式的實際應用案例：</p>
      <ul class="guidance-case-list">
        <li>
          <strong>Temu 的暗黑模式與過度遊戲化</strong> - 
          結合 Scarcity、Social Proof、Nagging 等多種暗黑模式的綜合案例
          <a href="./case-study.html?id=temu-dark-patterns" class="guidance-link">閱讀完整案例</a>
        </li>
        <li>
          <strong>Claude 與 Perplexity 的人機協作功能</strong> - 
          展示 Governors 類別中 Citations、Stream of Thought、Verification 的應用
          <a href="./case-study.html?id=claude-perplexity-collaboration" class="guidance-link">閱讀完整案例</a>
        </li>
        <li>
          <strong>電商 AI 操作全覽</strong> - 
          涵蓋 Prompt Actions 中的多種互動模式組合
          <a href="./case-study.html?id=ecommerce-ai-operations" class="guidance-link">閱讀完整案例</a>
        </li>
        <li>
          <strong>AI 招聘助理系統</strong> - 
          Tuners 功能在實際場景中的應用與風險分析
          <a href="./case-study.html?id=ai-recruitment-assistant" class="guidance-link">閱讀完整案例</a>
        </li>
        <li>
          <strong>社交平台的信任建立機制</strong> - 
          Trust Builders 模式與潛在暗黑模式風險的平衡
          <a href="./case-study.html?id=social-trust-building" class="guidance-link">閱讀完整案例</a>
        </li>
      </ul>
    </div>

    <div class="guidance-footer">
      <p>💡 <strong>提示：</strong>您也可以在左側勾選任意組合的分類，或使用搜尋框尋找特定模式。</p>
      <p style="margin-top: 1rem;">
        <a href="./case-studies.html" class="guidance-link" style="font-size: 1.05rem; font-weight: 500;">
          📖 瀏覽所有深入案例研究 →
        </a>
      </p>
    </div>
  `;
  container.appendChild(guidance);
}

function renderPatternGrid() {
  const container = elements.patternGrid;
  if (!container) return;
  container.innerHTML = "";

  // Check if no filters are selected
  if (state.activeFilters.size === 0) {
    if (elements.patternSummary) {
      elements.patternSummary.textContent = "請選擇至少一個篩選條件";
    }
    renderGuidanceMessage(container);
    return;
  }

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
    // Navigate to pattern detail page
    window.location.href = `./pattern-detail.html?id=${encodeURIComponent(pattern.id)}`;
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

// Global function for filter combo buttons
window.applyFilterCombo = function(filterIds) {
  state.activeFilters.clear();
  filterIds.forEach(id => state.activeFilters.add(id));
  persistState();
  renderPatternFilters();
  renderPatternGrid();
  
  // Scroll to grid
  if (elements.patternGrid) {
    elements.patternGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
