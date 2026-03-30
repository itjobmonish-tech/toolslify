import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createSeoFaqSchema, getSeoPage, getSeoSlugs } from "@/lib/seo-pages";
import { SOCIAL_IMAGE, TWITTER_IMAGE_PATH } from "@/lib/site-data";
import { createBreadcrumbSchema, createSeoArticleSchema } from "@/lib/structured-data";

export function generateStaticParams() {
  return getSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.canonical,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.url,
      siteName: "Toolslify",
      type: "article",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [TWITTER_IMAGE_PATH],
    },
  };
}

export default async function SeoLandingPage({ params }) {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page) {
    notFound();
  }

  const faqSchema = createSeoFaqSchema(page);
  const articleSchema = createSeoArticleSchema(page);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: page.heroTitle, path: page.canonical },
  ]);

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="prose-shell">
        <Badge tone="accent">SEO guide</Badge>
        <h1 className="mt-5">{page.heroTitle}</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-[var(--muted-foreground)]">{page.description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button as={Link} href={page.ctaHref}>
            Open AI Humanizer
          </Button>
          <Button as={Link} href="/tools" variant="secondary">
            Explore tool suite
          </Button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Card className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Before</p>
            <p className="mt-3 text-base leading-8 text-[var(--foreground)]">{page.exampleBefore}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">After</p>
            <p className="mt-3 text-base leading-8 text-[var(--foreground)]">{page.exampleAfter}</p>
          </Card>
        </div>

        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <section>
          <h2>Internal links that keep the workflow moving</h2>
          <p>
            Strong SEO pages should not trap readers. They should help users move from research into action. That is
            why Toolslify connects this page to the live AI Humanizer, the full tool suite, and the supporting tools
            that handle assignments, meetings, voice notes, and PDF workflows.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {page.internalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-4 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-edge)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>Frequently asked questions</h2>
          <div className="mt-5 grid gap-5">
            {page.faq.map((item) => (
              <Card key={item.question} className="p-6">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className="mt-10 p-8">
            <Badge tone="accent">Next step</Badge>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">{page.ctaTitle}</h2>
            <p className="mt-3 text-base leading-8 text-[var(--muted-foreground)]">
              This page is designed to explain the search intent clearly. The live product is where the value shows up:
              paste a real draft, run the rewrite, review the changes, and export the version you actually trust.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button as={Link} href={page.ctaHref}>
                Start free
              </Button>
              <Button as={Link} href="/tools" variant="secondary">
                View all tools
              </Button>
            </div>
          </Card>
        </section>
      </article>
    </div>
  );
}
