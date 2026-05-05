import { clamp } from "./utils.js";

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (GBP)" },
  { value: "EUR", label: "EUR (EUR)" },
];

const SEX_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

const SCIENTIFIC_OPERATIONS = [
  { value: "add", label: "Add" },
  { value: "subtract", label: "Subtract" },
  { value: "multiply", label: "Multiply" },
  { value: "divide", label: "Divide" },
  { value: "power", label: "Power" },
  { value: "root", label: "Nth root" },
  { value: "log", label: "Log base n" },
  { value: "ln", label: "Natural log" },
  { value: "sin", label: "Sine" },
  { value: "cos", label: "Cosine" },
  { value: "tan", label: "Tangent" },
  { value: "factorial", label: "Factorial" },
];

const FRACTION_OPERATIONS = [
  { value: "add", label: "Add" },
  { value: "subtract", label: "Subtract" },
  { value: "multiply", label: "Multiply" },
  { value: "divide", label: "Divide" },
];

const ANGLE_UNIT_OPTIONS = [
  { value: "degrees", label: "Degrees" },
  { value: "radians", label: "Radians" },
];

const ACTIVITY_OPTIONS = [
  { value: "light", label: "Light activity" },
  { value: "moderate", label: "Moderate activity" },
  { value: "high", label: "High activity" },
  { value: "athlete", label: "Athlete / heavy training" },
];

const DRINK_ACTIVITY_OPTIONS = [
  { value: "walking", label: "Walking" },
  { value: "cycling", label: "Cycling" },
  { value: "running", label: "Running" },
  { value: "strength", label: "Strength training" },
  { value: "swimming", label: "Swimming" },
];

const CLIMATE_OPTIONS = [
  { value: "mild", label: "Mild climate" },
  { value: "warm", label: "Warm climate" },
  { value: "hot", label: "Hot climate" },
];

const BTU_CLIMATE_OPTIONS = [
  { value: "cool", label: "Cool climate" },
  { value: "moderate", label: "Moderate climate" },
  { value: "hot", label: "Hot climate" },
];

export const GROWTH_CALCULATOR_CONFIGS = {
  "gpa-calculator": makeGpaConfig(),
  "grade-calculator": makeTargetGradeConfig(),
  "scientific-calculator": makeScientificConfig(),
  "fraction-calculator": makeFractionConfig(),
  "mixed-number-calculator": makeMixedNumberConfig(),
  "fraction-to-decimal-calculator": makeFractionToDecimalConfig(),
  "decimal-to-percent-calculator": makeDecimalToPercentConfig(),
  "percentage-off-calculator": makePercentageOffConfig(),
  "discount-calculator": makeDiscountConfig(),
  "tip-calculator": makeTipConfig(),
  "average-calculator": makeAverageConfig(),
  "mean-median-mode-calculator": makeMeanMedianModeConfig(),
  "standard-deviation-calculator": makeStandardDeviationConfig(),
  "time-calculator": makeTimeCalculatorConfig(),
  "time-duration-calculator": makeTimeDurationConfig(),
  "hours-calculator": makeHoursCalculatorConfig(),
  "work-hours-calculator": makeWorkHoursConfig(),
  "sleep-calculator": makeSleepCalculatorConfig(),
  "water-intake-calculator": makeWaterIntakeConfig(),
  "calories-burned-calculator": makeCaloriesBurnedConfig(),
  "waist-to-height-ratio-calculator": makeWaistToHeightRatioConfig(),
  "pregnancy-due-date-calculator": makePregnancyDueDateConfig(),
  "conception-date-calculator": makeConceptionDateConfig(),
  "bac-calculator": makeBacConfig(),
  "rent-affordability-calculator": makeRentAffordabilityConfig(),
  "budget-calculator": makeBudgetConfig(),
  "net-worth-calculator": makeNetWorthConfig(),
  "dividend-calculator": makeDividendConfig(),
  "roi-calculator": makeRoiConfig(),
  "break-even-calculator": makeBreakEvenConfig(),
  "markup-calculator": makeMarkupConfig(),
  "auto-lease-calculator": makeAutoLeaseConfig(),
  "mortgage-recast-calculator": makeMortgageRecastConfig(),
  "biweekly-mortgage-calculator": makeBiweeklyMortgageConfig(),
  "interest-only-mortgage-calculator": makeInterestOnlyMortgageConfig(),
  "va-loan-calculator": makeProgramMortgageConfig({
    title: "VA Loan Calculator",
    actionLabel: "Calculate VA loan",
    emptyState: "Estimate VA loan payments with the financed funding fee and purchase assumptions.",
    summaryLabel: "VA loan estimate",
    upfrontRate: 2.15,
    annualRateFieldLabel: "Mortgage rate",
    annualInsuranceRate: 0,
    defaults: { homePrice: 410000, downPayment: 0, annualRate: 6.2, years: 30, currency: "USD" },
  }),
  "fha-loan-calculator": makeProgramMortgageConfig({
    title: "FHA Loan Calculator",
    actionLabel: "Calculate FHA loan",
    emptyState: "Estimate FHA loan payments with UFMIP and monthly MIP assumptions built in.",
    summaryLabel: "FHA loan estimate",
    upfrontRate: 1.75,
    annualInsuranceRate: 0.55,
    annualRateFieldLabel: "Mortgage rate",
    defaults: { homePrice: 380000, downPayment: 13300, annualRate: 6.35, years: 30, currency: "USD" },
  }),
  "usda-loan-calculator": makeProgramMortgageConfig({
    title: "USDA Loan Calculator",
    actionLabel: "Calculate USDA loan",
    emptyState: "Estimate USDA loan payments with the guarantee fee and annual fee assumptions.",
    summaryLabel: "USDA loan estimate",
    upfrontRate: 1,
    annualInsuranceRate: 0.35,
    annualRateFieldLabel: "Mortgage rate",
    defaults: { homePrice: 325000, downPayment: 0, annualRate: 6.1, years: 30, currency: "USD" },
  }),
  "solar-panel-calculator": makeSolarPanelConfig(),
  "btu-calculator": makeBtuConfig(),
};

function makeGpaConfig() {
  return {
    title: "GPA Calculator",
    actionLabel: "Calculate GPA",
    emptyState: "Estimate weighted GPA from course grade points and credit hours.",
    summaryLabel: "GPA estimate",
    defaultHistoryLabel: "GPA scenario",
    defaults: {
      gradePoints1: 4,
      credits1: 3,
      gradePoints2: 3.7,
      credits2: 4,
      gradePoints3: 3.3,
      credits3: 3,
      gradePoints4: 4,
      credits4: 2,
      gradePoints5: 3,
      credits5: 3,
    },
    mainFields: [
      numberField("gradePoints1", "Course 1 grade points", 0, 4.3, 0.1),
      numberField("credits1", "Course 1 credits", 0, 10, 1),
      numberField("gradePoints2", "Course 2 grade points", 0, 4.3, 0.1),
      numberField("credits2", "Course 2 credits", 0, 10, 1),
      numberField("gradePoints3", "Course 3 grade points", 0, 4.3, 0.1),
      numberField("credits3", "Course 3 credits", 0, 10, 1),
      numberField("gradePoints4", "Course 4 grade points", 0, 4.3, 0.1),
      numberField("credits4", "Course 4 credits", 0, 10, 1),
      numberField("gradePoints5", "Course 5 grade points", 0, 4.3, 0.1),
      numberField("credits5", "Course 5 credits", 0, 10, 1),
    ],
    advancedFields: [],
    validate(values) {
      return getCreditValues(values).reduce((sum, item) => sum + item.credits, 0) <= 0 ? "Add at least one course with credits." : "";
    },
    compute(values) {
      const courses = getCreditValues(values);
      const totalCredits = courses.reduce((sum, item) => sum + item.credits, 0);
      const weightedPoints = courses.reduce((sum, item) => sum + item.gradePoints * item.credits, 0);
      const gpa = weightedPoints / Math.max(totalCredits, 1);

      return result(
        "GPA estimate",
        [
          card("Weighted GPA", fixed(gpa)),
          card("Credit hours", count(totalCredits)),
          card("Quality points", fixed(weightedPoints)),
        ],
        [
          plainBar("Total credits", totalCredits, count(totalCredits)),
          plainBar("Quality points", weightedPoints, fixed(weightedPoints)),
          plainBar("Weighted GPA", gpa, fixed(gpa)),
        ],
        [],
        [],
      );
    },
  };
}

