"use client";

import { cn } from "@/lib/utils";

export function CategoryMark({ slug = "", accent = "#5f81be", className, tone = "solid" }) {
  const palette = createCategoryPalette(accent, tone);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-[18px] border shadow-[0_18px_32px_-24px_rgba(15,23,42,0.22)] [&_svg]:[shape-rendering:geometricPrecision] [&_path]:[vector-effect:non-scaling-stroke] [&_rect]:[vector-effect:non-scaling-stroke] [&_circle]:[vector-effect:non-scaling-stroke]",
        className,
      )}
      style={{
        background: palette.background,
        borderColor: palette.border,
        color: palette.foreground,
      }}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(255,255,255,0.32),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_55%)]" />
      <span className="relative z-10 inline-flex items-center justify-center">
        <CategoryGlyph slug={slug} />
      </span>
    </span>
  );
}

function CategoryGlyph({ slug }) {
  switch (slug) {
    case "finance":
      return <FinanceMark />;
    case "salary-data":
      return <SalaryDataMark />;
    case "cost-of-living":
      return <CostOfLivingMark />;
    case "education-roi":
      return <EducationRoiMark />;
    case "mortgage-data":
      return <MortgageHubMark />;
    case "tax-budget":
      return <TaxBudgetMark />;
    case "home-costs":
      return <HomeCostsMark />;
    case "health":
      return <HealthMark />;
    case "home":
      return <HomeMark />;
    case "math":
      return <MathMark />;
    case "time":
      return <TimeMark />;
    case "cooking":
      return <CookingMark />;
    case "converters":
      return <ConvertersMark />;
    case "everyday":
    default:
      return <EverydayMark />;
  }
}

function FinanceMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5 16.8V11.2M10.1 16.8V8.7M15.2 16.8V6.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="m4.8 11.9 3.5-2.5 2.8 1.4 4.2-3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.2 6.3H17v2.8" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SalaryDataMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5 16.7V10.8M10.1 16.7V7.8M15.2 16.7V5.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M4.6 8.9h11.9" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" opacity="0.72" />
    </svg>
  );
}

function CostOfLivingMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5 16.2c0-3.2 2.7-5.8 6-5.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M11 10.4c0 3.2 2.7 5.8 6 5.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="5.2" cy="16.4" r="1.55" fill="currentColor" />
      <circle cx="11" cy="10.4" r="1.55" fill="currentColor" />
      <circle cx="16.8" cy="16.2" r="1.55" fill="currentColor" />
    </svg>
  );
}

function EducationRoiMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="m4.1 8.4 6.9-3.3 6.9 3.3-6.9 3.3-6.9-3.3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M6.6 10.2v3.3c0 .9 1.9 2 4.4 2s4.4-1.1 4.4-2v-3.3" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.9 8.4v4.1" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
    </svg>
  );
}

function MortgageHubMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="m4 10 7-5.5 7 5.5" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.4 9.7v6h9.2v-6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 12.6h4" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
      <path d="M10.9 10.7v3.8" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function TaxBudgetMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="4.6" y="4.8" width="12.8" height="12.4" rx="2.8" stroke="currentColor" strokeWidth="1.75" />
      <path d="M7.8 8.4h6.4M7.8 11.1h6.4M7.8 13.8h4" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
    </svg>
  );
}

function HomeCostsMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="m4.2 10.2 6.8-5.4 6.8 5.4" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.3 10.1v5.6h9.4v-5.6" stroke="currentColor" strokeWidth="1.72" strokeLinejoin="round" />
      <path d="M8.1 13.4h5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.1 11.4h5.8" stroke="currentColor" strokeWidth="1.32" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function HealthMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 11h3.1l1.6-3 2.5 6 2.2-3.7H18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.8 15.6h12.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.68" />
    </svg>
  );
}

function HomeMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="m3.7 10.5 7.3-5.9 7.3 5.9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.2 9.8v6h9.6v-6" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M8.6 12.4h4.8" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
    </svg>
  );
}

function MathMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4.4" y="4.4" width="15.2" height="15.2" rx="3.2" stroke="currentColor" strokeWidth="1.85" />
      <path d="M8 9.1h4M10 7.1v4M14 8.2h3.2M14 10.8h3.2M8 15.3h3.8M8 17.9h3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m14.7 15.1 2.6 2.6M17.3 15.1l-2.6 2.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function TimeMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4.2" y="4.8" width="15.6" height="14.8" rx="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.2 3.8v2.6M16.8 3.8v2.6M4.2 9.1h15.6" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <circle cx="12" cy="13.8" r="3.2" stroke="currentColor" strokeWidth="1.65" />
      <path d="M12 12v2.1l1.4.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CookingMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M6.2 8.2h6.9c.84 0 1.5.68 1.5 1.52v2.14H7.6a2.3 2.3 0 0 1-2.3-2.3v-.14c0-.68.55-1.24 1.24-1.24Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M14.7 10h2v4h-2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M10.1 12v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ConvertersMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5.2 7.2h8.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m11.2 4.6 2.8 2.6-2.8 2.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.8 14.8H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m10.8 12.2-2.8 2.6 2.8 2.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EverydayMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="4.2" y="4.4" width="13.6" height="13.2" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.2 4.9v2.8M13.8 4.9v2.8M4.2 9h13.6" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
      <path d="M8 12.5h2M12 12.5h2M8 15h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function createCategoryPalette(accent, tone) {
  const rgb = hexToRgb(accent);
  const base = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : "95, 129, 190";

  if (tone === "soft") {
    return {
      background: `linear-gradient(155deg, rgba(${base},0.18), rgba(255,255,255,0.96))`,
      border: `rgba(${base},0.18)`,
      foreground: accent,
    };
  }

  return {
    background: `linear-gradient(155deg, ${accent}, rgba(${base},0.82))`,
    border: `rgba(${base},0.2)`,
    foreground: "#ffffff",
  };
}

function hexToRgb(hex) {
  const normalized = String(hex || "").replace("#", "").trim();
  if (normalized.length !== 6) return null;

  const number = Number.parseInt(normalized, 16);
  if (Number.isNaN(number)) return null;

  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
}
