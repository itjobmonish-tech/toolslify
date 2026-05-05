import { getToolInteriorProfile } from "./tool-interiors.js";
import { CALCULATOR_TOOL_SLUGS, getCalculatorConfig } from "./calculator-tools.js";
import { ARCHIVED_TOOL_SLUGS } from "./archived-tools.mjs";

const CATEGORY_DEFINITIONS = [
  {
    slug: "finance",
    title: "Finance",
    description:
      "Mortgage, tax, retirement, debt, pay, loan, and investment calculators for faster money decisions.",
    icon: "document",
    accent: "#5f81be",
    tint: "rgba(95, 129, 190, 0.16)",
  },
  {
    slug: "salary-data",
    title: "Salary Data",
    description:
      "Offer comparison, pay cadence, compensation, overtime, raise, and work-model tools for clearer pay decisions.",
    icon: "document",
    accent: "#5c7ed3",
    tint: "rgba(92, 126, 211, 0.16)",
  },
  {
    slug: "cost-of-living",
    title: "Cost of Living",
    description:
      "City comparisons, relocation planning, commute math, household tradeoff, and salary-adjustment tools for real move decisions.",
    icon: "document",
    accent: "#4c8da8",
    tint: "rgba(76, 141, 168, 0.16)",
  },
  {
    slug: "education-roi",
    title: "Education ROI",
    description:
      "College, certification, trade school, transfer, and career-training ROI calculators for higher-stakes education decisions.",
    icon: "document",
    accent: "#4c8b78",
    tint: "rgba(76, 139, 120, 0.16)",
  },
  {
    slug: "mortgage-data",
    title: "Mortgage Hub",
    description:
      "Mortgage payment, refinance, affordability, DTI, HELOC, and home-buying decision tools in one focused section.",
    icon: "document",
    accent: "#5173b6",
    tint: "rgba(81, 115, 182, 0.16)",
  },
  {
    slug: "tax-budget",
    title: "Tax & Budget",
    description:
      "Refund, withholding, 1099, self-employment, budget, runway, and care-cost tools for tighter monthly planning.",
    icon: "document",
    accent: "#5c8b73",
    tint: "rgba(92, 139, 115, 0.16)",
  },
  {
    slug: "home-costs",
    title: "Home Costs",
    description:
      "Roof, siding, paint, flooring, HVAC, remodel, solar, and replacement cost tools for better project pricing.",
    icon: "document",
    accent: "#bb7156",
    tint: "rgba(187, 113, 86, 0.16)",
  },
  {
    slug: "health",
    title: "Health",
    description:
      "Calorie, body composition, fertility, heart-rate, pace, and training calculators in one clean section.",
    icon: "document",
    accent: "#5d9d73",
    tint: "rgba(93, 157, 115, 0.16)",
  },
  {
    slug: "home",
    title: "Home",
    description:
      "Roofing, paint, concrete, flooring, decking, and material estimators for home and site projects.",
    icon: "document",
    accent: "#b76a4e",
    tint: "rgba(183, 106, 78, 0.16)",
  },
  {
    slug: "math",
    title: "Math",
    description:
      "GPA, fractions, statistics, scientific, and classroom-style calculators for sharper number work.",
    icon: "document",
    accent: "#6d74c7",
    tint: "rgba(109, 116, 199, 0.16)",
  },
  {
    slug: "time",
    title: "Time",
    description:
      "Clock math, durations, work hours, scheduling, and practical time calculators for repeat use.",
    icon: "document",
    accent: "#4e8b8f",
    tint: "rgba(78, 139, 143, 0.16)",
  },
  {
    slug: "everyday",
    title: "Everyday",
    description:
      "Date math, percentages, numerals, grade checks, and practical everyday calculators for quick answers.",
    icon: "document",
    accent: "#7786a8",
    tint: "rgba(119, 134, 168, 0.16)",
  },
  {
    slug: "cooking",
    title: "Cooking",
    description:
      "Recipe conversions, butter math, oven settings, and kitchen measurement helpers for faster prep.",
    icon: "document",
    accent: "#c7884d",
    tint: "rgba(199, 136, 77, 0.16)",
  },
  {
    slug: "converters",
    title: "Converters",
    description:
      "Unit conversion tools for length, area, volume, energy, storage, weight, and utility math.",
    icon: "document",
    accent: "#4b90a1",
    tint: "rgba(75, 144, 161, 0.16)",
  },
];

