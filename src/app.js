import { units } from "./data/units.js";
import {
  loadProgress,
  updateUnitProgress,
  loadTeacherState,
  setTeacherMode,
  updateTeacherNote,
  removeTeacherNote,
} from "./storage.js";
import { clamp, formatDateTime, toPercentage, shuffle } from "./utils.js";

const state = {
  units,
  currentUnitId: units[0]?.id ?? null,
  progress: loadProgress(),
  teacherState: loadTeacherState(),
  activeQuiz: null,
};

const elements = {
  unitsPanel: document.querySelector("#units"),
  contentPanel: document.querySelector("#content"),
  scoreboard: document.querySelector("#scoreboard"),
  heroSummary: document.querySelector("#hero-summary"),
  startLearning: document.querySelector("#start-learning"),
  teacherTools: document.querySelector("#teacher-tools"),
  teacherToggle: document.querySelector("#teacher-mode-toggle"),
};

function init() {
  if (!state.currentUnitId && state.units.length > 0) {
    state.currentUnitId = state.units[0].id;
  }

  if (elements.startLearning) {
    elements.startLearning.addEventListener("click", () => {
      document.querySelector("#units")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (elements.teacherToggle) {
    elements.teacherToggle.addEventListener("click", handleTeacherToggle);
    updateTeacherModeUI();
  }

  renderUnitsPanel();
  renderScoreboard();
  renderContent();
  renderHeroSummary();
}

document.addEventListener("DOMContentLoaded", init);

function setCurrentUnit(unitId) {
  if (unitId === state.currentUnitId) return;
  state.currentUnitId = unitId;
  if (state.activeQuiz?.unitId !== unitId) {
    state.activeQuiz = null;
  }
  renderUnitsPanel();
  renderContent();
}

function renderUnitsPanel() {
  const container = elements.unitsPanel;
  if (!container) return;
  container.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = "課程單元";
  container.appendChild(heading);

  state.units.forEach((unit, index) => {
    const card = document.createElement("article");
    card.className = `unit-card ${state.currentUnitId === unit.id ? "active" : ""}`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", state.currentUnitId === unit.id ? "true" : "false");

    const title = document.createElement("h3");
    title.textContent = `${index + 1}. ${unit.title}`;
    card.appendChild(title);

    const summary = document.createElement("p");
    summary.textContent = unit.summary;
    card.appendChild(summary);

    const meta = document.createElement("div");
    meta.className = "unit-meta";
    meta.innerHTML = `
      <span>場景：${translateScenario(unit.scenario)}</span>
      <span>${unit.minutes} 分鐘</span>
    `;
    card.appendChild(meta);

    card.addEventListener("click", () => setCurrentUnit(unit.id));
    card.addEventListener("keypress", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setCurrentUnit(unit.id);
      }
    });

    container.appendChild(card);
  });
}

function renderScoreboard() {
  const container = elements.scoreboard;
  if (!container) return;

  container.innerHTML = "";
  const heading = document.createElement("h2");
  heading.textContent = "學習成果";
  container.appendChild(heading);

  state.units.forEach((unit, index) => {
    const record = state.progress[unit.id];
    const entry = document.createElement("div");
    entry.className = "score-entry";
    entry.classList.toggle("failed", record && record.bestScore < unit.passThreshold);

    const scoreText = record
      ? `最佳成績：${record.bestScore ?? record.lastScore ?? 0}%`
      : "尚未作答";

    entry.innerHTML = `
      <strong>${index + 1}. ${unit.title}</strong>
      <div>場景：${translateScenario(unit.scenario)} ｜ ${unit.minutes} 分鐘</div>
      <div>${scoreText}</div>
      <div>嘗試次數：${record?.attempts ?? 0}</div>
      <div>最後更新：${formatDateTime(record?.completedAt)}</div>
      <div>解鎖程式碼：${record?.unlocked ? "✅" : "🔒"}</div>
    `;

    container.appendChild(entry);
  });
}

function renderHeroSummary() {
  const container = elements.heroSummary;
  if (!container) return;

  const totalUnits = state.units.length;
  const unlockedUnits = state.units.filter((unit) => state.progress[unit.id]?.unlocked).length;
  const attemptedUnits = state.units.filter((unit) => state.progress[unit.id]?.attempts > 0).length;
  const averageScore = (() => {
    const scores = state.units
      .map((unit) => state.progress[unit.id]?.bestScore)
      .filter((score) => typeof score === "number");
    if (!scores.length) return 0;
    const total = scores.reduce((acc, value) => acc + value, 0);
    return Math.round(total / scores.length);
  })();

  container.innerHTML = "";

  const stats = [
    {
      label: "已解鎖單元",
      value: `${unlockedUnits} / ${totalUnits}`,
      description: "完成測驗並取得程式碼片段",
    },
    {
      label: "平均最佳分數",
      value: `${averageScore}%`,
      description: "以解題策略衡量價值敏感度",
    },
    {
      label: "已挑戰單元",
      value: `${attemptedUnits} / ${totalUnits}`,
      description: "持續練習以加深理解",
    },
  ];

  stats.forEach((stat) => {
    const item = document.createElement("div");
    item.className = "hero-stat";
    item.innerHTML = `
      <div>
        <strong>${stat.value}</strong>
        <div>${stat.label}</div>
      </div>
      <p>${stat.description}</p>
    `;
    container.appendChild(item);
  });
}

function renderContent() {
  const container = elements.contentPanel;
  if (!container) return;
  container.innerHTML = "";

  const unit = state.units.find((item) => item.id === state.currentUnitId);
  if (!unit) {
    container.innerHTML = "<p>請先選擇課程單元。</p>";
    return;
  }

  const header = document.createElement("div");
  header.className = "content-header";
  header.innerHTML = `
    <div>
      <h2>${unit.title}</h2>
      <p>${unit.summary}</p>
    </div>
    <div class="chip">${translateScenario(unit.scenario)}｜${unit.minutes} 分鐘</div>
  `;
  container.appendChild(header);

  const introSection = document.createElement("section");
  introSection.className = "concept-section";
  const introHeading = document.createElement("h3");
  introHeading.className = "section-title";
  introHeading.textContent = "核心觀念";
  introSection.appendChild(introHeading);

  unit.introduction.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    introSection.appendChild(p);
  });

  unit.concepts.forEach((concept) => {
    const block = document.createElement("article");
    block.className = "quiz-card";
    const h4 = document.createElement("h3");
    h4.textContent = concept.heading;
    block.appendChild(h4);

    const list = document.createElement("ul");
    list.className = "point-list";
    concept.points.forEach((point) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${point.title}</strong><p>${point.detail}</p>`;
      list.appendChild(li);
    });

    if (concept.example) {
      const example = document.createElement("p");
      example.innerHTML = `<em>情境示範：</em> ${concept.example}`;
      block.appendChild(example);
    }

    block.appendChild(list);
    introSection.appendChild(block);
  });

  container.appendChild(introSection);

  const practiceSection = document.createElement("section");
  practiceSection.className = "practice-section";
  const practiceHeading = document.createElement("h3");
  practiceHeading.className = "section-title";
  practiceHeading.textContent = "實作練習";
  practiceSection.appendChild(practiceHeading);

  unit.practice.forEach((item) => {
    const card = document.createElement("article");
    card.className = "quiz-card";
    const h4 = document.createElement("h3");
    h4.textContent = item.title;
    card.appendChild(h4);

    if (item.description) {
      const desc = document.createElement("p");
      desc.textContent = item.description;
      card.appendChild(desc);
    }

    const list = document.createElement("ul");
    list.className = "point-list";
    item.steps.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      list.appendChild(li);
    });
    card.appendChild(list);

    if (item.hint) {
      const hint = document.createElement("p");
      hint.innerHTML = `<em>提示：</em> ${item.hint}`;
      card.appendChild(hint);
    }

    practiceSection.appendChild(card);
  });

  container.appendChild(practiceSection);

  const quizSection = document.createElement("section");
  quizSection.className = "quiz-section";
  const quizHeading = document.createElement("h3");
  quizHeading.className = "section-title";
  quizHeading.textContent = "概念測驗";
  quizSection.appendChild(quizHeading);

  renderQuiz(unit, quizSection);
  container.appendChild(quizSection);

  const snippetSection = document.createElement("section");
  snippetSection.className = "snippet-section";
  const snippetHeading = document.createElement("h3");
  snippetHeading.className = "section-title";
  snippetHeading.textContent = "程式碼模板";
  snippetSection.appendChild(snippetHeading);

  renderCodeSnippet(unit, snippetSection);
  container.appendChild(snippetSection);

  renderTeacherPanel(unit);
}

function renderQuiz(unit, container) {
  const quizState =
    state.activeQuiz && state.activeQuiz.unitId === unit.id ? state.activeQuiz : null;

  if (!quizState) {
    const introCard = document.createElement("article");
    introCard.className = "quiz-card";
    introCard.innerHTML = `
      <h3>準備好了嗎？</h3>
      <p>完成 ${unit.title} 的 10 題測驗，達到 ${unit.passThreshold}% 以上即可解鎖程式碼片段。</p>
      <div class="quiz-actions">
        <button class="primary-btn" data-action="start-quiz">開始測驗</button>
      </div>
    `;
    introCard.querySelector("[data-action='start-quiz']").addEventListener("click", () => {
      startQuiz(unit);
    });
    container.appendChild(introCard);
    return;
  }

  if (quizState.completed && quizState.result) {
    renderQuizResult(unit, container, quizState);
    return;
  }

  const question = unit.quiz[quizState.currentIndex];
  const card = document.createElement("article");
  card.className = "quiz-card";

  const multiCorrectCount = question.type === "multiple" ? question.correctOptionIds.length : 0;
  card.innerHTML = `
    <div class="quiz-progress">
      <span>題目 ${quizState.currentIndex + 1}／${unit.quiz.length}</span>
      <div class="progress-bar"><span style="width: ${
        ((quizState.currentIndex) / unit.quiz.length) * 100
      }%"></span></div>
    </div>
    <h3>${question.prompt}</h3>
    <p class="meta">場景：${translateScenario(question.scenario)}${
    question.type === "multiple" && multiCorrectCount > 1
      ? "｜可複選"
      : ""
  }</p>
  `;

  if (question.type === "multiple") {
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options";
    question.options.forEach((option) => {
      const optionId = `${question.id}-${option.id}`;
      const wrapper = document.createElement("label");
      wrapper.className = "option";
      const input = document.createElement("input");
      input.type = multiCorrectCount > 1 ? "checkbox" : "radio";
      input.name = question.id;
      input.value = option.id;
      input.id = optionId;
      const stored = quizState.responses[question.id];
      const isSelected = stored?.selectedOptionIds?.includes(option.id);
      if (isSelected) {
        input.checked = true;
      }
      input.addEventListener("change", () => handleOptionChange(question, option.id, input));
      const span = document.createElement("span");
      span.textContent = option.text;

      wrapper.appendChild(input);
      wrapper.appendChild(span);
      optionsContainer.appendChild(wrapper);
    });
    card.appendChild(optionsContainer);
  } else if (question.type === "matching") {
    const rows = document.createElement("div");
    rows.className = "matching-grid";

    if (!quizState.optionOrder[question.id]) {
      const options = question.pairs.map((pair) => pair.match);
      quizState.optionOrder[question.id] = shuffle(options);
    }

    question.pairs.forEach((pair, idx) => {
      const row = document.createElement("div");
      row.className = "matching-row";
      const left = document.createElement("div");
      left.innerHTML = `<strong>${idx + 1}.</strong> ${pair.prompt}`;
      const select = document.createElement("select");
      select.name = `${question.id}-${pair.id}`;
      select.dataset.pairId = pair.id;
      select.innerHTML = `<option value="">選擇對應結果</option>`;
      const stored = quizState.responses[question.id];
      const selected = stored?.matches?.[pair.id] ?? "";

      quizState.optionOrder[question.id].forEach((choice) => {
        const optionEl = document.createElement("option");
        optionEl.value = choice;
        optionEl.textContent = choice;
        if (choice === selected) {
          optionEl.selected = true;
        }
        select.appendChild(optionEl);
      });

      select.addEventListener("change", () => handleMatchChange(question, pair.id, select.value));
      row.appendChild(left);
      row.appendChild(select);
      rows.appendChild(row);
    });

    card.appendChild(rows);
  }

  const actions = document.createElement("div");
  actions.className = "quiz-actions";

  if (quizState.currentIndex > 0) {
    const prevBtn = document.createElement("button");
    prevBtn.className = "secondary-btn";
    prevBtn.textContent = "上一題";
    prevBtn.addEventListener("click", () => {
      quizState.currentIndex = clamp(quizState.currentIndex - 1, 0, unit.quiz.length - 1);
      renderContent();
    });
    actions.appendChild(prevBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = "primary-btn";
  nextBtn.textContent = quizState.currentIndex === unit.quiz.length - 1 ? "提交結果" : "下一題";
  nextBtn.addEventListener("click", () => {
    if (!isAnswerProvided(question, quizState.responses[question.id])) {
      alert("請先作答，再前往下一題或提交結果。");
      return;
    }

    if (quizState.currentIndex === unit.quiz.length - 1) {
      submitQuiz(unit);
    } else {
      quizState.currentIndex = clamp(quizState.currentIndex + 1, 0, unit.quiz.length - 1);
      renderContent();
    }
  });
  actions.appendChild(nextBtn);

  card.appendChild(actions);
  container.appendChild(card);
}

function startQuiz(unit) {
  state.activeQuiz = {
    unitId: unit.id,
    currentIndex: 0,
    responses: {},
    optionOrder: {},
    startedAt: new Date().toISOString(),
    completed: false,
    result: null,
  };
  renderContent();
}

function handleOptionChange(question, optionId, inputElement) {
  if (!state.activeQuiz) return;
  const responses = state.activeQuiz.responses;
  const stored = responses[question.id] || { selectedOptionIds: [] };
  const isMulti = question.correctOptionIds.length > 1;

  if (isMulti) {
    const set = new Set(stored.selectedOptionIds);
    if (inputElement.checked) {
      set.add(optionId);
    } else {
      set.delete(optionId);
    }
    responses[question.id] = { selectedOptionIds: Array.from(set) };
  } else {
    responses[question.id] = { selectedOptionIds: [optionId] };
    // Remove other radio selections in DOM are handled automatically by browser
  }
}

function handleMatchChange(question, pairId, value) {
  if (!state.activeQuiz) return;
  const responses = state.activeQuiz.responses;
  const stored = responses[question.id] || { matches: {} };
  stored.matches = { ...stored.matches, [pairId]: value };
  responses[question.id] = stored;
}

function isAnswerProvided(question, response) {
  if (question.type === "multiple") {
    return Boolean(response?.selectedOptionIds?.length);
  }
  if (question.type === "matching") {
    if (!response?.matches) return false;
    return question.pairs.every((pair) => response.matches[pair.id]);
  }
  return false;
}

function submitQuiz(unit) {
  if (!state.activeQuiz || state.activeQuiz.unitId !== unit.id) return;
  const quizState = state.activeQuiz;

  const evaluation = evaluateQuiz(unit, quizState.responses);

  quizState.completed = true;
  quizState.result = evaluation;

  const currentRecord = state.progress[unit.id] || {};
  const attempts = (currentRecord.attempts || 0) + 1;
  const bestScore = Math.max(currentRecord.bestScore || 0, evaluation.scorePercent);
  const unlocked = evaluation.scorePercent >= unit.passThreshold || currentRecord.unlocked;

  state.progress = updateUnitProgress(unit.id, {
    attempts,
    lastScore: evaluation.scorePercent,
    bestScore,
    earnedPoints: evaluation.earnedPoints,
    totalPoints: evaluation.totalPoints,
    unlocked,
    completedAt: new Date().toISOString(),
    questionBreakdown: evaluation.details,
  });

  renderScoreboard();
  renderHeroSummary();
  renderContent();
}

function evaluateQuiz(unit, responses) {
  let earnedPoints = 0;
  let totalPoints = 0;
  const details = unit.quiz.map((question) => {
    const response = responses[question.id];
    if (question.type === "multiple") {
      const isCorrect = compareSelections(
        question.correctOptionIds,
        response?.selectedOptionIds || []
      );
      const questionPoints = 1;
      totalPoints += questionPoints;
      if (isCorrect) {
        earnedPoints += questionPoints;
      }
      return {
        questionId: question.id,
        prompt: question.prompt,
        type: question.type,
        isCorrect,
        earnedPoints: isCorrect ? questionPoints : 0,
        totalPoints: questionPoints,
        explanation: question.explanation,
        expected: question.correctOptionIds,
        response: response?.selectedOptionIds || [],
        options: question.options,
      };
    }

    if (question.type === "matching") {
      let questionEarned = 0;
      const matches = response?.matches || {};
      question.pairs.forEach((pair) => {
        totalPoints += 1;
        if (matches[pair.id] === pair.match) {
          questionEarned += 1;
          earnedPoints += 1;
        }
      });
      return {
        questionId: question.id,
        prompt: question.prompt,
        type: question.type,
        isCorrect: questionEarned === question.pairs.length,
        earnedPoints: questionEarned,
        totalPoints: question.pairs.length,
        explanation: question.explanation,
        expected: question.pairs.map((pair) => ({ id: pair.id, match: pair.match })),
        response: matches,
        pairs: question.pairs,
      };
    }

    return null;
  });

  const scorePercent = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
  return { earnedPoints, totalPoints, scorePercent, details };
}

function compareSelections(answerIds, selectedIds) {
  if (!answerIds) return false;
  const answerSet = new Set(answerIds);
  const selectedSet = new Set(selectedIds);
  if (answerSet.size !== selectedSet.size) return false;
  for (const id of answerSet) {
    if (!selectedSet.has(id)) return false;
  }
  return true;
}

function renderQuizResult(unit, container, quizState) {
  const { result } = quizState;
  const card = document.createElement("article");
  card.className = "quiz-card";

  const passed = result.scorePercent >= unit.passThreshold;
  const banner = document.createElement("div");
  banner.className = `result-banner ${passed ? "" : "fail"}`;
  banner.innerHTML = `
    <h3>${passed ? "恭喜完成！" : "再接再厲"}</h3>
    <p>分數：<strong>${result.scorePercent}%</strong>（${result.earnedPoints} / ${
    result.totalPoints
  } 分）</p>
    <p>${
      passed
        ? "你已成功解鎖本單元的程式碼模板，可在下方查看並延伸實作。"
        : `未達 ${unit.passThreshold}%，歡迎依據解析調整策略後再試一次。`
    }</p>
  `;
  card.appendChild(banner);

  const detailHeading = document.createElement("h4");
  detailHeading.textContent = "題目解析";
  card.appendChild(detailHeading);

  const list = document.createElement("ol");
  result.details.forEach((detail) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${detail.prompt}</strong>`;
    const status = document.createElement("p");
    status.textContent = detail.isCorrect ? "✅ 正確" : "⚠️ 需再思考";
    li.appendChild(status);

    if (detail.type === "multiple") {
      const answerText = detail.options
        .filter((option) => detail.expected.includes(option.id))
        .map((option) => option.text)
        .join("、");
      const userText = detail.options
        .filter((option) => detail.response.includes(option.id))
        .map((option) => option.text)
        .join("、") || "未作答";
      const p = document.createElement("p");
      p.textContent = `正確解答：${answerText} ｜ 你的作答：${userText}`;
      li.appendChild(p);
    } else if (detail.type === "matching") {
      const table = document.createElement("ul");
      table.className = "point-list";
      detail.pairs.forEach((pair, idx) => {
        const item = document.createElement("li");
        const userAnswer = detail.response[pair.id] || "未選擇";
        item.innerHTML = `<strong>${idx + 1}. ${pair.prompt}</strong><p>正確：${
          pair.match
        } ｜ 你的作答：${userAnswer}</p>`;
        table.appendChild(item);
      });
      li.appendChild(table);
    }

    const teacherReference = getTeacherReference(unit.id, detail.questionId);
    if (teacherReference) {
      const teacherNote = document.createElement("p");
      const teacherLabel = document.createElement("em");
      teacherLabel.textContent = "教師答案參考：";
      teacherNote.appendChild(teacherLabel);
      teacherNote.append(` ${teacherReference}`);
      li.appendChild(teacherNote);
    }

    if (detail.explanation && (!teacherReference || teacherReference !== detail.explanation)) {
      const note = document.createElement("p");
      const defaultLabel = document.createElement("em");
      defaultLabel.textContent = "原始解析：";
      note.appendChild(defaultLabel);
      note.append(` ${detail.explanation}`);
      li.appendChild(note);
    }

    list.appendChild(li);
  });

  card.appendChild(list);

  const actions = document.createElement("div");
  actions.className = "quiz-actions";
  const retryBtn = document.createElement("button");
  retryBtn.className = "secondary-btn";
  retryBtn.textContent = "重新挑戰";
  retryBtn.addEventListener("click", () => startQuiz(unit));
  actions.appendChild(retryBtn);

  card.appendChild(actions);
  container.appendChild(card);
}

