"use client";

import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslatedValues } from "@/lib/runtime-localization";
import { getAllTools, getPopularTools, getToolCategoryCollections } from "@/lib/site-data";
import { getLocalizedCategoryTitle } from "@/lib/tool-categories";

export function SiteFooter() {
  const { text } = usePreferences();
  const popularTools = getPopularTools().slice(0, 5);
  const categories = getToolCategoryCollections();
  const latestTools = getAllTools().slice(0, 5);
  const translatedCopy = useTranslatedValues([
    "Fast browser calculators for salary, mortgage, taxes, city costs, home projects, health, math, time, conversions, cooking, and everyday planning.",
    "Popular tools",
    "Site",
    "Calculators",
    "About",
    "Contact",
    "Editorial policy",
    "Accuracy disclaimer",
    "No account required for the core tools.",
    "Built for quick checks and practical planning.",
    ...popularTools.map((tool) => tool.shortName),
    ...latestTools.map((tool) => tool.name),
  ]);
  const translatedCallout = useTranslatedValues([
    "Useful calculators for work, home, money, and health",
    "Toolslify keeps salary tools, city comparisons, mortgage planners, tax calculators, body metrics, material estimates, time math, conversions, and everyday planning in one clean browser product.",
    "Browse tools",
  ]);
  const translatedPopularTools = translatedCopy.slice(10, 10 + popularTools.length);
  const translatedLatestTools = translatedCopy.slice(10 + popularTools.length);

  return (
    <footer className="border-t border-[var(--border)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_96%,white),var(--background))]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[30px] border border-[rgba(18,24,31,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(246,248,252,0.96))] p-6 shadow-[0_26px_60px_-44px_rgba(15,23,42,0.22)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Practical online tools
              </p>
              <h2 className="mt-3 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                {translatedCallout[0]}
              </h2>
              <p className="mt-3 text-[0.98rem] leading-8 text-[var(--muted-foreground)]">
                {translatedCallout[1]}
              </p>
            </div>

            <Link
              href="/tools"
              className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-[#11151d] px-5 py-3 text-sm font-semibold text-white shadow-[0_22px_40px_-26px_rgba(15,23,42,0.34)] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#1a202b]"
            >
              {translatedCallout[2]}
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <BrandMark />
            <p className="max-w-sm text-sm leading-8 text-[var(--muted-foreground)]">
              {translatedCopy[0]}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              {text.categories}
            </p>
            <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={category.pagePath}
                  className="block rounded-[14px] border border-transparent px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--background-strong)] hover:text-[var(--primary)]"
                >
                  {getLocalizedCategoryTitle(category.slug, text, category.title)}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              {translatedCopy[1]}
            </p>
            <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
              {popularTools.map((tool, index) => (
                <Link
                  key={tool.slug}
                  href={tool.path}
                  className="block rounded-[14px] border border-transparent px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--background-strong)] hover:text-[var(--primary)]"
                >
                  {translatedPopularTools[index] || tool.shortName}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              {translatedCopy[2]}
            </p>
            <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <Link href="/" className="block rounded-[14px] border border-transparent px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--background-strong)] hover:text-[var(--primary)]">
                {text.home}
              </Link>
              <Link href="/tools" className="block rounded-[14px] border border-transparent px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--background-strong)] hover:text-[var(--primary)]">
                {translatedCopy[3]}
              </Link>
              <Link href="/about" className="block rounded-[14px] border border-transparent px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--background-strong)] hover:text-[var(--primary)]">
                {translatedCopy[4]}
              </Link>
              <Link href="/contact" className="block rounded-[14px] border border-transparent px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--background-strong)] hover:text-[var(--primary)]">
                {translatedCopy[5]}
              </Link>
              <Link href="/editorial-policy" className="block rounded-[14px] border border-transparent px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--background-strong)] hover:text-[var(--primary)]">
                {translatedCopy[6]}
              </Link>
              <Link href="/accuracy-disclaimer" className="block rounded-[14px] border border-transparent px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--background-strong)] hover:text-[var(--primary)]">
                {translatedCopy[7]}
              </Link>
              <Link href="/privacy" className="block rounded-[14px] border border-transparent px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--background-strong)] hover:text-[var(--primary)]">
                {text.privacy}
              </Link>
              <Link href="/terms" className="block rounded-[14px] border border-transparent px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--background-strong)] hover:text-[var(--primary)]">
                {text.terms}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-3 rounded-[28px] border border-[var(--border)] bg-[var(--background-strong)] p-5 shadow-[var(--shadow-soft)] lg:grid-cols-5">
          {latestTools.map((tool, index) => (
            <Link key={tool.slug} href={tool.path} className="rounded-[18px] border border-[var(--border)] bg-[var(--background-strong)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--primary)] hover:shadow-[var(--shadow-soft)]">
              {translatedLatestTools[index] || tool.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--border)] pt-5 text-xs text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <p>{translatedCopy[8]}</p>
          <p>{translatedCopy[9]}</p>
        </div>
      </div>
    </footer>
  );
}