const PRIORITY_TOOL_NAMES = new Set([
  "Mortgage Calculator",
  "Paycheck Calculator",
  "Tax Refund Calculator",
  "Calorie Calculator",
  "TDEE Calculator",
  "Body Fat Calculator",
  "Retirement Calculator",
  "Roofing Calculator",
  "Paint Calculator",
  "Concrete Calculator",
  "House Affordability Calculator",
  "Credit Card Payoff Calculator",
  "Student Loan Calculator",
  "Sales Tax Calculator",
  "Ovulation Calculator",
  "Salary to Hourly Calculator",
  "Paycheck Calculator",
  "Take-Home Pay Calculator",
  "Compound Interest Calculator",
  "Loan Calculator",
  "Percentage Calculator",
  "BMI Calculator",
  "Area Converter",
  "Freelance Rate Calculator",
  "Timesheet Calculator",
  "Profit Margin Calculator",
  "VAT Calculator",
  "Contractor vs Employee Calculator",
  "City vs City Cost of Living Comparison",
  "Salary by Role and State",
  "Roof Replacement Cost Estimator",
  "Mortgage Payment by Home Price",
  "State Income Tax Estimator",
  "Tax Refund Estimator",
  "Monthly Budget Planner",
  "Relocation Budget Planner",
  "Commute Cost Calculator",
  "Business Loan Calculator",
  "Customer Acquisition Cost Calculator",
  "Burn Rate Calculator",
  "ROAS Calculator",
  "Website Ad Revenue Calculator",
  "YouTube Money Calculator",
  "SaaS Lifetime Value Calculator",
  "WACC Calculator",
  "Debt Service Coverage Ratio Calculator",
  "Job Offer True Take-Home Comparator",
  "W-2 vs 1099 Real Net Pay Planner",
  "Pay Raise After-Tax Impact Calculator",
  "State-to-State Move Cost and Tax Impact Tool",
  "Layoff Survival Runway Planner",
  "Life Event Cashflow Simulator",
  "Student Loan Repayment Strategy Simulator",
  "Roth vs Traditional 401(k) Decision Engine",
  "Social Security Claim Age Planner",
  "Mortgage Recast vs Refinance vs Extra Payment Calculator",
  "True Home Affordability Calculator",
  "Buy vs Rent With Timeline Calculator",
  "Home Energy Upgrade Payback Planner",
  "EV vs Gas Total Cost Calculator",
  "Flood Risk Insurance and Mortgage Exposure Planner",
  "Childcare vs Stay-at-Home Parent Calculator",
  "Family Health Plan Total Cost Estimator",
  "Career Change Payback Timeline",
  "Freelancer Rate Reality Calculator",
  "Medicare Plan Cost Comparator",
  "College Offer True Net Cost + Debt Outcome Comparator",
  "Trade School vs 4-Year Degree ROI Planner",
  "Transfer Credit + Graduation Delay Cost Planner",
  "Grad School vs Work-Now Lifetime Earnings Comparator",
  "Bootcamp vs Self-Taught Career Switch ROI Planner",
  "Certification ROI + Promotion Odds Planner",
  "College Major ROI + Loan Stress Comparator",
  "Internship Offer vs Part-Time Work Income Planner",
  "Career Break for Masters Degree Payback Planner",
  "Apprenticeship vs College Cashflow Comparator",
  "Nursing Program Waitlist vs Private Program Cost Planner",
  "Community College Transfer Path Cost Optimizer",
  "Study Abroad Semester Budget + Degree Delay Planner",
  "Employer Tuition Reimbursement vs Student Loan Payoff Planner",
  "License Exam Retake + Delay Cost Planner",
  "401k Calculator",
  "Auto Loan Calculator",
  "Debt to Income Ratio Calculator",
  "Emergency Fund Calculator",
  "Home Affordability Calculator",
  "IRA Calculator",
  "Mortgage Amortization Calculator",
  "Mortgage Comparison Calculator",
  "Mortgage Payoff Calculator",
  "Mortgage Refinance Calculator",
  "Paint Coverage Calculator",
  "Personal Loan Calculator",
  "PMI Calculator",
  "Rental Property Calculator",
]);

const RESUME_SAMPLE = [
  "Name: Jordan Patel",
  "Role: Senior customer success manager",
  "Experience: 7 years leading onboarding, renewals, and expansion programs for B2B SaaS accounts",
  "Skills: customer retention, QBRs, onboarding, SQL, Salesforce, stakeholder management",
  "Wins: Improved gross retention from 88% to 94%; launched a new onboarding playbook; managed 45 enterprise accounts",
].join("\n");

const JOB_SAMPLE = [
  "Role: Senior lifecycle marketing manager",
  "Focus: onboarding, activation, retention, experimentation, CRM tooling, SQL, reporting",
  "Context: cross-functional work with product, analytics, and brand teams",
].join("\n");

const LINKEDIN_SAMPLE = [
  "Name: Maya Evans",
  "Role: Freelance growth consultant",
  "Strengths: experimentation, lifecycle marketing, landing page strategy, analytics",
  "Proof: Grew sign-up conversion by 24% for a B2B software client",
].join("\n");

const INTERVIEW_SAMPLE = [
  "Role: Senior product manager",
  "Company: Fintech startup",
  "Focus: cross-functional launches, payment experience, stakeholder alignment, metrics ownership",
].join("\n");

