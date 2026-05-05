import { getCategoryPagePath, getToolBySlug } from "./site-data.js";
import { getCalculatorSupportContent } from "./calculator-support-content.js";

const CATEGORY_CONTENT = Object.freeze({
  "salary-data": {
    intentPaths: ["job offers", "contractor vs employee", "remote vs onsite", "bonus and overtime", "total compensation", "career payoff"],
    clusterHeading: "Why compensation tools need scenario depth",
    clusterParagraphs: [
      "Compensation tools are stronger when they connect take-home pay, work-model tradeoffs, overtime, and total-comp views instead of stopping at one broad salary number.",
      "That gives both users and search engines a cleaner decision path: compare offers, check contractor math, pressure-test raise impact, then move into career or education payoff questions.",
    ],
    primaryTitle: "Keep the salary path moving",
    primarySlugs: [
      "job-offer-true-take-home-comparator",
      "w-2-vs-1099-real-net-pay-planner",
      "total-compensation-calculator",
      "remote-vs-onsite-pay-comparison",
      "pay-raise-after-tax-impact-calculator",
      "contractor-vs-employee-pay-comparison",
    ],
    secondaryTitle: "Add deeper compensation context",
    secondarySlugs: [
      "freelancer-rate-reality-calculator",
      "career-change-payback-timeline",
      "commission-income-planner",
      "overtime-earnings-planner",
      "shift-differential-pay-tool",
      "certification-roi-promotion-odds-planner",
    ],
    categoryDescription: "Open the full salary cluster for offer math, pay cadence, contractor tradeoffs, and total-comp planning.",
  },
  "cost-of-living": {
    intentPaths: ["city vs city", "state-to-state move", "remote pay adjustment", "commute cost", "relocation budget", "childcare tradeoffs"],
    clusterHeading: "Why relocation tools need follow-through planning paths",
    clusterParagraphs: [
      "Cost of living tools work best when they connect city comparisons with relocation budgets, commute math, state-to-state moves, and salary adjustment planning instead of acting like isolated widgets.",
      "People usually move from a broad city-vs-city question into more specific paths like remote pay, household cost changes, or the full first-year move budget. Internal links should mirror that journey.",
    ],
    primaryTitle: "Go deeper on city and relocation planning",
    primarySlugs: [
      "city-vs-city-cost-of-living-comparison",
      "state-to-state-move-cost-and-tax-impact-tool",
      "relocation-budget-planner",
      "salary-after-relocation-estimator",
      "remote-salary-adjustment-tool",
      "metro-vs-suburb-cost-comparison",
    ],
    secondaryTitle: "Expand the affordability path",
    secondarySlugs: [
      "commute-cost-calculator",
      "international-move-cost-planner",
      "childcare-vs-stay-at-home-parent-calculator",
      "life-event-cashflow-simulator",
      "buy-vs-rent-with-timeline-calculator",
    ],
    categoryDescription: "Open the full cost-of-living hub for city comparisons, relocation math, and affordability tools.",
  },
  "education-roi": {
    intentPaths: ["college offer ROI", "trade school vs degree", "transfer cost", "tuition payback", "career switch ROI", "study delay cost"],
    clusterHeading: "Why education ROI tools need payback, debt, and delay paths",
    clusterParagraphs: [
      "Education tools work best when they connect tuition, grants, debt, transfer friction, training time, and post-program pay instead of stopping at one generic cost figure.",
      "People usually move from a broad college or training question into more specific paths like transfer delay, career-switch payback, reimbursement strategy, or debt stress. The internal links should mirror that decision path.",
    ],
    primaryTitle: "Go deeper on education ROI",
    primarySlugs: [
      "college-offer-true-net-cost-debt-outcome-comparator",
      "trade-school-vs-4-year-degree-roi-planner",
      "grad-school-vs-work-now-lifetime-earnings-comparator",
      "college-major-roi-loan-stress-comparator",
      "community-college-transfer-path-cost-optimizer",
      "employer-tuition-reimbursement-vs-student-loan-payoff-planner",
    ],
    secondaryTitle: "Expand the training and delay path",
    secondarySlugs: [
      "transfer-credit-graduation-delay-cost-planner",
      "bootcamp-vs-self-taught-career-switch-roi-planner",
      "certification-roi-promotion-odds-planner",
      "internship-offer-vs-part-time-work-income-planner",
      "study-abroad-semester-budget-degree-delay-planner",
      "license-exam-retake-delay-cost-planner",
    ],
    categoryDescription: "Open the full education ROI cluster for college cost, transfer math, tuition payback, and career-training tools.",
  },
  "mortgage-data": {
    intentPaths: ["by home price", "by payment", "by refinance scenario", "by approval limit", "by program", "rent vs buy"],
    clusterHeading: "Why mortgage tools should branch into approval, refinance, and decision paths",
    clusterParagraphs: [
      "Mortgage pages rarely stop at one payment estimate. Stronger tool clusters connect home-price math with affordability, closing costs, refinance savings, approval checks, and rent-vs-buy style decision pages.",
      "That makes the page more useful in practice and gives search engines a clearer view of the full housing decision cluster around the tool.",
    ],
    primaryTitle: "Keep the mortgage decision moving",
    primarySlugs: [
      "mortgage-payment-by-home-price",
      "true-home-affordability-calculator",
      "closing-costs-calculator",
      "mortgage-recast-vs-refinance-vs-extra-payment-calculator",
      "debt-to-income-approval-checker",
      "buy-vs-rent-with-timeline-calculator",
    ],
    secondaryTitle: "Compare the next housing scenarios",
    secondarySlugs: [
      "cash-out-refinance-estimator",
      "rate-buydown-savings-calculator",
      "heloc-payment-calculator",
      "buy-now-vs-wait-comparison",
      "home-energy-upgrade-payback-planner",
    ],
    categoryDescription: "Open the full mortgage hub for payment, refinance, HELOC, approval, and housing decision tools.",
  },
  "tax-budget": {
    intentPaths: ["refund estimate", "withholding changes", "1099 tax", "household budget", "cashflow runway", "health-plan cost"],
    clusterHeading: "Why tax and budget tools need cashflow follow-through",
    clusterParagraphs: [
      "Tax and budget tools are stronger when they connect refund math, withholding changes, self-employment tax, and monthly planning instead of stopping at one tax estimate.",
      "Users rarely stop after one result. They usually want to know what it means for monthly cash flow, emergency reserves, healthcare costs, or a longer runway plan.",
    ],
    primaryTitle: "Keep the tax and budget flow going",
    primarySlugs: [
      "tax-refund-estimator",
      "w-4-withholding-planner",
      "1099-tax-estimator",
      "self-employment-tax-planner",
      "monthly-budget-planner",
      "life-event-cashflow-simulator",
    ],
    secondaryTitle: "Move from tax math into planning",
    secondarySlugs: [
      "bonus-tax-estimator",
      "rmd-tax-estimator",
      "emergency-fund-calculator",
      "layoff-survival-runway-planner",
      "family-health-plan-total-cost-estimator",
      "medicare-plan-cost-comparator",
    ],
    categoryDescription: "Open the full tax and budget hub for refunds, withholding, self-employment tax, budgets, runway, and care-cost planning.",
  },
  "home-costs": {
    intentPaths: ["by state", "by size", "by material", "low vs high quote", "replace vs remodel", "system type"],
    clusterHeading: "Why home cost pages need size, material, and scope depth",
    clusterParagraphs: [
      "Home project pages usually perform better when they connect cost by state, size, material, and finish level instead of acting like one isolated estimate page.",
      "People often arrive with a rough pricing query, then move into more specific paths like material choice, project size, system type, or nearby replacement work. Internal links should help them continue that pricing journey.",
    ],
    primaryTitle: "Go deeper on project pricing",
    primarySlugs: [
      "roof-replacement-cost-estimator",
      "window-replacement-cost-estimator",
      "flooring-installation-cost-estimator",
      "hvac-replacement-cost-estimator",
      "kitchen-remodel-cost-estimator",
      "bathroom-remodel-cost-estimator",
    ],
    secondaryTitle: "Compare nearby home cost tools",
    secondarySlugs: [
      "siding-cost-by-material",
      "exterior-paint-cost-estimator",
      "interior-room-paint-cost-estimator",
      "concrete-slab-cost-by-size",
      "solar-panel-installation-cost",
      "home-energy-upgrade-payback-planner",
    ],
    categoryDescription: "Open the full home-cost hub for replacement, remodel, and material pricing tools.",
  },
  finance: {
    intentPaths: ["payment", "tax impact", "debt payoff", "rate comparison", "savings growth", "salary effect"],
    clusterHeading: "Why finance tools should stay connected",
    clusterParagraphs: [
      "Finance tools tend to perform better when payment, tax, debt, rate, and savings scenarios are linked together instead of living as isolated calculators.",
      "That helps both repeat use and SEO because people usually move through multiple money questions before the decision is finished.",
    ],
    primaryTitle: "Continue the money calculation",
    primarySlugs: [
      "mortgage-calculator",
      "credit-card-payoff-calculator",
      "retirement-calculator",
      "paycheck-calculator",
      "sales-tax-calculator",
      "student-loan-repayment-strategy-simulator",
    ],
    secondaryTitle: "Compare adjacent finance tools",
    secondarySlugs: [
      "loan-calculator",
      "compound-interest-calculator",
      "savings-calculator",
      "hourly-to-salary-calculator",
      "salary-to-hourly-calculator",
      "true-home-affordability-calculator",
    ],
    categoryDescription: "Open the full finance category for money, debt, tax, and retirement tools.",
  },
  home: {
    intentPaths: ["material count", "coverage", "quote check", "project size", "replacement range", "by room or area"],
    clusterHeading: "Why home project tools need adjacent material and pricing links",
    clusterParagraphs: [
      "Home project tools become more useful when quantity math, coverage checks, and replacement pricing sit close together instead of forcing people to search again from scratch.",
      "That structure also helps search engines understand that the page belongs to a broader project-planning cluster instead of acting like a disconnected utility.",
    ],
    primaryTitle: "Continue the home project path",
    primarySlugs: [
      "roofing-calculator",
      "paint-calculator",
      "concrete-calculator",
      "tile-calculator",
      "drywall-calculator",
      "flooring-installation-cost-estimator",
    ],
    secondaryTitle: "Check nearby project tools",
    secondarySlugs: [
      "decking-calculator",
      "fence-calculator",
      "gravel-calculator",
      "mulch-calculator",
      "square-footage-calculator",
      "price-per-square-foot",
    ],
    categoryDescription: "Open the full home projects category for coverage, counts, and material estimators.",
  },
});

