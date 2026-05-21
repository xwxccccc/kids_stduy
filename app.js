const demoUnit = (grade, theme, words) => ({
  id: `g${grade}-demo`,
  title: `${grade} 年级示例：${theme}`,
  theme,
  subtitle: "这是保留的年级示例课；S3 复习课已经按 PDF OCR 内容整理为 12 个单元。",
  words,
  patterns: ["I like ...", "This is ...", "The ... is ..."],
  sentencePrompts: [
    { chips: ["I", "like", words[0].word], sample: `I like ${words[0].word}.` },
    { chips: ["This", "is", "my", words[1].word], sample: `This is my ${words[1].word}.` }
  ],
  story: {
    title: `${theme} Time`,
    text: `This is a short ${theme.toLowerCase()} story. I can read the words and write a sentence.`,
    quiz: [
      { question: "What can I do?", options: ["Read and write", "Sleep all day", "Close the book"], answer: "Read and write" }
    ]
  }
});

const baseUnits = {
  "1": [demoUnit(1, "Starter Words", [
    { word: "apple", meaning: "苹果", example: "I like an apple." },
    { word: "book", meaning: "书", example: "This is my book." },
    { word: "cat", meaning: "猫", example: "The cat is cute." },
    { word: "sun", meaning: "太阳", example: "The sun is warm." }
  ])],
  "2": [demoUnit(2, "Actions", [
    { word: "jump", meaning: "跳", example: "I can jump." },
    { word: "milk", meaning: "牛奶", example: "I drink milk." },
    { word: "desk", meaning: "书桌", example: "My desk is clean." },
    { word: "friend", meaning: "朋友", example: "She is my friend." }
  ])],
  "3": [demoUnit(3, "School and Family", [
    { word: "library", meaning: "图书馆", example: "We read in the library." },
    { word: "family", meaning: "家人", example: "My family is happy." },
    { word: "teacher", meaning: "老师", example: "Our teacher is kind." },
    { word: "garden", meaning: "花园", example: "There are flowers in the garden." }
  ])],
  "4": [demoUnit(4, "Reasons", [
    { word: "because", meaning: "因为", example: "I smile because I am happy." },
    { word: "healthy", meaning: "健康的", example: "Fruit is healthy." },
    { word: "weather", meaning: "天气", example: "The weather is sunny." },
    { word: "practice", meaning: "练习", example: "I practice English." }
  ])],
  "5": [demoUnit(5, "Plans", [
    { word: "plan", meaning: "计划", example: "I have a plan." },
    { word: "favorite", meaning: "最喜欢的", example: "My favorite subject is English." },
    { word: "interesting", meaning: "有趣的", example: "The story is interesting." },
    { word: "improve", meaning: "提高", example: "I read to improve English." }
  ])],
  "6": [demoUnit(6, "Challenges", [
    { word: "explain", meaning: "解释", example: "Can you explain your answer?" },
    { word: "confident", meaning: "自信的", example: "Practice makes me confident." },
    { word: "although", meaning: "虽然", example: "Although it rains, we still read." },
    { word: "challenge", meaning: "挑战", example: "This quiz is a challenge." }
  ])],
  S3: window.S3_UNITS || [],
  S4: window.S4_UNITS || []
};

const courseLabels = {
  "1": "一年级",
  "2": "二年级",
  "3": "三年级",
  "4": "四年级",
  "5": "五年级",
  "6": "六年级",
  S3: "S3 复习课",
  S4: "S4 复习课"
};

const tasks = [
  { id: "words", icon: "Aa", title: "单词卡", text: "听读核心词，再完成看中文选英文。" },
  { id: "spelling", icon: "拼", title: "拼写练习", text: "观察缺字母单词，选择正确字母补全。" },
  { id: "sentences", icon: "句", title: "写句子", text: "用提示词写一个完整英文句子。" },
  { id: "reading", icon: "读", title: "分级阅读", text: "读一篇短文并完成理解题。" }
];

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
const phonicsChunks = [
  "tion", "ough", "eigh", "air", "are", "ear", "igh", "all", "alk", "old", "ild", "ind",
  "sh", "ch", "th", "wh", "ph", "ck", "ng", "nk", "qu", "ai", "ay", "ee", "ea", "oa",
  "ow", "ou", "oo", "oi", "oy", "ue", "ui", "ew", "ar", "er", "ir", "or", "ur", "le"
];