const FOLLOW_UP_SAMPLE = [
  "Name: Maya Evans",
  "Company: Orbit Labs",
  "Role: Senior lifecycle marketing manager",
  "Notes: Great conversation about onboarding experiments and retention reporting.",
].join("\n");

const RESIGNATION_SAMPLE = [
  "Name: Maya Evans",
  "Role: Growth marketing lead",
  "Company: Northline Digital",
  "Notice: 4 weeks",
  "Last day: 2026-05-22",
].join("\n");

const BUSINESS_SAMPLE = [
  "Business: Northline Studio",
  "Client: Oakridge Media",
  "Date: 2026-04-17",
  "Amount: 3200",
  "Items:",
  "- Campaign planning retainer - 1800",
  "- Landing page copy and revisions - 900",
  "- Weekly reporting setup - 500",
].join("\n");

const PROPOSAL_SAMPLE = [
  "Client: Oakridge Media",
  "Project: Website messaging refresh",
  "Goals: Clarify value proposition, improve conversion, tighten brand voice",
  "Deliverables: workshop, homepage copy, feature page copy, review rounds",
  "Timeline: 3 weeks",
  "Budget: 6500",
].join("\n");

const EXPENSE_SAMPLE = [
  "Employee: Maya Evans",
  "Project: London client visit",
  "Expenses:",
  "- Train to client office - 86",
  "- Lunch with client team - 42",
  "- Hotel - 240",
].join("\n");

const ONBOARDING_SAMPLE = [
  "Business: Northline Studio",
  "Service: Website messaging and conversion support",
  "Needs: stakeholder interviews, analytics access, brand guidelines, approval process",
  "Timeline: kickoff next week, launch in 30 days",
].join("\n");

