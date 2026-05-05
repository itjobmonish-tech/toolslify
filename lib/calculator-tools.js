import { clamp } from "./utils.js";
import { EXPANDED_CALCULATOR_CONFIGS } from "./calculator-expansion.js";
import { COMMERCIAL_CALCULATOR_CONFIGS } from "./calculator-commercial-expansion.js";
import { GROWTH_HUB_CALCULATOR_CONFIGS } from "./calculator-hub-expansion.js";
import { FLAGSHIP_CALCULATOR_CONFIGS } from "./calculator-flagship-expansion.js";
import { EDUCATION_CALCULATOR_CONFIGS } from "./calculator-education-expansion.js";

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (PS)" },
  { value: "EUR", label: "EUR (EUR)" },
];

const CALCULATOR_CONFIGS = {
  "salary-to-hourly-calculator": makeSalaryToHourlyConfig(),
  "hourly-to-salary-calculator": makeHourlyToSalaryConfig(),
  "take-home-pay-calculator": makeTakeHomeConfig(),
  "gross-to-net-salary-calculator": makeGrossToNetConfig(),
  "net-to-gross-salary-calculator": makeNetToGrossConfig(),
  "overtime-pay-calculator": makeOvertimeConfig(),
  "pto-accrual-calculator": makePtoConfig(),
  "notice-period-calculator": makeNoticeConfig(),
  "freelance-rate-calculator": makeFreelanceRateConfig(),
  "day-rate-calculator": makeDayRateConfig(),
  "pay-raise-calculator": makeRaiseConfig(),
  "bonus-calculator": makeBonusConfig(),
  "commission-calculator": makeCommissionConfig(),
  "cost-of-living-salary-comparison-tool": makeCostOfLivingConfig(),
  "contractor-vs-employee-calculator": makeWorkModelConfig(),
  "timesheet-calculator": makeTimesheetConfig(),
  "profit-margin-calculator": makeProfitMarginConfig(),
  "vat-calculator": makeVatConfig(),
  "late-payment-interest-calculator": makeLateInterestConfig(),
  ...EXPANDED_CALCULATOR_CONFIGS,
  ...COMMERCIAL_CALCULATOR_CONFIGS,
  ...GROWTH_HUB_CALCULATOR_CONFIGS,
  ...FLAGSHIP_CALCULATOR_CONFIGS,
  ...EDUCATION_CALCULATOR_CONFIGS,
};

export const CALCULATOR_TOOL_SLUGS = Object.keys(CALCULATOR_CONFIGS);

export function getCalculatorConfig(slug) {
  return CALCULATOR_CONFIGS[slug] || null;
}

function result(title, summaryCards, breakdown, insights, meta) {
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

  return { title, summaryCards, breakdown, insights, meta, report };
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

function validateHours(values) {
  return values.hoursPerWeek <= 0 || values.weeksPerYear <= 0 ? "Hours and weeks must both be greater than zero." : "";
}

function validateAnnualHours(values) {
  if (values.annualSalary <= 0) return "Enter an annual salary.";
  return validateHours(values);
}

function makeSalaryToHourlyConfig() {
  return {
    title: "Salary to Hourly Calculator",
    actionLabel: "Calculate hourly rate",
    emptyState: "Add salary, hours, and weeks to estimate the hourly equivalent.",
    summaryLabel: "Hourly salary estimate",
    defaultHistoryLabel: "Salary to hourly scenario",
    defaults: { annualSalary: 72000, hoursPerWeek: 40, weeksPerYear: 52, currency: "USD" },
    mainFields: [moneyField("annualSalary", "Annual salary"), numberField("hoursPerWeek", "Hours per week", 1, 80), numberField("weeksPerYear", "Weeks per year", 1, 52)],
    advancedFields: [currencyField()],
    validate: validateAnnualHours,
    compute(values) {
      const yearlyHours = values.hoursPerWeek * values.weeksPerYear;
      const hourly = values.annualSalary / Math.max(yearlyHours, 1);
      const monthly = values.annualSalary / 12;
      const weekly = values.annualSalary / Math.max(values.weeksPerYear, 1);
      return result("Annual salary converted to hourly pay", [
        card("Hourly rate", moneyText(hourly, values.currency, 2)),
        card("Monthly salary", moneyText(monthly, values.currency)),
        card("Weekly pay", moneyText(weekly, values.currency)),
        card("Hours / year", count(yearlyHours)),
      ], [
        moneyBar("Annual salary", values.annualSalary, values.currency),
        moneyBar("Monthly salary", monthly, values.currency),
        moneyBar("Weekly pay", weekly, values.currency),
        moneyBar("Hourly rate", hourly, values.currency, 2),
      ], [
        `At ${values.hoursPerWeek} hours per week across ${values.weeksPerYear} weeks, the salary works out to about ${moneyText(hourly, values.currency, 2)} per hour.`,
        `Use the monthly view of ${moneyText(monthly, values.currency)} when you compare salaried work against freelance or contract options.`,
      ], [
        note("Currency", values.currency),
        note("Weekly hours", `${values.hoursPerWeek} hrs`),
        note("Weeks worked", `${values.weeksPerYear} weeks`),
      ]);
    },
  };
}

function makeHourlyToSalaryConfig() {
  return {
    title: "Hourly to Salary Calculator",
    actionLabel: "Calculate salary",
    emptyState: "Add an hourly rate, weekly hours, and weeks worked to estimate salary.",
    summaryLabel: "Salary estimate",
    defaultHistoryLabel: "Hourly to salary scenario",
    defaults: { hourlyRate: 42, hoursPerWeek: 40, weeksPerYear: 50, currency: "USD" },
    mainFields: [moneyField("hourlyRate", "Hourly rate", 1), numberField("hoursPerWeek", "Hours per week", 1, 80), numberField("weeksPerYear", "Weeks per year", 1, 52)],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.hourlyRate <= 0) return "Enter an hourly rate.";
      return validateHours(values);
    },
    compute(values) {
      const annual = values.hourlyRate * values.hoursPerWeek * values.weeksPerYear;
      const monthly = annual / 12;
      const weekly = annual / Math.max(values.weeksPerYear, 1);
      return result("Hourly pay converted to salary", [
        card("Annual salary", moneyText(annual, values.currency)),
        card("Monthly salary", moneyText(monthly, values.currency)),
        card("Weekly pay", moneyText(weekly, values.currency)),
        card("Hours / year", count(values.hoursPerWeek * values.weeksPerYear)),
      ], [
        moneyBar("Hourly rate", values.hourlyRate, values.currency, 2),
        moneyBar("Weekly pay", weekly, values.currency),
        moneyBar("Monthly salary", monthly, values.currency),
        moneyBar("Annual salary", annual, values.currency),
      ], [
        `An hourly rate of ${moneyText(values.hourlyRate, values.currency, 2)} becomes about ${moneyText(annual, values.currency)} per year with the current schedule.`,
        "This is useful for comparing contract rates with salaried offers before you dig into taxes and benefits.",
      ], [
        note("Currency", values.currency),
        note("Weekly hours", `${values.hoursPerWeek} hrs`),
        note("Weeks worked", `${values.weeksPerYear} weeks`),
      ]);
    },
  };
}

