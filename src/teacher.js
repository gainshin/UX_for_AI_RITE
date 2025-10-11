import { units } from "./data/units.js";
import { methodDetails, patternFilters, patternCatalog } from "./data/cases.js";
import { toolCategories, toolLibrary } from "./data/tools.js";
import {
  loadTeacherState,
  updateTeacherNote,
  removeTeacherNote,
  loadButtonConfig,
  setGlobalButtonConfig,
  setUnitButtonConfig,
  loadThemePreference,
  saveThemePreference,
  loadAdminLibrary,
  saveAdminLibrary,
  STORAGE_KEYS,
} from "./storage.js";
import { formatDateTime } from "./utils.js";
import { THEMES, resolveThemeId, applyTheme } from "./theme.js";

const DEFAULT_START_BUTTON = {
  label: "返回課堂投影片",
  url: "https://userxper.circle.so/c/ux-for-ai-cf9f79",
};
const DEFAULT_PROTOTYPE_LABEL = "查看原型程式碼";
const START_BUTTON_KEY = "startLearning";
const PROTOTYPE_BUTTON_KEY = "prototype";

const state = {
  units,
  currentUnitId: units[0]?.id ?? null,
  teacherState: loadTeacherState(),
  buttonConfig: loadButtonConfig(),
  theme: resolveThemeId(loadThemePreference()),
  adminLibrary: loadAdminLibrary(),
  statusMessage: null,
};

const STATIC_METHOD_IDS = new Set(Object.keys(methodDetails || {}));
const STATIC_PATTERN_IDS = new Set(patternCatalog.map((pattern) => pattern.id));
const STATIC_TOOL_IDS = new Set(toolLibrary.map((tool) => tool.id));

const PATTERN_FILTER_LABEL_MAP = patternFilters.reduce((acc, filter) => {
  acc[filter.id] = filter.label;
  return acc;
}, {});
const PATTERN_FILTER_TOKEN_MAP = patternFilters.reduce((acc, filter) => {
  acc[filter.id.toLowerCase()] = filter.id;
  acc[filter.label.toLowerCase()] = filter.id;
  return acc;
}, {});
const TOOL_CATEGORY_LABEL_MAP = toolCategories.reduce((acc, category) => {
  if (category.id === "all") return acc;
  acc[category.id] = category.label;
  return acc;
}, {});
const TOOL_CATEGORY_TOKEN_MAP = toolCategories.reduce((acc, category) => {
  if (category.id === "all") return acc;
  acc[category.id.toLowerCase()] = category.id;
  acc[category.label.toLowerCase()] = category.id;
  return acc;
}, {});

applyTheme(state.theme);

function cloneAdminLibrary() {
  return {
    methods: state.adminLibrary.methods.map((item) => ({ ...item })),
    patterns: state.adminLibrary.patterns.map((item) => ({ ...item })),
    tools: state.adminLibrary.tools.map((item) => ({ ...item })),
  };
}

function slugifyTitle(title, fallback = "item") {
  const base = (title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (base) return base;
  return `${fallback}-${Date.now().toString(36)}`;
}

function generateUniqueId(baseId, existingIds) {
  let candidate = baseId;
  let counter = 1;
  while (existingIds.has(candidate)) {
    candidate = `${baseId}-${counter++}`;
  }
  return candidate;
}

function parseCommaSeparated(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseResourceLines(value) {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split("|").map((part) => part.trim());
      if (!label && !href) return null;
      return { label: label || href, href: href || "" };
    })
    .filter(Boolean);
}

function formatResourceLines(resources) {
  return (resources || [])
    .map((resource) => `${resource.label || resource.href}|${resource.href || ""}`)
    .join("\n");
}

function normalizePatternFilterInput(value) {
  const tokens = parseCommaSeparated(value);
  if (!tokens.length) {
    return { filters: [], invalid: [] };
  }
  const filters = [];
  const invalid = [];
  const seen = new Set();
  tokens.forEach((token) => {
    const normalized = PATTERN_FILTER_TOKEN_MAP[token.toLowerCase()];
    if (!normalized) {
      invalid.push(token);
      return;
    }
    if (!seen.has(normalized)) {
      seen.add(normalized);
      filters.push(normalized);
    }
  });
  return { filters, invalid };
}

function normalizeToolCategoryInput(value) {
  const tokens = parseCommaSeparated(value);
  if (!tokens.length) {
    return { categories: [], invalid: [] };
  }
  const categories = [];
  const invalid = [];
  const seen = new Set();
  tokens.forEach((token) => {
    const normalized = TOOL_CATEGORY_TOKEN_MAP[token.toLowerCase()];
    if (!normalized) {
      invalid.push(token);
      return;
    }
    if (!seen.has(normalized)) {
      seen.add(normalized);
      categories.push(normalized);
    }
  });
  return { categories, invalid };
}

function updateAdminLibrary(nextLibrary, { message, type = "success", focusId } = {}) {
  state.adminLibrary = saveAdminLibrary(nextLibrary);
  if (message) {
    setStatusMessage(message, type);
  }
  rerenderContentPreserveScroll({ focusId });
}

const elements = {
  unitNav: document.querySelector("#teacher-units"),
  content: document.querySelector("#teacher-content"),
};