const RAW_TOOLS = [
  draftTool("Resume Builder", "resume-job-tools", "Career starter", RESUME_SAMPLE, {
    detailLabel: "Target role or company",
    detailPlaceholder: "Senior product manager at a B2B SaaS company",
    aliases: ["free resume builder", "resume maker online"],
  }),
  draftTool("ATS Resume Checker", "resume-job-tools", "ATS review", RESUME_SAMPLE, {
    detailLabel: "Paste the job description",
    detailPlaceholder: "Add the target job description for keyword matching",
    aliases: ["resume ats checker", "resume scanner"],
  }),
  draftTool("Cover Letter Generator", "resume-job-tools", "Job application", RESUME_SAMPLE, {
    detailLabel: "Company or job brief",
    detailPlaceholder: "Paste the role summary or company context",
    aliases: ["cover letter builder", "cover letter writer"],
  }),
  draftTool("Resume Summary Generator", "resume-job-tools", "Profile polish", RESUME_SAMPLE, {
    detailLabel: "Target role or angle",
    detailPlaceholder: "Customer success lead, growth marketer, data analyst",
  }),
  draftTool("Resume Bullet Rewriter", "resume-job-tools", "Bullet rewrite", "- Responsible for onboarding new enterprise customers\n- Worked on churn reduction projects\n- Managed weekly retention reporting", {
    detailLabel: "Role or tone",
    detailPlaceholder: "More results-focused for account executive roles",
  }),
  draftTool("Job Description Keyword Extractor", "resume-job-tools", "Hiring keywords", JOB_SAMPLE),
  draftTool("Resume Keyword Matcher", "resume-job-tools", "Keyword match", RESUME_SAMPLE, {
    detailLabel: "Paste the target job description",
    detailPlaceholder: "Add the job description to compare against your resume",
  }),
  draftTool("LinkedIn Headline Generator", "resume-job-tools", "LinkedIn profile", LINKEDIN_SAMPLE, {
    detailLabel: "Target audience",
    detailPlaceholder: "Recruiters, startup founders, hiring managers",
  }),
  draftTool("LinkedIn About Generator", "resume-job-tools", "LinkedIn profile", LINKEDIN_SAMPLE, {
    detailLabel: "Voice or audience",
    detailPlaceholder: "Warm and concise for agency founders",
  }),
  draftTool("Interview Question Generator", "resume-job-tools", "Interview prep", INTERVIEW_SAMPLE, {
    detailLabel: "Interview focus",
    detailPlaceholder: "Behavioral, technical, panel, leadership",
  }),
  draftTool("Interview Answer Builder", "resume-job-tools", "Interview prep", "Question: Tell me about a time you improved a process under pressure.\nSituation: Customer onboarding was taking too long and churn was rising.\nAction: I redesigned the handoff flow, added product usage alerts, and built a shared playbook.\nResult: Activation time dropped by 19% over two quarters.", {
    detailLabel: "Role or company context",
    detailPlaceholder: "Growth analyst role at an ecommerce company",
  }),
  draftTool("Thank You Email Generator", "resume-job-tools", "Follow-up email", FOLLOW_UP_SAMPLE, {
    detailLabel: "Tone or company name",
    detailPlaceholder: "Warm, concise note for Orbit Labs",
  }),
  draftTool("Follow-Up Email Generator", "resume-job-tools", "Follow-up email", FOLLOW_UP_SAMPLE, {
    detailLabel: "Goal or next step",
    detailPlaceholder: "Check on timeline after final round interview",
  }),
  draftTool("Resignation Letter Generator", "resume-job-tools", "Career transition", RESIGNATION_SAMPLE, {
    detailLabel: "Tone",
    detailPlaceholder: "Short, appreciative, professional",
  }),
  draftTool("CV to Resume Converter", "resume-job-tools", "CV cleanup", RESUME_SAMPLE, {
    detailLabel: "Target role",
    detailPlaceholder: "Sales operations manager, content strategist, engineer",
  }),

  ...buildCalculatorDefinitions(),

  draftTool("Invoice Generator", "freelancer-business-tools", "Billing docs", BUSINESS_SAMPLE, {
    detailLabel: "Currency or payment terms",
    detailPlaceholder: "USD, Net 14, ACH only",
    aliases: ["invoice maker", "online invoice generator"],
  }),
  draftTool("Quote Generator", "freelancer-business-tools", "Sales docs", BUSINESS_SAMPLE, {
    detailLabel: "Expiry or pricing note",
    detailPlaceholder: "Valid for 14 days, 50% upfront",
  }),
  draftTool("Estimate Generator", "freelancer-business-tools", "Sales docs", BUSINESS_SAMPLE, {
    detailLabel: "Range or assumptions",
    detailPlaceholder: "Timeline depends on client feedback turnaround",
  }),
  draftTool("Proposal Generator", "freelancer-business-tools", "Client proposal", PROPOSAL_SAMPLE, {
    detailLabel: "Client context",
    detailPlaceholder: "SaaS homepage refresh for a B2B marketing team",
  }),
  draftTool("Scope of Work Generator", "freelancer-business-tools", "Project scope", PROPOSAL_SAMPLE, {
    detailLabel: "Delivery style",
    detailPlaceholder: "Retainer engagement with weekly check-ins",
  }),
  draftTool("Freelance Contract Generator", "freelancer-business-tools", "Legal starter", PROPOSAL_SAMPLE, {
    detailLabel: "Jurisdiction or payment terms",
    detailPlaceholder: "England and Wales, 14-day payment terms",
  }),
  draftTool("Purchase Order Generator", "freelancer-business-tools", "Procurement", BUSINESS_SAMPLE, {
    detailLabel: "Shipping or delivery note",
    detailPlaceholder: "Deliver by May 6, partial shipment allowed",
  }),
  draftTool("Receipt Generator", "freelancer-business-tools", "Billing docs", BUSINESS_SAMPLE, {
    detailLabel: "Payment method or order reference",
    detailPlaceholder: "Paid by bank transfer, order #4821",
  }),
  calculatorTool("Timesheet Calculator", "freelancer-business-tools", "Time tracking"),
  draftTool("Expense Report Generator", "freelancer-business-tools", "Ops admin", EXPENSE_SAMPLE, {
    detailLabel: "Reporting period",
    detailPlaceholder: "April 1 to April 15, project launch travel",
  }),
  calculatorTool("Profit Margin Calculator", "freelancer-business-tools", "Business math"),
  calculatorTool("VAT Calculator", "freelancer-business-tools", "Tax math"),
  calculatorTool("Late Payment Interest Calculator", "freelancer-business-tools", "Cash flow"),
  draftTool("Retainer Invoice Generator", "freelancer-business-tools", "Billing docs", BUSINESS_SAMPLE, {
    detailLabel: "Billing cycle",
    detailPlaceholder: "Monthly retainer, bill on the 1st of each month",
  }),
  draftTool("Client Onboarding Form Builder", "freelancer-business-tools", "Client ops", ONBOARDING_SAMPLE, {
    detailLabel: "Project type",
    detailPlaceholder: "Brand strategy, website redesign, paid media retainer",
  }),
];

const CATEGORY_LOOKUP = Object.fromEntries(CATEGORY_DEFINITIONS.map((item) => [item.slug, item]));

export const TOOL_CATALOG = RAW_TOOLS
  .filter((entry) => CATEGORY_LOOKUP[entry.categorySlug])
  .map((entry) => buildTool(entry))
  .filter((tool) => !ARCHIVED_TOOL_SLUGS.has(tool.slug));
export const TOOL_LOOKUP = Object.fromEntries(TOOL_CATALOG.map((tool) => [tool.slug, tool]));
export const CATEGORY_COLLECTIONS = CATEGORY_DEFINITIONS.map((category) => ({
  ...category,
  tools: TOOL_CATALOG.filter((tool) => tool.categorySlug === category.slug),
}));

function draftTool(name, categorySlug, badge, starterInput, options = {}) {
  return {
    ...options,
    name,
    categorySlug,
    badge,
    processor: "document-draft",
    inputMode: "text",
    starterInput,
  };
}

