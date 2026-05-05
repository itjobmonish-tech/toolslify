"use client";

import { cn } from "@/lib/utils";

const PALETTES = {
  blue: {
    solid: "#5779b4",
    soft: "#dfe8fb",
    ink: "#3f629a",
    line: "#ffffff",
  },
  navy: {
    solid: "#4059a8",
    soft: "#dbe3fb",
    ink: "#2c4387",
    line: "#ffffff",
  },
  orange: {
    solid: "#e7633f",
    soft: "#f8d8cc",
    ink: "#c94a28",
    line: "#ffffff",
  },
  green: {
    solid: "#5f9f5e",
    soft: "#d3edcf",
    ink: "#4b844c",
    line: "#ffffff",
  },
  purple: {
    solid: "#9f688f",
    soft: "#edd5e7",
    ink: "#864c79",
    line: "#ffffff",
  },
  violet: {
    solid: "#8d5fd0",
    soft: "#ebdefb",
    ink: "#6e3fb4",
    line: "#ffffff",
  },
  gold: {
    solid: "#c7ab1a",
    soft: "#faeca4",
    ink: "#9f8300",
    line: "#ffffff",
  },
  red: {
    solid: "#c15f4a",
    soft: "#f4ddd6",
    ink: "#a44634",
    line: "#ffffff",
  },
  slate: {
    solid: "#687ba2",
    soft: "#e4eaf8",
    ink: "#516489",
    line: "#ffffff",
  },
  teal: {
    solid: "#3f9c95",
    soft: "#d7efec",
    ink: "#247871",
    line: "#ffffff",
  },
};

export function ToolGlyph({ slug = "", categorySlug = "", className }) {
  const spec = getGlyphSpec(String(slug).toLowerCase(), String(categorySlug).toLowerCase());

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex h-full w-full items-center justify-center overflow-visible [transform:translateZ(0)] [&_svg]:overflow-visible [&_svg]:[shape-rendering:geometricPrecision] [&_path]:[vector-effect:non-scaling-stroke] [&_rect]:[vector-effect:non-scaling-stroke] [&_circle]:[vector-effect:non-scaling-stroke]",
        className,
      )}
    >
      <span className="inline-flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-px">
        {renderGlyph(spec)}
      </span>
    </span>
  );
}

function renderGlyph(spec) {
  switch (spec.kind) {
    case "format":
      return <StackedFormatGlyph {...spec} />;
    case "pair-arrows":
      return <PairArrowGlyph {...spec} />;
    case "quad-arrows":
      return <QuadArrowGlyph {...spec} />;
    case "frame":
      return <FrameResizeGlyph {...spec} />;
    case "case-sort":
      return <CaseSortGlyph />;
    case "doc":
      return <DocumentGlyph {...spec} />;
    case "image-stack":
      return <ImageStackGlyph {...spec} />;
    case "single":
    default:
      return <SingleTileGlyph {...spec} />;
  }
}

