export const methodLibrary = [
  {
    id: "research",
    chapter: "05",
    title: "Research",
    subtitle: "Desk & Ethnographic Insights",
    description:
      "Ground your AI value-matrix work with rigorous desk research and lived-experience studies that surface contextual risks.",
    groups: [
      {
        id: "desk-research",
        title: "Desk research",
        items: [
          { id: "preparatory-research", title: "Preparatory research" },
          { id: "secondary-research", title: "Secondary research" },
        ],
      },
      {
        id: "self-ethnography",
        title: "Self-ethnographic approach",
        items: [
          { id: "autoethnography", title: "Autoethnography" },
          { id: "online-ethnography", title: "Online ethnography" },
        ],
      },
      {
        id: "participant-approach",
        title: "Participant approach",
        items: [
          { id: "participant-observation", title: "Participant observation" },
          { id: "contextual-interview", title: "Contextual interview" },
        ],
      },
    ],
  },
  {
    id: "ideation",
    chapter: "06",
    title: "Ideation",
    subtitle: "Framing & Concept Generation",
    description:
      "Navigate messy problem spaces with facilitation patterns that slice challenges, reuse journeys, and reframe opportunities.",
    groups: [
      {
        id: "pre-ideation",
        title: "Pre-ideation",
        items: [
          { id: "slicing-the-elephant", title: "Slicing the elephant" },
          { id: "ideas-from-future-journey", title: "Ideas from future-state journey mapping" },
        ],
      },
      {
        id: "extra",
        title: "Extra",
        items: [
          { id: "aeseo-ergonomics", title: "AESEO – The ergonomics of need" },
          { id: "journey-ideation-arcs", title: "Journey ideation with dramatic arcs" },
        ],
      },
      {
        id: "network-mapping",
        title: "Network mapping",
        items: [
          { id: "future-state-network", title: "Ideas from future-state network mapping" },
        ],
      },
    ],
  },
  {
    id: "prototyping",
    chapter: "07",
    title: "Prototyping",
    subtitle: "Embodied Experiments",
    description:
      "Prototype value-matrix interventions through staged rehearsals, walkthroughs, and cardboard sets that stress-test signals and safeguards.",
    groups: [
      {
        id: "extra",
        title: "Extra",
        items: [{ id: "theatrical-methods", title: "Theatrical methods – An introduction" }],
      },
      {
        id: "service-process",
        title: "Prototyping service processes & experiences",
        items: [
          { id: "investigative-rehearsal", title: "Investigative rehearsal" },
          { id: "subtext", title: "Subtext" },
          { id: "desktop-walkthrough", title: "Desktop walkthrough" },
        ],
      },
      {
        id: "physical-environment",
        title: "Prototyping physical objects & environments",
        items: [{ id: "cardboard-prototyping", title: "Cardboard prototyping" }],
      },
      {
        id: "digital-services",
        title: "Prototyping digital services & software",
        items: [{ id: "redesigning-digital-services", title: "Redesigning digital services" }],
      },
    ],
  },
  {
    id: "facilitation",
    chapter: "10",
    title: "Facilitation",
    subtitle: "Team Warm-ups",
    description:
      "Prime collaborators with warm-ups and playback rituals that keep AI governance conversations constructive.",
    groups: [
      {
        id: "energizers",
        title: "Warm-ups",
        items: [
          { id: "three-brain-warmup", title: "Three-brain warm-up" },
          { id: "color-chain-warmup", title: "Color-chain warm-up" },
          { id: "yes-and-warmup", title: '"Yes, and …" warm-up' },
          { id: "red-green-feedback", title: "Red and green feedback" },
        ],
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
  { id: "traditional", label: "Traditional" },
  { id: "security", label: "Security & Safety" },
  { id: "architecture", label: "Architecture" },
  { id: "deployment", label: "Deployment" },
  { id: "implementation", label: "Implementation" },
  { id: "process", label: "Process" },
  { id: "testing", label: "Testing & QA" },
  { id: "topology", label: "Topology" },
];

export const patternCatalog = [
  {
    id: "multi-layer-pattern",
    title: "Multi-layer pattern",
    subtitle: "Separation of concerns",
    summary:
      "Organise your AI stack into layers (data, intelligence, experience) so that governance controls align to each responsibility.",
    filters: ["traditional", "architecture"],
  },
  {
    id: "prediction-cache",
    title: "Prediction cache pattern",
    subtitle: "Speed vs. freshness",
    summary:
      "Cache repeatable AI results with guardrails for staleness windows. Ideal when predictions do not change every second.",
    filters: ["architecture", "deployment"],
  },
  {
    id: "mediator-pattern",
    title: "Mediator pattern",
    subtitle: "Decouple downstream consumers",
    summary:
      "Route AI responses through a mediator that enforces policy and throttling before exposing them to fragile channels.",
    filters: ["traditional", "process"],
  },
  {
    id: "giveaway",
    title: "Giveaway",
    subtitle: "Low risk experimentation",
    summary:
      "Launch limited AI trials with reversible benefits (credits, trial accounts) to learn without harming existing users.",
    filters: ["deployment", "process"],
  },
  {
    id: "audit-black-box",
    title: "Audit black box",
    subtitle: "Traceability",
    summary:
      "Continuously record model inputs, confidence, overrides, and human feedback to support post-incident analysis.",
    filters: ["security", "process", "testing"],
  },
  {
    id: "mvc-controller",
    title: "Model-view-controller (AI)",
    subtitle: "Shared data contracts",
    summary:
      "Keep AI explanations, controls, and decisions in sync across surfaces by routing through a canonical controller layer.",
    filters: ["architecture", "implementation"],
  },
  {
    id: "kappa-architecture",
    title: "Kappa architecture",
    subtitle: "Large data streams",
    summary:
      "Unify batch and streaming pipelines with a single processing path that scales for trust and transparency dashboards.",
    filters: ["architecture", "topology"],
  },
  {
    id: "decorator-pattern",
    title: "Decorator pattern",
    subtitle: "Composable safeguards",
    summary:
      "Wrap AI decisions with reusable safeguards such as toxicity checks, consent validation, or fairness scoring.",
    filters: ["implementation", "security"],
  },
  {
    id: "strategy-pattern",
    title: "Strategy pattern",
    subtitle: "Swap-able logic",
    summary:
      "Switch value-matrix strategies (opt-in, default-on, human-in-loop) at runtime without rewriting the orchestration layer.",
    filters: ["traditional", "implementation"],
  },
  {
    id: "parameter-server",
    title: "Parameter-server abstraction",
    subtitle: "Distributed learning",
    summary:
      "Synchronise model parameters across training workers with audit hooks for bias remediation experiments.",
    filters: ["topology", "testing"],
  },
  {
    id: "web-single-pattern",
    title: "Web single pattern",
    subtitle: "Fast deployment",
    summary:
      "Ship a minimal AI capability through a single web surface to validate desirability before expanding to other channels.",
    filters: ["deployment", "traditional"],
  },
  {
    id: "serving-template",
    title: "Serving template pattern",
    subtitle: "Consistent outcomes",
    summary:
      "Standardise how models are deployed with templates that enforce observability, rollback, and rollback criteria.",
    filters: ["deployment", "testing", "process"],
  },
];
