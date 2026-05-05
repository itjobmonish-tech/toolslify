import { clamp } from "./utils.js";

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (GBP)" },
  { value: "EUR", label: "EUR (EUR)" },
];

const PAY_FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "semimonthly", label: "Semi-monthly" },
  { value: "monthly", label: "Monthly" },
];

const FILING_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married filing jointly" },
];

const STATE_OPTIONS = [
  { value: "al", label: "Alabama" },
  { value: "ak", label: "Alaska" },
  { value: "az", label: "Arizona" },
  { value: "ar", label: "Arkansas" },
  { value: "ca", label: "California" },
  { value: "co", label: "Colorado" },
  { value: "ct", label: "Connecticut" },
  { value: "de", label: "Delaware" },
  { value: "fl", label: "Florida" },
  { value: "ga", label: "Georgia" },
  { value: "hi", label: "Hawaii" },
  { value: "id", label: "Idaho" },
  { value: "il", label: "Illinois" },
  { value: "in", label: "Indiana" },
  { value: "ia", label: "Iowa" },
  { value: "ks", label: "Kansas" },
  { value: "ky", label: "Kentucky" },
  { value: "la", label: "Louisiana" },
  { value: "me", label: "Maine" },
  { value: "md", label: "Maryland" },
  { value: "ma", label: "Massachusetts" },
  { value: "mi", label: "Michigan" },
  { value: "mn", label: "Minnesota" },
  { value: "ms", label: "Mississippi" },
  { value: "mo", label: "Missouri" },
  { value: "mt", label: "Montana" },
  { value: "ne", label: "Nebraska" },
  { value: "nv", label: "Nevada" },
  { value: "nh", label: "New Hampshire" },
  { value: "nj", label: "New Jersey" },
  { value: "nm", label: "New Mexico" },
  { value: "ny", label: "New York" },
  { value: "nc", label: "North Carolina" },
  { value: "nd", label: "North Dakota" },
  { value: "oh", label: "Ohio" },
  { value: "ok", label: "Oklahoma" },
  { value: "or", label: "Oregon" },
  { value: "pa", label: "Pennsylvania" },
  { value: "ri", label: "Rhode Island" },
  { value: "sc", label: "South Carolina" },
  { value: "sd", label: "South Dakota" },
  { value: "tn", label: "Tennessee" },
  { value: "tx", label: "Texas" },
  { value: "ut", label: "Utah" },
  { value: "vt", label: "Vermont" },
  { value: "va", label: "Virginia" },
  { value: "wa", label: "Washington" },
  { value: "wv", label: "West Virginia" },
  { value: "wi", label: "Wisconsin" },
  { value: "wy", label: "Wyoming" },
];

const EVENT_OPTIONS = [
  { value: "baby", label: "Baby or new dependent" },
  { value: "move", label: "Move or relocation" },
  { value: "wedding", label: "Wedding or celebration" },
  { value: "career-break", label: "Career break" },
  { value: "home-purchase", label: "Home purchase" },
];

const FRA_AGE_OPTIONS = [
  { value: "66", label: "66" },
  { value: "67", label: "67" },
];

const CLAIM_AGE_FACTORS = {
  66: { 62: 0.75, 66: 1, 70: 1.32 },
  67: { 62: 0.7, 67: 1, 70: 1.24 },
};

const DEFAULT_STATE_PROFILE = {
  incomeTaxRate: 4.2,
  floodRiskRate: 0.55,
};

const STATE_PROFILES = {
  ca: { incomeTaxRate: 8.4, floodRiskRate: 0.28 },
  tx: { incomeTaxRate: 0, floodRiskRate: 0.8 },
  ny: { incomeTaxRate: 6.4, floodRiskRate: 0.32 },
  fl: { incomeTaxRate: 0, floodRiskRate: 1.05 },
  wa: { incomeTaxRate: 0, floodRiskRate: 0.46 },
  il: { incomeTaxRate: 4.95, floodRiskRate: 0.58 },
  nj: { incomeTaxRate: 5.8, floodRiskRate: 0.9 },
  ma: { incomeTaxRate: 5, floodRiskRate: 0.36 },
  co: { incomeTaxRate: 4.4, floodRiskRate: 0.31 },
  ga: { incomeTaxRate: 5.5, floodRiskRate: 0.62 },
  nc: { incomeTaxRate: 4.5, floodRiskRate: 0.66 },
  va: { incomeTaxRate: 5.3, floodRiskRate: 0.48 },
  pa: { incomeTaxRate: 3.07, floodRiskRate: 0.61 },
  oh: { incomeTaxRate: 3.5, floodRiskRate: 0.49 },
  mi: { incomeTaxRate: 4.25, floodRiskRate: 0.47 },
  az: { incomeTaxRate: 2.5, floodRiskRate: 0.21 },
  nv: { incomeTaxRate: 0, floodRiskRate: 0.18 },
  or: { incomeTaxRate: 7.7, floodRiskRate: 0.26 },
  tn: { incomeTaxRate: 0, floodRiskRate: 0.56 },
  mn: { incomeTaxRate: 6.8, floodRiskRate: 0.34 },
};

export const FLAGSHIP_CALCULATOR_CONFIGS = {
  "job-offer-true-take-home-comparator": makeJobOfferConfig(),
  "w-2-vs-1099-real-net-pay-planner": makeW2Vs1099Config(),
  "pay-raise-after-tax-impact-calculator": makeAfterTaxRaiseConfig(),
  "state-to-state-move-cost-and-tax-impact-tool": makeMoveCostConfig(),
  "layoff-survival-runway-planner": makeLayoffRunwayConfig(),
  "life-event-cashflow-simulator": makeLifeEventConfig(),
  "student-loan-repayment-strategy-simulator": makeStudentLoanStrategyConfig(),
  "roth-vs-traditional-401-k-decision-engine": makeRetirementChoiceConfig(),
  "social-security-claim-age-planner": makeSocialSecurityClaimConfig(),
  "mortgage-recast-vs-refinance-vs-extra-payment-calculator": makeMortgageOptionConfig(),
  "true-home-affordability-calculator": makeTrueHomeAffordabilityConfig(),
  "buy-vs-rent-with-timeline-calculator": makeBuyVsRentTimelineConfig(),
  "home-energy-upgrade-payback-planner": makeHomeEnergyPaybackConfig(),
  "ev-vs-gas-total-cost-calculator": makeEvVsGasConfig(),
  "flood-risk-insurance-and-mortgage-exposure-planner": makeFloodRiskExposureConfig(),
  "childcare-vs-stay-at-home-parent-calculator": makeChildcareDecisionConfig(),
  "family-health-plan-total-cost-estimator": makeFamilyHealthPlanConfig(),
  "career-change-payback-timeline": makeCareerChangeConfig(),
  "freelancer-rate-reality-calculator": makeFreelancerRateRealityConfig(),
  "medicare-plan-cost-comparator": makeMedicarePlanConfig(),
};

function makeJobOfferConfig() {
  return {
    title: "Job Offer True Take-Home Comparator",
    categorySlug: "salary-data",
    badge: "Offer compare",
    actionLabel: "Compare offers",
    emptyState: "Compare two offers using salary, bonus, equity, benefits, commute, and tax assumptions.",
    summaryLabel: "Offer comparison",
    surfaceStyle: "salarySplit",
    aliases: ["job offer comparison calculator", "compare job offers", "offer take home calculator"],
    defaults: {
      salaryA: 122000,
      bonusA: 10,
      equityA: 10000,
      benefitsA: 7200,
      commuteA: 180,
      taxA: 28,
      salaryB: 132000,
      bonusB: 7,
      equityB: 18000,
      benefitsB: 4800,
      commuteB: 60,
      taxB: 30,
      currency: "USD",
    },
    mainFields: [
      moneyField("salaryA", "Offer A base salary", 500),
      percentField("bonusA", "Offer A bonus %", 0, 50, 0.5),
      moneyField("equityA", "Offer A annual equity value", 500),
      moneyField("salaryB", "Offer B base salary", 500),
      percentField("bonusB", "Offer B bonus %", 0, 50, 0.5),
      moneyField("equityB", "Offer B annual equity value", 500),
    ],
    advancedFields: [
      moneyField("benefitsA", "Offer A employer benefits value", 100),
      moneyField("commuteA", "Offer A monthly commute cost", 10),
      percentField("taxA", "Offer A total tax rate", 0, 60, 0.5),
      moneyField("benefitsB", "Offer B employer benefits value", 100),
      moneyField("commuteB", "Offer B monthly commute cost", 10),
      percentField("taxB", "Offer B total tax rate", 0, 60, 0.5),
      currencyField(),
    ],
    fieldGroups: [
      { title: "Offer A", fields: ["salaryA", "bonusA", "equityA", "benefitsA", "commuteA", "taxA"] },
      { title: "Offer B", fields: ["salaryB", "bonusB", "equityB", "benefitsB", "commuteB", "taxB", "currency"] },
    ],
    validate(values) {
      return values.salaryA <= 0 || values.salaryB <= 0 ? "Enter both base salaries to compare the offers." : "";
    },
    compute(values) {
      const offerA = buildOfferOutcome({
        salary: values.salaryA,
        bonusRate: values.bonusA,
        equity: values.equityA,
        benefits: values.benefitsA,
        commute: values.commuteA,
        taxRate: values.taxA,
      });
      const offerB = buildOfferOutcome({
        salary: values.salaryB,
        bonusRate: values.bonusB,
        equity: values.equityB,
        benefits: values.benefitsB,
        commute: values.commuteB,
        taxRate: values.taxB,
      });
      const gap = offerB.netValue - offerA.netValue;
      const winner = gap >= 0 ? "Offer B" : "Offer A";

      return result(
        "True take-home offer comparison",
        [
          card("Better modeled outcome", `${winner} ${signedMoneyText(gap, values.currency)}`),
          card("Offer A annual value", moneyText(offerA.netValue, values.currency)),
          card("Offer B annual value", moneyText(offerB.netValue, values.currency)),
          card("Annual gap", signedMoneyText(gap, values.currency)),
        ],
        [
          moneyBar("Offer A gross compensation", offerA.grossComp, values.currency),
          moneyBar("Offer A after-tax value", offerA.netValue, values.currency),
          moneyBar("Offer B gross compensation", offerB.grossComp, values.currency),
          moneyBar("Offer B after-tax value", offerB.netValue, values.currency),
          moneyBar("Annual gap", gap, values.currency),
        ],
        [
          `${winner} currently lands ahead by about ${moneyText(Math.abs(gap), values.currency)} a year after tax, benefits, and commute drag.`,
          "When the two offers feel close, the commute and employer-paid benefits often move the real answer more than the headline base salary.",
        ],
        [
          note("Offer A bonus", percentText(values.bonusA)),
          note("Offer B bonus", percentText(values.bonusB)),
          note("Winner", winner),
        ],
        {
          table: buildTable(
            "Offer comparison",
            ["Offer", "Gross comp", "Tax drag", "Benefits", "Commute drag", "Modeled value"],
            [
              ["Offer A", moneyText(offerA.grossComp, values.currency), moneyText(offerA.taxDrag, values.currency), moneyText(offerA.benefits, values.currency), moneyText(offerA.commuteDrag, values.currency), moneyText(offerA.netValue, values.currency)],
              ["Offer B", moneyText(offerB.grossComp, values.currency), moneyText(offerB.taxDrag, values.currency), moneyText(offerB.benefits, values.currency), moneyText(offerB.commuteDrag, values.currency), moneyText(offerB.netValue, values.currency)],
            ],
          ),
        },
      );
    },
  };
}

