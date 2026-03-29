import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Humanize AI Text with Better UX, Speed, and SEO",
  description:
    "Use Toolslify to rewrite AI-generated text with a cleaner SaaS workflow, improved readability, local history, compare mode, and strong canonical SEO.",
  alternates: {
    canonical: "/",
  },
};

const benefits = [
  {
    title: "Made for review loops",
    body: "Compare original and rewritten copy side by side, then restore any saved version from local history in one click.",
  },
  {
    title: "Fast, local workflow",
    body: "Autosave keeps your draft in place, keyboard shortcuts keep momentum up, and a focused client path keeps typing responsive.",
  },
  {
    title: "Built to rank cleanly",
    body: "Canonical metadata, robots, sitemap, and a consistent primary domain setup help search engines understand the site correctly.",
  },
];

const faqs = [
  {
    question: "What does Toolslify do?",
    answer: "Toolslify helps you rewrite AI-generated text so it reads more naturally, with controls for tone, rewrite depth, and side-by-side review.",
  },
  {
    question: "Does the tool save my writing history?",
    answer: "Yes. Your most recent five outputs are stored locally in your browser so you can restore a previous version quickly.",
  },
  {
    question: "Can I compare my original text with the rewrite?",
    answer: "Yes. Compare mode displays the original and rewritten content together and highlights changed words in the output panel.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <Badge tone="accent">Professional AI rewrite workflow</Badge>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold leading-none tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
              Turn Toolslify into a product people trust at first glance.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
              Humanize AI writing with a faster editor, more convincing SaaS presentation, and technical SEO foundations that point every signal to the primary domain.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/humanize-ai-free"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent-strong)] px-6 text-sm font-medium text-white shadow-[0_20px_45px_-24px_rgba(15,23,42,0.75)] transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-stronger)]"
            >
              Open Humanize AI Free
            </Link>
            <Link
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-6 text-sm font-medium text-[var(--foreground)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--accent-soft)] hover:bg-[var(--surface-raised)]"
            >
              Explore features
            </Link>
          </div>
        </div>

        <Card className="overflow-hidden border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--surface),var(--surface-elevated))] p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Canonical SEO</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">Primary domain locked</p>
            </div>
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Product UX</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">History, compare mode, autosave</p>
            </div>
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Positioning</p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
                The UI now leans into a sharper SaaS visual system with softer gradients, layered surfaces, sticky navigation, responsive layout hierarchy, and refined states across light and dark themes.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section id="features" className="mt-20 grid gap-5 lg:grid-cols-3">
        {benefits.map((item) => (
          <Card key={item.title} className="p-6">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">{item.body}</p>
          </Card>
        ))}
      </section>

      <section id="why-toolslify" className="mt-20 grid gap-8 rounded-[36px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--surface),var(--surface-elevated))] p-8 lg:grid-cols-[1fr_0.9fr] lg:p-10">
        <div>
          <Badge>Why it converts better</Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            Clear positioning, polished interfaces, and less friction in the rewrite flow.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--muted-foreground)]">
            Visitors get a focused landing page, trust-building UI, and a tool page that feels closer to a modern product than a simple content widget. That combination improves clarity for both users and crawlers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Speed</p>
            <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">Lazy-loaded heavy tool module</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Trust</p>
            <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">Consistent header, footer, and theme system</p>
          </Card>
          <Card className="p-5 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">SEO detail</p>
            <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">Canonical metadata plus sitemap and robots pointed at https://www.toolslify.com</p>
          </Card>
        </div>
      </section>

      <section id="faq" className="mt-20 space-y-5">
        <div className="space-y-3">
          <Badge tone="accent">FAQ</Badge>
          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            Questions people ask before they trust a rewrite tool.
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {faqs.map((item) => (
            <Card key={item.question} className="p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{item.answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

