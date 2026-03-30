import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SOCIAL_IMAGE, TWITTER_IMAGE_PATH, getAllTools, getCoreTools, getSearchIntentTools } from "@/lib/site-data";
import { createBreadcrumbSchema, createCollectionPageSchema } from "@/lib/structured-data";

export const metadata = {
  title: "AI Tool Suite",
  description:
    "Explore Toolslify's premium AI tool suite for humanizing text, generating assignments, summarizing meetings, converting voice notes, and extracting value from PDFs.",
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "AI Tool Suite",
    description:
      "Explore Toolslify's premium AI tool suite for humanizing text, generating assignments, summarizing meetings, converting voice notes, and extracting value from PDFs.",
    url: "/tools",
    siteName: "Toolslify",
    type: "website",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tool Suite",
    description:
      "Explore Toolslify's premium AI tool suite for humanizing text, generating assignments, summarizing meetings, converting voice notes, and extracting value from PDFs.",
    images: [TWITTER_IMAGE_PATH],
  },
};

export default function ToolsIndexPage() {
  const tools = getAllTools();
  const coreTools = getCoreTools();
  const searchTools = getSearchIntentTools();
  const collectionSchema = createCollectionPageSchema(tools);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
  ]);

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="space-y-5">
        <Badge tone="accent">Tool suite</Badge>
        <h1 className="section-title max-w-5xl text-5xl font-semibold">Nine product routes designed around real user intent</h1>
        <p className="max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
          Toolslify blends five core productivity workflows with four humanizer intent routes, so the suite can serve both direct product browsing and high-intent search journeys with equal clarity.
        </p>
      </section>

      <section className="mt-10">
        <div className="max-w-3xl space-y-3">
          <Badge tone="accent">Core workflows</Badge>
          <h2 className="text-3xl font-semibold text-[var(--foreground)]">Primary tools used across school, work, audio, and documents</h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {coreTools.map((tool) => (
            <Card key={tool.slug} className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <Badge tone="accent">{tool.category}</Badge>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {tool.badge}
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-semibold text-[var(--foreground)]">{tool.name}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-[var(--muted-foreground)]">{tool.description}</p>
              <div className="mt-5 grid gap-3">
                {tool.heroStats.map((item) => (
                  <div key={item.label} className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{item.value}</p>
                  </div>
                ))}
              </div>
              <Button as={Link} href={tool.path} className="mt-6 self-start">
                Open tool
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-3xl space-y-3">
          <Badge tone="accent">Humanizer intent routes</Badge>
          <h2 className="text-3xl font-semibold text-[var(--foreground)]">Search-driven tool experiences built around AI writing cleanup</h2>
          <p className="text-sm leading-8 text-[var(--muted-foreground)]">
            These four routes convert SEO intent into real product entry points, so users landing on Humanize AI Text, AI Humanizer Free, AI Paraphraser, or Rewrite AI Text can start working immediately.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {searchTools.map((tool) => (
            <Card key={tool.slug} className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <Badge>{tool.category}</Badge>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {tool.badge}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-[var(--foreground)]">{tool.name}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-[var(--muted-foreground)]">{tool.description}</p>
              <div className="mt-5 grid gap-3">
                {tool.heroStats.map((item) => (
                  <div key={item.label} className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{item.value}</p>
                  </div>
                ))}
              </div>
              <Button as={Link} href={tool.path} variant="secondary" className="mt-6 self-start">
                Open route
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