function calculatorTool(name, categorySlug, badge, options = {}) {
  return {
    ...options,
    name,
    categorySlug,
    badge,
    workspace: "calculator",
    processor: "calculator",
    inputMode: "calculator",
  };
}

function buildTool(definition) {
  const category = CATEGORY_LOOKUP[definition.categorySlug];
  const workspace = definition.workspace || (definition.inputMode === "calculator" ? "calculator" : "studio");
  const processor = definition.processor || (workspace === "calculator" ? "calculator" : "document-draft");
  const slug = slugify(definition.name);
  const shortName = shortenName(definition.name);
  const interior = getToolInteriorProfile({
    name: definition.name,
    shortName,
    badge: definition.badge || category.title,
    categorySlug: definition.categorySlug,
    category: category.title,
    workspace,
    processor,
  });
  const resolvedInterior = {
    ...interior,
    theme: definition.theme || interior.theme,
    surfaceStyle: definition.surfaceStyle || interior.surfaceStyle,
  };
  const description =
    definition.description || buildDescription(definition.name, workspace, definition.categorySlug);

  return {
    slug,
    name: definition.name,
    shortName,
    badge: definition.badge || category.title,
    categorySlug: definition.categorySlug,
    category: category.title,
    categoryColor: category.accent,
    categoryTint: category.tint,
    workspace,
    mode: processor,
    description,
    headline: definition.headline || interior.outputShowcase?.body || buildHeadline(definition.name, workspace),
    keywords: unique([
      definition.name.toLowerCase(),
      `${definition.name.toLowerCase()} online`,
      `free ${definition.name.toLowerCase()}`,
      ...((definition.aliases || []).map((item) => item.toLowerCase())),
    ]),
    popular: PRIORITY_TOOL_NAMES.has(definition.name),
    quickAccess: PRIORITY_TOOL_NAMES.has(definition.name),
    path: `/tools/${slug}`,
    seoTitle: definition.name,
    seoDescription: description,
    ctaLabel: definition.ctaLabel || interior.ctaLabel || getActionLabel(definition.name, workspace),
    inputTitle: definition.inputTitle || interior.inputTitle || (workspace === "calculator" ? "Calculator inputs" : "Brief or source text"),
    inputPlaceholder:
      workspace === "calculator"
        ? "Adjust the fields to generate the estimate."
        : "Paste notes, bullet points, client details, or job context to generate a clean draft.",
    outputTitle: definition.outputTitle || interior.outputTitle || (workspace === "calculator" ? "Estimate" : "Draft output"),
    outputPlaceholder:
      workspace === "calculator"
        ? "The estimate, breakdown, and notes will appear here."
        : "The generated draft will appear here ready to copy or download.",
    sidebarTitle: category.title,
    heroStats:
      definition.heroStats ||
      interior.heroStats ||
      (workspace === "calculator"
        ? [
            { label: "Input", value: "Manual values" },
            { label: "Result", value: "Instant breakdown" },
            { label: "Flow", value: "Calculate and compare" },
          ]
        : [
            { label: "Input", value: "Notes or brief" },
            { label: "Result", value: "Editable draft" },
            { label: "Flow", value: "Generate and reuse" },
          ]),
    featureCards: definition.featureCards || resolvedInterior.featureCards || getFeatureCards(workspace, definition.categorySlug),
    useCases: definition.useCases || getUseCases(definition.categorySlug),
    faq: definition.faq || getFaq(definition.name, workspace),
    interior: resolvedInterior,
    settings: {
      processor,
      inputMode: definition.inputMode,
      accept: workspace === "calculator" ? "" : ".txt,.md,text/plain",
      detailLabel: definition.detailLabel || "",
      detailPlaceholder: definition.detailPlaceholder || "",
      starterInput: definition.starterInput || "",
      outputFormat: workspace === "calculator" ? "calculator" : "txt",
    },
  };
}

