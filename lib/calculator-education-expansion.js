const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "GBP", label: "GBP (GBP)" },
  { value: "EUR", label: "EUR (EUR)" },
];

export const EDUCATION_CALCULATOR_CONFIGS = {
  "college-offer-true-net-cost-debt-outcome-comparator": makeEducationComparatorConfig({
    title: "College Offer True Net Cost + Debt Outcome Comparator",
    badge: "College ROI",
    actionLabel: "Compare college offers",
    emptyState: "Compare two college offers using tuition, grants, living cost, debt, and post-grad pay assumptions.",
    summaryLabel: "College offer comparison",
    aliases: ["college offer comparison calculator", "college net cost comparison", "compare college offers"],
    labels: ["School A", "School B"],
    defaults: {
      annualCostA: 41000,
      grantsA: 14500,
      durationYearsA: 4,
      incomeDuringTrainingA: 4000,
      startingSalaryA: 72000,
      salaryGrowthA: 4.2,
      debtAtCompletionA: 34000,
      annualCostB: 33000,
      grantsB: 8000,
      durationYearsB: 4,
      incomeDuringTrainingB: 4500,
      startingSalaryB: 66000,
      salaryGrowthB: 4,
      debtAtCompletionB: 22000,
      comparisonYears: 12,
      loanRate: 5.8,
      currency: "USD",
    },
  }),
  "trade-school-vs-4-year-degree-roi-planner": makeEducationComparatorConfig({
    title: "Trade School vs 4-Year Degree ROI Planner",
    badge: "Training ROI",
    actionLabel: "Compare training paths",
    emptyState: "Compare trade school and a four-year degree across cost, time to earnings, debt, and long-run income.",
    summaryLabel: "Training path comparison",
    aliases: ["trade school vs college calculator", "trade school roi", "degree roi planner"],
    labels: ["Trade school", "4-year degree"],
    defaults: {
      annualCostA: 19000,
      grantsA: 3500,
      durationYearsA: 2,
      incomeDuringTrainingA: 6000,
      startingSalaryA: 59000,
      salaryGrowthA: 4,
      debtAtCompletionA: 15000,
      annualCostB: 34000,
      grantsB: 9000,
      durationYearsB: 4,
      incomeDuringTrainingB: 5000,
      startingSalaryB: 76000,
      salaryGrowthB: 4.6,
      debtAtCompletionB: 42000,
      comparisonYears: 14,
      loanRate: 5.9,
      currency: "USD",
    },
  }),
  "grad-school-vs-work-now-lifetime-earnings-comparator": makeEducationComparatorConfig({
    title: "Grad School vs Work-Now Lifetime Earnings Comparator",
    badge: "Career path",
    actionLabel: "Compare grad school paths",
    emptyState: "Compare going to grad school now against staying in the workforce using lost earnings, tuition, and salary lift assumptions.",
    summaryLabel: "Grad school comparison",
    aliases: ["grad school vs working calculator", "masters roi calculator", "grad school payback"],
    labels: ["Grad school now", "Work now"],
    defaults: {
      annualCostA: 36000,
      grantsA: 11000,
      durationYearsA: 2,
      incomeDuringTrainingA: 18000,
      startingSalaryA: 118000,
      salaryGrowthA: 4.8,
      debtAtCompletionA: 42000,
      annualCostB: 0,
      grantsB: 0,
      durationYearsB: 0,
      incomeDuringTrainingB: 0,
      startingSalaryB: 84000,
      salaryGrowthB: 4.1,
      debtAtCompletionB: 0,
      comparisonYears: 15,
      loanRate: 6,
      currency: "USD",
    },
  }),
  "bootcamp-vs-self-taught-career-switch-roi-planner": makeEducationComparatorConfig({
    title: "Bootcamp vs Self-Taught Career Switch ROI Planner",
    badge: "Career switch",
    actionLabel: "Compare switch paths",
    emptyState: "Compare a paid bootcamp path against a self-taught path using timeline, tuition, and salary assumptions.",
    summaryLabel: "Career switch ROI",
    aliases: ["bootcamp vs self taught calculator", "coding bootcamp roi", "career switch roi planner"],
    labels: ["Bootcamp", "Self-taught"],
    defaults: {
      annualCostA: 18000,
      grantsA: 1000,
      durationYearsA: 0.75,
      incomeDuringTrainingA: 12000,
      startingSalaryA: 82000,
      salaryGrowthA: 5.2,
      debtAtCompletionA: 10000,
      annualCostB: 3500,
      grantsB: 0,
      durationYearsB: 1.25,
      incomeDuringTrainingB: 16000,
      startingSalaryB: 72000,
      salaryGrowthB: 4.8,
      debtAtCompletionB: 0,
      comparisonYears: 10,
      loanRate: 6.2,
      currency: "USD",
    },
  }),
  "college-major-roi-loan-stress-comparator": makeEducationComparatorConfig({
    title: "College Major ROI + Loan Stress Comparator",
    badge: "Major compare",
    actionLabel: "Compare majors",
    emptyState: "Compare two majors using net cost, debt, and early-career salary pressure.",
    summaryLabel: "Major ROI comparison",
    aliases: ["college major roi calculator", "major salary debt comparison", "major loan stress calculator"],
    labels: ["Major A", "Major B"],
    defaults: {
      annualCostA: 30000,
      grantsA: 7000,
      durationYearsA: 4,
      incomeDuringTrainingA: 3500,
      startingSalaryA: 89000,
      salaryGrowthA: 4.6,
      debtAtCompletionA: 32000,
      annualCostB: 30000,
      grantsB: 7000,
      durationYearsB: 4,
      incomeDuringTrainingB: 3500,
      startingSalaryB: 62000,
      salaryGrowthB: 4.1,
      debtAtCompletionB: 32000,
      comparisonYears: 12,
      loanRate: 5.8,
      currency: "USD",
    },
  }),
  "apprenticeship-vs-college-cashflow-comparator": makeEducationComparatorConfig({
    title: "Apprenticeship vs College Cashflow Comparator",
    badge: "Cashflow compare",
    actionLabel: "Compare apprenticeship and college",
    emptyState: "Compare an apprenticeship path against college using pay while learning, debt, and long-run salary assumptions.",
    summaryLabel: "Apprenticeship comparison",
    aliases: ["apprenticeship vs college calculator", "earn while you learn calculator"],
    labels: ["Apprenticeship", "College"],
    defaults: {
      annualCostA: 1500,
      grantsA: 0,
      durationYearsA: 3,
      incomeDuringTrainingA: 36000,
      startingSalaryA: 70000,
      salaryGrowthA: 4.3,
      debtAtCompletionA: 0,
      annualCostB: 31000,
      grantsB: 7000,
      durationYearsB: 4,
      incomeDuringTrainingB: 3000,
      startingSalaryB: 76000,
      salaryGrowthB: 4.7,
      debtAtCompletionB: 29000,
      comparisonYears: 14,
      loanRate: 5.9,
      currency: "USD",
    },
  }),
  "community-college-transfer-path-cost-optimizer": makeEducationComparatorConfig({
    title: "Community College Transfer Path Cost Optimizer",
    badge: "Transfer path",
    actionLabel: "Compare transfer paths",
    emptyState: "Compare a community-college transfer path against direct four-year enrollment using cost, debt, and time-to-earnings assumptions.",
    summaryLabel: "Transfer path comparison",
    aliases: ["community college transfer calculator", "transfer path optimizer", "2 plus 2 college cost calculator"],
    labels: ["Community college + transfer", "Direct 4-year"],
    defaults: {
      annualCostA: 16000,
      grantsA: 4500,
      durationYearsA: 4,
      incomeDuringTrainingA: 5000,
      startingSalaryA: 69000,
      salaryGrowthA: 4.3,
      debtAtCompletionA: 18000,
      annualCostB: 33000,
      grantsB: 6500,
      durationYearsB: 4,
      incomeDuringTrainingB: 3500,
      startingSalaryB: 70000,
      salaryGrowthB: 4.3,
      debtAtCompletionB: 34000,
      comparisonYears: 12,
      loanRate: 5.7,
      currency: "USD",
    },
  }),
  "nursing-program-waitlist-vs-private-program-cost-planner": makeEducationComparatorConfig({
    title: "Nursing Program Waitlist vs Private Program Cost Planner",
    badge: "Nursing path",
    actionLabel: "Compare nursing paths",
    emptyState: "Compare waiting for a lower-cost nursing seat against starting a private program now.",
    summaryLabel: "Nursing path comparison",
    aliases: ["nursing school waitlist calculator", "private nursing program cost planner"],
    labels: ["Waitlist path", "Private program now"],
    defaults: {
      annualCostA: 14000,
      grantsA: 2000,
      durationYearsA: 3,
      incomeDuringTrainingA: 14000,
      startingSalaryA: 76000,
      salaryGrowthA: 4.2,
      debtAtCompletionA: 16000,
      annualCostB: 35000,
      grantsB: 4000,
      durationYearsB: 2,
      incomeDuringTrainingB: 10000,
      startingSalaryB: 76000,
      salaryGrowthB: 4.2,
      debtAtCompletionB: 42000,
      comparisonYears: 10,
      loanRate: 6.1,
      currency: "USD",
    },
  }),
  "transfer-credit-graduation-delay-cost-planner": makeDelayPlannerConfig({
    title: "Transfer Credit + Graduation Delay Cost Planner",
    badge: "Delay planner",
    actionLabel: "Calculate delay cost",
    emptyState: "Estimate the cash impact of lost transfer credits and a delayed graduation timeline.",
    summaryLabel: "Transfer delay cost",
    aliases: ["transfer credit delay calculator", "graduation delay cost planner"],
    defaults: {
      directCost: 6500,
      extraBorrowing: 4800,
      monthlyLivingCost: 1450,
      delayMonths: 6,
      startingSalary: 62000,
      loanRate: 5.8,
      currency: "USD",
    },
  }),
  "study-abroad-semester-budget-degree-delay-planner": makeDelayPlannerConfig({
    title: "Study Abroad Semester Budget + Degree Delay Planner",
    badge: "Study abroad",
    actionLabel: "Plan study abroad cost",
    emptyState: "Estimate the full cost of a study-abroad semester, including travel, living, and any delay to graduation.",
    summaryLabel: "Study abroad cost",
    aliases: ["study abroad budget calculator", "semester abroad delay planner"],
    defaults: {
      directCost: 14000,
      extraBorrowing: 7500,
      monthlyLivingCost: 1700,
      delayMonths: 4,
      startingSalary: 68000,
      loanRate: 5.9,
      currency: "USD",
    },
  }),
  "license-exam-retake-delay-cost-planner": makeDelayPlannerConfig({
    title: "License Exam Retake + Delay Cost Planner",
    badge: "Exam delay",
    actionLabel: "Calculate retake cost",
    emptyState: "Estimate the cost of a failed licensing exam, including retake fees, prep, and delayed earnings.",
    summaryLabel: "Retake cost estimate",
    aliases: ["exam retake cost calculator", "license delay cost planner"],
    defaults: {
      directCost: 1800,
      extraBorrowing: 0,
      monthlyLivingCost: 1300,
      delayMonths: 3,
      startingSalary: 72000,
      loanRate: 5.6,
      currency: "USD",
    },
  }),
  "certification-roi-promotion-odds-planner": makeCertificationRoiConfig(),
  "internship-offer-vs-part-time-work-income-planner": makeInternshipVsPartTimeConfig(),
  "career-break-for-masters-degree-payback-planner": makeCareerBreakMastersConfig(),
  "employer-tuition-reimbursement-vs-student-loan-payoff-planner": makeTuitionReimbursementVsLoanPayoffConfig(),
};

