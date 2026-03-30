import { PDFParse } from "pdf-parse";
import {
  analyzeText,
  createSeededRandom,
  estimateAiDetectionScore,
  humanizeText,
} from "./humanizer.js";
import { sanitizeFilename, sanitizeOption, sanitizeTextInput } from "./security.js";
import { readingTimeFromWords, titleCase, unique } from "./utils.js";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "if",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "there",
  "this",
  "to",
  "was",
  "what",
  "when",
  "where",
  "which",
  "with",
  "why",
  "will",
  "your",
]);

export async function runTool(slug, payload = {}) {
  switch (slug) {
    case "ai-humanizer":
      return runHumanizerTool(payload);
    case "assignment-answer-generator":
      return runAssignmentTool(payload);
    case "meeting-notes-summary":
      return runMeetingTool(payload);
    case "voice-note-to-text":
      return runVoiceTool(payload);
    case "pdf-all-format-converter":
      return runPdfTool(payload);
    default:
      throw new Error("Unsupported tool");
  }
}

function runHumanizerTool(payload) {
  const input = sanitizeTextInput(payload.input, { maxLength: 18000 });
  const tone = sanitizeOption(payload.tone, ["friendly", "formal", "casual"], "friendly");
  const strength = sanitizeOption(payload.strength, ["low", "medium", "high"], "medium");

  if (!input) {
    throw new Error("Input is required");
  }

  const random = createSeededRandom(Date.now());
  const output = humanizeText(input, { tone, strength, random });
  const inputMetrics = analyzeText(input);
  const outputMetrics = analyzeText(output);
  const detection = estimateAiDetectionScore(input, output);

  return {
    output,
    meta: {
      inputMetrics,
      outputMetrics,
      detection,
      trustNote: "No input is stored after processing. Recent history stays in your browser only.",
    },
  };
}

function runAssignmentTool(payload) {
  const question = sanitizeTextInput(payload.question, { maxLength: 2400 });
  const context = sanitizeTextInput(payload.context, { maxLength: 5000 });
  const subject = sanitizeTextInput(payload.subject, { maxLength: 120 });
  const depth = sanitizeOption(payload.depth, ["short", "standard", "detailed"], "standard");
  const academicTone = payload.academicTone === true || payload.academicTone === "true";

  if (!question) {
    throw new Error("Question is required");
  }

  const keywords = extractKeywords(`${question} ${context}`, 6);
  const outline = buildAssignmentOutline(question, keywords, depth);
  const intro = buildAssignmentIntro(question, subject, academicTone, keywords);
  const bodySections = buildAssignmentBody(question, context, keywords, depth, academicTone);
  const conclusion = buildAssignmentConclusion(question, keywords, academicTone);

  const output = [
    "Introduction",
    intro,
    "",
    ...bodySections.flatMap((section) => [section.heading, section.body, ""]),
    "Conclusion",
    conclusion,
  ]
    .join("\n")
    .trim();

  return {
    output,
    meta: {
      outline,
      studyNotes: buildStudyNotes(keywords, question),
      estimatedReadingTime: `${readingTimeFromWords(analyzeText(output).words)} min`,
      answerTone: academicTone ? "Academic" : "Standard",
    },
  };
}

function runMeetingTool(payload) {
  const notes = sanitizeTextInput(payload.notes, { maxLength: 18000 });
  const format = sanitizeOption(payload.format, ["bullets", "paragraph"], "bullets");

  if (!notes) {
    throw new Error("Meeting notes are required");
  }

  const lines = splitLines(notes);
  const decisions = extractDecisionLines(lines);
  const actionItems = extractActionItems(lines);
  const openQuestions = lines.filter((line) => line.includes("?")).slice(0, 4);
  const summary = buildMeetingSummary(lines, decisions, actionItems);

  const output =
    format === "paragraph"
      ? createMeetingParagraph(summary, decisions, actionItems, openQuestions)
      : createMeetingBullets(summary, decisions, actionItems, openQuestions);

  return {
    output,
    meta: {
      summary,
      decisions,
      actionItems,
      openQuestions,
      format,
    },
  };
}

