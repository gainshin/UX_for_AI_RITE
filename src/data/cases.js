export const methodLibrary = [
  {
    id: "phase-ai-intent-sensing",
    chapter: "01",
    title: "AI 意圖感知",
    subtitle: "感知策略趨勢與風險假設",
    description:
      "整合市場脈動、資料跡證與初步田野觀察，為 AI 專案定義意圖、機會與風險假設，建立跨部門的共同語言。",
    phaseLabel: "AI 意圖感知",
    groups: [
      {
        id: "trend-scan",
        title: "趨勢掃描與資料盤點",
        items: [
          { id: "preparatory-research", title: "Preparatory research" },
          { id: "secondary-research", title: "Secondary research" },
        ],
      },
      {
        id: "self-community-insights",
        title: "自我與社群洞察",
        items: [
          { id: "autoethnography", title: "Autoethnography" },
          { id: "online-ethnography", title: "Online ethnography" },
        ],
      },
      {
        id: "field-inquiry",
        title: "情境訪談與參與觀察",
        items: [
          { id: "participant-observation", title: "Participant observation" },
          { id: "contextual-interview", title: "Contextual interview" },
        ],
      },
    ],
  },
  {
    id: "phase-ai-context-insight",
    chapter: "02",
    title: "AI 情境洞察",
    subtitle: "串聯場景、旅程與利害關係",
    description:
      "將研究輸出的故事、網絡與情感訊號轉譯為洞察框架，鎖定 AI 介入的正向價值與高風險斷點。",
    phaseLabel: "AI 情境洞察",
    groups: [
      {
        id: "journey-context",
        title: "旅程洞察與情境定位",
        items: [
          { id: "ideas-from-future-journey", title: "Ideas from future-state journey mapping" },
          { id: "journey-ideation-arcs", title: "Journey ideation with dramatic arcs" },
        ],
      },
      {
        id: "systems-mapping",
        title: "系統圖譜與利害關係",
        items: [{ id: "future-state-network", title: "Ideas from future-state network mapping" }],
      },
      {
        id: "challenge-framing",
        title: "議題拆解與聚焦",
        items: [{ id: "slicing-the-elephant", title: "Slicing the elephant" }],
      },
    ],
  },
  {
    id: "phase-ai-concept-exploration",
    chapter: "03",
    title: "AI 概念探索",
    subtitle: "以劇場與敘事驗證體驗假設",
    description:
      "透過多感官敘事、劇場排演與對話草圖，生成候選體驗概念，並檢視價值矩陣假設的可行性。",
    phaseLabel: "AI 概念探索",
    groups: [
      {
        id: "theatrical-concepts",
        title: "劇場式構想實驗",
        items: [{ id: "theatrical-methods", title: "Theatrical methods – An introduction" }],
      },
      {
        id: "dialogue-scripting",
        title: "對話情緒腳本",
        items: [{ id: "subtext", title: "Subtext" }],
      },
      {
        id: "multisensory-design",
        title: "體驗語感設計",
        items: [{ id: "aeseo-ergonomics", title: "AESEO – The ergonomics of need" }],
      },
    ],
  },
  {
    id: "phase-ai-solution-validation",
    chapter: "04",
    title: "AI 方案驗證",
    subtitle: "校準服務流程與護欄設計",
    description:
      "以劇場壓力測試、服務流程驗證與實體模擬，評估 AI 方案的風險管理、體驗品質與實施條件。",
    phaseLabel: "AI 方案驗證",
    groups: [
      {
        id: "investigative-stress-test",
        title: "劇場壓力測試",
        items: [{ id: "investigative-rehearsal", title: "Investigative rehearsal" }],
      },
      {
        id: "service-prototype",
        title: "服務流程驗證",
        items: [
          { id: "desktop-walkthrough", title: "Desktop walkthrough" },
          { id: "redesigning-digital-services", title: "Redesigning digital services" },
        ],
      },
      {
        id: "spatial-prototyping",
        title: "實體情境模擬",
        items: [{ id: "cardboard-prototyping", title: "Cardboard prototyping" }],
      },
    ],
  },
  {
    id: "phase-ai-governance",
    chapter: "05",
    title: "AI 治理實現",
    subtitle: "建立倫理節奏與跨域協作",
    description:
      "以共感暖身、風險檢核與決策節奏整合治理需求，確保 AI 方案在落地過程中可持續對齊價值。",
    phaseLabel: "AI 治理實現",
    groups: [
      {
        id: "ethics-warmups",
        title: "倫理暖身與共感",
        items: [
          { id: "three-brain-warmup", title: "Three-brain warm-up" },
          { id: "color-chain-warmup", title: "Color-chain warm-up" },
          { id: "yes-and-warmup", title: '"Yes, and …" warm-up' },
        ],
      },
      {
        id: "risk-reviews",
        title: "風險檢核與決策對齊",
        items: [{ id: "red-green-feedback", title: "Red and green feedback" }],
      },
    ],
  },
];

