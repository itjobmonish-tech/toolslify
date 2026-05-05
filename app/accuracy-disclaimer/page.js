import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata = {
  title: "Accuracy Disclaimer",
  description: "Understand how Toolslify positions calculator outputs, examples, and category guidance for planning use.",
  alternates: {
    canonical: "/accuracy-disclaimer",
  },
};

export default function AccuracyDisclaimerPage() {
  return (
    <LegalPageShell
      badge="Policy"
      title="Accuracy Disclaimer"
      intro="Toolslify calculators are designed to be useful, fast, and transparent, but they are still estimate-driven tools. This page explains the limits that users should understand before relying on an output."
      cardSection={{
        heading: "Short version",
        body: "Calculator results on Toolslify are planning outputs, not guarantees. They should be checked against the source documents, professionals, or live quotes that control the real decision.",
      }}
      sections={[
        {
          heading: "Why results can differ",
          body: "Real outcomes change with taxes, payroll rules, lender overlays, material prices, insurance quotes, medical context, contractor availability, jurisdiction, and the accuracy of the values entered into the calculator.",
        },
        {
          heading: "High-stakes categories",
          body: "Finance, tax, mortgage, salary, and health pages are especially sensitive to timing and context. Use those results as a first-pass view, then verify them against official records or qualified guidance.",
        },
        {
          heading: "Examples on the site",
          body: "Worked examples are there to explain how a calculator behaves. They are not promises about your own result and should not be interpreted as financial, legal, medical, or contractual advice.",
        },
        {
          heading: "What users should do next",
          body: "When a decision affects a paycheck, loan, tax filing, medical choice, construction budget, or contract, confirm the result using current source documents and professional review before you act on it.",
        },
      ]}
    />
  );
}