function init() {
  renderUnitNav();
  renderContent();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

window.addEventListener("storage", (event) => {
  if (!event.key) return;
  if (event.key === STORAGE_KEYS.teacherState) {
    state.teacherState = loadTeacherState();
    rerenderContentPreserveScroll();
  } else if (event.key === STORAGE_KEYS.buttonConfig) {
    state.buttonConfig = loadButtonConfig();
    rerenderContentPreserveScroll({ refreshNav: true });
  } else if (event.key === STORAGE_KEYS.theme) {
    state.theme = resolveThemeId(loadThemePreference());
    applyTheme(state.theme);
    rerenderContentPreserveScroll();
  }
});

function renderUnitNav() {
  const container = elements.unitNav;
  if (!container) return;
  container.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = "課程單元";
  container.appendChild(heading);

  const nav = document.createElement("nav");
  nav.className = "unit-nav";
  nav.setAttribute("aria-label", "教師單元導航");

  const list = document.createElement("ul");
  list.className = "unit-nav-list";

  state.units.forEach((unit, index) => {
    const item = document.createElement("li");
    item.className = "unit-nav-item";
    if (unit.id === state.currentUnitId) {
      item.classList.add("active");
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "unit-nav-button nav-button";
    button.textContent = `課程單元 ${index + 1}`;
    button.setAttribute("aria-pressed", unit.id === state.currentUnitId ? "true" : "false");
    button.addEventListener("click", () => setCurrentUnit(unit.id));

    item.appendChild(button);
    list.appendChild(item);
  });

  nav.appendChild(list);
  container.appendChild(nav);

  const hint = document.createElement("p");
  hint.className = "unit-nav-hint";
  hint.textContent = "管理者模式可直接瀏覽所有單元並編輯參考答案與連結。";
  container.appendChild(hint);
}

function setCurrentUnit(unitId) {
  if (state.currentUnitId === unitId) return;
  state.currentUnitId = unitId;
  renderUnitNav();
  renderContent();
}

function getCurrentUnit() {
  return state.units.find((unit) => unit.id === state.currentUnitId) ?? null;
}

function renderContent() {
  const container = elements.content;
  if (!container) return;
  container.innerHTML = "";

  if (state.statusMessage) {
    const status = document.createElement("p");
    status.className = `status-text ${state.statusMessage.type || "success"}`;
    status.textContent = state.statusMessage.text;
    status.setAttribute("role", "status");
    container.appendChild(status);
  }

  container.appendChild(buildGlobalSettingsSection());
  container.appendChild(buildAdminLibrarySection());

  const unit = getCurrentUnit();
  if (!unit) {
    const empty = document.createElement("p");
    empty.textContent = "尚未載入任何單元資料。";
    container.appendChild(empty);
    state.statusMessage = null;
    return;
  }

  container.appendChild(buildUnitOverviewSection(unit));
  container.appendChild(buildPrototypeConfigSection(unit));
  container.appendChild(buildCodeSection(unit));
  container.appendChild(buildTeacherNotesSection(unit));

  state.statusMessage = null;
}

function buildGlobalSettingsSection() {
  const section = document.createElement("section");
  section.className = "teacher-section content-panel";

  const header = document.createElement("div");
  header.className = "teacher-section-header";
  header.innerHTML = `
    <h2>全站按鈕設定</h2>
    <p class="teacher-meta">設定「開始探索」按鈕的顯示文字與導向連結（預設為課堂投影片）。</p>
  `;
  section.appendChild(header);

  const form = document.createElement("form");
  form.className = "teacher-form";
  form.setAttribute("autocomplete", "off");

  const current = getCurrentStartButtonConfig();

  const grid = document.createElement("div");
  grid.className = "form-grid two-column";

  const labelGroup = createFormGroup({
    id: "start-label",
    label: "按鈕顯示文字",
    type: "text",
    value: current.label,
    placeholder: DEFAULT_START_BUTTON.label,
  });
  const urlGroup = createFormGroup({
    id: "start-url",
    label: "目標 URL",
    type: "url",
    value: current.url,
    placeholder: DEFAULT_START_BUTTON.url,
    required: true,
  });

  grid.appendChild(labelGroup.wrapper);
  grid.appendChild(urlGroup.wrapper);
  form.appendChild(grid);

  const inlineStatus = document.createElement("p");
  inlineStatus.className = "status-text error";
  inlineStatus.hidden = true;
  form.appendChild(inlineStatus);

  const actions = document.createElement("div");
  actions.className = "form-actions";

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "secondary-btn";
  resetBtn.textContent = "恢復預設";
  resetBtn.addEventListener("click", (event) => {
    event.preventDefault();
    inlineStatus.hidden = true;
    state.buttonConfig = setGlobalButtonConfig(START_BUTTON_KEY, null);
    setStatusMessage('已恢復「開始探索」按鈕預設連結。');
    rerenderContentPreserveScroll();
  });

  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.className = "primary-btn";
  saveBtn.textContent = "儲存設定";

  actions.appendChild(resetBtn);
  actions.appendChild(saveBtn);
  form.appendChild(actions);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    inlineStatus.hidden = true;

    const label = labelGroup.input.value.trim();
    const url = urlGroup.input.value.trim();

    if (!url) {
      showInlineStatus(inlineStatus, "請輸入按鈕連結網址。");
      return;
    }

    if (!isValidUrl(url)) {
      showInlineStatus(inlineStatus, "網址格式不正確，請確認是否包含 http(s)://。");
      return;
    }

    state.buttonConfig = setGlobalButtonConfig(START_BUTTON_KEY, { label, url });
    setStatusMessage('已更新「開始探索」按鈕連結。');
    rerenderContentPreserveScroll();
  });

  section.appendChild(form);
  section.appendChild(buildThemeSelector());
  return section;
}

function buildAdminLibrarySection() {
  const section = document.createElement("section");
  section.className = "teacher-section content-panel admin-library-section";

  const header = document.createElement("div");
  header.className = "teacher-section-header";
  header.innerHTML = `
    <h2>管理者模式 · 資源庫管理</h2>
    <p class="teacher-meta">新增或編輯案例庫、設計模式與工具庫的自訂卡片，資料僅儲存在本機瀏覽器。</p>
  `;
  section.appendChild(header);

  const wrapper = document.createElement("div");
  wrapper.className = "admin-library-panels";
  wrapper.appendChild(buildMethodsManager());
  wrapper.appendChild(buildPatternsManager());
  wrapper.appendChild(buildToolsManager());
  section.appendChild(wrapper);

  return section;
}

function buildThemeSelector() {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "theme-selector";

  const legend = document.createElement("legend");
  legend.textContent = "配色主題";
  fieldset.appendChild(legend);

  const intro = document.createElement("p");
  intro.textContent = "選擇學習者與教師視圖共用的配色方案，更新後會即時套用整站樣式。";
  fieldset.appendChild(intro);

  const options = document.createElement("div");
  options.className = "theme-options";
  fieldset.appendChild(options);

  THEMES.forEach((theme) => {
    const label = document.createElement("label");
    label.className = "theme-option";
    label.dataset.themeId = theme.id;

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "global-theme";
    input.value = theme.id;
    input.id = `theme-option-${theme.id}`;
    if (theme.id === state.theme) {
      input.checked = true;
      label.classList.add("selected");
    }

    input.addEventListener("change", () => {
      if (!input.checked) return;
      const resolved = resolveThemeId(theme.id);
      state.theme = resolved;
      saveThemePreference(resolved);
      applyTheme(resolved);
      setStatusMessage(`已切換主題為「${theme.label}」。`, "success");
      rerenderContentPreserveScroll({ focusId: input.id });
    });

    const details = document.createElement("div");
    details.className = "theme-details";

    const name = document.createElement("span");
    name.className = "theme-name";
    name.textContent = theme.label;
    details.appendChild(name);

    const description = document.createElement("p");
    description.className = "theme-description";
    description.textContent = theme.description;
    details.appendChild(description);

    const preview = document.createElement("div");
    preview.className = "theme-preview";

    const backgroundSwatch = document.createElement("span");
    backgroundSwatch.style.background = theme.preview.background;
    backgroundSwatch.title = "背景主色";

    const surfaceSwatch = document.createElement("span");
    surfaceSwatch.style.background = theme.preview.surface;
    surfaceSwatch.title = "卡片底色";

    const accentSwatch = document.createElement("span");
    accentSwatch.style.background = theme.preview.accent;
    accentSwatch.title = "操作按鈕";

    preview.appendChild(backgroundSwatch);
    preview.appendChild(surfaceSwatch);
    preview.appendChild(accentSwatch);
    details.appendChild(preview);

    label.appendChild(input);
    label.appendChild(details);
    options.appendChild(label);
  });

  return fieldset;
}