const TOOL_PROFILES = [
  {
    test: /roof/,
    intentPaths: ["by state", "by square foot", "by material", "replacement range", "roofing vs replacement", "quote planning"],
    primaryTitle: "Deeper roofing cost paths",
    primarySlugs: [
      "roof-replacement-cost-estimator",
      "siding-cost-by-material",
      "solar-panel-installation-cost",
      "roofing-calculator",
    ],
    secondaryTitle: "Nearby exterior project tools",
    secondarySlugs: [
      "siding-cost-by-material",
      "exterior-paint-cost-estimator",
      "window-replacement-cost-estimator",
      "solar-panel-installation-cost",
    ],
    sectionHeading: "Why roofing pages need state, size, and material depth",
    sectionParagraphs: [
      "Roofing intent usually gets more specific fast. People often start with a broad replacement question, then shift into state pricing, square-foot math, or material comparisons before they are ready to request bids.",
      "That is why roofing pages should be internally linked to size-based, state-based, and material-based versions instead of standing alone as one generic estimate.",
    ],
  },
  {
    test: /salary|compensation|job-offer|bonus|commission|overtime|shift|freelance|paycheck/,
    intentPaths: ["job offers", "contractor vs employee", "remote vs onsite", "bonus and overtime", "pay cadence", "career payoff"],
    primaryTitle: "Deeper salary and compensation paths",
    primarySlugs: [
      "job-offer-true-take-home-comparator",
      "w-2-vs-1099-real-net-pay-planner",
      "total-compensation-calculator",
      "remote-vs-onsite-pay-comparison",
      "pay-raise-after-tax-impact-calculator",
    ],
    secondaryTitle: "Move from pay into related planning",
    secondarySlugs: [
      "freelancer-rate-reality-calculator",
      "career-change-payback-timeline",
      "commission-income-planner",
      "overtime-earnings-planner",
      "certification-roi-promotion-odds-planner",
    ],
    sectionHeading: "Why salary tools need scenario, take-home, and payoff coverage",
    sectionParagraphs: [
      "Compensation intent usually branches into take-home pay, work-model tradeoffs, and career payoff questions instead of staying on one generic salary page.",
      "Internal links between offer math, contractor comparisons, overtime planning, and career-switch tools make the compensation cluster more useful and much easier to understand as a real decision path.",
    ],
  },
  {
    test: /college|degree|tuition|transfer|bootcamp|certification|internship|apprenticeship|study-abroad|license-exam|masters|major-roi/,
    intentPaths: ["college offer ROI", "training payback", "transfer delay", "loan stress", "career switch ROI", "tuition reimbursement"],
    primaryTitle: "Deeper education ROI paths",
    primarySlugs: [
      "college-offer-true-net-cost-debt-outcome-comparator",
      "trade-school-vs-4-year-degree-roi-planner",
      "grad-school-vs-work-now-lifetime-earnings-comparator",
      "community-college-transfer-path-cost-optimizer",
      "college-major-roi-loan-stress-comparator",
      "employer-tuition-reimbursement-vs-student-loan-payoff-planner",
    ],
    secondaryTitle: "Move from tuition math into delay and career paths",
    secondarySlugs: [
      "transfer-credit-graduation-delay-cost-planner",
      "bootcamp-vs-self-taught-career-switch-roi-planner",
      "certification-roi-promotion-odds-planner",
      "internship-offer-vs-part-time-work-income-planner",
      "study-abroad-semester-budget-degree-delay-planner",
      "license-exam-retake-delay-cost-planner",
    ],
    sectionHeading: "Why education ROI tools need cost, debt, and timeline depth",
    sectionParagraphs: [
      "Education decisions rarely stop at tuition. People usually need to compare time to earnings, debt at completion, delay risk, and salary lift before the choice feels real.",
      "That is why these pages should link into transfer, delay, debt, and post-program payback tools instead of acting like isolated tuition calculators.",
    ],
  },
  {
    test: /cost-of-living|relocation|city|rent-comparison|grocery|utilities|childcare|salary-needed/,
    intentPaths: ["city vs city", "state-to-state move", "relocation budget", "remote pay adjustment", "commute cost", "household tradeoffs"],
    primaryTitle: "Deeper city and relocation paths",
    primarySlugs: [
      "city-vs-city-cost-of-living-comparison",
      "state-to-state-move-cost-and-tax-impact-tool",
      "relocation-budget-planner",
      "salary-after-relocation-estimator",
    ],
    secondaryTitle: "Keep the affordability path moving",
    secondarySlugs: [
      "remote-salary-adjustment-tool",
      "metro-vs-suburb-cost-comparison",
      "commute-cost-calculator",
      "international-move-cost-planner",
      "childcare-vs-stay-at-home-parent-calculator",
    ],
    sectionHeading: "Why city pages need relocation and household-decision depth",
    sectionParagraphs: [
      "City comparison tools work best when they lead naturally into relocation budgets, salary adjustments, commute math, and household tradeoff paths.",
      "That is usually how the real decision unfolds: compare two places, understand the cost jump, then pressure-test monthly cash flow and moving costs before committing.",
    ],
  },
  {
    test: /mortgage|refinance|heloc|affordability|closing-cost|buydown|recast|credit-score|dti|rent-vs-buy|buy-now/,
    intentPaths: ["by home price", "by payment", "by refinance scenario", "by program", "approval check", "rent vs buy"],
    primaryTitle: "Deeper mortgage and housing paths",
    primarySlugs: [
      "mortgage-payment-by-home-price",
      "true-home-affordability-calculator",
      "closing-costs-calculator",
      "mortgage-recast-vs-refinance-vs-extra-payment-calculator",
      "debt-to-income-approval-checker",
      "buy-vs-rent-with-timeline-calculator",
    ],
    secondaryTitle: "Keep the housing decision moving",
    secondarySlugs: [
      "cash-out-refinance-estimator",
      "rate-buydown-savings-calculator",
      "heloc-payment-calculator",
      "home-energy-upgrade-payback-planner",
      "buy-now-vs-wait-comparison",
    ],
    sectionHeading: "Why mortgage tools should connect payment, approval, and refinance paths",
    sectionParagraphs: [
      "Housing intent usually moves through multiple pages before the decision is finished. Payment math leads into affordability, closing costs, refinance savings, or approval checks.",
      "Linking those pages tightly makes the tool more useful in practice and gives the mortgage cluster much stronger internal structure.",
    ],
  },
  {
    test: /tax|refund|withholding|1099|self-employment|capital-gains|rmd|budget|debt|emergency|net-worth/,
    intentPaths: ["refund estimate", "withholding change", "1099 tax", "budget plan", "cashflow runway", "care-cost planning"],
    primaryTitle: "Deeper tax and budget paths",
    primarySlugs: [
      "tax-refund-estimator",
      "w-4-withholding-planner",
      "1099-tax-estimator",
      "self-employment-tax-planner",
      "monthly-budget-planner",
      "life-event-cashflow-simulator",
    ],
    secondaryTitle: "Move from tax math into planning",
    secondarySlugs: [
      "bonus-tax-estimator",
      "rmd-tax-estimator",
      "emergency-fund-calculator",
      "layoff-survival-runway-planner",
      "family-health-plan-total-cost-estimator",
    ],
    sectionHeading: "Why tax pages should branch into cashflow and planning pages",
    sectionParagraphs: [
      "Tax queries often turn into planning queries right after the first estimate. People want to know what the number means for monthly cash flow, reserves, healthcare costs, or a 1099 runway plan.",
      "That is why the tax pages should link directly into withholding, budget, runway, and care-cost tools instead of acting like isolated calculators.",
    ],
  },
];

