import { LANGUAGES } from "./i18n";

const MAX_BATCH_ITEMS = 24;
const MAX_BATCH_CHARS = 4200;
const TRANSLATE_CACHE = new Map();

export const SUPPORTED_LANGUAGE_CODES = LANGUAGES.map((item) => item.code);

export function isSupportedLanguage(code) {
  return SUPPORTED_LANGUAGE_CODES.includes(code);
}

export async function translateText(text, targetLanguage) {
  if (!String(text || "").trim() || targetLanguage === "en") {
    return String(text || "");
  }

  const [translated] = await translateTextBatch([text], targetLanguage);
  return translated || String(text || "");
}

export async function translateTextBatch(values, targetLanguage) {
  const normalizedValues = values.map((value) => String(value ?? ""));

  if (!normalizedValues.length || !isSupportedLanguage(targetLanguage) || targetLanguage === "en") {
    return normalizedValues;
  }

  const uniqueValues = Array.from(
    new Set(normalizedValues.filter((value) => value.trim())),
  );

  const translatedMap = new Map();
  const missingValues = [];

  uniqueValues.forEach((value) => {
    const cached = TRANSLATE_CACHE.get(getCacheKey(targetLanguage, value));
    if (cached) {
      translatedMap.set(value, cached);
    } else {
      missingValues.push(value);
    }
  });

  const chunks = createChunks(missingValues);

  for (const chunk of chunks) {
    const translatedChunk = await translateHtmlChunk(chunk, targetLanguage).catch(() => chunk);

    chunk.forEach((value, index) => {
      const translated = translatedChunk[index] || value;
      TRANSLATE_CACHE.set(getCacheKey(targetLanguage, value), translated);
      translatedMap.set(value, translated);
    });
  }

  return normalizedValues.map((value) => {
    if (!value.trim()) return value;
    return translatedMap.get(value) || value;
  });
}

async function translateHtmlChunk(values, targetLanguage) {
  if (!values.length) return [];

  const html = values
    .map((value, index) => `<div data-toolslify-index="${index}">${escapeHtml(value).replace(/\n/g, "<br/>")}</div>`)
    .join("");

  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&format=html&q=${encodeURIComponent(html)}`,
    {
      cache: "no-store",
      headers: {
        "User-Agent": "Toolslify Runtime Translator",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Unable to translate the requested content right now.");
  }

  const payload = await response.json();
  const translatedHtml = Array.isArray(payload?.[0])
    ? payload[0].map((item) => item?.[0] || "").join("")
    : "";

  return parseTranslatedHtml(translatedHtml, values);
}

function parseTranslatedHtml(translatedHtml, fallbackValues) {
  const output = [...fallbackValues];
  const pattern = /<div data-toolslify-index="(\d+)">([\s\S]*?)<\/div>/gi;
  let match;

  while ((match = pattern.exec(translatedHtml))) {
    const index = Number(match[1]);
    if (!Number.isInteger(index) || index < 0 || index >= output.length) continue;
    output[index] = normalizeTranslatedMarkup(match[2]) || fallbackValues[index];
  }

  return output;
}

function normalizeTranslatedMarkup(value) {
  return decodeHtml(String(value || ""))
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function createChunks(values) {
  const chunks = [];
  let currentChunk = [];
  let currentChars = 0;

  values.forEach((value) => {
    const estimatedChars = value.length + 48;
    if (
      currentChunk.length &&
      (currentChunk.length >= MAX_BATCH_ITEMS || currentChars + estimatedChars > MAX_BATCH_CHARS)
    ) {
      chunks.push(currentChunk);
      currentChunk = [];
      currentChars = 0;
    }

    currentChunk.push(value);
    currentChars += estimatedChars;
  });

  if (currentChunk.length) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function getCacheKey(language, value) {
  return `${language}::${value}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeHtml(value) {
  return String(value)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}