function buildMethodsManager() {
  const details = document.createElement("details");
  details.className = "admin-manager";
  if (state.adminLibrary.methods.length) {
    details.open = true;
  }

  const summary = document.createElement("summary");
  summary.innerHTML = `
    <span>案例庫 / 方法圖書館</span>
    <span class="admin-count">${state.adminLibrary.methods.length}</span>
  `;
  details.appendChild(summary);

  const body = document.createElement("div");
  body.className = "admin-manager-body";
  details.appendChild(body);

  const list = document.createElement("div");
  list.className = "admin-entry-list";
  body.appendChild(list);

  const form = document.createElement("form");
  form.className = "admin-entry-form";
  form.setAttribute("autocomplete", "off");
  form.innerHTML = `
    <div class="admin-form-grid two-column">
      <label class="admin-field">
        <span>標題</span>
        <input type="text" id="admin-method-title" required />
      </label>
      <label class="admin-field">
        <span>章節/分類</span>
        <input type="text" id="admin-method-chapter" placeholder="例如 Chapter 7 · Prototyping" />
      </label>
    </div>
    <label class="admin-field">
      <span>摘要</span>
      <textarea id="admin-method-summary" rows="3"></textarea>
    </label>
    <label class="admin-field">
      <span>重點/備註</span>
      <textarea id="admin-method-notes" rows="4" placeholder="每行輸入一段備註。"></textarea>
    </label>
    <label class="admin-field">
      <span>標籤（以逗號分隔）</span>
      <input type="text" id="admin-method-tags" placeholder="例如 研究, 風險控管" />
    </label>
    <label class="admin-field">
      <span>資源連結（每行格式：標題|URL）</span>
      <textarea id="admin-method-resources" rows="3" placeholder="案例說明|https://example.com"></textarea>
    </label>
    <p class="status-text error" data-role="form-status" hidden></p>
    <div class="admin-form-actions">
      <button type="button" class="secondary-btn" data-action="cancel">取消</button>
      <button type="submit" class="primary-btn">儲存案例</button>
    </div>
  `;
  body.appendChild(form);

  const inputs = {
    title: form.querySelector("#admin-method-title"),
    chapter: form.querySelector("#admin-method-chapter"),
    summary: form.querySelector("#admin-method-summary"),
    notes: form.querySelector("#admin-method-notes"),
    tags: form.querySelector("#admin-method-tags"),
    resources: form.querySelector("#admin-method-resources"),
    status: form.querySelector("[data-role='form-status']"),
    submit: form.querySelector("button[type='submit']"),
    cancel: form.querySelector("[data-action='cancel']"),
  };

  function showFormStatus(message) {
    if (!inputs.status) return;
    inputs.status.textContent = message;
    inputs.status.hidden = !message;
  }

  function resetForm() {
    form.reset();
    delete form.dataset.editingId;
    if (inputs.submit) {
      inputs.submit.textContent = "儲存案例";
      inputs.submit.classList.remove("updating");
    }
    showFormStatus("");
  }

  function populateForm(entry) {
    form.dataset.editingId = entry.id;
    inputs.title.value = entry.title || "";
    inputs.chapter.value = entry.chapter || "";
    inputs.summary.value = entry.summary || "";
    inputs.notes.value = entry.notes || "";
    inputs.tags.value = (entry.tags || []).join(", ");
    inputs.resources.value = formatResourceLines(entry.resources);
    if (inputs.submit) {
      inputs.submit.textContent = "更新案例";
      inputs.submit.classList.add("updating");
    }
    showFormStatus("");
    details.open = true;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderList() {
    list.innerHTML = "";
    if (!state.adminLibrary.methods.length) {
      const empty = document.createElement("p");
      empty.className = "status-text info";
      empty.textContent = "尚未新增自訂案例。";
      list.appendChild(empty);
      return;
    }

    const sorted = [...state.adminLibrary.methods].sort((a, b) => {
      const aTime = a.updatedAt || a.createdAt || "";
      const bTime = b.updatedAt || b.createdAt || "";
      return bTime.localeCompare(aTime) || a.title.localeCompare(b.title, "zh-Hant");
    });

    sorted.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "admin-entry-card";
      card.id = `admin-method-${entry.id}`;

      const titleEl = document.createElement("h4");
      titleEl.textContent = entry.title;
      card.appendChild(titleEl);

      if (entry.chapter) {
        const chapterEl = document.createElement("p");
        chapterEl.className = "admin-entry-meta";
        chapterEl.textContent = entry.chapter;
        card.appendChild(chapterEl);
      }

      if (entry.summary) {
        const summaryEl = document.createElement("p");
        summaryEl.className = "admin-entry-summary";
        summaryEl.textContent = entry.summary;
        card.appendChild(summaryEl);
      }

      if (entry.tags?.length) {
        const tagList = document.createElement("ul");
        tagList.className = "admin-entry-tags";
        entry.tags.forEach((tag) => {
          const li = document.createElement("li");
          li.textContent = tag;
          tagList.appendChild(li);
        });
        card.appendChild(tagList);
      }

      const metaRow = document.createElement("p");
      metaRow.className = "admin-entry-meta";
      const timestamp = entry.updatedAt || entry.createdAt;
      if (timestamp) {
        metaRow.textContent = `更新：${formatDateTime(timestamp)}`;
      } else {
        metaRow.textContent = "已儲存於本機";
      }
      card.appendChild(metaRow);

      if (entry.resources?.length) {
        const resourceList = document.createElement("ul");
        resourceList.className = "admin-entry-resources";
        entry.resources.forEach((resource) => {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.href = resource.href || "#";
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = resource.label || resource.href;
          li.appendChild(link);
          resourceList.appendChild(li);
        });
        card.appendChild(resourceList);
      }

      const actions = document.createElement("div");
      actions.className = "admin-entry-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "secondary-btn small-btn";
      editBtn.textContent = "編輯";
      editBtn.addEventListener("click", () => populateForm(entry));
      actions.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "secondary-btn small-btn danger";
      deleteBtn.textContent = "刪除";
      deleteBtn.addEventListener("click", () => {
        if (!window.confirm(`確定要刪除「${entry.title}」嗎？`)) return;
        const next = cloneAdminLibrary();
        next.methods = next.methods.filter((item) => item.id !== entry.id);
        updateAdminLibrary(next, {
          message: `已刪除案例「${entry.title}」。`,
          focusId: "teacher-content",
        });
      });
      actions.appendChild(deleteBtn);

      card.appendChild(actions);
      list.appendChild(card);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    showFormStatus("");

    const title = inputs.title.value.trim();
    if (!title) {
      showFormStatus("請輸入案例標題。");
      inputs.title.focus();
      return;
    }

    const chapter = inputs.chapter.value.trim();
    const summary = inputs.summary.value.trim();
    const notes = inputs.notes.value.trim();
    const tags = parseCommaSeparated(inputs.tags.value);
    const resources = parseResourceLines(inputs.resources.value);

    const editingId = form.dataset.editingId;
    const now = new Date().toISOString();

    if (editingId) {
      const next = cloneAdminLibrary();
      const existingIndex = next.methods.findIndex((item) => item.id === editingId);
      if (existingIndex === -1) {
        showFormStatus("找不到要更新的案例，請重新整理。");
        return;
      }
      const existing = next.methods[existingIndex];
      next.methods[existingIndex] = {
        ...existing,
        title,
        chapter,
        summary,
        notes,
        tags,
        resources,
        updatedAt: now,
      };
      updateAdminLibrary(next, {
        message: `已更新案例「${title}」。`,
        focusId: `admin-method-${editingId}`,
      });
      return;
    }

    const existingIds = new Set([
      ...STATIC_METHOD_IDS,
      ...state.adminLibrary.methods.map((item) => item.id),
    ]);
    const baseId = slugifyTitle(title, "method");
    const id = generateUniqueId(baseId, existingIds);

    const next = cloneAdminLibrary();
    next.methods.push({
      id,
      title,
      chapter,
      summary,
      notes,
      tags,
      resources,
      createdAt: now,
      updatedAt: now,
    });
    updateAdminLibrary(next, {
      message: `已新增案例「${title}」。`,
      focusId: `admin-method-${id}`,
    });
  }

  renderList();

  form.addEventListener("submit", handleSubmit);
  inputs.cancel?.addEventListener("click", (event) => {
    event.preventDefault();
    resetForm();
  });

  return details;
}

function buildPatternsManager() {
  const details = document.createElement("details");
  details.className = "admin-manager";
  if (state.adminLibrary.patterns.length) {
    details.open = true;
  }

  const summary = document.createElement("summary");
  summary.innerHTML = `
    <span>設計模式牆</span>
    <span class="admin-count">${state.adminLibrary.patterns.length}</span>
  `;
  details.appendChild(summary);

  const body = document.createElement("div");
  body.className = "admin-manager-body";
  details.appendChild(body);

  const list = document.createElement("div");
  list.className = "admin-entry-list";
  body.appendChild(list);

  const form = document.createElement("form");
  form.className = "admin-entry-form";
  form.setAttribute("autocomplete", "off");
  form.innerHTML = `
    <div class="admin-form-grid two-column">
      <label class="admin-field">
        <span>模式標題</span>
        <input type="text" id="admin-pattern-title" required />
      </label>
      <label class="admin-field">
        <span>副標題</span>
        <input type="text" id="admin-pattern-subtitle" placeholder="例如 Deployment Readiness" />
      </label>
    </div>
    <label class="admin-field">
      <span>摘要</span>
      <textarea id="admin-pattern-summary" rows="3"></textarea>
    </label>
    <label class="admin-field">
      <span>篩選分類（輸入 ID 或名稱，以逗號分隔）</span>
      <input type="text" id="admin-pattern-filters" placeholder="例如 deployment, security" />
    </label>
    <p class="status-text error" data-role="form-status" hidden></p>
    <div class="admin-form-actions">
      <button type="button" class="secondary-btn" data-action="cancel">取消</button>
      <button type="submit" class="primary-btn">儲存設計模式</button>
    </div>
  `;
  body.appendChild(form);

  const inputs = {
    title: form.querySelector("#admin-pattern-title"),
    subtitle: form.querySelector("#admin-pattern-subtitle"),
    summary: form.querySelector("#admin-pattern-summary"),
    filters: form.querySelector("#admin-pattern-filters"),
    status: form.querySelector("[data-role='form-status']"),
    submit: form.querySelector("button[type='submit']"),
    cancel: form.querySelector("[data-action='cancel']"),
  };

  function showFormStatus(message) {
    if (!inputs.status) return;
    inputs.status.textContent = message;
    inputs.status.hidden = !message;
  }

  function resetForm() {
    form.reset();
    delete form.dataset.editingId;
    if (inputs.submit) {
      inputs.submit.textContent = "儲存設計模式";
      inputs.submit.classList.remove("updating");
    }
    showFormStatus("");
  }

  function populateForm(entry) {
    form.dataset.editingId = entry.id;
    inputs.title.value = entry.title || "";
    inputs.subtitle.value = entry.subtitle || "";
    inputs.summary.value = entry.summary || "";
    inputs.filters.value = (entry.filters || [])
      .map((filterId) => PATTERN_FILTER_LABEL_MAP[filterId] || filterId)
      .join(", ");
    if (inputs.submit) {
      inputs.submit.textContent = "更新設計模式";
      inputs.submit.classList.add("updating");
    }
    showFormStatus("");
    details.open = true;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderList() {
    list.innerHTML = "";
    if (!state.adminLibrary.patterns.length) {
      const empty = document.createElement("p");
      empty.className = "status-text info";
      empty.textContent = "尚未新增自訂設計模式。";
      list.appendChild(empty);
      return;
    }

    const sorted = [...state.adminLibrary.patterns].sort((a, b) => {
      const aTime = a.updatedAt || a.createdAt || "";
      const bTime = b.updatedAt || b.createdAt || "";
      return bTime.localeCompare(aTime) || a.title.localeCompare(b.title, "zh-Hant");
    });

    sorted.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "admin-entry-card";
      card.id = `admin-pattern-${entry.id}`;

      const titleEl = document.createElement("h4");
      titleEl.textContent = entry.title;
      card.appendChild(titleEl);

      if (entry.subtitle) {
        const subtitleEl = document.createElement("p");
        subtitleEl.className = "admin-entry-meta";
        subtitleEl.textContent = entry.subtitle;
        card.appendChild(subtitleEl);
      }

      if (entry.summary) {
        const summaryEl = document.createElement("p");
        summaryEl.className = "admin-entry-summary";
        summaryEl.textContent = entry.summary;
        card.appendChild(summaryEl);
      }

      if (entry.filters?.length) {
        const tagList = document.createElement("ul");
        tagList.className = "admin-entry-tags";
        entry.filters.forEach((filterId) => {
          const li = document.createElement("li");
          li.textContent = PATTERN_FILTER_LABEL_MAP[filterId] || filterId;
          tagList.appendChild(li);
        });
        card.appendChild(tagList);
      }

      const metaRow = document.createElement("p");
      metaRow.className = "admin-entry-meta";
      const timestamp = entry.updatedAt || entry.createdAt;
      metaRow.textContent = timestamp
        ? `更新：${formatDateTime(timestamp)}`
        : "已儲存於本機";
      card.appendChild(metaRow);

      const actions = document.createElement("div");
      actions.className = "admin-entry-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "secondary-btn small-btn";
      editBtn.textContent = "編輯";
      editBtn.addEventListener("click", () => populateForm(entry));
      actions.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "secondary-btn small-btn danger";
      deleteBtn.textContent = "刪除";
      deleteBtn.addEventListener("click", () => {
        if (!window.confirm(`確定要刪除「${entry.title}」嗎？`)) return;
        const next = cloneAdminLibrary();
        next.patterns = next.patterns.filter((item) => item.id !== entry.id);
        updateAdminLibrary(next, {
          message: `已刪除設計模式「${entry.title}」。`,
          focusId: "teacher-content",
        });
      });
      actions.appendChild(deleteBtn);

      card.appendChild(actions);
      list.appendChild(card);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    showFormStatus("");

    const title = inputs.title.value.trim();
    if (!title) {
      showFormStatus("請輸入設計模式標題。");
      inputs.title.focus();
      return;
    }

    const subtitle = inputs.subtitle.value.trim();
    const summary = inputs.summary.value.trim();

    const { filters, invalid } = normalizePatternFilterInput(inputs.filters.value);
    if (invalid.length) {
      showFormStatus(`無法辨識以下分類：${invalid.join("、")}。請輸入 patternFilters 中的 ID 或名稱。`);
      inputs.filters.focus();
      return;
    }
    if (!filters.length) {
      showFormStatus("請至少指定一個篩選分類。");
      inputs.filters.focus();
      return;
    }

    const editingId = form.dataset.editingId;
    const now = new Date().toISOString();

    if (editingId) {
      const next = cloneAdminLibrary();
      const index = next.patterns.findIndex((item) => item.id === editingId);
      if (index === -1) {
        showFormStatus("找不到要更新的設計模式，請重新整理。");
        return;
      }
      const existing = next.patterns[index];
      next.patterns[index] = {
        ...existing,
        title,
        subtitle,
        summary,
        filters,
        updatedAt: now,
      };
      updateAdminLibrary(next, {
        message: `已更新設計模式「${title}」。`,
        focusId: `admin-pattern-${editingId}`,
      });
      return;
    }

    const existingIds = new Set([
      ...STATIC_PATTERN_IDS,
      ...state.adminLibrary.patterns.map((item) => item.id),
    ]);
    const baseId = slugifyTitle(title, "pattern");
    const id = generateUniqueId(baseId, existingIds);

    const next = cloneAdminLibrary();
    next.patterns.push({
      id,
      title,
      subtitle,
      summary,
      filters,
      createdAt: now,
      updatedAt: now,
    });

    updateAdminLibrary(next, {
      message: `已新增設計模式「${title}」。`,
      focusId: `admin-pattern-${id}`,
    });
  }

  renderList();

  form.addEventListener("submit", handleSubmit);
  inputs.cancel?.addEventListener("click", (event) => {
    event.preventDefault();
    resetForm();
  });

  return details;
}

function buildToolsManager() {
  const details = document.createElement("details");
  details.className = "admin-manager";
  if (state.adminLibrary.tools.length) {
    details.open = true;
  }

  const summary = document.createElement("summary");
  summary.innerHTML = `
    <span>工具庫</span>
    <span class="admin-count">${state.adminLibrary.tools.length}</span>
  `;
  details.appendChild(summary);

  const body = document.createElement("div");
  body.className = "admin-manager-body";
  details.appendChild(body);

  const list = document.createElement("div");
  list.className = "admin-entry-list";
  body.appendChild(list);

  const form = document.createElement("form");
  form.className = "admin-entry-form";
  form.setAttribute("autocomplete", "off");
  form.innerHTML = `
    <div class="admin-form-grid two-column">
      <label class="admin-field">
        <span>工具名稱</span>
        <input type="text" id="admin-tool-title" required />
      </label>
      <label class="admin-field">
        <span>網站縮圖 URL</span>
        <input type="url" id="admin-tool-screenshot" placeholder="https://example.com/screenshot.jpg" required />
      </label>
    </div>
    <label class="admin-field">
      <span>摘要</span>
      <textarea id="admin-tool-summary" rows="3" placeholder="簡述此工具的用途"></textarea>
    </label>
    <label class="admin-field">
      <span>詳細說明</span>
      <textarea id="admin-tool-description" rows="4" placeholder="補充此工具的適用情境或亮點"></textarea>
    </label>
    <div class="admin-form-grid two-column">
      <label class="admin-field">
        <span>分類（輸入 ID 或名稱，以逗號分隔）</span>
        <input type="text" id="admin-tool-categories" placeholder="例如 ux-research, AI in UX Design" />
      </label>
      <label class="admin-field">
        <span>亮點標籤（以逗號分隔）</span>
        <input type="text" id="admin-tool-highlights" placeholder="例如 多人協作, 即時分析" />
      </label>
    </div>
    <div class="admin-form-grid two-column">
      <label class="admin-field">
        <span>工具網站 URL</span>
        <input type="url" id="admin-tool-website" placeholder="https://example.com" />
      </label>
      <label class="admin-field">
        <span>延伸閱讀 URL</span>
        <input type="url" id="admin-tool-learn-more" placeholder="https://example.com/blog" />
      </label>
    </div>
    <p class="status-text error" data-role="form-status" hidden></p>
    <div class="admin-form-actions">
      <button type="button" class="secondary-btn" data-action="cancel">取消</button>
      <button type="submit" class="primary-btn">儲存工具</button>
    </div>
  `;
  body.appendChild(form);

  const inputs = {
    title: form.querySelector("#admin-tool-title"),
    screenshot: form.querySelector("#admin-tool-screenshot"),
    summary: form.querySelector("#admin-tool-summary"),
    description: form.querySelector("#admin-tool-description"),
    categories: form.querySelector("#admin-tool-categories"),
    highlights: form.querySelector("#admin-tool-highlights"),
    website: form.querySelector("#admin-tool-website"),
    learnMore: form.querySelector("#admin-tool-learn-more"),
    status: form.querySelector("[data-role='form-status']"),
    submit: form.querySelector("button[type='submit']"),
    cancel: form.querySelector("[data-action='cancel']"),
  };

  function showFormStatus(message) {
    if (!inputs.status) return;
    inputs.status.textContent = message;
    inputs.status.hidden = !message;
  }

  function resetForm() {
    form.reset();
    delete form.dataset.editingId;
    if (inputs.submit) {
      inputs.submit.textContent = "儲存工具";
      inputs.submit.classList.remove("updating");
    }
    showFormStatus("");
  }

  function populateForm(entry) {
    form.dataset.editingId = entry.id;
    inputs.title.value = entry.title || "";
    inputs.screenshot.value = entry.screenshotUrl || "";
    inputs.summary.value = entry.summary || "";
    inputs.description.value = entry.description || "";
    inputs.categories.value = (entry.categories || [])
      .map((categoryId) => TOOL_CATEGORY_LABEL_MAP[categoryId] || categoryId)
      .join(", ");
    inputs.highlights.value = (entry.highlights || []).join(", ");
    inputs.website.value = entry.websiteUrl || "";
    inputs.learnMore.value = entry.learnMoreUrl || "";
    if (inputs.submit) {
      inputs.submit.textContent = "更新工具";
      inputs.submit.classList.add("updating");
    }
    showFormStatus("");
    details.open = true;
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderList() {
    list.innerHTML = "";
    if (!state.adminLibrary.tools.length) {
      const empty = document.createElement("p");
      empty.className = "status-text info";
      empty.textContent = "尚未新增自訂工具。";
      list.appendChild(empty);
      return;
    }

    const sorted = [...state.adminLibrary.tools].sort((a, b) => {
      const aTime = a.updatedAt || a.createdAt || "";
      const bTime = b.updatedAt || b.createdAt || "";
      return bTime.localeCompare(aTime) || a.title.localeCompare(b.title, "zh-Hant");
    });

    sorted.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "admin-entry-card";
      card.id = `admin-tool-${entry.id}`;

      if (entry.screenshotUrl) {
        const media = document.createElement("div");
        media.className = "admin-entry-media";
        const img = document.createElement("img");
        img.src = entry.screenshotUrl;
        img.alt = `${entry.title} 網站縮圖`;
        img.loading = "lazy";
        media.appendChild(img);
        card.appendChild(media);
      }

      const titleEl = document.createElement("h4");
      titleEl.textContent = entry.title;
      card.appendChild(titleEl);

      if (entry.summary) {
        const summaryEl = document.createElement("p");
        summaryEl.className = "admin-entry-summary";
        summaryEl.textContent = entry.summary;
        card.appendChild(summaryEl);
      }

      if (entry.description) {
        const descriptionEl = document.createElement("p");
        descriptionEl.className = "admin-entry-description";
        descriptionEl.textContent = entry.description;
        card.appendChild(descriptionEl);
      }

      if (entry.categories?.length) {
        const categoryList = document.createElement("ul");
        categoryList.className = "admin-entry-tags";
        entry.categories.forEach((categoryId) => {
          const li = document.createElement("li");
          li.textContent = TOOL_CATEGORY_LABEL_MAP[categoryId] || categoryId;
          categoryList.appendChild(li);
        });
        card.appendChild(categoryList);
      }

      if (entry.highlights?.length) {
        const highlightList = document.createElement("ul");
        highlightList.className = "admin-entry-tags";
        entry.highlights.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          highlightList.appendChild(li);
        });
        card.appendChild(highlightList);
      }

      const metaRow = document.createElement("p");
      metaRow.className = "admin-entry-meta";
      const timestamp = entry.updatedAt || entry.createdAt;
      metaRow.textContent = timestamp
        ? `更新：${formatDateTime(timestamp)}`
        : "已儲存於本機";
      card.appendChild(metaRow);

      if (entry.websiteUrl || entry.learnMoreUrl) {
        const resourceList = document.createElement("ul");
        resourceList.className = "admin-entry-resources";
        if (entry.websiteUrl) {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.href = entry.websiteUrl;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = "工具網站";
          li.appendChild(link);
          resourceList.appendChild(li);
        }
        if (entry.learnMoreUrl) {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.href = entry.learnMoreUrl;
          link.target = "_blank";
          link.rel = "noopener";
          link.textContent = "延伸閱讀";
          li.appendChild(link);
          resourceList.appendChild(li);
        }
        card.appendChild(resourceList);
      }

      const actions = document.createElement("div");
      actions.className = "admin-entry-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "secondary-btn small-btn";
      editBtn.textContent = "編輯";
      editBtn.addEventListener("click", () => populateForm(entry));
      actions.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "secondary-btn small-btn danger";
      deleteBtn.textContent = "刪除";
      deleteBtn.addEventListener("click", () => {
        if (!window.confirm(`確定要刪除「${entry.title}」嗎？`)) return;
        const next = cloneAdminLibrary();
        next.tools = next.tools.filter((item) => item.id !== entry.id);
        updateAdminLibrary(next, {
          message: `已刪除工具「${entry.title}」。`,
          focusId: "teacher-content",
        });
      });
      actions.appendChild(deleteBtn);

      card.appendChild(actions);
      list.appendChild(card);
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    showFormStatus("");

    const title = inputs.title.value.trim();
    if (!title) {
      showFormStatus("請輸入工具名稱。");
      inputs.title.focus();
      return;
    }

    const screenshotUrl = inputs.screenshot.value.trim();
    if (!screenshotUrl) {
      showFormStatus("請提供網站縮圖 URL。");
      inputs.screenshot.focus();
      return;
    }
    if (!isValidUrl(screenshotUrl)) {
      showFormStatus("網站縮圖網址格式不正確，請確認是否包含 http(s)://。");
      inputs.screenshot.focus();
      return;
    }

    const websiteUrl = inputs.website.value.trim();
    if (websiteUrl && !isValidUrl(websiteUrl)) {
      showFormStatus("工具網站網址格式不正確，請確認是否包含 http(s)://。");
      inputs.website.focus();
      return;
    }

    const learnMoreUrl = inputs.learnMore.value.trim();
    if (learnMoreUrl && !isValidUrl(learnMoreUrl)) {
      showFormStatus("延伸閱讀網址格式不正確，請確認是否包含 http(s)://。");
      inputs.learnMore.focus();
      return;
    }

    const { categories, invalid } = normalizeToolCategoryInput(inputs.categories.value);
    if (invalid.length) {
      showFormStatus(`無法辨識以下分類：${invalid.join("、")}。請輸入工具分類 ID 或名稱。`);
      inputs.categories.focus();
      return;
    }
    if (!categories.length) {
      showFormStatus("請至少指定一個工具分類。");
      inputs.categories.focus();
      return;
    }

    const summary = inputs.summary.value.trim();
    const description = inputs.description.value.trim();
    const highlights = parseCommaSeparated(inputs.highlights.value);
    const now = new Date().toISOString();
    const editingId = form.dataset.editingId;

    if (editingId) {
      const next = cloneAdminLibrary();
      const index = next.tools.findIndex((item) => item.id === editingId);
      if (index === -1) {
        showFormStatus("找不到要更新的工具，請重新整理。");
        return;
      }
      const existing = next.tools[index];
      next.tools[index] = {
        ...existing,
        title,
        summary,
        description,
        categories,
        highlights,
        screenshotUrl,
        websiteUrl,
        learnMoreUrl,
        updatedAt: now,
      };
      updateAdminLibrary(next, {
        message: `已更新工具「${title}」。`,
        focusId: `admin-tool-${editingId}`,
      });
      return;
    }

    const existingIds = new Set([
      ...STATIC_TOOL_IDS,
      ...state.adminLibrary.tools.map((item) => item.id),
    ]);
    const baseId = slugifyTitle(title, "tool");
    const id = generateUniqueId(baseId, existingIds);

    const next = cloneAdminLibrary();
    next.tools.push({
      id,
      title,
      summary,
      description,
      categories,
      highlights,
      screenshotUrl,
      websiteUrl,
      learnMoreUrl,
      createdAt: now,
      updatedAt: now,
    });

    updateAdminLibrary(next, {
      message: `已新增工具「${title}」。`,
      focusId: `admin-tool-${id}`,
    });
  }

  renderList();

  form.addEventListener("submit", handleSubmit);
  inputs.cancel?.addEventListener("click", (event) => {
    event.preventDefault();
    resetForm();
  });

  return details;
}

function getCurrentStartButtonConfig() {
  const stored = state.buttonConfig?.globals?.[START_BUTTON_KEY];
  const label = typeof stored?.label === "string" && stored.label.trim()
    ? stored.label.trim()
    : DEFAULT_START_BUTTON.label;
  const url = typeof stored?.url === "string" && stored.url.trim()
    ? stored.url.trim()
    : DEFAULT_START_BUTTON.url;
  return { label, url };
}

function buildUnitOverviewSection(unit) {
  const section = document.createElement("section");
  section.className = "teacher-section content-panel";

  const header = document.createElement("div");
  header.className = "content-header";
  header.innerHTML = `
    <div>
      <h2>${unit.title}</h2>
      <p>${unit.summary}</p>
    </div>
    <div class="chip">${translateScenario(unit.scenario)}｜${unit.minutes} 分鐘</div>
  `;
  section.appendChild(header);

  const note = document.createElement("p");
  note.className = "teacher-meta";
  note.textContent = "教師可於下方設定原型連結與調整參考答案，變更僅儲存在本機。";
  section.appendChild(note);

  return section;
}

function buildPrototypeConfigSection(unit) {
  const section = document.createElement("section");
  section.className = "teacher-section content-panel";

  const header = document.createElement("div");
  header.className = "teacher-section-header";
  header.innerHTML = `
    <h2>${unit.title} · 原型連結設定</h2>
    <p class="teacher-meta">設定學習者在主站看到的「查看原型程式碼」按鈕連結。</p>
  `;
  section.appendChild(header);

  const form = document.createElement("form");
  form.className = "teacher-form";
  form.setAttribute("autocomplete", "off");

  const current = getPrototypeConfigForForm(unit.id);

  const grid = document.createElement("div");
  grid.className = "form-grid two-column";

  const labelGroup = createFormGroup({
    id: `prototype-label-${unit.id}`,
    label: "按鈕顯示文字",
    type: "text",
    value: current.label,
    placeholder: DEFAULT_PROTOTYPE_LABEL,
  });
  const urlGroup = createFormGroup({
    id: `prototype-url-${unit.id}`,
    label: "目標 URL",
    type: "url",
    value: current.url,
    placeholder: "https://example.com",
  });

  grid.appendChild(labelGroup.wrapper);
  grid.appendChild(urlGroup.wrapper);
  form.appendChild(grid);

  const inlineStatus = document.createElement("p");
  inlineStatus.className = "status-text error";
  inlineStatus.hidden = true;
  form.appendChild(inlineStatus);

  const actions = document.createElement("div");
  actions.className = "form-actions";

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "secondary-btn";
  resetBtn.textContent = "移除自訂連結";
  resetBtn.disabled = !current.url;
  resetBtn.addEventListener("click", (event) => {
    event.preventDefault();
    inlineStatus.hidden = true;
    state.buttonConfig = setUnitButtonConfig(unit.id, PROTOTYPE_BUTTON_KEY, null);
    setStatusMessage(`${unit.title} 的原型連結已移除。`);
    rerenderContentPreserveScroll();
  });

  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.className = "primary-btn";
  saveBtn.textContent = "儲存原型連結";

  actions.appendChild(resetBtn);
  actions.appendChild(saveBtn);
  form.appendChild(actions);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    inlineStatus.hidden = true;

    const label = labelGroup.input.value.trim() || DEFAULT_PROTOTYPE_LABEL;
    const url = urlGroup.input.value.trim();

    if (!url) {
      showInlineStatus(inlineStatus, "請輸入原型連結網址。若欲移除請使用下方按鈕。");
      return;
    }

    if (!isValidUrl(url)) {
      showInlineStatus(inlineStatus, "網址格式不正確，請確認是否包含 http(s)://。");
      return;
    }

    state.buttonConfig = setUnitButtonConfig(unit.id, PROTOTYPE_BUTTON_KEY, { label, url });
    setStatusMessage(`${unit.title} 的原型連結已更新。`);
    rerenderContentPreserveScroll();
  });

  section.appendChild(form);
  return section;
}