function getGlyphSpec(slug, categorySlug) {
  if (!slug) {
    return { kind: "doc", palette: "blue", variant: "note" };
  }

  if (
    slug.includes("case-converter") ||
    slug.includes("uppercase-to-lowercase") ||
    slug.includes("small-caps") ||
    slug.includes("upside-down-text")
  ) {
    return { kind: "case-sort" };
  }

  if (
    slug === "image-compressor" ||
    slug.includes("expand") ||
    slug.includes("rescale")
  ) {
    return { kind: "quad-arrows", palette: "green" };
  }

  if (
    slug.includes("crop") ||
    slug.includes("resize") ||
    slug.includes("resizer") ||
    slug.includes("svg-converter")
  ) {
    return { kind: "frame", palette: "purple" };
  }

  if (
    slug.includes("compress") ||
    slug.includes("optimizer") ||
    slug.includes("reduce-image-size") ||
    slug === "mb-to-kb-converter"
  ) {
    return { kind: "pair-arrows", palette: "orange" };
  }

  if (slug.includes("favicon")) {
    return { kind: "format", palette: "gold", label: "ICO" };
  }

  if (slug.includes("ocr") || slug.includes("receipt-ocr") || slug.includes("image-to-text")) {
    return { kind: "format", palette: "blue", label: "TXT", icon: "image" };
  }

  if (slug.includes("text-to-image")) {
    return { kind: "image-stack", palette: "gold", accent: "T" };
  }

  if (slug.includes("reverse-image-search") || slug.includes("face-search")) {
    return { kind: "single", palette: "gold", icon: "image-search" };
  }

  if (slug.includes("face-shape-detector") || slug.includes("ai-image-detector")) {
    return { kind: "single", palette: "purple", icon: "image-ai" };
  }

  if (
    slug.includes("video-to-gif") ||
    slug.includes("mp4-to-gif") ||
    slug.endsWith("to-gif-converter")
  ) {
    return { kind: "format", palette: "gold", label: "GIF" };
  }

  const conversionSpec = getConversionSpec(slug);
  if (conversionSpec) return conversionSpec;

  if (slug.includes("resume-builder")) {
    return { kind: "doc", palette: "violet", variant: "profile" };
  }

  if (slug.includes("ats-resume-checker")) {
    return { kind: "doc", palette: "navy", variant: "check" };
  }

  if (slug.includes("cover-letter")) {
    return { kind: "doc", palette: "violet", variant: "mail" };
  }

  if (slug.includes("resume-summary")) {
    return { kind: "doc", palette: "violet", variant: "profile" };
  }

  if (slug.includes("resume-bullet")) {
    return { kind: "doc", palette: "orange", variant: "edit" };
  }

  if (slug.includes("keyword-extractor")) {
    return { kind: "doc", palette: "navy", variant: "search" };
  }

  if (slug.includes("keyword-matcher")) {
    return { kind: "single", palette: "navy", icon: "compare" };
  }

  if (slug.includes("linkedin")) {
    return { kind: "doc", palette: "violet", variant: "profile" };
  }

  if (slug.includes("interview")) {
    return { kind: "doc", palette: "navy", variant: "chat" };
  }

  if (slug.includes("thank-you-email") || slug.includes("follow-up-email")) {
    return { kind: "doc", palette: "violet", variant: "mail" };
  }

  if (slug.includes("resignation")) {
    return { kind: "doc", palette: "slate", variant: "mail" };
  }

  if (slug.startsWith("cv-")) {
    return { kind: "pair-arrows", palette: "violet" };
  }

  if (
    slug.includes("resume") ||
    slug.includes("cover-letter") ||
    slug.includes("linkedin") ||
    slug.includes("interview")
  ) {
    return { kind: "doc", palette: pickPalette(slug, ["violet", "navy", "orange", "slate"]), variant: "profile" };
  }

  if (slug.includes("salary-to-hourly")) {
    return { kind: "single", palette: "navy", icon: "clock-grid" };
  }

  if (slug.includes("hourly-to-salary")) {
    return { kind: "single", palette: "teal", icon: "clock-grid" };
  }

  if (slug.includes("take-home")) {
    return { kind: "single", palette: "green", icon: "wallet" };
  }

  if (
    slug.includes("gross-to-net") ||
    slug.includes("net-to-gross") ||
    slug.includes("contractor-vs-employee") ||
    slug.includes("cost-of-living")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["navy", "violet", "slate"]), icon: "compare" };
  }

  if (
    slug.includes("overtime") ||
    slug.includes("pto") ||
    slug.includes("notice-period") ||
    slug.includes("timesheet")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["teal", "navy", "slate"]), icon: "clock-grid" };
  }

  if (
    slug.includes("freelance-rate") ||
    slug.includes("day-rate") ||
    slug.includes("pay-raise") ||
    slug.includes("profit-margin")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["violet", "teal", "green"]), icon: "chart" };
  }

  if (
    slug.includes("bonus") ||
    slug.includes("commission") ||
    slug.includes("vat") ||
    slug.includes("late-payment-interest")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["gold", "navy", "red"]), icon: "coins" };
  }

  if (slug.includes("invoice") || slug.includes("receipt")) {
    return { kind: "single", palette: pickPalette(slug, ["red", "navy", "orange"]), icon: "receipt" };
  }

  if (slug.includes("quote") || slug.includes("estimate")) {
    return { kind: "doc", palette: pickPalette(slug, ["gold", "slate", "navy"]), variant: "grid" };
  }

  if (slug.includes("proposal") || slug.includes("scope-of-work")) {
    return { kind: "doc", palette: pickPalette(slug, ["violet", "red", "slate"]), variant: "brief" };
  }

  if (slug.includes("contract") || slug.includes("purchase-order")) {
    return { kind: "doc", palette: pickPalette(slug, ["navy", "slate", "gold"]), variant: "seal" };
  }

  if (slug.includes("onboarding")) {
    return { kind: "doc", palette: "violet", variant: "profile" };
  }

  if (slug.includes("expense-report")) {
    return { kind: "single", palette: "gold", icon: "wallet" };
  }

  if (
    slug.includes("subtitle") ||
    slug.includes("transcript") ||
    slug.includes("meeting-minutes") ||
    slug.includes("audio-notes") ||
    slug.includes("youtube-transcript")
  ) {
    return { kind: "doc", palette: "purple", variant: slug.includes("translate") ? "translate" : "note" };
  }

  if (
    slug.includes("chat") ||
    slug.includes("whatsapp") ||
    slug.includes("evidence-bundle")
  ) {
    return { kind: "doc", palette: pickPalette(slug, ["slate", "navy", "violet"]), variant: "chat" };
  }

  if (slug.includes("passport") || slug.includes("visa")) {
    return { kind: "single", palette: "blue", icon: "image-search" };
  }

  if (
    slug.includes("mortgage") ||
    slug.includes("home-loan") ||
    slug.includes("house-affordability") ||
    slug.includes("heloc") ||
    slug.includes("refinance") ||
    slug.includes("rent-vs-buy") ||
    slug.includes("down-payment") ||
    slug.includes("property-tax") ||
    slug.includes("closing-costs")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["navy", "teal", "slate"]), icon: "house-finance" };
  }

  if (
    slug.includes("paycheck") ||
    slug.includes("tax-refund") ||
    slug.includes("sales-tax") ||
    slug.includes("self-employment-tax") ||
    slug.includes("capital-gains-tax") ||
    slug.includes("apr") ||
    slug.includes("credit-card-payoff") ||
    slug.includes("debt-payoff")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["red", "gold", "navy"]), icon: "ledger" };
  }

  if (
    slug.includes("retirement") ||
    slug.includes("401-k") ||
    slug.includes("roth-ira") ||
    slug.includes("inflation")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["green", "navy", "teal"]), icon: "growth" };
  }

  if (
    slug.includes("calorie") ||
    slug.includes("macro") ||
    slug.includes("protein-intake") ||
    slug.includes("ideal-weight") ||
    slug.includes("lean-body-mass")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["green", "teal", "navy"]), icon: "pulse" };
  }

  if (
    slug.includes("body-fat") ||
    slug.includes("bmi") ||
    slug.includes("bmr") ||
    slug.includes("whr")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["green", "teal", "slate"]), icon: "body-grid" };
  }

  if (
    slug.includes("ovulation") ||
    slug.includes("pregnancy")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["violet", "red", "gold"]), icon: "cycle" };
  }

  if (
    slug.includes("pace") ||
    slug.includes("one-rep") ||
    slug.includes("target-heart-rate") ||
    slug.includes("steps")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["teal", "green", "navy"]), icon: "fitness" };
  }

  if (
    slug.includes("gpa") ||
    slug === "grade-calculator"
  ) {
    return { kind: "single", palette: pickPalette(slug, ["violet", "navy", "teal"]), icon: "math-grid" };
  }

  if (
    slug.includes("scientific") ||
    slug.includes("fraction") ||
    slug.includes("decimal-to-percent")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["violet", "navy", "slate"]), icon: "fraction" };
  }

  if (
    slug.includes("average") ||
    slug.includes("median") ||
    slug.includes("mode") ||
    slug.includes("standard-deviation")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["teal", "violet", "navy"]), icon: "stats" };
  }

  if (
    slug === "time-calculator" ||
    slug.includes("time-duration") ||
    slug === "hours-calculator" ||
    slug.includes("work-hours")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["teal", "navy", "slate"]), icon: "time-grid" };
  }

  if (slug.includes("sleep")) {
    return { kind: "single", palette: pickPalette(slug, ["teal", "green", "slate"]), icon: "sleep" };
  }

  if (slug.includes("water-intake")) {
    return { kind: "single", palette: pickPalette(slug, ["blue", "teal", "navy"]), icon: "droplet" };
  }

  if (slug.includes("bac")) {
    return { kind: "single", palette: pickPalette(slug, ["red", "slate", "violet"]), icon: "flask" };
  }

  if (slug.includes("roof")) {
    return { kind: "single", palette: pickPalette(slug, ["orange", "red", "slate"]), icon: "roof" };
  }

  if (slug.includes("paint")) {
    return { kind: "single", palette: pickPalette(slug, ["orange", "gold", "red"]), icon: "paint" };
  }

  if (
    slug.includes("concrete") ||
    slug.includes("tile") ||
    slug.includes("drywall") ||
    slug.includes("decking") ||
    slug.includes("insulation") ||
    slug.includes("fence") ||
    slug.includes("topsoil") ||
    slug.includes("sod") ||
    slug.includes("paver") ||
    slug.includes("flooring") ||
    slug.includes("square-footage") ||
    slug.includes("gravel") ||
    slug.includes("mulch") ||
    slug.includes("asphalt")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["orange", "slate", "teal"]), icon: "ruler-grid" };
  }

  if (slug.includes("solar")) {
    return { kind: "single", palette: pickPalette(slug, ["gold", "orange", "teal"]), icon: "solar" };
  }

  if (slug === "btu-calculator") {
    return { kind: "single", palette: pickPalette(slug, ["orange", "red", "slate"]), icon: "thermo" };
  }

  if (
    slug.includes("budget") ||
    slug.includes("net-worth") ||
    slug.includes("percentage-off") ||
    slug.includes("discount") ||
    slug.includes("tip")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["gold", "teal", "navy"]), icon: "wallet" };
  }

  if (
    slug.includes("dividend") ||
    slug.includes("roi") ||
    slug.includes("break-even") ||
    slug.includes("markup")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["green", "navy", "teal"]), icon: "growth" };
  }

  if (slug.includes("lease")) {
    return { kind: "single", palette: pickPalette(slug, ["navy", "slate", "teal"]), icon: "ledger" };
  }

  if (
    slug.includes("calculator") ||
    slug.includes("vat") ||
    slug.includes("roi") ||
    slug.includes("margin")
  ) {
    return { kind: "single", palette: pickPalette(slug, ["navy", "green", "teal", "violet"]), icon: "calculator" };
  }

  if (slug.includes("meme-generator") || slug.includes("invitation-maker") || slug.includes("business-card-maker")) {
    return { kind: "image-stack", palette: "gold", accent: "A" };
  }

  if (slug.includes("rgb-to-hex")) {
    return { kind: "format", palette: "purple", label: "HEX" };
  }

  if (
    slug.includes("robots") ||
    slug.includes("sitemap") ||
    slug.includes("faq-schema") ||
    slug.includes("meta-tag") ||
    slug.includes("json") ||
    slug.includes("base64") ||
    slug.includes("url-encoder") ||
    slug.includes("html-minifier") ||
    slug.includes("slug-generator")
  ) {
    return { kind: "single", palette: "blue", icon: "code" };
  }

  if (
    slug.includes("grammar") ||
    slug.includes("spell") ||
    slug.includes("proofreader") ||
    slug.includes("plagiarism") ||
    slug.includes("paper-checker") ||
    slug.includes("essay-checker") ||
    slug.includes("sentence-checker") ||
    slug.includes("punctuation-checker") ||
    slug.includes("readability-checker")
  ) {
    return { kind: "doc", palette: "blue", variant: "check" };
  }

  if (slug.includes("word-counter")) {
    return { kind: "doc", palette: "blue", variant: "count" };
  }

  if (
    slug.includes("paraphr") ||
    slug.includes("rewrit") ||
    slug.includes("rephras") ||
    slug.includes("reword") ||
    slug.includes("summary") ||
    slug.includes("bullet-point") ||
    slug.includes("title-idea") ||
    slug.includes("word-changer") ||
    slug.includes("sentence-changer")
  ) {
    return { kind: "doc", palette: "orange", variant: "edit" };
  }

  if (
    slug.includes("online-text-editor") ||
    slug.includes("online-notepad") ||
    slug.includes("pdf-notes") ||
    slug.includes("notes")
  ) {
    return { kind: "doc", palette: "slate", variant: "note" };
  }

  if (slug.includes("speech-to-text")) {
    return { kind: "doc", palette: "blue", variant: "voice" };
  }

  if (slug.includes("translate") || slug.includes("morse-code")) {
    return { kind: "doc", palette: "orange", variant: "translate" };
  }

  if (slug.includes("ai-content-detector") || slug.includes("chatgpt-detector")) {
    return { kind: "doc", palette: "purple", variant: "ai" };
  }

  if (slug.includes("privacy-policy") || slug.includes("citation")) {
    return { kind: "doc", palette: "slate", variant: "note" };
  }

  if (slug.includes("emojis")) {
    return { kind: "single", palette: "orange", icon: "smile" };
  }

  switch (categorySlug) {
    case "resume-job-tools":
      return { kind: "doc", palette: pickPalette(slug, ["violet", "navy", "orange", "slate"]), variant: "profile" };
    case "salary-data":
      return { kind: "single", palette: pickPalette(slug, ["navy", "teal", "violet"]), icon: "chart" };
    case "cost-of-living":
      return { kind: "single", palette: pickPalette(slug, ["teal", "navy", "slate"]), icon: "compare" };
    case "education-roi":
      return { kind: "single", palette: pickPalette(slug, ["teal", "gold", "navy"]), icon: "chart" };
    case "mortgage-data":
      return { kind: "single", palette: pickPalette(slug, ["navy", "teal", "slate"]), icon: "house-finance" };
    case "tax-budget":
      return { kind: "single", palette: pickPalette(slug, ["green", "navy", "teal"]), icon: "ledger" };
    case "home-costs":
      return { kind: "single", palette: pickPalette(slug, ["orange", "red", "gold"]), icon: "roof" };
    case "finance":
      return { kind: "single", palette: pickPalette(slug, ["navy", "teal", "green", "violet"]), icon: "chart" };
    case "health":
      return { kind: "single", palette: pickPalette(slug, ["green", "teal", "slate"]), icon: "pulse" };
    case "home":
      return { kind: "single", palette: pickPalette(slug, ["orange", "red", "slate"]), icon: "ruler-grid" };
    case "math":
      return { kind: "single", palette: pickPalette(slug, ["violet", "navy", "teal"]), icon: "math-grid" };
    case "time":
      return { kind: "single", palette: pickPalette(slug, ["teal", "navy", "slate"]), icon: "time-grid" };
    case "cooking":
      return { kind: "single", palette: pickPalette(slug, ["gold", "orange", "red"]), icon: "calculator" };
    case "converters":
      return { kind: "single", palette: pickPalette(slug, ["teal", "blue", "navy"]), icon: "calculator" };
    case "everyday":
      return { kind: "single", palette: pickPalette(slug, ["slate", "navy", "teal"]), icon: "calculator" };
    case "freelancer-business-tools":
      return { kind: "doc", palette: pickPalette(slug, ["red", "slate", "gold", "violet"]), variant: "grid" };
    case "text-editing":
    default:
      return { kind: "doc", palette: pickPalette(slug, ["blue", "navy", "purple", "slate"]), variant: "note" };
  }
}

