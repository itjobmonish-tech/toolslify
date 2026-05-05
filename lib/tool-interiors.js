const THEME_LIBRARY = Object.freeze({
  ember: {
    id: "ember",
    primary: "#bf5a4d",
    strong: "#7f2f27",
    soft: "rgba(191, 90, 77, 0.14)",
    surface: "rgba(250, 235, 232, 0.96)",
    edge: "rgba(191, 90, 77, 0.22)",
    glow: "rgba(191, 90, 77, 0.2)",
    ink: "#7f2f27",
  },
  violet: {
    id: "violet",
    primary: "#7f63d6",
    strong: "#4b2f98",
    soft: "rgba(127, 99, 214, 0.14)",
    surface: "rgba(242, 238, 255, 0.96)",
    edge: "rgba(127, 99, 214, 0.2)",
    glow: "rgba(127, 99, 214, 0.18)",
    ink: "#4b2f98",
  },
  indigo: {
    id: "indigo",
    primary: "#4f67d8",
    strong: "#223588",
    soft: "rgba(79, 103, 216, 0.14)",
    surface: "rgba(235, 240, 255, 0.96)",
    edge: "rgba(79, 103, 216, 0.2)",
    glow: "rgba(79, 103, 216, 0.18)",
    ink: "#223588",
  },
  sky: {
    id: "sky",
    primary: "#4f8fb7",
    strong: "#1f5679",
    soft: "rgba(79, 143, 183, 0.14)",
    surface: "rgba(234, 245, 251, 0.96)",
    edge: "rgba(79, 143, 183, 0.2)",
    glow: "rgba(79, 143, 183, 0.18)",
    ink: "#1f5679",
  },
  teal: {
    id: "teal",
    primary: "#3d9b92",
    strong: "#16645c",
    soft: "rgba(61, 155, 146, 0.14)",
    surface: "rgba(231, 247, 244, 0.96)",
    edge: "rgba(61, 155, 146, 0.2)",
    glow: "rgba(61, 155, 146, 0.18)",
    ink: "#16645c",
  },
  moss: {
    id: "moss",
    primary: "#6b8d5e",
    strong: "#3f5a32",
    soft: "rgba(107, 141, 94, 0.14)",
    surface: "rgba(239, 247, 235, 0.96)",
    edge: "rgba(107, 141, 94, 0.2)",
    glow: "rgba(107, 141, 94, 0.18)",
    ink: "#3f5a32",
  },
  gold: {
    id: "gold",
    primary: "#bf8a34",
    strong: "#7a5412",
    soft: "rgba(191, 138, 52, 0.14)",
    surface: "rgba(251, 243, 226, 0.96)",
    edge: "rgba(191, 138, 52, 0.2)",
    glow: "rgba(191, 138, 52, 0.18)",
    ink: "#7a5412",
  },
  coral: {
    id: "coral",
    primary: "#d26d63",
    strong: "#8b3a31",
    soft: "rgba(210, 109, 99, 0.14)",
    surface: "rgba(252, 237, 235, 0.96)",
    edge: "rgba(210, 109, 99, 0.2)",
    glow: "rgba(210, 109, 99, 0.18)",
    ink: "#8b3a31",
  },
  plum: {
    id: "plum",
    primary: "#8b5e9a",
    strong: "#5b3567",
    soft: "rgba(139, 94, 154, 0.14)",
    surface: "rgba(245, 238, 248, 0.96)",
    edge: "rgba(139, 94, 154, 0.2)",
    glow: "rgba(139, 94, 154, 0.18)",
    ink: "#5b3567",
  },
  slate: {
    id: "slate",
    primary: "#5b718b",
    strong: "#304155",
    soft: "rgba(91, 113, 139, 0.14)",
    surface: "rgba(238, 243, 248, 0.96)",
    edge: "rgba(91, 113, 139, 0.2)",
    glow: "rgba(91, 113, 139, 0.18)",
    ink: "#304155",
  },
  ocean: {
    id: "ocean",
    primary: "#2f7dc4",
    strong: "#134b85",
    soft: "rgba(47, 125, 196, 0.14)",
    surface: "rgba(234, 244, 253, 0.96)",
    edge: "rgba(47, 125, 196, 0.2)",
    glow: "rgba(47, 125, 196, 0.18)",
    ink: "#134b85",
  },
  mint: {
    id: "mint",
    primary: "#2f9b77",
    strong: "#175d47",
    soft: "rgba(47, 155, 119, 0.14)",
    surface: "rgba(232, 248, 242, 0.96)",
    edge: "rgba(47, 155, 119, 0.2)",
    glow: "rgba(47, 155, 119, 0.18)",
    ink: "#175d47",
  },
  berry: {
    id: "berry",
    primary: "#b25586",
    strong: "#742449",
    soft: "rgba(178, 85, 134, 0.14)",
    surface: "rgba(250, 237, 244, 0.96)",
    edge: "rgba(178, 85, 134, 0.2)",
    glow: "rgba(178, 85, 134, 0.18)",
    ink: "#742449",
  },
  amber: {
    id: "amber",
    primary: "#c7862c",
    strong: "#7f4d0c",
    soft: "rgba(199, 134, 44, 0.14)",
    surface: "rgba(252, 244, 229, 0.96)",
    edge: "rgba(199, 134, 44, 0.2)",
    glow: "rgba(199, 134, 44, 0.18)",
    ink: "#7f4d0c",
  },
});

const STUDIO_THEME_POOLS = Object.freeze({
  careerBuilder: ["ember", "violet", "sky", "teal"],
  analysis: ["indigo", "sky", "teal", "slate"],
  interview: ["gold", "indigo", "plum"],
  communication: ["violet", "coral", "slate"],
  billing: ["ember", "gold", "teal"],
  proposal: ["plum", "indigo", "teal", "slate"],
  operations: ["moss", "sky", "slate"],
});