const state = {
  level: "S3",
  unitIndex: 0,
  wordIndex: 0,
  wordMode: "study",
  spellIndex: 0,
  sentenceIndex: 0,
  quizIndex: 0,
  sentenceChoices: [],
  selectedSentence: [],
  progress: loadProgress()
};

let autoAdvanceTimer = null;

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem("sproutEnglishProgressV3")) || {};
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem("sproutEnglishProgressV3", JSON.stringify(state.progress));
}

function currentUnits() {
  return baseUnits[state.level] || baseUnits.S3 || baseUnits["1"];
}

function currentLesson() {
  return currentUnits()[state.unitIndex] || currentUnits()[0];
}

function progressKey() {
  return `${state.level}:${currentLesson().id}`;
}

function currentProgress() {
  const key = progressKey();
  if (!state.progress[key]) {
    state.progress[key] = {
      mastered: [],
      weak: [],
      correct: 0,
      attempts: 0,
      done: {},
      quizAnswered: {}
    };
  }
  return state.progress[key];
}

function setView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === viewId));
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.86;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function markDone(taskId) {
  currentProgress().done[taskId] = true;
  saveProgress();
  renderDashboard();
  renderReport();
}

function recordAttempt(isCorrect, word) {
  const progress = currentProgress();
  progress.attempts += 1;
  if (isCorrect) {
    progress.correct += 1;
    if (word) progress.weak = progress.weak.filter((item) => item !== word);
  } else if (word && !progress.weak.includes(word)) {
    progress.weak.push(word);
  }
  saveProgress();
}

function resetPracticeIndexes() {
  state.wordIndex = 0;
  state.spellIndex = 0;
  state.sentenceIndex = 0;
  state.quizIndex = 0;
  state.sentenceChoices = [];
  state.selectedSentence = [];
}

