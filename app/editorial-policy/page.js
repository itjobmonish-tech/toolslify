import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata = {
  title: "Editorial Policy",
  description: "Read how Toolslify approaches calculator methodology, category review, and updates to explanatory content.",
  alternates: {
    canonical: "/editorial-policy",
  },
};

export default function EditorialPolicyPage() {
  return (
    <LegalPageShell
      badge="Policy"
      title="Editorial Policy"
      intro="Toolslify aims to make calculator pages feel trustworthy by explaining the model, the assumptions, and the situations where the result should be verified elsewhere."
      cardSection={{
        heading: "What this policy covers",
        body: "This policy explains how Toolslify approaches methodology notes, examples, source references, updates, and category-specific review for higher-stakes calculator pages.",
      }}
      sections={[
        {
          heading: "Methodology first",
          body: "Serious calculator pages should explain the calculation approach in plain language, show a starter example, list assumptions, and describe the situations where the estimate can drift from a real outcome.",
        },
        {
          heading: "Source-aware review",
          body: "Finance, mortgage, tax, salary, and health pages should link users toward the official or category-standard references that govern the final decision, while making clear that the calculator itself is still a planning aid.",
        },
        {
          heading: "Update expectations",
          body: "When tax rules, lender practices, health guidance, or cost assumptions change, the related calculator pages and supporting copy should be reviewed and refreshed before those routes are promoted heavily.",
        },
        {
          heading: "Human review standard",
          body: "The strongest Toolslify pages are reviewed for clarity, internal consistency, and category fit. When a calculator touches high-stakes decisions, the page should be checked against authoritative references before launch or major promotion.",
        },
      ]}
    />
  );
}
