const demoUnit = (grade, theme, words) => ({
  id: `g${grade}-demo`,
  title: `${grade} 年级示例：${theme}`,
  theme,
  subtitle: "",
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
  wordQuizAnswered: [],
  wordQuizComplete: false,
  reviewWeakOnly: false,
  spellIndex: 0,
  spellQueue: null,
  spellingMistakes: [],
  spellingComplete: false,
  sentenceIndex: 0,
  sentenceComplete: false,
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

function wordIndexByText(wordText) {
  const index = currentLesson().words.findIndex((item) => item.word === wordText);
  return index >= 0 ? index : 0;
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
  state.wordQuizAnswered = [];
  state.wordQuizComplete = false;
  state.spellIndex = 0;
  state.spellQueue = null;
  state.spellingMistakes = [];
  state.spellingComplete = false;
  state.sentenceIndex = 0;
  state.sentenceComplete = false;
  state.quizIndex = 0;
  state.reviewWeakOnly = false;
  state.sentenceChoices = [];
  state.selectedSentence = [];
}

function scheduleAdvance(callback) {
  window.clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = window.setTimeout(callback, 700);
}

function advanceWord() {
  state.reviewWeakOnly = false;
  state.wordIndex = (state.wordIndex + 1) % currentLesson().words.length;
  renderWords();
}

function startWords(mode = "study", wordIndex = state.wordIndex, reviewWeakOnly = false) {
  state.wordMode = mode;
  state.wordIndex = wordIndex;
  state.reviewWeakOnly = reviewWeakOnly;
  state.wordQuizAnswered = [];
  state.wordQuizComplete = false;
  setView("words");
  renderWords();
}

function startWeakReview() {
  const weak = currentProgress().weak;
  if (!weak.length) {
    startWords("study");
    return;
  }
  startWords("quiz", wordIndexByText(weak[0]), true);
}

function completeWordStudy(wordText) {
  const progress = currentProgress();
  state.reviewWeakOnly = false;
  if (!progress.mastered.includes(wordText)) progress.mastered.push(wordText);
  markDone("words");

  if (progress.mastered.length >= currentLesson().words.length) {
    state.wordMode = "quiz";
    state.wordIndex = 0;
    state.wordQuizAnswered = [];
    state.wordQuizComplete = false;
    renderWords();
    return;
  }

  advanceWord();
}

function finishWordQuiz() {
  state.wordQuizComplete = true;
  markDone("words");
  renderWords();
}

function spellingQueue() {
  return state.spellQueue || currentLesson().words.map((_, index) => index);
}

function currentSpellWord() {
  const queue = spellingQueue();
  const wordIndex = queue[Math.min(state.spellIndex, queue.length - 1)] || 0;
  return currentLesson().words[wordIndex];
}

function resetSpellingSession(queue = null) {
  state.spellQueue = queue;
  state.spellIndex = 0;
  state.spellingMistakes = [];
  state.spellingComplete = false;
  renderSpelling();
}

function finishSpelling() {
  const progress = currentProgress();
  state.spellingComplete = true;
  state.spellingMistakes.forEach((wordText) => {
    if (!progress.weak.includes(wordText)) progress.weak.push(wordText);
  });
  markDone("spelling");
  saveProgress();
  renderSpelling();
}

function advanceSpelling() {
  if (state.spellIndex >= spellingQueue().length - 1) {
    finishSpelling();
    return;
  }

  state.spellIndex += 1;
  renderSpelling();
}

function resetSentenceSession() {
  state.sentenceIndex = 0;
  state.sentenceChoices = [];
  state.selectedSentence = [];
  state.sentenceComplete = false;
  renderSentence();
}

function finishSentenceSession() {
  state.sentenceComplete = true;
  markDone("sentences");
  renderSentence();
}

function advanceSentence() {
  const prompts = currentLesson().sentencePrompts;
  if (state.sentenceIndex >= prompts.length - 1) {
    finishSentenceSession();
    return;
  }

  state.sentenceIndex += 1;
  state.sentenceChoices = [];
  state.selectedSentence = [];
  renderSentence();
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

function sentenceExamples(lesson) {
  const fromPrompts = (lesson.sentencePrompts || []).map((item) => item.sample);
  const fromWords = (lesson.words || []).map((item) => item.example);
  const fromStory = (lesson.story?.text || "").match(/[^.!?]+[.!?]/g) || [];
  return [...fromPrompts, ...fromWords, ...fromStory]
    .map((item) => item?.trim())
    .filter(Boolean);
}

function patternMatcher(pattern) {
  const escaped = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\\\.\\\.\\\./g, ".+")
    .replace(/a\/an/g, "(?:a|an)")
    .replace(/He\/She/g, "(?:He|She)")
    .replace(/on\/in\/under/g, "(?:on|in|under)");
  return new RegExp(`^${escaped.replace(/\s+/g, "\\s+")}[.!?]?$`, "i");
}

function patternUsage(pattern) {
  if (pattern.startsWith("It's a/an")) return "用来介绍动物或物品是什么。";
  if (pattern.startsWith("It's not")) return "用来说明它不是某个东西。";
  if (pattern.startsWith("Look at")) return "用来请别人看某个东西。";
  if (pattern.startsWith("It has")) return "用来描述动物或物品有什么。";
  if (pattern.startsWith("It can")) return "用来说明它会做什么。";
  if (pattern.startsWith("This is my")) return "用来介绍自己的家人或物品。";
  if (pattern.startsWith("I'm")) return "用来表达自己的感觉或计划。";
  if (pattern.startsWith("Touch your")) return "用来发出身体动作指令。";
  if (pattern.includes("Where")) return "用来询问地点。";
  if (pattern.includes("How many")) return "用来询问数量。";
  if (pattern.includes("like")) return "用来表达喜欢或不喜欢。";
  if (pattern.includes("want")) return "用来表达想要。";
  if (pattern.includes("Put")) return "用来发出放置或穿脱指令。";
  if (pattern.includes("What")) return "用来提问并开始对话。";
  return "先读熟句型，再替换关键词造句。";
}

function patternExample(pattern, lesson, index) {
  const matcher = patternMatcher(pattern);
  const examples = sentenceExamples(lesson);
  return examples.find((example) => matcher.test(example)) || examples[index % examples.length] || pattern.replace("...", "word");
}

function keyWords(lesson) {
  return lesson.words.slice(0, 8);
}

function renderKnowledgeSection(title, items, type) {
  return `
    <article class="knowledge-section ${type}">
      <h4>${title}</h4>
      <div class="knowledge-list">
        ${items.join("")}
      </div>
    </article>
  `;
}

function renderKnowledgePoint(pattern, lesson, index) {
  return `
    <div class="knowledge-point">
      <strong>${pattern}</strong>
      <span>${patternUsage(pattern)}</span>
      <em>${patternExample(pattern, lesson, index)}</em>
    </div>
  `;
}

function renderKnowledge(lesson) {
  const wordItems = keyWords(lesson).map((item) => `
    <div class="word-chip"><strong>${titleWord(item.word)}</strong><span>${item.meaning}</span></div>
  `);
  const patternItems = lesson.patterns.map((pattern, index) => renderKnowledgePoint(pattern, lesson, index));

  return [
    renderKnowledgeSection("重点单词", wordItems, "words"),
    renderKnowledgeSection("核心句型", patternItems, "patterns")
  ].join("");
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

  document.getElementById("courseEyebrow").textContent = courseLabels[state.level];
  document.getElementById("unitKicker").textContent = `${courseLabels[state.level]} · ${lesson.theme}`;
  document.getElementById("dailyTitle").textContent = lesson.title;
  const dailySubtitle = document.getElementById("dailySubtitle");
  const subtitle = lesson.subtitle?.startsWith("基于") ? "" : lesson.subtitle;
  dailySubtitle.textContent = subtitle;
  dailySubtitle.hidden = !subtitle;
  document.getElementById("knowledgeGrid").innerHTML = renderKnowledge(lesson);
  document.getElementById("statDone").textContent = `${doneCount}/4`;
  document.getElementById("statMastered").textContent = progress.mastered.length;
  document.getElementById("statUnit").textContent = `${state.unitIndex + 1}/${unitCount}`;
  document.getElementById("statAccuracy").textContent = `${progress.attempts ? Math.round((progress.correct / progress.attempts) * 100) : 0}%`;
  document.querySelectorAll("[data-review-weak]").forEach((button) => {
    button.disabled = progress.weak.length === 0;
    button.textContent = progress.weak.length ? `复习错词 ${progress.weak.length}` : "暂无错词";
  });
  document.getElementById("dashboardWeakWords").innerHTML = progress.weak.length ? `
    <strong>错词</strong>
    <div>
      ${progress.weak.map((wordText) => `<button class="weak-chip" data-review-word="${wordText}">${titleWord(wordText)}</button>`).join("")}
    </div>
  ` : "";

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

  if (isQuiz && state.wordQuizComplete) {
    document.getElementById("wordCard").innerHTML = `
      <p class="prompt-label">测验完成</p>
      <div class="meaning quiz-meaning">全部完成</div>
      <div class="hero-actions">
        <button class="primary-btn" data-retry-word-quiz>再练一次</button>
      </div>
    `;
    document.getElementById("wordChoicePanel").hidden = true;
    document.querySelector(".word-layout").classList.add("quiz-mode");
    document.getElementById("wordList").innerHTML = "";
    return;
  }

  document.getElementById("wordCard").innerHTML = isQuiz ? `
    <p class="prompt-label">${state.wordQuizAnswered.length + 1}/${lesson.words.length} · 看中文选英文</p>
    <div class="meaning quiz-meaning">${word.meaning}</div>
    <div class="choice-options">
      ${wordChoiceOptions(word.word).map((option) => `<button class="option-btn" data-word-choice="${option}">${titleWord(option)}</button>`).join("")}
    </div>
    <p class="feedback" id="wordChoiceFeedback" aria-live="polite"></p>
  ` : `
    <p class="prompt-label">${state.wordIndex + 1}/${lesson.words.length} · 已掌握 ${progress.mastered.length}</p>
    <div class="word">${titleWord(word.word)}</div>
    <div class="meaning">${word.meaning}</div>
    <p class="example">${word.example}</p>
    <div class="hero-actions">
      <button class="primary-btn" id="speakWord">听发音</button>
      <button class="secondary-btn" id="masterWord">${progress.mastered.includes(word.word) ? "已掌握" : "我掌握了"}</button>
    </div>
  `;

  document.getElementById("wordChoicePanel").hidden = true;

  document.querySelector(".word-layout").classList.toggle("quiz-mode", isQuiz);
  document.getElementById("wordList").innerHTML = lesson.words.map((item, index) => `
    <button class="word-item ${index === state.wordIndex ? "active" : ""}" data-word-index="${index}">
      <strong>${titleWord(item.word)}</strong><br />
      <span>${item.meaning}</span>
    </button>
  `).join("");
}

function renderSpelling() {
  const nextSpellButton = document.getElementById("nextSpell");
  nextSpellButton.hidden = state.spellingComplete;

  if (state.spellingComplete) {
    const missed = state.spellingMistakes;
    document.getElementById("letterOptions").classList.add("summary-actions");
    document.querySelector("#spelling .prompt-label").textContent = "本轮完成";
    document.getElementById("spellPrompt").textContent = missed.length ? `错了 ${missed.length} 个` : "全部答对";
    document.getElementById("maskedWord").innerHTML = "";
    document.getElementById("letterOptions").innerHTML = `
      <button class="primary-btn" data-retry-spelling>再练一次</button>
      ${missed.length ? `<button class="secondary-btn" data-review-spelling>复习错词</button>` : ""}
    `;
    document.getElementById("spellFeedback").textContent = missed.length
      ? missed.map((wordText) => titleWord(wordText)).join(" · ")
      : "很稳，去做下一项吧。";
    document.getElementById("spellFeedback").className = `feedback ${missed.length ? "warn" : "ok"}`;
    return;
  }

  const queue = spellingQueue();
  const word = currentSpellWord();
  const data = maskedWordData(word.word);
  nextSpellButton.textContent = state.spellIndex >= queue.length - 1 ? "完成" : "下一题";
  document.getElementById("letterOptions").classList.remove("summary-actions");
  document.getElementById("spellPrompt").textContent = word.meaning;
  document.querySelector("#spelling .prompt-label").textContent = `${state.spellIndex + 1}/${queue.length} · ${data.hint}`;
  document.getElementById("maskedWord").innerHTML = data.masked.split("").map((letter) => `<span class="${letter === "_" ? "blank" : ""}">${letter}</span>`).join("");
  document.getElementById("maskedWord").dataset.missing = data.missing;
  document.getElementById("letterOptions").innerHTML = data.options.map((chunk) => {
    const label = data.optionStartsWord ? titleWord(chunk) : chunk.toLowerCase();
    return `<button class="letter-btn" data-letter-choice="${chunk}">${label}</button>`;
  }).join("");
  document.getElementById("spellFeedback").textContent = "";
  document.getElementById("spellFeedback").className = "feedback";
}

function renderSentence() {
  const nextSentenceButton = document.getElementById("newSentence");
  nextSentenceButton.hidden = state.sentenceComplete;

  if (state.sentenceComplete) {
    document.querySelector("#sentences .prompt-label").textContent = "本轮完成";
    document.getElementById("sentenceAnswer").innerHTML = "";
    document.getElementById("sentenceChips").classList.add("summary-actions");
    document.getElementById("sentenceChips").innerHTML = `
      <button class="primary-btn" data-retry-sentences>再练一次</button>
    `;
    document.getElementById("sentenceFeedback").textContent = "写句子完成，去做下一项吧。";
    document.getElementById("sentenceFeedback").className = "feedback ok";
    return;
  }

  const sentence = currentLesson().sentencePrompts[state.sentenceIndex] || currentLesson().sentencePrompts[0];
  const tokens = sentenceTokens(sentence);
  if (!state.sentenceChoices.length) {
    state.sentenceChoices = shuffledSentenceChoices(tokens);
  }

  nextSentenceButton.textContent = state.sentenceIndex >= currentLesson().sentencePrompts.length - 1 ? "完成" : "下一句";
  document.querySelector("#sentences .prompt-label").textContent = `${state.sentenceIndex + 1}/${currentLesson().sentencePrompts.length} · 点击词块排成句子`;
  document.getElementById("sentenceAnswer").innerHTML = state.selectedSentence.map((item, index) => `
    <button class="chip chip-button selected" data-sentence-selected="${index}">
      ${formatSentenceToken(item.token, index)}
    </button>
  `).join("");

  document.getElementById("sentenceChips").classList.remove("summary-actions");
  document.getElementById("sentenceChips").innerHTML = state.sentenceChoices.map((item) => {
    const used = state.selectedSentence.some((selected) => selected.id === item.id);
    return `
      <button class="chip chip-button ${used ? "used" : ""}" data-sentence-choice="${item.id}" ${used ? "disabled" : ""}>
        ${formatSentenceToken(item.token)}
      </button>
    `;
  }).join("");
  document.getElementById("sentenceFeedback").textContent = "";
  document.getElementById("sentenceFeedback").className = "feedback";
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
  const weak = progress.weak;
  const accuracy = progress.attempts ? Math.round((progress.correct / progress.attempts) * 100) : 0;
  const doneCount = tasks.filter((task) => progress.done[task.id]).length;

  document.getElementById("reportAdvice").textContent =
    weak.length
      ? "先复习错词，再做一轮拼写。"
      : doneCount < tasks.length
        ? "继续完成还没做的任务。"
        : "本单元完成得不错，可以进入下一单元。";

  document.getElementById("reportSummary").innerHTML = [
    ["完成", `${doneCount}/${tasks.length}`],
    ["掌握", `${progress.mastered.length}/${lesson.words.length}`],
    ["错词", weak.length],
    ["正确率", `${accuracy}%`]
  ].map(([label, value]) => `
    <div class="summary-item"><span>${label}</span><strong>${value}</strong></div>
  `).join("");

  document.getElementById("weakWords").innerHTML = weak.length
    ? weak.map((word) => `
      <button class="review-item" data-review-word="${word}">
        <strong>${titleWord(word)}</strong><span>复习</span>
      </button>
    `).join("")
    : `<div class="empty-note">暂无错词</div>`;

  document.getElementById("skillBars").innerHTML = tasks.map((task) => {
    const done = Boolean(progress.done[task.id]);
    return `
    <div class="bar-row">
      <span>${task.title}</span>
      <div class="bar-track"><div class="bar-fill ${done ? "done" : "todo"}" style="width: ${done ? 100 : 30}%"></div></div>
      <strong>${done ? "已完成" : "待完成"}</strong>
    </div>
  `;
  }).join("");
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

  const startWordButton = event.target.closest("[data-start-words]");
  if (startWordButton) {
    startWords("study");
    return;
  }

  const reviewWeakButton = event.target.closest("[data-review-weak]");
  if (reviewWeakButton && !reviewWeakButton.disabled) {
    startWeakReview();
    return;
  }

  const reviewWord = event.target.closest("[data-review-word]");
  if (reviewWord) {
    startWords("quiz", wordIndexByText(reviewWord.dataset.reviewWord), true);
    return;
  }

  const nav = event.target.closest(".nav-item");
  if (nav) {
    setView(nav.dataset.view);
    return;
  }

  const wordItem = event.target.closest("[data-word-index]");
  if (wordItem) {
    state.reviewWeakOnly = false;
    state.wordIndex = Number(wordItem.dataset.wordIndex);
    renderWords();
    return;
  }

  const wordMode = event.target.closest("[data-word-mode]");
  if (wordMode) {
    state.reviewWeakOnly = false;
    state.wordMode = wordMode.dataset.wordMode;
    state.wordQuizAnswered = [];
    state.wordQuizComplete = false;
    renderWords();
    return;
  }

  const retryWordQuiz = event.target.closest("[data-retry-word-quiz]");
  if (retryWordQuiz) {
    startWords("quiz", 0);
    return;
  }

  const sentenceChoice = event.target.closest("[data-sentence-choice]");
  if (sentenceChoice) {
    if (state.sentenceComplete) return;
    const item = state.sentenceChoices.find((choice) => choice.id === sentenceChoice.dataset.sentenceChoice);
    if (item && !state.selectedSentence.some((selected) => selected.id === item.id)) {
      state.selectedSentence.push(item);
      renderSentence();
    }
    return;
  }

  const sentenceSelected = event.target.closest("[data-sentence-selected]");
  if (sentenceSelected) {
    if (state.sentenceComplete) return;
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
      if (!state.wordQuizAnswered.includes(word.word)) state.wordQuizAnswered.push(word.word);
      markDone("words");
      if (state.reviewWeakOnly) {
        scheduleAdvance(() => {
          if (progress.weak.length) {
            state.wordIndex = wordIndexByText(progress.weak[0]);
            renderWords();
          } else {
            finishWordQuiz();
          }
        });
      } else if (state.wordQuizAnswered.length >= currentLesson().words.length) {
        scheduleAdvance(finishWordQuiz);
      } else {
        scheduleAdvance(advanceWord);
      }
    }
    return;
  }

  const letterChoice = event.target.closest("[data-letter-choice]");
  if (letterChoice) {
    const word = currentSpellWord();
    const isCorrect = letterChoice.dataset.letterChoice === document.getElementById("maskedWord").dataset.missing;
    const feedback = document.getElementById("spellFeedback");
    feedback.textContent = isCorrect ? `补全正确：${titleWord(word.word)}` : `还差一点，完整单词是 ${titleWord(word.word)}。`;
    feedback.className = `feedback ${isCorrect ? "ok" : "warn"}`;
    if (!isCorrect && !state.spellingMistakes.includes(word.word)) state.spellingMistakes.push(word.word);
    recordAttempt(isCorrect, word.word);
    if (isCorrect) {
      scheduleAdvance(advanceSpelling);
    }
    return;
  }

  const retrySpelling = event.target.closest("[data-retry-spelling]");
  if (retrySpelling) {
    resetSpellingSession();
    return;
  }

  const reviewSpelling = event.target.closest("[data-review-spelling]");
  if (reviewSpelling) {
    const reviewQueue = state.spellingMistakes
      .map((wordText) => currentLesson().words.findIndex((item) => item.word === wordText))
      .filter((index) => index >= 0);
    resetSpellingSession(reviewQueue.length ? reviewQueue : null);
    return;
  }

  const retrySentences = event.target.closest("[data-retry-sentences]");
  if (retrySentences) {
    resetSentenceSession();
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
        document.getElementById("quizFeedback").textContent = "阅读完成，去做下一项吧。";
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
  advanceWord();
});

document.getElementById("wordCard").addEventListener("click", (event) => {
  const word = currentLesson().words[state.wordIndex];
  if (event.target.id === "speakWord") speak(word.word);
  if (event.target.id === "masterWord") {
    completeWordStudy(word.word);
  }
});

document.getElementById("nextSpell").addEventListener("click", () => {
  advanceSpelling();
});

document.getElementById("newSentence").addEventListener("click", () => {
  advanceSentence();
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
  if (state.sentenceComplete) return;
  const feedback = document.getElementById("sentenceFeedback");
  const prompt = currentLesson().sentencePrompts[state.sentenceIndex] || currentLesson().sentencePrompts[0];
  const target = sentenceTokens(prompt).map((token) => token.toLowerCase()).join(" ");
  const answer = state.selectedSentence.map((item) => item.token.toLowerCase()).join(" ");

  if (answer === target) {
    feedback.textContent = `排列正确：${prompt.sample}`;
    feedback.className = "feedback ok";
    recordAttempt(true);
    scheduleAdvance(advanceSentence);
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
