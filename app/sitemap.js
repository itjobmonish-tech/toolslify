import { getSeoSlugs } from "@/lib/seo-pages";
import { SITE_URL, getAllTools } from "@/lib/site-data";

export default function sitemap() {
  const staticRoutes = ["", "/tools", "/privacy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date("2026-03-31"),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const toolRoutes = getAllTools().map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified: new Date("2026-03-31"),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const seoRoutes = getSeoSlugs().map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date("2026-03-31"),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...toolRoutes, ...seoRoutes];
}
