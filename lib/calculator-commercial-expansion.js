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

const DISTANCE_UNIT_OPTIONS = [
  { value: "mile", label: "Miles" },
  { value: "km", label: "Kilometers" },
];

const FUEL_ECONOMY_UNIT_OPTIONS = [
  { value: "mpg", label: "MPG" },
  { value: "l-per-100km", label: "L / 100 km" },
];

export const COMMERCIAL_CALCULATOR_CONFIGS = {
  "commute-cost-calculator": makeCommuteCostConfig(),
  "absence-percentage-calculator": makePercentMetricConfig({
    title: "Absence Percentage Calculator",
    actionLabel: "Calculate absence rate",
    emptyState: "Estimate the share of scheduled work time that was missed.",
    summaryLabel: "Absence rate",
    partName: "daysMissed",
    partLabel: "Days missed",
    totalName: "scheduledDays",
    totalLabel: "Scheduled workdays",
    defaultPart: 3,
    defaultTotal: 22,
    badge: "HR",
    categorySlug: "salary-data",
    aliases: ["absence rate calculator", "employee absence percentage"],
  }),
  "attrition-rate-calculator": makePercentMetricConfig({
    title: "Attrition Rate Calculator",
    actionLabel: "Calculate attrition rate",
    emptyState: "Estimate the percentage of employees who left during the period.",
    summaryLabel: "Attrition rate",
    partName: "employeesLeft",
    partLabel: "Employees who left",
    totalName: "startingEmployees",
    totalLabel: "Starting employees",
    defaultPart: 6,
    defaultTotal: 120,
    badge: "HR",
    categorySlug: "finance",
    aliases: ["employee attrition rate", "staff attrition calculator"],
  }),
  "bounce-rate-calculator": makePercentMetricConfig({
    title: "Bounce Rate Calculator",
    actionLabel: "Calculate bounce rate",
    emptyState: "Estimate the share of sessions that left after a single page view.",
    summaryLabel: "Bounce rate",
    partName: "singlePageSessions",
    partLabel: "Single-page sessions",
    totalName: "totalSessions",
    totalLabel: "Total sessions",
    defaultPart: 1320,
    defaultTotal: 4800,
    badge: "Marketing",
    categorySlug: "finance",
    aliases: ["website bounce rate calculator"],
  }),
  "burn-rate-calculator": makeBurnRateConfig(),
  "business-budget-calculator": makeBusinessBudgetConfig(),
  "business-loan-calculator": makeBusinessLoanConfig(),
  "churn-rate-calculator": makePercentMetricConfig({
    title: "Churn Rate Calculator",
    actionLabel: "Calculate churn rate",
    emptyState: "Estimate the percentage of customers or subscriptions lost in a period.",
    summaryLabel: "Churn rate",
    partName: "customersLost",
    partLabel: "Customers lost",
    totalName: "startingCustomers",
    totalLabel: "Starting customers",
    defaultPart: 42,
    defaultTotal: 1250,
    badge: "SaaS",
    categorySlug: "finance",
    aliases: ["customer churn calculator", "subscription churn rate"],
  }),
  "conversion-rate-calculator": makePercentMetricConfig({
    title: "Conversion Rate Calculator",
    actionLabel: "Calculate conversion rate",
    emptyState: "Estimate the percentage of visits that turned into conversions.",
    summaryLabel: "Conversion rate",
    partName: "conversions",
    partLabel: "Conversions",
    totalName: "visitors",
    totalLabel: "Visitors or clicks",
    defaultPart: 186,
    defaultTotal: 4200,
    badge: "Marketing",
    categorySlug: "finance",
    aliases: ["website conversion rate calculator"],
  }),
  "contribution-margin-calculator": makeContributionMarginConfig(),
  "cost-of-goods-sold-calculator": makeCogsConfig(),
  "cpa-calculator": makePerUnitMoneyConfig({
    title: "CPA Calculator",
    actionLabel: "Calculate CPA",
    emptyState: "Estimate the average ad spend required for each acquisition.",
    summaryLabel: "Cost per acquisition",
    numeratorName: "adSpend",
    numeratorLabel: "Ad spend",
    denominatorName: "acquisitions",
    denominatorLabel: "Acquisitions",
    defaultNumerator: 6200,
    defaultDenominator: 124,
    resultLabel: "Cost per acquisition",
    badge: "Marketing",
    categorySlug: "finance",
    aliases: ["cost per acquisition calculator", "cpa cost calculator"],
  }),
  "cpc-calculator": makePerUnitMoneyConfig({
    title: "CPC Calculator",
    actionLabel: "Calculate CPC",
    emptyState: "Estimate the average ad cost paid for each click.",
    summaryLabel: "Cost per click",
    numeratorName: "adSpend",
    numeratorLabel: "Ad spend",
    denominatorName: "clicks",
    denominatorLabel: "Clicks",
    defaultNumerator: 1450,
    defaultDenominator: 2300,
    resultLabel: "Cost per click",
    badge: "Marketing",
    categorySlug: "finance",
    aliases: ["cost per click calculator"],
  }),
  "cpm-calculator": makeCpmConfig(),
  "ctr-calculator": makePercentMetricConfig({
    title: "CTR Calculator",
    actionLabel: "Calculate CTR",
    emptyState: "Estimate the percentage of impressions that turned into clicks.",
    summaryLabel: "Click-through rate",
    partName: "clicks",
    partLabel: "Clicks",
    totalName: "impressions",
    totalLabel: "Impressions",
    defaultPart: 1480,
    defaultTotal: 92000,
    badge: "Ads",
    categorySlug: "finance",
    aliases: ["click-through rate calculator"],
  }),
  "customer-acquisition-cost-calculator": makePerUnitMoneyConfig({
    title: "Customer Acquisition Cost Calculator",
    actionLabel: "Calculate CAC",
    emptyState: "Estimate the average sales and marketing spend required for each new customer.",
    summaryLabel: "Customer acquisition cost",
    numeratorName: "salesAndMarketingSpend",
    numeratorLabel: "Sales and marketing spend",
    denominatorName: "newCustomers",
    denominatorLabel: "New customers",
    defaultNumerator: 24000,
    defaultDenominator: 120,
    resultLabel: "CAC",
    badge: "SaaS",
    categorySlug: "finance",
    aliases: ["cac calculator", "customer acquisition cost cac calculator"],
  }),
  "customer-retention-rate-calculator": makeCustomerRetentionRateConfig(),
  "labor-cost-calculator": makeLaborCostConfig(),
  "payback-period-calculator": makePaybackPeriodConfig(),
  "revenue-per-employee-calculator": makePerUnitMoneyConfig({
    title: "Revenue Per Employee Calculator",
    actionLabel: "Calculate revenue per employee",
    emptyState: "Estimate how much revenue each employee supports on average.",
    summaryLabel: "Revenue per employee",
    numeratorName: "annualRevenue",
    numeratorLabel: "Annual revenue",
    denominatorName: "employees",
    denominatorLabel: "Employees",
    defaultNumerator: 4200000,
    defaultDenominator: 28,
    resultLabel: "Revenue per employee",
    badge: "Ops",
    categorySlug: "finance",
    aliases: ["revenue per employee metric"],
  }),
  "roas-calculator": makeRoasConfig(),
  "saas-lifetime-value-calculator": makeSaasLifetimeValueConfig(),
  "saas-metrics-calculator": makeSaasMetricsConfig(),
  "sell-through-rate-calculator": makePercentMetricConfig({
    title: "Sell-Through Rate Calculator",
    actionLabel: "Calculate sell-through rate",
    emptyState: "Estimate how much inventory sold relative to the amount received.",
    summaryLabel: "Sell-through rate",
    partName: "unitsSold",
    partLabel: "Units sold",
    totalName: "unitsReceived",
    totalLabel: "Units received",
    defaultPart: 420,
    defaultTotal: 560,
    badge: "Inventory",
    categorySlug: "finance",
    aliases: ["sell through calculator"],
  }),
  "website-ad-revenue-calculator": makeWebsiteAdRevenueConfig(),
  "youtube-money-calculator": makeYouTubeMoneyConfig(),
  "annualized-rate-of-return-calculator": makeAnnualizedReturnConfig(),
  "discounted-cash-flow-calculator": makeDiscountedCashFlowConfig(),
  "discount-rate-calculator": makeDiscountRateConfig(),
  "holding-period-return-calculator": makeHoldingPeriodReturnConfig(),
  "internal-rate-of-return-calculator": makeIrrConfig(),
  "npv-calculator": makeNpvConfig(),
  "present-value-calculator": makePresentValueConfig(),
  "rate-of-return-calculator": makeRateOfReturnConfig(),
  "sharpe-ratio-calculator": makeSharpeRatioConfig(),
  "dividend-yield-calculator": makeDividendYieldConfig(),
  "earnings-per-share-calculator": makeEpsConfig(),
  "enterprise-value-calculator": makeEnterpriseValueConfig(),
  "market-capitalization-calculator": makeMarketCapConfig(),
  "price-to-earnings-ratio-calculator": makePeConfig(),
  "price-to-book-ratio-calculator": makePbConfig(),
  "price-to-sales-ratio-calculator": makePsConfig(),
  "return-on-equity-calculator": makePercentReturnConfig({
    title: "Return on Equity Calculator",
    actionLabel: "Calculate ROE",
    emptyState: "Estimate how much net income is generated from average shareholder equity.",
    summaryLabel: "Return on equity",
    numeratorName: "netIncome",
    numeratorLabel: "Net income",
    denominatorName: "averageEquity",
    denominatorLabel: "Average shareholder equity",
    defaultNumerator: 640000,
    defaultDenominator: 3800000,
    badge: "Equity",
    aliases: ["roe calculator"],
  }),
  "return-on-assets-calculator": makePercentReturnConfig({
    title: "Return on Assets Calculator",
    actionLabel: "Calculate ROA",
    emptyState: "Estimate how much profit is produced from average assets.",
    summaryLabel: "Return on assets",
    numeratorName: "netIncome",
    numeratorLabel: "Net income",
    denominatorName: "averageAssets",
    denominatorLabel: "Average assets",
    defaultNumerator: 640000,
    defaultDenominator: 9200000,
    badge: "Assets",
    aliases: ["roa calculator"],
  }),
  "roic-calculator": makePercentReturnConfig({
    title: "ROIC Calculator",
    actionLabel: "Calculate ROIC",
    emptyState: "Estimate the return earned on invested capital from NOPAT and invested capital.",
    summaryLabel: "Return on invested capital",
    numeratorName: "nopat",
    numeratorLabel: "NOPAT",
    denominatorName: "investedCapital",
    denominatorLabel: "Invested capital",
    defaultNumerator: 880000,
    defaultDenominator: 6200000,
    badge: "Capital",
    aliases: ["return on invested capital calculator"],
  }),
  "wacc-calculator": makeWaccConfig(),
  "debt-service-coverage-ratio-calculator": makeDscrConfig(),
  "quick-ratio-calculator": makeQuickRatioConfig(),
  "bond-price-calculator": makeBondPriceConfig(),
  "bond-yield-calculator": makeBondYieldConfig(),
  "yield-to-maturity-calculator": makeYieldToMaturityConfig(),
  "balance-transfer-calculator": makeBalanceTransferConfig(),
  "credit-utilization-calculator": makePercentMetricConfig({
    title: "Credit Utilization Calculator",
    actionLabel: "Calculate utilization",
    emptyState: "Estimate the percentage of available revolving credit currently in use.",
    summaryLabel: "Credit utilization",
    partName: "balances",
    partLabel: "Total card balances",
    totalName: "limits",
    totalLabel: "Total credit limits",
    defaultPart: 4200,
    defaultTotal: 18000,
    badge: "Credit",
    categorySlug: "finance",
    aliases: ["credit utilization ratio calculator"],
    useMoneyLabels: true,
  }),
  "debt-snowball-calculator": makeDebtPaydownMethodConfig("Debt Snowball Calculator", "snowball"),
  "debt-avalanche-calculator": makeDebtPaydownMethodConfig("Debt Avalanche Calculator", "avalanche"),
  "fire-calculator": makeFireConfig(),
  "401k-calculator": makeFourOhOneKConfig(),
  "annuity-calculator": makeAnnuityConfig(),
  "auto-loan-calculator": makeAmortizedLoanConfig({
    title: "Auto Loan Calculator",
    actionLabel: "Calculate auto loan",
    emptyState: "Estimate monthly payment, total interest, and payoff time for a car loan.",
    summaryLabel: "Auto loan estimate",
    defaultHistoryLabel: "Auto loan scenario",
    categorySlug: "finance",
    badge: "Auto",
    aliases: ["car loan calculator"],
    defaults: { principal: 32000, annualRate: 6.9, years: 5, extraPayment: 0, currency: "USD" },
    resultTitle: "Auto loan result",
  }),
  "retirement-withdrawal-calculator": makeRetirementWithdrawalConfig(),
  "rule-of-72-calculator": makeRuleOf72Config(),
  "emergency-fund-calculator": makeEmergencyFundConfig(),
  "home-affordability-calculator": makeHomeAffordabilityConfig(),
  "ira-calculator": makeIraConfig(),
  "debt-to-income-ratio-calculator": makeDebtToIncomeConfig(),
  "mortgage-amortization-calculator": makeAmortizedLoanConfig({
    title: "Mortgage Amortization Calculator",
    actionLabel: "Calculate mortgage amortization",
    emptyState: "Estimate monthly payment, total interest, and payoff checkpoints for a mortgage.",
    summaryLabel: "Mortgage amortization estimate",
    defaultHistoryLabel: "Mortgage amortization scenario",
    categorySlug: "mortgage-data",
    badge: "Mortgage",
    aliases: ["home loan amortization calculator"],
    defaults: { principal: 360000, annualRate: 6.5, years: 30, extraPayment: 0, currency: "USD" },
    resultTitle: "Mortgage amortization result",
  }),
  "mortgage-comparison-calculator": makeMortgageComparisonConfig(),
  "mortgage-payoff-calculator": makeMortgagePayoffConfig(),
  "mortgage-refinance-calculator": makeMortgageRefinanceConfig(),
  "paypal-fee-calculator": makePaypalFeeConfig(),
  "personal-loan-calculator": makeAmortizedLoanConfig({
    title: "Personal Loan Calculator",
    actionLabel: "Calculate personal loan",
    emptyState: "Estimate monthly payment, total interest, and payoff time for a personal loan.",
    summaryLabel: "Personal loan estimate",
    defaultHistoryLabel: "Personal loan scenario",
    categorySlug: "finance",
    badge: "Loan",
    aliases: ["unsecured personal loan calculator"],
    defaults: { principal: 18000, annualRate: 11.8, years: 4, extraPayment: 0, currency: "USD" },
    resultTitle: "Personal loan result",
  }),
  "pmi-calculator": makePmiConfig(),
  "rental-property-calculator": makeRentalPropertyConfig(),
  "gross-margin-calculator": makePercentReturnConfig({
    title: "Gross Margin Calculator",
    actionLabel: "Calculate gross margin",
    emptyState: "Estimate the percentage of revenue left after direct costs.",
    summaryLabel: "Gross margin",
    numeratorName: "grossProfit",
    numeratorLabel: "Gross profit",
    denominatorName: "revenue",
    denominatorLabel: "Revenue",
    defaultNumerator: 420000,
    defaultDenominator: 980000,
    badge: "Margin",
    aliases: ["gross profit margin calculator"],
  }),
  "inventory-turnover-calculator": makeInventoryTurnoverConfig(),
  "working-capital-calculator": makeWorkingCapitalConfig(),
  "revenue-growth-calculator": makeRevenueGrowthConfig(),
  "revenue-calculator": makeRevenueConfig(),
  "operating-margin-calculator": makePercentReturnConfig({
    title: "Operating Margin Calculator",
    actionLabel: "Calculate operating margin",
    emptyState: "Estimate the share of revenue left after operating costs.",
    summaryLabel: "Operating margin",
    numeratorName: "operatingIncome",
    numeratorLabel: "Operating income",
    denominatorName: "revenue",
    denominatorLabel: "Revenue",
    defaultNumerator: 220000,
    defaultDenominator: 980000,
    badge: "Margin",
  }),
  "net-profit-margin-calculator": makePercentReturnConfig({
    title: "Net Profit Margin Calculator",
    actionLabel: "Calculate net profit margin",
    emptyState: "Estimate the share of revenue that remains as net profit.",
    summaryLabel: "Net profit margin",
    numeratorName: "netProfit",
    numeratorLabel: "Net profit",
    denominatorName: "revenue",
    denominatorLabel: "Revenue",
    defaultNumerator: 164000,
    defaultDenominator: 980000,
    badge: "Margin",
  }),
  "annual-income-calculator": makeAnnualIncomeConfig(),
  "billable-hours-calculator": makeBillableHoursConfig(),
  "concrete-slab-calculator": makeConcreteSlabConfig(),
  "mileage-reimbursement-calculator": makeMileageReimbursementConfig(),
  "paint-coverage-calculator": makePaintCoverageConfig(),
  "prorated-salary-calculator": makeProratedSalaryConfig(),
  "50-30-20-rule-calculator": makeFiftyThirtyTwentyConfig(),
};