function buildDescription(name, workspace, categorySlug) {
  if (workspace === "calculator") {
    if (categorySlug === "salary-data") {
      return `${name} helps you compare compensation paths, pressure-test job offers, and translate pay across work models with a clear browser result.`;
    }

    if (categorySlug === "cost-of-living") {
      return `${name} helps you compare city costs, model relocation tradeoffs, and pressure-test affordability without opening a spreadsheet first.`;
    }

    if (categorySlug === "education-roi") {
      return `${name} helps you compare tuition, debt, timing, earnings, and training tradeoffs so education decisions are easier to pressure-test before you commit.`;
    }

    if (categorySlug === "mortgage-data") {
      return `${name} helps you model mortgage payments, refinance scenarios, approval limits, and buying decisions with a clear result breakdown.`;
    }

    if (categorySlug === "tax-budget") {
      return `${name} helps you estimate taxes, plan budgets, and pressure-test savings or payoff scenarios with a clear result view.`;
    }

    if (categorySlug === "home-costs") {
      return `${name} helps you estimate renovation, replacement, and project pricing quickly with clearer low, expected, and high cost ranges.`;
    }

    if (categorySlug === "math") {
      return `${name} helps you work through grades, fractions, statistics, and number logic in the browser with a cleaner result surface that stays easy to reuse.`;
    }

    if (categorySlug === "time") {
      return `${name} helps you handle clock math, durations, schedules, and hour totals quickly in the browser.`;
    }

    if (/converter| to |conversion/i.test(name)) {
      return `${name} converts the values you enter into a clearer result table so you can compare units quickly without leaving the browser.`;
    }

    if (/roof|paint|concrete|tile|drywall|deck|insulation|fence|topsoil|sod|paver|flooring|asphalt|gravel|mulch/i.test(name)) {
      return `${name} helps you estimate coverage, quantities, and project math quickly with a cleaner result view that stays easy to reuse on the job or at home.`;
    }

    if (/bmi|bmr|steps|pregnancy|whr|calories/i.test(name)) {
      return `${name} helps you check health and activity numbers quickly with a cleaner result view that stays easy to review and share.`;
    }

    if (/loan|interest|compound|savings|salary|pay|mortgage|investment|cash back|stock|apy|cagr|sip|margin/i.test(name)) {
      return `${name} helps you model money scenarios quickly in the browser with a clear result breakdown you can reuse without opening a spreadsheet.`;
    }

    return `${name} turns everyday inputs into a cleaner calculated result with a breakdown table you can review, copy, or download right away.`;
  }

  if (/checker|matcher/i.test(name)) {
    return `${name} reviews your input against a target brief, highlights the strongest matches, and surfaces the gaps that still need work before you send anything out.`;
  }

  if (/extractor/i.test(name)) {
    return `${name} pulls the most useful hiring language and repeated keywords from a job description so you can rewrite faster and stay closer to search intent.`;
  }

  if (categorySlug === "resume-job-tools") {
    return `${name} turns rough career notes, job details, or application copy into a cleaner draft you can copy, edit, and use right away without starting from a blank page.`;
  }

  return `${name} turns client details, project notes, and business inputs into a structured draft you can send, adapt, or reuse with less admin work.`;
}

function buildHeadline(name, workspace) {
  if (workspace === "calculator") {
    return `Use ${name.toLowerCase()} to compare scenarios quickly, understand the numbers, and keep the result easy to share with clients, teammates, or yourself.`;
  }

  return `Use ${name.toLowerCase()} when rough notes need to become a cleaner, more usable draft without the usual blank-page friction.`;
}

function shortenName(name) {
  return name
    .replace(/\s+Calculator$/i, "")
    .replace(/\s+Generator$/i, "")
    .replace(/\s+Builder$/i, "")
    .replace(/\s+Checker$/i, "")
    .replace(/\s+Matcher$/i, "")
    .replace(/\s+Converter$/i, "")
    .replace(/\s+Extractor$/i, "")
    .trim();
}

function getActionLabel(name, workspace) {
  if (workspace === "calculator") return "Calculate result";
  if (/checker|matcher/i.test(name)) return "Review match";
  if (/extractor/i.test(name)) return "Extract keywords";
  if (/converter/i.test(name)) return "Convert draft";
  if (/builder/i.test(name)) return "Build draft";
  return "Generate draft";
}

function getFeatureCards(workspace, categorySlug) {
  if (workspace === "calculator") {
    return [
      {
        title: "Scenario-friendly inputs",
        body: "Adjust one or two assumptions and compare the new outcome without rebuilding a sheet from scratch.",
      },
      {
        title: "Clear summary first",
        body: "The lead result stays large and obvious, while the supporting cards and notes stay close underneath.",
      },
      {
        title: "Ready to reuse",
        body: "Copy or download the estimate after the first pass so it is easy to save, send, or revisit later.",
      },
    ];
  }

  if (categorySlug === "resume-job-tools") {
    return [
      {
        title: "Career-specific structure",
        body: "The first draft is shaped around resumes, job search writing, and interview prep instead of generic text generation.",
      },
      {
        title: "Editing is still easy",
        body: "The result stays plain, readable, and simple to refine so you can customize it before sending anything important.",
      },
      {
        title: "Fast browser drafting",
        body: "Paste once, generate the draft, then copy or download it without leaving the same screen.",
      },
    ];
  }

  return [
    {
      title: "Client-ready formatting",
      body: "The tool turns loose notes into a business document draft that already feels structured enough to review or send.",
    },
    {
      title: "Faster admin work",
      body: "Invoices, quotes, proposals, and onboarding docs stay in one straightforward browser flow instead of multiple templates and tabs.",
    },
    {
      title: "Easy to reuse",
      body: "The same clean browser flow works whether you are drafting a one-off document or repeating the same admin task every week.",
    },
  ];
}