function scheduleAdvance(callback) {
  window.clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = window.setTimeout(callback, 700);
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function wordChoiceOptions(targetWord) {
  const lessonWords = currentLesson().words.map((item) => item.word);
  const choices = [targetWord];
  shuffle(lessonWords).forEach((word) => {
    if (choices.length < 4 && !choices.includes(word)) choices.push(word);
  });
  return shuffle(choices);
}

function titleWord(word) {
  return word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : "";
}

function sentenceTokens(prompt) {
  return (prompt.chips || prompt.sample.replace(/[.?!]/g, "").split(/\s+/))
    .map((chip) => chip.replace(/[.?!]/g, "").trim())
    .filter(Boolean);
}

function formatSentenceToken(token, index = 1) {
  const lower = token.toLowerCase();
  if (lower === "i") return "I";
  if (lower === "i'm") return "I'm";
  if (lower === "i'd") return "I'd";
  if (lower === "it's") return index === 0 ? "It's" : "it's";
  if (lower === "let's") return index === 0 ? "Let's" : "let's";
  return index === 0 ? titleWord(lower) : lower;
}

function shuffledSentenceChoices(tokens) {
  const choices = tokens.map((token, index) => ({ token, id: `${index}-${token}` }));
  const shuffled = shuffle(choices);
  const unchanged = shuffled.every((item, index) => item.id === choices[index].id);
  return unchanged && shuffled.length > 1 ? [shuffled[1], shuffled[0], ...shuffled.slice(2)] : shuffled;
}

function maskedWordData(word) {
  const clean = word.toLowerCase();
  const chunkMatches = phonicsChunks
    .flatMap((chunk) => {
      const index = clean.indexOf(chunk);
      return index > 0 && index + chunk.length < clean.length ? [{ chunk, index }] : [];
    })
    .sort((a, b) => b.chunk.length - a.chunk.length);

  const vowelMatches = [...clean.matchAll(/[aeiou]{1,2}/g)]
    .filter((match) => match.index > 0 && match.index + match[0].length < clean.length)
    .map((match) => ({ chunk: match[0], index: match.index }));

  const letterMatches = clean
    .split("")
    .map((letter, index) => ({ chunk: letter, index }))
    .filter((item) => /[a-z]/.test(item.chunk) && item.index > 0 && item.index < clean.length - 1);

  const candidates = [...chunkMatches, ...vowelMatches, ...letterMatches];
  const target = candidates[Math.min(Math.floor(candidates.length / 2), candidates.length - 1)] || { chunk: clean.slice(-1), index: clean.length - 1 };
  const masked = `${clean.slice(0, target.index)}${"_".repeat(target.chunk.length)}${clean.slice(target.index + target.chunk.length)}`;

  const sameLengthChunks = phonicsChunks.filter((chunk) => chunk.length === target.chunk.length && chunk !== target.chunk);
  const fallback = target.chunk.length === 1 ? alphabet.filter((letter) => letter !== target.chunk) : sameLengthChunks;
  const options = [target.chunk];
  shuffle(fallback).forEach((pick) => {
    if (options.length < 4 && !options.includes(pick)) options.push(pick);
  });

  return {
    masked: titleWord(masked),
    missing: target.chunk,
    options: shuffle(options),
    optionStartsWord: target.index === 0,
    hint: target.chunk.length > 1 ? "补全这个自然拼读组合" : "补全这个发音字母"
  };
}

function renderUnitPicker() {
  const units = currentUnits();
  const unitPicker = document.getElementById("unitPicker");
  unitPicker.classList.toggle("visible", units.length > 1);
  document.getElementById("unitSelect").innerHTML = units.map((unit, index) => `<option value="${index}">${index + 1}. ${unit.theme}</option>`).join("");
  document.getElementById("unitSelect").value = String(state.unitIndex);
}

function renderDashboard() {
  const lesson = currentLesson();
  const progress = currentProgress();
  const doneCount = tasks.filter((task) => progress.done[task.id]).length;
  const unitCount = currentUnits().length;

  document.getElementById("courseEyebrow").textContent = state.level === "S3" || state.level === "S4" ? `${state.level} PDF 知识点提炼复习课` : "原创小学英语学习原型";
  document.getElementById("unitKicker").textContent = `${courseLabels[state.level]} · ${lesson.theme}`;
  document.getElementById("dailyTitle").textContent = lesson.title;
  document.getElementById("dailySubtitle").textContent = lesson.subtitle;
  document.getElementById("patternStrip").innerHTML = lesson.patterns.map((pattern) => `<span>${pattern}</span>`).join("");
  document.getElementById("statDone").textContent = `${doneCount}/4`;
  document.getElementById("statMastered").textContent = progress.mastered.length;
  document.getElementById("statUnit").textContent = `${state.unitIndex + 1}/${unitCount}`;
  document.getElementById("statAccuracy").textContent = `${progress.attempts ? Math.round((progress.correct / progress.attempts) * 100) : 0}%`;

  document.getElementById("taskGrid").innerHTML = tasks.map((task) => `
    <article class="task-card ${progress.done[task.id] ? "complete" : ""}">
      <div class="task-icon">${task.icon}</div>
      <h3>${task.title}</h3>
      <p>${task.text}</p>
      <button class="secondary-btn" data-jump="${task.id}">${progress.done[task.id] ? "再练一次" : "去完成"}</button>
    </article>
  `).join("");
}

function renderWords() {
  const lesson = currentLesson();
  const word = lesson.words[state.wordIndex];
  const progress = currentProgress();
  const isQuiz = state.wordMode === "quiz";

  document.querySelectorAll("[data-word-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.wordMode === state.wordMode);
  });

  document.getElementById("wordCard").innerHTML = isQuiz ? `
    <p class="prompt-label">看中文，选择正确英文</p>
    <div class="meaning quiz-meaning">${word.meaning}</div>
    <p class="example">不要看词卡，直接回忆这个中文对应的英文单词。</p>
    <div class="choice-options">
      ${wordChoiceOptions(word.word).map((option) => `<button class="option-btn" data-word-choice="${option}">${titleWord(option)}</button>`).join("")}
    </div>
    <p class="feedback" id="wordChoiceFeedback" aria-live="polite"></p>
  ` : `
    <p class="prompt-label">核心词 ${state.wordIndex + 1}/${lesson.words.length}</p>
    <div class="word">${titleWord(word.word)}</div>
    <div class="meaning">${word.meaning}</div>
    <p class="example">${word.example}</p>
    <div class="hero-actions">
      <button class="primary-btn" id="speakWord">听发音</button>
      <button class="secondary-btn" id="masterWord">${progress.mastered.includes(word.word) ? "已掌握" : "我掌握了"}</button>
    </div>
  `;

  document.getElementById("wordChoicePanel").innerHTML = `
    <p class="prompt-label">${isQuiz ? "当前模式" : "下一步"}</p>
    <h3>${isQuiz ? "测验中" : "准备好了再测"}</h3>
    <p>${isQuiz ? "答对后会自动进入下一个中文。" : "先看词卡、听发音、读例句，然后切换到测验模式。"}</p>
  `;

  document.querySelector(".word-layout").classList.toggle("quiz-mode", isQuiz);
  document.getElementById("wordList").innerHTML = lesson.words.map((item, index) => `
    <button class="word-item ${index === state.wordIndex ? "active" : ""}" data-word-index="${index}">
      <strong>${titleWord(item.word)}</strong><br />
      <span>${item.meaning}</span>
    </button>
  `).join("");
}