const CALCULATOR_THEME_POOLS = Object.freeze({
  conversion: ["indigo", "ocean", "sky", "teal"],
  takeHome: ["mint", "teal", "moss", "indigo"],
  planning: ["amber", "gold", "ember", "sky"],
  pricing: ["gold", "amber", "plum", "berry", "teal"],
  comparison: ["ocean", "indigo", "plum", "slate"],
  businessMath: ["mint", "moss", "amber", "teal", "berry"],
});

const CALCULATOR_THEME_BY_NAME = Object.freeze({
  "Salary to Hourly Calculator": "indigo",
  "Hourly to Salary Calculator": "ocean",
  "Take-Home Pay Calculator": "mint",
  "Gross to Net Salary Calculator": "teal",
  "Net to Gross Salary Calculator": "moss",
  "Overtime Pay Calculator": "coral",
  "PTO Accrual Calculator": "violet",
  "Notice Period Calculator": "amber",
  "Freelance Rate Calculator": "gold",
  "Day Rate Calculator": "ember",
  "Pay Raise Calculator": "berry",
  "Bonus Calculator": "plum",
  "Commission Calculator": "coral",
  "Cost of Living Salary Comparison Tool": "slate",
  "Contractor vs Employee Calculator": "ocean",
  "Timesheet Calculator": "sky",
  "Profit Margin Calculator": "mint",
  "VAT Calculator": "amber",
  "Late Payment Interest Calculator": "berry",
});

export function getToolInteriorProfile(context) {
  if (context.workspace === "calculator") {
    return buildCalculatorInterior(context);
  }

  return buildStudioInterior(context);
}

function buildStudioInterior(context) {
  const variant = getStudioVariant(context.name, context.categorySlug);
  const theme = pickTheme(context.name, STUDIO_THEME_POOLS[variant] || STUDIO_THEME_POOLS.careerBuilder);
  const labels = getStudioLabels(context.name, context.shortName, variant);

  return {
    variant,
    theme,
    ctaLabel: labels.ctaLabel,
    inputTitle: labels.inputTitle,
    outputTitle: labels.outputTitle,
    heroStats: getStudioHeroStats(variant),
    featureCards: getStudioFeatureCards(variant),
    inputShowcase: getStudioInputShowcase(context.name, context.shortName, variant),
    guideCards: getStudioGuideCards(variant),
    starter: getStudioStarterCard(context.shortName, variant),
    outputShowcase: getStudioOutputShowcase(context.name, context.shortName, variant),
    inlineChips: getStudioInlineChips(context.badge, variant),
    pendingMessage: getStudioPendingMessage(variant),
  };
}

function buildCalculatorInterior(context) {
  const variant = getCalculatorVariant(context.name, context.categorySlug);
  const theme = pickCalculatorTheme(context.name, variant);
  const labels = getCalculatorLabels(context.name, context.shortName, variant);

  return {
    variant,
    surfaceStyle: getCalculatorSurfaceStyle(context.name, context.categorySlug, variant),
    theme,
    ctaLabel: labels.ctaLabel,
    inputTitle: labels.inputTitle,
    outputTitle: labels.outputTitle,
    heroStats: getCalculatorHeroStats(variant),
    featureCards: getCalculatorFeatureCards(variant),
    inputShowcase: getCalculatorInputShowcase(context.name, context.shortName, variant),
    guideCards: getCalculatorGuideCards(variant),
    outputShowcase: getCalculatorOutputShowcase(context.name, context.shortName, variant),
    pendingMessage: getCalculatorPendingMessage(variant),
  };
}

function pickCalculatorTheme(name, variant) {
  const directTheme = CALCULATOR_THEME_BY_NAME[name];

  if (directTheme && THEME_LIBRARY[directTheme]) {
    return THEME_LIBRARY[directTheme];
  }

  return pickTheme(name, CALCULATOR_THEME_POOLS[variant] || CALCULATOR_THEME_POOLS.conversion);
}

function getStudioVariant(name, categorySlug) {
  if (/ats resume checker|keyword matcher|keyword extractor|checker|matcher|extractor/i.test(name)) {
    return "analysis";
  }
  if (/interview question|interview answer/i.test(name)) {
    return "interview";
  }
  if (/linkedin|headline|about|thank you|follow-up|resignation/i.test(name)) {
    return "communication";
  }
  if (/invoice|receipt/i.test(name)) {
    return "billing";
  }
  if (/quote|estimate|proposal|scope of work|contract|purchase order/i.test(name)) {
    return "proposal";
  }
  if (/expense report|onboarding form/i.test(name)) {
    return "operations";
  }
  if (categorySlug === "freelancer-business-tools") {
    return "proposal";
  }
  return "careerBuilder";
}

function getCalculatorVariant(name, categorySlug) {
  if (/salary to hourly|hourly to salary|day rate/i.test(name)) return "conversion";
  if (/take-home|gross to net|net to gross/i.test(name)) return "takeHome";
  if (/freelance rate/i.test(name)) return "pricing";
  if (/contractor vs employee|cost of living/i.test(name)) return "comparison";
  if (/timesheet|profit margin|vat|late payment/i.test(name) || categorySlug === "freelancer-business-tools") {
    return "businessMath";
  }
  return "planning";
}

function getCalculatorSurfaceStyle(name, categorySlug, variant) {
  if (
    categorySlug === "mortgage-data" ||
    /mortgage|loan|emi|heloc|refinance|closing costs|house affordability|down payment|rent vs buy|apr|debt-to-income|debt payoff|loan payoff|loan eligibility|loan prepayment|credit card payoff|student loan/i.test(name)
  ) {
    return "loanSplit";
  }

  if (
    categorySlug === "salary-data" ||
    /salary|paycheck|take-home|gross to net|net to gross|bonus|commission|overtime|raise|contractor vs employee|cost of living salary/i.test(name)
  ) {
    return "salarySplit";
  }

  if (
    categorySlug === "tax-budget" ||
    /tax refund|income tax|sales tax|state tax|self-employment tax|capital gains tax|retirement tax|withholding|budget|net worth|money counter/i.test(name)
  ) {
    return "taxGrid";
  }

  if (
    /retirement|401|roth|investment|apy|cagr|future value|savings|sip|mutual fund|compound interest|stock average|roi|dividend/i.test(name)
  ) {
    return "investment";
  }

  if (
    categorySlug === "home-costs" ||
    /roof|paint|concrete|tile|drywall|deck|insulation|fence|topsoil|sod|paver|gravel|mulch|asphalt|flooring|square footage|price per square foot|electricity|fuel economy/i.test(name)
  ) {
    return "ledger";
  }

  if (categorySlug === "health" || /calorie|tdee|body fat|protein|macro|ovulation|pregnancy|bmi|bmr|whr|ideal weight|lean body mass|target heart/i.test(name)) {
    return "wellnessSplit";
  }

  if (variant === "businessMath") return "ledger";
  if (variant === "comparison") return "loanSplit";
  if (variant === "takeHome") return "salarySplit";
  if (variant === "pricing") return "salarySplit";
  if (variant === "planning") return "investment";

  return "conversionStrip";
}

