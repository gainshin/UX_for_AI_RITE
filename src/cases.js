import {
  methodLibrary,
  methodDetails,
  patternFilters,
  patternCatalog,
} from "./data/cases.js";
import {
  loadThemePreference,
  loadCaseLibraryState,
  saveCaseLibraryState,
  STORAGE_KEYS,
} from "./storage.js";
import { applyTheme, resolveThemeId } from "./theme.js";

const DEFAULT_METHOD_ID = methodLibrary[0]?.groups?.[0]?.items?.[0]?.id ?? null;
const ALL_FILTER_IDS = patternFilters.map((filter) => filter.id);

const storedState = loadCaseLibraryState() || {
  selectedMethodId: DEFAULT_METHOD_ID,
  filters: ALL_FILTER_IDS,
  search: "",
};

const state = {
  theme: resolveThemeId(loadThemePreference()),
  selectedMethodId: storedState.selectedMethodId || DEFAULT_METHOD_ID,
  activeFilters: new Set(
    Array.isArray(storedState.filters) && storedState.filters.length
      ? storedState.filters
      : ALL_FILTER_IDS
  ),
  searchTerm: typeof storedState.search === "string" ? storedState.search : "",
};

applyTheme(state.theme);

const filterLabelMap = patternFilters.reduce((acc, filter) => {
  acc[filter.id] = filter.label;
  return acc;
}, {});

const elements = {
  methodColumns: document.querySelector("#method-columns"),
  detailPanel: document.querySelector("#case-detail"),
  filterList: document.querySelector("#pattern-filter-list"),
  patternGrid: document.querySelector("#pattern-grid"),
  patternSummary: document.querySelector("#pattern-summary"),
  searchInput: document.querySelector("#pattern-search"),
  resetFilters: document.querySelector("#pattern-reset"),
};

function init() {
  renderMethodColumns();
  renderCaseDetail();
  renderPatternFilters();
  renderPatternGrid();
  hydrateSearch();
  bindReset();
}

function persistState() {
  saveCaseLibraryState({
    selectedMethodId: state.selectedMethodId,
    filters: Array.from(state.activeFilters),
    search: state.searchTerm,
  });
}

function renderMethodColumns() {
  const container = elements.methodColumns;
  if (!container) return;
  container.innerHTML = "";

  methodLibrary.forEach((column) => {
    const article = document.createElement("article");
    article.className = "method-column";

    const header = document.createElement("header");
    header.className = "method-column-header";
    header.innerHTML = `
      <span class="method-chapter">${column.chapter}</span>
      <div>
        <h3>${column.title}</h3>
        <p>${column.subtitle ?? ""}</p>
      </div>
    `;
    article.appendChild(header);

    if (column.description) {
      const description = document.createElement("p");
      description.className = "method-description";
      description.textContent = column.description;
      article.appendChild(description);
    }

    column.groups?.forEach((group) => {
      const section = document.createElement("section");
      section.className = "method-group";

      const heading = document.createElement("h4");
      heading.textContent = group.title;
      section.appendChild(heading);

      const list = document.createElement("div");
      list.className = "method-items";

      group.items?.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "method-item";
        button.textContent = item.title;
        button.dataset.methodId = item.id;
        const isSelected = item.id === state.selectedMethodId;
        if (isSelected) {
          button.classList.add("selected");
        }
        button.setAttribute("aria-pressed", isSelected ? "true" : "false");
        button.addEventListener("click", () => selectMethod(item.id));
        list.appendChild(button);
      });

      section.appendChild(list);
      article.appendChild(section);
    });

    container.appendChild(article);
  });
}

function selectMethod(methodId) {
  if (!methodId || methodId === state.selectedMethodId) return;
  state.selectedMethodId = methodId;
  persistState();
  updateMethodSelection();
  renderCaseDetail();
}

