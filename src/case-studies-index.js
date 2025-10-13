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

/**
 * Render case studies grid
 */
function renderCaseStudies() {
  if (!grid) return;

  const categories = getCaseStudyCategories();
  
  const html = `
    <div class="case-studies-intro">
      <h2>📚 全部案例研究</h2>
      <p>點擊任一案例深入閱讀完整分析與洞察</p>
    </div>

    ${categories.map(category => {
      const categoryStudies = caseStudies.filter(s => s.category === category.id);
      if (categoryStudies.length === 0) return '';

      return `
        <div class="category-section">
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
}

// Initialize
renderCaseStudies();