function renderSpelling() {
  const word = currentLesson().words[state.spellIndex];
  const data = maskedWordData(word.word);
  document.getElementById("spellPrompt").textContent = word.meaning;
  document.querySelector("#spelling .prompt-label").textContent = `${data.hint}，读一读前后字母再选择`;
  document.getElementById("maskedWord").innerHTML = data.masked.split("").map((letter) => `<span class="${letter === "_" ? "blank" : ""}">${letter}</span>`).join("");
  document.getElementById("maskedWord").dataset.missing = data.missing;
  document.getElementById("letterOptions").innerHTML = data.options.map((chunk) => {
    const label = data.optionStartsWord ? titleWord(chunk) : chunk.toLowerCase();
    return `<button class="letter-btn" data-letter-choice="${chunk}">${label}</button>`;
  }).join("");
  document.getElementById("spellFeedback").textContent = "";
}

function renderSentence() {
  const sentence = currentLesson().sentencePrompts[state.sentenceIndex] || currentLesson().sentencePrompts[0];
  const tokens = sentenceTokens(sentence);
  if (!state.sentenceChoices.length) {
    state.sentenceChoices = shuffledSentenceChoices(tokens);
  }

  document.getElementById("sentenceAnswer").innerHTML = state.selectedSentence.map((item, index) => `
    <button class="chip chip-button selected" data-sentence-selected="${index}">
      ${formatSentenceToken(item.token, index)}
    </button>
  `).join("");

  document.getElementById("sentenceChips").innerHTML = state.sentenceChoices.map((item) => {
    const used = state.selectedSentence.some((selected) => selected.id === item.id);
    return `
      <button class="chip chip-button ${used ? "used" : ""}" data-sentence-choice="${item.id}" ${used ? "disabled" : ""}>
        ${formatSentenceToken(item.token)}
      </button>
    `;
  }).join("");
  document.getElementById("sentenceFeedback").textContent = "";
}