function getPrototypeConfigForForm(unitId) {
  const stored = state.buttonConfig?.units?.[unitId]?.[PROTOTYPE_BUTTON_KEY];
  const label = typeof stored?.label === "string" && stored.label.trim()
    ? stored.label.trim()
    : DEFAULT_PROTOTYPE_LABEL;
  const url = typeof stored?.url === "string" ? stored.url.trim() : "";
  return { label, url };
}

function buildCodeSection(unit) {
  const section = document.createElement("section");
  section.className = "teacher-section content-panel";

  const header = document.createElement("div");
  header.className = "teacher-section-header";
  header.innerHTML = `
    <h2>程式碼原型</h2>
    <p class="teacher-meta">管理者模式可直接檢視完整原始碼與後續建議步驟。</p>
  `;
  section.appendChild(header);

  const card = document.createElement("article");
  card.className = "code-snippet";

  const title = document.createElement("h4");
  title.textContent = unit.code.title;
  card.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = unit.code.description;
  card.appendChild(desc);

  const pre = document.createElement("pre");
  pre.textContent = unit.code.content.trim();
  card.appendChild(pre);

  if (unit.code.nextSteps?.length) {
    const list = document.createElement("ul");
    list.className = "point-list";
    unit.code.nextSteps.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      list.appendChild(li);
    });
    card.appendChild(list);
  }

  section.appendChild(card);
  return section;
}

