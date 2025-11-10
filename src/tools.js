import {
  toolCategories,
  topCategoryIds,
  toolLibrary,
} from "./data/tools.js";
import {
  loadThemePreference,
  loadCaseLibraryState,
  saveCaseLibraryState,
  loadAdminLibrary,
  STORAGE_KEYS,
} from "./storage.js";
import { applyTheme, resolveThemeId } from "./theme.js";

const categoryLabelMap = toolCategories.reduce((acc, category) => {
  acc[category.id] = category;
  return acc;
}, {});

const FEATURED_HIGHLIGHT = "精選推薦";

function sanitizeCategory(categoryId) {
  return categoryId && categoryLabelMap[categoryId] ? categoryId : "all";
}

function sanitizeCustomTools(entries) {
  if (!Array.isArray(entries)) return [];
  return entries
    .filter((entry) => entry && entry.source !== "override")
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const id = typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : null;
      const title = typeof entry.title === "string" ? entry.title.trim() : "";
      if (!id || !title) return null;
      const summary = typeof entry.summary === "string" ? entry.summary.trim() : "";
      const screenshotUrl = typeof entry.screenshotUrl === "string" ? entry.screenshotUrl.trim() : "";
      const websiteUrl = typeof entry.websiteUrl === "string" ? entry.websiteUrl.trim() : "";
      const learnMoreUrl = typeof entry.learnMoreUrl === "string" ? entry.learnMoreUrl.trim() : "";
      return {
        id,
        title,
        summary,
        description: typeof entry.description === "string" ? entry.description.trim() : "",
        categories: Array.isArray(entry.categories)
          ? entry.categories
              .map((categoryId) => (typeof categoryId === "string" ? categoryId.trim() : ""))
              .filter(Boolean)
          : [],
        highlights: Array.isArray(entry.highlights)
          ? entry.highlights
              .map((highlight) => (typeof highlight === "string" ? highlight.trim() : ""))
              .filter(Boolean)
          : [],
        screenshotUrl,
        websiteUrl,
        learnMoreUrl,
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : null,
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : null,
        source: "custom",
      };
    })
    .filter(Boolean);
}