async function runVoiceTool(payload) {
  const transcript = sanitizeTextInput(payload.transcript, { maxLength: 18000 });
  const language = sanitizeTextInput(payload.language, { maxLength: 10, preserveNewlines: false }).toLowerCase();
  let finalTranscript = transcript;
  let source = transcript ? "Live recording" : "Uploaded audio";
  let guidance = "";

  if (!finalTranscript && payload.file) {
    if (process.env.OPENAI_API_KEY) {
      finalTranscript = sanitizeTextInput(await transcribeUploadedAudio(payload.file, language), { maxLength: 18000 });
    } else {
      guidance =
        "Audio upload transcription is ready to enable. Add OPENAI_API_KEY to process uploaded files, or use live browser recording now on supported browsers.";
    }
  }

  if (!finalTranscript && !guidance) {
    throw new Error("A voice recording or transcript is required");
  }

  const output = finalTranscript ? polishTranscript(finalTranscript) : "";
  const keywords = extractKeywords(output, 5);

  return {
    output,
    meta: {
      source,
      guidance,
      qualityNote: output
        ? "Transcript spacing and punctuation have been lightly normalized for readability."
        : "Upload mode needs a server API key for transcription.",
      summaryPoints: output ? buildStudyNotes(keywords, output).slice(0, 4) : [],
    },
  };
}

async function runPdfTool(payload) {
  const format = sanitizeOption(payload.format, ["text", "word", "summary", "notes"], "text");
  const file = payload.file;

  if (!file) {
    throw new Error("PDF file is required");
  }

  const arrayBuffer = await file.arrayBuffer();
  const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
  const result = await parser.getText();
  await parser.destroy();

  const extractedText = sanitizeTextInput(result.text, { maxLength: 60000 });

  if (!extractedText) {
    throw new Error("This PDF does not appear to contain extractable text");
  }

  const baseName = sanitizeFilename(file.name.replace(/\.pdf$/i, "")) || "document";
  const summary = summarizeLongText(extractedText, 6);
  const notes = createPdfNotes(extractedText);

  let output = extractedText;
  let downloadContent = extractedText;
  let filename = `${baseName}.txt`;
  let mimeType = "text/plain;charset=utf-8";

  if (format === "word") {
    output = `Word-ready export\n\n${summary}\n\n${extractedText}`;
    downloadContent = createWordDocument(baseName, output);
    filename = `${baseName}.doc`;
    mimeType = "application/msword";
  }

  if (format === "summary") {
    output = summary;
    downloadContent = summary;
    filename = `${baseName}-summary.txt`;
  }

  if (format === "notes") {
    output = notes;
    downloadContent = notes;
    filename = `${baseName}-notes.txt`;
  }

  return {
    output,
    meta: {
      format,
      extractedWords: analyzeText(extractedText).words,
      pages: Array.isArray(result.pages) ? result.pages.length : undefined,
      summary,
      noteBullets: splitLines(notes).slice(0, 6),
    },
    download: {
      content: downloadContent,
      filename,
      mimeType,
    },
  };
}

function buildAssignmentOutline(question, keywords, depth) {
  const base = [
    `Clarify the core issue in "${question.replace(/[?]+$/, "")}"`,
    `Explain the main argument using ${keywords[0] || "clear evidence"}`,
    `Support the answer with ${keywords[1] || "relevant context"} and ${keywords[2] || "examples"}`,
    "Close with the final implication or takeaway",
  ];

  if (depth === "detailed") {
    base.splice(3, 0, "Add a counterpoint or limitation before the conclusion");
  }

  return base;
}

function buildAssignmentIntro(question, subject, academicTone, keywords) {
  const prefix = academicTone
    ? "A strong response to this question should begin by defining the main issue clearly."
    : "A clear answer starts by stating the main point directly.";
  const subjectLine = subject ? ` In the context of ${subject},` : "";
  const keywordLine = keywords.length
    ? ` the answer should address ${keywords.slice(0, 3).join(", ")} in a logical order.`
    : " the answer should move from the main idea to supporting detail in a steady order.";

  return `${prefix}${subjectLine} ${titleCase(question.replace(/[?]+$/, ""))} can be understood by focusing on the relationship between the main concept, the evidence behind it, and the outcome it produces.${keywordLine}`;
}

