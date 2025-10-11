import { methodLibrary, methodDetails } from "./data/cases.js";
import {
  loadThemePreference,
  loadCaseLibraryState,
  saveCaseLibraryState,
  loadAdminLibrary,
  STORAGE_KEYS,
} from "./storage.js";
import { applyTheme, resolveThemeId } from "./theme.js";

const DEFAULT_METHOD_ID = methodLibrary[0]?.groups?.[0]?.items?.[0]?.id ?? null;

const storedState = loadCaseLibraryState() || {};
const adminLibraryState = loadAdminLibrary();

const state = {
  theme: resolveThemeId(loadThemePreference()),
  selectedMethodId: storedState.selectedMethodId || DEFAULT_METHOD_ID,
  customMethods: sanitizeCustomMethods(adminLibraryState.methods),
  methodOverrides: buildMethodOverrides(adminLibraryState.methods),
};

applyTheme(state.theme);

const elements = {
  methodColumns: document.querySelector("#method-columns"),
  detailPanel: document.querySelector("#case-detail"),
};

function sanitizeCustomMethods(entries) {
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
        chapter: typeof entry.chapter === "string" ? entry.chapter.trim() : "",
        summary: typeof entry.summary === "string" ? entry.summary.trim() : "",
        lead: typeof entry.lead === "string" ? entry.lead.trim() : "",
        notes: typeof entry.notes === "string" ? entry.notes.trim() : "",
        tags: Array.isArray(entry.tags) ? entry.tags.map((tag) => (typeof tag === "string" ? tag : "")).filter(Boolean) : [],
        resources: Array.isArray(entry.resources)
          ? entry.resources
              .map((resource) => {
                if (!resource || typeof resource !== "object") return null;
                const label = typeof resource.label === "string" ? resource.label.trim() : "";
                const href = typeof resource.href === "string" ? resource.href.trim() : "";
                const description = typeof resource.description === "string" ? resource.description.trim() : "";
                if (!label && !href) return null;
                return { label: label || href, href, description };
              })
              .filter(Boolean)
          : [],
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : null,
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : null,
        source: "custom",
      };
    })
    .filter(Boolean);
}