function makeEducationComparatorConfig(definition) {
  const [labelA, labelB] = definition.labels;

  return {
    title: definition.title,
    categorySlug: "education-roi",
    badge: definition.badge,
    actionLabel: definition.actionLabel,
    emptyState: definition.emptyState,
    summaryLabel: definition.summaryLabel,
    surfaceStyle: "investment",
    aliases: definition.aliases,
    defaults: definition.defaults,
    mainFields: [
      moneyField("annualCostA", `${labelA} annual tuition and fees`, 100),
      moneyField("grantsA", `${labelA} annual grants or aid`, 50),
      numberField("durationYearsA", `${labelA} years or training length`, 0, 8, 0.25),
      moneyField("incomeDuringTrainingA", `${labelA} annual income while training`, 50),
      moneyField("startingSalaryA", `${labelA} starting annual pay`, 500),
      percentField("salaryGrowthA", `${labelA} annual salary growth`, 0, 15, 0.1),
      moneyField("debtAtCompletionA", `${labelA} debt at completion`, 100),
      moneyField("annualCostB", `${labelB} annual tuition and fees`, 100),
      moneyField("grantsB", `${labelB} annual grants or aid`, 50),
      numberField("durationYearsB", `${labelB} years or training length`, 0, 8, 0.25),
      moneyField("incomeDuringTrainingB", `${labelB} annual income while training`, 50),
      moneyField("startingSalaryB", `${labelB} starting annual pay`, 500),
      percentField("salaryGrowthB", `${labelB} annual salary growth`, 0, 15, 0.1),
      moneyField("debtAtCompletionB", `${labelB} debt at completion`, 100),
    ],
    advancedFields: [
      numberField("comparisonYears", "Comparison horizon in years", 3, 20, 1),
      percentField("loanRate", "Student loan interest rate", 0, 12, 0.05),
      currencyField(),
    ],
    fieldGroups: [
      { title: labelA, fields: ["annualCostA", "grantsA", "durationYearsA", "incomeDuringTrainingA", "startingSalaryA", "salaryGrowthA", "debtAtCompletionA"] },
      { title: labelB, fields: ["annualCostB", "grantsB", "durationYearsB", "incomeDuringTrainingB", "startingSalaryB", "salaryGrowthB", "debtAtCompletionB"] },
      { title: "Shared assumptions", fields: ["comparisonYears", "loanRate", "currency"] },
    ],
    validate(values) {
      if (values.annualCostA < values.grantsA || values.annualCostB < values.grantsB) {
        return "Annual grants should not exceed annual tuition and fees in this model.";
      }
      if (values.comparisonYears <= 0) return "Enter a comparison horizon.";
      return "";
    },
    compute(values) {
      const pathA = buildEducationPathOutcome({
        annualCost: values.annualCostA,
        grants: values.grantsA,
        durationYears: values.durationYearsA,
        incomeDuringTraining: values.incomeDuringTrainingA,
        startingSalary: values.startingSalaryA,
        salaryGrowth: values.salaryGrowthA,
        debtAtCompletion: values.debtAtCompletionA,
        loanRate: values.loanRate,
        comparisonYears: values.comparisonYears,
      });
      const pathB = buildEducationPathOutcome({
        annualCost: values.annualCostB,
        grants: values.grantsB,
        durationYears: values.durationYearsB,
        incomeDuringTraining: values.incomeDuringTrainingB,
        startingSalary: values.startingSalaryB,
        salaryGrowth: values.salaryGrowthB,
        debtAtCompletion: values.debtAtCompletionB,
        loanRate: values.loanRate,
        comparisonYears: values.comparisonYears,
      });
      const gap = pathB.netHorizonValue - pathA.netHorizonValue;
      const winner = gap >= 0 ? labelB : labelA;
      const breakEvenMonth = findBreakEvenMonth(pathA.monthlyTrack, pathB.monthlyTrack);

      return result(
        `${definition.summaryLabel}`,
        [
          card("Stronger horizon outcome", `${winner} ${signedMoneyText(gap, values.currency)}`),
          card(`${labelA} horizon value`, moneyText(pathA.netHorizonValue, values.currency)),
          card(`${labelB} horizon value`, moneyText(pathB.netHorizonValue, values.currency)),
          card("Break-even month", Number.isFinite(breakEvenMonth) ? `${Math.ceil(breakEvenMonth)}` : "No crossover"),
        ],
        [
          moneyBar(`${labelA} out-of-pocket cost`, pathA.outOfPocketCost, values.currency),
          moneyBar(`${labelA} horizon value`, pathA.netHorizonValue, values.currency),
          moneyBar(`${labelB} out-of-pocket cost`, pathB.outOfPocketCost, values.currency),
          moneyBar(`${labelB} horizon value`, pathB.netHorizonValue, values.currency),
          moneyBar("Outcome gap", gap, values.currency),
        ],
        [
          `${winner} finishes about ${moneyText(Math.abs(gap), values.currency)} ahead across the selected ${values.comparisonYears}-year horizon.`,
          Number.isFinite(breakEvenMonth)
            ? `The monthly cash tracks cross around month ${Math.ceil(breakEvenMonth)} in this model.`
            : "The cash tracks do not cross inside the selected horizon with the current assumptions.",
        ],
        [
          note("Horizon", `${values.comparisonYears} years`),
          note("Loan rate", percentText(values.loanRate)),
          note("Winner", winner),
        ],
        {
          table: buildTable(
            "Education path comparison",
            ["Path", "Net billed cost", "Debt at completion", "Monthly loan payment", "Horizon value"],
            [
              [labelA, moneyText(pathA.netBilledCost, values.currency), moneyText(pathA.debtAtCompletion, values.currency), moneyText(pathA.monthlyLoanPayment, values.currency), moneyText(pathA.netHorizonValue, values.currency)],
              [labelB, moneyText(pathB.netBilledCost, values.currency), moneyText(pathB.debtAtCompletion, values.currency), moneyText(pathB.monthlyLoanPayment, values.currency), moneyText(pathB.netHorizonValue, values.currency)],
            ],
            "Horizon value models earnings, out-of-pocket cost, and loan payments across the selected time window.",
          ),
        },
      );
    },
  };
}

