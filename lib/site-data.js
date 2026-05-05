import { CATEGORY_COLLECTIONS, TOOL_CATALOG, TOOL_LOOKUP } from "./tool-catalog.js";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.toolslify.com";
export const SITE_NAME = "Toolslify";
export const SITE_DESCRIPTION =
  "Toolslify offers fast online calculators for salary, education ROI, mortgage, tax, cost of living, home projects, health, math, time, cooking, and conversions.";
export const SOCIAL_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Toolslify professional calculators",
};
export const TWITTER_IMAGE_PATH = "/twitter-image";

export const NAV_ITEMS = [
  { href: "/tools", label: "Tools" },
];

export const DIRECTORY_PAGE_SIZE = 48;

export const TRUST_BADGES = [
  "Free core tools",
  "No account required",
  "Instant results",
  "Mobile friendly",
];

export const HERO_METRICS = [
  { value: String(TOOL_CATALOG.length), label: "live tools" },
  { value: String(CATEGORY_COLLECTIONS.length), label: "categories" },
  { value: "0", label: "accounts needed" },
];

export const HOMEPAGE_SEARCH_PROMPTS = [
  "Search salary, mortgage, tax, roof cost, city comparison, calorie, date, and conversion tools...",
  "Try Job Offer True Take-Home Comparator, Mortgage Payment by Home Price, Tax Refund Estimator, or College Offer True Net Cost + Debt Outcome Comparator...",
  "Search college ROI, transfer cost, tuition payback, salary, mortgage, tax, and relocation tools...",
  "Find the right tool in seconds...",
];

export const QUICK_ACCESS_SLUGS = TOOL_CATALOG.filter((tool) => tool.quickAccess).map((tool) => tool.slug);
export const POPULAR_TOOL_SLUGS = TOOL_CATALOG.filter((tool) => tool.popular).map((tool) => tool.slug);

export const HOW_IT_WORKS = [
  {
    title: "Open one focused tool",
    description:
      "Each page is built around a real task like a mortgage estimate, salary benchmark, city comparison, tax plan, calorie target, paint quantity, or quick unit conversion.",
  },
  {
    title: "Paste or calculate once",
    description:
      "The main input stays obvious, the primary action stays central, and the output remains on the same screen so the first run feels fast.",
  },
  {
    title: "Review and reuse",
    description:
      "Each result is designed to be useful immediately, with clear output, copy actions, and related tools close by.",
  },
];

export const USE_CASES = [
  {
    audience: "Money, career, and relocation decisions",
    title: "Check pay, mortgages, taxes, education ROI, city costs, budgets, and debt scenarios quickly",
    body: "The decision-focused sections are built for higher-stakes choices that usually end up scattered across spreadsheets, lender pages, school cost sheets, and relocation notes.",
  },
  {
    audience: "Health and project planning",
    title: "Estimate care costs, body metrics, roofing, paint, remodel costs, and material counts without the mess",
    body: "The broader tool set keeps planning math, cost checks, and practical comparisons in one place instead of making you bounce between niche calculators.",
  },
];

export const HOME_FAQ = [
  {
    question: "What kind of tools does Toolslify focus on now?",
    answer:
      "Toolslify now focuses on decision-ready tool categories like salary data, education ROI, cost of living, mortgage, tax and budget, home costs, health, math, time, cooking, converters, and everyday math.",
  },
  {
    question: "Do I need an account before using the tools?",
    answer: "No. The core tools are available without creating an account.",
  },
  {
    question: "Is this still a random multi-tool site?",
    answer:
      "No. The suite is now organized into focused tool sections so the product feels more consistent and easier to trust.",
  },
  {
    question: "What is the experience like inside each tool?",
    answer:
      "Each tool keeps the main input, primary action, and result on the same page so the answer is easy to review and reuse.",
  },
];