function getStudioLabels(name, shortName, variant) {
  if (/ATS Resume Checker/i.test(name)) {
    return {
      inputTitle: "Resume and target job description",
      outputTitle: "ATS compatibility report",
      ctaLabel: "Run ATS review",
    };
  }
  if (/Resume Keyword Matcher/i.test(name)) {
    return {
      inputTitle: "Resume and target job description",
      outputTitle: "Keyword match report",
      ctaLabel: "Compare keywords",
    };
  }
  if (/Job Description Keyword Extractor/i.test(name)) {
    return {
      inputTitle: "Job description source text",
      outputTitle: "Keyword extraction",
      ctaLabel: "Extract keywords",
    };
  }
  if (/Resume Builder/i.test(name)) {
    return {
      inputTitle: "Career notes and target role",
      outputTitle: "Resume draft",
      ctaLabel: "Build resume",
    };
  }
  if (/Cover Letter Generator/i.test(name)) {
    return {
      inputTitle: "Experience highlights and company brief",
      outputTitle: "Cover letter draft",
      ctaLabel: "Generate cover letter",
    };
  }
  if (/Resume Summary Generator/i.test(name)) {
    return {
      inputTitle: "Experience notes and role angle",
      outputTitle: "Summary draft",
      ctaLabel: "Generate summary",
    };
  }
  if (/Resume Bullet Rewriter/i.test(name)) {
    return {
      inputTitle: "Source bullets and role angle",
      outputTitle: "Rewritten bullets",
      ctaLabel: "Rewrite bullets",
    };
  }
  if (/CV to Resume Converter/i.test(name)) {
    return {
      inputTitle: "CV content and target role",
      outputTitle: "Resume conversion",
      ctaLabel: "Convert CV",
    };
  }
  if (/LinkedIn Headline Generator/i.test(name)) {
    return {
      inputTitle: "Profile strengths and target audience",
      outputTitle: "Headline options",
      ctaLabel: "Generate headlines",
    };
  }
  if (/LinkedIn About Generator/i.test(name)) {
    return {
      inputTitle: "Career story and positioning cues",
      outputTitle: "About section draft",
      ctaLabel: "Generate about section",
    };
  }
  if (/Interview Question Generator/i.test(name)) {
    return {
      inputTitle: "Role and interview context",
      outputTitle: "Question set",
      ctaLabel: "Generate questions",
    };
  }
  if (/Interview Answer Builder/i.test(name)) {
    return {
      inputTitle: "Question, situation, and proof",
      outputTitle: "Answer draft",
      ctaLabel: "Build answer",
    };
  }
  if (/Thank You Email Generator|Follow-Up Email Generator/i.test(name)) {
    return {
      inputTitle: "Conversation notes and next step",
      outputTitle: "Email draft",
      ctaLabel: "Generate email",
    };
  }
  if (/Resignation Letter Generator/i.test(name)) {
    return {
      inputTitle: "Role, company, and notice details",
      outputTitle: "Resignation draft",
      ctaLabel: "Generate letter",
    };
  }
  if (/Invoice Generator|Retainer Invoice Generator/i.test(name)) {
    return {
      inputTitle: "Billing details and line items",
      outputTitle: "Invoice draft",
      ctaLabel: "Generate invoice",
    };
  }
  if (/Quote Generator/i.test(name)) {
    return {
      inputTitle: "Pricing details and assumptions",
      outputTitle: "Quote draft",
      ctaLabel: "Generate quote",
    };
  }
  if (/Estimate Generator/i.test(name)) {
    return {
      inputTitle: "Scope and pricing assumptions",
      outputTitle: "Estimate draft",
      ctaLabel: "Generate estimate",
    };
  }
  if (/Proposal Generator/i.test(name)) {
    return {
      inputTitle: "Client brief and proposed scope",
      outputTitle: "Proposal draft",
      ctaLabel: "Build proposal",
    };
  }
  if (/Scope of Work Generator/i.test(name)) {
    return {
      inputTitle: "Deliverables, timeline, and terms",
      outputTitle: "Scope of work draft",
      ctaLabel: "Build scope",
    };
  }
  if (/Freelance Contract Generator/i.test(name)) {
    return {
      inputTitle: "Project terms and legal basics",
      outputTitle: "Contract draft",
      ctaLabel: "Build contract",
    };
  }
  if (/Purchase Order Generator/i.test(name)) {
    return {
      inputTitle: "Order details and delivery notes",
      outputTitle: "Purchase order draft",
      ctaLabel: "Generate PO",
    };
  }
  if (/Receipt Generator/i.test(name)) {
    return {
      inputTitle: "Payment details and line items",
      outputTitle: "Receipt draft",
      ctaLabel: "Generate receipt",
    };
  }
  if (/Expense Report Generator/i.test(name)) {
    return {
      inputTitle: "Expense entries and reporting period",
      outputTitle: "Expense report",
      ctaLabel: "Generate report",
    };
  }
  if (/Client Onboarding Form Builder/i.test(name)) {
    return {
      inputTitle: "Client requirements and kickoff details",
      outputTitle: "Onboarding form draft",
      ctaLabel: "Build form",
    };
  }

  if (variant === "analysis") {
    return {
      inputTitle: "Source text and target brief",
      outputTitle: "Analysis report",
      ctaLabel: "Run review",
    };
  }
  if (variant === "interview") {
    return {
      inputTitle: "Role context and interview goals",
      outputTitle: "Interview prep draft",
      ctaLabel: "Generate prep",
    };
  }
  if (variant === "communication") {
    return {
      inputTitle: "Context notes and tone cues",
      outputTitle: `${shortName} draft`,
      ctaLabel: `Generate ${shortName.toLowerCase()}`,
    };
  }
  if (variant === "billing") {
    return {
      inputTitle: "Billing details and document inputs",
      outputTitle: `${shortName} draft`,
      ctaLabel: `Generate ${shortName.toLowerCase()}`,
    };
  }
  if (variant === "proposal") {
    return {
      inputTitle: "Client scope and commercial details",
      outputTitle: `${shortName} draft`,
      ctaLabel: `Build ${shortName.toLowerCase()}`,
    };
  }
  if (variant === "operations") {
    return {
      inputTitle: "Operations notes and required fields",
      outputTitle: `${shortName} draft`,
      ctaLabel: `Build ${shortName.toLowerCase()}`,
    };
  }

  return {
    inputTitle: "Career notes and target role",
    outputTitle: `${shortName} draft`,
    ctaLabel: `Build ${shortName.toLowerCase()}`,
  };
}