function makeDelayPlannerConfig(definition) {
  return {
    title: definition.title,
    categorySlug: "education-roi",
    badge: definition.badge,
    actionLabel: definition.actionLabel,
    emptyState: definition.emptyState,
    summaryLabel: definition.summaryLabel,
    surfaceStyle: "ledger",
    aliases: definition.aliases,
    defaults: definition.defaults,
    mainFields: [
      moneyField("directCost", "Direct extra fees and program costs", 50),
      moneyField("extraBorrowing", "Extra borrowing caused by the delay", 50),
      moneyField("monthlyLivingCost", "Monthly living cost during the delay", 25),
      numberField("delayMonths", "Delay in months", 1, 24, 1),
      moneyField("startingSalary", "Expected starting annual salary", 500),
    ],
    advancedFields: [
      percentField("loanRate", "Student loan interest rate", 0, 12, 0.05),
      currencyField(),
    ],
    validate(values) {
      if (values.delayMonths <= 0) return "Enter the number of delayed months.";
      return "";
    },
    compute(values) {
      const outOfPocket = Math.max(0, values.directCost - values.extraBorrowing);
      const lostEarnings = (values.startingSalary / 12) * values.delayMonths;
      const addedLoanPayment = amortizedPayment(values.extraBorrowing, values.loanRate, 120);
      const tenYearLoanDrag = addedLoanPayment * 120;
      const totalSetback = outOfPocket + lostEarnings + tenYearLoanDrag;

      return result(
        definition.summaryLabel,
        [
          card("Immediate out-of-pocket cost", moneyText(outOfPocket, values.currency)),
          card("Lost earnings from delay", moneyText(lostEarnings, values.currency)),
          card("Added monthly loan payment", moneyText(addedLoanPayment, values.currency)),
          card("Modeled 10-year setback", moneyText(totalSetback, values.currency)),
        ],
        [
          moneyBar("Direct cost", values.directCost, values.currency),
          moneyBar("Extra borrowing", values.extraBorrowing, values.currency),
          moneyBar("Lost earnings", lostEarnings, values.currency),
          moneyBar("10-year loan drag", tenYearLoanDrag, values.currency),
          moneyBar("Total setback", totalSetback, values.currency),
        ],
        [
          `A ${values.delayMonths}-month delay costs about ${moneyText(lostEarnings, values.currency)} in missed starting income before even counting the direct program expense.`,
          "The financing piece matters because a delay can feel temporary while still creating a much longer repayment shadow afterward.",
        ],
        [
          note("Delay", `${values.delayMonths} months`),
          note("Loan rate", percentText(values.loanRate)),
          note("Expected starting salary", moneyText(values.startingSalary, values.currency)),
        ],
      );
    },
  };
}