function makeW2Vs1099Config() {
  return {
    title: "W-2 vs 1099 Real Net Pay Planner",
    categorySlug: "salary-data",
    badge: "Work model",
    actionLabel: "Compare net pay",
    emptyState: "Compare a W-2 offer against a 1099 contract using hours, utilization, expenses, taxes, and benefits.",
    summaryLabel: "W-2 vs 1099 comparison",
    surfaceStyle: "salarySplit",
    aliases: ["w2 vs 1099 calculator", "contractor vs employee take home", "1099 vs salary calculator"],
    defaults: {
      w2Salary: 118000,
      w2Benefits: 14000,
      w2TaxRate: 27,
      contractorRate: 95,
      contractorHours: 30,
      contractorWeeks: 46,
      contractorUtilization: 82,
      contractorExpenses: 16000,
      contractorTaxRate: 33,
      currency: "USD",
    },
    mainFields: [
      moneyField("w2Salary", "W-2 salary", 500),
      moneyField("w2Benefits", "W-2 employer-paid benefits", 100),
      percentField("w2TaxRate", "W-2 total tax rate", 0, 60, 0.5),
      moneyField("contractorRate", "1099 hourly rate", 1),
      numberField("contractorHours", "1099 billable hours per week", 1, 80, 0.5),
      numberField("contractorWeeks", "1099 working weeks per year", 1, 52, 1),
    ],
    advancedFields: [
      percentField("contractorUtilization", "1099 utilization rate", 30, 100, 1),
      moneyField("contractorExpenses", "1099 annual overhead and benefits", 100),
      percentField("contractorTaxRate", "1099 total tax rate", 0, 65, 0.5),
      currencyField(),
    ],
    fieldGroups: [
      { title: "W-2 path", fields: ["w2Salary", "w2Benefits", "w2TaxRate"] },
      { title: "1099 path", fields: ["contractorRate", "contractorHours", "contractorWeeks", "contractorUtilization", "contractorExpenses", "contractorTaxRate", "currency"] },
    ],
    validate(values) {
      if (values.w2Salary <= 0) return "Enter the W-2 salary.";
      if (values.contractorRate <= 0) return "Enter the 1099 hourly rate.";
      return "";
    },
    compute(values) {
      const w2NetCash = values.w2Salary * (1 - values.w2TaxRate / 100);
      const w2TotalValue = w2NetCash + values.w2Benefits;
      const contractorGross = values.contractorRate * values.contractorHours * values.contractorWeeks * (values.contractorUtilization / 100);
      const contractorTaxable = Math.max(0, contractorGross - values.contractorExpenses);
      const contractorTax = contractorTaxable * (values.contractorTaxRate / 100);
      const contractorNet = contractorGross - values.contractorExpenses - contractorTax;
      const gap = contractorNet - w2TotalValue;
      const better = gap >= 0 ? "1099 path" : "W-2 path";

      return result(
        "W-2 versus 1099 modeled net value",
        [
          card("Stronger modeled outcome", `${better} ${signedMoneyText(gap, values.currency)}`),
          card("W-2 total value", moneyText(w2TotalValue, values.currency)),
          card("1099 net value", moneyText(contractorNet, values.currency)),
          card("1099 gross revenue", moneyText(contractorGross, values.currency)),
        ],
        [
          moneyBar("W-2 take-home cash", w2NetCash, values.currency),
          moneyBar("W-2 benefits value", values.w2Benefits, values.currency),
          moneyBar("1099 gross revenue", contractorGross, values.currency),
          moneyBar("1099 overhead", values.contractorExpenses, values.currency),
          moneyBar("1099 net value", contractorNet, values.currency),
        ],
        [
          `${better} currently leads by about ${moneyText(Math.abs(gap), values.currency)} a year under these assumptions.`,
          "The utilization rate is the swing input here. A 1099 rate that looks strong on paper softens quickly if billable time slips.",
        ],
        [
          note("1099 utilization", percentText(values.contractorUtilization)),
          note("1099 hours / week", `${fixed(values.contractorHours)} hrs`),
          note("Stronger path", better),
        ],
        {
          table: buildTable(
            "Work model comparison",
            ["Path", "Gross", "Tax", "Benefits / overhead", "Modeled value"],
            [
              ["W-2", moneyText(values.w2Salary, values.currency), moneyText(values.w2Salary - w2NetCash, values.currency), moneyText(values.w2Benefits, values.currency), moneyText(w2TotalValue, values.currency)],
              ["1099", moneyText(contractorGross, values.currency), moneyText(contractorTax, values.currency), moneyText(values.contractorExpenses, values.currency), moneyText(contractorNet, values.currency)],
            ],
          ),
        },
      );
    },
  };
}

function makeAfterTaxRaiseConfig() {
  return {
    title: "Pay Raise After-Tax Impact Calculator",
    categorySlug: "salary-data",
    badge: "Raise impact",
    actionLabel: "Calculate real raise",
    emptyState: "Estimate what a raise is worth after taxes, benefit changes, commute changes, and inflation.",
    summaryLabel: "After-tax raise impact",
    surfaceStyle: "taxGrid",
    aliases: ["after tax raise calculator", "real raise calculator", "raise worth after tax"],
    defaults: {
      currentSalary: 88000,
      raisePercent: 8,
      federalTaxRate: 22,
      stateTaxRate: 5,
      benefitCostChange: 35,
      commuteChange: 20,
      inflationRate: 3,
      currency: "USD",
    },
    mainFields: [
      moneyField("currentSalary", "Current annual salary", 500),
      percentField("raisePercent", "Raise %", -20, 100, 0.5),
      percentField("federalTaxRate", "Federal tax rate", 0, 45, 0.5),
      percentField("stateTaxRate", "State tax rate", 0, 15, 0.5),
    ],
    advancedFields: [
      moneyField("benefitCostChange", "Monthly benefit cost change", 5),
      moneyField("commuteChange", "Monthly commute change", 5),
      percentField("inflationRate", "Inflation rate", 0, 12, 0.1),
      currencyField(),
    ],
    validate(values) {
      return values.currentSalary <= 0 ? "Enter your current salary." : "";
    },
    compute(values) {
      const grossRaise = values.currentSalary * (values.raisePercent / 100);
      const combinedTaxRate = clamp(values.federalTaxRate + values.stateTaxRate, 0, 65);
      const annualDrag = (values.benefitCostChange + values.commuteChange) * 12;
      const netRaise = grossRaise * (1 - combinedTaxRate / 100) - annualDrag;
      const realRaise = netRaise / Math.max(1 + values.inflationRate / 100, 0.01);
      const newSalary = values.currentSalary + grossRaise;

      return result(
        "After-tax raise impact",
        [
          card("New annual salary", moneyText(newSalary, values.currency)),
          card("Net annual gain", moneyText(netRaise, values.currency)),
          card("Net monthly gain", moneyText(netRaise / 12, values.currency)),
          card("Inflation-adjusted gain", moneyText(realRaise, values.currency)),
        ],
        [
          moneyBar("Gross raise", grossRaise, values.currency),
          moneyBar("Tax drag", grossRaise - grossRaise * (1 - combinedTaxRate / 100), values.currency),
          moneyBar("Annual cost changes", annualDrag, values.currency),
          moneyBar("Net raise", netRaise, values.currency),
        ],
        [
          `The raise adds about ${moneyText(netRaise / 12, values.currency)} per month after the current tax and cost assumptions.`,
          realRaise > 0
            ? `After inflation, the modeled gain still holds at roughly ${moneyText(realRaise, values.currency)} a year in real purchasing power.`
            : "Inflation and new recurring costs are absorbing most of the raise in this scenario.",
        ],
        [
          note("Combined tax rate", percentText(combinedTaxRate)),
          note("Inflation rate", percentText(values.inflationRate)),
          note("Raise %", percentText(values.raisePercent)),
        ],
      );
    },
  };
}

function makeMoveCostConfig() {
  return {
    title: "State-to-State Move Cost and Tax Impact Tool",
    categorySlug: "cost-of-living",
    badge: "Move planner",
    actionLabel: "Compare the move",
    emptyState: "Compare two states using income, rent, childcare, commute, and one-time move costs.",
    summaryLabel: "Move impact comparison",
    surfaceStyle: "taxGrid",
    aliases: ["state move cost calculator", "relocation cost and tax calculator", "move tax impact tool"],
    defaults: {
      currentSalary: 96000,
      newSalary: 108000,
      fromState: "tx",
      toState: "co",
      filingStatus: "single",
      rentFrom: 1850,
      rentTo: 2250,
      childcareFrom: 650,
      childcareTo: 900,
      commuteFrom: 180,
      commuteTo: 90,
      movingCost: 6200,
      currency: "USD",
    },
    mainFields: [
      moneyField("currentSalary", "Current salary", 500),
      moneyField("newSalary", "Salary in destination state", 500),
      selectField("fromState", "Current state", STATE_OPTIONS),
      selectField("toState", "Destination state", STATE_OPTIONS),
      selectField("filingStatus", "Filing status", FILING_STATUS_OPTIONS),
    ],
    advancedFields: [
      moneyField("rentFrom", "Current monthly rent", 25),
      moneyField("rentTo", "Destination monthly rent", 25),
      moneyField("childcareFrom", "Current monthly childcare", 25),
      moneyField("childcareTo", "Destination monthly childcare", 25),
      moneyField("commuteFrom", "Current monthly commute", 10),
      moneyField("commuteTo", "Destination monthly commute", 10),
      moneyField("movingCost", "One-time moving cost", 100),
      currencyField(),
    ],
    fieldGroups: [
      { title: "Income and location", fields: ["currentSalary", "newSalary", "fromState", "toState", "filingStatus"] },
      { title: "Recurring costs", fields: ["rentFrom", "rentTo", "childcareFrom", "childcareTo", "commuteFrom", "commuteTo"] },
      { title: "One-time cost", fields: ["movingCost", "currency"] },
    ],
    validate(values) {
      if (values.currentSalary <= 0 || values.newSalary <= 0) return "Enter both the current and destination salaries.";
      return values.fromState === values.toState ? "Choose two different states to compare the move." : "";
    },
    compute(values) {
      const currentTaxRate = estimateFederalRate(values.currentSalary, values.filingStatus) + getStateProfile(values.fromState).incomeTaxRate / 100;
      const nextTaxRate = estimateFederalRate(values.newSalary, values.filingStatus) + getStateProfile(values.toState).incomeTaxRate / 100;
      const currentNet = values.currentSalary * (1 - currentTaxRate);
      const nextNet = values.newSalary * (1 - nextTaxRate);
      const currentRecurring = (values.rentFrom + values.childcareFrom + values.commuteFrom) * 12;
      const nextRecurring = (values.rentTo + values.childcareTo + values.commuteTo) * 12;
      const currentDisposable = currentNet - currentRecurring;
      const nextDisposable = nextNet - nextRecurring;
      const annualLift = nextDisposable - currentDisposable;
      const breakEvenMonths = annualLift > 0 ? values.movingCost / (annualLift / 12) : Number.POSITIVE_INFINITY;

      return result(
        "State-to-state move impact",
        [
          card("Annual disposable change", signedMoneyText(annualLift, values.currency)),
          card("Current state disposable", moneyText(currentDisposable, values.currency)),
          card("Destination disposable", moneyText(nextDisposable, values.currency)),
          card("Move break-even", Number.isFinite(breakEvenMonths) ? `${fixed(breakEvenMonths)} months` : "No break-even"),
        ],
        [
          moneyBar("Current after-tax income", currentNet, values.currency),
          moneyBar("Destination after-tax income", nextNet, values.currency),
          moneyBar("Current recurring costs", currentRecurring, values.currency),
          moneyBar("Destination recurring costs", nextRecurring, values.currency),
          moneyBar("Disposable income lift", annualLift, values.currency),
        ],
        [
          annualLift >= 0
            ? `The destination state improves annual disposable income by about ${moneyText(annualLift, values.currency)} under the current assumptions.`
            : `The destination state reduces annual disposable income by about ${moneyText(Math.abs(annualLift), values.currency)} in this model.`,
          Number.isFinite(breakEvenMonths)
            ? `At that pace, the one-time moving cost clears in about ${fixed(breakEvenMonths)} months.`
            : "With the current recurring costs and pay assumptions, the move does not pay back the one-time relocation cost.",
        ],
        [
          note("Current state", labelForOption(values.fromState, STATE_OPTIONS)),
          note("Destination state", labelForOption(values.toState, STATE_OPTIONS)),
          note("Filing status", labelForOption(values.filingStatus, FILING_STATUS_OPTIONS)),
        ],
      );
    },
  };
}