function getCalculatorLabels(name, shortName, variant) {
  if (/Salary to Hourly Calculator|Hourly to Salary Calculator/i.test(name)) {
    return {
      inputTitle: "Pay and schedule assumptions",
      outputTitle: "Pay conversion",
      ctaLabel: "Convert pay",
    };
  }
  if (/Take-Home Pay Calculator/i.test(name)) {
    return {
      inputTitle: "Salary and deduction assumptions",
      outputTitle: "Take-home estimate",
      ctaLabel: "Estimate take-home",
    };
  }
  if (/Gross to Net Salary Calculator|Net to Gross Salary Calculator/i.test(name)) {
    return {
      inputTitle: "Salary and deduction assumptions",
      outputTitle: "Net pay estimate",
      ctaLabel: "Estimate salary",
    };
  }
  if (/Overtime Pay Calculator/i.test(name)) {
    return {
      inputTitle: "Hours, rate, and overtime rule",
      outputTitle: "Overtime estimate",
      ctaLabel: "Calculate overtime",
    };
  }
  if (/PTO Accrual Calculator/i.test(name)) {
    return {
      inputTitle: "Schedule and accrual rules",
      outputTitle: "PTO estimate",
      ctaLabel: "Calculate PTO",
    };
  }
  if (/Notice Period Calculator/i.test(name)) {
    return {
      inputTitle: "Notice dates and working pattern",
      outputTitle: "Notice timeline",
      ctaLabel: "Calculate notice",
    };
  }
  if (/Freelance Rate Calculator|Day Rate Calculator/i.test(name)) {
    return {
      inputTitle: "Target income and workload",
      outputTitle: "Rate recommendation",
      ctaLabel: "Calculate rate",
    };
  }
  if (/Pay Raise Calculator/i.test(name)) {
    return {
      inputTitle: "Current pay and raise details",
      outputTitle: "Raise impact",
      ctaLabel: "Estimate raise",
    };
  }
  if (/Bonus Calculator/i.test(name)) {
    return {
      inputTitle: "Base pay and bonus assumptions",
      outputTitle: "Bonus estimate",
      ctaLabel: "Calculate bonus",
    };
  }
  if (/Commission Calculator/i.test(name)) {
    return {
      inputTitle: "Revenue and commission assumptions",
      outputTitle: "Commission estimate",
      ctaLabel: "Calculate commission",
    };
  }
  if (/Cost of Living Salary Comparison Tool/i.test(name)) {
    return {
      inputTitle: "Location and compensation assumptions",
      outputTitle: "Cost-of-living comparison",
      ctaLabel: "Compare locations",
    };
  }
  if (/Contractor vs Employee Calculator/i.test(name)) {
    return {
      inputTitle: "Offer details and work model",
      outputTitle: "Work model comparison",
      ctaLabel: "Compare models",
    };
  }
  if (/Timesheet Calculator/i.test(name)) {
    return {
      inputTitle: "Hours and billing assumptions",
      outputTitle: "Timesheet total",
      ctaLabel: "Calculate hours",
    };
  }
  if (/Profit Margin Calculator/i.test(name)) {
    return {
      inputTitle: "Revenue and cost assumptions",
      outputTitle: "Margin snapshot",
      ctaLabel: "Calculate margin",
    };
  }
  if (/VAT Calculator/i.test(name)) {
    return {
      inputTitle: "Subtotal and tax assumptions",
      outputTitle: "VAT breakdown",
      ctaLabel: "Calculate VAT",
    };
  }
  if (/Late Payment Interest Calculator/i.test(name)) {
    return {
      inputTitle: "Invoice total and overdue period",
      outputTitle: "Interest estimate",
      ctaLabel: "Calculate interest",
    };
  }

  if (variant === "takeHome") {
    return {
      inputTitle: "Salary and deduction assumptions",
      outputTitle: `${shortName} estimate`,
      ctaLabel: "Estimate net pay",
    };
  }
  if (variant === "pricing") {
    return {
      inputTitle: "Income goal and workload assumptions",
      outputTitle: `${shortName} result`,
      ctaLabel: `Calculate ${shortName.toLowerCase()}`,
    };
  }
  if (variant === "comparison") {
    return {
      inputTitle: "Scenario assumptions",
      outputTitle: `${shortName} comparison`,
      ctaLabel: "Compare scenarios",
    };
  }
  if (variant === "businessMath") {
    return {
      inputTitle: "Business math assumptions",
      outputTitle: `${shortName} result`,
      ctaLabel: `Calculate ${shortName.toLowerCase()}`,
    };
  }

  return {
    inputTitle: "Planning inputs",
    outputTitle: `${shortName} estimate`,
    ctaLabel: `Calculate ${shortName.toLowerCase()}`,
  };
}

