import { notFound } from "next/navigation";
import { ToolRouteShell } from "@/components/marketing/tool-route-shell";
import {
  getAllTools,
  getToolBySlug,
} from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/seo-metadata";
import {
  createBreadcrumbSchema,
  createHowToSchema,
  createToolFaqSchema,
  createToolSchema,
} from "@/lib/structured-data";
import { getToolPageContent } from "@/lib/tool-page-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return buildPageMetadata({
    title: tool.seoTitle,
    description: tool.seoDescription,
    canonical: tool.path,
    keywords: buildLongTailKeywords(tool),
  });
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const content = getToolPageContent(tool);
  const toolSchema = createToolSchema(tool);
  const faqSchema = createToolFaqSchema(tool);
  const howToSchema = createHowToSchema(content.heroTitle, content.howToSteps, tool.path);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: tool.name, path: tool.path },
  ]);

  return (
    <div className="page-shell space-y-5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolRouteShell slug={slug} />
    </div>
  );
}

function buildLongTailKeywords(tool) {
  const base = tool.shortName.toLowerCase();
  const workspaceHint =
    tool.workspace === "pdf"
      ? "pdf tool"
      : tool.workspace === "calculator"
        ? "pricing and estimate"
        : tool.workspace === "image"
          ? "image tool"
          : tool.workspace === "text"
            ? "writing tool"
            : tool.workspace === "utility"
              ? "web utility"
              : tool.workspace === "studio"
                ? "document tool"
                : "online tool";

  return Array.from(
    new Set([
      ...(tool.keywords || []),
      `${base} online`,
      `free ${base}`,
      `best ${base}`,
      `${base} without signup`,
      `${base} instant result`,
      `${base} for ${workspaceHint}`,
      `${base} browser tool`,
    ]),
  );
}
