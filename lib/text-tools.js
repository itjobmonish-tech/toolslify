import { analyzeText, createSeededRandom, humanizeText } from "./humanizer.js";
import { clamp, readingTimeFromWords, titleCase } from "./utils.js";

const STOP_WORDS = new Set([
  "a",
  "about",
  "after",
  "all",
  "also",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "more",
  "not",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "was",
  "were",
  "will",
  "with",
  "you",
  "your",
]);

const COMMON_MISSPELLINGS = new Map([
  ["teh", "the"],
  ["recieve", "receive"],
  ["seperate", "separate"],
  ["definately", "definitely"],
  ["occured", "occurred"],
  ["wich", "which"],
  ["adress", "address"],
  ["langauge", "language"],
  ["enviroment", "environment"],
  ["grammer", "grammar"],
  ["becuase", "because"],
  ["thier", "their"],
  ["wierd", "weird"],
  ["untill", "until"],
]);

const MORSE_CODE_MAP = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "'": ".----.",
  '"': ".-..-.",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  "_": "..--.-",
  "@": ".--.-.",
};

const REVERSE_MORSE_CODE_MAP = Object.fromEntries(
  Object.entries(MORSE_CODE_MAP).map(([key, value]) => [value, key]),
);

const SMALL_TEXT_MAP = createCharacterMap(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  "ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖ৯ʳˢᵗᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹",
);

const BOLD_TEXT_MAP = createCharacterMap(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
);

const SMALL_CAPS_MAP = {
  a: "ᴀ",
  b: "ʙ",
  c: "ᴄ",
  d: "ᴅ",
  e: "ᴇ",
  f: "ꜰ",
  g: "ɢ",
  h: "ʜ",
  i: "ɪ",
  j: "ᴊ",
  k: "ᴋ",
  l: "ʟ",
  m: "ᴍ",
  n: "ɴ",
  o: "ᴏ",
  p: "ᴘ",
  q: "ǫ",
  r: "ʀ",
  s: "s",
  t: "ᴛ",
  u: "ᴜ",
  v: "ᴠ",
  w: "ᴡ",
  x: "x",
  y: "ʏ",
  z: "ᴢ",
};

const UPSIDE_DOWN_MAP = {
  a: "ɐ",
  b: "q",
  c: "ɔ",
  d: "p",
  e: "ǝ",
  f: "ɟ",
  g: "ɓ",
  h: "ɥ",
  i: "ᴉ",
  j: "ɾ",
  k: "ʞ",
  l: "l",
  m: "ɯ",
  n: "u",
  o: "o",
  p: "d",
  q: "b",
  r: "ɹ",
  s: "s",
  t: "ʇ",
  u: "n",
  v: "ʌ",
  w: "ʍ",
  x: "x",
  y: "ʎ",
  z: "z",
  A: "∀",
  B: "𐐒",
  C: "Ɔ",
  D: "◖",
  E: "Ǝ",
  F: "Ⅎ",
  G: "⅁",
  H: "H",
  I: "I",
  J: "ſ",
  K: "⋊",
  L: "˥",
  M: "W",
  N: "N",
  O: "O",
  P: "Ԁ",
  Q: "Ό",
  R: "ᴚ",
  S: "S",
  T: "⊥",
  U: "∩",
  V: "Λ",
  W: "M",
  X: "X",
  Y: "⅄",
  Z: "Z",
  "1": "⇂",
  "2": "ᄅ",
  "3": "Ɛ",
  "4": "ㄣ",
  "5": "ϛ",
  "6": "9",
  "7": "ㄥ",
  "8": "8",
  "9": "6",
  "0": "0",
  ".": "˙",
  ",": "'",
  "?": "¿",
  "!": "¡",
  "(": ")",
  ")": "(",
  "[": "]",
  "]": "[",
  "{": "}",
  "}": "{",
};