function buildAssignmentBody(question, context, keywords, depth, academicTone) {
  const noteChunks = splitLines(context).slice(0, depth === "detailed" ? 4 : 3);
  const sections = [];
  const totalSections = depth === "short" ? 2 : depth === "detailed" ? 4 : 3;

  for (let index = 0; index < totalSections; index += 1) {
    const focus = keywords[index] || noteChunks[index] || `key idea ${index + 1}`;
    const detail = noteChunks[index] || noteChunks[0] || question;
    sections.push({
      heading: `Point ${index + 1}`,
      body: academicTone
        ? `One useful way to approach ${focus} is to explain how it shapes the broader answer. ${normalizeSentence(detail)}. This supports the overall argument because it links the concept to evidence, application, and result rather than leaving the point as a simple definition.`
        : `A clear point here is ${focus}. ${normalizeSentence(detail)}. This matters because it connects the question to a real explanation instead of repeating the prompt in different words.`,
    });
  }

  return sections;
}

function buildAssignmentConclusion(question, keywords, academicTone) {
  const keywordLine = keywords.length
    ? `Overall, the strongest answer brings ${keywords.slice(0, 3).join(", ")} together in one final takeaway.`
    : "Overall, the strongest answer ties the main argument back to the original question.";

  return academicTone
    ? `${keywordLine} In academic writing, the conclusion should confirm the central claim, reinforce the reasoning behind it, and leave the reader with a clear sense of why the answer is valid.`
    : `${keywordLine} The conclusion should restate the point clearly and show why the explanation actually answers the question.`;
}

function buildMeetingSummary(lines, decisions, actionItems) {
  const themes = extractKeywords(lines.join(" "), 4);
  const themeLine = themes.length ? themes.join(", ") : "progress, blockers, and next steps";
  const decisionLine = decisions.length
    ? `The group aligned on ${decisions.length} decision${decisions.length === 1 ? "" : "s"}`
    : "The discussion mainly focused on clarifying the current state";
  const actionLine = actionItems.length
    ? `and captured ${actionItems.length} action item${actionItems.length === 1 ? "" : "s"} for follow-up.`
    : "and surfaced next steps that still need ownership.";

  return `This meeting centered on ${themeLine}. ${decisionLine} ${actionLine}`;
}

function createMeetingBullets(summary, decisions, actionItems, openQuestions) {
  const blocks = [
    "Summary",
    `- ${summary}`,
    "",
    "Decisions",
    ...(decisions.length ? decisions.map((item) => `- ${item}`) : ["- No explicit decisions were captured."]),
    "",
    "Action items",
    ...(actionItems.length ? actionItems.map((item) => `- ${item}`) : ["- Confirm owners and deadlines for the next follow-up."]),
  ];

  if (openQuestions.length) {
    blocks.push("", "Open questions", ...openQuestions.map((item) => `- ${item}`));
  }

  return blocks.join("\n");
}

function createMeetingParagraph(summary, decisions, actionItems, openQuestions) {
  const decisionsLine = decisions.length
    ? `Key decisions included ${decisions.join("; ")}.`
    : "No firm decisions were captured in the notes.";
  const actionLine = actionItems.length
    ? `The next steps are ${actionItems.join("; ")}.`
    : "A follow-up is still needed to confirm owners and deadlines.";
  const questionLine = openQuestions.length
    ? `Open questions remain around ${openQuestions.join("; ")}.`
    : "";

  return `${summary} ${decisionsLine} ${actionLine} ${questionLine}`.trim();
}

function extractDecisionLines(lines) {
  const matches = lines.filter((line) => /(decided|agreed|approved|will move forward|confirmed)/i.test(line));
  if (matches.length) return matches.slice(0, 4).map(normalizeSentence);
  return lines.slice(0, 3).map((line) => `The team aligned on ${lowercaseFirst(normalizeSentence(line))}`);
}

