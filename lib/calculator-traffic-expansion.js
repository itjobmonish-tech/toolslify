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

const SEX_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Lightly active" },
  { value: "moderate", label: "Moderately active" },
  { value: "very", label: "Very active" },
  { value: "athlete", label: "Athlete / twice daily" },
];

const CALORIE_GOAL_OPTIONS = [
  { value: "maintain", label: "Maintain weight" },
  { value: "lose", label: "Lose fat" },
  { value: "gain", label: "Gain muscle" },
];

const PROTEIN_GOAL_OPTIONS = [
  { value: "maintain", label: "Maintain" },
  { value: "fat-loss", label: "Fat loss" },
  { value: "muscle-gain", label: "Muscle gain" },
];

const PACE_UNIT_OPTIONS = [
  { value: "km", label: "Kilometers" },
  { value: "mile", label: "Miles" },
];

const ROOF_PITCH_OPTIONS = [
  { value: "1", label: "Flat / low slope" },
  { value: "1.054", label: "4/12 pitch" },
  { value: "1.118", label: "6/12 pitch" },
  { value: "1.202", label: "8/12 pitch" },
  { value: "1.302", label: "10/12 pitch" },
  { value: "1.414", label: "12/12 pitch" },
];

export const TRAFFIC_CALCULATOR_CONFIGS = {
  "mortgage-calculator": makeLoanProjectionConfig({
    title: "Mortgage Calculator",
    actionLabel: "Calculate mortgage",
    emptyState: "Estimate mortgage payments, interest, and payoff time from a purchase loan scenario.",
    summaryLabel: "Mortgage estimate",
    defaults: { principal: 350000, annualRate: 6.7, years: 30, extraPayment: 0, currency: "USD" },
  }),
  "student-loan-calculator": makeLoanProjectionConfig({
    title: "Student Loan Calculator",
    actionLabel: "Calculate student loan",
    emptyState: "Estimate student loan payments and total interest with an optional extra payment.",
    summaryLabel: "Student loan estimate",
    defaults: { principal: 42000, annualRate: 5.9, years: 10, extraPayment: 0, currency: "USD" },
  }),
  "home-loan-emi-calculator": makeLoanProjectionConfig({
    title: "Home Loan EMI Calculator",
    actionLabel: "Calculate EMI",
    emptyState: "Estimate a fixed monthly EMI for a home loan based on principal, rate, and tenure.",
    summaryLabel: "EMI estimate",
    paymentLabel: "Monthly EMI",
    defaults: { principal: 250000, annualRate: 8.4, years: 20, extraPayment: 0, currency: "USD" },
  }),
  "home-loan-prepayment-calculator": makeLoanProjectionConfig({
    title: "Home Loan Prepayment Calculator",
    actionLabel: "Estimate prepayment",
    emptyState: "See how an extra monthly prepayment changes EMI payoff time and total interest.",
    summaryLabel: "Prepayment estimate",
    defaults: { principal: 250000, annualRate: 8.4, years: 20, extraPayment: 250, currency: "USD" },
  }),
  "credit-card-payoff-calculator": makeBalancePayoffConfig({
    title: "Credit Card Payoff Calculator",
    actionLabel: "Calculate payoff",
    emptyState: "Estimate how long it will take to pay off a card balance with a fixed monthly payment.",
    summaryLabel: "Credit card payoff",
    defaults: { balance: 8400, annualRate: 21.9, monthlyPayment: 275, currency: "USD" },
  }),
  "debt-payoff-calculator": makeBalancePayoffConfig({
    title: "Debt Payoff Calculator",
    actionLabel: "Calculate debt payoff",
    emptyState: "Estimate debt payoff time, interest cost, and total paid from one monthly payment plan.",
    summaryLabel: "Debt payoff estimate",
    defaults: { balance: 18500, annualRate: 12.5, monthlyPayment: 425, currency: "USD" },
  }),
  "paycheck-calculator": makePaycheckConfig(),
  "tax-refund-calculator": makeTaxRefundConfig(),
  "sales-tax-calculator": makeSalesTaxConfig(),
  "house-affordability-calculator": makeHouseAffordabilityConfig(),
  "home-loan-eligibility-calculator": makeHomeLoanEligibilityConfig(),
  "refinance-calculator": makeRefinanceConfig(),
  "heloc-calculator": makeHelocConfig(),
  "rent-vs-buy-calculator": makeRentVsBuyConfig(),
  "down-payment-calculator": makeDownPaymentConfig(),
  "property-tax-calculator": makePropertyTaxConfig(),
  "closing-costs-calculator": makeClosingCostsConfig(),
  "retirement-calculator": makeRetirementCalculatorConfig(),
  "retirement-savings-calculator": makeRetirementSavingsConfig(),
  "401-k-calculator": make401kConfig(),
  "roth-ira-calculator": makeRothIraConfig(),
  "inflation-calculator": makeInflationConfig(),
  "self-employment-tax-calculator": makeSelfEmploymentTaxConfig(),
  "capital-gains-tax-calculator": makeCapitalGainsTaxConfig(),
  "apr-calculator": makeAprConfig(),
  "debt-to-income-ratio-calculator": makeDebtToIncomeConfig(),
  "calorie-calculator": makeCalorieCalculatorConfig(),
  "tdee-calculator": makeTdeeCalculatorConfig(),
  "body-fat-calculator": makeBodyFatConfig(),
  "ovulation-calculator": makeOvulationConfig(),
  "macro-calculator": makeMacroConfig(),
  "calorie-deficit-calculator": makeCalorieDeficitConfig(),
  "protein-intake-calculator": makeProteinIntakeConfig(),
  "ideal-weight-calculator": makeIdealWeightConfig(),
  "lean-body-mass-calculator": makeLeanBodyMassConfig(),
  "pace-calculator": makePaceConfig(),
  "one-rep-max-calculator": makeOneRepMaxConfig(),
  "target-heart-rate-calculator": makeTargetHeartRateConfig(),
  "roofing-calculator": makeRoofingConfig(),
  "paint-calculator": makePaintConfig(),
  "concrete-calculator": makeConcreteConfig(),
  "tile-calculator": makeTileConfig(),
  "drywall-calculator": makeDrywallConfig(),
  "decking-calculator": makeDeckingConfig(),
  "insulation-calculator": makeInsulationConfig(),
  "fence-calculator": makeFenceConfig(),
  "topsoil-calculator": makeTopsoilConfig(),
  "sod-calculator": makeSodConfig(),
  "paver-calculator": makePaverConfig(),
  "roof-pitch-calculator": makeRoofPitchConfig(),
};

function makeLoanProjectionConfig({
  title,
  actionLabel = "Calculate payments",
  emptyState = "Estimate payments, interest, and payoff time from a loan scenario.",
  summaryLabel = "Loan estimate",
  paymentLabel = "Monthly payment",
  defaults = { principal: 250000, annualRate: 6.5, years: 30, extraPayment: 0, currency: "USD" },
} = {}) {
  return {
    title,
    actionLabel,
    emptyState,
    summaryLabel,
    defaultHistoryLabel: `${title} scenario`,
    defaults,
    mainFields: [
      moneyField("principal", "Loan amount", 100),
      percentField("annualRate", "Interest rate", 0, 100, 0.1),
      numberField("years", "Loan term (years)", 1, 40, 1),
      moneyField("extraPayment", "Extra monthly payment", 10),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.principal <= 0 ? "Enter a loan amount greater than zero." : "";
    },
    compute(values) {
      const months = Math.max(1, Math.round(values.years * 12));
      const basePayment = getAmortizedPayment(values.principal, values.annualRate, months);
      const payment = basePayment + values.extraPayment;
      const ratePerMonth = values.annualRate / 100 / 12;
      const minimumInterest = values.principal * ratePerMonth;

      if (payment <= minimumInterest && ratePerMonth > 0) {
        return result(
          "Payment is too low to amortize the balance",
          [
            card(paymentLabel, moneyText(payment, values.currency, 2)),
            card("Monthly interest only", moneyText(minimumInterest, values.currency, 2)),
          ],
          [
            moneyBar("Loan amount", values.principal, values.currency, 2),
            moneyBar("Monthly interest only", minimumInterest, values.currency, 2),
          ],
          [],
          [note("Adjustment", "Increase the monthly payment or reduce the interest rate.")],
          { warning: "The current payment does not reduce principal, so payoff would not happen." },
        );
      }

      const schedule = buildAmortization({
        principal: values.principal,
        annualRate: values.annualRate,
        payment,
        currency: values.currency,
      });
      const totalPaid = schedule.totalInterest + values.principal;

      return result(
        `${title} result`,
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
        [
          note("Interest rate", percent(values.annualRate)),
          note("Loan term", `${values.years} years`),
          note("Payoff horizon", `${fixed(schedule.months / 12)} years`),
        ],
        {
          table: {
            title: "Payoff checkpoints",
            headers: ["Month", "Payment", "Interest", "Principal", "Balance"],
            rows: schedule.rows,
            footnote: "Rows are shown at yearly checkpoints and on the final payoff month.",
          },
        },
      );
    },
  };
}

function makeBalancePayoffConfig({
  title,
  actionLabel,
  emptyState,
  summaryLabel,
  defaults,
}) {
  return {
    title,
    actionLabel,
    emptyState,
    summaryLabel,
    defaultHistoryLabel: `${title} scenario`,
    defaults,
    mainFields: [
      moneyField("balance", "Starting balance", 10),
      percentField("annualRate", "APR", 0, 100, 0.1),
      moneyField("monthlyPayment", "Monthly payment", 10),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.balance <= 0) return "Enter a starting balance.";
      if (values.monthlyPayment <= 0) return "Enter a monthly payment.";
      const monthlyInterest = values.balance * (values.annualRate / 100 / 12);
      if (values.annualRate > 0 && values.monthlyPayment <= monthlyInterest) {
        return "Monthly payment must be higher than the monthly interest charge.";
      }
      return "";
    },
    compute(values) {
      const schedule = buildAmortization({
        principal: values.balance,
        annualRate: values.annualRate,
        payment: values.monthlyPayment,
        currency: values.currency,
      });
      const totalPaid = values.balance + schedule.totalInterest;

      return result(
        `${title} result`,
        [
          card("Monthly payment", moneyText(values.monthlyPayment, values.currency, 2)),
          card("Payoff time", `${schedule.months} months`),
          card("Total interest", moneyText(schedule.totalInterest, values.currency, 2)),
          card("Total paid", moneyText(totalPaid, values.currency, 2)),
        ],
        [
          moneyBar("Starting balance", values.balance, values.currency, 2),
          moneyBar("Monthly payment", values.monthlyPayment, values.currency, 2),
          moneyBar("Total interest", schedule.totalInterest, values.currency, 2),
          moneyBar("Total paid", totalPaid, values.currency, 2),
        ],
        [],
        [
          note("APR", percent(values.annualRate)),
          note("Payoff horizon", `${fixed(schedule.months / 12)} years`),
        ],
        {
          table: {
            title: "Payoff checkpoints",
            headers: ["Month", "Payment", "Interest", "Principal", "Balance"],
            rows: schedule.rows,
            footnote: "Rows are shown at yearly checkpoints and on the final payoff month.",
          },
        },
      );
    },
  };
}

