/**
 * Case Study Catalog
 * Deep dive case studies extracted from pattern markdown files
 */

export const caseStudies = [
  {
    id: "temu-dark-patterns",
    title: "Temu 的暗黑模式與過度遊戲化",
    titleEn: "Temu's Dark Patterns and Over-Gamification",
    category: "dark-patterns",
    categoryLabel: "暗黑模式 Dark Patterns",
    source: "data/patterns/DarkPattern.md",
    startLine: 73,
    endLine: 102,
    excerpt: "深入分析 Temu 如何透過遊戲化、急迫感、社會認同等暗黑模式機制，誘導用戶持續消費與傳播。",
    tags: ["遊戲化", "急迫感", "社會認同", "電商"],
    relatedPatterns: ["scarcity", "urgency", "nagging"]
  },
  {
    id: "claude-perplexity-collaboration",
    title: "Claude 與 Perplexity 的人機協作功能",
    titleEn: "Claude & Perplexity Human-AI Collaboration",
    category: "governors",
    categoryLabel: "治理層 Governors",
    source: "data/patterns/Governors.md",
    startLine: 481,
    endLine: 554,
    excerpt: "檢視主流 AI 系統的人機協作功能實作，分析透明度機制、控制權保障與潛在的暗黑模式風險。",
    tags: ["透明度", "控制權", "驗證機制", "人機協作"],
    relatedPatterns: ["citations", "stream-of-thought", "verification"]
  },
  {
    id: "ecommerce-ai-operations",
    title: "電商 AI 操作全覽",
    titleEn: "E-commerce AI Operations Overview",
    category: "prompt-actions",
    categoryLabel: "提示行動 Prompt Actions",
    source: "data/patterns/PromptActions.md",
    startLine: 493,
    endLine: 592,
    excerpt: "全面解析電商情境下，使用者如何引導 AI 完成各類操作，從商品搜尋到售後服務的完整流程。",
    tags: ["電商", "操作流程", "用戶引導", "AI助理"],
    relatedPatterns: ["auto-fill", "open-input", "summary"]
  },
  {
    id: "ai-recruitment-assistant",
    title: "AI 招聘助理系統",
    titleEn: "AI Recruitment Assistant System",
    category: "tuners",
    categoryLabel: "調諧器 Tuners",
    source: "data/patterns/Tuners.md",
    startLine: 366,
    endLine: 417,
    excerpt: "分析 AI 招聘系統如何透過 Tuners 功能協助面試安排，並探討其中的暗黑模式風險與倫理考量。",
    tags: ["招聘", "面試", "個人化", "倫理風險"],
    relatedPatterns: ["parameters", "voice-and-tone", "modes"]
  },
  {
    id: "social-trust-building",
    title: "社交平台的信任建立機制",
    titleEn: "Social Platform Trust Building Mechanisms",
    category: "trust-builders",
    categoryLabel: "信任建立 Trust Builders",
    source: "data/patterns/TrustBuilders.md",
    startLine: 157,
    endLine: 225,
    excerpt: "探討社交平台如何建立用戶信任，包含身份驗證、內容審核、社群規範等機制，以及潛在的暗黑模式陷阱。",
    tags: ["社交平台", "信任機制", "內容審核", "社群治理"],
    relatedPatterns: ["disclosure", "consent", "data-ownership"]
  }
];

/**
 * Get case study by ID
 */
export function getCaseStudyById(id) {
  return caseStudies.find(study => study.id === id);
}

/**
 * Get case studies by category
 */
export function getCaseStudiesByCategory(category) {
  return caseStudies.filter(study => study.category === category);
}

/**
 * Get all case study categories
 */
export function getCaseStudyCategories() {
  const categories = new Map();
  caseStudies.forEach(study => {
    if (!categories.has(study.category)) {
      categories.set(study.category, {
        id: study.category,
        label: study.categoryLabel
      });
    }
  });
  return Array.from(categories.values());
}
