import { clamp, readingTimeFromWords } from "./utils.js";

const TONE_CONFIG = {
  friendly: {
    intro: ["Here is a cleaner version:", "Here is a more natural rewrite:", "This version sounds more conversational:"],
    phraseMap: {
      utilize: "use",
      furthermore: "also",
      moreover: "on top of that",
      therefore: "so",
      however: "still",
      individuals: "people",
      purchase: "buy",
      obtain: "get",
      commence: "start",
      assist: "help",
      numerous: "many",
      demonstrate: "show",
    },
    contractions: true,
  },
  formal: {
    intro: ["Refined draft:", "Polished version:", "Professional rewrite:"],
    phraseMap: {
      get: "obtain",
      buy: "purchase",
      help: "assist",
      start: "begin",
      use: "utilize",
      also: "additionally",
      so: "therefore",
      show: "demonstrate",
      many: "numerous",
      people: "individuals",
    },
    contractions: false,
  },
  casual: {
    intro: ["Quick rewrite:", "Natural version:", "More relaxed version:"],
    phraseMap: {
      furthermore: "plus",
      moreover: "also",
      therefore: "so",
      however: "but",
      utilize: "use",
      individuals: "people",
      obtain: "get",
      commence: "start",
      assist: "help",
      numerous: "lots of",
      demonstrate: "show",
    },
    contractions: true,
  },
};

const STRENGTH_CONFIG = {
  low: { replaceChance: 0.2, splitLong: false, mergeShort: false, openerChance: 0.1 },
  medium: { replaceChance: 0.4, splitLong: true, mergeShort: false, openerChance: 0.18 },
  high: { replaceChance: 0.65, splitLong: true, mergeShort: true, openerChance: 0.26 },
};

const COMMON_FILLERS = [
  "at the end of the day",
  "in today's world",
  "it is important to note that",
  "without a doubt",
  "in conclusion",
];

const EASY_WORDS = new Set([
  "the",
  "and",
  "you",
  "for",
  "with",
  "that",
  "this",
  "have",
  "from",
  "your",
  "into",
  "make",
  "more",
  "text",
  "write",
  "sound",
]);

export function createSeededRandom(seed = Date.now()) {
  let value = seed >>> 0;

  return function random() {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function humanizeText(text, options = {}) {
  const source = normalizeText(text);
  if (!source) return "";

  const tone = TONE_CONFIG[options.tone] ? options.tone : "friendly";
  const strength = STRENGTH_CONFIG[options.strength] ? options.strength : "medium";
  const random = options.random || createSeededRandom();
  const toneConfig = TONE_CONFIG[tone];
  const strengthConfig = STRENGTH_CONFIG[strength];

  const paragraphs = source
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, paragraphIndex) => {
      let working = paragraph;

      if (paragraphIndex === 0 && random() < strengthConfig.openerChance) {
        working = `${pick(toneConfig.intro, random)} ${lowercaseFirst(working)}`;
      }

      working = removeStockPhrases(working, random);
      working = applyPhraseMap(working, toneConfig.phraseMap, strengthConfig.replaceChance, random);
      working = toneConfig.contractions ? addContractions(working) : expandContractions(working);
      working = cleanSentenceRhythm(working, strengthConfig, random);
      return polishParagraph(working);
    });

  const result = paragraphs.join("\n\n");

  if (result === source) {
    return forceVariation(source, tone);
  }

  return result;
}

export function analyzeText(text) {
  const normalized = normalizeText(text);
  const words = normalized ? normalized.split(/\s+/).filter(Boolean) : [];
  const sentences = normalized
    ? normalized.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean)
    : [];
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, wordCount ? 1 : 0);
  const charCount = normalized.length;
  const readingMinutes = wordCount ? readingTimeFromWords(wordCount) : 0;

  const flesch = wordCount
    ? Number((206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllables / wordCount)).toFixed(1))
    : 0;

  return {
    words: wordCount,
    characters: charCount,
    sentences: sentenceCount,
    readingMinutes,
    readabilityScore: flesch,
    readabilityLabel: getReadabilityLabel(flesch),
    complexity: getComplexityLabel(words),
  };
}