const DEFAULT_CONTENT = Object.freeze({
  intentPaths: ["related scenarios", "supporting comparisons", "next-step planning"],
  clusterHeading: "Why connected tool paths matter",
  clusterParagraphs: [
    "Most users do not stop after one calculation. They move into a related scenario, a supporting comparison, or a next-step planning question right after the first result.",
    "A stronger tool page makes that next click easy, which improves both user flow and the internal structure of the broader site.",
  ],
  primaryTitle: "Continue with related tools",
  primarySlugs: [],
  secondaryTitle: "Browse related tools",
  secondarySlugs: [],
  categoryDescription: "Open the broader category to explore more tools related to this topic.",
});

export function getToolPageContent(tool) {
  const primaryKeyword = tool.keywords?.[0] || tool.name.toLowerCase();
  const secondaryKeyword = tool.keywords?.[1] || `${tool.name.toLowerCase()} online`;
  const relatedKeywordBlend = [primaryKeyword, secondaryKeyword, ...(tool.keywords || []).slice(2, 4)].filter(Boolean);
  const categoryContent = CATEGORY_CONTENT[tool.categorySlug] || DEFAULT_CONTENT;
  const profile = TOOL_PROFILES.find((item) => item.test.test(tool.slug)) || null;
  const intentPaths = profile?.intentPaths || categoryContent.intentPaths || DEFAULT_CONTENT.intentPaths;
  const linkSections = buildLinkSections(tool, categoryContent, profile);
  const calculatorSupport = tool.workspace === "calculator" ? getCalculatorSupportContent(tool) : null;
  const articleIntro = buildArticleIntro(tool, primaryKeyword, intentPaths, calculatorSupport);
  const sections = buildArticleSections({
    tool,
    primaryKeyword,
    relatedKeywordBlend,
    intentPaths,
    categoryContent,
    profile,
    calculatorSupport,
  });

  return {
    heroTitle: tool.headline,
    heroLead: tool.description,
    primaryKeyword,
    secondaryKeyword,
    intentPaths,
    linkSections,
    articleIntro,
    comparisonCards: [
      {
        title: "Best for",
        points: tool.useCases.slice(0, 3),
      },
      {
        title: "Compare next",
        points: intentPaths.slice(0, 3).map((item) => `Check ${item} if you need a tighter planning view.`),
      },
    ],
    howToSteps: [
      {
        title: "Start with the main scenario",
        body: `Begin with ${tool.inputTitle.toLowerCase()} and get the first clean answer before you branch into related scenarios like ${intentPaths.slice(0, 3).join(", ")}.`,
      },
      {
        title: "Run the core action once",
        body: `Click ${tool.ctaLabel.toLowerCase()} and keep the result on the same page so it stays easy to review without extra steps.`,
      },
      {
        title: "Continue into the next decision",
        body: `Use the result and the linked follow-up tools to move into the deeper paths that usually come next for this topic instead of restarting the search from scratch.`,
      },
    ],
    calculatorSupport,
    sections,
  };
}