function pickPalette(seed, palettes) {
  if (!palettes?.length) return "blue";

  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return palettes[hash % palettes.length];
}

function getConversionSpec(slug) {
  if (!slug.includes("-to-")) return null;

  const rawTarget = slug.split("-to-")[1]?.split("-")[0];
  if (!rawTarget) return null;

  if (/^\d/.test(rawTarget)) return null;

  const normalized = rawTarget === "jpeg" ? "jpg" : rawTarget;

  switch (normalized) {
    case "word":
    case "doc":
    case "docx":
      return { kind: "format", palette: "blue", label: "W" };
    case "excel":
    case "xls":
    case "xlsx":
      return { kind: "format", palette: "green", label: "X" };
    case "powerpoint":
    case "ppt":
    case "pptx":
      return { kind: "format", palette: "orange", label: "P" };
    case "jpg":
      return { kind: "format", palette: "gold", label: "JPG" };
    case "png":
      return { kind: "format", palette: "green", label: "PNG" };
    case "svg":
      return { kind: "frame", palette: "purple" };
    case "gif":
      return { kind: "format", palette: "gold", label: "GIF" };
    case "ico":
      return { kind: "format", palette: "gold", label: "ICO" };
    case "text":
    case "txt":
      return { kind: "format", palette: "blue", label: "TXT" };
    case "csv":
      return { kind: "format", palette: "green", label: "CSV" };
    case "image":
      return { kind: "image-stack", palette: "gold", accent: "T" };
    case "hex":
      return { kind: "format", palette: "purple", label: "HEX" };
    case "kb":
      return { kind: "format", palette: "green", label: "KB" };
    default:
      return null;
  }
}