function makeCertificationRoiConfig() {
  return {
    title: "Certification ROI + Promotion Odds Planner",
    categorySlug: "education-roi",
    badge: "Certification ROI",
    actionLabel: "Calculate certification ROI",
    emptyState: "Estimate whether a certification is worth it after cost, study time, promotion odds, and pay lift.",
    summaryLabel: "Certification ROI",
    surfaceStyle: "investment",
    aliases: ["certification roi calculator", "promotion odds planner", "certificate salary lift calculator"],
    defaults: {
      certificationCost: 4200,
      studyHours: 160,
      currentHourlyValue: 34,
      promotionRaise: 10500,
      promotionProbability: 38,
      fallbackRaise: 3200,
      monthsToPromotion: 9,
      taxRate: 24,
      horizonYears: 5,
      currency: "USD",
    },
    mainFields: [
      moneyField("certificationCost", "Certification and exam cost", 50),
      numberField("studyHours", "Study hours", 1, 1000, 1),
      moneyField("currentHourlyValue", "Current hourly value of your time", 1),
      moneyField("promotionRaise", "Annual raise if promotion happens", 100),
      percentField("promotionProbability", "Promotion probability", 0, 100, 1),
    ],
    advancedFields: [
      moneyField("fallbackRaise", "Annual raise without full promotion", 100),
      numberField("monthsToPromotion", "Months to the likely outcome", 1, 36, 1),
      percentField("taxRate", "Tax rate on the pay lift", 0, 45, 0.5),
      numberField("horizonYears", "ROI horizon in years", 1, 10, 1),
      currencyField(),
    ],
    validate(values) {
      return values.certificationCost <= 0 ? "Enter the certification cost." : "";
    },
    compute(values) {
      const timeCost = values.studyHours * values.currentHourlyValue;
      const expectedAnnualLift =
        values.promotionRaise * (values.promotionProbability / 100) +
        values.fallbackRaise * (1 - values.promotionProbability / 100);
      const afterTaxLift = expectedAnnualLift * (1 - values.taxRate / 100);
      const totalInvestment = values.certificationCost + timeCost;
      const horizonGain = afterTaxLift * values.horizonYears;
      const paybackMonths = afterTaxLift > 0 ? totalInvestment / (afterTaxLift / 12) : Number.POSITIVE_INFINITY;

      return result(
        "Certification ROI estimate",
        [
          card("Expected annual after-tax lift", moneyText(afterTaxLift, values.currency)),
          card("Total investment", moneyText(totalInvestment, values.currency)),
          card("Payback time", Number.isFinite(paybackMonths) ? `${fixed(paybackMonths)} months` : "No payback"),
          card(`${values.horizonYears}-year net gain`, moneyText(horizonGain - totalInvestment, values.currency)),
        ],
        [
          moneyBar("Certification cost", values.certificationCost, values.currency),
          moneyBar("Time cost", timeCost, values.currency),
          moneyBar("Expected after-tax lift", afterTaxLift, values.currency),
          moneyBar("Horizon gain", horizonGain, values.currency),
        ],
        [
          `With the current promotion odds, the certification produces an expected after-tax lift near ${moneyText(afterTaxLift, values.currency)} a year.`,
          Number.isFinite(paybackMonths)
            ? `That pays back the full investment in about ${fixed(paybackMonths)} months.`
            : "The current lift assumptions are too weak to recover the investment.",
        ],
        [
          note("Promotion odds", percentText(values.promotionProbability)),
          note("Months to outcome", `${values.monthsToPromotion}`),
          note("ROI horizon", `${values.horizonYears} years`),
        ],
      );
    },
  };
}