function buildArticleIntro(tool, primaryKeyword, intentPaths, calculatorSupport) {
  const useCases = summarizeList(tool.useCases.slice(0, 3), "quick planning");
  const nextChecks = summarizeList(intentPaths.slice(0, 3), "nearby comparisons");
  const intro = [
    `${tool.description} Use this page when you want a fast answer for ${useCases} without rebuilding the math by hand or jumping between tabs.`,
    `Most people use ${tool.shortName.toLowerCase()} as a first-pass estimate, then compare ${nextChecks} before making a final call.`,
  ];

  if (calculatorSupport?.sourceReview) {
    intro.push("The guide below explains how the estimate is put together, what can skew it, and what to verify before you act on the result.");
  }

  return intro.slice(0, 2);
}

function buildArticleSections({
  tool,
  primaryKeyword,
  relatedKeywordBlend,
  intentPaths,
  categoryContent,
  profile,
  calculatorSupport,
}) {
  const useCases = summarizeList(tool.useCases.slice(0, 4), "common planning questions");
  const followUpChecks = summarizeList(intentPaths.slice(0, 4), "related scenarios");
  const sourceLabels = calculatorSupport?.sourceReview?.sources?.map((item) => item.label) || [];
  const methodologyText = calculatorSupport?.methodology?.length
    ? calculatorSupport.methodology.join(" ")
    : `Enter the key assumptions, run the main action, and review the result before you move into related scenarios.`;
  const assumptionsText = calculatorSupport?.assumptions?.length
    ? calculatorSupport.assumptions.join(" ")
    : `The result depends on the assumptions entered into the tool, so the real number can move when those conditions change.`;
  const limitationText = calculatorSupport?.whenWrong?.length
    ? calculatorSupport.whenWrong.join(" ")
    : `Use the result as a first estimate, then confirm against source documents or real quotes before you rely on it.`;
  const comparisonContext = (profile?.sectionParagraphs || categoryContent.clusterParagraphs || DEFAULT_CONTENT.clusterParagraphs).join(" ");

  return [
    {
      heading: `What the ${tool.shortName.toLowerCase()} helps you answer`,
      paragraphs: [
        `People usually search for ${relatedKeywordBlend.join(", ")} when they want a direct answer for ${useCases}. This page keeps the calculator first so you can get the number before digging into the surrounding details.`,
        `The result is meant to be practical, not decorative. You can run the estimate, adjust the assumptions, and move into nearby decisions without starting over from scratch.`,
      ],
    },
    {
      heading: calculatorSupport ? `How to calculate ${primaryKeyword}` : `How the ${tool.shortName.toLowerCase()} works`,
      paragraphs: calculatorSupport
        ? [
            calculatorSupport.formula,
            methodologyText,
          ]
        : [
            `The tool takes the main values you enter and converts them into a usable estimate for ${primaryKeyword}.`,
            methodologyText,
          ],
    },
    {
      heading: "What can change the result",
      paragraphs: [
        assumptionsText,
        limitationText,
      ],
    },
    {
      heading: "Related comparisons people make after this",
      paragraphs: [
        `Once they have the first answer, most users compare ${followUpChecks} before they commit to the next step.`,
        comparisonContext,
      ],
    },
    {
      heading: "What to review before acting on the result",
      paragraphs: [
        calculatorSupport?.sourceReview?.note ||
          `Use the estimate for planning first, then compare it against the source documents that govern your exact case.`,
        sourceLabels.length
          ? `For higher-stakes decisions, confirm the number against sources such as ${summarizeList(sourceLabels, "the relevant source documents")}.`
          : `For higher-stakes decisions, confirm the number against ${getVerificationReference(tool.categorySlug)}.`,
      ],
    },
  ];
}