function makeLayoffRunwayConfig() {
  return {
    title: "Layoff Survival Runway Planner",
    categorySlug: "tax-budget",
    badge: "Runway",
    actionLabel: "Plan runway",
    emptyState: "Estimate how long savings, severance, unemployment, and side income can carry your monthly budget.",
    summaryLabel: "Runway plan",
    surfaceStyle: "ledger",
    aliases: ["layoff calculator", "severance runway calculator", "job loss budget planner"],
    defaults: {
      cashSavings: 24000,
      severanceWeeks: 8,
      weeklyTakeHome: 1550,
      unemploymentMonthly: 1750,
      monthlyEssentials: 3200,
      debtMinimums: 680,
      cobraMonthly: 590,
      sideIncomeMonthly: 350,
      currency: "USD",
    },
    mainFields: [
      moneyField("cashSavings", "Cash savings available", 100),
      numberField("severanceWeeks", "Severance weeks", 0, 52, 1),
      moneyField("weeklyTakeHome", "Previous weekly take-home pay", 25),
      moneyField("unemploymentMonthly", "Monthly unemployment income", 25),
    ],
    advancedFields: [
      moneyField("monthlyEssentials", "Monthly essentials", 25),
      moneyField("debtMinimums", "Monthly debt minimums", 25),
      moneyField("cobraMonthly", "Monthly COBRA or insurance cost", 25),
      moneyField("sideIncomeMonthly", "Monthly side income", 25),
      currencyField(),
    ],
    validate(values) {
      return values.cashSavings <= 0 ? "Enter available savings to estimate runway." : "";
    },
    compute(values) {
      const severanceCash = values.severanceWeeks * values.weeklyTakeHome;
      const monthlyBurn = values.monthlyEssentials + values.debtMinimums + values.cobraMonthly - values.unemploymentMonthly - values.sideIncomeMonthly;
      const runwayMonths = monthlyBurn > 0 ? (values.cashSavings + severanceCash) / monthlyBurn : Number.POSITIVE_INFINITY;
      const leanBurn = values.monthlyEssentials * 0.88 + values.debtMinimums + values.cobraMonthly - values.unemploymentMonthly - values.sideIncomeMonthly;
      const leanRunway = leanBurn > 0 ? (values.cashSavings + severanceCash) / leanBurn : Number.POSITIVE_INFINITY;

      return result(
        "Layoff survival runway",
        [
          card("Current runway", Number.isFinite(runwayMonths) ? `${fixed(runwayMonths)} months` : "Cash flow positive"),
          card("Lean-budget runway", Number.isFinite(leanRunway) ? `${fixed(leanRunway)} months` : "Cash flow positive"),
          card("Starting buffer", moneyText(values.cashSavings + severanceCash, values.currency)),
          card("Monthly burn", moneyText(Math.max(monthlyBurn, 0), values.currency)),
        ],
        [
          moneyBar("Cash savings", values.cashSavings, values.currency),
          moneyBar("Severance cash", severanceCash, values.currency),
          moneyBar("Monthly living cost", values.monthlyEssentials + values.debtMinimums + values.cobraMonthly, values.currency),
          moneyBar("Monthly offset income", values.unemploymentMonthly + values.sideIncomeMonthly, values.currency),
          moneyBar("Net monthly burn", monthlyBurn, values.currency),
        ],
        [
          Number.isFinite(runwayMonths)
            ? `Under the current budget, the buffer lasts about ${fixed(runwayMonths)} months.`
            : "The current offsets already cover the budget, so the buffer is not being consumed right now.",
          Number.isFinite(leanRunway) && leanRunway > runwayMonths
            ? `A modest essentials cut extends runway to about ${fixed(leanRunway)} months.`
            : "The lean scenario does not materially change the outcome because the current burn is already limited.",
        ],
        [
          note("Severance", `${values.severanceWeeks} weeks`),
          note("Insurance cost", moneyText(values.cobraMonthly, values.currency)),
          note("Side income", moneyText(values.sideIncomeMonthly, values.currency)),
        ],
      );
    },
  };
}

function makeLifeEventConfig() {
  return {
    title: "Life Event Cashflow Simulator",
    categorySlug: "tax-budget",
    badge: "Cashflow",
    actionLabel: "Simulate event",
    emptyState: "Simulate how a major life event changes cash, monthly surplus, and the time needed to recover savings.",
    summaryLabel: "Life event simulation",
    surfaceStyle: "ledger",
    aliases: ["life event budget calculator", "cash flow simulator", "big expense planner"],
    defaults: {
      currentSavings: 18000,
      monthlyNetIncome: 6200,
      monthlyCoreSpend: 4700,
      eventType: "baby",
      upfrontCost: 6500,
      monthlyCostChange: 900,
      durationMonths: 10,
      monthlyRecoveryContribution: 650,
      currency: "USD",
    },
    mainFields: [
      moneyField("currentSavings", "Current savings", 100),
      moneyField("monthlyNetIncome", "Monthly net income", 25),
      moneyField("monthlyCoreSpend", "Monthly core spend", 25),
      selectField("eventType", "Life event", EVENT_OPTIONS),
    ],
    advancedFields: [
      moneyField("upfrontCost", "One-time event cost", 100),
      moneyField("monthlyCostChange", "Monthly cost change during event", 25),
      numberField("durationMonths", "Event duration in months", 1, 36, 1),
      moneyField("monthlyRecoveryContribution", "Monthly recovery contribution", 25),
      currencyField(),
    ],
    validate(values) {
      if (values.currentSavings < 0) return "Savings cannot be negative.";
      if (values.monthlyNetIncome <= 0) return "Enter monthly net income.";
      return "";
    },
    compute(values) {
      const baseSurplus = values.monthlyNetIncome - values.monthlyCoreSpend;
      const eventSurplus = values.monthlyNetIncome - (values.monthlyCoreSpend + values.monthlyCostChange);
      const endingCash = values.currentSavings - values.upfrontCost + eventSurplus * values.durationMonths;
      const recoveryGap = Math.max(0, values.currentSavings - endingCash);
      const recoveryMonths = values.monthlyRecoveryContribution > 0 ? recoveryGap / values.monthlyRecoveryContribution : Number.POSITIVE_INFINITY;

      return result(
        "Life event cashflow simulation",
        [
          card("Ending cash after event", moneyText(endingCash, values.currency)),
          card("Monthly change during event", moneyText(eventSurplus, values.currency)),
          card("Recovery time", Number.isFinite(recoveryMonths) ? `${fixed(recoveryMonths)} months` : "No recovery plan"),
          card("Normal monthly surplus", moneyText(baseSurplus, values.currency)),
        ],
        [
          moneyBar("Starting savings", values.currentSavings, values.currency),
          moneyBar("Upfront cost", values.upfrontCost, values.currency),
          moneyBar("Event-period cash change", eventSurplus * values.durationMonths, values.currency),
          moneyBar("Ending cash", endingCash, values.currency),
        ],
        [
          `During the ${labelForOption(values.eventType, EVENT_OPTIONS).toLowerCase()} window, monthly cash flow shifts to about ${moneyText(eventSurplus, values.currency)}.`,
          Number.isFinite(recoveryMonths)
            ? `At the current recovery pace, savings return to the starting level in about ${fixed(recoveryMonths)} months.`
            : "Add a recovery contribution target if you want the tool to estimate how quickly savings rebuild.",
        ],
        [
          note("Event type", labelForOption(values.eventType, EVENT_OPTIONS)),
          note("Duration", `${values.durationMonths} months`),
          note("Recovery contribution", moneyText(values.monthlyRecoveryContribution, values.currency)),
        ],
        endingCash < 0
          ? { warning: "This scenario drives savings below zero. Consider spreading the event cost out or reducing the monthly cash drag." }
          : {},
      );
    },
  };
}

function makeStudentLoanStrategyConfig() {
  return {
    title: "Student Loan Repayment Strategy Simulator",
    categorySlug: "finance",
    badge: "Debt strategy",
    actionLabel: "Compare strategies",
    emptyState: "Compare standard repayment, extra payments, refinancing, and an IDR-style forgiveness path.",
    summaryLabel: "Student loan strategy",
    surfaceStyle: "loanSplit",
    aliases: ["student loan strategy calculator", "loan forgiveness planner", "student loan refinance comparison"],
    defaults: {
      balance: 48000,
      annualRate: 6.2,
      standardYears: 10,
      extraMonthly: 150,
      refinanceRate: 4.8,
      refinanceYears: 7,
      idrMonthly: 310,
      forgivenessYears: 20,
      currency: "USD",
    },
    mainFields: [
      moneyField("balance", "Starting balance", 500),
      percentField("annualRate", "Current interest rate", 0, 12, 0.05),
      numberField("standardYears", "Standard plan years", 1, 30, 1),
      moneyField("extraMonthly", "Extra monthly payment", 10),
    ],
    advancedFields: [
      percentField("refinanceRate", "Refinance rate", 0, 12, 0.05),
      numberField("refinanceYears", "Refinance years", 1, 20, 1),
      moneyField("idrMonthly", "IDR-style monthly payment", 10),
      numberField("forgivenessYears", "Forgiveness horizon in years", 5, 30, 1),
      currencyField(),
    ],
    validate(values) {
      if (values.balance <= 0) return "Enter the starting balance.";
      return values.idrMonthly < 0 ? "IDR payment cannot be negative." : "";
    },
    compute(values) {
      const standardPayment = amortizedPayment(values.balance, values.annualRate, values.standardYears * 12);
      const standard = simulateFixedPayment(values.balance, values.annualRate, standardPayment);
      const extra = simulateFixedPayment(values.balance, values.annualRate, standardPayment + values.extraMonthly);
      const refinancePayment = amortizedPayment(values.balance, values.refinanceRate, values.refinanceYears * 12);
      const refinance = simulateFixedPayment(values.balance, values.refinanceRate, refinancePayment);
      const idr = simulateFixedPayment(values.balance, values.annualRate, values.idrMonthly, values.forgivenessYears * 12);
      const forgivenessBalance = Math.max(0, idr.remainingBalance);
      const forgivenessTax = forgivenessBalance * 0.25;
      const idrTotalOutlay = idr.totalPaid + forgivenessTax;

      const strategies = [
        { label: "Standard", monthly: standardPayment, total: standard.totalPaid, months: standard.months, end: "Paid off" },
        { label: "Extra payment", monthly: standardPayment + values.extraMonthly, total: extra.totalPaid, months: extra.months, end: "Paid off" },
        { label: "Refinance", monthly: refinancePayment, total: refinance.totalPaid, months: refinance.months, end: "Paid off" },
        { label: "IDR path", monthly: values.idrMonthly, total: idrTotalOutlay, months: values.forgivenessYears * 12, end: `${moneyText(forgivenessBalance, values.currency)} forgiven` },
      ];
      const cheapest = [...strategies].sort((left, right) => left.total - right.total)[0];
      const lowestPayment = [...strategies].sort((left, right) => left.monthly - right.monthly)[0];

      return result(
        "Student loan strategy comparison",
        [
          card("Lowest total outlay", `${cheapest.label} ${moneyText(cheapest.total, values.currency)}`),
          card("Lowest monthly payment", `${lowestPayment.label} ${moneyText(lowestPayment.monthly, values.currency)}`),
          card("Fastest payoff", `${Math.round(Math.min(standard.months, extra.months, refinance.months))} months`),
          card("Modeled forgiveness", moneyText(forgivenessBalance, values.currency)),
        ],
        [
          moneyBar("Standard total paid", standard.totalPaid, values.currency),
          moneyBar("Extra payment total paid", extra.totalPaid, values.currency),
          moneyBar("Refinance total paid", refinance.totalPaid, values.currency),
          moneyBar("IDR total outlay", idrTotalOutlay, values.currency),
        ],
        [
          `${cheapest.label} is the lowest-cost path in this model, while ${lowestPayment.label} creates the lightest monthly payment.`,
          "The forgiveness path can look cheaper month to month while still creating a later tax drag if a large balance survives to forgiveness.",
        ],
        [
          note("Current rate", percentText(values.annualRate)),
          note("Refinance rate", percentText(values.refinanceRate)),
          note("Forgiveness horizon", `${values.forgivenessYears} years`),
        ],
        {
          table: buildTable(
            "Repayment strategy comparison",
            ["Strategy", "Monthly payment", "Total outlay", "Timeline", "End state"],
            strategies.map((strategy) => [
              strategy.label,
              moneyText(strategy.monthly, values.currency),
              moneyText(strategy.total, values.currency),
              `${Math.round(strategy.months)} months`,
              strategy.end,
            ]),
            "Forgiveness assumes any remaining balance is taxed at 25 percent in this model.",
          ),
        },
      );
    },
  };
}