function getUseCases(categorySlug) {
  if (categorySlug === "salary-data") {
    return [
      "comparing job offers, work models, and compensation scenarios quickly",
      "converting pay across hourly, monthly, yearly, and total-comp views",
      "checking raises, bonuses, overtime, and freelance pricing without spreadsheet cleanup",
    ];
  }

  if (categorySlug === "cost-of-living") {
    return [
      "comparing city costs, relocation budgets, and salary adjustments quickly",
      "checking commute, household, and first-year move tradeoffs before you relocate",
      "keeping relocation planning and affordability math in one browser tab",
    ];
  }

  if (categorySlug === "education-roi") {
    return [
      "comparing college, training, certification, and transfer decisions before you borrow or enroll",
      "checking tuition, debt, salary lift, and payback timelines without building your own spreadsheet",
      "keeping education ROI and career-planning math in one place",
    ];
  }

  if (categorySlug === "mortgage-data") {
    return [
      "estimating mortgage, refinance, HELOC, and affordability scenarios quickly",
      "checking payment tradeoffs before talking to a lender or agent",
      "reusing cleaner housing decision outputs right from the browser",
    ];
  }

  if (categorySlug === "tax-budget") {
    return [
      "estimating refunds, withholding, 1099 tax, and self-employment outcomes quickly",
      "planning budgets, emergency funds, runway, and care costs without spreadsheet drag",
      "keeping monthly cashflow decisions in one place",
    ];
  }

  if (categorySlug === "home-costs") {
    return [
      "estimating roof, paint, remodel, replacement, and installation pricing quickly",
      "checking low, expected, and high project cost ranges before bids arrive",
      "keeping renovation pricing and replacement math easy to compare",
    ];
  }

  if (categorySlug === "finance") {
    return [
      "comparing mortgages, debt, tax, salary, and retirement scenarios quickly",
      "checking money decisions without building a spreadsheet first",
      "reusing clean finance outputs right from the browser",
    ];
  }

  if (categorySlug === "health") {
    return [
      "estimating calories, body composition, and training numbers quickly",
      "checking cycle, pace, and heart-rate math without extra apps",
      "keeping repeat health calculations easy to review",
    ];
  }

  if (categorySlug === "home") {
    return [
      "estimating roofing, paint, concrete, and material quantities quickly",
      "planning home or site projects without jumping between tools",
      "rechecking coverage and counts with cleaner browser outputs",
    ];
  }

  if (categorySlug === "math") {
    return [
      "working through grades, fractions, statistics, and scientific math quickly",
      "checking classroom or spreadsheet-style calculations without extra clutter",
      "keeping cleaner math outputs ready to copy right from the browser",
    ];
  }

  if (categorySlug === "time") {
    return [
      "solving durations, hours, and schedule math quickly",
      "checking shift lengths and clock adjustments without manual time math",
      "keeping repeat time calculations easy to review",
    ];
  }

  if (categorySlug === "cooking") {
    return [
      "converting kitchen measures and oven settings quickly",
      "switching between cups, grams, tablespoons, and recipe units",
      "keeping cooking math fast and easy to scan on any device",
    ];
  }

  if (categorySlug === "converters") {
    return [
      "converting units quickly across distance, weight, area, and energy",
      "checking pair conversions without opening a separate app",
      "sharing cleaner converted values right from the browser",
    ];
  }

  if (categorySlug === "everyday") {
    return [
      "solving date, percentage, and everyday planning problems quickly",
      "checking scenarios without building your own spreadsheet first",
      "sharing clean calculated results right from the browser",
    ];
  }

  return [
    "creating client-facing documents faster",
    "sending quotes, invoices, and retainers with less admin friction",
    "keeping small business paperwork consistent from one job to the next",
  ];
}

function buildCalculatorDefinitions() {
  return CALCULATOR_TOOL_SLUGS.map((slug) => {
    const config = getCalculatorConfig(slug);
    const categorySlug = config.categorySlug || inferCalculatorCategory(config.title, slug);
    return calculatorTool(config.title, categorySlug, config.badge || inferCalculatorBadge(config.title, slug), {
      aliases: unique([...(config.aliases || []), ...inferCalculatorAliases(config.title, slug)]),
      ctaLabel: config.actionLabel,
      description: config.emptyState,
      outputTitle: config.summaryLabel,
      surfaceStyle: config.surfaceStyle,
      theme: config.theme,
      featureCards: config.featureCards,
      heroStats: config.heroStats,
      useCases: config.useCases,
      faq: config.faq,
    });
  });
}