function buildLinkSections(tool, categoryContent, profile) {
  const sections = [];
  const primaryLinks = resolveLinks(profile?.primarySlugs || categoryContent.primarySlugs || [], tool.slug);
  const secondaryLinks = resolveLinks(profile?.secondarySlugs || categoryContent.secondarySlugs || [], tool.slug);

  if (primaryLinks.length) {
    sections.push({
      title: profile?.primaryTitle || categoryContent.primaryTitle || DEFAULT_CONTENT.primaryTitle,
      items: primaryLinks,
    });
  }

  if (secondaryLinks.length) {
    sections.push({
      title: profile?.secondaryTitle || categoryContent.secondaryTitle || DEFAULT_CONTENT.secondaryTitle,
      items: secondaryLinks,
    });
  }

  sections.push({
    title: `Browse the full ${tool.category}`,
    items: [
      {
        label: `Open the ${tool.category} category`,
        href: getCategoryPagePath(tool.categorySlug),
        description: categoryContent.categoryDescription || DEFAULT_CONTENT.categoryDescription,
      },
    ],
  });

  return sections;
}

function resolveLinks(slugs, currentSlug) {
  const seen = new Set();

  return slugs
    .map((slug) => getToolBySlug(slug))
    .filter((tool) => tool && tool.slug !== currentSlug)
    .filter((tool) => {
      if (seen.has(tool.slug)) return false;
      seen.add(tool.slug);
      return true;
    })
    .map((tool) => ({
      label: tool.name,
      href: tool.path,
      description: tool.description,
    }));
}

function summarizeList(items, fallback = "related decisions") {
  const cleaned = items.map((item) => String(item || "").trim()).filter(Boolean);
  if (!cleaned.length) return fallback;
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} and ${cleaned[1]}`;
  return `${cleaned.slice(0, -1).join(", ")}, and ${cleaned.at(-1)}`;
}

function getVerificationReference(categorySlug) {
  switch (categorySlug) {
    case "finance":
    case "salary-data":
    case "tax-budget":
      return "payroll records, plan documents, lender terms, or tax guidance";
    case "mortgage-data":
      return "official lender disclosures, insurance quotes, and closing-cost documents";
    case "health":
      return "clinical guidance, validated measurements, or advice from a qualified professional";
    case "education-roi":
      return "official aid letters, school cost disclosures, transfer policies, and current salary outcome data";
    case "home":
    case "home-costs":
      return "current contractor bids, supplier pricing, or measured project details";
    default:
      return "the documents, quotes, or rules that apply to your exact case";
  }
}