function buildTeacherNotesSection(unit) {
  const section = document.createElement("section");
  section.className = "teacher-section content-panel";

  const header = document.createElement("div");
  header.className = "teacher-section-header";
  header.innerHTML = `
    <h2>教師參考答案管理</h2>
    <p class="teacher-meta">編輯後將立即儲存在本機瀏覽器，於測驗解析時顯示自訂參考內容。</p>
  `;
  section.appendChild(header);

  unit.quiz.forEach((question, index) => {
    const card = document.createElement("article");
    card.className = "teacher-card";

    const headerEl = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = `${index + 1}. ${question.prompt}`;
    headerEl.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "teacher-meta";
    const noteMeta = getTeacherNoteMeta(unit.id, question.id);
    const parts = [
      `類型：${translateQuestionType(question)}`,
      `場景：${translateScenario(question.scenario)}`,
    ];
    if (noteMeta?.updatedAt) {
      parts.push(`更新：${formatDateTime(noteMeta.updatedAt)}`);
    }
    meta.textContent = parts.join(" ｜ ");
    headerEl.appendChild(meta);
    card.appendChild(headerEl);

    const answerBox = document.createElement("div");
    answerBox.className = "teacher-answer";
    answerBox.appendChild(buildTeacherAnswerContent(question));
    card.appendChild(answerBox);

    const textarea = document.createElement("textarea");
    textarea.id = `teacher-note-${question.id}`;
    const existingNote = getTeacherReference(unit.id, question.id);
    const baseline = question.explanation || "";
    textarea.value = existingNote || baseline;
    textarea.placeholder = baseline
      ? "自訂或調整答案參考內容"
      : "尚未提供官方解析，可自行撰寫教師參考";
    card.appendChild(textarea);

    const actions = document.createElement("div");
    actions.className = "teacher-actions";

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "secondary-btn";
    resetBtn.textContent = "還原預設";
    const hasCustomNote = Boolean(noteMeta);
    resetBtn.disabled = !hasCustomNote && !baseline;
    resetBtn.title = hasCustomNote ? "移除自訂教師答案" : "";
    resetBtn.addEventListener("click", () => {
      state.teacherState = removeTeacherNote(unit.id, question.id);
      setStatusMessage("已移除自訂教師答案參考。", "success");
      rerenderContentPreserveScroll({ focusId: textarea.id });
    });

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "primary-btn";
    saveBtn.textContent = "儲存管理者版";
    saveBtn.addEventListener("click", () => {
      const textValue = textarea.value.trim();
      if (textValue) {
        state.teacherState = updateTeacherNote(unit.id, question.id, textValue);
        setStatusMessage("已儲存教師參考答案。", "success");
      } else {
        state.teacherState = removeTeacherNote(unit.id, question.id);
        setStatusMessage("已移除自訂教師答案參考。", "success");
      }
      rerenderContentPreserveScroll({ focusId: textarea.id });
    });

    actions.appendChild(resetBtn);
    actions.appendChild(saveBtn);
    card.appendChild(actions);

    section.appendChild(card);
  });

  return section;
}

