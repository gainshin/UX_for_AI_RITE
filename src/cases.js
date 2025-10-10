import { methodLibrary, methodDetails } from "./data/cases.js";
import {
  loadThemePreference,
  loadCaseLibraryState,
  saveCaseLibraryState,
  STORAGE_KEYS,
} from "./storage.js";
import { applyTheme, resolveThemeId } from "./theme.js";

const DEFAULT_METHOD_ID = methodLibrary[0]?.groups?.[0]?.items?.[0]?.id ?? null;

const storedState = loadCaseLibraryState() || {};

const state = {
  theme: resolveThemeId(loadThemePreference()),
  selectedMethodId: storedState.selectedMethodId || DEFAULT_METHOD_ID,
};

applyTheme(state.theme);

const elements = {
  methodColumns: document.querySelector("#method-columns"),
  detailPanel: document.querySelector("#case-detail"),
};

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
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
