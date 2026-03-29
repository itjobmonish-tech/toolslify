import { createSeededRandom, humanizeText } from "@/lib/humanizer";

const strengthScale = {
  low: 1,
  medium: 2,
  high: 3,
};

export function runTool(slug, input, options = {}) {
  const normalized = normalizeInput(input);
  if (!normalized) return "";

  const tone = options.tone || "friendly";
  const strength = options.strength || "medium";
  const random = options.random || createSeededRandom();

  switch (slug) {
    case "humanize-ai-free":
      return humanizeText(normalized, { tone, strength, random });
    case "ai-email-writer":
      return createEmailDraft(normalized, tone, strength, random);
    case "resume-bullet-generator":
      return createResumeBullets(normalized, tone, strength, random);
    case "cover-letter-generator":
      return createCoverLetter(normalized, tone, strength, random);
    case "instagram-caption-generator":
      return createInstagramCaption(normalized, tone, strength, random);
    case "tweet-rewriter":
      return createTweetRewrite(normalized, tone, strength, random);
    default:
      return normalized;
  }
}

function createEmailDraft(input, tone, strength, random) {
  const lines = splitLines(input);
  const topic = lines[0] || "your request";
  const detail = lines.slice(1).join(" ") || input;
  const subject = buildSubject(topic, tone, random);
  const greeting = tone === "formal" ? "Hello," : tone === "casual" ? "Hi," : "Hi there,";
  const openers = {
    formal: "I am reaching out regarding",
    friendly: "I wanted to follow up about",
    casual: "Quick note about",
  };
  const closers = {
    formal: "Please let me know if you would like me to share any additional context.",
    friendly: "If it helps, I can share more context or a quick next step.",
    casual: "Happy to send more details if that would be useful.",
  };
  const cta = {
    low: "Would you be open to a quick reply?",
    medium: "Would you be open to a short call or a quick reply this week?",
    high: "Would you be open to a short call this week so we can move this forward?",
  };

  return [
    `Subject: ${subject}`,
    "",
    greeting,
    "",
    `${openers[tone] || openers.friendly} ${lowercaseFirst(topic)}. ${detailToBody(detail, strength)}.`,
    closers[tone] || closers.friendly,
    cta[strength] || cta.medium,
    "",
    tone === "formal" ? "Best regards," : "Best,",
    "Your name",
  ].join("\n");
}

function createResumeBullets(input, tone, strength, random) {
  const verbs = pickSet(
    ["Led", "Built", "Improved", "Launched", "Streamlined", "Coordinated", "Optimized", "Created"],
    random,
  );
  const items = splitBulletInput(input);
  const extraDetail = strengthScale[strength] > 1;

  return items
    .slice(0, Math.min(items.length, 4))
    .map((item, index) => {
      const verb = verbs[index % verbs.length];
      const phrase = cleanupSentence(item);
      const ending = extraDetail
        ? tone === "formal"
          ? "with clearer ownership and measurable business value"
          : "with clear ownership and visible impact"
        : tone === "casual"
        ? "with strong results"
        : "with stronger impact";
      return `${verb} ${lowercaseFirst(phrase)} ${needsEnding(phrase) ? ending : ""}`.trim();
    })
    .map((line) => `- ${ensureTrailingPeriod(line)}`)
    .join("\n");
}

function createCoverLetter(input, tone, strength, random) {
  const lines = splitLines(input);
  const role = lines[0] || "the role";
  const company = lines[1] || "your team";
  const background = lines.slice(2).join(" ") || input;
  const opener = tone === "formal" ? "Dear Hiring Manager," : "Hello Hiring Team,";
  const motivation = tone === "casual"
    ? `I am excited to apply for ${role} at ${company}.`
    : `I am writing to apply for ${role} at ${company}.`;
  const bodyOne = `${motivation} ${detailToBody(background, strength)}.`;
  const bodyTwo =
    strength === "high"
      ? "My background combines hands-on execution with cross-functional collaboration, which makes me comfortable turning goals into steady results."
      : "My background has prepared me to contribute quickly while staying aligned with the needs of the role.";
  const close = tone === "formal"
    ? "Thank you for your consideration. I would welcome the opportunity to discuss how I can contribute."
    : "Thank you for your time. I would be glad to discuss how I can support the team.";

  return [opener, "", bodyOne, "", bodyTwo, "", close, "", "Sincerely,", "Your name"].join("\n");
}

function createInstagramCaption(input, tone, strength, random) {
  const base = cleanupSentence(input);
  const hook = tone === "formal"
    ? `A clearer look at ${lowercaseFirst(base)}`
    : tone === "casual"
    ? `A quick look at ${lowercaseFirst(base)}`
    : `Here is the story behind ${lowercaseFirst(base)}`;
  const body =
    strength === "high"
      ? "The goal is to make the message feel useful, specific, and easy to respond to without sounding over-produced."
      : "The message stays clear, readable, and easy for your audience to connect with.";
  const cta = tone === "formal" ? "Save this for later or share it with your team." : "Save this if it helps and send it to someone who would use it.";
  const hashtags = buildHashtags(base, random).join(" ");

  return `${ensureTrailingPeriod(hook)} ${body} ${cta}\n\n${hashtags}`;
}

function createTweetRewrite(input, tone, strength, random) {
  const sentence = cleanupSentence(input);
  const lead = tone === "formal"
    ? "Clearer version:"
    : tone === "casual"
    ? "Sharper take:"
    : "Rewritten post:";
  const rewritten = humanizeText(sentence, { tone, strength, random });
  const concise = rewritten.split(/(?<=[.!?])\s+/)[0] || rewritten;
  const tail = strength === "high" ? " Keep the point simple and the hook strong." : "";
  return `${lead} ${trimTweet(`${concise}${tail}`)}`;
}

function buildSubject(topic, tone, random) {
  const clean = cleanupSentence(topic).replace(/[.!?]$/, "");
  if (tone === "formal") return `Regarding ${clean}`;
  if (tone === "casual") return `Quick note about ${clean}`;
  return `${clean.charAt(0).toUpperCase()}${clean.slice(1)}`;
}

function detailToBody(detail, strength) {
  const cleaned = cleanupSentence(detail);
  if (strength === "low") return cleaned;
  if (strength === "high") return `${cleaned} The goal is to keep the message specific, readable, and easy to act on`;
  return `${cleaned} The message is organized to make the next step feel clear`;
}

function buildHashtags(base, random) {
  const words = base
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 3);
  const defaults = ["#contentcreation", "#marketing", "#toolslify"];
  const tags = words.map((word) => `#${word}`);
  return [...new Set([...tags, ...pickSet(defaults, random).slice(0, 3)])].slice(0, 5);
}

function trimTweet(text) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length <= 280 ? cleaned : `${cleaned.slice(0, 277).trim()}...`;
}

function splitBulletInput(input) {
  const pieces = input
    .split(/\n|[.;]/)
    .map((piece) => piece.trim())
    .filter(Boolean);
  return pieces.length ? pieces : [input.trim()];
}

function splitLines(input) {
  return input
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeInput(text) {
  return (text || "").replace(/\r/g, "").trim();
}

function cleanupSentence(text) {
  return (text || "")
    .replace(/^[\-•\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function lowercaseFirst(text) {
  return text ? `${text.charAt(0).toLowerCase()}${text.slice(1)}` : text;
}

function ensureTrailingPeriod(text) {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function needsEnding(text) {
  return text.split(/\s+/).length < 9;
}

function pickSet(items, random) {
  return [...items].sort(() => random() - 0.5);
}
