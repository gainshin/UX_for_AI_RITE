export const units = [
  {
    id: "unit-1",
    title: "選擇正確的戰場：活用價值矩陣",
    summary:
      "理解不同錯誤帶來的價值差異，決定該優先優化準確率或召回率，從而聚焦真正有價值的 AI 問題。",
    scenario: "medical",
    minutes: 25,
    passThreshold: 70,
    introduction: [
      "在 AI 應用中，錯誤不是等價的。僅追求高準確率會忽略錯誤背後的成本，無法創造真正的商業或用戶價值。",
      "透過價值矩陣 (Value Matrix) 分析真陽性、偽陽性、偽陰性與真陰性，我們能辨認哪種錯誤影響最大，並決定資源投入的重點。",
    ],
    concepts: [
      {
        heading: "Precision 與 Recall 的價值視角",
        example:
          "在醫療判讀中，漏掉真正的癌症患者會造成巨大成本，因此召回率的價值高於單純的準確率。",
        points: [
          {
            title: "準確率 (Precision)",
            detail: "衡量模型預測為陽性時的正確程度，重點在於減少誤報，以免資源耗損在不必要的對象上。",
          },
          {
            title: "召回率 (Recall)",
            detail: "衡量所有真正陽性樣本中被找出來的比例，重點在於減少漏報，避免忽視真正需要處理的對象。",
          },
          {
            title: "錯誤的成本",
            detail: "偽陰性 (FN) 造成的損失與偽陽性 (FP) 的成本在不同情境下差異極大，必須結合業務價值評估。",
          },
        ],
      },
      {
        heading: "價值矩陣的實務應用",
        example:
          "在電商推薦中，允許適度的偽陽性能讓使用者探索新商品；但在醫療場景則必須嚴格控管偽陰性。",
        points: [
          {
            title: "四象限思維",
            detail: "分析 TP、FP、FN、TN 各自帶來的價值或損失，並納入機會成本、風險與合規要求。",
          },
          {
            title: "優先順序的決定",
            detail: "根據目標調整資源：高風險場景優先降低 FN，探索型場景則可接受部分 FP 以創造驚喜。",
          },
          {
            title: "跨團隊溝通",
            detail: "將模型指標轉化為業務語言，協助決策者理解不同錯誤對財務或使用者體驗的影響。",
          },
        ],
      },
    ],
    practice: [
      {
        title: "醫療風險分級表",
        description: "以癌症早篩為例，評估不同錯誤的代價並設定容忍度。",
        steps: [
          "列出真陽性、偽陽性、偽陰性、真陰性的案例及其可能成本。",
          "訂定每種錯誤可容忍的頻率與預算上限。",
          "與醫療專家確認哪種錯誤最不可接受，形成決策依據。",
        ],
        hint: "若 FN 會導致延遲治療或法律風險，應將召回率列為最高優先。",
      },
      {
        title: "電商推薦探索度設定",
        description: "衡量偽陽性推薦帶來的潛在新價值。",
        steps: [
          "分析 FP 推薦對使用者體驗的正負面影響。",
          "建立可接受的 FP 上限，並定義需要監控的指標 (例如 CTR、轉換率)。",
          "與商品營運討論探索型推薦的商業機會。",
        ],
        hint: "若 FP 能帶來跨品類探索與額外營收，可設定更高的容忍度。",
      },
    ],
    quiz: [
      {
        id: "u1-q1",
        type: "multiple",
        scenario: "medical",
        prompt: "在癌症篩檢系統中，哪一項指標最能凸顯漏報的成本？",
        options: [
          { id: "a", text: "召回率 (Recall)" },
          { id: "b", text: "準確率 (Accuracy)" },
          { id: "c", text: "精確率 (Precision)" },
          { id: "d", text: "F1 分數" },
        ],
        correctOptionIds: ["a"],
        explanation: "癌症篩檢最怕漏掉真正患者 (FN)，召回率能直接反映是否找出所有真正陽性案例。",
      },
      {
        id: "u1-q2",
        type: "multiple",
        scenario: "ecommerce",
        prompt: "以下哪些行為能提升電商推薦中偽陽性 (FP) 的正向價值？ (可複選)",
        options: [
          { id: "a", text: "在新品上市時增加探索性推薦" },
          { id: "b", text: "僅推薦使用者歷史購買過的商品" },
          { id: "c", text: "量測 FP 推薦帶來的額外營收" },
          { id: "d", text: "將所有 FP 視為錯誤並立即下架" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "探索新品與衡量 FP 帶來的發現價值，能將部分偽陽性轉化為商業機會。",
      },
      {
        id: "u1-q3",
        type: "matching",
        scenario: "education",
        prompt: "將教育科技情境與適合優先的指標配對。",
        pairs: [
          {
            id: "p1",
            prompt: "自動批改作文偵測關鍵能力缺口",
            match: "召回率優先，避免漏掉需要補強的學生",
          },
          {
            id: "p2",
            prompt: "推薦拓展閱讀清單",
            match: "允許部分偽陽性，以提升探索多樣性",
          },
          {
            id: "p3",
            prompt: "辨識作弊樣態的即時警示",
            match: "提高精確率，避免誤判造成不公平",
          },
        ],
        explanation: "不同教育應用的錯誤成本相異：診斷能力缺口需避免漏報、閱讀推薦可容忍 FP、作弊偵測則需高 Precision。",
      },
      {
        id: "u1-q4",
        type: "multiple",
        scenario: "ai-hiring",
        prompt: "AI 招聘系統在初步履歷篩選時，常見的高成本錯誤是什麼？",
        options: [
          { id: "a", text: "錯過合適人才 (FN)" },
          { id: "b", text: "推薦已有員工" },
          { id: "c", text: "排序錯誤" },
          { id: "d", text: "推薦過多候選人" },
        ],
        correctOptionIds: ["a"],
        explanation: "漏掉真正合適的人才會造成招聘延遲與競爭劣勢，因此需關注召回率。",
      },
      {
        id: "u1-q5",
        type: "multiple",
        scenario: "social",
        prompt: "社交平台偵測仇恨言論時，為何不能只追求 100% 精確率？",
        options: [
          { id: "a", text: "精確率只顧誤報，忽略漏報造成的傷害" },
          { id: "b", text: "召回率會自動提高" },
          { id: "c", text: "使用者不會抱怨漏報" },
          { id: "d", text: "精確率與召回率本質相同" },
        ],
        correctOptionIds: ["a"],
        explanation: "若只追求精確率，系統可能變得過於保守，導致漏報大量仇恨言論，傷害社群。",
      },
      {
        id: "u1-q6",
        type: "matching",
        scenario: "ecommerce",
        prompt: "配對電商情境與最適合的誤差容忍策略。",
        pairs: [
          {
            id: "p1",
            prompt: "限時秒殺商品推薦",
            match: "降低偽陽性，避免浪費稀缺庫存",
          },
          {
            id: "p2",
            prompt: "新品探索型推播",
            match: "容忍偽陽性，引導使用者發現驚喜",
          },
          {
            id: "p3",
            prompt: "異常退貨偵測",
            match: "降低偽陰性，避免詐欺損失",
          },
        ],
        explanation: "依場景決定 FP 或 FN 的容忍度，才能兼顧營收與風險控管。",
      },
      {
        id: "u1-q7",
        type: "multiple",
        scenario: "education",
        prompt: "在智慧助教系統中，選擇錯誤的價值矩陣會造成什麼後果？",
        options: [
          { id: "a", text: "忽略真正需要協助的學生" },
          { id: "b", text: "程式自動修復" },
          { id: "c", text: "錯誤被完全消除" },
          { id: "d", text: "沒有實質影響" },
        ],
        correctOptionIds: ["a"],
        explanation: "若過度追求精確率，系統可能錯過真正需要幫助的學生，導致差異擴大。",
      },
      {
        id: "u1-q8",
        type: "multiple",
        scenario: "medical",
        prompt: "醫療診斷團隊如何與資料科學家協作，找出最關鍵的錯誤？",
        options: [
          { id: "a", text: "共同評估各錯誤情境的臨床風險" },
          { id: "b", text: "只交給模型自行學習" },
          { id: "c", text: "忽略真陰性的價值" },
          { id: "d", text: "只用開源資料推估" },
        ],
        correctOptionIds: ["a"],
        explanation: "跨專業對話才能認識錯誤的真實代價，進而設定正確的優化方向。",
      },
      {
        id: "u1-q9",
        type: "matching",
        scenario: "ai-hiring",
        prompt: "將招聘指標與對應的風險描述配對。",
        pairs: [
          {
            id: "p1",
            prompt: "過度強調精確率",
            match: "只集中在極少數履歷，可能造成人才流失",
          },
          {
            id: "p2",
            prompt: "過度強調召回率",
            match: "大量引入不合適履歷，增加面試成本",
          },
          {
            id: "p3",
            prompt: "忽略價值矩陣",
            match: "無法向 HR 解釋模型如何支持商業目標",
          },
        ],
        explanation: "AI 招聘需同時考量面試資源與人才競爭，錯誤指標會拖慢整體流程。",
      },
      {
        id: "u1-q10",
        type: "multiple",
        scenario: "social",
        prompt: "社交平台做內容審查時，何時適合提高偽陽性容忍度？",
        options: [
          { id: "a", text: "在敏感議題上，寧可先下架再人工覆核" },
          { id: "b", text: "當使用者對錯誤非常寬容" },
          { id: "c", text: "當平台無需遵守法規" },
          { id: "d", text: "當審查團隊人力充足，可快速複核" },
        ],
        correctOptionIds: ["a", "d"],
        explanation: "若具備人工覆核機制且議題高風險，可以接受較高 FP，確保召回所有可疑內容。",
      },
    ],
    code: {
      title: "成本敏感度加權示範",
      description: "透過簡化的成本矩陣計算，示範如何調整閾值以符合醫療場景的價值判斷。",
      content: `// TODO: 依據實際模型輸出填入 scores 陣列
const scores = [/* 模型產生的 0-1 機率 */];

const costMatrix = {
  truePositive: 0,
  falsePositive: 2, // 額外檢查成本
  falseNegative: 30, // 漏診造成的高額成本
  trueNegative: 0,
};

function evaluateThreshold(threshold) {
  let totalCost = 0;
  for (const score of scores) {
    const predictedPositive = score >= threshold;
    // TODO: 使用實際標籤取代 placeholderLabel
    const actualPositive = placeholderLabelCheck(score);

    if (predictedPositive && actualPositive) totalCost += costMatrix.truePositive;
    if (predictedPositive && !actualPositive) totalCost += costMatrix.falsePositive;
    if (!predictedPositive && actualPositive) totalCost += costMatrix.falseNegative;
    if (!predictedPositive && !actualPositive) totalCost += costMatrix.trueNegative;
  }
  return totalCost;
}

// 下一步：實作 placeholderLabelCheck，並嘗試不同 threshold 找出最低成本點。
`,
      nextSteps: [
        "串接實際標籤資料，計算不同 threshold 下的成本差距。",
        "可視化成本曲線，向決策者展示閾值與錯誤成本的關係。",
        "思考如何將人工作業流程納入成本矩陣，形成人機協作策略。",
      ],
    },
  },
  {
    id: "unit-2",
    title: "電商價值矩陣：平衡探索與效率",
    summary:
      "透過顧客分層與錯誤成本估算，建立能同時支撐探索與營收的電商推薦策略。",
    scenario: "ecommerce",
    minutes: 28,
    passThreshold: 70,
    introduction: [
      "在電商情境中，偽陽性可能帶來驚喜購買，也可能造成反感與客服成本；必須用數據量化其價值。",
      "善用價值矩陣可協助團隊調整推薦節奏，為不同顧客群設定合適的偽報容忍度與監測指標。",
    ],
    concepts: [
      {
        heading: "顧客終生價值與錯誤成本",
        example: "高 LTV 客戶對干擾較敏感，需要精確的推薦；新客群則可容忍更高的探索度。",
        points: [
          {
            title: "分群設定",
            detail: "依照 LTV、回購頻率與對價格敏感度將顧客分層，再評估各層的錯誤成本。",
          },
          {
            title: "偽陽性成本",
            detail: "客服負擔、折扣損失與品牌形象都是偽陽性需要衡量的額外成本。",
          },
          {
            title: "偽陰性成本",
            detail: "漏掉交叉銷售或加購機會，可能造成營收流失與體驗落差。",
          },
        ],
      },
      {
        heading: "指標對焦與實驗設計",
        example:
          "對新品導覽頁可放寬偽陽性並追蹤探索轉化；對限時活動則需提高精準度避免誤發優惠。",
        points: [
          {
            title: "多重指標追蹤",
            detail: "除了 CTR 外，同時追蹤轉換率、退貨率與客服 ticket 量，確保價值矩陣落地。",
          },
          {
            title: "實驗治理",
            detail: "A/B 測試需記錄 FP 與 FN 的變化，並在報表中標示成本影響。",
          },
          {
            title: "與營運協作",
            detail: "將模型調整與行銷排程串聯，避免矛盾訊息造成指標誤判。",
          },
        ],
      },
    ],
    practice: [
      {
        title: "顧客價值雷達圖",
        description: "匯整顧客分層、訂單價值與客服負荷，建立多維度的錯誤成本地圖。",
        steps: [
          "蒐集各顧客分層的 FP、FN 案例與對應成本。",
          "以雷達圖呈現每個分層對 FP 與 FN 的容忍度。",
          "與營運與客服共同確認優先級，決定模型調整順序。",
        ],
      },
      {
        title: "推播節奏調參表",
        description: "依據活動類型定義偽陽性容忍度與人工覆核節點。",
        steps: [
          "列出主要推播活動，如新品、限時促銷、補貨提醒等。",
          "為每種活動評估 FP 與 FN 的商業影響與風險。",
          "設定對應的監測指標與覆核流程，例如客服回覆 SLA。",
        ],
      },
    ],
    quiz: [
      {
        id: "u2-q1",
        type: "multiple",
        scenario: "ecommerce",
        prompt: "針對高 LTV 的 VIP 客戶進行保險商品加購推薦，價值矩陣應優先考慮哪些行動？",
        options: [
          { id: "a", text: "降低偽陽性容忍度，避免造成干擾" },
          { id: "b", text: "完全忽略偽陽性成本" },
          { id: "c", text: "只靠隨機推薦拉高探索" },
          { id: "d", text: "與客服確認偽陽性導致的跟進成本" },
        ],
        correctOptionIds: ["a", "d"],
        explanation: "高價值客戶對干擾敏感，需要高 Precision，並與客服對齊 FP 的處理成本。",
      },
      {
        id: "u2-q2",
        type: "multiple",
        scenario: "ecommerce",
        prompt: "新品上市活動希望創造驚喜購買，團隊應如何配置偽陽性？ (可複選)",
        options: [
          { id: "a", text: "提高探索度並記錄 FP 的額外營收" },
          { id: "b", text: "所有 FP 立即排除" },
          { id: "c", text: "與法遵確認推薦是否符合規範" },
          { id: "d", text: "完全關閉召回率的監測" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "新品推廣可容忍 FP，但需衡量帶來的營收與法規風險。",
      },
      {
        id: "u2-q3",
        type: "matching",
        scenario: "ecommerce",
        prompt: "為不同的電商活動配對合適的指標重點。",
        pairs: [
          {
            id: "p1",
            prompt: "限時折扣碼推播",
            match: "提升精確率，確保只有符合條件的顧客收到",
          },
          {
            id: "p2",
            prompt: "新品探索頁面",
            match: "允許較高偽陽性，促進跨品類瀏覽",
          },
          {
            id: "p3",
            prompt: "異常退貨偵測",
            match: "強化召回率，避免漏掉詐欺行為",
          },
        ],
        explanation: "根據活動目的調整 FP/FN 容忍度，才能在探索與效率間取得平衡。",
      },
      {
        id: "u2-q4",
        type: "multiple",
        scenario: "ecommerce",
        prompt: "建立電商價值矩陣時，下列哪些資料來源最關鍵？ (可複選)",
        options: [
          { id: "a", text: "顧客終生價值 (LTV)" },
          { id: "b", text: "客服處理每筆 FP 所耗費的時間成本" },
          { id: "c", text: "氣候預報資料" },
          { id: "d", text: "競品的社群貼文數量" },
        ],
        correctOptionIds: ["a", "b"],
        explanation: "LTV 與客服成本能直接量化錯誤影響，非直接相關的宏觀資料則較難提供決策依據。",
      },
      {
        id: "u2-q5",
        type: "multiple",
        scenario: "ecommerce",
        prompt: "完成價值矩陣工作坊後，理想的輸出包含哪些內容？",
        options: [
          { id: "a", text: "每種錯誤類型的數值成本與容忍度" },
          { id: "b", text: "刪除真陰性樣本" },
          { id: "c", text: "不同顧客分層的優先順序建議" },
          { id: "d", text: "僅保留點擊率作為指標" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "價值矩陣需有數字化的成本與分層策略，單一指標無法支撐決策。",
      },
      {
        id: "u2-q6",
        type: "matching",
        scenario: "ecommerce",
        prompt: "將利害關係人關注的錯誤面向配對。",
        pairs: [
          {
            id: "p1",
            prompt: "客服團隊",
            match: "了解偽陽性帶來的工時負擔與語調調整",
          },
          {
            id: "p2",
            prompt: "營運團隊",
            match: "評估偽陰性造成的營收流失與升級機會",
          },
          {
            id: "p3",
            prompt: "法遵團隊",
            match: "確保推薦內容符合法規與廣告揭露要求",
          },
        ],
        explanation: "不同團隊在 FP/FN 的容忍度不同，需透過價值矩陣對齊語言。",
      },
      {
        id: "u2-q7",
        type: "multiple",
        scenario: "ecommerce",
        prompt: "評估探索型推薦是否成功，應優先追蹤哪些指標？ (可複選)",
        options: [
          { id: "a", text: "偽陽性推薦的轉換率與平均訂單價值" },
          { id: "b", text: "退貨與客服申訴的變化" },
          { id: "c", text: "團隊午餐菜單" },
          { id: "d", text: "隨機挑選的社群留言數" },
        ],
        correctOptionIds: ["a", "b"],
        explanation: "需要觀察 FP 帶來的正向營收與潛在負面反饋，無關指標無助於判斷。",
      },
      {
        id: "u2-q8",
        type: "multiple",
        scenario: "ecommerce",
        prompt: "將推薦引擎遷移到新平台時，哪兩項工作能確保價值矩陣不失真？",
        options: [
          { id: "a", text: "重新校正驗證資料中 FP/FN 的標記" },
          { id: "b", text: "完全不需回顧舊系統指標" },
          { id: "c", text: "與營運確認新指標的曝光節奏" },
          { id: "d", text: "僅保留模型預測分數，不保留成本參數" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "遷移需確保標記一致並與營運同步節奏，否則價值矩陣假設會破裂。",
      },
      {
        id: "u2-q9",
        type: "matching",
        scenario: "ecommerce",
        prompt: "將顧客旅程階段與指標重點對應。",
        pairs: [
          {
            id: "p1",
            prompt: "導流階段",
            match: "監控探索型 FP 的帶入率與互動品質",
          },
          {
            id: "p2",
            prompt: "加購階段",
            match: "確保精準推薦提升客單價且不干擾結帳",
          },
          {
            id: "p3",
            prompt: "售後服務階段",
            match: "偽陰性可能導致遺漏關懷或延遲補貨通知",
          },
        ],
        explanation: "不同旅程階段的成功定義不同，需用價值矩陣來界定 FP/FN 的容忍度。",
      },
      {
        id: "u2-q10",
        type: "multiple",
        scenario: "ecommerce",
        prompt: "若價值矩陣顯示 FP 成本突然上升，應先進行哪兩項檢查？",
        options: [
          { id: "a", text: "檢視近期活動是否導致目標客群改變" },
          { id: "b", text: "停用所有探索型推薦，不詢問原因" },
          { id: "c", text: "確認標記流程是否加入新規則或產生延遲" },
          { id: "d", text: "忽略變化，等待系統自行修正" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "先排查業務活動與標記流程的變動，才能精準調整模型或策略。",
      },
    ],
    code: {
      title: "分層價值加權評分器",
      description: "示範如何根據顧客分層與錯誤成本計算推薦分數，作為後續調參的基礎。",
      content: `const segments = {
  vip: { fpCost: 6, fnCost: 12 },
  loyal: { fpCost: 3, fnCost: 6 },
  new: { fpCost: 1, fnCost: 2 },
};

export function scoreCandidate({ segment, uplift, confidence }) {
  const config = segments[segment] ?? segments.new;
  // TODO: 依據實際 uplift 與置信度計算預期價值
  const expectedGain = uplift * confidence;
  const expectedLoss = config.fpCost * (1 - confidence);
  return expectedGain - expectedLoss;
}

// 下一步：加入實際成本資料，並用實驗數據微調 fpCost/fnCost。`,
      nextSteps: [
        "串接實驗平台數據，自動更新各分層的成本參數。",
        "將函式整合到推薦排序流程中，與既有分數混合。",
        "對照客服工時與退貨指標，驗證加權策略是否符合假設。",
      ],
    },
  },
  {
    id: "unit-3",
    title: "社交平台信任監控：即時事件管理",
    summary:
      "以價值矩陣統整內容風險、人工審核與用戶信任，打造兼顧安全與體驗的社群治理流程。",
    scenario: "social",
    minutes: 30,
    passThreshold: 72,
    introduction: [
      "社交平台的錯誤成本不僅是營收，更牽涉到品牌信任與法規風險。必須為不同事件等級建立明確的指標優先順序。",
      "透過價值矩陣與事件分級機制，將偽陽性、偽陰性對不同族群的影響量化，才能在爭議爆發前掌握主導權。",
    ],
    concepts: [
      {
        heading: "事件嚴重度與指標切換",
        example:
          "疫情期間，醫療錯誤訊息的偽陰性成本極高，需要提高召回率並快速通知人工團隊。",
        points: [
          {
            title: "事件分級",
            detail: "依據法規風險、社群傷害與擴散速度將事件分成高、中、低三級。",
          },
          {
            title: "指標切換",
            detail: "高風險事件強調召回與覆核速度；低風險事件可關注精確率與體驗。",
          },
          {
            title: "再訓練節奏",
            detail: "將事件標記納入資料回饋，定期調整模型閾值。",
          },
        ],
      },
      {
        heading: "人機協作的覆核流程",
        example:
          "透過 AI 先篩選高風險貼文，再交由人工判定與溝通，可降低誤判造成的品牌爭議。",
        points: [
          {
            title: "交接標準",
            detail: "明確界定何時需升級到人工、法務或公關團隊。",
          },
          {
            title: "追蹤回饋",
            detail: "將人工覆核結果回寫模型，用於調整偽陽性與偽陰性的閾值。",
          },
          {
            title: "透明度報告",
            detail: "定期產出事件處理報告，向社群說明錯誤治理成效。",
          },
        ],
      },
    ],
    practice: [
      {
        title: "事件分級手冊",
        description: "與信任安全團隊協作，定義高、中、低風險事件的指標與回應時限。",
        steps: [
          "列出常見事件 (仇恨言論、詐騙、醫療假訊息 等)。",
          "為每種事件評估 FP/FN 成本並指定主要指標。",
          "定義跨部門溝通流程與 SLA，確保升級節點一致。",
        ],
      },
      {
        title: "信任度儀表板草稿",
        description: "設計可即時觀測 FP/FN 變化的儀表板，協助決策。",
        steps: [
          "選定需即時監控的指標，如被標記貼文增長率、人工覆核等待時間。",
          "規劃指標分層 (平台整體 / 關鍵國家 / 高風險主題)。",
          "與資料工程討論資料來源、更新頻率與告警門檻。",
        ],
      },
    ],
    quiz: [
      {
        id: "u3-q1",
        type: "multiple",
        scenario: "social",
        prompt: "針對疫情相關錯誤資訊的高風險事件，平台應優先採取哪些措施？ (可複選)",
        options: [
          { id: "a", text: "提高召回率，確保所有可疑貼文被快速標記" },
          { id: "b", text: "關閉人工覆核" },
          { id: "c", text: "停止蒐集用戶檢舉資料" },
          { id: "d", text: "安排跨部門待命，縮短覆核與公告時間" },
        ],
        correctOptionIds: ["a", "d"],
        explanation: "高風險事件需擴大召回並啟動跨部門應變，不能依賴純自動化。",
      },
      {
        id: "u3-q2",
        type: "multiple",
        scenario: "social",
        prompt: "當人工審核資源有限時，價值矩陣能提供哪些決策依據？",
        options: [
          { id: "a", text: "將 FP 成本轉換為人力工時，排定覆核順序" },
          { id: "b", text: "忽略 FN 成本，全部交給 AI" },
          { id: "c", text: "針對高風險 FN 設定較低的升級門檻" },
          { id: "d", text: "僅看貼文按讚數作為指標" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "透過量化 FP/FN 的人力影響與風險，才能合理分配覆核資源。",
      },
      {
        id: "u3-q3",
        type: "matching",
        scenario: "social",
        prompt: "為事件嚴重度與優化策略配對。",
        pairs: [
          {
            id: "p1",
            prompt: "高風險 (涉及人身安全)",
            match: "提高召回率並啟動人工即時覆核",
          },
          {
            id: "p2",
            prompt: "中風險 (品牌攻擊)",
            match: "平衡 Precision 與 Recall，並增設溝通模板",
          },
          {
            id: "p3",
            prompt: "低風險 (垃圾訊息)",
            match: "優化精確率，降低誤封一般用戶",
          },
        ],
        explanation: "不同嚴重度需調整指標權重：高風險重召回、低風險重體驗。",
      },
      {
        id: "u3-q4",
        type: "multiple",
        scenario: "social",
        prompt: "整合用戶檢舉回饋時，哪兩項做法能提升價值矩陣的精準度？",
        options: [
          { id: "a", text: "根據事件分級調整檢舉權重" },
          { id: "b", text: "完全排除用戶檢舉" },
          { id: "c", text: "為常見誤報建立教育流程" },
          { id: "d", text: "關閉外部透明度報告" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "檢舉需結合事件嚴重度設定權重，同時透過教育降低誤報。",
      },
      {
        id: "u3-q5",
        type: "multiple",
        scenario: "social",
        prompt: "評估偽陽性成本時，應納入哪些社群層面的指標？",
        options: [
          { id: "a", text: "被誤封用戶的申訴成功率與時間" },
          { id: "b", text: "品牌負面聲量" },
          { id: "c", text: "使用者留存與回訪率" },
          { id: "d", text: "幣值匯率" },
        ],
        correctOptionIds: ["a", "b", "c"],
        explanation: "偽陽性影響社群信任與使用者留存，需以多維指標量化。",
      },
      {
        id: "u3-q6",
        type: "matching",
        scenario: "social",
        prompt: "配對不同偵測來源與其能創造的價值。",
        pairs: [
          {
            id: "p1",
            prompt: "AI 模型即時偵測",
            match: "縮短擴散時間，降低高風險事件的漏報",
          },
          {
            id: "p2",
            prompt: "用戶檢舉",
            match: "補足模型盲點並提供語境資訊",
          },
          {
            id: "p3",
            prompt: "人工抽樣稽核",
            match: "量測偽陽性並為模型提供精確標記",
          },
        ],
        explanation: "多元資料來源能彼此補強，共同提升價值矩陣的可信度。",
      },
      {
        id: "u3-q7",
        type: "multiple",
        scenario: "social",
        prompt: "當偵測到新型詐騙手法時，第一步應該做什麼？",
        options: [
          { id: "a", text: "與專家建立快速標記流程" },
          { id: "b", text: "忽略直到報案數增加" },
          { id: "c", text: "分析 FP/FN 成本並更新價值矩陣" },
          { id: "d", text: "停用所有舊有偵測規則" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "新型詐騙需即時標記並重新評估錯誤成本，避免擴散。",
      },
      {
        id: "u3-q8",
        type: "multiple",
        scenario: "social",
        prompt: "透明度報告應包含哪些資訊，才能彰顯價值矩陣的成果？",
        options: [
          { id: "a", text: "各事件類型的處理量與平均處理時間" },
          { id: "b", text: "偽陽性申訴成功率" },
          { id: "c", text: "偽陰性補救後的資訊觸及" },
          { id: "d", text: "營運團隊的休假計畫" },
        ],
        correctOptionIds: ["a", "b", "c"],
        explanation: "報告需揭示 FP/FN 的處理效率與改善成效，無關資訊可略。",
      },
      {
        id: "u3-q9",
        type: "matching",
        scenario: "social",
        prompt: "對應跨部門協作項目與應交付的成果。",
        pairs: [
          {
            id: "p1",
            prompt: "法務團隊",
            match: "提供高風險事件的合規建議與公告流程",
          },
          {
            id: "p2",
            prompt: "公關團隊",
            match: "制定對外溝通腳本並監控輿情",
          },
          {
            id: "p3",
            prompt: "產品團隊",
            match: "落實模型調整與儀表板需求",
          },
        ],
        explanation: "事件管理需要法務、公關、產品共同合作，確保治理一致。",
      },
      {
        id: "u3-q10",
        type: "multiple",
        scenario: "social",
        prompt: "若觀察到偽陽性突然飆升，且主要集中在特定語言社群，應優先採取哪些步驟？",
        options: [
          { id: "a", text: "檢查語言模型或關鍵字表是否更新" },
          { id: "b", text: "與當地社群顧問核對語境" },
          { id: "c", text: "忽略並等待自動回復" },
          { id: "d", text: "暫時調整該語言的閾值或改為人工覆核" },
        ],
        correctOptionIds: ["a", "b", "d"],
        explanation: "需先確認模型變動，並與在地團隊合作調整閾值或流程。",
      },
    ],
    code: {
      title: "事件分級優先佇列",
      description: "示範如何依事件分級、擴散速度與信任分數計算處理優先度。",
      content: `const levelConfig = {
  high: { baseScore: 90, recallBoost: 25 },
  medium: { baseScore: 60, recallBoost: 10 },
  low: { baseScore: 30, recallBoost: 5 },
};

export function incidentPriority({ level, spreadVelocity, trustImpact }) {
  const config = levelConfig[level] ?? levelConfig.low;
  const dynamicBoost = spreadVelocity * 10 + trustImpact * 5;
  // TODO: 加入偽陽性成本與人工可用資源
  return config.baseScore + config.recallBoost + dynamicBoost;
}

// 下一步：整合實際資源限制，將結果用於排程與告警。`,
      nextSteps: [
        "結合覆核人力指標，調整排程優先權。",
        "將人工處理結果回寫，檢核優先度演算法。",
        "擴充為多語系設定，支援在地化閾值。",
      ],
    },
  },
  {
    id: "unit-4",
    title: "教育價值矩陣：預判學習風險",
    summary:
      "結合學習歷程與介入資源，運用價值矩陣精準找出需要支援的學生，提升學習成效。",
    scenario: "education",
    minutes: 27,
    passThreshold: 70,
    introduction: [
      "教育場域的偽陰性代表錯過介入時機，偽陽性則可能造成不必要的壓力。需要依學生特性調整優先順序。",
      "透過價值矩陣，教師能以數據佐證介入決策，讓資源投放更透明也更具信任感。",
    ],
    concepts: [
      {
        heading: "學習風險指標的權重設計",
        example: "早期預警系統若忽略偽陰性，可能讓需要協助的學生被忽視，造成成績斷層。",
        points: [
          {
            title: "資料蒐集",
            detail: "整合登入頻率、作業繳交、測驗成績與互動紀錄，建立行為特徵。",
          },
          {
            title: "權重設定",
            detail: "針對不同年級與科目，與教師討論 FP/FN 的可接受範圍。",
          },
          {
            title: "動態調整",
            detail: "定期檢查模型錯誤，根據介入成果修正成本假設。",
          },
        ],
      },
      {
        heading: "介入資源與人力配置",
        example:
          "在資源有限的情況下，必須先支援高風險群，再規劃同儕互助或線上資源給中低風險學習者。",
        points: [
          {
            title: "介入層級",
            detail: "區分為教師一對一、導師輔導、線上自主資源等不同強度。",
          },
          {
            title: "回饋循環",
            detail: "追蹤介入後的成效，調整模型權重與提醒頻率。",
          },
          {
            title: "利害關係人",
            detail: "與家長、輔導室與行政單位協調錯誤容忍度，取得共識。",
          },
        ],
      },
    ],
    practice: [
      {
        title: "學習軌跡雷達",
        description: "整理學生行為特徵與權重，視覺化每類錯誤的影響。",
        steps: [
          "彙整學習平台資料，計算缺交、低分、低互動的出現頻率。",
          "為不同錯誤建立權重，估算造成的學習落差。",
          "與導師討論可接受的 FP/FN 水準，形成共識。",
        ],
      },
      {
        title: "介入策略藍圖",
        description: "將偽陽性、偽陰性對應到具體的介入方案與時程。",
        steps: [
          "列出各類型警示對應的介入方案 (面談、補救課、線上教材)。",
          "評估每項介入的資源需求與最大承載量。",
          "設定優先順序與追蹤指標，確保介入後能回饋模型。",
        ],
      },
    ],
    quiz: [
      {
        id: "u4-q1",
        type: "multiple",
        scenario: "education",
        prompt: "在學習預警系統中，哪一種錯誤通常對學生影響最大？",
        options: [
          { id: "a", text: "偽陰性 (漏掉高風險學生)" },
          { id: "b", text: "偽陽性造成額外輔導" },
          { id: "c", text: "真陰性" },
          { id: "d", text: "全部錯誤影響相同" },
        ],
        correctOptionIds: ["a"],
        explanation: "偽陰性意味錯過及時協助，可能造成學習落差擴大。",
      },
      {
        id: "u4-q2",
        type: "multiple",
        scenario: "education",
        prompt: "對於自律性高的資優班，教師更可能關注哪項指標？",
        options: [
          { id: "a", text: "保持高精確率，避免不必要的介入" },
          { id: "b", text: "完全忽略偽陰性" },
          { id: "c", text: "只看學校平均分數" },
          { id: "d", text: "考慮 FP 帶來的壓力與自信影響" },
        ],
        correctOptionIds: ["a", "d"],
        explanation: "對自律學生而言，誤判可能造成過度干預，因此需兼顧精確率與介入副作用。",
      },
      {
        id: "u4-q3",
        type: "matching",
        scenario: "education",
        prompt: "將不同警示訊號與建議策略配對。",
        pairs: [
          {
            id: "p1",
            prompt: "連續兩週未登入平台",
            match: "提高召回率並通知導師主動關懷",
          },
          {
            id: "p2",
            prompt: "作業準時但測驗失常",
            match: "安排補救課並檢查題目理解度",
          },
          {
            id: "p3",
            prompt: "參與度高但成績穩定",
            match: "維持精準度，避免過度提醒造成干擾",
          },
        ],
        explanation: "不同訊號對應不同錯誤成本，應選擇合適的介入方式。",
      },
      {
        id: "u4-q4",
        type: "multiple",
        scenario: "education",
        prompt: "若學校資源有限，如何運用價值矩陣排定介入優先順序？",
        options: [
          { id: "a", text: "量化每種錯誤的學習落差成本" },
          { id: "b", text: "只依直覺決定" },
          { id: "c", text: "與輔導室核對人力承載" },
          { id: "d", text: "忽略家長需求" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "需結合成本量化與資源承載量，才能做出合理排程。",
      },
      {
        id: "u4-q5",
        type: "multiple",
        scenario: "education",
        prompt: "哪兩項資料最能協助評估偽陽性成本？",
        options: [
          { id: "a", text: "學生壓力或焦慮問卷" },
          { id: "b", text: "輔導老師的時數" },
          { id: "c", text: "學校地板顏色" },
          { id: "d", text: "校外社團報名表" },
        ],
        correctOptionIds: ["a", "b"],
        explanation: "偽陽性造成的心理與人力成本是教育場域的關鍵考量。",
      },
      {
        id: "u4-q6",
        type: "matching",
        scenario: "education",
        prompt: "把不同利害關係人的擔憂與指標連結。",
        pairs: [
          {
            id: "p1",
            prompt: "導師",
            match: "需要掌握高風險學生清單與聯絡紀錄",
          },
          {
            id: "p2",
            prompt: "家長",
            match: "關注介入是否尊重學生意願與時間",
          },
          {
            id: "p3",
            prompt: "校方行政",
            match: "衡量資源使用與補助申請效益",
          },
        ],
        explanation: "價值矩陣有助於與不同利害關係人建立共同語言。",
      },
      {
        id: "u4-q7",
        type: "multiple",
        scenario: "education",
        prompt: "在寒假前夕，系統偵測大量學生登入下降，應先進行哪些檢查？",
        options: [
          { id: "a", text: "確認是否為季節性行為並調整閾值" },
          { id: "b", text: "直接降低所有學生的風險等級" },
          { id: "c", text: "分析特定班級是否出現異常" },
          { id: "d", text: "忽略趨勢" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "需先排除自然季節因素，再觀察是否有特定群體異常。",
      },
      {
        id: "u4-q8",
        type: "multiple",
        scenario: "education",
        prompt: "將介入結果回饋模型時，哪些資料最有價值？ (可複選)",
        options: [
          { id: "a", text: "介入後的成績與參與度變化" },
          { id: "b", text: "教師對警示準確度的評語" },
          { id: "c", text: "學生對提醒頻率的感受" },
          { id: "d", text: "校門口的天氣" },
        ],
        correctOptionIds: ["a", "b", "c"],
        explanation: "成效、教師與學生的回饋能協助模型調整權重與頻率。",
      },
      {
        id: "u4-q9",
        type: "matching",
        scenario: "education",
        prompt: "配對不同介入層級與對應的資源限制。",
        pairs: [
          {
            id: "p1",
            prompt: "個別輔導",
            match: "人力有限，優先保留給高風險學生",
          },
          {
            id: "p2",
            prompt: "同儕學伴",
            match: "適合中度風險，需配對與培訓學伴",
          },
          {
            id: "p3",
            prompt: "線上自學模組",
            match: "可大規模使用，但需監測完成率",
          },
        ],
        explanation: "不同介入強度對資源依賴不同，價值矩陣協助安排優先順序。",
      },
      {
        id: "u4-q10",
        type: "multiple",
        scenario: "education",
        prompt: "若偽陽性比例突然上升且集中在某科目，應採取何種行動？",
        options: [
          { id: "a", text: "檢視近期評量是否更換題型或標準" },
          { id: "b", text: "與科任老師討論教學進度與異常情況" },
          { id: "c", text: "直接關閉該科目的預警" },
          { id: "d", text: "更新資料標記與模型權重" },
        ],
        correctOptionIds: ["a", "b", "d"],
        explanation: "需從評量變動、教學情境與資料標記三方面調整。",
      },
    ],
    code: {
      title: "風險分數計算骨架",
      description: "示範如何結合行為指標與錯誤成本，計算學生的警示程度。",
      content: `const riskWeights = {
  missingAssignments: 8,
  lowQuizScore: 6,
  lowEngagement: 4,
};

export function computeRiskScore(features) {
  const { missingAssignments, lowQuizScore, lowEngagement } = features;
  const baseScore =
    missingAssignments * riskWeights.missingAssignments +
    lowQuizScore * riskWeights.lowQuizScore +
    lowEngagement * riskWeights.lowEngagement;

  // TODO: 加入偽陽性成本與年級差異調整
  return baseScore;
}

// 下一步：引入實際錯誤成本與介入結果，形成閉環。`,
      nextSteps: [
        "將 computeRiskScore 與預警儀表板連動，提供教師即時資訊。",
        "根據介入成功率調整 riskWeights，確保模型與實際成效一致。",
        "引入學生回饋機制，持續檢驗偽陽性影響。",
      ],
    },
  },
  {
    id: "unit-5",
    title: "AI 招聘價值矩陣：公平與效率並進",
    summary:
      "以價值矩陣審視 AI 招聘流程，取得候選人公平性、面試資源與商業需求之間的平衡。",
    scenario: "ai-hiring",
    minutes: 29,
    passThreshold: 72,
    introduction: [
      "AI 招聘若忽視偽陰性，將錯失關鍵人才；忽視偽陽性則浪費面試資源並可能影響雇主品牌。",
      "透過價值矩陣，將錯誤轉換為面試成本、聘用風險與候選人經驗，協助制定公平的準則。",
    ],
    concepts: [
      {
        heading: "多階段招聘指標設計",
        example:
          "初篩階段可容忍較高召回率以避免漏掉潛力人才；進階面試則需提高精確率，節省面試資源。",
        points: [
          {
            title: "階段區分",
            detail: "將流程拆分為履歷初篩、能力測驗、面試邀請與錄用決策。",
          },
          {
            title: "錯誤成本量化",
            detail: "偽陽性代表多安排一次面試、甚至聘到不適任人才；偽陰性則是人才流失與招聘延遲。",
          },
          {
            title: "公平性指標",
            detail: "持續量測不同族群的 FP/FN 差距，避免偏誤累積。",
          },
        ],
      },
      {
        heading: "治理與透明度",
        example:
          "建立候選人回饋機制與審計流程，確保模型調整與合規需求同步。",
        points: [
          {
            title: "審計流程",
            detail: "定期檢視模型對各族群的影響，並記錄調整原因。",
          },
          {
            title: "候選人體驗",
            detail: "透明說明 AI 如何參與決策，提供申訴或人工覆核管道。",
          },
          {
            title: "跨部門協作",
            detail: "與法遵、業務主管與 HRBP 對齊錯誤容忍度與責任分工。",
          },
        ],
      },
    ],
    practice: [
      {
        title: "流程錯誤成本表",
        description: "將招聘流程拆解，評估不同錯誤對資源與品牌的影響。",
        steps: [
          "列出每個招聘階段及其 FP/FN 成本 (時間、人力、品牌)。",
          "為不同職缺類型 (大量職缺/關鍵人才) 設定容忍度。",
          "與用人主管確認優先順序並紀錄調整依據。",
        ],
      },
      {
        title: "公平性觀測儀表板",
        description: "設計可監測族群差異的 FP/FN 指標與申訴結果。",
        steps: [
          "蒐集候選人族群資訊 (在合法與自願前提下)。",
          "計算各族群在每個招聘階段的通過率與錯誤率。",
          "定義警示門檻與改善流程，確保差異可被追蹤。",
        ],
      },
    ],
    quiz: [
      {
        id: "u5-q1",
        type: "multiple",
        scenario: "ai-hiring",
        prompt: "在履歷初篩階段，偽陰性代表什麼風險？",
        options: [
          { id: "a", text: "錯過可能合適的候選人" },
          { id: "b", text: "增加面試排程" },
          { id: "c", text: "對品牌沒有影響" },
          { id: "d", text: "導致法規風險" },
        ],
        correctOptionIds: ["a", "d"],
        explanation: "偽陰性會讓人才流失，也可能因偏誤造成公平性與法規疑慮。",
      },
      {
        id: "u5-q2",
        type: "multiple",
        scenario: "ai-hiring",
        prompt: "對於大量客服職缺，哪兩項策略能降低偽陽性成本？",
        options: [
          { id: "a", text: "導入線上測驗驗證技能" },
          { id: "b", text: "忽略面試官的回饋" },
          { id: "c", text: "根據面試容量調整閾值" },
          { id: "d", text: "完全仰賴 AI 自動錄取" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "增加評估環節與調整閾值能降低不適合候選人進入面試造成的成本。",
      },
      {
        id: "u5-q3",
        type: "matching",
        scenario: "ai-hiring",
        prompt: "配對招聘階段與應聚焦的指標。",
        pairs: [
          {
            id: "p1",
            prompt: "履歷初篩",
            match: "提高召回率，避免漏掉多元背景人才",
          },
          {
            id: "p2",
            prompt: "面試邀請",
            match: "提升精確率，確保面試資源有效使用",
          },
          {
            id: "p3",
            prompt: "錄用決策",
            match: "綜合成本，檢視 FP 是否會造成培訓與離職成本",
          },
        ],
        explanation: "不同階段的資源投入不同，指標焦點也需跟著調整。",
      },
      {
        id: "u5-q4",
        type: "multiple",
        scenario: "ai-hiring",
        prompt: "若觀察到特定族群的偽陰性明顯較高，應採取哪些動作？",
        options: [
          { id: "a", text: "檢視特徵工程與資料品質" },
          { id: "b", text: "與法遵與多元共融團隊討論" },
          { id: "c", text: "忽略數據，放任持續" },
          { id: "d", text: "建立人工覆核與申訴機制" },
        ],
        correctOptionIds: ["a", "b", "d"],
        explanation: "需同時檢視技術面、治理面與人工補救措施，確保公平。",
      },
      {
        id: "u5-q5",
        type: "multiple",
        scenario: "ai-hiring",
        prompt: "哪兩項指標有助於衡量偽陽性造成的實際影響？",
        options: [
          { id: "a", text: "面試出席率" },
          { id: "b", text: "面試官時數與成本" },
          { id: "c", text: "候選人滿意度調查" },
          { id: "d", text: "後勤採購金額" },
        ],
        correctOptionIds: ["b", "c"],
        explanation: "面試資源與候選人體驗最能直接反映偽陽性成本。",
      },
      {
        id: "u5-q6",
        type: "matching",
        scenario: "ai-hiring",
        prompt: "將利害關係人與其主要關注點配對。",
        pairs: [
          {
            id: "p1",
            prompt: "用人主管",
            match: "確保偽陰性不影響招募速度",
          },
          {
            id: "p2",
            prompt: "法遵團隊",
            match: "確保族群差異在合理範圍並符合規範",
          },
          {
            id: "p3",
            prompt: "候選人關係管理",
            match: "追蹤偽陽性帶來的申訴與體驗",
          },
        ],
        explanation: "理解各方關切，才能透過價值矩陣協調策略。",
      },
      {
        id: "u5-q7",
        type: "multiple",
        scenario: "ai-hiring",
        prompt: "若模型升級後偽陽性突然下降但人力仍吃緊，可能代表什麼問題？",
        options: [
          { id: "a", text: "閾值過於嚴格導致偽陰性升高" },
          { id: "b", text: "面試流程縮短" },
          { id: "c", text: "資料標記延遲" },
          { id: "d", text: "AI 自動安排面試" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "需檢查是否因閾值過嚴或資料延遲導致漏掉候選人。",
      },
      {
        id: "u5-q8",
        type: "multiple",
        scenario: "ai-hiring",
        prompt: "將價值矩陣結果轉為治理機制時，可採取哪些措施？",
        options: [
          { id: "a", text: "制定錯誤容忍度與對應的人工覆核流程" },
          { id: "b", text: "保留調整紀錄與版本" },
          { id: "c", text: "公開透明度報告" },
          { id: "d", text: "完全不溝通" },
        ],
        correctOptionIds: ["a", "b", "c"],
        explanation: "治理需包含流程、紀錄與對外透明，才能建立信任。",
      },
      {
        id: "u5-q9",
        type: "matching",
        scenario: "ai-hiring",
        prompt: "配對不同職缺類型與合適的錯誤容忍度。",
        pairs: [
          {
            id: "p1",
            prompt: "大量客服招募",
            match: "容忍較高召回率，但需控制偽陽性面試成本",
          },
          {
            id: "p2",
            prompt: "高階主管獵才",
            match: "降低偽陽性，強化人工審核",
          },
          {
            id: "p3",
            prompt: "實習生計畫",
            match: "兼顧多元性與召回率，並提供橋接資源",
          },
        ],
        explanation: "職缺特性決定 FP/FN 的容忍度，需因應調整策略。",
      },
      {
        id: "u5-q10",
        type: "multiple",
        scenario: "ai-hiring",
        prompt: "若發現 AI 招聘系統的偽陽性集中於特定來源 (例如特定求職平台)，應如何處理？",
        options: [
          { id: "a", text: "檢查該來源的資料品質與格式" },
          { id: "b", text: "與來源方協調提供更完整資訊" },
          { id: "c", text: "立即停用所有來源" },
          { id: "d", text: "在價值矩陣中調整該來源的成本權重" },
        ],
        correctOptionIds: ["a", "b", "d"],
        explanation: "需改善資料品質並在成本模型中反映來源差異，必要時與業務協調。",
      },
    ],
    code: {
      title: "招聘階段權重計算",
      description: "以簡化函式示範如何根據職缺類型與階段成本計算綜合評分。",
      content: `const stageWeights = {
  screening: { fpCost: 1, fnCost: 5 },
  assessment: { fpCost: 3, fnCost: 4 },
  interview: { fpCost: 6, fnCost: 3 },
};

export function evaluateCandidate({ stage, fitScore, sourceRisk }) {
  const { fpCost, fnCost } = stageWeights[stage] ?? stageWeights.screening;
  // TODO: 將 fitScore 與 sourceRisk 正規化
  const expectedBenefit = fitScore * 10;
  const expectedFpLoss = fpCost * sourceRisk;
  const expectedFnLoss = fnCost * (1 - fitScore);
  return expectedBenefit - expectedFpLoss + expectedFnLoss;
}

// 下一步：加入公平性指標與族群加權，提升治理透明度。`,
      nextSteps: [
        "將 evaluateCandidate 與面試排程系統整合，提供優先序建議。",
        "記錄模型調整歷程，供治理審計使用。",
        "與候選人申訴機制串接，回寫錯誤案例。",
      ],
    },
  },
  {
    id: "unit-6",
    title: "臨床協作價值矩陣：從模型到流程",
    summary:
      "整合臨床優先順序、資源調度與 AI 模型輸出，確保價值矩陣在醫療現場真正落地。",
    scenario: "medical",
    minutes: 32,
    passThreshold: 74,
    introduction: [
      "醫療場域的價值矩陣需同時考量生命風險、設備使用與醫護負荷。正確的錯誤優先順序能減輕壓力並提升照護成效。",
      "透過跨部門協作與持續監測，我們能將模型輸出轉為臨床可執行的決策。",
    ],
    concepts: [
      {
        heading: "跨科室溝通與責任界定",
        example: "急診、影像與病理科須共享價值矩陣，確保高風險案件能被快速處理。",
        points: [
          {
            title: "角色界定",
            detail: "明確規範誰能調整閾值、誰負責覆核與通報。",
          },
          {
            title: "回饋節奏",
            detail: "安排定期檢討會議，檢視 FP/FN 件數與案例分析。",
          },
          {
            title: "溝通語言",
            detail: "將模型指標轉換為臨床語句，例如等待時間、危險分級。",
          },
        ],
      },
      {
        heading: "資源調度與實驗管理",
        example:
          "在加護病房床位有限時，需要以召回率為主調整排程，同時監控醫護負載。",
        points: [
          {
            title: "資源模型",
            detail: "建立床位、檢查設備與人力的容量模型，對應錯誤成本。",
          },
          {
            title: "實驗控管",
            detail: "所有模型調整需以小規模實驗驗證，觀察錯誤成本變化。",
          },
          {
            title: "告警治理",
            detail: "設置告警閾值，避免因偽陽性讓臨床人員疲乏。",
          },
        ],
      },
    ],
    practice: [
      {
        title: "跨部門價值矩陣看板",
        description: "將急診、影像、病理等科室的錯誤成本整合到同一張看板。",
        steps: [
          "蒐集各科室對 FP/FN 的描述與具體案例。",
          "整理可量化的成本 (等待時間、再入院率、追加檢查成本)。",
          "設計共同儀表板，標示優先警示與責任人。",
        ],
      },
      {
        title: "臨床實驗回顧會議模板",
        description: "建立固定的實驗檢討流程，確保調整可追蹤。",
        steps: [
          "紀錄試行期間的 FP/FN 件數與原因分析。",
          "評估對病患體驗、醫護負荷與合規的影響。",
          "列出後續調整方案與需額外訓練的團隊。",
        ],
      },
    ],
    quiz: [
      {
        id: "u6-q1",
        type: "multiple",
        scenario: "medical",
        prompt: "急診分級系統在面對生命危急病患時，應優先優化哪項指標？",
        options: [
          { id: "a", text: "召回率，確保危急病患被立即標記" },
          { id: "b", text: "隨機指派" },
          { id: "c", text: "完全不考慮錯誤成本" },
          { id: "d", text: "真陰性數量" },
        ],
        correctOptionIds: ["a"],
        explanation: "生命危急場景需優先避免漏報，召回率是最關鍵的指標。",
      },
      {
        id: "u6-q2",
        type: "multiple",
        scenario: "medical",
        prompt: "當偽陽性造成醫護人員疲乏時，應採取哪些措施？ (可複選)",
        options: [
          { id: "a", text: "調整閾值並觀察 FP 變化" },
          { id: "b", text: "增加人工覆核的批次處理" },
          { id: "c", text: "忽略人力負荷" },
          { id: "d", text: "檢討告警內容是否清晰與具體" },
        ],
        correctOptionIds: ["a", "b", "d"],
        explanation: "需透過閾值調整、批次覆核與溝通優化減少警報疲乏。",
      },
      {
        id: "u6-q3",
        type: "matching",
        scenario: "medical",
        prompt: "配對不同科室與其價值矩陣重點。",
        pairs: [
          {
            id: "p1",
            prompt: "急診",
            match: "召回率與告警速度最優先",
          },
          {
            id: "p2",
            prompt: "影像科",
            match: "偽陽性會增加醫師閱片負擔，需要控制",
          },
          {
            id: "p3",
            prompt: "病理科",
            match: "需要平衡精確率與實驗證據，以安排追加檢查",
          },
        ],
        explanation: "各科室資源限制不同，指標優先順序也不同。",
      },
      {
        id: "u6-q4",
        type: "multiple",
        scenario: "medical",
        prompt: "整合價值矩陣到臨床流程時，哪兩點能提升落地成功率？",
        options: [
          { id: "a", text: "將模型輸出轉為可操作的臨床語言" },
          { id: "b", text: "與資訊部門建立即時告警與記錄" },
          { id: "c", text: "僅以電子郵件廣播" },
          { id: "d", text: "不需跨部門協調" },
        ],
        correctOptionIds: ["a", "b"],
        explanation: "需要可行的臨床語言與系統支持，並跨部門協作。",
      },
      {
        id: "u6-q5",
        type: "multiple",
        scenario: "medical",
        prompt: "為何需要記錄每次模型調整的原因與影響？",
        options: [
          { id: "a", text: "符合醫療審計與合規要求" },
          { id: "b", text: "追蹤 FP/FN 變化並導引後續決策" },
          { id: "c", text: "避免知識流失" },
          { id: "d", text: "沒有必要" },
        ],
        correctOptionIds: ["a", "b", "c"],
        explanation: "紀錄能滿足審計、決策與知識傳承需求。",
      },
      {
        id: "u6-q6",
        type: "matching",
        scenario: "medical",
        prompt: "對應不同錯誤與可能的補救措施。",
        pairs: [
          {
            id: "p1",
            prompt: "偽陰性導致延遲住院",
            match: "建立人工提醒與病患追蹤流程",
          },
          {
            id: "p2",
            prompt: "偽陽性增加檢查量",
            match: "安排批次覆核與優化告警內容",
          },
          {
            id: "p3",
            prompt: "真陽性處理時間過長",
            match: "檢討資源調度與工作流程瓶頸",
          },
        ],
        explanation: "價值矩陣不只定位錯誤，也需提出補救對策。",
      },
      {
        id: "u6-q7",
        type: "multiple",
        scenario: "medical",
        prompt: "在實驗階段觀察到偽陽性下降但患者等待時間拉長，代表什麼？",
        options: [
          { id: "a", text: "可能犧牲了召回率，需重新評估閾值" },
          { id: "b", text: "流程自動優化" },
          { id: "c", text: "需要檢查是否增加人工核准步驟" },
          { id: "d", text: "沒有意義" },
        ],
        correctOptionIds: ["a", "c"],
        explanation: "需確認是否因閾值過高或流程新增人工作業而延長等待時間。",
      },
      {
        id: "u6-q8",
        type: "multiple",
        scenario: "medical",
        prompt: "要建立有效的醫療價值矩陣儀表板，應包含哪些元素？",
        options: [
          { id: "a", text: "實時的 FP/FN 件數與趨勢" },
          { id: "b", text: "資源使用量 (床位、檢查設備)" },
          { id: "c", text: "病患體驗指標 (等待時間、滿意度)" },
          { id: "d", text: "醫院附近的餐廳評價" },
        ],
        correctOptionIds: ["a", "b", "c"],
        explanation: "儀表板需整合錯誤指標與資源、體驗資訊，以支援決策。",
      },
      {
        id: "u6-q9",
        type: "matching",
        scenario: "medical",
        prompt: "為不同調整動作選擇合適的驗證方法。",
        pairs: [
          {
            id: "p1",
            prompt: "調整模型閾值",
            match: "以歷史資料回測 FP/FN 變化",
          },
          {
            id: "p2",
            prompt: "導入批次覆核機制",
            match: "追蹤醫護工時與告警量",
          },
          {
            id: "p3",
            prompt: "新增患者教育資訊",
            match: "衡量再入院率與投訴數變化",
          },
        ],
        explanation: "不同調整需對應適合的驗證指標，才能持續改善。",
      },
      {
        id: "u6-q10",
        type: "multiple",
        scenario: "medical",
        prompt: "若價值矩陣顯示某時段偽陰性激增，應如何追查？",
        options: [
          { id: "a", text: "檢視該時段是否有排班或設備維護" },
          { id: "b", text: "查看資料蒐集是否中斷" },
          { id: "c", text: "詢問臨床人員是否調整流程" },
          { id: "d", text: "假裝沒看到" },
        ],
        correctOptionIds: ["a", "b", "c"],
        explanation: "需要同時從人力、設備與資料面排查，找出真正原因。",
      },
    ],
    code: {
      title: "臨床優先佇列計分",
      description: "範例函式示範如何結合危險等級、等待時間與資源使用計算優先度。",
      content: `const riskLevels = {
  critical: { recallWeight: 40, fpWeight: 5 },
  high: { recallWeight: 25, fpWeight: 8 },
  medium: { recallWeight: 15, fpWeight: 10 },
  low: { recallWeight: 8, fpWeight: 12 },
};

export function triageScore({ level, waitMinutes, resourceLoad }) {
  const config = riskLevels[level] ?? riskLevels.low;
  const urgency = config.recallWeight - waitMinutes * 0.5;
  const loadPenalty = resourceLoad * config.fpWeight;
  // TODO: 加入病患體驗與人工覆核可用量
  return urgency - loadPenalty;
}

// 下一步：引入實際床位與人力資料，並與告警系統串接。`,
      nextSteps: [
        "將 triageScore 與醫院資訊系統整合，產生即時排序。",
        "記錄臨床回饋，調整 recallWeight 與 fpWeight。",
        "建立實驗報告模板，確保每次調整都能被追蹤。",
      ],
    },
  },
];
