import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAllToolConfigs } from "@/app/tools/[tool]/config";

export const metadata = {
  title: "Toolslify - SEO-Friendly AI Tools for Writing, Career, and Social Growth",
  description:
    "Discover Toolslify's AI tools for writing, career growth, and social media. Each page combines a fast tool experience with rich SEO content and internal linking.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const featuredTools = getAllToolConfigs();

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <Badge tone="accent">Toolslify SEO platform</Badge>
          <div className="space-y-5">
            <h1 className="max-w-5xl text-5xl font-semibold leading-none tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
              AI tools with real product UX and long-form pages built to rank.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
              Toolslify combines polished SaaS interfaces, canonical /tools routes, rich keyword coverage, and deeper on-page content so every tool can act like a search-ready landing page.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tools"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent-strong)] px-6 text-sm font-medium text-white shadow-[0_20px_45px_-24px_rgba(15,23,42,0.75)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-stronger)]"
            >
              Browse all tools
            </Link>
            <Link
              href="/tools/humanize-ai-free"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-6 text-sm font-medium text-[var(--foreground)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--accent-soft)] hover:bg-[var(--surface-raised)]"
            >
              Open AI Humanizer
            </Link>
          </div>
        </div>

        <Card className="p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Canonical SEO</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">/tools/ routes</p>
            </div>
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">On-page depth</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">Rich SEO content</p>
            </div>
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Retention</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                Compare mode, local history, autosave, and tool-to-tool internal linking help users stay on the site longer while signaling stronger topical depth to search engines.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section id="featured-tools" className="mt-20 space-y-5">
        <div className="space-y-3">
          <Badge>Featured tools</Badge>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">Start with the pages designed to grow search traffic first.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredTools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="h-full p-6 transition hover:-translate-y-1 hover:border-[var(--accent-soft)]">
                <div className="flex items-center justify-between gap-3">
                  <Badge>{tool.category}</Badge>
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{tool.shortName}</span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{tool.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{tool.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