export function estimateAiDetectionScore(original, rewritten) {
  const before = analyzeText(original);
  const after = analyzeText(rewritten);
  const diffSegments = getDiffSegments(original, rewritten);
  const changedTokens = diffSegments.filter((segment) => segment.changed).length;
  const totalTokens = Math.max(diffSegments.length, 1);
  const changeRatio = changedTokens / totalTokens;
  const readabilityShift = Math.abs(after.readabilityScore - before.readabilityScore);
  const sentenceShift = Math.abs(after.sentences - before.sentences);

  const score = clamp(
    Math.round(
      84 -
        changeRatio * 42 -
        Math.min(readabilityShift, 18) * 0.8 -
        Math.min(sentenceShift, 6) * 2.5,
    ),
    11,
    97,
  );

  return {
    score,
    label: score >= 70 ? "High AI pattern" : score >= 45 ? "Mixed" : "More human",
  };
}

export function getDiffSegments(original, rewritten) {
  const source = tokenize(original);
  const target = tokenize(rewritten);
  const table = Array.from({ length: source.length + 1 }, () => Array(target.length + 1).fill(0));

  for (let i = source.length - 1; i >= 0; i -= 1) {
    for (let j = target.length - 1; j >= 0; j -= 1) {
      if (normalizeToken(source[i]) === normalizeToken(target[j])) {
        table[i][j] = table[i + 1][j + 1] + 1;
      } else {
        table[i][j] = Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }
  }

  const segments = [];
  let i = 0;
  let j = 0;

  while (j < target.length) {
    if (i < source.length && normalizeToken(source[i]) === normalizeToken(target[j])) {
      segments.push({ value: target[j], changed: false });
      i += 1;
      j += 1;
      continue;
    }

    if (i >= source.length || table[i][j + 1] >= table[i + 1][j]) {
      segments.push({ value: target[j], changed: true });
      j += 1;
    } else {
      i += 1;
    }
  }

  return segments;
}

function normalizeText(text) {
  return (text || "")
    .replace(/\r/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\t+/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function removeStockPhrases(text, random) {
  let updated = text;

  COMMON_FILLERS.forEach((phrase) => {
    if (random() < 0.7) {
      const regex = new RegExp(`(^|[,.!?;:]\\s+)${escapeRegExp(phrase)}(?=[,.!?;:]|\\s|$)`, "gi");
      updated = updated.replace(regex, " ");
    }
  });

  return updated.replace(/\s{2,}/g, " ").trim();
}

function applyPhraseMap(text, phraseMap, replaceChance, random) {
  const tokens = text.split(/(\b)/);

  return tokens
    .map((token) => {
      if (!/^\w+$/u.test(token)) return token;

      const replacement = phraseMap[token.toLowerCase()];
      if (!replacement || random() > replaceChance) return token;
      return matchCase(token, replacement);
    })
    .join("");
}

function addContractions(text) {
  return text
    .replace(/\bdo not\b/gi, "don't")
    .replace(/\bcannot\b/gi, "can't")
    .replace(/\bcan not\b/gi, "can't")
    .replace(/\bit is\b/gi, "it's")
    .replace(/\bthey are\b/gi, "they're")
    .replace(/\bwe are\b/gi, "we're")
    .replace(/\byou are\b/gi, "you're")
    .replace(/\bI am\b/g, "I'm")
    .replace(/\bwill not\b/gi, "won't");
}

function expandContractions(text) {
  return text
    .replace(/\bdon't\b/gi, "do not")
    .replace(/\bcan't\b/gi, "cannot")
    .replace(/\bit's\b/gi, "it is")
    .replace(/\bthey're\b/gi, "they are")
    .replace(/\bwe're\b/gi, "we are")
    .replace(/\byou're\b/gi, "you are")
    .replace(/\bI'm\b/g, "I am")
    .replace(/\bwon't\b/gi, "will not");
}

function cleanSentenceRhythm(text, strengthConfig, random) {
  let sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (strengthConfig.splitLong) {
    sentences = sentences.flatMap((sentence) => splitLongSentence(sentence, random));
  }

  if (strengthConfig.mergeShort && sentences.length > 1) {
    sentences = mergeShortSentences(sentences, random);
  }

  return sentences.join(" ");
}

function splitLongSentence(sentence, random) {
  const words = sentence.split(/\s+/);
  if (words.length < 24) return [sentence];

  const pivot = Math.floor(words.length / 2);
  const before = words.slice(0, pivot).join(" ").replace(/[,:;]$/, "").trim();
  const after = uppercaseFirst(words.slice(pivot).join(" ").trim());

  if (!before || !after || random() < 0.35) {
    return [sentence];
  }

  return [ensurePunctuation(before), ensurePunctuation(after)];
}

function mergeShortSentences(sentences, random) {
  const merged = [];

  for (let index = 0; index < sentences.length; index += 1) {
    const current = sentences[index];
    const next = sentences[index + 1];

    if (!next) {
      merged.push(current);
      continue;
    }

    const currentWords = current.split(/\s+/).length;
    const nextWords = next.split(/\s+/).length;

    if (currentWords <= 8 && nextWords <= 8 && random() > 0.45) {
      const combined = `${current.replace(/[.!?]$/, "")}, ${lowercaseFirst(next)}`;
      merged.push(ensurePunctuation(combined));
      index += 1;
    } else {
      merged.push(current);
    }
  }

  return merged;
}

function polishParagraph(text) {
  return text
    .replace(/\s+([,.;!?])/g, "$1")
    .replace(/([.!?]){2,}/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, char) => `${prefix}${char.toUpperCase()}`)
    .trim();
}

function countSyllables(word) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleaned) return 0;
  if (cleaned.length <= 3) return 1;

  const stripped = cleaned.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/i, "").replace(/^y/, "");
  const matches = stripped.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function getReadabilityLabel(score) {
  if (score >= 70) return "Easy";
  if (score >= 50) return "Balanced";
  if (score >= 30) return "Advanced";
  return "Dense";
}

function getComplexityLabel(words) {
  if (!words.length) return "Ready for input";
  const unique = new Set(words.map((word) => word.toLowerCase()));
  const commonHits = words.filter((word) => EASY_WORDS.has(word.toLowerCase())).length;
  const ratio = unique.size / words.length;

  if (ratio < 0.42 && commonHits > words.length * 0.22) return "Simple";
  if (ratio < 0.6) return "Natural";
  return "Detailed";
}

function tokenize(text) {
  return (text || "").match(/\S+\s*/g) || [];
}

function normalizeToken(token) {
  return token.trim().toLowerCase().replace(/[^a-z0-9']/g, "");
}

function ensurePunctuation(text) {
  if (!text) return text;
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function uppercaseFirst(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function lowercaseFirst(text) {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function matchCase(original, replacement) {
  if (original.toUpperCase() === original) return replacement.toUpperCase();
  if (original[0] && original[0] === original[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }

  return replacement;
}

function pick(list, random) {
  return list[Math.floor(random() * list.length)];
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function forceVariation(text, tone) {
  let updated = text;

  const replacements = [
    [/\bleverages\b/gi, tone === "formal" ? "uses" : "relies on"],
    [/\bartificial intelligence\b/gi, tone === "formal" ? "AI systems" : "AI"],
    [/\boptimize\b/gi, tone === "formal" ? "improve" : "make"],
    [/\bworkflow efficiency\b/gi, tone === "formal" ? "workflow performance" : "day-to-day workflows"],
    [/\bin order to\b/gi, "to"],
    [/\bit is important to note that\b/gi, ""],
  ];

  replacements.forEach(([pattern, replacement]) => {
    updated = updated.replace(pattern, replacement);
  });

  updated = updated
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;!?])/g, "$1")
    .trim();

  if (updated === text) {
    updated = text.replace(/^The /, "This ");
  }

  return polishParagraph(updated);
}
