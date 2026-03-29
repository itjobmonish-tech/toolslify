import { TOOL_SLUGS } from "@/app/tools/[tool]/config";

export default function sitemap() {
  const baseUrl = "https://www.toolslify.com";
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...TOOL_SLUGS.map((slug) => ({
      url: `${baseUrl}/tools/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: slug === "humanize-ai-free" ? 0.95 : 0.9,
    })),
  ];
}