function inferCalculatorBadge(title, slug = "") {
  const value = `${title} ${slug}`.toLowerCase();
  const category = inferCalculatorCategory(title, slug);

  if (category === "finance") {
    if (/tax|vat/i.test(value)) return "Tax";
    if (/loan|mortgage|emi|heloc|refinance|debt|credit card|apr|payoff|lease/i.test(value)) return "Debt";
    if (/salary|paycheck|take-home|gross|net|bonus|commission|raise|freelance|rate|tip/i.test(value)) return "Pay";
    return "Finance";
  }

  if (category === "health") {
    if (/ovulation|pregnancy|conception/i.test(value)) return "Cycle";
    if (/pace|heart|one-rep|max|steps/i.test(value)) return "Fitness";
    return "Health";
  }

  if (category === "home") {
    if (/roof/i.test(value)) return "Roofing";
    if (/paint/i.test(value)) return "Paint";
    if (/solar/i.test(value)) return "Solar";
    if (/btu/i.test(value)) return "HVAC";
    return "Home";
  }

  if (category === "math") {
    if (/gpa|grade/i.test(value)) return "Grades";
    if (/fraction|decimal/i.test(value)) return "Fractions";
    if (/average|median|mode|deviation/i.test(value)) return "Stats";
    return "Math";
  }

  if (category === "time") {
    if (/work hours|hours calculator/i.test(value)) return "Hours";
    return "Time";
  }

  if (category === "cooking") return "Cooking";
  if (category === "converters") return "Conversion";
  return "Everyday";
}

function inferCalculatorCategory(title, slug = "") {
  const value = `${title} ${slug}`.toLowerCase();

  if (/cups|grams|ounces|teaspoons|tablespoons|air fryer|oven|butter|cooking|pints|quarts|ml-to|cups-to|grams-to/i.test(value)) {
    return "cooking";
  }

  if (/gpa|grade calculator|scientific|fraction|mixed number|decimal to percent|fraction to decimal|average calculator|mean median mode|standard deviation/i.test(value)) {
    return "math";
  }

  if (/time calculator|time duration|hours calculator|work hours/i.test(value)) {
    return "time";
  }

  if (/converter| to |conversion|feet|inches|meters|gallons|liters|watts|amps|hertz|newton|pounds|stone|centimeters|millimeters|kilojoules|data storage|length and distance|mass and weight|volume/i.test(value)) {
    return "converters";
  }

  if (/bmi|bmr|steps|pregnancy|whr|calorie|tdee|body fat|ovulation|macro|protein|ideal weight|lean body mass|pace|one-rep|max|heart rate|sleep|water intake|calories burned|waist-to-height|\bbac\b|blood alcohol|conception/i.test(value)) {
    return "health";
  }

  if (/roof|paint|concrete|tile|drywall|deck|insulation|fence|topsoil|sod|paver|flooring|square footage|price per square foot|asphalt|gravel|mulch|solar panel|btu/i.test(value)) {
    return "home";
  }

  if (/loan|interest|compound|savings|salary|pay|mortgage|investment|cash back|stock|apy|cagr|sip|margin|rate|tax|vat|retirement|401|roth|debt|credit card|apr|property tax|closing costs|heloc|rent vs buy|down payment|affordability|emi|capital gains|inflation|money counter|freelance|contractor|timesheet|overtime|notice|commission|bonus|raise|cost of living|late payment|percentage off|discount|tip|budget|net worth|dividend|roi|break even|markup|lease|future value|amortization|money last|time and a half|pto/i.test(value)) {
    return "finance";
  }

  return "everyday";
}

function inferCalculatorAliases(title, slug) {
  const aliases = new Set([slug.replace(/-/g, " ")]);

  if (/salary to hourly/i.test(title)) aliases.add("annual salary to hourly rate");
  if (/hourly to salary/i.test(title)) aliases.add("hourly wage to annual salary");
  if (/take-home/i.test(title)) aliases.add("net salary calculator");
  if (/compound interest/i.test(title)) aliases.add("investment growth calculator");
  if (/loan calculator/i.test(title)) aliases.add("loan repayment calculator");
  if (/percentage calculator/i.test(title)) aliases.add("percent calculator");
  if (/bmi calculator/i.test(title)) aliases.add("body mass index calculator");

  return [...aliases];
}

function getFaq(name, workspace) {
  if (workspace === "calculator") {
    return [
      {
        question: `Can I try different assumptions in ${name.toLowerCase()}?`,
        answer: "Yes. These calculators are built for quick scenario changes so you can compare outcomes without leaving the page.",
      },
      {
        question: `Does ${name.toLowerCase()} save my estimates on the server?`,
        answer: "No. Recent calculator history stays locally in your browser for convenience, not as a permanent server record.",
      },
      {
        question: "Can I copy or download the result?",
        answer: "Yes. Each calculator keeps copy and download actions close to the finished estimate.",
      },
    ];
  }

  return [
    {
      question: `Can I paste my own notes directly into ${name.toLowerCase()}?`,
      answer: "Yes. These tools are built for paste-first drafting so you can move from raw notes to a cleaner draft quickly.",
    },
    {
      question: `Is ${name.toLowerCase()} meant to replace my final editing pass?`,
      answer: "No. It is designed to create a strong first draft faster, then leave the final tailoring and review to you.",
    },
    {
      question: "Can I copy or download the generated draft?",
      answer: "Yes. The result panel keeps copy and download controls on the same screen as the output.",
    },
  ];
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}
