import { getCalculatorConfig } from "./calculator-tools.js";

const CATEGORY_SOURCE_MAP = {
  finance: [
    { label: "IRS", href: "https://www.irs.gov/" },
    { label: "CFPB", href: "https://www.consumerfinance.gov/" },
    { label: "Investor.gov", href: "https://www.investor.gov/" },
  ],
  "salary-data": [
    { label: "U.S. Bureau of Labor Statistics", href: "https://www.bls.gov/" },
    { label: "State labor agencies", href: "https://www.careeronestop.org/LocalHelp/service-locator.aspx" },
  ],
  "cost-of-living": [
    { label: "BLS Consumer Expenditure Surveys", href: "https://www.bls.gov/cex/" },
    { label: "BEA Regional Price Parities", href: "https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area" },
    { label: "U.S. Census ACS", href: "https://www.census.gov/programs-surveys/acs" },
  ],
  "education-roi": [
    { label: "College Scorecard", href: "https://collegescorecard.ed.gov/" },
    { label: "Federal Student Aid", href: "https://studentaid.gov/" },
    { label: "NCES", href: "https://nces.ed.gov/" },
    { label: "U.S. Bureau of Labor Statistics", href: "https://www.bls.gov/" },
  ],
  "mortgage-data": [
    { label: "CFPB mortgage resources", href: "https://www.consumerfinance.gov/consumer-tools/mortgages/" },
    { label: "HUD homebuying guidance", href: "https://www.hud.gov/topics/buying_a_home" },
    { label: "Freddie Mac MyHome", href: "https://myhome.freddiemac.com/" },
  ],
  "tax-budget": [
    { label: "IRS", href: "https://www.irs.gov/" },
    { label: "CFPB budgeting resources", href: "https://www.consumerfinance.gov/consumer-tools/budgeting/" },
  ],
  "home-costs": [
    { label: "BLS Producer Price Index", href: "https://www.bls.gov/ppi/" },
    { label: "U.S. Census construction data", href: "https://www.census.gov/construction/" },
  ],
  health: [
    { label: "CDC", href: "https://www.cdc.gov/" },
    { label: "NIH", href: "https://www.nih.gov/" },
    { label: "MedlinePlus", href: "https://medlineplus.gov/" },
  ],
};

export function getCalculatorSupportContent(tool) {
  const config = getCalculatorConfig(tool.slug);
  if (!config) return null;

  const normalizedDefaults = normalizeValues(config.defaults || {}, config);
  const exampleResult = config.validate(normalizedDefaults) ? null : config.compute(normalizedDefaults);
  const fields = [...(config.mainFields || []), ...(config.advancedFields || [])];
  const primaryFields = fields.slice(0, 5);
  const exampleInputs = primaryFields.map((field) => ({
    label: field.label,
    value: formatFieldValue(field, normalizedDefaults[field.name], normalizedDefaults.currency),
  }));
  const exampleOutputs = (exampleResult?.summaryCards || []).slice(0, 4).map((item) => ({
    label: item.label,
    value: item.value,
  }));

  return {
    formula: buildFormulaExplanation(tool, config),
    methodology: buildMethodology(tool, config, primaryFields),
    example: exampleResult
      ? {
          title: "Example calculation",
          inputs: exampleInputs,
          outputs: exampleOutputs,
          note: `This example uses the tool's starter assumptions so you can see the expected shape of the result before changing anything.`,
        }
      : null,
    assumptions: buildAssumptions(tool, config),
    whenWrong: buildLimitations(tool),
    sourceReview: buildSourceReview(tool),
  };
}

