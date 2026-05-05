import Link from "next/link";
import { ToolSidebarLists } from "@/components/marketing/tool-sidebar-lists";
import { Card } from "@/components/ui/card";
import { getCategoryPagePath } from "@/lib/site-data";

export function ToolStudioSidebar({ tool, popularTools, relatedTools, categoryTools }) {
  const theme = tool.interior?.theme;
  const sections = [
    popularTools.length
      ? {
          title: "Popular tools",
          items: popularTools.map((item) => ({
            label: item.shortName,
            href: item.path,
          })),
        }
      : null,
    relatedTools.length
      ? {
          title: "Related tools",
          items: relatedTools.map((item) => ({
            label: item.shortName,
            href: item.path,
          })),
        }
      : null,
    categoryTools.length
      ? {
          title: `More ${tool.category}`,
          items: categoryTools.map((item) => ({
            label: item.shortName,
            href: item.path,
          })),
        }
      : null,
  ].filter(Boolean);

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <Card className="overflow-hidden rounded-[24px] border-[rgba(18,24,31,0.08)] bg-white/96 p-4 shadow-[0_22px_40px_-36px_rgba(15,23,42,0.14)]">
        <div className="space-y-4">
          <div className="rounded-[18px] border px-4 py-4" style={{ borderColor: theme?.edge || "rgba(18,24,31,0.08)", background: theme?.surface || "#fbfcfe" }}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Workspace
                </p>
                <p className="text-sm font-semibold text-[var(--foreground)]">{tool.name}</p>
                <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                  Search, switch tools, or jump deeper into the same category.
                </p>
              </div>
              <span
                className="inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-xs font-semibold text-white"
                style={{
                  background: theme?.primary || tool.categoryColor,
                }}
              >
                {tool.shortName}
              </span>
            </div>
          </div>

          <form action="/tools" className="flex items-center gap-2 rounded-[18px] border border-[rgba(18,24,31,0.08)] bg-white p-2 shadow-[0_14px_24px_-24px_rgba(15,23,42,0.1)]">
            <input
              type="search"
              name="query"
              placeholder="Search Toolslify tools"
              className="h-11 w-full rounded-[14px] border-0 bg-transparent px-3 text-sm font-medium text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            />
            <button
              type="submit"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-[rgba(18,24,31,0.08)] bg-[#f5f7fa] text-[var(--foreground)] transition hover:border-[var(--primary-edge)] hover:text-[var(--primary)]"
              aria-label="Search tools"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </form>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <Link href="/tools" className="quick-tool-chip">
              Browse all tools
            </Link>
            <Link href={getCategoryPagePath(tool.categorySlug)} className="quick-tool-chip">
              More {tool.category}
            </Link>
          </div>

          <div className="rounded-[18px] border border-[rgba(18,24,31,0.08)] bg-[#fbfcfe]">
            {tool.heroStats.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 border-b border-[rgba(18,24,31,0.06)] px-4 py-3 last:border-b-0"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-[var(--foreground)]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {sections.length ? <ToolSidebarLists sections={sections} /> : null}
    </aside>
  );
}
