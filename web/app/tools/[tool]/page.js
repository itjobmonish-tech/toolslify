import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getRelatedToolConfigs, getToolConfig, TOOL_SLUGS } from "./config";
import { createFaqSchema, getToolSeoContent } from "./seoContent";

const ToolClient = dynamic(() => import("./ClientComponent"), {
  loading: () => (
    <Card className="p-8">
      <div className="space-y-4">
        <div className="h-5 w-40 rounded-full bg-[var(--accent-faint)]" />
        <div className="h-12 w-2/3 rounded-full bg-[var(--accent-faint)]" />
        <div className="h-[360px] rounded-[28px] bg-[var(--surface-elevated)]" />
      </div>
    </Card>
  ),
});

export function generateStaticParams() {
  return TOOL_SLUGS.map((tool) => ({ tool }));
}

export async function generateMetadata({ params }) {
  const { tool: slug } = await params;
  const tool = getToolConfig(slug);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `https://www.toolslify.com/tools/${tool.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.title,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }) {
  const { tool: slug } = await params;
  const tool = getToolConfig(slug);
  const seo = getToolSeoContent(slug);

  if (!tool || !seo) {
    notFound();
  }

  const relatedTools = getRelatedToolConfigs(tool.slug);
  const faqSchema = createFaqSchema(tool.name, seo.faqs);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Tools",
        item: "https://www.toolslify.com/tools",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.name,
        item: `https://www.toolslify.com/tools/${tool.slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-5">
          <Badge tone="accent">{tool.category} tool</Badge>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl font-semibold leading-none tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl">
              {tool.name}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">{seo.intro}</p>
          </div>
        </div>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Keyword focus</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="accent">{tool.mainKeyword}</Badge>
            {tool.secondaryKeywords.map((keyword) => (
              <Badge key={keyword}>{keyword}</Badge>
            ))}
          </div>
        </Card>
      </section>

      <ToolClient tool={tool} />

      {tool.slug === "humanize-ai-free" ? (
        <section className="mt-14 rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <div className="space-y-3">
            <Badge>More AI Tools You May Like</Badge>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              Keep the workflow moving with neighboring writing and social tools.
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {relatedTools.map((item) => (
              <Link key={item.slug} href={`/tools/${item.slug}`}>
                <Card className="h-full p-5 transition hover:-translate-y-1 hover:border-[var(--accent-soft)]">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{item.name}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{item.introSummary}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_320px]">
        <article className="space-y-12">
          <SeoSection title={`What is ${tool.name}?`} paragraphs={seo.sections.whatIs} />
          <SeoSection title={`How to Use ${tool.name}`} paragraphs={seo.sections.howToUse} />
          <SeoSection title={`Benefits of ${tool.name}`} paragraphs={seo.sections.benefits} />
          <ExamplesSection title={`Examples: ${tool.name} input and output`} examples={seo.examples} />
          <ListSection title={`${tool.name} use cases`} items={seo.sections.useCases} />
          <ListSection title={`Tips for best results with ${tool.name}`} items={seo.sections.tips} />
          <RelatedToolsSection intro={seo.relatedIntro} tools={relatedTools} />
          <FaqSection toolName={tool.name} faqs={seo.faqs} />
        </article>

        <aside className="space-y-5">
          <Card className="p-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">Why this page is built to rank</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
              <li>Unique copy built around {tool.mainKeyword}</li>
              <li>Canonical path locked to /tools/{tool.slug}</li>
              <li>Internal links to related Toolslify pages</li>
              <li>Long-form SEO sections and FAQ markup</li>
            </ul>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">Related keyword cluster</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.keywords.map((keyword) => (
                <Badge key={keyword}>{keyword}</Badge>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SeoSection({ title, paragraphs }) {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{title}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
          {paragraph}
        </p>
      ))}
    </section>
  );
}

function ExamplesSection({ title, examples }) {
  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{title}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {examples.map((example) => (
          <Card key={example.input} className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Input</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">{example.input}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Output</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted-foreground)]">{example.output}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ListSection({ title, items }) {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
            <span className="mt-2 h-2 w-2 rounded-full bg-[var(--accent-strong)]" />
            <p className="text-base leading-8 text-[var(--muted-foreground)]">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RelatedToolsSection({ intro, tools }) {
  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">Related Tools</h2>
      <p className="max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">{intro}</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
            <Card className="h-full p-5 transition hover:-translate-y-1 hover:border-[var(--accent-soft)]">
              <p className="text-sm font-semibold text-[var(--foreground)]">{tool.name}</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{tool.introSummary}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ toolName, faqs }) {
  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{toolName} FAQ</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <Card key={faq.question} className="p-5">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{faq.question}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{faq.answer}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