export function normalizeInput(text = "") {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function splitIntoSentences(text) {
  return normalizeInput(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function extractKeywords(text, limit = 8) {
  const counts = new Map();
  normalizeInput(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
    .forEach((word) => {
      counts.set(word, (counts.get(word) || 0) + 1);
    });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword, count]) => ({ keyword, count }));
}

export function getKeywordDensity(text, limit = 8) {
  const normalized = normalizeInput(text);
  const words = normalized
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const totalWords = words.length || 1;
  return extractKeywords(normalized, limit).map((item) => ({
    ...item,
    density: Number(((item.count / totalWords) * 100).toFixed(2)),
  }));
}

export function summarizeText(text, level = "medium") {
  const sentences = splitIntoSentences(text);
  if (!sentences.length) return "";

  const limit = level === "short" ? 2 : level === "detailed" ? 5 : 3;
  const keywords = extractKeywords(text, 6).map((item) => item.keyword);

  return sentences
    .map((sentence, index) => ({
      sentence: ensurePunctuation(sentence),
      index,
      score: scoreSentence(sentence, keywords),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence)
    .join(" ");
}

export function createBulletPoints(text, level = "medium") {
  return splitIntoSentences(summarizeText(text, level))
    .map((sentence) => `- ${ensurePunctuation(sentence)}`)
    .join("\n");
}

export function shortenText(text) {
  const sentences = splitIntoSentences(text);
  if (!sentences.length) return "";

  return sentences
    .map((sentence) => shortenSentence(sentence))
    .join(" ");
}

export function convertCase(text, mode = "sentence") {
  const source = normalizeInput(text);
  if (!source) return "";

  if (mode === "upper") return source.toUpperCase();
  if (mode === "lower") return source.toLowerCase();
  if (mode === "title") {
    return source
      .split(/\n/)
      .map((line) => titleCase(line.toLowerCase()))
      .join("\n");
  }

  return source
    .toLowerCase()
    .replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, char) => `${prefix}${char.toUpperCase()}`)
    .replace(/\n([a-z])/g, (match, char) => `\n${char.toUpperCase()}`);
}

export function rewriteParagraph(text, tone = "friendly", strength = "medium") {
  return humanizeText(normalizeInput(text), {
    tone,
    strength,
    random: createSeededRandom(42),
  });
}

export function createWordCounterReport(text) {
  const normalized = normalizeInput(text);
  const metrics = analyzeText(normalized);
  const paragraphs = normalized ? normalized.split(/\n{2,}/).filter(Boolean).length : 0;
  const keywordDensity = getKeywordDensity(normalized, 5);

  return {
    output: normalized,
    report: [
      "Text overview",
      "",
      `- Words: ${metrics.words}`,
      `- Characters: ${metrics.characters}`,
      `- Sentences: ${metrics.sentences}`,
      `- Paragraphs: ${paragraphs}`,
      `- Reading time: ${metrics.readingMinutes} min`,
      "",
      "Top keywords",
      ...keywordDensity.map((item) => `- ${titleCase(item.keyword)}: ${item.count} (${item.density}%)`),
    ].join("\n"),
    metrics,
    paragraphs,
    keywordDensity,
  };
}

export function createReadabilityReport(text) {
  const normalized = normalizeInput(text);
  const metrics = analyzeText(normalized);
  const averageWordsPerSentence = Number(
    ((metrics.words || 0) / Math.max(metrics.sentences, 1)).toFixed(1),
  );
  const suggestions = [];

  if (averageWordsPerSentence > 22) {
    suggestions.push("Shorten long sentences so the draft becomes easier to scan.");
  }
  if (metrics.readabilityScore < 45) {
    suggestions.push("Replace abstract wording with simpler, more direct phrasing.");
  }
  if (metrics.words > 450) {
    suggestions.push("Break the text into smaller sections or bullets to lower reading pressure.");
  }
  if (!suggestions.length) {
    suggestions.push("The draft is already reasonably balanced for general web reading.");
  }

  return {
    report: [
      "Readability report",
      "",
      `- Score: ${metrics.readabilityScore} (${metrics.readabilityLabel})`,
      `- Complexity: ${metrics.complexity}`,
      `- Average words per sentence: ${averageWordsPerSentence}`,
      `- Estimated reading time: ${metrics.readingMinutes} min`,
      "",
      "Suggestions",
      ...suggestions.map((item) => `- ${item}`),
    ].join("\n"),
    metrics,
    averageWordsPerSentence,
    suggestions,
  };
}

export function createKeywordDensityReport(text, focusKeyword = "") {
  const normalized = normalizeInput(text);
  const density = getKeywordDensity(normalized, 8);
  const metrics = analyzeText(normalized);
  const focus = focusKeyword.trim().toLowerCase();
  const focusCount = focus ? normalized.toLowerCase().split(focus).length - 1 : 0;
  const focusDensity = focus
    ? Number(((focusCount / Math.max(metrics.words, 1)) * 100).toFixed(2))
    : 0;

  return {
    report: [
      "Keyword density report",
      "",
      `- Total words: ${metrics.words}`,
      `- Reading time: ${readingTimeFromWords(metrics.words)} min`,
      ...(focus
        ? [`- Focus keyword: ${focus}`, `- Focus keyword count: ${focusCount}`, `- Focus keyword density: ${focusDensity}%`]
        : []),
      "",
      "Top keywords",
      ...density.map((item) => `- ${titleCase(item.keyword)}: ${item.count} uses (${item.density}%)`),
    ].join("\n"),
    metrics,
    density,
    focus,
    focusCount,
    focusDensity,
  };
}

export function createSummaryReport(text, level = "medium") {
  const summary = summarizeText(text, level);
  const originalMetrics = analyzeText(text);
  const summaryMetrics = analyzeText(summary);
  return {
    output: summary,
    report: [
      "Summary",
      "",
      summary,
      "",
      "Quick notes",
      `- Original words: ${originalMetrics.words}`,
      `- Summary words: ${summaryMetrics.words}`,
      `- Compression: ${originalMetrics.words ? clamp(Math.round((summaryMetrics.words / originalMetrics.words) * 100), 1, 100) : 0}% of the original size`,
    ].join("\n"),
    originalMetrics,
    summaryMetrics,
  };
}

export function createBulletReport(text, level = "medium") {
  const bullets = createBulletPoints(text, level);
  const bulletLines = bullets.split("\n").filter(Boolean);
  return {
    output: bullets,
    report: [
      "Bullet points",
      "",
      bullets,
      "",
      "Quick notes",
      `- Bullet count: ${bulletLines.length}`,
      `- Summary level: ${level}`,
    ].join("\n"),
    bulletLines,
  };
}

export function createWritingCheckReport(text, focus = "general") {
  const normalized = normalizeInput(text);
  const metrics = analyzeText(normalized);
  const suggestions = [];
  const spellingMatches = [];
  const punctuationFlags = [];

  if (/\s{2,}/.test(text)) {
    punctuationFlags.push("Remove repeated spaces so the text reads more cleanly.");
  }

  if (/\s+[,.!?;:]/.test(text)) {
    punctuationFlags.push("Fix spaces before punctuation marks.");
  }

  const sentences = splitIntoSentences(normalized);
  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim();
    if (trimmed && /^[a-z]/.test(trimmed)) {
      suggestions.push(`Sentence ${index + 1} starts with a lowercase letter.`);
    }
    if (!/[.!?]$/.test(trimmed)) {
      punctuationFlags.push(`Sentence ${index + 1} may need closing punctuation.`);
    }
    if (trimmed.split(/\s+/).length > 28) {
      suggestions.push(`Sentence ${index + 1} is long and may be easier to read if split in two.`);
    }
  });

  const lowerWords = normalized.toLowerCase().match(/\b[a-z']+\b/g) || [];
  lowerWords.forEach((word) => {
    const replacement = COMMON_MISSPELLINGS.get(word);
    if (replacement) {
      spellingMatches.push(`${word} -> ${replacement}`);
    }
  });

  const selectedItems =
    focus === "spell"
      ? spellingMatches
      : focus === "punctuation"
        ? punctuationFlags
        : [...spellingMatches, ...punctuationFlags, ...suggestions];

  const score = clamp(
    100 - spellingMatches.length * 7 - punctuationFlags.length * 6 - suggestions.length * 4,
    18,
    100,
  );

  return {
    report: [
      `${titleCase(focus === "general" ? "writing" : focus)} report`,
      "",
      `- Score: ${score}/100`,
      `- Words: ${metrics.words}`,
      `- Sentences: ${metrics.sentences}`,
      `- Reading time: ${metrics.readingMinutes} min`,
      "",
      selectedItems.length ? "Findings" : "Findings",
      ...(selectedItems.length
        ? selectedItems.slice(0, 12).map((item) => `- ${item}`)
        : ["- No major issues were flagged by this local pass."]),
    ].join("\n"),
    score,
    issues: selectedItems,
    spellingMatches,
    punctuationFlags,
    suggestions,
  };
}

export function createPlagiarismReport(text) {
  const normalized = normalizeInput(text);
  const sentences = splitIntoSentences(normalized).map((item) => item.toLowerCase());
  const sentenceCounts = new Map();
  sentences.forEach((sentence) => {
    sentenceCounts.set(sentence, (sentenceCounts.get(sentence) || 0) + 1);
  });

  const duplicateSentences = [...sentenceCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([sentence, count]) => `${titleCase(sentence.slice(0, 80))}${sentence.length > 80 ? "..." : ""} (${count}x)`);

  const phraseCounts = new Map();
  normalized
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .forEach((_, index, words) => {
      const phrase = words.slice(index, index + 5).join(" ").trim();
      if (phrase.split(" ").length === 5) {
        phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1);
      }
    });

  const repeatedPhrases = [...phraseCounts.entries()]
    .filter(([, count]) => count > 1)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6);

  const uniqueWords = new Set(
    normalized
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean),
  ).size;
  const metrics = analyzeText(normalized);
  const lexicalDiversity = metrics.words ? Number((uniqueWords / metrics.words).toFixed(2)) : 0;
  const originalityScore = clamp(
    Math.round(100 - duplicateSentences.length * 14 - repeatedPhrases.length * 6 - (lexicalDiversity < 0.45 ? 14 : 0)),
    14,
    99,
  );

  return {
    report: [
      "Plagiarism scan",
      "",
      `- Originality score: ${originalityScore}/100`,
      "- Scope: local repetition and duplication scan only",
      `- Unique-word ratio: ${lexicalDiversity}`,
      "",
      "Flags",
      ...(duplicateSentences.length
        ? duplicateSentences.map((item) => `- Repeated sentence: ${item}`)
        : ["- No repeated full sentences detected."]),
      ...(repeatedPhrases.length
        ? repeatedPhrases.map(([phrase, count]) => `- Repeated phrase: "${phrase}" (${count}x)`)
        : ["- No heavily repeated five-word phrases detected."]),
    ].join("\n"),
    originalityScore,
    duplicateSentences,
    repeatedPhrases,
    lexicalDiversity,
  };
}

