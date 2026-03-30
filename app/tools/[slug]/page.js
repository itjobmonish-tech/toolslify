import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolWorkspaceSkeleton } from "@/components/tools/tool-workspace-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SOCIAL_IMAGE, TWITTER_IMAGE_PATH, getAllTools, getToolBySlug } from "@/lib/site-data";
import {
  createBreadcrumbSchema,
  createToolFaqSchema,
  createToolSchema,
} from "@/lib/structured-data";

const createWorkspace = (loader) =>
  dynamic(loader, {
    loading: () => <ToolWorkspaceSkeleton />,
  });

const workspaceMap = {
  "ai-humanizer": createWorkspace(() =>
    import("@/components/tools/humanizer-workspace").then((mod) => mod.HumanizerWorkspace),
  ),
  "humanize-ai-text": createWorkspace(() =>
    import("@/components/tools/humanizer-workspace").then((mod) => mod.HumanizerWorkspace),
  ),
  "ai-humanizer-free": createWorkspace(() =>
    import("@/components/tools/humanizer-workspace").then((mod) => mod.HumanizerWorkspace),
  ),
  "ai-paraphraser": createWorkspace(() =>
    import("@/components/tools/humanizer-workspace").then((mod) => mod.HumanizerWorkspace),
  ),
  "rewrite-ai-text": createWorkspace(() =>
    import("@/components/tools/humanizer-workspace").then((mod) => mod.HumanizerWorkspace),
  ),
  "assignment-answer-generator": createWorkspace(() =>
    import("@/components/tools/assignment-workspace").then((mod) => mod.AssignmentWorkspace),
  ),
  "meeting-notes-summary": createWorkspace(() =>
    import("@/components/tools/meeting-workspace").then((mod) => mod.MeetingWorkspace),
  ),
  "voice-note-to-text": createWorkspace(() =>
    import("@/components/tools/voice-workspace").then((mod) => mod.VoiceWorkspace),
  ),
  "pdf-all-format-converter": createWorkspace(() =>
    import("@/components/tools/pdf-workspace").then((mod) => mod.PdfWorkspace),
  ),
};

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: {
      canonical: tool.path,
    },
    keywords: tool.keywords,
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
      url: tool.path,
      siteName: "Toolslify",
      type: "website",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seoTitle,
      description: tool.seoDescription,
      images: [TWITTER_IMAGE_PATH],
    },
  };
}

export default async function ToolPage({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const Workspace = workspaceMap[tool.slug];
  const toolSchema = createToolSchema(tool);
  const faqSchema = createToolFaqSchema(tool);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: tool.name, path: tool.path },
  ]);
  const toolThemeStyle = {
    "--accent-start": tool.theme.primary,
    "--accent-end": tool.theme.secondary,
    "--accent-surface": tool.theme.surface,
    "--accent-edge": tool.theme.glow,
    "--accent-text": tool.theme.primary,
    "--accent-ring": tool.theme.glow,
  };

  return (
    <div className="page-shell" style={toolThemeStyle}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
          <div className="space-y-5">
            <Badge tone="accent">{tool.badge}</Badge>
            <h1 className="section-title text-5xl font-semibold">{tool.headline}</h1>
            <p className="max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
              {tool.keywords.slice(0, 3).map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>

          <Card className="grid gap-4 p-6 sm:grid-cols-3">
            {tool.heroStats.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{item.label}</p>
                <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">{item.value}</p>
              </div>
            ))}
          </Card>
        </div>

        <Workspace />
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-[1fr_0.92fr]">
        <div className="grid gap-5 md:grid-cols-3">
          {tool.featureCards.map((item) => (
            <Card key={item.title} className="p-6">
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{item.body}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <Badge tone="accent">Best uses</Badge>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">Where this tool fits best</h2>
          <div className="mt-5 space-y-3">
            {tool.useCases.map((item) => (
              <div key={item} className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm leading-7 text-[var(--foreground)]">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">No data stored</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
              Requests are processed in memory only. Recent history and preferences stay on-device in the browser.
            </p>
          </div>
        </Card>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="p-6">
          <Badge tone="accent">Related pages</Badge>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">SEO pages connected to this tool</h2>
          <div className="mt-5 space-y-3">
            {tool.relatedSeoLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-edge)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 md:grid-cols-3">
          {tool.faq.map((item) => (
            <Card key={item.question} className="p-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{item.question}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