function makeInternshipVsPartTimeConfig() {
  return {
    title: "Internship Offer vs Part-Time Work Income Planner",
    categorySlug: "education-roi",
    badge: "Early career",
    actionLabel: "Compare income paths",
    emptyState: "Compare a structured internship against regular part-time work using immediate cash and a modeled post-grad salary lift.",
    summaryLabel: "Internship comparison",
    surfaceStyle: "salarySplit",
    aliases: ["internship vs part time calculator", "internship income planner"],
    defaults: {
      internshipWeeklyPay: 850,
      internshipWeeks: 12,
      internshipHousingCost: 2600,
      internshipFutureSalaryLift: 6500,
      partTimeHourlyRate: 19,
      partTimeHoursPerWeek: 24,
      partTimeWeeks: 20,
      partTimeFutureSalaryLift: 1800,
      horizonYears: 3,
      currency: "USD",
    },
    mainFields: [
      moneyField("internshipWeeklyPay", "Internship weekly pay", 10),
      numberField("internshipWeeks", "Internship weeks", 1, 52, 1),
      moneyField("internshipHousingCost", "Internship housing and relocation cost", 50),
      moneyField("internshipFutureSalaryLift", "Modeled annual salary lift from the internship", 100),
      moneyField("partTimeHourlyRate", "Part-time hourly rate", 1),
      numberField("partTimeHoursPerWeek", "Part-time hours per week", 1, 40, 1),
      numberField("partTimeWeeks", "Part-time weeks", 1, 52, 1),
      moneyField("partTimeFutureSalaryLift", "Modeled annual salary lift from the part-time path", 100),
    ],
    advancedFields: [
      numberField("horizonYears", "Career horizon in years", 1, 8, 1),
      currencyField(),
    ],
    validate(values) {
      return values.internshipWeeklyPay <= 0 || values.partTimeHourlyRate <= 0 ? "Enter pay details for both paths." : "";
    },
    compute(values) {
      const internshipCash = values.internshipWeeklyPay * values.internshipWeeks - values.internshipHousingCost;
      const partTimeCash = values.partTimeHourlyRate * values.partTimeHoursPerWeek * values.partTimeWeeks;
      const internshipHorizon = internshipCash + values.internshipFutureSalaryLift * values.horizonYears;
      const partTimeHorizon = partTimeCash + values.partTimeFutureSalaryLift * values.horizonYears;
      const gap = internshipHorizon - partTimeHorizon;

      return result(
        "Internship versus part-time income comparison",
        [
          card("Stronger modeled path", `${gap >= 0 ? "Internship" : "Part-time work"} ${moneyText(Math.abs(gap), values.currency)}`),
          card("Internship immediate cash", moneyText(internshipCash, values.currency)),
          card("Part-time immediate cash", moneyText(partTimeCash, values.currency)),
          card(`${values.horizonYears}-year modeled advantage`, moneyText(Math.abs(gap), values.currency)),
        ],
        [
          moneyBar("Internship immediate cash", internshipCash, values.currency),
          moneyBar("Internship horizon value", internshipHorizon, values.currency),
          moneyBar("Part-time immediate cash", partTimeCash, values.currency),
          moneyBar("Part-time horizon value", partTimeHorizon, values.currency),
        ],
        [
          gap >= 0
            ? "The internship wins here because the future salary lift outweighs the short-term housing drag."
            : "The part-time path wins here because the immediate earnings and smaller expense burden stay stronger than the modeled internship lift.",
          "This is one of those decisions where the short-term cash answer and the resume-value answer often point in different directions, so both belong in the model.",
        ],
        [
          note("Horizon", `${values.horizonYears} years`),
          note("Internship weeks", `${values.internshipWeeks}`),
          note("Part-time weeks", `${values.partTimeWeeks}`),
        ],
      );
    },
  };
}