function makeCommuteCostConfig() {
  return {
    title: "Commute Cost Calculator",
    actionLabel: "Calculate commute cost",
    emptyState: "Estimate monthly commute cost by car, carpool, and public transport from one clean view.",
    summaryLabel: "Commute estimate",
    defaultHistoryLabel: "Commute cost scenario",
    categorySlug: "cost-of-living",
    badge: "Commute",
    surfaceStyle: "commuteStack",
    theme: {
      primary: "#4f67d8",
      strong: "#223588",
      soft: "rgba(79, 103, 216, 0.14)",
      surface: "rgba(235, 240, 255, 0.96)",
      edge: "rgba(79, 103, 216, 0.2)",
      glow: "rgba(79, 103, 216, 0.18)",
      ink: "#223588",
    },
    heroStats: [
      { label: "Compares", value: "Car + transit" },
      { label: "Includes", value: "Fuel + parking" },
      { label: "Useful for", value: "Monthly planning" },
    ],
    featureCards: [
      { title: "Car vs public transport", body: "See both options side by side before you lock in the monthly routine." },
      { title: "Carpool-friendly", body: "Split the driving cost by the number of people sharing the ride." },
      { title: "Live monthly view", body: "Translate daily commute assumptions into monthly cost fast." },
    ],
    useCases: [
      "estimating how much the work commute really costs each month",
      "comparing solo driving, carpooling, and public transport before changing routine",
      "budgeting fuel, parking, tolls, and transit passes in one place",
    ],
    faq: [
      {
        question: "Does the calculator handle both miles and kilometers?",
        answer: "Yes. You can switch both the trip distance unit and the fuel economy unit inside the input sections.",
      },
      {
        question: "How is public transport cost estimated?",
        answer: "The calculator multiplies ticket price by the number of ticket periods needed to cover your commuting days each month.",
      },
      {
        question: "What does cost per person mean?",
        answer: "It is the monthly driving cost divided by the number of people sharing the ride.",
      },
    ],
    aliases: ["driving cost calculator", "commute calculator", "carpool calculator", "public transport cost calculator"],
    defaults: {
      oneWayDistance: 12,
      distanceUnit: "mile",
      commuteDaysPerMonth: 22,
      rideShareCount: 1,
      fuelEconomy: 28,
      fuelEconomyUnit: "mpg",
      fuelPrice: 3.9,
      parkingAndTolls: 120,
      wearAndTear: 85,
      transitTicketPrice: 5.5,
      transitValidityDays: 1,
      currency: "USD",
    },
    mainFields: [
      numberField("oneWayDistance", "One-way distance to workplace", 0.1, 500, 0.1),
      { name: "distanceUnit", label: "Distance unit", type: "select", options: DISTANCE_UNIT_OPTIONS },
      numberField("commuteDaysPerMonth", "I commute", 1, 31, 1, "times / mo"),
      numberField("rideShareCount", "People sharing a ride", 1, 8, 1),
      numberField("fuelEconomy", "Fuel economy", 0.1, 250, 0.1),
      { name: "fuelEconomyUnit", label: "Fuel economy unit", type: "select", options: FUEL_ECONOMY_UNIT_OPTIONS },
      moneyField("fuelPrice", "Fuel price", 0.01),
      moneyField("parkingAndTolls", "Parking and toll costs", 1, "/ mo"),
      moneyField("wearAndTear", "Wear and tear costs", 1, "/ mo"),
      moneyField("transitTicketPrice", "Ticket price", 0.01),
      numberField("transitValidityDays", "Ticket is valid for", 1, 31, 1, "days"),
    ],
    advancedFields: [currencyField()],
    fieldGroups: [
      { title: "Your way to work", fields: ["oneWayDistance", "distanceUnit", "commuteDaysPerMonth"] },
      { title: "Commuting by car", fields: ["rideShareCount", "fuelEconomy", "fuelEconomyUnit", "fuelPrice", "parkingAndTolls", "wearAndTear"] },
      { title: "Commuting by public transport", fields: ["transitTicketPrice", "transitValidityDays", "currency"] },
    ],
    validate(values) {
      if (values.oneWayDistance <= 0) return "Enter a one-way commute distance.";
      if (values.commuteDaysPerMonth <= 0) return "Enter the number of commuting days each month.";
      if (values.rideShareCount <= 0) return "People sharing the ride must be at least 1.";
      if (values.fuelEconomy <= 0) return "Enter a fuel economy value greater than zero.";
      if (values.transitValidityDays <= 0) return "Ticket validity must be at least 1 day.";
      return "";
    },
    compute(values) {
      const oneWayKm = values.distanceUnit === "km" ? values.oneWayDistance : values.oneWayDistance * 1.609344;
      const oneWayMiles = values.distanceUnit === "mile" ? values.oneWayDistance : values.oneWayDistance / 1.609344;
      const roundTripKm = oneWayKm * 2;
      const roundTripMiles = oneWayMiles * 2;
      const fuelPerRoundTrip =
        values.fuelEconomyUnit === "l-per-100km"
          ? roundTripKm * (values.fuelEconomy / 100)
          : roundTripMiles / Math.max(values.fuelEconomy, 0.01);
      const dailyFuelCost = fuelPerRoundTrip * values.fuelPrice;
      const monthlyFuelCost = dailyFuelCost * values.commuteDaysPerMonth;
      const monthlyCarCost = monthlyFuelCost + values.parkingAndTolls + values.wearAndTear;
      const costPerPerson = monthlyCarCost / Math.max(values.rideShareCount, 1);
      const transitPassesNeeded = Math.ceil(values.commuteDaysPerMonth / Math.max(values.transitValidityDays, 1));
      const monthlyTransitCost = transitPassesNeeded * values.transitTicketPrice;
      const savingsVsDriving = monthlyCarCost - monthlyTransitCost;
      const cheaperMode = savingsVsDriving > 0 ? "Public transport is cheaper" : savingsVsDriving < 0 ? "Driving is cheaper" : "Both cost the same";

      const output = result(
        "Monthly commute cost estimate",
        [
          card("Driving cost / month", moneyText(monthlyCarCost, values.currency, 2)),
          card("Cost per person", moneyText(costPerPerson, values.currency, 2)),
          card("Public transport / month", moneyText(monthlyTransitCost, values.currency, 2)),
          card("Monthly difference", moneyText(Math.abs(savingsVsDriving), values.currency, 2)),
        ],
        [
          moneyBar("Fuel cost / month", monthlyFuelCost, values.currency, 2),
          moneyBar("Parking and tolls", values.parkingAndTolls, values.currency, 2),
          moneyBar("Wear and tear", values.wearAndTear, values.currency, 2),
          moneyBar("Driving cost / month", monthlyCarCost, values.currency, 2),
          moneyBar("Public transport / month", monthlyTransitCost, values.currency, 2),
        ],
        [
          `${cheaperMode} under the current assumptions.`,
          `${fixed(values.commuteDaysPerMonth)} commute days per month means fuel becomes ${moneyText(monthlyFuelCost, values.currency, 2)} of the total driving cost.`,
        ],
        [
          note("Distance unit", values.distanceUnit),
          note("Fuel economy unit", values.fuelEconomyUnit),
          note("Monthly ticket periods", String(transitPassesNeeded)),
        ],
        {
          customSections: {
            car: [
              { label: "Total cost", value: moneyText(monthlyCarCost, values.currency, 2) },
              { label: "Cost per person", value: moneyText(costPerPerson, values.currency, 2) },
            ],
            transit: [{ label: "Total cost", value: moneyText(monthlyTransitCost, values.currency, 2) }],
            comparison: [
              { label: "Cheaper option", value: cheaperMode },
              { label: "Monthly difference", value: moneyText(Math.abs(savingsVsDriving), values.currency, 2) },
              { label: "Yearly difference", value: moneyText(Math.abs(savingsVsDriving) * 12, values.currency, 2) },
            ],
          },
        },
      );

      return output;
    },
  };
}