function getStudioHeroStats(variant) {
  switch (variant) {
    case "analysis":
      return [
        { label: "Checks", value: "Match + gaps" },
        { label: "Result", value: "Actionable review" },
        { label: "Flow", value: "Compare and revise" },
      ];
    case "interview":
      return [
        { label: "Focus", value: "Role-specific prep" },
        { label: "Result", value: "Questions + answers" },
        { label: "Flow", value: "Practice and refine" },
      ];
    case "communication":
      return [
        { label: "Focus", value: "Tone + clarity" },
        { label: "Result", value: "Editable message" },
        { label: "Flow", value: "Draft and send" },
      ];
    case "billing":
      return [
        { label: "Focus", value: "Client-ready totals" },
        { label: "Result", value: "Billing draft" },
        { label: "Flow", value: "Generate and export" },
      ];
    case "proposal":
      return [
        { label: "Focus", value: "Scope + pricing" },
        { label: "Result", value: "Commercial draft" },
        { label: "Flow", value: "Structure and send" },
      ];
    case "operations":
      return [
        { label: "Focus", value: "Repeatable admin" },
        { label: "Result", value: "Structured form" },
        { label: "Flow", value: "Capture and reuse" },
      ];
    default:
      return [
        { label: "Focus", value: "Career-ready copy" },
        { label: "Result", value: "Sectioned draft" },
        { label: "Flow", value: "Write and tailor" },
      ];
  }
}

function getCalculatorHeroStats(variant) {
  switch (variant) {
    case "takeHome":
      return [
        { label: "Focus", value: "Net pay clarity" },
        { label: "Result", value: "Gross to net" },
        { label: "Flow", value: "Adjust and compare" },
      ];
    case "planning":
      return [
        { label: "Focus", value: "Scenario planning" },
        { label: "Result", value: "Impact estimate" },
        { label: "Flow", value: "Tune assumptions" },
      ];
    case "pricing":
      return [
        { label: "Focus", value: "Rate decisions" },
        { label: "Result", value: "Target pricing" },
        { label: "Flow", value: "Model and reuse" },
      ];
    case "comparison":
      return [
        { label: "Focus", value: "Option vs option" },
        { label: "Result", value: "Side-by-side view" },
        { label: "Flow", value: "Compare and decide" },
      ];
    case "businessMath":
      return [
        { label: "Focus", value: "Revenue math" },
        { label: "Result", value: "Breakdown first" },
        { label: "Flow", value: "Calculate and save" },
      ];
    default:
      return [
        { label: "Focus", value: "Pay conversion" },
        { label: "Result", value: "Clear headline number" },
        { label: "Flow", value: "Convert and compare" },
      ];
  }
}

function getStudioFeatureCards(variant) {
  switch (variant) {
    case "analysis":
      return [
        {
          title: "Target-vs-source review",
          body: "The first pass is structured around gaps, strong matches, and what still needs rewriting.",
        },
        {
          title: "Signal-first output",
          body: "Important missing keywords and structural mismatches surface before the long narrative summary.",
        },
        {
          title: "Built for iteration",
          body: "Review once, adjust the source, and run the comparison again without leaving the same screen.",
        },
      ];
    case "interview":
      return [
        {
          title: "Role-aware preparation",
          body: "The output stays tied to the role context so the questions and answers feel specific instead of generic.",
        },
        {
          title: "Proof-first structure",
          body: "The strongest examples, outcomes, and prompts stay visible so your next revision is faster.",
        },
        {
          title: "Easy to rehearse",
          body: "Everything is kept readable and compact enough to reuse during practice and final prep.",
        },
      ];
    case "communication":
      return [
        {
          title: "Tone handled early",
          body: "These tools shape voice and audience positioning before the final polish step.",
        },
        {
          title: "Short-form clarity",
          body: "The draft stays concise, readable, and easy to tailor without losing the core message.",
        },
        {
          title: "Made for live sending",
          body: "Copy, adjust, and send without starting from a blank page.",
        },
      ];
    case "billing":
      return [
        {
          title: "Commercial details stay aligned",
          body: "Amounts, line items, and terms are framed so they read like a document instead of rough notes.",
        },
        {
          title: "Clear document rhythm",
          body: "The finished draft feels usable immediately, with cleaner totals and easier review before export.",
        },
        {
          title: "Repeatable admin flow",
          body: "The same browser flow works for one-off billing and repeat client operations.",
        },
      ];
    case "proposal":
      return [
        {
          title: "Scope before styling",
          body: "The tool organizes deliverables, timeline, and pricing first so the document reads with more confidence.",
        },
        {
          title: "Client-ready sections",
          body: "The output is framed like a sendable commercial draft instead of loose generated text.",
        },
        {
          title: "Easy to reuse",
          body: "The same structure holds up for new clients, upgrades, and recurring proposal drafts.",
        },
      ];
    case "operations":
      return [
        {
          title: "Structured intake",
          body: "Operational details are grouped so the resulting form or report feels more intentional and complete.",
        },
        {
          title: "Cleaner handoff",
          body: "The final draft is easier to share with clients or teammates without reformatting elsewhere.",
        },
        {
          title: "Easy to revisit",
          body: "Use the same flow for recurring ops work instead of rebuilding every document manually.",
        },
      ];
    default:
      return [
        {
          title: "Career-specific structure",
          body: "The draft is shaped around job-search writing instead of feeling like a generic text generator.",
        },
        {
          title: "Proof-first editing",
          body: "Achievements, role fit, and positioning stay visible so the next revision is faster.",
        },
        {
          title: "Made for tailoring",
          body: "The result stays readable and editable enough to customize before you send anything important.",
        },
      ];
  }
}