function makePaycheckConfig() {
  return {
    title: "Paycheck Calculator",
    actionLabel: "Calculate paycheck",
    emptyState: "Estimate gross and net pay for each paycheck after taxes and payroll deductions.",
    summaryLabel: "Paycheck estimate",
    defaultHistoryLabel: "Paycheck scenario",
    defaults: { annualSalary: 78000, payFrequency: "biweekly", taxRate: 23, deductionsPerPay: 135, currency: "USD" },
    mainFields: [
      moneyField("annualSalary", "Annual salary", 100),
      { name: "payFrequency", label: "Pay frequency", type: "select", options: PAY_FREQUENCY_OPTIONS },
      percentField("taxRate", "Estimated tax rate", 0, 60, 0.5),
      moneyField("deductionsPerPay", "Deductions per paycheck", 5),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.annualSalary <= 0 ? "Enter an annual salary." : "";
    },
    compute(values) {
      const payPeriods = getPayPeriods(values.payFrequency);
      const grossPerPay = values.annualSalary / payPeriods;
      const taxPerPay = grossPerPay * (values.taxRate / 100);
      const netPerPay = Math.max(0, grossPerPay - taxPerPay - values.deductionsPerPay);
      const annualNet = netPerPay * payPeriods;

      return result(
        "Paycheck estimate",
        [
          card("Gross per paycheck", moneyText(grossPerPay, values.currency, 2)),
          card("Net per paycheck", moneyText(netPerPay, values.currency, 2)),
          card("Paychecks / year", String(payPeriods)),
          card("Annual net pay", moneyText(annualNet, values.currency, 2)),
        ],
        [
          moneyBar("Annual salary", values.annualSalary, values.currency, 2),
          moneyBar("Gross per paycheck", grossPerPay, values.currency, 2),
          moneyBar("Tax per paycheck", taxPerPay, values.currency, 2),
          moneyBar("Deductions per paycheck", values.deductionsPerPay, values.currency, 2),
          moneyBar("Net per paycheck", netPerPay, values.currency, 2),
        ],
        [],
        [
          note("Pay frequency", PAY_FREQUENCY_OPTIONS.find((item) => item.value === values.payFrequency)?.label || "Biweekly"),
          note("Tax rate", percent(values.taxRate)),
        ],
      );
    },
  };
}

function makeTaxRefundConfig() {
  return {
    title: "Tax Refund Calculator",
    actionLabel: "Estimate refund",
    emptyState: "Estimate whether withholding and credits produce a refund or a tax bill.",
    summaryLabel: "Tax refund estimate",
    defaultHistoryLabel: "Tax refund scenario",
    defaults: { taxableIncome: 76000, effectiveTaxRate: 18, taxWithheld: 14800, taxCredits: 1200, currency: "USD" },
    mainFields: [
      moneyField("taxableIncome", "Taxable income", 100),
      percentField("effectiveTaxRate", "Estimated effective tax rate", 0, 50, 0.1),
      moneyField("taxWithheld", "Tax withheld", 50),
      moneyField("taxCredits", "Credits", 50),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.taxableIncome <= 0 ? "Enter taxable income." : "";
    },
    compute(values) {
      const estimatedTax = Math.max(0, values.taxableIncome * (values.effectiveTaxRate / 100) - values.taxCredits);
      const refund = values.taxWithheld - estimatedTax;
      const outcomeLabel = refund >= 0 ? "Estimated refund" : "Estimated tax due";

      return result(
        refund >= 0 ? "Estimated tax refund" : "Estimated tax due",
        [
          card(outcomeLabel, moneyText(Math.abs(refund), values.currency, 2)),
          card("Estimated tax", moneyText(estimatedTax, values.currency, 2)),
          card("Tax withheld", moneyText(values.taxWithheld, values.currency, 2)),
          card("Credits", moneyText(values.taxCredits, values.currency, 2)),
        ],
        [
          moneyBar("Taxable income", values.taxableIncome, values.currency, 2),
          moneyBar("Estimated tax", estimatedTax, values.currency, 2),
          moneyBar("Tax withheld", values.taxWithheld, values.currency, 2),
          moneyBar("Credits", values.taxCredits, values.currency, 2),
        ],
        [],
        [
          note("Effective rate", percent(values.effectiveTaxRate)),
          note("Outcome", outcomeLabel),
        ],
      );
    },
  };
}

function makeSalesTaxConfig() {
  return {
    title: "Sales Tax Calculator",
    actionLabel: "Calculate tax",
    emptyState: "Add a pre-tax price and sales tax rate to see the final checkout total.",
    summaryLabel: "Sales tax result",
    defaultHistoryLabel: "Sales tax scenario",
    defaults: { price: 129.99, taxRate: 8.25, currency: "USD" },
    mainFields: [moneyField("price", "Price before tax", 1), percentField("taxRate", "Sales tax rate", 0, 25, 0.01)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.price <= 0 ? "Enter a price before tax." : "";
    },
    compute(values) {
      const tax = values.price * (values.taxRate / 100);
      const total = values.price + tax;

      return result(
        "Sales tax estimate",
        [
          card("Sales tax", moneyText(tax, values.currency, 2)),
          card("Total after tax", moneyText(total, values.currency, 2)),
        ],
        [
          moneyBar("Price before tax", values.price, values.currency, 2),
          moneyBar("Sales tax", tax, values.currency, 2),
          moneyBar("Total after tax", total, values.currency, 2),
        ],
        [],
        [note("Tax rate", percent(values.taxRate))],
      );
    },
  };
}