function buildFormulaExplanation(tool, config) {
  const labels = config.mainFields.map((field) => field.label.toLowerCase());

  if (tool.categorySlug === "mortgage-data") {
    return `This estimate uses the mortgage assumptions you enter, then applies payment, rate, term, tax, and insurance math to model the monthly or long-horizon housing result shown above.`;
  }

  if (tool.categorySlug === "home-costs" || tool.categorySlug === "home") {
    return `This estimate starts with ${labels.slice(0, 3).join(", ")}, then adjusts the base quantity or project cost using the option, material, and complexity assumptions selected in the tool.`;
  }

  if (tool.categorySlug === "health") {
    return `This calculator uses the entered body, activity, timing, or pace assumptions to estimate the health metric shown in the result cards. It is a planning model, not a diagnosis.`;
  }

  if (tool.categorySlug === "tax-budget") {
    return `This result applies the current input values for income, rates, deductions, and planning targets to produce an estimate. It is meant for rough planning, not a filed tax return or payroll record.`;
  }

  if (tool.categorySlug === "education-roi") {
    return `This calculator applies the tuition, aid, timing, debt, and earnings assumptions you enter to estimate the payback, cash drag, or long-horizon value of the education path shown above.`;
  }

  if (tool.categorySlug === "salary-data" || tool.categorySlug === "finance") {
    return `This calculator turns the pay, rate, schedule, or savings inputs you enter into a comparative estimate, then summarizes the strongest planning numbers in the cards and breakdown table below.`;
  }

  return `This calculator uses the values you enter in ${tool.inputTitle.toLowerCase()} to generate the summary cards, supporting breakdown, and downloadable table shown on the page.`;
}

function buildMethodology(tool, config, primaryFields) {
  const labels = primaryFields.map((field) => field.label);
  const firstStep = labels.length
    ? `Start with ${joinLabels(labels.slice(0, 3))} and keep the units consistent across the whole scenario.`
    : `Start with the main assumptions shown in the calculator inputs.`;

  return [
    firstStep,
    `Run ${config.actionLabel.toLowerCase()} to convert the raw assumptions into the summary cards, breakdown values, and supporting notes used by this tool.`,
    `Review the result as a planning pass first, then compare it against real quotes, payroll records, lender terms, clinical guidance, or project bids before making a final decision.`,
  ];
}

function buildAssumptions(tool, config) {
  const assumptions = [
    "The result is only as good as the assumptions entered into the calculator.",
    "Rates, taxes, labor, location factors, and plan rules can change the real-world outcome.",
  ];

  if (isDataSensitiveTool(tool)) {
    assumptions.unshift(
      "This page is an adjustable estimate, not a live lookup table or official database.",
    );
  }

  if (hasFieldKeyword(config, /tax|interest|rate|apr|return|margin/i)) {
    assumptions.push("Rate-based fields are treated as model assumptions, not live market or government data.");
  }

  if (hasFieldKeyword(config, /state|city|metro|location/i)) {
    assumptions.push("Location-sensitive outputs are directional estimates and may differ from real local quotes or filing rules.");
  }

  if (tool.categorySlug === "health") {
    assumptions.push("Health outputs are intended for general education and planning, not medical diagnosis or treatment.");
  }

  if (tool.categorySlug === "education-roi") {
    assumptions.push("School-specific aid packages, completion outcomes, transfer rules, and labor-market conditions can move the real result materially.");
  }

  if (tool.categorySlug === "home-costs" || tool.categorySlug === "home") {
    assumptions.push("Material waste, finish level, access issues, permits, and contractor availability can move the final price significantly.");
  }

  return assumptions;
}