function extractActionItems(lines) {
  const matches = lines.filter((line) => /(action|follow up|next step|owner|due|send|share|prepare|review)/i.test(line));
  if (matches.length) return unique(matches.slice(0, 5).map(normalizeSentence));
  return lines.slice(0, 3).map((line) => `Follow up on ${lowercaseFirst(normalizeSentence(line))}`);
}

function summarizeLongText(text, sentenceCount = 5) {
  const sentences = splitIntoSentences(text);
  const selected = pickImportantSentences(sentences, sentenceCount);
  return selected.join(" ");
}

function createPdfNotes(text) {
  const keywords = extractKeywords(text, 6);
  const sentences = pickImportantSentences(splitIntoSentences(text), 5);
  const bullets = [
    "Overview",
    `- ${summarizeLongText(text, 3)}`,
    "",
    "Key points",
    ...sentences.map((sentence) => `- ${sentence}`),
    "",
    "Focus terms",
    ...keywords.map((keyword) => `- ${titleCase(keyword)}`),
  ];

  return bullets.join("\n");
}

function buildStudyNotes(keywords, sourceText) {
  const sentences = pickImportantSentences(splitIntoSentences(sourceText), 3);
  const keywordNotes = keywords.slice(0, 3).map((item) => `Review how ${item} supports the main point.`);
  return unique([...keywordNotes, ...sentences.map((sentence) => sentence.replace(/[.]+$/, ""))]).slice(0, 5);
}

function splitLines(text) {
  return sanitizeTextInput(text, { maxLength: 24000 })
    .split(/\n|[\u2022-]\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitIntoSentences(text) {
  return sanitizeTextInput(text, { maxLength: 60000 })
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 20);
}

function extractKeywords(text, limit = 5) {
  const counts = new Map();
  const words = sanitizeTextInput(text, { maxLength: 12000, preserveNewlines: false })
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word));

  words.forEach((word) => {
    counts.set(word, (counts.get(word) || 0) + 1);
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function pickImportantSentences(sentences, limit) {
  return sentences
    .map((sentence, index) => ({
      sentence: normalizeSentence(sentence),
      index,
      score: scoreSentence(sentence),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);
}

function scoreSentence(sentence) {
  const words = sentence.split(/\s+/).length;
  const keywordBoost = extractKeywords(sentence, 3).length * 2;
  return Math.min(words, 28) + keywordBoost;
}

function normalizeSentence(text) {
  const cleaned = sanitizeTextInput(text, { maxLength: 500, preserveNewlines: false })
    .replace(/^[\u2022\-:\s]+/, "")
    .trim();
  return ensureTrailingPeriod(cleaned.charAt(0).toUpperCase() + cleaned.slice(1));
}

function lowercaseFirst(text) {
  return text ? `${text.charAt(0).toLowerCase()}${text.slice(1)}` : "";
}

function ensureTrailingPeriod(text) {
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function polishTranscript(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, char) => `${prefix}${char.toUpperCase()}`)
    .trim();
}

async function transcribeUploadedAudio(file, language) {
  const formData = new FormData();
  const blob = new Blob([await file.arrayBuffer()], {
    type: file.type || "application/octet-stream",
  });

  formData.append("file", blob, sanitizeFilename(file.name || "audio.webm"));
  formData.append("model", "gpt-4o-mini-transcribe");
  formData.append("response_format", "json");

  if (/^[a-z]{2}$/i.test(language)) {
    formData.append("language", language);
  }

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.error?.message || "Transcription failed");
  }

  return json.text || "";
}

function createWordDocument(title, content) {
  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${titleCase(title)}</title>
      </head>
      <body>
        <h1>${titleCase(title)}</h1>
        ${content
          .split("\n\n")
          .map((block) => `<p>${block.replace(/\n/g, "<br />")}</p>`)
          .join("")}
      </body>
    </html>
  `.trim();
}