function getCalculatorFeatureCards(variant) {
  switch (variant) {
    case "takeHome":
      return [
        {
          title: "Net pay stays obvious",
          body: "The headline result stays large first, with the deduction details and notes immediately underneath.",
        },
        {
          title: "Scenario-friendly",
          body: "Change one assumption at a time and compare the effect without rebuilding a spreadsheet.",
        },
        {
          title: "Reusable outputs",
          body: "Copy or download the result after the first pass so the estimate is easy to revisit or share.",
        },
      ];
    case "planning":
      return [
        {
          title: "Decision-ready planning",
          body: "These calculators are designed for what-if thinking rather than one static number.",
        },
        {
          title: "Assumptions stay close",
          body: "The output keeps the key planning assumptions visible so the estimate is easier to trust.",
        },
        {
          title: "Fast comparison loop",
          body: "Adjust, recalculate, and compare quickly inside the same screen.",
        },
      ];
    case "pricing":
      return [
        {
          title: "Pricing before guesswork",
          body: "Income goals, utilization, and buffers stay visible so rate decisions feel grounded.",
        },
        {
          title: "Rate logic explained",
          body: "The summary cards make it easier to understand where the recommended number comes from.",
        },
        {
          title: "Made for freelancers",
          body: "The calculator supports repeat pricing checks without a new spreadsheet every time.",
        },
      ];
    case "comparison":
      return [
        {
          title: "Two-scenario thinking",
          body: "The layout is tuned for comparing options, not just calculating one isolated answer.",
        },
        {
          title: "Big differences first",
          body: "The result emphasizes the trade-offs and headline changes that matter most.",
        },
        {
          title: "Easy to explain",
          body: "The output stays clean enough to share with clients, teammates, or yourself later.",
        },
      ];
    case "businessMath":
      return [
        {
          title: "Business math made readable",
          body: "Margins, totals, and tax lines stay easy to scan without spreadsheet clutter.",
        },
        {
          title: "Supporting details stay close",
          body: "The lead number stays prominent while the notes and breakdown remain right underneath.",
        },
        {
          title: "Easy to revisit",
          body: "Use the same calculator as pricing changes over time without rebuilding your model.",
        },
      ];
    default:
      return [
        {
          title: "Conversion-friendly layout",
          body: "The lead number stays obvious first, while supporting rates remain close for quick comparison.",
        },
        {
          title: "Fast assumption changes",
          body: "Adjust hours, salary, or rate inputs and compare the outcome without leaving the page.",
        },
        {
          title: "Easy to reuse",
          body: "Copy or download the result after the first pass so it is simple to save or revisit later.",
        },
      ];
  }
}

function getStudioInputShowcase(name, shortName, variant) {
  switch (variant) {
    case "analysis":
      return {
        eyebrow: "Match review",
        title: `Compare the source against the target before you rewrite ${shortName.toLowerCase()}.`,
        body: "Add both the current material and the target brief so the first pass can surface gaps, strengths, and what to fix next.",
        pills: ["Target-aware review", "Gap surfacing", "Fast rewrite loop"],
      };
    case "interview":
      return {
        eyebrow: "Interview prep",
        title: "Give the role enough context so the prep sounds experienced, not generic.",
        body: "Describe the role, the company, or the question angle once and turn it into stronger practice material.",
        pills: ["Role context", "Proof-first prompts", "Practice-ready output"],
      };
    case "communication":
      return {
        eyebrow: "Message studio",
        title: `Shape a clearer ${shortName.toLowerCase()} before you worry about final polish.`,
        body: "Start with the raw context, the audience, and the intended tone so the draft lands with more confidence on the first pass.",
        pills: ["Audience fit", "Tone control", "Short-form clarity"],
      };
    case "billing":
      return {
        eyebrow: "Billing document",
        title: "Turn raw billing details into a document that already feels client-ready.",
        body: "Keep the commercial inputs clear and the generator will frame the totals, structure, and supporting text in one pass.",
        pills: ["Line items", "Terms", "Clean totals"],
      };
    case "proposal":
      return {
        eyebrow: "Commercial draft",
        title: `Organize the offer before you style the ${shortName.toLowerCase()}.`,
        body: "Capture the scope, timing, and pricing once so the result reads like a stronger commercial document from the start.",
        pills: ["Scope", "Timeline", "Commercials"],
      };
    case "operations":
      return {
        eyebrow: "Operations draft",
        title: "Capture the repeating admin details once so the document is easier to reuse later.",
        body: "This flow is tuned for intake, handoff, and structured admin work that should not feel rebuilt every time.",
        pills: ["Stakeholders", "Requirements", "Reusable format"],
      };
    default:
      return {
        eyebrow: "Career draft",
        title: `Build a stronger ${shortName.toLowerCase()} first draft without the blank-page drag.`,
        body: "Start with raw notes, achievements, and the target role. The workbench will keep the structure and editing flow focused from the first pass.",
        pills: ["Career story", "Role alignment", "Editable sections"],
      };
  }
}

function getCalculatorInputShowcase(name, shortName, variant) {
  switch (variant) {
    case "takeHome":
      return {
        eyebrow: "Net pay view",
        title: `Model ${shortName.toLowerCase()} with deductions visible from the start.`,
        body: "Keep taxes, fees, and withholding assumptions close so the result is easier to trust and compare.",
        pills: ["Gross pay", "Deductions", "Net result"],
      };
    case "planning":
      return {
        eyebrow: "Planning model",
        title: `Use ${shortName.toLowerCase()} like a scenario board, not a one-off form.`,
        body: "Tweak the inputs, compare the effect, and keep the strongest planning signals clear on the same screen.",
        pills: ["Scenario inputs", "Live estimate", "Decision support"],
      };
    case "pricing":
      return {
        eyebrow: "Rate model",
        title: `Turn your income target into a clearer ${shortName.toLowerCase()} decision.`,
        body: "The calculator is framed around real pricing pressure: workload, utilization, and the buffer you still need to keep.",
        pills: ["Income goal", "Utilization", "Buffer"],
      };
    case "comparison":
      return {
        eyebrow: "Comparison board",
        title: `Keep the big trade-offs visible while ${shortName.toLowerCase()} updates.`,
        body: "This layout is tuned for option-vs-option decisions where the headline difference matters just as much as the raw number.",
        pills: ["Scenario A", "Scenario B", "Decision view"],
      };
    case "businessMath":
      return {
        eyebrow: "Business math",
        title: `Keep ${shortName.toLowerCase()} readable even when the supporting math gets messy.`,
        body: "Lead with the commercial inputs that matter most, then let the calculator keep the breakdown clear underneath.",
        pills: ["Commercial inputs", "Breakdown", "Reusable result"],
      };
    default:
      return {
        eyebrow: "Conversion model",
        title: `Use ${shortName.toLowerCase()} to compare pay assumptions quickly.`,
        body: "Adjust the inputs once and keep the main conversion visible while the supporting rates stay easy to scan below.",
        pills: ["Pay base", "Work pattern", "Converted view"],
      };
  }
}

