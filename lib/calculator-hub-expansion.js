import { clamp } from "./utils.js";

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (GBP)" },
  { value: "EUR", label: "EUR (EUR)" },
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

const STATE_LABELS = Object.fromEntries(STATE_OPTIONS.map((option) => [option.value, option.label]));

const METRO_PROFILES = {
  "new-york-city": { label: "New York City", overall: 1.38, rent: 1.62, groceries: 1.18, utilities: 1.08, childcare: 1.34, homePrice: 1.76, commute: 1.16, salary: 1.18 },
  "san-francisco": { label: "San Francisco", overall: 1.42, rent: 1.71, groceries: 1.23, utilities: 1.12, childcare: 1.38, homePrice: 1.88, commute: 1.11, salary: 1.24 },
  "los-angeles": { label: "Los Angeles", overall: 1.26, rent: 1.43, groceries: 1.16, utilities: 1.1, childcare: 1.22, homePrice: 1.56, commute: 1.13, salary: 1.11 },
  boston: { label: "Boston", overall: 1.28, rent: 1.48, groceries: 1.14, utilities: 1.07, childcare: 1.26, homePrice: 1.62, commute: 1.08, salary: 1.14 },
  seattle: { label: "Seattle", overall: 1.21, rent: 1.32, groceries: 1.1, utilities: 1.06, childcare: 1.2, homePrice: 1.48, commute: 1.05, salary: 1.13 },
  chicago: { label: "Chicago", overall: 1.09, rent: 1.16, groceries: 1.04, utilities: 1.03, childcare: 1.09, homePrice: 1.18, commute: 1.05, salary: 1.03 },
  denver: { label: "Denver", overall: 1.14, rent: 1.24, groceries: 1.05, utilities: 1.01, childcare: 1.11, homePrice: 1.28, commute: 1.02, salary: 1.05 },
  austin: { label: "Austin", overall: 1.07, rent: 1.15, groceries: 1.01, utilities: 1.02, childcare: 1.04, homePrice: 1.22, commute: 1.02, salary: 1.04 },
  dallas: { label: "Dallas", overall: 0.97, rent: 0.99, groceries: 0.98, utilities: 1.01, childcare: 0.96, homePrice: 1.03, commute: 0.99, salary: 0.98 },
  atlanta: { label: "Atlanta", overall: 0.95, rent: 0.97, groceries: 0.96, utilities: 0.99, childcare: 0.93, homePrice: 1.01, commute: 0.98, salary: 0.97 },
  charlotte: { label: "Charlotte", overall: 0.91, rent: 0.92, groceries: 0.95, utilities: 0.98, childcare: 0.9, homePrice: 0.97, commute: 0.94, salary: 0.94 },
  phoenix: { label: "Phoenix", overall: 0.96, rent: 1.01, groceries: 0.97, utilities: 1.03, childcare: 0.95, homePrice: 1.06, commute: 0.97, salary: 0.96 },
  miami: { label: "Miami", overall: 1.12, rent: 1.28, groceries: 1.08, utilities: 1.05, childcare: 1.08, homePrice: 1.24, commute: 1.04, salary: 1.01 },
  nashville: { label: "Nashville", overall: 0.94, rent: 0.95, groceries: 0.96, utilities: 0.99, childcare: 0.91, homePrice: 1.0, commute: 0.95, salary: 0.95 },
  minneapolis: { label: "Minneapolis", overall: 0.98, rent: 0.99, groceries: 0.99, utilities: 1.04, childcare: 0.97, homePrice: 1.02, commute: 0.96, salary: 0.99 },
};

const METRO_OPTIONS = Object.entries(METRO_PROFILES).map(([value, item]) => ({ value, label: item.label }));

const ROLE_PROFILES = {
  "software-engineer": { label: "Software Engineer", salary: 140000, bonusRate: 0.1 },
  "product-manager": { label: "Product Manager", salary: 135000, bonusRate: 0.11 },
  "data-analyst": { label: "Data Analyst", salary: 95000, bonusRate: 0.07 },
  "marketing-manager": { label: "Marketing Manager", salary: 108000, bonusRate: 0.09 },
  "sales-manager": { label: "Sales Manager", salary: 122000, bonusRate: 0.16 },
  designer: { label: "Product Designer", salary: 98000, bonusRate: 0.07 },
  accountant: { label: "Senior Accountant", salary: 88000, bonusRate: 0.06 },
  "project-manager": { label: "Project Manager", salary: 102000, bonusRate: 0.08 },
  nurse: { label: "Registered Nurse", salary: 86000, bonusRate: 0.05 },
  teacher: { label: "Teacher", salary: 64000, bonusRate: 0.03 },
  "customer-success-manager": { label: "Customer Success Manager", salary: 92000, bonusRate: 0.08 },
  "operations-manager": { label: "Operations Manager", salary: 104000, bonusRate: 0.08 },
};

const ROLE_OPTIONS = Object.entries(ROLE_PROFILES).map(([value, item]) => ({ value, label: item.label }));

