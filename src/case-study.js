import { caseStudies, getCaseStudyById } from "./data/case-studies.js";
import { patternCatalog } from "./data/cases.js";
import { loadThemePreference } from "./storage.js";
import { applyTheme, resolveThemeId, initThemeSwitcher } from "./theme.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked@11.1.1/+esm";

// Apply theme
const theme = resolveThemeId(loadThemePreference());
applyTheme(theme);

// Initialize theme switcher
initThemeSwitcher();

// Get case study ID from URL
const params = new URLSearchParams(window.location.search);
const studyId = params.get("id");

// DOM elements
const elements = {
  categoryBadge: document.getElementById("category-badge"),
  categoryLink: document.getElementById("category-link"),
  currentStudy: document.getElementById("current-study"),
  studyTitle: document.getElementById("study-title"),
  studySubtitle: document.getElementById("study-subtitle"),
  studyExcerpt: document.getElementById("study-excerpt"),
  tagsContainer: document.getElementById("tags-container"),
  relatedPatterns: document.getElementById("related-patterns"),
  relatedPatternsSection: document.getElementById("related-patterns-section"),
  content: document.getElementById("case-study-content"),
  prevStudy: document.getElementById("prev-study"),
  nextStudy: document.getElementById("next-study"),
};

/**
 * Initialize page
 */
async function init() {
  if (!studyId) {
    showError("未指定案例研究 ID");
    return;
  }

  const study = getCaseStudyById(studyId);
  if (!study) {
    showError("找不到指定的案例研究");
    return;
  }

  renderStudyHeader(study);
  renderRelatedPatterns(study);
  await loadStudyContent(study);
  setupNavigation(study);
}

/**
 * Render study header
 */
function renderStudyHeader(study) {
  // Category badge
  if (elements.categoryBadge) {
    elements.categoryBadge.textContent = study.categoryLabel;
    elements.categoryBadge.className = `category-badge ${study.category}`;
  }

  // Current study in breadcrumb (no category link needed)
  if (elements.currentStudy) {
    elements.currentStudy.textContent = study.title;
  }

  // Title and subtitle
  if (elements.studyTitle) {
    elements.studyTitle.textContent = study.title;
  }

  if (elements.studySubtitle) {
    elements.studySubtitle.textContent = study.titleEn;
  }

  // Excerpt
  if (elements.studyExcerpt) {
    elements.studyExcerpt.textContent = study.excerpt;
  }

  // Tags
  if (elements.tagsContainer && study.tags) {
    elements.tagsContainer.innerHTML = study.tags
      .map(tag => `<span class="tag">#${tag}</span>`)
      .join("");
  }
}

/**
 * Render related patterns
 */
function renderRelatedPatterns(study) {
  if (!elements.relatedPatterns || !study.relatedPatterns?.length) {
    if (elements.relatedPatternsSection) {
      elements.relatedPatternsSection.style.display = "none";
    }
    return;
  }

  const relatedPatternData = study.relatedPatterns
    .map(patternId => patternCatalog.find(p => p.id === patternId))
    .filter(Boolean);

  if (relatedPatternData.length === 0) {
    elements.relatedPatternsSection.style.display = "none";
    return;
  }

  elements.relatedPatterns.innerHTML = relatedPatternData
    .map(pattern => {
      const href = `pattern-detail.html?id=${encodeURIComponent(pattern.id)}`;
      return `
        <a href="${href}" class="pattern-chip">
          <span class="pattern-name">${pattern.name}</span>
          <span class="pattern-name-en">${pattern.nameEn}</span>
        </a>
      `;
    })
    .join("");
}

/**
 * Load and render study content from markdown
 */
async function loadStudyContent(study) {
  try {
    elements.content.innerHTML = '<div class="loading-state"><p>載入中...</p></div>';

    // Fetch the markdown file
    const response = await fetch(study.source);
    if (!response.ok) {
      throw new Error(`Failed to load ${study.source}`);
    }

    const markdownText = await response.text();
    
    // Split by lines and extract the relevant section
    const lines = markdownText.split("\n");
    const relevantLines = lines.slice(study.startLine - 1, study.endLine);
    const sectionContent = relevantLines.join("\n");

    // Parse markdown to HTML
    const htmlContent = marked.parse(sectionContent);

    // Render content
    elements.content.innerHTML = htmlContent;

    // Enhance links to open in new tab
    elements.content.querySelectorAll("a").forEach(link => {
      if (link.hostname !== window.location.hostname) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });

  } catch (error) {
    console.error("Error loading case study content:", error);
    showError("載入案例研究內容時發生錯誤");
  }
}

/**
 * Setup navigation buttons
 */
function setupNavigation(currentStudy) {
  const currentIndex = caseStudies.findIndex(s => s.id === currentStudy.id);
  
  // Previous study
  if (currentIndex > 0) {
    const prevStudy = caseStudies[currentIndex - 1];
    elements.prevStudy.href = `case-study.html?id=${prevStudy.id}`;
    elements.prevStudy.style.display = "flex";
    elements.prevStudy.querySelector(".label").textContent = prevStudy.title;
  }

  // Next study
  if (currentIndex < caseStudies.length - 1) {
    const nextStudy = caseStudies[currentIndex + 1];
    elements.nextStudy.href = `case-study.html?id=${nextStudy.id}`;
    elements.nextStudy.style.display = "flex";
    elements.nextStudy.querySelector(".label").textContent = nextStudy.title;
  }
}

/**
 * Show error message
 */
function showError(message) {
  elements.content.innerHTML = `
    <div class="error-state">
      <p class="error-message">${message}</p>
      <a href="patterns.html" class="button">返回設計模式牆</a>
    </div>
  `;
}

// Initialize
init();