function buildToolOverrides(entries) {
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

function isFeaturedTool(tool) {
  return Array.isArray(tool && tool.highlights) && tool.highlights.includes(FEATURED_HIGHLIGHT);
}

const storedState = loadCaseLibraryState() || {};
const adminLibraryState = loadAdminLibrary();

const state = {
  theme: resolveThemeId(loadThemePreference()),
  activeCategory: sanitizeCategory(storedState.toolCategory),
  searchTerm: typeof storedState.toolSearch === "string" ? storedState.toolSearch : "",
  topOnly: Boolean(storedState.toolTopOnly),
  customTools: sanitizeCustomTools(adminLibraryState.tools),
  toolOverrides: buildToolOverrides(adminLibraryState.tools),
};

applyTheme(state.theme);

const elements = {
  quickFilters: document.querySelector("#tool-quick-filters"),
  filterList: document.querySelector("#tool-filter-list"),
  toolGrid: document.querySelector("#tool-grid"),
  summary: document.querySelector("#tool-summary"),
  searchInput: document.querySelector("#tool-search"),
  resetButton: document.querySelector("#tool-reset"),
  topToggle: document.querySelector("#tool-top-only"),
  liveRegion: document.querySelector("#tool-live-region"),
};

function init() {
  renderQuickFilters();
  renderFilterList();
  hydrateSearch();
  hydrateTopToggle();
  bindReset();
  renderToolGrid();
}

function persistState() {
  const current = loadCaseLibraryState() || {};
  saveCaseLibraryState({
    ...current,
    toolCategory: state.activeCategory,
    toolSearch: state.searchTerm,
    toolTopOnly: state.topOnly,
  });
}

function renderQuickFilters() {
  const container = elements.quickFilters;
  if (!container) return;
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const quickIds = ["all", ...topCategoryIds.filter((id) => categoryLabelMap[id])];

  quickIds.forEach((categoryId) => {
    const category = categoryLabelMap[categoryId];
    const label = category ? category.label : "全部工具";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tool-quick-chip";
    button.textContent = label;
    button.dataset.categoryId = categoryId;
    const isActive = state.activeCategory === categoryId;
    if (isActive) {
      button.classList.add("selected");
    }
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
    button.addEventListener("click", () => {
      setActiveCategory(categoryId, { announceChange: true });
    });
    fragment.appendChild(button);
  });

  container.appendChild(fragment);
}

function renderFilterList() {
  const container = elements.filterList;
  if (!container) return;
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  toolCategories.forEach((category) => {
    const id = `tool-filter-${category.id}`;
    const wrapper = document.createElement("label");
    wrapper.className = "tool-filter-item";
    if (state.activeCategory === category.id) {
      wrapper.classList.add("selected");
    }

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "tool-category";
    input.value = category.id;
    input.id = id;
    input.checked = state.activeCategory === category.id;
    input.addEventListener("change", () => {
      if (input.checked) {
        setActiveCategory(category.id, { announceChange: true });
      }
    });

    // 同時監聽 label 的點擊事件，確保切換正常工作
    wrapper.addEventListener("click", (event) => {
      // 如果點擊的不是 input 本身，手動觸發 input 的點擊
      if (event.target !== input) {
        input.checked = true;
        setActiveCategory(category.id, { announceChange: true });
      }
    });

    const text = document.createElement("span");
    text.className = "tool-filter-label";
    text.textContent = category.label;

    wrapper.appendChild(input);
    wrapper.appendChild(text);

    if (topCategoryIds.includes(category.id) && category.id !== "all") {
      const badge = document.createElement("span");
      badge.className = "tool-category-badge";
      badge.textContent = "精選";
      wrapper.appendChild(badge);
    }

    fragment.appendChild(wrapper);
  });

  container.appendChild(fragment);
}

function hydrateSearch() {
  if (!elements.searchInput) return;
  elements.searchInput.value = state.searchTerm;
  elements.searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    persistState();
    renderToolGrid();
  });
}

function hydrateTopToggle() {
  if (!elements.topToggle) return;
  elements.topToggle.checked = state.topOnly;
  elements.topToggle.addEventListener("change", (event) => {
    state.topOnly = Boolean(event.target.checked);
    persistState();
    renderToolGrid();
    announce(state.topOnly ? "已僅顯示精選工具。" : "已恢復顯示全部工具。");
  });
}

function bindReset() {
  if (!elements.resetButton) return;
  elements.resetButton.addEventListener("click", () => {
    const previousCategory = state.activeCategory;
    const previousSearch = state.searchTerm;
    const previousTopOnly = state.topOnly;

    state.activeCategory = "all";
    state.searchTerm = "";
    state.topOnly = false;

    persistState();
    renderQuickFilters();
    renderFilterList();
    renderToolGrid();
    if (elements.searchInput) {
      elements.searchInput.value = "";
    }
    if (elements.topToggle) {
      elements.topToggle.checked = false;
    }

    if (
      previousCategory !== state.activeCategory ||
      previousSearch !== state.searchTerm ||
      previousTopOnly !== state.topOnly
    ) {
      announce("已重設工具庫篩選條件，顯示全部工具。");
    }
  });
}

function getToolLibraryWithOverrides() {
  return toolLibrary.map((tool) => {
    const override = state.toolOverrides.get(tool.id);
    if (!override) {
      return tool;
    }
    const categories = Array.isArray(override.categories) && override.categories.length
      ? override.categories
      : tool.categories;
    const highlights = Array.isArray(override.highlights) && override.highlights.length
      ? override.highlights
      : tool.highlights;
    return {
      ...tool,
      title: override.title && override.title.trim() ? override.title.trim() : tool.title,
      summary: override.summary && override.summary.trim() ? override.summary.trim() : tool.summary,
      description:
        override.description && override.description.trim()
          ? override.description.trim()
          : tool.description,
      categories,
      highlights,
      screenshotUrl:
        override.screenshotUrl && override.screenshotUrl.trim()
          ? override.screenshotUrl.trim()
          : tool.screenshotUrl,
      websiteUrl:
        override.websiteUrl && override.websiteUrl.trim()
          ? override.websiteUrl.trim()
          : tool.websiteUrl,
      learnMoreUrl:
        override.learnMoreUrl && override.learnMoreUrl.trim()
          ? override.learnMoreUrl.trim()
          : tool.learnMoreUrl,
      isOverride: true,
      overrideMeta: {
        updatedAt: override.updatedAt || null,
        createdAt: override.createdAt || null,
      },
    };
  });
}