function makeCareerBreakMastersConfig() {
  return {
    title: "Career Break for Masters Degree Payback Planner",
    categorySlug: "education-roi",
    badge: "Masters payback",
    actionLabel: "Plan masters payback",
    emptyState: "Estimate whether taking a full career break for a masters degree pays back fast enough for your current earnings path.",
    summaryLabel: "Masters payback plan",
    surfaceStyle: "investment",
    aliases: ["masters degree payback calculator", "career break for masters calculator"],
    defaults: {
      currentSalary: 91000,
      mastersCost: 42000,
      breakMonths: 14,
      incomeDuringBreak: 12000,
      postMastersSalary: 118000,
      postMastersGrowth: 4.7,
      mastersDebt: 28000,
      loanRate: 6,
      comparisonYears: 10,
      currency: "USD",
    },
    mainFields: [
      moneyField("currentSalary", "Current annual salary", 500),
      moneyField("mastersCost", "Masters tuition and fees", 100),
      numberField("breakMonths", "Career break months", 1, 36, 1),
      moneyField("incomeDuringBreak", "Total income during the break", 50),
      moneyField("postMastersSalary", "Expected post-masters salary", 500),
    ],
    advancedFields: [
      percentField("postMastersGrowth", "Post-masters annual growth", 0, 15, 0.1),
      moneyField("mastersDebt", "Debt added by the degree", 100),
      percentField("loanRate", "Loan rate", 0, 12, 0.05),
      numberField("comparisonYears", "Comparison horizon", 1, 15, 1),
      currencyField(),
    ],
    validate(values) {
      return values.currentSalary <= 0 || values.postMastersSalary <= 0 ? "Enter both the current and post-masters salary assumptions." : "";
    },
    compute(values) {
      const stayPath = buildStraightCareerPath(values.currentSalary, 4, values.comparisonYears);
      const mastersPath = buildMastersBreakPath(values);
      const gap = mastersPath.horizonValue - stayPath.horizonValue;
      const breakEvenMonth = findBreakEvenMonth(stayPath.monthlyTrack, mastersPath.monthlyTrack);

      return result(
        "Masters career-break payback",
        [
          card("End-of-horizon difference", signedMoneyText(gap, values.currency)),
          card("Stay-in-role horizon value", moneyText(stayPath.horizonValue, values.currency)),
          card("Masters path horizon value", moneyText(mastersPath.horizonValue, values.currency)),
          card("Break-even month", Number.isFinite(breakEvenMonth) ? `${Math.ceil(breakEvenMonth)}` : "After horizon"),
        ],
        [
          moneyBar("Stay-in-role value", stayPath.horizonValue, values.currency),
          moneyBar("Masters path value", mastersPath.horizonValue, values.currency),
          moneyBar("Masters debt payment", mastersPath.monthlyLoanPayment, values.currency),
          moneyBar("Outcome gap", gap, values.currency),
        ],
        [
          Number.isFinite(breakEvenMonth)
            ? `The masters path catches the stay-in-role path around month ${Math.ceil(breakEvenMonth)} in this model.`
            : "The masters path does not catch the stay-in-role path inside the selected horizon with the current assumptions.",
          "This tradeoff is mostly about the earnings you stop collecting during the break and how long the salary lift takes to earn that back.",
        ],
        [
          note("Break length", `${values.breakMonths} months`),
          note("Comparison horizon", `${values.comparisonYears} years`),
          note("Loan rate", percentText(values.loanRate)),
        ],
      );
    },
  };
}