function makeTakeHomeConfig() {
  return {
    title: "Take-Home Pay Calculator",
    actionLabel: "Calculate take-home pay",
    emptyState: "Estimate take-home pay after tax and monthly deductions.",
    summaryLabel: "Take-home estimate",
    defaultHistoryLabel: "Take-home scenario",
    defaults: { grossAnnualSalary: 84000, taxRate: 24, monthlyDeductions: 350, currency: "USD" },
    mainFields: [moneyField("grossAnnualSalary", "Gross annual salary"), percentField("taxRate", "Estimated tax rate", 0, 60, 0.5), moneyField("monthlyDeductions", "Monthly deductions", 50)],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.grossAnnualSalary <= 0) return "Enter a gross annual salary.";
      return "";
    },
    compute(values) {
      const tax = values.grossAnnualSalary * (values.taxRate / 100);
      const deductions = values.monthlyDeductions * 12;
      const netAnnual = Math.max(0, values.grossAnnualSalary - tax - deductions);
      const netMonthly = netAnnual / 12;
      return result("Estimated take-home pay after tax and deductions", [
        card("Net monthly pay", moneyText(netMonthly, values.currency)),
        card("Net annual pay", moneyText(netAnnual, values.currency)),
        card("Tax amount", moneyText(tax, values.currency)),
        card("Net retention", percent((netAnnual / Math.max(values.grossAnnualSalary, 1)) * 100)),
      ], [
        moneyBar("Gross annual salary", values.grossAnnualSalary, values.currency),
        moneyBar("Annual tax", tax, values.currency),
        moneyBar("Annual deductions", deductions, values.currency),
        moneyBar("Net annual pay", netAnnual, values.currency),
      ], [
        `With a ${percent(values.taxRate)} tax assumption and ${moneyText(values.monthlyDeductions, values.currency)} in monthly deductions, take-home pay lands near ${moneyText(netMonthly, values.currency)} per month.`,
        "Use this as a fast planning view before you move into region-specific payroll detail.",
      ], [
        note("Currency", values.currency),
        note("Monthly deductions", moneyText(values.monthlyDeductions, values.currency)),
        note("Annual tax", moneyText(tax, values.currency)),
      ]);
    },
  };
}

function makeGrossToNetConfig() {
  return {
    title: "Gross to Net Salary Calculator",
    actionLabel: "Calculate net salary",
    emptyState: "Estimate net monthly salary after tax and payroll deductions.",
    summaryLabel: "Net salary estimate",
    defaultHistoryLabel: "Gross to net scenario",
    defaults: { grossMonthlySalary: 6500, taxRate: 22, monthlyBenefits: 180, currency: "USD" },
    mainFields: [moneyField("grossMonthlySalary", "Gross monthly salary", 100), percentField("taxRate", "Estimated tax rate", 0, 60, 0.5), moneyField("monthlyBenefits", "Monthly deductions", 25)],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.grossMonthlySalary <= 0) return "Enter a gross monthly salary.";
      return "";
    },
    compute(values) {
      const tax = values.grossMonthlySalary * (values.taxRate / 100);
      const net = Math.max(0, values.grossMonthlySalary - tax - values.monthlyBenefits);
      return result("Gross monthly pay converted to net salary", [
        card("Net monthly pay", moneyText(net, values.currency)),
        card("Net annual pay", moneyText(net * 12, values.currency)),
        card("Monthly tax", moneyText(tax, values.currency)),
        card("Gross monthly pay", moneyText(values.grossMonthlySalary, values.currency)),
      ], [
        moneyBar("Gross monthly pay", values.grossMonthlySalary, values.currency),
        moneyBar("Monthly tax", tax, values.currency),
        moneyBar("Monthly deductions", values.monthlyBenefits, values.currency),
        moneyBar("Net monthly pay", net, values.currency),
      ], [
        `A gross monthly salary of ${moneyText(values.grossMonthlySalary, values.currency)} becomes about ${moneyText(net, values.currency)} after the current assumptions.`,
        "Use this when you want a fast net-pay view before you model more detailed payroll rules.",
      ], [
        note("Currency", values.currency),
        note("Tax rate", percent(values.taxRate)),
        note("Monthly deductions", moneyText(values.monthlyBenefits, values.currency)),
      ]);
    },
  };
}