function createFormGroup({ id, label, type, value, placeholder, required = false }) {
  const wrapper = document.createElement("div");
  wrapper.className = "form-group";

  const labelEl = document.createElement("label");
  labelEl.setAttribute("for", id);
  labelEl.textContent = label;
  wrapper.appendChild(labelEl);

  const input = document.createElement("input");
  input.id = id;
  input.type = type;
  input.className = "input-field";
  input.value = value || "";
  if (placeholder) {
    input.placeholder = placeholder;
  }
  if (required) {
    input.required = true;
  }
  wrapper.appendChild(input);

  return { wrapper, input };
}

function buildTeacherAnswerContent(question) {
  if (question.type === "multiple") {
    const list = document.createElement("ul");
    list.className = "point-list";
    question.correctOptionIds.forEach((optionId) => {
      const option = question.options.find((item) => item.id === optionId);
      const li = document.createElement("li");
      li.textContent = option ? option.text : optionId;
      list.appendChild(li);
    });
    return list;
  }

  if (question.type === "matching") {
    const list = document.createElement("ul");
    list.className = "point-list";
    question.pairs.forEach((pair, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${idx + 1}. ${pair.prompt}</strong><p>${pair.match}</p>`;
      list.appendChild(li);
    });
    return list;
  }

  const paragraph = document.createElement("p");
  paragraph.textContent = "目前尚未提供答案資訊。";
  return paragraph;
}

function getTeacherReference(unitId, questionId) {
  return state.teacherState?.notes?.[unitId]?.[questionId]?.referenceNote || "";
}

function getTeacherNoteMeta(unitId, questionId) {
  return state.teacherState?.notes?.[unitId]?.[questionId] || null;
}

function translateScenario(scenario) {
  switch (scenario) {
    case "ecommerce":
      return "電商";
    case "medical":
      return "醫療";
    case "social":
      return "社交";
    case "education":
      return "教育";
    case "ai-hiring":
      return "AI 招聘";
    default:
      return "多場域";
  }
}

function translateQuestionType(question) {
  if (question.type === "multiple") {
    return question.correctOptionIds?.length > 1 ? "多選題" : "單選題";
  }
  if (question.type === "matching") {
    return "連連看";
  }
  return "題目";
}

function showInlineStatus(element, message) {
  element.textContent = message;
  element.hidden = !message;
}

function setStatusMessage(text, type = "success") {
  state.statusMessage = { text, type };
}

function rerenderContentPreserveScroll({ refreshNav = false, focusId } = {}) {
  const scrollY = window.scrollY;
  if (refreshNav) {
    renderUnitNav();
  }
  renderContent();
  window.scrollTo(0, scrollY);
  if (focusId) {
    const focusTarget = document.getElementById(focusId);
    if (focusTarget) {
      focusTarget.focus();
      if (focusTarget.value) {
        const len = focusTarget.value.length;
        focusTarget.setSelectionRange(len, len);
      }
    }
  }
}

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return Boolean(parsed.protocol === "http:" || parsed.protocol === "https:");
  } catch (err) {
    return false;
  }
}