function renderCodeSnippet(unit, container) {
  const record = state.progress[unit.id];
  const unlocked = Boolean(record?.unlocked);

  const card = document.createElement("article");
  card.className = "code-snippet";
  if (!unlocked) {
    card.classList.add("locked");
  }

  const title = document.createElement("h4");
  title.textContent = unit.code.title;
  card.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = unit.code.description;
  card.appendChild(desc);

  if (unlocked) {
    const pre = document.createElement("pre");
    pre.textContent = unit.code.content.trim();
    card.appendChild(pre);
    if (unit.code.nextSteps?.length) {
      const list = document.createElement("ul");
      list.className = "point-list";
      unit.code.nextSteps.forEach((step) => {
        const li = document.createElement("li");
        li.textContent = step;
        list.appendChild(li);
      });
      card.appendChild(list);
    }
  } else {
    const lockInfo = document.createElement("p");
    lockInfo.innerHTML = `🔒 尚未解鎖。請達到 ${unit.passThreshold}% 以上的測驗成績後查看程式碼模板。`;
    card.appendChild(lockInfo);
  }

  container.appendChild(card);
}

function isTeacherMode() {
  return Boolean(state.teacherState?.enabled);
}

function handleTeacherToggle() {
  const next = !isTeacherMode();
  state.teacherState = setTeacherMode(next);
  updateTeacherModeUI();
  renderContent();
  renderHeroSummary();
}