function makeNetToGrossConfig() {
  return {
    title: "Net to Gross Salary Calculator",
    actionLabel: "Calculate gross salary",
    emptyState: "Work backward from target net salary to estimate required gross pay.",
    summaryLabel: "Gross salary estimate",
    defaultHistoryLabel: "Net to gross scenario",
    defaults: { targetNetMonthly: 4200, taxRate: 22, monthlyBenefits: 180, currency: "USD" },
    mainFields: [moneyField("targetNetMonthly", "Target net monthly salary", 100), percentField("taxRate", "Estimated tax rate", 0, 60, 0.5), moneyField("monthlyBenefits", "Monthly deductions", 25)],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.targetNetMonthly <= 0) return "Enter a target net monthly salary.";
      if (values.taxRate >= 100) return "Tax rate must stay below 100%.";
      return "";
    },
    compute(values) {
      const gross = (values.targetNetMonthly + values.monthlyBenefits) / Math.max(1 - values.taxRate / 100, 0.01);
      const tax = gross * (values.taxRate / 100);
      return result("Target net pay converted to gross salary", [
        card("Gross monthly pay", moneyText(gross, values.currency)),
        card("Gross annual pay", moneyText(gross * 12, values.currency)),
        card("Target net pay", moneyText(values.targetNetMonthly, values.currency)),
        card("Monthly tax", moneyText(tax, values.currency)),
      ], [
        moneyBar("Target net pay", values.targetNetMonthly, values.currency),
        moneyBar("Monthly deductions", values.monthlyBenefits, values.currency),
        moneyBar("Monthly tax", tax, values.currency),
        moneyBar("Gross monthly pay", gross, values.currency),
      ], [
        `To land at ${moneyText(values.targetNetMonthly, values.currency)} net each month, gross pay needs to be roughly ${moneyText(gross, values.currency)} with the current assumptions.`,
        "Use the annual view when you negotiate salary targets or compare regions with different tax assumptions.",
      ], [
        note("Currency", values.currency),
        note("Tax rate", percent(values.taxRate)),
        note("Gross annual pay", moneyText(gross * 12, values.currency)),
      ]);
    },
  };
}

