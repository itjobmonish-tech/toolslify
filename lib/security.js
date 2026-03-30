const AUDIO_TYPES = new Set([
  "audio/m4a",
  "audio/mp3",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
]);

const PDF_TYPES = new Set(["application/pdf"]);
export const MAX_AUDIO_UPLOAD_BYTES = 15 * 1024 * 1024;
export const MAX_PDF_UPLOAD_BYTES = 12 * 1024 * 1024;

export function sanitizeTextInput(value, options = {}) {
  const { maxLength = 20000, preserveNewlines = true } = options;

  return String(value || "")
    .replace(/\r/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[^\S\n]+/g, " ")
    .replace(preserveNewlines ? /\n{3,}/g : /\s{2,}/g, preserveNewlines ? "\n\n" : " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeOption(value, allowedValues, fallback) {
  return allowedValues.includes(value) ? value : fallback;
}

export function sanitizeFilename(filename = "download.txt") {
  const clean = filename.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
  return clean.replace(/^-|-$/g, "") || "download.txt";
}

export function getRequestIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "local";
}

export function isAudioFile(file) {
  return Boolean(file && typeof file.arrayBuffer === "function" && AUDIO_TYPES.has(file.type));
}

export function isPdfFile(file) {
  return Boolean(file && typeof file.arrayBuffer === "function" && PDF_TYPES.has(file.type));
}

export function isFileTooLarge(file, maxBytes) {
  return Boolean(file && typeof file.size === "number" && file.size > maxBytes);
}