function makeHouseAffordabilityConfig() {
  return {
    title: "House Affordability Calculator",
    actionLabel: "Estimate affordability",
    emptyState: "Estimate the home price a budget can support using income, debt, rate, and down payment assumptions.",
    summaryLabel: "House affordability estimate",
    defaultHistoryLabel: "House affordability scenario",
    defaults: { annualIncome: 120000, monthlyDebt: 850, downPayment: 50000, annualRate: 6.5, years: 30, maxDti: 36, currency: "USD" },
    mainFields: [
      moneyField("annualIncome", "Annual household income", 100),
      moneyField("monthlyDebt", "Existing monthly debt", 10),
      moneyField("downPayment", "Down payment", 100),
      percentField("annualRate", "Mortgage rate", 0, 25, 0.1),
      numberField("years", "Loan term (years)", 10, 40, 1),
      percentField("maxDti", "Target debt-to-income cap", 10, 60, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.annualIncome <= 0 ? "Enter annual household income." : "";
    },
    compute(values) {
      const maxHousingPayment = Math.max(0, values.annualIncome / 12 * (values.maxDti / 100) - values.monthlyDebt);
      const maxLoan = getPrincipalFromPayment(maxHousingPayment, values.annualRate, values.years * 12);
      const maxPrice = maxLoan + values.downPayment;

      return result(
        "Estimated house affordability",
        [
          card("Max home price", moneyText(maxPrice, values.currency, 2)),
          card("Max mortgage", moneyText(maxLoan, values.currency, 2)),
          card("Max housing payment", moneyText(maxHousingPayment, values.currency, 2)),
          card("Down payment", moneyText(values.downPayment, values.currency, 2)),
        ],
        [
          moneyBar("Annual income", values.annualIncome, values.currency, 2),
          moneyBar("Monthly debt", values.monthlyDebt, values.currency, 2),
          moneyBar("Max housing payment", maxHousingPayment, values.currency, 2),
          moneyBar("Max mortgage", maxLoan, values.currency, 2),
          moneyBar("Estimated price", maxPrice, values.currency, 2),
        ],
        [],
        [
          note("DTI cap", percent(values.maxDti)),
          note("Loan term", `${values.years} years`),
          note("Rate", percent(values.annualRate)),
        ],
      );
    },
  };
}

function makeHomeLoanEligibilityConfig() {
  return {
    title: "Home Loan Eligibility Calculator",
    actionLabel: "Estimate eligibility",
    emptyState: "Estimate the home loan amount supported by monthly income and existing EMI commitments.",
    summaryLabel: "Home loan eligibility",
    defaultHistoryLabel: "Home loan eligibility scenario",
    defaults: { monthlyIncome: 9500, existingEmis: 1100, emiShare: 40, annualRate: 8.2, years: 20, currency: "USD" },
    mainFields: [
      moneyField("monthlyIncome", "Monthly income", 50),
      moneyField("existingEmis", "Existing EMIs / debt", 10),
      percentField("emiShare", "Max EMI share of income", 10, 60, 1),
      percentField("annualRate", "Loan rate", 0, 25, 0.1),
      numberField("years", "Loan term (years)", 5, 35, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.monthlyIncome <= 0 ? "Enter monthly income." : "";
    },
    compute(values) {
      const availableEmi = Math.max(0, values.monthlyIncome * (values.emiShare / 100) - values.existingEmis);
      const eligibleLoan = getPrincipalFromPayment(availableEmi, values.annualRate, values.years * 12);

      return result(
        "Estimated home loan eligibility",
        [
          card("Eligible loan amount", moneyText(eligibleLoan, values.currency, 2)),
          card("Available EMI", moneyText(availableEmi, values.currency, 2)),
          card("Monthly income", moneyText(values.monthlyIncome, values.currency, 2)),
        ],
        [
          moneyBar("Monthly income", values.monthlyIncome, values.currency, 2),
          moneyBar("Existing EMIs", values.existingEmis, values.currency, 2),
          moneyBar("Available EMI", availableEmi, values.currency, 2),
          moneyBar("Eligible loan amount", eligibleLoan, values.currency, 2),
        ],
        [],
        [
          note("EMI cap", percent(values.emiShare)),
          note("Loan term", `${values.years} years`),
          note("Rate", percent(values.annualRate)),
        ],
      );
    },
  };
}

function makeRefinanceConfig() {
  return {
    title: "Refinance Calculator",
    categorySlug: "mortgage-data",
    actionLabel: "Compare refinance",
    emptyState: "Compare a current loan against a refinance offer to estimate payment changes and break-even timing.",
    summaryLabel: "Refinance comparison",
    defaultHistoryLabel: "Refinance scenario",
    defaults: { currentBalance: 285000, currentRate: 7.1, yearsLeft: 24, newRate: 6.1, newYears: 20, closingCosts: 5500, currency: "USD" },
    mainFields: [
      moneyField("currentBalance", "Current balance", 100),
      percentField("currentRate", "Current rate", 0, 25, 0.1),
      numberField("yearsLeft", "Years left", 1, 40, 1),
      percentField("newRate", "New rate", 0, 25, 0.1),
      numberField("newYears", "New term (years)", 1, 40, 1),
      moneyField("closingCosts", "Closing costs", 50),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.currentBalance <= 0 ? "Enter the current loan balance." : "";
    },
    compute(values) {
      const oldPayment = getAmortizedPayment(values.currentBalance, values.currentRate, values.yearsLeft * 12);
      const newPayment = getAmortizedPayment(values.currentBalance, values.newRate, values.newYears * 12);
      const oldRemainingCost = oldPayment * values.yearsLeft * 12;
      const newRemainingCost = newPayment * values.newYears * 12 + values.closingCosts;
      const monthlySavings = oldPayment - newPayment;
      const lifetimeSavings = oldRemainingCost - newRemainingCost;
      const breakEvenMonths = monthlySavings > 0 ? values.closingCosts / monthlySavings : Number.POSITIVE_INFINITY;

      return result(
        "Refinance comparison",
        [
          card("New payment", moneyText(newPayment, values.currency, 2)),
          card("Monthly change", moneyText(monthlySavings, values.currency, 2)),
          card("Break-even", Number.isFinite(breakEvenMonths) ? `${fixed(breakEvenMonths)} months` : "No break-even"),
          card("Lifetime savings", moneyText(lifetimeSavings, values.currency, 2)),
        ],
        [
          moneyBar("Current payment", oldPayment, values.currency, 2),
          moneyBar("New payment", newPayment, values.currency, 2),
          moneyBar("Closing costs", values.closingCosts, values.currency, 2),
          moneyBar("Lifetime savings", lifetimeSavings, values.currency, 2),
        ],
        [],
        [
          note("Current rate", percent(values.currentRate)),
          note("New rate", percent(values.newRate)),
          note("Current term left", `${values.yearsLeft} years`),
        ],
      );
    },
  };
}

function makeHelocConfig() {
  return {
    title: "HELOC Calculator",
    actionLabel: "Estimate HELOC",
    emptyState: "Estimate draw-period interest-only payments and the later amortized repayment phase.",
    summaryLabel: "HELOC estimate",
    defaultHistoryLabel: "HELOC scenario",
    defaults: { creditLine: 120000, currentBalance: 45000, annualRate: 8.5, drawYears: 10, repaymentYears: 15, currency: "USD" },
    mainFields: [
      moneyField("creditLine", "Credit line", 100),
      moneyField("currentBalance", "Balance used", 100),
      percentField("annualRate", "Variable rate", 0, 30, 0.1),
      numberField("drawYears", "Draw period (years)", 1, 15, 1),
      numberField("repaymentYears", "Repayment period (years)", 1, 30, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.currentBalance <= 0) return "Enter the balance being used.";
      if (values.currentBalance > values.creditLine) return "Balance used cannot exceed the credit line.";
      return "";
    },
    compute(values) {
      const ratePerMonth = values.annualRate / 100 / 12;
      const interestOnlyPayment = values.currentBalance * ratePerMonth;
      const repaymentPayment = getAmortizedPayment(values.currentBalance, values.annualRate, values.repaymentYears * 12);
      const availableCredit = Math.max(0, values.creditLine - values.currentBalance);
      const drawInterest = interestOnlyPayment * values.drawYears * 12;
      const repaymentTotal = repaymentPayment * values.repaymentYears * 12;
      const estimatedInterest = drawInterest + repaymentTotal - values.currentBalance;

      return result(
        "HELOC estimate",
        [
          card("Available credit", moneyText(availableCredit, values.currency, 2)),
          card("Draw payment", moneyText(interestOnlyPayment, values.currency, 2)),
          card("Repayment payment", moneyText(repaymentPayment, values.currency, 2)),
          card("Estimated interest", moneyText(estimatedInterest, values.currency, 2)),
        ],
        [
          moneyBar("Credit line", values.creditLine, values.currency, 2),
          moneyBar("Balance used", values.currentBalance, values.currency, 2),
          moneyBar("Available credit", availableCredit, values.currency, 2),
          moneyBar("Draw payment", interestOnlyPayment, values.currency, 2),
          moneyBar("Repayment payment", repaymentPayment, values.currency, 2),
        ],
        [],
        [
          note("Draw period", `${values.drawYears} years`),
          note("Repayment period", `${values.repaymentYears} years`),
          note("Rate", percent(values.annualRate)),
        ],
      );
    },
  };
}

function makeRentVsBuyConfig() {
  return {
    title: "Rent vs Buy Calculator",
    actionLabel: "Compare rent vs buy",
    emptyState: "Compare renting against buying using payment, tax, maintenance, and equity assumptions.",
    summaryLabel: "Rent vs buy estimate",
    defaultHistoryLabel: "Rent vs buy scenario",
    defaults: { monthlyRent: 2300, homePrice: 425000, downPayment: 65000, annualRate: 6.6, loanYears: 30, propertyTaxRate: 1.2, maintenanceRate: 1, stayYears: 7, currency: "USD" },
    mainFields: [
      moneyField("monthlyRent", "Monthly rent", 10),
      moneyField("homePrice", "Home price", 100),
      moneyField("downPayment", "Down payment", 100),
      percentField("annualRate", "Mortgage rate", 0, 25, 0.1),
      numberField("loanYears", "Mortgage term (years)", 10, 40, 1),
      percentField("propertyTaxRate", "Property tax rate", 0, 5, 0.01),
      percentField("maintenanceRate", "Maintenance rate", 0, 5, 0.01),
      numberField("stayYears", "Years staying", 1, 30, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.homePrice <= values.downPayment ? "Home price must be greater than the down payment." : "";
    },
    compute(values) {
      const principal = values.homePrice - values.downPayment;
      const mortgagePayment = getAmortizedPayment(principal, values.annualRate, values.loanYears * 12);
      const monthlyTaxes = values.homePrice * (values.propertyTaxRate / 100) / 12;
      const monthlyMaintenance = values.homePrice * (values.maintenanceRate / 100) / 12;
      const monthsStayed = values.stayYears * 12;
      const remainingBalance = getRemainingBalance(principal, values.annualRate, mortgagePayment, monthsStayed);
      const principalPaid = principal - remainingBalance;
      const interestPaid = mortgagePayment * monthsStayed - principalPaid;
      const totalRent = values.monthlyRent * monthsStayed;
      const effectiveBuyCost = interestPaid + monthlyTaxes * monthsStayed + monthlyMaintenance * monthsStayed;
      const equityBuilt = values.downPayment + principalPaid;
      const betterOption = effectiveBuyCost < totalRent ? "Buying is lower on effective cost" : "Renting is lower on effective cost";

      return result(
        "Rent vs buy comparison",
        [
          card("Effective buy cost", moneyText(effectiveBuyCost, values.currency, 2)),
          card("Rent cost", moneyText(totalRent, values.currency, 2)),
          card("Equity built", moneyText(equityBuilt, values.currency, 2)),
          card("Lower-cost path", betterOption),
        ],
        [
          moneyBar("Monthly mortgage", mortgagePayment, values.currency, 2),
          moneyBar("Monthly taxes", monthlyTaxes, values.currency, 2),
          moneyBar("Monthly maintenance", monthlyMaintenance, values.currency, 2),
          moneyBar("Effective buy cost", effectiveBuyCost, values.currency, 2),
          moneyBar("Rent cost", totalRent, values.currency, 2),
        ],
        [],
        [
          note("Stay period", `${values.stayYears} years`),
          note("Mortgage rate", percent(values.annualRate)),
        ],
      );
    },
  };
}

function makeDownPaymentConfig() {
  return {
    title: "Down Payment Calculator",
    actionLabel: "Calculate down payment",
    emptyState: "Estimate the down payment, financed balance, and savings gap for a target purchase price.",
    summaryLabel: "Down payment estimate",
    defaultHistoryLabel: "Down payment scenario",
    defaults: { homePrice: 400000, downPaymentRate: 20, savings: 70000, currency: "USD" },
    mainFields: [
      moneyField("homePrice", "Home price", 100),
      percentField("downPaymentRate", "Down payment rate", 0, 100, 0.1),
      moneyField("savings", "Savings available", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.homePrice <= 0 ? "Enter a home price." : "";
    },
    compute(values) {
      const downPayment = values.homePrice * (values.downPaymentRate / 100);
      const loanAmount = Math.max(0, values.homePrice - downPayment);
      const gap = values.savings - downPayment;

      return result(
        "Down payment estimate",
        [
          card("Down payment", moneyText(downPayment, values.currency, 2)),
          card("Loan amount", moneyText(loanAmount, values.currency, 2)),
          card(gap >= 0 ? "Savings left" : "Savings gap", moneyText(Math.abs(gap), values.currency, 2)),
        ],
        [
          moneyBar("Home price", values.homePrice, values.currency, 2),
          moneyBar("Down payment", downPayment, values.currency, 2),
          moneyBar("Loan amount", loanAmount, values.currency, 2),
          moneyBar("Savings available", values.savings, values.currency, 2),
        ],
        [],
        [note("Down payment rate", percent(values.downPaymentRate))],
      );
    },
  };
}

function makePropertyTaxConfig() {
  return {
    title: "Property Tax Calculator",
    actionLabel: "Calculate property tax",
    emptyState: "Estimate annual and monthly property tax from a home value and local tax rate.",
    summaryLabel: "Property tax estimate",
    defaultHistoryLabel: "Property tax scenario",
    defaults: { homeValue: 425000, taxRate: 1.12, currency: "USD" },
    mainFields: [moneyField("homeValue", "Home value", 100), percentField("taxRate", "Property tax rate", 0, 5, 0.01)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.homeValue <= 0 ? "Enter a home value." : "";
    },
    compute(values) {
      const annualTax = values.homeValue * (values.taxRate / 100);
      const monthlyTax = annualTax / 12;

      return result(
        "Property tax estimate",
        [
          card("Annual tax", moneyText(annualTax, values.currency, 2)),
          card("Monthly tax", moneyText(monthlyTax, values.currency, 2)),
        ],
        [
          moneyBar("Home value", values.homeValue, values.currency, 2),
          moneyBar("Annual tax", annualTax, values.currency, 2),
          moneyBar("Monthly tax", monthlyTax, values.currency, 2),
        ],
        [],
        [note("Tax rate", percent(values.taxRate))],
      );
    },
  };
}

function makeClosingCostsConfig() {
  return {
    title: "Closing Costs Calculator",
    actionLabel: "Estimate closing costs",
    emptyState: "Estimate closing costs as a percentage of the purchase price and see total cash needed.",
    summaryLabel: "Closing costs estimate",
    defaultHistoryLabel: "Closing costs scenario",
    defaults: { homePrice: 425000, closingRate: 3.2, currency: "USD" },
    mainFields: [moneyField("homePrice", "Purchase price", 100), percentField("closingRate", "Closing cost rate", 0, 10, 0.1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.homePrice <= 0 ? "Enter a purchase price." : "";
    },
    compute(values) {
      const closingCosts = values.homePrice * (values.closingRate / 100);

      return result(
        "Closing cost estimate",
        [
          card("Closing costs", moneyText(closingCosts, values.currency, 2)),
          card("Closing rate", percent(values.closingRate)),
        ],
        [
          moneyBar("Purchase price", values.homePrice, values.currency, 2),
          moneyBar("Closing costs", closingCosts, values.currency, 2),
        ],
        [],
        [note("Typical cash to close", moneyText(closingCosts, values.currency, 2))],
      );
    },
  };
}

function makeRetirementCalculatorConfig() {
  return {
    title: "Retirement Calculator",
    actionLabel: "Estimate retirement",
    emptyState: "Project retirement savings growth from age, current balance, monthly savings, and investment return assumptions.",
    summaryLabel: "Retirement estimate",
    defaultHistoryLabel: "Retirement scenario",
    defaults: { currentAge: 34, retirementAge: 65, currentSavings: 42000, monthlyContribution: 650, annualReturn: 7, currency: "USD" },
    mainFields: [
      numberField("currentAge", "Current age", 18, 90, 1),
      numberField("retirementAge", "Retirement age", 25, 90, 1),
      moneyField("currentSavings", "Current retirement savings", 100),
      moneyField("monthlyContribution", "Monthly contribution", 10),
      percentField("annualReturn", "Annual return", 0, 20, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.retirementAge <= values.currentAge) return "Retirement age must be higher than current age.";
      return "";
    },
    compute(values) {
      const months = (values.retirementAge - values.currentAge) * 12;
      const forecast = getCompoundFutureValue({
        startingBalance: values.currentSavings,
        monthlyContribution: values.monthlyContribution,
        annualRate: values.annualReturn,
        months,
      });
      const monthlyIncome = forecast.futureValue * 0.04 / 12;

      return result(
        "Retirement projection",
        [
          card("Projected balance", moneyText(forecast.futureValue, values.currency, 2)),
          card("Years to retirement", String(values.retirementAge - values.currentAge)),
          card("Estimated monthly income", moneyText(monthlyIncome, values.currency, 2)),
          card("Total contributions", moneyText(forecast.totalContributions, values.currency, 2)),
        ],
        [
          moneyBar("Current savings", values.currentSavings, values.currency, 2),
          moneyBar("Monthly contribution", values.monthlyContribution, values.currency, 2),
          moneyBar("Projected balance", forecast.futureValue, values.currency, 2),
        ],
        [],
        [
          note("Annual return", percent(values.annualReturn)),
          note("Rule of thumb", "Monthly income uses a 4% annual withdrawal rate."),
        ],
      );
    },
  };
}

function makeRetirementSavingsConfig() {
  return {
    title: "Retirement Savings Calculator",
    actionLabel: "Calculate savings target",
    emptyState: "Estimate the monthly contribution needed to reach a retirement savings target.",
    summaryLabel: "Retirement savings target",
    defaultHistoryLabel: "Retirement savings scenario",
    defaults: { currentSavings: 30000, goalAmount: 1200000, years: 30, annualReturn: 7, currency: "USD" },
    mainFields: [
      moneyField("currentSavings", "Current savings", 100),
      moneyField("goalAmount", "Target retirement balance", 1000),
      numberField("years", "Years to retirement", 1, 50, 1),
      percentField("annualReturn", "Annual return", 0, 20, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.goalAmount <= values.currentSavings) return "Goal amount should be above current savings.";
      return "";
    },
    compute(values) {
      const months = values.years * 12;
      const monthlyRate = values.annualReturn / 100 / 12;
      const futureCurrent = values.currentSavings * Math.pow(1 + monthlyRate, months);
      const monthlyContribution = monthlyRate === 0
        ? (values.goalAmount - values.currentSavings) / months
        : (values.goalAmount - futureCurrent) * (monthlyRate / (Math.pow(1 + monthlyRate, months) - 1));

      return result(
        "Retirement savings target",
        [
          card("Required monthly saving", moneyText(monthlyContribution, values.currency, 2)),
          card("Target balance", moneyText(values.goalAmount, values.currency, 2)),
          card("Years to target", `${values.years} years`),
        ],
        [
          moneyBar("Current savings", values.currentSavings, values.currency, 2),
          moneyBar("Target balance", values.goalAmount, values.currency, 2),
          moneyBar("Required monthly saving", monthlyContribution, values.currency, 2),
        ],
        [],
        [note("Annual return", percent(values.annualReturn))],
      );
    },
  };
}

function make401kConfig() {
  return {
    title: "401(k) Calculator",
    actionLabel: "Calculate 401(k)",
    emptyState: "Project a 401(k) balance using employee contributions, employer match, and annual investment growth.",
    summaryLabel: "401(k) estimate",
    defaultHistoryLabel: "401(k) scenario",
    defaults: { salary: 98000, contributionRate: 8, employerMatchRate: 50, employerMatchCap: 6, currentBalance: 25000, years: 25, annualReturn: 7, currency: "USD" },
    mainFields: [
      moneyField("salary", "Annual salary", 100),
      percentField("contributionRate", "Employee contribution rate", 0, 50, 0.1),
      percentField("employerMatchRate", "Employer match rate", 0, 100, 1),
      percentField("employerMatchCap", "Employer match cap", 0, 20, 0.1),
      moneyField("currentBalance", "Current 401(k) balance", 100),
      numberField("years", "Years invested", 1, 45, 1),
      percentField("annualReturn", "Annual return", 0, 20, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.salary <= 0 ? "Enter annual salary." : "";
    },
    compute(values) {
      const employeeContribution = values.salary * (values.contributionRate / 100);
      const employerContribution = values.salary * (Math.min(values.contributionRate, values.employerMatchCap) / 100) * (values.employerMatchRate / 100);
      let balance = values.currentBalance;
      for (let year = 0; year < values.years; year += 1) {
        balance = balance * (1 + values.annualReturn / 100) + employeeContribution + employerContribution;
      }

      return result(
        "401(k) projection",
        [
          card("Projected balance", moneyText(balance, values.currency, 2)),
          card("Employee contribution", moneyText(employeeContribution, values.currency, 2)),
          card("Employer match", moneyText(employerContribution, values.currency, 2)),
          card("Total annual contribution", moneyText(employeeContribution + employerContribution, values.currency, 2)),
        ],
        [
          moneyBar("Current balance", values.currentBalance, values.currency, 2),
          moneyBar("Annual employee contribution", employeeContribution, values.currency, 2),
          moneyBar("Annual employer match", employerContribution, values.currency, 2),
          moneyBar("Projected balance", balance, values.currency, 2),
        ],
        [],
        [
          note("Employee rate", percent(values.contributionRate)),
          note("Employer match", `${values.employerMatchRate}% up to ${values.employerMatchCap}%`),
        ],
      );
    },
  };
}

function makeRothIraConfig() {
  return {
    title: "Roth IRA Calculator",
    actionLabel: "Calculate Roth IRA",
    emptyState: "Project Roth IRA growth from the current balance, annual contribution, and return assumptions.",
    summaryLabel: "Roth IRA estimate",
    defaultHistoryLabel: "Roth IRA scenario",
    defaults: { currentBalance: 18000, annualContribution: 7000, years: 25, annualReturn: 7, currency: "USD" },
    mainFields: [
      moneyField("currentBalance", "Current Roth IRA balance", 100),
      moneyField("annualContribution", "Annual contribution", 50),
      numberField("years", "Years invested", 1, 45, 1),
      percentField("annualReturn", "Annual return", 0, 20, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.annualContribution < 0 ? "Use zero or a positive contribution amount." : "";
    },
    compute(values) {
      let balance = values.currentBalance;
      for (let year = 0; year < values.years; year += 1) {
        balance = balance * (1 + values.annualReturn / 100) + values.annualContribution;
      }
      const totalContributions = values.currentBalance + values.annualContribution * values.years;

      return result(
        "Roth IRA projection",
        [
          card("Projected balance", moneyText(balance, values.currency, 2)),
          card("Annual contribution", moneyText(values.annualContribution, values.currency, 2)),
          card("Total contributions", moneyText(totalContributions, values.currency, 2)),
        ],
        [
          moneyBar("Current balance", values.currentBalance, values.currency, 2),
          moneyBar("Annual contribution", values.annualContribution, values.currency, 2),
          moneyBar("Projected balance", balance, values.currency, 2),
        ],
        [],
        [note("Annual return", percent(values.annualReturn))],
      );
    },
  };
}

function makeInflationConfig() {
  return {
    title: "Inflation Calculator",
    actionLabel: "Calculate inflation",
    emptyState: "Estimate how inflation changes future costs and present-day buying power over time.",
    summaryLabel: "Inflation estimate",
    defaultHistoryLabel: "Inflation scenario",
    defaults: { currentAmount: 50000, inflationRate: 3, years: 10, currency: "USD" },
    mainFields: [
      moneyField("currentAmount", "Current amount", 100),
      percentField("inflationRate", "Annual inflation rate", 0, 20, 0.1),
      numberField("years", "Years", 1, 50, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.currentAmount <= 0 ? "Enter a current amount." : "";
    },
    compute(values) {
      const futureCost = values.currentAmount * Math.pow(1 + values.inflationRate / 100, values.years);
      const futureBuyingPower = values.currentAmount / Math.pow(1 + values.inflationRate / 100, values.years);

      return result(
        "Inflation estimate",
        [
          card("Future cost", moneyText(futureCost, values.currency, 2)),
          card("Future buying power", moneyText(futureBuyingPower, values.currency, 2)),
          card("Inflation uplift", moneyText(futureCost - values.currentAmount, values.currency, 2)),
        ],
        [
          moneyBar("Current amount", values.currentAmount, values.currency, 2),
          moneyBar("Future cost", futureCost, values.currency, 2),
          moneyBar("Buying power loss", values.currentAmount - futureBuyingPower, values.currency, 2),
        ],
        [],
        [note("Inflation rate", percent(values.inflationRate))],
      );
    },
  };
}

function makeSelfEmploymentTaxConfig() {
  return {
    title: "Self-Employment Tax Calculator",
    actionLabel: "Estimate self-employment tax",
    emptyState: "Estimate self-employment tax using net earnings and the standard U.S. self-employment tax treatment.",
    summaryLabel: "Self-employment tax estimate",
    defaultHistoryLabel: "Self-employment tax scenario",
    defaults: { netEarnings: 95000, currency: "USD" },
    mainFields: [moneyField("netEarnings", "Net self-employment earnings", 100)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.netEarnings <= 0 ? "Enter net self-employment earnings." : "";
    },
    compute(values) {
      const taxable = values.netEarnings * 0.9235;
      const tax = taxable * 0.153;
      const deduction = tax / 2;

      return result(
        "Self-employment tax estimate",
        [
          card("Self-employment tax", moneyText(tax, values.currency, 2)),
          card("Taxable base", moneyText(taxable, values.currency, 2)),
          card("Half-tax deduction", moneyText(deduction, values.currency, 2)),
        ],
        [
          moneyBar("Net earnings", values.netEarnings, values.currency, 2),
          moneyBar("Taxable base", taxable, values.currency, 2),
          moneyBar("Estimated tax", tax, values.currency, 2),
        ],
        [],
        [note("Rate used", "15.3% on 92.35% of net earnings")],
      );
    },
  };
}

function makeCapitalGainsTaxConfig() {
  return {
    title: "Capital Gains Tax Calculator",
    actionLabel: "Estimate capital gains tax",
    emptyState: "Estimate capital gains tax from a purchase price, sale price, and effective tax rate.",
    summaryLabel: "Capital gains estimate",
    defaultHistoryLabel: "Capital gains scenario",
    defaults: { purchasePrice: 18000, salePrice: 32500, taxRate: 15, currency: "USD" },
    mainFields: [
      moneyField("purchasePrice", "Purchase price", 10),
      moneyField("salePrice", "Sale price", 10),
      percentField("taxRate", "Capital gains tax rate", 0, 50, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.salePrice <= values.purchasePrice ? "Sale price should be higher than purchase price to create a gain." : "";
    },
    compute(values) {
      const gain = values.salePrice - values.purchasePrice;
      const tax = gain * (values.taxRate / 100);
      const afterTax = values.salePrice - tax;

      return result(
        "Capital gains estimate",
        [
          card("Capital gain", moneyText(gain, values.currency, 2)),
          card("Tax owed", moneyText(tax, values.currency, 2)),
          card("After-tax proceeds", moneyText(afterTax, values.currency, 2)),
        ],
        [
          moneyBar("Purchase price", values.purchasePrice, values.currency, 2),
          moneyBar("Sale price", values.salePrice, values.currency, 2),
          moneyBar("Capital gain", gain, values.currency, 2),
          moneyBar("Tax owed", tax, values.currency, 2),
        ],
        [],
        [note("Tax rate", percent(values.taxRate))],
      );
    },
  };
}

function makeAprConfig() {
  return {
    title: "APR Calculator",
    actionLabel: "Calculate APR",
    emptyState: "Estimate annual percentage rate from the borrowed amount, fees, monthly payment, and term.",
    summaryLabel: "APR estimate",
    defaultHistoryLabel: "APR scenario",
    defaults: { loanAmount: 24000, fees: 1200, monthlyPayment: 525, years: 5, currency: "USD" },
    mainFields: [
      moneyField("loanAmount", "Loan amount", 100),
      moneyField("fees", "Upfront fees", 10),
      moneyField("monthlyPayment", "Monthly payment", 10),
      numberField("years", "Loan term (years)", 1, 30, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.loanAmount <= 0) return "Enter a loan amount.";
      if (values.loanAmount <= values.fees) return "Fees must be lower than the loan amount.";
      return values.monthlyPayment <= 0 ? "Enter a monthly payment." : "";
    },
    compute(values) {
      const amountFinanced = values.loanAmount - values.fees;
      const months = values.years * 12;
      const apr = solveApr(amountFinanced, values.monthlyPayment, months) * 12 * 100;
      const totalPaid = values.monthlyPayment * months;

      return result(
        "APR estimate",
        [
          card("APR", percent(apr)),
          card("Amount financed", moneyText(amountFinanced, values.currency, 2)),
          card("Total paid", moneyText(totalPaid, values.currency, 2)),
        ],
        [
          moneyBar("Loan amount", values.loanAmount, values.currency, 2),
          moneyBar("Fees", values.fees, values.currency, 2),
          moneyBar("Amount financed", amountFinanced, values.currency, 2),
          moneyBar("Monthly payment", values.monthlyPayment, values.currency, 2),
        ],
        [],
        [note("Term", `${values.years} years`)],
      );
    },
  };
}

function makeDebtToIncomeConfig() {
  return {
    title: "Debt-to-Income Ratio Calculator",
    actionLabel: "Calculate DTI",
    emptyState: "Estimate monthly debt-to-income ratio from gross income and recurring debt payments.",
    summaryLabel: "Debt-to-income estimate",
    defaultHistoryLabel: "Debt-to-income scenario",
    defaults: { grossMonthlyIncome: 9200, monthlyDebtPayments: 1850, currency: "USD" },
    mainFields: [
      moneyField("grossMonthlyIncome", "Gross monthly income", 50),
      moneyField("monthlyDebtPayments", "Monthly debt payments", 10),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.grossMonthlyIncome <= 0 ? "Enter gross monthly income." : "";
    },
    compute(values) {
      const ratio = values.monthlyDebtPayments / values.grossMonthlyIncome * 100;
      const band = ratio < 36 ? "Healthy range" : ratio < 43 ? "Manageable but tighter" : "High";

      return result(
        "Debt-to-income estimate",
        [
          card("DTI ratio", percent(ratio)),
          card("Assessment", band),
        ],
        [
          moneyBar("Gross monthly income", values.grossMonthlyIncome, values.currency, 2),
          moneyBar("Monthly debt payments", values.monthlyDebtPayments, values.currency, 2),
        ],
        [],
        [note("Typical underwriting target", "36% to 43% depending on lender")],
      );
    },
  };
}

function makeCalorieCalculatorConfig() {
  return {
    title: "Calorie Calculator",
    actionLabel: "Calculate calories",
    emptyState: "Estimate target calories for maintaining, losing, or gaining weight based on your body metrics and activity.",
    summaryLabel: "Calorie target",
    defaultHistoryLabel: "Calorie scenario",
    defaults: { sex: "male", age: 31, weightKg: 78, heightCm: 178, activity: "moderate", goal: "maintain" },
    mainFields: [
      { name: "sex", label: "Sex", type: "select", options: SEX_OPTIONS },
      numberField("age", "Age", 14, 100, 1),
      numberField("weightKg", "Weight (kg)", 20, 300, 0.1),
      numberField("heightCm", "Height (cm)", 100, 250, 0.1),
      { name: "activity", label: "Activity level", type: "select", options: ACTIVITY_OPTIONS },
      { name: "goal", label: "Goal", type: "select", options: CALORIE_GOAL_OPTIONS },
    ],
    advancedFields: [],
    validate(values) {
      return values.weightKg <= 0 || values.heightCm <= 0 ? "Enter both height and weight." : "";
    },
    compute(values) {
      const bmr = calculateBmr(values);
      const tdee = bmr * getActivityMultiplier(values.activity);
      const adjustment = values.goal === "lose" ? -500 : values.goal === "gain" ? 300 : 0;
      const targetCalories = Math.max(1200, tdee + adjustment);

      return result(
        "Calorie target",
        [
          card("Target calories", `${count(targetCalories)} kcal/day`),
          card("Maintenance calories", `${count(tdee)} kcal/day`),
          card("BMR", `${count(bmr)} kcal/day`),
        ],
        [
          plainBar("Weight", values.weightKg, `${fixed(values.weightKg)} kg`),
          plainBar("Height", values.heightCm, `${fixed(values.heightCm)} cm`),
          plainBar("Target calories", targetCalories, `${count(targetCalories)} kcal/day`),
        ],
        [],
        [
          note("Activity", ACTIVITY_OPTIONS.find((item) => item.value === values.activity)?.label || "Moderately active"),
          note("Goal", CALORIE_GOAL_OPTIONS.find((item) => item.value === values.goal)?.label || "Maintain weight"),
        ],
      );
    },
  };
}

function makeTdeeCalculatorConfig() {
  return {
    title: "TDEE Calculator",
    actionLabel: "Calculate TDEE",
    emptyState: "Estimate total daily energy expenditure from your body metrics and activity level.",
    summaryLabel: "TDEE estimate",
    defaultHistoryLabel: "TDEE scenario",
    defaults: { sex: "female", age: 29, weightKg: 64, heightCm: 168, activity: "light" },
    mainFields: [
      { name: "sex", label: "Sex", type: "select", options: SEX_OPTIONS },
      numberField("age", "Age", 14, 100, 1),
      numberField("weightKg", "Weight (kg)", 20, 300, 0.1),
      numberField("heightCm", "Height (cm)", 100, 250, 0.1),
      { name: "activity", label: "Activity level", type: "select", options: ACTIVITY_OPTIONS },
    ],
    advancedFields: [],
    validate(values) {
      return values.weightKg <= 0 || values.heightCm <= 0 ? "Enter both height and weight." : "";
    },
    compute(values) {
      const bmr = calculateBmr(values);
      const tdee = bmr * getActivityMultiplier(values.activity);

      return result(
        "TDEE estimate",
        [
          card("TDEE", `${count(tdee)} kcal/day`),
          card("BMR", `${count(bmr)} kcal/day`),
          card("Mild cut", `${count(Math.max(1200, tdee - 350))} kcal/day`),
          card("Lean bulk", `${count(tdee + 250)} kcal/day`),
        ],
        [
          plainBar("Weight", values.weightKg, `${fixed(values.weightKg)} kg`),
          plainBar("Height", values.heightCm, `${fixed(values.heightCm)} cm`),
          plainBar("TDEE", tdee, `${count(tdee)} kcal/day`),
        ],
        [],
        [note("Activity", ACTIVITY_OPTIONS.find((item) => item.value === values.activity)?.label || "Lightly active")],
      );
    },
  };
}

function makeBodyFatConfig() {
  return {
    title: "Body Fat Calculator",
    actionLabel: "Calculate body fat",
    emptyState: "Estimate body fat percentage using the U.S. Navy body measurement formula.",
    summaryLabel: "Body fat estimate",
    defaultHistoryLabel: "Body fat scenario",
    defaults: { sex: "male", heightCm: 178, neckCm: 39, waistCm: 88, hipCm: 98, weightKg: 78 },
    mainFields: [
      { name: "sex", label: "Sex", type: "select", options: SEX_OPTIONS },
      numberField("heightCm", "Height (cm)", 120, 250, 0.1),
      numberField("neckCm", "Neck (cm)", 20, 80, 0.1),
      numberField("waistCm", "Waist (cm)", 30, 200, 0.1),
      numberField("hipCm", "Hip (cm, for women)", 0, 200, 0.1),
      numberField("weightKg", "Weight (kg)", 20, 300, 0.1),
    ],
    advancedFields: [],
    validate(values) {
      if (values.sex === "male" && values.waistCm <= values.neckCm) return "Waist should be greater than neck for the formula.";
      if (values.sex === "female" && values.waistCm + values.hipCm <= values.neckCm) return "Waist plus hip should be greater than neck for the formula.";
      return "";
    },
    compute(values) {
      const bodyFat = clamp(getBodyFatPercentage(values), 2, 60);
      const fatMass = values.weightKg * (bodyFat / 100);
      const leanMass = values.weightKg - fatMass;
      const category = bodyFat < 14 ? "Athletic lean" : bodyFat < 21 ? "Fit" : bodyFat < 28 ? "Average" : "Higher";

      return result(
        "Body fat estimate",
        [
          card("Body fat", percent(bodyFat)),
          card("Lean mass", `${fixed(leanMass)} kg`),
          card("Fat mass", `${fixed(fatMass)} kg`),
          card("Range", category),
        ],
        [
          plainBar("Waist", values.waistCm, `${fixed(values.waistCm)} cm`),
          plainBar("Neck", values.neckCm, `${fixed(values.neckCm)} cm`),
          plainBar("Height", values.heightCm, `${fixed(values.heightCm)} cm`),
          plainBar("Weight", values.weightKg, `${fixed(values.weightKg)} kg`),
        ],
        [],
        [note("Method", "U.S. Navy formula")],
      );
    },
  };
}

function makeOvulationConfig() {
  return {
    title: "Ovulation Calculator",
    actionLabel: "Calculate ovulation",
    emptyState: "Estimate ovulation day, fertile window, and next period date from a cycle starting date.",
    summaryLabel: "Ovulation estimate",
    defaultHistoryLabel: "Ovulation scenario",
    defaults: { lastPeriodDate: shiftDate(todayString(), -9), cycleLength: 28, periodLength: 5, lutealPhase: 14 },
    mainFields: [
      dateField("lastPeriodDate", "First day of last period"),
      numberField("cycleLength", "Cycle length (days)", 20, 45, 1),
      numberField("periodLength", "Period length (days)", 1, 10, 1),
      numberField("lutealPhase", "Luteal phase (days)", 10, 16, 1),
    ],
    advancedFields: [],
    validate(values) {
      return !values.lastPeriodDate ? "Enter the first day of the last period." : "";
    },
    compute(values) {
      const ovulationDate = shiftDateObject(values.lastPeriodDate, values.cycleLength - values.lutealPhase);
      const fertileStart = shiftDateObject(ovulationDate, -5);
      const fertileEnd = shiftDateObject(ovulationDate, 1);
      const nextPeriod = shiftDateObject(values.lastPeriodDate, values.cycleLength);

      return result(
        "Ovulation estimate",
        [
          card("Likely ovulation", formatDate(ovulationDate)),
          card("Fertile window", `${formatDate(fertileStart)} to ${formatDate(fertileEnd)}`),
          card("Next period", formatDate(nextPeriod)),
        ],
        [
          plainBar("Cycle length", values.cycleLength, `${values.cycleLength} days`),
          plainBar("Period length", values.periodLength, `${values.periodLength} days`),
          plainBar("Luteal phase", values.lutealPhase, `${values.lutealPhase} days`),
        ],
        [],
        [note("Cycle start", formatDate(values.lastPeriodDate))],
      );
    },
  };
}

function makeMacroConfig() {
  return {
    title: "Macro Calculator",
    actionLabel: "Calculate macros",
    emptyState: "Turn a daily calorie target into grams of protein, carbs, and fat using a macro split.",
    summaryLabel: "Macro estimate",
    defaultHistoryLabel: "Macro scenario",
    defaults: { calories: 2200, proteinPercent: 30, carbPercent: 40, fatPercent: 30 },
    mainFields: [
      numberField("calories", "Calories per day", 1000, 6000, 10),
      percentField("proteinPercent", "Protein %", 0, 100, 1),
      percentField("carbPercent", "Carbs %", 0, 100, 1),
      percentField("fatPercent", "Fat %", 0, 100, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.proteinPercent + values.carbPercent + values.fatPercent !== 100 ? "Protein, carbs, and fat percentages should add up to 100." : "";
    },
    compute(values) {
      const proteinGrams = values.calories * (values.proteinPercent / 100) / 4;
      const carbGrams = values.calories * (values.carbPercent / 100) / 4;
      const fatGrams = values.calories * (values.fatPercent / 100) / 9;

      return result(
        "Macro estimate",
        [
          card("Protein", `${fixed(proteinGrams)} g/day`),
          card("Carbs", `${fixed(carbGrams)} g/day`),
          card("Fat", `${fixed(fatGrams)} g/day`),
          card("Calories", `${count(values.calories)} kcal/day`),
        ],
        [
          plainBar("Protein split", values.proteinPercent, percent(values.proteinPercent)),
          plainBar("Carb split", values.carbPercent, percent(values.carbPercent)),
          plainBar("Fat split", values.fatPercent, percent(values.fatPercent)),
        ],
        [],
        [note("Macro split", `${values.proteinPercent}/${values.carbPercent}/${values.fatPercent}`)],
      );
    },
  };
}

function makeCalorieDeficitConfig() {
  return {
    title: "Calorie Deficit Calculator",
    actionLabel: "Calculate deficit",
    emptyState: "Estimate a daily calorie target based on maintenance calories and a weekly fat-loss target.",
    summaryLabel: "Calorie deficit estimate",
    defaultHistoryLabel: "Calorie deficit scenario",
    defaults: { maintenanceCalories: 2450, weeklyLossLbs: 1 },
    mainFields: [
      numberField("maintenanceCalories", "Maintenance calories", 1200, 6000, 10),
      numberField("weeklyLossLbs", "Target weekly loss (lb)", 0.25, 2, 0.25),
    ],
    advancedFields: [],
    validate(values) {
      return values.maintenanceCalories <= 0 ? "Enter maintenance calories." : "";
    },
    compute(values) {
      const dailyDeficit = values.weeklyLossLbs * 500;
      const targetCalories = Math.max(1200, values.maintenanceCalories - dailyDeficit);

      return result(
        "Calorie deficit estimate",
        [
          card("Target calories", `${count(targetCalories)} kcal/day`),
          card("Daily deficit", `${count(dailyDeficit)} kcal/day`),
          card("Weekly loss target", `${fixed(values.weeklyLossLbs)} lb/week`),
        ],
        [
          plainBar("Maintenance calories", values.maintenanceCalories, `${count(values.maintenanceCalories)} kcal/day`),
          plainBar("Daily deficit", dailyDeficit, `${count(dailyDeficit)} kcal/day`),
        ],
        [],
        [note("Reminder", "This is a planning estimate, not medical advice.")],
      );
    },
  };
}

function makeProteinIntakeConfig() {
  return {
    title: "Protein Intake Calculator",
    actionLabel: "Calculate protein",
    emptyState: "Estimate a daily protein target from body weight, activity, and goal.",
    summaryLabel: "Protein target",
    defaultHistoryLabel: "Protein intake scenario",
    defaults: { weightKg: 78, activity: "moderate", goal: "muscle-gain" },
    mainFields: [
      numberField("weightKg", "Weight (kg)", 20, 300, 0.1),
      { name: "activity", label: "Activity level", type: "select", options: ACTIVITY_OPTIONS },
      { name: "goal", label: "Goal", type: "select", options: PROTEIN_GOAL_OPTIONS },
    ],
    advancedFields: [],
    validate(values) {
      return values.weightKg <= 0 ? "Enter body weight." : "";
    },
    compute(values) {
      const multiplier = getProteinMultiplier(values.activity, values.goal);
      const target = values.weightKg * multiplier;
      const lower = values.weightKg * Math.max(1.2, multiplier - 0.2);

      return result(
        "Protein target",
        [
          card("Daily protein", `${fixed(target)} g/day`),
          card("Suggested range", `${fixed(lower)} to ${fixed(target)} g/day`),
          card("Per meal (4 meals)", `${fixed(target / 4)} g`),
        ],
        [
          plainBar("Weight", values.weightKg, `${fixed(values.weightKg)} kg`),
          plainBar("Multiplier", multiplier, `${fixed(multiplier)} g/kg`),
        ],
        [],
        [note("Goal", PROTEIN_GOAL_OPTIONS.find((item) => item.value === values.goal)?.label || "Maintain")],
      );
    },
  };
}

function makeIdealWeightConfig() {
  return {
    title: "Ideal Weight Calculator",
    actionLabel: "Calculate ideal weight",
    emptyState: "Estimate ideal body weight and healthy BMI range from sex and height.",
    summaryLabel: "Ideal weight estimate",
    defaultHistoryLabel: "Ideal weight scenario",
    defaults: { sex: "female", heightCm: 168 },
    mainFields: [
      { name: "sex", label: "Sex", type: "select", options: SEX_OPTIONS },
      numberField("heightCm", "Height (cm)", 120, 250, 0.1),
    ],
    advancedFields: [],
    validate(values) {
      return values.heightCm <= 0 ? "Enter height." : "";
    },
    compute(values) {
      const inches = values.heightCm / 2.54;
      const idealWeight = values.sex === "male"
        ? 50 + Math.max(0, inches - 60) * 2.3
        : 45.5 + Math.max(0, inches - 60) * 2.3;
      const minHealthy = 18.5 * Math.pow(values.heightCm / 100, 2);
      const maxHealthy = 24.9 * Math.pow(values.heightCm / 100, 2);

      return result(
        "Ideal weight estimate",
        [
          card("Ideal weight", `${fixed(idealWeight)} kg`),
          card("Healthy BMI range", `${fixed(minHealthy)} to ${fixed(maxHealthy)} kg`),
        ],
        [
          plainBar("Height", values.heightCm, `${fixed(values.heightCm)} cm`),
          plainBar("Ideal weight", idealWeight, `${fixed(idealWeight)} kg`),
        ],
        [],
        [note("Formula", "Devine ideal body weight")],
      );
    },
  };
}

function makeLeanBodyMassConfig() {
  return {
    title: "Lean Body Mass Calculator",
    actionLabel: "Calculate lean mass",
    emptyState: "Estimate lean body mass and fat mass from body weight and body fat percentage.",
    summaryLabel: "Lean body mass estimate",
    defaultHistoryLabel: "Lean body mass scenario",
    defaults: { weightKg: 82, bodyFatPercent: 19 },
    mainFields: [
      numberField("weightKg", "Weight (kg)", 20, 300, 0.1),
      percentField("bodyFatPercent", "Body fat %", 2, 60, 0.1),
    ],
    advancedFields: [],
    validate(values) {
      return values.weightKg <= 0 ? "Enter body weight." : "";
    },
    compute(values) {
      const leanMass = values.weightKg * (1 - values.bodyFatPercent / 100);
      const fatMass = values.weightKg - leanMass;

      return result(
        "Lean body mass estimate",
        [
          card("Lean body mass", `${fixed(leanMass)} kg`),
          card("Fat mass", `${fixed(fatMass)} kg`),
        ],
        [
          plainBar("Weight", values.weightKg, `${fixed(values.weightKg)} kg`),
          plainBar("Body fat", values.bodyFatPercent, percent(values.bodyFatPercent)),
        ],
        [],
        [],
      );
    },
  };
}

function makePaceConfig() {
  return {
    title: "Pace Calculator",
    actionLabel: "Calculate pace",
    emptyState: "Estimate pace per kilometer or mile from distance and finish time.",
    summaryLabel: "Pace estimate",
    defaultHistoryLabel: "Pace scenario",
    defaults: { distance: 10, distanceUnit: "km", hours: 0, minutes: 52, seconds: 30 },
    mainFields: [
      numberField("distance", "Distance", 0.1, 500, 0.1),
      { name: "distanceUnit", label: "Distance unit", type: "select", options: PACE_UNIT_OPTIONS },
      numberField("hours", "Hours", 0, 12, 1),
      numberField("minutes", "Minutes", 0, 59, 1),
      numberField("seconds", "Seconds", 0, 59, 1),
    ],
    advancedFields: [],
    validate(values) {
      if (values.distance <= 0) return "Enter a distance greater than zero.";
      return values.hours + values.minutes + values.seconds <= 0 ? "Enter a finish time greater than zero." : "";
    },
    compute(values) {
      const totalSeconds = values.hours * 3600 + values.minutes * 60 + values.seconds;
      const totalHours = totalSeconds / 3600;
      const distanceKm = values.distanceUnit === "km" ? values.distance : values.distance * 1.60934;
      const distanceMiles = values.distanceUnit === "mile" ? values.distance : values.distance / 1.60934;
      const pacePerKm = totalSeconds / distanceKm;
      const pacePerMile = totalSeconds / distanceMiles;
      const speedKph = distanceKm / totalHours;
      const speedMph = distanceMiles / totalHours;

      return result(
        "Pace estimate",
        [
          card("Pace / km", formatDuration(pacePerKm)),
          card("Pace / mile", formatDuration(pacePerMile)),
          card("Speed (km/h)", `${fixed(speedKph)} km/h`),
          card("Speed (mph)", `${fixed(speedMph)} mph`),
        ],
        [
          plainBar("Distance", values.distance, `${fixed(values.distance)} ${values.distanceUnit === "km" ? "km" : "mi"}`),
          plainBar("Finish time", totalSeconds, formatDuration(totalSeconds)),
        ],
        [],
        [],
      );
    },
  };
}

function makeOneRepMaxConfig() {
  return {
    title: "One-Rep Max Calculator",
    actionLabel: "Calculate 1RM",
    emptyState: "Estimate one-rep max strength from a lifted weight and rep count.",
    summaryLabel: "One-rep max estimate",
    defaultHistoryLabel: "One-rep max scenario",
    defaults: { liftedWeight: 85, reps: 5 },
    mainFields: [
      numberField("liftedWeight", "Lifted weight", 1, 1000, 0.5),
      numberField("reps", "Reps completed", 1, 20, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.reps <= 0 ? "Enter reps completed." : "";
    },
    compute(values) {
      const epley = values.liftedWeight * (1 + values.reps / 30);
      const brzycki = values.liftedWeight * 36 / Math.max(37 - values.reps, 1);
      const estimate = (epley + brzycki) / 2;

      return result(
        "One-rep max estimate",
        [
          card("Estimated 1RM", `${fixed(estimate)}`),
          card("Epley", `${fixed(epley)}`),
          card("Brzycki", `${fixed(brzycki)}`),
        ],
        [
          plainBar("Lifted weight", values.liftedWeight, fixed(values.liftedWeight)),
          plainBar("Reps", values.reps, String(values.reps)),
        ],
        [],
        [note("Tip", "These formulas are best used for moderate rep counts, not max-effort sets.")],
      );
    },
  };
}

function makeTargetHeartRateConfig() {
  return {
    title: "Target Heart Rate Calculator",
    actionLabel: "Calculate heart rate",
    emptyState: "Estimate a target heart-rate training zone from age, resting heart rate, and intensity range.",
    summaryLabel: "Target heart-rate estimate",
    defaultHistoryLabel: "Target heart-rate scenario",
    defaults: { age: 33, restingHeartRate: 62, lowIntensity: 60, highIntensity: 80 },
    mainFields: [
      numberField("age", "Age", 10, 100, 1),
      numberField("restingHeartRate", "Resting heart rate", 35, 120, 1),
      percentField("lowIntensity", "Low intensity", 40, 90, 1),
      percentField("highIntensity", "High intensity", 50, 95, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.highIntensity <= values.lowIntensity ? "High intensity should be above low intensity." : "";
    },
    compute(values) {
      const maxHeartRate = 220 - values.age;
      const reserve = maxHeartRate - values.restingHeartRate;
      const lowTarget = reserve * (values.lowIntensity / 100) + values.restingHeartRate;
      const highTarget = reserve * (values.highIntensity / 100) + values.restingHeartRate;

      return result(
        "Target heart-rate estimate",
        [
          card("Training zone", `${count(lowTarget)} to ${count(highTarget)} bpm`),
          card("Max heart rate", `${count(maxHeartRate)} bpm`),
        ],
        [
          plainBar("Resting heart rate", values.restingHeartRate, `${values.restingHeartRate} bpm`),
          plainBar("Intensity range", values.lowIntensity, `${values.lowIntensity}% to ${values.highIntensity}%`),
        ],
        [],
        [note("Method", "Karvonen heart-rate reserve method")],
      );
    },
  };
}

function makeRoofingConfig() {
  return {
    title: "Roofing Calculator",
    actionLabel: "Calculate roofing",
    emptyState: "Estimate roof area, squares, and shingle bundles from footprint, pitch, and waste.",
    summaryLabel: "Roofing estimate",
    defaultHistoryLabel: "Roofing scenario",
    defaults: { roofLength: 48, roofWidth: 28, pitchMultiplier: "1.118", wastePercent: 10 },
    mainFields: [
      numberField("roofLength", "Roof length (ft)", 1, 500, 0.1),
      numberField("roofWidth", "Roof width (ft)", 1, 500, 0.1),
      { name: "pitchMultiplier", label: "Roof pitch", type: "select", options: ROOF_PITCH_OPTIONS },
      percentField("wastePercent", "Waste allowance", 0, 25, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.roofLength <= 0 || values.roofWidth <= 0 ? "Enter roof dimensions." : "";
    },
    compute(values) {
      const multiplier = Number(values.pitchMultiplier || 1) || 1;
      const actualArea = values.roofLength * values.roofWidth * multiplier;
      const adjustedArea = actualArea * (1 + values.wastePercent / 100);
      const squares = adjustedArea / 100;
      const bundles = Math.ceil(squares * 3);
      const underlayment = Math.ceil(adjustedArea / 400);

      return result(
        "Roofing estimate",
        [
          card("Roof area", `${count(adjustedArea)} sq ft`),
          card("Squares", fixed(squares)),
          card("Bundles", String(bundles)),
          card("Underlayment rolls", String(underlayment)),
        ],
        [
          plainBar("Base footprint", values.roofLength * values.roofWidth, `${count(values.roofLength * values.roofWidth)} sq ft`),
          plainBar("Slope-adjusted area", actualArea, `${count(actualArea)} sq ft`),
          plainBar("Waste-adjusted area", adjustedArea, `${count(adjustedArea)} sq ft`),
        ],
        [],
        [note("Waste allowance", percent(values.wastePercent))],
      );
    },
  };
}

function makePaintConfig() {
  return {
    title: "Paint Calculator",
    actionLabel: "Calculate paint",
    emptyState: "Estimate paint gallons from room dimensions, coats, and paint coverage.",
    summaryLabel: "Paint estimate",
    defaultHistoryLabel: "Paint scenario",
    defaults: { roomLength: 18, roomWidth: 14, wallHeight: 9, coats: 2, doorWindowArea: 40, coveragePerGallon: 350 },
    mainFields: [
      numberField("roomLength", "Room length (ft)", 1, 200, 0.1),
      numberField("roomWidth", "Room width (ft)", 1, 200, 0.1),
      numberField("wallHeight", "Wall height (ft)", 1, 30, 0.1),
      numberField("coats", "Coats", 1, 5, 1),
      numberField("doorWindowArea", "Doors and windows (sq ft)", 0, 500, 1),
      numberField("coveragePerGallon", "Coverage per gallon (sq ft)", 100, 600, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.coveragePerGallon <= 0 ? "Coverage per gallon must be above zero." : "";
    },
    compute(values) {
      const wallArea = Math.max(0, 2 * (values.roomLength + values.roomWidth) * values.wallHeight - values.doorWindowArea);
      const totalArea = wallArea * values.coats;
      const gallons = totalArea / values.coveragePerGallon;

      return result(
        "Paint estimate",
        [
          card("Gallons needed", fixed(gallons)),
          card("Wall area", `${count(wallArea)} sq ft`),
          card("Paintable area", `${count(totalArea)} sq ft`),
        ],
        [
          plainBar("Wall area", wallArea, `${count(wallArea)} sq ft`),
          plainBar("Coats", values.coats, String(values.coats)),
          plainBar("Gallons needed", gallons, fixed(gallons)),
        ],
        [],
        [note("Coverage", `${count(values.coveragePerGallon)} sq ft per gallon`)],
      );
    },
  };
}

function makeConcreteConfig() {
  return {
    title: "Concrete Calculator",
    actionLabel: "Calculate concrete",
    emptyState: "Estimate concrete volume in cubic feet, cubic yards, and bag counts for a slab or pad.",
    summaryLabel: "Concrete estimate",
    defaultHistoryLabel: "Concrete scenario",
    defaults: { length: 20, width: 12, depthInches: 4 },
    mainFields: [
      numberField("length", "Length (ft)", 0.1, 500, 0.1),
      numberField("width", "Width (ft)", 0.1, 500, 0.1),
      numberField("depthInches", "Depth (in)", 1, 48, 0.5),
    ],
    advancedFields: [],
    validate(values) {
      return values.length <= 0 || values.width <= 0 ? "Enter slab dimensions." : "";
    },
    compute(values) {
      const cubicFeet = values.length * values.width * (values.depthInches / 12);
      const cubicYards = cubicFeet / 27;
      const bags80 = Math.ceil(cubicFeet / 0.6);
      const bags60 = Math.ceil(cubicFeet / 0.45);

      return result(
        "Concrete estimate",
        [
          card("Cubic yards", fixed(cubicYards)),
          card("Cubic feet", fixed(cubicFeet)),
          card("80 lb bags", String(bags80)),
          card("60 lb bags", String(bags60)),
        ],
        [
          plainBar("Volume", cubicFeet, `${fixed(cubicFeet)} cu ft`),
          plainBar("Volume", cubicYards, `${fixed(cubicYards)} cu yd`),
        ],
        [],
        [note("Depth", `${fixed(values.depthInches)} in`)],
      );
    },
  };
}

function makeTileConfig() {
  return {
    title: "Tile Calculator",
    actionLabel: "Calculate tile",
    emptyState: "Estimate tile count from floor area, tile size, and waste allowance.",
    summaryLabel: "Tile estimate",
    defaultHistoryLabel: "Tile scenario",
    defaults: { floorLength: 16, floorWidth: 12, tileLength: 12, tileWidth: 24, wastePercent: 10 },
    mainFields: [
      numberField("floorLength", "Floor length (ft)", 0.1, 500, 0.1),
      numberField("floorWidth", "Floor width (ft)", 0.1, 500, 0.1),
      numberField("tileLength", "Tile length (in)", 1, 60, 0.1),
      numberField("tileWidth", "Tile width (in)", 1, 60, 0.1),
      percentField("wastePercent", "Waste allowance", 0, 25, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.tileLength <= 0 || values.tileWidth <= 0 ? "Enter tile dimensions." : "";
    },
    compute(values) {
      const floorArea = values.floorLength * values.floorWidth;
      const adjustedArea = floorArea * (1 + values.wastePercent / 100);
      const tileArea = values.tileLength * values.tileWidth / 144;
      const tilesNeeded = Math.ceil(adjustedArea / tileArea);

      return result(
        "Tile estimate",
        [
          card("Tiles needed", String(tilesNeeded)),
          card("Area with waste", `${count(adjustedArea)} sq ft`),
          card("Tile size", `${fixed(values.tileLength)} x ${fixed(values.tileWidth)} in`),
        ],
        [
          plainBar("Floor area", floorArea, `${count(floorArea)} sq ft`),
          plainBar("Tile area", tileArea, `${fixed(tileArea)} sq ft each`),
        ],
        [],
        [note("Waste allowance", percent(values.wastePercent))],
      );
    },
  };
}

function makeDrywallConfig() {
  return {
    title: "Drywall Calculator",
    actionLabel: "Calculate drywall",
    emptyState: "Estimate drywall sheets from wall area and the room shell dimensions.",
    summaryLabel: "Drywall estimate",
    defaultHistoryLabel: "Drywall scenario",
    defaults: { roomLength: 18, roomWidth: 14, wallHeight: 9, sheetCoverage: 32 },
    mainFields: [
      numberField("roomLength", "Room length (ft)", 1, 200, 0.1),
      numberField("roomWidth", "Room width (ft)", 1, 200, 0.1),
      numberField("wallHeight", "Wall height (ft)", 1, 30, 0.1),
      numberField("sheetCoverage", "Coverage per sheet (sq ft)", 32, 48, 16),
    ],
    advancedFields: [],
    validate(values) {
      return values.sheetCoverage <= 0 ? "Coverage per sheet must be greater than zero." : "";
    },
    compute(values) {
      const wallArea = 2 * (values.roomLength + values.roomWidth) * values.wallHeight;
      const sheets = Math.ceil(wallArea / values.sheetCoverage);

      return result(
        "Drywall estimate",
        [
          card("Sheets needed", String(sheets)),
          card("Wall area", `${count(wallArea)} sq ft`),
        ],
        [
          plainBar("Wall area", wallArea, `${count(wallArea)} sq ft`),
          plainBar("Coverage per sheet", values.sheetCoverage, `${count(values.sheetCoverage)} sq ft`),
        ],
        [],
        [],
      );
    },
  };
}

function makeDeckingConfig() {
  return {
    title: "Decking Calculator",
    actionLabel: "Calculate decking",
    emptyState: "Estimate board rows, lineal feet, and deck surface area from deck size and board spacing.",
    summaryLabel: "Decking estimate",
    defaultHistoryLabel: "Decking scenario",
    defaults: { deckLength: 20, deckWidth: 14, boardWidthInches: 5.5, gapInches: 0.125 },
    mainFields: [
      numberField("deckLength", "Deck length (ft)", 1, 200, 0.1),
      numberField("deckWidth", "Deck width (ft)", 1, 200, 0.1),
      numberField("boardWidthInches", "Board width (in)", 2, 12, 0.1),
      numberField("gapInches", "Gap between boards (in)", 0, 1, 0.01),
    ],
    advancedFields: [],
    validate(values) {
      return values.boardWidthInches <= 0 ? "Board width must be greater than zero." : "";
    },
    compute(values) {
      const rows = Math.ceil((values.deckWidth * 12) / (values.boardWidthInches + values.gapInches));
      const linealFeet = rows * values.deckLength;
      const area = values.deckLength * values.deckWidth;

      return result(
        "Decking estimate",
        [
          card("Board rows", String(rows)),
          card("Lineal feet", `${count(linealFeet)} ft`),
          card("Deck area", `${count(area)} sq ft`),
        ],
        [
          plainBar("Deck area", area, `${count(area)} sq ft`),
          plainBar("Rows", rows, String(rows)),
          plainBar("Lineal feet", linealFeet, `${count(linealFeet)} ft`),
        ],
        [],
        [note("Gap", `${fixed(values.gapInches)} in`)],
      );
    },
  };
}

function makeInsulationConfig() {
  return {
    title: "Insulation Calculator",
    actionLabel: "Calculate insulation",
    emptyState: "Estimate insulation packs or rolls from the square footage being covered.",
    summaryLabel: "Insulation estimate",
    defaultHistoryLabel: "Insulation scenario",
    defaults: { areaSqFt: 1500, coveragePerPack: 75, wastePercent: 8 },
    mainFields: [
      numberField("areaSqFt", "Area to insulate (sq ft)", 1, 20000, 1),
      numberField("coveragePerPack", "Coverage per pack (sq ft)", 1, 500, 1),
      percentField("wastePercent", "Waste allowance", 0, 25, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.coveragePerPack <= 0 ? "Coverage per pack must be greater than zero." : "";
    },
    compute(values) {
      const adjustedArea = values.areaSqFt * (1 + values.wastePercent / 100);
      const packs = Math.ceil(adjustedArea / values.coveragePerPack);

      return result(
        "Insulation estimate",
        [
          card("Packs needed", String(packs)),
          card("Coverage with waste", `${count(adjustedArea)} sq ft`),
        ],
        [
          plainBar("Base area", values.areaSqFt, `${count(values.areaSqFt)} sq ft`),
          plainBar("Coverage per pack", values.coveragePerPack, `${count(values.coveragePerPack)} sq ft`),
        ],
        [],
        [note("Waste allowance", percent(values.wastePercent))],
      );
    },
  };
}

function makeFenceConfig() {
  return {
    title: "Fence Calculator",
    actionLabel: "Calculate fence",
    emptyState: "Estimate fence panels and posts from perimeter, gate opening, and panel width.",
    summaryLabel: "Fence estimate",
    defaultHistoryLabel: "Fence scenario",
    defaults: { perimeter: 180, gateWidth: 4, panelWidth: 8 },
    mainFields: [
      numberField("perimeter", "Perimeter (ft)", 1, 5000, 1),
      numberField("gateWidth", "Gate opening (ft)", 0, 100, 0.1),
      numberField("panelWidth", "Panel width (ft)", 1, 20, 0.1),
    ],
    advancedFields: [],
    validate(values) {
      return values.panelWidth <= 0 ? "Panel width must be greater than zero." : "";
    },
    compute(values) {
      const fenceRun = Math.max(0, values.perimeter - values.gateWidth);
      const panels = Math.ceil(fenceRun / values.panelWidth);
      const posts = panels + 1;

      return result(
        "Fence estimate",
        [
          card("Fence panels", String(panels)),
          card("Posts", String(posts)),
          card("Fence run", `${fixed(fenceRun)} ft`),
        ],
        [
          plainBar("Perimeter", values.perimeter, `${fixed(values.perimeter)} ft`),
          plainBar("Gate opening", values.gateWidth, `${fixed(values.gateWidth)} ft`),
          plainBar("Fence run", fenceRun, `${fixed(fenceRun)} ft`),
        ],
        [],
        [],
      );
    },
  };
}

function makeTopsoilConfig() {
  return {
    title: "Topsoil Calculator",
    actionLabel: "Calculate topsoil",
    emptyState: "Estimate topsoil volume in cubic feet, cubic yards, and bag counts from bed dimensions.",
    summaryLabel: "Topsoil estimate",
    defaultHistoryLabel: "Topsoil scenario",
    defaults: { length: 30, width: 16, depthInches: 3 },
    mainFields: [
      numberField("length", "Length (ft)", 0.1, 500, 0.1),
      numberField("width", "Width (ft)", 0.1, 500, 0.1),
      numberField("depthInches", "Depth (in)", 0.5, 24, 0.5),
    ],
    advancedFields: [],
    validate(values) {
      return values.length <= 0 || values.width <= 0 ? "Enter bed dimensions." : "";
    },
    compute(values) {
      const cubicFeet = values.length * values.width * (values.depthInches / 12);
      const cubicYards = cubicFeet / 27;
      const bags = Math.ceil(cubicFeet / 0.75);

      return result(
        "Topsoil estimate",
        [
          card("Cubic yards", fixed(cubicYards)),
          card("Cubic feet", fixed(cubicFeet)),
          card("0.75 cu ft bags", String(bags)),
        ],
        [
          plainBar("Volume", cubicFeet, `${fixed(cubicFeet)} cu ft`),
          plainBar("Volume", cubicYards, `${fixed(cubicYards)} cu yd`),
        ],
        [],
        [note("Depth", `${fixed(values.depthInches)} in`)],
      );
    },
  };
}

function makeSodConfig() {
  return {
    title: "Sod Calculator",
    actionLabel: "Calculate sod",
    emptyState: "Estimate sod square footage, rolls, and pallets from lawn area plus waste.",
    summaryLabel: "Sod estimate",
    defaultHistoryLabel: "Sod scenario",
    defaults: { length: 40, width: 24, wastePercent: 8 },
    mainFields: [
      numberField("length", "Length (ft)", 0.1, 500, 0.1),
      numberField("width", "Width (ft)", 0.1, 500, 0.1),
      percentField("wastePercent", "Waste allowance", 0, 25, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.length <= 0 || values.width <= 0 ? "Enter lawn dimensions." : "";
    },
    compute(values) {
      const baseArea = values.length * values.width;
      const adjustedArea = baseArea * (1 + values.wastePercent / 100);
      const rolls = Math.ceil(adjustedArea / 10);
      const pallets = Math.ceil(adjustedArea / 500);

      return result(
        "Sod estimate",
        [
          card("Square footage", `${count(adjustedArea)} sq ft`),
          card("Sod rolls", String(rolls)),
          card("Pallets", String(pallets)),
        ],
        [
          plainBar("Base area", baseArea, `${count(baseArea)} sq ft`),
          plainBar("Area with waste", adjustedArea, `${count(adjustedArea)} sq ft`),
        ],
        [],
        [note("Waste allowance", percent(values.wastePercent))],
      );
    },
  };
}

function makePaverConfig() {
  return {
    title: "Paver Calculator",
    actionLabel: "Calculate pavers",
    emptyState: "Estimate paver count from patio size, paver size, and waste allowance.",
    summaryLabel: "Paver estimate",
    defaultHistoryLabel: "Paver scenario",
    defaults: { patioLength: 18, patioWidth: 14, paverLength: 8, paverWidth: 4, wastePercent: 8 },
    mainFields: [
      numberField("patioLength", "Patio length (ft)", 0.1, 500, 0.1),
      numberField("patioWidth", "Patio width (ft)", 0.1, 500, 0.1),
      numberField("paverLength", "Paver length (in)", 1, 24, 0.1),
      numberField("paverWidth", "Paver width (in)", 1, 24, 0.1),
      percentField("wastePercent", "Waste allowance", 0, 25, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.paverLength <= 0 || values.paverWidth <= 0 ? "Enter paver dimensions." : "";
    },
    compute(values) {
      const patioArea = values.patioLength * values.patioWidth;
      const adjustedArea = patioArea * (1 + values.wastePercent / 100);
      const paverArea = values.paverLength * values.paverWidth / 144;
      const pavers = Math.ceil(adjustedArea / paverArea);

      return result(
        "Paver estimate",
        [
          card("Pavers needed", String(pavers)),
          card("Area with waste", `${count(adjustedArea)} sq ft`),
          card("Paver size", `${fixed(values.paverLength)} x ${fixed(values.paverWidth)} in`),
        ],
        [
          plainBar("Patio area", patioArea, `${count(patioArea)} sq ft`),
          plainBar("Paver area", paverArea, `${fixed(paverArea)} sq ft each`),
        ],
        [],
        [note("Waste allowance", percent(values.wastePercent))],
      );
    },
  };
}

function makeRoofPitchConfig() {
  return {
    title: "Roof Pitch Calculator",
    actionLabel: "Calculate roof pitch",
    emptyState: "Estimate roof pitch, angle, and slope multiplier from rise and run measurements.",
    summaryLabel: "Roof pitch estimate",
    defaultHistoryLabel: "Roof pitch scenario",
    defaults: { rise: 6, run: 12 },
    mainFields: [
      numberField("rise", "Rise (in)", 0.1, 60, 0.1),
      numberField("run", "Run (in)", 0.1, 60, 0.1),
    ],
    advancedFields: [],
    validate(values) {
      return values.run <= 0 ? "Run must be greater than zero." : "";
    },
    compute(values) {
      const pitchPerTwelve = values.rise / values.run * 12;
      const angle = Math.atan(values.rise / values.run) * (180 / Math.PI);
      const multiplier = Math.sqrt(values.rise * values.rise + values.run * values.run) / values.run;

      return result(
        "Roof pitch estimate",
        [
          card("Pitch", `${fixed(pitchPerTwelve)}/12`),
          card("Angle", `${fixed(angle)} deg`),
          card("Slope multiplier", fixed(multiplier)),
        ],
        [
          plainBar("Rise", values.rise, `${fixed(values.rise)} in`),
          plainBar("Run", values.run, `${fixed(values.run)} in`),
        ],
        [],
        [],
      );
    },
  };
}

function result(title, summaryCards, breakdown, insights = [], meta = [], extras = {}) {
  const report = [
    title,
    "",
    "Summary",
    ...summaryCards.map((item) => `- ${item.label}: ${item.value}`),
    "",
    "Breakdown",
    ...breakdown.map((item) => `- ${item.label}: ${item.displayValue || plain(item.value)}`),
    ...(meta.length
      ? [
          "",
          "Notes",
          ...meta.map((item) => `- ${item.label}: ${item.value}`),
        ]
      : []),
  ].join("\n");

  return { title, summaryCards, breakdown, insights, meta, report, ...extras };
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

function currencyField() {
  return { name: "currency", label: "Currency", type: "select", options: CURRENCIES };
}

function dateField(name, label) {
  return { name, label, type: "date" };
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

function percent(value) {
  const number = clamp(Number.isFinite(value) ? value : 0, -999, 9999);
  return `${number.toFixed(Math.abs(number) >= 100 ? 0 : 1)}%`;
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

function todayString() {
  const today = new Date();
  const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function shiftDate(value, days) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function shiftDateObject(value, days) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDuration(totalSeconds) {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getPayPeriods(frequency) {
  switch (frequency) {
    case "weekly":
      return 52;
    case "biweekly":
      return 26;
    case "semimonthly":
      return 24;
    case "monthly":
      return 12;
    default:
      return 26;
  }
}

function getAmortizedPayment(principal, annualRate, months) {
  const ratePerMonth = annualRate / 100 / 12;
  if (ratePerMonth === 0) return principal / Math.max(months, 1);
  return (principal * ratePerMonth) / (1 - Math.pow(1 + ratePerMonth, -months));
}

function getPrincipalFromPayment(payment, annualRate, months) {
  const ratePerMonth = annualRate / 100 / 12;
  if (ratePerMonth === 0) return payment * months;
  return payment * (1 - Math.pow(1 + ratePerMonth, -months)) / ratePerMonth;
}

function buildAmortization({ principal, annualRate, payment, currency }) {
  let balance = principal;
  let month = 0;
  let totalInterest = 0;
  const ratePerMonth = annualRate / 100 / 12;
  const rows = [];

  while (balance > 0.01 && month < 600) {
    month += 1;
    const interest = balance * ratePerMonth;
    const principalPaid = Math.min(balance, payment - interest);
    const actualPayment = principalPaid + interest;
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;

    if (month === 1 || month % 12 === 0 || balance <= 0.01) {
      rows.push({
        cells: [
          String(month),
          moneyText(actualPayment, currency, 2),
          moneyText(interest, currency, 2),
          moneyText(principalPaid, currency, 2),
          moneyText(balance, currency, 2),
        ],
        tone: balance <= 0.01 ? "highlight" : month === 1 ? "summary" : "default",
      });
    }
  }

  return { months: month, totalInterest, rows };
}

function getRemainingBalance(principal, annualRate, payment, monthsPaid) {
  const ratePerMonth = annualRate / 100 / 12;
  let balance = principal;
  for (let month = 0; month < monthsPaid && balance > 0.01; month += 1) {
    const interest = balance * ratePerMonth;
    const principalPaid = Math.min(balance, payment - interest);
    balance = Math.max(0, balance - principalPaid);
  }
  return balance;
}

function solveApr(amountFinanced, monthlyPayment, months) {
  let low = 0;
  let high = 1;
  for (let index = 0; index < 60; index += 1) {
    const mid = (low + high) / 2;
    const paymentAtRate = mid === 0
      ? amountFinanced / months
      : (amountFinanced * mid) / (1 - Math.pow(1 + mid, -months));
    if (paymentAtRate > monthlyPayment) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return (low + high) / 2;
}

function getCompoundFutureValue({ startingBalance, monthlyContribution, annualRate, months }) {
  const ratePerMonth = annualRate / 100 / 12;
  let balance = startingBalance;
  let totalContributions = startingBalance;
  for (let month = 0; month < months; month += 1) {
    balance = balance * (1 + ratePerMonth) + monthlyContribution;
    totalContributions += monthlyContribution;
  }
  return { futureValue: balance, totalContributions };
}

function calculateBmr({ sex, age, weightKg, heightCm }) {
  return sex === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

function getActivityMultiplier(activity) {
  switch (activity) {
    case "sedentary":
      return 1.2;
    case "light":
      return 1.375;
    case "moderate":
      return 1.55;
    case "very":
      return 1.725;
    case "athlete":
      return 1.9;
    default:
      return 1.55;
  }
}

function getProteinMultiplier(activity, goal) {
  const base = activity === "athlete" ? 2.2 : activity === "very" ? 2 : activity === "moderate" ? 1.8 : activity === "light" ? 1.6 : 1.4;
  if (goal === "fat-loss") return base + 0.1;
  if (goal === "muscle-gain") return base + 0.2;
  return base;
}

function getBodyFatPercentage({ sex, heightCm, neckCm, waistCm, hipCm }) {
  if (sex === "male") {
    return 86.01 * Math.log10(waistCm - neckCm) - 70.041 * Math.log10(heightCm) + 36.76;
  }
  return 163.205 * Math.log10(waistCm + hipCm - neckCm) - 97.684 * Math.log10(heightCm) - 78.387;
}
