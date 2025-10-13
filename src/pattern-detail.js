import { patternCatalog, patternFilters } from "./data/cases.js";
import { loadThemePreference, loadAdminLibrary } from "./storage.js";
import { applyTheme, resolveThemeId } from "./theme.js";

// Mapping of pattern IDs to their markdown source files and H2 heading
const PATTERN_SOURCE_MAP = {
  // Identifiers (身份識別)
  "avatar": { file: "Identifiers.md", heading: "Avatar" },
  "color": { file: "Identifiers.md", heading: "Color" },
  "iconography": { file: "Identifiers.md", heading: "Iconography" },
  "name": { file: "Identifiers.md", heading: "Name" },
  "personality": { file: "Identifiers.md", heading: "Personality" },
  
  // Dark Patterns (暗黑模式) - Note: markdown uses numbered headings
  "sneak-into-basket": { file: "DarkPattern.md", heading: "1. Sneak into Basket（暗中加入購物車）" },
  "scarcity": { file: "DarkPattern.md", heading: "2. Scarcity / Limited-time Message（稀缺／限時訊息）" },
  "confirmshaming": { file: "DarkPattern.md", heading: "3. Confirmshaming（羞辱式確認）" },
  "forced-enrollment": { file: "DarkPattern.md", heading: "4. Forced Enrollment（強制註冊）" },
  "hard-to-cancel": { file: "DarkPattern.md", heading: "5. Hard to Cancel（退訂阻力／Roach Motel）" },
  "social-proof": { file: "DarkPattern.md", heading: "6. Social Proof / Activity Notifications（社會認同）" },
  "misdirection": { file: "DarkPattern.md", heading: "7. Misdirection / Visual Interference（視覺誤導）" },
  "bait-and-switch": { file: "DarkPattern.md", heading: "8. Bait and Switch（誘餌陷阱）" },
  "disguised-ads": { file: "DarkPattern.md", heading: "9. Disguised Ads（偽裝廣告）" },
  "price-comparison-prevention": { file: "DarkPattern.md", heading: "10. Price Comparison Prevention（價格比較阻礙）" },
  "preselection": { file: "DarkPattern.md", heading: "11. Pre-selection（預設勾選）" },
  "nagging": { file: "DarkPattern.md", heading: "12. Nagging（持續打擾）" },
  "trick-question": { file: "DarkPattern.md", heading: "13. Trick Question（誘餌問題）" },
  "trick-wording": { file: "DarkPattern.md", heading: "14. Trick Wording（誘導性措辭）" },
  
  // Prompt Actions (提示動作)
  "auto-fill": { file: "PromptActions.md", heading: "Auto fill" },
  "chained-action": { file: "PromptActions.md", heading: "Chained action" },
  "describe": { file: "PromptActions.md", heading: "Describe" },
  "expand": { file: "PromptActions.md", heading: "Expand" },
  "inpainting": { file: "PromptActions.md", heading: "Inpainting" },
  "madlibs": { file: "PromptActions.md", heading: "Madlibs" },
  "open-input": { file: "PromptActions.md", heading: "Open input" },
  "regenerate": { file: "PromptActions.md", heading: "Regenerate" },
  "restructure": { file: "PromptActions.md", heading: "Restructure" },
  "restyle": { file: "PromptActions.md", heading: "Restyle" },
  "summary": { file: "PromptActions.md", heading: "Summary" },
  "synthesis": { file: "PromptActions.md", heading: "Synthesis" },
  "transform": { file: "PromptActions.md", heading: "Transform" },
  
  // Tuners (調整器)
  "attachments": { file: "Tuners.md", heading: "Attachments" },
  "connectors": { file: "Tuners.md", heading: "Connectors" },
  "filters": { file: "Tuners.md", heading: "Filters" },
  "model-management": { file: "Tuners.md", heading: "Model management" },
  "modes": { file: "Tuners.md", heading: "Modes" },
  "parameters": { file: "Tuners.md", heading: "Parameters" },
  "preset-styles": { file: "Tuners.md", heading: "Preset styles" },
  "saved-styles": { file: "Tuners.md", heading: "Saved styles" },
  "voice-and-tone": { file: "Tuners.md", heading: "Voice and tone" },
  
  // Wayfinders (引導器)
  "example-gallery": { file: "Wayfinders.md", heading: "Example gallery" },
  "follow-up": { file: "Wayfinders.md", heading: "Follow up" },
  "initial-cta": { file: "Wayfinders.md", heading: "Initial CTA" },
  "nudge": { file: "Wayfinders.md", heading: "Nudge" },
  "prompt-details": { file: "Wayfinders.md", heading: "Prompt details" },
  "randomize": { file: "Wayfinders.md", heading: "Randomize" },
  "suggestions": { file: "Wayfinders.md", heading: "Suggestions" },
  "templates": { file: "Wayfinders.md", heading: "Templates" },
  
  // Trust Builders (信任建立)
  "caveat": { file: "TrustBuilders.md", heading: "Caveat (警示)" },
  "consent": { file: "TrustBuilders.md", heading: "Consent (同意)" },
  "data-ownership": { file: "TrustBuilders.md", heading: "Data ownership (資料所有權)" },
  "disclosure": { file: "TrustBuilders.md", heading: "Disclosure (揭露)" },
  
  // Governors (治理器)
  "action-plan": { file: "Governors.md", heading: "Action plan" },
  "branches": { file: "Governors.md", heading: "Branches" },
  "citations": { file: "Governors.md", heading: "Citations" },
  "controls": { file: "Governors.md", heading: "Controls" },
  "cost-estimates": { file: "Governors.md", heading: "Cost estimates" },
  "draft-mode": { file: "Governors.md", heading: "Draft mode" },
  "memory": { file: "Governors.md", heading: "Memory" },
  "references": { file: "Governors.md", heading: "References" },
  "sample-response": { file: "Governors.md", heading: "Sample response" },
  "shared-vision": { file: "Governors.md", heading: "Shared vision" },
  "stream-of-thought": { file: "Governors.md", heading: "Stream of Thought" },
  "variations": { file: "Governors.md", heading: "Variations" },
  "verification": { file: "Governors.md", heading: "Verification" },
};