function getStudioGuideCards(variant) {
  switch (variant) {
    case "analysis":
      return [
        { eyebrow: "Source", title: "Primary material", body: "Paste the current resume or source text exactly as it exists today." },
        { eyebrow: "Target", title: "Role brief", body: "Add the target job description or requirement set so the review has a benchmark." },
        { eyebrow: "Outcome", title: "Gap signals", body: "The result should tell you what is strong, what is missing, and what to rewrite first." },
      ];
    case "interview":
      return [
        { eyebrow: "Context", title: "Role scope", body: "Name the team, company, or interview type so the prep stays specific." },
        { eyebrow: "Signals", title: "What matters most", body: "Mention the topics, competencies, or challenges that should show up in the answers." },
        { eyebrow: "Proof", title: "Best examples", body: "Use your strongest outcomes and examples so the practice set sounds more credible." },
      ];
    case "communication":
      return [
        { eyebrow: "Audience", title: "Who this is for", body: "State the reader so the message tone and level of detail stay right-sized." },
        { eyebrow: "Intent", title: "Why you are writing", body: "Be clear on the goal, next step, or message outcome before generating." },
        { eyebrow: "Tone", title: "How it should land", body: "Professional, warm, concise, or firm all change the final feel of the draft." },
      ];
    case "billing":
      return [
        { eyebrow: "Client", title: "Billing block", body: "Include the customer details and any references that should appear in the document." },
        { eyebrow: "Value", title: "Commercial terms", body: "Payment terms, currency, and due-date notes help the output feel complete." },
        { eyebrow: "Items", title: "Line-item clarity", body: "Give each billed item enough detail so the first draft reads credibly." },
      ];
    case "proposal":
      return [
        { eyebrow: "Scope", title: "What is included", body: "List the key deliverables, milestones, or responsibilities that anchor the offer." },
        { eyebrow: "Timeline", title: "How it gets done", body: "Add the timeline, engagement model, or review rhythm if it matters." },
        { eyebrow: "Terms", title: "Commercial fit", body: "Pricing, payment, and assumptions keep the draft practical instead of generic." },
      ];
    case "operations":
      return [
        { eyebrow: "Inputs", title: "Required fields", body: "Capture the details people always forget so the form or report feels complete." },
        { eyebrow: "People", title: "Stakeholders", body: "List who is involved and what they need to provide or approve." },
        { eyebrow: "Reuse", title: "Repeatability", body: "Good ops drafts should be easy to run again with the next project or client." },
      ];
    default:
      return [
        { eyebrow: "Material", title: "Base experience", body: "Paste the raw experience notes, wins, and skills that should anchor the draft." },
        { eyebrow: "Angle", title: "Target role", body: "The clearer the role angle, the more tailored the first draft will feel." },
        { eyebrow: "Proof", title: "Outcome language", body: "Specific results and metrics are what make the first version worth refining." },
      ];
  }
}

function getCalculatorGuideCards(variant) {
  switch (variant) {
    case "takeHome":
      return [
        { eyebrow: "Base", title: "Gross pay", body: "Start with the pay figure that should anchor the rest of the deduction math." },
        { eyebrow: "Drag", title: "Deductions", body: "Taxes, withholdings, and other adjustments change the result more than most people expect." },
        { eyebrow: "Result", title: "Usable pay", body: "The final view should make the real spendable number easy to compare." },
      ];
    case "planning":
      return [
        { eyebrow: "Assumptions", title: "What changes", body: "Use the inputs to model the one or two variables that actually move the outcome." },
        { eyebrow: "Preview", title: "Live estimate", body: "Keep the changing result visible while you test different planning paths." },
        { eyebrow: "Decision", title: "What to do next", body: "The point is not only the number. It is the decision the number supports." },
      ];
    case "pricing":
      return [
        { eyebrow: "Goal", title: "Income target", body: "Set the number you actually need to keep after the practical business buffers." },
        { eyebrow: "Capacity", title: "Available workload", body: "Billable days and realistic utilization protect the result from optimism bias." },
        { eyebrow: "Buffer", title: "Safety margin", body: "Include admin time, tax reserve, and churn protection before trusting the rate." },
      ];
    case "comparison":
      return [
        { eyebrow: "Option A", title: "Primary scenario", body: "Define the first offer, city, or work model clearly enough to compare against." },
        { eyebrow: "Option B", title: "Counterfactual", body: "Use the second scenario to show where the trade-off really sits." },
        { eyebrow: "Decision", title: "Headline difference", body: "The strongest comparison tools make the decision gap obvious at a glance." },
      ];
    case "businessMath":
      return [
        { eyebrow: "Revenue", title: "Commercial base", body: "Start with the subtotal, hours, or revenue number driving the calculation." },
        { eyebrow: "Costs", title: "Adjustment layer", body: "Fees, tax, or cost inputs often change the final picture more than expected." },
        { eyebrow: "Outcome", title: "Practical result", body: "The result should be readable enough to use in a quote, invoice, or planning check." },
      ];
    default:
      return [
        { eyebrow: "Base", title: "Pay source", body: "Pick the annual, hourly, or day-rate assumption you want to convert." },
        { eyebrow: "Pattern", title: "Work schedule", body: "Hours and workdays change the converted figure more than people usually expect." },
        { eyebrow: "View", title: "Converted output", body: "Keep the main converted result clear and the supporting math close underneath." },
      ];
  }
}

