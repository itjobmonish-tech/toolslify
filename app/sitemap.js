import { SITE_URL, getAllTools, getCategoryPages } from "@/lib/site-data";

export default function sitemap() {
  const lastModified = new Date("2026-04-27T00:00:00.000Z");
  const staticRoutes = ["", "/tools", "/about", "/contact", "/editorial-policy", "/accuracy-disclaimer", "/privacy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/tools" ? 0.9 : 0.3,
  }));

  const toolRoutes = getAllTools().map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified,
    changeFrequency: tool.popular ? "weekly" : "monthly",
    priority: getToolPriority(tool),
  }));

  const categoryRoutes = getCategoryPages().map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.86,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}

function getToolPriority(tool) {
  if (tool.popular) return 0.82;
  if (["salary-data", "cost-of-living", "education-roi", "mortgage-data", "tax-budget", "home-costs"].includes(tool.categorySlug)) {
    return 0.72;
  }
  if (tool.categorySlug === "converters" || tool.categorySlug === "cooking") {
    return 0.58;
  }
  return 0.64;
}