function makeRetirementChoiceConfig() {
  return {
    title: "Roth vs Traditional 401(k) Decision Engine",
    categorySlug: "finance",
    badge: "Retirement",
    actionLabel: "Compare retirement paths",
    emptyState: "Compare Roth and traditional 401(k) outcomes using contribution, match, tax, and growth assumptions.",
    summaryLabel: "401(k) choice comparison",
    surfaceStyle: "investment",
    aliases: ["roth vs traditional 401k calculator", "roth 401k comparison", "traditional vs roth retirement calculator"],
    defaults: {
      annualContribution: 18000,
      employerMatchRate: 4,
      currentTaxRate: 24,
      retirementTaxRate: 18,
      growthRate: 7,
      yearsToRetirement: 25,
      currency: "USD",
    },
    mainFields: [
      moneyField("annualContribution", "Annual contribution", 100),
      percentField("employerMatchRate", "Employer match on contribution", 0, 10, 0.25),
      percentField("currentTaxRate", "Current marginal tax rate", 0, 45, 0.5),
      percentField("retirementTaxRate", "Retirement tax rate", 0, 40, 0.5),
    ],
    advancedFields: [
      percentField("growthRate", "Annual growth rate", 0, 15, 0.1),
      numberField("yearsToRetirement", "Years to retirement", 1, 45, 1),
      currencyField(),
    ],
    validate(values) {
      return values.annualContribution <= 0 ? "Enter an annual contribution." : "";
    },
    compute(values) {
      const employeeFutureValue = futureValueSeries(values.annualContribution, values.growthRate, values.yearsToRetirement);
      const matchFutureValue = futureValueSeries(values.annualContribution * (values.employerMatchRate / 100), values.growthRate, values.yearsToRetirement);
      const traditionalSpendable = (employeeFutureValue + matchFutureValue) * (1 - values.retirementTaxRate / 100);
      const rothSpendable = employeeFutureValue + matchFutureValue * (1 - values.retirementTaxRate / 100);
      const todayTaxSavings = values.annualContribution * (values.currentTaxRate / 100);
      const lifetimeGap = rothSpendable - traditionalSpendable;
      const better = lifetimeGap >= 0 ? "Roth 401(k)" : "Traditional 401(k)";

      return result(
        "Roth versus traditional 401(k) decision",
        [
          card("Higher modeled spendable value", `${better} ${signedMoneyText(lifetimeGap, values.currency)}`),
          card("Roth modeled spendable value", moneyText(rothSpendable, values.currency)),
          card("Traditional spendable value", moneyText(traditionalSpendable, values.currency)),
          card("Current-year tax savings from traditional", moneyText(todayTaxSavings, values.currency)),
        ],
        [
          moneyBar("Employee future value", employeeFutureValue, values.currency),
          moneyBar("Employer match future value", matchFutureValue, values.currency),
          moneyBar("Traditional spendable value", traditionalSpendable, values.currency),
          moneyBar("Roth spendable value", rothSpendable, values.currency),
        ],
        [
          `${better} comes out ahead in this model because the contribution is moving through different tax environments now and later.`,
          "The employer match is still treated like pre-tax money here, which is why the Roth path does not shelter the whole account from future tax.",
        ],
        [
          note("Current tax rate", percentText(values.currentTaxRate)),
          note("Retirement tax rate", percentText(values.retirementTaxRate)),
          note("Years to retirement", `${values.yearsToRetirement}`),
        ],
      );
    },
  };
}

function makeSocialSecurityClaimConfig() {
  return {
    title: "Social Security Claim Age Planner",
    categorySlug: "finance",
    badge: "Retirement",
    actionLabel: "Compare claim ages",
    emptyState: "Compare lifetime Social Security outcomes for early, full, and delayed claiming ages.",
    summaryLabel: "Claim age comparison",
    surfaceStyle: "investment",
    aliases: ["social security claim calculator", "when to claim social security", "social security age planner"],
    defaults: {
      fraMonthlyBenefit: 2800,
      fraAge: "67",
      annualCola: 2.2,
      lifeExpectancyAge: 88,
      benefitTaxRate: 12,
      currency: "USD",
    },
    mainFields: [
      moneyField("fraMonthlyBenefit", "Full retirement age monthly benefit", 10),
      selectField("fraAge", "Full retirement age", FRA_AGE_OPTIONS),
      percentField("annualCola", "Annual COLA assumption", 0, 8, 0.1),
      numberField("lifeExpectancyAge", "Life expectancy age", 70, 105, 1),
    ],
    advancedFields: [
      percentField("benefitTaxRate", "Tax rate on benefits", 0, 25, 0.5),
      currencyField(),
    ],
    validate(values) {
      return values.fraMonthlyBenefit <= 0 ? "Enter a monthly benefit at full retirement age." : "";
    },
    compute(values) {
      const fraAge = Number(values.fraAge);
      const factors = CLAIM_AGE_FACTORS[fraAge] || CLAIM_AGE_FACTORS[67];
      const scenarios = [62, fraAge, 70].map((claimAge) => {
        const monthlyBenefit = values.fraMonthlyBenefit * factors[claimAge];
        const afterTaxLifetime = simulateSocialSecurityLifetime({
          monthlyBenefit,
          claimAge,
          endAge: values.lifeExpectancyAge,
          cola: values.annualCola,
          taxRate: values.benefitTaxRate,
        });
        return { claimAge, monthlyBenefit, afterTaxLifetime };
      });
      const best = [...scenarios].sort((left, right) => right.afterTaxLifetime - left.afterTaxLifetime)[0];
      const breakEven = findSocialSecurityBreakEven({
        earlyMonthlyBenefit: scenarios[0].monthlyBenefit,
        delayedMonthlyBenefit: scenarios[2].monthlyBenefit,
        earlyAge: 62,
        delayedAge: 70,
        cola: values.annualCola,
      });

      return result(
        "Social Security claim age comparison",
        [
          card("Highest modeled lifetime value", `Age ${best.claimAge}`),
          card("Age 62 monthly benefit", moneyText(scenarios[0].monthlyBenefit, values.currency)),
          card(`Age ${fraAge} monthly benefit`, moneyText(scenarios[1].monthlyBenefit, values.currency)),
          card("Age 70 monthly benefit", moneyText(scenarios[2].monthlyBenefit, values.currency)),
        ],
        [
          moneyBar("Age 62 lifetime value", scenarios[0].afterTaxLifetime, values.currency),
          moneyBar(`Age ${fraAge} lifetime value`, scenarios[1].afterTaxLifetime, values.currency),
          moneyBar("Age 70 lifetime value", scenarios[2].afterTaxLifetime, values.currency),
        ],
        [
          `In this model, claiming at age ${best.claimAge} creates the strongest after-tax lifetime total through age ${values.lifeExpectancyAge}.`,
          Number.isFinite(breakEven)
            ? `The delayed-claim path catches the age-62 path at roughly age ${fixed(breakEven)}.`
            : "The delayed-claim path does not catch the age-62 path inside the modeled age range.",
        ],
        [
          note("Full retirement age", `${fraAge}`),
          note("Life expectancy", `${values.lifeExpectancyAge}`),
          note("Benefit tax rate", percentText(values.benefitTaxRate)),
        ],
        {
          table: buildTable(
            "Claim age comparison",
            ["Claim age", "Monthly benefit", "Modeled lifetime value"],
            scenarios.map((scenario) => [
              `Age ${scenario.claimAge}`,
              moneyText(scenario.monthlyBenefit, values.currency),
              moneyText(scenario.afterTaxLifetime, values.currency),
            ]),
          ),
        },
      );
    },
  };
}

function makeMortgageOptionConfig() {
  return {
    title: "Mortgage Recast vs Refinance vs Extra Payment Calculator",
    categorySlug: "mortgage-data",
    badge: "Mortgage compare",
    actionLabel: "Compare mortgage options",
    emptyState: "Compare recasting, refinancing, and recurring extra payments on the same remaining mortgage balance.",
    summaryLabel: "Mortgage option comparison",
    surfaceStyle: "loanSplit",
    aliases: ["recast vs refinance calculator", "mortgage options calculator", "extra payment vs refinance"],
    defaults: {
      balance: 325000,
      currentRate: 6.6,
      yearsLeft: 25,
      recastLumpSum: 35000,
      refinanceRate: 5.8,
      refinanceYears: 20,
      closingCosts: 5500,
      extraMonthly: 250,
      currency: "USD",
    },
    mainFields: [
      moneyField("balance", "Current mortgage balance", 1000),
      percentField("currentRate", "Current mortgage rate", 0, 12, 0.05),
      numberField("yearsLeft", "Years remaining", 1, 30, 1),
      moneyField("recastLumpSum", "Recast lump sum", 500),
    ],
    advancedFields: [
      percentField("refinanceRate", "Refinance rate", 0, 12, 0.05),
      numberField("refinanceYears", "Refinance years", 1, 30, 1),
      moneyField("closingCosts", "Refinance closing costs", 100),
      moneyField("extraMonthly", "Extra monthly payment", 10),
      currencyField(),
    ],
    validate(values) {
      if (values.balance <= 0) return "Enter the current mortgage balance.";
      return values.recastLumpSum >= values.balance ? "The recast lump sum should be lower than the balance." : "";
    },
    compute(values) {
      const currentPayment = amortizedPayment(values.balance, values.currentRate, values.yearsLeft * 12);
      const recastBalance = values.balance - values.recastLumpSum;
      const recastPayment = amortizedPayment(recastBalance, values.currentRate, values.yearsLeft * 12);
      const refinancePayment = amortizedPayment(values.balance, values.refinanceRate, values.refinanceYears * 12);
      const extra = simulateFixedPayment(values.balance, values.currentRate, currentPayment + values.extraMonthly);
      const currentTotal = currentPayment * values.yearsLeft * 12;
      const recastTotal = values.recastLumpSum + recastPayment * values.yearsLeft * 12;
      const refinanceTotal = refinancePayment * values.refinanceYears * 12 + values.closingCosts;

      const fastestMonths = Math.min(values.yearsLeft * 12, extra.months, values.refinanceYears * 12);
      const lowestPayment = [
        { label: "Current loan", value: currentPayment },
        { label: "Recast", value: recastPayment },
        { label: "Refinance", value: refinancePayment },
        { label: "Extra payment path", value: currentPayment + values.extraMonthly },
      ].sort((left, right) => left.value - right.value)[0];
      const lowestLifetime = [
        { label: "Current loan", value: currentTotal },
        { label: "Recast", value: recastTotal },
        { label: "Refinance", value: refinanceTotal },
        { label: "Extra payment path", value: extra.totalPaid },
      ].sort((left, right) => left.value - right.value)[0];

      return result(
        "Mortgage option comparison",
        [
          card("Lowest payment", `${lowestPayment.label} ${moneyText(lowestPayment.value, values.currency)}`),
          card("Lowest lifetime outlay", `${lowestLifetime.label} ${moneyText(lowestLifetime.value, values.currency)}`),
          card("Fastest payoff", `${Math.round(fastestMonths)} months`),
          card("Current payment", moneyText(currentPayment, values.currency)),
        ],
        [
          moneyBar("Current payment", currentPayment, values.currency),
          moneyBar("Recast payment", recastPayment, values.currency),
          moneyBar("Refinance payment", refinancePayment, values.currency),
          moneyBar("Extra payment path", currentPayment + values.extraMonthly, values.currency),
        ],
        [
          `${lowestPayment.label} creates the lightest monthly cash requirement in this setup, while ${lowestLifetime.label} is the cheapest full path.`,
          "Recasting optimizes the payment without changing rate or term, while extra payments usually win when payoff speed matters most.",
        ],
        [
          note("Current rate", percentText(values.currentRate)),
          note("Refinance rate", percentText(values.refinanceRate)),
          note("Extra payment", moneyText(values.extraMonthly, values.currency)),
        ],
        {
          table: buildTable(
            "Mortgage option summary",
            ["Path", "Monthly payment", "Estimated lifetime outlay", "Timeline"],
            [
              ["Current loan", moneyText(currentPayment, values.currency), moneyText(currentTotal, values.currency), `${values.yearsLeft * 12} months`],
              ["Recast", moneyText(recastPayment, values.currency), moneyText(recastTotal, values.currency), `${values.yearsLeft * 12} months`],
              ["Refinance", moneyText(refinancePayment, values.currency), moneyText(refinanceTotal, values.currency), `${values.refinanceYears * 12} months`],
              ["Extra payment path", moneyText(currentPayment + values.extraMonthly, values.currency), moneyText(extra.totalPaid, values.currency), `${Math.round(extra.months)} months`],
            ],
          ),
        },
      );
    },
  };
}

