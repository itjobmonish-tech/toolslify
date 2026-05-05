import { clamp } from "./utils.js";
import { TRAFFIC_CALCULATOR_CONFIGS } from "./calculator-traffic-expansion.js";

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "EUR", label: "EUR (€)" },
];

const COMPOUND_OPTIONS = [
  { value: "12", label: "Monthly" },
  { value: "4", label: "Quarterly" },
  { value: "1", label: "Yearly" },
  { value: "365", label: "Daily" },
];

const SEX_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

const DIRECTION_OPTIONS = [
  { value: "future", label: "Future date" },
  { value: "past", label: "Past date" },
];

const DENSITY_OPTIONS = [
  { value: "1", label: "Water" },
  { value: "0.92", label: "Oil" },
  { value: "0.6", label: "Flour" },
  { value: "0.85", label: "Sugar" },
  { value: "0.95", label: "Butter" },
];

const SCIENTIFIC_OPERATION_OPTIONS = [
  { value: "add", label: "Add" },
  { value: "subtract", label: "Subtract" },
  { value: "multiply", label: "Multiply" },
  { value: "divide", label: "Divide" },
  { value: "power", label: "Power" },
  { value: "root", label: "Nth root" },
  { value: "sin", label: "Sine" },
  { value: "cos", label: "Cosine" },
  { value: "tan", label: "Tangent" },
  { value: "log", label: "Log base 10" },
  { value: "ln", label: "Natural log" },
];

const FRACTION_OPERATION_OPTIONS = [
  { value: "add", label: "Add" },
  { value: "subtract", label: "Subtract" },
  { value: "multiply", label: "Multiply" },
  { value: "divide", label: "Divide" },
];

const NUMBER_LIST_FIELDS = ["value1", "value2", "value3", "value4", "value5", "value6"];

const WATER_CLIMATE_OPTIONS = [
  { value: "1", label: "Temperate" },
  { value: "1.1", label: "Warm" },
  { value: "1.2", label: "Hot / humid" },
];

const CALORIE_ACTIVITY_OPTIONS = [
  { value: "3.5", label: "Walking" },
  { value: "6", label: "Cycling" },
  { value: "7", label: "Jogging" },
  { value: "8", label: "Strength training" },
  { value: "10", label: "Running" },
];

const BTU_INSULATION_OPTIONS = [
  { value: "1.12", label: "Poor insulation" },
  { value: "1", label: "Average insulation" },
  { value: "0.9", label: "Good insulation" },
];

const BTU_CLIMATE_OPTIONS = [
  { value: "0.95", label: "Cool climate" },
  { value: "1", label: "Average climate" },
  { value: "1.08", label: "Hot climate" },
];

const COOKING_UNIT_FACTORS = {
  teaspoon: 4.92892,
  tablespoon: 14.7868,
  cup: 236.588,
  ml: 1,
  ounce: 29.5735,
  pint: 473.176,
  quart: 946.353,
};

const LENGTH_FACTORS = {
  millimeter: 0.001,
  centimeter: 0.01,
  meter: 1,
  kilometer: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
};

const AREA_FACTORS = {
  "square-meter": 1,
  "square-foot": 0.092903,
  acre: 4046.8564224,
  hectare: 10000,
  "square-yard": 0.836127,
};

const WEIGHT_FACTORS = {
  milligram: 0.001,
  gram: 1,
  kilogram: 1000,
  ounce: 28.3495,
  pound: 453.59237,
  stone: 6350.29318,
  ton: 907184.74,
};

const VOLUME_FACTORS = {
  milliliter: 1,
  liter: 1000,
  cup: 236.588,
  tablespoon: 14.7868,
  teaspoon: 4.92892,
  gallon: 3785.411784,
  ounce: 29.5735,
  pint: 473.176473,
  quart: 946.352946,
  "cubic-foot": 28316.8466,
  "cubic-yard": 764554.858,
};

const TIME_FACTORS = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2629800,
  year: 31557600,
};

const ENERGY_FACTORS = {
  joule: 1,
  kilojoule: 1000,
  calorie: 4.184,
  kilowattHour: 3600000,
  btu: 1055.06,
};

const POWER_FACTORS = {
  watt: 1,
  kilowatt: 1000,
  horsepower: 745.7,
};

const PRESSURE_FACTORS = {
  pascal: 1,
  kilopascal: 1000,
  bar: 100000,
  psi: 6894.757,
  atm: 101325,
};

const VELOCITY_FACTORS = {
  "meter-per-second": 1,
  "kilometer-per-hour": 0.277778,
  mph: 0.44704,
  knot: 0.514444,
};

const ACCELERATION_FACTORS = {
  "meter-per-second-squared": 1,
  g: 9.80665,
  "foot-per-second-squared": 0.3048,
};

const DATA_STORAGE_FACTORS = {
  byte: 1,
  kilobyte: 1024,
  megabyte: 1048576,
  gigabyte: 1073741824,
  terabyte: 1099511627776,
};

const SIMPLE_PAIR_CONVERTERS = [
  { slug: "grams-to-pounds", title: "Grams to Pounds", fromUnit: "g", toUnit: "lb", factor: 1 / 453.59237 },
  { slug: "kilos-to-pounds", title: "Kilos to Pounds", fromUnit: "kg", toUnit: "lb", factor: 2.20462262 },
  { slug: "stone-to-pounds", title: "Stone to Pounds", fromUnit: "st", toUnit: "lb", factor: 14 },
  { slug: "centimeters-to-inches", title: "Centimeters to Inches", fromUnit: "cm", toUnit: "in", factor: 0.393700787 },
  { slug: "feet-to-inches", title: "Feet to Inches", fromUnit: "ft", toUnit: "in", factor: 12 },
  { slug: "feet-to-meters", title: "Feet to Meters", fromUnit: "ft", toUnit: "m", factor: 0.3048 },
  { slug: "gallons-to-ounces", title: "Gallons to Ounces", fromUnit: "gal", toUnit: "fl oz", factor: 128 },
  { slug: "inch-pounds-to-ft-lb", title: "Inch-pounds to ft-lb", fromUnit: "in-lb", toUnit: "ft-lb", factor: 1 / 12 },
  { slug: "inches-to-centimeters", title: "Inches to Centimeters", fromUnit: "in", toUnit: "cm", factor: 2.54 },
  { slug: "inches-to-feet", title: "Inches to Feet", fromUnit: "in", toUnit: "ft", factor: 1 / 12 },
  { slug: "liters-to-gallons", title: "Liters to Gallons", fromUnit: "L", toUnit: "gal", factor: 0.264172052 },
  { slug: "liters-to-ounces", title: "Liters to Ounces", fromUnit: "L", toUnit: "fl oz", factor: 33.8140227 },
  { slug: "millimeters-to-inches", title: "Millimeters to Inches", fromUnit: "mm", toUnit: "in", factor: 0.0393700787 },
  { slug: "newton-meters-to-ft-lb", title: "Newton-Meters to ft lb", fromUnit: "N·m", toUnit: "ft-lb", factor: 0.737562149 },
  { slug: "square-feet-to-acres", title: "Square Feet to Acres", fromUnit: "sq ft", toUnit: "acre", factor: 1 / 43560 },
  { slug: "square-meters-to-square-feet", title: "Square Meters to Square Feet", fromUnit: "sq m", toUnit: "sq ft", factor: 10.7639104 },
  { slug: "kilojoules-to-calories", title: "Kilojoules to Calories", fromUnit: "kJ", toUnit: "kcal", factor: 0.239005736 },
  { slug: "cups-to-ml", title: "Cups to mL", fromUnit: "cup", toUnit: "mL", factor: 236.588 },
  { slug: "cups-to-ounces", title: "Cups to Ounces", fromUnit: "cup", toUnit: "oz", factor: 8 },
  { slug: "cups-to-tablespoons", title: "Cups to Tablespoons", fromUnit: "cup", toUnit: "tbsp", factor: 16 },
  { slug: "grams-to-ounces", title: "Grams to Ounces", fromUnit: "g", toUnit: "oz", factor: 0.0352739619 },
  { slug: "grams-to-tablespoons", title: "Grams to Tablespoons", fromUnit: "g", toUnit: "tbsp", factor: 1 / 14.7868 },
  { slug: "grams-to-teaspoons", title: "Grams to Teaspoons", fromUnit: "g", toUnit: "tsp", factor: 1 / 4.92892 },
  { slug: "ounces-to-grams", title: "Ounces to Grams", fromUnit: "oz", toUnit: "g", factor: 28.3495231 },
  { slug: "ounces-to-ml", title: "Ounces to mL", fromUnit: "oz", toUnit: "mL", factor: 29.5735 },
  { slug: "pints-to-cups", title: "Pints to Cups", fromUnit: "pt", toUnit: "cup", factor: 2 },
  { slug: "quarts-to-cups", title: "Quarts to Cups", fromUnit: "qt", toUnit: "cup", factor: 4 },
  { slug: "tablespoons-to-teaspoons", title: "Tablespoons to Teaspoons", fromUnit: "tbsp", toUnit: "tsp", factor: 3 },
  { slug: "teaspoons-to-ml", title: "Teaspoons to mL", fromUnit: "tsp", toUnit: "mL", factor: 4.92892 },
];

export const EXPANDED_CALCULATOR_CONFIGS = {
  ...buildFinanceConfigs(),
  ...buildEverydayConfigs(),
  ...buildHealthConfigs(),
  ...buildCookingConfigs(),
  ...buildFamilyConverterConfigs(),
  ...buildPairConverterConfigs(),
  ...TRAFFIC_CALCULATOR_CONFIGS,
  ...buildGrowthCalculatorConfigs(),
};

function buildGrowthCalculatorConfigs() {
  return {
    "gpa-calculator": makeGpaCalculatorConfig(),
    "grade-calculator": makeGradeCalculatorConfig(),
    "scientific-calculator": makeScientificCalculatorConfig(),
    "fraction-calculator": makeFractionCalculatorConfig(),
    "mixed-number-calculator": makeMixedNumberCalculatorConfig(),
    "fraction-to-decimal-calculator": makeFractionToDecimalCalculatorConfig(),
    "decimal-to-percent-calculator": makeDecimalToPercentCalculatorConfig(),
    "percentage-off-calculator": makePercentageOffCalculatorConfig(),
    "discount-calculator": makeDiscountCalculatorConfig(),
    "tip-calculator": makeTipCalculatorConfig(),
    "average-calculator": makeAverageCalculatorConfig(),
    "mean-median-mode-calculator": makeMeanMedianModeCalculatorConfig(),
    "standard-deviation-calculator": makeStandardDeviationCalculatorConfig(),
    "time-calculator": makeTimeCalculatorConfig(),
    "time-duration-calculator": makeTimeDurationCalculatorConfig(),
    "hours-calculator": makeHoursCalculatorConfig(),
    "work-hours-calculator": makeWorkHoursCalculatorConfig(),
    "sleep-calculator": makeSleepCalculatorConfig(),
    "water-intake-calculator": makeWaterIntakeCalculatorConfig(),
    "calories-burned-calculator": makeCaloriesBurnedCalculatorConfig(),
    "waist-to-height-ratio-calculator": makeWaistToHeightRatioConfig(),
    "pregnancy-due-date-calculator": makePregnancyDueDateCalculatorConfig(),
    "conception-date-calculator": makeConceptionDateCalculatorConfig(),
    "bac-calculator": makeBacCalculatorConfig(),
    "rent-affordability-calculator": makeRentAffordabilityCalculatorConfig(),
    "budget-calculator": makeBudgetCalculatorConfig(),
    "net-worth-calculator": makeNetWorthCalculatorConfig(),
    "dividend-calculator": makeDividendCalculatorConfig(),
    "roi-calculator": makeRoiCalculatorConfig(),
    "break-even-calculator": makeBreakEvenCalculatorConfig(),
    "markup-calculator": makeMarkupCalculatorConfig(),
    "auto-lease-calculator": makeAutoLeaseCalculatorConfig(),
    "mortgage-recast-calculator": makeMortgageRecastCalculatorConfig(),
    "biweekly-mortgage-calculator": makeBiweeklyMortgageCalculatorConfig(),
    "interest-only-mortgage-calculator": makeInterestOnlyMortgageCalculatorConfig(),
    "va-loan-calculator": makeGovernmentLoanCalculatorConfig({
      title: "VA Loan Calculator",
      fundingFeeRate: 2.15,
      annualFeeRate: 0,
      defaults: { loanAmount: 360000, annualRate: 6.35, years: 30, downPayment: 0, currency: "USD" },
      feeLabel: "Funding fee",
    }),
    "fha-loan-calculator": makeGovernmentLoanCalculatorConfig({
      title: "FHA Loan Calculator",
      fundingFeeRate: 1.75,
      annualFeeRate: 0.55,
      defaults: { loanAmount: 320000, annualRate: 6.2, years: 30, downPayment: 12000, currency: "USD" },
      feeLabel: "Upfront MIP",
    }),
    "usda-loan-calculator": makeGovernmentLoanCalculatorConfig({
      title: "USDA Loan Calculator",
      fundingFeeRate: 1,
      annualFeeRate: 0.35,
      defaults: { loanAmount: 280000, annualRate: 6.15, years: 30, downPayment: 0, currency: "USD" },
      feeLabel: "Guarantee fee",
    }),
    "solar-panel-calculator": makeSolarPanelCalculatorConfig(),
    "btu-calculator": makeBtuCalculatorConfig(),
  };
}

function buildFinanceConfigs() {
  return {
    "compound-interest-calculator": makeCompoundGrowthConfig({ title: "Compound Interest Calculator" }),
    "loan-calculator": makeLoanProjectionConfig({ title: "Loan Calculator", actionLabel: "Calculate loan" }),
    "compound-interest-daily": makeCompoundGrowthConfig({ title: "Compound Interest (Daily)", defaultCompoundsPerYear: 365 }),
    "compound-interest-formula": makeCompoundGrowthConfig({ title: "Compound Interest Formula", summaryLabel: "Compound formula result" }),
    "amortization-calculator": makeLoanProjectionConfig({ title: "Amortization Calculator", summaryLabel: "Amortization schedule" }),
    "apy-calculator": makeApyConfig(),
    "cagr-calculator": makeCagrConfig(),
    "car-loan-calculator": makeLoanProjectionConfig({ title: "Car Loan Calculator", defaults: { loanAmount: 28500, annualRate: 6.2, years: 5, extraPayment: 0, currency: "USD" } }),
    "cash-back-calculator": makeCashBackConfig(),
    "future-value-calculator": makeFutureValueConfig(),
    "how-long-to-save": makeHowLongToSaveConfig(),
    "how-long-will-money-last": makeHowLongWillMoneyLastConfig(),
    "interest-rate-calculator": makeInterestRateConfig(),
    "investment-calculator": makeCompoundGrowthConfig({ title: "Investment Calculator", defaults: { principal: 10000, recurringContribution: 250, annualRate: 8, years: 10, compoundsPerYear: "12", currency: "USD" } }),
    "loan-payoff-calculator": makeLoanProjectionConfig({ title: "Loan Payoff Calculator", actionLabel: "Calculate payoff" }),
    "margin-calculator": makeMarginConfig(),
    "million-to-billion-converter": makeMillionToBillionConfig(),
    "money-counter": makeMoneyCounterConfig(),
    "price-per-square-foot": makePricePerSquareFootConfig(),
    "savings-calculator": makeCompoundGrowthConfig({ title: "Savings Calculator", defaults: { principal: 5000, recurringContribution: 150, annualRate: 4.5, years: 6, compoundsPerYear: "12", currency: "USD" } }),
    "savings-goal-calculator": makeSavingsGoalConfig(),
    "simple-interest-calculator": makeSimpleInterestConfig(),
    "sip-calculator": makeCompoundGrowthConfig({ title: "SIP Calculator", actionLabel: "Plan wealth", defaults: { principal: 0, recurringContribution: 500, annualRate: 11, years: 12, compoundsPerYear: "12", currency: "USD" } }),
    "stock-average-calculator": makeStockAverageConfig(),
    "time-and-a-half-calculator": makeTimeAndHalfConfig(),
  };
}

function buildEverydayConfigs() {
  return {
    "square-footage-calculator": makeSquareFootageConfig(),
    "percentage-calculator": makePercentageConfig(),
    "age-calculator": makeAgeConfig(),
    "age-difference-calculator": makeAgeDifferenceConfig(),
    "asphalt-calculator": makeMaterialVolumeConfig({ title: "Asphalt Calculator", densityLabel: "Tons / cubic yard", densityDefault: 1.45 }),
    "birthday-calculator": makeBirthdayConfig(),
    "cbm-calculator": makeCbmConfig(),
    "cubic-feet-calculator": makeVolumeShapeConfig({ title: "Cubic Feet Calculator", unit: "ft", resultUnit: "cubic feet", factor: 1 }),
    "cubic-yards-calculator": makeVolumeShapeConfig({ title: "Cubic Yards Calculator", unit: "ft", resultUnit: "cubic yards", factor: 1 / 27 }),
    "date-calculator": makeDateOffsetConfig(),
    "days-between-dates": makeDaysBetweenDatesConfig(),
    "days-from-today": makeDaysFromTodayConfig(),
    "decimal-to-fraction": makeDecimalToFractionConfig(),
    "electricity-cost-calculator": makeElectricityCostConfig(),
    "final-grade-calculator": makeFinalGradeConfig(),
    "gravel-calculator": makeMaterialVolumeConfig({ title: "Gravel Calculator", densityLabel: "Tons / cubic yard", densityDefault: 1.3 }),
    "how-much-flooring-do-i-need": makeFlooringConfig(),
    "led-savings-calculator": makeLedSavingsConfig(),
    "miles-per-kwh-calculator": makeMilesPerKwhConfig(),
    "mpge-calculator": makeMpgeConfig(),
    "mulch-calculator": makeMaterialVolumeConfig({ title: "Mulch Calculator", densityLabel: "Cubic yards needed", densityDefault: 1 }),
    "percentage-change": makePercentageChangeConfig(),
    "roman-numerals": makeRomanNumeralConfig(),
    "sig-figs-calculator": makeSigFigsConfig(),
  };
}

function buildHealthConfigs() {
  return {
    "steps-to-miles-calculator": makeStepsToDistanceConfig({ title: "Steps to Miles Calculator", mode: "miles" }),
    "pregnancy-calculator": makePregnancyConfig(),
    "bmi-calculator": makeBmiConfig(),
    "bmr-calculator": makeBmrConfig(),
    "how-many-steps-in-a-mile": makeStepsPerMileConfig(),
    "miles-to-steps-calculator": makeMilesToStepsConfig(),
    "steps-to-calories": makeStepsToCaloriesConfig(),
    "steps-to-km-calculator": makeStepsToDistanceConfig({ title: "Steps to Km Calculator", mode: "kilometers" }),
    "whr-calculator": makeWhrConfig(),
  };
}

function buildCookingConfigs() {
  return {
    "cooking-converter": makeFamilyConverterConfig({
      title: "Cooking Converter",
      actionLabel: "Convert recipe value",
      emptyState: "Convert common recipe measures like cups, tablespoons, teaspoons, ounces, and milliliters.",
      summaryLabel: "Cooking conversion",
      defaultHistoryLabel: "Cooking conversion",
      units: {
        teaspoon: { label: "Teaspoon", factor: COOKING_UNIT_FACTORS.teaspoon },
        tablespoon: { label: "Tablespoon", factor: COOKING_UNIT_FACTORS.tablespoon },
        cup: { label: "Cup", factor: COOKING_UNIT_FACTORS.cup },
        ml: { label: "Milliliter", factor: COOKING_UNIT_FACTORS.ml },
        ounce: { label: "Fluid ounce", factor: COOKING_UNIT_FACTORS.ounce },
        pint: { label: "Pint", factor: COOKING_UNIT_FACTORS.pint },
        quart: { label: "Quart", factor: COOKING_UNIT_FACTORS.quart },
      },
      fromUnit: "cup",
      toUnit: "ml",
      precision: 3,
    }),
    "cups-to-grams": makeDensityConverterConfig({ title: "Cups to Grams", fromLabel: "Cups", toLabel: "Grams", mode: "volume-to-weight" }),
    "air-fryer-converter": makeAirFryerConverterConfig(),
    "butter-converter": makeButterConverterConfig(),
    "grams-to-cups": makeDensityConverterConfig({ title: "Grams to Cups", fromLabel: "Grams", toLabel: "Cups", mode: "weight-to-volume" }),
    "ml-to-grams": makeDensityConverterConfig({ title: "mL to Grams", fromLabel: "mL", toLabel: "Grams", mode: "volume-to-weight", baseField: "ml" }),
    "oven-temperatures": makeOvenTemperatureConfig(),
    "pounds-and-cups": makeDensityConverterConfig({ title: "Pounds and Cups", fromLabel: "Pounds", toLabel: "Cups", mode: "weight-to-volume", baseField: "pounds" }),
    "teaspoons-to-grams": makeDensityConverterConfig({ title: "Teaspoons to Grams", fromLabel: "Teaspoons", toLabel: "Grams", mode: "volume-to-weight", baseField: "teaspoons" }),
  };
}