function StackedFormatGlyph({ palette = "blue", label = "W", icon = "arrow" }) {
  const colors = PALETTES[palette];

  return (
    <span className="relative h-[64px] w-[64px]">
      <MiniTile palette={palette} tone="soft" className="left-[8px] top-[8px] h-[23px] w-[23px] rounded-[4px] group-hover:-translate-x-0.5 group-hover:-translate-y-1">
        {icon === "image" ? <ImageMark color={colors.ink} /> : <ArrowMark color={colors.ink} direction="down-right" />}
      </MiniTile>

      <MiniTile palette={palette} tone="solid" className="left-[24px] top-[24px] h-[28px] w-[28px] rounded-[5px] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
        <TileLabel label={label} />
      </MiniTile>
    </span>
  );
}

function PairArrowGlyph({ palette = "orange" }) {
  const colors = PALETTES[palette];

  return (
    <span className="relative h-[64px] w-[64px]">
      <MiniTile palette={palette} tone="solid" className="left-[9px] top-[12px] h-[26px] w-[26px] rounded-[5px] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowMark color={colors.line} direction="up-left" />
      </MiniTile>
      <MiniTile palette={palette} tone="solid" className="left-[25px] top-[27px] h-[26px] w-[26px] rounded-[5px] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
        <ArrowMark color={colors.line} direction="down-right" />
      </MiniTile>
    </span>
  );
}

function QuadArrowGlyph({ palette = "green" }) {
  const colors = PALETTES[palette];

  return (
    <span className="relative h-[64px] w-[64px]">
      <MiniTile palette={palette} tone="solid" className="left-[10px] top-[12px] h-[15px] w-[15px] rounded-[3px]">
        <ArrowMark color={colors.line} direction="up-left" strokeWidth={1.8} />
      </MiniTile>
      <MiniTile palette={palette} tone="solid" className="left-[30px] top-[12px] h-[15px] w-[15px] rounded-[3px]">
        <ArrowMark color={colors.line} direction="up-right" strokeWidth={1.8} />
      </MiniTile>
      <MiniTile palette={palette} tone="solid" className="left-[10px] top-[32px] h-[15px] w-[15px] rounded-[3px]">
        <ArrowMark color={colors.line} direction="down-left" strokeWidth={1.8} />
      </MiniTile>
      <MiniTile palette={palette} tone="solid" className="left-[30px] top-[32px] h-[15px] w-[15px] rounded-[3px]">
        <ArrowMark color={colors.line} direction="down-right" strokeWidth={1.8} />
      </MiniTile>
    </span>
  );
}