function makeTrueHomeAffordabilityConfig() {
  return {
    title: "True Home Affordability Calculator",
    categorySlug: "mortgage-data",
    badge: "Affordability",
    actionLabel: "Calculate true affordability",
    emptyState: "Estimate the home price your real all-in monthly budget can support after taxes, HOA, insurance, utilities, and maintenance.",
    summaryLabel: "True affordability estimate",
    surfaceStyle: "loanSplit",
    aliases: ["real home affordability calculator", "all in house affordability", "true house budget calculator"],
    defaults: {
      annualIncome: 145000,
      monthlyDebt: 950,
      downPayment: 70000,
      annualRate: 6.35,
      years: 30,
      targetDti: 36,
      propertyTaxRate: 1.2,
      annualInsurance: 2100,
      hoaMonthly: 180,
      utilitiesMonthly: 260,
      maintenanceRate: 1,
      currency: "USD",
    },
    mainFields: [
      moneyField("annualIncome", "Annual household income", 500),
      moneyField("monthlyDebt", "Existing monthly debt", 25),
      moneyField("downPayment", "Down payment", 500),
      percentField("annualRate", "Mortgage rate", 0, 12, 0.05),
      numberField("years", "Loan term in years", 5, 40, 1),
      percentField("targetDti", "Target DTI cap", 15, 50, 0.5),
    ],
    advancedFields: [
      percentField("propertyTaxRate", "Property tax rate", 0, 4, 0.01),
      moneyField("annualInsurance", "Annual home insurance", 50),
      moneyField("hoaMonthly", "Monthly HOA", 10),
      moneyField("utilitiesMonthly", "Monthly utilities", 10),
      percentField("maintenanceRate", "Annual maintenance rate", 0, 4, 0.05),
      currencyField(),
    ],
    validate(values) {
      return values.annualIncome <= 0 ? "Enter annual household income." : "";
    },
    compute(values) {
      const maxBudget = Math.max(0, values.annualIncome / 12 * (values.targetDti / 100) - values.monthlyDebt);
      const maxPrice = solveAffordableHomePrice(values, maxBudget);
      const loanAmount = Math.max(0, maxPrice - values.downPayment);
      const principalInterest = amortizedPayment(loanAmount, values.annualRate, values.years * 12);
      const taxes = maxPrice * (values.propertyTaxRate / 100) / 12;
      const insurance = values.annualInsurance / 12;
      const maintenance = maxPrice * (values.maintenanceRate / 100) / 12;
      const allIn = principalInterest + taxes + insurance + values.hoaMonthly + values.utilitiesMonthly + maintenance;
      const cashToClose = values.downPayment + maxPrice * 0.03;

      return result(
        "True home affordability estimate",
        [
          card("Max home price", moneyText(maxPrice, values.currency)),
          card("Max all-in housing cost", moneyText(allIn, values.currency)),
          card("Max mortgage amount", moneyText(loanAmount, values.currency)),
          card("Estimated cash to close", moneyText(cashToClose, values.currency)),
        ],
        [
          moneyBar("Housing budget", maxBudget * 12, values.currency),
          moneyBar("Principal and interest", principalInterest * 12, values.currency),
          moneyBar("Taxes, insurance, HOA, utilities, maintenance", (taxes + insurance + values.hoaMonthly + values.utilitiesMonthly + maintenance) * 12, values.currency),
          moneyBar("Max home price", maxPrice, values.currency),
        ],
        [
          `The all-in budget supports roughly ${moneyText(maxPrice, values.currency)} once taxes, insurance, HOA, utilities, and maintenance are counted.`,
          "This is usually the more honest number because it spends the whole monthly housing budget, not just principal and interest.",
        ],
        [
          note("Target DTI", percentText(values.targetDti)),
          note("Mortgage term", `${values.years} years`),
          note("Mortgage rate", percentText(values.annualRate)),
        ],
      );
    },
  };
}

function makeBuyVsRentTimelineConfig() {
  return {
    title: "Buy vs Rent With Timeline Calculator",
    categorySlug: "mortgage-data",
    badge: "Buy vs rent",
    actionLabel: "Compare buy vs rent",
    emptyState: "Compare the total cost of renting and buying across a specific timeline, including appreciation and selling costs.",
    summaryLabel: "Buy vs rent timeline",
    surfaceStyle: "loanSplit",
    aliases: ["buy vs rent timeline calculator", "rent or buy for how long", "homeownership break even calculator"],
    defaults: {
      monthlyRent: 2300,
      annualRentGrowth: 4,
      homePrice: 465000,
      downPayment: 70000,
      mortgageRate: 6.25,
      loanYears: 30,
      propertyTaxRate: 1.15,
      maintenanceRate: 1,
      appreciationRate: 3.5,
      sellingCostRate: 7,
      stayYears: 7,
      currency: "USD",
    },
    mainFields: [
      moneyField("monthlyRent", "Starting monthly rent", 25),
      percentField("annualRentGrowth", "Annual rent growth", 0, 12, 0.1),
      moneyField("homePrice", "Home price", 1000),
      moneyField("downPayment", "Down payment", 500),
      percentField("mortgageRate", "Mortgage rate", 0, 12, 0.05),
      numberField("loanYears", "Mortgage term", 5, 40, 1),
    ],
    advancedFields: [
      percentField("propertyTaxRate", "Property tax rate", 0, 4, 0.01),
      percentField("maintenanceRate", "Maintenance rate", 0, 4, 0.05),
      percentField("appreciationRate", "Home appreciation", -5, 10, 0.1),
      percentField("sellingCostRate", "Selling cost rate", 0, 12, 0.1),
      numberField("stayYears", "Years staying", 1, 20, 1),
      currencyField(),
    ],
    validate(values) {
      if (values.homePrice <= values.downPayment) return "Home price must be greater than the down payment.";
      return values.monthlyRent <= 0 ? "Enter the starting rent." : "";
    },
    compute(values) {
      const monthsStayed = values.stayYears * 12;
      const loanAmount = values.homePrice - values.downPayment;
      const mortgagePayment = amortizedPayment(loanAmount, values.mortgageRate, values.loanYears * 12);
      const totalRent = sumGrowingAnnualCost(values.monthlyRent * 12, values.annualRentGrowth, values.stayYears);
      const propertyTaxes = sumGrowingAnnualCost(values.homePrice * (values.propertyTaxRate / 100), values.appreciationRate, values.stayYears);
      const maintenance = sumGrowingAnnualCost(values.homePrice * (values.maintenanceRate / 100), values.appreciationRate, values.stayYears);
      const remainingBalance = getRemainingBalance(loanAmount, values.mortgageRate, mortgagePayment, monthsStayed);
      const futureHomeValue = values.homePrice * Math.pow(1 + values.appreciationRate / 100, values.stayYears);
      const saleNet = futureHomeValue * (1 - values.sellingCostRate / 100) - remainingBalance;
      const totalBuyOutflow = values.downPayment + mortgagePayment * monthsStayed + propertyTaxes + maintenance;
      const netBuyCost = totalBuyOutflow - saleNet;
      const lowerCostPath = netBuyCost <= totalRent ? "Buying" : "Renting";
      const breakEvenYear = findBuyVsRentBreakEven(values);

      return result(
        "Buy versus rent timeline comparison",
        [
          card("Lower-cost path", lowerCostPath),
          card("Rent total cost", moneyText(totalRent, values.currency)),
          card("Net buy cost", moneyText(netBuyCost, values.currency)),
          card("Break-even year", Number.isFinite(breakEvenYear) ? `${Math.ceil(breakEvenYear)}` : "Not reached"),
        ],
        [
          moneyBar("Rent total cost", totalRent, values.currency),
          moneyBar("Buy total outflow", totalBuyOutflow, values.currency),
          moneyBar("Net sale proceeds", saleNet, values.currency),
          moneyBar("Net buy cost", netBuyCost, values.currency),
        ],
        [
          `${lowerCostPath} is cheaper over the selected ${values.stayYears}-year window in this model.`,
          Number.isFinite(breakEvenYear)
            ? `The buy path overtakes renting around year ${Math.ceil(breakEvenYear)} with these assumptions.`
            : "The buy path does not overtake renting inside the selected timeline with the current assumptions.",
        ],
        [
          note("Stay period", `${values.stayYears} years`),
          note("Appreciation", percentText(values.appreciationRate)),
          note("Selling cost", percentText(values.sellingCostRate)),
        ],
      );
    },
  };
}

function makeHomeEnergyPaybackConfig() {
  return {
    title: "Home Energy Upgrade Payback Planner",
    categorySlug: "home-costs",
    badge: "Energy upgrade",
    actionLabel: "Plan payback",
    emptyState: "Estimate payback timing for a home energy upgrade after rebates, financing, and rising utility costs.",
    summaryLabel: "Upgrade payback",
    surfaceStyle: "investment",
    aliases: ["energy upgrade payoff calculator", "home efficiency payback", "insulation or hvac payback calculator"],
    defaults: {
      projectCost: 14500,
      rebate: 2200,
      annualEnergySavings: 1800,
      annualMaintenanceSavings: 250,
      energyInflation: 3,
      financingRate: 5.5,
      financingYears: 5,
      holdYears: 10,
      currency: "USD",
    },
    mainFields: [
      moneyField("projectCost", "Project cost", 100),
      moneyField("rebate", "Rebates and credits", 50),
      moneyField("annualEnergySavings", "First-year energy savings", 25),
      moneyField("annualMaintenanceSavings", "Annual maintenance savings", 25),
    ],
    advancedFields: [
      percentField("energyInflation", "Energy inflation", 0, 12, 0.1),
      percentField("financingRate", "Financing rate", 0, 15, 0.1),
      numberField("financingYears", "Financing years", 0, 15, 1),
      numberField("holdYears", "Years keeping the home", 1, 25, 1),
      currencyField(),
    ],
    validate(values) {
      return values.projectCost <= 0 ? "Enter the upgrade project cost." : "";
    },
    compute(values) {
      const netCost = Math.max(0, values.projectCost - values.rebate);
      const financingMonths = values.financingYears * 12;
      const financedPayment = financingMonths > 0 ? amortizedPayment(netCost, values.financingRate, financingMonths) : 0;
      const financingOutlay = financingMonths > 0 ? financedPayment * financingMonths : netCost;
      let totalSavings = 0;
      let breakEvenYear = Number.POSITIVE_INFINITY;

      for (let year = 1; year <= values.holdYears; year += 1) {
        const yearSavings =
          values.annualEnergySavings * Math.pow(1 + values.energyInflation / 100, year - 1) +
          values.annualMaintenanceSavings;
        totalSavings += yearSavings;
        if (!Number.isFinite(breakEvenYear) && totalSavings >= financingOutlay) {
          breakEvenYear = year;
        }
      }

      const netGain = totalSavings - financingOutlay;

      return result(
        "Home energy upgrade payback",
        [
          card("Net project cost", moneyText(netCost, values.currency)),
          card("Payback year", Number.isFinite(breakEvenYear) ? `${breakEvenYear}` : "After horizon"),
          card("10-year net gain", moneyText(netGain, values.currency)),
          card("Monthly financed payment", financingMonths > 0 ? moneyText(financedPayment, values.currency) : moneyText(0, values.currency)),
        ],
        [
          moneyBar("Net project cost", netCost, values.currency),
          moneyBar("Financing outlay", financingOutlay, values.currency),
          moneyBar("Modeled savings over horizon", totalSavings, values.currency),
          moneyBar("Net gain", netGain, values.currency),
        ],
        [
          Number.isFinite(breakEvenYear)
            ? `The upgrade pays back around year ${breakEvenYear} with the current savings and financing assumptions.`
            : "The upgrade does not fully pay back inside the selected hold period under the current assumptions.",
          "Projects with good rebates often win twice: they lower the starting cash hit and they shorten the psychological payback window.",
        ],
        [
          note("Energy inflation", percentText(values.energyInflation)),
          note("Financing years", `${values.financingYears}`),
          note("Hold years", `${values.holdYears}`),
        ],
      );
    },
  };
}