function updateMethodSelection() {
  const buttons = elements.methodColumns?.querySelectorAll(".method-item");
  if (!buttons) return;
  buttons.forEach((btn) => {
    const isSelected = btn.dataset.methodId === state.selectedMethodId;
    btn.classList.toggle("selected", isSelected);
    btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
}

function renderCaseDetail() {
  const container = elements.detailPanel;
  if (!container) return;
  container.innerHTML = "";

  const detail = methodDetails[state.selectedMethodId];
  if (!detail) {
    container.innerHTML = "<p class=\"status-text info\">尚未選擇案例。請從左側清單挑選一項方法。</p>";
    return;
  }

  const header = document.createElement("header");
  header.className = "case-detail-header";

  const heading = document.createElement("div");
  heading.className = "case-detail-heading";

  const title = document.createElement("h2");
  title.textContent = detail.title;
  heading.appendChild(title);

  const chapter = document.createElement("p");
  chapter.className = "case-detail-chapter";
  chapter.textContent = detail.chapter ?? "";
  heading.appendChild(chapter);

  if (detail.tags?.length) {
    const tagList = document.createElement("ul");
    tagList.className = "case-tag-list";
    detail.tags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      tagList.appendChild(li);
    });
    heading.appendChild(tagList);
  }

  header.appendChild(heading);

  if (detail.meta?.length) {
    const metaList = document.createElement("dl");
    metaList.className = "case-meta";
    detail.meta.forEach((item) => {
      const dt = document.createElement("dt");
      dt.textContent = item.label;
      const dd = document.createElement("dd");
      dd.textContent = item.value;
      metaList.appendChild(dt);
      metaList.appendChild(dd);
    });
    header.appendChild(metaList);
  }

  container.appendChild(header);

  const intro = document.createElement("section");
  intro.className = "case-intro";
  intro.innerHTML = `
    <p class="case-summary">${detail.summary ?? ""}</p>
    ${detail.lead ? `<p class="case-lead">${detail.lead}</p>` : ""}
  `;
  container.appendChild(intro);

  detail.sections?.forEach((section) => {
    if (!section || (!section.heading && !section.body?.length)) return;
    const sec = document.createElement("section");
    sec.className = "case-section";
    if (section.heading) {
      const h3 = document.createElement("h3");
      h3.textContent = section.heading;
      sec.appendChild(h3);
    }
    (section.body || []).forEach((block) => {
      const blockNode = renderBodyBlock(block);
      if (blockNode) sec.appendChild(blockNode);
    });
    container.appendChild(sec);
  });

  if (detail.resources?.length) {
    const resources = document.createElement("section");
    resources.className = "case-resources";
    const titleEl = document.createElement("h3");
    titleEl.textContent = "下載資源";
    resources.appendChild(titleEl);

    const list = document.createElement("ul");
    detail.resources.forEach((resource) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = resource.href || "#";
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "resource-link";
      link.textContent = resource.label;
      item.appendChild(link);
      if (resource.description) {
        const desc = document.createElement("p");
        desc.textContent = resource.description;
        item.appendChild(desc);
      }
      list.appendChild(item);
    });
    resources.appendChild(list);
    container.appendChild(resources);
  }

  if (detail.references?.length) {
    const refs = document.createElement("section");
    refs.className = "case-references";
    const titleEl = document.createElement("h3");
    titleEl.textContent = "參考資料";
    refs.appendChild(titleEl);
    const list = document.createElement("ul");
    detail.references.forEach((ref) => {
      const li = document.createElement("li");
      li.textContent = ref;
      list.appendChild(li);
    });
    refs.appendChild(list);
    container.appendChild(refs);
  }
}

function renderBodyBlock(block) {
  if (!block) return null;
  if (block.type === "paragraph") {
    const p = document.createElement("p");
    p.textContent = block.text || "";
    return p;
  }
  if (block.type === "list") {
    const listTag = block.style === "numbered" ? "ol" : "ul";
    const list = document.createElement(listTag);
    list.className = "case-list";
    (block.items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    return list;
  }
  return null;
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

  // if no filters remain selected, default back to "all"
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

function getFilteredPatterns() {
  const search = state.searchTerm.trim().toLowerCase();
  return patternCatalog.filter((pattern) => {
    const matchesFilter = pattern.filters?.some((filterId) => state.activeFilters.has(filterId));
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
  const liveRegion = document.querySelector("#case-live-region");
  if (!liveRegion) return;
  liveRegion.textContent = "";
  window.setTimeout(() => {
    liveRegion.textContent = message;
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
    if (updated.selectedMethodId && updated.selectedMethodId !== state.selectedMethodId) {
      state.selectedMethodId = updated.selectedMethodId;
      updateMethodSelection();
      renderCaseDetail();
    }
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
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