function FrameResizeGlyph({ palette = "purple" }) {
  const colors = PALETTES[palette];

  return (
    <span className="relative h-[64px] w-[64px]">
      <MiniTile palette={palette} tone="solid" className="left-[12px] top-[12px] h-[36px] w-[36px] rounded-[5px] group-hover:-translate-y-0.5">
        <FrameMark color={colors.line} />
      </MiniTile>
    </span>
  );
}

function CaseSortGlyph() {
  return (
    <span className="relative h-[64px] w-[64px]">
      <MiniTile palette="orange" tone="solid" className="left-[9px] top-[8px] h-[41px] w-[18px] rounded-[4px] group-hover:-translate-y-0.5">
        <SortRailMark />
      </MiniTile>

      <MiniTile palette="orange" tone="soft" className="left-[33px] top-[8px] h-[18px] w-[18px] rounded-[4px]">
        <span className="text-[13px] font-semibold leading-none tracking-[-0.05em]" style={{ color: "#be4b2f" }}>
          A
        </span>
      </MiniTile>

      <MiniTile palette="orange" tone="soft" className="left-[33px] top-[31px] h-[18px] w-[18px] rounded-[4px]">
        <span className="text-[13px] font-semibold leading-none tracking-[-0.05em]" style={{ color: "#be4b2f" }}>
          B
        </span>
      </MiniTile>
    </span>
  );
}

function DocumentGlyph({ palette = "blue", variant = "note" }) {
  const colors = PALETTES[palette];

  return (
    <span className="relative h-[64px] w-[64px]">
      <MiniTile palette={palette} tone="soft" className="left-[10px] top-[9px] h-[30px] w-[28px] rounded-[4px] border" style={{ borderColor: hexToRgba(colors.ink, 0.12) }}>
        <DocumentMark color={colors.ink} />
      </MiniTile>

      <MiniTile palette={palette} tone="solid" className="left-[29px] top-[29px] h-[20px] w-[20px] rounded-[4px] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
        <DocumentBadge variant={variant} color={colors.line} />
      </MiniTile>
    </span>
  );
}

function ImageStackGlyph({ palette = "gold", accent = null }) {
  const colors = PALETTES[palette];

  return (
    <span className="relative h-[64px] w-[64px]">
      <MiniTile palette={palette} tone="soft" className="left-[9px] top-[10px] h-[23px] w-[23px] rounded-[4px]">
        {accent ? (
          <span className="text-[11px] font-semibold leading-none tracking-[-0.04em]" style={{ color: colors.ink }}>
            {accent}
          </span>
        ) : (
          <ArrowMark color={colors.ink} direction="up-left" />
        )}
      </MiniTile>

      <MiniTile palette={palette} tone="solid" className="left-[24px] top-[24px] h-[28px] w-[28px] rounded-[5px] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
        <ImageMark color={colors.line} />
      </MiniTile>
    </span>
  );
}

function SingleTileGlyph({ palette = "blue", icon = "code" }) {
  const colors = PALETTES[palette];

  return (
    <span className="relative h-[64px] w-[64px]">
      <MiniTile palette={palette} tone="solid" className="left-[10px] top-[10px] h-[44px] w-[44px] rounded-[8px] group-hover:-translate-y-0.5">
        <span className="inline-flex items-center justify-center [&_svg]:h-[22px] [&_svg]:w-[22px]">
          <SingleIcon icon={icon} color={colors.line} />
        </span>
      </MiniTile>
    </span>
  );
}