function makeEvVsGasConfig() {
  return {
    title: "EV vs Gas Total Cost Calculator",
    categorySlug: "finance",
    badge: "Vehicle compare",
    actionLabel: "Compare vehicle costs",
    emptyState: "Compare EV and gas ownership using purchase cost, energy, fuel, maintenance, insurance, and tax credits.",
    summaryLabel: "EV vs gas comparison",
    surfaceStyle: "ledger",
    aliases: ["ev versus gas calculator", "electric car vs gas cost", "ev break even calculator"],
    defaults: {
      evPrice: 44500,
      gasCarPrice: 33200,
      taxCredit: 5000,
      annualMiles: 14000,
      yearsOwned: 5,
      electricityPrice: 0.17,
      kwhPer100Miles: 29,
      gasPrice: 3.85,
      gasMpg: 30,
      annualEvMaintenance: 420,
      annualGasMaintenance: 980,
      insuranceDiff: 180,
      currency: "USD",
    },
    mainFields: [
      moneyField("evPrice", "EV purchase price", 500),
      moneyField("gasCarPrice", "Gas car purchase price", 500),
      moneyField("taxCredit", "EV incentives and tax credits", 100),
      numberField("annualMiles", "Annual miles driven", 1000, 40000, 500),
      numberField("yearsOwned", "Years owned", 1, 12, 1),
    ],
    advancedFields: [
      { name: "electricityPrice", label: "Electricity price per kWh", type: "number", min: 0, max: 2, step: 0.01, prefix: "$" },
      numberField("kwhPer100Miles", "EV kWh per 100 miles", 10, 60, 0.5),
      { name: "gasPrice", label: "Gas price per gallon", type: "number", min: 0, max: 20, step: 0.01, prefix: "$" },
      numberField("gasMpg", "Gas vehicle MPG", 5, 80, 1),
      moneyField("annualEvMaintenance", "Annual EV maintenance", 10),
      moneyField("annualGasMaintenance", "Annual gas vehicle maintenance", 10),
      moneyField("insuranceDiff", "Annual EV insurance premium above gas", 10),
      currencyField(),
    ],
    validate(values) {
      if (values.evPrice <= 0 || values.gasCarPrice <= 0) return "Enter both vehicle prices.";
      return values.annualMiles <= 0 ? "Enter annual miles driven." : "";
    },
    compute(values) {
      const evNetPurchase = values.evPrice - values.taxCredit;
      const annualEvEnergy = (values.annualMiles / 100) * values.kwhPer100Miles * values.electricityPrice;
      const annualGasFuel = (values.annualMiles / Math.max(values.gasMpg, 1)) * values.gasPrice;
      const evAnnualRunning = annualEvEnergy + values.annualEvMaintenance + values.insuranceDiff;
      const gasAnnualRunning = annualGasFuel + values.annualGasMaintenance;
      const totalEv = evNetPurchase + evAnnualRunning * values.yearsOwned;
      const totalGas = values.gasCarPrice + gasAnnualRunning * values.yearsOwned;
      const totalGap = totalGas - totalEv;
      const perMileSavings = (gasAnnualRunning - evAnnualRunning) / Math.max(values.annualMiles, 1);
      const upfrontGap = evNetPurchase - values.gasCarPrice;
      const breakEvenMiles = perMileSavings > 0 ? upfrontGap / perMileSavings : Number.POSITIVE_INFINITY;

      return result(
        "EV versus gas total cost",
        [
          card("Lower total cost", `${totalGap >= 0 ? "EV" : "Gas"} ${moneyText(Math.abs(totalGap), values.currency)}`),
          card("EV total ownership cost", moneyText(totalEv, values.currency)),
          card("Gas total ownership cost", moneyText(totalGas, values.currency)),
          card("Break-even miles", Number.isFinite(breakEvenMiles) ? count(breakEvenMiles) : "No break-even"),
        ],
        [
          moneyBar("EV total cost", totalEv, values.currency),
          moneyBar("Gas total cost", totalGas, values.currency),
          moneyBar("EV annual running cost", evAnnualRunning, values.currency),
          moneyBar("Gas annual running cost", gasAnnualRunning, values.currency),
        ],
        [
          totalGap >= 0
            ? `The EV is cheaper by about ${moneyText(totalGap, values.currency)} across the selected ownership window.`
            : `The gas vehicle stays cheaper by about ${moneyText(Math.abs(totalGap), values.currency)} across the selected ownership window.`,
          Number.isFinite(breakEvenMiles)
            ? `The EV catches up after roughly ${count(breakEvenMiles)} miles with the current fuel and electricity assumptions.`
            : "The EV does not recover its purchase premium under the current running-cost assumptions.",
        ],
        [
          note("Annual miles", count(values.annualMiles)),
          note("Years owned", `${values.yearsOwned}`),
          note("Fuel price", moneyText(values.gasPrice, values.currency, 2)),
        ],
      );
    },
  };
}

function makeFloodRiskExposureConfig() {
  return {
    title: "Flood Risk Insurance and Mortgage Exposure Planner",
    categorySlug: "home-costs",
    badge: "Risk planning",
    actionLabel: "Plan flood exposure",
    emptyState: "Estimate expected flood-related costs from premiums, uninsured loss exposure, and mortgage balance risk.",
    summaryLabel: "Flood exposure estimate",
    surfaceStyle: "ledger",
    aliases: ["flood risk calculator", "flood insurance exposure planner", "mortgage flood risk tool"],
    defaults: {
      state: "fl",
      homeValue: 420000,
      mortgageBalance: 310000,
      annualPremium: 2400,
      annualFloodProbability: 1.2,
      uninsuredLossPercent: 18,
      deductible: 5000,
      yearsOwned: 10,
      premiumGrowth: 6,
      currency: "USD",
    },
    mainFields: [
      selectField("state", "State", STATE_OPTIONS),
      moneyField("homeValue", "Home value", 1000),
      moneyField("mortgageBalance", "Mortgage balance", 1000),
      moneyField("annualPremium", "Annual flood insurance premium", 50),
      percentField("annualFloodProbability", "Annual flood probability", 0.1, 10, 0.1),
    ],
    advancedFields: [
      percentField("uninsuredLossPercent", "Uninsured loss per event", 1, 50, 0.5),
      moneyField("deductible", "Policy deductible", 50),
      numberField("yearsOwned", "Years owned", 1, 30, 1),
      percentField("premiumGrowth", "Annual premium growth", 0, 15, 0.1),
      currencyField(),
    ],
    validate(values) {
      return values.homeValue <= 0 ? "Enter the home value." : "";
    },
    compute(values) {
      const expectedLossPerEvent = Math.max(0, values.homeValue * (values.uninsuredLossPercent / 100) - values.deductible);
      const stateRiskFloor = getStateProfile(values.state).floodRiskRate;
      const normalizedProbability = Math.max(values.annualFloodProbability / 100, stateRiskFloor / 100);
      const expectedAnnualLoss = expectedLossPerEvent * normalizedProbability;
      const premiumTotal = sumGrowingAnnualCost(values.annualPremium, values.premiumGrowth, values.yearsOwned);
      const combinedExposure = premiumTotal + expectedAnnualLoss * values.yearsOwned;
      const exposureShare = combinedExposure / Math.max(values.mortgageBalance, 1);

      return result(
        "Flood risk and mortgage exposure",
        [
          card("Expected annual uncovered loss", moneyText(expectedAnnualLoss, values.currency)),
          card("Premiums over horizon", moneyText(premiumTotal, values.currency)),
          card("Combined modeled exposure", moneyText(combinedExposure, values.currency)),
          card("Exposure vs mortgage balance", percentText(exposureShare * 100)),
        ],
        [
          moneyBar("Mortgage balance", values.mortgageBalance, values.currency),
          moneyBar("Expected loss per event", expectedLossPerEvent, values.currency),
          moneyBar("Premium total", premiumTotal, values.currency),
          moneyBar("Combined exposure", combinedExposure, values.currency),
        ],
        [
          `The current assumptions point to about ${moneyText(combinedExposure, values.currency)} in combined premium and expected uncovered-loss exposure over ${values.yearsOwned} years.`,
          "This is not a prediction. It is a pressure test for how much flood risk might quietly sit alongside the mortgage if the area, premium trend, and loss severity all stay in this range.",
        ],
        [
          note("State", labelForOption(values.state, STATE_OPTIONS)),
          note("Years owned", `${values.yearsOwned}`),
          note("Premium growth", percentText(values.premiumGrowth)),
        ],
      );
    },
  };
}

function makeChildcareDecisionConfig() {
  return {
    title: "Childcare vs Stay-at-Home Parent Calculator",
    categorySlug: "cost-of-living",
    badge: "Family decision",
    actionLabel: "Compare family paths",
    emptyState: "Compare keeping a working-parent income against childcare costs, commute, work expenses, and the long-term cost of stepping away.",
    summaryLabel: "Childcare decision comparison",
    surfaceStyle: "salarySplit",
    aliases: ["stay at home parent calculator", "childcare affordability calculator", "work vs childcare calculator"],
    defaults: {
      monthlyTakeHome: 4600,
      childcareMonthly: 1800,
      commuteMonthly: 280,
      workCostsMonthly: 180,
      taxBenefitMonthly: 120,
      retirementLossAnnual: 4500,
      reentryPenaltyAnnual: 6000,
      comparisonYears: 4,
      currency: "USD",
    },
    mainFields: [
      moneyField("monthlyTakeHome", "Working parent's monthly take-home pay", 25),
      moneyField("childcareMonthly", "Monthly childcare cost", 25),
      moneyField("commuteMonthly", "Monthly commute cost", 10),
      moneyField("workCostsMonthly", "Monthly work costs", 10),
    ],
    advancedFields: [
      moneyField("taxBenefitMonthly", "Monthly childcare tax benefit", 10),
      moneyField("retirementLossAnnual", "Annual retirement loss if leaving work", 100),
      moneyField("reentryPenaltyAnnual", "Annual re-entry pay penalty", 100),
      numberField("comparisonYears", "Comparison years", 1, 10, 1),
      currencyField(),
    ],
    validate(values) {
      return values.monthlyTakeHome <= 0 ? "Enter the working parent's take-home pay." : "";
    },
    compute(values) {
      const monthlyNetWorkValue = values.monthlyTakeHome - values.childcareMonthly - values.commuteMonthly - values.workCostsMonthly + values.taxBenefitMonthly;
      const annualWorkValue = monthlyNetWorkValue * 12;
      const longRunAdvantage = annualWorkValue * values.comparisonYears + values.retirementLossAnnual * values.comparisonYears + values.reentryPenaltyAnnual;
      const childcareBreakEven = values.monthlyTakeHome + values.taxBenefitMonthly - values.commuteMonthly - values.workCostsMonthly;

      return result(
        "Childcare versus stay-at-home parent comparison",
        [
          card("Monthly value of staying in work", moneyText(monthlyNetWorkValue, values.currency)),
          card("Multi-year work advantage", moneyText(longRunAdvantage, values.currency)),
          card("Childcare break-even cost", moneyText(childcareBreakEven, values.currency)),
          card("Comparison window", `${values.comparisonYears} years`),
        ],
        [
          moneyBar("Working parent take-home pay", values.monthlyTakeHome * 12, values.currency),
          moneyBar("Childcare, commute, and work costs", (values.childcareMonthly + values.commuteMonthly + values.workCostsMonthly - values.taxBenefitMonthly) * 12, values.currency),
          moneyBar("Annual retirement loss from leaving work", values.retirementLossAnnual, values.currency),
          moneyBar("Modeled multi-year work advantage", longRunAdvantage, values.currency),
        ],
        [
          monthlyNetWorkValue >= 0
            ? `After childcare and work costs, staying in work still adds about ${moneyText(monthlyNetWorkValue, values.currency)} per month to the household in this model.`
            : `After childcare and work costs, staying in work is underwater by about ${moneyText(Math.abs(monthlyNetWorkValue), values.currency)} per month in this model.`,
          "The retirement loss and re-entry penalty are the two inputs people usually forget, and they are often what turns a short-term tie into a longer-term difference.",
        ],
        [
          note("Comparison years", `${values.comparisonYears}`),
          note("Tax benefit", moneyText(values.taxBenefitMonthly, values.currency)),
          note("Re-entry penalty", moneyText(values.reentryPenaltyAnnual, values.currency)),
        ],
      );
    },
  };
}

