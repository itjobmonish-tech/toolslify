const CATEGORY_TEXT_KEYS = {
  finance: "categoryFinanceCalculators",
  "salary-data": "categorySalaryDataTools",
  "cost-of-living": "categoryCostOfLivingTools",
  "education-roi": "categoryEducationRoiTools",
  "mortgage-data": "categoryMortgageDataTools",
  "tax-budget": "categoryTaxBudgetTools",
  "home-costs": "categoryHomeCostTools",
  health: "categoryHealthCalculators",
  home: "categoryHomeCalculators",
  math: "categoryMathCalculators",
  time: "categoryTimeCalculators",
  everyday: "categoryEverydayCalculators",
  cooking: "categoryCookingCalculators",
  converters: "categoryConverterCalculators",
};

const CATEGORY_SHORT_LABELS = {
  finance: "Finance",
  "salary-data": "Salary",
  "cost-of-living": "COL",
  "education-roi": "Education",
  "mortgage-data": "Mortgage",
  "tax-budget": "Tax",
  "home-costs": "Home Cost",
  health: "Health",
  home: "Home",
  math: "Math",
  time: "Time",
  everyday: "Everyday",
  cooking: "Cooking",
  converters: "Convert",
};

export function getLocalizedCategoryTitle(slug, text, fallback) {
  const key = CATEGORY_TEXT_KEYS[slug];
  return (key && text?.[key]) || fallback;
}

export function getCategoryShortLabel(slug, fallback) {
  return CATEGORY_SHORT_LABELS[slug] || fallback || "Tools";
}