function MiniTile({ palette = "blue", tone = "solid", className, children, style }) {
  const colors = PALETTES[palette];
  const background = tone === "solid" ? colors.solid : colors.soft;
  const borderColor = tone === "solid" ? "transparent" : hexToRgba(colors.ink, 0.06);
  const shadow = tone === "solid"
    ? `0 12px 20px -18px ${hexToRgba(colors.ink, 0.2)}`
    : `0 10px 16px -16px ${hexToRgba(colors.ink, 0.12)}`;

  return (
    <span
      className={cn(
        "absolute flex items-center justify-center border transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        className,
      )}
      style={{
        background,
        borderColor,
        boxShadow: shadow,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function TileLabel({ label }) {
  const size =
    label.length >= 4 ? "text-[7px]" : label.length === 3 ? "text-[8px]" : label.length === 2 ? "text-[11px]" : "text-[15px]";

  return (
    <span className={cn("font-semibold uppercase leading-none tracking-[-0.05em] text-white", size)}>
      {label}
    </span>
  );
}

function DocumentBadge({ variant, color }) {
  switch (variant) {
    case "brief":
      return <BriefMark color={color} />;
    case "chat":
      return <ChatMark color={color} />;
    case "check":
      return <CheckMark color={color} />;
    case "count":
      return <CountMark color={color} />;
    case "edit":
      return <PencilMark color={color} />;
    case "grid":
      return <GridMark color={color} />;
    case "mail":
      return <MailMark color={color} />;
    case "profile":
      return <ProfileMark color={color} />;
    case "search":
      return <SearchMark color={color} />;
    case "seal":
      return <SealMark color={color} />;
    case "translate":
      return <TranslateMark color={color} />;
    case "voice":
      return <MicMark color={color} />;
    case "ai":
      return <AiMark color={color} />;
    case "note":
    default:
      return <LinesMark color={color} />;
  }
}

function SingleIcon({ icon, color }) {
  switch (icon) {
    case "body-grid":
      return <BodyGridMark color={color} />;
    case "chart":
      return <ChartMark color={color} />;
    case "clock-grid":
      return <ClockGridMark color={color} />;
    case "coins":
      return <CoinsMark color={color} />;
    case "compare":
      return <CompareMark color={color} />;
    case "cycle":
      return <CycleMark color={color} />;
    case "droplet":
      return <DropletMark color={color} />;
    case "fitness":
      return <FitnessMark color={color} />;
    case "flask":
      return <FlaskMark color={color} />;
    case "fraction":
      return <FractionMark color={color} />;
    case "growth":
      return <GrowthMark color={color} />;
    case "house-finance":
      return <HouseFinanceMark color={color} />;
    case "ledger":
      return <LedgerMark color={color} />;
    case "math-grid":
      return <MathGridMark color={color} />;
    case "paint":
      return <PaintMark color={color} />;
    case "pulse":
      return <PulseMark color={color} />;
    case "roof":
      return <RoofMark color={color} />;
    case "ruler-grid":
      return <RulerGridMark color={color} />;
    case "sleep":
      return <SleepMark color={color} />;
    case "solar":
      return <SolarMark color={color} />;
    case "stats":
      return <StatsMark color={color} />;
    case "thermo":
      return <ThermoMark color={color} />;
    case "time-grid":
      return <TimeGridMark color={color} />;
    case "tools":
      return <ToolsMark color={color} />;
    case "nib":
      return <NibMark color={color} />;
    case "receipt":
      return <ReceiptMark color={color} />;
    case "wallet":
      return <WalletMark color={color} />;
    case "calculator":
      return <CalculatorMark color={color} />;
    case "image-search":
      return <ImageSearchMark color={color} />;
    case "image-ai":
      return <AiImageMark color={color} />;
    case "smile":
      return <SmileMark color={color} />;
    case "code":
    default:
      return <CodeMark color={color} />;
  }
}

function ArrowMark({ color, direction = "down-right", strokeWidth = 2.1 }) {
  const rotationMap = {
    "down-right": "rotate(0deg)",
    "up-left": "rotate(180deg)",
    "up-right": "rotate(-90deg)",
    "down-left": "rotate(90deg)",
  };

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      style={{ transform: rotationMap[direction] }}
    >
      <path d="M4 4.5 11.5 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M7.8 12H12V7.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FrameMark({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 6h4M6 6v4M18 6h-4M18 6v4M6 18h4M6 18v-4M18 18h-4M18 18v-4" stroke={color} strokeWidth="2.05" strokeLinecap="round" />
      <path d="M8 16 16 8" stroke={color} strokeWidth="2.05" strokeLinecap="round" />
      <path d="M12.5 8H16v3.5" stroke={color} strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="6" r="1.35" fill={color} />
      <circle cx="18" cy="18" r="1.35" fill={color} />
      <circle cx="6" cy="18" r="1.35" fill={color} />
      <circle cx="18" cy="6" r="1.35" fill={color} />
    </svg>
  );
}

function SortRailMark() {
  return (
    <svg width="14" height="28" viewBox="0 0 14 28" fill="none">
      <path d="m4 8 3-3 3 3" stroke="#ffffff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="14" r="2.2" fill="#ffffff" />
      <path d="m4 20 3 3 3-3" stroke="#ffffff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentMark({ color }) {
  return (
    <svg width="17" height="19" viewBox="0 0 17 19" fill="none">
      <path d="M4 1.7h5.7L13.2 5v11.3c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v-13.6c0-.55.45-1 1-1Z" stroke={color} strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M9.7 1.7V5h3.3" stroke={color} strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M5.3 9.2h6.4M5.3 12.1h5.2" stroke={color} strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function CheckMark({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="m2.4 6.2 2.2 2.2L9.8 3.8" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CountMark({ color }) {
  return (
    <span className="text-[7px] font-semibold leading-none tracking-[-0.04em]" style={{ color }}>
      123
    </span>
  );
}

function BriefMark({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.2 4.4h7.6v4.1c0 .72-.58 1.3-1.3 1.3H3.5c-.72 0-1.3-.58-1.3-1.3V4.4Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M4.1 4.4v-.8c0-.6.49-1.1 1.1-1.1h1.6c.61 0 1.1.5 1.1 1.1v.8M2.2 6.1h7.6" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatMark({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3.1 2.6h5.8c.72 0 1.3.58 1.3 1.3v3c0 .72-.58 1.3-1.3 1.3H6.1L4 10.1v-1.9H3.1c-.72 0-1.3-.58-1.3-1.3v-3c0-.72.58-1.3 1.3-1.3Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M4.2 5h3.6M4.2 6.7h2.4" stroke={color} strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function PencilMark({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="m8.9 2.2.9.9a1 1 0 0 1 0 1.4l-4.9 4.9-2.1.5.5-2.1 4.9-4.9a1 1 0 0 1 1.4 0Z" stroke={color} strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M6.7 3.4 8.6 5.3" stroke={color} strokeWidth="1.55" strokeLinecap="round" />
    </svg>
  );
}

function SearchMark({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="5" cy="5" r="2.7" stroke={color} strokeWidth="1.6" />
      <path d="m7.2 7.2 2.2 2.2" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GridMark({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="2.1" y="2.1" width="2.5" height="2.5" rx="0.7" stroke={color} strokeWidth="1.3" />
      <rect x="7.4" y="2.1" width="2.5" height="2.5" rx="0.7" stroke={color} strokeWidth="1.3" />
      <rect x="2.1" y="7.4" width="2.5" height="2.5" rx="0.7" stroke={color} strokeWidth="1.3" />
      <rect x="7.4" y="7.4" width="2.5" height="2.5" rx="0.7" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

function MailMark({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1.9" y="3" width="8.2" height="6" rx="1.2" stroke={color} strokeWidth="1.35" />
      <path d="m2.8 4 3.2 2.4L9.2 4" stroke={color} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProfileMark({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="4.1" r="1.7" stroke={color} strokeWidth="1.35" />
      <path d="M3.1 9.2c.52-1.33 1.65-2.1 2.9-2.1 1.25 0 2.38.77 2.9 2.1" stroke={color} strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function TranslateMark({ color }) {
  return (
    <span className="text-[8px] font-semibold leading-none tracking-[-0.05em]" style={{ color }}>
      A
    </span>
  );
}

function MicMark({ color }) {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
      <rect x="3.2" y="1.5" width="4.6" height="6" rx="2.2" stroke={color} strokeWidth="1.5" />
      <path d="M2 6.7a3.5 3.5 0 1 0 7 0M5.5 10.2v1.3M3.7 11.5h3.6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AiMark({ color }) {
  return (
    <span className="text-[7px] font-semibold leading-none tracking-[-0.06em]" style={{ color }}>
      AI
    </span>
  );
}

function SealMark({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 2.1 8.6 3v2.5c0 1.6-1.06 2.95-2.6 3.6-1.54-.65-2.6-2-2.6-3.6V3l2.6-.9Z" stroke={color} strokeWidth="1.35" strokeLinejoin="round" />
      <path d="m4.8 5.8.8.8 1.7-1.8" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinesMark({ color }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.3 3.4h7.4M2.3 6h7.4M2.3 8.6h5.4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ImageMark({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="2.1" y="2.1" width="10.8" height="10.8" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="m4.2 10.2 2.1-2.2 1.9 1.7 1.3-1.4 1.3 1.9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5.2" cy="5.2" r="1.1" fill={color} />
    </svg>
  );
}

function ReceiptMark({ color }) {
  return (
    <svg width="19" height="20" viewBox="0 0 19 20" fill="none">
      <path d="M5 2.5h9v14l-1.5-1.1L11 16.5 9.5 15.4 8 16.5 6.5 15.4 5 16.5v-14Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 6.5h5M7 9.5h5M7 12.5h3.6" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function WalletMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4.1 5.3V4.4c0-.83.67-1.5 1.5-1.5h6.2c.83 0 1.5.67 1.5 1.5v.9" stroke={color} strokeWidth="1.55" strokeLinecap="round" />
      <rect x="2.8" y="5.4" width="12.4" height="8.2" rx="2.1" stroke={color} strokeWidth="1.6" />
      <path d="M10.5 8.4h4v2.3h-4a1.15 1.15 0 0 1 0-2.3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="11.7" cy="9.55" r="0.7" fill={color} />
    </svg>
  );
}

function CoinsMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <ellipse cx="7" cy="5.2" rx="3.2" ry="1.7" stroke={color} strokeWidth="1.5" />
      <path d="M3.8 5.2v2.3c0 .94 1.43 1.7 3.2 1.7s3.2-.76 3.2-1.7V5.2" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="11.4" cy="10.8" rx="2.8" ry="1.5" stroke={color} strokeWidth="1.5" />
      <path d="M8.6 10.8v1.9c0 .82 1.25 1.5 2.8 1.5s2.8-.68 2.8-1.5v-1.9" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function LedgerMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3.1" y="3.2" width="11.8" height="11.6" rx="2" stroke={color} strokeWidth="1.65" />
      <path d="M6 6.2h6M6 9h6M6 11.8h3.2" stroke={color} strokeWidth="1.55" strokeLinecap="round" />
      <path d="m10.7 10.6 1.5 1.5 2.3-2.7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HouseFinanceMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="m3.2 8.1 5.8-4.7 5.8 4.7" stroke={color} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.7 7.5v6.1h8.6V7.5" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7.1 10.9h3.8M8 8.8v4.8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PulseMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 9h2.4l1.3-2.4 2.1 4.8 1.8-3h4.4" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.8 13.2h10.4" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function BodyGridMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="4.4" r="1.7" stroke={color} strokeWidth="1.5" />
      <path d="M6.4 8.3c.5-.9 1.4-1.4 2.6-1.4 1.2 0 2.1.5 2.6 1.4" stroke={color} strokeWidth="1.45" strokeLinecap="round" />
      <path d="M6 10.2h6M6.5 12.5h5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <rect x="4.5" y="2.8" width="9" height="12.4" rx="3.1" stroke={color} strokeWidth="1.4" opacity="0.72" />
    </svg>
  );
}

function CycleMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3.2a5.8 5.8 0 1 1-4.6 2.3" stroke={color} strokeWidth="1.65" strokeLinecap="round" />
      <path d="m3.8 4.4.6 2.3 2.3-.5" stroke={color} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="1.3" fill={color} />
    </svg>
  );
}

function DropletMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3.1c2 2.6 4.3 4.9 4.3 7.4A4.3 4.3 0 1 1 4.7 10.5C4.7 8 7 5.7 9 3.1Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7.1 11.4c.4 1 1.2 1.6 2.2 1.8" stroke={color} strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function FitnessMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M5.2 6.2 3.4 8l1.8 1.8M12.8 6.2 14.6 8l-1.8 1.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m7 11 4-6" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6.2 12.8h5.6" stroke={color} strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function GrowthMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 13.6V8.9M8.2 13.6V6.8M12.4 13.6V4.9" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <path d="m4.3 9.2 3 1.2 2.7-2.1 3.7-3.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9 4.8h2.3v2.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlaskMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7.1 3.3h3.8M8.1 3.3v3.1l-3 4.5a2.5 2.5 0 0 0 2.1 3.9h3.6a2.5 2.5 0 0 0 2.1-3.9l-3-4.5V3.3" stroke={color} strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M6.7 10.2h4.6" stroke={color} strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function FractionMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="6.1" cy="5.6" r="1.2" fill={color} />
      <circle cx="11.9" cy="12.4" r="1.2" fill={color} />
      <path d="m6.2 12.9 5.6-7.8" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3.9 9h10.2" stroke={color} strokeWidth="1.45" strokeLinecap="round" opacity="0.82" />
    </svg>
  );
}

function RoofMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="m2.9 9 6.1-5.1L15.1 9" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.1 8.4v5h7.8v-5" stroke={color} strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M6.8 10.6h4.4" stroke={color} strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function PaintMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 5h7.1c.8 0 1.4.6 1.4 1.4v1.7H4.8A1.8 1.8 0 0 1 3 6.3V6c0-.55.45-1 1-1Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12.5 7.2h1.9v3.8h-1.9" stroke={color} strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M8 9v4.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RulerGridMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3.2" y="3.2" width="11.6" height="11.6" rx="2.1" stroke={color} strokeWidth="1.55" />
      <path d="M6.4 3.8v2.2M9 3.8v3M11.6 3.8V6M3.8 6.4H6M3.8 9h3M3.8 11.6H6" stroke={color} strokeWidth="1.45" strokeLinecap="round" />
      <path d="M8.3 8.3h4.3v4.3H8.3z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function SleepMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M11.9 3.8a4.7 4.7 0 1 0 2.3 8.8 5.7 5.7 0 1 1-2.3-8.8Z" stroke={color} strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M5.2 5.4h2.2M6.3 4.3v2.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SolarMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M5.1 10.1h7.8l-1.1 3.9H6.2l-1.1-3.9Z" stroke={color} strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M6.4 10.1 7 6.9h4L11.6 10.1" stroke={color} strokeWidth="1.45" strokeLinejoin="round" />
      <path d="M9 3.2v1.8M4.6 4.8l1.3 1.3M13.4 4.8l-1.3 1.3M3.6 8.1h1.8M12.6 8.1h1.8" stroke={color} strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function StatsMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4.2 13.6V9.8M8.4 13.6V6.8M12.6 13.6V4.7" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <path d="m4.3 10.3 2.7-1.8 2.8 1.1 3.9-3" stroke={color} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThermoMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 4.1a1.7 1.7 0 0 1 1.7 1.7v4.5a3.1 3.1 0 1 1-3.4 0V5.8A1.7 1.7 0 0 1 9 4.1Z" stroke={color} strokeWidth="1.55" strokeLinejoin="round" />
      <path d="M9 8.1v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="12.7" r="1.4" fill={color} />
    </svg>
  );
}

function TimeGridMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3.2" y="3.4" width="11.6" height="10.8" rx="2" stroke={color} strokeWidth="1.55" />
      <path d="M5.5 2.7v2M12.5 2.7v2M3.2 6.2h11.6" stroke={color} strokeWidth="1.45" strokeLinecap="round" />
      <circle cx="9" cy="10.2" r="2.3" stroke={color} strokeWidth="1.45" />
      <path d="M9 9v1.5l1 .7" stroke={color} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalculatorMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3.1" y="2.9" width="11.8" height="12.2" rx="2.1" stroke={color} strokeWidth="1.7" />
      <path d="M5.9 6.2h6.2M6.2 9.3h1.9M9.9 9.3h1.9M6.2 12h1.9M9.9 12h1.9" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MathGridMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3.1" y="3.1" width="11.8" height="11.8" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M5.5 7h3M7 5.5v3M10.8 6h2.8M10.8 8.4h2.8M5.6 11.6h2.6M5.6 13.7h2.6" stroke={color} strokeWidth="1.45" strokeLinecap="round" />
      <path d="m11.1 11.1 2.2 2.2M13.3 11.1l-2.2 2.2" stroke={color} strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function ChartMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4.1 13.8V9.6M8.2 13.8V7M12.3 13.8V5.1" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <path d="m3.7 10.3 2.8-2.5 2.5 1.3 3.5-3.1" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.6 5.9h2.2v2.2" stroke={color} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockGridMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="3.3" width="12" height="11.2" rx="2.1" stroke={color} strokeWidth="1.55" />
      <path d="M5.4 2.6v2.1M12.6 2.6v2.1M3 6.3h12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="10.2" r="2.5" stroke={color} strokeWidth="1.5" />
      <path d="M9 8.8v1.6l1.1.7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CompareMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3.2" y="3.5" width="3.9" height="11" rx="1.2" stroke={color} strokeWidth="1.55" />
      <rect x="10.9" y="3.5" width="3.9" height="11" rx="1.2" stroke={color} strokeWidth="1.55" />
      <path d="M7.9 7.1h2.7M9.5 5.8 10.8 7l-1.3 1.2M10.1 10.9H7.4M8.9 9.7 7.6 11 8.9 12.2" stroke={color} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CodeMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 5.2 4.1 9 7 12.8M11 5.2 13.9 9 11 12.8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9.9 4.6-1.8 8.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ToolsMark({ color }) {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <path d="m6.2 9.2 6.9 6.9M11.7 3.9a3.2 3.2 0 0 0 1.7 4.2l-2.2 2.2L9 8.1A3.2 3.2 0 1 1 11.7 3.9Z" stroke={color} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m8.8 11.6-3.2 3.2a1.5 1.5 0 0 1-2.1 0l-.3-.3a1.5 1.5 0 0 1 0-2.1l3.2-3.2" stroke={color} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NibMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="m9 2.6 4.3 2.8v4.8L9 15.4l-4.3-5.2V5.4L9 2.6Z" fill={color} />
      <circle cx="9" cy="8.9" r="1.35" fill="#5f81be" />
      <path d="M9 10.2 7.1 14.1" stroke="#5f81be" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function ImageSearchMark({ color }) {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <rect x="2.9" y="3.2" width="9.2" height="8.6" rx="1.8" stroke={color} strokeWidth="1.6" />
      <path d="m4.6 10 2-2 1.7 1.5 1.1-1.2 1.1 1.6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="6.2" r="0.95" fill={color} />
      <circle cx="12.7" cy="12.9" r="2.4" stroke={color} strokeWidth="1.5" />
      <path d="m14.5 14.7 1.7 1.7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AiImageMark({ color }) {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
      <rect x="2.8" y="3.2" width="8.8" height="8.3" rx="1.8" stroke={color} strokeWidth="1.55" />
      <path d="m4.4 9.6 1.9-2 1.7 1.5 1.2-1.2 1 1.4" stroke={color} strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5.7" cy="6" r="0.9" fill={color} />
      <rect x="10.8" y="9.8" width="5.1" height="5.1" rx="1.3" fill={color} />
      <path d="M12.2 12.35h2.3M13.35 11.2v2.3" stroke="#ab6f9f" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SmileMark({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="6" stroke={color} strokeWidth="1.7" />
      <circle cx="6.8" cy="7.4" r="0.85" fill={color} />
      <circle cx="11.2" cy="7.4" r="0.85" fill={color} />
      <path d="M6.3 10.5c.6 1 1.6 1.5 2.7 1.5 1.2 0 2.2-.5 2.7-1.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
  const int = Number.parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