function makeOvertimeConfig() {
  return {
    title: "Overtime Pay Calculator",
    actionLabel: "Calculate overtime pay",
    emptyState: "Estimate extra weekly pay from overtime hours and your overtime multiplier.",
    summaryLabel: "Overtime pay estimate",
    defaultHistoryLabel: "Overtime scenario",
    aliases: ["overtime calculator", "time and a half calculator"],
    defaults: { hourlyRate: 24, baseHours: 40, overtimeHours: 8, overtimeMultiplier: 1.5, currency: "USD" },
    mainFields: [moneyField("hourlyRate", "Base hourly rate", 1), numberField("baseHours", "Regular hours", 0, 80), numberField("overtimeHours", "Overtime hours", 0, 60), numberField("overtimeMultiplier", "Overtime multiplier", 1, 4, 0.1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.hourlyRate <= 0 ? "Enter your base hourly rate." : "";
    },
    compute(values) {
      const regular = values.hourlyRate * values.baseHours;
      const overtimeRate = values.hourlyRate * values.overtimeMultiplier;
      const overtime = overtimeRate * values.overtimeHours;
      return result("Weekly overtime pay estimate", [
        card("Total weekly pay", moneyText(regular + overtime, values.currency)),
        card("Overtime pay", moneyText(overtime, values.currency)),
        card("Overtime rate", moneyText(overtimeRate, values.currency, 2)),
        card("Regular pay", moneyText(regular, values.currency)),
      ], [
        moneyBar("Regular pay", regular, values.currency),
        moneyBar("Overtime pay", overtime, values.currency),
        moneyBar("Total weekly pay", regular + overtime, values.currency),
      ], [
        `${values.overtimeHours} overtime hours at ${values.overtimeMultiplier}x pushes your overtime rate to ${moneyText(overtimeRate, values.currency, 2)}.`,
        "Treat this as a clean first estimate if your overtime rules vary by day or shift.",
      ], [
        note("Currency", values.currency),
        note("Regular hours", `${values.baseHours} hrs`),
        note("Overtime hours", `${values.overtimeHours} hrs`),
      ]);
    },
  };
}

function makePtoConfig() {
  return {
    title: "PTO Accrual Calculator",
    categorySlug: "salary-data",
    actionLabel: "Calculate PTO accrual",
    emptyState: "Estimate how much PTO accrues each month, pay period, and year in hours.",
    summaryLabel: "PTO accrual estimate",
    defaultHistoryLabel: "PTO scenario",
    defaults: { annualPtoDays: 25, payPeriodsPerYear: 24, hoursPerDay: 8 },
    mainFields: [numberField("annualPtoDays", "PTO days per year", 0, 80, 0.5), numberField("payPeriodsPerYear", "Pay periods per year", 1, 52), numberField("hoursPerDay", "Hours per day", 1, 16, 0.5)],
    advancedFields: [],
    validate(values) {
      return values.payPeriodsPerYear <= 0 || values.hoursPerDay <= 0 ? "All schedule fields must be greater than zero." : "";
    },
    compute(values) {
      const monthlyDays = values.annualPtoDays / 12;
      const periodDays = values.annualPtoDays / Math.max(values.payPeriodsPerYear, 1);
      const yearlyHours = values.annualPtoDays * values.hoursPerDay;
      return result("Paid time off accrual estimate", [
        card("PTO per month", `${fixed(monthlyDays)} days`),
        card("PTO per pay period", `${fixed(periodDays)} days`),
        card("Annual PTO hours", `${fixed(yearlyHours)} hrs`),
        card("PTO days / year", fixed(values.annualPtoDays)),
      ], [
        plainBar("Annual PTO days", values.annualPtoDays, `${fixed(values.annualPtoDays)} days`),
        plainBar("Monthly accrual", monthlyDays, `${fixed(monthlyDays)} days`),
        plainBar("Per pay period", periodDays, `${fixed(periodDays)} days`),
        plainBar("Annual PTO hours", yearlyHours, `${fixed(yearlyHours)} hrs`),
      ], [
        `${fixed(values.annualPtoDays)} PTO days per year works out to about ${fixed(monthlyDays)} days per month.`,
        `If you track in hours, that is roughly ${fixed(yearlyHours / 12)} hours added each month.`,
      ], [
        note("Pay periods", `${values.payPeriodsPerYear}`),
        note("Hours per day", `${values.hoursPerDay}`),
      ]);
    },
  };
}

function makeNoticeConfig() {
  return {
    title: "Notice Period Calculator",
    actionLabel: "Calculate notice pay",
    emptyState: "Estimate the pay value tied to your notice period and unused leave payout.",
    summaryLabel: "Notice period estimate",
    defaultHistoryLabel: "Notice scenario",
    defaults: { weeklyPay: 1450, noticeWeeks: 4, unusedPtoDays: 3, workDaysPerWeek: 5, currency: "USD" },
    mainFields: [moneyField("weeklyPay", "Weekly pay", 50), numberField("noticeWeeks", "Notice weeks", 0, 52), numberField("unusedPtoDays", "Unused PTO days", 0, 60, 0.5), numberField("workDaysPerWeek", "Work days per week", 1, 7)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.weeklyPay <= 0 ? "Enter your weekly pay." : "";
    },
    compute(values) {
      const dailyPay = values.weeklyPay / Math.max(values.workDaysPerWeek, 1);
      const noticePay = values.weeklyPay * values.noticeWeeks;
      const pto = dailyPay * values.unusedPtoDays;
      return result("Notice period pay estimate", [
        card("Total notice value", moneyText(noticePay + pto, values.currency)),
        card("Notice pay", moneyText(noticePay, values.currency)),
        card("Unused PTO value", moneyText(pto, values.currency)),
        card("Daily pay", moneyText(dailyPay, values.currency, 2)),
      ], [
        moneyBar("Notice pay", noticePay, values.currency),
        moneyBar("Unused PTO value", pto, values.currency),
        moneyBar("Total value", noticePay + pto, values.currency),
      ], [
        `${values.noticeWeeks} weeks of notice at your current weekly pay is worth about ${moneyText(noticePay, values.currency)}.`,
        `${values.unusedPtoDays} unused PTO days adds an estimated ${moneyText(pto, values.currency)} on top.`,
      ], [
        note("Currency", values.currency),
        note("Notice weeks", `${values.noticeWeeks}`),
        note("Unused PTO", `${values.unusedPtoDays} days`),
      ]);
    },
  };
}

function makeFreelanceRateConfig() {
  return {
    title: "Freelance Rate Calculator",
    actionLabel: "Calculate freelance rate",
    emptyState: "Work backward from income goals, expenses, and realistic billable time.",
    summaryLabel: "Freelance pricing estimate",
    defaultHistoryLabel: "Freelance rate scenario",
    defaults: { desiredAnnualIncome: 95000, annualExpenses: 12000, taxReservePercent: 22, billableHoursPerWeek: 24, workingWeeksPerYear: 46, currency: "USD" },
    mainFields: [moneyField("desiredAnnualIncome", "Desired annual income"), moneyField("annualExpenses", "Annual business expenses", 500), numberField("billableHoursPerWeek", "Billable hours / week", 1, 80), numberField("workingWeeksPerYear", "Working weeks / year", 1, 52)],
    advancedFields: [percentField("taxReservePercent", "Tax reserve %", 0, 50, 0.5), currencyField()],
    validate(values) {
      if (values.desiredAnnualIncome <= 0) return "Enter your annual income goal.";
      return values.billableHoursPerWeek <= 0 || values.workingWeeksPerYear <= 0 ? "Billable hours and weeks must be greater than zero." : "";
    },
    compute(values) {
      const billableHours = values.billableHoursPerWeek * values.workingWeeksPerYear;
      const preTax = values.desiredAnnualIncome + values.annualExpenses;
      const taxReserve = preTax * (values.taxReservePercent / 100);
      const revenueGoal = preTax + taxReserve;
      const hourly = revenueGoal / Math.max(billableHours, 1);
      return result("Freelance pricing estimate", [
        card("Target hourly rate", moneyText(hourly, values.currency, 2)),
        card("Annual revenue goal", moneyText(revenueGoal, values.currency)),
        card("Monthly target", moneyText(revenueGoal / 12, values.currency)),
        card("Billable hours / year", count(billableHours)),
      ], [
        moneyBar("Desired income", values.desiredAnnualIncome, values.currency),
        moneyBar("Business expenses", values.annualExpenses, values.currency),
        moneyBar("Tax reserve", taxReserve, values.currency),
        moneyBar("Revenue goal", revenueGoal, values.currency),
      ], [
        `${count(billableHours)} realistic billable hours per year means the business needs about ${moneyText(hourly, values.currency, 2)} per hour to hit the plan.`,
        "This is grounded in both living income and business overhead, not just a guess at a market rate.",
      ], [
        note("Currency", values.currency),
        note("Working weeks", `${values.workingWeeksPerYear}`),
        note("Billable time", `${values.billableHoursPerWeek} hrs / week`),
      ]);
    },
  };
}

function makeDayRateConfig() {
  return {
    title: "Day Rate Calculator",
    actionLabel: "Calculate day rate",
    emptyState: "Estimate the day rate needed to hit your income target.",
    summaryLabel: "Day rate estimate",
    defaultHistoryLabel: "Day rate scenario",
    defaults: { desiredAnnualIncome: 95000, annualExpenses: 10000, taxReservePercent: 20, billableDaysPerMonth: 14, activeMonthsPerYear: 11, currency: "USD" },
    mainFields: [moneyField("desiredAnnualIncome", "Desired annual income"), moneyField("annualExpenses", "Annual business expenses", 500), numberField("billableDaysPerMonth", "Billable days / month", 1, 31), numberField("activeMonthsPerYear", "Active months / year", 1, 12)],
    advancedFields: [percentField("taxReservePercent", "Tax reserve %", 0, 50, 0.5), currencyField()],
    validate(values) {
      if (values.desiredAnnualIncome <= 0) return "Enter your annual income goal.";
      return values.billableDaysPerMonth <= 0 || values.activeMonthsPerYear <= 0 ? "Billable days and active months must be greater than zero." : "";
    },
    compute(values) {
      const days = values.billableDaysPerMonth * values.activeMonthsPerYear;
      const preTax = values.desiredAnnualIncome + values.annualExpenses;
      const taxReserve = preTax * (values.taxReservePercent / 100);
      const revenueGoal = preTax + taxReserve;
      const dayRate = revenueGoal / Math.max(days, 1);
      return result("Target freelance day rate", [
        card("Day rate", moneyText(dayRate, values.currency, 2)),
        card("Annual revenue goal", moneyText(revenueGoal, values.currency)),
        card("Billable days / year", count(days)),
        card("Days / month", `${values.billableDaysPerMonth}`),
      ], [
        moneyBar("Desired income", values.desiredAnnualIncome, values.currency),
        moneyBar("Business expenses", values.annualExpenses, values.currency),
        moneyBar("Tax reserve", taxReserve, values.currency),
        moneyBar("Revenue goal", revenueGoal, values.currency),
      ], [
        `${count(days)} billable days per year means the business needs around ${moneyText(dayRate, values.currency, 2)} per day.`,
        "Keep buffer days for admin, holidays, and pipeline gaps or the modeled day rate will feel too optimistic in practice.",
      ], [
        note("Currency", values.currency),
        note("Active months", `${values.activeMonthsPerYear}`),
        note("Billable days / month", `${values.billableDaysPerMonth}`),
      ]);
    },
  };
}

function makeRaiseConfig() {
  return {
    title: "Pay Raise Calculator",
    actionLabel: "Calculate pay raise",
    emptyState: "Estimate the annual and monthly impact of a raise percentage.",
    summaryLabel: "Raise estimate",
    defaultHistoryLabel: "Raise scenario",
    defaults: { currentSalary: 72000, raisePercent: 8, currency: "USD" },
    mainFields: [moneyField("currentSalary", "Current annual salary"), percentField("raisePercent", "Raise %", -50, 100, 0.5)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.currentSalary <= 0 ? "Enter your current salary." : "";
    },
    compute(values) {
      const raise = values.currentSalary * (values.raisePercent / 100);
      const next = values.currentSalary + raise;
      return result("Annual raise impact", [
        card("New annual salary", moneyText(next, values.currency)),
        card("Raise amount", moneyText(raise, values.currency)),
        card("Monthly increase", moneyText(raise / 12, values.currency)),
        card("Raise %", percent(values.raisePercent)),
      ], [
        moneyBar("Current salary", values.currentSalary, values.currency),
        moneyBar("Raise amount", raise, values.currency),
        moneyBar("New salary", next, values.currency),
      ], [
        `${percent(values.raisePercent)} on your current salary adds about ${moneyText(raise, values.currency)} per year.`,
        `That works out to roughly ${moneyText(raise / 12, values.currency)} more each month before taxes.`,
      ], [
        note("Currency", values.currency),
        note("Current salary", moneyText(values.currentSalary, values.currency)),
        note("New salary", moneyText(next, values.currency)),
      ]);
    },
  };
}

function makeBonusConfig() {
  return {
    title: "Bonus Calculator",
    actionLabel: "Calculate bonus",
    emptyState: "Estimate the cash impact of a bonus percentage.",
    summaryLabel: "Bonus estimate",
    defaultHistoryLabel: "Bonus scenario",
    defaults: { baseSalary: 78000, bonusPercent: 12, taxRate: 20, currency: "USD" },
    mainFields: [moneyField("baseSalary", "Base annual salary"), percentField("bonusPercent", "Bonus %", 0, 100, 0.5), percentField("taxRate", "Estimated tax on bonus", 0, 60, 0.5)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.baseSalary <= 0 ? "Enter your base salary." : "";
    },
    compute(values) {
      const gross = values.baseSalary * (values.bonusPercent / 100);
      const tax = gross * (values.taxRate / 100);
      return result("Bonus payout estimate", [
        card("Net bonus", moneyText(gross - tax, values.currency)),
        card("Gross bonus", moneyText(gross, values.currency)),
        card("Tax on bonus", moneyText(tax, values.currency)),
        card("Bonus %", percent(values.bonusPercent)),
      ], [
        moneyBar("Gross bonus", gross, values.currency),
        moneyBar("Tax on bonus", tax, values.currency),
        moneyBar("Net bonus", gross - tax, values.currency),
      ], [
        `A ${percent(values.bonusPercent)} bonus on ${moneyText(values.baseSalary, values.currency)} creates a gross payout of ${moneyText(gross, values.currency)}.`,
        `With ${percent(values.taxRate)} held back, the estimated net bonus is ${moneyText(gross - tax, values.currency)}.`,
      ], [
        note("Currency", values.currency),
        note("Base salary", moneyText(values.baseSalary, values.currency)),
        note("Net bonus", moneyText(gross - tax, values.currency)),
      ]);
    },
  };
}

function makeCommissionConfig() {
  return {
    title: "Commission Calculator",
    actionLabel: "Calculate commission",
    emptyState: "Estimate commission from closed sales and the commission rate.",
    summaryLabel: "Commission estimate",
    defaultHistoryLabel: "Commission scenario",
    defaults: { salesAmount: 56000, commissionRate: 8, advanceDraw: 0, currency: "USD" },
    mainFields: [moneyField("salesAmount", "Sales amount"), percentField("commissionRate", "Commission %", 0, 100, 0.25), moneyField("advanceDraw", "Advance draw", 50)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.salesAmount <= 0 ? "Enter the closed sales amount." : "";
    },
    compute(values) {
      const gross = values.salesAmount * (values.commissionRate / 100);
      const payable = Math.max(0, gross - values.advanceDraw);
      return result("Commission payout estimate", [
        card("Commission payable", moneyText(payable, values.currency)),
        card("Gross commission", moneyText(gross, values.currency)),
        card("Sales amount", moneyText(values.salesAmount, values.currency)),
        card("Commission %", percent(values.commissionRate)),
      ], [
        moneyBar("Sales amount", values.salesAmount, values.currency),
        moneyBar("Gross commission", gross, values.currency),
        moneyBar("Advance draw", values.advanceDraw, values.currency),
        moneyBar("Commission payable", payable, values.currency),
      ], [
        `At ${percent(values.commissionRate)}, the sales amount produces ${moneyText(gross, values.currency)} in gross commission.`,
        values.advanceDraw > 0
          ? `After subtracting the draw of ${moneyText(values.advanceDraw, values.currency)}, the modeled payout is ${moneyText(payable, values.currency)}.`
          : "No draw is being subtracted in this scenario.",
      ], [
        note("Currency", values.currency),
        note("Sales amount", moneyText(values.salesAmount, values.currency)),
        note("Commission payable", moneyText(payable, values.currency)),
      ]);
    },
  };
}

function makeCostOfLivingConfig() {
  return {
    title: "Cost of Living Salary Comparison Tool",
    actionLabel: "Compare salary needs",
    emptyState: "Estimate what salary is needed in a new market to keep a similar standard of living.",
    summaryLabel: "Cost of living comparison",
    defaultHistoryLabel: "Cost of living scenario",
    defaults: { currentSalary: 76000, currentCostIndex: 100, targetCostIndex: 128, currentTaxRate: 20, targetTaxRate: 24, currency: "USD" },
    mainFields: [moneyField("currentSalary", "Current annual salary"), numberField("currentCostIndex", "Current cost index", 1, 500), numberField("targetCostIndex", "Target cost index", 1, 500), percentField("targetTaxRate", "Target tax rate", 0, 60, 0.5)],
    advancedFields: [percentField("currentTaxRate", "Current tax rate", 0, 60, 0.5), currencyField()],
    validate(values) {
      if (values.currentSalary <= 0) return "Enter your current salary.";
      return values.currentCostIndex <= 0 || values.targetCostIndex <= 0 ? "Cost indices must be greater than zero." : "";
    },
    compute(values) {
      const currentNet = values.currentSalary * (1 - values.currentTaxRate / 100);
      const multiplier = values.targetCostIndex / Math.max(values.currentCostIndex, 1);
      const targetNet = currentNet * multiplier;
      const targetGross = targetNet / Math.max(1 - values.targetTaxRate / 100, 0.01);
      return result("Target salary needed to keep similar purchasing power", [
        card("Target gross salary", moneyText(targetGross, values.currency)),
        card("Target net needed", moneyText(targetNet, values.currency)),
        card("Gross difference", moneyText(targetGross - values.currentSalary, values.currency)),
        card("Cost multiplier", `${fixed(multiplier)}x`),
      ], [
        moneyBar("Current salary", values.currentSalary, values.currency),
        moneyBar("Current net", currentNet, values.currency),
        moneyBar("Target net needed", targetNet, values.currency),
        moneyBar("Target gross salary", targetGross, values.currency),
      ], [
        `Moving from a cost index of ${values.currentCostIndex} to ${values.targetCostIndex} increases the target by about ${fixed(multiplier)}x.`,
        `After tax assumptions, you would need roughly ${moneyText(targetGross, values.currency)} gross to keep similar buying power.`,
      ], [
        note("Currency", values.currency),
        note("Current net", moneyText(currentNet, values.currency)),
        note("Target tax rate", percent(values.targetTaxRate)),
      ]);
    },
  };
}

function makeWorkModelConfig() {
  return {
    title: "Contractor vs Employee Calculator",
    actionLabel: "Compare work models",
    emptyState: "Compare yearly value across contractor and employee scenarios.",
    summaryLabel: "Work model comparison",
    defaultHistoryLabel: "Contractor vs employee scenario",
    defaults: { contractorHourlyRate: 75, contractorHoursPerWeek: 30, contractorWeeksPerYear: 46, contractorTaxRate: 24, employeeAnnualSalary: 98000, employeeBenefitsValue: 12000, employeeTaxRate: 20, currency: "USD" },
    mainFields: [moneyField("contractorHourlyRate", "Contractor hourly rate", 1), numberField("contractorHoursPerWeek", "Contractor hours / week", 1, 80), numberField("contractorWeeksPerYear", "Contractor weeks / year", 1, 52), moneyField("employeeAnnualSalary", "Employee annual salary")],
    advancedFields: [percentField("contractorTaxRate", "Contractor tax rate", 0, 60, 0.5), moneyField("employeeBenefitsValue", "Employee benefits value", 500), percentField("employeeTaxRate", "Employee tax rate", 0, 60, 0.5), currencyField()],
    validate(values) {
      return values.contractorHourlyRate <= 0 || values.employeeAnnualSalary <= 0 ? "Enter both contractor and employee pay details." : "";
    },
    compute(values) {
      const contractorGross = values.contractorHourlyRate * values.contractorHoursPerWeek * values.contractorWeeksPerYear;
      const contractorNet = contractorGross * (1 - values.contractorTaxRate / 100);
      const employeeNet = values.employeeAnnualSalary * (1 - values.employeeTaxRate / 100);
      const employeeValue = employeeNet + values.employeeBenefitsValue;
      const diff = contractorNet - employeeValue;
      return result("Contractor versus employee yearly value", [
        card("Stronger outcome", diff >= 0 ? `Contractor +${moneyText(Math.abs(diff), values.currency)}` : `Employee +${moneyText(Math.abs(diff), values.currency)}`),
        card("Contractor net", moneyText(contractorNet, values.currency)),
        card("Employee total value", moneyText(employeeValue, values.currency)),
        card("Contractor gross", moneyText(contractorGross, values.currency)),
      ], [
        moneyBar("Contractor gross", contractorGross, values.currency),
        moneyBar("Contractor net", contractorNet, values.currency),
        moneyBar("Employee net cash", employeeNet, values.currency),
        moneyBar("Employee total value", employeeValue, values.currency),
      ], [
        `The contractor path currently models ${moneyText(contractorNet, values.currency)} net after tax assumptions.`,
        `The employee path lands near ${moneyText(employeeValue, values.currency)} once benefits are added to net salary.`,
      ], [
        note("Currency", values.currency),
        note("Contractor weeks", `${values.contractorWeeksPerYear}`),
        note("Employee benefits", moneyText(values.employeeBenefitsValue, values.currency)),
      ]);
    },
  };
}

function makeTimesheetConfig() {
  return {
    title: "Timesheet Calculator",
    actionLabel: "Calculate timesheet totals",
    emptyState: "Estimate billable hours and pay from days worked, hours per day, and break time.",
    summaryLabel: "Timesheet estimate",
    defaultHistoryLabel: "Timesheet scenario",
    defaults: { daysWorked: 18, hoursPerDay: 7.5, breakMinutesPerDay: 30, hourlyRate: 48, currency: "USD" },
    mainFields: [numberField("daysWorked", "Days worked", 0, 31), numberField("hoursPerDay", "Hours per day", 0, 24, 0.25), numberField("breakMinutesPerDay", "Break minutes / day", 0, 180, 5), moneyField("hourlyRate", "Hourly rate", 1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.hourlyRate <= 0 ? "Enter an hourly rate." : "";
    },
    compute(values) {
      const daily = Math.max(0, values.hoursPerDay - values.breakMinutesPerDay / 60);
      const totalHours = daily * values.daysWorked;
      const totalPay = totalHours * values.hourlyRate;
      return result("Timesheet hours and pay estimate", [
        card("Total pay", moneyText(totalPay, values.currency)),
        card("Total hours", `${fixed(totalHours)} hrs`),
        card("Billable hours / day", `${fixed(daily)} hrs`),
        card("Hourly rate", moneyText(values.hourlyRate, values.currency, 2)),
      ], [
        plainBar("Days worked", values.daysWorked, `${values.daysWorked} days`),
        plainBar("Billable hours / day", daily, `${fixed(daily)} hrs`),
        plainBar("Total hours", totalHours, `${fixed(totalHours)} hrs`),
        moneyBar("Total pay", totalPay, values.currency),
      ], [
        `${values.daysWorked} worked days at ${fixed(daily)} billable hours per day creates about ${fixed(totalHours)} total billable hours.`,
        `At ${moneyText(values.hourlyRate, values.currency, 2)} per hour, the timesheet value lands near ${moneyText(totalPay, values.currency)}.`,
      ], [
        note("Currency", values.currency),
        note("Break / day", `${values.breakMinutesPerDay} min`),
        note("Timesheet value", moneyText(totalPay, values.currency)),
      ]);
    },
  };
}

function makeProfitMarginConfig() {
  return {
    title: "Profit Margin Calculator",
    actionLabel: "Calculate margin",
    emptyState: "Estimate gross profit, margin, and markup from revenue and cost.",
    summaryLabel: "Margin estimate",
    defaultHistoryLabel: "Margin scenario",
    defaults: { revenue: 5000, cost: 2800, currency: "USD" },
    mainFields: [moneyField("revenue", "Revenue", 100), moneyField("cost", "Direct cost", 100)],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.revenue <= 0) return "Enter revenue to calculate margin.";
      return values.cost < 0 ? "Cost cannot be negative." : "";
    },
    compute(values) {
      const profit = values.revenue - values.cost;
      const margin = (profit / Math.max(values.revenue, 1)) * 100;
      const markup = (profit / Math.max(values.cost, 1)) * 100;
      return result("Gross profit and margin estimate", [
        card("Gross profit", moneyText(profit, values.currency)),
        card("Profit margin", percent(margin)),
        card("Markup", percent(markup)),
        card("Revenue", moneyText(values.revenue, values.currency)),
      ], [
        moneyBar("Revenue", values.revenue, values.currency),
        moneyBar("Direct cost", values.cost, values.currency),
        moneyBar("Gross profit", profit, values.currency),
      ], [
        `Revenue of ${moneyText(values.revenue, values.currency)} against direct cost of ${moneyText(values.cost, values.currency)} leaves ${moneyText(profit, values.currency)} in gross profit.`,
        `That is a margin of ${percent(margin)} and a markup of ${percent(markup)}.`,
      ], [
        note("Currency", values.currency),
        note("Margin", percent(margin)),
        note("Markup", percent(markup)),
      ]);
    },
  };
}