function renderReading() {
  const story = currentLesson().story;
  const quizIndex = Math.min(state.quizIndex, story.quiz.length - 1);
  const item = story.quiz[quizIndex];
  document.getElementById("storyTitle").textContent = story.title;
  document.getElementById("storyText").textContent = story.text;
  document.getElementById("quizFeedback").textContent = "";
  document.getElementById("quizQuestions").innerHTML = `
    <div class="quiz-question">
      <p>${quizIndex + 1}/${story.quiz.length}. ${item.question}</p>
      <div class="quiz-options">
        ${item.options.map((option) => `<button class="option-btn" data-quiz-index="${quizIndex}" data-answer="${option}">${option}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderReport() {
  const lesson = currentLesson();
  const progress = currentProgress();
  const weak = progress.weak.length ? progress.weak : lesson.words.slice(0, 3).map((item) => item.word);
  const accuracy = progress.attempts ? Math.round((progress.correct / progress.attempts) * 100) : 0;
  const doneCount = tasks.filter((task) => progress.done[task.id]).length;
  const wordScore = Math.min(100, Math.round((progress.mastered.length / lesson.words.length) * 100));

  document.getElementById("reportAdvice").textContent =
    doneCount < 4
      ? `建议先完成 ${lesson.theme} 单元的四个任务，再复习薄弱词。`
      : accuracy >= 80
        ? "今天表现很稳，可以让孩子口头复述阅读短文，再写一句自己的例句。"
        : "建议先复习错词，再做一次拼写练习，降低挫败感。";

  document.getElementById("weakWords").innerHTML = weak.map((word) => `
    <div class="review-item"><strong>${word}</strong><span>建议复习</span></div>
  `).join("");

  const scores = [
    ["单词", wordScore],
    ["拼写", accuracy],
    ["句子", progress.done.sentences ? 82 : 35],
    ["阅读", progress.done.reading ? 86 : 40]
  ];

  document.getElementById("skillBars").innerHTML = scores.map(([label, value]) => `
    <div class="bar-row">
      <span>${label}</span>
      <div class="bar-track"><div class="bar-fill" style="width: ${value}%"></div></div>
      <strong>${value}%</strong>
    </div>
  `).join("");
}

function renderAll() {
  renderUnitPicker();
  renderDashboard();
  renderWords();
  renderSpelling();
  renderSentence();
  renderReading();
  renderReport();
}

document.addEventListener("click", (event) => {
  const jump = event.target.closest("[data-jump]");
  if (jump) {
    setView(jump.dataset.jump);
    return;
  }

  const nav = event.target.closest(".nav-item");
  if (nav) {
    setView(nav.dataset.view);
    return;
  }

  const wordItem = event.target.closest("[data-word-index]");
  if (wordItem) {
    state.wordIndex = Number(wordItem.dataset.wordIndex);
    renderWords();
    return;
  }

  const wordMode = event.target.closest("[data-word-mode]");
  if (wordMode) {
    state.wordMode = wordMode.dataset.wordMode;
    renderWords();
    return;
  }

  const sentenceChoice = event.target.closest("[data-sentence-choice]");
  if (sentenceChoice) {
    const item = state.sentenceChoices.find((choice) => choice.id === sentenceChoice.dataset.sentenceChoice);
    if (item && !state.selectedSentence.some((selected) => selected.id === item.id)) {
      state.selectedSentence.push(item);
      renderSentence();
    }
    return;
  }

  const sentenceSelected = event.target.closest("[data-sentence-selected]");
  if (sentenceSelected) {
    state.selectedSentence.splice(Number(sentenceSelected.dataset.sentenceSelected), 1);
    renderSentence();
    return;
  }

  const wordChoice = event.target.closest("[data-word-choice]");
  if (wordChoice) {
    const word = currentLesson().words[state.wordIndex];
    const isCorrect = wordChoice.dataset.wordChoice === word.word;
    const feedback = document.getElementById("wordChoiceFeedback");
    feedback.textContent = isCorrect ? "选对了！" : `再想想，${word.meaning} 是 ${word.word}。`;
    feedback.className = `feedback ${isCorrect ? "ok" : "warn"}`;
    recordAttempt(isCorrect, word.word);
    if (isCorrect) {
      const progress = currentProgress();
      if (!progress.mastered.includes(word.word)) progress.mastered.push(word.word);
      markDone("words");
      scheduleAdvance(() => {
        state.wordIndex = (state.wordIndex + 1) % currentLesson().words.length;
        renderWords();
      });
    }
    return;
  }

  const letterChoice = event.target.closest("[data-letter-choice]");
  if (letterChoice) {
    const word = currentLesson().words[state.spellIndex];
    const isCorrect = letterChoice.dataset.letterChoice === document.getElementById("maskedWord").dataset.missing;
    const feedback = document.getElementById("spellFeedback");
    feedback.textContent = isCorrect ? `补全正确：${titleWord(word.word)}` : `还差一点，完整单词是 ${titleWord(word.word)}。`;
    feedback.className = `feedback ${isCorrect ? "ok" : "warn"}`;
    recordAttempt(isCorrect, word.word);
    if (isCorrect) {
      markDone("spelling");
      scheduleAdvance(() => {
        state.spellIndex = (state.spellIndex + 1) % currentLesson().words.length;
        renderSpelling();
      });
    }
    return;
  }

  const option = event.target.closest("[data-quiz-index]");
  if (option) {
    const quizIndex = Number(option.dataset.quizIndex);
    const quiz = currentLesson().story.quiz[quizIndex];
    const isCorrect = option.dataset.answer === quiz.answer;
    const progress = currentProgress();
    progress.quizAnswered[quizIndex] = isCorrect;
    document.getElementById("quizFeedback").textContent = isCorrect ? "回答正确！" : "再读一遍短文，答案就在里面。";
    document.getElementById("quizFeedback").className = `feedback ${isCorrect ? "ok" : "warn"}`;
    recordAttempt(isCorrect);
    if (isCorrect) {
      const allCorrect = currentLesson().story.quiz.every((_, index) => progress.quizAnswered[index]);
      if (allCorrect) {
        markDone("reading");
      } else {
        scheduleAdvance(() => {
          state.quizIndex = Math.min(state.quizIndex + 1, currentLesson().story.quiz.length - 1);
          renderReading();
        });
      }
    }
  }
});

document.getElementById("gradeSelect").addEventListener("change", (event) => {
  state.level = event.target.value;
  state.unitIndex = 0;
  resetPracticeIndexes();
  renderAll();
});

document.getElementById("unitSelect").addEventListener("change", (event) => {
  state.unitIndex = Number(event.target.value);
  resetPracticeIndexes();
  renderAll();
});

document.getElementById("shuffleWords").addEventListener("click", () => {
  state.wordIndex = (state.wordIndex + 1) % currentLesson().words.length;
  renderWords();
});

document.getElementById("wordCard").addEventListener("click", (event) => {
  const word = currentLesson().words[state.wordIndex];
  if (event.target.id === "speakWord") speak(word.word);
  if (event.target.id === "masterWord") {
    const progress = currentProgress();
    if (!progress.mastered.includes(word.word)) progress.mastered.push(word.word);
    markDone("words");
    renderWords();
  }
});

document.getElementById("nextSpell").addEventListener("click", () => {
  state.spellIndex = (state.spellIndex + 1) % currentLesson().words.length;
  renderSpelling();
});

document.getElementById("newSentence").addEventListener("click", () => {
  state.sentenceIndex = (state.sentenceIndex + 1) % currentLesson().sentencePrompts.length;
  state.sentenceChoices = [];
  state.selectedSentence = [];
  renderSentence();
});

document.getElementById("clearSentence").addEventListener("click", () => {
  state.selectedSentence = [];
  renderSentence();
});

document.getElementById("showSample").addEventListener("click", () => {
  const feedback = document.getElementById("sentenceFeedback");
  const prompt = currentLesson().sentencePrompts[state.sentenceIndex] || currentLesson().sentencePrompts[0];
  feedback.textContent = `例句：${prompt.sample}`;
  feedback.className = "feedback";
});

document.getElementById("checkSentence").addEventListener("click", () => {
  const feedback = document.getElementById("sentenceFeedback");
  const prompt = currentLesson().sentencePrompts[state.sentenceIndex] || currentLesson().sentencePrompts[0];
  const target = sentenceTokens(prompt).map((token) => token.toLowerCase()).join(" ");
  const answer = state.selectedSentence.map((item) => item.token.toLowerCase()).join(" ");

  if (answer === target) {
    feedback.textContent = `排列正确：${prompt.sample}`;
    feedback.className = "feedback ok";
    recordAttempt(true);
    markDone("sentences");
  } else {
    feedback.textContent = "顺序还需要调整，点上方已选词可以撤回。";
    feedback.className = "feedback warn";
    recordAttempt(false);
  }
});

document.getElementById("readAloud").addEventListener("click", () => {
  speak(currentLesson().story.text);
});

document.getElementById("resetProgress").addEventListener("click", () => {
  delete state.progress[progressKey()];
  saveProgress();
  renderAll();
});

renderAll();