export function createAiContentDetectorReport(text, variant = "ai") {
  const normalized = normalizeInput(text);
  const metrics = analyzeText(normalized);
  const sentences = splitIntoSentences(normalized);
  const sentenceLengths = sentences.map((sentence) => sentence.split(/\s+/).filter(Boolean).length);
  const averageSentenceLength = sentenceLengths.length
    ? Number((sentenceLengths.reduce((sum, value) => sum + value, 0) / sentenceLengths.length).toFixed(1))
    : 0;
  const uniqueWords = new Set(
    normalized
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean),
  ).size;
  const lexicalDiversity = metrics.words ? Number((uniqueWords / metrics.words).toFixed(2)) : 0;
  const transitionMatches = (normalized.match(/\b(moreover|furthermore|additionally|in conclusion|overall|notably|delve|robust|seamless)\b/gi) || []).length;
  const lengthSpread = sentenceLengths.length ? Math.max(...sentenceLengths) - Math.min(...sentenceLengths) : 0;

  const riskScore = clamp(
    Math.round(
      34 +
      (averageSentenceLength >= 16 && averageSentenceLength <= 24 ? 16 : 0) +
      (lexicalDiversity < 0.46 ? 18 : 0) +
      (transitionMatches > 2 ? 18 : 0) +
      (lengthSpread < 8 ? 12 : 0),
    ),
    8,
    96,
  );

  const label = riskScore >= 72 ? `Likely ${variant === "chatgpt" ? "ChatGPT-like" : "AI-like"}` : riskScore >= 48 ? "Mixed signals" : "Likely human";

  return {
    report: [
      `${variant === "chatgpt" ? "ChatGPT" : "AI"} detector`,
      "",
      `- Heuristic score: ${riskScore}/100`,
      `- Result: ${label}`,
      `- Average sentence length: ${averageSentenceLength}`,
      `- Unique-word ratio: ${lexicalDiversity}`,
      `- Pattern phrases: ${transitionMatches}`,
      "",
      "Notes",
      "- This is a local heuristic estimate, not a definitive attribution model.",
      "- Use the score as a writing signal, not as final proof.",
    ].join("\n"),
    riskScore,
    label,
    lexicalDiversity,
    transitionMatches,
  };
}