function makeVatConfig() {
  return {
    title: "VAT Calculator",
    categorySlug: "tax-budget",
    actionLabel: "Calculate VAT",
    emptyState: "Split VAT-inclusive totals or add VAT to a base amount.",
    summaryLabel: "VAT estimate",
    defaultHistoryLabel: "VAT scenario",
    defaults: { amount: 2400, vatRate: 20, amountIncludesVat: true, currency: "GBP" },
    mainFields: [moneyField("amount", "Amount", 100), percentField("vatRate", "VAT rate", 0, 50, 0.5), { name: "amountIncludesVat", label: "Amount already includes VAT", type: "boolean" }],
    advancedFields: [currencyField()],
    validate(values) {
      return values.amount <= 0 ? "Enter the amount you want to split into base and VAT." : "";
    },
    compute(values) {
      const divisor = 1 + values.vatRate / 100;
      const base = values.amountIncludesVat ? values.amount / Math.max(divisor, 1) : values.amount;
      const vat = values.amountIncludesVat ? values.amount - base : values.amount * (values.vatRate / 100);
      const total = values.amountIncludesVat ? values.amount : base + vat;
      return result(values.amountIncludesVat ? "VAT split from inclusive amount" : "VAT added to exclusive amount", [
        card("Base amount", moneyText(base, values.currency, 2)),
        card("VAT amount", moneyText(vat, values.currency, 2)),
        card("Total amount", moneyText(total, values.currency, 2)),
        card("VAT rate", percent(values.vatRate)),
      ], [
        moneyBar("Base amount", base, values.currency, 2),
        moneyBar("VAT amount", vat, values.currency, 2),
        moneyBar("Total amount", total, values.currency, 2),
      ], [
        values.amountIncludesVat
          ? `Starting from a VAT-inclusive figure of ${moneyText(values.amount, values.currency)}, the taxable base is ${moneyText(base, values.currency, 2)}.`
          : `Starting from a VAT-exclusive figure of ${moneyText(values.amount, values.currency)}, VAT adds ${moneyText(vat, values.currency, 2)} to the invoice.`,
        `At ${percent(values.vatRate)}, tax accounts for ${percent((vat / Math.max(total, 1)) * 100)} of the final total.`,
      ], [
        note("Currency", values.currency),
        note("Input mode", values.amountIncludesVat ? "VAT inclusive" : "VAT exclusive"),
        note("Tax share", percent((vat / Math.max(total, 1)) * 100)),
      ]);
    },
  };
}