function updateTeacherModeUI() {
  const enabled = isTeacherMode();
  if (elements.teacherToggle) {
    elements.teacherToggle.setAttribute("aria-pressed", enabled ? "true" : "false");
    elements.teacherToggle.classList.toggle("active", enabled);
    elements.teacherToggle.textContent = enabled ? "教師版（開啟）" : "教師版";
  }
  if (!enabled && elements.teacherTools) {
    elements.teacherTools.classList.remove("active");
    elements.teacherTools.innerHTML = "";
  }
}

function getTeacherReference(unitId, questionId) {
  return state.teacherState?.notes?.[unitId]?.[questionId]?.referenceNote || "";
}

function getTeacherNoteMeta(unitId, questionId) {
  return state.teacherState?.notes?.[unitId]?.[questionId] || null;
}

function handleTeacherNoteSave(unitId, questionId, textValue) {
  const trimmed = textValue.trim();
  if (trimmed) {
    state.teacherState = updateTeacherNote(unitId, questionId, trimmed);
  } else {
    state.teacherState = removeTeacherNote(unitId, questionId);
  }
  updateTeacherModeUI();
  renderContent();
}

function handleTeacherNoteReset(unitId, questionId) {
  state.teacherState = removeTeacherNote(unitId, questionId);
  updateTeacherModeUI();
  renderContent();
}