function getStudioStarterCard(shortName, variant) {
  if (variant === "analysis") {
    return {
      title: "Load an analysis-style sample",
      description: "Use a fuller example source so the report has enough material to surface real gaps and strengths.",
      actionLabel: "Use analysis sample",
    };
  }
  if (variant === "proposal" || variant === "billing" || variant === "operations") {
    return {
      title: "Load a client-style sample",
      description: "Start from a structured commercial brief, then tailor the client, scope, and pricing details.",
      actionLabel: "Use business sample",
    };
  }
  if (variant === "interview") {
    return {
      title: "Load an interview-style sample",
      description: "Start from a role-specific example so the prompts and answers feel more grounded immediately.",
      actionLabel: "Use prep sample",
    };
  }
  return {
    title: `Load a stronger ${shortName.toLowerCase()} sample`,
    description: "Start from a recruiter-style example, then replace the details with your own context before generating.",
    actionLabel: "Use example",
  };
}

function getStudioOutputShowcase(name, shortName, variant) {
  switch (variant) {
    case "analysis":
      return {
        eyebrow: "Review surface",
        title: "Strengths, gaps, and next edits stay together.",
        body: "A good review result should make it obvious what already works and what needs a targeted rewrite before you apply.",
      };
    case "interview":
      return {
        eyebrow: "Practice set",
        title: "Keep the strongest prompts and answer structure in one place.",
        body: "The output is framed to support rehearsal, fast edits, and quick copying into your own prep notes.",
      };
    case "communication":
      return {
        eyebrow: "Send-ready draft",
        title: `The ${shortName.toLowerCase()} should read cleanly before the final polish pass.`,
        body: "Review the message, tighten the phrasing, and keep the copy or export controls right beside it.",
      };
    case "billing":
      return {
        eyebrow: "Client document",
        title: "The draft keeps totals, terms, and wording easy to verify before export.",
        body: "That makes the first result feel closer to something you would actually send instead of an unfinished text block.",
      };
    case "proposal":
      return {
        eyebrow: "Commercial layout",
        title: "Scope, timing, and terms should read like one cohesive offer.",
        body: "The result surface is meant to feel more like a working commercial draft and less like raw AI copy.",
      };
    case "operations":
      return {
        eyebrow: "Operational output",
        title: "The draft should be structured enough to hand off immediately.",
        body: "Keep the generated form or report visible on the same screen so reuse is fast and friction stays low.",
      };
    default:
      return {
        eyebrow: "Draft output",
        title: `Review the ${shortName.toLowerCase()} and keep it ready for fast tailoring.`,
        body: "The output surface is built for a strong first pass, then quick editing, copying, or export without leaving the same view.",
      };
  }
}

function getCalculatorOutputShowcase(name, shortName, variant) {
  switch (variant) {
    case "takeHome":
      return {
        eyebrow: "Net view",
        title: "Show the usable number first, then keep the deductions close underneath.",
        body: "That makes scenario comparisons faster and keeps the output easy to explain later.",
      };
    case "planning":
      return {
        eyebrow: "Planning result",
        title: `The ${shortName.toLowerCase()} result should help you decide, not just calculate.`,
        body: "Lead with the headline impact, then use the supporting cards and notes to understand what changed.",
      };
    case "pricing":
      return {
        eyebrow: "Rate summary",
        title: "Keep the recommended rate prominent and the why directly below it.",
        body: "Pricing tools feel more trustworthy when the underlying assumptions are visible at the same time.",
      };
    case "comparison":
      return {
        eyebrow: "Comparison result",
        title: "The trade-offs between scenarios should be readable at a glance.",
        body: "A strong comparison surface makes the main difference obvious before you dive into the supporting math.",
      };
    case "businessMath":
      return {
        eyebrow: "Breakdown view",
        title: "The lead number stays first while the commercial math stays clean and close.",
        body: "That keeps revenue, cost, tax, and margin calculations readable from one pricing check to the next.",
      };
    default:
      return {
        eyebrow: "Converted view",
        title: `The ${shortName.toLowerCase()} result should be obvious on first scan.`,
        body: "Lead with the main conversion, then keep the supporting cards and breakdown visible right beneath it.",
      };
  }
}

function getStudioInlineChips(badge, variant) {
  if (variant === "analysis") {
    return [badge, "Target-aware review", "No server save"];
  }
  if (variant === "proposal" || variant === "billing" || variant === "operations") {
    return [badge, "Client-ready structure", "No server save"];
  }
  if (variant === "interview") {
    return [badge, "Practice-ready draft", "No server save"];
  }
  if (variant === "communication") {
    return [badge, "Tone-aware copy", "No server save"];
  }
  return [badge, "Structured first pass", "No server save"];
}

function getStudioPendingMessage(variant) {
  if (variant === "analysis") {
    return "Add the source and target on the left, run the review once, and the comparison report will stay here ready to copy or export.";
  }
  if (variant === "proposal" || variant === "billing" || variant === "operations") {
    return "Complete the document inputs on the left, generate once, and the client-ready draft will stay here ready to copy or export.";
  }
  return "Add the source on the left, run the tool once, and the reviewed draft will stay here ready to copy or export.";
}

function getCalculatorPendingMessage(variant) {
  if (variant === "comparison") {
    return "Add the scenario inputs on the left, compare once, and the side-by-side result will stay here ready to copy or export.";
  }
  return "Adjust the assumptions on the left, calculate once, and the estimate will stay here ready to copy or export.";
}

function pickTheme(seed, themeIds) {
  const index = hashString(seed) % themeIds.length;
  return THEME_LIBRARY[themeIds[index]] || THEME_LIBRARY.slate;
}

function hashString(value) {
  return String(value || "")
    .split("")
    .reduce((total, char, index) => total + char.charCodeAt(0) * (index + 17), 0);
}