const CATEGORY_PAGE_METADATA = Object.freeze({
  "salary-data": {
    path: "/calculators/salary-data",
    pageTitle: "Salary Data Tools for Offers, Compensation, Pay Planning, and Earnings Decisions",
    description:
      "Browse salary tools for job offers, contractor vs employee math, total compensation, raises, overtime, bonuses, pay cadence, and earnings comparisons.",
    summary:
      "Use Toolslify salary tools to compare offers, pressure-test work models, convert pay across timeframes, and review earnings scenarios without rebuilding a spreadsheet.",
    featuredToolSlugs: [
      "job-offer-true-take-home-comparator",
      "w-2-vs-1099-real-net-pay-planner",
      "pay-raise-after-tax-impact-calculator",
      "career-change-payback-timeline",
    ],
  },
  "cost-of-living": {
    path: "/calculators/cost-of-living",
    pageTitle: "Cost of Living Tools for City Comparison, Relocation, and Affordability Planning",
    description:
      "Browse cost of living tools for city comparisons, relocation budgets, state-to-state move planning, commute math, remote salary adjustments, and household tradeoffs.",
    summary:
      "Use Toolslify cost of living tools to compare cities, model moves, and estimate salary or first-year cashflow changes before you relocate.",
    featuredToolSlugs: [
      "city-vs-city-cost-of-living-comparison",
      "state-to-state-move-cost-and-tax-impact-tool",
      "relocation-budget-planner",
      "remote-salary-adjustment-tool",
    ],
  },
  "education-roi": {
    path: "/calculators/education-roi",
    pageTitle: "Education ROI Tools for College Cost, Degree Payback, Training, and Career Switch Planning",
    description:
      "Browse education ROI tools for college offers, transfer cost, degree delay, tuition payback, certifications, apprenticeships, internships, and career-training decisions.",
    summary:
      "Use Toolslify education ROI tools to compare tuition, debt, salary lift, and timeline tradeoffs before you enroll, transfer, retrain, or borrow.",
    featuredToolSlugs: [
      "college-offer-true-net-cost-debt-outcome-comparator",
      "trade-school-vs-4-year-degree-roi-planner",
      "grad-school-vs-work-now-lifetime-earnings-comparator",
      "community-college-transfer-path-cost-optimizer",
    ],
  },
  "mortgage-data": {
    path: "/calculators/mortgage-data",
    pageTitle: "Mortgage Tools for Payments, Affordability, Refinance, HELOC, and Home Decisions",
    description:
      "Browse mortgage tools for home payments, affordability, closing costs, refinance savings, DTI, HELOC, and rent-vs-buy decisions.",
    summary:
      "Use Toolslify mortgage tools to compare housing scenarios, estimate loan costs, and plan refinance or approval decisions with clearer numbers.",
    featuredToolSlugs: [
      "true-home-affordability-calculator",
      "mortgage-recast-vs-refinance-vs-extra-payment-calculator",
      "buy-vs-rent-with-timeline-calculator",
      "mortgage-payment-by-home-price",
    ],
  },
  "tax-budget": {
    path: "/calculators/tax-budget",
    pageTitle: "Tax and Budget Tools for Refunds, Withholding, 1099 Income, Cashflow, and Monthly Planning",
    description:
      "Browse tax and budget tools for refunds, withholding, 1099 tax, self-employment planning, monthly budgets, emergency funds, runway checks, and care-cost scenarios.",
    summary:
      "Use Toolslify tax and budget tools to estimate taxes, tighten monthly plans, and keep cashflow, savings, and care-cost decisions in one place.",
    featuredToolSlugs: [
      "tax-refund-estimator",
      "w-4-withholding-planner",
      "life-event-cashflow-simulator",
      "layoff-survival-runway-planner",
    ],
  },
  "home-costs": {
    path: "/calculators/home-costs",
    pageTitle: "Home Cost Tools for Roof, Remodel, Paint, HVAC, Solar, and Replacement Pricing",
    description:
      "Browse home cost tools for roof replacement, paint, siding, flooring, remodels, HVAC, solar, and replacement project pricing.",
    summary:
      "Use Toolslify home cost tools to estimate low, expected, and high project pricing before you request bids or commit to a scope.",
    featuredToolSlugs: [
      "roof-replacement-cost-estimator",
      "home-energy-upgrade-payback-planner",
      "hvac-replacement-cost-estimator",
      "kitchen-remodel-cost-estimator",
    ],
  },
  finance: {
    path: "/calculators/finance",
    pageTitle: "Finance Calculators for Pay, Loans, Tax, Debt, and Retirement",
    description:
      "Browse finance calculators for mortgages, paycheck math, taxes, loans, debt payoff, retirement, affordability, and investment planning.",
    summary:
      "Use Toolslify finance calculators to compare payments, model tax outcomes, estimate retirement growth, and make cleaner money decisions without rebuilding a spreadsheet.",
    featuredToolSlugs: [
      "paycheck-calculator",
      "student-loan-repayment-strategy-simulator",
      "credit-card-payoff-calculator",
      "retirement-calculator",
    ],
  },
  health: {
    path: "/calculators/health",
    pageTitle: "Health Calculators for Calories, TDEE, Body Fat, and Fitness",
    description:
      "Browse health calculators for calories, TDEE, body fat, protein intake, ovulation, pace, heart rate, and training math.",
    summary:
      "Use Toolslify health calculators to estimate calorie targets, fitness zones, body metrics, and cycle timing in the browser.",
  },
  home: {
    path: "/calculators/home",
    pageTitle: "Home Project Calculators for Roofing, Paint, Concrete, and Materials",
    description:
      "Browse home project calculators for roofing, paint, concrete, tile, drywall, decking, fencing, topsoil, sod, and pavers.",
    summary:
      "Use Toolslify home calculators to estimate material counts, coverage, and project quantities before you buy or quote anything.",
  },
  math: {
    path: "/calculators/math",
    pageTitle: "Math Calculators for GPA, Fractions, Statistics, and Scientific Work",
    description:
      "Browse math calculators for GPA, grades, fractions, decimals, averages, scientific operations, and statistics.",
    summary:
      "Use Toolslify math calculators to solve classroom, spreadsheet, and number-heavy tasks faster without leaving the browser.",
  },
  time: {
    path: "/calculators/time",
    pageTitle: "Time Calculators for Hours, Durations, Work Schedules, and Sleep",
    description:
      "Browse time calculators for time addition, durations, hours, work schedules, and sleep timing.",
    summary:
      "Use Toolslify time calculators to handle clock math, work-hour totals, and repeat scheduling checks with less friction.",
  },
  everyday: {
    path: "/calculators/everyday",
    pageTitle: "Everyday Calculators for Dates, Percentages, and Practical Math",
    description:
      "Browse everyday calculators for dates, percentages, grade math, electricity, numerals, and practical browser-based calculations.",
    summary:
      "Use Toolslify everyday calculators for fast checks, scheduling math, and day-to-day numbers that should not require a spreadsheet.",
  },
  cooking: {
    path: "/calculators/cooking",
    pageTitle: "Cooking Calculators and Kitchen Conversion Tools",
    description:
      "Browse cooking calculators for cups, grams, teaspoons, butter, oven temperatures, air fryer conversions, and recipe prep.",
    summary:
      "Use Toolslify cooking calculators to convert recipe measurements and kitchen temperatures quickly without breaking your flow.",
  },
  converters: {
    path: "/calculators/converters",
    pageTitle: "Unit Conversion Calculators for Length, Weight, Area, and Energy",
    description:
      "Browse converter tools for length, volume, weight, area, power, energy, storage, pressure, speed, and utility math.",
    summary:
      "Use Toolslify converters to switch units quickly across the measurements people repeatedly need in work, home, and everyday life.",
  },
});

