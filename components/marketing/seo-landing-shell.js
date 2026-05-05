"use client";

import Link from "next/link";
import { LanguageAvailability } from "@/components/marketing/language-availability";
import { SeoPageHero } from "@/components/marketing/seo-page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslatedValues } from "@/lib/runtime-localization";

export function SeoLandingShell({ page }) {
  const translatedPageFields = useTranslatedValues([
    page.heroTitle,
    page.description,
    page.searchPhrase,
    page.audience,
    page.exampleBefore,
    page.exampleAfter,
    page.ctaTitle,
    page.promise,
    ...page.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
    ...page.internalLinks.map((item) => item.label),
    ...page.faq.flatMap((item) => [item.question, item.answer]),
    ...page.useCases,
    "Related tools",
    "Move from research into action",
    "These links help you move from the guide into the live calculator or a closely related tool.",
    "FAQ",
    "Frequently asked questions",
    "Next step",
    "This guide explains the intent clearly. The live product keeps the next step simple: add your source, run the tool, review the result, and export it when it looks right.",
    "Start free",
    "View all tools",
    "Quick read",
    "Search phrase:",
    "Audience:",
    "Promise:",
    "Best uses",
  ]);

  const translatedPage = {
    ...page,
    heroTitle: translatedPageFields[0] || page.heroTitle,
    description: translatedPageFields[1] || page.description,
    searchPhrase: translatedPageFields[2] || page.searchPhrase,
    audience: translatedPageFields[3] || page.audience,
    exampleBefore: translatedPageFields[4] || page.exampleBefore,
    exampleAfter: translatedPageFields[5] || page.exampleAfter,
    ctaTitle: translatedPageFields[6] || page.ctaTitle,
    promise: translatedPageFields[7] || page.promise,
  };

  const sectionsStart = 8;
  const internalLinksStart = sectionsStart + page.sections.reduce((total, section) => total + 1 + section.paragraphs.length, 0);
  const faqStart = internalLinksStart + page.internalLinks.length;
  const useCasesStart = faqStart + page.faq.length * 2;
  const literalStart = useCasesStart + page.useCases.length;

  return (
    <div className="page-shell space-y-16">
      <section>
        <SeoPageHero page={translatedPage} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <article className="space-y-6">
          {page.sections.map((section, index) => {
            const sectionOffset = page.sections
              .slice(0, index)
              .reduce((total, item) => total + 1 + item.paragraphs.length, 0);
            const headingIndex = sectionsStart + sectionOffset;

            return (
              <Card key={section.heading} className="p-6 sm:p-7">
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {translatedPageFields[headingIndex] || section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraph} className="text-sm leading-8 text-[var(--muted-foreground)]">
                      {translatedPageFields[headingIndex + paragraphIndex + 1] || paragraph}
                    </p>
                  ))}
                </div>
              </Card>
            );
          })}

          <Card className="p-6 sm:p-7">
            <Badge tone="accent">{translatedPageFields[literalStart] || "Related tools"}</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              {translatedPageFields[literalStart + 1] || "Move from research into action"}
            </h2>
            <p className="mt-3 text-sm leading-8 text-[var(--muted-foreground)]">
              {translatedPageFields[literalStart + 2] ||
                "These links help you move from the guide into the live calculator or a closely related tool."}
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {page.internalLinks.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-edge)]"
                >
                  {translatedPageFields[internalLinksStart + index] || item.label}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-6 sm:p-7">
            <Badge tone="accent">{translatedPageFields[literalStart + 3] || "FAQ"}</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              {translatedPageFields[literalStart + 4] || "Frequently asked questions"}
            </h2>
            <div className="mt-5 grid gap-5">
              {page.faq.map((item, index) => {
                const offset = faqStart + index * 2;
                return (
                  <Card key={item.question} className="p-6">
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">
                      {translatedPageFields[offset] || item.question}
                    </h3>
                    <p className="mt-3 text-sm leading-8 text-[var(--muted-foreground)]">
                      {translatedPageFields[offset + 1] || item.answer}
                    </p>
                  </Card>
                );
              })}
            </div>
          </Card>

          <Card className="border-[var(--primary-edge)] p-6 sm:p-8">
            <Badge tone="accent">{translatedPageFields[literalStart + 5] || "Next step"}</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              {translatedPage.ctaTitle}
            </h2>
            <p className="mt-3 text-base leading-8 text-[var(--muted-foreground)]">
              {translatedPageFields[literalStart + 6] ||
                "This guide explains the intent clearly. The live product keeps the next step simple: add your source, run the tool, review the result, and export it when it looks right."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button as={Link} href={page.ctaHref}>
                {translatedPageFields[literalStart + 7] || "Start free"}
              </Button>
              <Button as={Link} href="/tools" variant="secondary">
                {translatedPageFields[literalStart + 8] || "View all tools"}
              </Button>
            </div>
          </Card>
        </article>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <LanguageAvailability />
          </Card>

          <Card className="p-6">
            <Badge tone="accent">{translatedPageFields[literalStart + 9] || "Quick read"}</Badge>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>{translatedPageFields[literalStart + 10] || "Search phrase:"} {translatedPage.searchPhrase}</p>
              <p>{translatedPageFields[literalStart + 11] || "Audience:"} {translatedPage.audience}</p>
              <p>{translatedPageFields[literalStart + 12] || "Promise:"} {translatedPage.promise}</p>
            </div>
          </Card>

          <Card className="p-6">
            <Badge tone="accent">{translatedPageFields[literalStart + 13] || "Best uses"}</Badge>
            <div className="mt-4 space-y-3">
              {page.useCases.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-7 text-[var(--foreground)]"
                >
                  {translatedPageFields[useCasesStart + index] || item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
