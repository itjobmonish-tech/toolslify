import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const HumanizerExperience = dynamic(() => import("@/components/humanizer-experience"), {
  loading: () => (
    <Card className="p-8">
      <div className="space-y-4">
        <div className="h-5 w-32 rounded-full bg-[var(--accent-faint)]" />
        <div className="h-10 w-2/3 rounded-full bg-[var(--accent-faint)]" />
        <div className="h-40 rounded-[28px] bg-[var(--surface-elevated)]" />
      </div>
    </Card>
  ),
});

export const metadata = {
  title: "Humanize AI Free",
  description:
    "Humanize AI text with tone controls, rewrite strength, compare mode, local history, autosave, and canonical SEO under the primary Toolslify domain.",
  alternates: {
    canonical: "/humanize-ai-free",
  },
  openGraph: {
    title: "Humanize AI Free | Toolslify",
    description:
      "Rewrite AI-generated content into more natural copy with a polished interface, compare mode, and conversion-ready UX.",
    url: "https://www.toolslify.com/humanize-ai-free",
  },
};

const toolHighlights = [
  "Word count and character count that update live.",
  "Basic readability scoring with a clear label.",
  "Friendly, formal, and casual tone controls.",
  "Low, medium, and high rewrite strength presets.",
  "Copy, clear, download, compare mode, and autosave.",
  "Recent history stored locally for quick restore.",
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does Humanize AI Free do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Humanize AI Free rewrites AI-generated text into more natural language with tone controls, rewrite strength, compare mode, and local history.",
      },
    },
    {
      "@type": "Question",
      name: "Does Humanize AI Free save my text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool auto-saves the current input and recent outputs locally in your browser so you can recover work without creating an account.",
      },
    },
  ],
};

export default function HumanizeAIFreePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="mb-10 flex flex-col gap-5">
        <Badge tone="accent">Free AI humanizer</Badge>
        <div className="max-w-4xl space-y-4">
          <h1 className="text-5xl font-semibold leading-none tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl">
            Humanize AI text without sacrificing clarity, speed, or trust.
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Toolslify gives you a more polished rewrite workflow with live metrics, stronger review controls, and a cleaner interface that feels like a real product, not a lightweight content toy.
          </p>
        </div>
      </section>

      <HumanizerExperience />

      <section className="mt-16 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <p className="text-sm font-semibold text-[var(--foreground)]">What’s included</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
            {toolHighlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[var(--accent-strong)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold text-[var(--foreground)]">Why this page is better for SEO</p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--muted-foreground)]">
            <p>
              The route is published with its own metadata, canonical path, and primary domain configuration so search engines can index it as a distinct destination without mixed-domain ambiguity.
            </p>
            <p>
              The layout also points global metadata to https://www.toolslify.com, while robots and sitemap reinforce the same source of truth for crawling and canonicalization.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}