function buildMethodOverrides(entries) {
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

function init() {
  renderMethodColumns();
  renderCaseDetail();
}

function persistState() {
  const current = loadCaseLibraryState() || {};
  saveCaseLibraryState({
    ...current,
    selectedMethodId: state.selectedMethodId,
  });
}

function getMethodColumns() {
  return methodLibrary.map((column) => ({
    ...column,
    groups: (column.groups || []).map((group) => ({
      ...group,
      items: (group.items || []).map((item) => {
        const override = state.methodOverrides.get(item.id);
        if (!override || !override.title) {
          return { ...item };
        }
        return { ...item, title: override.title };
      }),
    })),
  }));
}

function renderMethodColumns() {
  const container = elements.methodColumns;
  if (!container) return;
  container.innerHTML = "";

  const columns = getMethodColumns();

  columns.forEach((column) => {
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
        const isOverridden = state.methodOverrides.has(item.id);
        if (isSelected) {
          button.classList.add("selected");
        }
        if (isOverridden) {
          button.classList.add("overridden");
          const badge = document.createElement("span");
          badge.className = "method-item-badge";
          badge.textContent = "覆寫";
          button.appendChild(badge);
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

  if (state.customMethods.length > 0) {
    container.appendChild(buildCustomMethodColumn());
  }

  updateMethodSelection();
}

function buildCustomMethodColumn() {
  const article = document.createElement("article");
  article.className = "method-column custom-method-column";

  const header = document.createElement("header");
  header.className = "method-column-header";
  header.innerHTML = `
    <span class="method-chapter">★</span>
    <div>
      <h3>管理者新增</h3>
      <p>自訂案例與方法，僅儲存在本機</p>
    </div>
  `;
  article.appendChild(header);

  const sorted = [...state.customMethods].sort((a, b) => a.title.localeCompare(b.title, "zh-Hant") || a.id.localeCompare(b.id));

  const section = document.createElement("section");
  section.className = "method-group";
  const heading = document.createElement("h4");
  heading.textContent = "自訂清單";
  section.appendChild(heading);

  const list = document.createElement("div");
  list.className = "method-items";

  sorted.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "method-item custom";
    button.dataset.methodId = item.id;
    button.textContent = item.title;
    if (item.summary) {
      button.title = item.summary;
    }
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
  return article;
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

function getMethodDetail(methodId) {
  if (!methodId) return null;
  const custom = state.customMethods.find((item) => item.id === methodId);
  if (custom) {
    return { detail: custom, isCustom: true, isOverride: false };
  }
  const override = state.methodOverrides.get(methodId) || null;
  const base = methodDetails[methodId] || null;
  if (override) {
    const merged = mergeMethodDetail(base, override);
    return { detail: merged, isCustom: false, isOverride: true };
  }
  if (base) {
    return { detail: base, isCustom: false, isOverride: false };
  }
  return null;
}

function mergeMethodDetail(baseDetail, overrideEntry) {
  const base = baseDetail ? { ...baseDetail } : {};
  const title = overrideEntry.title && overrideEntry.title.trim()
    ? overrideEntry.title.trim()
    : base.title ?? overrideEntry.id;
  const chapter = overrideEntry.chapter && overrideEntry.chapter.trim()
    ? overrideEntry.chapter.trim()
    : base.chapter ?? "";
  const summary = overrideEntry.summary && overrideEntry.summary.trim()
    ? overrideEntry.summary.trim()
    : base.summary ?? "";
  const lead = overrideEntry.lead && overrideEntry.lead.trim()
    ? overrideEntry.lead.trim()
    : base.lead ?? "";
  const notes = overrideEntry.notes && overrideEntry.notes.trim()
    ? overrideEntry.notes.trim()
    : base.notes ?? "";
  const tags = Array.isArray(overrideEntry.tags) && overrideEntry.tags.length
    ? overrideEntry.tags
    : base.tags ?? [];
  const resources = Array.isArray(overrideEntry.resources) && overrideEntry.resources.length
    ? overrideEntry.resources
    : base.resources ?? [];
  return {
    ...base,
    id: overrideEntry.id,
    title,
    chapter,
    summary,
    lead,
    notes,
    tags,
    resources,
    overrideMeta: {
      updatedAt: overrideEntry.updatedAt || null,
      createdAt: overrideEntry.createdAt || null,
    },
  };
}

function methodExists(methodId) {
  return Boolean(getMethodDetail(methodId));
}

function renderCaseDetail() {
  const container = elements.detailPanel;
  if (!container) return;
  container.innerHTML = "";

  const result = getMethodDetail(state.selectedMethodId);
  if (!result) {
    container.innerHTML = "<p class=\"status-text info\">尚未選擇案例。請從左側清單挑選一項方法。</p>";
    return;
  }

  const { detail, isCustom, isOverride } = result;

  const header = document.createElement("header");
  header.className = "case-detail-header";
  if (isCustom) {
    header.classList.add("custom-case-detail");
  }
  if (isOverride) {
    header.classList.add("override-case-detail");
  }

  const heading = document.createElement("div");
  heading.className = "case-detail-heading";

  const title = document.createElement("h2");
  title.textContent = detail.title;
  heading.appendChild(title);

  const chapterText = detail.chapter ?? (isCustom ? "管理者新增案例" : "");
  if (chapterText) {
    const chapter = document.createElement("p");
    chapter.className = "case-detail-chapter";
    chapter.textContent = chapterText;
    heading.appendChild(chapter);
  }

  if (isCustom) {
    const badge = document.createElement("span");
    badge.className = "case-custom-badge";
    badge.textContent = "管理者新增";
    heading.appendChild(badge);
  } else if (isOverride) {
    const badge = document.createElement("span");
    badge.className = "case-override-badge";
    badge.textContent = "管理者覆寫";
    heading.appendChild(badge);
  }

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

  if (!isCustom && detail.meta?.length) {
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
  const summaryText = detail.summary ?? "";
  if (summaryText) {
    const summary = document.createElement("p");
    summary.className = "case-summary";
    summary.textContent = summaryText;
    intro.appendChild(summary);
  }

  const leadText = detail.lead ?? "";
  if (leadText) {
    const leadParagraph = document.createElement("p");
    leadParagraph.className = isCustom ? "case-summary" : "case-lead";
    leadParagraph.textContent = leadText;
    intro.appendChild(leadParagraph);
  }

  if (intro.childElementCount > 0) {
    container.appendChild(intro);
  }

  if (!isCustom) {
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
  } else if (detail.notes) {
    const notesSection = document.createElement("section");
    notesSection.className = "case-section";
    const headingEl = document.createElement("h3");
    headingEl.textContent = "管理者備註";
    notesSection.appendChild(headingEl);
    detail.notes
      .split(/\r?\n\r?\n|\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line;
        notesSection.appendChild(p);
      });
    container.appendChild(notesSection);
  }

  if (isOverride && detail.notes) {
    const overrideSection = document.createElement("section");
    overrideSection.className = "case-section override-notes";
    const headingEl = document.createElement("h3");
    headingEl.textContent = "管理者備註";
    overrideSection.appendChild(headingEl);
    detail.notes
      .split(/\r?\n\r?\n|\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line;
        overrideSection.appendChild(p);
      });
    container.appendChild(overrideSection);
  }

  if (detail.resources?.length) {
    const resources = document.createElement("section");
    resources.className = "case-resources";
    const titleEl = document.createElement("h3");
    titleEl.textContent = "相關資源";
    resources.appendChild(titleEl);

    const list = document.createElement("ul");
    detail.resources.forEach((resource) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = resource.href || resource.url || "#";
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "resource-link";
      link.textContent = resource.label || resource.href || resource.url;
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

  if (!isCustom && detail.references?.length) {
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
  } else if (event.key === STORAGE_KEYS.adminLibrary) {
    const updatedAdmin = loadAdminLibrary();
    state.customMethods = sanitizeCustomMethods(updatedAdmin.methods);
    state.methodOverrides = buildMethodOverrides(updatedAdmin.methods);
    renderMethodColumns();
    if (!methodExists(state.selectedMethodId)) {
      const fallbackId = state.customMethods[0]?.id || DEFAULT_METHOD_ID;
      if (fallbackId && fallbackId !== state.selectedMethodId) {
        state.selectedMethodId = fallbackId;
        persistState();
      }
    }
    updateMethodSelection();
    renderCaseDetail();
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