export const methodDetails = {
  "theatrical-methods": {
    id: "theatrical-methods",
    title: "Theatrical methods – An introduction",
    chapter: "Chapter 7 · Prototyping",
    summary:
      "Theater offers many methods which can be used to investigate, ideate, prototype, and roll out both physical and digital services.",
    lead:
      "They are powerful tools to investigate emotion, timing, tone of voice, and the practicalities of space across service blueprints.",
    tags: ["Prototyping", "Embodied research", "Co-creation"],
    meta: [
      { label: "適用場景", value: "高風險或跨場域 AI 服務演練" },
      { label: "工作坊時長", value: "90 – 150 分鐘" },
      { label: "參與角色", value: "產品、法務、客服、信任安全" },
    ],
    sections: [
      {
        heading: "Why?",
        body: [
          {
            type: "paragraph",
            text:
              "Services, as co-created value exchanges, are fundamentally human interactions. Even in digital-first journeys the technological platform mirrors the functions of a human being as it processes orders, connects people, or sells tickets.",
          },
          {
            type: "paragraph",
            text:
              "Theater offers perhaps the ultimate toolkit to model, prototype, and play around with human–human or human–digital interactions. With thousands of years of practice, the performing arts provide a vocabulary that everyone on a team can access without specialist training.",
          },
        ],
      },
      {
        heading: "How it works",
        body: [
          {
            type: "list",
            style: "numbered",
            items: [
              "Frame the service moment as a short scene with a clear beginning, turning point, and desired outcome.",
              "Assign roles for human actors, AI agents, backstage systems, and props. Encourage exaggeration to uncover edge cases.",
              "Run iterative rehearsals, pausing to capture observations about emotion, timing, risk, and accessibility gaps.",
            ],
          },
          {
            type: "paragraph",
            text:
              "Invite observers to annotate what is happening on and off the " +
              "stage. Use their notes to enrich the value matrix with tangible signals, safeguards, and escalation paths.",
          },
        ],
      },
      {
        heading: "Tips",
        body: [
          {
            type: "list",
            style: "unordered",
            items: [
              "Use lightweight props (卡片、便利貼、板擦) 讓抽象的資料流具象化。",
              "讓法務或合規角色扮演『舞台監督』，確保每個情境都涵蓋風險通報。",
              "紀錄聲音、表情、停頓等非語言訊號，作為調整召回率/準確率平衡的輔助依據。",
            ],
          },
        ],
      },
    ],
    references: [
      "Goffman, E. (1959). The Presentation of Self in Everyday Life. Anchor Books.",
      "Fisk, R. P., & Grove, S. J. (2012). A Performing Arts Perspective on Service Design. Touchpoint 4(2).",
    ],
    resources: [
      {
        label: "Download chapter (PDF)",
        description: "完整劇場方法章節，含工作坊流程與檢核清單。",
        href: "#",
      },
      {
        label: "Download single extra",
        description: "快速啟動的角色卡與場景腳本樣板。",
        href: "#",
      },
    ],
  },
  "preparatory-research": {
    id: "preparatory-research",
    title: "Preparatory research",
    chapter: "Chapter 5 · Research",
    summary:
      "Map existing knowledge, signals, and blind spots before kicking off live fieldwork for your AI value matrix.",
    lead:
      "適合在計畫啟動前兩週進行，幫助團隊釐清優先假設與資料需求。",
    tags: ["Research", "Desk study", "Risk framing"],
    sections: [
      {
        heading: "Checklist",
        body: [
          {
            type: "list",
            style: "unordered",
            items: [
              "盤點內部文件、使用者回饋、過往模型評估報告。",
              "標註與 TP/FP/FN/TN 相關的真實案例，量化成本。",
              "整理尚未覆蓋的脆弱族群與資料來源，預先安排後續訪談。",
            ],
          },
        ],
      },
      {
        heading: "Deliverables",
        body: [
          {
            type: "paragraph",
            text:
              "輸出包含假設地圖、資料來源表、以及需追蹤的倫理或合規議題條列，供跨部門共用。",
          },
        ],
      },
    ],
    references: ["PrivacyUX internal desk review rubric"],
    resources: [],
  },
  "secondary-research": {
    id: "secondary-research",
    title: "Secondary research",
    chapter: "Chapter 5 · Research",
    summary:
      "快速掃描已發表的報告、政策與數據集，補足價值矩陣所需的外部脈絡。",
    lead: "聚焦於可信度高的公開資料，如監管單位白皮書與產業基準研究。",
    tags: ["Research", "Policy", "Benchmark"],
    sections: [
      {
        heading: "Workflow",
        body: [
          {
            type: "list",
            style: "numbered",
            items: [
              "界定感興趣的關鍵字：如 " +
                "bias mitigation、incident report、governance baseline。",
              "鎖定政府、學術、產業三大來源，為每個來源記錄資料品質與出版日期。",
              "摘要每份文件對誤報/漏報的敘述，轉換成可量化的風險指標。",
            ],
          },
        ],
      },
    ],
    references: ["OECD AI Incidents Monitor", "MITRE ATLAS"],
    resources: [],
  },
  "autoethnography": {
    id: "autoethnography",
    title: "Autoethnography",
    chapter: "Chapter 5 · Research",
    summary:
      "以研究者自身的使用情境紀錄，探索價值矩陣在真實生活中的摩擦點。",
    lead:
      "透過結合日誌與情緒標記，挖掘決策流程中被忽略的暗黑路徑。",
    tags: ["Research", "Self-ethnography"],
    sections: [
      {
        heading: "紀錄建議",
        body: [
          {
            type: "paragraph",
            text:
              "設定至少一週的觀察期，使用時間戳記、截圖與語音備忘錄搭配，捕捉跨渠道的細節。",
          },
        ],
      },
    ],
    references: [],
    resources: [],
  },
  "online-ethnography": {
    id: "online-ethnography",
    title: "Online ethnography",
    chapter: "Chapter 5 · Research",
    summary:
      "觀察線上社群、評價與論壇，了解使用者如何實際協商 AI 工具的價值與風險。",
    lead:
      "特別適合監測高波動或快速演化的情境，例如詐騙手法或政策辯論。",
    tags: ["Research", "Community listening"],
    sections: [],
    references: [],
    resources: [],
  },
  "participant-observation": {
    id: "participant-observation",
    title: "Participant observation",
    chapter: "Chapter 5 · Research",
    summary:
      "讓研究者實際參與服務流程，貼近決策與情緒節點。",
    lead: "與一線人員共同執行任務，記錄制度護欄與人工作業之間的落差。",
    tags: ["Research", "Fieldwork"],
    sections: [],
    references: [],
    resources: [],
  },
  "contextual-interview": {
    id: "contextual-interview",
    title: "Contextual interview",
    chapter: "Chapter 5 · Research",
    summary:
      "在實際環境中進行訪談，邊操作邊追問決策依據與錯誤成本。",
    lead: "搭配價值矩陣四象限提問法，捕捉細節。",
    tags: ["Research", "Interview"],
    sections: [],
    references: [],
    resources: [],
  },
  "slicing-the-elephant": {
    id: "slicing-the-elephant",
    title: "Slicing the elephant",
    chapter: "Chapter 6 · Ideation",
    summary:
      "將複雜挑戰拆解為可行的子題，避免一次討論過多變因。",
    lead: "適合開場暖身，讓團隊迅速聚焦。",
    tags: ["Ideation", "Framing"],
    sections: [],
    references: [],
    resources: [],
  },
  "ideas-from-future-journey": {
    id: "ideas-from-future-journey",
    title: "Ideas from future-state journey mapping",
    chapter: "Chapter 6 · Ideation",
    summary:
      "運用未來旅程藍圖挖掘 AI 介入點，並標記需要的護欄。",
    lead: "將價值矩陣放在每個旅程觸點旁作為檢查節點。",
    tags: ["Ideation", "Journey mapping"],
    sections: [],
    references: [],
    resources: [],
  },
  "aeseo-ergonomics": {
    id: "aeseo-ergonomics",
    title: "AESEO – The ergonomics of need",
    chapter: "Chapter 6 · Ideation",
    summary:
      "以五感與情緒評估 AI 介面需求，確保建議不偏離人性化體驗。",
    lead: "搭配實物道具或音效模擬，討論信任指標。",
    tags: ["Ideation", "Experience"],
    sections: [],
    references: [],
    resources: [],
  },
  "journey-ideation-arcs": {
    id: "journey-ideation-arcs",
    title: "Journey ideation with dramatic arcs",
    chapter: "Chapter 6 · Ideation",
    summary:
      "將旅程轉換為戲劇弧線，強化情緒轉折與協作節點。",
    lead: "與價值矩陣搭配時，可快速定位風險緩衝點。",
    tags: ["Ideation", "Story"],
    sections: [],
    references: [],
    resources: [],
  },
  "future-state-network": {
    id: "future-state-network",
    title: "Ideas from future-state network mapping",
    chapter: "Chapter 6 · Ideation",
    summary:
      "檢視跨部門與外部夥伴的資料流，為價值矩陣建立治理版圖。",
    lead: "特別適合大型平台或多方合作服務。",
    tags: ["Ideation", "Ecosystem"],
    sections: [],
    references: [],
    resources: [],
  },
  "investigative-rehearsal": {
    id: "investigative-rehearsal",
    title: "Investigative rehearsal",
    chapter: "Chapter 7 · Prototyping",
    summary:
      "以偵查劇形式重現服務，追查風險訊號與責任人。",
    lead: "適合處理高風險客訴或事故復盤。",
    tags: ["Prototyping", "Scenario"],
    sections: [],
    references: [],
    resources: [],
  },
  "subtext": {
    id: "subtext",
    title: "Subtext",
    chapter: "Chapter 7 · Prototyping",
    summary:
      "分析對話下的未說出口需求與情緒，避免 AI 回應過於冰冷。",
    lead: "搭配情緒標籤與價值矩陣檢查表。",
    tags: ["Prototyping", "Conversation"],
    sections: [],
    references: [],
    resources: [],
  },
  "desktop-walkthrough": {
    id: "desktop-walkthrough",
    title: "Desktop walkthrough",
    chapter: "Chapter 7 · Prototyping",
    summary:
      "快速搭建系統流程，檢視跨部門交接與資料防護。",
    lead: "與法律、客服共同操作最有效。",
    tags: ["Prototyping", "Service blueprint"],
    sections: [],
    references: [],
    resources: [],
  },
  "cardboard-prototyping": {
    id: "cardboard-prototyping",
    title: "Cardboard prototyping",
    chapter: "Chapter 7 · Prototyping",
    summary:
      "使用紙箱與模型重現物理服務場景，記錄安全與隱私風險。",
    lead: "搭配 IoT 或裝置導向服務時尤其實用。",
    tags: ["Prototyping", "Physical"],
    sections: [],
    references: [],
    resources: [],
  },
  "redesigning-digital-services": {
    id: "redesigning-digital-services",
    title: "Redesigning digital services",
    chapter: "Chapter 7 · Prototyping",
    summary:
      "運用價值矩陣重構 AI 介面與後台權限。",
    lead: "適合做為治理儀表板或透明度報告的雛型練習。",
    tags: ["Prototyping", "Digital"],
    sections: [],
    references: [],
    resources: [],
  },
  "three-brain-warmup": {
    id: "three-brain-warmup",
    title: "Three-brain warm-up",
    chapter: "Chapter 10 · Facilitation",
    summary:
      "用頭腦、心腦、腸腦三層思考，帶出團隊的理性與情感視角。",
    lead: "適合作為價值矩陣工作坊的開場。",
    tags: ["Facilitation", "Warm-up"],
    sections: [],
    references: [],
    resources: [],
  },
  "color-chain-warmup": {
    id: "color-chain-warmup",
    title: "Color-chain warm-up",
    chapter: "Chapter 10 · Facilitation",
    summary:
      "以顏色與身體動作連結團隊默契，建立快速應對情境。",
    lead: "鼓勵跨部門互動，降低討論門檻。",
    tags: ["Facilitation", "Energy"],
    sections: [],
    references: [],
    resources: [],
  },
  "yes-and-warmup": {
    id: "yes-and-warmup",
    title: '"Yes, and …" warm-up',
    chapter: "Chapter 10 · Facilitation",
    summary:
      "透過即興練習，把批判能量轉化為共同建構的動能。",
    lead: "幫助技術與法遵釐清彼此的語言落差。",
    tags: ["Facilitation", "Collaboration"],
    sections: [],
    references: [],
    resources: [],
  },
  "red-green-feedback": {
    id: "red-green-feedback",
    title: "Red and green feedback",
    chapter: "Chapter 10 · Facilitation",
    summary:
      "用紅綠貼紙標示風險與亮點，快速收斂行動優先權。",
    lead: "適合價值矩陣審查會議，或跨部門治理同步。",
    tags: ["Facilitation", "Feedback"],
    sections: [],
    references: [],
    resources: [],
  },
};

