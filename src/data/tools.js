export const toolCategories = [
  { id: "all", label: "全部工具" },
  { id: "ai-ux-design", label: "AI in UX Design" },
  { id: "ux-analysis", label: "UX Analysis" },
  { id: "ux-communities", label: "UX Communities & Resources" },
  { id: "ux-design", label: "UX Design" },
  { id: "ux-prototyping", label: "UX Prototyping" },
  { id: "ux-research", label: "UX Research" },
  { id: "ux-wireframing", label: "UX Wireframing" },
];

export const topCategoryIds = [
  "ai-ux-design",
  "ux-analysis",
  "ux-design",
  "ux-prototyping",
  "ux-research",
];

export const toolLibrary = [
  {
    id: "colormind",
    title: "Colormind",
    summary:
      "以 AI 生成調色盤，幫助 UX 團隊快速建立符合品牌與情緒的色彩系統。",
    description:
      "Colormind 透過深度學習模型分析熱門網站與介面設計，提供可立即套用的色彩樣式，支援匯出到設計工具或 CSS 變數。",
    categories: ["ai-ux-design", "ux-design"],
    highlights: ["AI 調色建議", "CSS 匯出"],
    websiteUrl: "https://colormind.io/",
    learnMoreUrl: "https://colormind.io/bootstrap/",
    screenshotUrl:
      "https://images.unsplash.com/photo-1523473827534-86c5ad62e87b?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "creatie",
    title: "Creatie",
    summary:
      "智慧生成情境腳本與素材，讓設計團隊能快速試驗 AI 互動。",
    description:
      "Creatie 結合情境生成與原型腳本管理，可將價值矩陣的後端情境自動轉換成使用者故事與 mock scripts。",
    categories: ["ai-ux-design"],
    highlights: ["場景生成", "跨部門協作"],
    websiteUrl: "https://www.creatie.ai/",
    learnMoreUrl: "https://www.creatie.ai/blog",
    screenshotUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "uizard",
    title: "Uizard",
    summary:
      "透過拖拉與 AI 輔助快速建立互動原型，縮短驗證時間。",
    description:
      "Uizard 支援草圖轉原型、元件系統管理以及多人協作，適合用於 AI 服務早期旅程的快速迭代。",
    categories: ["ux-prototyping", "ux-design"],
    highlights: ["草圖轉原型", "多人協作"],
    websiteUrl: "https://uizard.io/",
    learnMoreUrl: "https://uizard.io/use-cases/",
    screenshotUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "visily",
    title: "Visily",
    summary:
      "以 AI 加速線框與 UI 元件建立，支援產品團隊即時協作。",
    description:
      "Visily 讓跨部門夥伴可利用文字提示產生線框範本，並提供可視化設計系統管理。",
    categories: ["ux-wireframing", "ux-prototyping"],
    highlights: ["提示生成線框", "設計系統"],
    websiteUrl: "https://www.visily.ai/",
    learnMoreUrl: "https://www.visily.ai/blog",
    screenshotUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "balsamiq",
    title: "Balsamiq",
    summary:
      "經典低保真線框工具，適合主持跨部門討論與驗證。",
    description:
      "Balsamiq 以手繪風格強化討論氛圍，並提供元件庫與模板，快速表達 AI 服務流程。",
    categories: ["ux-wireframing", "ux-communities"],
    highlights: ["低保真","元件模板"],
    websiteUrl: "https://balsamiq.com/",
    learnMoreUrl: "https://balsamiq.com/learn/",
    screenshotUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "proto-pie",
    title: "ProtoPie",
    summary:
      "高互動原型工具，打造具真實感的 AI 體驗與邏輯。",
    description:
      "ProtoPie 支援感測器、變數與邏輯條件，可模擬語音、情境與硬體互動，適合劇場式演練。",
    categories: ["ux-prototyping", "ux-research"],
    highlights: ["多裝置互動", "條件邏輯"],
    websiteUrl: "https://www.protopie.io/",
    learnMoreUrl: "https://www.protopie.io/blog",
    screenshotUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "userzoom",
    title: "UserZoom",
    summary:
      "整合式 UX 研究平台，支援問卷、任務測試與分析報告。",
    description:
      "UserZoom 讓研究員能快速部署 AI 功能的遠端可用性測試，並提供風險指標報表。",
    categories: ["ux-research", "ux-analysis"],
    highlights: ["遠端測試", "洞察報表"],
    websiteUrl: "https://www.userzoom.com/",
    learnMoreUrl: "https://www.userzoom.com/resources/",
    screenshotUrl:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "lookback",
    title: "Lookback",
    summary:
      "即時訪談與使用者錄影工具，強化觀察與跨團隊協作。",
    description:
      "Lookback 提供同步訪談、標註與分享功能，適合追蹤 AI 產品風險與決策證據。",
    categories: ["ux-research"],
    highlights: ["同步訪談", "觀察標註"],
    websiteUrl: "https://lookback.io/",
    learnMoreUrl: "https://lookback.io/blog/",
    screenshotUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "figma",
    title: "Figma",
    summary:
      "雲端協作設計平台，整合設計系統、原型與交付流程。",
    description:
      "Figma 支援多人即時編輯、插件擴充以及開發交付檔案，比較適合長期維護 AI 產品設計資產。",
    categories: ["ux-design", "ux-prototyping"],
    highlights: ["設計系統", "開發交付"],
    websiteUrl: "https://www.figma.com/",
    learnMoreUrl: "https://www.figma.com/community",
    screenshotUrl:
      "https://images.unsplash.com/photo-1587614382346-4ec892f9aca3?auto=format&fit=crop&w=960&q=80",
  },
  {
    id: "lucky-orange",
    title: "Lucky Orange",
    summary:
      "行為分析與熱圖工具，快速掌握 AI 服務的轉換瓶頸。",
    description:
      "Lucky Orange 提供錄影重播、熱圖與漏斗分析，能將觀察用於價值矩陣的 TP/FP/FN 訊號管理。",
    categories: ["ux-analysis"],
    highlights: ["轉換熱圖", "漏斗分析"],
    websiteUrl: "https://www.luckyorange.com/",
    learnMoreUrl: "https://www.luckyorange.com/blog",
    screenshotUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=960&q=80",
  },
];