const state = {
  theme: resolveThemeId(loadThemePreference()),
  patternId: null,
  pattern: null,
  markdownContent: null,
};

const elements = {
  loadingState: document.getElementById("loading-state"),
  errorState: document.getElementById("error-state"),
  errorMessage: document.getElementById("error-message"),
  patternContent: document.getElementById("pattern-content"),
  patternCategory: document.getElementById("pattern-category"),
  patternTitle: document.getElementById("pattern-title"),
  patternSubtitle: document.getElementById("pattern-subtitle"),
  patternTags: document.getElementById("pattern-tags"),
  patternBody: document.getElementById("pattern-body"),
};

function init() {
  applyTheme(state.theme);
  
  // Get pattern ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  state.patternId = urlParams.get("id");
  
  if (!state.patternId) {
    showError("未指定設計模式 ID。請從模式牆選擇一個模式。");
    return;
  }
  
  // Find pattern in catalog (including custom patterns and overrides)
  loadPattern();
}

async function loadPattern() {
  // First, try to find in base catalog
  state.pattern = patternCatalog.find(p => p.id === state.patternId);
  
  // Check for overrides
  const adminLibrary = loadAdminLibrary();
  if (adminLibrary && Array.isArray(adminLibrary.patterns)) {
    const override = adminLibrary.patterns.find(
      p => p.source === "override" && p.id === state.patternId
    );
    if (override && state.pattern) {
      // Apply override
      state.pattern = {
        ...state.pattern,
        title: override.title || state.pattern.title,
        subtitle: override.subtitle || state.pattern.subtitle,
        summary: override.summary || state.pattern.summary,
        filters: override.filters || state.pattern.filters,
        isOverride: true,
      };
    }
    
    // Check for custom pattern
    if (!state.pattern) {
      const custom = adminLibrary.patterns.find(
        p => p.source === "custom" && p.id === state.patternId
      );
      if (custom) {
        state.pattern = { ...custom, isCustom: true };
      }
    }
  }
  
  if (!state.pattern) {
    showError(`找不到 ID 為「${state.patternId}」的設計模式。`);
    return;
  }
  
  // Load markdown content
  await loadMarkdownContent();
  
  // Render the pattern
  renderPattern();
}