function renderTeacherPanel(unit) {
  const container = elements.teacherTools;
  if (!container) return;

  const enabled = isTeacherMode();
  if (!enabled) {
    container.classList.remove("active");
    container.innerHTML = "";
    return;
  }

  container.classList.add("active");
  container.innerHTML = "";

  const heading = document.createElement("h2");
  heading.innerHTML = `教師答案參考面板 <span>Teacher Mode</span>`;
  container.appendChild(heading);

  const intro = document.createElement("p");
  intro.className = "teacher-meta";
  intro.textContent = "此處可直接檢視或編輯答案參考，所有調整僅儲存在本機瀏覽器。";
  container.appendChild(intro);

  if (!unit) {
    const empty = document.createElement("p");
    empty.textContent = "請先選擇單元以管理教師版答案參考。";
    container.appendChild(empty);
    return;
  }

  unit.quiz.forEach((question, index) => {
    const card = document.createElement("article");
    card.className = "teacher-card";

    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = `${index + 1}. ${question.prompt}`;
    header.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "teacher-meta";
    const noteMeta = getTeacherNoteMeta(unit.id, question.id);
    const pieces = [
      `類型：${translateQuestionType(question)}`,
      `場景：${translateScenario(question.scenario)}`,
    ];
    if (noteMeta?.updatedAt) {
      pieces.push(`更新：${formatDateTime(noteMeta.updatedAt)}`);
    }
    meta.textContent = pieces.join(" ｜ ");
    header.appendChild(meta);
    card.appendChild(header);

    const answerBox = document.createElement("div");
    answerBox.className = "teacher-answer";
    answerBox.appendChild(buildTeacherAnswerContent(question));
    card.appendChild(answerBox);

    const textarea = document.createElement("textarea");
    textarea.id = `teacher-note-${question.id}`;
    const existingNote = getTeacherReference(unit.id, question.id);
    const baseline = question.explanation || "";
    textarea.value = existingNote || baseline;
    textarea.placeholder = baseline
      ? "自訂或調整答案參考內容"
      : "尚未提供官方解析，可自行撰寫教師參考";
    card.appendChild(textarea);

    const actions = document.createElement("div");
    actions.className = "teacher-actions";

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "secondary-btn";
    resetBtn.textContent = "還原預設";
    const hasCustomNote = Boolean(getTeacherNoteMeta(unit.id, question.id));
    resetBtn.disabled = !hasCustomNote && !baseline;
    resetBtn.title = hasCustomNote ? "移除自訂答案參考" : "";
    resetBtn.addEventListener("click", () => {
      handleTeacherNoteReset(unit.id, question.id);
    });

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "primary-btn";
    saveBtn.textContent = "儲存教師版";
    saveBtn.addEventListener("click", () => {
      handleTeacherNoteSave(unit.id, question.id, textarea.value);
    });

    actions.appendChild(resetBtn);
    actions.appendChild(saveBtn);
    card.appendChild(actions);

    container.appendChild(card);
  });
}