function buildLimitations(tool) {
  if (isDataSensitiveTool(tool)) {
    return [
      "The result can be misleading if you treat it as current local, state, employer, lender, or government data.",
      "Use the adjustable inputs to model a scenario, then confirm the final number against current source data for the exact place, role, or rule that matters.",
      "Toolslify keeps these pages as planning calculators, not as authoritative lookup databases.",
    ];
  }

  if (tool.categorySlug === "health") {
    return [
      "The result may be misleading if your health status, medication, pregnancy, or training context requires clinical guidance.",
      "Body-composition, calorie, or pace estimates can drift when the input values are rounded, outdated, or based on incomplete measurements.",
      "Use the calculator as a quick planning tool, then confirm with a clinician or qualified coach when the decision matters.",
    ];
  }

  if (tool.categorySlug === "mortgage-data") {
    return [
      "The result may be off when lender overlays, credit profile, reserve requirements, insurance quotes, or closing-cost details differ from the assumptions entered here.",
      "Approval decisions, APR disclosures, and payment schedules should always be checked against official lender documents.",
      "Refinance or affordability tools are especially sensitive to term, tax, and insurance assumptions.",
    ];
  }

  if (tool.categorySlug === "tax-budget" || tool.categorySlug === "finance" || tool.categorySlug === "salary-data") {
    return [
      "The result may be wrong if payroll deductions, tax rules, benefits, grant vesting, or employer-specific policies differ from the assumptions entered here.",
      "Use the result for planning and comparisons, not as a substitute for payroll software, tax filing software, or investment advice.",
      "When the decision is high stakes, confirm the output against official statements, plan documents, or a qualified advisor.",
    ];
  }

  if (tool.categorySlug === "education-roi") {
    return [
      "The result may be wrong if school aid offers, transfer policies, completion outcomes, licensing rules, or hiring conditions differ from the assumptions entered here.",
      "Use the calculator for education planning and scenario comparisons, not as a substitute for an official aid letter, school catalog, or employment contract.",
      "When the decision is high stakes, confirm the numbers against official school cost documents, program outcomes, and current labor-market data.",
    ];
  }

  if (tool.categorySlug === "home-costs" || tool.categorySlug === "home") {
    return [
      "The result can drift when labor availability, permit requirements, demolition scope, finish tier, or regional pricing differs from the assumptions used here.",
      "Project estimates should be checked against current contractor bids and supplier pricing before you commit budget.",
      "Use the calculator to set expectations, not to replace a measured quote or engineering review.",
    ];
  }

  return [
    "The result can drift when the real-world inputs differ from the assumptions entered into the model.",
    "Use the calculator as a first-pass estimate, then verify the final number against source documents or real quotes before acting on it.",
  ];
}

function isDataSensitiveTool(tool) {
  return /by city|by state|by role|state|metro|salary|paycheck|tax|cost of living|benchmark|trend|roof cost|closing costs/i.test(
    `${tool.name} ${tool.categorySlug}`,
  );
}

function buildSourceReview(tool) {
  const sources = CATEGORY_SOURCE_MAP[tool.categorySlug] || [];
  if (!sources.length) return null;

  return {
    note: `Toolslify reviews the terminology, framing, and planning assumptions for this category against public guidance where applicable. The output remains an estimate and should be checked against the source documents that govern your exact case.`,
    sources,
    reviewLinks: [
      { label: "Editorial Policy", href: "/editorial-policy" },
      { label: "Accuracy Disclaimer", href: "/accuracy-disclaimer" },
    ],
  };
}

function hasFieldKeyword(config, pattern) {
  return [...(config.mainFields || []), ...(config.advancedFields || [])].some((field) =>
    pattern.test(field.label || ""),
  );
}

function formatFieldValue(field, value, currency) {
  if (field.type === "currency") {
    return formatCurrency(value, currency);
  }

  if (field.type === "percent") {
    return `${Number(value || 0).toFixed(1).replace(/\.0$/, "")}%`;
  }

  if (field.type === "select") {
    return field.options.find((option) => String(option.value) === String(value))?.label || String(value || "");
  }

  if (field.type === "boolean") {
    return value ? "Yes" : "No";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function normalizeValues(values, config) {
  const fields = [...(config.mainFields || []), ...(config.advancedFields || [])];

  return fields.reduce((accumulator, field) => {
    if (field.type === "boolean") {
      accumulator[field.name] = Boolean(values[field.name]);
      return accumulator;
    }

    if (field.type === "select") {
      accumulator[field.name] = values[field.name];
      return accumulator;
    }

    if (field.type === "date") {
      accumulator[field.name] = values[field.name] || "";
      return accumulator;
    }

    const numericValue = Number(values[field.name]);
    accumulator[field.name] = Number.isFinite(numericValue) ? numericValue : 0;
    return accumulator;
  }, {});
}

function joinLabels(labels) {
  if (labels.length <= 1) return labels[0] || "the main inputs";
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels.at(-1)}`;
}
