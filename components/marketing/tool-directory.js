"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePreferences } from "@/components/providers/preferences-provider";
import { CategoryMark } from "@/components/marketing/category-mark";
import { ToolCard } from "@/components/marketing/tool-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HERO_METRICS, TRUST_BADGES } from "@/lib/site-data";
import { useTranslatedValue, useTranslatedValues } from "@/lib/runtime-localization";
import { getLocalizedCategoryTitle } from "@/lib/tool-categories";
import { cn, formatNumber } from "@/lib/utils";

const ALL_CATEGORY = "all";

export function ToolDirectory({
  displayTools,
  quickAccessTools,
  popularTools,
  categoryCollections,
  heading,
  description,
  initialQuery = "",
  activeCategory = "",
  pagination = null,
  showIntro = false,
  directoryPath = "/tools",
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { text, t } = usePreferences();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const singleCategoryMode = categoryCollections.length <= 1;
  const resolvedCategory = activeCategory || "";
  const activeCategoryCollection = useMemo(
    () => categoryCollections.find((category) => category.slug === resolvedCategory) || null,
    [categoryCollections, resolvedCategory],
  );
  const [translatedDescription, noResultsDescription, catalogLabel] = useTranslatedValues([
    description || "",
    "Try a broader term or clear the search to browse the full catalog again.",
    "Tool directory",
  ]);
  const introLiterals = useTranslatedValues([
    heading || "",
    description || "",
    "Free browser tools",
    "Practical calculators for money, health, home, time, and everyday math",
    "Run salary, mortgage, tax, home project, health, math, time, cooking, conversion, and everyday calculations without switching tabs.",
    "Browse tools",
    "Explore categories",
    "Start here",
    "Category",
    "Useful tools for common decisions",
    "Search the toolkit",
    "Popular tool",
    "Browse full directory",
    "Browse by category",
    "Popular calculators",
    "A short list of tools people use most often, with the full directory below.",
    "Search",
    "Page",
    "Previous",
    "Next",
  ]);
  const translatedTrustBadges = useTranslatedValues(TRUST_BADGES);
  const translatedMetricLabels = useTranslatedValues(HERO_METRICS.map((item) => item.label || ""));
  const toolCardTranslations = useTranslatedValues(
    displayTools.flatMap((tool) => [tool.name, tool.shortName, tool.description, tool.category]),
  );
  const translatedDisplayTools = displayTools.map((tool, index) => {
    const offset = index * 4;
    return {
      ...tool,
      name: toolCardTranslations[offset] || tool.name,
      shortName: toolCardTranslations[offset + 1] || tool.shortName,
      description: toolCardTranslations[offset + 2] || tool.description,
      category: toolCardTranslations[offset + 3] || tool.category,
    };
  });
  const quickToolTranslations = useTranslatedValues(
    quickAccessTools.flatMap((tool) => [tool.name, tool.shortName, tool.category]),
  );
  const translatedQuickTools = quickAccessTools.map((tool, index) => {
    const offset = index * 3;
    return {
      ...tool,
      name: quickToolTranslations[offset] || tool.name,
      shortName: quickToolTranslations[offset + 1] || tool.shortName,
      category: quickToolTranslations[offset + 2] || tool.category,
    };
  });
  const translatedPopularTools = useTranslatedValues(
    popularTools.flatMap((tool) => [tool.name, tool.shortName, tool.description, tool.category]),
  );
  const translatedHeroTools = popularTools.map((tool, index) => {
    const offset = index * 4;
    return {
      ...tool,
      name: translatedPopularTools[offset] || tool.name,
      shortName: translatedPopularTools[offset + 1] || tool.shortName,
      description: translatedPopularTools[offset + 2] || tool.description,
      category: translatedPopularTools[offset + 3] || tool.category,
    };
  });
  const heroCategoryCards = categoryCollections.map((category) => ({
    ...category,
    localizedTitle: getLocalizedCategoryTitle(category.slug, text, category.title),
  }));
  const defaultDescription = description ? translatedDescription || description : text.toolDirectoryDescription;
  const noResultsTitle = useTranslatedValue("No tools matched that search");
  const resultSummary = pagination
    ? resolvedCategory
      ? `${getLocalizedCategoryTitle(resolvedCategory, text, activeCategoryCollection?.title || resolvedCategory)} - ${t("toolsCount", { count: formatNumber(pagination.totalCount) })}`
      : t("toolsCount", { count: formatNumber(pagination.totalCount) })
    : t("toolsCount", { count: formatNumber(translatedDisplayTools.length) });
  const catalogHeading = activeCategoryCollection
    ? getLocalizedCategoryTitle(activeCategoryCollection.slug, text, activeCategoryCollection.title)
    : singleCategoryMode
      ? "Calculators"
      : text.allTools;
  const catalogDescription = initialQuery || resolvedCategory ? resultSummary : defaultDescription;
  const homePopularHeading = showIntro ? introLiterals[14] : catalogHeading;
  const homePopularDescription = showIntro ? introLiterals[15] : catalogDescription;
  const revealUp = reduceMotion
    ? { initial: { opacity: 1, y: 0 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }
    : {
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      };
  const revealSoft = reduceMotion
    ? { initial: { opacity: 1, scale: 1 }, whileInView: { opacity: 1, scale: 1 }, transition: { duration: 0.2 } }
    : {
        initial: { opacity: 0, scale: 0.985 },
        whileInView: { opacity: 1, scale: 1 },
        transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
      };
  const introHeading = introLiterals[0] || heading || introLiterals[3];
  const introDescription = introLiterals[1] || description || introLiterals[4];
  const pageNumbers = pagination ? getVisiblePageNumbers(pagination.currentPage, pagination.totalPages) : [];

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const href = buildDirectoryHref({
      path: directoryPath,
      query,
      category: resolvedCategory,
      page: 1,
    });

    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <div className="space-y-8 lg:space-y-12">
      {showIntro ? (
        <>
          <motion.section
            viewport={{ once: true, margin: "-80px" }}
            {...revealSoft}
            className="relative overflow-hidden rounded-[26px] border border-[rgba(18,24,31,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,253,0.96))] px-4 py-8 shadow-[0_34px_80px_-52px_rgba(15,23,42,0.22)] sm:rounded-[34px] sm:px-6 sm:py-10 lg:px-10 lg:py-12"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(95,129,190,0.08),transparent_18%),radial-gradient(circle_at_84%_20%,rgba(179,64,46,0.08),transparent_16%),linear-gradient(180deg,rgba(255,255,255,0.14),transparent_30%)]" />

            <div className="relative mx-auto max-w-6xl space-y-8">
              <div className="flex justify-center">
                <div className="inline-flex rounded-full border border-[rgba(18,24,31,0.08)] bg-white px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#6b7283] shadow-[0_14px_28px_-24px_rgba(15,23,42,0.14)]">
                  {introLiterals[2]}
                </div>
              </div>

              <div className="mx-auto max-w-5xl space-y-4 text-center">
                <h1 className="mx-auto max-w-[12ch] break-words text-[clamp(2.1rem,11vw,4.7rem)] font-semibold leading-[0.98] text-[#202530] sm:leading-[0.94]">
                  {introHeading}
                </h1>
                <p className="mx-auto max-w-3xl text-[1rem] leading-[1.85] text-[#6b7384] sm:text-[1.04rem]">
                  {introDescription}
                </p>
              </div>

              <form
                onSubmit={handleSearchSubmit}
                className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-[24px] border border-[rgba(18,24,31,0.08)] bg-white p-3 shadow-[0_22px_44px_-34px_rgba(15,23,42,0.18)] sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 px-2 sm:px-3">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-[#7c8597]">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={introLiterals[10] || text.searchTools}
                    className="h-11 w-full border-0 bg-transparent text-[0.98rem] font-medium text-[#2d313d] outline-none placeholder:text-[#8a91a2]"
                    aria-label={introLiterals[10] || text.searchTools}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-[#2587de] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1979cf] disabled:opacity-70"
                  disabled={isPending}
                >
                  {introLiterals[16]}
                </button>
              </form>

              <div className="flex flex-wrap justify-center gap-2.5">
                {translatedTrustBadges.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(18,24,31,0.08)] bg-white/82 px-4 py-2 text-sm font-semibold text-[#4d5668]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <QuickStartGrid tools={translatedQuickTools.slice(0, 8)} label={introLiterals[7]} />

              <div className="grid gap-3 rounded-[26px] border border-[rgba(18,24,31,0.06)] bg-[#eef5fc] p-4 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[rgba(18,24,31,0.1)]">
                {HERO_METRICS.map((metric, index) => (
                  <div key={metric.label} className="flex items-center justify-center gap-3 px-3 py-3 text-center sm:text-left">
                    <p className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[#2587de]">
                      {metric.value}
                    </p>
                    <p className="text-sm leading-5 text-[#5f6b80]">
                      {translatedMetricLabels[index] || metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <section className="space-y-6">
            <motion.div
              viewport={{ once: true, margin: "-80px" }}
              {...revealUp}
              className="mx-auto max-w-3xl px-1 text-center"
            >
              <p className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-[#8a91a2]">
                {introLiterals[6]}
              </p>
              <h2 className="mt-3 text-[clamp(1.9rem,3.8vw,2.65rem)] font-semibold tracking-[-0.05em] text-[#202530]">
                {introLiterals[13]}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-[1rem] leading-[1.8] text-[#6d7588]">
                {introLiterals[9]}
              </p>
            </motion.div>

            <CategoryCardsGrid categories={heroCategoryCards} featuredLabel={introLiterals[11]} />
          </section>

          <section id="popular-tools" className="space-y-8 pt-2">
            <motion.div
              viewport={{ once: true, margin: "-80px" }}
              {...revealUp}
              className="mx-auto max-w-3xl px-1 text-center"
            >
              <p className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-[#8a91a2]">
                {catalogLabel}
              </p>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.05em] text-[#202530]">
                {homePopularHeading}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-[1rem] leading-[1.8] text-[#6d7588]">
                {homePopularDescription}
              </p>
            </motion.div>

            {translatedDisplayTools.length ? (
              <>
                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {translatedDisplayTools.map((tool, index) => (
                    <ToolCard key={tool.slug} tool={tool} compact index={index} priority={index < 10} />
                  ))}
                </div>
                <div className="flex justify-center">
                  <Link
                    href={directoryPath}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-[14px] border border-[#2587de] bg-white px-6 py-3 text-sm font-semibold text-[#2587de] transition hover:bg-[#f5faff]"
                  >
                    {introLiterals[12]}
                  </Link>
                </div>
              </>
            ) : (
              <Card className="rounded-[24px] border-dashed border-[#dfe3eb] bg-white p-10 text-center shadow-none">
                <p className="text-lg font-semibold text-[#343741]">{noResultsTitle}</p>
                <p className="mt-3 text-[0.98rem] leading-7 text-[#71778a]">
                  {noResultsDescription}
                </p>
              </Card>
            )}
          </section>
        </>
      ) : (
        <>
          <motion.section
            viewport={{ once: true, margin: "-80px" }}
            {...revealSoft}
            transition={{ ...revealSoft.transition, delay: reduceMotion ? 0 : 0.08 }}
            className="rounded-[28px] border border-[#dde2eb] bg-[rgba(255,255,255,0.94)] p-3 shadow-[0_16px_34px_-30px_rgba(35,40,55,0.12)] backdrop-blur sm:p-4"
          >
            <div className="flex flex-col gap-4">
              {!singleCategoryMode ? (
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={buildDirectoryHref({ path: directoryPath, query: initialQuery, category: "", page: 1 })}
                    className={cn(
                      "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                      !resolvedCategory
                        ? "border-[#c96c5a] bg-[#b3402e] text-white shadow-[0_16px_30px_-24px_rgba(179,64,46,0.34)]"
                        : "border-[#dde2eb] bg-white text-[#586173] hover:border-[#cfd6e2] hover:text-[#2d313d]",
                    )}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-current opacity-80" />
                    {text.all}
                  </Link>

                  {categoryCollections.map((category) => {
                    const active = resolvedCategory === category.slug;

                    return (
                      <Link
                        key={category.slug}
                        href={buildDirectoryHref({ path: directoryPath, query: initialQuery, category: category.slug, page: 1 })}
                        className={cn(
                          "inline-flex min-h-[44px] items-center gap-2.5 rounded-full border px-3.5 py-2.5 text-sm font-semibold transition",
                          active
                            ? "text-white shadow-[0_16px_30px_-24px_rgba(35,40,55,0.28)]"
                            : "border-[#dde2eb] bg-white text-[#586173] hover:border-[#cfd6e2] hover:text-[#2d313d]",
                        )}
                        style={active ? { borderColor: category.accent, background: `linear-gradient(135deg, ${category.accent || "#5f81be"}, ${category.accent || "#5f81be"}dd)` } : undefined}
                      >
                        <CategoryMark
                          slug={category.slug}
                          accent={category.accent}
                          tone={active ? "solid" : "soft"}
                          className="h-7 w-7 shrink-0 rounded-[11px] border-0 shadow-none"
                        />
                        {getLocalizedCategoryTitle(category.slug, text, category.title)}
                      </Link>
                    );
                  })}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex min-h-[54px] w-full items-center gap-3 rounded-[18px] border border-[#dde2eb] bg-white px-4 shadow-[0_14px_24px_-24px_rgba(35,40,55,0.1)] transition focus-within:border-[#c96c5a] focus-within:shadow-[0_18px_34px_-24px_rgba(201,108,90,0.18)] lg:max-w-xl"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[#8a91a2]">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={text.searchTools}
                    className="h-full w-full border-0 bg-transparent text-sm font-medium text-[#2d313d] outline-none placeholder:text-[#8a91a2]"
                    aria-label={text.searchTools}
                  />
                  <button type="submit" className="sr-only">
                    {introLiterals[16]}
                  </button>
                </form>

                <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
                  <p className="text-sm font-medium text-[#70788b]">{resultSummary}</p>
                  {(initialQuery || resolvedCategory) ? (
                    <Link
                      href={buildDirectoryHref({ path: directoryPath, query: "", category: "", page: 1 })}
                      className="inline-flex min-h-[42px] items-center rounded-full border border-[#dde2eb] bg-white px-4 py-2 text-sm font-semibold text-[#2d313d] transition hover:border-[#cfd6e2] hover:shadow-[0_14px_26px_-24px_rgba(35,40,55,0.14)]"
                    >
                      {text.clearSearch}
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.section>

          <section className="space-y-10 pt-2">
            <motion.div
              viewport={{ once: true, margin: "-80px" }}
              {...revealUp}
              className="mx-auto max-w-3xl px-1 text-center"
            >
              <p className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-[#8a91a2]">
                {catalogLabel}
              </p>
              <h2 className="mt-3 text-[clamp(1.9rem,3.8vw,2.65rem)] font-semibold tracking-[-0.05em] text-[#2d313d]">
                {catalogHeading}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-[1rem] leading-[1.8] text-[#6d7588]">
                {catalogDescription}
              </p>
            </motion.div>

            {translatedDisplayTools.length ? (
              <>
                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {translatedDisplayTools.map((tool, index) => (
                    <ToolCard key={tool.slug} tool={tool} compact index={index} priority={index < 10} />
                  ))}
                </div>

                {pagination ? (
                  <nav className="flex flex-wrap items-center justify-center gap-2">
                    <Link
                      href={buildDirectoryHref({
                        path: directoryPath,
                        query: initialQuery,
                        category: resolvedCategory,
                        page: Math.max(1, pagination.currentPage - 1),
                      })}
                      aria-disabled={pagination.currentPage <= 1}
                      className={cn(
                        "inline-flex min-h-[42px] items-center rounded-full border px-4 py-2 text-sm font-semibold transition",
                        pagination.currentPage <= 1
                          ? "pointer-events-none border-[#e5e7eb] bg-[#f8fafc] text-[#9aa3b2]"
                          : "border-[#dde2eb] bg-white text-[#2d313d] hover:border-[#cfd6e2]",
                      )}
                    >
                      {introLiterals[18]}
                    </Link>

                    {pageNumbers.map((pageNumber) => (
                      <Link
                        key={pageNumber}
                        href={buildDirectoryHref({
                          path: directoryPath,
                          query: initialQuery,
                          category: resolvedCategory,
                          page: pageNumber,
                        })}
                        className={cn(
                          "inline-flex h-10 min-w-[40px] items-center justify-center rounded-full border px-3 text-sm font-semibold transition",
                          pageNumber === pagination.currentPage
                            ? "border-[#c96c5a] bg-[#b3402e] text-white"
                            : "border-[#dde2eb] bg-white text-[#586173] hover:border-[#cfd6e2] hover:text-[#2d313d]",
                        )}
                      >
                        {pageNumber}
                      </Link>
                    ))}

                    <Link
                      href={buildDirectoryHref({
                        path: directoryPath,
                        query: initialQuery,
                        category: resolvedCategory,
                        page: Math.min(pagination.totalPages, pagination.currentPage + 1),
                      })}
                      aria-disabled={pagination.currentPage >= pagination.totalPages}
                      className={cn(
                        "inline-flex min-h-[42px] items-center rounded-full border px-4 py-2 text-sm font-semibold transition",
                        pagination.currentPage >= pagination.totalPages
                          ? "pointer-events-none border-[#e5e7eb] bg-[#f8fafc] text-[#9aa3b2]"
                          : "border-[#dde2eb] bg-white text-[#2d313d] hover:border-[#cfd6e2]",
                      )}
                    >
                      {introLiterals[19]}
                    </Link>
                  </nav>
                ) : null}
              </>
            ) : (
              <Card className="rounded-[24px] border-dashed border-[#dfe3eb] bg-white p-10 text-center shadow-none">
                <p className="text-lg font-semibold text-[#343741]">{noResultsTitle}</p>
                <p className="mt-3 text-[0.98rem] leading-7 text-[#71778a]">
                  {noResultsDescription}
                </p>
                <div className="mt-5">
                  <Button as={Link} href={buildDirectoryHref({ path: directoryPath, query: "", category: "", page: 1 })} size="sm">
                    {text.clearSearch}
                  </Button>
                </div>
              </Card>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function QuickStartGrid({ tools, label }) {
  if (!tools.length) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tools.map((tool) => (
        <Link
          key={tool.slug}
          href={tool.path}
          className="group flex min-h-[118px] min-w-0 flex-col justify-between overflow-hidden rounded-[20px] border border-[rgba(18,24,31,0.08)] bg-white/90 p-4 text-left shadow-[0_16px_30px_-26px_rgba(15,23,42,0.16)] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(18,24,31,0.16)] hover:bg-white hover:shadow-[0_22px_40px_-28px_rgba(15,23,42,0.2)]"
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-[13px] border text-sm font-bold text-white"
              style={{
                background: tool.categoryColor || "#2587de",
                borderColor: `${tool.categoryColor || "#2587de"}22`,
              }}
            >
              {tool.shortName?.slice(0, 1) || tool.name.slice(0, 1)}
            </span>
            <span className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#8a91a2]">
              {label}
            </span>
          </div>
          <div className="mt-4 min-w-0">
            <p className="text-[1rem] font-semibold tracking-[-0.03em] text-[#202530]">
              {tool.shortName || tool.name}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#667085]">
              {tool.category}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function CategoryCardsGrid({ categories, featuredLabel }) {
  if (!categories.length) return null;

  return (
    <div className="rounded-[30px] border border-[rgba(18,24,31,0.06)] bg-[linear-gradient(180deg,#fbfcfe,#f4f7fb)] p-4 shadow-[0_24px_48px_-40px_rgba(15,23,42,0.16)] sm:p-6">
      <div className={cn("grid gap-4", categories.length === 1 ? "mx-auto max-w-xs" : "sm:grid-cols-2 xl:grid-cols-4")}>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={category.pagePath || `/tools?category=${category.slug}`}
            className="group flex min-h-[210px] flex-col items-center justify-center rounded-[18px] border border-[rgba(18,24,31,0.11)] bg-white px-5 py-6 text-center shadow-[0_16px_32px_-28px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(18,24,31,0.18)] hover:shadow-[0_20px_38px_-26px_rgba(15,23,42,0.16)]"
          >
            <CategoryMark
              slug={category.slug}
              accent={category.accent}
              tone="soft"
              className="h-14 w-14 rounded-[18px] border border-[rgba(18,24,31,0.06)] shadow-none"
            />
            <h3 className="mt-5 text-[1.45rem] font-semibold tracking-[-0.04em] text-[#202530]">
              {category.localizedTitle}
            </h3>
            <p className="mt-3 text-[0.95rem] font-medium text-[#6f7789]">
              {formatNumber(category.count)} calculators
            </p>
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#8b93a5]">
              {category.featuredTool?.shortName || category.featuredTool?.name || featuredLabel}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getVisiblePageNumbers(currentPage, totalPages) {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pages = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

function buildDirectoryHref({ path, query = "", category = "", page = 1 }) {
  const searchParams = new URLSearchParams();

  if (query.trim()) {
    searchParams.set("query", query.trim());
  }

  if (category) {
    searchParams.set("category", category);
  }

  if (page > 1) {
    searchParams.set("page", String(page));
  }

  const serialized = searchParams.toString();
  return serialized ? `${path}?${serialized}` : path;
}