function buildTeacherAnswerContent(question) {
  if (question.type === "multiple") {
    const list = document.createElement("ul");
    list.className = "point-list";
    question.correctOptionIds.forEach((optionId) => {
      const option = question.options.find((item) => item.id === optionId);
      const li = document.createElement("li");
      li.textContent = option ? option.text : optionId;
      list.appendChild(li);
    });
    return list;
  }

  if (question.type === "matching") {
    const list = document.createElement("ul");
    list.className = "point-list";
    question.pairs.forEach((pair, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${idx + 1}. ${pair.prompt}</strong><p>${pair.match}</p>`;
      list.appendChild(li);
    });
    return list;
  }

  const paragraph = document.createElement("p");
  paragraph.textContent = "目前尚未提供答案資訊。";
  return paragraph;
}

function translateScenario(scenario) {
  switch (scenario) {
    case "ecommerce":
      return "電商";
    case "medical":
      return "醫療";
    case "social":
      return "社交";
    case "education":
      return "教育";
    case "ai-hiring":
      return "AI 招聘";
    default:
      return "多場域";
  }
}

function translateQuestionType(question) {
  if (question.type === "multiple") {
    return question.correctOptionIds?.length > 1 ? "多選題" : "單選題";
  }
  if (question.type === "matching") {
    return "連連看";
  }
  return "題目";
}