function buildFamilyConverterConfigs() {
  return {
    "area-converter": makeFamilyConverterConfig({
      title: "Area Converter",
      actionLabel: "Convert area",
      emptyState: "Convert area values across the most common property and land units.",
      summaryLabel: "Area conversion",
      defaultHistoryLabel: "Area conversion",
      units: buildUnitMap(AREA_FACTORS, {
        "square-meter": "Square meter",
        "square-foot": "Square foot",
        acre: "Acre",
        hectare: "Hectare",
        "square-yard": "Square yard",
      }),
      fromUnit: "square-meter",
      toUnit: "square-foot",
    }),
    "height-converter": makeFamilyConverterConfig({
      title: "Height Converter",
      actionLabel: "Convert height",
      emptyState: "Convert between metric and imperial height measurements quickly.",
      summaryLabel: "Height conversion",
      defaultHistoryLabel: "Height conversion",
      units: buildUnitMap(LENGTH_FACTORS, {
        centimeter: "Centimeter",
        meter: "Meter",
        inch: "Inch",
        foot: "Foot",
      }),
      fromUnit: "centimeter",
      toUnit: "foot",
    }),
    "acceleration-converter": makeFamilyConverterConfig({
      title: "Acceleration Converter",
      actionLabel: "Convert acceleration",
      emptyState: "Convert acceleration values between SI, g-force, and imperial units.",
      summaryLabel: "Acceleration conversion",
      defaultHistoryLabel: "Acceleration conversion",
      units: buildUnitMap(ACCELERATION_FACTORS, {
        "meter-per-second-squared": "m/s²",
        g: "g-force",
        "foot-per-second-squared": "ft/s²",
      }),
      fromUnit: "meter-per-second-squared",
      toUnit: "g",
    }),
    "data-storage-converter": makeFamilyConverterConfig({
      title: "Data Storage Converter",
      actionLabel: "Convert storage",
      emptyState: "Convert data values across bytes, kilobytes, megabytes, gigabytes, and terabytes.",
      summaryLabel: "Storage conversion",
      defaultHistoryLabel: "Storage conversion",
      units: buildUnitMap(DATA_STORAGE_FACTORS, {
        byte: "Byte",
        kilobyte: "KB",
        megabyte: "MB",
        gigabyte: "GB",
        terabyte: "TB",
      }),
      fromUnit: "megabyte",
      toUnit: "gigabyte",
      precision: 6,
    }),
    "energy-converter": makeFamilyConverterConfig({
      title: "Energy Converter",
      actionLabel: "Convert energy",
      emptyState: "Convert energy values across joules, kilojoules, calories, and kilowatt hours.",
      summaryLabel: "Energy conversion",
      defaultHistoryLabel: "Energy conversion",
      units: buildUnitMap(ENERGY_FACTORS, {
        joule: "Joule",
        kilojoule: "Kilojoule",
        calorie: "Calorie",
        kilowattHour: "kWh",
        btu: "BTU",
      }),
      fromUnit: "kilojoule",
      toUnit: "calorie",
    }),
    "fuel-economy-calculator": makeFuelEconomyConfig(),
    "length-and-distance": makeFamilyConverterConfig({
      title: "Length and Distance",
      actionLabel: "Convert length",
      emptyState: "Convert metric and imperial distance units in one clean calculator.",
      summaryLabel: "Length conversion",
      defaultHistoryLabel: "Length conversion",
      units: buildUnitMap(LENGTH_FACTORS, {
        millimeter: "Millimeter",
        centimeter: "Centimeter",
        meter: "Meter",
        kilometer: "Kilometer",
        inch: "Inch",
        foot: "Foot",
        yard: "Yard",
        mile: "Mile",
      }),
      fromUnit: "meter",
      toUnit: "foot",
    }),
    "mass-and-weight-converter": makeFamilyConverterConfig({
      title: "Mass & Weight Converter",
      actionLabel: "Convert weight",
      emptyState: "Convert weight values across metric and imperial measures.",
      summaryLabel: "Weight conversion",
      defaultHistoryLabel: "Weight conversion",
      units: buildUnitMap(WEIGHT_FACTORS, {
        milligram: "Milligram",
        gram: "Gram",
        kilogram: "Kilogram",
        ounce: "Ounce",
        pound: "Pound",
        stone: "Stone",
        ton: "US ton",
      }),
      fromUnit: "kilogram",
      toUnit: "pound",
    }),
    "power-converter": makeFamilyConverterConfig({
      title: "Power Converter",
      actionLabel: "Convert power",
      emptyState: "Convert power across watts, kilowatts, and horsepower.",
      summaryLabel: "Power conversion",
      defaultHistoryLabel: "Power conversion",
      units: buildUnitMap(POWER_FACTORS, {
        watt: "Watt",
        kilowatt: "Kilowatt",
        horsepower: "Horsepower",
      }),
      fromUnit: "watt",
      toUnit: "kilowatt",
    }),
    "pressure-converter": makeFamilyConverterConfig({
      title: "Pressure Converter",
      actionLabel: "Convert pressure",
      emptyState: "Convert pressure values between pascal, bar, psi, and atmosphere units.",
      summaryLabel: "Pressure conversion",
      defaultHistoryLabel: "Pressure conversion",
      units: buildUnitMap(PRESSURE_FACTORS, {
        pascal: "Pascal",
        kilopascal: "Kilopascal",
        bar: "Bar",
        psi: "PSI",
        atm: "Atmosphere",
      }),
      fromUnit: "kilopascal",
      toUnit: "psi",
    }),
    "time-converter": makeFamilyConverterConfig({
      title: "Time Converter",
      actionLabel: "Convert time",
      emptyState: "Convert seconds, minutes, hours, days, weeks, months, and years quickly.",
      summaryLabel: "Time conversion",
      defaultHistoryLabel: "Time conversion",
      units: buildUnitMap(TIME_FACTORS, {
        second: "Second",
        minute: "Minute",
        hour: "Hour",
        day: "Day",
        week: "Week",
        month: "Month",
        year: "Year",
      }),
      fromUnit: "hour",
      toUnit: "day",
      precision: 6,
    }),
    "velocity-converter": makeFamilyConverterConfig({
      title: "Velocity Converter",
      actionLabel: "Convert speed",
      emptyState: "Convert speed values between meters per second, kilometers per hour, miles per hour, and knots.",
      summaryLabel: "Velocity conversion",
      defaultHistoryLabel: "Velocity conversion",
      units: buildUnitMap(VELOCITY_FACTORS, {
        "meter-per-second": "m/s",
        "kilometer-per-hour": "km/h",
        mph: "mph",
        knot: "knot",
      }),
      fromUnit: "kilometer-per-hour",
      toUnit: "mph",
    }),
    "volume-converter": makeFamilyConverterConfig({
      title: "Volume Converter",
      actionLabel: "Convert volume",
      emptyState: "Convert recipe, liquid, and bulk volume values across common units.",
      summaryLabel: "Volume conversion",
      defaultHistoryLabel: "Volume conversion",
      units: buildUnitMap(VOLUME_FACTORS, {
        milliliter: "Milliliter",
        liter: "Liter",
        cup: "Cup",
        tablespoon: "Tablespoon",
        teaspoon: "Teaspoon",
        gallon: "Gallon",
        ounce: "Fluid ounce",
        pint: "Pint",
        quart: "Quart",
        "cubic-foot": "Cubic foot",
        "cubic-yard": "Cubic yard",
      }),
      fromUnit: "liter",
      toUnit: "gallon",
    }),
    "water-weight-calculator": makeWaterWeightConfig(),
    "weight-converter": makeFamilyConverterConfig({
      title: "Weight Converter",
      actionLabel: "Convert weight",
      emptyState: "Convert grams, kilos, pounds, stones, and ounces quickly.",
      summaryLabel: "Weight conversion",
      defaultHistoryLabel: "Weight conversion",
      units: buildUnitMap(WEIGHT_FACTORS, {
        gram: "Gram",
        kilogram: "Kilogram",
        ounce: "Ounce",
        pound: "Pound",
        stone: "Stone",
      }),
      fromUnit: "pound",
      toUnit: "kilogram",
    }),
    "weight-to-volume": makeWeightToVolumeConfig(),
  };
}

function buildPairConverterConfigs() {
  const base = Object.fromEntries(
    SIMPLE_PAIR_CONVERTERS.map((entry) => [
      entry.slug,
      makePairConverterConfig(entry),
    ]),
  );

  return {
    ...base,
    "kilos-to-stone-and-pounds": makeKilosToStoneConfig(),
    "centimeters-to-feet-and-inches": makeCentimetersToFeetConfig(),
    "cubic-yards-to-tons": makeCubicYardsToTonsConfig(),
    "gallons-to-pounds": makeGallonsToPoundsConfig(),
    "hertz-to-seconds": makeHertzToSecondsConfig(),
    "ounces-and-pounds": makeOuncesAndPoundsConfig(),
    "square-feet-to-cubic-feet": makeSquareFeetToVolumeConfig({ title: "Square Feet to Cubic Feet", factor: 1, unitLabel: "cubic feet" }),
    "square-feet-to-cubic-yards": makeSquareFeetToVolumeConfig({ title: "Square Feet to Cubic Yards", factor: 1 / 27, unitLabel: "cubic yards" }),
    "watts-to-amps": makeWattsToAmpsConfig(),
  };
}

function makeCompoundGrowthConfig({
  title,
  actionLabel = "Calculate growth",
  summaryLabel = "Growth projection",
  defaultCompoundsPerYear = 12,
  defaults = { principal: 2334, recurringContribution: 232, annualRate: 3, years: 3.2, compoundsPerYear: "12", currency: "USD" },
} = {}) {
  const mergedDefaults = {
    ...defaults,
    compoundsPerYear: String(defaults.compoundsPerYear || defaultCompoundsPerYear),
  };

  return {
    title,
    actionLabel,
    emptyState: "Enter the starting balance, rate, contribution, and time horizon to project growth.",
    summaryLabel,
    defaultHistoryLabel: `${title} scenario`,
    defaults: mergedDefaults,
    mainFields: [
      moneyField("principal", "Initial balance", 10),
      moneyField("recurringContribution", "Regular contribution", 10),
      percentField("annualRate", "Annual rate of return", 0, 100, 0.1),
      numberField("years", "Years", 0.1, 50, 0.1),
    ],
    advancedFields: [
      { name: "compoundsPerYear", label: "Compounding", type: "select", options: COMPOUND_OPTIONS },
      currencyField(),
    ],
    validate(values) {
      return values.principal < 0 || values.recurringContribution < 0 ? "Use zero or positive amounts." : "";
    },
    compute(values) {
      const compoundsPerYear = Number(values.compoundsPerYear || 12) || 12;
      const monthlyRate = Math.pow(1 + values.annualRate / 100 / compoundsPerYear, compoundsPerYear / 12) - 1;
      const totalMonths = Math.max(1, Math.round(values.years * 12));
      let balance = values.principal;
      let totalDeposits = values.principal;
      let accrued = 0;
      const rows = [
        {
          cells: [
            "0",
            moneyText(values.principal, values.currency, 2),
            "—",
            moneyText(values.principal, values.currency, 2),
            "—",
            moneyText(values.principal, values.currency, 2),
          ],
          tone: "summary",
        },
      ];

      for (let month = 1; month <= totalMonths; month += 1) {
        const earnings = balance * monthlyRate;
        balance += earnings + values.recurringContribution;
        totalDeposits += values.recurringContribution;
        accrued = balance - totalDeposits;
        rows.push({
          cells: [
            String(month),
            moneyText(values.recurringContribution, values.currency, 2),
            moneyText(earnings, values.currency, 2),
            moneyText(totalDeposits, values.currency, 2),
            moneyText(accrued, values.currency, 2),
            moneyText(balance, values.currency, 2),
          ],
          tone: month === totalMonths ? "highlight" : "default",
        });
      }

      const durationLabel = `${Math.floor(totalMonths / 12)} years and ${totalMonths % 12} months`;
      return result(
        `Calculation for ${durationLabel}`,
        [
          card("Future investment value", moneyText(balance, values.currency, 2)),
          card("Additional deposits", moneyText(totalDeposits - values.principal, values.currency, 2)),
          card("Wealth gain", moneyText(accrued, values.currency, 2)),
          card("Percentage (yearly)", percent(values.annualRate)),
          card("Initial balance", moneyText(values.principal, values.currency, 2)),
          card("Time-weighted return", percent((accrued / Math.max(totalDeposits, 1)) * 100)),
        ],
        [
          moneyBar("Initial balance", values.principal, values.currency, 2),
          moneyBar("Additional deposits", totalDeposits - values.principal, values.currency, 2),
          moneyBar("Accrued earnings", accrued, values.currency, 2),
          moneyBar("Balance", balance, values.currency, 2),
        ],
        [],
        [
          note("Compounding", COMPOUND_OPTIONS.find((option) => option.value === String(values.compoundsPerYear))?.label || "Monthly"),
          note("Duration", durationLabel),
          note("Monthly contribution", moneyText(values.recurringContribution, values.currency, 2)),
        ],
        {
          table: {
            title: "Monthly breakdown",
            headers: ["Month", "Deposits", "Earnings", "Total deposits", "Accrued earnings", "Balance"],
            rows,
            footnote: "Contributions are applied at the end of each month after earnings are estimated for the current balance.",
          },
        },
      );
    },
  };
}

function makeLoanProjectionConfig({
  title,
  actionLabel = "Calculate payments",
  summaryLabel = "Loan projection",
  defaults = { loanAmount: 250000, annualRate: 6.5, years: 30, extraPayment: 0, currency: "USD" },
} = {}) {
  return {
    title,
    categorySlug: "finance",
    actionLabel,
    emptyState: "Add principal, rate, years, and any extra payment to estimate the repayment schedule.",
    summaryLabel,
    defaultHistoryLabel: `${title} scenario`,
    defaults,
    mainFields: [
      moneyField("loanAmount", "Loan amount", 100),
      percentField("annualRate", "Interest rate", 0, 100, 0.1),
      numberField("years", "Years", 1, 40, 1),
      moneyField("extraPayment", "Extra payment", 10),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.loanAmount <= 0 ? "Enter a loan amount." : "";
    },
    compute(values) {
      const ratePerMonth = values.annualRate / 100 / 12;
      const totalMonths = Math.max(1, Math.round(values.years * 12));
      const basePayment = ratePerMonth === 0
        ? values.loanAmount / totalMonths
        : (values.loanAmount * ratePerMonth) / (1 - Math.pow(1 + ratePerMonth, -totalMonths));
      const payment = basePayment + values.extraPayment;
      let balance = values.loanAmount;
      let totalInterest = 0;
      const rows = [];
      let month = 0;

      while (balance > 0.01 && month < 600) {
        month += 1;
        const interest = balance * ratePerMonth;
        const principal = Math.min(balance, payment - interest);
        const actualPayment = principal + interest;
        balance = Math.max(0, balance - principal);
        totalInterest += interest;
        rows.push({
          cells: [
            String(month),
            moneyText(actualPayment, values.currency, 2),
            moneyText(principal, values.currency, 2),
            moneyText(interest, values.currency, 2),
            moneyText(balance, values.currency, 2),
          ],
          tone: balance <= 0.01 ? "highlight" : "default",
        });
      }

      const totalPaid = values.loanAmount + totalInterest;
      return result(
        "Loan payment result",
        [
          card("Monthly payment", moneyText(payment, values.currency, 2)),
          card("Total interest", moneyText(totalInterest, values.currency, 2)),
          card("Total paid", moneyText(totalPaid, values.currency, 2)),
          card("Payoff time", `${month} months`),
        ],
        [
          moneyBar("Loan amount", values.loanAmount, values.currency, 2),
          moneyBar("Total interest", totalInterest, values.currency, 2),
          moneyBar("Total paid", totalPaid, values.currency, 2),
        ],
        [],
        [
          note("Interest rate", percent(values.annualRate)),
          note("Extra payment", moneyText(values.extraPayment, values.currency, 2)),
          note("Schedule length", `${month} months`),
        ],
        {
          table: {
            title: "Repayment schedule",
            headers: ["Month", "Payment", "Principal", "Interest", "Balance"],
            rows,
            footnote: "The schedule assumes a fixed interest rate and a constant monthly payment through the payoff period.",
          },
        },
      );
    },
  };
}

function makeApyConfig() {
  return {
    title: "APY Calculator",
    actionLabel: "Calculate APY",
    emptyState: "Add the nominal rate and compounding frequency to convert APR into APY.",
    summaryLabel: "APY result",
    defaultHistoryLabel: "APY scenario",
    defaults: { nominalRate: 5.25, compoundsPerYear: "12" },
    mainFields: [percentField("nominalRate", "APR / nominal rate", 0, 100, 0.1)],
    advancedFields: [{ name: "compoundsPerYear", label: "Compounding", type: "select", options: COMPOUND_OPTIONS }],
    validate() {
      return "";
    },
    compute(values) {
      const n = Number(values.compoundsPerYear || 12) || 12;
      const apy = (Math.pow(1 + values.nominalRate / 100 / n, n) - 1) * 100;
      return result("Annual percentage yield", [
        card("APY", percent(apy)),
        card("APR", percent(values.nominalRate)),
      ], [
        plainBar("APR", values.nominalRate, percent(values.nominalRate)),
        plainBar("APY", apy, percent(apy)),
      ], [], [
        note("Compounding", COMPOUND_OPTIONS.find((option) => option.value === String(values.compoundsPerYear))?.label || "Monthly"),
      ]);
    },
  };
}

function makeCagrConfig() {
  return {
    title: "CAGR Calculator",
    actionLabel: "Calculate CAGR",
    emptyState: "Compare a beginning value and ending value over a time period to estimate annual growth.",
    summaryLabel: "CAGR result",
    defaultHistoryLabel: "CAGR scenario",
    defaults: { startValue: 15000, endValue: 24150, years: 4, currency: "USD" },
    mainFields: [moneyField("startValue", "Beginning value", 10), moneyField("endValue", "Ending value", 10), numberField("years", "Years", 0.1, 50, 0.1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.startValue <= 0 || values.endValue <= 0 ? "Use positive values for both start and end." : "";
    },
    compute(values) {
      const cagr = (Math.pow(values.endValue / values.startValue, 1 / Math.max(values.years, 0.1)) - 1) * 100;
      return result("Annual growth rate estimate", [
        card("CAGR", percent(cagr)),
        card("Value change", moneyText(values.endValue - values.startValue, values.currency, 2)),
      ], [
        moneyBar("Beginning value", values.startValue, values.currency, 2),
        moneyBar("Ending value", values.endValue, values.currency, 2),
      ], [], [
        note("Years", `${fixed(values.years)} years`),
        note("Currency", values.currency),
      ]);
    },
  };
}

function makeCashBackConfig() {
  return {
    title: "Cash Back Calculator",
    categorySlug: "finance",
    actionLabel: "Calculate cash back",
    emptyState: "Estimate yearly rewards after your purchase volume, cash back rate, and annual fee.",
    summaryLabel: "Cash back result",
    defaultHistoryLabel: "Cash back scenario",
    defaults: { annualSpend: 12000, rewardRate: 2, annualFee: 95, currency: "USD" },
    mainFields: [moneyField("annualSpend", "Annual spend", 100), percentField("rewardRate", "Cash back rate", 0, 25, 0.1), moneyField("annualFee", "Annual fee", 5)],
    advancedFields: [currencyField()],
    validate() {
      return "";
    },
    compute(values) {
      const rewards = values.annualSpend * (values.rewardRate / 100);
      const net = rewards - values.annualFee;
      return result("Cash back estimate", [
        card("Gross rewards", moneyText(rewards, values.currency, 2)),
        card("Net reward", moneyText(net, values.currency, 2)),
        card("Effective rate", percent((net / Math.max(values.annualSpend, 1)) * 100)),
      ], [
        moneyBar("Annual spend", values.annualSpend, values.currency, 2),
        moneyBar("Rewards earned", rewards, values.currency, 2),
        moneyBar("Annual fee", values.annualFee, values.currency, 2),
        moneyBar("Net reward", net, values.currency, 2),
      ], [], [
        note("Cash back rate", percent(values.rewardRate)),
      ]);
    },
  };
}

function makeFutureValueConfig() {
  return makeCompoundGrowthConfig({
    title: "Future Value Calculator",
    categorySlug: "finance",
    actionLabel: "Calculate future value",
    summaryLabel: "Future value result",
    defaults: { principal: 15000, recurringContribution: 0, annualRate: 7, years: 8, compoundsPerYear: "12", currency: "USD" },
  });
}

function makeHowLongToSaveConfig() {
  return {
    title: "How Long to Save",
    actionLabel: "Estimate time to goal",
    emptyState: "Estimate how many months it takes to reach your target with regular contributions.",
    summaryLabel: "Savings horizon",
    defaultHistoryLabel: "Savings horizon",
    defaults: { currentBalance: 4000, monthlyContribution: 350, goalAmount: 25000, annualRate: 5.5, currency: "USD" },
    mainFields: [moneyField("currentBalance", "Current balance", 10), moneyField("monthlyContribution", "Monthly contribution", 10), moneyField("goalAmount", "Goal amount", 50), percentField("annualRate", "Annual rate", 0, 50, 0.1)],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.goalAmount <= values.currentBalance) return "Set a goal higher than the current balance.";
      return values.monthlyContribution <= 0 ? "Add a monthly contribution." : "";
    },
    compute(values) {
      const monthlyRate = values.annualRate / 100 / 12;
      let balance = values.currentBalance;
      let month = 0;
      const rows = [];
      while (balance < values.goalAmount && month < 1200) {
        month += 1;
        balance = balance * (1 + monthlyRate) + values.monthlyContribution;
        if (month % 12 === 0 || balance >= values.goalAmount) {
          rows.push({
            cells: [String(month), moneyText(balance, values.currency, 2)],
            tone: balance >= values.goalAmount ? "highlight" : "default",
          });
        }
      }
      return result("Time to reach the savings goal", [
        card("Months needed", `${month}`),
        card("Years needed", fixed(month / 12)),
        card("Projected balance", moneyText(balance, values.currency, 2)),
      ], [
        moneyBar("Current balance", values.currentBalance, values.currency, 2),
        moneyBar("Goal amount", values.goalAmount, values.currency, 2),
        moneyBar("Monthly contribution", values.monthlyContribution, values.currency, 2),
      ], [], [
        note("Annual rate", percent(values.annualRate)),
      ], {
        table: {
          title: "Goal checkpoints",
          headers: ["Month", "Projected balance"],
          rows,
          footnote: "Balances are estimated with a constant monthly contribution and a fixed annual growth assumption.",
        },
      });
    },
  };
}

