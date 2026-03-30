import Link from "next/link";
import { HeroPreview } from "@/components/marketing/hero-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createHomepageFaqSchema,
  createOrganizationSchema,
  createWebsiteSchema,
} from "@/lib/structured-data";
import {
  HERO_METRICS,
  HOME_FAQ,
  HOW_IT_WORKS,
  SOCIAL_IMAGE,
  TESTIMONIALS,
  TRUST_BADGES,
  TWITTER_IMAGE_PATH,
  USE_CASES,
  getCoreTools,
  getSearchIntentTools,
} from "@/lib/site-data";

export const metadata = {
  title: "Premium AI Utility Suite for Writing, Notes, Voice, and PDFs",
  description:
    "Toolslify is a premium all-in-one AI toolkit for students, creators, and professionals. Humanize AI text, generate assignments, summarize meetings, transcribe voice notes, and convert PDFs.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Premium AI Utility Suite for Writing, Notes, Voice, and PDFs",
    description:
      "Toolslify is a premium all-in-one AI toolkit for students, creators, and professionals. Humanize AI text, generate assignments, summarize meetings, transcribe voice notes, and convert PDFs.",
    url: "/",
    siteName: "Toolslify",
    type: "website",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium AI Utility Suite for Writing, Notes, Voice, and PDFs",
    description:
      "Toolslify is a premium all-in-one AI toolkit for students, creators, and professionals. Humanize AI text, generate assignments, summarize meetings, transcribe voice notes, and convert PDFs.",
    images: [TWITTER_IMAGE_PATH],
  },
};