function makeTargetGradeConfig() {
  return {
    title: "Grade Calculator",
    actionLabel: "Calculate required grade",
    emptyState: "Estimate the final exam score needed to reach a target course grade.",
    summaryLabel: "Grade target",
    defaultHistoryLabel: "Grade calculator scenario",
    defaults: { currentGrade: 84, finalWeight: 30, targetGrade: 88 },
    mainFields: [
      percentField("currentGrade", "Current course grade", 0, 100, 0.1),
      percentField("finalWeight", "Final exam weight", 1, 100, 1),
      percentField("targetGrade", "Target final grade", 0, 100, 0.1),
    ],
    advancedFields: [],
    validate(values) {
      return values.finalWeight <= 0 ? "Final exam weight must be greater than zero." : "";
    },
    compute(values) {
      const weight = values.finalWeight / 100;
      const required = (values.targetGrade - values.currentGrade * (1 - weight)) / Math.max(weight, 0.01);
      const likelyBand = required <= 100 ? "Target is reachable with the current weighting." : "Target requires more than 100% on the final.";

      return result(
        "Required final exam score",
        [
          card("Required exam grade", percent(required)),
          card("Target grade", percent(values.targetGrade)),
          card("Current grade", percent(values.currentGrade)),
        ],
        [
          plainBar("Current grade", values.currentGrade, percent(values.currentGrade)),
          plainBar("Final weight", values.finalWeight, percent(values.finalWeight)),
          plainBar("Target grade", values.targetGrade, percent(values.targetGrade)),
        ],
        [],
        [note("Assessment", likelyBand)],
      );
    },
  };
}

function makeScientificConfig() {
  return {
    title: "Scientific Calculator",
    actionLabel: "Calculate result",
    emptyState: "Run common scientific operations like powers, roots, logs, trig, and factorials from one clean calculator.",
    summaryLabel: "Scientific result",
    defaultHistoryLabel: "Scientific calculator scenario",
    defaults: { firstValue: 36, secondValue: 2, operation: "root", angleUnit: "degrees" },
    mainFields: [
      numberField("firstValue", "Primary value", -1000000000, 1000000000, 0.001),
      numberField("secondValue", "Secondary value", -1000000000, 1000000000, 0.001),
      { name: "operation", label: "Operation", type: "select", options: SCIENTIFIC_OPERATIONS },
    ],
    advancedFields: [{ name: "angleUnit", label: "Angle unit", type: "select", options: ANGLE_UNIT_OPTIONS }],
    validate(values) {
      if (values.operation === "divide" && values.secondValue === 0) return "Cannot divide by zero.";
      if (values.operation === "root" && values.secondValue === 0) return "Root degree must be above zero.";
      if (values.operation === "log" && (values.firstValue <= 0 || values.secondValue <= 0 || values.secondValue === 1)) return "Log requires positive values and a base other than 1.";
      if (values.operation === "ln" && values.firstValue <= 0) return "Natural log requires a positive value.";
      if (values.operation === "factorial" && (values.firstValue < 0 || !Number.isInteger(values.firstValue))) return "Factorial requires a whole number zero or higher.";
      return "";
    },
    compute(values) {
      const angleValue = values.angleUnit === "degrees" ? values.firstValue * (Math.PI / 180) : values.firstValue;
      let output = 0;

      switch (values.operation) {
        case "add":
          output = values.firstValue + values.secondValue;
          break;
        case "subtract":
          output = values.firstValue - values.secondValue;
          break;
        case "multiply":
          output = values.firstValue * values.secondValue;
          break;
        case "divide":
          output = values.firstValue / values.secondValue;
          break;
        case "power":
          output = Math.pow(values.firstValue, values.secondValue);
          break;
        case "root":
          output = Math.pow(values.firstValue, 1 / values.secondValue);
          break;
        case "log":
          output = Math.log(values.firstValue) / Math.log(values.secondValue);
          break;
        case "ln":
          output = Math.log(values.firstValue);
          break;
        case "sin":
          output = Math.sin(angleValue);
          break;
        case "cos":
          output = Math.cos(angleValue);
          break;
        case "tan":
          output = Math.tan(angleValue);
          break;
        case "factorial":
          output = factorial(values.firstValue);
          break;
        default:
          output = values.firstValue + values.secondValue;
      }

      return result(
        "Scientific calculation result",
        [
          card("Result", fixed(output)),
          card("Operation", SCIENTIFIC_OPERATIONS.find((item) => item.value === values.operation)?.label || "Add"),
        ],
        [
          plainBar("Primary value", values.firstValue, fixed(values.firstValue)),
          plainBar("Secondary value", values.secondValue, fixed(values.secondValue)),
          plainBar("Result", output, fixed(output)),
        ],
        [],
        [note("Angle unit", ANGLE_UNIT_OPTIONS.find((item) => item.value === values.angleUnit)?.label || "Degrees")],
      );
    },
  };
}

function makeFractionConfig() {
  return {
    title: "Fraction Calculator",
    actionLabel: "Calculate fractions",
    emptyState: "Add, subtract, multiply, or divide two fractions and see the simplified result.",
    summaryLabel: "Fraction result",
    defaultHistoryLabel: "Fraction calculator scenario",
    defaults: { numerator1: 3, denominator1: 4, operation: "add", numerator2: 5, denominator2: 6 },
    mainFields: [
      numberField("numerator1", "Fraction 1 numerator", -1000, 1000, 1),
      numberField("denominator1", "Fraction 1 denominator", -1000, 1000, 1),
      { name: "operation", label: "Operation", type: "select", options: FRACTION_OPERATIONS },
      numberField("numerator2", "Fraction 2 numerator", -1000, 1000, 1),
      numberField("denominator2", "Fraction 2 denominator", -1000, 1000, 1),
    ],
    advancedFields: [],
    validate(values) {
      if (values.denominator1 === 0 || values.denominator2 === 0) return "Fraction denominators cannot be zero.";
      if (values.operation === "divide" && values.numerator2 === 0) return "Cannot divide by a zero-value fraction.";
      return "";
    },
    compute(values) {
      const first = simplifyFraction(values.numerator1, values.denominator1);
      const second = simplifyFraction(values.numerator2, values.denominator2);
      const output = calculateFractionOperation(first, second, values.operation);
      const decimal = output.numerator / output.denominator;

      return result(
        "Fraction calculation result",
        [
          card("Simplified fraction", `${output.numerator}/${output.denominator}`),
          card("Decimal", fixed(decimal)),
        ],
        [
          plainBar("Fraction 1", 0, `${first.numerator}/${first.denominator}`),
          plainBar("Fraction 2", 0, `${second.numerator}/${second.denominator}`),
          plainBar("Result", 0, `${output.numerator}/${output.denominator}`),
        ],
        [],
        [note("Operation", FRACTION_OPERATIONS.find((item) => item.value === values.operation)?.label || "Add")],
      );
    },
  };
}

function makeMixedNumberConfig() {
  return {
    title: "Mixed Number Calculator",
    actionLabel: "Calculate mixed numbers",
    emptyState: "Calculate with two mixed numbers and return both improper fraction and mixed number results.",
    summaryLabel: "Mixed number result",
    defaultHistoryLabel: "Mixed number calculator scenario",
    defaults: { whole1: 1, numerator1: 1, denominator1: 2, operation: "add", whole2: 2, numerator2: 1, denominator2: 3 },
    mainFields: [
      numberField("whole1", "Mixed number 1 whole", -1000, 1000, 1),
      numberField("numerator1", "Mixed number 1 numerator", -1000, 1000, 1),
      numberField("denominator1", "Mixed number 1 denominator", 1, 1000, 1),
      { name: "operation", label: "Operation", type: "select", options: FRACTION_OPERATIONS },
      numberField("whole2", "Mixed number 2 whole", -1000, 1000, 1),
      numberField("numerator2", "Mixed number 2 numerator", -1000, 1000, 1),
      numberField("denominator2", "Mixed number 2 denominator", 1, 1000, 1),
    ],
    advancedFields: [],
    validate(values) {
      if (values.denominator1 === 0 || values.denominator2 === 0) return "Mixed number denominators cannot be zero.";
      return "";
    },
    compute(values) {
      const first = mixedToImproper(values.whole1, values.numerator1, values.denominator1);
      const second = mixedToImproper(values.whole2, values.numerator2, values.denominator2);
      const output = calculateFractionOperation(first, second, values.operation);
      const mixed = improperToMixed(output.numerator, output.denominator);

      return result(
        "Mixed number calculation result",
        [
          card("Mixed number", formatMixed(mixed)),
          card("Improper fraction", `${output.numerator}/${output.denominator}`),
        ],
        [
          plainBar("Mixed number 1", 0, `${values.whole1} ${values.numerator1}/${values.denominator1}`),
          plainBar("Mixed number 2", 0, `${values.whole2} ${values.numerator2}/${values.denominator2}`),
          plainBar("Result", 0, formatMixed(mixed)),
        ],
        [],
        [],
      );
    },
  };
}