function makeFamilyHealthPlanConfig() {
  return {
    title: "Family Health Plan Total Cost Estimator",
    categorySlug: "tax-budget",
    badge: "Health plan",
    actionLabel: "Compare health plans",
    emptyState: "Compare two family plans using premiums, deductibles, coinsurance, out-of-pocket caps, and expected care spend.",
    summaryLabel: "Family plan comparison",
    surfaceStyle: "taxGrid",
    aliases: ["family health insurance calculator", "compare family health plans", "total health plan cost estimator"],
    defaults: {
      annualPremiumA: 6900,
      deductibleA: 3200,
      coinsuranceA: 20,
      oopMaxA: 9000,
      annualPremiumB: 11400,
      deductibleB: 1200,
      coinsuranceB: 10,
      oopMaxB: 6200,
      expectedMedicalSpend: 9000,
      expectedDrugSpend: 1800,
      currency: "USD",
    },
    mainFields: [
      moneyField("annualPremiumA", "Plan A annual premium", 50),
      moneyField("deductibleA", "Plan A deductible", 50),
      percentField("coinsuranceA", "Plan A coinsurance", 0, 50, 1),
      moneyField("oopMaxA", "Plan A out-of-pocket max", 50),
      moneyField("annualPremiumB", "Plan B annual premium", 50),
      moneyField("deductibleB", "Plan B deductible", 50),
      percentField("coinsuranceB", "Plan B coinsurance", 0, 50, 1),
      moneyField("oopMaxB", "Plan B out-of-pocket max", 50),
    ],
    advancedFields: [
      moneyField("expectedMedicalSpend", "Expected annual medical spend", 50),
      moneyField("expectedDrugSpend", "Expected annual drug spend", 50),
      currencyField(),
    ],
    fieldGroups: [
      { title: "Plan A", fields: ["annualPremiumA", "deductibleA", "coinsuranceA", "oopMaxA"] },
      { title: "Plan B", fields: ["annualPremiumB", "deductibleB", "coinsuranceB", "oopMaxB"] },
      { title: "Expected usage", fields: ["expectedMedicalSpend", "expectedDrugSpend", "currency"] },
    ],
    validate(values) {
      return values.expectedMedicalSpend < 0 || values.expectedDrugSpend < 0 ? "Expected usage inputs cannot be negative." : "";
    },
    compute(values) {
      const planA = estimateHealthPlanCost({
        annualPremium: values.annualPremiumA,
        deductible: values.deductibleA,
        coinsurance: values.coinsuranceA,
        oopMax: values.oopMaxA,
        expectedMedicalSpend: values.expectedMedicalSpend,
        expectedDrugSpend: values.expectedDrugSpend,
      });
      const planB = estimateHealthPlanCost({
        annualPremium: values.annualPremiumB,
        deductible: values.deductibleB,
        coinsurance: values.coinsuranceB,
        oopMax: values.oopMaxB,
        expectedMedicalSpend: values.expectedMedicalSpend,
        expectedDrugSpend: values.expectedDrugSpend,
      });
      const gap = planB.total - planA.total;
      const better = gap >= 0 ? "Plan A" : "Plan B";

      return result(
        "Family health plan total cost comparison",
        [
          card("Lower total annual cost", `${better} ${moneyText(Math.abs(gap), values.currency)}`),
          card("Plan A total cost", moneyText(planA.total, values.currency)),
          card("Plan B total cost", moneyText(planB.total, values.currency)),
          card("Expected family claims", moneyText(values.expectedMedicalSpend + values.expectedDrugSpend, values.currency)),
        ],
        [
          moneyBar("Plan A total cost", planA.total, values.currency),
          moneyBar("Plan B total cost", planB.total, values.currency),
          moneyBar("Plan A member cost share", planA.memberCost, values.currency),
          moneyBar("Plan B member cost share", planB.memberCost, values.currency),
        ],
        [
          `${better} is cheaper in the current usage scenario.`,
          "Lower-premium plans often look attractive until a medium-usage year shows how quickly coinsurance and the out-of-pocket maximum can take over the story.",
        ],
        [
          note("Plan A coinsurance", percentText(values.coinsuranceA)),
          note("Plan B coinsurance", percentText(values.coinsuranceB)),
          note("Expected claims", moneyText(values.expectedMedicalSpend + values.expectedDrugSpend, values.currency)),
        ],
        {
          table: buildTable(
            "Plan comparison",
            ["Plan", "Premium", "Member cost share", "Total annual cost"],
            [
              ["Plan A", moneyText(values.annualPremiumA, values.currency), moneyText(planA.memberCost, values.currency), moneyText(planA.total, values.currency)],
              ["Plan B", moneyText(values.annualPremiumB, values.currency), moneyText(planB.memberCost, values.currency), moneyText(planB.total, values.currency)],
            ],
          ),
        },
      );
    },
  };
}

function makeCareerChangeConfig() {
  return {
    title: "Career Change Payback Timeline",
    categorySlug: "salary-data",
    badge: "Career shift",
    actionLabel: "Model the switch",
    emptyState: "Compare staying put against retraining or switching careers using a timeline, training costs, and salary growth.",
    summaryLabel: "Career change payback",
    surfaceStyle: "investment",
    aliases: ["career change calculator", "reskilling payback calculator", "career switch break even"],
    defaults: {
      currentSalary: 92000,
      newSalaryStart: 76000,
      trainingMonths: 6,
      incomeDuringTraining: 1200,
      trainingCost: 14000,
      currentGrowth: 4,
      newGrowth: 8,
      comparisonYears: 8,
      currency: "USD",
    },
    mainFields: [
      moneyField("currentSalary", "Current annual salary", 500),
      moneyField("newSalaryStart", "New career starting salary", 500),
      numberField("trainingMonths", "Training months", 0, 24, 1),
      moneyField("incomeDuringTraining", "Monthly income during training", 25),
      moneyField("trainingCost", "Training and transition cost", 100),
    ],
    advancedFields: [
      percentField("currentGrowth", "Current-path annual growth", 0, 15, 0.1),
      percentField("newGrowth", "New-career annual growth", 0, 20, 0.1),
      numberField("comparisonYears", "Comparison years", 1, 15, 1),
      currencyField(),
    ],
    validate(values) {
      if (values.currentSalary <= 0 || values.newSalaryStart <= 0) return "Enter both salary paths.";
      return "";
    },
    compute(values) {
      const comparisonMonths = values.comparisonYears * 12;
      let currentCumulative = 0;
      let newCumulative = -values.trainingCost;
      let breakEvenMonth = Number.POSITIVE_INFINITY;

      for (let month = 1; month <= comparisonMonths; month += 1) {
        const currentMonthly = monthlySalaryWithGrowth(values.currentSalary, values.currentGrowth, month);
        const newMonthly =
          month <= values.trainingMonths
            ? values.incomeDuringTraining
            : monthlySalaryWithGrowth(values.newSalaryStart, values.newGrowth, month - values.trainingMonths);
        currentCumulative += currentMonthly;
        newCumulative += newMonthly;
        if (!Number.isFinite(breakEvenMonth) && newCumulative >= currentCumulative) {
          breakEvenMonth = month;
        }
      }

      const gap = newCumulative - currentCumulative;

      return result(
        "Career change payback timeline",
        [
          card("Break-even month", Number.isFinite(breakEvenMonth) ? `${Math.ceil(breakEvenMonth)}` : "After horizon"),
          card("Stay-path earnings", moneyText(currentCumulative, values.currency)),
          card("New-path earnings", moneyText(newCumulative, values.currency)),
          card("End-of-horizon gap", signedMoneyText(gap, values.currency)),
        ],
        [
          moneyBar("Stay-path cumulative earnings", currentCumulative, values.currency),
          moneyBar("New-path cumulative earnings", newCumulative, values.currency),
          moneyBar("Training cost", values.trainingCost, values.currency),
          moneyBar("End-of-horizon gap", gap, values.currency),
        ],
        [
          Number.isFinite(breakEvenMonth)
            ? `The new career path catches up around month ${Math.ceil(breakEvenMonth)} in this model.`
            : "The new career path does not catch the current path inside the selected comparison window.",
          "The growth-rate assumptions matter almost as much as the starting salary, especially when the new field has a steeper long-run earnings curve.",
        ],
        [
          note("Training months", `${values.trainingMonths}`),
          note("Comparison years", `${values.comparisonYears}`),
          note("Training cost", moneyText(values.trainingCost, values.currency)),
        ],
      );
    },
  };
}

function makeFreelancerRateRealityConfig() {
  return {
    title: "Freelancer Rate Reality Calculator",
    categorySlug: "salary-data",
    badge: "Rate planner",
    actionLabel: "Calculate real rate",
    emptyState: "Estimate the hourly and day rate needed to support your target pay after taxes, overhead, and non-billable time.",
    summaryLabel: "Freelancer rate reality",
    surfaceStyle: "salarySplit",
    aliases: ["real freelance rate calculator", "consulting rate calculator", "freelancer pricing calculator"],
    defaults: {
      targetTakeHome: 96000,
      annualOverhead: 18000,
      selfEmploymentTaxRate: 15.3,
      incomeTaxRate: 22,
      billableHoursPerWeek: 24,
      weeksWorked: 46,
      utilizationRate: 80,
      profitBuffer: 12,
      currency: "USD",
    },
    mainFields: [
      moneyField("targetTakeHome", "Target annual take-home pay", 500),
      moneyField("annualOverhead", "Annual overhead and benefits", 100),
      percentField("selfEmploymentTaxRate", "Self-employment tax rate", 0, 20, 0.1),
      percentField("incomeTaxRate", "Income tax rate", 0, 40, 0.5),
    ],
    advancedFields: [
      numberField("billableHoursPerWeek", "Billable hours per week", 1, 60, 0.5),
      numberField("weeksWorked", "Weeks worked per year", 1, 52, 1),
      percentField("utilizationRate", "Utilization rate", 30, 100, 1),
      percentField("profitBuffer", "Profit buffer", 0, 30, 0.5),
      currencyField(),
    ],
    validate(values) {
      if (values.targetTakeHome <= 0) return "Enter your target take-home pay.";
      return values.billableHoursPerWeek <= 0 ? "Enter billable hours per week." : "";
    },
    compute(values) {
      const combinedTaxRate = clamp(values.selfEmploymentTaxRate + values.incomeTaxRate, 0, 70) / 100;
      const billableHours = values.billableHoursPerWeek * values.weeksWorked * (values.utilizationRate / 100);
      const revenueBeforeBuffer = values.targetTakeHome / Math.max(1 - combinedTaxRate, 0.05) + values.annualOverhead;
      const revenueTarget = revenueBeforeBuffer / Math.max(1 - values.profitBuffer / 100, 0.05);
      const hourlyRate = revenueTarget / Math.max(billableHours, 1);
      const dayRate = hourlyRate * 8;

      return result(
        "Freelancer rate reality",
        [
          card("Target hourly rate", moneyText(hourlyRate, values.currency, 2)),
          card("Target day rate", moneyText(dayRate, values.currency)),
          card("Annual revenue target", moneyText(revenueTarget, values.currency)),
          card("Billable hours per year", count(billableHours)),
        ],
        [
          moneyBar("Target take-home pay", values.targetTakeHome, values.currency),
          moneyBar("Annual overhead", values.annualOverhead, values.currency),
          moneyBar("Revenue target", revenueTarget, values.currency),
          moneyBar("Hourly rate", hourlyRate, values.currency, 2),
        ],
        [
          `To take home about ${moneyText(values.targetTakeHome, values.currency)}, the work needs to price near ${moneyText(hourlyRate, values.currency, 2)} an hour under these assumptions.`,
          "The utilization rate is doing real work here. Most underpriced freelance businesses are not misjudging taxes, they are underestimating how few hours are truly billable.",
        ],
        [
          note("Utilization", percentText(values.utilizationRate)),
          note("Weeks worked", `${values.weeksWorked}`),
          note("Profit buffer", percentText(values.profitBuffer)),
        ],
      );
    },
  };
}