function makeHowLongWillMoneyLastConfig() {
  return {
    title: "How Long Will Money Last",
    categorySlug: "finance",
    actionLabel: "Estimate runway",
    emptyState: "Estimate how long a balance will last with a fixed monthly withdrawal.",
    summaryLabel: "Money runway",
    defaultHistoryLabel: "Money runway",
    defaults: { startingBalance: 120000, monthlyWithdrawal: 2500, annualRate: 4, currency: "USD" },
    mainFields: [moneyField("startingBalance", "Starting balance", 100), moneyField("monthlyWithdrawal", "Monthly withdrawal", 10), percentField("annualRate", "Annual growth", 0, 25, 0.1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.monthlyWithdrawal <= 0 ? "Enter a monthly withdrawal." : "";
    },
    compute(values) {
      const monthlyRate = values.annualRate / 100 / 12;
      let balance = values.startingBalance;
      let month = 0;
      const rows = [];
      while (balance > 0 && month < 1200) {
        month += 1;
        balance = balance * (1 + monthlyRate) - values.monthlyWithdrawal;
        if (month % 12 === 0 || balance <= 0) {
          rows.push({
            cells: [String(month), moneyText(Math.max(balance, 0), values.currency, 2)],
            tone: balance <= 0 ? "highlight" : "default",
          });
        }
      }
      return result("Estimated time until the balance runs out", [
        card("Months covered", `${month}`),
        card("Years covered", fixed(month / 12)),
        card("Monthly withdrawal", moneyText(values.monthlyWithdrawal, values.currency, 2)),
      ], [
        moneyBar("Starting balance", values.startingBalance, values.currency, 2),
        moneyBar("Monthly withdrawal", values.monthlyWithdrawal, values.currency, 2),
      ], [], [
        note("Annual growth", percent(values.annualRate)),
      ], {
        table: {
          title: "Balance over time",
          headers: ["Month", "Remaining balance"],
          rows,
          footnote: "This estimate assumes a constant withdrawal and a stable growth rate every month.",
        },
      });
    },
  };
}

function makeInterestRateConfig() {
  return {
    title: "Interest Rate Calculator",
    actionLabel: "Calculate rate",
    emptyState: "Estimate the annualized rate from a starting value, ending value, and time period.",
    summaryLabel: "Interest rate result",
    defaultHistoryLabel: "Interest rate scenario",
    defaults: { startValue: 5000, endValue: 6200, years: 2.5 },
    mainFields: [numberField("startValue", "Starting amount", 1, 100000000, 1), numberField("endValue", "Ending amount", 1, 100000000, 1), numberField("years", "Years", 0.1, 50, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.startValue <= 0 || values.endValue <= 0 ? "Use positive values for both amounts." : "";
    },
    compute(values) {
      const rate = (Math.pow(values.endValue / values.startValue, 1 / Math.max(values.years, 0.1)) - 1) * 100;
      return result("Annualized rate estimate", [
        card("Annual rate", percent(rate)),
        card("Growth multiple", `${fixed(values.endValue / values.startValue)}x`),
      ], [
        plainBar("Starting amount", values.startValue, plain(values.startValue)),
        plainBar("Ending amount", values.endValue, plain(values.endValue)),
      ], [], [
        note("Years", `${fixed(values.years)} years`),
      ]);
    },
  };
}

function makeMarginConfig() {
  return {
    title: "Margin Calculator",
    actionLabel: "Calculate margin",
    emptyState: "Estimate gross profit, margin, and markup from revenue and cost.",
    summaryLabel: "Margin result",
    defaultHistoryLabel: "Margin scenario",
    defaults: { revenue: 5000, cost: 3100, currency: "USD" },
    mainFields: [moneyField("revenue", "Revenue", 100), moneyField("cost", "Cost", 100)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.revenue <= 0 ? "Enter revenue first." : "";
    },
    compute(values) {
      const profit = values.revenue - values.cost;
      const margin = (profit / Math.max(values.revenue, 1)) * 100;
      const markup = (profit / Math.max(values.cost, 1)) * 100;
      return result("Gross margin result", [
        card("Profit", moneyText(profit, values.currency, 2)),
        card("Margin", percent(margin)),
        card("Markup", percent(markup)),
      ], [
        moneyBar("Revenue", values.revenue, values.currency, 2),
        moneyBar("Cost", values.cost, values.currency, 2),
        moneyBar("Profit", profit, values.currency, 2),
      ], [], [
        note("Currency", values.currency),
      ]);
    },
  };
}

function makeMillionToBillionConfig() {
  return {
    title: "Million to Billion Converter",
    actionLabel: "Convert amount",
    emptyState: "Convert a number in millions into billions and other large-number views.",
    summaryLabel: "Scale conversion",
    defaultHistoryLabel: "Million to billion conversion",
    defaults: { millions: 1250 },
    mainFields: [numberField("millions", "Millions", 0, 1000000000, 1)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const billions = values.millions / 1000;
      return result("Million to billion conversion", [
        card("Billions", fixed(billions)),
        card("Millions", count(values.millions)),
      ], [
        plainBar("Millions", values.millions, `${count(values.millions)} million`),
        plainBar("Billions", billions, `${fixed(billions)} billion`),
      ], [], []);
    },
  };
}

function makeMoneyCounterConfig() {
  return {
    title: "Money Counter",
    actionLabel: "Count money",
    emptyState: "Add bill and coin quantities to total a cash drawer quickly.",
    summaryLabel: "Cash total",
    defaultHistoryLabel: "Money counter",
    defaults: { hundreds: 4, twenties: 12, tens: 8, fives: 10, ones: 17, quarters: 20, dimes: 14, nickels: 8, pennies: 34, currency: "USD" },
    mainFields: [
      numberField("hundreds", "$100 bills", 0, 10000),
      numberField("twenties", "$20 bills", 0, 10000),
      numberField("tens", "$10 bills", 0, 10000),
      numberField("fives", "$5 bills", 0, 10000),
      numberField("ones", "$1 bills", 0, 10000),
      numberField("quarters", "Quarters", 0, 10000),
      numberField("dimes", "Dimes", 0, 10000),
      numberField("nickels", "Nickels", 0, 10000),
      numberField("pennies", "Pennies", 0, 10000),
    ],
    advancedFields: [currencyField()],
    validate() {
      return "";
    },
    compute(values) {
      const bills = values.hundreds * 100 + values.twenties * 20 + values.tens * 10 + values.fives * 5 + values.ones;
      const coins = values.quarters * 0.25 + values.dimes * 0.1 + values.nickels * 0.05 + values.pennies * 0.01;
      const total = bills + coins;
      return result("Counted cash result", [
        card("Total cash", moneyText(total, values.currency, 2)),
        card("Bills", moneyText(bills, values.currency, 2)),
        card("Coins", moneyText(coins, values.currency, 2)),
      ], [
        moneyBar("$100 bills", values.hundreds * 100, values.currency, 2),
        moneyBar("$20 bills", values.twenties * 20, values.currency, 2),
        moneyBar("Bills total", bills, values.currency, 2),
        moneyBar("Coins total", coins, values.currency, 2),
      ], [], [
        note("Currency", values.currency),
      ]);
    },
  };
}

function makePricePerSquareFootConfig() {
  return {
    title: "Price Per Square Foot",
    actionLabel: "Calculate price / sq ft",
    emptyState: "Estimate the unit price from a total property price and floor area.",
    summaryLabel: "Price per square foot",
    defaultHistoryLabel: "Price per square foot",
    defaults: { price: 385000, area: 1750, currency: "USD" },
    mainFields: [moneyField("price", "Total price", 100), numberField("area", "Area (sq ft)", 1, 100000, 1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.area <= 0 ? "Enter an area greater than zero." : "";
    },
    compute(values) {
      const unit = values.price / Math.max(values.area, 1);
      return result("Unit property price", [
        card("Price / sq ft", moneyText(unit, values.currency, 2)),
        card("Total area", `${count(values.area)} sq ft`),
      ], [
        moneyBar("Total price", values.price, values.currency, 2),
        plainBar("Area", values.area, `${count(values.area)} sq ft`),
      ], [], [
        note("Currency", values.currency),
      ]);
    },
  };
}

function makeSavingsGoalConfig() {
  return {
    title: "Savings Goal Calculator",
    actionLabel: "Calculate goal plan",
    emptyState: "Estimate the monthly contribution required to reach a savings goal on time.",
    summaryLabel: "Savings goal result",
    defaultHistoryLabel: "Savings goal scenario",
    defaults: { currentBalance: 5000, goalAmount: 40000, years: 5, annualRate: 4.5, currency: "USD" },
    mainFields: [moneyField("currentBalance", "Current balance", 10), moneyField("goalAmount", "Goal amount", 100), numberField("years", "Years to goal", 0.1, 50, 0.1), percentField("annualRate", "Annual rate", 0, 25, 0.1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.goalAmount <= values.currentBalance ? "Use a goal above the current balance." : "";
    },
    compute(values) {
      const months = Math.max(1, Math.round(values.years * 12));
      const monthlyRate = values.annualRate / 100 / 12;
      const futureCurrent = values.currentBalance * Math.pow(1 + monthlyRate, months);
      const contribution = monthlyRate === 0
        ? (values.goalAmount - values.currentBalance) / months
        : (values.goalAmount - futureCurrent) * (monthlyRate / (Math.pow(1 + monthlyRate, months) - 1));
      return result("Monthly contribution required", [
        card("Monthly contribution", moneyText(contribution, values.currency, 2)),
        card("Goal amount", moneyText(values.goalAmount, values.currency, 2)),
        card("Time horizon", `${months} months`),
      ], [
        moneyBar("Current balance", values.currentBalance, values.currency, 2),
        moneyBar("Goal amount", values.goalAmount, values.currency, 2),
      ], [], [
        note("Annual rate", percent(values.annualRate)),
      ]);
    },
  };
}

function makeSimpleInterestConfig() {
  return {
    title: "Simple Interest Calculator",
    actionLabel: "Calculate interest",
    emptyState: "Estimate simple interest from principal, rate, and time.",
    summaryLabel: "Simple interest result",
    defaultHistoryLabel: "Simple interest scenario",
    defaults: { principal: 10000, annualRate: 5.5, years: 3, currency: "USD" },
    mainFields: [moneyField("principal", "Principal", 100), percentField("annualRate", "Annual rate", 0, 100, 0.1), numberField("years", "Years", 0.1, 50, 0.1)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.principal <= 0 ? "Enter a principal amount." : "";
    },
    compute(values) {
      const interest = values.principal * (values.annualRate / 100) * values.years;
      const total = values.principal + interest;
      return result("Simple interest result", [
        card("Interest earned", moneyText(interest, values.currency, 2)),
        card("Total value", moneyText(total, values.currency, 2)),
      ], [
        moneyBar("Principal", values.principal, values.currency, 2),
        moneyBar("Interest", interest, values.currency, 2),
        moneyBar("Total value", total, values.currency, 2),
      ], [], [
        note("Years", `${fixed(values.years)} years`),
      ]);
    },
  };
}

function makeStockAverageConfig() {
  return {
    title: "Stock Average Calculator",
    actionLabel: "Calculate average price",
    emptyState: "Average two stock purchase lots into one cost basis.",
    summaryLabel: "Average cost result",
    defaultHistoryLabel: "Stock average scenario",
    defaults: { sharesOne: 25, priceOne: 118, sharesTwo: 20, priceTwo: 102, currency: "USD" },
    mainFields: [numberField("sharesOne", "Shares lot 1", 1, 100000, 1), moneyField("priceOne", "Price lot 1", 0.01), numberField("sharesTwo", "Shares lot 2", 1, 100000, 1), moneyField("priceTwo", "Price lot 2", 0.01)],
    advancedFields: [currencyField()],
    validate() {
      return "";
    },
    compute(values) {
      const totalShares = values.sharesOne + values.sharesTwo;
      const totalCost = values.sharesOne * values.priceOne + values.sharesTwo * values.priceTwo;
      const avgPrice = totalCost / Math.max(totalShares, 1);
      return result("Average stock cost basis", [
        card("Average price", moneyText(avgPrice, values.currency, 2)),
        card("Total shares", count(totalShares)),
        card("Total cost", moneyText(totalCost, values.currency, 2)),
      ], [
        plainBar("Total shares", totalShares, count(totalShares)),
        moneyBar("Total cost", totalCost, values.currency, 2),
        moneyBar("Average price", avgPrice, values.currency, 2),
      ], [], [
        note("Currency", values.currency),
      ]);
    },
  };
}

function makeTimeAndHalfConfig() {
  return {
    title: "Time and a Half Calculator",
    categorySlug: "salary-data",
    actionLabel: "Calculate overtime",
    emptyState: "Estimate time-and-a-half pay from your base hourly rate and overtime hours.",
    summaryLabel: "Time and a half result",
    defaultHistoryLabel: "Time and a half scenario",
    defaults: { hourlyRate: 30, overtimeHours: 8, currency: "USD" },
    mainFields: [moneyField("hourlyRate", "Base hourly rate", 1), numberField("overtimeHours", "Overtime hours", 0, 200, 0.25)],
    advancedFields: [currencyField()],
    validate(values) {
      return values.hourlyRate <= 0 ? "Enter an hourly rate." : "";
    },
    compute(values) {
      const overtimeRate = values.hourlyRate * 1.5;
      const overtimePay = overtimeRate * values.overtimeHours;
      return result("Time-and-a-half pay", [
        card("Overtime rate", moneyText(overtimeRate, values.currency, 2)),
        card("Overtime pay", moneyText(overtimePay, values.currency, 2)),
      ], [
        moneyBar("Base rate", values.hourlyRate, values.currency, 2),
        moneyBar("Overtime rate", overtimeRate, values.currency, 2),
        moneyBar("Overtime pay", overtimePay, values.currency, 2),
      ], [], [
        note("Overtime hours", `${fixed(values.overtimeHours)} hrs`),
      ]);
    },
  };
}

function makeSquareFootageConfig() {
  return {
    title: "Square Footage Calculator",
    actionLabel: "Calculate area",
    emptyState: "Estimate the square footage of a room or rectangle from length and width.",
    summaryLabel: "Square footage result",
    defaultHistoryLabel: "Square footage scenario",
    defaults: { length: 18, width: 14, rooms: 1 },
    mainFields: [numberField("length", "Length (ft)", 0.1, 100000, 0.1), numberField("width", "Width (ft)", 0.1, 100000, 0.1), numberField("rooms", "Number of rooms", 1, 1000, 1)],
    advancedFields: [],
    validate(values) {
      return values.length <= 0 || values.width <= 0 ? "Enter a positive length and width." : "";
    },
    compute(values) {
      const area = values.length * values.width * values.rooms;
      const squareMeters = area / 10.7639104;
      return result("Measured floor area", [
        card("Square feet", `${fixed(area)} sq ft`),
        card("Square meters", `${fixed(squareMeters)} sq m`),
      ], [
        plainBar("Length", values.length, `${fixed(values.length)} ft`),
        plainBar("Width", values.width, `${fixed(values.width)} ft`),
        plainBar("Rooms", values.rooms, `${count(values.rooms)}`),
      ], [], []);
    },
  };
}

function makePercentageConfig() {
  return {
    title: "Percentage Calculator",
    actionLabel: "Calculate percentage",
    emptyState: "Calculate what percentage one value is of another.",
    summaryLabel: "Percentage result",
    defaultHistoryLabel: "Percentage scenario",
    defaults: { part: 45, whole: 180 },
    mainFields: [numberField("part", "Value / part", -100000000, 100000000, 0.01), numberField("whole", "Whole / total", -100000000, 100000000, 0.01)],
    advancedFields: [],
    validate(values) {
      return values.whole === 0 ? "The whole value cannot be zero." : "";
    },
    compute(values) {
      const percentage = (values.part / values.whole) * 100;
      return result("Percentage calculation", [
        card("Percentage", percent(percentage)),
        card("Part", plain(values.part)),
        card("Whole", plain(values.whole)),
      ], [
        plainBar("Part", values.part, plain(values.part)),
        plainBar("Whole", values.whole, plain(values.whole)),
      ], [], []);
    },
  };
}

function makePercentageChangeConfig() {
  return {
    title: "Percentage Change",
    actionLabel: "Calculate change",
    emptyState: "Compare an original value and a new value to calculate percentage change.",
    summaryLabel: "Change result",
    defaultHistoryLabel: "Percentage change scenario",
    defaults: { originalValue: 80, newValue: 96 },
    mainFields: [numberField("originalValue", "Original value", -100000000, 100000000, 0.01), numberField("newValue", "New value", -100000000, 100000000, 0.01)],
    advancedFields: [],
    validate(values) {
      return values.originalValue === 0 ? "Original value cannot be zero." : "";
    },
    compute(values) {
      const change = values.newValue - values.originalValue;
      const pct = (change / values.originalValue) * 100;
      return result("Percentage change result", [
        card("Change", plain(change)),
        card("Percentage change", percent(pct)),
      ], [
        plainBar("Original value", values.originalValue, plain(values.originalValue)),
        plainBar("New value", values.newValue, plain(values.newValue)),
      ], [], []);
    },
  };
}

function makeAgeConfig() {
  return {
    title: "Age Calculator",
    actionLabel: "Calculate age",
    emptyState: "Add a birth date to calculate age in years, months, and days.",
    summaryLabel: "Age result",
    defaultHistoryLabel: "Age scenario",
    defaults: { birthDate: "1994-09-16", compareDate: todayString() },
    mainFields: [dateField("birthDate", "Birth date"), dateField("compareDate", "As of date")],
    advancedFields: [],
    validate(values) {
      return !values.birthDate || !values.compareDate ? "Choose both dates." : "";
    },
    compute(values) {
      const diff = getCalendarDifference(new Date(values.birthDate), new Date(values.compareDate));
      return result("Age as of the selected date", [
        card("Years", `${diff.years}`),
        card("Months", `${diff.months}`),
        card("Days", `${diff.days}`),
      ], [
        plainBar("Birth date", 0, formatDate(values.birthDate)),
        plainBar("As of date", 0, formatDate(values.compareDate)),
      ], [], [
        note("Total days", count(diff.totalDays)),
      ]);
    },
  };
}

function makeAgeDifferenceConfig() {
  return {
    title: "Age Difference Calculator",
    actionLabel: "Calculate difference",
    emptyState: "Compare two dates of birth to see the age gap.",
    summaryLabel: "Age difference result",
    defaultHistoryLabel: "Age difference scenario",
    defaults: { firstDate: "1990-01-01", secondDate: "1996-08-18" },
    mainFields: [dateField("firstDate", "First date"), dateField("secondDate", "Second date")],
    advancedFields: [],
    validate(values) {
      return !values.firstDate || !values.secondDate ? "Choose both dates." : "";
    },
    compute(values) {
      const first = new Date(values.firstDate);
      const second = new Date(values.secondDate);
      const earlier = first <= second ? first : second;
      const later = first <= second ? second : first;
      const diff = getCalendarDifference(earlier, later);
      return result("Age difference between both dates", [
        card("Years apart", `${diff.years}`),
        card("Months apart", `${diff.months}`),
        card("Days apart", `${diff.days}`),
      ], [
        plainBar("Earlier date", 0, formatDate(earlier)),
        plainBar("Later date", 0, formatDate(later)),
      ], [], [
        note("Total days", count(diff.totalDays)),
      ]);
    },
  };
}

function makeBirthdayConfig() {
  return {
    title: "Birthday Calculator",
    actionLabel: "Find next birthday",
    emptyState: "Estimate the next birthday date and how many days remain.",
    summaryLabel: "Birthday result",
    defaultHistoryLabel: "Birthday scenario",
    defaults: { birthDate: "1993-11-05" },
    mainFields: [dateField("birthDate", "Birth date")],
    advancedFields: [],
    validate(values) {
      return !values.birthDate ? "Choose a birth date." : "";
    },
    compute(values) {
      const today = new Date(todayString());
      const birth = new Date(values.birthDate);
      const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
      const daysUntil = Math.ceil((nextBirthday - today) / 86400000);
      return result("Next birthday estimate", [
        card("Next birthday", formatDate(nextBirthday)),
        card("Days until", `${daysUntil}`),
      ], [
        plainBar("Birth date", 0, formatDate(values.birthDate)),
        plainBar("Next birthday", 0, formatDate(nextBirthday)),
      ], [], []);
    },
  };
}

function makeCbmConfig() {
  return {
    title: "CBM Calculator",
    actionLabel: "Calculate volume",
    emptyState: "Calculate cubic meters from package length, width, height, and quantity.",
    summaryLabel: "CBM result",
    defaultHistoryLabel: "CBM scenario",
    defaults: { length: 60, width: 40, height: 35, quantity: 8 },
    mainFields: [numberField("length", "Length (cm)", 0.1, 100000, 0.1), numberField("width", "Width (cm)", 0.1, 100000, 0.1), numberField("height", "Height (cm)", 0.1, 100000, 0.1), numberField("quantity", "Quantity", 1, 100000, 1)],
    advancedFields: [],
    validate(values) {
      return values.length <= 0 || values.width <= 0 || values.height <= 0 ? "Enter all package dimensions." : "";
    },
    compute(values) {
      const cubicMeters = (values.length * values.width * values.height * values.quantity) / 1000000;
      return result("Package volume estimate", [
        card("Total CBM", fixed(cubicMeters)),
        card("Quantity", count(values.quantity)),
      ], [
        plainBar("Length", values.length, `${fixed(values.length)} cm`),
        plainBar("Width", values.width, `${fixed(values.width)} cm`),
        plainBar("Height", values.height, `${fixed(values.height)} cm`),
      ], [], []);
    },
  };
}

function makeVolumeShapeConfig({ title, unit, resultUnit, factor }) {
  return {
    title,
    actionLabel: "Calculate volume",
    emptyState: "Estimate rectangular volume from length, width, and height.",
    summaryLabel: "Volume result",
    defaultHistoryLabel: `${title} scenario`,
    defaults: { length: 12, width: 10, height: 8 },
    mainFields: [numberField("length", `Length (${unit})`, 0.1, 100000, 0.1), numberField("width", `Width (${unit})`, 0.1, 100000, 0.1), numberField("height", `Height (${unit})`, 0.1, 100000, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.length <= 0 || values.width <= 0 || values.height <= 0 ? "Enter all dimensions." : "";
    },
    compute(values) {
      const rawVolume = values.length * values.width * values.height;
      const converted = rawVolume * factor;
      return result("Estimated volume", [
        card(resultUnit, fixed(converted)),
      ], [
        plainBar("Length", values.length, `${fixed(values.length)} ${unit}`),
        plainBar("Width", values.width, `${fixed(values.width)} ${unit}`),
        plainBar("Height", values.height, `${fixed(values.height)} ${unit}`),
      ], [], []);
    },
  };
}

function makeDateOffsetConfig() {
  return {
    title: "Date Calculator",
    actionLabel: "Calculate date",
    emptyState: "Add or subtract a number of days from a starting date.",
    summaryLabel: "Date result",
    defaultHistoryLabel: "Date offset scenario",
    defaults: { baseDate: todayString(), offsetDays: 30, direction: "future" },
    mainFields: [dateField("baseDate", "Base date"), numberField("offsetDays", "Days", 0, 50000, 1)],
    advancedFields: [{ name: "direction", label: "Direction", type: "select", options: DIRECTION_OPTIONS }],
    validate(values) {
      return !values.baseDate ? "Choose a base date." : "";
    },
    compute(values) {
      const target = new Date(values.baseDate);
      target.setDate(target.getDate() + (values.direction === "future" ? values.offsetDays : -values.offsetDays));
      return result("Calculated date", [
        card("Result date", formatDate(target)),
        card("Offset", `${values.offsetDays} days`),
      ], [
        plainBar("Base date", 0, formatDate(values.baseDate)),
        plainBar("Direction", 0, values.direction === "future" ? "Add days" : "Subtract days"),
      ], [], []);
    },
  };
}

function makeDaysBetweenDatesConfig() {
  return {
    title: "Days Between Dates",
    actionLabel: "Calculate days",
    emptyState: "Measure the number of days between two dates.",
    summaryLabel: "Days between result",
    defaultHistoryLabel: "Days between dates",
    defaults: { startDate: "2026-01-01", endDate: "2026-04-22" },
    mainFields: [dateField("startDate", "Start date"), dateField("endDate", "End date")],
    advancedFields: [],
    validate(values) {
      return !values.startDate || !values.endDate ? "Choose both dates." : "";
    },
    compute(values) {
      const diff = Math.round((new Date(values.endDate) - new Date(values.startDate)) / 86400000);
      return result("Days between the selected dates", [
        card("Days", `${diff}`),
      ], [
        plainBar("Start date", 0, formatDate(values.startDate)),
        plainBar("End date", 0, formatDate(values.endDate)),
      ], [], []);
    },
  };
}

function makeDaysFromTodayConfig() {
  return {
    title: "Days From Today",
    actionLabel: "Calculate date",
    emptyState: "Estimate the date that lands a number of days from today.",
    summaryLabel: "Days from today",
    defaultHistoryLabel: "Days from today",
    defaults: { days: 45, direction: "future" },
    mainFields: [numberField("days", "Days", 0, 50000, 1)],
    advancedFields: [{ name: "direction", label: "Direction", type: "select", options: DIRECTION_OPTIONS }],
    validate() {
      return "";
    },
    compute(values) {
      const today = new Date(todayString());
      const target = new Date(today);
      target.setDate(target.getDate() + (values.direction === "future" ? values.days : -values.days));
      return result("Date from today", [
        card("Result date", formatDate(target)),
        card("Days", `${values.days}`),
      ], [
        plainBar("Today", 0, formatDate(today)),
        plainBar("Direction", 0, values.direction === "future" ? "Forward" : "Backward"),
      ], [], []);
    },
  };
}

function makeDecimalToFractionConfig() {
  return {
    title: "Decimal to Fraction",
    actionLabel: "Convert decimal",
    emptyState: "Convert a decimal into a simplified fraction.",
    summaryLabel: "Fraction result",
    defaultHistoryLabel: "Decimal to fraction",
    defaults: { decimalValue: 0.625 },
    mainFields: [numberField("decimalValue", "Decimal value", -1000000, 1000000, 0.001)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const fraction = decimalToFraction(values.decimalValue);
      return result("Decimal converted to fraction", [
        card("Fraction", fraction),
        card("Decimal", fixed(values.decimalValue)),
      ], [
        plainBar("Decimal", values.decimalValue, fixed(values.decimalValue)),
        plainBar("Fraction", 0, fraction),
      ], [], []);
    },
  };
}

function makeElectricityCostConfig() {
  return {
    title: "Electricity Cost Calculator",
    actionLabel: "Calculate electricity cost",
    emptyState: "Estimate usage cost from wattage, daily hours, and electricity price.",
    summaryLabel: "Electricity cost",
    defaultHistoryLabel: "Electricity cost scenario",
    defaults: { watts: 850, hoursPerDay: 5, costPerKwh: 0.18, daysPerMonth: 30, currency: "USD" },
    mainFields: [numberField("watts", "Wattage", 1, 1000000, 1), numberField("hoursPerDay", "Hours / day", 0.1, 24, 0.1), moneyField("costPerKwh", "Cost / kWh", 0.01), numberField("daysPerMonth", "Days / month", 1, 31, 1)],
    advancedFields: [currencyField()],
    validate() {
      return "";
    },
    compute(values) {
      const dailyKwh = (values.watts * values.hoursPerDay) / 1000;
      const monthlyCost = dailyKwh * values.costPerKwh * values.daysPerMonth;
      return result("Estimated electricity spend", [
        card("Daily kWh", fixed(dailyKwh)),
        card("Monthly cost", moneyText(monthlyCost, values.currency, 2)),
      ], [
        plainBar("Wattage", values.watts, `${fixed(values.watts)} W`),
        plainBar("Hours / day", values.hoursPerDay, `${fixed(values.hoursPerDay)} hrs`),
        moneyBar("Monthly cost", monthlyCost, values.currency, 2),
      ], [], [
        note("Cost / kWh", moneyText(values.costPerKwh, values.currency, 2)),
      ]);
    },
  };
}

function makeFinalGradeConfig() {
  return {
    title: "Final Grade Calculator",
    actionLabel: "Calculate grade",
    emptyState: "Estimate the score needed on a final exam to reach a target course grade.",
    summaryLabel: "Grade target result",
    defaultHistoryLabel: "Final grade scenario",
    defaults: { currentGrade: 86, currentWeight: 80, targetGrade: 90, finalWeight: 20 },
    mainFields: [percentField("currentGrade", "Current grade", 0, 100, 0.1), percentField("currentWeight", "Current grade weight", 0, 100, 0.1), percentField("targetGrade", "Target final grade", 0, 100, 0.1), percentField("finalWeight", "Final exam weight", 0, 100, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.finalWeight <= 0 ? "Final exam weight must be greater than zero." : "";
    },
    compute(values) {
      const needed = (values.targetGrade - values.currentGrade * (values.currentWeight / 100)) / Math.max(values.finalWeight / 100, 0.0001);
      return result("Final exam score needed", [
        card("Required final score", percent(needed)),
        card("Target grade", percent(values.targetGrade)),
      ], [
        plainBar("Current grade", values.currentGrade, percent(values.currentGrade)),
        plainBar("Current weight", values.currentWeight, percent(values.currentWeight)),
        plainBar("Final weight", values.finalWeight, percent(values.finalWeight)),
      ], [], []);
    },
  };
}

function makeFlooringConfig() {
  return {
    title: "How Much Flooring do I Need?",
    actionLabel: "Calculate flooring",
    emptyState: "Estimate flooring coverage including waste allowance.",
    summaryLabel: "Flooring estimate",
    defaultHistoryLabel: "Flooring scenario",
    defaults: { length: 22, width: 16, wasteRate: 8 },
    mainFields: [numberField("length", "Length (ft)", 0.1, 100000, 0.1), numberField("width", "Width (ft)", 0.1, 100000, 0.1), percentField("wasteRate", "Waste allowance", 0, 50, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.length <= 0 || values.width <= 0 ? "Enter the room dimensions." : "";
    },
    compute(values) {
      const area = values.length * values.width;
      const needed = area * (1 + values.wasteRate / 100);
      return result("Flooring coverage needed", [
        card("Area", `${fixed(area)} sq ft`),
        card("With waste", `${fixed(needed)} sq ft`),
      ], [
        plainBar("Length", values.length, `${fixed(values.length)} ft`),
        plainBar("Width", values.width, `${fixed(values.width)} ft`),
        plainBar("Waste allowance", values.wasteRate, percent(values.wasteRate)),
      ], [], []);
    },
  };
}

function makeLedSavingsConfig() {
  return {
    title: "LED Savings Calculator",
    actionLabel: "Calculate savings",
    emptyState: "Compare old bulb energy use against an LED replacement.",
    summaryLabel: "LED savings",
    defaultHistoryLabel: "LED savings scenario",
    defaults: { oldWatts: 60, ledWatts: 9, hoursPerDay: 5, costPerKwh: 0.18, bulbs: 8, currency: "USD" },
    mainFields: [numberField("oldWatts", "Old bulb wattage", 1, 100000, 1), numberField("ledWatts", "LED wattage", 1, 100000, 1), numberField("hoursPerDay", "Hours / day", 0.1, 24, 0.1), moneyField("costPerKwh", "Cost / kWh", 0.01), numberField("bulbs", "Bulb count", 1, 10000, 1)],
    advancedFields: [currencyField()],
    validate() {
      return "";
    },
    compute(values) {
      const yearlyOld = (values.oldWatts * values.hoursPerDay * 365 * values.bulbs) / 1000;
      const yearlyLed = (values.ledWatts * values.hoursPerDay * 365 * values.bulbs) / 1000;
      const savings = (yearlyOld - yearlyLed) * values.costPerKwh;
      return result("Estimated yearly LED savings", [
        card("Yearly savings", moneyText(savings, values.currency, 2)),
        card("Old usage", `${fixed(yearlyOld)} kWh`),
        card("LED usage", `${fixed(yearlyLed)} kWh`),
      ], [
        plainBar("Bulbs", values.bulbs, count(values.bulbs)),
        moneyBar("Yearly savings", savings, values.currency, 2),
      ], [], []);
    },
  };
}

function makeMilesPerKwhConfig() {
  return {
    title: "Miles Per kWh Calculator",
    actionLabel: "Calculate efficiency",
    emptyState: "Estimate EV efficiency from miles driven and kilowatt hours used.",
    summaryLabel: "Efficiency result",
    defaultHistoryLabel: "Miles per kWh scenario",
    defaults: { miles: 180, kwh: 54 },
    mainFields: [numberField("miles", "Miles driven", 0.1, 1000000, 0.1), numberField("kwh", "kWh used", 0.1, 1000000, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.kwh <= 0 ? "Use a positive kWh value." : "";
    },
    compute(values) {
      const efficiency = values.miles / values.kwh;
      return result("Miles per kWh", [
        card("Efficiency", `${fixed(efficiency)} mi/kWh`),
      ], [
        plainBar("Miles", values.miles, `${fixed(values.miles)} mi`),
        plainBar("kWh", values.kwh, `${fixed(values.kwh)} kWh`),
      ], [], []);
    },
  };
}

function makeMpgeConfig() {
  return {
    title: "MPGe Calculator",
    actionLabel: "Calculate MPGe",
    emptyState: "Estimate miles per gallon equivalent from miles and electricity use.",
    summaryLabel: "MPGe result",
    defaultHistoryLabel: "MPGe scenario",
    defaults: { miles: 250, kwh: 72 },
    mainFields: [numberField("miles", "Miles driven", 0.1, 1000000, 0.1), numberField("kwh", "kWh used", 0.1, 1000000, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.kwh <= 0 ? "Use a positive kWh value." : "";
    },
    compute(values) {
      const gallonsEquivalent = values.kwh / 33.7;
      const mpge = values.miles / Math.max(gallonsEquivalent, 0.0001);
      return result("Miles per gallon equivalent", [
        card("MPGe", fixed(mpge)),
        card("Gallons equivalent", fixed(gallonsEquivalent)),
      ], [
        plainBar("Miles", values.miles, `${fixed(values.miles)} mi`),
        plainBar("kWh", values.kwh, `${fixed(values.kwh)} kWh`),
      ], [], []);
    },
  };
}

function makeMaterialVolumeConfig({ title, densityLabel, densityDefault }) {
  return {
    title,
    actionLabel: "Calculate material",
    emptyState: "Estimate required material volume from length, width, and depth.",
    summaryLabel: "Material estimate",
    defaultHistoryLabel: `${title} scenario`,
    defaults: { length: 20, width: 12, depth: 4, density: densityDefault },
    mainFields: [numberField("length", "Length (ft)", 0.1, 100000, 0.1), numberField("width", "Width (ft)", 0.1, 100000, 0.1), numberField("depth", "Depth (in)", 0.1, 10000, 0.1)],
    advancedFields: [numberField("density", densityLabel, 0.1, 10, 0.01)],
    validate(values) {
      return values.length <= 0 || values.width <= 0 || values.depth <= 0 ? "Enter all dimensions." : "";
    },
    compute(values) {
      const cubicFeet = values.length * values.width * (values.depth / 12);
      const cubicYards = cubicFeet / 27;
      const tons = cubicYards * values.density;
      return result("Estimated material requirement", [
        card("Cubic yards", fixed(cubicYards)),
        card("Estimated tons", fixed(tons)),
      ], [
        plainBar("Cubic feet", cubicFeet, `${fixed(cubicFeet)} cu ft`),
        plainBar("Cubic yards", cubicYards, `${fixed(cubicYards)} cu yd`),
        plainBar("Estimated tons", tons, `${fixed(tons)} tons`),
      ], [], []);
    },
  };
}

function makeRomanNumeralConfig() {
  return {
    title: "Roman Numerals",
    actionLabel: "Convert numeral",
    emptyState: "Convert a whole number into Roman numerals.",
    summaryLabel: "Roman numeral result",
    defaultHistoryLabel: "Roman numeral conversion",
    defaults: { numberValue: 1998 },
    mainFields: [numberField("numberValue", "Number", 1, 3999, 1)],
    advancedFields: [],
    validate(values) {
      return values.numberValue < 1 || values.numberValue > 3999 ? "Use a whole number from 1 to 3999." : "";
    },
    compute(values) {
      const numeral = toRoman(Math.round(values.numberValue));
      return result("Roman numeral conversion", [
        card("Roman numeral", numeral),
      ], [
        plainBar("Number", values.numberValue, count(values.numberValue)),
      ], [], []);
    },
  };
}

function makeSigFigsConfig() {
  return {
    title: "Sig Figs Calculator",
    actionLabel: "Round value",
    emptyState: "Round a number to the chosen count of significant figures.",
    summaryLabel: "Sig figs result",
    defaultHistoryLabel: "Sig figs scenario",
    defaults: { value: 1234.567, significantFigures: 3 },
    mainFields: [numberField("value", "Value", -1000000000, 1000000000, 0.001), numberField("significantFigures", "Significant figures", 1, 10, 1)],
    advancedFields: [],
    validate(values) {
      return values.significantFigures < 1 ? "Use at least 1 significant figure." : "";
    },
    compute(values) {
      const rounded = toSigFigs(values.value, values.significantFigures);
      return result("Rounded to significant figures", [
        card("Rounded value", String(rounded)),
        card("Significant figures", String(values.significantFigures)),
      ], [
        plainBar("Original value", values.value, fixed(values.value)),
        plainBar("Rounded value", 0, String(rounded)),
      ], [], []);
    },
  };
}

function makeBmiConfig() {
  return {
    title: "BMI Calculator",
    actionLabel: "Calculate BMI",
    emptyState: "Estimate body mass index from height and weight.",
    summaryLabel: "BMI result",
    defaultHistoryLabel: "BMI scenario",
    defaults: { weightKg: 72, heightCm: 176 },
    mainFields: [numberField("weightKg", "Weight (kg)", 1, 1000, 0.1), numberField("heightCm", "Height (cm)", 1, 300, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.weightKg <= 0 || values.heightCm <= 0 ? "Enter weight and height." : "";
    },
    compute(values) {
      const bmi = values.weightKg / Math.pow(values.heightCm / 100, 2);
      const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy range" : bmi < 30 ? "Overweight" : "Obesity";
      return result("Body mass index", [
        card("BMI", fixed(bmi)),
        card("Category", category),
      ], [
        plainBar("Weight", values.weightKg, `${fixed(values.weightKg)} kg`),
        plainBar("Height", values.heightCm, `${fixed(values.heightCm)} cm`),
      ], [], []);
    },
  };
}

function makeBmrConfig() {
  return {
    title: "BMR Calculator",
    actionLabel: "Calculate BMR",
    emptyState: "Estimate basal metabolic rate from age, sex, height, and weight.",
    summaryLabel: "BMR result",
    defaultHistoryLabel: "BMR scenario",
    defaults: { sex: "male", age: 32, weightKg: 74, heightCm: 178 },
    mainFields: [{ name: "sex", label: "Sex", type: "select", options: SEX_OPTIONS }, numberField("age", "Age", 1, 120, 1), numberField("weightKg", "Weight (kg)", 1, 500, 0.1), numberField("heightCm", "Height (cm)", 1, 300, 0.1)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const bmr = values.sex === "male"
        ? 10 * values.weightKg + 6.25 * values.heightCm - 5 * values.age + 5
        : 10 * values.weightKg + 6.25 * values.heightCm - 5 * values.age - 161;
      return result("Basal metabolic rate", [
        card("BMR", `${fixed(bmr)} kcal/day`),
      ], [
        plainBar("Age", values.age, `${values.age}`),
        plainBar("Weight", values.weightKg, `${fixed(values.weightKg)} kg`),
        plainBar("Height", values.heightCm, `${fixed(values.heightCm)} cm`),
      ], [], []);
    },
  };
}

function makeStepsPerMileConfig() {
  return {
    title: "How Many Steps in a Mile",
    actionLabel: "Calculate steps",
    emptyState: "Estimate how many steps it takes to cover a mile from your step length.",
    summaryLabel: "Steps per mile",
    defaultHistoryLabel: "Steps per mile",
    defaults: { stepLengthCm: 76 },
    mainFields: [numberField("stepLengthCm", "Step length (cm)", 1, 300, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.stepLengthCm <= 0 ? "Enter a step length." : "";
    },
    compute(values) {
      const steps = 160934.4 / values.stepLengthCm;
      return result("Estimated steps in one mile", [
        card("Steps / mile", count(steps)),
      ], [
        plainBar("Step length", values.stepLengthCm, `${fixed(values.stepLengthCm)} cm`),
      ], [], []);
    },
  };
}

function makeMilesToStepsConfig() {
  return {
    title: "Miles to Steps Calculator",
    actionLabel: "Convert miles",
    emptyState: "Estimate step count from miles walked using your average step length.",
    summaryLabel: "Miles to steps result",
    defaultHistoryLabel: "Miles to steps",
    defaults: { miles: 3.5, stepLengthCm: 76 },
    mainFields: [numberField("miles", "Miles", 0.1, 1000000, 0.1), numberField("stepLengthCm", "Step length (cm)", 1, 300, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.stepLengthCm <= 0 ? "Enter a step length." : "";
    },
    compute(values) {
      const steps = (values.miles * 160934.4) / values.stepLengthCm;
      return result("Estimated steps from miles walked", [
        card("Steps", count(steps)),
      ], [
        plainBar("Miles", values.miles, `${fixed(values.miles)} mi`),
        plainBar("Step length", values.stepLengthCm, `${fixed(values.stepLengthCm)} cm`),
      ], [], []);
    },
  };
}

function makeStepsToDistanceConfig({ title, mode }) {
  return {
    title,
    actionLabel: "Convert steps",
    emptyState: "Estimate distance covered from the number of steps and average step length.",
    summaryLabel: "Distance result",
    defaultHistoryLabel: `${title} scenario`,
    defaults: { steps: 7200, stepLengthCm: 76 },
    mainFields: [numberField("steps", "Steps", 1, 100000000, 1), numberField("stepLengthCm", "Step length (cm)", 1, 300, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.stepLengthCm <= 0 ? "Enter a step length." : "";
    },
    compute(values) {
      const meters = (values.steps * values.stepLengthCm) / 100;
      const distance = mode === "miles" ? meters / 1609.344 : meters / 1000;
      return result("Estimated walking distance", [
        card(mode === "miles" ? "Miles" : "Kilometers", fixed(distance)),
        card("Steps", count(values.steps)),
      ], [
        plainBar("Steps", values.steps, count(values.steps)),
        plainBar("Step length", values.stepLengthCm, `${fixed(values.stepLengthCm)} cm`),
      ], [], []);
    },
  };
}

function makeStepsToCaloriesConfig() {
  return {
    title: "Steps to Calories",
    actionLabel: "Estimate calories",
    emptyState: "Estimate calories burned from steps and body weight.",
    summaryLabel: "Calories result",
    defaultHistoryLabel: "Steps to calories",
    defaults: { steps: 9000, weightKg: 72 },
    mainFields: [numberField("steps", "Steps", 1, 100000000, 1), numberField("weightKg", "Weight (kg)", 1, 500, 0.1)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const calories = values.steps * 0.04 * (values.weightKg / 70);
      return result("Estimated calories burned", [
        card("Calories", `${fixed(calories)} kcal`),
      ], [
        plainBar("Steps", values.steps, count(values.steps)),
        plainBar("Weight", values.weightKg, `${fixed(values.weightKg)} kg`),
      ], [], []);
    },
  };
}

function makePregnancyConfig() {
  return {
    title: "Pregnancy Calculator",
    actionLabel: "Calculate due date",
    emptyState: "Estimate a due date and trimester markers from the first day of the last period.",
    summaryLabel: "Pregnancy estimate",
    defaultHistoryLabel: "Pregnancy scenario",
    defaults: { lastPeriodDate: shiftDate(todayString(), -42) },
    mainFields: [dateField("lastPeriodDate", "First day of last period")],
    advancedFields: [],
    validate(values) {
      return !values.lastPeriodDate ? "Choose a date." : "";
    },
    compute(values) {
      const lmp = new Date(values.lastPeriodDate);
      const dueDate = shiftDateObject(lmp, 280);
      const trimesterOne = shiftDateObject(lmp, 13 * 7);
      const trimesterTwo = shiftDateObject(lmp, 27 * 7);
      return result("Pregnancy timeline estimate", [
        card("Estimated due date", formatDate(dueDate)),
        card("Trimester 2 starts", formatDate(trimesterOne)),
        card("Trimester 3 starts", formatDate(trimesterTwo)),
      ], [
        plainBar("LMP date", 0, formatDate(values.lastPeriodDate)),
        plainBar("Due date", 0, formatDate(dueDate)),
      ], [], []);
    },
  };
}

function makeWhrConfig() {
  return {
    title: "WHR Calculator",
    actionLabel: "Calculate WHR",
    emptyState: "Calculate waist-to-hip ratio from waist and hip measurements.",
    summaryLabel: "WHR result",
    defaultHistoryLabel: "WHR scenario",
    defaults: { waistCm: 78, hipCm: 99 },
    mainFields: [numberField("waistCm", "Waist (cm)", 1, 300, 0.1), numberField("hipCm", "Hip (cm)", 1, 300, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.hipCm <= 0 ? "Hip measurement must be greater than zero." : "";
    },
    compute(values) {
      const ratio = values.waistCm / values.hipCm;
      return result("Waist-to-hip ratio", [
        card("WHR", fixed(ratio)),
      ], [
        plainBar("Waist", values.waistCm, `${fixed(values.waistCm)} cm`),
        plainBar("Hip", values.hipCm, `${fixed(values.hipCm)} cm`),
      ], [], []);
    },
  };
}

function makeFamilyConverterConfig({
  title,
  actionLabel,
  emptyState,
  summaryLabel,
  defaultHistoryLabel,
  units,
  fromUnit,
  toUnit,
  precision = 4,
}) {
  const options = Object.entries(units).map(([value, meta]) => ({ value, label: meta.label }));
  return {
    title,
    actionLabel,
    emptyState,
    summaryLabel,
    defaultHistoryLabel,
    defaults: { inputValue: 1, fromUnit, toUnit },
    mainFields: [numberField("inputValue", "Value", -1000000000, 1000000000, 0.01), { name: "fromUnit", label: "From", type: "select", options }, { name: "toUnit", label: "To", type: "select", options }],
    advancedFields: [],
    validate(values) {
      return !units[values.fromUnit] || !units[values.toUnit] ? "Choose valid units." : "";
    },
    compute(values) {
      const source = units[values.fromUnit];
      const target = units[values.toUnit];
      const baseValue = values.inputValue * source.factor;
      const converted = baseValue / target.factor;
      const rows = Object.entries(units)
        .slice(0, 6)
        .map(([key, meta]) => ({
          cells: [meta.label, formatConverted(baseValue / meta.factor, precision)],
          tone: key === values.toUnit ? "highlight" : "default",
        }));
      return result(`${title} result`, [
        card("Converted value", `${formatConverted(converted, precision)} ${target.label}`),
        card("From unit", source.label),
        card("To unit", target.label),
      ], [
        plainBar("Input value", values.inputValue, `${formatConverted(values.inputValue, precision)} ${source.label}`),
        plainBar("Converted value", converted, `${formatConverted(converted, precision)} ${target.label}`),
      ], [], [], {
        table: {
          title: "Common unit views",
          headers: ["Unit", "Converted value"],
          rows,
        },
      });
    },
  };
}

function makeFuelEconomyConfig() {
  return {
    title: "Fuel Economy Calculator",
    actionLabel: "Calculate economy",
    emptyState: "Estimate distance per gallon and liters per 100 km from fuel use and miles driven.",
    summaryLabel: "Fuel economy result",
    defaultHistoryLabel: "Fuel economy scenario",
    defaults: { miles: 380, gallons: 12.4 },
    mainFields: [numberField("miles", "Miles driven", 0.1, 1000000, 0.1), numberField("gallons", "Gallons used", 0.1, 1000000, 0.1)],
    advancedFields: [],
    validate(values) {
      return values.gallons <= 0 ? "Enter gallons used." : "";
    },
    compute(values) {
      const mpg = values.miles / values.gallons;
      const litersPer100Km = 235.214583 / Math.max(mpg, 0.0001);
      return result("Fuel economy estimate", [
        card("Miles / gallon", fixed(mpg)),
        card("L / 100km", fixed(litersPer100Km)),
      ], [
        plainBar("Miles", values.miles, `${fixed(values.miles)} mi`),
        plainBar("Gallons", values.gallons, `${fixed(values.gallons)} gal`),
      ], [], []);
    },
  };
}

function makeWaterWeightConfig() {
  return {
    title: "Water Weight Calculator",
    actionLabel: "Calculate water weight",
    emptyState: "Estimate the weight of water from a volume in liters or gallons.",
    summaryLabel: "Water weight result",
    defaultHistoryLabel: "Water weight scenario",
    defaults: { liters: 25 },
    mainFields: [numberField("liters", "Volume (liters)", 0.1, 1000000, 0.1)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const kilograms = values.liters;
      const pounds = kilograms * 2.20462262;
      return result("Water weight estimate", [
        card("Kilograms", fixed(kilograms)),
        card("Pounds", fixed(pounds)),
      ], [
        plainBar("Volume", values.liters, `${fixed(values.liters)} L`),
        plainBar("Weight", kilograms, `${fixed(kilograms)} kg`),
      ], [], []);
    },
  };
}

function makeWeightToVolumeConfig() {
  return {
    title: "Weight To Volume",
    actionLabel: "Convert weight",
    emptyState: "Estimate volume from weight and ingredient density.",
    summaryLabel: "Weight to volume result",
    defaultHistoryLabel: "Weight to volume scenario",
    defaults: { grams: 500, density: "0.6" },
    mainFields: [numberField("grams", "Weight (grams)", 0.1, 1000000, 0.1)],
    advancedFields: [{ name: "density", label: "Density", type: "select", options: DENSITY_OPTIONS }],
    validate(values) {
      return values.grams <= 0 ? "Enter a weight." : "";
    },
    compute(values) {
      const density = Number(values.density || 1) || 1;
      const ml = values.grams / density;
      const cups = ml / COOKING_UNIT_FACTORS.cup;
      return result("Weight to volume estimate", [
        card("Milliliters", fixed(ml)),
        card("Cups", fixed(cups)),
      ], [
        plainBar("Weight", values.grams, `${fixed(values.grams)} g`),
        plainBar("Density", density, fixed(density)),
      ], [], []);
    },
  };
}

function makePairConverterConfig({ title, fromUnit, toUnit, factor }) {
  return {
    title,
    actionLabel: "Convert value",
    emptyState: `Convert ${fromUnit} into ${toUnit} with a single input value.`,
    summaryLabel: "Conversion result",
    defaultHistoryLabel: `${title} conversion`,
    defaults: { inputValue: 1 },
    mainFields: [numberField("inputValue", `${fromUnit} value`, -1000000000, 1000000000, 0.01)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const converted = values.inputValue * factor;
      return result(`${title} result`, [
        card(toUnit, formatConverted(converted, 6)),
      ], [
        plainBar(fromUnit, values.inputValue, `${formatConverted(values.inputValue, 6)} ${fromUnit}`),
        plainBar(toUnit, converted, `${formatConverted(converted, 6)} ${toUnit}`),
      ], [], []);
    },
  };
}

function makeKilosToStoneConfig() {
  return {
    title: "Kilos to stone & pounds",
    actionLabel: "Convert weight",
    emptyState: "Convert kilograms into stone and pounds.",
    summaryLabel: "Weight conversion",
    defaultHistoryLabel: "Kilos to stone conversion",
    defaults: { kilos: 72 },
    mainFields: [numberField("kilos", "Kilograms", 0.1, 1000000, 0.1)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const totalPounds = values.kilos * 2.20462262;
      const stone = Math.floor(totalPounds / 14);
      const pounds = totalPounds - stone * 14;
      return result("Kilograms converted to stone and pounds", [
        card("Stone & pounds", `${stone} st ${fixed(pounds)} lb`),
        card("Pounds", fixed(totalPounds)),
      ], [
        plainBar("Kilograms", values.kilos, `${fixed(values.kilos)} kg`),
      ], [], []);
    },
  };
}

function makeCentimetersToFeetConfig() {
  return {
    title: "Centimeters to feet & inches",
    actionLabel: "Convert height",
    emptyState: "Convert centimeters into feet and inches.",
    summaryLabel: "Height conversion",
    defaultHistoryLabel: "Centimeters to feet conversion",
    defaults: { centimeters: 178 },
    mainFields: [numberField("centimeters", "Centimeters", 0.1, 1000000, 0.1)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const totalInches = values.centimeters / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = totalInches - feet * 12;
      return result("Height converted to imperial units", [
        card("Feet & inches", `${feet}' ${fixed(inches)}"`),
        card("Total inches", fixed(totalInches)),
      ], [
        plainBar("Centimeters", values.centimeters, `${fixed(values.centimeters)} cm`),
      ], [], []);
    },
  };
}

function makeCubicYardsToTonsConfig() {
  return {
    title: "Cubic Yards to Tons",
    actionLabel: "Convert material",
    emptyState: "Convert cubic yards into tons using a material density assumption.",
    summaryLabel: "Material conversion",
    defaultHistoryLabel: "Cubic yards to tons",
    defaults: { cubicYards: 5, tonsPerYard: 1.4 },
    mainFields: [numberField("cubicYards", "Cubic yards", 0.1, 1000000, 0.1), numberField("tonsPerYard", "Tons per cubic yard", 0.1, 10, 0.01)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const tons = values.cubicYards * values.tonsPerYard;
      return result("Cubic yards converted to tons", [
        card("Estimated tons", fixed(tons)),
      ], [
        plainBar("Cubic yards", values.cubicYards, `${fixed(values.cubicYards)} yd³`),
        plainBar("Density", values.tonsPerYard, `${fixed(values.tonsPerYard)} tons / yd³`),
      ], [], []);
    },
  };
}

function makeGallonsToPoundsConfig() {
  return {
    title: "Gallons to Pounds",
    actionLabel: "Convert volume",
    emptyState: "Convert gallons of water into pounds.",
    summaryLabel: "Gallons to pounds",
    defaultHistoryLabel: "Gallons to pounds",
    defaults: { gallons: 10 },
    mainFields: [numberField("gallons", "Gallons", 0.1, 1000000, 0.1)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const pounds = values.gallons * 8.34;
      return result("Gallons converted to pounds", [
        card("Pounds", fixed(pounds)),
      ], [
        plainBar("Gallons", values.gallons, `${fixed(values.gallons)} gal`),
      ], [], [
        note("Assumption", "Water at room temperature"),
      ]);
    },
  };
}

function makeHertzToSecondsConfig() {
  return {
    title: "Hertz to Seconds",
    actionLabel: "Convert frequency",
    emptyState: "Convert a frequency in hertz into a cycle duration in seconds.",
    summaryLabel: "Frequency conversion",
    defaultHistoryLabel: "Hertz to seconds",
    defaults: { hertz: 60 },
    mainFields: [numberField("hertz", "Frequency (Hz)", 0.000001, 1000000000, 0.01)],
    advancedFields: [],
    validate(values) {
      return values.hertz <= 0 ? "Frequency must be greater than zero." : "";
    },
    compute(values) {
      const seconds = 1 / values.hertz;
      return result("Cycle duration", [
        card("Seconds", formatConverted(seconds, 8)),
      ], [
        plainBar("Frequency", values.hertz, `${fixed(values.hertz)} Hz`),
      ], [], []);
    },
  };
}

function makeOuncesAndPoundsConfig() {
  return {
    title: "Ounces and Pounds",
    actionLabel: "Convert ounces",
    emptyState: "Convert ounces into pounds and ounces.",
    summaryLabel: "Weight conversion",
    defaultHistoryLabel: "Ounces and pounds",
    defaults: { ounces: 42 },
    mainFields: [numberField("ounces", "Ounces", 0.1, 1000000, 0.1)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const pounds = Math.floor(values.ounces / 16);
      const ouncesRemainder = values.ounces - pounds * 16;
      return result("Ounces converted to pounds", [
        card("Pounds & ounces", `${pounds} lb ${fixed(ouncesRemainder)} oz`),
      ], [
        plainBar("Ounces", values.ounces, `${fixed(values.ounces)} oz`),
      ], [], []);
    },
  };
}

function makeSquareFeetToVolumeConfig({ title, factor, unitLabel }) {
  return {
    title,
    actionLabel: "Convert area",
    emptyState: "Estimate volume from area and depth.",
    summaryLabel: "Area to volume result",
    defaultHistoryLabel: `${title} conversion`,
    defaults: { squareFeet: 420, depthFeet: 0.5 },
    mainFields: [numberField("squareFeet", "Square feet", 0.1, 100000000, 0.1), numberField("depthFeet", "Depth (ft)", 0.01, 1000, 0.01)],
    advancedFields: [],
    validate(values) {
      return values.squareFeet <= 0 || values.depthFeet <= 0 ? "Enter the area and depth." : "";
    },
    compute(values) {
      const converted = values.squareFeet * values.depthFeet * factor;
      return result("Estimated volume from square feet", [
        card(unitLabel, fixed(converted)),
      ], [
        plainBar("Area", values.squareFeet, `${fixed(values.squareFeet)} sq ft`),
        plainBar("Depth", values.depthFeet, `${fixed(values.depthFeet)} ft`),
      ], [], []);
    },
  };
}

function makeWattsToAmpsConfig() {
  return {
    title: "Watts to Amps",
    actionLabel: "Convert power",
    emptyState: "Estimate current draw from watts and voltage.",
    summaryLabel: "Current result",
    defaultHistoryLabel: "Watts to amps",
    defaults: { watts: 1500, volts: 120 },
    mainFields: [numberField("watts", "Watts", 0.1, 100000000, 0.1), numberField("volts", "Volts", 1, 100000, 1)],
    advancedFields: [],
    validate(values) {
      return values.volts <= 0 ? "Voltage must be greater than zero." : "";
    },
    compute(values) {
      const amps = values.watts / values.volts;
      return result("Current draw estimate", [
        card("Amps", fixed(amps)),
      ], [
        plainBar("Watts", values.watts, `${fixed(values.watts)} W`),
        plainBar("Volts", values.volts, `${fixed(values.volts)} V`),
      ], [], []);
    },
  };
}

function makeDensityConverterConfig({ title, fromLabel, toLabel, mode, baseField = "cups" }) {
  return {
    title,
    actionLabel: "Convert ingredient",
    emptyState: "Convert between weight and volume using a simple ingredient density assumption.",
    summaryLabel: "Ingredient conversion",
    defaultHistoryLabel: `${title} conversion`,
    defaults: { amount: 2, density: "0.6" },
    mainFields: [numberField("amount", `${fromLabel}`, 0.01, 1000000, 0.01)],
    advancedFields: [{ name: "density", label: "Ingredient density", type: "select", options: DENSITY_OPTIONS }],
    validate(values) {
      return values.amount <= 0 ? "Enter an amount." : "";
    },
    compute(values) {
      const density = Number(values.density || 0.6) || 0.6;
      let converted = 0;
      if (mode === "volume-to-weight") {
        const ml = baseField === "ml"
          ? values.amount
          : baseField === "teaspoons"
            ? values.amount * COOKING_UNIT_FACTORS.teaspoon
            : baseField === "cups"
              ? values.amount * COOKING_UNIT_FACTORS.cup
              : values.amount * 453.59237;
        converted = ml * density;
      } else {
        const grams = baseField === "pounds" ? values.amount * 453.59237 : values.amount;
        const ml = grams / density;
        converted = ml / COOKING_UNIT_FACTORS.cup;
      }
      return result(`${title} result`, [
        card(toLabel, fixed(converted)),
      ], [
        plainBar(fromLabel, values.amount, `${fixed(values.amount)} ${fromLabel}`),
        plainBar(toLabel, converted, `${fixed(converted)} ${toLabel}`),
      ], [], [
        note("Density", fixed(density)),
      ]);
    },
  };
}

function makeAirFryerConverterConfig() {
  return {
    title: "Air Fryer Converter",
    actionLabel: "Convert oven recipe",
    emptyState: "Adjust a conventional oven recipe for an air fryer.",
    summaryLabel: "Air fryer result",
    defaultHistoryLabel: "Air fryer conversion",
    defaults: { ovenTempF: 400, cookMinutes: 25 },
    mainFields: [numberField("ovenTempF", "Oven temperature (F)", 100, 600, 1), numberField("cookMinutes", "Oven time (minutes)", 1, 1000, 1)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const fryerTemp = values.ovenTempF - 25;
      const fryerTime = values.cookMinutes * 0.8;
      return result("Air fryer adjustment", [
        card("Air fryer temperature", `${fixed(fryerTemp)}°F`),
        card("Air fryer time", `${fixed(fryerTime)} min`),
      ], [
        plainBar("Oven temperature", values.ovenTempF, `${fixed(values.ovenTempF)}°F`),
        plainBar("Oven time", values.cookMinutes, `${fixed(values.cookMinutes)} min`),
      ], [], []);
    },
  };
}

function makeButterConverterConfig() {
  return {
    title: "Butter Converter",
    actionLabel: "Convert butter amount",
    emptyState: "Convert butter between grams, tablespoons, and sticks.",
    summaryLabel: "Butter conversion",
    defaultHistoryLabel: "Butter conversion",
    defaults: { grams: 227 },
    mainFields: [numberField("grams", "Butter (grams)", 0.1, 1000000, 0.1)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const tablespoons = values.grams / 14.2;
      const sticks = values.grams / 113.5;
      return result("Butter amount converted", [
        card("Tablespoons", fixed(tablespoons)),
        card("Sticks", fixed(sticks)),
      ], [
        plainBar("Grams", values.grams, `${fixed(values.grams)} g`),
      ], [], []);
    },
  };
}

function makeOvenTemperatureConfig() {
  return {
    title: "Oven Temperatures",
    actionLabel: "Convert temperature",
    emptyState: "Convert oven temperature between Fahrenheit, Celsius, and gas mark.",
    summaryLabel: "Oven temperature result",
    defaultHistoryLabel: "Oven temperature conversion",
    defaults: { fahrenheit: 375 },
    mainFields: [numberField("fahrenheit", "Temperature (F)", 100, 600, 1)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const celsius = (values.fahrenheit - 32) * (5 / 9);
      const gasMark = Math.max(1, Math.round((celsius - 121) / 14));
      return result("Oven temperature conversion", [
        card("Celsius", `${fixed(celsius)}°C`),
        card("Gas mark", `${gasMark}`),
      ], [
        plainBar("Fahrenheit", values.fahrenheit, `${fixed(values.fahrenheit)}°F`),
      ], [], []);
    },
  };
}

function makeGpaCalculatorConfig() {
  return {
    title: "GPA Calculator",
    actionLabel: "Calculate GPA",
    emptyState: "Estimate a weighted GPA from course percentages and credit hours.",
    summaryLabel: "GPA estimate",
    defaultHistoryLabel: "GPA scenario",
    defaults: {
      course1Grade: 94,
      course1Credits: 3,
      course2Grade: 88,
      course2Credits: 4,
      course3Grade: 91,
      course3Credits: 3,
      course4Grade: 84,
      course4Credits: 2,
      course5Grade: 97,
      course5Credits: 3,
    },
    mainFields: [
      numberField("course1Grade", "Course 1 score (%)", 0, 100, 0.1),
      numberField("course1Credits", "Course 1 credits", 0.5, 12, 0.5),
      numberField("course2Grade", "Course 2 score (%)", 0, 100, 0.1),
      numberField("course2Credits", "Course 2 credits", 0.5, 12, 0.5),
      numberField("course3Grade", "Course 3 score (%)", 0, 100, 0.1),
      numberField("course3Credits", "Course 3 credits", 0.5, 12, 0.5),
      numberField("course4Grade", "Course 4 score (%)", 0, 100, 0.1),
      numberField("course4Credits", "Course 4 credits", 0.5, 12, 0.5),
      numberField("course5Grade", "Course 5 score (%)", 0, 100, 0.1),
      numberField("course5Credits", "Course 5 credits", 0.5, 12, 0.5),
    ],
    advancedFields: [],
    validate(values) {
      const totalCredits =
        values.course1Credits +
        values.course2Credits +
        values.course3Credits +
        values.course4Credits +
        values.course5Credits;
      return totalCredits <= 0 ? "Add at least one course credit." : "";
    },
    compute(values) {
      const courses = [1, 2, 3, 4, 5].map((index) => {
        const grade = values[`course${index}Grade`];
        const credits = values[`course${index}Credits`];
        return {
          label: `Course ${index}`,
          grade,
          credits,
          points: gradePointFromPercentage(grade),
        };
      });
      const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
      const weightedPoints = courses.reduce((sum, course) => sum + course.points * course.credits, 0);
      const averageScore = courses.reduce((sum, course) => sum + course.grade, 0) / courses.length;
      const gpa = weightedPoints / Math.max(totalCredits, 1);
      const honorBand = gpa >= 3.7 ? "Dean's list range" : gpa >= 3.3 ? "Strong standing" : gpa >= 2 ? "Passing range" : "Needs recovery";

      return result("Weighted GPA estimate", [
        card("GPA", fixed(gpa)),
        card("Total credits", fixed(totalCredits)),
        card("Average score", `${fixed(averageScore)}%`),
        card("Standing", honorBand),
      ], [
        plainBar("Course load", totalCredits, `${fixed(totalCredits)} credits`),
        plainBar("Weighted grade points", weightedPoints, fixed(weightedPoints)),
        plainBar("Average score", averageScore, `${fixed(averageScore)}%`),
        plainBar("Weighted GPA", gpa, fixed(gpa)),
      ], [], [
        note("Scale", "4.0 weighted estimate"),
        note("Standing", honorBand),
      ]);
    },
  };
}

function makeGradeCalculatorConfig() {
  return {
    title: "Grade Calculator",
    actionLabel: "Calculate grade",
    emptyState: "Estimate a weighted course grade from assignments, quizzes, and exams.",
    summaryLabel: "Grade estimate",
    defaultHistoryLabel: "Grade scenario",
    defaults: {
      assignmentScore: 92,
      assignmentWeight: 25,
      quizScore: 86,
      quizWeight: 15,
      midtermScore: 88,
      midtermWeight: 25,
      projectScore: 95,
      projectWeight: 20,
      finalScore: 90,
      finalWeight: 15,
    },
    mainFields: [
      numberField("assignmentScore", "Assignments score (%)", 0, 100, 0.1),
      percentField("assignmentWeight", "Assignments weight", 0, 100, 1),
      numberField("quizScore", "Quizzes score (%)", 0, 100, 0.1),
      percentField("quizWeight", "Quizzes weight", 0, 100, 1),
      numberField("midtermScore", "Midterm score (%)", 0, 100, 0.1),
      percentField("midtermWeight", "Midterm weight", 0, 100, 1),
      numberField("projectScore", "Project score (%)", 0, 100, 0.1),
      percentField("projectWeight", "Project weight", 0, 100, 1),
      numberField("finalScore", "Final exam score (%)", 0, 100, 0.1),
      percentField("finalWeight", "Final exam weight", 0, 100, 1),
    ],
    advancedFields: [],
    validate(values) {
      const totalWeight =
        values.assignmentWeight +
        values.quizWeight +
        values.midtermWeight +
        values.projectWeight +
        values.finalWeight;
      return totalWeight !== 100 ? "Make sure the weights add up to 100%." : "";
    },
    compute(values) {
      const weightedScore =
        (values.assignmentScore * values.assignmentWeight +
          values.quizScore * values.quizWeight +
          values.midtermScore * values.midtermWeight +
          values.projectScore * values.projectWeight +
          values.finalScore * values.finalWeight) /
        100;
      const letter = gradeLetterFromPercentage(weightedScore);

      return result("Weighted class grade", [
        card("Overall grade", `${fixed(weightedScore)}%`),
        card("Letter grade", letter),
        card("Grade points", fixed(gradePointFromPercentage(weightedScore))),
      ], [
        plainBar("Assignments", values.assignmentScore, `${fixed(values.assignmentScore)}% x ${values.assignmentWeight}%`),
        plainBar("Quizzes", values.quizScore, `${fixed(values.quizScore)}% x ${values.quizWeight}%`),
        plainBar("Midterm", values.midtermScore, `${fixed(values.midtermScore)}% x ${values.midtermWeight}%`),
        plainBar("Project", values.projectScore, `${fixed(values.projectScore)}% x ${values.projectWeight}%`),
        plainBar("Final exam", values.finalScore, `${fixed(values.finalScore)}% x ${values.finalWeight}%`),
      ], [], [
        note("Letter grade", letter),
        note("Weighted score", `${fixed(weightedScore)}%`),
      ]);
    },
  };
}

function makeScientificCalculatorConfig() {
  return {
    title: "Scientific Calculator",
    actionLabel: "Calculate value",
    emptyState: "Run common scientific operations like powers, roots, trig, and logs from one cleaner panel.",
    summaryLabel: "Scientific result",
    defaultHistoryLabel: "Scientific calculation",
    defaults: {
      firstValue: 12,
      secondValue: 4,
      operation: "power",
      angleMode: "degrees",
    },
    mainFields: [
      numberField("firstValue", "Primary value", -1000000000, 1000000000, 0.01),
      numberField("secondValue", "Secondary value", -1000000000, 1000000000, 0.01),
    ],
    advancedFields: [
      { name: "operation", label: "Operation", type: "select", options: SCIENTIFIC_OPERATION_OPTIONS },
      {
        name: "angleMode",
        label: "Angle mode",
        type: "select",
        options: [
          { value: "degrees", label: "Degrees" },
          { value: "radians", label: "Radians" },
        ],
      },
    ],
    validate(values) {
      if ((values.operation === "divide" || values.operation === "root") && values.secondValue === 0) {
        return "Secondary value must be greater than zero for division or roots.";
      }
      if ((values.operation === "log" || values.operation === "ln") && values.firstValue <= 0) {
        return "Log operations need a positive primary value.";
      }
      return "";
    },
    compute(values) {
      let output = 0;
      const angle = values.angleMode === "degrees" ? (values.firstValue * Math.PI) / 180 : values.firstValue;

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
        case "sin":
          output = Math.sin(angle);
          break;
        case "cos":
          output = Math.cos(angle);
          break;
        case "tan":
          output = Math.tan(angle);
          break;
        case "log":
          output = Math.log10(values.firstValue);
          break;
        case "ln":
          output = Math.log(values.firstValue);
          break;
        default:
          output = values.firstValue;
      }

      const outputLabel = Number.isFinite(output) ? formatConverted(output, 8) : "Undefined";

      return result("Scientific calculation result", [
        card("Result", outputLabel),
        card("Operation", SCIENTIFIC_OPERATION_OPTIONS.find((item) => item.value === values.operation)?.label || "Operation"),
      ], [
        plainBar("Primary value", values.firstValue, formatConverted(values.firstValue, 6)),
        plainBar("Secondary value", values.secondValue, formatConverted(values.secondValue, 6)),
        plainBar("Result", Number.isFinite(output) ? output : 0, outputLabel),
      ], [], [
        note("Angle mode", values.angleMode),
      ]);
    },
  };
}

function makeFractionCalculatorConfig() {
  return {
    title: "Fraction Calculator",
    actionLabel: "Calculate fraction",
    emptyState: "Add, subtract, multiply, or divide two fractions and simplify the result.",
    summaryLabel: "Fraction result",
    defaultHistoryLabel: "Fraction scenario",
    defaults: {
      numerator1: 3,
      denominator1: 4,
      numerator2: 5,
      denominator2: 6,
      operation: "add",
    },
    mainFields: [
      numberField("numerator1", "Fraction 1 numerator", -10000, 10000, 1),
      numberField("denominator1", "Fraction 1 denominator", 1, 10000, 1),
      numberField("numerator2", "Fraction 2 numerator", -10000, 10000, 1),
      numberField("denominator2", "Fraction 2 denominator", 1, 10000, 1),
    ],
    advancedFields: [{ name: "operation", label: "Operation", type: "select", options: FRACTION_OPERATION_OPTIONS }],
    validate(values) {
      if (values.denominator1 === 0 || values.denominator2 === 0) {
        return "Fractions need denominators greater than zero.";
      }
      if (values.operation === "divide" && values.numerator2 === 0) {
        return "You cannot divide by zero.";
      }
      return "";
    },
    compute(values) {
      const answer = computeFractionOperation(
        values.operation,
        { numerator: values.numerator1, denominator: values.denominator1 },
        { numerator: values.numerator2, denominator: values.denominator2 },
      );
      const simplified = simplifyFraction(answer.numerator, answer.denominator);

      return result("Fraction operation result", [
        card("Simplified fraction", fractionText(simplified.numerator, simplified.denominator)),
        card("Mixed number", mixedNumberText(simplified.numerator, simplified.denominator)),
        card("Decimal", formatConverted(simplified.numerator / simplified.denominator, 6)),
      ], [
        plainBar("Fraction 1", values.numerator1 / values.denominator1, fractionText(values.numerator1, values.denominator1)),
        plainBar("Fraction 2", values.numerator2 / values.denominator2, fractionText(values.numerator2, values.denominator2)),
        plainBar("Result", simplified.numerator / simplified.denominator, fractionText(simplified.numerator, simplified.denominator)),
      ], [], [
        note("Operation", FRACTION_OPERATION_OPTIONS.find((item) => item.value === values.operation)?.label || "Operation"),
      ]);
    },
  };
}

function makeMixedNumberCalculatorConfig() {
  return {
    title: "Mixed Number Calculator",
    actionLabel: "Calculate mixed number",
    emptyState: "Work with mixed numbers and get both simplified and decimal outputs.",
    summaryLabel: "Mixed number result",
    defaultHistoryLabel: "Mixed number scenario",
    defaults: {
      whole1: 1,
      numerator1: 1,
      denominator1: 2,
      whole2: 2,
      numerator2: 1,
      denominator2: 4,
      operation: "add",
    },
    mainFields: [
      numberField("whole1", "Mixed number 1 whole", -1000, 1000, 1),
      numberField("numerator1", "Mixed number 1 numerator", 0, 10000, 1),
      numberField("denominator1", "Mixed number 1 denominator", 1, 10000, 1),
      numberField("whole2", "Mixed number 2 whole", -1000, 1000, 1),
      numberField("numerator2", "Mixed number 2 numerator", 0, 10000, 1),
      numberField("denominator2", "Mixed number 2 denominator", 1, 10000, 1),
    ],
    advancedFields: [{ name: "operation", label: "Operation", type: "select", options: FRACTION_OPERATION_OPTIONS }],
    validate(values) {
      if (values.denominator1 === 0 || values.denominator2 === 0) {
        return "Mixed numbers need denominators greater than zero.";
      }
      if (values.operation === "divide" && values.whole2 === 0 && values.numerator2 === 0) {
        return "You cannot divide by zero.";
      }
      return "";
    },
    compute(values) {
      const first = toFractionFromMixed(values.whole1, values.numerator1, values.denominator1);
      const second = toFractionFromMixed(values.whole2, values.numerator2, values.denominator2);
      const rawAnswer = computeFractionOperation(values.operation, first, second);
      const answer = simplifyFraction(rawAnswer.numerator, rawAnswer.denominator);

      return result("Mixed number operation result", [
        card("Mixed number", mixedNumberText(answer.numerator, answer.denominator)),
        card("Improper fraction", fractionText(answer.numerator, answer.denominator)),
        card("Decimal", formatConverted(answer.numerator / answer.denominator, 6)),
      ], [
        plainBar("Mixed number 1", first.numerator / first.denominator, mixedNumberText(first.numerator, first.denominator)),
        plainBar("Mixed number 2", second.numerator / second.denominator, mixedNumberText(second.numerator, second.denominator)),
        plainBar("Result", answer.numerator / answer.denominator, mixedNumberText(answer.numerator, answer.denominator)),
      ], [], [
        note("Operation", FRACTION_OPERATION_OPTIONS.find((item) => item.value === values.operation)?.label || "Operation"),
      ]);
    },
  };
}

function makeFractionToDecimalCalculatorConfig() {
  return {
    title: "Fraction to Decimal Calculator",
    actionLabel: "Convert fraction",
    emptyState: "Convert a fraction into decimal, percent, and mixed-number views.",
    summaryLabel: "Fraction to decimal result",
    defaultHistoryLabel: "Fraction to decimal",
    defaults: { numerator: 7, denominator: 8 },
    mainFields: [
      numberField("numerator", "Numerator", -100000, 100000, 1),
      numberField("denominator", "Denominator", 1, 100000, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.denominator === 0 ? "Denominator must be greater than zero." : "";
    },
    compute(values) {
      const simplified = simplifyFraction(values.numerator, values.denominator);
      const decimal = simplified.numerator / simplified.denominator;
      return result("Fraction converted to decimal", [
        card("Decimal", formatConverted(decimal, 8)),
        card("Percent", `${formatConverted(decimal * 100, 4)}%`),
        card("Mixed number", mixedNumberText(simplified.numerator, simplified.denominator)),
      ], [
        plainBar("Fraction", decimal, fractionText(simplified.numerator, simplified.denominator)),
        plainBar("Decimal", decimal, formatConverted(decimal, 8)),
        plainBar("Percent", decimal * 100, `${formatConverted(decimal * 100, 4)}%`),
      ], [], []);
    },
  };
}

function makeDecimalToPercentCalculatorConfig() {
  return {
    title: "Decimal to Percent Calculator",
    actionLabel: "Convert decimal",
    emptyState: "Turn a decimal into percent and fraction forms quickly.",
    summaryLabel: "Decimal to percent result",
    defaultHistoryLabel: "Decimal to percent",
    defaults: { decimalValue: 0.375 },
    mainFields: [numberField("decimalValue", "Decimal value", -1000000, 1000000, 0.0001)],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const percentValue = values.decimalValue * 100;
      const fraction = decimalToFraction(values.decimalValue);
      return result("Decimal converted to percent", [
        card("Percent", `${formatConverted(percentValue, 6)}%`),
        card("Fraction", fraction),
        card("Decimal", formatConverted(values.decimalValue, 6)),
      ], [
        plainBar("Decimal", values.decimalValue, formatConverted(values.decimalValue, 6)),
        plainBar("Percent", percentValue, `${formatConverted(percentValue, 6)}%`),
      ], [], [
        note("Fraction", fraction),
      ]);
    },
  };
}

function makeAverageCalculatorConfig() {
  return {
    title: "Average Calculator",
    actionLabel: "Calculate average",
    emptyState: "Average up to six values in one cleaner result view.",
    summaryLabel: "Average result",
    defaultHistoryLabel: "Average scenario",
    defaults: { value1: 10, value2: 14, value3: 18, value4: 12, value5: 16, value6: 20 },
    mainFields: buildValueListFields(),
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const list = getValueList(values);
      const mean = getMean(list);
      return result("Average of the entered values", [
        card("Average", formatConverted(mean, 6)),
        card("Total", formatConverted(list.reduce((sum, item) => sum + item, 0), 6)),
        card("Values used", String(list.length)),
      ], [
        plainBar("Average", mean, formatConverted(mean, 6)),
        plainBar("Smallest value", Math.min(...list), formatConverted(Math.min(...list), 6)),
        plainBar("Largest value", Math.max(...list), formatConverted(Math.max(...list), 6)),
      ], [], []);
    },
  };
}

function makeMeanMedianModeCalculatorConfig() {
  return {
    title: "Mean Median Mode Calculator",
    actionLabel: "Calculate stats",
    emptyState: "Find the mean, median, and mode for a six-value set.",
    summaryLabel: "Mean median mode result",
    defaultHistoryLabel: "Mean median mode",
    defaults: { value1: 4, value2: 7, value3: 7, value4: 9, value5: 10, value6: 12 },
    mainFields: buildValueListFields(),
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const list = getValueList(values);
      const mean = getMean(list);
      const median = getMedian(list);
      const modes = getModes(list);
      return result("Mean, median, and mode", [
        card("Mean", formatConverted(mean, 6)),
        card("Median", formatConverted(median, 6)),
        card("Mode", modes.length ? modes.map((item) => formatConverted(item, 6)).join(", ") : "No repeating value"),
      ], [
        plainBar("Sorted values", mean, [...list].sort((left, right) => left - right).map((item) => formatConverted(item, 6)).join(", ")),
        plainBar("Mean", mean, formatConverted(mean, 6)),
        plainBar("Median", median, formatConverted(median, 6)),
      ], [], [
        note("Mode", modes.length ? modes.map((item) => formatConverted(item, 6)).join(", ") : "No repeating value"),
      ]);
    },
  };
}

function makeStandardDeviationCalculatorConfig() {
  return {
    title: "Standard Deviation Calculator",
    actionLabel: "Calculate deviation",
    emptyState: "Estimate spread, variance, and the mean for the values you enter.",
    summaryLabel: "Standard deviation result",
    defaultHistoryLabel: "Standard deviation scenario",
    defaults: { value1: 6, value2: 8, value3: 10, value4: 12, value5: 14, value6: 16 },
    mainFields: buildValueListFields(),
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const list = getValueList(values);
      const mean = getMean(list);
      const deviation = getStandardDeviation(list);
      const variance = deviation ** 2;

      return result("Standard deviation estimate", [
        card("Standard deviation", formatConverted(deviation, 6)),
        card("Variance", formatConverted(variance, 6)),
        card("Mean", formatConverted(mean, 6)),
      ], [
        plainBar("Mean", mean, formatConverted(mean, 6)),
        plainBar("Variance", variance, formatConverted(variance, 6)),
        plainBar("Standard deviation", deviation, formatConverted(deviation, 6)),
      ], [], [
        note("Data points", String(list.length)),
      ]);
    },
  };
}

function makeTimeCalculatorConfig() {
  return {
    title: "Time Calculator",
    actionLabel: "Calculate time",
    emptyState: "Add or subtract a block of time from a starting clock value.",
    summaryLabel: "Time result",
    defaultHistoryLabel: "Time calculation",
    defaults: {
      startHour: 9,
      startMinute: 30,
      deltaHours: 2,
      deltaMinutes: 45,
      operation: "add",
    },
    mainFields: [
      numberField("startHour", "Start hour", 0, 23, 1),
      numberField("startMinute", "Start minute", 0, 59, 1),
      numberField("deltaHours", "Hours to add or subtract", 0, 240, 1),
      numberField("deltaMinutes", "Minutes to add or subtract", 0, 59, 1),
    ],
    advancedFields: [
      {
        name: "operation",
        label: "Operation",
        type: "select",
        options: [
          { value: "add", label: "Add time" },
          { value: "subtract", label: "Subtract time" },
        ],
      },
    ],
    validate() {
      return "";
    },
    compute(values) {
      const startMinutes = values.startHour * 60 + values.startMinute;
      const changeMinutes = values.deltaHours * 60 + values.deltaMinutes;
      const resultMinutes = values.operation === "subtract" ? startMinutes - changeMinutes : startMinutes + changeMinutes;
      const normalized = normalizeClockMinutes(resultMinutes);

      return result("Adjusted clock time", [
        card("Resulting time", formatClockMinutes(normalized)),
        card("24-hour time", formatClockMinutes(normalized, { meridiem: false })),
        card("Change applied", `${values.operation === "subtract" ? "-" : "+"}${values.deltaHours}h ${values.deltaMinutes}m`),
      ], [
        plainBar("Start time", startMinutes, formatClockMinutes(startMinutes)),
        plainBar("Change", changeMinutes, `${values.deltaHours}h ${values.deltaMinutes}m`),
        plainBar("Result", normalized, formatClockMinutes(normalized)),
      ], [], [
        note("Operation", values.operation === "subtract" ? "Subtract time" : "Add time"),
      ]);
    },
  };
}

function makeTimeDurationCalculatorConfig() {
  return {
    title: "Time Duration Calculator",
    actionLabel: "Calculate duration",
    emptyState: "Measure the time between a start clock and an end clock.",
    summaryLabel: "Duration result",
    defaultHistoryLabel: "Time duration scenario",
    defaults: {
      startHour: 8,
      startMinute: 15,
      endHour: 17,
      endMinute: 45,
      nextDay: false,
    },
    mainFields: [
      numberField("startHour", "Start hour", 0, 23, 1),
      numberField("startMinute", "Start minute", 0, 59, 1),
      numberField("endHour", "End hour", 0, 23, 1),
      numberField("endMinute", "End minute", 0, 59, 1),
    ],
    advancedFields: [
      { name: "nextDay", label: "End time is on the next day", type: "boolean" },
    ],
    validate() {
      return "";
    },
    compute(values) {
      const start = values.startHour * 60 + values.startMinute;
      let end = values.endHour * 60 + values.endMinute;
      if (values.nextDay || end < start) end += 1440;
      const duration = end - start;

      return result("Time duration", [
        card("Duration", formatDurationMinutes(duration)),
        card("Decimal hours", formatConverted(duration / 60, 4)),
        card("Total minutes", count(duration)),
      ], [
        plainBar("Start time", start, formatClockMinutes(start)),
        plainBar("End time", end, formatClockMinutes(end)),
        plainBar("Duration", duration, formatDurationMinutes(duration)),
      ], [], [
        note("Crosses midnight", values.nextDay || values.endHour * 60 + values.endMinute < start ? "Yes" : "No"),
      ]);
    },
  };
}

function makeHoursCalculatorConfig() {
  return {
    title: "Hours Calculator",
    actionLabel: "Calculate hours",
    emptyState: "Convert daily hours and minutes into total hours across repeated days.",
    summaryLabel: "Hours result",
    defaultHistoryLabel: "Hours scenario",
    defaults: {
      hours: 7,
      minutes: 30,
      days: 5,
    },
    mainFields: [
      numberField("hours", "Hours", 0, 24, 1),
      numberField("minutes", "Minutes", 0, 59, 1),
      numberField("days", "Number of days", 1, 366, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.days <= 0 ? "Enter at least one day." : "";
    },
    compute(values) {
      const perDayMinutes = values.hours * 60 + values.minutes;
      const totalMinutes = perDayMinutes * values.days;
      const totalHours = totalMinutes / 60;

      return result("Repeated hours total", [
        card("Total hours", formatConverted(totalHours, 4)),
        card("Total time", formatDurationMinutes(totalMinutes)),
        card("Minutes per day", count(perDayMinutes)),
      ], [
        plainBar("Daily time", perDayMinutes, formatDurationMinutes(perDayMinutes)),
        plainBar("Days", values.days, `${values.days} days`),
        plainBar("Total time", totalMinutes, formatDurationMinutes(totalMinutes)),
      ], [], []);
    },
  };
}

function makeWorkHoursCalculatorConfig() {
  return {
    title: "Work Hours Calculator",
    actionLabel: "Calculate work hours",
    emptyState: "Estimate paid hours and optional pay from a start time, end time, and break length.",
    summaryLabel: "Work hours result",
    defaultHistoryLabel: "Work hours scenario",
    defaults: {
      startHour: 9,
      startMinute: 0,
      endHour: 17,
      endMinute: 30,
      breakMinutes: 30,
      daysWorked: 5,
      hourlyRate: 28,
      currency: "USD",
    },
    mainFields: [
      numberField("startHour", "Start hour", 0, 23, 1),
      numberField("startMinute", "Start minute", 0, 59, 1),
      numberField("endHour", "End hour", 0, 23, 1),
      numberField("endMinute", "End minute", 0, 59, 1),
      numberField("breakMinutes", "Unpaid break (minutes)", 0, 240, 5),
      numberField("daysWorked", "Days worked", 1, 31, 1),
      moneyField("hourlyRate", "Hourly rate", 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.hourlyRate < 0 ? "Hourly rate cannot be negative." : "";
    },
    compute(values) {
      const start = values.startHour * 60 + values.startMinute;
      let end = values.endHour * 60 + values.endMinute;
      if (end < start) end += 1440;
      const dailyMinutes = Math.max(0, end - start - values.breakMinutes);
      const totalMinutes = dailyMinutes * values.daysWorked;
      const totalHours = totalMinutes / 60;
      const totalPay = totalHours * values.hourlyRate;

      return result("Work hours and pay estimate", [
        card("Paid hours", `${fixed(totalHours)} hrs`),
        card("Daily paid time", formatDurationMinutes(dailyMinutes)),
        card("Estimated pay", moneyText(totalPay, values.currency, 2)),
      ], [
        plainBar("Shift length", end - start, formatDurationMinutes(end - start)),
        plainBar("Unpaid break", values.breakMinutes, `${values.breakMinutes} min`),
        plainBar("Paid time / day", dailyMinutes, formatDurationMinutes(dailyMinutes)),
        moneyBar("Estimated pay", totalPay, values.currency, 2),
      ], [], [
        note("Days worked", `${values.daysWorked}`),
      ]);
    },
  };
}

function makeSleepCalculatorConfig() {
  return {
    title: "Sleep Calculator",
    actionLabel: "Calculate sleep",
    emptyState: "Estimate how much sleep you get between bedtime and wake time, including sleep cycles.",
    summaryLabel: "Sleep result",
    defaultHistoryLabel: "Sleep scenario",
    defaults: {
      bedtimeHour: 22,
      bedtimeMinute: 30,
      wakeHour: 6,
      wakeMinute: 45,
      fallAsleepMinutes: 15,
    },
    mainFields: [
      numberField("bedtimeHour", "Bedtime hour", 0, 23, 1),
      numberField("bedtimeMinute", "Bedtime minute", 0, 59, 1),
      numberField("wakeHour", "Wake hour", 0, 23, 1),
      numberField("wakeMinute", "Wake minute", 0, 59, 1),
      numberField("fallAsleepMinutes", "Time to fall asleep (minutes)", 0, 120, 1),
    ],
    advancedFields: [],
    validate() {
      return "";
    },
    compute(values) {
      const bedtime = values.bedtimeHour * 60 + values.bedtimeMinute + values.fallAsleepMinutes;
      let wake = values.wakeHour * 60 + values.wakeMinute;
      if (wake <= bedtime) wake += 1440;
      const sleepMinutes = wake - bedtime;
      const cycles = sleepMinutes / 90;

      return result("Sleep duration estimate", [
        card("Sleep duration", formatDurationMinutes(sleepMinutes)),
        card("Sleep cycles", formatConverted(cycles, 2)),
        card("Asleep by", formatClockMinutes(bedtime)),
      ], [
        plainBar("Bedtime", bedtime - values.fallAsleepMinutes, formatClockMinutes(bedtime - values.fallAsleepMinutes)),
        plainBar("Sleep onset", bedtime, formatClockMinutes(bedtime)),
        plainBar("Wake time", wake, formatClockMinutes(wake)),
      ], [], [
        note("Sleep cycles", `${formatConverted(cycles, 2)} cycles`),
      ]);
    },
  };
}

function makeWaterIntakeCalculatorConfig() {
  return {
    title: "Water Intake Calculator",
    actionLabel: "Estimate water intake",
    emptyState: "Estimate a daily water goal from body weight, activity, and climate.",
    summaryLabel: "Water intake estimate",
    defaultHistoryLabel: "Water intake scenario",
    defaults: {
      weight: 170,
      activityMinutes: 45,
      climateFactor: "1.1",
    },
    mainFields: [
      numberField("weight", "Body weight (lb)", 1, 1500, 1),
      numberField("activityMinutes", "Daily activity (minutes)", 0, 600, 5),
    ],
    advancedFields: [{ name: "climateFactor", label: "Climate", type: "select", options: WATER_CLIMATE_OPTIONS }],
    validate(values) {
      return values.weight <= 0 ? "Enter your body weight." : "";
    },
    compute(values) {
      const ounces = (values.weight * 0.5 + values.activityMinutes * 0.4) * Number(values.climateFactor || 1);
      const liters = ounces * 0.0295735;
      const cups = ounces / 8;

      return result("Daily water intake goal", [
        card("Liters", fixed(liters)),
        card("Ounces", fixed(ounces)),
        card("Cups", fixed(cups)),
      ], [
        plainBar("Body weight", values.weight, `${fixed(values.weight)} lb`),
        plainBar("Activity", values.activityMinutes, `${values.activityMinutes} min`),
        plainBar("Water target", liters, `${fixed(liters)} L`),
      ], [], [
        note("Climate", WATER_CLIMATE_OPTIONS.find((item) => item.value === values.climateFactor)?.label || "Climate"),
      ]);
    },
  };
}

function makeCaloriesBurnedCalculatorConfig() {
  return {
    title: "Calories Burned Calculator",
    actionLabel: "Calculate calories burned",
    emptyState: "Estimate calories burned from weight, duration, and activity intensity.",
    summaryLabel: "Calories burned estimate",
    defaultHistoryLabel: "Calories burned scenario",
    defaults: {
      weight: 170,
      durationMinutes: 45,
      activityMet: "7",
    },
    mainFields: [
      numberField("weight", "Body weight (lb)", 1, 1500, 1),
      numberField("durationMinutes", "Workout duration (minutes)", 1, 600, 1),
    ],
    advancedFields: [{ name: "activityMet", label: "Activity", type: "select", options: CALORIE_ACTIVITY_OPTIONS }],
    validate(values) {
      return values.weight <= 0 || values.durationMinutes <= 0 ? "Enter a valid weight and duration." : "";
    },
    compute(values) {
      const weightKg = values.weight * 0.45359237;
      const met = Number(values.activityMet || 7);
      const calories = 0.0175 * met * weightKg * values.durationMinutes;

      return result("Calories burned estimate", [
        card("Calories burned", fixed(calories)),
        card("Activity", CALORIE_ACTIVITY_OPTIONS.find((item) => item.value === values.activityMet)?.label || "Activity"),
        card("Duration", `${values.durationMinutes} min`),
      ], [
        plainBar("Body weight", values.weight, `${values.weight} lb`),
        plainBar("MET value", met, fixed(met)),
        plainBar("Calories burned", calories, `${fixed(calories)} kcal`),
      ], [], []);
    },
  };
}

function makeWaistToHeightRatioConfig() {
  return {
    title: "Waist-to-Height Ratio Calculator",
    actionLabel: "Calculate ratio",
    emptyState: "Compare waist size with height to estimate waist-to-height ratio.",
    summaryLabel: "Waist-to-height result",
    defaultHistoryLabel: "Waist-to-height scenario",
    defaults: {
      waist: 32,
      height: 68,
    },
    mainFields: [
      numberField("waist", "Waist circumference (in)", 1, 200, 0.1),
      numberField("height", "Height (in)", 1, 120, 0.1),
    ],
    advancedFields: [],
    validate(values) {
      return values.waist <= 0 || values.height <= 0 ? "Enter both waist and height." : "";
    },
    compute(values) {
      const ratio = values.waist / values.height;
      const band = ratio < 0.5 ? "Lower-risk range" : ratio < 0.6 ? "Elevated range" : "High-risk range";
      return result("Waist-to-height ratio", [
        card("Ratio", formatConverted(ratio, 3)),
        card("Percent of height", `${formatConverted(ratio * 100, 1)}%`),
        card("Range", band),
      ], [
        plainBar("Waist", values.waist, `${fixed(values.waist)} in`),
        plainBar("Height", values.height, `${fixed(values.height)} in`),
        plainBar("Ratio", ratio, formatConverted(ratio, 3)),
      ], [], [
        note("Range", band),
      ]);
    },
  };
}

function makePregnancyDueDateCalculatorConfig() {
  return {
    title: "Pregnancy Due Date Calculator",
    actionLabel: "Estimate due date",
    emptyState: "Estimate a pregnancy due date from the first day of the last period.",
    summaryLabel: "Due date estimate",
    defaultHistoryLabel: "Pregnancy due date scenario",
    defaults: {
      lastPeriodStart: shiftDate(todayString(), -56),
      cycleLength: 28,
    },
    mainFields: [
      dateField("lastPeriodStart", "First day of last period"),
      numberField("cycleLength", "Cycle length (days)", 20, 45, 1),
    ],
    advancedFields: [],
    validate(values) {
      return !values.lastPeriodStart ? "Choose the first day of the last period." : "";
    },
    compute(values) {
      const dueDate = shiftDate(values.lastPeriodStart, 280 + (values.cycleLength - 28));
      const conceptionDate = shiftDate(values.lastPeriodStart, 14 + (values.cycleLength - 28));
      const pregnantDays = Math.max(0, Math.floor((new Date(todayString()) - new Date(values.lastPeriodStart)) / 86400000));
      const weeks = Math.floor(pregnantDays / 7);
      const days = pregnantDays % 7;

      return result("Estimated due date", [
        card("Due date", formatDate(dueDate)),
        card("Estimated conception", formatDate(conceptionDate)),
        card("Pregnancy progress", `${weeks} weeks ${days} days`),
      ], [
        plainBar("Last period", pregnantDays, formatDate(values.lastPeriodStart)),
        plainBar("Cycle length", values.cycleLength, `${values.cycleLength} days`),
        plainBar("Due date", new Date(dueDate).getTime(), formatDate(dueDate)),
      ], [], []);
    },
  };
}

function makeConceptionDateCalculatorConfig() {
  return {
    title: "Conception Date Calculator",
    actionLabel: "Estimate conception",
    emptyState: "Estimate conception timing from an expected due date.",
    summaryLabel: "Conception date estimate",
    defaultHistoryLabel: "Conception date scenario",
    defaults: {
      dueDate: shiftDate(todayString(), 224),
    },
    mainFields: [dateField("dueDate", "Estimated due date")],
    advancedFields: [],
    validate(values) {
      return !values.dueDate ? "Choose a due date." : "";
    },
    compute(values) {
      const conceptionDate = shiftDate(values.dueDate, -266);
      const fertileWindowStart = shiftDate(conceptionDate, -2);
      const fertileWindowEnd = shiftDate(conceptionDate, 2);

      return result("Estimated conception timing", [
        card("Conception date", formatDate(conceptionDate)),
        card("Likely fertile window", `${formatDate(fertileWindowStart)} to ${formatDate(fertileWindowEnd)}`),
        card("Due date", formatDate(values.dueDate)),
      ], [
        plainBar("Due date", new Date(values.dueDate).getTime(), formatDate(values.dueDate)),
        plainBar("Conception", new Date(conceptionDate).getTime(), formatDate(conceptionDate)),
      ], [], []);
    },
  };
}

function makeBacCalculatorConfig() {
  return {
    title: "BAC Calculator",
    actionLabel: "Estimate BAC",
    emptyState: "Estimate blood alcohol concentration from drinks, body weight, and time.",
    summaryLabel: "BAC estimate",
    defaultHistoryLabel: "BAC scenario",
    defaults: {
      drinks: 3,
      weight: 170,
      hours: 2,
      sex: "male",
    },
    mainFields: [
      numberField("drinks", "Standard drinks", 0, 30, 0.5),
      numberField("weight", "Body weight (lb)", 1, 1500, 1),
      numberField("hours", "Hours since first drink", 0, 24, 0.1),
    ],
    advancedFields: [{ name: "sex", label: "Sex", type: "select", options: SEX_OPTIONS }],
    validate(values) {
      return values.weight <= 0 ? "Enter your body weight." : "";
    },
    compute(values) {
      const distribution = values.sex === "male" ? 0.73 : 0.66;
      const bac = Math.max(0, (values.drinks * 14 * 5.14) / (values.weight * distribution) - 0.015 * values.hours);
      const status = bac < 0.03 ? "Minimal impairment" : bac < 0.08 ? "Impaired" : "Over common legal limit";

      return result("Estimated BAC", [
        card("BAC", formatConverted(bac, 3)),
        card("Status", status),
        card("Drinks logged", fixed(values.drinks)),
      ], [
        plainBar("Drinks", values.drinks, `${fixed(values.drinks)} drinks`),
        plainBar("Body weight", values.weight, `${values.weight} lb`),
        plainBar("Estimated BAC", bac, formatConverted(bac, 3)),
      ], [], [
        note("Status", status),
        note("Important", "Estimate only, not a safety or legal guarantee"),
      ]);
    },
  };
}

function makePercentageOffCalculatorConfig() {
  return {
    title: "Percentage Off Calculator",
    actionLabel: "Calculate savings",
    emptyState: "Estimate the sale price, savings, and optional after-tax total from a percent-off discount.",
    summaryLabel: "Percentage off result",
    defaultHistoryLabel: "Percentage off scenario",
    defaults: {
      originalPrice: 120,
      percentOff: 25,
      salesTaxRate: 0,
      currency: "USD",
    },
    mainFields: [
      moneyField("originalPrice", "Original price", 1),
      percentField("percentOff", "Discount", 0, 100, 0.1),
      percentField("salesTaxRate", "Sales tax", 0, 30, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.originalPrice <= 0 ? "Enter the original price." : "";
    },
    compute(values) {
      const savings = values.originalPrice * (values.percentOff / 100);
      const salePrice = values.originalPrice - savings;
      const totalAfterTax = salePrice * (1 + values.salesTaxRate / 100);

      return result("Percentage discount result", [
        card("Sale price", moneyText(salePrice, values.currency, 2)),
        card("You save", moneyText(savings, values.currency, 2)),
        card("After-tax total", moneyText(totalAfterTax, values.currency, 2)),
      ], [
        moneyBar("Original price", values.originalPrice, values.currency, 2),
        moneyBar("Savings", savings, values.currency, 2),
        moneyBar("Sale price", salePrice, values.currency, 2),
        moneyBar("After-tax total", totalAfterTax, values.currency, 2),
      ], [], [
        note("Discount", percent(values.percentOff)),
      ]);
    },
  };
}

function makeDiscountCalculatorConfig() {
  return {
    title: "Discount Calculator",
    actionLabel: "Calculate discount",
    emptyState: "Measure discount amount and percentage between an original price and a sale price.",
    summaryLabel: "Discount result",
    defaultHistoryLabel: "Discount scenario",
    defaults: {
      originalPrice: 160,
      salePrice: 124,
      currency: "USD",
    },
    mainFields: [
      moneyField("originalPrice", "Original price", 1),
      moneyField("salePrice", "Sale price", 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      if (values.originalPrice <= 0) return "Enter the original price.";
      return values.salePrice < 0 ? "Sale price cannot be negative." : "";
    },
    compute(values) {
      const savings = values.originalPrice - values.salePrice;
      const discountRate = (savings / Math.max(values.originalPrice, 1)) * 100;
      return result("Discount comparison", [
        card("Savings", moneyText(savings, values.currency, 2)),
        card("Discount rate", percent(discountRate)),
        card("Sale price", moneyText(values.salePrice, values.currency, 2)),
      ], [
        moneyBar("Original price", values.originalPrice, values.currency, 2),
        moneyBar("Sale price", values.salePrice, values.currency, 2),
        moneyBar("Savings", savings, values.currency, 2),
      ], [], []);
    },
  };
}

function makeTipCalculatorConfig() {
  return {
    title: "Tip Calculator",
    actionLabel: "Calculate tip",
    emptyState: "Estimate tip, total bill, and per-person cost from one clean split.",
    summaryLabel: "Tip result",
    defaultHistoryLabel: "Tip scenario",
    defaults: {
      billAmount: 86,
      tipRate: 18,
      people: 2,
      currency: "USD",
    },
    mainFields: [
      moneyField("billAmount", "Bill amount", 1),
      percentField("tipRate", "Tip rate", 0, 50, 0.1),
      numberField("people", "People splitting the bill", 1, 50, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.billAmount <= 0 || values.people <= 0 ? "Enter a bill amount and at least one person." : "";
    },
    compute(values) {
      const tipAmount = values.billAmount * (values.tipRate / 100);
      const total = values.billAmount + tipAmount;
      const perPerson = total / Math.max(values.people, 1);
      return result("Tip and split result", [
        card("Tip amount", moneyText(tipAmount, values.currency, 2)),
        card("Total bill", moneyText(total, values.currency, 2)),
        card("Per person", moneyText(perPerson, values.currency, 2)),
      ], [
        moneyBar("Bill amount", values.billAmount, values.currency, 2),
        moneyBar("Tip amount", tipAmount, values.currency, 2),
        moneyBar("Total", total, values.currency, 2),
      ], [], [
        note("Split between", `${values.people} people`),
      ]);
    },
  };
}

function makeRentAffordabilityCalculatorConfig() {
  return {
    title: "Rent Affordability Calculator",
    actionLabel: "Estimate affordable rent",
    emptyState: "Estimate a monthly rent budget from annual income, debts, and your target rent share.",
    summaryLabel: "Rent affordability result",
    defaultHistoryLabel: "Rent affordability scenario",
    defaults: {
      annualIncome: 92000,
      monthlyDebt: 650,
      rentShare: 30,
      currency: "USD",
    },
    mainFields: [
      moneyField("annualIncome", "Annual income", 100),
      moneyField("monthlyDebt", "Monthly debt payments", 25),
      percentField("rentShare", "Target rent share", 10, 60, 0.5),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.annualIncome <= 0 ? "Enter annual income first." : "";
    },
    compute(values) {
      const monthlyIncome = values.annualIncome / 12;
      const grossRent = monthlyIncome * (values.rentShare / 100);
      const affordableRent = Math.max(0, grossRent - values.monthlyDebt);
      return result("Affordable monthly rent estimate", [
        card("Affordable rent", moneyText(affordableRent, values.currency)),
        card("Monthly income", moneyText(monthlyIncome, values.currency)),
        card("Housing rule", percent(values.rentShare)),
      ], [
        moneyBar("Monthly income", monthlyIncome, values.currency),
        moneyBar("Debt payments", values.monthlyDebt, values.currency),
        moneyBar("Rent budget", affordableRent, values.currency),
      ], [], []);
    },
  };
}

function makeBudgetCalculatorConfig() {
  return {
    title: "Budget Calculator",
    actionLabel: "Build budget",
    emptyState: "Add your main monthly expense buckets and see how much room is left.",
    summaryLabel: "Budget result",
    defaultHistoryLabel: "Budget scenario",
    defaults: {
      income: 6200,
      housing: 1900,
      transport: 420,
      food: 650,
      utilities: 280,
      other: 700,
      currency: "USD",
    },
    mainFields: [
      moneyField("income", "Monthly income", 50),
      moneyField("housing", "Housing", 25),
      moneyField("transport", "Transport", 25),
      moneyField("food", "Food", 25),
      moneyField("utilities", "Utilities", 25),
      moneyField("other", "Other spending", 25),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.income <= 0 ? "Enter monthly income." : "";
    },
    compute(values) {
      const expenses = values.housing + values.transport + values.food + values.utilities + values.other;
      const remaining = values.income - expenses;
      const savingsRate = (remaining / Math.max(values.income, 1)) * 100;

      return result("Monthly budget result", [
        card("Left over", moneyText(remaining, values.currency, 2)),
        card("Total expenses", moneyText(expenses, values.currency, 2)),
        card("Savings rate", percent(savingsRate)),
      ], [
        moneyBar("Income", values.income, values.currency, 2),
        moneyBar("Expenses", expenses, values.currency, 2),
        moneyBar("Left over", remaining, values.currency, 2),
      ], [], [
        note("Housing share", percent((values.housing / Math.max(values.income, 1)) * 100)),
      ]);
    },
  };
}

function makeNetWorthCalculatorConfig() {
  return {
    title: "Net Worth Calculator",
    actionLabel: "Calculate net worth",
    emptyState: "Add major assets and liabilities to estimate current net worth.",
    summaryLabel: "Net worth result",
    defaultHistoryLabel: "Net worth scenario",
    defaults: {
      cash: 18000,
      investments: 62000,
      retirement: 44000,
      property: 260000,
      debt: 120000,
      currency: "USD",
    },
    mainFields: [
      moneyField("cash", "Cash", 100),
      moneyField("investments", "Investments", 100),
      moneyField("retirement", "Retirement accounts", 100),
      moneyField("property", "Property equity", 100),
      moneyField("debt", "Total liabilities", 100),
    ],
    advancedFields: [currencyField()],
    validate() {
      return "";
    },
    compute(values) {
      const assets = values.cash + values.investments + values.retirement + values.property;
      const netWorth = assets - values.debt;
      return result("Net worth estimate", [
        card("Net worth", moneyText(netWorth, values.currency)),
        card("Assets", moneyText(assets, values.currency)),
        card("Liabilities", moneyText(values.debt, values.currency)),
      ], [
        moneyBar("Assets", assets, values.currency),
        moneyBar("Liabilities", values.debt, values.currency),
        moneyBar("Net worth", netWorth, values.currency),
      ], [], []);
    },
  };
}

function makeDividendCalculatorConfig() {
  return {
    title: "Dividend Calculator",
    actionLabel: "Calculate dividend income",
    emptyState: "Estimate annual and monthly dividend income from shares and dividend per share.",
    summaryLabel: "Dividend result",
    defaultHistoryLabel: "Dividend scenario",
    defaults: {
      shares: 240,
      pricePerShare: 48,
      annualDividendPerShare: 1.92,
      currency: "USD",
    },
    mainFields: [
      numberField("shares", "Number of shares", 0, 100000000, 1),
      moneyField("pricePerShare", "Price per share", 0.01),
      moneyField("annualDividendPerShare", "Annual dividend per share", 0.01),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.shares <= 0 ? "Enter the number of shares." : "";
    },
    compute(values) {
      const annualIncome = values.shares * values.annualDividendPerShare;
      const monthlyIncome = annualIncome / 12;
      const dividendYield = (values.annualDividendPerShare / Math.max(values.pricePerShare, 0.01)) * 100;

      return result("Dividend income estimate", [
        card("Annual dividend income", moneyText(annualIncome, values.currency, 2)),
        card("Monthly income", moneyText(monthlyIncome, values.currency, 2)),
        card("Dividend yield", percent(dividendYield)),
      ], [
        plainBar("Shares", values.shares, count(values.shares)),
        moneyBar("Annual dividend income", annualIncome, values.currency, 2),
        moneyBar("Monthly dividend income", monthlyIncome, values.currency, 2),
      ], [], []);
    },
  };
}

function makeRoiCalculatorConfig() {
  return {
    title: "ROI Calculator",
    actionLabel: "Calculate ROI",
    emptyState: "Measure return on investment from cost and total gain.",
    summaryLabel: "ROI result",
    defaultHistoryLabel: "ROI scenario",
    defaults: {
      cost: 5000,
      gain: 6800,
      currency: "USD",
    },
    mainFields: [
      moneyField("cost", "Investment cost", 100),
      moneyField("gain", "Ending value", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.cost <= 0 ? "Enter the investment cost." : "";
    },
    compute(values) {
      const profit = values.gain - values.cost;
      const roi = (profit / Math.max(values.cost, 1)) * 100;
      return result("Return on investment", [
        card("ROI", percent(roi)),
        card("Profit", moneyText(profit, values.currency)),
        card("Ending value", moneyText(values.gain, values.currency)),
      ], [
        moneyBar("Investment cost", values.cost, values.currency),
        moneyBar("Profit", profit, values.currency),
        moneyBar("Ending value", values.gain, values.currency),
      ], [], []);
    },
  };
}

function makeBreakEvenCalculatorConfig() {
  return {
    title: "Break Even Calculator",
    actionLabel: "Calculate break even",
    emptyState: "Estimate the units and revenue needed to cover fixed costs.",
    summaryLabel: "Break-even result",
    defaultHistoryLabel: "Break-even scenario",
    defaults: {
      fixedCosts: 12000,
      pricePerUnit: 85,
      variableCostPerUnit: 34,
      currency: "USD",
    },
    mainFields: [
      moneyField("fixedCosts", "Fixed costs", 100),
      moneyField("pricePerUnit", "Price per unit", 1),
      moneyField("variableCostPerUnit", "Variable cost per unit", 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      const contribution = values.pricePerUnit - values.variableCostPerUnit;
      return contribution <= 0 ? "Price per unit must be greater than variable cost per unit." : "";
    },
    compute(values) {
      const contribution = values.pricePerUnit - values.variableCostPerUnit;
      const units = values.fixedCosts / contribution;
      const revenue = units * values.pricePerUnit;
      return result("Break-even estimate", [
        card("Break-even units", fixed(units)),
        card("Break-even revenue", moneyText(revenue, values.currency)),
        card("Contribution per unit", moneyText(contribution, values.currency)),
      ], [
        moneyBar("Fixed costs", values.fixedCosts, values.currency),
        moneyBar("Contribution per unit", contribution, values.currency),
        moneyBar("Break-even revenue", revenue, values.currency),
      ], [], []);
    },
  };
}

function makeMarkupCalculatorConfig() {
  return {
    title: "Markup Calculator",
    actionLabel: "Calculate markup",
    emptyState: "Estimate selling price, profit, and margin from cost and markup percentage.",
    summaryLabel: "Markup result",
    defaultHistoryLabel: "Markup scenario",
    defaults: {
      cost: 42,
      markupPercent: 35,
      currency: "USD",
    },
    mainFields: [
      moneyField("cost", "Cost", 1),
      percentField("markupPercent", "Markup", 0, 500, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.cost <= 0 ? "Enter a cost value." : "";
    },
    compute(values) {
      const sellingPrice = values.cost * (1 + values.markupPercent / 100);
      const profit = sellingPrice - values.cost;
      const margin = (profit / Math.max(sellingPrice, 1)) * 100;
      return result("Markup result", [
        card("Selling price", moneyText(sellingPrice, values.currency, 2)),
        card("Profit", moneyText(profit, values.currency, 2)),
        card("Margin", percent(margin)),
      ], [
        moneyBar("Cost", values.cost, values.currency, 2),
        moneyBar("Selling price", sellingPrice, values.currency, 2),
        moneyBar("Profit", profit, values.currency, 2),
      ], [], []);
    },
  };
}

function makeAutoLeaseCalculatorConfig() {
  return {
    title: "Auto Lease Calculator",
    actionLabel: "Calculate lease",
    emptyState: "Estimate a monthly lease payment from vehicle price, residual value, and money factor.",
    summaryLabel: "Auto lease result",
    defaultHistoryLabel: "Auto lease scenario",
    defaults: {
      vehiclePrice: 42000,
      downPayment: 3000,
      residualPercent: 58,
      termMonths: 36,
      moneyFactor: 0.0022,
      currency: "USD",
    },
    mainFields: [
      moneyField("vehiclePrice", "Vehicle price", 100),
      moneyField("downPayment", "Down payment", 100),
      percentField("residualPercent", "Residual value", 20, 80, 0.1),
      numberField("termMonths", "Lease term (months)", 12, 84, 1),
      numberField("moneyFactor", "Money factor", 0, 0.02, 0.0001),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.vehiclePrice <= 0 || values.termMonths <= 0 ? "Enter the vehicle price and lease term." : "";
    },
    compute(values) {
      const adjustedCapCost = Math.max(0, values.vehiclePrice - values.downPayment);
      const residualValue = values.vehiclePrice * (values.residualPercent / 100);
      const depreciation = (adjustedCapCost - residualValue) / Math.max(values.termMonths, 1);
      const financeCharge = (adjustedCapCost + residualValue) * values.moneyFactor;
      const monthlyPayment = depreciation + financeCharge;

      return result("Estimated auto lease payment", [
        card("Monthly payment", moneyText(monthlyPayment, values.currency, 2)),
        card("Residual value", moneyText(residualValue, values.currency, 2)),
        card("Adjusted cap cost", moneyText(adjustedCapCost, values.currency, 2)),
      ], [
        moneyBar("Depreciation portion", depreciation, values.currency, 2),
        moneyBar("Finance charge", financeCharge, values.currency, 2),
        moneyBar("Monthly payment", monthlyPayment, values.currency, 2),
      ], [], []);
    },
  };
}

function makeMortgageRecastCalculatorConfig() {
  return {
    title: "Mortgage Recast Calculator",
    actionLabel: "Calculate recast",
    emptyState: "Estimate a new mortgage payment after applying a lump-sum recast payment.",
    summaryLabel: "Mortgage recast result",
    defaultHistoryLabel: "Mortgage recast scenario",
    defaults: {
      currentBalance: 280000,
      annualRate: 6.25,
      remainingYears: 24,
      lumpSum: 25000,
      currency: "USD",
    },
    mainFields: [
      moneyField("currentBalance", "Current balance", 100),
      percentField("annualRate", "Interest rate", 0, 100, 0.1),
      numberField("remainingYears", "Remaining term (years)", 1, 40, 1),
      moneyField("lumpSum", "Lump-sum payment", 100),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.currentBalance <= 0 ? "Enter the current balance." : "";
    },
    compute(values) {
      const months = values.remainingYears * 12;
      const currentPayment = getAmortizedPayment(values.currentBalance, values.annualRate, months);
      const recastBalance = Math.max(0, values.currentBalance - values.lumpSum);
      const recastPayment = getAmortizedPayment(recastBalance, values.annualRate, months);
      const interestBefore = currentPayment * months - values.currentBalance;
      const interestAfter = recastPayment * months - recastBalance;

      return result("Mortgage recast estimate", [
        card("New monthly payment", moneyText(recastPayment, values.currency, 2)),
        card("Payment reduction", moneyText(currentPayment - recastPayment, values.currency, 2)),
        card("Interest saved", moneyText(interestBefore - interestAfter, values.currency, 2)),
      ], [
        moneyBar("Current payment", currentPayment, values.currency, 2),
        moneyBar("Recast payment", recastPayment, values.currency, 2),
        moneyBar("Lump-sum payment", values.lumpSum, values.currency, 2),
      ], [], []);
    },
  };
}

function makeBiweeklyMortgageCalculatorConfig() {
  return {
    title: "Biweekly Mortgage Calculator",
    actionLabel: "Calculate biweekly mortgage",
    emptyState: "Compare a standard monthly mortgage with a biweekly payment schedule.",
    summaryLabel: "Biweekly mortgage result",
    defaultHistoryLabel: "Biweekly mortgage scenario",
    defaults: {
      loanAmount: 340000,
      annualRate: 6.4,
      years: 30,
      currency: "USD",
    },
    mainFields: [
      moneyField("loanAmount", "Loan amount", 100),
      percentField("annualRate", "Interest rate", 0, 100, 0.1),
      numberField("years", "Loan term (years)", 1, 40, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.loanAmount <= 0 ? "Enter the loan amount." : "";
    },
    compute(values) {
      const months = values.years * 12;
      const monthlyPayment = getAmortizedPayment(values.loanAmount, values.annualRate, months);
      const biweeklyPayment = (monthlyPayment * 12) / 26;
      const fasterMonthlyEquivalent = biweeklyPayment * 26 / 12;
      const payoffMonths = estimateLoanMonths(values.loanAmount, values.annualRate, fasterMonthlyEquivalent);
      const standardInterest = monthlyPayment * months - values.loanAmount;
      const fasterInterest = fasterMonthlyEquivalent * payoffMonths - values.loanAmount;

      return result("Biweekly mortgage comparison", [
        card("Biweekly payment", moneyText(biweeklyPayment, values.currency, 2)),
        card("Monthly equivalent", moneyText(fasterMonthlyEquivalent, values.currency, 2)),
        card("Interest saved", moneyText(standardInterest - fasterInterest, values.currency, 2)),
        card("Months saved", fixed(months - payoffMonths)),
      ], [
        moneyBar("Standard monthly payment", monthlyPayment, values.currency, 2),
        moneyBar("Biweekly payment", biweeklyPayment, values.currency, 2),
        moneyBar("Interest saved", standardInterest - fasterInterest, values.currency, 2),
      ], [], []);
    },
  };
}

function makeInterestOnlyMortgageCalculatorConfig() {
  return {
    title: "Interest Only Mortgage Calculator",
    actionLabel: "Calculate interest-only mortgage",
    emptyState: "Estimate the payment jump from an interest-only period into full amortization.",
    summaryLabel: "Interest-only mortgage result",
    defaultHistoryLabel: "Interest-only mortgage scenario",
    defaults: {
      loanAmount: 420000,
      annualRate: 6.5,
      totalYears: 30,
      interestOnlyYears: 5,
      currency: "USD",
    },
    mainFields: [
      moneyField("loanAmount", "Loan amount", 100),
      percentField("annualRate", "Interest rate", 0, 100, 0.1),
      numberField("totalYears", "Total term (years)", 1, 40, 1),
      numberField("interestOnlyYears", "Interest-only years", 0, 15, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.interestOnlyYears >= values.totalYears ? "Interest-only years must be less than the total loan term." : "";
    },
    compute(values) {
      const monthlyRate = values.annualRate / 100 / 12;
      const interestOnlyPayment = values.loanAmount * monthlyRate;
      const remainingMonths = (values.totalYears - values.interestOnlyYears) * 12;
      const amortizedPayment = getAmortizedPayment(values.loanAmount, values.annualRate, remainingMonths);
      const totalInterestOnlyPaid = interestOnlyPayment * values.interestOnlyYears * 12;

      return result("Interest-only mortgage estimate", [
        card("Interest-only payment", moneyText(interestOnlyPayment, values.currency, 2)),
        card("Payment after IO period", moneyText(amortizedPayment, values.currency, 2)),
        card("Interest paid during IO", moneyText(totalInterestOnlyPaid, values.currency, 2)),
      ], [
        moneyBar("Interest-only payment", interestOnlyPayment, values.currency, 2),
        moneyBar("Amortized payment", amortizedPayment, values.currency, 2),
        moneyBar("Interest paid during IO", totalInterestOnlyPaid, values.currency, 2),
      ], [], []);
    },
  };
}

function makeGovernmentLoanCalculatorConfig({
  title,
  fundingFeeRate,
  annualFeeRate,
  feeLabel,
  defaults,
}) {
  return {
    title,
    actionLabel: "Calculate loan",
    emptyState: "Estimate financed balance, monthly payment, and loan fees for a government-backed mortgage.",
    summaryLabel: `${title} estimate`,
    defaultHistoryLabel: `${title} scenario`,
    defaults,
    mainFields: [
      moneyField("loanAmount", "Home price", 100),
      moneyField("downPayment", "Down payment", 100),
      percentField("annualRate", "Interest rate", 0, 100, 0.1),
      numberField("years", "Loan term (years)", 1, 40, 1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.loanAmount <= 0 ? "Enter the home price." : "";
    },
    compute(values) {
      const baseLoan = Math.max(0, values.loanAmount - values.downPayment);
      const upfrontFee = baseLoan * (fundingFeeRate / 100);
      const financedLoan = baseLoan + upfrontFee;
      const basePayment = getAmortizedPayment(financedLoan, values.annualRate, values.years * 12);
      const monthlyFee = (baseLoan * (annualFeeRate / 100)) / 12;
      const totalPayment = basePayment + monthlyFee;

      return result(`${title} estimate`, [
        card("Monthly payment", moneyText(totalPayment, values.currency, 2)),
        card("Financed loan", moneyText(financedLoan, values.currency, 2)),
        card(feeLabel, moneyText(upfrontFee, values.currency, 2)),
      ], [
        moneyBar("Base loan", baseLoan, values.currency, 2),
        moneyBar(feeLabel, upfrontFee, values.currency, 2),
        moneyBar("Monthly payment", totalPayment, values.currency, 2),
      ], [], [
        note("Annual fee", annualFeeRate > 0 ? percent(annualFeeRate) : "None assumed"),
      ]);
    },
  };
}

function makeSolarPanelCalculatorConfig() {
  return {
    title: "Solar Panel Calculator",
    actionLabel: "Estimate solar system",
    emptyState: "Estimate system size and panel count from your bill and local sun hours.",
    summaryLabel: "Solar panel result",
    defaultHistoryLabel: "Solar panel scenario",
    defaults: {
      monthlyBill: 180,
      utilityRate: 0.16,
      sunHours: 5.2,
      panelWatts: 400,
      efficiency: 82,
    },
    mainFields: [
      moneyField("monthlyBill", "Monthly electric bill", 1),
      moneyField("utilityRate", "Utility rate per kWh", 0.01),
      numberField("sunHours", "Peak sun hours", 1, 12, 0.1),
      numberField("panelWatts", "Panel wattage", 100, 800, 5),
      percentField("efficiency", "System efficiency", 50, 100, 1),
    ],
    advancedFields: [],
    validate(values) {
      return values.monthlyBill <= 0 || values.utilityRate <= 0 ? "Enter the bill and utility rate." : "";
    },
    compute(values) {
      const monthlyUsage = values.monthlyBill / Math.max(values.utilityRate, 0.01);
      const dailyUsage = (monthlyUsage * 12) / 365;
      const efficiencyFactor = values.efficiency / 100;
      const systemKw = dailyUsage / Math.max(values.sunHours * efficiencyFactor, 0.1);
      const panelCount = Math.ceil((systemKw * 1000) / Math.max(values.panelWatts, 1));
      const annualOutput = systemKw * values.sunHours * 365 * efficiencyFactor;

      return result("Solar system estimate", [
        card("Recommended system size", `${fixed(systemKw)} kW`),
        card("Estimated panels", count(panelCount)),
        card("Annual production", `${count(annualOutput)} kWh`),
      ], [
        plainBar("Monthly usage", monthlyUsage, `${fixed(monthlyUsage)} kWh`),
        plainBar("System size", systemKw, `${fixed(systemKw)} kW`),
        plainBar("Panel count", panelCount, `${count(panelCount)} panels`),
      ], [], []);
    },
  };
}

function makeBtuCalculatorConfig() {
  return {
    title: "BTU Calculator",
    actionLabel: "Calculate BTU",
    emptyState: "Estimate cooling capacity from room size, ceiling height, insulation, and climate.",
    summaryLabel: "BTU result",
    defaultHistoryLabel: "BTU scenario",
    defaults: {
      length: 18,
      width: 14,
      ceilingHeight: 8,
      insulationFactor: "1",
      climateFactor: "1",
    },
    mainFields: [
      numberField("length", "Room length (ft)", 1, 500, 0.1),
      numberField("width", "Room width (ft)", 1, 500, 0.1),
      numberField("ceilingHeight", "Ceiling height (ft)", 6, 20, 0.1),
    ],
    advancedFields: [
      { name: "insulationFactor", label: "Insulation", type: "select", options: BTU_INSULATION_OPTIONS },
      { name: "climateFactor", label: "Climate", type: "select", options: BTU_CLIMATE_OPTIONS },
    ],
    validate(values) {
      return values.length <= 0 || values.width <= 0 ? "Enter room dimensions." : "";
    },
    compute(values) {
      const squareFeet = values.length * values.width;
      const heightFactor = values.ceilingHeight / 8;
      const btu = squareFeet * 20 * heightFactor * Number(values.insulationFactor || 1) * Number(values.climateFactor || 1);
      const tons = btu / 12000;

      return result("Cooling load estimate", [
        card("Recommended BTU/hr", count(btu)),
        card("Tons", formatConverted(tons, 2)),
        card("Room size", `${fixed(squareFeet)} sq ft`),
      ], [
        plainBar("Room size", squareFeet, `${fixed(squareFeet)} sq ft`),
        plainBar("Ceiling height", values.ceilingHeight, `${fixed(values.ceilingHeight)} ft`),
        plainBar("Estimated load", btu, `${count(btu)} BTU/hr`),
      ], [], []);
    },
  };
}

function buildValueListFields() {
  return NUMBER_LIST_FIELDS.map((field, index) =>
    numberField(field, `Value ${index + 1}`, -1000000000, 1000000000, 0.01),
  );
}

function getValueList(values) {
  return NUMBER_LIST_FIELDS.map((field) => Number(values[field] || 0));
}

function getMean(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
}

function getMedian(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function getModes(values) {
  const counts = new Map();
  values.forEach((value) => {
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  const highest = Math.max(...counts.values());
  if (highest <= 1) return [];
  return [...counts.entries()]
    .filter(([, countValue]) => countValue === highest)
    .map(([value]) => value);
}

function getStandardDeviation(values) {
  const mean = getMean(values);
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(values.length, 1);
  return Math.sqrt(variance);
}

function gradePointFromPercentage(score) {
  if (score >= 93) return 4;
  if (score >= 90) return 3.7;
  if (score >= 87) return 3.3;
  if (score >= 83) return 3;
  if (score >= 80) return 2.7;
  if (score >= 77) return 2.3;
  if (score >= 73) return 2;
  if (score >= 70) return 1.7;
  if (score >= 67) return 1.3;
  if (score >= 65) return 1;
  return 0;
}

function gradeLetterFromPercentage(score) {
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 65) return "D";
  return "F";
}

function computeFractionOperation(operation, first, second) {
  switch (operation) {
    case "subtract":
      return {
        numerator: first.numerator * second.denominator - second.numerator * first.denominator,
        denominator: first.denominator * second.denominator,
      };
    case "multiply":
      return {
        numerator: first.numerator * second.numerator,
        denominator: first.denominator * second.denominator,
      };
    case "divide":
      return {
        numerator: first.numerator * second.denominator,
        denominator: first.denominator * second.numerator,
      };
    case "add":
    default:
      return {
        numerator: first.numerator * second.denominator + second.numerator * first.denominator,
        denominator: first.denominator * second.denominator,
      };
  }
}

function simplifyFraction(numerator, denominator) {
  if (!denominator) return { numerator: 0, denominator: 1 };
  const sign = denominator < 0 ? -1 : 1;
  const normalizedNumerator = numerator * sign;
  const normalizedDenominator = Math.abs(denominator);
  const divisor = gcd(Math.abs(Math.round(normalizedNumerator)), Math.abs(Math.round(normalizedDenominator))) || 1;
  return {
    numerator: normalizedNumerator / divisor,
    denominator: normalizedDenominator / divisor,
  };
}

function fractionText(numerator, denominator) {
  const simplified = simplifyFraction(numerator, denominator);
  return `${simplified.numerator}/${simplified.denominator}`;
}

function mixedNumberText(numerator, denominator) {
  const simplified = simplifyFraction(numerator, denominator);
  const sign = simplified.numerator < 0 ? "-" : "";
  const absoluteNumerator = Math.abs(simplified.numerator);
  const whole = Math.floor(absoluteNumerator / simplified.denominator);
  const remainder = absoluteNumerator % simplified.denominator;
  if (remainder === 0) return `${sign}${whole}`;
  if (whole === 0) return `${sign}${remainder}/${simplified.denominator}`;
  return `${sign}${whole} ${remainder}/${simplified.denominator}`;
}

function toFractionFromMixed(whole, numerator, denominator) {
  const wholeValue = Number(whole || 0);
  const sign = wholeValue < 0 ? -1 : 1;
  const absoluteWhole = Math.abs(wholeValue);
  return {
    numerator: sign * (absoluteWhole * denominator + numerator),
    denominator,
  };
}

function normalizeClockMinutes(minutes) {
  return ((minutes % 1440) + 1440) % 1440;
}

function formatClockMinutes(minutes, { meridiem = true } = {}) {
  const normalized = normalizeClockMinutes(minutes);
  const hour24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  if (!meridiem) {
    return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function formatDurationMinutes(minutes) {
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const remainder = absolute % 60;
  return `${minutes < 0 ? "-" : ""}${hours}h ${remainder}m`;
}

function getAmortizedPayment(principal, annualRate, months) {
  if (!Number.isFinite(principal) || principal <= 0 || !Number.isFinite(months) || months <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function estimateLoanMonths(principal, annualRate, payment) {
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  let months = 0;

  while (balance > 0.01 && months < 1200) {
    const interest = balance * monthlyRate;
    const principalPaid = payment - interest;
    if (principalPaid <= 0) return 1200;
    balance -= principalPaid;
    months += 1;
  }

  return months;
}

function buildUnitMap(factors, labels) {
  return Object.fromEntries(
    Object.entries(labels).map(([key, label]) => [key, { label, factor: factors[key] }]),
  );
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

function formatConverted(value, precision = 4) {
  const number = Number.isFinite(value) ? value : 0;
  return number.toFixed(precision).replace(/\.?0+$/, "");
}

function decimalToFraction(value) {
  if (!Number.isFinite(value)) return "0";
  const sign = value < 0 ? -1 : 1;
  const absolute = Math.abs(value);
  let denominator = 1;
  while (Math.abs(Math.round(absolute * denominator) - absolute * denominator) > 1e-6 && denominator < 10000) {
    denominator += 1;
  }
  let numerator = Math.round(absolute * denominator);
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  return `${sign < 0 ? "-" : ""}${numerator}/${denominator}`;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function toRoman(number) {
  const numerals = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1],
  ];
  let value = number;
  let output = "";
  for (const [symbol, numeralValue] of numerals) {
    while (value >= numeralValue) {
      output += symbol;
      value -= numeralValue;
    }
  }
  return output;
}

function toSigFigs(value, figs) {
  if (value === 0) return "0";
  const multiplier = Math.pow(10, figs - Math.ceil(Math.log10(Math.abs(value))));
  return String(Math.round(value * multiplier) / multiplier);
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

function getCalendarDifference(start, end) {
  const earlier = new Date(start);
  const later = new Date(end);
  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(later.getFullYear(), later.getMonth(), 0).getDate();
    days += previousMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((later - earlier) / 86400000);
  return { years, months, days, totalDays };
}