function makeFractionToDecimalConfig() {
  return {
    title: "Fraction to Decimal Calculator",
    actionLabel: "Convert fraction",
    emptyState: "Convert a fraction to decimal and percentage form instantly.",
    summaryLabel: "Fraction to decimal result",
    defaultHistoryLabel: "Fraction to decimal scenario",
    defaults: { numerator: 7, denominator: 8 },
    mainFields: [numberField("numerator", "Numerator", -1000, 1000, 1), numberField("denominator", "Denominator", -1000, 1000, 1)],
    advancedFields: [],
    validate(values) {
      return values.denominator === 0 ? "Denominator cannot be zero." : "";
    },
    compute(values) {
      const decimal = values.numerator / values.denominator;

      return result(
        "Fraction to decimal result",
        [
          card("Decimal", fixed(decimal)),
          card("Percentage", percent(decimal * 100)),
        ],
        [
          plainBar("Fraction", 0, `${values.numerator}/${values.denominator}`),
          plainBar("Decimal", decimal, fixed(decimal)),
        ],
        [],
        [],
      );
    },
  };
}

function makeDecimalToPercentConfig() {
  return {
    title: "Decimal to Percent Calculator",
    actionLabel: "Convert decimal",
    emptyState: "Convert a decimal into percent form without extra steps.",
    summaryLabel: "Decimal to percent result",
    defaultHistoryLabel: "Decimal to percent scenario",
    defaults: { decimalValue: 0.875 },
    mainFields: [numberField("decimalValue", "Decimal value", -1000000, 1000000, 0.0001)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const percentage = values.decimalValue * 100;

      return result(
        "Decimal to percent result",
        [
          card("Percent", percent(percentage)),
          card("Decimal", fixed(values.decimalValue)),
        ],
        [
          plainBar("Decimal", values.decimalValue, fixed(values.decimalValue)),
          plainBar("Percent", percentage, percent(percentage)),
        ],
        [],
        [],
      );
    },
  };
}