function makeBurnRateConfig() {
  return {
    title: "Burn Rate Calculator",
    actionLabel: "Calculate burn rate",
    emptyState: "Estimate monthly burn and runway from cash on hand and current operating spend.",
    summaryLabel: "Burn rate estimate",
    defaultHistoryLabel: "Burn rate scenario",
    categorySlug: "finance",
    badge: "Startup",
    surfaceStyle: "ledger",
    aliases: ["startup burn rate calculator", "runway calculator"],
    defaults: { cashOnHand: 420000, monthlyRevenue: 180000, monthlyExpenses: 245000, currency: "USD" },
    mainFields: [
      moneyField("cashOnHand", "Cash on hand", 1000),
      moneyField("monthlyRevenue", "Monthly revenue", 100),
      moneyField("monthlyExpenses", "Monthly expenses", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.monthlyExpenses <= 0 ? "Enter a monthly expense number." : "";
    },
    compute(values) {
      const netBurn = Math.max(values.monthlyExpenses - values.monthlyRevenue, 0);
      const runwayMonths = netBurn > 0 ? values.cashOnHand / netBurn : Infinity;
      return result(
        "Startup burn and runway estimate",
        [
          card("Net burn / month", moneyText(netBurn, values.currency, 2)),
          card("Runway", runwayMonths === Infinity ? "Cash-flow positive" : `${fixed(runwayMonths)} months`),
          card("Monthly expenses", moneyText(values.monthlyExpenses, values.currency, 2)),
          card("Monthly revenue", moneyText(values.monthlyRevenue, values.currency, 2)),
        ],
        [
          moneyBar("Cash on hand", values.cashOnHand, values.currency, 2),
          moneyBar("Monthly revenue", values.monthlyRevenue, values.currency, 2),
          moneyBar("Monthly expenses", values.monthlyExpenses, values.currency, 2),
          moneyBar("Net burn / month", netBurn, values.currency, 2),
        ],
        [
          runwayMonths === Infinity
            ? "Monthly revenue currently covers expenses, so the business is not burning cash under the current assumptions."
            : `At the current burn rate, the business has about ${fixed(runwayMonths)} months of runway.`,
        ],
        [note("Runway status", runwayMonths === Infinity ? "Positive cash flow" : "Burning cash")],
      );
    },
  };
}

function makeBusinessBudgetConfig() {
  return {
    title: "Business Budget Calculator",
    actionLabel: "Build business budget",
    emptyState: "Estimate monthly operating profit from revenue, payroll, rent, software, marketing, and other overhead.",
    summaryLabel: "Business budget estimate",
    defaultHistoryLabel: "Business budget scenario",
    categorySlug: "finance",
    badge: "Budget",
    surfaceStyle: "ledger",
    aliases: ["startup budget calculator", "small business budget calculator"],
    defaults: {
      monthlyRevenue: 92000,
      payroll: 36000,
      rent: 6800,
      software: 2200,
      marketing: 6500,
      otherOverhead: 4800,
      currency: "USD",
    },
    mainFields: [
      moneyField("monthlyRevenue", "Monthly revenue", 100),
      moneyField("payroll", "Payroll", 100),
      moneyField("rent", "Rent or office", 50),
      moneyField("software", "Software and tooling", 50),
      moneyField("marketing", "Marketing spend", 50),
      moneyField("otherOverhead", "Other overhead", 50),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.monthlyRevenue <= 0 ? "Enter monthly revenue." : "";
    },
    compute(values) {
      const totalExpenses = values.payroll + values.rent + values.software + values.marketing + values.otherOverhead;
      const operatingProfit = values.monthlyRevenue - totalExpenses;
      const margin = (operatingProfit / Math.max(values.monthlyRevenue, 0.01)) * 100;
      return result(
        "Monthly business budget estimate",
        [
          card("Operating profit", moneyText(operatingProfit, values.currency, 2)),
          card("Expense load", moneyText(totalExpenses, values.currency, 2)),
          card("Operating margin", percentText(margin)),
          card("Revenue", moneyText(values.monthlyRevenue, values.currency, 2)),
        ],
        [
          moneyBar("Revenue", values.monthlyRevenue, values.currency, 2),
          moneyBar("Payroll", values.payroll, values.currency, 2),
          moneyBar("Rent or office", values.rent, values.currency, 2),
          moneyBar("Software and tooling", values.software, values.currency, 2),
          moneyBar("Marketing", values.marketing, values.currency, 2),
          moneyBar("Other overhead", values.otherOverhead, values.currency, 2),
          moneyBar("Operating profit", operatingProfit, values.currency, 2),
        ],
        [
          operatingProfit >= 0
            ? `The current plan leaves about ${moneyText(operatingProfit, values.currency, 2)} in monthly operating profit.`
            : `The current plan runs about ${moneyText(Math.abs(operatingProfit), values.currency, 2)} under water each month.`,
        ],
        [note("Operating margin", percentText(margin))],
      );
    },
  };
}

function makeBusinessLoanConfig() {
  return {
    title: "Business Loan Calculator",
    actionLabel: "Calculate business loan",
    emptyState: "Estimate a fixed payment, payoff time, and total interest for a business loan.",
    summaryLabel: "Business loan estimate",
    defaultHistoryLabel: "Business loan scenario",
    categorySlug: "finance",
    badge: "Loan",
    surfaceStyle: "loanSplit",
    aliases: ["small business loan calculator"],
    defaults: { principal: 120000, annualRate: 9.2, years: 5, extraPayment: 0, currency: "USD" },
    mainFields: [
      moneyField("principal", "Loan amount", 100),
      percentField("annualRate", "Interest rate", 0, 50, 0.1),
      numberField("years", "Loan term (years)", 1, 20, 1),
      moneyField("extraPayment", "Extra monthly payment", 10),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.principal <= 0 ? "Enter a business loan amount." : "";
    },
    compute(values) {
      return computeAmortizedLoanResult({
        title: "Business loan result",
        values,
        paymentLabel: "Monthly payment",
      });
    },
  };
}

function makeContributionMarginConfig() {
  return {
    title: "Contribution Margin Calculator",
    actionLabel: "Calculate contribution margin",
    emptyState: "Estimate per-unit contribution margin and total contribution from price, variable cost, and units sold.",
    summaryLabel: "Contribution margin",
    defaultHistoryLabel: "Contribution margin scenario",
    categorySlug: "finance",
    badge: "Unit economics",
    surfaceStyle: "ledger",
    defaults: { sellingPricePerUnit: 48, variableCostPerUnit: 19, unitsSold: 1800, currency: "USD" },
    mainFields: [
      moneyField("sellingPricePerUnit", "Selling price per unit", 0.01),
      moneyField("variableCostPerUnit", "Variable cost per unit", 0.01),
      numberField("unitsSold", "Units sold", 1, 1000000, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.sellingPricePerUnit <= 0) return "Enter a selling price.";
      return values.unitsSold <= 0 ? "Enter units sold." : "";
    },
    compute(values) {
      const contributionPerUnit = values.sellingPricePerUnit - values.variableCostPerUnit;
      const totalContribution = contributionPerUnit * values.unitsSold;
      const ratio = (contributionPerUnit / Math.max(values.sellingPricePerUnit, 0.01)) * 100;
      return result(
        "Contribution margin estimate",
        [
          card("Contribution / unit", moneyText(contributionPerUnit, values.currency, 2)),
          card("Contribution margin", percentText(ratio)),
          card("Total contribution", moneyText(totalContribution, values.currency, 2)),
          card("Units sold", count(values.unitsSold)),
        ],
        [
          moneyBar("Selling price / unit", values.sellingPricePerUnit, values.currency, 2),
          moneyBar("Variable cost / unit", values.variableCostPerUnit, values.currency, 2),
          moneyBar("Contribution / unit", contributionPerUnit, values.currency, 2),
          moneyBar("Total contribution", totalContribution, values.currency, 2),
        ],
        [
          `Each sale contributes about ${moneyText(contributionPerUnit, values.currency, 2)} toward fixed costs and profit.`,
        ],
        [note("Contribution margin", percentText(ratio))],
      );
    },
  };
}

function makeCogsConfig() {
  return {
    title: "Cost of Goods Sold Calculator",
    actionLabel: "Calculate COGS",
    emptyState: "Estimate cost of goods sold from beginning inventory, purchases, and ending inventory.",
    summaryLabel: "COGS estimate",
    defaultHistoryLabel: "COGS scenario",
    categorySlug: "finance",
    badge: "Inventory",
    surfaceStyle: "ledger",
    aliases: ["cogs calculator"],
    defaults: { beginningInventory: 85000, purchases: 192000, endingInventory: 64000, currency: "USD" },
    mainFields: [
      moneyField("beginningInventory", "Beginning inventory", 100),
      moneyField("purchases", "Purchases during period", 100),
      moneyField("endingInventory", "Ending inventory", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return "";
    },
    compute(values) {
      const cogs = values.beginningInventory + values.purchases - values.endingInventory;
      return result(
        "Cost of goods sold estimate",
        [
          card("COGS", moneyText(cogs, values.currency, 2)),
          card("Beginning inventory", moneyText(values.beginningInventory, values.currency, 2)),
          card("Purchases", moneyText(values.purchases, values.currency, 2)),
          card("Ending inventory", moneyText(values.endingInventory, values.currency, 2)),
        ],
        [
          moneyBar("Beginning inventory", values.beginningInventory, values.currency, 2),
          moneyBar("Purchases", values.purchases, values.currency, 2),
          moneyBar("Ending inventory", values.endingInventory, values.currency, 2),
          moneyBar("COGS", cogs, values.currency, 2),
        ],
        [
          "COGS equals beginning inventory plus purchases minus ending inventory for the period.",
        ],
        [],
      );
    },
  };
}

function makePerUnitMoneyConfig({
  title,
  actionLabel,
  emptyState,
  summaryLabel,
  numeratorName,
  numeratorLabel,
  denominatorName,
  denominatorLabel,
  defaultNumerator,
  defaultDenominator,
  resultLabel,
  badge = "Metric",
  categorySlug = "finance",
  aliases = [],
}) {
  return {
    title,
    actionLabel,
    emptyState,
    summaryLabel,
    defaultHistoryLabel: `${title} scenario`,
    categorySlug,
    badge,
    surfaceStyle: "ledger",
    aliases,
    defaults: { [numeratorName]: defaultNumerator, [denominatorName]: defaultDenominator, currency: "USD" },
    mainFields: [
      moneyField(numeratorName, numeratorLabel, 0.01),
      numberField(denominatorName, denominatorLabel, 1, 1000000000, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values[denominatorName] <= 0 ? `${denominatorLabel} must be greater than zero.` : "";
    },
    compute(values) {
      const perUnit = values[numeratorName] / Math.max(values[denominatorName], 1);
      return result(
        `${title} result`,
        [
          card(resultLabel, moneyText(perUnit, values.currency, 2)),
          card(numeratorLabel, moneyText(values[numeratorName], values.currency, 2)),
          card(denominatorLabel, count(values[denominatorName])),
        ],
        [
          moneyBar(numeratorLabel, values[numeratorName], values.currency, 2),
          plainBar(denominatorLabel, values[denominatorName], count(values[denominatorName])),
          moneyBar(resultLabel, perUnit, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeCpmConfig() {
  return {
    title: "CPM Calculator",
    actionLabel: "Calculate CPM",
    emptyState: "Estimate advertising cost per thousand impressions from spend and total impressions.",
    summaryLabel: "CPM estimate",
    defaultHistoryLabel: "CPM scenario",
    categorySlug: "finance",
    badge: "Ads",
    surfaceStyle: "ledger",
    aliases: ["cost per mille calculator"],
    defaults: { adSpend: 2800, impressions: 360000, currency: "USD" },
    mainFields: [
      moneyField("adSpend", "Ad spend", 0.01),
      numberField("impressions", "Impressions", 1, 1000000000, 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.impressions <= 0 ? "Impressions must be greater than zero." : "";
    },
    compute(values) {
      const cpm = values.adSpend / Math.max(values.impressions, 1) * 1000;
      return result(
        "CPM estimate",
        [
          card("CPM", moneyText(cpm, values.currency, 2)),
          card("Ad spend", moneyText(values.adSpend, values.currency, 2)),
          card("Impressions", count(values.impressions)),
        ],
        [
          moneyBar("Ad spend", values.adSpend, values.currency, 2),
          plainBar("Impressions", values.impressions, count(values.impressions)),
          moneyBar("CPM", cpm, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makePercentMetricConfig({
  title,
  actionLabel,
  emptyState,
  summaryLabel,
  partName,
  partLabel,
  totalName,
  totalLabel,
  defaultPart,
  defaultTotal,
  badge = "Metric",
  categorySlug = "finance",
  aliases = [],
  useMoneyLabels = false,
}) {
  return {
    title,
    actionLabel,
    emptyState,
    summaryLabel,
    defaultHistoryLabel: `${title} scenario`,
    categorySlug,
    badge,
    surfaceStyle: "ledger",
    aliases,
    defaults: { [partName]: defaultPart, [totalName]: defaultTotal, currency: "USD" },
    mainFields: [
      useMoneyLabels ? moneyField(partName, partLabel, 1) : numberField(partName, partLabel, 0, 1000000000, 1),
      useMoneyLabels ? moneyField(totalName, totalLabel, 1) : numberField(totalName, totalLabel, 1, 1000000000, 1),
    ],
    advancedFields: useMoneyLabels ? [currencyField()] : [],
    validate(values) {
      if (values[totalName] <= 0) return `${totalLabel} must be greater than zero.`;
      if (values[partName] < 0) return `${partLabel} cannot be negative.`;
      return "";
    },
    compute(values) {
      const ratio = (values[partName] / Math.max(values[totalName], 1)) * 100;
      const remainder = Math.max(values[totalName] - values[partName], 0);
      return result(
        `${title} result`,
        [
          card(summaryLabel, percentText(ratio)),
          card(partLabel, useMoneyLabels ? moneyText(values[partName], values.currency, 2) : count(values[partName])),
          card(totalLabel, useMoneyLabels ? moneyText(values[totalName], values.currency, 2) : count(values[totalName])),
        ],
        [
          useMoneyLabels
            ? moneyBar(partLabel, values[partName], values.currency, 2)
            : plainBar(partLabel, values[partName], count(values[partName])),
          useMoneyLabels
            ? moneyBar(totalLabel, values[totalName], values.currency, 2)
            : plainBar(totalLabel, values[totalName], count(values[totalName])),
          useMoneyLabels ? moneyBar("Remaining", remainder, values.currency, 2) : plainBar("Remaining", remainder, count(remainder)),
        ],
        [],
        [note("Metric rate", percentText(ratio))],
      );
    },
  };
}

function makeCustomerRetentionRateConfig() {
  return {
    title: "Customer Retention Rate Calculator",
    actionLabel: "Calculate retention rate",
    emptyState: "Estimate the share of starting customers retained after excluding new customer additions.",
    summaryLabel: "Customer retention rate",
    defaultHistoryLabel: "Customer retention scenario",
    categorySlug: "finance",
    badge: "SaaS",
    surfaceStyle: "ledger",
    aliases: ["retention rate calculator", "customer retention calculator"],
    defaults: { startingCustomers: 1250, endingCustomers: 1360, newCustomers: 210 },
    mainFields: [
      numberField("startingCustomers", "Starting customers", 1, 1000000000, 1),
      numberField("endingCustomers", "Ending customers", 0, 1000000000, 1),
      numberField("newCustomers", "New customers added", 0, 1000000000, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.startingCustomers <= 0 ? "Enter starting customers." : "";
    },
    compute(values) {
      const retainedCustomers = Math.max(values.endingCustomers - values.newCustomers, 0);
      const retentionRate = (retainedCustomers / Math.max(values.startingCustomers, 1)) * 100;
      return result(
        "Customer retention estimate",
        [
          card("Retention rate", percentText(retentionRate)),
          card("Retained customers", count(retainedCustomers)),
          card("Starting customers", count(values.startingCustomers)),
          card("New customers", count(values.newCustomers)),
        ],
        [
          plainBar("Starting customers", values.startingCustomers, count(values.startingCustomers)),
          plainBar("Ending customers", values.endingCustomers, count(values.endingCustomers)),
          plainBar("New customers", values.newCustomers, count(values.newCustomers)),
          plainBar("Retained customers", retainedCustomers, count(retainedCustomers)),
        ],
        [
          "Retention is calculated as (ending customers - new customers) / starting customers.",
        ],
        [],
      );
    },
  };
}

function makeLaborCostConfig() {
  return {
    title: "Labor Cost Calculator",
    actionLabel: "Calculate labor cost",
    emptyState: "Estimate fully-loaded labor cost from hourly rate, hours worked, and burden percentage.",
    summaryLabel: "Labor cost estimate",
    defaultHistoryLabel: "Labor cost scenario",
    categorySlug: "finance",
    badge: "Ops",
    surfaceStyle: "ledger",
    defaults: { hourlyRate: 32, hoursWorked: 160, laborBurdenPercent: 18, currency: "USD" },
    mainFields: [
      moneyField("hourlyRate", "Hourly rate", 0.01),
      numberField("hoursWorked", "Hours worked", 1, 100000, 1),
      percentField("laborBurdenPercent", "Labor burden", 0, 100, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.hoursWorked <= 0 ? "Enter hours worked." : "";
    },
    compute(values) {
      const baseCost = values.hourlyRate * values.hoursWorked;
      const burden = baseCost * (values.laborBurdenPercent / 100);
      const total = baseCost + burden;
      return result(
        "Labor cost estimate",
        [
          card("Total labor cost", moneyText(total, values.currency, 2)),
          card("Base wages", moneyText(baseCost, values.currency, 2)),
          card("Labor burden", moneyText(burden, values.currency, 2)),
          card("Loaded hourly cost", moneyText(total / Math.max(values.hoursWorked, 1), values.currency, 2)),
        ],
        [
          moneyBar("Base wages", baseCost, values.currency, 2),
          moneyBar("Labor burden", burden, values.currency, 2),
          moneyBar("Total labor cost", total, values.currency, 2),
        ],
        [],
        [note("Hours worked", count(values.hoursWorked))],
      );
    },
  };
}

function makePaybackPeriodConfig() {
  return {
    title: "Payback Period Calculator",
    actionLabel: "Calculate payback period",
    emptyState: "Estimate how long it takes for annual cash flow to recover an upfront investment.",
    summaryLabel: "Payback period",
    defaultHistoryLabel: "Payback period scenario",
    categorySlug: "finance",
    badge: "Capital",
    surfaceStyle: "investment",
    defaults: { initialInvestment: 120000, annualCashFlow: 38000, currency: "USD" },
    mainFields: [
      moneyField("initialInvestment", "Initial investment", 100),
      moneyField("annualCashFlow", "Annual cash flow", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.annualCashFlow <= 0 ? "Annual cash flow must be greater than zero." : "";
    },
    compute(values) {
      const years = values.initialInvestment / Math.max(values.annualCashFlow, 1);
      return result(
        "Payback period estimate",
        [
          card("Payback period", `${fixed(years)} years`),
          card("Initial investment", moneyText(values.initialInvestment, values.currency, 2)),
          card("Annual cash flow", moneyText(values.annualCashFlow, values.currency, 2)),
        ],
        [
          moneyBar("Initial investment", values.initialInvestment, values.currency, 2),
          moneyBar("Annual cash flow", values.annualCashFlow, values.currency, 2),
        ],
        [],
        [note("Simple payback", `${fixed(years)} years`)],
      );
    },
  };
}

function makeRoasConfig() {
  return {
    title: "ROAS Calculator",
    actionLabel: "Calculate ROAS",
    emptyState: "Estimate return on ad spend from attributed revenue and ad spend.",
    summaryLabel: "ROAS estimate",
    defaultHistoryLabel: "ROAS scenario",
    categorySlug: "finance",
    badge: "Marketing",
    surfaceStyle: "ledger",
    aliases: ["return on ad spend calculator"],
    defaults: { attributedRevenue: 18200, adSpend: 4200, currency: "USD" },
    mainFields: [
      moneyField("attributedRevenue", "Attributed revenue", 1),
      moneyField("adSpend", "Ad spend", 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.adSpend <= 0 ? "Ad spend must be greater than zero." : "";
    },
    compute(values) {
      const roas = values.attributedRevenue / Math.max(values.adSpend, 1);
      return result(
        "ROAS estimate",
        [
          card("ROAS", `${fixed(roas)}x`),
          card("Attributed revenue", moneyText(values.attributedRevenue, values.currency, 2)),
          card("Ad spend", moneyText(values.adSpend, values.currency, 2)),
          card("Gross profit on ads", moneyText(values.attributedRevenue - values.adSpend, values.currency, 2)),
        ],
        [
          moneyBar("Attributed revenue", values.attributedRevenue, values.currency, 2),
          moneyBar("Ad spend", values.adSpend, values.currency, 2),
          moneyBar("Gross profit on ads", values.attributedRevenue - values.adSpend, values.currency, 2),
        ],
        [],
        [note("ROAS", `${fixed(roas)}x`)],
      );
    },
  };
}

function makeSaasLifetimeValueConfig() {
  return {
    title: "SaaS Lifetime Value Calculator",
    actionLabel: "Calculate SaaS LTV",
    emptyState: "Estimate customer lifetime value from ARPA, gross margin, and churn.",
    summaryLabel: "SaaS LTV estimate",
    defaultHistoryLabel: "SaaS LTV scenario",
    categorySlug: "finance",
    badge: "SaaS",
    surfaceStyle: "investment",
    aliases: ["ltv calculator", "subscription ltv calculator"],
    defaults: { arpa: 240, grossMarginPercent: 82, monthlyChurnPercent: 3.4, currency: "USD" },
    mainFields: [
      moneyField("arpa", "Average revenue per account", 0.01),
      percentField("grossMarginPercent", "Gross margin", 0, 100, 0.1),
      percentField("monthlyChurnPercent", "Monthly churn", 0.1, 100, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.monthlyChurnPercent <= 0 ? "Monthly churn must be greater than zero." : "";
    },
    compute(values) {
      const grossMarginDecimal = values.grossMarginPercent / 100;
      const churnDecimal = values.monthlyChurnPercent / 100;
      const ltv = (values.arpa * grossMarginDecimal) / Math.max(churnDecimal, 0.0001);
      return result(
        "SaaS lifetime value estimate",
        [
          card("LTV", moneyText(ltv, values.currency, 2)),
          card("ARPA", moneyText(values.arpa, values.currency, 2)),
          card("Gross margin", percentText(values.grossMarginPercent)),
          card("Monthly churn", percentText(values.monthlyChurnPercent)),
        ],
        [
          moneyBar("ARPA", values.arpa, values.currency, 2),
          plainBar("Gross margin", values.grossMarginPercent, percentText(values.grossMarginPercent)),
          plainBar("Monthly churn", values.monthlyChurnPercent, percentText(values.monthlyChurnPercent)),
          moneyBar("LTV", ltv, values.currency, 2),
        ],
        [
          "This simple model uses ARPA x gross margin / monthly churn to estimate customer lifetime value.",
        ],
        [],
      );
    },
  };
}

function makeSaasMetricsConfig() {
  return {
    title: "SaaS Metrics Calculator",
    actionLabel: "Calculate SaaS metrics",
    emptyState: "Estimate ARR, MRR churn, CAC payback, and LTV/CAC from a simple SaaS operating snapshot.",
    summaryLabel: "SaaS metrics",
    defaultHistoryLabel: "SaaS metrics scenario",
    categorySlug: "finance",
    badge: "SaaS",
    surfaceStyle: "investment",
    defaults: {
      mrr: 148000,
      monthlyGrowthPercent: 6,
      monthlyChurnPercent: 2.8,
      cac: 1100,
      arpa: 240,
      grossMarginPercent: 82,
      currency: "USD",
    },
    mainFields: [
      moneyField("mrr", "Current MRR", 100),
      percentField("monthlyGrowthPercent", "Monthly growth", -100, 200, 0.1),
      percentField("monthlyChurnPercent", "Monthly churn", 0, 100, 0.1),
      moneyField("cac", "CAC", 1),
      moneyField("arpa", "ARPA", 0.01),
      percentField("grossMarginPercent", "Gross margin", 0, 100, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.arpa <= 0) return "Enter ARPA.";
      return values.cac <= 0 ? "Enter CAC." : "";
    },
    compute(values) {
      const arr = values.mrr * 12;
      const churnedMrr = values.mrr * (values.monthlyChurnPercent / 100);
      const grossProfitPerAccount = values.arpa * (values.grossMarginPercent / 100);
      const cacPaybackMonths = values.cac / Math.max(grossProfitPerAccount, 0.01);
      const ltv = values.monthlyChurnPercent > 0 ? grossProfitPerAccount / (values.monthlyChurnPercent / 100) : 0;
      const ltvToCac = ltv / Math.max(values.cac, 0.01);
      return result(
        "SaaS metrics snapshot",
        [
          card("ARR", moneyText(arr, values.currency, 2)),
          card("MRR churned", moneyText(churnedMrr, values.currency, 2)),
          card("CAC payback", `${fixed(cacPaybackMonths)} months`),
          card("LTV / CAC", `${fixed(ltvToCac)}x`),
        ],
        [
          moneyBar("MRR", values.mrr, values.currency, 2),
          moneyBar("ARR", arr, values.currency, 2),
          moneyBar("MRR churned", churnedMrr, values.currency, 2),
          moneyBar("Gross profit / account", grossProfitPerAccount, values.currency, 2),
          moneyBar("LTV", ltv, values.currency, 2),
        ],
        [],
        [note("Monthly growth", percentText(values.monthlyGrowthPercent))],
      );
    },
  };
}

function makeWebsiteAdRevenueConfig() {
  return {
    title: "Website Ad Revenue Calculator",
    actionLabel: "Estimate ad revenue",
    emptyState: "Estimate display ad revenue from monthly pageviews and RPM.",
    summaryLabel: "Website ad revenue estimate",
    defaultHistoryLabel: "Website ad revenue scenario",
    categorySlug: "finance",
    badge: "Ads",
    surfaceStyle: "ledger",
    defaults: { monthlyPageviews: 280000, rpm: 18, currency: "USD" },
    mainFields: [
      numberField("monthlyPageviews", "Monthly pageviews", 1, 1000000000, 100),
      moneyField("rpm", "RPM (revenue per 1,000 views)", 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.monthlyPageviews <= 0 ? "Enter monthly pageviews." : "";
    },
    compute(values) {
      const monthlyRevenue = values.monthlyPageviews / 1000 * values.rpm;
      return result(
        "Website ad revenue estimate",
        [
          card("Monthly ad revenue", moneyText(monthlyRevenue, values.currency, 2)),
          card("Yearly ad revenue", moneyText(monthlyRevenue * 12, values.currency, 2)),
          card("RPM", moneyText(values.rpm, values.currency, 2)),
        ],
        [
          plainBar("Monthly pageviews", values.monthlyPageviews, count(values.monthlyPageviews)),
          moneyBar("RPM", values.rpm, values.currency, 2),
          moneyBar("Monthly ad revenue", monthlyRevenue, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeYouTubeMoneyConfig() {
  return {
    title: "YouTube Money Calculator",
    actionLabel: "Estimate YouTube revenue",
    emptyState: "Estimate channel revenue from monthly views and RPM.",
    summaryLabel: "YouTube revenue estimate",
    defaultHistoryLabel: "YouTube money scenario",
    categorySlug: "finance",
    badge: "Creator",
    surfaceStyle: "ledger",
    aliases: ["youtube revenue calculator"],
    defaults: { monthlyViews: 420000, rpm: 4.5, currency: "USD" },
    mainFields: [
      numberField("monthlyViews", "Monthly views", 1, 1000000000, 100),
      moneyField("rpm", "RPM", 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.monthlyViews <= 0 ? "Enter monthly views." : "";
    },
    compute(values) {
      const monthlyRevenue = values.monthlyViews / 1000 * values.rpm;
      return result(
        "YouTube revenue estimate",
        [
          card("Monthly revenue", moneyText(monthlyRevenue, values.currency, 2)),
          card("Yearly revenue", moneyText(monthlyRevenue * 12, values.currency, 2)),
          card("RPM", moneyText(values.rpm, values.currency, 2)),
        ],
        [
          plainBar("Monthly views", values.monthlyViews, count(values.monthlyViews)),
          moneyBar("RPM", values.rpm, values.currency, 2),
          moneyBar("Monthly revenue", monthlyRevenue, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeAnnualizedReturnConfig() {
  return {
    title: "Annualized Rate of Return Calculator",
    actionLabel: "Calculate annualized return",
    emptyState: "Estimate the yearly compounded return between a beginning and ending investment value.",
    summaryLabel: "Annualized return",
    defaultHistoryLabel: "Annualized return scenario",
    categorySlug: "finance",
    badge: "Investing",
    surfaceStyle: "investment",
    defaults: { beginningValue: 10000, endingValue: 14200, yearsHeld: 3, currency: "USD" },
    mainFields: [
      moneyField("beginningValue", "Beginning value", 1),
      moneyField("endingValue", "Ending value", 1),
      numberField("yearsHeld", "Years held", 0.1, 100, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.beginningValue <= 0) return "Beginning value must be greater than zero.";
      return values.yearsHeld <= 0 ? "Years held must be greater than zero." : "";
    },
    compute(values) {
      const annualized = (Math.pow(values.endingValue / values.beginningValue, 1 / values.yearsHeld) - 1) * 100;
      return result(
        "Annualized return estimate",
        [
          card("Annualized return", percentText(annualized)),
          card("Beginning value", moneyText(values.beginningValue, values.currency, 2)),
          card("Ending value", moneyText(values.endingValue, values.currency, 2)),
        ],
        [
          moneyBar("Beginning value", values.beginningValue, values.currency, 2),
          moneyBar("Ending value", values.endingValue, values.currency, 2),
        ],
        [],
        [note("Holding period", `${fixed(values.yearsHeld)} years`)],
      );
    },
  };
}

function makeDiscountedCashFlowConfig() {
  return {
    title: "Discounted Cash Flow Calculator",
    actionLabel: "Calculate DCF",
    emptyState: "Estimate discounted cash flow from starting cash flow, growth, horizon, discount rate, and terminal multiple.",
    summaryLabel: "DCF estimate",
    defaultHistoryLabel: "DCF scenario",
    categorySlug: "finance",
    badge: "Valuation",
    surfaceStyle: "investment",
    aliases: ["dcf calculator", "discounted cash flow calculator dcf"],
    defaults: {
      startingCashFlow: 850000,
      annualGrowthPercent: 8,
      discountRatePercent: 11,
      years: 5,
      terminalMultiple: 8,
      currency: "USD",
    },
    mainFields: [
      moneyField("startingCashFlow", "Starting annual cash flow", 100),
      percentField("annualGrowthPercent", "Annual growth", -100, 200, 0.1),
      percentField("discountRatePercent", "Discount rate", 0, 100, 0.1),
      numberField("years", "Projection years", 1, 20, 1),
      numberField("terminalMultiple", "Terminal multiple", 0, 100, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.startingCashFlow <= 0) return "Enter starting cash flow.";
      return values.years <= 0 ? "Projection years must be greater than zero." : "";
    },
    compute(values) {
      const growth = values.annualGrowthPercent / 100;
      const discount = values.discountRatePercent / 100;
      let dcf = 0;
      let currentCashFlow = values.startingCashFlow;

      for (let year = 1; year <= Math.round(values.years); year += 1) {
        currentCashFlow *= 1 + growth;
        dcf += currentCashFlow / Math.pow(1 + discount, year);
      }

      const terminalValue = currentCashFlow * values.terminalMultiple;
      const discountedTerminalValue = terminalValue / Math.pow(1 + discount, values.years);
      const enterpriseValue = dcf + discountedTerminalValue;
      return result(
        "DCF valuation estimate",
        [
          card("Enterprise value", moneyText(enterpriseValue, values.currency, 2)),
          card("DCF value", moneyText(dcf, values.currency, 2)),
          card("Discounted terminal value", moneyText(discountedTerminalValue, values.currency, 2)),
        ],
        [
          moneyBar("DCF value", dcf, values.currency, 2),
          moneyBar("Terminal value", terminalValue, values.currency, 2),
          moneyBar("Discounted terminal value", discountedTerminalValue, values.currency, 2),
          moneyBar("Enterprise value", enterpriseValue, values.currency, 2),
        ],
        [],
        [note("Discount rate", percentText(values.discountRatePercent))],
      );
    },
  };
}

function makeDiscountRateConfig() {
  return {
    title: "Discount Rate Calculator",
    actionLabel: "Calculate discount rate",
    emptyState: "Estimate the implied annual rate needed to move from present value to future value over time.",
    summaryLabel: "Discount rate",
    defaultHistoryLabel: "Discount rate scenario",
    categorySlug: "finance",
    badge: "Investing",
    surfaceStyle: "investment",
    defaults: { presentValue: 18000, futureValue: 26000, years: 4, currency: "USD" },
    mainFields: [
      moneyField("presentValue", "Present value", 1),
      moneyField("futureValue", "Future value", 1),
      numberField("years", "Years", 0.1, 100, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.presentValue <= 0) return "Present value must be greater than zero.";
      if (values.futureValue <= 0) return "Future value must be greater than zero.";
      return values.years <= 0 ? "Years must be greater than zero." : "";
    },
    compute(values) {
      const rate = (Math.pow(values.futureValue / values.presentValue, 1 / values.years) - 1) * 100;
      return result(
        "Discount rate estimate",
        [
          card("Annual rate", percentText(rate)),
          card("Present value", moneyText(values.presentValue, values.currency, 2)),
          card("Future value", moneyText(values.futureValue, values.currency, 2)),
        ],
        [
          moneyBar("Present value", values.presentValue, values.currency, 2),
          moneyBar("Future value", values.futureValue, values.currency, 2),
        ],
        [],
        [note("Years", fixed(values.years))],
      );
    },
  };
}

function makeHoldingPeriodReturnConfig() {
  return {
    title: "Holding Period Return Calculator",
    actionLabel: "Calculate holding period return",
    emptyState: "Estimate total return from starting value, ending value, and income received during the holding period.",
    summaryLabel: "Holding period return",
    defaultHistoryLabel: "Holding period return scenario",
    categorySlug: "finance",
    badge: "Investing",
    surfaceStyle: "investment",
    defaults: { beginningValue: 12000, endingValue: 13100, incomeReceived: 420, currency: "USD" },
    mainFields: [
      moneyField("beginningValue", "Beginning value", 1),
      moneyField("endingValue", "Ending value", 1),
      moneyField("incomeReceived", "Income received", 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.beginningValue <= 0 ? "Beginning value must be greater than zero." : "";
    },
    compute(values) {
      const holdingPeriodReturn = ((values.endingValue - values.beginningValue + values.incomeReceived) / values.beginningValue) * 100;
      return result(
        "Holding period return estimate",
        [
          card("Holding period return", percentText(holdingPeriodReturn)),
          card("Ending value", moneyText(values.endingValue, values.currency, 2)),
          card("Income received", moneyText(values.incomeReceived, values.currency, 2)),
        ],
        [
          moneyBar("Beginning value", values.beginningValue, values.currency, 2),
          moneyBar("Ending value", values.endingValue, values.currency, 2),
          moneyBar("Income received", values.incomeReceived, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeIrrConfig() {
  return {
    title: "Internal Rate of Return Calculator",
    actionLabel: "Calculate IRR",
    emptyState: "Estimate IRR from an initial outlay, annual cash flow, terminal value, and holding period.",
    summaryLabel: "IRR estimate",
    defaultHistoryLabel: "IRR scenario",
    categorySlug: "finance",
    badge: "Valuation",
    surfaceStyle: "investment",
    aliases: ["irr calculator"],
    defaults: { initialInvestment: 180000, annualCashFlow: 42000, terminalValue: 60000, years: 5, currency: "USD" },
    mainFields: [
      moneyField("initialInvestment", "Initial investment", 100),
      moneyField("annualCashFlow", "Annual cash flow", 100),
      moneyField("terminalValue", "Terminal value", 100),
      numberField("years", "Years", 1, 40, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.initialInvestment <= 0) return "Enter an initial investment.";
      return values.years <= 0 ? "Years must be greater than zero." : "";
    },
    compute(values) {
      const irr = solveIrr(values.initialInvestment, values.annualCashFlow, values.terminalValue, Math.round(values.years)) * 100;
      const npvAtIrr = getLevelCashFlowNpv({
        initialInvestment: values.initialInvestment,
        annualCashFlow: values.annualCashFlow,
        years: Math.round(values.years),
        discountRatePercent: irr,
        salvageValue: values.terminalValue,
      });
      return result(
        "Internal rate of return estimate",
        [
          card("IRR", percentText(irr)),
          card("Annual cash flow", moneyText(values.annualCashFlow, values.currency, 2)),
          card("Terminal value", moneyText(values.terminalValue, values.currency, 2)),
        ],
        [
          moneyBar("Initial investment", values.initialInvestment, values.currency, 2),
          moneyBar("Annual cash flow", values.annualCashFlow, values.currency, 2),
          moneyBar("Terminal value", values.terminalValue, values.currency, 2),
          moneyBar("NPV at IRR", npvAtIrr, values.currency, 2),
        ],
        [],
        [note("Holding period", `${Math.round(values.years)} years`)],
      );
    },
  };
}

function makeNpvConfig() {
  return {
    title: "NPV Calculator",
    actionLabel: "Calculate NPV",
    emptyState: "Estimate net present value from an upfront investment, recurring annual cash flow, salvage value, and discount rate.",
    summaryLabel: "Net present value",
    defaultHistoryLabel: "NPV scenario",
    categorySlug: "finance",
    badge: "Valuation",
    surfaceStyle: "investment",
    aliases: ["net present value calculator", "npv calculator net present value"],
    defaults: { initialInvestment: 150000, annualCashFlow: 36000, years: 5, discountRatePercent: 10, salvageValue: 25000, currency: "USD" },
    mainFields: [
      moneyField("initialInvestment", "Initial investment", 100),
      moneyField("annualCashFlow", "Annual cash flow", 100),
      numberField("years", "Years", 1, 40, 1),
      percentField("discountRatePercent", "Discount rate", 0, 100, 0.1),
      moneyField("salvageValue", "Terminal or salvage value", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.years <= 0 ? "Years must be greater than zero." : "";
    },
    compute(values) {
      const npv = getLevelCashFlowNpv(values);
      return result(
        "Net present value estimate",
        [
          card("NPV", moneyText(npv, values.currency, 2)),
          card("Annual cash flow", moneyText(values.annualCashFlow, values.currency, 2)),
          card("Discount rate", percentText(values.discountRatePercent)),
        ],
        [
          moneyBar("Initial investment", values.initialInvestment, values.currency, 2),
          moneyBar("Annual cash flow", values.annualCashFlow, values.currency, 2),
          moneyBar("Terminal value", values.salvageValue, values.currency, 2),
          moneyBar("NPV", npv, values.currency, 2),
        ],
        [],
        [note("Years", `${Math.round(values.years)}`)],
      );
    },
  };
}

function makePresentValueConfig() {
  return {
    title: "Present Value Calculator",
    actionLabel: "Calculate present value",
    emptyState: "Estimate what a future amount is worth today at a chosen discount rate.",
    summaryLabel: "Present value",
    defaultHistoryLabel: "Present value scenario",
    categorySlug: "finance",
    badge: "Investing",
    surfaceStyle: "investment",
    defaults: { futureValue: 28000, ratePercent: 9, years: 4, currency: "USD" },
    mainFields: [
      moneyField("futureValue", "Future value", 1),
      percentField("ratePercent", "Discount rate", 0, 100, 0.1),
      numberField("years", "Years", 0.1, 100, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.years <= 0 ? "Years must be greater than zero." : "";
    },
    compute(values) {
      const presentValue = values.futureValue / Math.pow(1 + values.ratePercent / 100, values.years);
      return result(
        "Present value estimate",
        [
          card("Present value", moneyText(presentValue, values.currency, 2)),
          card("Future value", moneyText(values.futureValue, values.currency, 2)),
          card("Discount rate", percentText(values.ratePercent)),
        ],
        [
          moneyBar("Future value", values.futureValue, values.currency, 2),
          moneyBar("Present value", presentValue, values.currency, 2),
        ],
        [],
        [note("Years", fixed(values.years))],
      );
    },
  };
}

function makeRateOfReturnConfig() {
  return {
    title: "Rate of Return Calculator",
    actionLabel: "Calculate rate of return",
    emptyState: "Estimate total percentage return from beginning and ending investment values plus income.",
    summaryLabel: "Rate of return",
    defaultHistoryLabel: "Rate of return scenario",
    categorySlug: "finance",
    badge: "Investing",
    surfaceStyle: "investment",
    defaults: { beginningValue: 10000, endingValue: 11800, incomeReceived: 300, currency: "USD" },
    mainFields: [
      moneyField("beginningValue", "Beginning value", 1),
      moneyField("endingValue", "Ending value", 1),
      moneyField("incomeReceived", "Income received", 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.beginningValue <= 0 ? "Beginning value must be greater than zero." : "";
    },
    compute(values) {
      const rate = ((values.endingValue - values.beginningValue + values.incomeReceived) / values.beginningValue) * 100;
      return result(
        "Rate of return estimate",
        [
          card("Rate of return", percentText(rate)),
          card("Ending value", moneyText(values.endingValue, values.currency, 2)),
          card("Income received", moneyText(values.incomeReceived, values.currency, 2)),
        ],
        [
          moneyBar("Beginning value", values.beginningValue, values.currency, 2),
          moneyBar("Ending value", values.endingValue, values.currency, 2),
          moneyBar("Income received", values.incomeReceived, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeSharpeRatioConfig() {
  return {
    title: "Sharpe Ratio Calculator",
    actionLabel: "Calculate Sharpe ratio",
    emptyState: "Estimate risk-adjusted return from portfolio return, risk-free rate, and volatility.",
    summaryLabel: "Sharpe ratio",
    defaultHistoryLabel: "Sharpe ratio scenario",
    categorySlug: "finance",
    badge: "Risk",
    surfaceStyle: "investment",
    defaults: { portfolioReturnPercent: 14, riskFreeRatePercent: 4.2, volatilityPercent: 18.5 },
    mainFields: [
      percentField("portfolioReturnPercent", "Portfolio return", -100, 1000, 0.1),
      percentField("riskFreeRatePercent", "Risk-free rate", -100, 1000, 0.1),
      percentField("volatilityPercent", "Volatility", 0.1, 1000, 0.1),
    ],
    advancedFields: [],
    validate(values) {
      return values.volatilityPercent <= 0 ? "Volatility must be greater than zero." : "";
    },
    compute(values) {
      const sharpe = (values.portfolioReturnPercent - values.riskFreeRatePercent) / values.volatilityPercent;
      return result(
        "Sharpe ratio estimate",
        [
          card("Sharpe ratio", fixed(sharpe)),
          card("Excess return", percentText(values.portfolioReturnPercent - values.riskFreeRatePercent)),
          card("Volatility", percentText(values.volatilityPercent)),
        ],
        [
          plainBar("Portfolio return", values.portfolioReturnPercent, percentText(values.portfolioReturnPercent)),
          plainBar("Risk-free rate", values.riskFreeRatePercent, percentText(values.riskFreeRatePercent)),
          plainBar("Volatility", values.volatilityPercent, percentText(values.volatilityPercent)),
        ],
        [],
        [],
      );
    },
  };
}

function makeDividendYieldConfig() {
  return {
    title: "Dividend Yield Calculator",
    actionLabel: "Calculate dividend yield",
    emptyState: "Estimate the annual dividend yield from share price and annual dividend per share.",
    summaryLabel: "Dividend yield",
    defaultHistoryLabel: "Dividend yield scenario",
    categorySlug: "finance",
    badge: "Equity",
    surfaceStyle: "investment",
    defaults: { annualDividendPerShare: 2.4, sharePrice: 58, currency: "USD" },
    mainFields: [
      moneyField("annualDividendPerShare", "Annual dividend per share", 0.01),
      moneyField("sharePrice", "Share price", 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.sharePrice <= 0 ? "Share price must be greater than zero." : "";
    },
    compute(values) {
      const yieldPercent = (values.annualDividendPerShare / values.sharePrice) * 100;
      return result(
        "Dividend yield estimate",
        [
          card("Dividend yield", percentText(yieldPercent)),
          card("Annual dividend", moneyText(values.annualDividendPerShare, values.currency, 2)),
          card("Share price", moneyText(values.sharePrice, values.currency, 2)),
        ],
        [
          moneyBar("Annual dividend", values.annualDividendPerShare, values.currency, 2),
          moneyBar("Share price", values.sharePrice, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeEpsConfig() {
  return {
    title: "Earnings per Share Calculator",
    actionLabel: "Calculate EPS",
    emptyState: "Estimate earnings per share from net income, preferred dividends, and weighted average shares.",
    summaryLabel: "EPS estimate",
    defaultHistoryLabel: "EPS scenario",
    categorySlug: "finance",
    badge: "Equity",
    surfaceStyle: "investment",
    aliases: ["eps calculator"],
    defaults: { netIncome: 920000, preferredDividends: 0, weightedAverageShares: 220000, currency: "USD" },
    mainFields: [
      moneyField("netIncome", "Net income", 100),
      moneyField("preferredDividends", "Preferred dividends", 100),
      numberField("weightedAverageShares", "Weighted average shares", 1, 1000000000000, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.weightedAverageShares <= 0 ? "Shares must be greater than zero." : "";
    },
    compute(values) {
      const eps = (values.netIncome - values.preferredDividends) / Math.max(values.weightedAverageShares, 1);
      return result(
        "Earnings per share estimate",
        [
          card("EPS", moneyText(eps, values.currency, 2)),
          card("Net income", moneyText(values.netIncome, values.currency, 2)),
          card("Weighted shares", count(values.weightedAverageShares)),
        ],
        [
          moneyBar("Net income", values.netIncome, values.currency, 2),
          moneyBar("Preferred dividends", values.preferredDividends, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeEnterpriseValueConfig() {
  return {
    title: "Enterprise Value Calculator",
    actionLabel: "Calculate enterprise value",
    emptyState: "Estimate enterprise value from market cap, debt, preferred stock, minority interest, and cash.",
    summaryLabel: "Enterprise value",
    defaultHistoryLabel: "Enterprise value scenario",
    categorySlug: "finance",
    badge: "Valuation",
    surfaceStyle: "investment",
    aliases: ["ev calculator"],
    defaults: {
      marketCap: 48000000,
      totalDebt: 12500000,
      preferredStock: 0,
      minorityInterest: 0,
      cashAndEquivalents: 6200000,
      currency: "USD",
    },
    mainFields: [
      moneyField("marketCap", "Market capitalization", 1000),
      moneyField("totalDebt", "Total debt", 1000),
      moneyField("preferredStock", "Preferred stock", 1000),
      moneyField("minorityInterest", "Minority interest", 1000),
      moneyField("cashAndEquivalents", "Cash and equivalents", 1000),
    ],
    advancedFields: [currencyField()],
    validate() {
      return "";
    },
    compute(values) {
      const enterpriseValue =
        values.marketCap + values.totalDebt + values.preferredStock + values.minorityInterest - values.cashAndEquivalents;
      return result(
        "Enterprise value estimate",
        [
          card("Enterprise value", moneyText(enterpriseValue, values.currency, 2)),
          card("Market cap", moneyText(values.marketCap, values.currency, 2)),
          card("Debt", moneyText(values.totalDebt, values.currency, 2)),
        ],
        [
          moneyBar("Market cap", values.marketCap, values.currency, 2),
          moneyBar("Debt", values.totalDebt, values.currency, 2),
          moneyBar("Cash and equivalents", values.cashAndEquivalents, values.currency, 2),
          moneyBar("Enterprise value", enterpriseValue, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeMarketCapConfig() {
  return {
    title: "Market Capitalization Calculator",
    actionLabel: "Calculate market cap",
    emptyState: "Estimate market capitalization from share price and shares outstanding.",
    summaryLabel: "Market cap",
    defaultHistoryLabel: "Market cap scenario",
    categorySlug: "finance",
    badge: "Equity",
    surfaceStyle: "investment",
    defaults: { sharePrice: 42, sharesOutstanding: 125000000, currency: "USD" },
    mainFields: [
      moneyField("sharePrice", "Share price", 0.01),
      numberField("sharesOutstanding", "Shares outstanding", 1, 1000000000000, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.sharesOutstanding <= 0 ? "Shares outstanding must be greater than zero." : "";
    },
    compute(values) {
      const marketCap = values.sharePrice * values.sharesOutstanding;
      return result(
        "Market capitalization estimate",
        [
          card("Market cap", moneyText(marketCap, values.currency, 2)),
          card("Share price", moneyText(values.sharePrice, values.currency, 2)),
          card("Shares outstanding", count(values.sharesOutstanding)),
        ],
        [
          moneyBar("Share price", values.sharePrice, values.currency, 2),
          plainBar("Shares outstanding", values.sharesOutstanding, count(values.sharesOutstanding)),
          moneyBar("Market cap", marketCap, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makePeConfig() {
  return {
    title: "Price to Earnings Ratio Calculator",
    actionLabel: "Calculate P/E ratio",
    emptyState: "Estimate the price-to-earnings multiple from share price and earnings per share.",
    summaryLabel: "P/E ratio",
    defaultHistoryLabel: "P/E scenario",
    categorySlug: "finance",
    badge: "Equity",
    surfaceStyle: "investment",
    aliases: ["pe ratio calculator", "price to earnings calculator"],
    defaults: { sharePrice: 48, earningsPerShare: 3.6, currency: "USD" },
    mainFields: [
      moneyField("sharePrice", "Share price", 0.01),
      moneyField("earningsPerShare", "Earnings per share", 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.earningsPerShare <= 0 ? "EPS must be greater than zero." : "";
    },
    compute(values) {
      const peRatio = values.sharePrice / Math.max(values.earningsPerShare, 0.01);
      return result(
        "P/E ratio estimate",
        [
          card("P/E ratio", `${fixed(peRatio)}x`),
          card("Share price", moneyText(values.sharePrice, values.currency, 2)),
          card("EPS", moneyText(values.earningsPerShare, values.currency, 2)),
        ],
        [
          moneyBar("Share price", values.sharePrice, values.currency, 2),
          moneyBar("EPS", values.earningsPerShare, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makePbConfig() {
  return {
    title: "Price to Book Ratio Calculator",
    actionLabel: "Calculate P/B ratio",
    emptyState: "Estimate the price-to-book multiple from share price and book value per share.",
    summaryLabel: "P/B ratio",
    defaultHistoryLabel: "P/B scenario",
    categorySlug: "finance",
    badge: "Equity",
    surfaceStyle: "investment",
    defaults: { sharePrice: 32, bookValuePerShare: 18.4, currency: "USD" },
    mainFields: [
      moneyField("sharePrice", "Share price", 0.01),
      moneyField("bookValuePerShare", "Book value per share", 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.bookValuePerShare <= 0 ? "Book value per share must be greater than zero." : "";
    },
    compute(values) {
      const pbRatio = values.sharePrice / Math.max(values.bookValuePerShare, 0.01);
      return result(
        "P/B ratio estimate",
        [
          card("P/B ratio", `${fixed(pbRatio)}x`),
          card("Share price", moneyText(values.sharePrice, values.currency, 2)),
          card("Book value / share", moneyText(values.bookValuePerShare, values.currency, 2)),
        ],
        [
          moneyBar("Share price", values.sharePrice, values.currency, 2),
          moneyBar("Book value / share", values.bookValuePerShare, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makePsConfig() {
  return {
    title: "Price to Sales Ratio Calculator",
    actionLabel: "Calculate P/S ratio",
    emptyState: "Estimate the price-to-sales multiple from market cap and trailing revenue.",
    summaryLabel: "P/S ratio",
    defaultHistoryLabel: "P/S scenario",
    categorySlug: "finance",
    badge: "Equity",
    surfaceStyle: "investment",
    defaults: { marketCap: 64000000, trailingRevenue: 18000000, currency: "USD" },
    mainFields: [
      moneyField("marketCap", "Market cap", 1000),
      moneyField("trailingRevenue", "Trailing revenue", 1000),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.trailingRevenue <= 0 ? "Trailing revenue must be greater than zero." : "";
    },
    compute(values) {
      const psRatio = values.marketCap / Math.max(values.trailingRevenue, 0.01);
      return result(
        "P/S ratio estimate",
        [
          card("P/S ratio", `${fixed(psRatio)}x`),
          card("Market cap", moneyText(values.marketCap, values.currency, 2)),
          card("Revenue", moneyText(values.trailingRevenue, values.currency, 2)),
        ],
        [
          moneyBar("Market cap", values.marketCap, values.currency, 2),
          moneyBar("Revenue", values.trailingRevenue, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makePercentReturnConfig({
  title,
  actionLabel,
  emptyState,
  summaryLabel,
  numeratorName,
  numeratorLabel,
  denominatorName,
  denominatorLabel,
  defaultNumerator,
  defaultDenominator,
  badge = "Metric",
  aliases = [],
}) {
  return {
    title,
    actionLabel,
    emptyState,
    summaryLabel,
    defaultHistoryLabel: `${title} scenario`,
    categorySlug: "finance",
    badge,
    surfaceStyle: "investment",
    aliases,
    defaults: { [numeratorName]: defaultNumerator, [denominatorName]: defaultDenominator, currency: "USD" },
    mainFields: [
      moneyField(numeratorName, numeratorLabel, 0.01),
      moneyField(denominatorName, denominatorLabel, 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values[denominatorName] <= 0 ? `${denominatorLabel} must be greater than zero.` : "";
    },
    compute(values) {
      const ratio = (values[numeratorName] / Math.max(values[denominatorName], 0.01)) * 100;
      return result(
        `${title} result`,
        [
          card(summaryLabel, percentText(ratio)),
          card(numeratorLabel, moneyText(values[numeratorName], values.currency, 2)),
          card(denominatorLabel, moneyText(values[denominatorName], values.currency, 2)),
        ],
        [
          moneyBar(numeratorLabel, values[numeratorName], values.currency, 2),
          moneyBar(denominatorLabel, values[denominatorName], values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeWaccConfig() {
  return {
    title: "WACC Calculator",
    actionLabel: "Calculate WACC",
    emptyState: "Estimate weighted average cost of capital from debt, equity, and tax assumptions.",
    summaryLabel: "WACC estimate",
    defaultHistoryLabel: "WACC scenario",
    categorySlug: "finance",
    badge: "Valuation",
    surfaceStyle: "investment",
    aliases: ["weighted average cost of capital calculator"],
    defaults: {
      marketValueEquity: 32000000,
      marketValueDebt: 12500000,
      costOfEquityPercent: 11.4,
      costOfDebtPercent: 6.2,
      taxRatePercent: 24,
      currency: "USD",
    },
    mainFields: [
      moneyField("marketValueEquity", "Market value of equity", 1000),
      moneyField("marketValueDebt", "Market value of debt", 1000),
      percentField("costOfEquityPercent", "Cost of equity", 0, 100, 0.1),
      percentField("costOfDebtPercent", "Cost of debt", 0, 100, 0.1),
      percentField("taxRatePercent", "Tax rate", 0, 100, 0.1),
    ],
    advancedFields: [currencyField()],
    validate() {
      return "";
    },
    compute(values) {
      const totalCapital = values.marketValueEquity + values.marketValueDebt;
      const equityWeight = values.marketValueEquity / Math.max(totalCapital, 0.01);
      const debtWeight = values.marketValueDebt / Math.max(totalCapital, 0.01);
      const afterTaxCostOfDebt = values.costOfDebtPercent * (1 - values.taxRatePercent / 100);
      const wacc = equityWeight * values.costOfEquityPercent + debtWeight * afterTaxCostOfDebt;
      return result(
        "WACC estimate",
        [
          card("WACC", percentText(wacc)),
          card("Equity weight", percentText(equityWeight * 100)),
          card("Debt weight", percentText(debtWeight * 100)),
        ],
        [
          moneyBar("Equity value", values.marketValueEquity, values.currency, 2),
          moneyBar("Debt value", values.marketValueDebt, values.currency, 2),
          plainBar("After-tax cost of debt", afterTaxCostOfDebt, percentText(afterTaxCostOfDebt)),
        ],
        [],
        [],
      );
    },
  };
}

function makeDscrConfig() {
  return {
    title: "Debt Service Coverage Ratio Calculator",
    actionLabel: "Calculate DSCR",
    emptyState: "Estimate debt service coverage from net operating income and annual debt service.",
    summaryLabel: "DSCR estimate",
    defaultHistoryLabel: "DSCR scenario",
    categorySlug: "mortgage-data",
    badge: "Commercial",
    surfaceStyle: "loanSplit",
    aliases: ["dscr calculator"],
    defaults: { netOperatingIncome: 185000, annualDebtService: 132000, currency: "USD" },
    mainFields: [
      moneyField("netOperatingIncome", "Net operating income", 100),
      moneyField("annualDebtService", "Annual debt service", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.annualDebtService <= 0 ? "Annual debt service must be greater than zero." : "";
    },
    compute(values) {
      const dscr = values.netOperatingIncome / Math.max(values.annualDebtService, 0.01);
      return result(
        "DSCR estimate",
        [
          card("DSCR", `${fixed(dscr)}x`),
          card("NOI", moneyText(values.netOperatingIncome, values.currency, 2)),
          card("Debt service", moneyText(values.annualDebtService, values.currency, 2)),
        ],
        [
          moneyBar("NOI", values.netOperatingIncome, values.currency, 2),
          moneyBar("Debt service", values.annualDebtService, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeQuickRatioConfig() {
  return {
    title: "Quick Ratio Calculator",
    actionLabel: "Calculate quick ratio",
    emptyState: "Estimate the quick ratio from liquid current assets and current liabilities.",
    summaryLabel: "Quick ratio",
    defaultHistoryLabel: "Quick ratio scenario",
    categorySlug: "finance",
    badge: "Liquidity",
    surfaceStyle: "ledger",
    defaults: { cash: 125000, marketableSecurities: 42000, accountsReceivable: 88000, currentLiabilities: 176000, currency: "USD" },
    mainFields: [
      moneyField("cash", "Cash", 100),
      moneyField("marketableSecurities", "Marketable securities", 100),
      moneyField("accountsReceivable", "Accounts receivable", 100),
      moneyField("currentLiabilities", "Current liabilities", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.currentLiabilities <= 0 ? "Current liabilities must be greater than zero." : "";
    },
    compute(values) {
      const liquidAssets = values.cash + values.marketableSecurities + values.accountsReceivable;
      const quickRatio = liquidAssets / Math.max(values.currentLiabilities, 0.01);
      return result(
        "Quick ratio estimate",
        [
          card("Quick ratio", `${fixed(quickRatio)}x`),
          card("Liquid assets", moneyText(liquidAssets, values.currency, 2)),
          card("Current liabilities", moneyText(values.currentLiabilities, values.currency, 2)),
        ],
        [
          moneyBar("Liquid assets", liquidAssets, values.currency, 2),
          moneyBar("Current liabilities", values.currentLiabilities, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeBondPriceConfig() {
  return {
    title: "Bond Price Calculator",
    actionLabel: "Calculate bond price",
    emptyState: "Estimate a bond price from face value, coupon rate, years to maturity, and market yield.",
    summaryLabel: "Bond price",
    defaultHistoryLabel: "Bond price scenario",
    categorySlug: "finance",
    badge: "Fixed income",
    surfaceStyle: "investment",
    defaults: { faceValue: 1000, couponRatePercent: 5.5, marketYieldPercent: 6.2, yearsToMaturity: 8, paymentsPerYear: 2, currency: "USD" },
    mainFields: [
      moneyField("faceValue", "Face value", 1),
      percentField("couponRatePercent", "Coupon rate", 0, 100, 0.1),
      percentField("marketYieldPercent", "Market yield", 0, 100, 0.1),
      numberField("yearsToMaturity", "Years to maturity", 1, 100, 1),
      numberField("paymentsPerYear", "Payments per year", 1, 12, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.paymentsPerYear <= 0 ? "Payments per year must be greater than zero." : "";
    },
    compute(values) {
      const price = getBondPrice(values);
      const annualCoupon = values.faceValue * (values.couponRatePercent / 100);
      return result(
        "Bond price estimate",
        [
          card("Bond price", moneyText(price, values.currency, 2)),
          card("Annual coupon", moneyText(annualCoupon, values.currency, 2)),
          card("Market yield", percentText(values.marketYieldPercent)),
        ],
        [
          moneyBar("Face value", values.faceValue, values.currency, 2),
          moneyBar("Annual coupon", annualCoupon, values.currency, 2),
          moneyBar("Bond price", price, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeBondYieldConfig() {
  return {
    title: "Bond Yield Calculator",
    actionLabel: "Calculate bond yield",
    emptyState: "Estimate current yield from annual coupon payments and current bond price.",
    summaryLabel: "Bond yield",
    defaultHistoryLabel: "Bond yield scenario",
    categorySlug: "finance",
    badge: "Fixed income",
    surfaceStyle: "investment",
    defaults: { annualCoupon: 55, currentPrice: 940, currency: "USD" },
    mainFields: [
      moneyField("annualCoupon", "Annual coupon", 0.01),
      moneyField("currentPrice", "Current bond price", 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.currentPrice <= 0 ? "Current bond price must be greater than zero." : "";
    },
    compute(values) {
      const currentYield = (values.annualCoupon / values.currentPrice) * 100;
      return result(
        "Bond yield estimate",
        [
          card("Current yield", percentText(currentYield)),
          card("Annual coupon", moneyText(values.annualCoupon, values.currency, 2)),
          card("Current price", moneyText(values.currentPrice, values.currency, 2)),
        ],
        [
          moneyBar("Annual coupon", values.annualCoupon, values.currency, 2),
          moneyBar("Current price", values.currentPrice, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeYieldToMaturityConfig() {
  return {
    title: "Yield to Maturity Calculator",
    actionLabel: "Calculate YTM",
    emptyState: "Estimate yield to maturity from bond price, coupon, face value, and years to maturity.",
    summaryLabel: "Yield to maturity",
    defaultHistoryLabel: "Yield to maturity scenario",
    categorySlug: "finance",
    badge: "Fixed income",
    surfaceStyle: "investment",
    aliases: ["ytm calculator"],
    defaults: { faceValue: 1000, annualCoupon: 55, currentPrice: 940, yearsToMaturity: 8, paymentsPerYear: 2, currency: "USD" },
    mainFields: [
      moneyField("faceValue", "Face value", 1),
      moneyField("annualCoupon", "Annual coupon", 0.01),
      moneyField("currentPrice", "Current bond price", 0.01),
      numberField("yearsToMaturity", "Years to maturity", 1, 100, 1),
      numberField("paymentsPerYear", "Payments per year", 1, 12, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.currentPrice <= 0) return "Current bond price must be greater than zero.";
      return values.paymentsPerYear <= 0 ? "Payments per year must be greater than zero." : "";
    },
    compute(values) {
      const ytm = solveBondYtm(values) * 100;
      return result(
        "Yield to maturity estimate",
        [
          card("YTM", percentText(ytm)),
          card("Current price", moneyText(values.currentPrice, values.currency, 2)),
          card("Annual coupon", moneyText(values.annualCoupon, values.currency, 2)),
        ],
        [
          moneyBar("Face value", values.faceValue, values.currency, 2),
          moneyBar("Current price", values.currentPrice, values.currency, 2),
          moneyBar("Annual coupon", values.annualCoupon, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeBalanceTransferConfig() {
  return {
    title: "Balance Transfer Calculator",
    actionLabel: "Calculate balance transfer savings",
    emptyState: "Estimate interest savings from moving a card balance to a lower introductory APR offer.",
    summaryLabel: "Balance transfer estimate",
    defaultHistoryLabel: "Balance transfer scenario",
    categorySlug: "finance",
    badge: "Debt",
    surfaceStyle: "loanSplit",
    defaults: {
      balance: 8200,
      currentAprPercent: 24.9,
      transferAprPercent: 0,
      promoMonths: 15,
      transferFeePercent: 3,
      monthlyPayment: 380,
      currency: "USD",
    },
    mainFields: [
      moneyField("balance", "Balance to transfer", 1),
      percentField("currentAprPercent", "Current APR", 0, 100, 0.1),
      percentField("transferAprPercent", "Transfer APR", 0, 100, 0.1),
      numberField("promoMonths", "Promo months", 1, 60, 1),
      percentField("transferFeePercent", "Transfer fee", 0, 20, 0.1),
      moneyField("monthlyPayment", "Monthly payment", 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.balance <= 0) return "Enter a balance to transfer.";
      return values.monthlyPayment <= 0 ? "Enter a monthly payment." : "";
    },
    compute(values) {
      const transferFee = values.balance * (values.transferFeePercent / 100);
      const currentInterestEstimate = estimateSimplePaydownInterest(values.balance, values.currentAprPercent, values.monthlyPayment, values.promoMonths);
      const transferInterestEstimate = estimateSimplePaydownInterest(values.balance + transferFee, values.transferAprPercent, values.monthlyPayment, values.promoMonths);
      const savings = currentInterestEstimate - transferInterestEstimate;
      return result(
        "Balance transfer savings estimate",
        [
          card("Estimated savings", moneyText(savings, values.currency, 2)),
          card("Transfer fee", moneyText(transferFee, values.currency, 2)),
          card("Current-interest estimate", moneyText(currentInterestEstimate, values.currency, 2)),
          card("Transfer-interest estimate", moneyText(transferInterestEstimate, values.currency, 2)),
        ],
        [
          moneyBar("Balance", values.balance, values.currency, 2),
          moneyBar("Transfer fee", transferFee, values.currency, 2),
          moneyBar("Estimated savings", savings, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeDebtPaydownMethodConfig(title, method) {
  return {
    title,
    actionLabel: "Calculate payoff order",
    emptyState: "Estimate which debt to prioritize first based on either smallest balance or highest APR.",
    summaryLabel: "Payoff order",
    defaultHistoryLabel: `${title} scenario`,
    categorySlug: "finance",
    badge: "Debt",
    surfaceStyle: "loanSplit",
    defaults: {
      balanceA: 2200,
      aprA: 24.9,
      paymentA: 110,
      balanceB: 5600,
      aprB: 18.5,
      paymentB: 180,
      balanceC: 12800,
      aprC: 8.2,
      paymentC: 340,
      currency: "USD",
    },
    mainFields: [
      moneyField("balanceA", "Debt A balance", 1),
      percentField("aprA", "Debt A APR", 0, 100, 0.1),
      moneyField("paymentA", "Debt A payment", 1),
      moneyField("balanceB", "Debt B balance", 1),
      percentField("aprB", "Debt B APR", 0, 100, 0.1),
      moneyField("paymentB", "Debt B payment", 1),
      moneyField("balanceC", "Debt C balance", 1),
      percentField("aprC", "Debt C APR", 0, 100, 0.1),
      moneyField("paymentC", "Debt C payment", 1),
    ],
    advancedFields: [currencyField()],
    validate() {
      return "";
    },
    compute(values) {
      const debts = [
        { label: "Debt A", balance: values.balanceA, apr: values.aprA, payment: values.paymentA },
        { label: "Debt B", balance: values.balanceB, apr: values.aprB, payment: values.paymentB },
        { label: "Debt C", balance: values.balanceC, apr: values.aprC, payment: values.paymentC },
      ];
      const ordered = [...debts].sort((left, right) => (
        method === "snowball" ? left.balance - right.balance : right.apr - left.apr
      ));
      const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
      const totalPayment = debts.reduce((sum, debt) => sum + debt.payment, 0);
      return result(
        `${title} order`,
        [
          card("1st target", ordered[0]?.label || "Debt A"),
          card("2nd target", ordered[1]?.label || "Debt B"),
          card("3rd target", ordered[2]?.label || "Debt C"),
          card("Total balance", moneyText(totalBalance, values.currency, 2)),
        ],
        [
          moneyBar("Total balance", totalBalance, values.currency, 2),
          moneyBar("Total monthly payment", totalPayment, values.currency, 2),
        ],
        [
          method === "snowball"
            ? "Snowball prioritizes the smallest balance first so wins arrive faster."
            : "Avalanche prioritizes the highest APR first so interest cost falls faster.",
        ],
        [note("Method", method === "snowball" ? "Debt snowball" : "Debt avalanche")],
      );
    },
  };
}

function makeFireConfig() {
  return {
    title: "FIRE Calculator",
    actionLabel: "Calculate FIRE target",
    emptyState: "Estimate your FIRE number and a rough time-to-FIRE horizon from expenses, contributions, and return assumptions.",
    summaryLabel: "FIRE estimate",
    defaultHistoryLabel: "FIRE scenario",
    categorySlug: "finance",
    badge: "Retirement",
    surfaceStyle: "investment",
    aliases: ["financial independence retire early calculator"],
    defaults: {
      annualExpenses: 48000,
      withdrawalRatePercent: 4,
      currentInvestments: 185000,
      annualContribution: 28000,
      annualReturnPercent: 7,
      currency: "USD",
    },
    mainFields: [
      moneyField("annualExpenses", "Annual expenses", 100),
      percentField("withdrawalRatePercent", "Withdrawal rate", 0.1, 20, 0.1),
      moneyField("currentInvestments", "Current investments", 100),
      moneyField("annualContribution", "Annual contribution", 100),
      percentField("annualReturnPercent", "Annual return", -100, 100, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.withdrawalRatePercent <= 0 ? "Withdrawal rate must be greater than zero." : "";
    },
    compute(values) {
      const fireNumber = values.annualExpenses / (values.withdrawalRatePercent / 100);
      const yearsToFire = estimateYearsToTarget({
        currentAmount: values.currentInvestments,
        annualContribution: values.annualContribution,
        annualReturnPercent: values.annualReturnPercent,
        targetAmount: fireNumber,
      });
      return result(
        "FIRE planning estimate",
        [
          card("FIRE number", moneyText(fireNumber, values.currency, 2)),
          card("Years to target", yearsToFire === Infinity ? "Not reached in 80 years" : `${fixed(yearsToFire)} years`),
          card("Current investments", moneyText(values.currentInvestments, values.currency, 2)),
          card("Annual contribution", moneyText(values.annualContribution, values.currency, 2)),
        ],
        [
          moneyBar("Current investments", values.currentInvestments, values.currency, 2),
          moneyBar("Annual contribution", values.annualContribution, values.currency, 2),
          moneyBar("FIRE number", fireNumber, values.currency, 2),
        ],
        [],
        [note("Withdrawal rate", percentText(values.withdrawalRatePercent))],
      );
    },
  };
}

function makeRetirementWithdrawalConfig() {
  return {
    title: "Retirement Withdrawal Calculator",
    actionLabel: "Estimate withdrawal runway",
    emptyState: "Estimate how long retirement savings may last with withdrawals and investment returns.",
    summaryLabel: "Withdrawal runway",
    defaultHistoryLabel: "Retirement withdrawal scenario",
    categorySlug: "finance",
    badge: "Retirement",
    surfaceStyle: "investment",
    defaults: { nestEgg: 950000, annualWithdrawal: 42000, annualReturnPercent: 5, currency: "USD" },
    mainFields: [
      moneyField("nestEgg", "Nest egg", 100),
      moneyField("annualWithdrawal", "Annual withdrawal", 100),
      percentField("annualReturnPercent", "Annual return", -100, 100, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.nestEgg <= 0 ? "Enter a nest egg amount." : "";
    },
    compute(values) {
      const years = estimateWithdrawalRunway(values.nestEgg, values.annualWithdrawal, values.annualReturnPercent);
      return result(
        "Retirement withdrawal runway estimate",
        [
          card("Estimated runway", years === Infinity ? "Portfolio still growing" : `${fixed(years)} years`),
          card("Nest egg", moneyText(values.nestEgg, values.currency, 2)),
          card("Annual withdrawal", moneyText(values.annualWithdrawal, values.currency, 2)),
        ],
        [
          moneyBar("Nest egg", values.nestEgg, values.currency, 2),
          moneyBar("Annual withdrawal", values.annualWithdrawal, values.currency, 2),
        ],
        [],
        [note("Annual return", percentText(values.annualReturnPercent))],
      );
    },
  };
}

function makeRuleOf72Config() {
  return {
    title: "Rule of 72 Calculator",
    actionLabel: "Calculate doubling time",
    emptyState: "Estimate how many years it takes for an amount to double based on the Rule of 72.",
    summaryLabel: "Doubling time",
    defaultHistoryLabel: "Rule of 72 scenario",
    categorySlug: "finance",
    badge: "Investing",
    surfaceStyle: "investment",
    defaults: { annualReturnPercent: 8 },
    mainFields: [percentField("annualReturnPercent", "Annual return", 0.1, 100, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.annualReturnPercent <= 0 ? "Annual return must be greater than zero." : "";
    },
    compute(values) {
      const years = 72 / values.annualReturnPercent;
      return result(
        "Rule of 72 estimate",
        [
          card("Years to double", `${fixed(years)} years`),
          card("Annual return", percentText(values.annualReturnPercent)),
        ],
        [plainBar("Annual return", values.annualReturnPercent, percentText(values.annualReturnPercent))],
        [],
        [],
      );
    },
  };
}

function makePaypalFeeConfig() {
  return {
    title: "PayPal Fee Calculator",
    actionLabel: "Calculate PayPal fee",
    emptyState: "Estimate PayPal processing fees and the amount left after fees.",
    summaryLabel: "PayPal fee estimate",
    defaultHistoryLabel: "PayPal fee scenario",
    categorySlug: "finance",
    badge: "Payments",
    surfaceStyle: "ledger",
    defaults: { grossAmount: 2500, feePercent: 2.99, fixedFee: 0.49, currency: "USD" },
    mainFields: [
      moneyField("grossAmount", "Gross amount", 0.01),
      percentField("feePercent", "Fee percent", 0, 20, 0.01),
      moneyField("fixedFee", "Fixed fee", 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.grossAmount <= 0 ? "Gross amount must be greater than zero." : "";
    },
    compute(values) {
      const fee = values.grossAmount * (values.feePercent / 100) + values.fixedFee;
      const net = values.grossAmount - fee;
      return result(
        "PayPal fee estimate",
        [
          card("Fee", moneyText(fee, values.currency, 2)),
          card("Net after fee", moneyText(net, values.currency, 2)),
          card("Gross amount", moneyText(values.grossAmount, values.currency, 2)),
        ],
        [
          moneyBar("Gross amount", values.grossAmount, values.currency, 2),
          moneyBar("Fee", fee, values.currency, 2),
          moneyBar("Net after fee", net, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeInventoryTurnoverConfig() {
  return {
    title: "Inventory Turnover Calculator",
    actionLabel: "Calculate inventory turnover",
    emptyState: "Estimate how many times inventory turns over during a period from COGS and average inventory.",
    summaryLabel: "Inventory turnover",
    defaultHistoryLabel: "Inventory turnover scenario",
    categorySlug: "finance",
    badge: "Inventory",
    surfaceStyle: "ledger",
    defaults: { costOfGoodsSold: 920000, averageInventory: 180000, currency: "USD" },
    mainFields: [
      moneyField("costOfGoodsSold", "Cost of goods sold", 100),
      moneyField("averageInventory", "Average inventory", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.averageInventory <= 0 ? "Average inventory must be greater than zero." : "";
    },
    compute(values) {
      const turnover = values.costOfGoodsSold / Math.max(values.averageInventory, 0.01);
      return result(
        "Inventory turnover estimate",
        [
          card("Inventory turnover", `${fixed(turnover)}x`),
          card("COGS", moneyText(values.costOfGoodsSold, values.currency, 2)),
          card("Average inventory", moneyText(values.averageInventory, values.currency, 2)),
        ],
        [
          moneyBar("COGS", values.costOfGoodsSold, values.currency, 2),
          moneyBar("Average inventory", values.averageInventory, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeWorkingCapitalConfig() {
  return {
    title: "Working Capital Calculator",
    actionLabel: "Calculate working capital",
    emptyState: "Estimate working capital from current assets and current liabilities.",
    summaryLabel: "Working capital",
    defaultHistoryLabel: "Working capital scenario",
    categorySlug: "finance",
    badge: "Liquidity",
    surfaceStyle: "ledger",
    defaults: { currentAssets: 420000, currentLiabilities: 265000, currency: "USD" },
    mainFields: [
      moneyField("currentAssets", "Current assets", 100),
      moneyField("currentLiabilities", "Current liabilities", 100),
    ],
    advancedFields: [currencyField()],
    validate() {
      return "";
    },
    compute(values) {
      const workingCapital = values.currentAssets - values.currentLiabilities;
      return result(
        "Working capital estimate",
        [
          card("Working capital", moneyText(workingCapital, values.currency, 2)),
          card("Current assets", moneyText(values.currentAssets, values.currency, 2)),
          card("Current liabilities", moneyText(values.currentLiabilities, values.currency, 2)),
        ],
        [
          moneyBar("Current assets", values.currentAssets, values.currency, 2),
          moneyBar("Current liabilities", values.currentLiabilities, values.currency, 2),
          moneyBar("Working capital", workingCapital, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeRevenueGrowthConfig() {
  return {
    title: "Revenue Growth Calculator",
    actionLabel: "Calculate revenue growth",
    emptyState: "Estimate period-over-period revenue growth from previous and current revenue.",
    summaryLabel: "Revenue growth",
    defaultHistoryLabel: "Revenue growth scenario",
    categorySlug: "finance",
    badge: "Growth",
    surfaceStyle: "ledger",
    defaults: { previousRevenue: 820000, currentRevenue: 950000, currency: "USD" },
    mainFields: [
      moneyField("previousRevenue", "Previous period revenue", 100),
      moneyField("currentRevenue", "Current period revenue", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.previousRevenue <= 0 ? "Previous period revenue must be greater than zero." : "";
    },
    compute(values) {
      const growth = ((values.currentRevenue - values.previousRevenue) / values.previousRevenue) * 100;
      return result(
        "Revenue growth estimate",
        [
          card("Revenue growth", percentText(growth)),
          card("Current revenue", moneyText(values.currentRevenue, values.currency, 2)),
          card("Previous revenue", moneyText(values.previousRevenue, values.currency, 2)),
        ],
        [
          moneyBar("Previous revenue", values.previousRevenue, values.currency, 2),
          moneyBar("Current revenue", values.currentRevenue, values.currency, 2),
          moneyBar("Revenue change", values.currentRevenue - values.previousRevenue, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeRevenueConfig() {
  return {
    title: "Revenue Calculator",
    actionLabel: "Calculate revenue",
    emptyState: "Estimate revenue from average price and units sold.",
    summaryLabel: "Revenue estimate",
    defaultHistoryLabel: "Revenue scenario",
    categorySlug: "finance",
    badge: "Sales",
    surfaceStyle: "ledger",
    defaults: { averagePrice: 48, unitsSold: 1800, currency: "USD" },
    mainFields: [
      moneyField("averagePrice", "Average selling price", 0.01),
      numberField("unitsSold", "Units sold", 1, 1000000000, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.unitsSold <= 0 ? "Units sold must be greater than zero." : "";
    },
    compute(values) {
      const revenue = values.averagePrice * values.unitsSold;
      return result(
        "Revenue estimate",
        [
          card("Revenue", moneyText(revenue, values.currency, 2)),
          card("Average price", moneyText(values.averagePrice, values.currency, 2)),
          card("Units sold", count(values.unitsSold)),
        ],
        [
          moneyBar("Average price", values.averagePrice, values.currency, 2),
          plainBar("Units sold", values.unitsSold, count(values.unitsSold)),
          moneyBar("Revenue", revenue, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeAnnualIncomeConfig() {
  return {
    title: "Annual Income Calculator",
    actionLabel: "Calculate annual income",
    emptyState: "Estimate annual income from hourly pay, hours per week, and weeks worked.",
    summaryLabel: "Annual income estimate",
    defaultHistoryLabel: "Annual income scenario",
    categorySlug: "salary-data",
    badge: "Pay",
    surfaceStyle: "salarySplit",
    aliases: ["annual salary calculator", "salary calculator"],
    defaults: { hourlyRate: 32, hoursPerWeek: 40, weeksPerYear: 50, currency: "USD" },
    mainFields: [
      moneyField("hourlyRate", "Hourly rate", 0.01),
      numberField("hoursPerWeek", "Hours per week", 1, 80, 0.5),
      numberField("weeksPerYear", "Weeks per year", 1, 52, 0.5),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.hourlyRate <= 0) return "Enter an hourly rate.";
      if (values.hoursPerWeek <= 0) return "Hours per week must be greater than zero.";
      return values.weeksPerYear <= 0 ? "Weeks per year must be greater than zero." : "";
    },
    compute(values) {
      const annualIncome = values.hourlyRate * values.hoursPerWeek * values.weeksPerYear;
      const monthlyIncome = annualIncome / 12;
      return result(
        "Annual income estimate",
        [
          card("Annual income", moneyText(annualIncome, values.currency, 2)),
          card("Monthly income", moneyText(monthlyIncome, values.currency, 2)),
          card("Weekly pay", moneyText(values.hourlyRate * values.hoursPerWeek, values.currency, 2)),
        ],
        [
          moneyBar("Annual income", annualIncome, values.currency, 2),
          moneyBar("Monthly income", monthlyIncome, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeBillableHoursConfig() {
  return {
    title: "Billable Hours Calculator",
    actionLabel: "Calculate billable hours",
    emptyState: "Estimate billable hours and billable revenue from logged work time and utilization assumptions.",
    summaryLabel: "Billable hours estimate",
    defaultHistoryLabel: "Billable hours scenario",
    categorySlug: "salary-data",
    badge: "Freelance",
    surfaceStyle: "salarySplit",
    defaults: { totalHoursWorked: 160, utilizationPercent: 72, hourlyRate: 95, currency: "USD" },
    mainFields: [
      numberField("totalHoursWorked", "Total hours worked", 1, 100000, 1),
      percentField("utilizationPercent", "Billable utilization", 0, 100, 0.1),
      moneyField("hourlyRate", "Billable hourly rate", 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.totalHoursWorked <= 0 ? "Total hours worked must be greater than zero." : "";
    },
    compute(values) {
      const billableHours = values.totalHoursWorked * (values.utilizationPercent / 100);
      const billableRevenue = billableHours * values.hourlyRate;
      return result(
        "Billable hours estimate",
        [
          card("Billable hours", fixed(billableHours)),
          card("Billable revenue", moneyText(billableRevenue, values.currency, 2)),
          card("Utilization", percentText(values.utilizationPercent)),
        ],
        [
          plainBar("Total hours worked", values.totalHoursWorked, count(values.totalHoursWorked)),
          plainBar("Billable hours", billableHours, fixed(billableHours)),
          moneyBar("Billable revenue", billableRevenue, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeMileageReimbursementConfig() {
  return {
    title: "Mileage Reimbursement Calculator",
    actionLabel: "Calculate reimbursement",
    emptyState: "Estimate mileage reimbursement from miles driven and the reimbursement rate.",
    summaryLabel: "Mileage reimbursement estimate",
    defaultHistoryLabel: "Mileage reimbursement scenario",
    categorySlug: "salary-data",
    badge: "Travel",
    surfaceStyle: "salarySplit",
    defaults: { milesDriven: 820, reimbursementRate: 0.67, currency: "USD" },
    mainFields: [
      numberField("milesDriven", "Miles driven", 1, 1000000, 1),
      moneyField("reimbursementRate", "Rate per mile", 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.milesDriven <= 0 ? "Miles driven must be greater than zero." : "";
    },
    compute(values) {
      const reimbursement = values.milesDriven * values.reimbursementRate;
      return result(
        "Mileage reimbursement estimate",
        [
          card("Reimbursement", moneyText(reimbursement, values.currency, 2)),
          card("Miles driven", count(values.milesDriven)),
          card("Rate per mile", moneyText(values.reimbursementRate, values.currency, 2)),
        ],
        [
          plainBar("Miles driven", values.milesDriven, count(values.milesDriven)),
          moneyBar("Rate per mile", values.reimbursementRate, values.currency, 2),
          moneyBar("Reimbursement", reimbursement, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeProratedSalaryConfig() {
  return {
    title: "Prorated Salary Calculator",
    actionLabel: "Calculate prorated salary",
    emptyState: "Estimate prorated pay when only part of the year or month is worked.",
    summaryLabel: "Prorated salary estimate",
    defaultHistoryLabel: "Prorated salary scenario",
    categorySlug: "salary-data",
    badge: "Pay",
    surfaceStyle: "salarySplit",
    defaults: { annualSalary: 84000, workdaysWorked: 14, totalWorkdaysInPeriod: 22, currency: "USD" },
    mainFields: [
      moneyField("annualSalary", "Annual salary", 100),
      numberField("workdaysWorked", "Workdays worked in period", 1, 366, 1),
      numberField("totalWorkdaysInPeriod", "Total workdays in period", 1, 366, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.totalWorkdaysInPeriod <= 0 ? "Total workdays in period must be greater than zero." : "";
    },
    compute(values) {
      const monthlySalary = values.annualSalary / 12;
      const proratedPay = monthlySalary * (values.workdaysWorked / Math.max(values.totalWorkdaysInPeriod, 1));
      return result(
        "Prorated salary estimate",
        [
          card("Prorated pay", moneyText(proratedPay, values.currency, 2)),
          card("Monthly salary basis", moneyText(monthlySalary, values.currency, 2)),
          card("Workdays worked", count(values.workdaysWorked)),
        ],
        [
          moneyBar("Monthly salary basis", monthlySalary, values.currency, 2),
          moneyBar("Prorated pay", proratedPay, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeFiftyThirtyTwentyConfig() {
  return {
    title: "50/30/20 Rule Calculator",
    actionLabel: "Calculate budget split",
    emptyState: "Estimate needs, wants, and savings targets from monthly take-home pay.",
    summaryLabel: "50/30/20 budget split",
    defaultHistoryLabel: "50/30/20 scenario",
    categorySlug: "tax-budget",
    badge: "Budget",
    surfaceStyle: "taxGrid",
    defaults: { monthlyTakeHomePay: 5200, currency: "USD" },
    mainFields: [moneyField("monthlyTakeHomePay", "Monthly take-home pay", 1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.monthlyTakeHomePay <= 0 ? "Monthly take-home pay must be greater than zero." : "";
    },
    compute(values) {
      const needs = values.monthlyTakeHomePay * 0.5;
      const wants = values.monthlyTakeHomePay * 0.3;
      const savings = values.monthlyTakeHomePay * 0.2;
      return result(
        "50/30/20 budget split",
        [
          card("Needs", moneyText(needs, values.currency, 2)),
          card("Wants", moneyText(wants, values.currency, 2)),
          card("Savings", moneyText(savings, values.currency, 2)),
          card("Take-home pay", moneyText(values.monthlyTakeHomePay, values.currency, 2)),
        ],
        [
          moneyBar("Needs", needs, values.currency, 2),
          moneyBar("Wants", wants, values.currency, 2),
          moneyBar("Savings", savings, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeAmortizedLoanConfig({
  title,
  actionLabel,
  emptyState,
  summaryLabel,
  defaultHistoryLabel,
  categorySlug,
  badge,
  aliases = [],
  defaults,
  resultTitle,
}) {
  return {
    title,
    actionLabel,
    emptyState,
    summaryLabel,
    defaultHistoryLabel,
    categorySlug,
    badge,
    aliases,
    surfaceStyle: "loanSplit",
    defaults,
    mainFields: [
      moneyField("principal", "Loan amount", 100),
      percentField("annualRate", "Interest rate", 0, 50, 0.1),
      numberField("years", "Loan term (years)", 1, 40, 1),
      moneyField("extraPayment", "Extra monthly payment", 10),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.principal <= 0) return "Enter a loan amount.";
      if (values.years <= 0) return "Loan term must be greater than zero.";
      return "";
    },
    compute(values) {
      return computeAmortizedLoanResult({
        title: resultTitle,
        values,
        paymentLabel: "Monthly payment",
      });
    },
  };
}

function makeMortgageComparisonConfig() {
  return {
    title: "Mortgage Comparison Calculator",
    actionLabel: "Compare mortgage options",
    emptyState: "Compare two mortgage offers side by side by payment, total interest, and total paid.",
    summaryLabel: "Mortgage comparison",
    defaultHistoryLabel: "Mortgage comparison scenario",
    categorySlug: "mortgage-data",
    badge: "Mortgage",
    surfaceStyle: "loanSplit",
    aliases: ["compare mortgage rates calculator"],
    defaults: {
      principal: 360000,
      annualRateA: 6.35,
      yearsA: 30,
      annualRateB: 5.95,
      yearsB: 15,
      currency: "USD",
    },
    mainFields: [
      moneyField("principal", "Loan amount", 100),
      percentField("annualRateA", "Option A rate", 0, 50, 0.1),
      numberField("yearsA", "Option A term (years)", 1, 40, 1),
      percentField("annualRateB", "Option B rate", 0, 50, 0.1),
      numberField("yearsB", "Option B term (years)", 1, 40, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.principal <= 0 ? "Enter a mortgage amount." : "";
    },
    compute(values) {
      const monthsA = Math.max(1, Math.round(values.yearsA * 12));
      const monthsB = Math.max(1, Math.round(values.yearsB * 12));
      const paymentA = getAmortizedPayment(values.principal, values.annualRateA, monthsA);
      const paymentB = getAmortizedPayment(values.principal, values.annualRateB, monthsB);
      const totalInterestA = paymentA * monthsA - values.principal;
      const totalInterestB = paymentB * monthsB - values.principal;
      const totalPaidA = paymentA * monthsA;
      const totalPaidB = paymentB * monthsB;
      const cheaperMonthly = paymentA <= paymentB ? "Option A" : "Option B";
      const lowerLifetime = totalInterestA <= totalInterestB ? "Option A" : "Option B";

      return result(
        "Mortgage option comparison",
        [
          card("Lower monthly payment", cheaperMonthly),
          card("Lower lifetime interest", lowerLifetime),
          card("Option A payment", moneyText(paymentA, values.currency, 2)),
          card("Option B payment", moneyText(paymentB, values.currency, 2)),
        ],
        [
          moneyBar("Option A total interest", totalInterestA, values.currency, 2),
          moneyBar("Option B total interest", totalInterestB, values.currency, 2),
          moneyBar("Option A total paid", totalPaidA, values.currency, 2),
          moneyBar("Option B total paid", totalPaidB, values.currency, 2),
        ],
        [
          `${cheaperMonthly} keeps the monthly payment lower with the current rate and term assumptions.`,
          `${lowerLifetime} produces less lifetime interest under the current setup.`,
        ],
        [],
        {
          table: {
            title: "Offer comparison",
            headers: ["Metric", "Option A", "Option B"],
            rows: [
              { cells: ["Rate", percentText(values.annualRateA), percentText(values.annualRateB)] },
              { cells: ["Term", `${values.yearsA} years`, `${values.yearsB} years`] },
              { cells: ["Monthly payment", moneyText(paymentA, values.currency, 2), moneyText(paymentB, values.currency, 2)] },
              { cells: ["Total interest", moneyText(totalInterestA, values.currency, 2), moneyText(totalInterestB, values.currency, 2)] },
              { cells: ["Total paid", moneyText(totalPaidA, values.currency, 2), moneyText(totalPaidB, values.currency, 2)] },
            ],
          },
        },
      );
    },
  };
}

function makeMortgagePayoffConfig() {
  return {
    title: "Mortgage Payoff Calculator",
    actionLabel: "Calculate mortgage payoff plan",
    emptyState: "Estimate how extra monthly payments change payoff time and total interest.",
    summaryLabel: "Mortgage payoff estimate",
    defaultHistoryLabel: "Mortgage payoff scenario",
    categorySlug: "mortgage-data",
    badge: "Mortgage",
    surfaceStyle: "loanSplit",
    aliases: ["mortgage with extra payments calculator"],
    defaults: { principal: 360000, annualRate: 6.5, years: 30, extraPayment: 250, currency: "USD" },
    mainFields: [
      moneyField("principal", "Current mortgage balance", 100),
      percentField("annualRate", "Interest rate", 0, 50, 0.1),
      numberField("years", "Years remaining", 1, 40, 1),
      moneyField("extraPayment", "Extra monthly payment", 10),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.principal <= 0 ? "Enter a mortgage balance." : "";
    },
    compute(values) {
      const months = Math.max(1, Math.round(values.years * 12));
      const basePayment = getAmortizedPayment(values.principal, values.annualRate, months);
      const baseSchedule = buildAmortization({
        principal: values.principal,
        annualRate: values.annualRate,
        payment: basePayment,
        currency: values.currency,
      });
      const fasterSchedule = buildAmortization({
        principal: values.principal,
        annualRate: values.annualRate,
        payment: basePayment + values.extraPayment,
        currency: values.currency,
      });
      const monthsSaved = Math.max(0, baseSchedule.months - fasterSchedule.months);
      const interestSaved = Math.max(0, baseSchedule.totalInterest - fasterSchedule.totalInterest);

      return result(
        "Mortgage payoff plan",
        [
          card("Standard payment", moneyText(basePayment, values.currency, 2)),
          card("Accelerated payment", moneyText(basePayment + values.extraPayment, values.currency, 2)),
          card("Months saved", `${count(monthsSaved)} months`),
          card("Interest saved", moneyText(interestSaved, values.currency, 2)),
        ],
        [
          moneyBar("Standard total interest", baseSchedule.totalInterest, values.currency, 2),
          moneyBar("Accelerated total interest", fasterSchedule.totalInterest, values.currency, 2),
          moneyBar("Interest saved", interestSaved, values.currency, 2),
        ],
        [
          monthsSaved > 0
            ? `An extra ${moneyText(values.extraPayment, values.currency, 2)} each month trims about ${count(monthsSaved)} months off the payoff path.`
            : "The current extra payment is too small to materially change the payoff path.",
        ],
        [],
        {
          table: {
            title: "Payoff comparison",
            headers: ["Plan", "Monthly payment", "Payoff time", "Total interest"],
            rows: [
              {
                cells: [
                  "Standard",
                  moneyText(basePayment, values.currency, 2),
                  `${baseSchedule.months} months`,
                  moneyText(baseSchedule.totalInterest, values.currency, 2),
                ],
              },
              {
                cells: [
                  "With extra payment",
                  moneyText(basePayment + values.extraPayment, values.currency, 2),
                  `${fasterSchedule.months} months`,
                  moneyText(fasterSchedule.totalInterest, values.currency, 2),
                ],
              },
            ],
          },
        },
      );
    },
  };
}

function makeMortgageRefinanceConfig() {
  return {
    title: "Mortgage Refinance Calculator",
    actionLabel: "Calculate refinance savings",
    emptyState: "Estimate monthly savings, total interest change, and break-even timing for a refinance.",
    summaryLabel: "Mortgage refinance estimate",
    defaultHistoryLabel: "Mortgage refinance scenario",
    categorySlug: "mortgage-data",
    badge: "Refi",
    surfaceStyle: "loanSplit",
    aliases: ["refinance break-even calculator"],
    defaults: {
      currentBalance: 325000,
      currentRate: 7.1,
      yearsRemaining: 26,
      newRate: 6.15,
      newYears: 25,
      refinanceCosts: 6200,
      currency: "USD",
    },
    mainFields: [
      moneyField("currentBalance", "Current balance", 100),
      percentField("currentRate", "Current rate", 0, 50, 0.1),
      numberField("yearsRemaining", "Years remaining", 1, 40, 1),
      percentField("newRate", "New rate", 0, 50, 0.1),
      numberField("newYears", "New term (years)", 1, 40, 1),
      moneyField("refinanceCosts", "Refinance costs", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.currentBalance <= 0 ? "Enter the current loan balance." : "";
    },
    compute(values) {
      const currentMonths = Math.max(1, Math.round(values.yearsRemaining * 12));
      const newMonths = Math.max(1, Math.round(values.newYears * 12));
      const currentPayment = getAmortizedPayment(values.currentBalance, values.currentRate, currentMonths);
      const newPayment = getAmortizedPayment(values.currentBalance, values.newRate, newMonths);
      const monthlySavings = currentPayment - newPayment;
      const currentInterest = currentPayment * currentMonths - values.currentBalance;
      const newInterest = newPayment * newMonths - values.currentBalance + values.refinanceCosts;
      const lifetimeSavings = currentInterest - newInterest;
      const breakEvenMonths = monthlySavings > 0 ? Math.ceil(values.refinanceCosts / monthlySavings) : Infinity;

      return result(
        "Mortgage refinance estimate",
        [
          card("Current payment", moneyText(currentPayment, values.currency, 2)),
          card("Refinanced payment", moneyText(newPayment, values.currency, 2)),
          card("Monthly savings", moneyText(monthlySavings, values.currency, 2)),
          card("Break-even", breakEvenMonths === Infinity ? "No break-even" : `${count(breakEvenMonths)} months`),
        ],
        [
          moneyBar("Current remaining interest", currentInterest, values.currency, 2),
          moneyBar("New remaining interest + costs", newInterest, values.currency, 2),
          moneyBar("Lifetime savings", lifetimeSavings, values.currency, 2),
        ],
        [
          monthlySavings > 0
            ? `At the current assumptions, the refinance trims about ${moneyText(monthlySavings, values.currency, 2)} from the monthly payment.`
            : "The new mortgage does not lower the monthly payment with the current assumptions.",
        ],
        [],
        {
          table: {
            title: "Refinance view",
            headers: ["Metric", "Current loan", "Refinanced loan"],
            rows: [
              { cells: ["Rate", percentText(values.currentRate), percentText(values.newRate)] },
              { cells: ["Term", `${values.yearsRemaining} years`, `${values.newYears} years`] },
              { cells: ["Monthly payment", moneyText(currentPayment, values.currency, 2), moneyText(newPayment, values.currency, 2)] },
              { cells: ["Remaining interest", moneyText(currentInterest, values.currency, 2), moneyText(newInterest, values.currency, 2)] },
            ],
            footnote: "Refinance side includes closing costs in the remaining-interest figure.",
          },
        },
      );
    },
  };
}

function makePmiConfig() {
  return {
    title: "PMI Calculator",
    actionLabel: "Calculate PMI",
    emptyState: "Estimate monthly PMI, loan-to-value ratio, and the monthly payment impact on a low-down-payment mortgage.",
    summaryLabel: "PMI estimate",
    defaultHistoryLabel: "PMI scenario",
    categorySlug: "mortgage-data",
    badge: "Mortgage",
    surfaceStyle: "loanSplit",
    aliases: ["private mortgage insurance calculator"],
    defaults: {
      homePrice: 450000,
      downPayment: 45000,
      annualPmiRate: 0.75,
      annualRate: 6.4,
      years: 30,
      currency: "USD",
    },
    mainFields: [
      moneyField("homePrice", "Home price", 100),
      moneyField("downPayment", "Down payment", 100),
      percentField("annualPmiRate", "Annual PMI rate", 0, 5, 0.01),
      percentField("annualRate", "Mortgage rate", 0, 50, 0.1),
      numberField("years", "Loan term (years)", 1, 40, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.homePrice <= 0) return "Enter a home price.";
      if (values.downPayment >= values.homePrice) return "Down payment must be lower than the home price.";
      return "";
    },
    compute(values) {
      const loanAmount = Math.max(0, values.homePrice - values.downPayment);
      const ltv = values.homePrice > 0 ? (loanAmount / values.homePrice) * 100 : 0;
      const monthlyPmi = ltv > 80 ? loanAmount * (values.annualPmiRate / 100) / 12 : 0;
      const basePayment = getAmortizedPayment(loanAmount, values.annualRate, values.years * 12);

      return result(
        "PMI payment estimate",
        [
          card("Loan-to-value", percentText(ltv)),
          card("Monthly PMI", moneyText(monthlyPmi, values.currency, 2)),
          card("Mortgage payment", moneyText(basePayment, values.currency, 2)),
          card("Payment with PMI", moneyText(basePayment + monthlyPmi, values.currency, 2)),
        ],
        [
          moneyBar("Loan amount", loanAmount, values.currency, 2),
          moneyBar("Monthly PMI", monthlyPmi, values.currency, 2),
          moneyBar("Mortgage payment", basePayment, values.currency, 2),
        ],
        [
          ltv > 80
            ? "The current down payment leaves the loan above the common 80% LTV cutoff, so PMI is included."
            : "The current down payment keeps the loan at or below 80% LTV, so PMI is not needed in this estimate.",
        ],
        [],
      );
    },
  };
}

function makeHomeAffordabilityConfig() {
  return {
    title: "Home Affordability Calculator",
    actionLabel: "Calculate home affordability",
    emptyState: "Estimate the home price your monthly income can support after debts and down payment.",
    summaryLabel: "Home affordability estimate",
    defaultHistoryLabel: "Home affordability scenario",
    categorySlug: "mortgage-data",
    badge: "Mortgage",
    surfaceStyle: "loanSplit",
    aliases: ["house affordability calculator"],
    defaults: {
      grossMonthlyIncome: 9800,
      monthlyDebtPayments: 900,
      downPayment: 60000,
      maxDtiPercent: 36,
      annualRate: 6.4,
      years: 30,
      currency: "USD",
    },
    mainFields: [
      moneyField("grossMonthlyIncome", "Gross monthly income", 100),
      moneyField("monthlyDebtPayments", "Monthly debt payments", 10),
      moneyField("downPayment", "Down payment", 100),
      percentField("maxDtiPercent", "Max debt-to-income ratio", 1, 60, 0.5),
      percentField("annualRate", "Mortgage rate", 0, 50, 0.1),
      numberField("years", "Loan term (years)", 1, 40, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.grossMonthlyIncome <= 0 ? "Enter a gross monthly income." : "";
    },
    compute(values) {
      const maxHousingPayment = Math.max(0, values.grossMonthlyIncome * (values.maxDtiPercent / 100) - values.monthlyDebtPayments);
      const maxLoan = solvePrincipalFromPayment(maxHousingPayment, values.annualRate, values.years * 12);
      const maxHomePrice = maxLoan + values.downPayment;

      return result(
        "Home affordability estimate",
        [
          card("Affordable home price", moneyText(maxHomePrice, values.currency, 2)),
          card("Max loan amount", moneyText(maxLoan, values.currency, 2)),
          card("Max housing payment", moneyText(maxHousingPayment, values.currency, 2)),
          card("Down payment", moneyText(values.downPayment, values.currency, 2)),
        ],
        [
          moneyBar("Affordable home price", maxHomePrice, values.currency, 2),
          moneyBar("Max loan amount", maxLoan, values.currency, 2),
          moneyBar("Max housing payment", maxHousingPayment, values.currency, 2),
        ],
        [
          maxHousingPayment > 0
            ? `After existing debts, the current DTI target leaves about ${moneyText(maxHousingPayment, values.currency, 2)} for the mortgage payment each month.`
            : "Existing debts already consume the full DTI allowance, so the current setup leaves no room for a mortgage payment.",
        ],
        [note("DTI target", percentText(values.maxDtiPercent))],
      );
    },
  };
}

function makeDebtToIncomeConfig() {
  return {
    title: "Debt to Income Ratio Calculator",
    actionLabel: "Calculate DTI",
    emptyState: "Estimate total monthly debt load relative to gross monthly income.",
    summaryLabel: "Debt-to-income estimate",
    defaultHistoryLabel: "Debt-to-income scenario",
    categorySlug: "mortgage-data",
    badge: "Mortgage",
    surfaceStyle: "taxGrid",
    aliases: ["dti calculator"],
    defaults: { grossMonthlyIncome: 8200, monthlyDebtPayments: 1450, monthlyHousingPayment: 2200, currency: "USD" },
    mainFields: [
      moneyField("grossMonthlyIncome", "Gross monthly income", 100),
      moneyField("monthlyDebtPayments", "Other monthly debt payments", 10),
      moneyField("monthlyHousingPayment", "Monthly housing payment", 10),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.grossMonthlyIncome <= 0 ? "Enter a gross monthly income." : "";
    },
    compute(values) {
      const totalDebt = values.monthlyDebtPayments + values.monthlyHousingPayment;
      const dti = (totalDebt / Math.max(values.grossMonthlyIncome, 1)) * 100;

      return result(
        "Debt-to-income ratio estimate",
        [
          card("DTI ratio", percentText(dti)),
          card("Monthly debt load", moneyText(totalDebt, values.currency, 2)),
          card("Gross monthly income", moneyText(values.grossMonthlyIncome, values.currency, 2)),
        ],
        [
          moneyBar("Debt load", totalDebt, values.currency, 2),
          moneyBar("Gross income", values.grossMonthlyIncome, values.currency, 2),
        ],
        [
          dti <= 36
            ? "This ratio sits within a common conventional-mortgage comfort zone."
            : "This ratio runs above the common conventional-mortgage comfort zone and may pressure affordability.",
        ],
        [],
      );
    },
  };
}

function makeRentalPropertyConfig() {
  return {
    title: "Rental Property Calculator",
    actionLabel: "Calculate rental property return",
    emptyState: "Estimate cash flow, cap rate, and cash-on-cash return from rent, vacancy, expenses, and financing.",
    summaryLabel: "Rental property estimate",
    defaultHistoryLabel: "Rental property scenario",
    categorySlug: "mortgage-data",
    badge: "Rental",
    surfaceStyle: "investment",
    defaults: {
      purchasePrice: 320000,
      downPayment: 64000,
      closingCosts: 9000,
      monthlyRent: 2600,
      vacancyRatePercent: 5,
      monthlyOperatingCosts: 620,
      annualRate: 6.8,
      years: 30,
      currency: "USD",
    },
    mainFields: [
      moneyField("purchasePrice", "Purchase price", 100),
      moneyField("downPayment", "Down payment", 100),
      moneyField("closingCosts", "Closing costs", 100),
      moneyField("monthlyRent", "Monthly rent", 10),
      percentField("vacancyRatePercent", "Vacancy rate", 0, 40, 0.1),
      moneyField("monthlyOperatingCosts", "Monthly operating costs", 10),
      percentField("annualRate", "Mortgage rate", 0, 50, 0.1),
      numberField("years", "Loan term (years)", 1, 40, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.purchasePrice <= 0) return "Enter a purchase price.";
      if (values.downPayment >= values.purchasePrice) return "Down payment must be lower than the purchase price.";
      return "";
    },
    compute(values) {
      const loanAmount = Math.max(0, values.purchasePrice - values.downPayment);
      const mortgagePayment = getAmortizedPayment(loanAmount, values.annualRate, values.years * 12);
      const effectiveRent = values.monthlyRent * (1 - values.vacancyRatePercent / 100);
      const monthlyCashFlow = effectiveRent - values.monthlyOperatingCosts - mortgagePayment;
      const annualNoi = (effectiveRent - values.monthlyOperatingCosts) * 12;
      const capRate = (annualNoi / Math.max(values.purchasePrice, 1)) * 100;
      const cashInvested = values.downPayment + values.closingCosts;
      const cashOnCash = cashInvested > 0 ? (monthlyCashFlow * 12 / cashInvested) * 100 : 0;

      return result(
        "Rental property return estimate",
        [
          card("Monthly cash flow", moneyText(monthlyCashFlow, values.currency, 2)),
          card("Cap rate", percentText(capRate)),
          card("Cash-on-cash return", percentText(cashOnCash)),
          card("Mortgage payment", moneyText(mortgagePayment, values.currency, 2)),
        ],
        [
          moneyBar("Effective monthly rent", effectiveRent, values.currency, 2),
          moneyBar("Mortgage payment", mortgagePayment, values.currency, 2),
          moneyBar("Monthly operating costs", values.monthlyOperatingCosts, values.currency, 2),
          moneyBar("Monthly cash flow", monthlyCashFlow, values.currency, 2),
        ],
        [
          monthlyCashFlow >= 0
            ? "The current rent and cost assumptions keep the property cash-flow positive."
            : "The current rent and cost assumptions leave the property cash-flow negative before reserves.",
        ],
        [
          note("Annual NOI", moneyText(annualNoi, values.currency, 2)),
          note("Cash invested", moneyText(cashInvested, values.currency, 2)),
        ],
      );
    },
  };
}

function makeFourOhOneKConfig() {
  return {
    title: "401k Calculator",
    actionLabel: "Calculate 401k growth",
    emptyState: "Estimate retirement account growth from your current balance, annual contribution, employer match, and expected return.",
    summaryLabel: "401k estimate",
    defaultHistoryLabel: "401k scenario",
    categorySlug: "finance",
    badge: "Retirement",
    surfaceStyle: "investment",
    aliases: ["401(k) calculator"],
    defaults: {
      currentBalance: 85000,
      annualContribution: 19500,
      employerMatchPercent: 50,
      annualReturnPercent: 7,
      years: 22,
      currency: "USD",
    },
    mainFields: [
      moneyField("currentBalance", "Current 401k balance", 100),
      moneyField("annualContribution", "Annual contribution", 100),
      percentField("employerMatchPercent", "Employer match on contribution", 0, 200, 1),
      percentField("annualReturnPercent", "Annual return", -100, 100, 0.1),
      numberField("years", "Years until retirement", 1, 60, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.years <= 0 ? "Years until retirement must be greater than zero." : "";
    },
    compute(values) {
      const annualTotalContribution = values.annualContribution * (1 + values.employerMatchPercent / 100);
      const projection = buildContributionProjection({
        startingBalance: values.currentBalance,
        annualContribution: annualTotalContribution,
        annualReturnPercent: values.annualReturnPercent,
        years: values.years,
        currency: values.currency,
      });

      return result(
        "401k growth estimate",
        [
          card("Future balance", moneyText(projection.futureValue, values.currency, 2)),
          card("Your annual contribution", moneyText(values.annualContribution, values.currency, 2)),
          card("Employer match", moneyText(annualTotalContribution - values.annualContribution, values.currency, 2)),
          card("Investment growth", moneyText(projection.growth, values.currency, 2)),
        ],
        [
          moneyBar("Starting balance", values.currentBalance, values.currency, 2),
          moneyBar("Total annual contribution", annualTotalContribution, values.currency, 2),
          moneyBar("Future balance", projection.futureValue, values.currency, 2),
        ],
        [],
        [],
        {
          table: {
            title: "Retirement growth checkpoints",
            headers: ["Year", "Total contributions", "Projected balance"],
            rows: projection.rows,
          },
        },
      );
    },
  };
}

function makeIraConfig() {
  return {
    title: "IRA Calculator",
    actionLabel: "Calculate IRA growth",
    emptyState: "Estimate IRA growth from current balance, annual contribution, and expected return.",
    summaryLabel: "IRA estimate",
    defaultHistoryLabel: "IRA scenario",
    categorySlug: "finance",
    badge: "Retirement",
    surfaceStyle: "investment",
    aliases: ["traditional ira calculator"],
    defaults: { currentBalance: 42000, annualContribution: 7000, annualReturnPercent: 7, years: 20, currency: "USD" },
    mainFields: [
      moneyField("currentBalance", "Current IRA balance", 100),
      moneyField("annualContribution", "Annual contribution", 100),
      percentField("annualReturnPercent", "Annual return", -100, 100, 0.1),
      numberField("years", "Years until retirement", 1, 60, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.years <= 0 ? "Years until retirement must be greater than zero." : "";
    },
    compute(values) {
      const projection = buildContributionProjection({
        startingBalance: values.currentBalance,
        annualContribution: values.annualContribution,
        annualReturnPercent: values.annualReturnPercent,
        years: values.years,
        currency: values.currency,
      });

      return result(
        "IRA growth estimate",
        [
          card("Future balance", moneyText(projection.futureValue, values.currency, 2)),
          card("Total contributions", moneyText(projection.totalContributions, values.currency, 2)),
          card("Investment growth", moneyText(projection.growth, values.currency, 2)),
          card("Years modeled", `${count(values.years)} years`),
        ],
        [
          moneyBar("Starting balance", values.currentBalance, values.currency, 2),
          moneyBar("Total contributions", projection.totalContributions, values.currency, 2),
          moneyBar("Future balance", projection.futureValue, values.currency, 2),
        ],
        [],
        [],
        {
          table: {
            title: "IRA growth checkpoints",
            headers: ["Year", "Total contributions", "Projected balance"],
            rows: projection.rows,
          },
        },
      );
    },
  };
}

function makeAnnuityConfig() {
  return {
    title: "Annuity Calculator",
    actionLabel: "Calculate annuity growth",
    emptyState: "Estimate the future value of a lump sum plus recurring contributions under a fixed annual return assumption.",
    summaryLabel: "Annuity estimate",
    defaultHistoryLabel: "Annuity scenario",
    categorySlug: "finance",
    badge: "Retirement",
    surfaceStyle: "investment",
    defaults: { initialAmount: 25000, monthlyContribution: 600, annualReturnPercent: 6, years: 18, currency: "USD" },
    mainFields: [
      moneyField("initialAmount", "Initial amount", 100),
      moneyField("monthlyContribution", "Monthly contribution", 10),
      percentField("annualReturnPercent", "Annual return", -100, 100, 0.1),
      numberField("years", "Years invested", 1, 60, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.years <= 0 ? "Years invested must be greater than zero." : "";
    },
    compute(values) {
      const projection = buildContributionProjection({
        startingBalance: values.initialAmount,
        annualContribution: values.monthlyContribution * 12,
        annualReturnPercent: values.annualReturnPercent,
        years: values.years,
        currency: values.currency,
      });

      return result(
        "Annuity growth estimate",
        [
          card("Future value", moneyText(projection.futureValue, values.currency, 2)),
          card("Total contributions", moneyText(projection.totalContributions, values.currency, 2)),
          card("Investment growth", moneyText(projection.growth, values.currency, 2)),
          card("Monthly contribution", moneyText(values.monthlyContribution, values.currency, 2)),
        ],
        [
          moneyBar("Initial amount", values.initialAmount, values.currency, 2),
          moneyBar("Total contributions", projection.totalContributions, values.currency, 2),
          moneyBar("Future value", projection.futureValue, values.currency, 2),
        ],
        [],
        [],
        {
          table: {
            title: "Growth checkpoints",
            headers: ["Year", "Total contributions", "Projected value"],
            rows: projection.rows,
          },
        },
      );
    },
  };
}

function makeEmergencyFundConfig() {
  return {
    title: "Emergency Fund Calculator",
    actionLabel: "Calculate emergency fund target",
    emptyState: "Estimate the savings buffer you need and how long it will take to build it.",
    summaryLabel: "Emergency fund estimate",
    defaultHistoryLabel: "Emergency fund scenario",
    categorySlug: "tax-budget",
    badge: "Savings",
    surfaceStyle: "investment",
    defaults: { monthlyExpenses: 3800, targetMonths: 6, currentSavings: 8500, monthlyContribution: 650, currency: "USD" },
    mainFields: [
      moneyField("monthlyExpenses", "Monthly essential expenses", 10),
      numberField("targetMonths", "Target months of coverage", 1, 24, 1),
      moneyField("currentSavings", "Current savings", 100),
      moneyField("monthlyContribution", "Monthly contribution", 10),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.monthlyExpenses <= 0) return "Monthly expenses must be greater than zero.";
      return values.targetMonths <= 0 ? "Target coverage must be greater than zero." : "";
    },
    compute(values) {
      const target = values.monthlyExpenses * values.targetMonths;
      const gap = Math.max(0, target - values.currentSavings);
      const monthsToGoal = gap === 0 ? 0 : values.monthlyContribution > 0 ? Math.ceil(gap / values.monthlyContribution) : Infinity;

      return result(
        "Emergency fund target",
        [
          card("Target fund", moneyText(target, values.currency, 2)),
          card("Current gap", moneyText(gap, values.currency, 2)),
          card("Months to goal", monthsToGoal === Infinity ? "No end date" : `${count(monthsToGoal)} months`),
          card("Current coverage", `${fixed(values.currentSavings / Math.max(values.monthlyExpenses, 1))} months`),
        ],
        [
          moneyBar("Target fund", target, values.currency, 2),
          moneyBar("Current savings", values.currentSavings, values.currency, 2),
          moneyBar("Remaining gap", gap, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeConcreteSlabConfig() {
  return {
    title: "Concrete Slab Calculator",
    actionLabel: "Calculate concrete volume",
    emptyState: "Estimate slab volume, cubic yards, bag count, and material cost for a rectangular pour.",
    summaryLabel: "Concrete slab estimate",
    defaultHistoryLabel: "Concrete slab scenario",
    categorySlug: "home",
    badge: "Materials",
    surfaceStyle: "ledger",
    defaults: { lengthFeet: 24, widthFeet: 20, thicknessInches: 4, wastePercent: 8, costPerCubicYard: 165, currency: "USD" },
    mainFields: [
      numberField("lengthFeet", "Length (ft)", 1, 1000, 0.1),
      numberField("widthFeet", "Width (ft)", 1, 1000, 0.1),
      numberField("thicknessInches", "Thickness (in)", 1, 24, 0.5),
      percentField("wastePercent", "Waste allowance", 0, 30, 0.5),
      moneyField("costPerCubicYard", "Cost per cubic yard", 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.lengthFeet <= 0 || values.widthFeet <= 0) return "Length and width must both be greater than zero.";
      return values.thicknessInches <= 0 ? "Thickness must be greater than zero." : "";
    },
    compute(values) {
      const rawCubicFeet = values.lengthFeet * values.widthFeet * (values.thicknessInches / 12);
      const cubicFeet = rawCubicFeet * (1 + values.wastePercent / 100);
      const cubicYards = cubicFeet / 27;
      const bagCount = Math.ceil(cubicFeet / 0.6);
      const estimatedCost = cubicYards * values.costPerCubicYard;

      return result(
        "Concrete slab material estimate",
        [
          card("Cubic yards", fixed(cubicYards)),
          card("Cubic feet", fixed(cubicFeet)),
          card("80 lb bags", count(bagCount)),
          card("Estimated cost", moneyText(estimatedCost, values.currency, 2)),
        ],
        [
          plainBar("Cubic yards", cubicYards, `${fixed(cubicYards)} yd3`),
          plainBar("Cubic feet", cubicFeet, `${fixed(cubicFeet)} ft3`),
          moneyBar("Estimated cost", estimatedCost, values.currency, 2),
        ],
        [],
        [note("Waste allowance", percentText(values.wastePercent))],
      );
    },
  };
}

function makePaintCoverageConfig() {
  return {
    title: "Paint Coverage Calculator",
    actionLabel: "Calculate paint coverage",
    emptyState: "Estimate gallons needed and paint cost from wall area, coats, and coverage per gallon.",
    summaryLabel: "Paint coverage estimate",
    defaultHistoryLabel: "Paint coverage scenario",
    categorySlug: "home",
    badge: "Materials",
    surfaceStyle: "ledger",
    aliases: ["paint calculator"],
    defaults: { wallAreaSqFt: 1450, coats: 2, coveragePerGallon: 350, pricePerGallon: 42, currency: "USD" },
    mainFields: [
      numberField("wallAreaSqFt", "Wall area (sq ft)", 1, 50000, 1),
      numberField("coats", "Number of coats", 1, 6, 1),
      numberField("coveragePerGallon", "Coverage per gallon", 50, 1000, 1),
      moneyField("pricePerGallon", "Price per gallon", 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.wallAreaSqFt <= 0) return "Enter a wall area.";
      if (values.coats <= 0) return "Number of coats must be greater than zero.";
      return values.coveragePerGallon <= 0 ? "Coverage per gallon must be greater than zero." : "";
    },
    compute(values) {
      const totalArea = values.wallAreaSqFt * values.coats;
      const gallonsExact = totalArea / Math.max(values.coveragePerGallon, 1);
      const gallonsToBuy = Math.ceil(gallonsExact);
      const totalCost = gallonsToBuy * values.pricePerGallon;

      return result(
        "Paint coverage estimate",
        [
          card("Gallons needed", fixed(gallonsExact)),
          card("Gallons to buy", count(gallonsToBuy)),
          card("Estimated cost", moneyText(totalCost, values.currency, 2)),
          card("Total area painted", `${count(totalArea)} sq ft`),
        ],
        [
          plainBar("Exact gallons", gallonsExact, `${fixed(gallonsExact)} gal`),
          plainBar("Gallons to buy", gallonsToBuy, `${count(gallonsToBuy)} gal`),
          moneyBar("Estimated cost", totalCost, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function result(title, summaryCards, breakdown, insights = [], meta = [], extra = {}) {
  const report = [
    title,
    "",
    "Summary",
    ...summaryCards.map((item) => `- ${item.label}: ${item.value}`),
    "",
    "Breakdown",
    ...breakdown.map((item) => `- ${item.label}: ${item.displayValue || plain(item.value)}`),
    insights.length ? "" : null,
    insights.length ? "Insights" : null,
    ...insights.map((item) => `- ${item}`),
    meta.length ? "" : null,
    meta.length ? "Notes" : null,
    ...meta.map((item) => `- ${item.label}: ${item.value}`),
  ]
    .filter(Boolean)
    .join("\n");

  return { title, summaryCards, breakdown, insights, meta, report, ...extra };
}

function currencyField() {
  return { name: "currency", label: "Currency", type: "select", options: CURRENCIES };
}

function moneyField(name, label, step = 100, suffix = "") {
  const field = { name, label, type: "currency", min: 0, step, prefix: "$" };
  if (suffix) field.suffix = suffix;
  return field;
}

function numberField(name, label, min = 0, max = 100, step = 1, suffix = "") {
  const field = { name, label, type: "number", min, max, step };
  if (suffix) field.suffix = suffix;
  return field;
}

function percentField(name, label, min = 0, max = 100, step = 1) {
  return { name, label, type: "percent", min, max, step, suffix: "%" };
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

function percentText(value) {
  const number = clamp(Number.isFinite(value) ? value : 0, -9999, 99999);
  return `${number.toFixed(Math.abs(number) >= 100 ? 0 : 1).replace(/\.0$/, "")}%`;
}

function count(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(Number.isFinite(value) ? value : 0));
}

function fixed(value) {
  const number = Number.isFinite(value) ? value : 0;
  return Number.isInteger(number) ? String(number) : number.toFixed(2).replace(/\.?0+$/, "");
}

function plain(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.abs(value) < 100 ? 2 : 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function solvePrincipalFromPayment(payment, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return payment * Math.max(months, 1);
  return payment * (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate;
}

function buildContributionProjection({ startingBalance, annualContribution, annualReturnPercent, years, currency }) {
  let balance = startingBalance;
  let totalContributions = startingBalance;
  const rows = [];
  const checkpoint = Math.max(1, Math.round(years / 4));

  for (let year = 1; year <= years; year += 1) {
    balance = balance * (1 + annualReturnPercent / 100) + annualContribution;
    totalContributions += annualContribution;

    if (year === 1 || year === years || year % checkpoint === 0) {
      rows.push({
        cells: [
          String(year),
          moneyText(totalContributions, currency, 2),
          moneyText(balance, currency, 2),
        ],
      });
    }
  }

  return {
    futureValue: balance,
    totalContributions,
    growth: balance - totalContributions,
    rows,
  };
}

function computeAmortizedLoanResult({ title, values, paymentLabel }) {
  const months = Math.max(1, Math.round(values.years * 12));
  const basePayment = getAmortizedPayment(values.principal, values.annualRate, months);
  const payment = basePayment + values.extraPayment;
  const schedule = buildAmortization({
    principal: values.principal,
    annualRate: values.annualRate,
    payment,
    currency: values.currency,
  });
  const totalPaid = values.principal + schedule.totalInterest;

  return result(
    title,
    [
      card(paymentLabel, moneyText(payment, values.currency, 2)),
      card("Total interest", moneyText(schedule.totalInterest, values.currency, 2)),
      card("Total paid", moneyText(totalPaid, values.currency, 2)),
      card("Payoff time", `${schedule.months} months`),
    ],
    [
      moneyBar("Loan amount", values.principal, values.currency, 2),
      moneyBar("Base payment", basePayment, values.currency, 2),
      moneyBar("Extra payment", values.extraPayment, values.currency, 2),
      moneyBar("Total interest", schedule.totalInterest, values.currency, 2),
      moneyBar("Total paid", totalPaid, values.currency, 2),
    ],
    [],
    [],
    {
      table: {
        title: "Payoff checkpoints",
        headers: ["Month", "Payment", "Interest", "Principal", "Balance"],
        rows: schedule.rows,
        footnote: "Rows are shown at yearly checkpoints and on the final payoff month.",
      },
    },
  );
}

function getAmortizedPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / Math.max(months, 1);
  return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
}

function buildAmortization({ principal, annualRate, payment, currency }) {
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  let totalInterest = 0;
  let month = 0;
  const rows = [];

  while (balance > 0.01 && month < 600) {
    month += 1;
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;

    if (month === 1 || month % 12 === 0 || balance <= 0.01) {
      rows.push({
        cells: [
          String(month),
          moneyText(payment, currency, 2),
          moneyText(interest, currency, 2),
          moneyText(principalPaid, currency, 2),
          moneyText(balance, currency, 2),
        ],
      });
    }
  }

  return { months: month, totalInterest, rows };
}

function getLevelCashFlowNpv({ initialInvestment, annualCashFlow, years, discountRatePercent, salvageValue = 0 }) {
  const rate = discountRatePercent / 100;
  let npv = -initialInvestment;
  for (let year = 1; year <= Math.round(years); year += 1) {
    npv += annualCashFlow / Math.pow(1 + rate, year);
  }
  npv += salvageValue / Math.pow(1 + rate, Math.round(years));
  return npv;
}

function solveIrr(initialInvestment, annualCashFlow, terminalValue, years) {
  let low = -0.95;
  let high = 1.5;

  for (let iteration = 0; iteration < 80; iteration += 1) {
    const mid = (low + high) / 2;
    const npv = getLevelCashFlowNpv({
      initialInvestment,
      annualCashFlow,
      years,
      discountRatePercent: mid * 100,
      salvageValue: terminalValue,
    });

    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

function estimateYearsToTarget({ currentAmount, annualContribution, annualReturnPercent, targetAmount }) {
  if (currentAmount >= targetAmount) return 0;
  let amount = currentAmount;
  const annualReturn = annualReturnPercent / 100;

  for (let year = 1; year <= 80; year += 1) {
    amount = amount * (1 + annualReturn) + annualContribution;
    if (amount >= targetAmount) return year;
  }

  return Infinity;
}

function estimateWithdrawalRunway(nestEgg, annualWithdrawal, annualReturnPercent) {
  let balance = nestEgg;
  const annualReturn = annualReturnPercent / 100;

  for (let year = 1; year <= 80; year += 1) {
    balance = balance * (1 + annualReturn) - annualWithdrawal;
    if (balance <= 0) return year;
  }

  return Infinity;
}

function getBondPrice({ faceValue, couponRatePercent, marketYieldPercent, yearsToMaturity, paymentsPerYear }) {
  const couponPayment = faceValue * (couponRatePercent / 100) / paymentsPerYear;
  const periodYield = marketYieldPercent / 100 / paymentsPerYear;
  const periods = Math.round(yearsToMaturity * paymentsPerYear);
  let price = 0;

  for (let period = 1; period <= periods; period += 1) {
    price += couponPayment / Math.pow(1 + periodYield, period);
  }

  price += faceValue / Math.pow(1 + periodYield, periods);
  return price;
}

function solveBondYtm({ faceValue, annualCoupon, currentPrice, yearsToMaturity, paymentsPerYear }) {
  let low = 0;
  let high = 1;

  for (let iteration = 0; iteration < 80; iteration += 1) {
    const mid = (low + high) / 2;
    const price = getBondPrice({
      faceValue,
      couponRatePercent: annualCoupon / faceValue * 100,
      marketYieldPercent: mid * 100,
      yearsToMaturity,
      paymentsPerYear,
    });

    if (price > currentPrice) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

function estimateSimplePaydownInterest(balance, aprPercent, monthlyPayment, months) {
  let remaining = balance;
  let interestPaid = 0;
  const monthlyRate = aprPercent / 100 / 12;

  for (let month = 0; month < months && remaining > 0.01; month += 1) {
    const interest = remaining * monthlyRate;
    const principalPaid = Math.max(monthlyPayment - interest, 0);
    remaining = Math.max(0, remaining + interest - principalPaid);
    interestPaid += interest;
  }

  return interestPaid;
}
