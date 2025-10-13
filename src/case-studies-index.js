import { caseStudies, getCaseStudyCategories } from "./data/case-studies.js";
import { loadThemePreference } from "./storage.js";
import { applyTheme, resolveThemeId, initThemeSwitcher } from "./theme.js";

// Apply theme
const theme = resolveThemeId(loadThemePreference());
applyTheme(theme);

// Initialize theme switcher
initThemeSwitcher();

// DOM elements
const grid = document.getElementById("case-studies-grid");
const nav = document.getElementById("case-category-nav");

const CATEGORY_ORDER = [
  "trust-builders",
  "governors",
  "prompt-actions",
  "tuners",
  "dark-patterns",
];

function sortCategories(categories) {
  return categories.slice().sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a.id);
    const indexB = CATEGORY_ORDER.indexOf(b.id);
    const resolvedIndexA = indexA === -1 ? CATEGORY_ORDER.length : indexA;
    const resolvedIndexB = indexB === -1 ? CATEGORY_ORDER.length : indexB;

    if (resolvedIndexA !== resolvedIndexB) {
      return resolvedIndexA - resolvedIndexB;
    }

    return a.label.localeCompare(b.label, "zh-Hant");
  });
}

function getNavLinks() {
  if (!nav) return [];
  return Array.from(nav.querySelectorAll("a[data-category]"));
}

function setActiveCategory(categoryId) {
  if (!categoryId) return;
  const links = getNavLinks();
  if (!links.length) return;

  links.forEach((link) => {
    const isActive = link.dataset.category === categoryId;
    if (isActive) {
      link.classList.add("case-category-link--active");
      link.setAttribute("aria-current", "true");
    } else {
      link.classList.remove("case-category-link--active");
      link.removeAttribute("aria-current");
    }
  });
}

function renderCategoryNav(categories) {
  if (!nav) return;

  if (!categories.length) {
    nav.innerHTML = "";
    nav.style.display = "none";
    return;
  }

  nav.style.display = "flex";
  nav.innerHTML = categories
    .map((category) => `
      <a href="#case-category-${category.id}" class="case-category-link" data-category="${category.id}">
        ${category.label}
      </a>
    `)
    .join("");

  setActiveCategory(categories[0]?.id ?? null);

  getNavLinks().forEach((link) => {
    link.addEventListener("click", () => {
      const categoryId = link.dataset.category;
      if (categoryId) {
        setActiveCategory(categoryId);
      }
    });
  });
}

function initSectionObserver(categories) {
  if (!nav || !categories.length || typeof IntersectionObserver !== "function") {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visibleEntry) return;
      const categoryId = visibleEntry.target.getAttribute("data-category-id");
      if (categoryId) {
        setActiveCategory(categoryId);
      }
    },
    {
      rootMargin: "-40% 0px -40% 0px",
      threshold: [0.2, 0.4, 0.6],
    }
  );

  categories.forEach((category) => {
    const section = document.getElementById(`case-category-${category.id}`);
    if (section) {
      section.setAttribute("data-category-id", category.id);
      observer.observe(section);
    }
  });
}

/**
 * Render case studies grid
 */
function renderCaseStudies() {
  if (!grid) return;

  const categories = sortCategories(getCaseStudyCategories());
  renderCategoryNav(categories);
  
  const html = `
    <div class="case-studies-intro">
      <h2>📚 全部案例研究</h2>
      <p>點擊任一案例深入閱讀完整分析與洞察</p>
    </div>

    ${categories.map(category => {
      const categoryStudies = caseStudies.filter(s => s.category === category.id);
      if (categoryStudies.length === 0) return '';

      return `
        <div class="category-section" id="case-category-${category.id}">
          <h3 class="category-title">
            <span class="category-badge ${category.id}">${category.label}</span>
          </h3>
          <div class="case-cards">
            ${categoryStudies.map(study => `
              <article class="case-card">
                <a href="case-study.html?id=${study.id}" class="case-card-link">
                  <div class="case-card-header">
                    <h4 class="case-card-title">${study.title}</h4>
                    <p class="case-card-subtitle">${study.titleEn}</p>
                  </div>
                  <p class="case-card-excerpt">${study.excerpt}</p>
                  <div class="case-card-tags">
                    ${study.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                  </div>
                  <div class="case-card-footer">
                    <span class="read-more">閱讀完整案例 →</span>
                  </div>
                </a>
              </article>
            `).join('')}
          </div>
        </div>
      `;
    }).join('')}

    <div class="back-to-patterns">
      <a href="index.html" class="button primary-btn">
        返回首頁
      </a>
    </div>
  `;

  grid.innerHTML = html;
  initSectionObserver(categories);
}

// Initialize
renderCaseStudies();
