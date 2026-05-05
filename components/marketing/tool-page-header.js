"use client";

import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslatedValues } from "@/lib/runtime-localization";
import { getLocalizedCategoryTitle } from "@/lib/tool-categories";

export function ToolPageHeader({ tool, description, compact = false, mode = "default" }) {
  const { text } = usePreferences();
  const translatedToolText = useTranslatedValues([
    tool.name,
    description || "",
    "Calculator",
    ...tool.heroStats.map((item) => item.label || ""),
  ]);
  const categoryLabel = getLocalizedCategoryTitle(tool.categorySlug, text, tool.category);
  const translatedStatLabels = translatedToolText.slice(2);
  const isMinimal = mode === "minimal";

  if (isMinimal) {
    return (
      <section
        className={`rounded-[18px] border border-[rgba(18,24,31,0.08)] bg-white px-5 shadow-[0_8px_24px_-22px_rgba(15,23,42,0.08)] sm:px-6 ${
          compact ? "py-4 sm:py-5" : "py-5 sm:py-6"
        }`}
      >
        <div className="max-w-4xl space-y-3">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8a91a2]">
            {translatedToolText[2] || text.tool} · {categoryLabel}
          </p>
          <div className="space-y-2">
            <h1
              className={`font-semibold tracking-[-0.065em] text-[#161d27] ${
                compact ? "text-[1.85rem] leading-[1.05] sm:text-[2.35rem]" : "text-[2.2rem] leading-[1.02] sm:text-[2.8rem]"
              }`}
            >
              {translatedToolText[0] || tool.name}
            </h1>
            <p className={`max-w-3xl text-[#667085] ${compact ? "text-[0.94rem] leading-7" : "text-base leading-8"}`}>
              {translatedToolText[1] || description}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      style={accentStyle}
      className={`tool-header-shell tool-header-premium relative overflow-hidden rounded-[28px] border border-[rgba(18,24,31,0.08)] px-5 shadow-[0_22px_46px_-38px_rgba(15,23,42,0.16)] sm:px-6 ${
        compact ? "py-5 sm:py-6" : "py-6 sm:py-7"
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: tool.categoryColor || "#121821" }}
      />

        <div className="mx-auto grid max-w-6xl gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[rgba(18,24,31,0.08)] bg-[#f6f8fb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#697586]">
              {text.tool}
            </span>
            <span
              className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_28px_-24px_rgba(15,23,42,0.28)]"
              style={{ backgroundColor: theme?.primary || tool.categoryColor || "#121821", borderColor: theme?.edge || `${tool.categoryColor || "#121821"}40` }}
            >
              {categoryLabel}
            </span>
          </div>

          <div className="max-w-4xl space-y-2.5">
            <h1
              className={`font-semibold tracking-[-0.065em] text-[#161d27] ${
                compact ? "text-[2.2rem] leading-[1.02] sm:text-[3rem]" : "text-[2.6rem] leading-[0.98] sm:text-[3.5rem]"
              }`}
            >
              {translatedToolText[0] || tool.name}
            </h1>
            <p
              className={`max-w-3xl text-[#6c7888] ${
                compact ? "text-[0.96rem] leading-7" : "text-base leading-8"
              }`}
            >
              {translatedToolText[1] || description}
            </p>
          </div>

        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {tool.heroStats.slice(0, 3).map((item, index) => (
            <div
              key={item.label}
              className="rounded-[18px] border border-[rgba(18,24,31,0.08)] bg-white/94 px-4 py-3.5 shadow-[0_14px_28px_-28px_rgba(15,23,42,0.12)]"
              style={{ borderColor: theme?.edge || "rgba(18,24,31,0.08)", background: theme?.surface || "rgba(255,255,255,0.94)" }}
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]" style={{ color: theme?.ink || "#8a91a2" }}>
                {translatedStatLabels[index] || item.label}
              </p>
              <p className="mt-2 text-[1rem] font-semibold tracking-[-0.04em] text-[#161d27]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
