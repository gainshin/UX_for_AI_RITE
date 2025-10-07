import { units } from "./data/units.js";
import {
  loadTeacherState,
  updateTeacherNote,
  removeTeacherNote,
  loadButtonConfig,
  setGlobalButtonConfig,
  setUnitButtonConfig,
  STORAGE_KEYS,
} from "./storage.js";
import { formatDateTime } from "./utils.js";

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
  statusMessage: null,
};

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
  hint.textContent = "教師版可直接瀏覽所有單元並編輯參考答案與連結。";
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
  return section;
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
    <p class="teacher-meta">教師版可直接檢視完整原始碼與後續建議步驟。</p>
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
    saveBtn.textContent = "儲存教師版";
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