function getAllTools() {
  const baseTools = getToolLibraryWithOverrides();
  const custom = state.customTools.map((tool) => ({ ...tool, isCustom: true }));
  return [...baseTools, ...custom];
}

function setActiveCategory(categoryId, { announceChange = false } = {}) {
  const sanitized = sanitizeCategory(categoryId);
  if (state.activeCategory === sanitized) return;
  state.activeCategory = sanitized;
  persistState();
  renderQuickFilters();
  renderFilterList();
  renderToolGrid();
  if (announceChange) {
    const label = categoryLabelMap[sanitized]?.label || "全部工具";
    announce(`已切換至 ${label} 類別。`);
  }
}

function getFilteredTools() {
  const active = state.activeCategory;
  const search = state.searchTerm.trim().toLowerCase();
  const limitToTop = state.topOnly;

  return getAllTools().filter((tool) => {
    const categories = Array.isArray(tool.categories) ? tool.categories : [];
    const matchesCategory = active === "all" || categories.includes(active);
    if (!matchesCategory) return false;

    const matchesTop = !limitToTop ? true : isFeaturedTool(tool);
    if (!matchesTop) return false;

    if (!search) return true;
    const textParts = [
      tool.title,
      tool.summary,
      tool.description,
      ...(tool.highlights || []),
      categories
        .map((categoryId) => categoryLabelMap[categoryId]?.label || categoryId)
        .join(" "),
    ];
    return textParts
      .join(" ")
      .toLowerCase()
      .includes(search);
  });
}