function makePercentageOffConfig() {
  return {
    title: "Percentage Off Calculator",
    actionLabel: "Calculate savings",
    emptyState: "Estimate the sale price and amount saved from a percentage-off discount.",
    summaryLabel: "Percentage-off result",
    defaultHistoryLabel: "Percentage-off scenario",
    defaults: { originalPrice: 120, percentOff: 25, currency: "USD" },
    mainFields: [moneyField("originalPrice", "Original price", 1), percentField("percentOff", "Percent off", 0, 100, 0.1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.originalPrice <= 0 ? "Enter an original price." : "";
    },
    compute(values) {
      const savings = values.originalPrice * (values.percentOff / 100);
      const salePrice = values.originalPrice - savings;

      return result(
        "Percentage-off result",
        [
          card("Sale price", moneyText(salePrice, values.currency, 2)),
          card("You save", moneyText(savings, values.currency, 2)),
        ],
        [
          moneyBar("Original price", values.originalPrice, values.currency, 2),
          moneyBar("Savings", savings, values.currency, 2),
          moneyBar("Sale price", salePrice, values.currency, 2),
        ],
        [],
        [note("Discount", percent(values.percentOff))],
      );
    },
  };
}

function makeDiscountConfig() {
  return {
    title: "Discount Calculator",
    actionLabel: "Calculate discount",
    emptyState: "Compare the original and sale price to see the discount amount and rate.",
    summaryLabel: "Discount result",
    defaultHistoryLabel: "Discount calculator scenario",
    defaults: { originalPrice: 180, salePrice: 132, currency: "USD" },
    mainFields: [moneyField("originalPrice", "Original price", 1), moneyField("salePrice", "Sale price", 1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.originalPrice <= 0 ? "Enter an original price." : "";
    },
    compute(values) {
      const savings = values.originalPrice - values.salePrice;
      const discountRate = savings / Math.max(values.originalPrice, 1) * 100;

      return result(
        "Discount result",
        [
          card("Discount amount", moneyText(savings, values.currency, 2)),
          card("Discount rate", percent(discountRate)),
        ],
        [
          moneyBar("Original price", values.originalPrice, values.currency, 2),
          moneyBar("Sale price", values.salePrice, values.currency, 2),
          moneyBar("Discount amount", savings, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeTipConfig() {
  return {
    title: "Tip Calculator",
    actionLabel: "Calculate tip",
    emptyState: "Estimate tip, total bill, and per-person split for a shared check.",
    summaryLabel: "Tip estimate",
    defaultHistoryLabel: "Tip calculator scenario",
    defaults: { billAmount: 86, tipPercent: 18, splitBetween: 2, currency: "USD" },
    mainFields: [
      moneyField("billAmount", "Bill amount", 1),
      percentField("tipPercent", "Tip percent", 0, 100, 0.1),
      numberField("splitBetween", "People splitting", 1, 20, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.billAmount <= 0 ? "Enter a bill amount." : "";
    },
    compute(values) {
      const tipAmount = values.billAmount * (values.tipPercent / 100);
      const total = values.billAmount + tipAmount;
      const each = total / Math.max(values.splitBetween, 1);

      return result(
        "Tip estimate",
        [
          card("Tip amount", moneyText(tipAmount, values.currency, 2)),
          card("Total bill", moneyText(total, values.currency, 2)),
          card("Per person", moneyText(each, values.currency, 2)),
        ],
        [
          moneyBar("Bill amount", values.billAmount, values.currency, 2),
          moneyBar("Tip amount", tipAmount, values.currency, 2),
          moneyBar("Total bill", total, values.currency, 2),
        ],
        [],
        [note("People splitting", `${values.splitBetween}`)],
      );
    },
  };
}

function makeAverageConfig() {
  return buildMultiValueStatsConfig({
    title: "Average Calculator",
    actionLabel: "Calculate average",
    emptyState: "Average six values in one quick calculator.",
    summaryLabel: "Average result",
    defaultHistoryLabel: "Average scenario",
    defaults: { value1: 12, value2: 18, value3: 27, value4: 33, value5: 14, value6: 20 },
    compute(valuesList) {
      const avg = valuesList.reduce((sum, value) => sum + value, 0) / valuesList.length;
      return {
        summaryCards: [
          card("Average", fixed(avg)),
          card("Count", `${valuesList.length}`),
        ],
        breakdown: [
          plainBar("Total", valuesList.reduce((sum, value) => sum + value, 0), fixed(valuesList.reduce((sum, value) => sum + value, 0))),
          plainBar("Average", avg, fixed(avg)),
        ],
      };
    },
  });
}

function makeMeanMedianModeConfig() {
  return buildMultiValueStatsConfig({
    title: "Mean Median Mode Calculator",
    actionLabel: "Calculate stats",
    emptyState: "Estimate mean, median, and mode from six values.",
    summaryLabel: "Mean, median, and mode result",
    defaultHistoryLabel: "Mean median mode scenario",
    defaults: { value1: 8, value2: 11, value3: 11, value4: 14, value5: 18, value6: 20 },
    compute(valuesList) {
      const sorted = [...valuesList].sort((left, right) => left - right);
      const mean = valuesList.reduce((sum, value) => sum + value, 0) / valuesList.length;
      const median = (sorted[2] + sorted[3]) / 2;
      const mode = getMode(valuesList);
      return {
        summaryCards: [
          card("Mean", fixed(mean)),
          card("Median", fixed(median)),
          card("Mode", mode.length ? mode.join(", ") : "No mode"),
        ],
        breakdown: [
          plainBar("Sorted values", 0, sorted.map((value) => fixed(value)).join(", ")),
          plainBar("Mean", mean, fixed(mean)),
          plainBar("Median", median, fixed(median)),
        ],
      };
    },
  });
}

function makeStandardDeviationConfig() {
  return buildMultiValueStatsConfig({
    title: "Standard Deviation Calculator",
    actionLabel: "Calculate deviation",
    emptyState: "Estimate population standard deviation from six values.",
    summaryLabel: "Standard deviation result",
    defaultHistoryLabel: "Standard deviation scenario",
    defaults: { value1: 12, value2: 16, value3: 17, value4: 21, value5: 23, value6: 31 },
    compute(valuesList) {
      const mean = valuesList.reduce((sum, value) => sum + value, 0) / valuesList.length;
      const variance = valuesList.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / valuesList.length;
      const stdDev = Math.sqrt(variance);
      return {
        summaryCards: [
          card("Standard deviation", fixed(stdDev)),
          card("Variance", fixed(variance)),
          card("Mean", fixed(mean)),
        ],
        breakdown: [
          plainBar("Mean", mean, fixed(mean)),
          plainBar("Variance", variance, fixed(variance)),
          plainBar("Standard deviation", stdDev, fixed(stdDev)),
        ],
      };
    },
  });
}

function makeTimeCalculatorConfig() {
  return {
    title: "Time Calculator",
    actionLabel: "Calculate time",
    emptyState: "Add a time offset to a starting hour and minute to see the ending time.",
    summaryLabel: "Time result",
    defaultHistoryLabel: "Time calculator scenario",
    defaults: { startHour: 9, startMinute: 30, addHours: 2, addMinutes: 45 },
    mainFields: [
      numberField("startHour", "Start hour (24h)", 0, 23, 1),
      numberField("startMinute", "Start minute", 0, 59, 1),
      numberField("addHours", "Add hours", 0, 48, 1),
      numberField("addMinutes", "Add minutes", 0, 300, 1),
    ],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const startTotal = values.startHour * 60 + values.startMinute;
      const endTotal = startTotal + values.addHours * 60 + values.addMinutes;
      const daysShift = Math.floor(endTotal / 1440);
      const normalized = ((endTotal % 1440) + 1440) % 1440;

      return result(
        "Time calculator result",
        [
          card("Ending time", formatClock(normalized)),
          card("Day shift", daysShift === 0 ? "Same day" : `+${daysShift} day(s)`),
        ],
        [
          plainBar("Start time", startTotal, formatClock(startTotal)),
          plainBar("Added duration", 0, `${values.addHours}h ${values.addMinutes}m`),
          plainBar("Ending time", normalized, formatClock(normalized)),
        ],
        [],
        [],
      );
    },
  };
}

function makeTimeDurationConfig() {
  return {
    title: "Time Duration Calculator",
    actionLabel: "Calculate duration",
    emptyState: "Measure the duration between two clock times and support overnight spans if needed.",
    summaryLabel: "Time duration result",
    defaultHistoryLabel: "Time duration scenario",
    defaults: { startHour: 22, startMinute: 15, endHour: 6, endMinute: 45, overnight: true },
    mainFields: [
      numberField("startHour", "Start hour (24h)", 0, 23, 1),
      numberField("startMinute", "Start minute", 0, 59, 1),
      numberField("endHour", "End hour (24h)", 0, 23, 1),
      numberField("endMinute", "End minute", 0, 59, 1),
      { name: "overnight", label: "Overnight span", type: "boolean" },
    ],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const startTotal = values.startHour * 60 + values.startMinute;
      let endTotal = values.endHour * 60 + values.endMinute;
      if (values.overnight && endTotal < startTotal) {
        endTotal += 1440;
      }
      const duration = Math.max(0, endTotal - startTotal);

      return result(
        "Time duration result",
        [
          card("Duration", `${Math.floor(duration / 60)}h ${duration % 60}m`),
          card("Start", formatClock(startTotal)),
          card("End", formatClock(endTotal)),
        ],
        [
          plainBar("Start time", startTotal, formatClock(startTotal)),
          plainBar("End time", endTotal, formatClock(endTotal)),
          plainBar("Duration", duration, `${Math.floor(duration / 60)}h ${duration % 60}m`),
        ],
        [],
        [note("Overnight", values.overnight ? "Yes" : "No")],
      );
    },
  };
}

function makeHoursCalculatorConfig() {
  return {
    title: "Hours Calculator",
    actionLabel: "Calculate hours",
    emptyState: "Estimate total hours from hours per day, days per week, and number of weeks.",
    summaryLabel: "Hours result",
    defaultHistoryLabel: "Hours calculator scenario",
    defaults: { hoursPerDay: 6.5, daysPerWeek: 5, weeks: 4 },
    mainFields: [
      numberField("hoursPerDay", "Hours per day", 0, 24, 0.1),
      numberField("daysPerWeek", "Days per week", 0, 7, 1),
      numberField("weeks", "Weeks", 0, 104, 1),
    ],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const weeklyHours = values.hoursPerDay * values.daysPerWeek;
      const totalHours = weeklyHours * values.weeks;

      return result(
        "Hours result",
        [
          card("Weekly hours", fixed(weeklyHours)),
          card("Total hours", fixed(totalHours)),
        ],
        [
          plainBar("Hours per day", values.hoursPerDay, fixed(values.hoursPerDay)),
          plainBar("Days per week", values.daysPerWeek, String(values.daysPerWeek)),
          plainBar("Weeks", values.weeks, String(values.weeks)),
        ],
        [],
        [],
      );
    },
  };
}

function makeWorkHoursConfig() {
  return {
    title: "Work Hours Calculator",
    actionLabel: "Calculate work hours",
    emptyState: "Estimate daily and weekly work time from start, end, breaks, and days worked.",
    summaryLabel: "Work hours result",
    defaultHistoryLabel: "Work hours scenario",
    defaults: { startHour: 8, startMinute: 30, endHour: 17, endMinute: 15, breakMinutes: 45, daysWorked: 5 },
    mainFields: [
      numberField("startHour", "Start hour (24h)", 0, 23, 1),
      numberField("startMinute", "Start minute", 0, 59, 1),
      numberField("endHour", "End hour (24h)", 0, 23, 1),
      numberField("endMinute", "End minute", 0, 59, 1),
      numberField("breakMinutes", "Break minutes", 0, 300, 1),
      numberField("daysWorked", "Days worked per week", 0, 7, 1),
    ],
    advancedFields: [],
    validate(values) {
      const duration = values.endHour * 60 + values.endMinute - (values.startHour * 60 + values.startMinute);
      return duration <= values.breakMinutes ? "Break time must be shorter than the shift length." : "";
    },
    compute(values) {
      const shiftMinutes = values.endHour * 60 + values.endMinute - (values.startHour * 60 + values.startMinute);
      const workMinutes = shiftMinutes - values.breakMinutes;
      const weeklyHours = workMinutes / 60 * values.daysWorked;

      return result(
        "Work hours result",
        [
          card("Daily work time", `${Math.floor(workMinutes / 60)}h ${Math.round(workMinutes % 60)}m`),
          card("Weekly hours", fixed(weeklyHours)),
        ],
        [
          plainBar("Shift start", values.startHour, formatClock(values.startHour * 60 + values.startMinute)),
          plainBar("Shift end", values.endHour, formatClock(values.endHour * 60 + values.endMinute)),
          plainBar("Break time", values.breakMinutes, `${values.breakMinutes} min`),
        ],
        [],
        [note("Days worked", `${values.daysWorked} days per week`)],
      );
    },
  };
}

function makeSleepCalculatorConfig() {
  return {
    title: "Sleep Calculator",
    actionLabel: "Calculate sleep timing",
    emptyState: "Estimate a better wake-up time based on sleep cycles and how long it takes to fall asleep.",
    summaryLabel: "Sleep timing result",
    defaultHistoryLabel: "Sleep calculator scenario",
    defaults: { bedtimeHour: 22, bedtimeMinute: 45, cycles: 5, fallAsleepMinutes: 15 },
    mainFields: [
      numberField("bedtimeHour", "Bedtime hour (24h)", 0, 23, 1),
      numberField("bedtimeMinute", "Bedtime minute", 0, 59, 1),
      numberField("cycles", "Sleep cycles", 3, 8, 1),
      numberField("fallAsleepMinutes", "Minutes to fall asleep", 0, 60, 1),
    ],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const bedtimeTotal = values.bedtimeHour * 60 + values.bedtimeMinute;
      const wakeTotal = bedtimeTotal + values.fallAsleepMinutes + values.cycles * 90;
      const sleepHours = (values.cycles * 90) / 60;

      return result(
        "Sleep timing result",
        [
          card("Wake-up time", formatClock(wakeTotal)),
          card("Sleep duration", `${fixed(sleepHours)} hours`),
          card("Sleep cycles", `${values.cycles}`),
        ],
        [
          plainBar("Bedtime", bedtimeTotal, formatClock(bedtimeTotal)),
          plainBar("Fall asleep buffer", values.fallAsleepMinutes, `${values.fallAsleepMinutes} min`),
          plainBar("Wake-up time", wakeTotal, formatClock(wakeTotal)),
        ],
        [],
        [],
      );
    },
  };
}

function makeWaterIntakeConfig() {
  return {
    title: "Water Intake Calculator",
    actionLabel: "Calculate water intake",
    emptyState: "Estimate a daily water target based on body weight, activity, and climate.",
    summaryLabel: "Water intake estimate",
    defaultHistoryLabel: "Water intake scenario",
    defaults: { weightKg: 76, activity: "moderate", climate: "warm" },
    mainFields: [
      numberField("weightKg", "Weight (kg)", 20, 300, 0.1),
      { name: "activity", label: "Activity level", type: "select", options: ACTIVITY_OPTIONS },
      { name: "climate", label: "Climate", type: "select", options: CLIMATE_OPTIONS },
    ],
    advancedFields: [],
    validate(values) {
      return values.weightKg <= 0 ? "Enter body weight." : "";
    },
    compute(values) {
      const baseLiters = values.weightKg * 0.033;
      const activityBump = values.activity === "athlete" ? 1 : values.activity === "high" ? 0.75 : values.activity === "moderate" ? 0.4 : 0.2;
      const climateBump = values.climate === "hot" ? 0.6 : values.climate === "warm" ? 0.3 : 0;
      const liters = baseLiters + activityBump + climateBump;
      const ounces = liters * 33.814;

      return result(
        "Water intake estimate",
        [
          card("Water target", `${fixed(liters)} L/day`),
          card("Water target", `${fixed(ounces)} oz/day`),
        ],
        [
          plainBar("Base hydration", baseLiters, `${fixed(baseLiters)} L`),
          plainBar("Activity bump", activityBump, `${fixed(activityBump)} L`),
          plainBar("Climate bump", climateBump, `${fixed(climateBump)} L`),
        ],
        [],
        [],
      );
    },
  };
}

function makeCaloriesBurnedConfig() {
  return {
    title: "Calories Burned Calculator",
    actionLabel: "Calculate calories burned",
    emptyState: "Estimate calories burned from body weight, workout duration, and activity type.",
    summaryLabel: "Calories burned estimate",
    defaultHistoryLabel: "Calories burned scenario",
    defaults: { weightKg: 74, durationMinutes: 45, activity: "cycling" },
    mainFields: [
      numberField("weightKg", "Weight (kg)", 20, 300, 0.1),
      numberField("durationMinutes", "Duration (minutes)", 1, 600, 1),
      { name: "activity", label: "Activity", type: "select", options: DRINK_ACTIVITY_OPTIONS },
    ],
    advancedFields: [],
    validate(values) {
      return values.durationMinutes <= 0 ? "Enter workout duration." : "";
    },
    compute(values) {
      const met = getMetValue(values.activity);
      const calories = met * 3.5 * values.weightKg / 200 * values.durationMinutes;

      return result(
        "Calories burned estimate",
        [
          card("Calories burned", `${count(calories)} kcal`),
          card("MET value", fixed(met)),
        ],
        [
          plainBar("Weight", values.weightKg, `${fixed(values.weightKg)} kg`),
          plainBar("Duration", values.durationMinutes, `${values.durationMinutes} min`),
          plainBar("Calories burned", calories, `${count(calories)} kcal`),
        ],
        [],
        [],
      );
    },
  };
}

function makeWaistToHeightRatioConfig() {
  return {
    title: "Waist-to-Height Ratio Calculator",
    actionLabel: "Calculate ratio",
    emptyState: "Estimate waist-to-height ratio from your waist and height measurements.",
    summaryLabel: "Waist-to-height ratio",
    defaultHistoryLabel: "Waist-to-height scenario",
    defaults: { waistCm: 84, heightCm: 176 },
    mainFields: [
      numberField("waistCm", "Waist (cm)", 20, 250, 0.1),
      numberField("heightCm", "Height (cm)", 100, 250, 0.1),
    ],
    advancedFields: [],
    validate(values) {
      return values.heightCm <= 0 ? "Enter height." : "";
    },
    compute(values) {
      const ratio = values.waistCm / Math.max(values.heightCm, 1);
      const category = ratio < 0.5 ? "Lower risk range" : ratio < 0.6 ? "Elevated range" : "Higher risk range";

      return result(
        "Waist-to-height ratio result",
        [
          card("Ratio", fixed(ratio)),
          card("Assessment", category),
        ],
        [
          plainBar("Waist", values.waistCm, `${fixed(values.waistCm)} cm`),
          plainBar("Height", values.heightCm, `${fixed(values.heightCm)} cm`),
        ],
        [],
        [],
      );
    },
  };
}

function makePregnancyDueDateConfig() {
  return {
    title: "Pregnancy Due Date Calculator",
    actionLabel: "Calculate due date",
    emptyState: "Estimate a due date and milestone dates from the first day of the last period.",
    summaryLabel: "Due date estimate",
    defaultHistoryLabel: "Due date scenario",
    defaults: { lastPeriodDate: shiftDate(todayString(), -35), cycleLength: 28 },
    mainFields: [
      dateField("lastPeriodDate", "First day of last period"),
      numberField("cycleLength", "Cycle length (days)", 20, 45, 1),
    ],
    advancedFields: [],
    validate(values) {
      return !values.lastPeriodDate ? "Select the first day of the last period." : "";
    },
    compute(values) {
      const dueDate = shiftDateObject(values.lastPeriodDate, 280 + (values.cycleLength - 28));
      const trimesterTwo = shiftDateObject(values.lastPeriodDate, 91);
      const trimesterThree = shiftDateObject(values.lastPeriodDate, 189);
      const conception = shiftDateObject(values.lastPeriodDate, values.cycleLength - 14);

      return result(
        "Pregnancy due date estimate",
        [
          card("Estimated due date", formatDate(dueDate)),
          card("Estimated conception", formatDate(conception)),
        ],
        [
          plainBar("Second trimester starts", 0, formatDate(trimesterTwo)),
          plainBar("Third trimester starts", 0, formatDate(trimesterThree)),
        ],
        [],
        [note("LMP", formatDate(values.lastPeriodDate))],
      );
    },
  };
}

function makeConceptionDateConfig() {
  return {
    title: "Conception Date Calculator",
    actionLabel: "Estimate conception date",
    emptyState: "Estimate the likely conception date from an expected due date.",
    summaryLabel: "Conception date estimate",
    defaultHistoryLabel: "Conception date scenario",
    defaults: { dueDate: shiftDate(todayString(), 220) },
    mainFields: [dateField("dueDate", "Estimated due date")],
    advancedFields: [],
    validate(values) {
      return !values.dueDate ? "Select an estimated due date." : "";
    },
    compute(values) {
      const conceptionDate = shiftDateObject(values.dueDate, -266);
      const lastPeriod = shiftDateObject(values.dueDate, -280);

      return result(
        "Conception date estimate",
        [
          card("Likely conception date", formatDate(conceptionDate)),
          card("Estimated LMP", formatDate(lastPeriod)),
        ],
        [
          plainBar("Due date", 0, formatDate(values.dueDate)),
          plainBar("Conception date", 0, formatDate(conceptionDate)),
        ],
        [],
        [],
      );
    },
  };
}

function makeBacConfig() {
  return {
    title: "BAC Calculator",
    actionLabel: "Estimate BAC",
    emptyState: "Estimate BAC from body weight, standard drinks, time drinking, and sex.",
    summaryLabel: "BAC estimate",
    defaultHistoryLabel: "BAC scenario",
    defaults: { sex: "male", weightKg: 80, drinks: 4, hours: 2.5 },
    mainFields: [
      { name: "sex", label: "Sex", type: "select", options: SEX_OPTIONS },
      numberField("weightKg", "Weight (kg)", 30, 300, 0.1),
      numberField("drinks", "Standard drinks", 0, 20, 0.5),
      numberField("hours", "Hours drinking", 0, 24, 0.1),
    ],
    advancedFields: [],
    validate(values) {
      return values.weightKg <= 0 ? "Enter body weight." : "";
    },
    compute(values) {
      const weightLb = values.weightKg * 2.20462;
      const distribution = values.sex === "male" ? 0.68 : 0.55;
      const bac = Math.max(0, values.drinks * 14 * 5.14 / (weightLb * distribution) - 0.015 * values.hours);
      const label = bac < 0.03 ? "Light" : bac < 0.08 ? "Elevated" : bac < 0.15 ? "Impaired" : "High";

      return result(
        "BAC estimate",
        [
          card("Estimated BAC", `${fixed(bac)}%`),
          card("Assessment", label),
        ],
        [
          plainBar("Standard drinks", values.drinks, fixed(values.drinks)),
          plainBar("Hours drinking", values.hours, `${fixed(values.hours)} hours`),
          plainBar("Weight", values.weightKg, `${fixed(values.weightKg)} kg`),
        ],
        [],
        [note("Reminder", "BAC estimates are rough and should not be used for driving decisions.")],
      );
    },
  };
}

function makeRentAffordabilityConfig() {
  return {
    title: "Rent Affordability Calculator",
    actionLabel: "Calculate affordable rent",
    emptyState: "Estimate an affordable monthly rent target from income, debt, and a rent share guideline.",
    summaryLabel: "Rent affordability estimate",
    defaultHistoryLabel: "Rent affordability scenario",
    defaults: { monthlyIncome: 6200, debtPayments: 850, rentShare: 30, currency: "USD" },
    mainFields: [
      moneyField("monthlyIncome", "Monthly income", 50),
      moneyField("debtPayments", "Monthly debt payments", 10),
      percentField("rentShare", "Target rent share of income", 10, 60, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.monthlyIncome <= 0 ? "Enter monthly income." : "";
    },
    compute(values) {
      const rentCap = Math.max(0, values.monthlyIncome * (values.rentShare / 100) - values.debtPayments * 0.25);
      const conservative = Math.max(0, rentCap * 0.9);

      return result(
        "Rent affordability estimate",
        [
          card("Affordable rent", moneyText(rentCap, values.currency, 2)),
          card("Conservative target", moneyText(conservative, values.currency, 2)),
        ],
        [
          moneyBar("Monthly income", values.monthlyIncome, values.currency, 2),
          moneyBar("Debt payments", values.debtPayments, values.currency, 2),
          moneyBar("Affordable rent", rentCap, values.currency, 2),
        ],
        [],
        [note("Rent share", percent(values.rentShare))],
      );
    },
  };
}

function makeBudgetConfig() {
  return {
    title: "Budget Calculator",
    actionLabel: "Calculate budget",
    emptyState: "Estimate monthly surplus, savings rate, and spending balance from your major budget buckets.",
    summaryLabel: "Budget estimate",
    defaultHistoryLabel: "Budget scenario",
    defaults: { monthlyIncome: 6800, housing: 1900, transport: 420, food: 650, utilities: 240, other: 980, currency: "USD" },
    mainFields: [
      moneyField("monthlyIncome", "Monthly income", 50),
      moneyField("housing", "Housing", 10),
      moneyField("transport", "Transport", 10),
      moneyField("food", "Food", 10),
      moneyField("utilities", "Utilities", 10),
      moneyField("other", "Other spending", 10),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.monthlyIncome <= 0 ? "Enter monthly income." : "";
    },
    compute(values) {
      const expenses = values.housing + values.transport + values.food + values.utilities + values.other;
      const surplus = values.monthlyIncome - expenses;
      const savingsRate = surplus / Math.max(values.monthlyIncome, 1) * 100;

      return result(
        "Budget estimate",
        [
          card("Monthly surplus", moneyText(surplus, values.currency, 2)),
          card("Total expenses", moneyText(expenses, values.currency, 2)),
          card("Savings rate", percent(savingsRate)),
        ],
        [
          moneyBar("Income", values.monthlyIncome, values.currency, 2),
          moneyBar("Expenses", expenses, values.currency, 2),
          moneyBar("Surplus", surplus, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeNetWorthConfig() {
  return {
    title: "Net Worth Calculator",
    actionLabel: "Calculate net worth",
    emptyState: "Estimate total assets, liabilities, and net worth from your core financial balances.",
    summaryLabel: "Net worth estimate",
    defaultHistoryLabel: "Net worth scenario",
    defaults: { cash: 18000, investments: 46000, retirement: 72000, property: 280000, debts: 198000, currency: "USD" },
    mainFields: [
      moneyField("cash", "Cash", 50),
      moneyField("investments", "Investments", 50),
      moneyField("retirement", "Retirement accounts", 50),
      moneyField("property", "Property value", 100),
      moneyField("debts", "Debts", 100),
    ],
    advancedFields: [currencyField()],
    validate() {
      return "";
    },
    compute(values) {
      const assets = values.cash + values.investments + values.retirement + values.property;
      const netWorth = assets - values.debts;

      return result(
        "Net worth estimate",
        [
          card("Net worth", moneyText(netWorth, values.currency, 2)),
          card("Assets", moneyText(assets, values.currency, 2)),
          card("Liabilities", moneyText(values.debts, values.currency, 2)),
        ],
        [
          moneyBar("Assets", assets, values.currency, 2),
          moneyBar("Liabilities", values.debts, values.currency, 2),
          moneyBar("Net worth", netWorth, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeDividendConfig() {
  return {
    title: "Dividend Calculator",
    actionLabel: "Calculate dividends",
    emptyState: "Estimate annual dividend income and dividend yield from shares owned and payout details.",
    summaryLabel: "Dividend estimate",
    defaultHistoryLabel: "Dividend scenario",
    defaults: { shares: 180, dividendPerShare: 0.42, paymentsPerYear: 4, sharePrice: 38, currency: "USD" },
    mainFields: [
      numberField("shares", "Shares owned", 0, 1000000, 1),
      moneyField("dividendPerShare", "Dividend per share", 0.01),
      numberField("paymentsPerYear", "Payments per year", 1, 12, 1),
      moneyField("sharePrice", "Share price", 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.sharePrice <= 0 ? "Enter a share price." : "";
    },
    compute(values) {
      const annualIncome = values.shares * values.dividendPerShare * values.paymentsPerYear;
      const annualDividendPerShare = values.dividendPerShare * values.paymentsPerYear;
      const yieldPercent = annualDividendPerShare / Math.max(values.sharePrice, 0.01) * 100;

      return result(
        "Dividend estimate",
        [
          card("Annual dividend income", moneyText(annualIncome, values.currency, 2)),
          card("Dividend yield", percent(yieldPercent)),
          card("Income per payment", moneyText(annualIncome / values.paymentsPerYear, values.currency, 2)),
        ],
        [
          plainBar("Shares owned", values.shares, count(values.shares)),
          moneyBar("Dividend / share", values.dividendPerShare, values.currency, 2),
          moneyBar("Annual income", annualIncome, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeRoiConfig() {
  return {
    title: "ROI Calculator",
    actionLabel: "Calculate ROI",
    emptyState: "Estimate return on investment from the starting cost and final value.",
    summaryLabel: "ROI estimate",
    defaultHistoryLabel: "ROI scenario",
    defaults: { initialInvestment: 12000, finalValue: 16800, currency: "USD" },
    mainFields: [moneyField("initialInvestment", "Initial investment", 100), moneyField("finalValue", "Final value", 100)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.initialInvestment <= 0 ? "Enter an initial investment." : "";
    },
    compute(values) {
      const gain = values.finalValue - values.initialInvestment;
      const roi = gain / Math.max(values.initialInvestment, 1) * 100;

      return result(
        "ROI estimate",
        [
          card("ROI", percent(roi)),
          card("Gain", moneyText(gain, values.currency, 2)),
        ],
        [
          moneyBar("Initial investment", values.initialInvestment, values.currency, 2),
          moneyBar("Final value", values.finalValue, values.currency, 2),
          moneyBar("Gain", gain, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeBreakEvenConfig() {
  return {
    title: "Break Even Calculator",
    actionLabel: "Calculate break even",
    emptyState: "Estimate how many units and how much revenue are needed to break even.",
    summaryLabel: "Break-even estimate",
    defaultHistoryLabel: "Break-even scenario",
    defaults: { fixedCosts: 15000, variableCostPerUnit: 18, pricePerUnit: 42, currency: "USD" },
    mainFields: [
      moneyField("fixedCosts", "Fixed costs", 100),
      moneyField("variableCostPerUnit", "Variable cost per unit", 1),
      moneyField("pricePerUnit", "Price per unit", 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.pricePerUnit <= values.variableCostPerUnit ? "Price per unit must be above variable cost per unit." : "";
    },
    compute(values) {
      const contributionMargin = values.pricePerUnit - values.variableCostPerUnit;
      const units = values.fixedCosts / contributionMargin;
      const revenue = units * values.pricePerUnit;

      return result(
        "Break-even estimate",
        [
          card("Break-even units", fixed(units)),
          card("Break-even revenue", moneyText(revenue, values.currency, 2)),
          card("Contribution margin", moneyText(contributionMargin, values.currency, 2)),
        ],
        [
          moneyBar("Fixed costs", values.fixedCosts, values.currency, 2),
          moneyBar("Contribution margin", contributionMargin, values.currency, 2),
          moneyBar("Break-even revenue", revenue, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeMarkupConfig() {
  return {
    title: "Markup Calculator",
    actionLabel: "Calculate markup",
    emptyState: "Estimate sale price, gross profit, and margin from a cost and markup percentage.",
    summaryLabel: "Markup estimate",
    defaultHistoryLabel: "Markup scenario",
    defaults: { cost: 48, markupPercent: 35, currency: "USD" },
    mainFields: [moneyField("cost", "Cost", 1), percentField("markupPercent", "Markup percent", 0, 500, 0.1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.cost <= 0 ? "Enter a cost." : "";
    },
    compute(values) {
      const grossProfit = values.cost * (values.markupPercent / 100);
      const salePrice = values.cost + grossProfit;
      const margin = grossProfit / Math.max(salePrice, 1) * 100;

      return result(
        "Markup estimate",
        [
          card("Sale price", moneyText(salePrice, values.currency, 2)),
          card("Gross profit", moneyText(grossProfit, values.currency, 2)),
          card("Margin", percent(margin)),
        ],
        [
          moneyBar("Cost", values.cost, values.currency, 2),
          moneyBar("Gross profit", grossProfit, values.currency, 2),
          moneyBar("Sale price", salePrice, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeAutoLeaseConfig() {
  return {
    title: "Auto Lease Calculator",
    actionLabel: "Calculate lease",
    emptyState: "Estimate a monthly auto lease payment from vehicle price, residual value, term, and money factor.",
    summaryLabel: "Auto lease estimate",
    defaultHistoryLabel: "Auto lease scenario",
    defaults: { vehiclePrice: 42000, downPayment: 2500, residualPercent: 55, termMonths: 36, moneyFactor: 0.0024, currency: "USD" },
    mainFields: [
      moneyField("vehiclePrice", "Vehicle price", 100),
      moneyField("downPayment", "Down payment", 100),
      percentField("residualPercent", "Residual percent", 20, 80, 0.1),
      numberField("termMonths", "Lease term (months)", 12, 60, 1),
      numberField("moneyFactor", "Money factor", 0, 0.01, 0.0001),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.termMonths <= 0 ? "Lease term must be greater than zero." : "";
    },
    compute(values) {
      const capCost = Math.max(0, values.vehiclePrice - values.downPayment);
      const residualValue = values.vehiclePrice * (values.residualPercent / 100);
      const depreciation = (capCost - residualValue) / values.termMonths;
      const financeCharge = (capCost + residualValue) * values.moneyFactor;
      const monthlyPayment = depreciation + financeCharge;

      return result(
        "Auto lease estimate",
        [
          card("Monthly payment", moneyText(monthlyPayment, values.currency, 2)),
          card("Residual value", moneyText(residualValue, values.currency, 2)),
          card("APR equivalent", percent(values.moneyFactor * 2400)),
        ],
        [
          moneyBar("Cap cost", capCost, values.currency, 2),
          moneyBar("Residual value", residualValue, values.currency, 2),
          moneyBar("Depreciation", depreciation, values.currency, 2),
          moneyBar("Finance charge", financeCharge, values.currency, 2),
        ],
        [],
        [note("Term", `${values.termMonths} months`)],
      );
    },
  };
}

function makeMortgageRecastConfig() {
  return {
    title: "Mortgage Recast Calculator",
    actionLabel: "Calculate recast",
    emptyState: "Estimate how a lump-sum recast changes your mortgage payment while keeping the same rate and remaining term.",
    summaryLabel: "Mortgage recast estimate",
    defaultHistoryLabel: "Mortgage recast scenario",
    defaults: { currentBalance: 285000, annualRate: 6.2, yearsRemaining: 24, lumpSum: 30000, currency: "USD" },
    mainFields: [
      moneyField("currentBalance", "Current balance", 100),
      percentField("annualRate", "Mortgage rate", 0, 20, 0.1),
      numberField("yearsRemaining", "Years remaining", 1, 40, 1),
      moneyField("lumpSum", "Lump-sum payment", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.currentBalance <= 0) return "Enter a current balance.";
      return values.lumpSum >= values.currentBalance ? "Lump-sum payment should be lower than the current balance." : "";
    },
    compute(values) {
      const months = values.yearsRemaining * 12;
      const oldPayment = getAmortizedPayment(values.currentBalance, values.annualRate, months);
      const newBalance = values.currentBalance - values.lumpSum;
      const newPayment = getAmortizedPayment(newBalance, values.annualRate, months);
      const monthlySavings = oldPayment - newPayment;

      return result(
        "Mortgage recast estimate",
        [
          card("New payment", moneyText(newPayment, values.currency, 2)),
          card("Monthly savings", moneyText(monthlySavings, values.currency, 2)),
          card("Recast balance", moneyText(newBalance, values.currency, 2)),
        ],
        [
          moneyBar("Old payment", oldPayment, values.currency, 2),
          moneyBar("Lump sum", values.lumpSum, values.currency, 2),
          moneyBar("New balance", newBalance, values.currency, 2),
          moneyBar("New payment", newPayment, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeBiweeklyMortgageConfig() {
  return {
    title: "Biweekly Mortgage Calculator",
    actionLabel: "Calculate biweekly mortgage",
    emptyState: "Compare a standard monthly mortgage against a biweekly half-payment schedule.",
    summaryLabel: "Biweekly mortgage estimate",
    defaultHistoryLabel: "Biweekly mortgage scenario",
    defaults: { principal: 340000, annualRate: 6.45, years: 30, currency: "USD" },
    mainFields: [
      moneyField("principal", "Loan amount", 100),
      percentField("annualRate", "Mortgage rate", 0, 20, 0.1),
      numberField("years", "Loan term (years)", 1, 40, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.principal <= 0 ? "Enter a loan amount." : "";
    },
    compute(values) {
      const monthlyPayment = getAmortizedPayment(values.principal, values.annualRate, values.years * 12);
      const biweeklyPayment = monthlyPayment / 2;
      const accelerated = buildBiweeklyPayoff(values.principal, values.annualRate, biweeklyPayment);
      const standardMonths = values.years * 12;

      return result(
        "Biweekly mortgage estimate",
        [
          card("Monthly payment", moneyText(monthlyPayment, values.currency, 2)),
          card("Biweekly payment", moneyText(biweeklyPayment, values.currency, 2)),
          card("Biweekly payoff", `${fixed(accelerated.years)} years`),
          card("Interest saved", moneyText(accelerated.interestSaved, values.currency, 2)),
        ],
        [
          moneyBar("Monthly payment", monthlyPayment, values.currency, 2),
          moneyBar("Biweekly payment", biweeklyPayment, values.currency, 2),
          plainBar("Standard term", standardMonths, `${values.years} years`),
          plainBar("Biweekly term", accelerated.years, `${fixed(accelerated.years)} years`),
        ],
        [],
        [],
      );
    },
  };
}

function makeInterestOnlyMortgageConfig() {
  return {
    title: "Interest Only Mortgage Calculator",
    actionLabel: "Calculate interest-only mortgage",
    emptyState: "Estimate the interest-only payment now and the later amortized payment once principal repayment begins.",
    summaryLabel: "Interest-only mortgage estimate",
    defaultHistoryLabel: "Interest-only mortgage scenario",
    defaults: { principal: 390000, annualRate: 6.3, totalYears: 30, interestOnlyYears: 7, currency: "USD" },
    mainFields: [
      moneyField("principal", "Loan amount", 100),
      percentField("annualRate", "Mortgage rate", 0, 20, 0.1),
      numberField("totalYears", "Total term (years)", 5, 40, 1),
      numberField("interestOnlyYears", "Interest-only years", 1, 15, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.interestOnlyYears >= values.totalYears ? "Interest-only years must be lower than the total term." : "";
    },
    compute(values) {
      const monthlyInterestOnly = values.principal * (values.annualRate / 100 / 12);
      const amortizedYears = values.totalYears - values.interestOnlyYears;
      const laterPayment = getAmortizedPayment(values.principal, values.annualRate, amortizedYears * 12);

      return result(
        "Interest-only mortgage estimate",
        [
          card("Interest-only payment", moneyText(monthlyInterestOnly, values.currency, 2)),
          card("Later amortized payment", moneyText(laterPayment, values.currency, 2)),
          card("Amortized phase", `${amortizedYears} years`),
        ],
        [
          moneyBar("Loan amount", values.principal, values.currency, 2),
          moneyBar("Interest-only payment", monthlyInterestOnly, values.currency, 2),
          moneyBar("Later payment", laterPayment, values.currency, 2),
        ],
        [],
        [],
      );
    },
  };
}

function makeSolarPanelConfig() {
  return {
    title: "Solar Panel Calculator",
    actionLabel: "Calculate solar setup",
    emptyState: "Estimate system size, panel count, and annual production from your bill and local sun hours.",
    summaryLabel: "Solar panel estimate",
    defaultHistoryLabel: "Solar panel scenario",
    defaults: { monthlyBill: 185, electricityRate: 0.18, sunHours: 5.3, panelWattage: 400, currency: "USD" },
    mainFields: [
      moneyField("monthlyBill", "Monthly electric bill", 1),
      moneyField("electricityRate", "Electricity rate per kWh", 0.01),
      numberField("sunHours", "Average sun hours / day", 1, 10, 0.1),
      numberField("panelWattage", "Panel wattage", 100, 700, 5),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.electricityRate <= 0) return "Electricity rate must be greater than zero.";
      return values.sunHours <= 0 ? "Sun hours must be greater than zero." : "";
    },
    compute(values) {
      const monthlyKwh = values.monthlyBill / values.electricityRate;
      const systemKw = monthlyKwh / (values.sunHours * 30);
      const annualKwh = systemKw * values.sunHours * 365;
      const panels = Math.ceil(systemKw * 1000 / values.panelWattage);

      return result(
        "Solar panel estimate",
        [
          card("System size", `${fixed(systemKw)} kW`),
          card("Panels needed", `${panels}`),
          card("Annual production", `${count(annualKwh)} kWh`),
        ],
        [
          moneyBar("Monthly bill", values.monthlyBill, values.currency, 2),
          plainBar("Monthly usage", monthlyKwh, `${count(monthlyKwh)} kWh`),
          plainBar("System size", systemKw, `${fixed(systemKw)} kW`),
        ],
        [],
        [note("Panel wattage", `${values.panelWattage} W panels`)],
      );
    },
  };
}

function makeBtuConfig() {
  return {
    title: "BTU Calculator",
    actionLabel: "Calculate BTU",
    emptyState: "Estimate cooling BTU needs from room size and climate conditions.",
    summaryLabel: "BTU estimate",
    defaultHistoryLabel: "BTU scenario",
    defaults: { roomLength: 18, roomWidth: 14, roomHeight: 9, climate: "moderate" },
    mainFields: [
      numberField("roomLength", "Room length (ft)", 1, 200, 0.1),
      numberField("roomWidth", "Room width (ft)", 1, 200, 0.1),
      numberField("roomHeight", "Room height (ft)", 1, 20, 0.1),
      { name: "climate", label: "Climate", type: "select", options: BTU_CLIMATE_OPTIONS },
    ],
    advancedFields: [],
    validate(values) {
      return values.roomLength <= 0 || values.roomWidth <= 0 ? "Enter room dimensions." : "";
    },
    compute(values) {
      const area = values.roomLength * values.roomWidth;
      const baseBtu = area * 20;
      const volumeAdjustment = Math.max(0, (values.roomHeight - 8) * area * 1.5);
      const climateMultiplier = values.climate === "hot" ? 1.15 : values.climate === "cool" ? 0.92 : 1;
      const totalBtu = (baseBtu + volumeAdjustment) * climateMultiplier;

      return result(
        "BTU estimate",
        [
          card("Recommended BTU", `${count(totalBtu)} BTU/hr`),
          card("Room area", `${count(area)} sq ft`),
        ],
        [
          plainBar("Base BTU", baseBtu, `${count(baseBtu)} BTU/hr`),
          plainBar("Height adjustment", volumeAdjustment, `${count(volumeAdjustment)} BTU/hr`),
          plainBar("Recommended BTU", totalBtu, `${count(totalBtu)} BTU/hr`),
        ],
        [],
        [note("Climate", BTU_CLIMATE_OPTIONS.find((item) => item.value === values.climate)?.label || "Moderate climate")],
      );
    },
  };
}

function makeProgramMortgageConfig({
  title,
  actionLabel,
  emptyState,
  summaryLabel,
  upfrontRate,
  annualInsuranceRate,
  annualRateFieldLabel,
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
      moneyField("homePrice", "Home price", 100),
      moneyField("downPayment", "Down payment", 100),
      percentField("annualRate", annualRateFieldLabel, 0, 20, 0.1),
      numberField("years", "Loan term (years)", 1, 40, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.homePrice <= values.downPayment ? "Home price must be higher than the down payment." : "";
    },
    compute(values) {
      const basePrincipal = values.homePrice - values.downPayment;
      const financedFee = basePrincipal * (upfrontRate / 100);
      const financedPrincipal = basePrincipal + financedFee;
      const basePayment = getAmortizedPayment(financedPrincipal, values.annualRate, values.years * 12);
      const monthlyInsurance = financedPrincipal * (annualInsuranceRate / 100) / 12;
      const totalPayment = basePayment + monthlyInsurance;

      return result(
        `${title} estimate`,
        [
          card("Monthly payment", moneyText(totalPayment, values.currency, 2)),
          card("Financed fee", moneyText(financedFee, values.currency, 2)),
          card("Base loan", moneyText(financedPrincipal, values.currency, 2)),
        ],
        [
          moneyBar("Base principal", basePrincipal, values.currency, 2),
          moneyBar("Financed fee", financedFee, values.currency, 2),
          moneyBar("Monthly principal + interest", basePayment, values.currency, 2),
          moneyBar("Monthly insurance", monthlyInsurance, values.currency, 2),
        ],
        [],
        [
          note("Upfront fee", percent(upfrontRate)),
          note("Annual insurance", annualInsuranceRate > 0 ? percent(annualInsuranceRate) : "None"),
        ],
      );
    },
  };
}

function buildMultiValueStatsConfig({ title, actionLabel, emptyState, summaryLabel, defaultHistoryLabel, defaults, compute }) {
  return {
    title,
    actionLabel,
    emptyState,
    summaryLabel,
    defaultHistoryLabel,
    defaults,
    mainFields: [
      numberField("value1", "Value 1", -1000000, 1000000, 0.001),
      numberField("value2", "Value 2", -1000000, 1000000, 0.001),
      numberField("value3", "Value 3", -1000000, 1000000, 0.001),
      numberField("value4", "Value 4", -1000000, 1000000, 0.001),
      numberField("value5", "Value 5", -1000000, 1000000, 0.001),
      numberField("value6", "Value 6", -1000000, 1000000, 0.001),
    ],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const valuesList = [values.value1, values.value2, values.value3, values.value4, values.value5, values.value6];
      const output = compute(valuesList);

      return result(
        `${title} result`,
        output.summaryCards,
        output.breakdown,
        [],
        [note("Values used", valuesList.map((value) => fixed(value)).join(", "))],
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

function formatClock(totalMinutes) {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function factorial(value) {
  let output = 1;
  for (let index = 2; index <= value; index += 1) {
    output *= index;
  }
  return output;
}

function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function simplifyFraction(numerator, denominator) {
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return {
    numerator: sign * numerator / divisor,
    denominator: Math.abs(denominator) / divisor,
  };
}

function calculateFractionOperation(first, second, operation) {
  switch (operation) {
    case "subtract":
      return simplifyFraction(first.numerator * second.denominator - second.numerator * first.denominator, first.denominator * second.denominator);
    case "multiply":
      return simplifyFraction(first.numerator * second.numerator, first.denominator * second.denominator);
    case "divide":
      return simplifyFraction(first.numerator * second.denominator, first.denominator * second.numerator);
    case "add":
    default:
      return simplifyFraction(first.numerator * second.denominator + second.numerator * first.denominator, first.denominator * second.denominator);
  }
}

function mixedToImproper(whole, numerator, denominator) {
  const sign = whole < 0 ? -1 : 1;
  const absoluteWhole = Math.abs(whole);
  return simplifyFraction(sign * (absoluteWhole * denominator + numerator), denominator);
}

function improperToMixed(numerator, denominator) {
  const sign = numerator < 0 ? -1 : 1;
  const absoluteNumerator = Math.abs(numerator);
  const whole = Math.floor(absoluteNumerator / denominator);
  const remainder = absoluteNumerator % denominator;
  return { whole: whole * sign, numerator: remainder, denominator };
}

function formatMixed({ whole, numerator, denominator }) {
  if (numerator === 0) return `${whole}`;
  if (whole === 0) return `${numerator}/${denominator}`;
  return `${whole} ${numerator}/${denominator}`;
}

function getMode(values) {
  const counts = new Map();
  values.forEach((value) => {
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  const highest = Math.max(...counts.values());
  if (highest <= 1) return [];
  return [...counts.entries()].filter(([, countValue]) => countValue === highest).map(([value]) => fixed(value));
}

function getCreditValues(values) {
  return [1, 2, 3, 4, 5]
    .map((index) => ({
      gradePoints: values[`gradePoints${index}`],
      credits: values[`credits${index}`],
    }))
    .filter((item) => item.credits > 0);
}

function getMetValue(activity) {
  switch (activity) {
    case "walking":
      return 3.8;
    case "cycling":
      return 7.5;
    case "running":
      return 9.8;
    case "strength":
      return 6;
    case "swimming":
      return 8.3;
    default:
      return 6;
  }
}

function getAmortizedPayment(principal, annualRate, months) {
  const ratePerMonth = annualRate / 100 / 12;
  if (ratePerMonth === 0) return principal / Math.max(months, 1);
  return (principal * ratePerMonth) / (1 - Math.pow(1 + ratePerMonth, -months));
}

function buildBiweeklyPayoff(principal, annualRate, biweeklyPayment) {
  const monthlyEquivalent = getAmortizedPayment(principal, annualRate, 30 * 12);
  const standardTotalInterest = monthlyEquivalent * 30 * 12 - principal;
  const ratePerPeriod = annualRate / 100 / 26;
  let balance = principal;
  let periods = 0;
  let totalInterest = 0;

  while (balance > 0.01 && periods < 2600) {
    periods += 1;
    const interest = balance * ratePerPeriod;
    const principalPaid = Math.min(balance, biweeklyPayment - interest);
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
  }

  return {
    years: periods / 26,
    interestSaved: Math.max(0, standardTotalInterest - totalInterest),
  };
}