export function createWordCombinerReport(text) {
  const tokens = normalizeInput(text)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10);

  const combinations = [];
  tokens.forEach((token, index) => {
    tokens.slice(index + 1).forEach((nextToken) => {
      combinations.push(`${token} ${nextToken}`);
      combinations.push(`${token}${nextToken}`);
    });
  });

  const uniqueCombinations = [...new Set(combinations)].slice(0, 40);

  return {
    output: uniqueCombinations.join("\n"),
    report: uniqueCombinations.join("\n"),
    combinations: uniqueCombinations,
  };
}

export function translateEnglishToEnglish(text) {
  const simplified = rewriteParagraph(shortenText(text), "casual", "low");
  return simplified || normalizeInput(text);
}

export function createEditorReport(text) {
  const normalized = normalizeInput(text);
  const metrics = analyzeText(normalized);

  return {
    output: normalized,
    report: normalized,
    metrics,
  };
}

export function createReverseTextReport(text) {
  const normalized = normalizeInput(text);
  const characterReverse = [...normalized].reverse().join("");
  const wordReverse = normalized
    .split(/\s+/)
    .filter(Boolean)
    .reverse()
    .join(" ");

  return {
    output: [
      "Characters reversed",
      characterReverse,
      "",
      "Words reversed",
      wordReverse,
    ].join("\n\n"),
    report: characterReverse,
    characterReverse,
    wordReverse,
  };
}

