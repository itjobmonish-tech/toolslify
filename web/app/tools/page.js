import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAllToolConfigs } from "./[tool]/config";

export const metadata = {
  title: "Toolslify Tools - AI Writing, Career, and Social Media Tools",
  description:
    "Browse Toolslify's scalable tool directory for AI writing, career, and social media workflows, each with long-form SEO content, rich metadata, and fast client-side editing.",
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsIndexPage() {
  const tools = getAllToolConfigs();

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <section className="space-y-5">
        <Badge tone="accent">Tool directory</Badge>
        <h1 className="max-w-5xl text-5xl font-semibold leading-none tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl">
          SEO-focused tools built like landing pages, not thin utilities.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
          Explore Toolslify's writing, career, and social content tools. Every page includes a working editor, keyword-focused metadata, long-form content, internal links, and semantic structure built for search visibility.
        </p>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
            <Card className="h-full p-6 transition hover:-translate-y-1 hover:border-[var(--accent-soft)]">
              <div className="flex items-center justify-between gap-3">
                <Badge>{tool.category}</Badge>
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{tool.mainKeyword}</span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{tool.name}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{tool.description}</p>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