const EXPERIENCE_OPTIONS = [
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

const MATERIAL_TIER_OPTIONS = [
  { value: "value", label: "Value grade" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
];

const COMPLEXITY_OPTIONS = [
  { value: "simple", label: "Simple install" },
  { value: "typical", label: "Typical install" },
  { value: "complex", label: "Complex install" },
];

const MOVE_DISTANCE_OPTIONS = [
  { value: "local", label: "Local move" },
  { value: "regional", label: "Regional move" },
  { value: "cross-country", label: "Cross-country move" },
  { value: "international", label: "International move" },
];

const FILING_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married filing jointly" },
];

const ROOM_FINISH_OPTIONS = [
  { value: "refresh", label: "Refresh" },
  { value: "midrange", label: "Midrange" },
  { value: "upscale", label: "Upscale" },
];

const LOAN_TERM_OPTIONS = [
  { value: 15, label: "15 years" },
  { value: 20, label: "20 years" },
  { value: 30, label: "30 years" },
];

const YEAR_OPTIONS = [
  { value: 2023, label: "2023" },
  { value: 2024, label: "2024" },
  { value: 2025, label: "2025" },
  { value: 2026, label: "2026" },
  { value: 2027, label: "2027" },
  { value: 2028, label: "2028" },
];

const ROOF_MATERIAL_OPTIONS = [
  { value: "asphalt", label: "Asphalt shingles" },
  { value: "metal", label: "Metal roofing" },
  { value: "tile", label: "Tile roofing" },
];

const SIDING_MATERIAL_OPTIONS = [
  { value: "vinyl", label: "Vinyl siding" },
  { value: "fiber-cement", label: "Fiber cement" },
  { value: "wood", label: "Engineered wood" },
];

const WINDOW_STYLE_OPTIONS = [
  { value: "single", label: "Single-hung" },
  { value: "double", label: "Double-hung" },
  { value: "picture", label: "Picture window" },
];

const WATER_HEATER_OPTIONS = [
  { value: "standard", label: "Standard tank" },
  { value: "high-efficiency", label: "High-efficiency tank" },
  { value: "tankless", label: "Tankless" },
];

const HVAC_OPTIONS = [
  { value: "split", label: "Split system" },
  { value: "heat-pump", label: "Heat pump" },
  { value: "packaged", label: "Packaged system" },
];

const SOLAR_OPTIONS = [
  { value: "starter", label: "Starter system" },
  { value: "family", label: "Family system" },
  { value: "high-output", label: "High-output system" },
];

const MORTGAGE_PROGRAM_OPTIONS = [
  { value: "conventional", label: "Conventional" },
  { value: "fha", label: "FHA" },
  { value: "va", label: "VA" },
  { value: "usda", label: "USDA" },
];

const VERY_HIGH_COST_STATES = new Set(["ca", "ny", "nj", "ma", "hi"]);
const HIGH_COST_STATES = new Set(["wa", "co", "md", "or", "ct", "va", "nh", "ri"]);
const LOW_COST_STATES = new Set(["al", "ar", "ia", "ks", "ky", "ms", "mo", "ne", "ok", "sc", "sd", "tn", "wv"]);

const VERY_HIGH_HOME_COST_STATES = new Set(["ca", "ma", "hi", "ny", "nj", "wa"]);
const HIGH_HOME_COST_STATES = new Set(["co", "ct", "md", "or", "ut", "va"]);
const LOW_HOME_COST_STATES = new Set(["al", "ar", "ia", "ks", "ky", "ms", "mo", "ok", "wv"]);

const NO_INCOME_TAX_STATES = new Set(["ak", "fl", "nv", "sd", "tn", "tx", "wa", "wy", "nh"]);
const HIGH_INCOME_TAX_STATES = new Set(["ca", "ny", "nj", "or", "mn", "hi"]);
const MID_INCOME_TAX_STATES = new Set(["ct", "ma", "md", "vt", "ri", "me", "wi"]);
const LOW_INCOME_TAX_STATES = new Set(["az", "co", "il", "in", "ky", "mi", "nc", "pa", "ut"]);

const NO_SALES_TAX_STATES = new Set(["de", "mt", "nh", "or"]);
const HIGH_SALES_TAX_STATES = new Set(["ca", "la", "tn", "wa", "il", "tx"]);
const MID_SALES_TAX_STATES = new Set(["az", "fl", "ga", "ks", "nv", "nj", "ny", "pa"]);

const HIGH_PROPERTY_TAX_STATES = new Set(["tx", "nj", "il", "ct", "nh", "vt", "wi", "ne", "ia", "ks"]);
const LOW_PROPERTY_TAX_STATES = new Set(["hi", "al", "co", "ca", "sc", "de", "la", "wv"]);

const RETIREMENT_FRIENDLY_STATES = new Set(["fl", "tn", "tx", "nh", "pa", "ms", "nv"]);
const SOCIAL_SECURITY_EXEMPT_STATES = new Set([
  "al",
  "ak",
  "az",
  "ca",
  "fl",
  "ga",
  "hi",
  "id",
  "il",
  "la",
  "ma",
  "mi",
  "ms",
  "nc",
  "nh",
  "nj",
  "nv",
  "ny",
  "oh",
  "ok",
  "or",
  "pa",
  "sc",
  "sd",
  "tn",
  "tx",
  "va",
  "wa",
  "wi",
  "wy",
]);

const RELOCATION_DEFINITIONS = [
  { title: "City vs City Cost of Living Comparison", categorySlug: "cost-of-living", badge: "City compare", template: "metro-comparison", factorKey: "overall", baseLabel: "Current monthly spend", baseDefault: 4200 },
  { title: "Salary Needed by City", categorySlug: "cost-of-living", badge: "Salary move", template: "salary-needed", baseLabel: "Current annual salary", baseDefault: 92000 },
  { title: "Rent Comparison by City", categorySlug: "cost-of-living", badge: "Rent compare", template: "metro-comparison", factorKey: "rent", baseLabel: "Current monthly rent", baseDefault: 2100 },
  { title: "Grocery Basket Comparison by City", categorySlug: "cost-of-living", badge: "Grocery compare", template: "metro-comparison", factorKey: "groceries", baseLabel: "Current monthly grocery spend", baseDefault: 760 },
  { title: "Utilities Cost Comparison by City", categorySlug: "cost-of-living", badge: "Utilities", template: "metro-comparison", factorKey: "utilities", baseLabel: "Current monthly utilities", baseDefault: 240 },
  { title: "Childcare Cost Comparison by City", categorySlug: "cost-of-living", badge: "Childcare", template: "metro-comparison", factorKey: "childcare", baseLabel: "Current monthly childcare spend", baseDefault: 1350 },
  { title: "Home Price Comparison by City", categorySlug: "cost-of-living", badge: "Home value", template: "metro-value-comparison", factorKey: "homePrice", baseLabel: "Reference home price", baseDefault: 450000 },
  { title: "Property Tax Comparison by State", categorySlug: "cost-of-living", badge: "Property tax", template: "state-property-comparison", baseLabel: "Reference home price", baseDefault: 450000 },
  { title: "Commute Cost Comparison by City", categorySlug: "cost-of-living", badge: "Commute", template: "metro-comparison", factorKey: "commute", baseLabel: "Current monthly commute spend", baseDefault: 420 },
  { title: "Relocation Budget Planner", categorySlug: "cost-of-living", badge: "Move plan", template: "relocation-planner" },
  { title: "Salary After Relocation Estimator", categorySlug: "cost-of-living", badge: "Relocation pay", template: "relocation-planner", salaryFocused: true },
  { title: "Metro vs Suburb Cost Comparison", categorySlug: "cost-of-living", badge: "Metro compare", template: "metro-comparison", factorKey: "overall", metroA: "new-york-city", metroB: "charlotte", baseLabel: "Monthly living spend", baseDefault: 4300 },
  { title: "Family of 4 Budget by City", categorySlug: "cost-of-living", badge: "Family budget", template: "metro-budget", householdFactor: 1.85 },
  { title: "Single-Person Budget by City", categorySlug: "cost-of-living", badge: "Solo budget", template: "metro-budget", householdFactor: 1.0 },
  { title: "Retiree Cost of Living Comparison", categorySlug: "cost-of-living", badge: "Retiree", template: "metro-budget", householdFactor: 1.12 },
  { title: "Student Budget by City", categorySlug: "cost-of-living", badge: "Student budget", template: "metro-budget", householdFactor: 0.78 },
  { title: "Remote Salary Adjustment Tool", categorySlug: "cost-of-living", badge: "Remote pay", template: "salary-needed", remoteMode: true, baseLabel: "Current annual salary", baseDefault: 98000 },
  { title: "Cost of Living Adjusted Salary Benchmark", categorySlug: "cost-of-living", badge: "Adjusted pay", template: "salary-needed", baseLabel: "Current annual salary", baseDefault: 102000 },
  { title: "International Move Cost Planner", categorySlug: "cost-of-living", badge: "Intl move", template: "relocation-planner", internationalMode: true },
  { title: "Affordable Cities Budget Checker", categorySlug: "cost-of-living", badge: "Budget check", template: "metro-budget", householdFactor: 1.0, affordabilityMode: true },
];

const SALARY_DEFINITIONS = [
  { title: "Salary by Role Calculator", categorySlug: "salary-data", badge: "Role pay", template: "salary-benchmark" },
  { title: "Salary by Role and State", categorySlug: "salary-data", badge: "State pay", template: "salary-benchmark" },
  { title: "Salary by Role and Metro", categorySlug: "salary-data", badge: "Metro pay", template: "salary-benchmark", includeMetro: true },
  { title: "Hourly Monthly Yearly Pay Converter", categorySlug: "salary-data", badge: "Pay cadence", template: "salary-benchmark", mode: "converter" },
  { title: "Paycheck by Salary and State", categorySlug: "salary-data", badge: "Paycheck", template: "paycheck-state" },
  { title: "Salary Percentile by Role", categorySlug: "salary-data", badge: "Percentile", template: "salary-percentile" },
  { title: "Remote vs Onsite Pay Comparison", categorySlug: "salary-data", badge: "Compare pay", template: "comp-comparison", labels: ["Remote", "Onsite"] },
  { title: "Entry Mid Senior Salary Bands", categorySlug: "salary-data", badge: "Bands", template: "salary-benchmark", mode: "bands" },
  { title: "Contractor vs Employee Pay Comparison", categorySlug: "salary-data", badge: "Work model", template: "contract-vs-employee" },
  { title: "Freelance Rate Benchmark by Role", categorySlug: "salary-data", badge: "Freelance rate", template: "salary-benchmark", mode: "freelance" },
  { title: "Bonus Benchmark by Role", categorySlug: "salary-data", badge: "Bonus", template: "salary-benchmark", mode: "bonus" },
  { title: "Commission Income Planner", categorySlug: "salary-data", badge: "Commission", template: "commission-plan" },
  { title: "Total Compensation Calculator", categorySlug: "salary-data", badge: "Total comp", template: "total-comp" },
  { title: "Raise Benchmark Tool", categorySlug: "salary-data", badge: "Raise", template: "raise-benchmark" },
  { title: "Overtime Earnings Planner", categorySlug: "salary-data", badge: "Overtime", template: "overtime-plan" },
  { title: "Shift Differential Pay Tool", categorySlug: "salary-data", badge: "Shift pay", template: "shift-diff" },
  { title: "Job Offer Comparison Tool", categorySlug: "salary-data", badge: "Offer compare", template: "comp-comparison", labels: ["Offer A", "Offer B"] },
  { title: "Cost of Living Adjusted Salary Comparison", categorySlug: "salary-data", badge: "Adjusted pay", template: "salary-adjusted-compare" },
  { title: "Part-Time vs Full-Time Earnings", categorySlug: "salary-data", badge: "Hours compare", template: "part-full" },
  { title: "Salary Trend by Year", categorySlug: "salary-data", badge: "Trend", template: "salary-trend" },
];

const HOME_COST_DEFINITIONS = [
  { title: "Roof Replacement Cost Estimator", categorySlug: "home-costs", badge: "Roof cost", template: "project-cost", unitLabel: "Roof area (sq ft)", baseCost: 6.8 },
  { title: "Roof Cost by State", categorySlug: "home-costs", badge: "Roof state", template: "project-cost", unitLabel: "Roof area (sq ft)", baseCost: 6.6 },
  { title: "Roof Cost by Square Foot", categorySlug: "home-costs", badge: "Roof size", template: "project-cost", unitLabel: "Roof area (sq ft)", baseCost: 6.5 },
  { title: "Roof Cost by Material", categorySlug: "home-costs", badge: "Roof material", template: "project-cost", unitLabel: "Roof area (sq ft)", baseCost: 6.4, materialOptions: ROOF_MATERIAL_OPTIONS, materialProfile: "roof" },
  { title: "Siding Cost by Material", categorySlug: "home-costs", badge: "Siding", template: "project-cost", unitLabel: "Exterior wall area (sq ft)", baseCost: 8.1, materialOptions: SIDING_MATERIAL_OPTIONS, materialProfile: "siding" },
  { title: "Window Replacement Cost Estimator", categorySlug: "home-costs", badge: "Windows", template: "system-cost", quantityLabel: "Number of windows", defaultQuantity: 12, baseUnitCost: 780, typeOptions: WINDOW_STYLE_OPTIONS, typeProfile: "windows" },
  { title: "Exterior Paint Cost Estimator", categorySlug: "home-costs", badge: "Exterior paint", template: "project-cost", unitLabel: "Paintable exterior area (sq ft)", baseCost: 1.95 },
  { title: "Interior Room Paint Cost Estimator", categorySlug: "home-costs", badge: "Interior paint", template: "project-cost", unitLabel: "Paintable wall area (sq ft)", baseCost: 1.55 },
  { title: "Concrete Slab Cost by Size", categorySlug: "home-costs", badge: "Concrete", template: "project-cost", unitLabel: "Slab area (sq ft)", baseCost: 9.3 },
  { title: "Fence Installation Cost Estimator", categorySlug: "home-costs", badge: "Fence", template: "project-cost", unitLabel: "Fence length (linear ft)", baseCost: 42 },
  { title: "Deck Build Cost Estimator", categorySlug: "home-costs", badge: "Decking", template: "project-cost", unitLabel: "Deck area (sq ft)", baseCost: 38 },
  { title: "Flooring Installation Cost Estimator", categorySlug: "home-costs", badge: "Flooring", template: "project-cost", unitLabel: "Floor area (sq ft)", baseCost: 8.4 },
  { title: "Tile Installation Cost Estimator", categorySlug: "home-costs", badge: "Tile", template: "project-cost", unitLabel: "Tile area (sq ft)", baseCost: 10.5 },
  { title: "Drywall Installation Cost Estimator", categorySlug: "home-costs", badge: "Drywall", template: "project-cost", unitLabel: "Drywall area (sq ft)", baseCost: 2.95 },
  { title: "Insulation Cost by Square Foot", categorySlug: "home-costs", badge: "Insulation", template: "project-cost", unitLabel: "Insulated area (sq ft)", baseCost: 1.85 },
  { title: "Water Heater Replacement Cost", categorySlug: "home-costs", badge: "Water heater", template: "system-cost", quantityLabel: "Number of units", defaultQuantity: 1, baseUnitCost: 2200, typeOptions: WATER_HEATER_OPTIONS, typeProfile: "water-heater" },
  { title: "HVAC Replacement Cost Estimator", categorySlug: "home-costs", badge: "HVAC", template: "system-cost", quantityLabel: "Home size (sq ft / 1000)", defaultQuantity: 2.2, baseUnitCost: 5200, typeOptions: HVAC_OPTIONS, typeProfile: "hvac" },
  { title: "Bathroom Remodel Cost Estimator", categorySlug: "home-costs", badge: "Bathroom", template: "remodel-cost", sizeLabel: "Bathroom size (sq ft)", defaultSize: 70, roomType: "bathroom", baseCostPerSqFt: 255 },
  { title: "Kitchen Remodel Cost Estimator", categorySlug: "home-costs", badge: "Kitchen", template: "remodel-cost", sizeLabel: "Kitchen size (sq ft)", defaultSize: 180, roomType: "kitchen", baseCostPerSqFt: 305 },
  { title: "Solar Panel Installation Cost", categorySlug: "home-costs", badge: "Solar", template: "system-cost", quantityLabel: "System size (kW)", defaultQuantity: 7.2, baseUnitCost: 2850, typeOptions: SOLAR_OPTIONS, typeProfile: "solar" },
];

const MORTGAGE_DEFINITIONS = [
  { title: "Mortgage Payment by Home Price", categorySlug: "mortgage-data", badge: "Mortgage", template: "mortgage-payment" },
  { title: "House Affordability by Income", categorySlug: "mortgage-data", badge: "Affordability", template: "affordability" },
  { title: "Down Payment Estimator", categorySlug: "mortgage-data", badge: "Down payment", template: "mortgage-payment", downPaymentMode: true },
  { title: "Closing Costs by State", categorySlug: "mortgage-data", badge: "Closing costs", template: "closing-costs" },
  { title: "Refinance Savings Calculator", categorySlug: "mortgage-data", badge: "Refinance", template: "refinance" },
  { title: "Cash-Out Refinance Estimator", categorySlug: "mortgage-data", badge: "Cash-out", template: "refinance", cashOutMode: true },
  { title: "Rate Buydown Savings Calculator", categorySlug: "mortgage-data", badge: "Buydown", template: "buydown" },
  { title: "PMI Cost Calculator", categorySlug: "mortgage-data", badge: "PMI", template: "mortgage-payment", pmiMode: true },
  { title: "ARM vs Fixed Mortgage Comparison", categorySlug: "mortgage-data", badge: "ARM vs fixed", template: "mortgage-compare", compareMode: "arm-fixed" },
  { title: "FHA vs Conventional Loan Comparison", categorySlug: "mortgage-data", badge: "Loan compare", template: "mortgage-compare", compareMode: "fha-conventional" },
  { title: "VA Loan Payment Estimator", categorySlug: "mortgage-data", badge: "VA loan", template: "mortgage-payment", program: "va" },
  { title: "USDA Loan Payment Estimator", categorySlug: "mortgage-data", badge: "USDA loan", template: "mortgage-payment", program: "usda" },
  { title: "HELOC Payment Calculator", categorySlug: "mortgage-data", badge: "HELOC", template: "heloc" },
  { title: "Home Equity Loan Comparison", categorySlug: "mortgage-data", badge: "Equity compare", template: "mortgage-compare", compareMode: "heloc-vs-fixed" },
  { title: "Mortgage Recast Planner", categorySlug: "mortgage-data", badge: "Recast", template: "recast" },
  { title: "Extra Payment Payoff Tool", categorySlug: "mortgage-data", badge: "Payoff", template: "extra-payment" },
  { title: "Credit Score Mortgage Rate Impact", categorySlug: "mortgage-data", badge: "Rate impact", template: "credit-impact" },
  { title: "Debt-to-Income Approval Checker", categorySlug: "mortgage-data", badge: "DTI", template: "dti-checker" },
  { title: "Rent vs Buy Home Model", categorySlug: "mortgage-data", badge: "Rent vs buy", template: "housing-decision", decisionMode: "rent-buy" },
  { title: "Buy Now vs Wait Comparison", categorySlug: "mortgage-data", badge: "Timing", template: "housing-decision", decisionMode: "buy-now-wait" },
];

const TAX_BUDGET_DEFINITIONS = [
  { title: "State Income Tax Estimator", categorySlug: "tax-budget", badge: "State tax", template: "state-tax", mode: "income" },
  { title: "State Sales Tax Lookup", categorySlug: "tax-budget", badge: "Sales tax", template: "state-tax", mode: "sales" },
  { title: "Retirement Tax by State", categorySlug: "tax-budget", badge: "Retirement tax", template: "state-tax", mode: "retirement" },
  { title: "Social Security Tax by State", categorySlug: "tax-budget", badge: "SS tax", template: "state-tax", mode: "social-security" },
  { title: "Tax Refund Estimator", categorySlug: "tax-budget", badge: "Refund", template: "refund" },
  { title: "W-4 Withholding Planner", categorySlug: "tax-budget", badge: "Withholding", template: "withholding" },
  { title: "Paycheck Breakdown by State", categorySlug: "tax-budget", badge: "Paycheck", template: "state-tax", mode: "paycheck" },
  { title: "1099 Tax Estimator", categorySlug: "tax-budget", badge: "1099 tax", template: "self-employment", mode: "1099" },
  { title: "Self-Employment Tax Planner", categorySlug: "tax-budget", badge: "SE tax", template: "self-employment", mode: "self-employment" },
  { title: "Capital Gains Tax by State", categorySlug: "tax-budget", badge: "Capital gains", template: "state-tax", mode: "capital-gains" },
  { title: "RMD Tax Estimator", categorySlug: "tax-budget", badge: "RMD", template: "state-tax", mode: "rmd" },
  { title: "Bonus Tax Estimator", categorySlug: "tax-budget", badge: "Bonus tax", template: "state-tax", mode: "bonus" },
  { title: "Monthly Budget Planner", categorySlug: "tax-budget", badge: "Budget", template: "budget-planner", householdFactor: 1.0 },
  { title: "Family Budget Planner", categorySlug: "tax-budget", badge: "Family budget", template: "budget-planner", householdFactor: 1.75 },
  { title: "Couples Budget Planner", categorySlug: "tax-budget", badge: "Couples budget", template: "budget-planner", householdFactor: 1.34 },
  { title: "Paycheck Budget Planner", categorySlug: "tax-budget", badge: "Paycheck budget", template: "budget-planner", householdFactor: 1.0, paycheckMode: true },
  { title: "Zero-Based Budget Planner", categorySlug: "tax-budget", badge: "Zero-based", template: "budget-planner", householdFactor: 1.0, zeroBased: true },
  { title: "Debt Payoff Planner", categorySlug: "tax-budget", badge: "Debt payoff", template: "debt-payoff" },
  { title: "Emergency Fund Planner", categorySlug: "tax-budget", badge: "Emergency fund", template: "emergency-fund" },
  { title: "Net Worth Tracker", categorySlug: "tax-budget", badge: "Net worth", template: "net-worth" },
];

const HUB_DEFINITIONS = [
  ...RELOCATION_DEFINITIONS,
  ...SALARY_DEFINITIONS,
  ...HOME_COST_DEFINITIONS,
  ...MORTGAGE_DEFINITIONS,
  ...TAX_BUDGET_DEFINITIONS,
];

export const GROWTH_HUB_CALCULATOR_CONFIGS = Object.fromEntries(
  HUB_DEFINITIONS.map((definition) => [slugify(definition.title), buildHubCalculator(definition)]),
);

function buildHubCalculator(definition) {
  switch (definition.template) {
    case "metro-comparison":
      return makeMetroComparisonConfig(definition);
    case "metro-value-comparison":
      return makeMetroValueComparisonConfig(definition);
    case "salary-needed":
      return makeSalaryNeededConfig(definition);
    case "state-property-comparison":
      return makeStatePropertyComparisonConfig(definition);
    case "metro-budget":
      return makeMetroBudgetConfig(definition);
    case "relocation-planner":
      return makeRelocationPlannerConfig(definition);
    case "salary-benchmark":
      return makeSalaryBenchmarkConfig(definition);
    case "salary-percentile":
      return makeSalaryPercentileConfig(definition);
    case "paycheck-state":
      return makePaycheckStateConfig(definition);
    case "comp-comparison":
      return makeCompComparisonConfig(definition);
    case "contract-vs-employee":
      return makeContractVsEmployeeConfig(definition);
    case "commission-plan":
      return makeCommissionPlanConfig(definition);
    case "total-comp":
      return makeTotalCompConfig(definition);
    case "raise-benchmark":
      return makeRaiseBenchmarkConfig(definition);
    case "overtime-plan":
      return makeOvertimePlanConfig(definition);
    case "shift-diff":
      return makeShiftDiffConfig(definition);
    case "salary-adjusted-compare":
      return makeSalaryAdjustedCompareConfig(definition);
    case "part-full":
      return makePartFullConfig(definition);
    case "salary-trend":
      return makeSalaryTrendConfig(definition);
    case "project-cost":
      return makeProjectCostConfig(definition);
    case "system-cost":
      return makeSystemCostConfig(definition);
    case "remodel-cost":
      return makeRemodelCostConfig(definition);
    case "mortgage-payment":
      return makeMortgagePaymentConfig(definition);
    case "affordability":
      return makeAffordabilityConfig(definition);
    case "closing-costs":
      return makeClosingCostConfig(definition);
    case "refinance":
      return makeRefinanceConfig(definition);
    case "buydown":
      return makeBuydownConfig(definition);
    case "mortgage-compare":
      return makeMortgageCompareConfig(definition);
    case "heloc":
      return makeHelocConfig(definition);
    case "recast":
      return makeRecastConfig(definition);
    case "extra-payment":
      return makeExtraPaymentConfig(definition);
    case "credit-impact":
      return makeCreditImpactConfig(definition);
    case "dti-checker":
      return makeDtiCheckerConfig(definition);
    case "housing-decision":
      return makeHousingDecisionConfig(definition);
    case "state-tax":
      return makeStateTaxConfig(definition);
    case "refund":
      return makeRefundConfig(definition);
    case "withholding":
      return makeWithholdingConfig(definition);
    case "self-employment":
      return makeSelfEmploymentConfig(definition);
    case "budget-planner":
      return makeBudgetPlannerConfig(definition);
    case "debt-payoff":
      return makeDebtPayoffConfig(definition);
    case "emergency-fund":
      return makeEmergencyFundConfig(definition);
    case "net-worth":
      return makeNetWorthConfig(definition);
    default:
      throw new Error(`Unsupported hub calculator template: ${definition.template}`);
  }
}

function makeMetroComparisonConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: definition.aliases || [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Compare locations",
    emptyState: `Compare ${definition.baseLabel.toLowerCase()} across two cities and see the salary adjustment that keeps spending power steady.`,
    summaryLabel: "Location comparison",
    defaults: {
      metroA: definition.metroA || "dallas",
      metroB: definition.metroB || "charlotte",
      baseAmount: definition.baseDefault || 4200,
      annualSalary: definition.salaryDefault || 92000,
      currency: "USD",
    },
    mainFields: [
      selectField("metroA", "Current city", METRO_OPTIONS),
      selectField("metroB", "Target city", METRO_OPTIONS),
      moneyField("baseAmount", definition.baseLabel, 25),
    ],
    advancedFields: [
      moneyField("annualSalary", "Current annual salary", 500),
      currencyField(),
    ],
    validate(values) {
      if (values.baseAmount <= 0) return `Enter ${definition.baseLabel.toLowerCase()}.`;
      if (values.annualSalary <= 0) return "Enter the current annual salary.";
      return "";
    },
    compute(values) {
      const factorA = getMetroFactor(values.metroA, definition.factorKey);
      const factorB = getMetroFactor(values.metroB, definition.factorKey);
      const valueA = values.baseAmount * factorA;
      const valueB = values.baseAmount * factorB;
      const gap = valueB - valueA;
      const salaryNeeded = values.annualSalary * (getMetroFactor(values.metroB, "overall") / getMetroFactor(values.metroA, "overall"));
      const cityA = getMetroLabel(values.metroA);
      const cityB = getMetroLabel(values.metroB);

      return result(
        `${definition.badge} comparison across ${cityA} and ${cityB}`,
        [
          card(cityA, moneyText(valueA, values.currency)),
          card(cityB, moneyText(valueB, values.currency)),
          card("Monthly gap", signedMoneyText(gap, values.currency)),
          card("Matched salary", moneyText(salaryNeeded, values.currency)),
        ],
        [
          moneyBar(`${cityA} estimate`, valueA, values.currency),
          moneyBar(`${cityB} estimate`, valueB, values.currency),
          plainBar(`${cityA} index`, factorA, `${factorA.toFixed(2)}x`),
          plainBar(`${cityB} index`, factorB, `${factorB.toFixed(2)}x`),
          moneyBar("Salary needed in target city", salaryNeeded, values.currency),
        ],
        [
          `${cityB} lands about ${signedMoneyText(gap, values.currency)} per month relative to the same baseline in ${cityA}.`,
          `A salary near ${moneyText(salaryNeeded, values.currency)} keeps overall buying power closer to the ${cityA} setup.`,
        ],
        [
          note("Metric", definition.baseLabel),
          note("Current city", cityA),
          note("Target city", cityB),
        ],
      );
    },
  };
}

function makeMetroValueComparisonConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Compare city values",
    emptyState: `Compare ${definition.baseLabel.toLowerCase()} across two metros and see how far the same budget stretches.`,
    summaryLabel: "Value comparison",
    defaults: {
      metroA: "dallas",
      metroB: "seattle",
      baseAmount: definition.baseDefault || 450000,
      currency: "USD",
    },
    mainFields: [
      selectField("metroA", "City A", METRO_OPTIONS),
      selectField("metroB", "City B", METRO_OPTIONS),
      moneyField("baseAmount", definition.baseLabel, 1000),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.baseAmount <= 0 ? `Enter ${definition.baseLabel.toLowerCase()}.` : "";
    },
    compute(values) {
      const factorA = getMetroFactor(values.metroA, definition.factorKey);
      const factorB = getMetroFactor(values.metroB, definition.factorKey);
      const valueA = values.baseAmount * factorA;
      const valueB = values.baseAmount * factorB;
      const gap = valueB - valueA;
      const cityA = getMetroLabel(values.metroA);
      const cityB = getMetroLabel(values.metroB);
      const cheaper = valueA <= valueB ? cityA : cityB;

      return result(
        `${definition.badge} comparison`,
        [
          card(cityA, moneyText(valueA, values.currency)),
          card(cityB, moneyText(valueB, values.currency)),
          card("Difference", signedMoneyText(gap, values.currency)),
          card("Lower-cost city", cheaper),
        ],
        [
          moneyBar(`${cityA} estimate`, valueA, values.currency),
          moneyBar(`${cityB} estimate`, valueB, values.currency),
          moneyBar("Price gap", gap, values.currency),
          plainBar(`${cityA} multiplier`, factorA, `${factorA.toFixed(2)}x`),
          plainBar(`${cityB} multiplier`, factorB, `${factorB.toFixed(2)}x`),
        ],
        [
          `${definition.baseLabel} trends lower in ${cheaper} under the current assumptions.`,
          `A move from ${cityA} to ${cityB} shifts the baseline by ${signedMoneyText(gap, values.currency)} on the same reference amount.`,
        ],
        [
          note("Metric", definition.baseLabel),
          note("City A", cityA),
          note("City B", cityB),
          note("Cheaper option", cheaper),
        ],
      );
    },
  };
}

function makeSalaryNeededConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: definition.remoteMode ? "Adjust salary" : "Estimate salary needed",
    emptyState: definition.remoteMode
      ? "Check how a location change or remote policy adjustment affects the salary needed to preserve buying power."
      : "Estimate the salary needed in a target city to preserve current spending power.",
    summaryLabel: "Salary adjustment",
    defaults: {
      metroA: "dallas",
      metroB: "seattle",
      annualSalary: definition.baseDefault || 92000,
      bufferPercent: definition.remoteMode ? 8 : 5,
      currency: "USD",
    },
    mainFields: [
      selectField("metroA", "Current city", METRO_OPTIONS),
      selectField("metroB", definition.remoteMode ? "Remote work location" : "Target city", METRO_OPTIONS),
      moneyField("annualSalary", definition.baseLabel || "Current annual salary", 500),
    ],
    advancedFields: [
      percentField("bufferPercent", "Desired salary buffer", 0, 35, 0.5),
      currencyField(),
    ],
    validate(values) {
      return values.annualSalary <= 0 ? "Enter the current annual salary." : "";
    },
    compute(values) {
      const currentFactor = getMetroFactor(values.metroA, "overall");
      const targetFactor = getMetroFactor(values.metroB, "overall");
      const matchedSalary = values.annualSalary * (targetFactor / currentFactor);
      const targetSalary = matchedSalary * (1 + values.bufferPercent / 100);
      const gap = targetSalary - values.annualSalary;
      const cityA = getMetroLabel(values.metroA);
      const cityB = getMetroLabel(values.metroB);

      return result(
        `${definition.badge} adjustment from ${cityA} to ${cityB}`,
        [
          card("Matched salary", moneyText(matchedSalary, values.currency)),
          card("Target salary", moneyText(targetSalary, values.currency)),
          card("Change", signedMoneyText(gap, values.currency)),
          card("Buffer", percentText(values.bufferPercent)),
        ],
        [
          moneyBar("Current salary", values.annualSalary, values.currency),
          moneyBar("Matched salary", matchedSalary, values.currency),
          moneyBar("Target salary with buffer", targetSalary, values.currency),
          plainBar("Current city cost index", currentFactor, `${currentFactor.toFixed(2)}x`),
          plainBar("Target city cost index", targetFactor, `${targetFactor.toFixed(2)}x`),
        ],
        [
          `${cityB} needs about ${moneyText(matchedSalary, values.currency)} to match the current ${cityA} spending power.`,
          `Adding a ${percentText(values.bufferPercent)} planning buffer moves the target to ${moneyText(targetSalary, values.currency)}.`,
        ],
        [
          note("Current city", cityA),
          note("Target city", cityB),
          note("Buffer", percentText(values.bufferPercent)),
        ],
      );
    },
  };
}

function makeStatePropertyComparisonConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Compare states",
    emptyState: "Compare property tax assumptions across two states using the same home value.",
    summaryLabel: "Property tax comparison",
    defaults: {
      stateA: "tx",
      stateB: "fl",
      homePrice: definition.baseDefault || 450000,
      currency: "USD",
    },
    mainFields: [
      selectField("stateA", "State A", STATE_OPTIONS),
      selectField("stateB", "State B", STATE_OPTIONS),
      moneyField("homePrice", definition.baseLabel, 1000),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.homePrice <= 0 ? "Enter a home price." : "";
    },
    compute(values) {
      const rateA = getStatePropertyTaxRate(values.stateA);
      const rateB = getStatePropertyTaxRate(values.stateB);
      const annualA = values.homePrice * rateA;
      const annualB = values.homePrice * rateB;
      const gap = annualB - annualA;
      const labelA = getStateLabel(values.stateA);
      const labelB = getStateLabel(values.stateB);

      return result(
        "Property tax comparison by state",
        [
          card(labelA, moneyText(annualA, values.currency)),
          card(labelB, moneyText(annualB, values.currency)),
          card("Annual gap", signedMoneyText(gap, values.currency)),
          card("Rate spread", `${(Math.abs(rateB - rateA) * 100).toFixed(2)} pts`),
        ],
        [
          moneyBar(`${labelA} annual tax`, annualA, values.currency),
          moneyBar(`${labelB} annual tax`, annualB, values.currency),
          plainBar(`${labelA} rate`, rateA, `${(rateA * 100).toFixed(2)}%`),
          plainBar(`${labelB} rate`, rateB, `${(rateB * 100).toFixed(2)}%`),
        ],
        [
          `${labelB} changes annual property tax by ${signedMoneyText(gap, values.currency)} on the same home value.`,
          `Property tax should be modeled alongside mortgage payment when you compare states with similar home prices.`,
        ],
        [
          note("Home value", moneyText(values.homePrice, values.currency)),
          note("State A", labelA),
          note("State B", labelB),
        ],
      );
    },
  };
}

function makeMetroBudgetConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: definition.affordabilityMode ? "Check affordability" : "Plan budget",
    emptyState: "Estimate a city-adjusted monthly budget and see how much cushion remains after savings.",
    summaryLabel: "Budget plan",
    defaults: {
      metro: "charlotte",
      afterTaxIncome: 6200,
      baseMonthlyBudget: 3600,
      savingsRate: 12,
      currency: "USD",
    },
    mainFields: [
      selectField("metro", "City", METRO_OPTIONS),
      moneyField("afterTaxIncome", "After-tax monthly income", 50),
      moneyField("baseMonthlyBudget", "Baseline monthly budget", 50),
    ],
    advancedFields: [
      percentField("savingsRate", "Savings target", 0, 35, 0.5),
      currencyField(),
    ],
    validate(values) {
      if (values.afterTaxIncome <= 0) return "Enter after-tax monthly income.";
      if (values.baseMonthlyBudget <= 0) return "Enter a baseline monthly budget.";
      return "";
    },
    compute(values) {
      const factor = getMetroFactor(values.metro, "overall") * (definition.householdFactor || 1);
      const adjustedBudget = values.baseMonthlyBudget * factor;
      const savingsTarget = values.afterTaxIncome * (values.savingsRate / 100);
      const buffer = values.afterTaxIncome - adjustedBudget - savingsTarget;
      const coverage = values.afterTaxIncome / Math.max(adjustedBudget + savingsTarget, 1);
      const metroLabel = getMetroLabel(values.metro);

      return result(
        `${definition.badge} plan for ${metroLabel}`,
        [
          card("Adjusted budget", moneyText(adjustedBudget, values.currency)),
          card("Savings target", moneyText(savingsTarget, values.currency)),
          card("Monthly buffer", signedMoneyText(buffer, values.currency)),
          card("Coverage ratio", `${coverage.toFixed(2)}x`),
        ],
        [
          moneyBar("After-tax income", values.afterTaxIncome, values.currency),
          moneyBar("Adjusted budget", adjustedBudget, values.currency),
          moneyBar("Savings target", savingsTarget, values.currency),
          moneyBar("Remaining buffer", buffer, values.currency),
        ],
        [
          `${metroLabel} pushes the working budget to about ${moneyText(adjustedBudget, values.currency)} per month under the current assumptions.`,
          buffer >= 0
            ? `The plan still leaves about ${moneyText(buffer, values.currency)} per month after the savings target.`
            : `The current setup runs short by about ${moneyText(Math.abs(buffer), values.currency)} per month after the savings target.`,
        ],
        [
          note("City", metroLabel),
          note("Household factor", `${(definition.householdFactor || 1).toFixed(2)}x`),
          note("Savings target", percentText(values.savingsRate)),
        ],
      );
    },
  };
}

function makeRelocationPlannerConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Plan relocation",
    emptyState: "Estimate one-time move cost, target-city budget, and how long a salary change takes to offset the move.",
    summaryLabel: "Relocation plan",
    defaults: {
      metroA: "dallas",
      metroB: definition.internationalMode ? "boston" : "seattle",
      currentSalary: 92000,
      newSalary: definition.salaryFocused ? 108000 : 102000,
      currentMonthlyBudget: 4200,
      movingCosts: definition.internationalMode ? 9500 : 4200,
      setupCosts: definition.internationalMode ? 5800 : 2400,
      moveDistance: definition.internationalMode ? "international" : "cross-country",
      currency: "USD",
    },
    mainFields: [
      selectField("metroA", "Current city", METRO_OPTIONS),
      selectField("metroB", definition.internationalMode ? "Destination city anchor" : "Target city", METRO_OPTIONS),
      moneyField("currentSalary", "Current annual salary", 500),
    ],
    advancedFields: [
      moneyField("newSalary", definition.salaryFocused ? "Relocation salary" : "Expected annual salary", 500),
      moneyField("currentMonthlyBudget", "Current monthly budget", 50),
      moneyField("movingCosts", "Moving costs", 100),
      moneyField("setupCosts", "Setup costs", 100),
      selectField("moveDistance", "Move type", MOVE_DISTANCE_OPTIONS),
      currencyField(),
    ],
    validate(values) {
      if (values.currentSalary <= 0) return "Enter current annual salary.";
      if (values.newSalary <= 0) return "Enter expected annual salary.";
      if (values.currentMonthlyBudget <= 0) return "Enter current monthly budget.";
      return "";
    },
    compute(values) {
      const fromLabel = getMetroLabel(values.metroA);
      const toLabel = getMetroLabel(values.metroB);
      const currentFactor = getMetroFactor(values.metroA, "overall");
      const targetFactor = getMetroFactor(values.metroB, "overall");
      const targetBudget = values.currentMonthlyBudget * (targetFactor / currentFactor);
      const oneTimeCost = (values.movingCosts + values.setupCosts) * getMoveFactor(values.moveDistance);
      const annualDelta = values.newSalary - values.currentSalary - (targetBudget - values.currentMonthlyBudget) * 12;
      const breakevenMonths = annualDelta > 0 ? oneTimeCost / (annualDelta / 12) : Number.POSITIVE_INFINITY;

      return result(
        `${definition.badge} from ${fromLabel} to ${toLabel}`,
        [
          card("Target budget", moneyText(targetBudget, values.currency)),
          card("One-time move cost", moneyText(oneTimeCost, values.currency)),
          card("Annual net shift", signedMoneyText(annualDelta, values.currency)),
          card("Breakeven", Number.isFinite(breakevenMonths) ? `${Math.ceil(breakevenMonths)} months` : "No breakeven"),
        ],
        [
          moneyBar("Current salary", values.currentSalary, values.currency),
          moneyBar("Expected salary", values.newSalary, values.currency),
          moneyBar("Current monthly budget", values.currentMonthlyBudget, values.currency),
          moneyBar("Target monthly budget", targetBudget, values.currency),
          moneyBar("One-time move cost", oneTimeCost, values.currency),
        ],
        [
          `${toLabel} shifts the working monthly budget to roughly ${moneyText(targetBudget, values.currency)}.`,
          Number.isFinite(breakevenMonths)
            ? `At the current salary assumptions, the relocation cost is recovered in about ${Math.ceil(breakevenMonths)} months.`
            : "The current assumptions do not recover the move cost, so the plan needs either a higher salary or a lower move budget.",
        ],
        [
          note("From", fromLabel),
          note("To", toLabel),
          note("Move type", labelForOption(values.moveDistance, MOVE_DISTANCE_OPTIONS)),
        ],
      );
    },
  };
}

function makeSalaryBenchmarkConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: definition.mode === "freelance" ? "Estimate rate" : "Estimate pay",
    emptyState: "Estimate pay benchmarks by role, experience, and location using adjustable assumptions.",
    summaryLabel: "Pay benchmark",
    defaults: {
      role: "software-engineer",
      state: "tx",
      experience: "mid",
      metro: "austin",
      hoursPerWeek: 40,
      currency: "USD",
    },
    mainFields: [
      selectField("role", "Role", ROLE_OPTIONS),
      selectField("state", "State", STATE_OPTIONS),
      selectField("experience", "Experience level", EXPERIENCE_OPTIONS),
    ],
    advancedFields: [
      ...(definition.includeMetro ? [selectField("metro", "Metro", METRO_OPTIONS)] : []),
      numberField("hoursPerWeek", "Hours per week", 20, 70, 1),
      currencyField(),
    ],
    validate(values) {
      return values.hoursPerWeek <= 0 ? "Enter weekly hours." : "";
    },
    compute(values) {
      const role = getRoleProfile(values.role);
      const stateFactor = getStateSalaryFactor(values.state);
      const expFactor = getExperienceFactor(values.experience);
      const metroFactor = definition.includeMetro ? getMetroFactor(values.metro, "salary") : 1;
      const annual = role.salary * stateFactor * expFactor * metroFactor;
      const monthly = annual / 12;
      const hourly = annual / (Math.max(values.hoursPerWeek, 1) * 52);
      const bonusAmount = annual * role.bonusRate;
      const totalComp = annual + bonusAmount;
      const rate = annual / 1200 * 1.32;

      if (definition.mode === "bands") {
        const entry = role.salary * stateFactor * 0.84;
        const mid = role.salary * stateFactor;
        const senior = role.salary * stateFactor * 1.22;
        return result(
          `${role.label} salary bands in ${getStateLabel(values.state)}`,
          [
            card("Entry", moneyText(entry, values.currency)),
            card("Mid", moneyText(mid, values.currency)),
            card("Senior", moneyText(senior, values.currency)),
            card("Spread", moneyText(senior - entry, values.currency)),
          ],
          [
            moneyBar("Entry benchmark", entry, values.currency),
            moneyBar("Mid benchmark", mid, values.currency),
            moneyBar("Senior benchmark", senior, values.currency),
          ],
          [
            `${role.label} pay in ${getStateLabel(values.state)} typically widens by about ${moneyText(senior - entry, values.currency)} between entry and senior levels.`,
            "Use the spread to benchmark leveling and candidate compensation bands before an offer discussion.",
          ],
          [
            note("Role", role.label),
            note("State", getStateLabel(values.state)),
            note("Band method", "Entry / mid / senior"),
          ],
          {
            title: "Band breakdown",
            headers: ["Band", "Benchmark"],
            rows: [
              { cells: ["Entry", moneyText(entry, values.currency)], tone: "default" },
              { cells: ["Mid", moneyText(mid, values.currency)], tone: "default" },
              { cells: ["Senior", moneyText(senior, values.currency)], tone: "highlight" },
            ],
          },
        );
      }

      if (definition.mode === "freelance") {
        return result(
          `${role.label} freelance benchmark`,
          [
            card("Freelance hourly target", moneyText(rate, values.currency, 2)),
            card("Day rate", moneyText(rate * 8, values.currency)),
            card("Annual equivalent", moneyText(annual, values.currency)),
            card("Monthly retainer target", moneyText(annual / 10, values.currency)),
          ],
          [
            moneyBar("Annual benchmark", annual, values.currency),
            moneyBar("Hourly freelance target", rate, values.currency, 2),
            moneyBar("Day rate", rate * 8, values.currency),
            moneyBar("Monthly retainer target", annual / 10, values.currency),
          ],
          [
            `A freelance target near ${moneyText(rate, values.currency, 2)} per hour keeps the role close to the local salaried benchmark after non-billable time.`,
            "Use the day-rate and retainer views to quote without backing into underpriced work.",
          ],
          [
            note("Role", role.label),
            note("State", getStateLabel(values.state)),
            note("Experience", labelForOption(values.experience, EXPERIENCE_OPTIONS)),
          ],
        );
      }

      if (definition.mode === "bonus") {
        return result(
          `${role.label} bonus benchmark`,
          [
            card("Base salary", moneyText(annual, values.currency)),
            card("Bonus rate", percentText(role.bonusRate * 100)),
            card("Annual bonus", moneyText(bonusAmount, values.currency)),
            card("Total comp", moneyText(totalComp, values.currency)),
          ],
          [
            moneyBar("Base salary", annual, values.currency),
            moneyBar("Annual bonus", bonusAmount, values.currency),
            moneyBar("Total compensation", totalComp, values.currency),
            moneyBar("Monthly cash comp", (annual + bonusAmount) / 12, values.currency),
          ],
          [
            `${role.label} bonus assumptions put annual incentive pay near ${moneyText(bonusAmount, values.currency)}.`,
            "Use the total-comp view when two roles have similar base pay but different upside.",
          ],
          [
            note("Role", role.label),
            note("State", getStateLabel(values.state)),
            note("Bonus rate", percentText(role.bonusRate * 100)),
          ],
        );
      }

      if (definition.mode === "converter") {
        return result(
          `${role.label} pay converted across timeframes`,
          [
            card("Hourly", moneyText(hourly, values.currency, 2)),
            card("Monthly", moneyText(monthly, values.currency)),
            card("Yearly", moneyText(annual, values.currency)),
            card("Total comp", moneyText(totalComp, values.currency)),
          ],
          [
            moneyBar("Hourly pay", hourly, values.currency, 2),
            moneyBar("Monthly pay", monthly, values.currency),
            moneyBar("Annual salary", annual, values.currency),
            moneyBar("Annual total comp", totalComp, values.currency),
          ],
          [
            `${role.label} works out to about ${moneyText(hourly, values.currency, 2)} per hour at the current schedule.`,
            "This view is useful when you are comparing salary offers against freelance or contract work.",
          ],
          [
            note("Role", role.label),
            note("State", getStateLabel(values.state)),
            note("Hours / week", `${values.hoursPerWeek}`),
          ],
        );
      }

      return result(
        `${role.label} pay benchmark`,
        [
          card("Annual salary", moneyText(annual, values.currency)),
          card("Monthly pay", moneyText(monthly, values.currency)),
          card("Hourly pay", moneyText(hourly, values.currency, 2)),
          card("Total comp", moneyText(totalComp, values.currency)),
        ],
        [
          moneyBar("Annual salary", annual, values.currency),
          moneyBar("Monthly pay", monthly, values.currency),
          moneyBar("Hourly pay", hourly, values.currency, 2),
          moneyBar("Annual bonus", bonusAmount, values.currency),
        ],
        [
          `${role.label} lands near ${moneyText(annual, values.currency)} in ${getStateLabel(values.state)} under the selected assumptions.`,
          definition.includeMetro
            ? `${getMetroLabel(values.metro)} adds a local market premium on top of the state baseline.`
            : "Change state and experience to compare how quickly the benchmark moves.",
        ],
        [
          note("Role", role.label),
          note("State", getStateLabel(values.state)),
          note("Experience", labelForOption(values.experience, EXPERIENCE_OPTIONS)),
        ],
      );
    },
  };
}

function makeSalaryPercentileConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate percentile",
    emptyState: "Compare an entered salary with a role benchmark to estimate percentile positioning.",
    summaryLabel: "Percentile estimate",
    defaults: {
      role: "software-engineer",
      state: "tx",
      annualSalary: 122000,
      currency: "USD",
    },
    mainFields: [
      selectField("role", "Role", ROLE_OPTIONS),
      selectField("state", "State", STATE_OPTIONS),
      moneyField("annualSalary", "Annual salary", 500),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.annualSalary <= 0 ? "Enter annual salary." : "";
    },
    compute(values) {
      const role = getRoleProfile(values.role);
      const benchmark = role.salary * getStateSalaryFactor(values.state);
      const percentile = clamp(50 + ((values.annualSalary - benchmark) / Math.max(benchmark, 1)) * 70, 5, 99);
      const gap = values.annualSalary - benchmark;

      return result(
        `${role.label} salary percentile estimate`,
        [
          card("Entered salary", moneyText(values.annualSalary, values.currency)),
          card("Market benchmark", moneyText(benchmark, values.currency)),
          card("Percentile", `${Math.round(percentile)}th`),
          card("Gap vs benchmark", signedMoneyText(gap, values.currency)),
        ],
        [
          moneyBar("Entered salary", values.annualSalary, values.currency),
          moneyBar("Benchmark", benchmark, values.currency),
          plainBar("Percentile estimate", percentile, `${Math.round(percentile)}th`),
        ],
        [
          `${role.label} in ${getStateLabel(values.state)} centers near ${moneyText(benchmark, values.currency)} under this model.`,
          `The entered pay tracks around the ${Math.round(percentile)}th percentile relative to that baseline.`,
        ],
        [
          note("Role", role.label),
          note("State", getStateLabel(values.state)),
          note("Percentile", `${Math.round(percentile)}th`),
        ],
      );
    },
  };
}

function makePaycheckStateConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate paycheck",
    emptyState: "Estimate monthly net pay by salary and state using rough federal, FICA, and state withholding assumptions.",
    summaryLabel: "Paycheck estimate",
    defaults: {
      annualSalary: 96000,
      state: "tx",
      filingStatus: "single",
      preTaxBenefits: 350,
      currency: "USD",
    },
    mainFields: [
      moneyField("annualSalary", "Annual salary", 500),
      selectField("state", "State", STATE_OPTIONS),
      selectField("filingStatus", "Filing status", FILING_STATUS_OPTIONS),
    ],
    advancedFields: [
      moneyField("preTaxBenefits", "Monthly pre-tax deductions", 25),
      currencyField(),
    ],
    validate(values) {
      return values.annualSalary <= 0 ? "Enter annual salary." : "";
    },
    compute(values) {
      const annualPreTax = values.preTaxBenefits * 12;
      const taxableIncome = Math.max(0, values.annualSalary - annualPreTax);
      const federalRate = estimateFederalRate(taxableIncome, values.filingStatus);
      const stateRate = getStateIncomeTaxRate(values.state);
      const fica = taxableIncome * 0.0765;
      const federalTax = taxableIncome * federalRate;
      const stateTax = taxableIncome * stateRate;
      const netAnnual = values.annualSalary - annualPreTax - federalTax - stateTax - fica;
      const netMonthly = netAnnual / 12;

      return result(
        "Monthly paycheck estimate by state",
        [
          card("Net monthly pay", moneyText(netMonthly, values.currency)),
          card("Net annual pay", moneyText(netAnnual, values.currency)),
          card("Federal tax", moneyText(federalTax, values.currency)),
          card("State tax", moneyText(stateTax, values.currency)),
        ],
        [
          moneyBar("Gross annual salary", values.annualSalary, values.currency),
          moneyBar("Pre-tax deductions", annualPreTax, values.currency),
          moneyBar("Federal tax", federalTax, values.currency),
          moneyBar("State tax", stateTax, values.currency),
          moneyBar("FICA", fica, values.currency),
        ],
        [
          `${getStateLabel(values.state)} and the current filing status move net pay to roughly ${moneyText(netMonthly, values.currency)} per month.`,
          "Use this as a planning estimate before payroll-specific deductions or local taxes are applied.",
        ],
        [
          note("State", getStateLabel(values.state)),
          note("Filing status", labelForOption(values.filingStatus, FILING_STATUS_OPTIONS)),
          note("Monthly deductions", moneyText(values.preTaxBenefits, values.currency)),
        ],
      );
    },
  };
}

function makeCompComparisonConfig(definition) {
  const [labelA, labelB] = definition.labels || ["Option A", "Option B"];
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Compare compensation",
    emptyState: "Compare two compensation paths after benefits and work-related costs.",
    summaryLabel: "Compensation comparison",
    defaults: {
      salaryA: 112000,
      benefitsA: 8000,
      costsA: labelA.toLowerCase().includes("remote") ? 1800 : 6200,
      salaryB: 104000,
      benefitsB: 12000,
      costsB: labelB.toLowerCase().includes("onsite") ? 7400 : 2400,
      currency: "USD",
    },
    mainFields: [
      moneyField("salaryA", `${labelA} annual pay`, 500),
      moneyField("benefitsA", `${labelA} annual extras`, 100),
      moneyField("costsA", `${labelA} annual costs`, 100),
    ],
    advancedFields: [
      moneyField("salaryB", `${labelB} annual pay`, 500),
      moneyField("benefitsB", `${labelB} annual extras`, 100),
      moneyField("costsB", `${labelB} annual costs`, 100),
      currencyField(),
    ],
    validate(values) {
      if (values.salaryA <= 0 || values.salaryB <= 0) return "Enter annual pay for both options.";
      return "";
    },
    compute(values) {
      const totalA = values.salaryA + values.benefitsA - values.costsA;
      const totalB = values.salaryB + values.benefitsB - values.costsB;
      const gap = totalB - totalA;
      const winner = totalA >= totalB ? labelA : labelB;

      return result(
        `${definition.badge} comparison`,
        [
          card(`${labelA} net value`, moneyText(totalA, values.currency)),
          card(`${labelB} net value`, moneyText(totalB, values.currency)),
          card("Gap", signedMoneyText(gap, values.currency)),
          card("Higher value", winner),
        ],
        [
          moneyBar(`${labelA} pay`, values.salaryA, values.currency),
          moneyBar(`${labelA} benefits`, values.benefitsA, values.currency),
          moneyBar(`${labelA} costs`, -values.costsA, values.currency),
          moneyBar(`${labelB} pay`, values.salaryB, values.currency),
          moneyBar(`${labelB} benefits`, values.benefitsB, values.currency),
          moneyBar(`${labelB} costs`, -values.costsB, values.currency),
        ],
        [
          `${winner} carries the higher all-in value under the current assumptions.`,
          "Adjust the cost rows when commuting, equipment, or schedule friction meaningfully changes the outcome.",
        ],
        [
          note("Option A", labelA),
          note("Option B", labelB),
          note("Higher value", winner),
        ],
      );
    },
  };
}

function makeContractVsEmployeeConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Compare work models",
    emptyState: "Compare contract income against salaried pay after taxes, benefits, and unpaid overhead.",
    summaryLabel: "Work model comparison",
    defaults: {
      contractRate: 82,
      hoursPerWeek: 35,
      salariedPay: 126000,
      benefitsValue: 16500,
      selfEmploymentTaxRate: 14,
      currency: "USD",
    },
    mainFields: [
      moneyField("contractRate", "Contract hourly rate", 1),
      numberField("hoursPerWeek", "Weekly billable hours", 10, 60, 1),
      moneyField("salariedPay", "Salaried annual pay", 500),
    ],
    advancedFields: [
      moneyField("benefitsValue", "Annual benefits value", 100),
      percentField("selfEmploymentTaxRate", "Self-employment overhead", 0, 35, 0.5),
      currencyField(),
    ],
    validate(values) {
      if (values.contractRate <= 0) return "Enter a contract hourly rate.";
      if (values.salariedPay <= 0) return "Enter salaried annual pay.";
      return "";
    },
    compute(values) {
      const contractGross = values.contractRate * values.hoursPerWeek * 48;
      const contractNet = contractGross * (1 - values.selfEmploymentTaxRate / 100);
      const employeeValue = values.salariedPay + values.benefitsValue;
      const gap = contractNet - employeeValue;

      return result(
        "Contractor vs employee pay comparison",
        [
          card("Contract net", moneyText(contractNet, values.currency)),
          card("Employee total value", moneyText(employeeValue, values.currency)),
          card("Gap", signedMoneyText(gap, values.currency)),
          card("Stronger model", gap >= 0 ? "Contract" : "Employee"),
        ],
        [
          moneyBar("Contract gross", contractGross, values.currency),
          moneyBar("Contract net after overhead", contractNet, values.currency),
          moneyBar("Employee salary", values.salariedPay, values.currency),
          moneyBar("Employee benefits", values.benefitsValue, values.currency),
        ],
        [
          `At the current assumptions, contract work lands near ${moneyText(contractNet, values.currency)} after overhead.`,
          "The salary model usually gets stronger when benefits, paid time off, or bonus upside are meaningfully larger than the contract premium.",
        ],
        [
          note("Billable hours / week", `${values.hoursPerWeek}`),
          note("Overhead rate", percentText(values.selfEmploymentTaxRate)),
          note("Benefits value", moneyText(values.benefitsValue, values.currency)),
        ],
      );
    },
  };
}

function makeCommissionPlanConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Plan commission",
    emptyState: "Estimate total annual pay from base salary, quota attainment, and commission rate.",
    summaryLabel: "Commission plan",
    defaults: {
      baseSalary: 72000,
      annualSales: 540000,
      commissionRate: 8,
      payoutPercent: 82,
      currency: "USD",
    },
    mainFields: [
      moneyField("baseSalary", "Base salary", 500),
      moneyField("annualSales", "Annual sales volume", 1000),
      percentField("commissionRate", "Commission rate", 0, 30, 0.25),
    ],
    advancedFields: [
      percentField("payoutPercent", "Quota attainment", 0, 200, 1),
      currencyField(),
    ],
    validate(values) {
      if (values.baseSalary <= 0) return "Enter a base salary.";
      if (values.annualSales <= 0) return "Enter annual sales volume.";
      return "";
    },
    compute(values) {
      const effectiveSales = values.annualSales * (values.payoutPercent / 100);
      const commission = effectiveSales * (values.commissionRate / 100);
      const total = values.baseSalary + commission;
      return result(
        "Commission income plan",
        [
          card("Commission payout", moneyText(commission, values.currency)),
          card("Total annual pay", moneyText(total, values.currency)),
          card("Monthly total", moneyText(total / 12, values.currency)),
          card("Attainment", percentText(values.payoutPercent)),
        ],
        [
          moneyBar("Base salary", values.baseSalary, values.currency),
          moneyBar("Effective sales volume", effectiveSales, values.currency),
          moneyBar("Commission payout", commission, values.currency),
          moneyBar("Total annual pay", total, values.currency),
        ],
        [
          `At ${percentText(values.commissionRate)} commission and ${percentText(values.payoutPercent)} attainment, variable pay lands near ${moneyText(commission, values.currency)}.`,
          "This is useful for checking how much commission upside actually changes the all-in package.",
        ],
        [
          note("Commission rate", percentText(values.commissionRate)),
          note("Attainment", percentText(values.payoutPercent)),
          note("Base salary", moneyText(values.baseSalary, values.currency)),
        ],
      );
    },
  };
}

function makeTotalCompConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Calculate total comp",
    emptyState: "Combine salary, bonus, equity, and benefits into a cleaner total compensation view.",
    summaryLabel: "Total compensation",
    defaults: {
      baseSalary: 128000,
      bonus: 12000,
      equity: 18000,
      benefits: 15000,
      currency: "USD",
    },
    mainFields: [
      moneyField("baseSalary", "Base salary", 500),
      moneyField("bonus", "Annual bonus", 100),
      moneyField("equity", "Annualized equity value", 100),
    ],
    advancedFields: [
      moneyField("benefits", "Benefits value", 100),
      currencyField(),
    ],
    validate(values) {
      return values.baseSalary <= 0 ? "Enter base salary." : "";
    },
    compute(values) {
      const total = values.baseSalary + values.bonus + values.equity + values.benefits;
      return result(
        "Total compensation estimate",
        [
          card("Total comp", moneyText(total, values.currency)),
          card("Cash comp", moneyText(values.baseSalary + values.bonus, values.currency)),
          card("Equity", moneyText(values.equity, values.currency)),
          card("Benefits", moneyText(values.benefits, values.currency)),
        ],
        [
          moneyBar("Base salary", values.baseSalary, values.currency),
          moneyBar("Bonus", values.bonus, values.currency),
          moneyBar("Equity value", values.equity, values.currency),
          moneyBar("Benefits", values.benefits, values.currency),
        ],
        [
          "This view makes it easier to compare offers that trade base salary against equity or benefits.",
          `The current mix produces roughly ${moneyText(total, values.currency)} in annualized total value.`,
        ],
        [
          note("Cash comp", moneyText(values.baseSalary + values.bonus, values.currency)),
          note("Equity share", percentText((values.equity / Math.max(total, 1)) * 100)),
          note("Benefits share", percentText((values.benefits / Math.max(total, 1)) * 100)),
        ],
      );
    },
  };
}

function makeRaiseBenchmarkConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate raise",
    emptyState: "Compare a proposed raise against inflation and market movement.",
    summaryLabel: "Raise estimate",
    defaults: {
      currentSalary: 94000,
      raiseRate: 6,
      inflationRate: 3,
      currency: "USD",
    },
    mainFields: [
      moneyField("currentSalary", "Current salary", 500),
      percentField("raiseRate", "Raise rate", 0, 30, 0.25),
      percentField("inflationRate", "Inflation rate", 0, 12, 0.1),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.currentSalary <= 0 ? "Enter current salary." : "";
    },
    compute(values) {
      const newSalary = values.currentSalary * (1 + values.raiseRate / 100);
      const realSalary = newSalary / (1 + values.inflationRate / 100);
      const realGain = realSalary - values.currentSalary;
      return result(
        "Raise benchmark view",
        [
          card("New salary", moneyText(newSalary, values.currency)),
          card("Real salary", moneyText(realSalary, values.currency)),
          card("Nominal raise", percentText(values.raiseRate)),
          card("Real gain", signedMoneyText(realGain, values.currency)),
        ],
        [
          moneyBar("Current salary", values.currentSalary, values.currency),
          moneyBar("Raised salary", newSalary, values.currency),
          moneyBar("Inflation-adjusted salary", realSalary, values.currency),
        ],
        [
          `A ${percentText(values.raiseRate)} raise moves salary to ${moneyText(newSalary, values.currency)} before inflation.`,
          values.raiseRate > values.inflationRate
            ? "The raise still grows real purchasing power."
            : "Inflation absorbs most of the raise, so real improvement stays limited.",
        ],
        [
          note("Raise rate", percentText(values.raiseRate)),
          note("Inflation rate", percentText(values.inflationRate)),
          note("Real gain", signedMoneyText(realGain, values.currency)),
        ],
      );
    },
  };
}

function makeOvertimePlanConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Plan overtime",
    emptyState: "Estimate overtime earnings across a repeated schedule.",
    summaryLabel: "Overtime estimate",
    defaults: {
      hourlyRate: 36,
      overtimeHours: 8,
      overtimeMultiplier: 1.5,
      weeks: 48,
      currency: "USD",
    },
    mainFields: [
      moneyField("hourlyRate", "Hourly rate", 1),
      numberField("overtimeHours", "Overtime hours per week", 0, 40, 1),
      numberField("weeks", "Weeks worked", 1, 52, 1),
    ],
    advancedFields: [
      numberField("overtimeMultiplier", "Overtime multiplier", 1, 3, 0.25),
      currencyField(),
    ],
    validate(values) {
      return values.hourlyRate <= 0 ? "Enter an hourly rate." : "";
    },
    compute(values) {
      const overtimePay = values.hourlyRate * values.overtimeHours * values.overtimeMultiplier * values.weeks;
      const totalHours = values.overtimeHours * values.weeks;
      return result(
        "Overtime earnings plan",
        [
          card("Annual overtime pay", moneyText(overtimePay, values.currency)),
          card("Monthly average", moneyText(overtimePay / 12, values.currency)),
          card("Overtime hours", count(totalHours)),
          card("Multiplier", `${fixed(values.overtimeMultiplier)}x`),
        ],
        [
          moneyBar("Hourly rate", values.hourlyRate, values.currency, 2),
          moneyBar("Annual overtime pay", overtimePay, values.currency),
          plainBar("Overtime hours", totalHours, count(totalHours)),
        ],
        [
          `The current schedule adds about ${moneyText(overtimePay, values.currency)} in overtime pay across the year.`,
          "Use this to check whether recurring overtime is meaningfully changing total earnings or just increasing fatigue.",
        ],
        [
          note("Weekly overtime", `${values.overtimeHours} hrs`),
          note("Weeks worked", `${values.weeks}`),
          note("Multiplier", `${fixed(values.overtimeMultiplier)}x`),
        ],
      );
    },
  };
}

function makeShiftDiffConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate shift pay",
    emptyState: "Estimate how much a shift differential adds to annual earnings.",
    summaryLabel: "Shift pay estimate",
    defaults: {
      hourlyRate: 30,
      shiftDifferential: 12,
      hoursPerWeek: 36,
      weeks: 50,
      currency: "USD",
    },
    mainFields: [
      moneyField("hourlyRate", "Base hourly rate", 1),
      percentField("shiftDifferential", "Shift differential", 0, 50, 0.5),
      numberField("hoursPerWeek", "Shift hours per week", 1, 60, 1),
    ],
    advancedFields: [
      numberField("weeks", "Weeks worked", 1, 52, 1),
      currencyField(),
    ],
    validate(values) {
      return values.hourlyRate <= 0 ? "Enter a base hourly rate." : "";
    },
    compute(values) {
      const differentialHourly = values.hourlyRate * (values.shiftDifferential / 100);
      const annualExtra = differentialHourly * values.hoursPerWeek * values.weeks;
      return result(
        "Shift differential estimate",
        [
          card("Extra hourly pay", moneyText(differentialHourly, values.currency, 2)),
          card("Annual shift premium", moneyText(annualExtra, values.currency)),
          card("Monthly premium", moneyText(annualExtra / 12, values.currency)),
          card("Differential", percentText(values.shiftDifferential)),
        ],
        [
          moneyBar("Base hourly rate", values.hourlyRate, values.currency, 2),
          moneyBar("Shift premium / hour", differentialHourly, values.currency, 2),
          moneyBar("Annual extra pay", annualExtra, values.currency),
        ],
        [
          `A ${percentText(values.shiftDifferential)} differential adds roughly ${moneyText(annualExtra, values.currency)} per year at the current schedule.`,
          "This helps when you compare base pay against schedules with nights, weekends, or specialty coverage premiums.",
        ],
        [
          note("Weekly hours", `${values.hoursPerWeek}`),
          note("Weeks worked", `${values.weeks}`),
          note("Differential", percentText(values.shiftDifferential)),
        ],
      );
    },
  };
}

function makeSalaryAdjustedCompareConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Compare adjusted pay",
    emptyState: "Compare two salaries after cost-of-living adjustments.",
    summaryLabel: "Adjusted salary comparison",
    defaults: {
      metroA: "austin",
      salaryA: 118000,
      metroB: "seattle",
      salaryB: 136000,
      currency: "USD",
    },
    mainFields: [
      selectField("metroA", "Location A", METRO_OPTIONS),
      moneyField("salaryA", "Salary A", 500),
      selectField("metroB", "Location B", METRO_OPTIONS),
    ],
    advancedFields: [
      moneyField("salaryB", "Salary B", 500),
      currencyField(),
    ],
    validate(values) {
      if (values.salaryA <= 0 || values.salaryB <= 0) return "Enter both salaries.";
      return "";
    },
    compute(values) {
      const adjustedA = values.salaryA / getMetroFactor(values.metroA, "overall");
      const adjustedB = values.salaryB / getMetroFactor(values.metroB, "overall");
      const gap = adjustedB - adjustedA;
      const winner = adjustedA >= adjustedB ? getMetroLabel(values.metroA) : getMetroLabel(values.metroB);

      return result(
        "Cost-of-living adjusted salary comparison",
        [
          card(`${getMetroLabel(values.metroA)} adjusted`, moneyText(adjustedA, values.currency)),
          card(`${getMetroLabel(values.metroB)} adjusted`, moneyText(adjustedB, values.currency)),
          card("Adjusted gap", signedMoneyText(gap, values.currency)),
          card("Stronger buying power", winner),
        ],
        [
          moneyBar("Salary A", values.salaryA, values.currency),
          moneyBar("Adjusted salary A", adjustedA, values.currency),
          moneyBar("Salary B", values.salaryB, values.currency),
          moneyBar("Adjusted salary B", adjustedB, values.currency),
        ],
        [
          `${winner} carries the stronger adjusted salary after local living costs are normalized.`,
          "This is useful when headline pay looks better in one city but local prices erase most of the gap.",
        ],
        [
          note("Location A", getMetroLabel(values.metroA)),
          note("Location B", getMetroLabel(values.metroB)),
          note("Winner", winner),
        ],
      );
    },
  };
}

function makePartFullConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Compare schedules",
    emptyState: "Compare part-time and full-time earnings using the same hourly rate.",
    summaryLabel: "Schedule comparison",
    defaults: {
      hourlyRate: 28,
      partHours: 24,
      fullHours: 40,
      weeks: 50,
      currency: "USD",
    },
    mainFields: [
      moneyField("hourlyRate", "Hourly rate", 1),
      numberField("partHours", "Part-time hours / week", 1, 40, 1),
      numberField("fullHours", "Full-time hours / week", 1, 60, 1),
    ],
    advancedFields: [
      numberField("weeks", "Weeks worked", 1, 52, 1),
      currencyField(),
    ],
    validate(values) {
      return values.hourlyRate <= 0 ? "Enter an hourly rate." : "";
    },
    compute(values) {
      const partAnnual = values.hourlyRate * values.partHours * values.weeks;
      const fullAnnual = values.hourlyRate * values.fullHours * values.weeks;
      const gap = fullAnnual - partAnnual;
      return result(
        "Part-time vs full-time earnings",
        [
          card("Part-time annual", moneyText(partAnnual, values.currency)),
          card("Full-time annual", moneyText(fullAnnual, values.currency)),
          card("Gap", signedMoneyText(gap, values.currency)),
          card("Weekly hour spread", `${values.fullHours - values.partHours} hrs`),
        ],
        [
          moneyBar("Part-time annual pay", partAnnual, values.currency),
          moneyBar("Full-time annual pay", fullAnnual, values.currency),
          moneyBar("Annual gap", gap, values.currency),
        ],
        [
          `Moving from part-time to full-time adds about ${moneyText(gap, values.currency)} in annual gross pay at the current rate.`,
          "Use this view when a role change trades schedule flexibility against earnings.",
        ],
        [
          note("Part-time hours", `${values.partHours}`),
          note("Full-time hours", `${values.fullHours}`),
          note("Weeks worked", `${values.weeks}`),
        ],
      );
    },
  };
}

function makeSalaryTrendConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Project salary trend",
    emptyState: "Project benchmark salary movement across years for a role and state.",
    summaryLabel: "Salary trend",
    defaults: {
      role: "software-engineer",
      state: "tx",
      startYear: 2024,
      endYear: 2028,
      currency: "USD",
    },
    mainFields: [
      selectField("role", "Role", ROLE_OPTIONS),
      selectField("state", "State", STATE_OPTIONS),
      selectField("startYear", "Start year", YEAR_OPTIONS),
    ],
    advancedFields: [
      selectField("endYear", "End year", YEAR_OPTIONS),
      currencyField(),
    ],
    validate(values) {
      return Number(values.endYear) <= Number(values.startYear) ? "Choose an end year after the start year." : "";
    },
    compute(values) {
      const role = getRoleProfile(values.role);
      const benchmark = role.salary * getStateSalaryFactor(values.state);
      const years = Number(values.endYear) - Number(values.startYear);
      const annualGrowthRate = 0.035 + role.bonusRate * 0.04;
      const projected = benchmark * Math.pow(1 + annualGrowthRate, years);
      const growth = projected - benchmark;

      return result(
        `${role.label} salary trend`,
        [
          card("Start benchmark", moneyText(benchmark, values.currency)),
          card("Projected benchmark", moneyText(projected, values.currency)),
          card("Growth", moneyText(growth, values.currency)),
          card("Annual growth", percentText(annualGrowthRate * 100)),
        ],
        [
          moneyBar("Start benchmark", benchmark, values.currency),
          moneyBar("Projected benchmark", projected, values.currency),
          moneyBar("Benchmark growth", growth, values.currency),
        ],
        [
          `${role.label} in ${getStateLabel(values.state)} grows to roughly ${moneyText(projected, values.currency)} by ${values.endYear} under the current assumptions.`,
          "This is a directional benchmark, not a promise of market pay.",
        ],
        [
          note("Role", role.label),
          note("State", getStateLabel(values.state)),
          note("Years projected", `${years}`),
        ],
      );
    },
  };
}

function makeProjectCostConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate cost",
    emptyState: "Estimate low, expected, and high project cost using size, state, finish tier, and install complexity.",
    summaryLabel: "Project cost estimate",
    defaults: {
      state: "tx",
      projectSize: 1800,
      materialTier: "standard",
      complexity: "typical",
      materialType: definition.materialOptions?.[0]?.value || "standard",
      currency: "USD",
    },
    mainFields: [
      selectField("state", "State", STATE_OPTIONS),
      numberField("projectSize", definition.unitLabel, 1, 100000, 1),
      selectField("materialTier", "Finish tier", MATERIAL_TIER_OPTIONS),
    ],
    advancedFields: [
      ...(definition.materialOptions ? [selectField("materialType", "Material", definition.materialOptions)] : []),
      selectField("complexity", "Install complexity", COMPLEXITY_OPTIONS),
      currencyField(),
    ],
    validate(values) {
      return values.projectSize <= 0 ? `Enter ${definition.unitLabel.toLowerCase()}.` : "";
    },
    compute(values) {
      const stateFactor = getStateHomeCostFactor(values.state);
      const tierFactor = getTierFactor(values.materialTier);
      const complexityFactor = getComplexityFactor(values.complexity);
      const materialFactor = getMaterialProfileFactor(definition.materialProfile, values.materialType);
      const unitCost = definition.baseCost * stateFactor * tierFactor * complexityFactor * materialFactor;
      const expected = values.projectSize * unitCost;
      const low = expected * 0.88;
      const high = expected * 1.14;
      const contingency = expected * 0.1;

      return result(
        `${definition.badge} estimate`,
        [
          card("Low range", moneyText(low, values.currency)),
          card("Expected cost", moneyText(expected, values.currency)),
          card("High range", moneyText(high, values.currency)),
          card("Contingency", moneyText(contingency, values.currency)),
        ],
        [
          plainBar("Project size", values.projectSize, `${count(values.projectSize)} units`),
          moneyBar("Unit cost", unitCost, values.currency, 2),
          moneyBar("Expected cost", expected, values.currency),
          moneyBar("Contingency", contingency, values.currency),
        ],
        [
          `${definition.title} lands near ${moneyText(expected, values.currency)} under the current assumptions.`,
          "Use the low and high range to quote conservatively before site-specific bids arrive.",
        ],
        [
          note("State", getStateLabel(values.state)),
          note("Tier", labelForOption(values.materialTier, MATERIAL_TIER_OPTIONS)),
          note("Complexity", labelForOption(values.complexity, COMPLEXITY_OPTIONS)),
        ],
      );
    },
  };
}

function makeSystemCostConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate system cost",
    emptyState: "Estimate replacement cost using quantity, system type, state, and install complexity.",
    summaryLabel: "System cost estimate",
    defaults: {
      state: "tx",
      quantity: definition.defaultQuantity || 1,
      systemType: definition.typeOptions?.[0]?.value || "standard",
      materialTier: "standard",
      complexity: "typical",
      currency: "USD",
    },
    mainFields: [
      selectField("state", "State", STATE_OPTIONS),
      numberField("quantity", definition.quantityLabel, 0.1, 500, 0.1),
      selectField("systemType", "System type", definition.typeOptions || MATERIAL_TIER_OPTIONS),
    ],
    advancedFields: [
      selectField("materialTier", "Finish tier", MATERIAL_TIER_OPTIONS),
      selectField("complexity", "Install complexity", COMPLEXITY_OPTIONS),
      currencyField(),
    ],
    validate(values) {
      return values.quantity <= 0 ? `Enter ${definition.quantityLabel.toLowerCase()}.` : "";
    },
    compute(values) {
      const stateFactor = getStateHomeCostFactor(values.state);
      const tierFactor = getTierFactor(values.materialTier);
      const complexityFactor = getComplexityFactor(values.complexity);
      const typeFactor = getMaterialProfileFactor(definition.typeProfile, values.systemType);
      const unitCost = definition.baseUnitCost * stateFactor * tierFactor * complexityFactor * typeFactor;
      const expected = values.quantity * unitCost;
      const low = expected * 0.9;
      const high = expected * 1.16;
      return result(
        `${definition.badge} estimate`,
        [
          card("Low range", moneyText(low, values.currency)),
          card("Expected cost", moneyText(expected, values.currency)),
          card("High range", moneyText(high, values.currency)),
          card("Unit cost", moneyText(unitCost, values.currency, 2)),
        ],
        [
          plainBar("Quantity", values.quantity, fixed(values.quantity)),
          moneyBar("Unit cost", unitCost, values.currency, 2),
          moneyBar("Expected cost", expected, values.currency),
          moneyBar("High range", high, values.currency),
        ],
        [
          `${definition.title} trends near ${moneyText(expected, values.currency)} under the current assumptions.`,
          "Use the system-type selector to pressure-test whether a higher-efficiency option still fits the budget.",
        ],
        [
          note("State", getStateLabel(values.state)),
          note("System type", labelForOption(values.systemType, definition.typeOptions || MATERIAL_TIER_OPTIONS)),
          note("Complexity", labelForOption(values.complexity, COMPLEXITY_OPTIONS)),
        ],
      );
    },
  };
}

function makeRemodelCostConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate remodel cost",
    emptyState: "Estimate remodel cost using room size, finish level, and state pricing pressure.",
    summaryLabel: "Remodel estimate",
    defaults: {
      state: "tx",
      roomSize: definition.defaultSize,
      finishLevel: "midrange",
      layoutChange: false,
      currency: "USD",
    },
    mainFields: [
      selectField("state", "State", STATE_OPTIONS),
      numberField("roomSize", definition.sizeLabel, 1, 5000, 1),
      selectField("finishLevel", "Finish level", ROOM_FINISH_OPTIONS),
    ],
    advancedFields: [
      booleanField("layoutChange", "Include layout change"),
      currencyField(),
    ],
    validate(values) {
      return values.roomSize <= 0 ? "Enter room size." : "";
    },
    compute(values) {
      const finishFactor = values.finishLevel === "refresh" ? 0.82 : values.finishLevel === "upscale" ? 1.32 : 1;
      const layoutFactor = values.layoutChange ? 1.16 : 1;
      const stateFactor = getStateHomeCostFactor(values.state);
      const expected = values.roomSize * definition.baseCostPerSqFt * finishFactor * layoutFactor * stateFactor;
      const low = expected * 0.9;
      const high = expected * 1.18;
      return result(
        `${definition.badge} estimate`,
        [
          card("Low range", moneyText(low, values.currency)),
          card("Expected cost", moneyText(expected, values.currency)),
          card("High range", moneyText(high, values.currency)),
          card("Cost / sq ft", moneyText(expected / Math.max(values.roomSize, 1), values.currency, 2)),
        ],
        [
          plainBar("Room size", values.roomSize, `${count(values.roomSize)} sq ft`),
          moneyBar("Expected cost", expected, values.currency),
          moneyBar("High range", high, values.currency),
        ],
        [
          `${definition.title} lands around ${moneyText(expected, values.currency)} with the selected finish level.`,
          values.layoutChange
            ? "Layout changes add real cost pressure, so keep extra contingency in the plan."
            : "Keeping the layout stable usually protects a meaningful part of the budget.",
        ],
        [
          note("State", getStateLabel(values.state)),
          note("Finish level", labelForOption(values.finishLevel, ROOM_FINISH_OPTIONS)),
          note("Layout change", values.layoutChange ? "Included" : "No"),
        ],
      );
    },
  };
}

function makeMortgagePaymentConfig(definition) {
  const defaultProgram = definition.program || "conventional";
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: definition.downPaymentMode ? "Estimate down payment" : "Estimate payment",
    emptyState: "Estimate loan amount, monthly principal and interest, taxes, insurance, and all-in housing cost.",
    summaryLabel: definition.downPaymentMode ? "Down payment estimate" : "Mortgage estimate",
    defaults: {
      homePrice: 420000,
      downPaymentPercent: definition.program === "va" || definition.program === "usda" ? 0 : 10,
      annualRate: defaultProgram === "fha" ? 6.15 : defaultProgram === "va" ? 5.95 : 6.35,
      years: 30,
      state: "tx",
      currency: "USD",
    },
    mainFields: [
      moneyField("homePrice", "Home price", 1000),
      percentField("downPaymentPercent", "Down payment", 0, 40, 0.5),
      percentField("annualRate", "Interest rate", 0, 12, 0.05),
    ],
    advancedFields: [
      selectField("years", "Loan term", LOAN_TERM_OPTIONS),
      selectField("state", "State", STATE_OPTIONS),
      currencyField(),
    ],
    validate(values) {
      return values.homePrice <= 0 ? "Enter a home price." : "";
    },
    compute(values) {
      const program = definition.program || "conventional";
      const downPayment = values.homePrice * (values.downPaymentPercent / 100);
      const upfrontFee = values.homePrice * getMortgageProgramFeeRate(program);
      const principal = Math.max(0, values.homePrice - downPayment + upfrontFee);
      const monthlyPi = amortizedPayment(principal, values.annualRate, Number(values.years) * 12);
      const propertyTax = (values.homePrice * getStatePropertyTaxRate(values.state)) / 12;
      const insurance = (values.homePrice * 0.0035) / 12;
      const pmi = definition.pmiMode ? (principal * 0.0052) / 12 : getProgramMonthlyInsurance(program, principal);
      const allIn = monthlyPi + propertyTax + insurance + pmi;

      return result(
        definition.downPaymentMode ? "Cash to close estimate" : `${program.toUpperCase()} mortgage estimate`,
        [
          card("Loan amount", moneyText(principal, values.currency)),
          card("Monthly P&I", moneyText(monthlyPi, values.currency)),
          card("All-in monthly", moneyText(allIn, values.currency)),
          card("Cash down", moneyText(downPayment, values.currency)),
        ],
        [
          moneyBar("Home price", values.homePrice, values.currency),
          moneyBar("Down payment", downPayment, values.currency),
          moneyBar("Loan amount", principal, values.currency),
          moneyBar("Monthly principal + interest", monthlyPi, values.currency),
          moneyBar("Monthly tax + insurance + PMI", propertyTax + insurance + pmi, values.currency),
        ],
        [
          `The current setup produces an all-in monthly housing cost near ${moneyText(allIn, values.currency)}.`,
          definition.downPaymentMode
            ? "Use the cash-down view to see how much needs to be ready before closing."
            : "Adjust the rate and down payment first; those usually move the payment more than small line items.",
        ],
        [
          note("Program", program.toUpperCase()),
          note("State", getStateLabel(values.state)),
          note("Loan term", `${values.years} years`),
        ],
      );
    },
  };
}

function makeAffordabilityConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Check affordability",
    emptyState: "Estimate a workable home budget from income, debts, and down payment.",
    summaryLabel: "Affordability estimate",
    defaults: {
      annualIncome: 120000,
      monthlyDebts: 650,
      downPayment: 45000,
      annualRate: 6.2,
      state: "tx",
      currency: "USD",
    },
    mainFields: [
      moneyField("annualIncome", "Annual household income", 500),
      moneyField("monthlyDebts", "Monthly debt payments", 25),
      moneyField("downPayment", "Available down payment", 500),
    ],
    advancedFields: [
      percentField("annualRate", "Mortgage rate", 0, 12, 0.05),
      selectField("state", "State", STATE_OPTIONS),
      currencyField(),
    ],
    validate(values) {
      return values.annualIncome <= 0 ? "Enter annual income." : "";
    },
    compute(values) {
      const monthlyIncome = values.annualIncome / 12;
      const maxHousing = Math.max(0, monthlyIncome * 0.28 - values.monthlyDebts);
      const homePrice = estimateHomePriceFromPayment(maxHousing, values.annualRate, getStatePropertyTaxRate(values.state), values.downPayment);
      return result(
        "House affordability estimate",
        [
          card("Target home price", moneyText(homePrice, values.currency)),
          card("Max housing payment", moneyText(maxHousing, values.currency)),
          card("Down payment", moneyText(values.downPayment, values.currency)),
          card("Debt-to-income base", percentText((values.monthlyDebts / Math.max(monthlyIncome, 1)) * 100)),
        ],
        [
          moneyBar("Annual income", values.annualIncome, values.currency),
          moneyBar("Monthly income", monthlyIncome, values.currency),
          moneyBar("Monthly debts", values.monthlyDebts, values.currency),
          moneyBar("Max housing payment", maxHousing, values.currency),
        ],
        [
          `The current income and debt load support roughly ${moneyText(homePrice, values.currency)} in home price under a standard affordability model.`,
          "Use this as a first-pass planning number, not as lender approval.",
        ],
        [
          note("State", getStateLabel(values.state)),
          note("Rate", percentText(values.annualRate)),
          note("Down payment", moneyText(values.downPayment, values.currency)),
        ],
      );
    },
  };
}

function makeClosingCostConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate closing costs",
    emptyState: "Estimate closing costs by state using home price and loan assumptions.",
    summaryLabel: "Closing cost estimate",
    defaults: {
      homePrice: 420000,
      state: "tx",
      loanProgram: "conventional",
      currency: "USD",
    },
    mainFields: [
      moneyField("homePrice", "Home price", 1000),
      selectField("state", "State", STATE_OPTIONS),
      selectField("loanProgram", "Loan program", MORTGAGE_PROGRAM_OPTIONS),
    ],
    advancedFields: [currencyField()],
    validate(values) {
      return values.homePrice <= 0 ? "Enter a home price." : "";
    },
    compute(values) {
      const stateFactor = 0.018 + getStatePropertyTaxRate(values.state) * 0.4;
      const programFee = getMortgageProgramFeeRate(values.loanProgram) * 0.35;
      const expected = values.homePrice * (stateFactor + programFee);
      const low = expected * 0.84;
      const high = expected * 1.18;

      return result(
        "Closing cost estimate by state",
        [
          card("Low range", moneyText(low, values.currency)),
          card("Expected cost", moneyText(expected, values.currency)),
          card("High range", moneyText(high, values.currency)),
          card("State", getStateLabel(values.state)),
        ],
        [
          moneyBar("Home price", values.homePrice, values.currency),
          moneyBar("Expected closing costs", expected, values.currency),
          moneyBar("High range", high, values.currency),
        ],
        [
          `${getStateLabel(values.state)} lands near ${moneyText(expected, values.currency)} in closing costs under the current assumptions.`,
          "Program choice can nudge the total up or down through financing fees and upfront insurance.",
        ],
        [
          note("State", getStateLabel(values.state)),
          note("Program", values.loanProgram.toUpperCase()),
          note("Expected cost", moneyText(expected, values.currency)),
        ],
      );
    },
  };
}

function makeRefinanceConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate refinance",
    emptyState: "Compare current and proposed mortgage terms to estimate payment change and breakeven time.",
    summaryLabel: "Refinance estimate",
    defaults: {
      currentBalance: 315000,
      currentRate: 7.1,
      newRate: 6.15,
      yearsLeft: 24,
      closingCosts: 6200,
      cashOut: definition.cashOutMode ? 30000 : 0,
      currency: "USD",
    },
    mainFields: [
      moneyField("currentBalance", "Current loan balance", 1000),
      percentField("currentRate", "Current rate", 0, 12, 0.05),
      percentField("newRate", "New rate", 0, 12, 0.05),
    ],
    advancedFields: [
      numberField("yearsLeft", "Years remaining", 1, 30, 1),
      moneyField("closingCosts", "Closing costs", 100),
      moneyField("cashOut", definition.cashOutMode ? "Cash-out amount" : "Optional cash-out", 100),
      currencyField(),
    ],
    validate(values) {
      return values.currentBalance <= 0 ? "Enter current balance." : "";
    },
    compute(values) {
      const currentPayment = amortizedPayment(values.currentBalance, values.currentRate, values.yearsLeft * 12);
      const newPrincipal = values.currentBalance + values.cashOut + values.closingCosts;
      const newPayment = amortizedPayment(newPrincipal, values.newRate, values.yearsLeft * 12);
      const monthlySavings = currentPayment - newPayment;
      const breakevenMonths = monthlySavings > 0 ? values.closingCosts / monthlySavings : Number.POSITIVE_INFINITY;

      return result(
        definition.cashOutMode ? "Cash-out refinance estimate" : "Refinance savings estimate",
        [
          card("Current payment", moneyText(currentPayment, values.currency)),
          card("New payment", moneyText(newPayment, values.currency)),
          card("Monthly savings", signedMoneyText(monthlySavings, values.currency)),
          card("Breakeven", Number.isFinite(breakevenMonths) ? `${Math.ceil(breakevenMonths)} months` : "No breakeven"),
        ],
        [
          moneyBar("Current balance", values.currentBalance, values.currency),
          moneyBar("New refinance balance", newPrincipal, values.currency),
          moneyBar("Current payment", currentPayment, values.currency),
          moneyBar("New payment", newPayment, values.currency),
        ],
        [
          definition.cashOutMode
            ? `The refinance folds ${moneyText(values.cashOut, values.currency)} of cash-out into the new balance.`
            : `The current assumptions change payment by ${signedMoneyText(monthlySavings, values.currency)} per month.`,
          Number.isFinite(breakevenMonths)
            ? `Closing costs are recovered in about ${Math.ceil(breakevenMonths)} months.`
            : "The current refinance does not recover closing costs under the entered assumptions.",
        ],
        [
          note("Years remaining", `${values.yearsLeft}`),
          note("Closing costs", moneyText(values.closingCosts, values.currency)),
          note("Cash-out", moneyText(values.cashOut, values.currency)),
        ],
      );
    },
  };
}

function makeBuydownConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate buydown",
    emptyState: "Estimate how mortgage points change monthly payment and breakeven timing.",
    summaryLabel: "Buydown estimate",
    defaults: {
      loanAmount: 360000,
      currentRate: 6.7,
      buydownPoints: 1.5,
      years: 30,
      currency: "USD",
    },
    mainFields: [
      moneyField("loanAmount", "Loan amount", 1000),
      percentField("currentRate", "Current rate", 0, 12, 0.05),
      numberField("buydownPoints", "Discount points", 0, 4, 0.25),
    ],
    advancedFields: [
      selectField("years", "Loan term", LOAN_TERM_OPTIONS),
      currencyField(),
    ],
    validate(values) {
      return values.loanAmount <= 0 ? "Enter loan amount." : "";
    },
    compute(values) {
      const newRate = Math.max(0.5, values.currentRate - values.buydownPoints * 0.25);
      const currentPayment = amortizedPayment(values.loanAmount, values.currentRate, Number(values.years) * 12);
      const newPayment = amortizedPayment(values.loanAmount, newRate, Number(values.years) * 12);
      const pointCost = values.loanAmount * (values.buydownPoints / 100);
      const savings = currentPayment - newPayment;
      const breakevenMonths = savings > 0 ? pointCost / savings : Number.POSITIVE_INFINITY;

      return result(
        "Rate buydown savings estimate",
        [
          card("New rate", percentText(newRate)),
          card("Monthly savings", moneyText(savings, values.currency)),
          card("Point cost", moneyText(pointCost, values.currency)),
          card("Breakeven", Number.isFinite(breakevenMonths) ? `${Math.ceil(breakevenMonths)} months` : "No breakeven"),
        ],
        [
          moneyBar("Current payment", currentPayment, values.currency),
          moneyBar("New payment", newPayment, values.currency),
          moneyBar("Point cost", pointCost, values.currency),
        ],
        [
          `Buying the rate down to ${percentText(newRate)} changes payment by about ${moneyText(savings, values.currency)} per month.`,
          "The shorter your expected hold period, the less likely the points recover before you move or refinance again.",
        ],
        [
          note("Points", fixed(values.buydownPoints)),
          note("New rate", percentText(newRate)),
          note("Breakeven", Number.isFinite(breakevenMonths) ? `${Math.ceil(breakevenMonths)} months` : "No"),
        ],
      );
    },
  };
}

function makeMortgageCompareConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Compare options",
    emptyState: "Compare two mortgage paths side by side.",
    summaryLabel: "Mortgage comparison",
    defaults: {
      loanAmount: 360000,
      rateA: definition.compareMode === "arm-fixed" ? 5.95 : 6.2,
      rateB: definition.compareMode === "arm-fixed" ? 6.55 : 6.65,
      years: 30,
      extraA: definition.compareMode === "fha-conventional" ? 165 : 0,
      extraB: definition.compareMode === "fha-conventional" ? 0 : 125,
      currency: "USD",
    },
    mainFields: [
      moneyField("loanAmount", "Loan amount", 1000),
      percentField("rateA", definition.compareMode === "arm-fixed" ? "ARM intro rate" : "Option A rate", 0, 12, 0.05),
      percentField("rateB", definition.compareMode === "arm-fixed" ? "Fixed rate" : "Option B rate", 0, 12, 0.05),
    ],
    advancedFields: [
      selectField("years", "Loan term", LOAN_TERM_OPTIONS),
      moneyField("extraA", "Option A monthly extras", 10),
      moneyField("extraB", "Option B monthly extras", 10),
      currencyField(),
    ],
    validate(values) {
      return values.loanAmount <= 0 ? "Enter loan amount." : "";
    },
    compute(values) {
      const paymentA = amortizedPayment(values.loanAmount, values.rateA, Number(values.years) * 12) + values.extraA;
      const paymentB = amortizedPayment(values.loanAmount, values.rateB, Number(values.years) * 12) + values.extraB;
      const gap = paymentB - paymentA;

      return result(
        `${definition.badge} comparison`,
        [
          card("Option A", moneyText(paymentA, values.currency)),
          card("Option B", moneyText(paymentB, values.currency)),
          card("Monthly gap", signedMoneyText(gap, values.currency)),
          card("Lower payment", paymentA <= paymentB ? "Option A" : "Option B"),
        ],
        [
          moneyBar("Option A monthly cost", paymentA, values.currency),
          moneyBar("Option B monthly cost", paymentB, values.currency),
          moneyBar("Monthly gap", gap, values.currency),
        ],
        [
          `The current assumptions favor ${paymentA <= paymentB ? "Option A" : "Option B"} on monthly payment.`,
          "Use this as a first-pass comparison before layering in credit score, term strategy, or long-hold risk.",
        ],
        [
          note("Loan amount", moneyText(values.loanAmount, values.currency)),
          note("Term", `${values.years} years`),
          note("Lower payment", paymentA <= paymentB ? "Option A" : "Option B"),
        ],
      );
    },
  };
}

function makeHelocConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate HELOC",
    emptyState: "Estimate HELOC draw payment and amortized repayment cost.",
    summaryLabel: "HELOC estimate",
    defaults: {
      drawAmount: 85000,
      interestRate: 8.1,
      interestOnlyYears: 5,
      repaymentYears: 15,
      currency: "USD",
    },
    mainFields: [
      moneyField("drawAmount", "Draw amount", 1000),
      percentField("interestRate", "Interest rate", 0, 15, 0.05),
      numberField("interestOnlyYears", "Interest-only years", 1, 10, 1),
    ],
    advancedFields: [
      numberField("repaymentYears", "Repayment years", 1, 25, 1),
      currencyField(),
    ],
    validate(values) {
      return values.drawAmount <= 0 ? "Enter draw amount." : "";
    },
    compute(values) {
      const monthlyInterestOnly = (values.drawAmount * (values.interestRate / 100)) / 12;
      const amortized = amortizedPayment(values.drawAmount, values.interestRate, values.repaymentYears * 12);
      return result(
        "HELOC payment estimate",
        [
          card("Interest-only payment", moneyText(monthlyInterestOnly, values.currency)),
          card("Repayment payment", moneyText(amortized, values.currency)),
          card("Interest-only period", `${values.interestOnlyYears} years`),
          card("Repayment term", `${values.repaymentYears} years`),
        ],
        [
          moneyBar("Draw amount", values.drawAmount, values.currency),
          moneyBar("Interest-only payment", monthlyInterestOnly, values.currency),
          moneyBar("Repayment payment", amortized, values.currency),
        ],
        [
          "HELOCs feel easier in the draw period, then tighten materially when repayment starts.",
          "Model the repayment phase before borrowing against home equity for a large project.",
        ],
        [
          note("Interest-only period", `${values.interestOnlyYears} years`),
          note("Repayment term", `${values.repaymentYears} years`),
          note("Rate", percentText(values.interestRate)),
        ],
      );
    },
  };
}

function makeRecastConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Plan recast",
    emptyState: "Estimate the payment drop after a lump-sum mortgage recast.",
    summaryLabel: "Recast estimate",
    defaults: {
      balance: 320000,
      rate: 6.4,
      yearsLeft: 24,
      lumpSum: 30000,
      currency: "USD",
    },
    mainFields: [
      moneyField("balance", "Current balance", 1000),
      percentField("rate", "Interest rate", 0, 12, 0.05),
      numberField("yearsLeft", "Years remaining", 1, 30, 1),
    ],
    advancedFields: [
      moneyField("lumpSum", "Recast lump sum", 1000),
      currencyField(),
    ],
    validate(values) {
      return values.balance <= 0 ? "Enter loan balance." : "";
    },
    compute(values) {
      const currentPayment = amortizedPayment(values.balance, values.rate, values.yearsLeft * 12);
      const newBalance = Math.max(0, values.balance - values.lumpSum);
      const recastPayment = amortizedPayment(newBalance, values.rate, values.yearsLeft * 12);
      const savings = currentPayment - recastPayment;
      return result(
        "Mortgage recast plan",
        [
          card("Current payment", moneyText(currentPayment, values.currency)),
          card("Recast payment", moneyText(recastPayment, values.currency)),
          card("Monthly savings", moneyText(savings, values.currency)),
          card("New balance", moneyText(newBalance, values.currency)),
        ],
        [
          moneyBar("Current balance", values.balance, values.currency),
          moneyBar("Recast lump sum", values.lumpSum, values.currency),
          moneyBar("New balance", newBalance, values.currency),
          moneyBar("Monthly savings", savings, values.currency),
        ],
        [
          `A ${moneyText(values.lumpSum, values.currency)} recast drops payment by about ${moneyText(savings, values.currency)} per month.`,
          "Recasting keeps the rate and term but lowers the payment, unlike extra-pay strategies that chase payoff speed.",
        ],
        [
          note("Years remaining", `${values.yearsLeft}`),
          note("Rate", percentText(values.rate)),
          note("Lump sum", moneyText(values.lumpSum, values.currency)),
        ],
      );
    },
  };
}

function makeExtraPaymentConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate payoff",
    emptyState: "Estimate time and interest saved from recurring extra mortgage payments.",
    summaryLabel: "Payoff estimate",
    defaults: {
      balance: 320000,
      rate: 6.4,
      yearsLeft: 24,
      extraMonthly: 250,
      currency: "USD",
    },
    mainFields: [
      moneyField("balance", "Current balance", 1000),
      percentField("rate", "Interest rate", 0, 12, 0.05),
      numberField("yearsLeft", "Years remaining", 1, 30, 1),
    ],
    advancedFields: [
      moneyField("extraMonthly", "Extra monthly payment", 25),
      currencyField(),
    ],
    validate(values) {
      return values.balance <= 0 ? "Enter loan balance." : "";
    },
    compute(values) {
      const basePayment = amortizedPayment(values.balance, values.rate, values.yearsLeft * 12);
      const acceleratedMonths = payoffMonths(values.balance, values.rate, basePayment + values.extraMonthly);
      const baseMonths = values.yearsLeft * 12;
      const monthsSaved = Math.max(0, baseMonths - acceleratedMonths);
      const interestSaved = values.extraMonthly * monthsSaved * 0.68;
      return result(
        "Extra payment payoff estimate",
        [
          card("Base payment", moneyText(basePayment, values.currency)),
          card("Months saved", `${Math.round(monthsSaved)}`),
          card("Interest saved", moneyText(interestSaved, values.currency)),
          card("Extra payment", moneyText(values.extraMonthly, values.currency)),
        ],
        [
          moneyBar("Base payment", basePayment, values.currency),
          moneyBar("Extra monthly payment", values.extraMonthly, values.currency),
          plainBar("Months saved", monthsSaved, `${Math.round(monthsSaved)} months`),
          moneyBar("Estimated interest saved", interestSaved, values.currency),
        ],
        [
          `An extra ${moneyText(values.extraMonthly, values.currency)} per month trims about ${Math.round(monthsSaved)} months from payoff in this model.`,
          "Extra payments usually outperform small cash drag when the mortgage rate is still elevated.",
        ],
        [
          note("Years remaining", `${values.yearsLeft}`),
          note("Rate", percentText(values.rate)),
          note("Extra payment", moneyText(values.extraMonthly, values.currency)),
        ],
      );
    },
  };
}

function makeCreditImpactConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate rate impact",
    emptyState: "Estimate how credit score range changes mortgage rate and payment.",
    summaryLabel: "Rate impact",
    defaults: {
      loanAmount: 360000,
      baseRate: 6.25,
      creditScore: 720,
      years: 30,
      currency: "USD",
    },
    mainFields: [
      moneyField("loanAmount", "Loan amount", 1000),
      percentField("baseRate", "Base mortgage rate", 0, 12, 0.05),
      numberField("creditScore", "Credit score", 500, 850, 1),
    ],
    advancedFields: [
      selectField("years", "Loan term", LOAN_TERM_OPTIONS),
      currencyField(),
    ],
    validate(values) {
      return values.loanAmount <= 0 ? "Enter loan amount." : "";
    },
    compute(values) {
      const rateAdj = values.creditScore >= 760 ? -0.35 : values.creditScore >= 720 ? 0 : values.creditScore >= 680 ? 0.35 : 0.8;
      const effectiveRate = Math.max(0.5, values.baseRate + rateAdj);
      const basePayment = amortizedPayment(values.loanAmount, values.baseRate, values.years * 12);
      const adjustedPayment = amortizedPayment(values.loanAmount, effectiveRate, values.years * 12);
      return result(
        "Credit score mortgage rate impact",
        [
          card("Effective rate", percentText(effectiveRate)),
          card("Adjusted payment", moneyText(adjustedPayment, values.currency)),
          card("Payment delta", signedMoneyText(adjustedPayment - basePayment, values.currency)),
          card("Credit score", `${Math.round(values.creditScore)}`),
        ],
        [
          moneyBar("Base payment", basePayment, values.currency),
          moneyBar("Adjusted payment", adjustedPayment, values.currency),
          plainBar("Rate adjustment", rateAdj, `${rateAdj >= 0 ? "+" : ""}${rateAdj.toFixed(2)} pts`),
        ],
        [
          `The score range moves the effective rate to about ${percentText(effectiveRate)} in this model.`,
          "Even modest rate shifts can add noticeable payment pressure on larger balances.",
        ],
        [
          note("Credit score", `${Math.round(values.creditScore)}`),
          note("Base rate", percentText(values.baseRate)),
          note("Effective rate", percentText(effectiveRate)),
        ],
      );
    },
  };
}

function makeDtiCheckerConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Check approval",
    emptyState: "Check debt-to-income ratio using monthly income, debts, and expected housing payment.",
    summaryLabel: "DTI check",
    defaults: {
      monthlyIncome: 9800,
      monthlyDebts: 650,
      housingPayment: 2650,
      targetLimit: 43,
    },
    mainFields: [
      moneyField("monthlyIncome", "Gross monthly income", 50),
      moneyField("monthlyDebts", "Other monthly debts", 25),
      moneyField("housingPayment", "Expected housing payment", 25),
    ],
    advancedFields: [
      percentField("targetLimit", "Target DTI limit", 20, 60, 0.5),
    ],
    validate(values) {
      return values.monthlyIncome <= 0 ? "Enter gross monthly income." : "";
    },
    compute(values) {
      const dti = ((values.monthlyDebts + values.housingPayment) / Math.max(values.monthlyIncome, 1)) * 100;
      const cushion = values.targetLimit - dti;
      return result(
        "Debt-to-income approval check",
        [
          card("Front-end + back-end DTI", percentText(dti)),
          card("Target limit", percentText(values.targetLimit)),
          card("Cushion", `${cushion >= 0 ? "+" : ""}${cushion.toFixed(1)} pts`),
          card("Status", cushion >= 0 ? "Within range" : "Above target"),
        ],
        [
          moneyBar("Gross monthly income", values.monthlyIncome, "USD"),
          moneyBar("Other debts", values.monthlyDebts, "USD"),
          moneyBar("Housing payment", values.housingPayment, "USD"),
        ],
        [
          cushion >= 0
            ? "The current payment stays inside the target DTI range."
            : "The current payment pushes DTI above the target range, so approval could get tighter.",
          "Reduce monthly debt or target a lower housing payment to widen the approval margin.",
        ],
        [
          note("DTI", percentText(dti)),
          note("Target", percentText(values.targetLimit)),
          note("Status", cushion >= 0 ? "Within range" : "Above target"),
        ],
      );
    },
  };
}

function makeHousingDecisionConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Compare housing paths",
    emptyState: "Compare two housing paths side by side using monthly cost and value assumptions.",
    summaryLabel: "Housing comparison",
    defaults: {
      monthlyCostA: definition.decisionMode === "rent-buy" ? 2100 : 2400,
      monthlyCostB: definition.decisionMode === "rent-buy" ? 2780 : 2890,
      annualGrowthA: definition.decisionMode === "rent-buy" ? 4 : 3,
      annualGrowthB: definition.decisionMode === "rent-buy" ? 3 : 6,
      years: 5,
      currency: "USD",
    },
    mainFields: [
      moneyField("monthlyCostA", definition.decisionMode === "rent-buy" ? "Rent path monthly cost" : "Buy now monthly cost", 25),
      moneyField("monthlyCostB", definition.decisionMode === "rent-buy" ? "Buy path monthly cost" : "Wait path monthly cost", 25),
      percentField("annualGrowthA", definition.decisionMode === "rent-buy" ? "Rent growth" : "Home appreciation", 0, 15, 0.25),
    ],
    advancedFields: [
      percentField("annualGrowthB", definition.decisionMode === "rent-buy" ? "Home appreciation" : "Rate / price drift", 0, 15, 0.25),
      numberField("years", "Decision horizon", 1, 15, 1),
      currencyField(),
    ],
    validate(values) {
      if (values.monthlyCostA <= 0 || values.monthlyCostB <= 0) return "Enter monthly costs for both paths.";
      return "";
    },
    compute(values) {
      const totalA = values.monthlyCostA * 12 * values.years;
      const totalB = values.monthlyCostB * 12 * values.years;
      const valueGainA = totalA * (values.annualGrowthA / 100) * 0.35;
      const valueGainB = totalB * (values.annualGrowthB / 100) * 0.35;
      const netA = valueGainA - totalA;
      const netB = valueGainB - totalB;
      const winner = netA >= netB ? "Path A" : "Path B";

      return result(
        `${definition.badge} comparison`,
        [
          card("Path A net", moneyText(netA, values.currency)),
          card("Path B net", moneyText(netB, values.currency)),
          card("Gap", signedMoneyText(netB - netA, values.currency)),
          card("Stronger path", winner),
        ],
        [
          moneyBar("Path A total outlay", totalA, values.currency),
          moneyBar("Path A value offset", valueGainA, values.currency),
          moneyBar("Path B total outlay", totalB, values.currency),
          moneyBar("Path B value offset", valueGainB, values.currency),
        ],
        [
          "The result is highly assumption-sensitive, so use it to frame the decision instead of treating it as certainty.",
          `${winner} carries the stronger projected net position across the selected horizon.`,
        ],
        [
          note("Horizon", `${values.years} years`),
          note("Path A growth", percentText(values.annualGrowthA)),
          note("Path B growth", percentText(values.annualGrowthB)),
        ],
      );
    },
  };
}

function makeStateTaxConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate tax",
    emptyState: "Estimate state-sensitive tax or paycheck output using generalized assumptions.",
    summaryLabel: "Tax estimate",
    defaults: {
      state: "tx",
      amount: definition.mode === "sales" ? 2500 : definition.mode === "bonus" ? 18000 : 96000,
      filingStatus: "single",
      age: 73,
      currency: "USD",
    },
    mainFields: [
      selectField("state", "State", STATE_OPTIONS),
      moneyField("amount", getAmountLabel(definition.mode), definition.mode === "sales" ? 100 : 500),
      ...(definition.mode === "income" || definition.mode === "paycheck" ? [selectField("filingStatus", "Filing status", FILING_STATUS_OPTIONS)] : []),
    ],
    advancedFields: [
      ...(definition.mode === "rmd" ? [numberField("age", "Age", 72, 95, 1)] : []),
      currencyField(),
    ],
    validate(values) {
      return values.amount <= 0 ? `Enter ${getAmountLabel(definition.mode).toLowerCase()}.` : "";
    },
    compute(values) {
      const stateRate = getStateIncomeTaxRate(values.state);
      const salesRate = getStateSalesTaxRate(values.state);
      let tax = 0;
      let effectiveRate = 0;
      let title = "State tax estimate";

      switch (definition.mode) {
        case "sales":
          effectiveRate = salesRate;
          tax = values.amount * salesRate;
          title = "State sales tax estimate";
          break;
        case "retirement":
          effectiveRate = stateRate * getRetirementTaxFactor(values.state);
          tax = values.amount * effectiveRate;
          title = "Retirement tax by state";
          break;
        case "social-security":
          effectiveRate = getSocialSecurityTaxFactor(values.state);
          tax = values.amount * effectiveRate;
          title = "Social Security tax by state";
          break;
        case "capital-gains":
          effectiveRate = stateRate * 0.82;
          tax = values.amount * effectiveRate;
          title = "Capital gains tax by state";
          break;
        case "bonus":
          effectiveRate = stateRate + 0.22;
          tax = values.amount * effectiveRate;
          title = "Bonus tax estimate";
          break;
        case "rmd":
          effectiveRate = (stateRate + 0.12) * (values.age >= 75 ? 1.05 : 1);
          tax = values.amount * effectiveRate;
          title = "RMD tax estimate";
          break;
        case "paycheck": {
          const federalRate = estimateFederalRate(values.amount, values.filingStatus);
          const fica = values.amount * 0.0765;
          tax = values.amount * (stateRate + federalRate) + fica;
          effectiveRate = tax / Math.max(values.amount, 1);
          title = "Paycheck breakdown by state";
          break;
        }
        case "income":
        default:
          effectiveRate = stateRate;
          tax = values.amount * stateRate;
          title = "State income tax estimate";
          break;
      }

      const afterTax = values.amount - tax;
      return result(
        title,
        [
          card("Estimated tax", moneyText(tax, values.currency)),
          card("After-tax amount", moneyText(afterTax, values.currency)),
          card("Effective rate", percentText(effectiveRate * 100)),
          card("State", getStateLabel(values.state)),
        ],
        [
          moneyBar("Taxable amount", values.amount, values.currency),
          moneyBar("Estimated tax", tax, values.currency),
          moneyBar("After-tax amount", afterTax, values.currency),
        ],
        [
          `${getStateLabel(values.state)} lands near ${moneyText(tax, values.currency)} in estimated tax under the current assumptions.`,
          "Treat this as directional planning, not tax filing advice.",
        ],
        [
          note("State", getStateLabel(values.state)),
          note("Effective rate", percentText(effectiveRate * 100)),
          ...(definition.mode === "rmd" ? [note("Age", `${values.age}`)] : []),
        ],
      );
    },
  };
}

function makeRefundConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate refund",
    emptyState: "Estimate refund or balance due from withholding, income, and credits.",
    summaryLabel: "Refund estimate",
    defaults: {
      state: "tx",
      annualIncome: 92000,
      withholding: 17500,
      credits: 1200,
      filingStatus: "single",
      currency: "USD",
    },
    mainFields: [
      moneyField("annualIncome", "Annual income", 500),
      moneyField("withholding", "Tax already withheld", 100),
      moneyField("credits", "Credits and adjustments", 100),
    ],
    advancedFields: [
      selectField("state", "State", STATE_OPTIONS),
      selectField("filingStatus", "Filing status", FILING_STATUS_OPTIONS),
      currencyField(),
    ],
    validate(values) {
      return values.annualIncome <= 0 ? "Enter annual income." : "";
    },
    compute(values) {
      const federalTax = values.annualIncome * estimateFederalRate(values.annualIncome, values.filingStatus);
      const stateTax = values.annualIncome * getStateIncomeTaxRate(values.state);
      const actualTax = Math.max(0, federalTax + stateTax - values.credits);
      const refund = values.withholding - actualTax;
      return result(
        "Tax refund estimate",
        [
          card("Estimated refund", refund >= 0 ? moneyText(refund, values.currency) : moneyText(0, values.currency)),
          card("Balance due", refund < 0 ? moneyText(Math.abs(refund), values.currency) : moneyText(0, values.currency)),
          card("Estimated total tax", moneyText(actualTax, values.currency)),
          card("Withholding", moneyText(values.withholding, values.currency)),
        ],
        [
          moneyBar("Federal tax", federalTax, values.currency),
          moneyBar("State tax", stateTax, values.currency),
          moneyBar("Credits", -values.credits, values.currency),
          moneyBar("Estimated actual tax", actualTax, values.currency),
        ],
        [
          refund >= 0
            ? `The current setup points to a refund near ${moneyText(refund, values.currency)}.`
            : `The current setup points to about ${moneyText(Math.abs(refund), values.currency)} still due.`,
          "A small change in withholding or credits can move the result materially.",
        ],
        [
          note("State", getStateLabel(values.state)),
          note("Filing status", labelForOption(values.filingStatus, FILING_STATUS_OPTIONS)),
          note("Withholding", moneyText(values.withholding, values.currency)),
        ],
      );
    },
  };
}

function makeWithholdingConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Plan withholding",
    emptyState: "Estimate how much monthly withholding closes the gap between current withholding and expected tax.",
    summaryLabel: "Withholding plan",
    defaults: {
      annualIncome: 94000,
      currentWithholding: 1200,
      targetRefund: 1500,
      filingStatus: "single",
      state: "tx",
      currency: "USD",
    },
    mainFields: [
      moneyField("annualIncome", "Annual income", 500),
      moneyField("currentWithholding", "Current monthly withholding", 25),
      moneyField("targetRefund", "Target refund", 100),
    ],
    advancedFields: [
      selectField("filingStatus", "Filing status", FILING_STATUS_OPTIONS),
      selectField("state", "State", STATE_OPTIONS),
      currencyField(),
    ],
    validate(values) {
      return values.annualIncome <= 0 ? "Enter annual income." : "";
    },
    compute(values) {
      const totalExpectedTax =
        values.annualIncome * estimateFederalRate(values.annualIncome, values.filingStatus) +
        values.annualIncome * getStateIncomeTaxRate(values.state);
      const targetWithholdingAnnual = totalExpectedTax + values.targetRefund;
      const suggestedMonthly = targetWithholdingAnnual / 12;
      const adjustment = suggestedMonthly - values.currentWithholding;
      return result(
        "W-4 withholding plan",
        [
          card("Suggested monthly withholding", moneyText(suggestedMonthly, values.currency)),
          card("Monthly adjustment", signedMoneyText(adjustment, values.currency)),
          card("Expected annual tax", moneyText(totalExpectedTax, values.currency)),
          card("Target refund", moneyText(values.targetRefund, values.currency)),
        ],
        [
          moneyBar("Expected annual tax", totalExpectedTax, values.currency),
          moneyBar("Current annual withholding", values.currentWithholding * 12, values.currency),
          moneyBar("Target annual withholding", targetWithholdingAnnual, values.currency),
        ],
        [
          `A monthly withholding target near ${moneyText(suggestedMonthly, values.currency)} aligns more closely with the stated refund goal.`,
          "Use payroll-specific guidance before changing withholding elections.",
        ],
        [
          note("State", getStateLabel(values.state)),
          note("Filing status", labelForOption(values.filingStatus, FILING_STATUS_OPTIONS)),
          note("Monthly adjustment", signedMoneyText(adjustment, values.currency)),
        ],
      );
    },
  };
}

function makeSelfEmploymentConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Estimate tax",
    emptyState: "Estimate tax reserve for freelance, contractor, and 1099 income using generalized federal and state assumptions.",
    summaryLabel: "Self-employment tax estimate",
    defaults: {
      state: "tx",
      netIncome: 120000,
      deductions: 18000,
      estimatedPayments: 12000,
      currency: "USD",
    },
    mainFields: [
      moneyField("netIncome", definition.mode === "1099" ? "1099 gross income" : "Net business income", 500),
      moneyField("deductions", "Deductions", 100),
      moneyField("estimatedPayments", "Estimated payments made", 100),
    ],
    advancedFields: [
      selectField("state", "State", STATE_OPTIONS),
      currencyField(),
    ],
    validate(values) {
      return values.netIncome <= 0 ? "Enter income." : "";
    },
    compute(values) {
      const taxable = Math.max(0, values.netIncome - values.deductions);
      const seTax = taxable * 0.153;
      const federal = taxable * 0.16;
      const state = taxable * getStateIncomeTaxRate(values.state);
      const totalTax = seTax + federal + state;
      const balance = totalTax - values.estimatedPayments;
      const quarterly = totalTax / 4;

      return result(
        definition.mode === "1099" ? "1099 tax estimate" : "Self-employment tax plan",
        [
          card("Estimated total tax", moneyText(totalTax, values.currency)),
          card("Quarterly reserve", moneyText(quarterly, values.currency)),
          card("Remaining balance", signedMoneyText(balance, values.currency)),
          card("Taxable income", moneyText(taxable, values.currency)),
        ],
        [
          moneyBar("Taxable income", taxable, values.currency),
          moneyBar("SE tax", seTax, values.currency),
          moneyBar("Federal tax", federal, values.currency),
          moneyBar("State tax", state, values.currency),
        ],
        [
          `The current assumptions point to about ${moneyText(totalTax, values.currency)} in total tax reserve.`,
          "Freelance and contractor cash flow usually feels better when quarterly tax is separated early instead of treated like leftover cash.",
        ],
        [
          note("State", getStateLabel(values.state)),
          note("Quarterly reserve", moneyText(quarterly, values.currency)),
          note("Remaining balance", signedMoneyText(balance, values.currency)),
        ],
      );
    },
  };
}

function makeBudgetPlannerConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Plan budget",
    emptyState: "Estimate spending room, savings rate, and remaining buffer using a simple monthly budget model.",
    summaryLabel: "Budget plan",
    defaults: {
      income: definition.paycheckMode ? 3600 : 7200,
      housing: 2100,
      essentials: 1500,
      lifestyle: 800,
      savingsTarget: definition.zeroBased ? 0 : 12,
      currency: "USD",
    },
    mainFields: [
      moneyField("income", definition.paycheckMode ? "Per-paycheck income" : "Monthly income", 25),
      moneyField("housing", "Housing spend", 25),
      moneyField("essentials", "Essentials spend", 25),
    ],
    advancedFields: [
      moneyField("lifestyle", "Lifestyle spend", 25),
      percentField("savingsTarget", "Savings target", 0, 40, 0.5),
      currencyField(),
    ],
    validate(values) {
      return values.income <= 0 ? "Enter income." : "";
    },
    compute(values) {
      const householdFactor = definition.householdFactor || 1;
      const totalSpend = values.housing + values.essentials * householdFactor + values.lifestyle * householdFactor * 0.75;
      const targetSavings = definition.zeroBased ? Math.max(0, values.income - totalSpend) : values.income * (values.savingsTarget / 100);
      const remaining = values.income - totalSpend - targetSavings;
      return result(
        `${definition.badge} plan`,
        [
          card("Total planned spend", moneyText(totalSpend, values.currency)),
          card("Savings target", moneyText(targetSavings, values.currency)),
          card("Remaining buffer", signedMoneyText(remaining, values.currency)),
          card("Planned savings rate", percentText((targetSavings / Math.max(values.income, 1)) * 100)),
        ],
        [
          moneyBar("Income", values.income, values.currency),
          moneyBar("Planned spend", totalSpend, values.currency),
          moneyBar("Savings target", targetSavings, values.currency),
          moneyBar("Remaining buffer", remaining, values.currency),
        ],
        [
          definition.zeroBased
            ? "Zero-based planning assigns every dollar to spending, debt, or savings."
            : `The current setup reserves about ${moneyText(targetSavings, values.currency)} for savings each cycle.`,
          remaining >= 0 ? "The plan still has room left after spending and savings." : "The plan runs short, so at least one category needs to come down.",
        ],
        [
          note("Household factor", `${householdFactor.toFixed(2)}x`),
          note("Savings target", definition.zeroBased ? "Dynamic" : percentText(values.savingsTarget)),
          note("Buffer", signedMoneyText(remaining, values.currency)),
        ],
      );
    },
  };
}

function makeDebtPayoffConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Plan payoff",
    emptyState: "Estimate debt payoff time and interest using a blended rate and monthly payment plan.",
    summaryLabel: "Debt payoff plan",
    defaults: {
      totalDebt: 28000,
      averageRate: 18,
      monthlyPayment: 750,
      extraPayment: 100,
      currency: "USD",
    },
    mainFields: [
      moneyField("totalDebt", "Total debt", 100),
      percentField("averageRate", "Average interest rate", 0, 40, 0.25),
      moneyField("monthlyPayment", "Monthly payment", 25),
    ],
    advancedFields: [
      moneyField("extraPayment", "Extra monthly payment", 25),
      currencyField(),
    ],
    validate(values) {
      if (values.totalDebt <= 0) return "Enter total debt.";
      if (values.monthlyPayment <= 0) return "Enter monthly payment.";
      return "";
    },
    compute(values) {
      const months = payoffMonths(values.totalDebt, values.averageRate, values.monthlyPayment + values.extraPayment);
      const baseMonths = payoffMonths(values.totalDebt, values.averageRate, values.monthlyPayment);
      const interestSaved = Math.max(0, (baseMonths - months) * values.extraPayment * 0.62);
      return result(
        "Debt payoff plan",
        [
          card("Payoff timeline", `${Math.ceil(months)} months`),
          card("Months saved", `${Math.max(0, Math.ceil(baseMonths - months))}`),
          card("Estimated interest saved", moneyText(interestSaved, values.currency)),
          card("Total monthly payment", moneyText(values.monthlyPayment + values.extraPayment, values.currency)),
        ],
        [
          moneyBar("Total debt", values.totalDebt, values.currency),
          moneyBar("Monthly payment", values.monthlyPayment, values.currency),
          moneyBar("Extra payment", values.extraPayment, values.currency),
        ],
        [
          `The current plan pays down the balance in about ${Math.ceil(months)} months.`,
          "Small recurring extra payments can collapse the timeline much faster than most people expect on high-rate debt.",
        ],
        [
          note("Average rate", percentText(values.averageRate)),
          note("Months saved", `${Math.max(0, Math.ceil(baseMonths - months))}`),
          note("Interest saved", moneyText(interestSaved, values.currency)),
        ],
      );
    },
  };
}

function makeEmergencyFundConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Plan fund",
    emptyState: "Estimate emergency fund target and how long it takes to build.",
    summaryLabel: "Emergency fund plan",
    defaults: {
      monthlyEssentials: 3200,
      targetMonths: 6,
      currentSavings: 4800,
      monthlyContribution: 500,
      currency: "USD",
    },
    mainFields: [
      moneyField("monthlyEssentials", "Monthly essentials", 25),
      numberField("targetMonths", "Target months of coverage", 1, 18, 1),
      moneyField("currentSavings", "Current emergency savings", 100),
    ],
    advancedFields: [
      moneyField("monthlyContribution", "Monthly contribution", 25),
      currencyField(),
    ],
    validate(values) {
      return values.monthlyEssentials <= 0 ? "Enter monthly essentials." : "";
    },
    compute(values) {
      const target = values.monthlyEssentials * values.targetMonths;
      const gap = Math.max(0, target - values.currentSavings);
      const months = values.monthlyContribution > 0 ? gap / values.monthlyContribution : Number.POSITIVE_INFINITY;
      return result(
        "Emergency fund plan",
        [
          card("Target fund", moneyText(target, values.currency)),
          card("Remaining gap", moneyText(gap, values.currency)),
          card("Months to target", Number.isFinite(months) ? `${Math.ceil(months)}` : "No progress"),
          card("Coverage now", `${(values.currentSavings / Math.max(values.monthlyEssentials, 1)).toFixed(1)} months`),
        ],
        [
          moneyBar("Target fund", target, values.currency),
          moneyBar("Current savings", values.currentSavings, values.currency),
          moneyBar("Remaining gap", gap, values.currency),
          moneyBar("Monthly contribution", values.monthlyContribution, values.currency),
        ],
        [
          `The current target is about ${moneyText(target, values.currency)}.`,
          Number.isFinite(months)
            ? `At the current contribution pace, the goal is reached in about ${Math.ceil(months)} months.`
            : "Add a monthly contribution to start closing the gap.",
        ],
        [
          note("Target months", `${values.targetMonths}`),
          note("Coverage now", `${(values.currentSavings / Math.max(values.monthlyEssentials, 1)).toFixed(1)} months`),
          note("Monthly contribution", moneyText(values.monthlyContribution, values.currency)),
        ],
      );
    },
  };
}

function makeNetWorthConfig(definition) {
  return {
    title: definition.title,
    categorySlug: definition.categorySlug,
    badge: definition.badge,
    aliases: [slugify(definition.title).replace(/-/g, " ")],
    actionLabel: "Track net worth",
    emptyState: "Estimate net worth from liquid assets, investments, property value, and total debt.",
    summaryLabel: "Net worth view",
    defaults: {
      cash: 18000,
      investments: 72000,
      property: 280000,
      debt: 146000,
      currency: "USD",
    },
    mainFields: [
      moneyField("cash", "Cash and emergency savings", 100),
      moneyField("investments", "Investments and retirement", 100),
      moneyField("property", "Property equity value", 1000),
    ],
    advancedFields: [
      moneyField("debt", "Total debt", 1000),
      currencyField(),
    ],
    validate(values) {
      return "";
    },
    compute(values) {
      const assets = values.cash + values.investments + values.property;
      const netWorth = assets - values.debt;
      const liquid = values.cash + values.investments;
      return result(
        "Net worth snapshot",
        [
          card("Net worth", moneyText(netWorth, values.currency)),
          card("Total assets", moneyText(assets, values.currency)),
          card("Total debt", moneyText(values.debt, values.currency)),
          card("Liquid share", percentText((liquid / Math.max(assets, 1)) * 100)),
        ],
        [
          moneyBar("Cash", values.cash, values.currency),
          moneyBar("Investments", values.investments, values.currency),
          moneyBar("Property equity", values.property, values.currency),
          moneyBar("Debt", -values.debt, values.currency),
        ],
        [
          `The current inputs point to a net worth near ${moneyText(netWorth, values.currency)}.`,
          "Track this over time to see whether progress is coming from cash, investments, or debt reduction.",
        ],
        [
          note("Liquid assets", moneyText(liquid, values.currency)),
          note("Property share", percentText((values.property / Math.max(assets, 1)) * 100)),
          note("Debt ratio", percentText((values.debt / Math.max(assets, 1)) * 100)),
        ],
      );
    },
  };
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

function booleanField(name, label) {
  return { name, label, type: "boolean" };
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
  return { label, value, displayValue: value >= 0 ? moneyText(value, currency, digits) : `-${moneyText(Math.abs(value), currency, digits)}` };
}

function plainBar(label, value, displayValue) {
  return { label, value, displayValue };
}

function result(title, summaryCards, breakdown, insights, meta, table) {
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

  return {
    title,
    summaryCards,
    breakdown,
    insights,
    meta,
    report,
    ...(table ? { table } : {}),
  };
}

function moneyText(value, currency = "USD", digits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}

function signedMoneyText(value, currency = "USD", digits = 0) {
  if (!Number.isFinite(value) || value === 0) return moneyText(0, currency, digits);
  return `${value > 0 ? "+" : "-"}${moneyText(Math.abs(value), currency, digits)}`;
}

function percentText(value) {
  const number = Number.isFinite(value) ? value : 0;
  return `${number.toFixed(Math.abs(number) >= 100 ? 0 : 1)}%`;
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

function count(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(Number.isFinite(value) ? value : 0));
}

function getMetroFactor(metro, key = "overall") {
  return METRO_PROFILES[metro]?.[key] || 1;
}

function getMetroLabel(metro) {
  return METRO_PROFILES[metro]?.label || "Selected city";
}

function getStateLabel(state) {
  return STATE_LABELS[state] || "Selected state";
}

function getRoleProfile(role) {
  return ROLE_PROFILES[role] || ROLE_PROFILES["software-engineer"];
}

function getStateSalaryFactor(state) {
  if (VERY_HIGH_COST_STATES.has(state)) return 1.16;
  if (HIGH_COST_STATES.has(state)) return 1.09;
  if (LOW_COST_STATES.has(state)) return 0.91;
  return 1;
}

function getStateHomeCostFactor(state) {
  if (VERY_HIGH_HOME_COST_STATES.has(state)) return 1.22;
  if (HIGH_HOME_COST_STATES.has(state)) return 1.1;
  if (LOW_HOME_COST_STATES.has(state)) return 0.89;
  return 1;
}

function getStateIncomeTaxRate(state) {
  if (NO_INCOME_TAX_STATES.has(state)) return 0;
  if (HIGH_INCOME_TAX_STATES.has(state)) return 0.08;
  if (MID_INCOME_TAX_STATES.has(state)) return 0.055;
  if (LOW_INCOME_TAX_STATES.has(state)) return 0.035;
  return 0.045;
}

function getStateSalesTaxRate(state) {
  if (NO_SALES_TAX_STATES.has(state)) return 0;
  if (HIGH_SALES_TAX_STATES.has(state)) return 0.0825;
  if (MID_SALES_TAX_STATES.has(state)) return 0.0675;
  return 0.055;
}

function getStatePropertyTaxRate(state) {
  if (HIGH_PROPERTY_TAX_STATES.has(state)) return 0.019;
  if (LOW_PROPERTY_TAX_STATES.has(state)) return 0.0065;
  return 0.011;
}

function getRetirementTaxFactor(state) {
  return RETIREMENT_FRIENDLY_STATES.has(state) ? 0.45 : 0.82;
}

function getSocialSecurityTaxFactor(state) {
  return SOCIAL_SECURITY_EXEMPT_STATES.has(state) ? 0 : 0.035;
}

function getTierFactor(tier) {
  if (tier === "value") return 0.9;
  if (tier === "premium") return 1.2;
  return 1;
}

function getComplexityFactor(level) {
  if (level === "simple") return 0.92;
  if (level === "complex") return 1.16;
  return 1;
}

function getMoveFactor(type) {
  if (type === "regional") return 1.12;
  if (type === "cross-country") return 1.38;
  if (type === "international") return 1.88;
  return 1;
}

function getExperienceFactor(level) {
  if (level === "entry") return 0.84;
  if (level === "senior") return 1.24;
  if (level === "lead") return 1.42;
  return 1;
}

function getMaterialProfileFactor(profile, type) {
  if (!profile || !type) return 1;

  if (profile === "roof") {
    if (type === "metal") return 1.35;
    if (type === "tile") return 1.55;
    return 1;
  }

  if (profile === "siding") {
    if (type === "fiber-cement") return 1.22;
    if (type === "wood") return 1.18;
    return 1;
  }

  if (profile === "windows") {
    if (type === "double") return 1.12;
    if (type === "picture") return 1.34;
    return 1;
  }

  if (profile === "water-heater") {
    if (type === "high-efficiency") return 1.18;
    if (type === "tankless") return 1.46;
    return 1;
  }

  if (profile === "hvac") {
    if (type === "heat-pump") return 1.16;
    if (type === "packaged") return 1.08;
    return 1;
  }

  if (profile === "solar") {
    if (type === "family") return 1.18;
    if (type === "high-output") return 1.34;
    return 1;
  }

  return 1;
}

function getMortgageProgramFeeRate(program) {
  if (program === "fha") return 0.0175;
  if (program === "va") return 0.0215;
  if (program === "usda") return 0.01;
  return 0;
}

function getProgramMonthlyInsurance(program, principal) {
  if (program === "fha") return (principal * 0.0055) / 12;
  if (program === "usda") return (principal * 0.0035) / 12;
  return 0;
}

function amortizedPayment(principal, annualRate, months) {
  const rate = annualRate / 100 / 12;
  if (!Number.isFinite(principal) || principal <= 0) return 0;
  if (!Number.isFinite(rate) || rate <= 0) return principal / Math.max(months, 1);
  return (principal * rate) / (1 - Math.pow(1 + rate, -Math.max(months, 1)));
}

function estimateHomePriceFromPayment(monthlyPayment, annualRate, propertyTaxRate, downPayment) {
  const insuranceRateMonthly = 0.0035 / 12;
  let guess = 250000;
  for (let index = 0; index < 12; index += 1) {
    const propertyTaxMonthly = (guess * propertyTaxRate) / 12;
    const insuranceMonthly = guess * insuranceRateMonthly;
    const principalGuess = Math.max(1000, guess - downPayment);
    const piTarget = Math.max(0, monthlyPayment - propertyTaxMonthly - insuranceMonthly);
    guess = principalFromPayment(piTarget, annualRate, 360) + downPayment;
  }
  return Math.max(0, guess);
}

function principalFromPayment(payment, annualRate, months) {
  const rate = annualRate / 100 / 12;
  if (rate <= 0) return payment * months;
  return payment * ((1 - Math.pow(1 + rate, -months)) / rate);
}

function payoffMonths(balance, annualRate, monthlyPayment) {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate <= 0) return balance / Math.max(monthlyPayment, 1);
  let months = 0;
  let current = balance;

  while (current > 0 && months < 600) {
    const interest = current * monthlyRate;
    current += interest - monthlyPayment;
    months += 1;
    if (monthlyPayment <= interest) return 600;
  }

  return months;
}

function estimateFederalRate(income, filingStatus) {
  const normalized = filingStatus === "married" ? income / 2 : income;
  if (normalized < 25000) return 0.1;
  if (normalized < 60000) return 0.12;
  if (normalized < 110000) return 0.18;
  if (normalized < 180000) return 0.22;
  return 0.26;
}

function getAmountLabel(mode) {
  if (mode === "sales") return "Purchase amount";
  if (mode === "retirement") return "Annual retirement income";
  if (mode === "social-security") return "Annual Social Security income";
  if (mode === "capital-gains") return "Taxable capital gain";
  if (mode === "bonus") return "Bonus amount";
  if (mode === "paycheck") return "Annual salary";
  if (mode === "rmd") return "Annual withdrawal amount";
  return "Taxable income";
}

function labelForOption(value, options = []) {
  return options.find((option) => String(option.value) === String(value))?.label || String(value);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
