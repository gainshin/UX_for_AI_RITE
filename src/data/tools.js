export const toolCategories = [
  { id: "all", label: "全部工具" },
  { id: "ai-ux-design", label: "AI in UX Design" },
  { id: "ux-communities", label: "UX Communities & Resources" },
  { id: "ai-pattern-library", label: "AI Pattern Library & UI Repository" },
  { id: "ai-ux-research", label: "AI-aided UX Research" },
];

export const topCategoryIds = [
  "ai-ux-design",
  "ux-communities",
  "ai-pattern-library",
  "ai-ux-research",
];

export const toolLibrary = [
  {
    id: "uxpilot",
    title: "UXPilot",
    summary:
      "用最靈活的 AI 模型生成線框稿與 UI 設計，縮短產品設計交付週期。",
    description:
      "UXPilot 支援高保真設計、原型與程式碼輸出，可依靈感參考快速建構專屬介面，並整合 Figma、團隊協作與資料驅動設計流程。",
    categories: ["ai-ux-design"],
    highlights: ["AI 線框生成", "Figma 整合", "精選推薦"],
    websiteUrl: "https://uxpilot.ai/",
    learnMoreUrl: "https://uxpilot.ai/features",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://uxpilot.ai/",
  },
  {
    id: "uizard",
    title: "Uizard",
    summary:
      "介面簡單易用的生成式設計工具，像操作簡報一樣快速做出 App 與網站草圖。",
    description:
      "Uizard 讓初學者也能利用 AI 產出互動稿與多種版面變化，並支援團隊協作與跨平台設計交付，適合快速驗證 AI 構想。",
    categories: ["ai-ux-design"],
    highlights: ["低門檻操作", "一鍵生成版面"],
    websiteUrl: "https://uizard.io/",
    learnMoreUrl: "https://uizard.io/use-cases/",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://uizard.io/",
  },
  {
    id: "visily",
    title: "Visily",
    summary:
      "零學習門檻的 AI 設計平台，幾分鐘內生成高保真線框與互動原型。",
    description:
      "Visily 透過自然語言或範例上傳生成 wireframe，提供智慧元件與迭代建議，讓不同角色都能參與介面設計。",
    categories: ["ai-ux-design"],
    highlights: ["提示生成線框", "可視化協作"],
    websiteUrl: "https://www.visily.ai/",
    learnMoreUrl: "https://www.visily.ai/blog",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://www.visily.ai/",
  },
  {
    id: "magicpath",
    title: "magicpath",
    summary:
      "AI 引導式原型平台，依描述自動生成 wireframe 與 UI 草案。",
    description:
      "magicpath 支援多種設計語言，可快速生成原型並套用迭代，協助團隊進行概念驗證與專案啟動。",
    categories: ["ai-ux-design"],
    highlights: ["AI 原型建議", "多設計語言"],
    websiteUrl: "https://www.magicpath.ai/",
    learnMoreUrl: "https://www.magicpath.ai/",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://www.magicpath.ai/",
  },
  {
    id: "nngroup",
    title: "Nielsen Norman Group",
    summary:
      "全球領先的 UX 研究與顧問公司，提供大量實證研究與專業課程。",
    description:
      "Nielsen Norman Group 匯集前沿的 UX 研究文章、認證課程與企業訓練，協助團隊建立 AI 產品中的體驗與治理策略。",
    categories: ["ux-communities"],
    highlights: ["研究報告", "專業認證"],
    websiteUrl: "https://www.nngroup.com/",
    learnMoreUrl: "https://www.nngroup.com/articles/",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://www.nngroup.com/",
  },
  {
    id: "ux-for-ai",
    title: "UX For AI",
    summary:
      "聚焦 AI 產品實務的社群與資源庫，分享設計指南、案例與研究。",
    description:
      "UX For AI 蒐集 AI 體驗設計最佳實務、訪談與工具指南，協助團隊掌握人機協作、治理與策略方法。",
    categories: ["ux-communities"],
    highlights: ["精選推薦", "案例解析"],
    websiteUrl: "https://www.uxforai.com/",
    learnMoreUrl: "https://www.uxforai.com/resources",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://www.uxforai.com/",
  },
  {
    id: "ux-collective",
    title: "UX Collective",
    summary:
      "聚焦人工智慧與體驗策略的專欄，提供全球設計師投稿與洞察。",
    description:
      "UX Collective 透過策展整理 AI 產品設計、研究與治理案例，協助設計師掌握趨勢並建立共同語言。",
    categories: ["ux-communities"],
    highlights: ["全球案例", "策展文章"],
    websiteUrl: "https://uxdesign.cc/",
    learnMoreUrl: "https://uxdesign.cc/archive",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://uxdesign.cc/",
  },
  {
    id: "adplist",
    title: "ADPList",
    summary:
      "設計人與產品人尋找導師的國際平台，支援一對一指導與社群交流。",
    description:
      "ADPList 匯聚全球設計、產品與研究領域的導師與 mentee，提供職涯諮詢、線上活動與專題分享，強化 AI 時代的技能成長。",
    categories: ["ux-communities"],
    highlights: ["導師諮詢", "社群活動"],
    websiteUrl: "https://www.adplist.org/",
    learnMoreUrl: "https://www.adplist.org/events",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://www.adplist.org/",
  },
  {
    id: "mobbin",
    title: "Mobbin",
    summary:
      "全球最大 UI pattern 資料庫，精選多平台截圖與流程供研究。",
    description:
      "Mobbin 收錄超過 40 萬張 iOS、Android 與 Web 截圖，可依產品、頁面與元件分類搜尋，適合研究熱門產業與商業產品流程。",
    categories: ["ai-pattern-library"],
    highlights: ["精選推薦", "多維度篩選"],
    websiteUrl: "https://mobbin.com/",
    learnMoreUrl: "https://mobbin.com/browse",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://mobbin.com/",
  },
  {
    id: "magicpatterns",
    title: "MagicPatterns",
    summary:
      "AI UI 設計與元件組合平台，一鍵生成高品質介面與設計系統。",
    description:
      "MagicPatterns 能依需求快速產生 UI patterns 或整頁設計，並與 Figma、程式碼輸出整合，協助團隊維護一致的 AI 產品介面。",
    categories: ["ai-pattern-library"],
    highlights: ["AI 元件生成", "Figma 整合"],
    websiteUrl: "https://www.magicpatterns.com/",
    learnMoreUrl: "https://www.magicpatterns.com/templates",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://www.magicpatterns.com/",
  },
  {
    id: "ui-notes",
    title: "UI Notes",
    summary:
      "聚焦華語市場的 UI pattern 資料庫，收錄超過 10 萬張 iOS 截圖。",
    description:
      "UI Notes 以中國市場產品為主，提供細緻功能分類與元件標註，適合研究華語地區的排版與互動細節。",
    categories: ["ai-pattern-library"],
    highlights: ["華語案例", "功能細緻分類"],
    websiteUrl: "https://uinotes.com/",
    learnMoreUrl: "https://uinotes.com/app",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://uinotes.com/",
  },
  {
    id: "saas-landing-page",
    title: "SaaS Landing Page",
    summary:
      "整理 SaaS 產品的 landing page 與 onboarding 範例，快速蒐集靈感。",
    description:
      "SaaS Landing Page 專注 SaaS 業務的行銷與轉換場景，提供大量首頁流程截圖與分類，協助團隊設計 AI 產品的進入體驗。",
    categories: ["ai-pattern-library"],
    highlights: ["SaaS 範例", "轉換流程"],
    websiteUrl: "https://saaslandingpage.com/",
    learnMoreUrl: "https://saaslandingpage.com/category/all",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://saaslandingpage.com/",
  },
  {
    id: "adapty",
    title: "Adapty Paywall Gallery",
    summary:
      "專注付費牆與訂閱流程的 UI 資料庫，展示多種成長策略。",
    description:
      "Adapty 整理各產業的訂閱與 paywall 設計，提供篩選與下載功能，幫助團隊優化 AI 服務的轉換與留存體驗。",
    categories: ["ai-pattern-library"],
    highlights: ["訂閱案例", "指標洞察"],
    websiteUrl: "https://adapty.io/paywall-design-gallery/",
    learnMoreUrl: "https://adapty.io/blog/",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://adapty.io/paywall-design-gallery/",
  },
  {
    id: "usersnap",
    title: "Usersnap",
    summary:
      "全方位用戶回饋平台，整合截圖、內嵌調查與版本公告。",
    description:
      "Usersnap 支援產品內嵌回饋、錯誤回報與 CSAT 調查，協助團隊蒐集 AI 服務的體驗洞察並建立優先順序。",
    categories: ["ai-ux-research"],
    highlights: ["即時回饋", "多渠道整合"],
    websiteUrl: "https://usersnap.com/",
    learnMoreUrl: "https://usersnap.com/blog",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://usersnap.com/",
  },
  {
    id: "theydo",
    title: "TheyDo",
    summary:
      "AI 驅動的用戶旅程管理平台，自動化整理需求流程。",
    description:
      "TheyDo 協助團隊用 AI 分析旅程洞察、對齊策略與優先事項，提供治理儀表板與跨部門協作功能。",
    categories: ["ai-ux-research"],
    highlights: ["精選推薦", "旅程管理", "AI 洞察"],
    websiteUrl: "https://www.theydo.com/",
    learnMoreUrl: "https://www.theydo.com/resources",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://www.theydo.com/",
  },
  {
    id: "maze",
    title: "Maze",
    summary:
      "自動化 UX 研究平台，快速建立測試並分析用戶行為。",
    description:
      "Maze 提供原型連結、問卷與行為分析，可即時產生報表，協助 AI 產品團隊驗證功能並追蹤風險指標。",
    categories: ["ai-ux-research"],
    highlights: ["自動化報表", "遠端測試"],
    websiteUrl: "https://maze.co/",
    learnMoreUrl: "https://maze.co/resources/blog/",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://maze.co/",
  },
  {
    id: "userzoom",
    title: "UserZoom",
    summary:
      "整合式 UX 研究平台，提供問卷、任務測試與專業分析。",
    description:
      "UserZoom 讓研究員部署遠端可用性測試並生成洞察報表，支援追蹤 AI 功能的成功率與治理需求。",
    categories: ["ai-ux-research"],
    highlights: ["遠端測試", "洞察儀表板"],
    websiteUrl: "https://www.userzoom.com/",
    learnMoreUrl: "https://www.userzoom.com/resources/",
    screenshotUrl:
      "https://image.thum.io/get/width/960/https://www.userzoom.com/",
  },
];