function makeLateInterestConfig() {
  return {
    title: "Late Payment Interest Calculator",
    actionLabel: "Calculate interest",
    emptyState: "Estimate how much interest accrues on an overdue invoice.",
    summaryLabel: "Late payment estimate",
    defaultHistoryLabel: "Late payment scenario",
    defaults: { invoiceAmount: 4200, annualInterestRate: 8, daysLate: 30, fixedFee: 0, currency: "GBP" },
    mainFields: [moneyField("invoiceAmount", "Invoice amount", 100), percentField("annualInterestRate", "Annual interest rate", 0, 100, 0.1), numberField("daysLate", "Days late", 0, 3650), moneyField("fixedFee", "Fixed fee", 5)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.invoiceAmount <= 0 ? "Enter the invoice amount first." : "";
    },
    compute(values) {
      const dailyRate = values.annualInterestRate / 100 / 365;
      const interest = values.invoiceAmount * dailyRate * values.daysLate;
      const total = values.invoiceAmount + interest + values.fixedFee;
      return result("Late payment interest estimate", [
        card("Total due", moneyText(total, values.currency)),
        card("Interest accrued", moneyText(interest, values.currency)),
        card("Daily rate", percent(dailyRate * 100)),
        card("Days late", `${values.daysLate} days`),
      ], [
        moneyBar("Invoice amount", values.invoiceAmount, values.currency),
        moneyBar("Interest accrued", interest, values.currency),
        moneyBar("Fixed fee", values.fixedFee, values.currency),
        moneyBar("Total due", total, values.currency),
      ], [
        `${values.daysLate} overdue days at ${percent(values.annualInterestRate)} annual interest adds about ${moneyText(interest, values.currency)} in finance charges.`,
        values.fixedFee > 0
          ? `Including a fixed fee of ${moneyText(values.fixedFee, values.currency)} pushes the total claim to ${moneyText(total, values.currency)}.`
          : `Without any fixed fee, the total due rises to ${moneyText(total, values.currency)}.`,
      ], [
        note("Currency", values.currency),
        note("Invoice amount", moneyText(values.invoiceAmount, values.currency)),
        note("Fixed fee", moneyText(values.fixedFee, values.currency)),
      ]);
    },
  };
}
