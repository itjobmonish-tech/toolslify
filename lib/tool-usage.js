const TOOL_USAGE_STORAGE_KEY = "toolslify:tool-usage";

export function recordToolUsage(slug) {
  if (typeof window === "undefined" || !slug) return;

  try {
    const current = JSON.parse(localStorage.getItem(TOOL_USAGE_STORAGE_KEY) || "[]");
    const nextEntry = {
      slug,
      updatedAt: new Date().toISOString(),
    };
    const next = [nextEntry, ...current.filter((item) => item.slug !== slug)].slice(0, 6);
    localStorage.setItem(TOOL_USAGE_STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

export function getRecentToolUsage(limit = 3) {
  if (typeof window === "undefined") return [];

  try {
    const current = JSON.parse(localStorage.getItem(TOOL_USAGE_STORAGE_KEY) || "[]");
    return Array.isArray(current) ? current.slice(0, limit) : [];
  } catch {
    return [];
  }
}

export function getToolUsageStorageKey() {
  return TOOL_USAGE_STORAGE_KEY;
}
