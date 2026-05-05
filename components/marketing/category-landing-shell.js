import Link from "next/link";
import { CategoryMark } from "@/components/marketing/category-mark";
import { ToolCard } from "@/components/marketing/tool-card";

export function CategoryLandingShell({ page, siblingPages = [] }) {
  const accent = page.accent || "#5f81be";

  return (
    <div className="page-shell space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-[rgba(18,24,31,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,253,0.96))] px-5 py-8 shadow-[0_30px_72px_-48px_rgba(15,23,42,0.22)] sm:px-7 sm:py-10 lg:px-10">
        <span
          className="pointer-events-none absolute left-0 top-0 h-full w-[6px] rounded-l-[32px]"
          style={{ background: `linear-gradient(180deg, ${accent}, transparent 88%)` }}
        />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <CategoryMark slug={page.slug} accent={accent} className="h-12 w-12 rounded-[18px]" />
              <div>
                <p className="text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[#7c8597]">
                  Focused category
                </p>
                <p className="mt-1 text-[0.78rem] font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>
                  {page.count} live calculators
                </p>
              </div>
            </div>
            <h1 className="max-w-[14ch] text-[clamp(2.4rem,5.4vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#202530]">
              {page.title}
            </h1>
            <p className="max-w-3xl text-[1rem] leading-[1.9] text-[#667085]">
              {page.summary}
            </p>
            <p className="max-w-3xl text-[0.98rem] leading-[1.85] text-[#778195]">
              {page.categoryDescription}
            </p>

            <div className="flex flex-wrap gap-2.5">
              {page.featuredTools.slice(0, 3).map((tool) => (
                <span
                  key={tool.slug}
                  className="inline-flex min-h-[40px] items-center rounded-full border bg-white px-4 py-2 text-sm font-semibold text-[#3a4252]"
                  style={{ borderColor: `color-mix(in srgb, ${accent} 15%, rgba(18,24,31,0.08))` }}
                >
                  {tool.shortName}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/tools"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#11151d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1a202b]"
              >
                Browse all tools
              </Link>
              {page.featuredTools[0] ? (
                <Link
                  href={page.featuredTools[0].path}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(18,24,31,0.08)] bg-white px-5 py-3 text-sm font-semibold text-[#202530] transition hover:border-[rgba(18,24,31,0.14)] hover:bg-[#f8fafc]"
                >
                  Start with {page.featuredTools[0].shortName}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[24px] border bg-white p-5 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.16)]" style={{ borderColor: `color-mix(in srgb, ${accent} 16%, rgba(18,24,31,0.08))` }}>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c8597]">
                Tools in category
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]" style={{ color: accent }}>{page.count}</p>
            </div>
            <div className="rounded-[24px] border bg-white p-5 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.16)]" style={{ borderColor: `color-mix(in srgb, ${accent} 16%, rgba(18,24,31,0.08))` }}>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c8597]">
                Built for
              </p>
              <p className="mt-3 text-base font-semibold text-[#202530]">
                Fast planning checks
              </p>
            </div>
            <div className="rounded-[24px] border bg-white p-5 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.16)]" style={{ borderColor: `color-mix(in srgb, ${accent} 16%, rgba(18,24,31,0.08))` }}>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c8597]">
                Featured tool
              </p>
              <p className="mt-3 text-base font-semibold text-[#202530]">
                {page.featuredTools[0]?.shortName || page.title}
              </p>
            </div>
          </div>
        </div>
      </section>

      {page.featuredTools.length ? (
        <section className="space-y-5">
          <div className="text-center">
            <p className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-[#8a91a2]">
              Start here
            </p>
            <h2 className="mt-3 text-[clamp(1.9rem,3.8vw,2.8rem)] font-semibold tracking-[-0.05em] text-[#202530]">
              Most-used {page.title}
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {page.featuredTools.slice(0, 3).map((tool) => (
              <Link
                key={tool.slug}
                href={tool.path}
                className="rounded-[24px] border border-[rgba(18,24,31,0.08)] bg-white p-5 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:border-[rgba(18,24,31,0.14)]"
              >
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c8597]">
                  Featured tool
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#202530]">{tool.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#667085]">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-[#8a91a2]">
            Full category
          </p>
          <h2 className="mt-3 text-[clamp(1.9rem,3.8vw,2.8rem)] font-semibold tracking-[-0.05em] text-[#202530]">
            All {page.title}
          </h2>
          <p className="mt-3 text-[1rem] leading-[1.8] text-[#6d7588]">
            Browse every tool in this category, then jump into the exact calculator you need.
          </p>
        </div>

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {page.tools.map((tool, index) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              compact
              index={index}
              priority={index < 8}
            />
          ))}
        </div>
      </section>

      {siblingPages.length ? (
        <section className="space-y-5">
          <div className="text-center">
            <p className="text-[0.76rem] font-semibold uppercase tracking-[0.18em] text-[#8a91a2]">
              More categories
            </p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.5rem)] font-semibold tracking-[-0.05em] text-[#202530]">
              Explore the rest of Toolslify
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {siblingPages.map((item) => (
              <Link
                key={item.slug}
                href={item.path}
                className="rounded-[24px] border border-[rgba(18,24,31,0.08)] bg-white p-5 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:border-[rgba(18,24,31,0.14)]"
              >
                <div className="flex items-start gap-3">
                  <CategoryMark slug={item.slug} accent={item.accent} tone="soft" className="h-11 w-11 rounded-[16px]" />
                  <div className="min-w-0">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#7c8597]">
                      Category
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#202530]">{item.title}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#667085]">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