export const patternFilters = [
  { id: "identifiers", label: "Identifiers (身份識別)" },
  { id: "dark-patterns", label: "Dark Patterns (暗黑模式)" },
  { id: "prompt-actions", label: "Prompt Actions (提示動作)" },
  { id: "tuners", label: "Tuners (調整器)" },
  { id: "wayfinders", label: "Wayfinders (引導器)" },
  { id: "trust-builders", label: "Trust Builders (信任建立)" },
  { id: "governors", label: "Governors (治理器)" },
];

export const patternCatalog = [
  // Identifiers 類別
  {
    id: "avatar",
    title: "Avatar (頭像)",
    subtitle: "AI 身份呈現",
    summary:
      "透過視覺或聲音頭像來呈現 AI 身份，溝通狀態、錨定身份並調節使用者信任感。",
    filters: ["identifiers"],
  },
  {
    id: "color",
    title: "Color (色彩)",
    subtitle: "AI 功能標記",
    summary:
      "使用紫色、綠色等特定顏色作為視覺提示，區分 AI 生成內容與人類內容。",
    filters: ["identifiers"],
  },
  {
    id: "iconography",
    title: "Iconography (圖示)",
    subtitle: "操作符號化",
    summary:
      "使用閃爍星、魔杖、鉛筆等圖標來標示 AI 生成、編輯、摘要等操作。",
    filters: ["identifiers"],
  },
  {
    id: "name",
    title: "Name (命名)",
    subtitle: "AI 身份識別",
    summary:
      "為 AI 助理命名，建立獨特身份識別，影響使用者對其能力、角色與信任度的期待。",
    filters: ["identifiers"],
  },
  {
    id: "personality",
    title: "Personality (個性)",
    subtitle: "AI 風格定位",
    summary:
      "定義 AI 的語氣、回應風格與互動方式，建立一致的品牌體驗與使用者期待。",
    filters: ["identifiers"],
  },
  // Dark Patterns 類別
  {
    id: "sneak-into-basket",
    title: "Sneak into Basket (暗中加入購物車)",
    subtitle: "未經同意的捆綁",
    summary:
      "在結帳過程中自動將額外商品或服務加入購物車，AI 可依使用者行為動態調整觸發時機。",
    filters: ["dark-patterns"],
  },
  {
    id: "confirmshaming",
    title: "Confirmshaming (羞辱式確認)",
    subtitle: "心理壓力操縱",
    summary:
      "使用帶有責備或嘲諷的語句讓使用者在取消或拒絕時產生罪惡感，AI 可針對猶豫使用者強化此效果。",
    filters: ["dark-patterns"],
  },
  {
    id: "forced-enrollment",
    title: "Forced Enrollment (強制註冊)",
    subtitle: "功能門檻",
    summary:
      "要求使用者必須登入或提供個資才能使用功能，AI 可在使用者有流失風險時觸發此機制。",
    filters: ["dark-patterns"],
  },
  {
    id: "scarcity",
    title: "Scarcity / Limited-time Message (稀缺／限時訊息)",
    subtitle: "製造急迫感",
    summary:
      "顯示庫存不足或限時優惠訊息，AI 可根據使用者瀏覽行為動態調整稀缺性訊息的強度。",
    filters: ["dark-patterns"],
  },
  {
    id: "urgency",
    title: "Urgency Prompts (急迫性提示)",
    subtitle: "倒數與即時提醒",
    summary:
      "透過倒數計時、即時通知或閃爍提示營造急迫感，驅動使用者快速做出決策或完成交易。",
    filters: ["dark-patterns"],
  },
  {
    id: "hard-to-cancel",
    title: "Hard to Cancel (退訂阻力／Roach Motel)",
    subtitle: "進來容易出去難",
    summary:
      "使訂閱或註冊非常簡單，但取消或退出流程極為複雜，AI 可在偵測到取消意圖時增加阻力。",
    filters: ["dark-patterns"],
  },
  {
    id: "social-proof",
    title: "Social Proof / Activity Notifications (社會認同)",
    subtitle: "從眾壓力",
    summary:
      "顯示其他人的購買、瀏覽或註冊行為，AI 可生成或強化社會認同訊息來影響決策。",
    filters: ["dark-patterns"],
  },
  {
    id: "misdirection",
    title: "Misdirection / Visual Interference (視覺誤導)",
    subtitle: "分散注意力",
    summary:
      "使用視覺設計誤導使用者注意力，讓關鍵資訊或選項變得不明顯，AI 可動態調整介面元素的視覺權重。",
    filters: ["dark-patterns"],
  },
  {
    id: "bait-and-switch",
    title: "Bait and Switch (誘餌陷阱)",
    subtitle: "承諾與實際不符",
    summary:
      "承諾某項功能或價格，但在使用者採取行動後改變條件，AI 可根據使用者價值動態調整誘餌。",
    filters: ["dark-patterns"],
  },
  {
    id: "disguised-ads",
    title: "Disguised Ads (偽裝廣告)",
    subtitle: "廣告與內容混淆",
    summary:
      "將廣告偽裝成一般內容或功能，AI 可根據使用者偏好生成看似個人化推薦的廣告內容。",
    filters: ["dark-patterns"],
  },
  {
    id: "price-comparison-prevention",
    title: "Price Comparison Prevention (價格比較阻礙)",
    subtitle: "阻止比價行為",
    summary:
      "讓使用者難以比較不同選項的價格或價值，AI 可動態調整資訊呈現方式來阻礙比較。",
    filters: ["dark-patterns"],
  },
  {
    id: "preselection",
    title: "Pre-selection (預設勾選)",
    subtitle: "預設不利選項",
    summary:
      "預先勾選對企業有利但對使用者不利的選項，AI 可根據使用者行為調整預設項目。",
    filters: ["dark-patterns"],
  },
  {
    id: "nagging",
    title: "Nagging (持續打擾)",
    subtitle: "重複干擾",
    summary:
      "持續彈出通知或提示要求使用者採取行動，AI 可優化打擾頻率與時機來突破使用者抵抗。",
    filters: ["dark-patterns"],
  },
  {
    id: "trick-question",
    title: "Trick Question (誘餌問題)",
    subtitle: "問題陷阱",
    summary:
      "設計容易誤解的問題，誘導使用者做出非預期的選擇，AI 可根據使用者特徵調整問題表述。",
    filters: ["dark-patterns"],
  },
  {
    id: "trick-wording",
    title: "Trick Wording (誘導性措辭)",
    subtitle: "語言操縱",
    summary:
      "使用模糊或誤導的措辭讓使用者誤解選項含義，AI 可根據使用者理解能力調整措辭複雜度。",
    filters: ["dark-patterns"],
  },
  // Prompt Actions 類別
  {
    id: "auto-fill",
    title: "Auto fill (自動填充)",
    subtitle: "智能預測輸入",
    summary:
      "利用使用者意圖一次性自動完成單一或多個欄位，適用於重複性或可預測的輸入場景。",
    filters: ["prompt-actions"],
  },
  {
    id: "regenerate",
    title: "Regenerate (重新生成)",
    subtitle: "結果重試",
    summary:
      "允許使用者在不變更提示的情況下重新生成內容，探索不同的創意方向或改善品質。",
    filters: ["prompt-actions"],
  },
  {
    id: "restyle",
    title: "Restyle (風格重塑)",
    subtitle: "保留結構改變風格",
    summary:
      "保持內容的核心結構與訊息，但改變其呈現風格、語氣或視覺形式。",
    filters: ["prompt-actions"],
  },
  {
    id: "summary",
    title: "Summary (摘要)",
    subtitle: "資訊濃縮",
    summary:
      "將長文本、會議記錄或複雜資訊濃縮為簡潔的重點摘要，節省閱讀時間。",
    filters: ["prompt-actions"],
  },
  {
    id: "chained-action",
    title: "Chained action (鏈式操作)",
    subtitle: "多步驟自動化",
    summary:
      "將多個 AI 操作串連成自動化工作流程，前一步驟的輸出自動成為下一步驟的輸入。",
    filters: ["prompt-actions"],
  },
  {
    id: "describe",
    title: "Describe (描述)",
    subtitle: "內容說明生成",
    summary:
      "讓 AI 描述圖片、影片或複雜場景的內容，提供可訪問性支援或內容理解輔助。",
    filters: ["prompt-actions"],
  },
  {
    id: "expand",
    title: "Expand (擴展)",
    subtitle: "內容延伸",
    summary:
      "將簡短內容擴展為更詳細的版本，增加細節、範例或說明來豐富原始內容。",
    filters: ["prompt-actions"],
  },
  {
    id: "inpainting",
    title: "Inpainting (局部修復)",
    subtitle: "圖像區域編輯",
    summary:
      "選擇圖像中的特定區域進行 AI 修復或替換，保持周圍區域不變。",
    filters: ["prompt-actions"],
  },
  {
    id: "madlibs",
    title: "Madlibs (填空遊戲)",
    subtitle: "結構化填充",
    summary:
      "提供帶有空格的模板，AI 根據上下文智能填入適當的詞語或短語。",
    filters: ["prompt-actions"],
  },
  {
    id: "open-input",
    title: "Open input (開放輸入)",
    subtitle: "自由對話模式",
    summary:
      "提供無限制的輸入框，讓使用者以自然語言自由表達需求，適合探索式對話。",
    filters: ["prompt-actions"],
  },
  {
    id: "restructure",
    title: "Restructure (重組)",
    subtitle: "內容結構調整",
    summary:
      "保持核心內容但改變其組織結構，如從條列轉為段落，或重新排列章節順序。",
    filters: ["prompt-actions"],
  },
  {
    id: "synthesis",
    title: "Synthesis (綜合)",
    subtitle: "多源資訊整合",
    summary:
      "將多個來源的資訊整合成統一的見解或報告，識別共同主題與差異點。",
    filters: ["prompt-actions"],
  },
  {
    id: "transform",
    title: "Transform (轉換)",
    subtitle: "格式或媒介轉換",
    summary:
      "將內容從一種格式或媒介轉換為另一種，如文字轉圖表、簡報轉文章等。",
    filters: ["prompt-actions"],
  },
  // Tuners 類別
  {
    id: "attachments",
    title: "Attachments (附件)",
    subtitle: "上下文注入",
    summary:
      "允許使用者提供特定文件、圖片或資訊供模型參考，以塑造其邏輯和回應方向。",
    filters: ["tuners"],
  },
  {
    id: "parameters",
    title: "Parameters (參數)",
    subtitle: "生成控制",
    summary:
      "調整溫度、top-p、長度等參數來精確控制 AI 生成的創意度、隨機性與輸出長度。",
    filters: ["tuners"],
  },
  {
    id: "voice-and-tone",
    title: "Voice and Tone (聲音與語氣)",
    subtitle: "風格一致性",
    summary:
      "定義 AI 回應的語氣（正式/輕鬆）、觀點（第一/第三人稱）與情感傾向。",
    filters: ["tuners"],
  },
  {
    id: "connectors",
    title: "Connectors (連接器)",
    subtitle: "外部資料整合",
    summary:
      "連接外部資料源、API 或服務，讓 AI 能存取即時資訊或執行特定操作。",
    filters: ["tuners"],
  },
  {
    id: "filters",
    title: "Filters (篩選器)",
    subtitle: "內容過濾設定",
    summary:
      "設定內容過濾規則，控制 AI 輸出中應避免或強調的主題、詞彙或風格。",
    filters: ["tuners"],
  },
  {
    id: "model-management",
    title: "Model management (模型管理)",
    subtitle: "模型選擇與切換",
    summary:
      "讓使用者選擇或切換不同的 AI 模型，根據任務需求平衡速度、成本與品質。",
    filters: ["tuners"],
  },
  {
    id: "modes",
    title: "Modes (模式)",
    subtitle: "工作模式切換",
    summary:
      "提供不同的工作模式（如創意模式、精確模式、簡潔模式），預設特定參數組合。",
    filters: ["tuners"],
  },
  {
    id: "preset-styles",
    title: "Preset styles (預設風格)",
    subtitle: "快速風格選擇",
    summary:
      "提供預先配置的風格選項（如專業、友善、技術性），一鍵套用風格設定。",
    filters: ["tuners"],
  },
  {
    id: "saved-styles",
    title: "Saved styles (儲存風格)",
    subtitle: "自訂風格保存",
    summary:
      "允許使用者保存自己調整的風格設定，建立個人化的風格庫以重複使用。",
    filters: ["tuners"],
  },
  // Wayfinders 類別
  {
    id: "example-gallery",
    title: "Example gallery (範例庫)",
    subtitle: "靈感與入門",
    summary:
      "展示精選或社群創作的範例，協助使用者快速了解產品能力並開始使用。",
    filters: ["wayfinders"],
  },
  {
    id: "suggestions",
    title: "Suggestions (建議)",
    subtitle: "情境化推薦",
    summary:
      "根據當前上下文提供相關的提示建議，引導使用者探索更多可能性。",
    filters: ["wayfinders"],
  },
  {
    id: "templates",
    title: "Templates (模板)",
    subtitle: "結構化起點",
    summary:
      "提供預先定義的提示模板，使用者只需填入變數即可快速生成特定類型的內容。",
    filters: ["wayfinders"],
  },
  {
    id: "follow-up",
    title: "Follow up (後續追問)",
    subtitle: "對話延續引導",
    summary:
      "在 AI 回應後提供相關的後續問題建議，引導使用者深入探索主題或澄清細節。",
    filters: ["wayfinders"],
  },
  {
    id: "initial-cta",
    title: "Initial CTA (初始行動呼籲)",
    subtitle: "首次互動引導",
    summary:
      "在使用者首次進入時提供明確的起始動作建議，降低空白畫布的焦慮感。",
    filters: ["wayfinders"],
  },
  {
    id: "nudge",
    title: "Nudge (輕推)",
    subtitle: "溫和行為引導",
    summary:
      "使用溫和的提示或暗示來引導使用者朝向更好的選擇，而不強制要求。",
    filters: ["wayfinders"],
  },
  {
    id: "prompt-details",
    title: "Prompt details (提示細節)",
    subtitle: "輸入欄位擴展說明",
    summary:
      "提供提示語的詳細說明、範例或建議，幫助使用者撰寫更有效的提示。",
    filters: ["wayfinders"],
  },
  {
    id: "randomize",
    title: "Randomize (隨機化)",
    subtitle: "隨機靈感激發",
    summary:
      "提供隨機生成的起始點或變化，幫助使用者突破創意瓶頸或發現新方向。",
    filters: ["wayfinders"],
  },
  // Trust Builders 類別
  {
    id: "caveat",
    title: "Caveat (警示)",
    subtitle: "風險提醒",
    summary:
      "在適當時機提醒使用者 AI 系統可能出錯、不完整或有偏見，培養批判性思維。",
    filters: ["trust-builders"],
  },
  {
    id: "disclosure",
    title: "Disclosure (揭露)",
    subtitle: "透明度標示",
    summary:
      "清楚標示內容是由 AI 生成，或揭露 AI 系統的能力限制與資料使用方式。",
    filters: ["trust-builders"],
  },
  {
    id: "data-ownership",
    title: "Data ownership (資料所有權)",
    subtitle: "使用者主控權",
    summary:
      "明確告知使用者其資料的使用、儲存與刪除方式，並提供完整的控制選項。",
    filters: ["trust-builders"],
  },
  {
    id: "consent",
    title: "Consent (同意)",
    subtitle: "明確授權機制",
    summary:
      "在使用資料或執行關鍵操作前，明確取得使用者的知情同意，並提供清楚的說明。",
    filters: ["trust-builders"],
  },
  // Governors 類別
  {
    id: "action-plan",
    title: "Action plan (行動計畫)",
    subtitle: "執行前預覽",
    summary:
      "在執行複雜或高成本任務前，先展示計畫步驟讓使用者確認或調整。",
    filters: ["governors"],
  },
  {
    id: "citations",
    title: "Citations (引用)",
    subtitle: "來源追溯",
    summary:
      "提供 AI 回應的引用來源，讓使用者能驗證資訊的可靠性與準確性。",
    filters: ["governors", "trust-builders"],
  },
  {
    id: "verification",
    title: "Verification (驗證)",
    subtitle: "關鍵決策把關",
    summary:
      "在執行不可逆操作或存取敏感資料前，要求使用者明確確認以防止意外。",
    filters: ["governors"],
  },
  {
    id: "stream-of-thought",
    title: "Stream of Thought (思維流)",
    subtitle: "過程透明化",
    summary:
      "即時展示 AI 的思考過程、工具使用與推理步驟，增加可理解性與信任感。",
    filters: ["governors", "trust-builders"],
  },
  {
    id: "branches",
    title: "Branches (分支)",
    subtitle: "多路徑探索",
    summary:
      "允許使用者在對話中創建分支，探索不同的回應方向而不影響主要對話線。",
    filters: ["governors"],
  },
  {
    id: "controls",
    title: "Controls (控制項)",
    subtitle: "細粒度控制介面",
    summary:
      "提供明確的控制項讓使用者管理 AI 行為，如暫停、停止、速度調整等。",
    filters: ["governors"],
  },
  {
    id: "cost-estimates",
    title: "Cost estimates (成本估算)",
    subtitle: "資源消耗預覽",
    summary:
      "在執行昂貴操作前顯示預估成本（時間、金錢、token 等），讓使用者做出明智決策。",
    filters: ["governors"],
  },
  {
    id: "draft-mode",
    title: "Draft mode (草稿模式)",
    subtitle: "低成本探索",
    summary:
      "提供快速但品質較低的草稿模式，讓使用者在確定方向前進行低成本實驗。",
    filters: ["governors"],
  },
  {
    id: "memory",
    title: "Memory (記憶)",
    subtitle: "上下文管理",
    summary:
      "管理 AI 的記憶內容，讓使用者查看、編輯或刪除 AI 記住的資訊。",
    filters: ["governors"],
  },
  {
    id: "references",
    title: "References (參考資料)",
    subtitle: "資訊來源追蹤",
    summary:
      "顯示 AI 回應所參考的文件、段落或資料來源，支援深入查證。",
    filters: ["governors"],
  },
  {
    id: "sample-response",
    title: "Sample response (範例回應)",
    subtitle: "期望設定",
    summary:
      "在執行前提供範例回應，讓使用者預覽 AI 的輸出風格與格式。",
    filters: ["governors"],
  },
  {
    id: "shared-vision",
    title: "Shared vision (共享願景)",
    subtitle: "多方協作對齊",
    summary:
      "讓多個使用者或 AI 代理共享同一個目標或願景，確保協作一致性。",
    filters: ["governors"],
  },
  {
    id: "variations",
    title: "Variations (變體)",
    subtitle: "多版本並列",
    summary:
      "同時生成多個版本的回應，讓使用者比較選擇或混合不同版本的優點。",
    filters: ["governors"],
  },
];