function makeTuitionReimbursementVsLoanPayoffConfig() {
  return {
    title: "Employer Tuition Reimbursement vs Student Loan Payoff Planner",
    categorySlug: "education-roi",
    badge: "Employer support",
    actionLabel: "Compare reimbursement and payoff",
    emptyState: "Compare using employer tuition support for education against putting the same company-sponsored cash flow into faster loan payoff.",
    summaryLabel: "Reimbursement vs payoff",
    surfaceStyle: "investment",
    aliases: ["tuition reimbursement vs loan payoff calculator", "employer tuition benefit planner"],
    defaults: {
      annualCourseCost: 12000,
      annualReimbursement: 8000,
      yearsOfStudy: 2,
      salaryLiftAfterStudy: 9000,
      currentLoanBalance: 38000,
      currentLoanRate: 5.7,
      extraMonthlyPayoff: 350,
      comparisonYears: 8,
      currency: "USD",
    },
    mainFields: [
      moneyField("annualCourseCost", "Annual course cost", 100),
      moneyField("annualReimbursement", "Annual employer reimbursement", 100),
      numberField("yearsOfStudy", "Years of study", 1, 6, 1),
      moneyField("salaryLiftAfterStudy", "Annual salary lift after finishing", 100),
      moneyField("currentLoanBalance", "Current student loan balance", 100),
    ],
    advancedFields: [
      percentField("currentLoanRate", "Current student loan rate", 0, 12, 0.05),
      moneyField("extraMonthlyPayoff", "Extra monthly loan payment if you skip the program", 10),
      numberField("comparisonYears", "Comparison horizon", 1, 12, 1),
      currencyField(),
    ],
    validate(values) {
      return values.currentLoanBalance <= 0 ? "Enter the current student loan balance." : "";
    },
    compute(values) {
      const reimbursementGap = Math.max(0, values.annualCourseCost - values.annualReimbursement) * values.yearsOfStudy;
      const baseLoanPayment = amortizedPayment(values.currentLoanBalance, values.currentLoanRate, 120);
      const payoffPath = simulateFixedPayment(values.currentLoanBalance, values.currentLoanRate, baseLoanPayment + values.extraMonthlyPayoff);
      const studyPathLoan = simulateFixedPayment(values.currentLoanBalance, values.currentLoanRate, baseLoanPayment);
      const studyPathValue =
        values.salaryLiftAfterStudy * Math.max(0, values.comparisonYears - values.yearsOfStudy) -
        reimbursementGap -
        studyPathLoan.totalPaid;
      const payoffPathValue = -payoffPath.totalPaid;
      const gap = studyPathValue - payoffPathValue;

      return result(
        "Employer tuition reimbursement versus loan payoff",
        [
          card("Stronger modeled path", `${gap >= 0 ? "Use tuition reimbursement" : "Push extra loan payoff"} ${moneyText(Math.abs(gap), values.currency)}`),
          card("Out-of-pocket study cost", moneyText(reimbursementGap, values.currency)),
          card("Extra-payoff loan timeline", `${Math.round(payoffPath.months)} months`),
          card("Modeled horizon gap", moneyText(Math.abs(gap), values.currency)),
        ],
        [
          moneyBar("Study path out-of-pocket cost", reimbursementGap, values.currency),
          moneyBar("Study path loan payments", studyPathLoan.totalPaid, values.currency),
          moneyBar("Extra-payoff loan payments", payoffPath.totalPaid, values.currency),
          moneyBar("Outcome gap", gap, values.currency),
        ],
        [
          gap >= 0
            ? "The reimbursement path wins because the salary lift outweighs the out-of-pocket gap and the slower loan payoff."
            : "The extra-payoff path wins because the course gap and slower loan reduction are too expensive relative to the expected salary lift.",
          "This decision often looks different from a pure tuition question because the real alternative is usually not doing nothing. It is paying down existing debt faster.",
        ],
        [
          note("Years of study", `${values.yearsOfStudy}`),
          note("Loan rate", percentText(values.currentLoanRate)),
          note("Comparison horizon", `${values.comparisonYears} years`),
        ],
      );
    },
  };
}