export function getAllTools() {
  return TOOL_CATALOG;
}

export function getToolBySlug(slug) {
  return TOOL_LOOKUP[slug] || null;
}

export function getFeaturedTools() {
  return getPopularTools();
}

export function getCoreTools() {
  return getAllTools();
}

export function getSearchIntentTools() {
  return getPopularTools();
}

export function getToolsBySlugs(slugs = []) {
  return slugs.map((slug) => getToolBySlug(slug)).filter(Boolean);
}

export function getQuickAccessTools() {
  return getToolsBySlugs(QUICK_ACCESS_SLUGS);
}

export function getPopularTools() {
  return getToolsBySlugs(POPULAR_TOOL_SLUGS);
}

export function getQuickAccessToolCards() {
  return getQuickAccessTools().map(toToolCardData);
}

export function getPopularToolCards() {
  return getPopularTools().map(toToolCardData);
}

export function getToolCategoryCollections() {
  return CATEGORY_COLLECTIONS.map((category) => ({
    ...category,
    count: category.tools.length,
    pagePath: getCategoryPagePath(category.slug),
  }));
}

export function getToolCategorySummaries() {
  const popularSet = new Set(POPULAR_TOOL_SLUGS);

  return CATEGORY_COLLECTIONS.map((category) => {
    const featuredTool =
      category.tools.find((tool) => popularSet.has(tool.slug)) || category.tools[0] || null;

    return {
      slug: category.slug,
      title: category.title,
      description: category.description,
      accent: category.accent,
      tint: category.tint,
      count: category.tools.length,
      pagePath: getCategoryPagePath(category.slug),
      featuredTool: featuredTool ? toToolCardData(featuredTool) : null,
    };
  });
}