async function loadMarkdownContent() {
  const sourceInfo = PATTERN_SOURCE_MAP[state.patternId];
  
  if (!sourceInfo) {
    // No markdown source available (probably a custom pattern)
    state.markdownContent = null;
    return;
  }
  
  try {
    const response = await fetch(`./data/patterns/${sourceInfo.file}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const fullMarkdown = await response.text();
    
    // Extract the section for this pattern (from H2 heading to next H2 or H1)
    const headingRegex = new RegExp(`^## ${escapeRegex(sourceInfo.heading)}\\s*$`, "m");
    const match = fullMarkdown.match(headingRegex);
    
    if (!match) {
      console.warn(`Could not find heading "${sourceInfo.heading}" in ${sourceInfo.file}`);
      state.markdownContent = null;
      return;
    }
    
    const startIndex = match.index + match[0].length;
    const remainingContent = fullMarkdown.slice(startIndex);
    
    // Find the next H1 or H2 heading
    const nextHeadingMatch = remainingContent.match(/^#{1,2}\s+/m);
    const endIndex = nextHeadingMatch ? nextHeadingMatch.index : remainingContent.length;
    
    state.markdownContent = remainingContent.slice(0, endIndex).trim();
  } catch (error) {
    console.error("Error loading markdown:", error);
    state.markdownContent = null;
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderPattern() {
  // Hide loading, show content
  if (elements.loadingState) elements.loadingState.style.display = "none";
  if (elements.patternContent) elements.patternContent.style.display = "block";
  
  // Render header
  if (elements.patternTitle) {
    elements.patternTitle.textContent = state.pattern.title;
  }
  
  if (elements.patternSubtitle) {
    elements.patternSubtitle.textContent = state.pattern.subtitle || "";
    elements.patternSubtitle.style.display = state.pattern.subtitle ? "block" : "none";
  }
  
  // Render category breadcrumb
  if (elements.patternCategory && state.pattern.filters && state.pattern.filters.length > 0) {
    const firstFilter = state.pattern.filters[0];
    const filterObj = patternFilters.find(f => f.id === firstFilter);
    elements.patternCategory.textContent = filterObj ? filterObj.label : firstFilter;
  }
  
  // Render tags
  if (elements.patternTags && state.pattern.filters && state.pattern.filters.length > 0) {
    elements.patternTags.innerHTML = "";
    state.pattern.filters.forEach(filterId => {
      const filterObj = patternFilters.find(f => f.id === filterId);
      const li = document.createElement("li");
      li.textContent = filterObj ? filterObj.label : filterId;
      elements.patternTags.appendChild(li);
    });
  }
  
  // Render body
  if (elements.patternBody) {
    if (state.markdownContent) {
      // Convert markdown to HTML
      elements.patternBody.innerHTML = convertMarkdownToHTML(state.markdownContent);
    } else {
      // No markdown available, show summary only
      const summaryDiv = document.createElement("div");
      summaryDiv.className = "pattern-summary-fallback";
      
      const summaryHeading = document.createElement("h2");
      summaryHeading.textContent = "概要";
      summaryDiv.appendChild(summaryHeading);
      
      const summaryText = document.createElement("p");
      summaryText.textContent = state.pattern.summary || "此模式暫無詳細說明。";
      summaryDiv.appendChild(summaryText);
      
      if (state.pattern.isCustom) {
        const note = document.createElement("p");
        note.className = "status-text info";
        note.textContent = "此為管理者自訂模式，詳細內容請洽管理者。";
        summaryDiv.appendChild(note);
      }
      
      elements.patternBody.innerHTML = "";
      elements.patternBody.appendChild(summaryDiv);
    }
  }
}

function convertMarkdownToHTML(markdown) {
  let html = markdown;
  
  // Convert H3 headings (###)
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  
  // Convert H4 headings (####)
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  
  // Convert bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  
  // Convert italic (*text* or _text_)
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");
  
  // Convert inline code (`code`)
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  
  // Convert unordered lists
  const listPattern = /^[\s]*[-*+]\s+(.+)$/gm;
  let inList = false;
  const lines = html.split("\n");
  const processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const listMatch = line.match(/^[\s]*([-*+])\s+(.+)$/);
    
    if (listMatch) {
      if (!inList) {
        processedLines.push("<ul>");
        inList = true;
      }
      processedLines.push(`<li>${listMatch[2]}</li>`);
    } else {
      if (inList && line.trim() === "") {
        processedLines.push("</ul>");
        inList = false;
      }
      processedLines.push(line);
    }
  }
  
  if (inList) {
    processedLines.push("</ul>");
  }
  
  html = processedLines.join("\n");
  
  // Convert ordered lists
  const orderedListPattern = /^[\s]*\d+\.\s+(.+)$/gm;
  inList = false;
  const lines2 = html.split("\n");
  const processedLines2 = [];
  
  for (let i = 0; i < lines2.length; i++) {
    const line = lines2[i];
    const listMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
    
    if (listMatch) {
      if (!inList) {
        processedLines2.push("<ol>");
        inList = true;
      }
      processedLines2.push(`<li>${listMatch[1]}</li>`);
    } else {
      if (inList && line.trim() === "") {
        processedLines2.push("</ol>");
        inList = false;
      }
      processedLines2.push(line);
    }
  }
  
  if (inList) {
    processedLines2.push("</ol>");
  }
  
  html = processedLines2.join("\n");
  
  // Convert paragraphs (lines not already in HTML tags)
  const paragraphLines = html.split("\n");
  const finalLines = [];
  let currentParagraph = [];
  
  for (let i = 0; i < paragraphLines.length; i++) {
    const line = paragraphLines[i].trim();
    
    // Check if line is already an HTML tag or empty
    if (!line || line.startsWith("<")) {
      // Flush current paragraph if exists
      if (currentParagraph.length > 0) {
        finalLines.push(`<p>${currentParagraph.join(" ")}</p>`);
        currentParagraph = [];
      }
      if (line) {
        finalLines.push(line);
      }
    } else {
      currentParagraph.push(line);
    }
  }
  
  // Flush any remaining paragraph
  if (currentParagraph.length > 0) {
    finalLines.push(`<p>${currentParagraph.join(" ")}</p>`);
  }
  
  return finalLines.join("\n");
}

function showError(message) {
  if (elements.loadingState) elements.loadingState.style.display = "none";
  if (elements.patternContent) elements.patternContent.style.display = "none";
  if (elements.errorState) elements.errorState.style.display = "block";
  if (elements.errorMessage) elements.errorMessage.textContent = message;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