function renderToolGrid() {
  const container = elements.toolGrid;
  if (!container) return;
  container.innerHTML = "";

  const results = getFilteredTools().sort((a, b) => {
    const aTitle = a.title || "";
    const bTitle = b.title || "";
    return aTitle.localeCompare(bTitle, "zh-Hant");
  });

  if (elements.summary) {
    const categoryLabel =
      categoryLabelMap[state.activeCategory]?.label || "全部工具";
    const flags = [];
    if (state.topOnly) {
      flags.push("僅顯示精選工具");
    }
    if (state.searchTerm.trim()) {
      flags.push(`搜尋「${state.searchTerm.trim()}」`);
    }
    const flagText = flags.length ? ` ｜ ${flags.join(" ｜ ")}` : "";
    elements.summary.textContent = `${results.length} 個工具 · ${categoryLabel}${flagText}`;
  }

  if (results.length === 0) {
    const empty = document.createElement("p");
    empty.className = "status-text info";
    empty.textContent = "找不到符合條件的工具，請調整分類或搜尋字詞。";
    container.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  results.forEach((tool) => {
    const card = document.createElement("article");
    card.className = "tool-card";
    card.setAttribute("role", "listitem");

    const badgeContainer = document.createElement("div");
    badgeContainer.className = "tool-card-badges";

    if (tool.isCustom) {
      card.classList.add("custom-tool-card");
      const badge = document.createElement("span");
      badge.className = "tool-card-badge custom";
      badge.textContent = "管理者新增";
      badgeContainer.appendChild(badge);
    }

    if (tool.isOverride) {
      card.classList.add("override-tool-card");
      const badge = document.createElement("span");
      badge.className = "tool-card-badge override";
      badge.textContent = "管理者覆寫";
      badgeContainer.appendChild(badge);
    }

    if (isFeaturedTool(tool)) {
      card.classList.add("featured-tool-card");
      const featuredBadge = document.createElement("span");
      featuredBadge.className = "tool-card-badge featured";
      featuredBadge.textContent = "精選";
      badgeContainer.appendChild(featuredBadge);
    }

    if (badgeContainer.childElementCount > 0) {
      card.appendChild(badgeContainer);
    }

    const media = document.createElement("figure");
    media.className = "tool-card-media";

    const img = document.createElement("img");
    img.src = tool.screenshotUrl;
    img.alt = `${tool.title} 的網站縮圖`;
    img.loading = "lazy";
    media.appendChild(img);
    card.appendChild(media);

    const body = document.createElement("div");
    body.className = "tool-card-body";

    const title = document.createElement("h3");
    title.textContent = tool.title;
    body.appendChild(title);

    if (tool.summary) {
      const summary = document.createElement("p");
      summary.className = "tool-card-summary";
      summary.textContent = tool.summary;
      body.appendChild(summary);
    }

    if (tool.description) {
      const description = document.createElement("p");
      description.className = "tool-card-description";
      description.textContent = tool.description;
      body.appendChild(description);
    }

    if (tool.highlights?.length) {
      const highlightList = document.createElement("ul");
      highlightList.className = "tool-card-highlights";
      tool.highlights.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        highlightList.appendChild(li);
      });
      body.appendChild(highlightList);
    }

    const tagList = document.createElement("ul");
    tagList.className = "tool-card-tags";
    (tool.categories || []).forEach((categoryId) => {
      const label = categoryLabelMap[categoryId]?.label;
      if (!label) return;
      const li = document.createElement("li");
      li.textContent = label;
      if (topCategoryIds.includes(categoryId)) {
        li.classList.add("is-top-category");
      }
      tagList.appendChild(li);
    });
    if (tagList.childElementCount > 0) {
      body.appendChild(tagList);
    }

    const actions = document.createElement("div");
    actions.className = "tool-card-actions";

    if (tool.websiteUrl) {
      const visitLink = document.createElement("a");
      visitLink.className = "tool-card-btn primary";
      visitLink.href = tool.websiteUrl;
      visitLink.target = "_blank";
      visitLink.rel = "noopener";
      visitLink.textContent = "開啟網站";
      actions.appendChild(visitLink);
    }

    if (tool.learnMoreUrl) {
      const learnLink = document.createElement("a");
      learnLink.className = "tool-card-btn";
      learnLink.href = tool.learnMoreUrl;
      learnLink.target = "_blank";
      learnLink.rel = "noopener";
      learnLink.textContent = "延伸閱讀";
      actions.appendChild(learnLink);
    }

    if (actions.childElementCount > 0) {
      body.appendChild(actions);
    }

    card.appendChild(body);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
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

    const nextCategory = sanitizeCategory(updated.toolCategory);
    const nextSearch = typeof updated.toolSearch === "string" ? updated.toolSearch : "";
    const nextTopOnly = Boolean(updated.toolTopOnly);

    let changed = false;

    if (nextCategory !== state.activeCategory) {
      state.activeCategory = nextCategory;
      changed = true;
    }

    if (nextSearch !== state.searchTerm) {
      state.searchTerm = nextSearch;
      if (elements.searchInput) {
        elements.searchInput.value = state.searchTerm;
      }
      changed = true;
    }

    if (nextTopOnly !== state.topOnly) {
      state.topOnly = nextTopOnly;
      if (elements.topToggle) {
        elements.topToggle.checked = state.topOnly;
      }
      changed = true;
    }

    if (changed) {
      renderQuickFilters();
      renderFilterList();
      renderToolGrid();
    }
  } else if (event.key === STORAGE_KEYS.adminLibrary) {
    const updatedAdmin = loadAdminLibrary();
    state.customTools = sanitizeCustomTools(updatedAdmin.tools);
    state.toolOverrides = buildToolOverrides(updatedAdmin.tools);
    renderQuickFilters();
    renderFilterList();
    renderToolGrid();
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