export function generateStyledText(text, style = "small") {
  const normalized = normalizeInput(text);
  if (!normalized) return "";

  if (style === "upside-down") {
    return [...normalized]
      .reverse()
      .map((character) => UPSIDE_DOWN_MAP[character] || UPSIDE_DOWN_MAP[character.toLowerCase()] || character)
      .join("");
  }

  const map =
    style === "bold"
      ? BOLD_TEXT_MAP
      : style === "small-caps"
        ? SMALL_CAPS_MAP
        : SMALL_TEXT_MAP;

  return [...normalized]
    .map((character) => map[character] || map[character.toLowerCase()] || character)
    .join("");
}

export function createInvisibleCharacterReport() {
  const invisibleCharacter = "\u200B";

  return {
    output: "Invisible character ready.\n\nUse copy to place a zero-width space on your clipboard.",
    report: "Invisible character ready.",
    copyText: invisibleCharacter,
  };
}

export function createMorseCodeReport(text) {
  const normalized = normalizeInput(text);
  const isMorse = /^[.\-\/\s]+$/.test(normalized);

  if (isMorse) {
    const decoded = normalized
      .split(" / ")
      .map((word) =>
        word
          .split(/\s+/)
          .map((chunk) => REVERSE_MORSE_CODE_MAP[chunk] || "")
          .join(""),
      )
      .join(" ")
      .trim();

    return {
      output: decoded,
      report: decoded,
      direction: "decode",
    };
  }

  const encoded = [...normalized.toLowerCase()]
    .map((character) => {
      if (character === " ") return "/";
      return MORSE_CODE_MAP[character] || character;
    })
    .join(" ")
    .replace(/ \/ /g, " / ");

  return {
    output: encoded,
    report: encoded,
    direction: "encode",
  };
}

function scoreSentence(sentence, keywords) {
  const words = sentence.split(/\s+/);
  const keywordHits = keywords.reduce((total, keyword) => total + (sentence.toLowerCase().includes(keyword) ? 2 : 0), 0);
  return Math.min(words.length, 30) + keywordHits;
}

function shortenSentence(sentence) {
  const cleaned = sentence
    .replace(/\b(it is important to note that|in order to|at the end of the day|basically|actually)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  const words = cleaned.split(/\s+/);
  if (words.length <= 16) return ensurePunctuation(cleaned);
  return ensurePunctuation(words.slice(0, 16).join(" "));
}

function ensurePunctuation(text) {
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function createCharacterMap(source, target) {
  return Object.fromEntries([...source].map((character, index) => [character, [...target][index]]));
}