function buildEducationPathOutcome(path) {
  const comparisonMonths = Math.round(path.comparisonYears * 12);
  const schoolMonths = Math.round(path.durationYears * 12);
  const netBilledCost = Math.max(0, (path.annualCost - path.grants) * path.durationYears);
  const outOfPocketCost = Math.max(0, netBilledCost - path.debtAtCompletion);
  const monthlySchoolCashDrag = schoolMonths > 0 ? outOfPocketCost / schoolMonths : 0;
  const monthlyLoanPayment = amortizedPayment(path.debtAtCompletion, path.loanRate, 120);
  const monthlyTrack = [];
  let cumulative = 0;

  for (let month = 1; month <= comparisonMonths; month += 1) {
    let monthlyCash = 0;

    if (month <= schoolMonths) {
      monthlyCash = path.incomeDuringTraining / 12 - monthlySchoolCashDrag;
    } else {
      const workingMonth = month - schoolMonths;
      const growthYear = Math.floor((workingMonth - 1) / 12);
      const annualSalary = path.startingSalary * Math.pow(1 + path.salaryGrowth / 100, growthYear);
      const loanPayment = workingMonth <= 120 ? monthlyLoanPayment : 0;
      monthlyCash = annualSalary / 12 - loanPayment;
    }

    cumulative += monthlyCash;
    monthlyTrack.push(cumulative);
  }

  return {
    netBilledCost,
    outOfPocketCost,
    debtAtCompletion: path.debtAtCompletion,
    monthlyLoanPayment,
    monthlyTrack,
    netHorizonValue: cumulative,
  };
}

function buildStraightCareerPath(startingSalary, salaryGrowth, comparisonYears) {
  const monthlyTrack = [];
  let cumulative = 0;
  for (let month = 1; month <= comparisonYears * 12; month += 1) {
    const growthYear = Math.floor((month - 1) / 12);
    const annualSalary = startingSalary * Math.pow(1 + salaryGrowth / 100, growthYear);
    cumulative += annualSalary / 12;
    monthlyTrack.push(cumulative);
  }

  return {
    horizonValue: cumulative,
    monthlyTrack,
  };
}

function buildMastersBreakPath(values) {
  const monthlyTrack = [];
  const outOfPocketCost = Math.max(0, values.mastersCost - values.mastersDebt);
  const monthlySchoolCashDrag = outOfPocketCost / Math.max(values.breakMonths, 1);
  const monthlyLoanPayment = amortizedPayment(values.mastersDebt, values.loanRate, 120);
  let cumulative = 0;

  for (let month = 1; month <= values.comparisonYears * 12; month += 1) {
    let monthlyCash = 0;

    if (month <= values.breakMonths) {
      monthlyCash = values.incomeDuringBreak / Math.max(values.breakMonths, 1) - monthlySchoolCashDrag;
    } else {
      const workingMonth = month - values.breakMonths;
      const growthYear = Math.floor((workingMonth - 1) / 12);
      const annualSalary = values.postMastersSalary * Math.pow(1 + values.postMastersGrowth / 100, growthYear);
      const loanPayment = workingMonth <= 120 ? monthlyLoanPayment : 0;
      monthlyCash = annualSalary / 12 - loanPayment;
    }

    cumulative += monthlyCash;
    monthlyTrack.push(cumulative);
  }

  return {
    horizonValue: cumulative,
    monthlyTrack,
    monthlyLoanPayment,
  };
}

function findBreakEvenMonth(trackA, trackB) {
  for (let index = 0; index < Math.min(trackA.length, trackB.length); index += 1) {
    const currentGap = trackB[index] - trackA[index];
    if (currentGap >= 0) {
      return index + 1;
    }
  }
  return Number.POSITIVE_INFINITY;
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

  return { months, totalPaid, remainingBalance: balance };
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

function fixed(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return Number.isInteger(safeValue) ? String(safeValue) : safeValue.toFixed(1).replace(/\.0$/, "");
}

function plain(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.abs(value) < 100 ? 2 : 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function amortizedPayment(principal, annualRate, months) {
  if (!Number.isFinite(principal) || principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}