export function getHomepageFeaturedToolCards(limit = 24) {
  return sortToolsForDirectory(getAllTools()).slice(0, limit).map(toToolCardData);
}

export function getDirectoryPageData({
  query = "",
  category = "",
  page = 1,
  pageSize = DIRECTORY_PAGE_SIZE,
} = {}) {
  const normalizedQuery = normalizeDirectoryText(query);
  const normalizedCategory = normalizeDirectoryText(category);
  const categoryFilter = normalizedCategory && normalizedCategory !== "all" ? normalizedCategory : "";
  const filteredTools = sortToolsForDirectory(
    getAllTools().filter((tool) => {
      if (categoryFilter && tool.categorySlug !== categoryFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return getToolSearchIndex(tool).includes(normalizedQuery);
    }),
  );
  const totalCount = filteredTools.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = clampPageNumber(page, totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    tools: filteredTools.slice(start, start + pageSize).map(toToolCardData),
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    query: normalizedQuery,
    rawQuery: String(query || "").trim(),
    category: categoryFilter,
    hasQuery: normalizedQuery.length > 0,
    hasFilters: Boolean(normalizedQuery || categoryFilter),
  };
}

export function getCategoryPagePath(slug) {
  return CATEGORY_PAGE_METADATA[slug]?.path || `/tools#${slug}`;
}

export function getCategoryPageBySlug(slug) {
  const category = CATEGORY_COLLECTIONS.find((item) => item.slug === slug);
  const page = CATEGORY_PAGE_METADATA[slug];
  if (!category || !page) return null;

  const popularSet = new Set(POPULAR_TOOL_SLUGS);
  const quickAccessSet = new Set(QUICK_ACCESS_SLUGS);
  const toolOrder = new Map(TOOL_CATALOG.map((tool, index) => [tool.slug, index]));
  const featuredToolOrder = new Map((page.featuredToolSlugs || []).map((toolSlug, index) => [toolSlug, index]));
  const tools = [...category.tools].sort((left, right) => {
    const leftFeaturedOrder = featuredToolOrder.get(left.slug);
    const rightFeaturedOrder = featuredToolOrder.get(right.slug);
    if (leftFeaturedOrder !== undefined || rightFeaturedOrder !== undefined) {
      if (leftFeaturedOrder === undefined) return 1;
      if (rightFeaturedOrder === undefined) return -1;
      return leftFeaturedOrder - rightFeaturedOrder;
    }

    const leftPopularScore = popularSet.has(left.slug) ? 1 : 0;
    const rightPopularScore = popularSet.has(right.slug) ? 1 : 0;
    if (leftPopularScore !== rightPopularScore) return rightPopularScore - leftPopularScore;

    const leftQuickScore = quickAccessSet.has(left.slug) ? 1 : 0;
    const rightQuickScore = quickAccessSet.has(right.slug) ? 1 : 0;
    if (leftQuickScore !== rightQuickScore) return rightQuickScore - leftQuickScore;

    return (toolOrder.get(left.slug) ?? 0) - (toolOrder.get(right.slug) ?? 0);
  });

  return {
    ...category,
    ...page,
    categoryDescription: category.description,
    count: tools.length,
    tools,
    featuredTools: page.featuredToolSlugs?.length
      ? page.featuredToolSlugs.map((toolSlug) => tools.find((tool) => tool.slug === toolSlug)).filter(Boolean)
      : tools.slice(0, 4),
  };
}

export function getCategoryPages() {
  return Object.keys(CATEGORY_PAGE_METADATA)
    .map((slug) => getCategoryPageBySlug(slug))
    .filter(Boolean);
}

export function getRelatedTools(currentSlug, limit = 3) {
  const currentTool = getToolBySlug(currentSlug);
  if (!currentTool) return [];

  const sameCategory = getAllTools().filter(
    (tool) => tool.slug !== currentSlug && tool.categorySlug === currentTool.categorySlug,
  );
  const sameWorkspace = getAllTools().filter(
    (tool) => tool.slug !== currentSlug && tool.workspace === currentTool.workspace,
  );
  const fallback = getAllTools().filter((tool) => tool.slug !== currentSlug);
  const merged = [];

  [sameCategory, sameWorkspace, fallback].forEach((pool) => {
    pool.forEach((tool) => {
      if (!merged.find((item) => item.slug === tool.slug)) {
        merged.push(tool);
      }
    });
  });

  return merged.slice(0, limit);
}

export function getToolShortDescription(toolOrSlug) {
  const tool = typeof toolOrSlug === "string" ? getToolBySlug(toolOrSlug) : toolOrSlug;
  return tool?.description || "Open the tool and get a useful result quickly.";
}

export function toToolCardData(tool) {
  if (!tool) return null;

  return {
    slug: tool.slug,
    name: tool.name,
    shortName: tool.shortName,
    description: tool.description,
    category: tool.category,
    categorySlug: tool.categorySlug,
    categoryColor: tool.categoryColor,
    path: tool.path,
  };
}

function sortToolsForDirectory(tools) {
  const popularSet = new Set(POPULAR_TOOL_SLUGS);
  const quickAccessSet = new Set(QUICK_ACCESS_SLUGS);

  return [...tools].sort((left, right) => {
    const leftPopularScore = popularSet.has(left.slug) ? 1 : 0;
    const rightPopularScore = popularSet.has(right.slug) ? 1 : 0;
    if (leftPopularScore !== rightPopularScore) return rightPopularScore - leftPopularScore;

    const leftQuickScore = quickAccessSet.has(left.slug) ? 1 : 0;
    const rightQuickScore = quickAccessSet.has(right.slug) ? 1 : 0;
    if (leftQuickScore !== rightQuickScore) return rightQuickScore - leftQuickScore;

    return left.name.localeCompare(right.name);
  });
}

function getToolSearchIndex(tool) {
  return [
    tool.name,
    tool.shortName,
    tool.category,
    tool.description,
    tool.slug.replaceAll("-", " "),
    ...(tool.keywords || []),
    ...(tool.useCases || []),
  ]
    .join(" ")
    .toLowerCase();
}

function normalizeDirectoryText(value) {
  return String(value || "").trim().toLowerCase();
}

function clampPageNumber(value, totalPages) {
  const numericValue = Number.parseInt(String(value || "1"), 10);
  if (!Number.isFinite(numericValue) || numericValue < 1) {
    return 1;
  }

  return Math.min(numericValue, totalPages);
}