function makeMedicarePlanConfig() {
  return {
    title: "Medicare Plan Cost Comparator",
    categorySlug: "tax-budget",
    badge: "Medicare compare",
    actionLabel: "Compare Medicare paths",
    emptyState: "Compare Original Medicare plus Medigap and Part D against a Medicare Advantage path using premium and expected usage assumptions.",
    summaryLabel: "Medicare comparison",
    surfaceStyle: "taxGrid",
    aliases: ["medicare cost calculator", "medigap vs advantage calculator", "medicare plan comparison"],
    defaults: {
      partBMonthly: 185,
      medigapMonthly: 165,
      partDMonthly: 45,
      advantageMonthly: 55,
      originalCoinsurance: 12,
      advantageCoinsurance: 28,
      expectedMedicalSpend: 8500,
      expectedDrugSpend: 1800,
      advantageOopMax: 5900,
      currency: "USD",
    },
    mainFields: [
      moneyField("partBMonthly", "Original Medicare Part B monthly premium", 5),
      moneyField("medigapMonthly", "Medigap monthly premium", 5),
      moneyField("partDMonthly", "Part D monthly premium", 5),
      moneyField("advantageMonthly", "Medicare Advantage monthly premium", 5),
    ],
    advancedFields: [
      percentField("originalCoinsurance", "Original Medicare coinsurance", 0, 30, 0.5),
      percentField("advantageCoinsurance", "Advantage coinsurance", 0, 50, 0.5),
      moneyField("expectedMedicalSpend", "Expected annual medical spend", 50),
      moneyField("expectedDrugSpend", "Expected annual drug spend", 50),
      moneyField("advantageOopMax", "Advantage out-of-pocket maximum", 50),
      currencyField(),
    ],
    validate(values) {
      return values.expectedMedicalSpend < 0 || values.expectedDrugSpend < 0 ? "Expected usage inputs cannot be negative." : "";
    },
    compute(values) {
      const originalPremiums = (values.partBMonthly + values.medigapMonthly + values.partDMonthly) * 12;
      const originalMemberCost = values.expectedMedicalSpend * (values.originalCoinsurance / 100) + values.expectedDrugSpend;
      const originalTotal = originalPremiums + originalMemberCost;

      const advantagePremiums = values.advantageMonthly * 12;
      const advantageMemberCost = Math.min(
        values.advantageOopMax,
        values.expectedMedicalSpend * (values.advantageCoinsurance / 100) + values.expectedDrugSpend * 0.45,
      );
      const advantageTotal = advantagePremiums + advantageMemberCost;
      const gap = advantageTotal - originalTotal;
      const cheaper = gap >= 0 ? "Original Medicare + Medigap" : "Medicare Advantage";

      return result(
        "Medicare plan cost comparison",
        [
          card("Lower modeled annual cost", `${cheaper} ${moneyText(Math.abs(gap), values.currency)}`),
          card("Original + Medigap total", moneyText(originalTotal, values.currency)),
          card("Advantage total", moneyText(advantageTotal, values.currency)),
          card("Expected annual claims", moneyText(values.expectedMedicalSpend + values.expectedDrugSpend, values.currency)),
        ],
        [
          moneyBar("Original + Medigap total", originalTotal, values.currency),
          moneyBar("Advantage total", advantageTotal, values.currency),
          moneyBar("Original premium stack", originalPremiums, values.currency),
          moneyBar("Advantage premium stack", advantagePremiums, values.currency),
        ],
        [
          `${cheaper} is cheaper in the current usage model.`,
          "Advantage plans often win on premium and lose on utilization-heavy years. Medigap does the opposite, so expected claims volume matters a lot here.",
        ],
        [
          note("Original coinsurance", percentText(values.originalCoinsurance)),
          note("Advantage coinsurance", percentText(values.advantageCoinsurance)),
          note("Advantage OOP max", moneyText(values.advantageOopMax, values.currency)),
        ],
        {
          table: buildTable(
            "Medicare path comparison",
            ["Path", "Premiums", "Member cost share", "Total annual cost"],
            [
              ["Original + Medigap", moneyText(originalPremiums, values.currency), moneyText(originalMemberCost, values.currency), moneyText(originalTotal, values.currency)],
              ["Medicare Advantage", moneyText(advantagePremiums, values.currency), moneyText(advantageMemberCost, values.currency), moneyText(advantageTotal, values.currency)],
            ],
          ),
        },
      );
    },
  };
}

function result(title, summaryCards, breakdown, insights, meta, extras = {}) {
  const report = [
    title,
    "",
    "Summary",
    ...summaryCards.map((item) => `- ${item.label}: ${item.value}`),
    "",
    "Breakdown",
    ...breakdown.map((item) => `- ${item.label}: ${item.displayValue || plain(item.value)}`),
    "",
    "Insights",
    ...insights.map((item) => `- ${item}`),
    "",
    "Notes",
    ...meta.map((item) => `- ${item.label}: ${item.value}`),
  ].join("\n");

  return { title, summaryCards, breakdown, insights, meta, report, ...extras };
}

function buildTable(title, headers, rows, footnote = "") {
  return {
    title,
    headers,
    rows: rows.map((row) => ({ cells: row })),
    footnote,
  };
}

function buildOfferOutcome({ salary, bonusRate, equity, benefits, commute, taxRate }) {
  const bonusCash = salary * (bonusRate / 100);
  const grossComp = salary + bonusCash + equity;
  const taxDrag = grossComp * (taxRate / 100);
  const commuteDrag = commute * 12;
  const netValue = grossComp - taxDrag + benefits - commuteDrag;
  return { grossComp, taxDrag, benefits, commuteDrag, netValue };
}

function estimateHealthPlanCost({ annualPremium, deductible, coinsurance, oopMax, expectedMedicalSpend, expectedDrugSpend }) {
  const coinsuranceCost = Math.max(0, expectedMedicalSpend - deductible) * (coinsurance / 100);
  const memberCost = Math.min(oopMax, Math.min(expectedMedicalSpend, deductible) + coinsuranceCost + expectedDrugSpend);
  return {
    memberCost,
    total: annualPremium + memberCost,
  };
}

function simulateSocialSecurityLifetime({ monthlyBenefit, claimAge, endAge, cola, taxRate }) {
  let total = 0;
  let annualBenefit = monthlyBenefit * 12;
  for (let age = claimAge; age < endAge; age += 1) {
    total += annualBenefit * (1 - taxRate / 100);
    annualBenefit *= 1 + cola / 100;
  }
  return total;
}

function findSocialSecurityBreakEven({ earlyMonthlyBenefit, delayedMonthlyBenefit, earlyAge, delayedAge, cola }) {
  let earlyTotal = 0;
  let delayedTotal = 0;
  let earlyAnnual = earlyMonthlyBenefit * 12;
  let delayedAnnual = delayedMonthlyBenefit * 12;

  for (let age = earlyAge; age <= 100; age += 1) {
    earlyTotal += earlyAnnual;
    if (age >= delayedAge) delayedTotal += delayedAnnual;
    if (age >= delayedAge && delayedTotal >= earlyTotal) return age;
    earlyAnnual *= 1 + cola / 100;
    if (age >= delayedAge) delayedAnnual *= 1 + cola / 100;
  }

  return Number.POSITIVE_INFINITY;
}

function findBuyVsRentBreakEven(values) {
  for (let year = 1; year <= values.stayYears; year += 1) {
    const monthsStayed = year * 12;
    const loanAmount = values.homePrice - values.downPayment;
    const mortgagePayment = amortizedPayment(loanAmount, values.mortgageRate, values.loanYears * 12);
    const totalRent = sumGrowingAnnualCost(values.monthlyRent * 12, values.annualRentGrowth, year);
    const propertyTaxes = sumGrowingAnnualCost(values.homePrice * (values.propertyTaxRate / 100), values.appreciationRate, year);
    const maintenance = sumGrowingAnnualCost(values.homePrice * (values.maintenanceRate / 100), values.appreciationRate, year);
    const remainingBalance = getRemainingBalance(loanAmount, values.mortgageRate, mortgagePayment, monthsStayed);
    const futureHomeValue = values.homePrice * Math.pow(1 + values.appreciationRate / 100, year);
    const saleNet = futureHomeValue * (1 - values.sellingCostRate / 100) - remainingBalance;
    const totalBuyOutflow = values.downPayment + mortgagePayment * monthsStayed + propertyTaxes + maintenance;
    const netBuyCost = totalBuyOutflow - saleNet;
    if (netBuyCost <= totalRent) return year;
  }
  return Number.POSITIVE_INFINITY;
}

function solveAffordableHomePrice(values, monthlyBudget) {
  let low = 0;
  let high = Math.max(values.annualIncome * 12, values.downPayment + 150000);

  for (let step = 0; step < 40; step += 1) {
    const mid = (low + high) / 2;
    const loanAmount = Math.max(0, mid - values.downPayment);
    const principalInterest = amortizedPayment(loanAmount, values.annualRate, values.years * 12);
    const propertyTax = mid * (values.propertyTaxRate / 100) / 12;
    const insurance = values.annualInsurance / 12;
    const maintenance = mid * (values.maintenanceRate / 100) / 12;
    const total = principalInterest + propertyTax + insurance + values.hoaMonthly + values.utilitiesMonthly + maintenance;

    if (total <= monthlyBudget) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return low;
}

function simulateFixedPayment(principal, annualRate, payment, limitMonths = 1200) {
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  let totalPaid = 0;
  let months = 0;

  while (balance > 0.01 && months < limitMonths) {
    const interest = balance * monthlyRate;
    const actualPayment = Math.min(balance + interest, payment);
    balance = Math.max(0, balance + interest - actualPayment);
    totalPaid += actualPayment;
    months += 1;
    if (payment <= interest && monthlyRate > 0) break;
  }

  return {
    months,
    totalPaid,
    remainingBalance: balance,
  };
}

function amortizedPayment(principal, annualRate, months) {
  if (!Number.isFinite(principal) || principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function getRemainingBalance(principal, annualRate, payment, monthsPaid) {
  let balance = principal;
  const monthlyRate = annualRate / 100 / 12;

  for (let month = 0; month < monthsPaid && balance > 0; month += 1) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.max(0, payment - interest);
    balance = Math.max(0, balance - principalPaid);
  }

  return balance;
}

function futureValueSeries(annualContribution, annualRate, years) {
  if (annualRate === 0) return annualContribution * years;
  const rate = annualRate / 100;
  return annualContribution * ((Math.pow(1 + rate, years) - 1) / rate);
}

function monthlySalaryWithGrowth(annualSalary, annualGrowth, monthNumber) {
  const yearIndex = Math.floor((monthNumber - 1) / 12);
  return (annualSalary * Math.pow(1 + annualGrowth / 100, yearIndex)) / 12;
}

function sumGrowingAnnualCost(startAnnualCost, annualGrowthRate, years) {
  let total = 0;
  for (let year = 0; year < years; year += 1) {
    total += startAnnualCost * Math.pow(1 + annualGrowthRate / 100, year);
  }
  return total;
}

function estimateFederalRate(income, filingStatus) {
  if (filingStatus === "married") {
    if (income < 50000) return 0.08;
    if (income < 110000) return 0.13;
    if (income < 220000) return 0.19;
    return 0.24;
  }

  if (income < 30000) return 0.09;
  if (income < 70000) return 0.14;
  if (income < 120000) return 0.2;
  if (income < 220000) return 0.24;
  return 0.3;
}

function getStateProfile(state) {
  return STATE_PROFILES[state] || DEFAULT_STATE_PROFILE;
}

function moneyField(name, label, step = 100) {
  return { name, label, type: "currency", min: 0, step, prefix: "$" };
}

function numberField(name, label, min = 0, max = 100, step = 1) {
  return { name, label, type: "number", min, max, step };
}

function percentField(name, label, min = 0, max = 100, step = 1) {
  return { name, label, type: "percent", min, max, step, suffix: "%" };
}

function selectField(name, label, options) {
  return { name, label, type: "select", options };
}

function currencyField() {
  return { name: "currency", label: "Currency", type: "select", options: CURRENCIES };
}

function card(label, value) {
  return { label, value };
}

function note(label, value) {
  return { label, value };
}

function moneyBar(label, value, currency, digits = 0) {
  return { label, value, displayValue: moneyText(value, currency, digits) };
}

function plainBar(label, value, displayValue) {
  return { label, value, displayValue };
}

function moneyText(value, currency = "USD", digits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}

function signedMoneyText(value, currency = "USD", digits = 0) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const sign = safeValue >= 0 ? "+" : "-";
  return `${sign}${moneyText(Math.abs(safeValue), currency, digits)}`;
}

function percentText(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${safeValue.toFixed(Math.abs(safeValue) >= 100 ? 0 : 1).replace(/\.0$/, "")}%`;
}

function count(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(Number.isFinite(value) ? value : 0));
}

function fixed(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return Number.isInteger(safeValue) ? String(safeValue) : safeValue.toFixed(1).replace(/\.0$/, "");
}

function plain(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.abs(value) < 100 ? 2 : 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function labelForOption(value, options) {
  return options.find((option) => option.value === value)?.label || String(value || "");
}
