export function cn(...values) {
  return values.filter(Boolean).join(" ");
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatRelativeTime(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.round(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function formatFileSize(bytes = 0) {
  if (!bytes) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function readingTimeFromWords(words = 0) {
  return Math.max(1, Math.ceil(words / 220));
}

export function unique(values = []) {
  return [...new Set(values)];
}

export function titleCase(text = "") {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function downloadTextFile({ content, filename, mimeType = "text/plain;charset=utf-8" }) {
  if (typeof window === "undefined") return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