export default function HomePage() {
  const coreTools = getCoreTools();
  const searchTools = getSearchIntentTools();
  const homepageFaqSchema = createHomepageFaqSchema(HOME_FAQ);
  const organizationSchema = createOrganizationSchema();
  const websiteSchema = createWebsiteSchema();

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqSchema) }} />

      <section className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <div className="space-y-7">
          <Badge tone="accent">Premium SaaS workspace</Badge>
          <div className="space-y-5">
            <h1 className="section-title max-w-4xl text-[3.3rem] font-semibold leading-none sm:text-[4.5rem] lg:text-[5.4rem]">
              Make AI Text Sound 100% Human (Undetectable)
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
              All-in-one AI writing toolkit for students, creators, and professionals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button as={Link} href="/tools/ai-humanizer" size="lg">
              {"\u2728 Start Free"}
            </Button>
            <Button as={Link} href="/tools" variant="secondary" size="lg">
              Explore all tools
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {TRUST_BADGES.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {HERO_METRICS.map((item) => (
              <Card key={item.label} className="p-5">
                <p className="text-3xl font-semibold text-[var(--foreground)]">{item.value}</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.label}</p>
              </Card>
            ))}
          </div>
        </div>

        <HeroPreview />
      </section>

      <section id="how-it-works" className="mt-24">
        <div className="max-w-3xl space-y-4">
          <Badge tone="accent">How it works</Badge>
          <h2 className="section-title text-4xl font-semibold">Simple enough for first-time users</h2>
          <p className="section-copy">
            Every workflow is built around the same clear loop: add your source, click once, then copy or download the result. No confusing dashboards and no dead-end screens.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map((step, index) => (
            <Card key={step.title} className="p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Step {index + 1}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="tools" className="mt-24">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <Badge tone="accent">Tool suite</Badge>
            <h2 className="section-title text-4xl font-semibold">Core workflows plus guided humanizer routes</h2>
            <p className="section-copy">
              Toolslify now combines five core workflows with four humanizer intent routes, so users can either browse the suite directly or jump into the exact rewrite path they already came looking for.
            </p>
          </div>
          <Button as={Link} href="/tools" variant="secondary">
            View the suite
          </Button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {coreTools.map((tool) => (
            <Card key={tool.slug} className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <Badge tone="accent">{tool.category}</Badge>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {tool.badge}
                </span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-[var(--foreground)]">{tool.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-[var(--muted-foreground)]">{tool.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {tool.useCases.slice(0, 2).map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
              <Button as={Link} href={tool.path} variant="secondary" className="mt-6 self-start">
                Open tool
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-[36px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(20,184,166,0.08),var(--surface))] p-6 sm:p-8">
          <div className="max-w-3xl space-y-3">
            <Badge tone="accent">Humanizer toolset</Badge>
            <h3 className="text-3xl font-semibold text-[var(--foreground)]">Four search-intent tools built on the flagship humanizer</h3>
            <p className="text-sm leading-8 text-[var(--muted-foreground)]">
              These routes turn high-intent searches like Humanize AI Text, AI Humanizer Free, AI Paraphraser, and Rewrite AI Text into guided product experiences instead of leaving them as content-only pages.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {searchTools.map((tool) => (
              <Card key={tool.slug} className="flex h-full flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <Badge>{tool.category}</Badge>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{tool.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-[var(--muted-foreground)]">{tool.description}</p>
                <Button as={Link} href={tool.path} variant="secondary" className="mt-5 self-start">
                  Open route
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="mt-24 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
        <Card className="overflow-hidden p-7">
          <Badge tone="accent">Built for trust</Badge>
          <h2 className="mt-5 text-4xl font-semibold text-[var(--foreground)]">
            Product-grade UI that feels clear before the first click
          </h2>
          <p className="mt-4 text-sm leading-8 text-[var(--muted-foreground)]">
            Toolslify is designed to feel like a modern SaaS product from the first screen: structured navigation, obvious next steps, polished surfaces, and security cues that reduce hesitation fast.
          </p>
          <div className="mt-8 grid gap-4">
            <TrustRow label="No data stored" value="Requests are processed in memory" />
            <TrustRow label="Dark mode" value="Saved locally for return visits" />
            <TrustRow label="Local history" value="Recent outputs stay on-device" />
            <TrustRow label="Security headers" value="CSP, HSTS, XFO, nosniff" />
          </div>
        </Card>

        <div className="grid gap-5 md:grid-cols-3">
          {USE_CASES.map((item) => (
            <Card key={item.audience} className="p-6">
              <Badge>{item.audience}</Badge>
              <h3 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <div className="max-w-3xl space-y-4">
          <Badge tone="accent">Testimonials</Badge>
          <h2 className="section-title text-4xl font-semibold">Realistic social proof for an instant trust lift</h2>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <Card key={item.name} className="p-6">
              <p className="text-base leading-8 text-[var(--foreground)]">"{item.quote}"</p>
              <div className="mt-5">
                <p className="text-sm font-semibold text-[var(--foreground)]">{item.name}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{item.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="mt-24">
        <div className="max-w-3xl space-y-4">
          <Badge tone="accent">FAQ</Badge>
          <h2 className="section-title text-4xl font-semibold">Questions new users ask before they trust the product</h2>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {HOME_FAQ.map((item) => (
            <Card key={item.question} className="p-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <Card className="overflow-hidden border-[var(--border-strong)] bg-[linear-gradient(135deg,rgba(18,63,116,0.16),rgba(20,184,166,0.12),var(--surface))] p-8 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <Badge tone="accent">Ready to explore</Badge>
              <h2 className="mt-5 text-4xl font-semibold text-[var(--foreground)]">
                Start with the AI Humanizer, then move through the full suite
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-foreground)]">
                Toolslify is set up like a real product platform: clear routes, scalable components, local history, secure defaults, and long-form SEO pages that keep the funnel growing over time.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button as={Link} href="/tools/ai-humanizer" size="lg">
                Start free
              </Button>
              <Button as={Link} href="/tools" variant="secondary" size="lg">
                Browse tools
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function TrustRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3">
      <span className="text-sm text-[var(--muted-foreground)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--foreground)]">{value}</span>
    </div>
  );
}
