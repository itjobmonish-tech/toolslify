import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata = {
  title: "About Toolslify",
  description: "Learn what Toolslify is built for, how the calculator suite is structured, and how the product approaches practical planning tools.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <LegalPageShell
      badge="About"
      title="About Toolslify"
      intro="Toolslify is built around a simple product idea: practical decisions deserve clear browser tools, not a maze of thin directories, confusing widgets, or spreadsheet cleanup."
      cardSection={{
        heading: "What the product focuses on",
        body: "Toolslify groups calculators around real planning jobs like pay, tax, mortgage, home costs, health, time, and conversion work so users can move from one answer into the next related check without restarting the search.",
      }}
      sections={[
        {
          heading: "Product philosophy",
          body: "The suite is designed to keep the input, main action, and result on the same screen. The goal is fast comprehension, repeat use, and cleaner follow-up decisions.",
        },
        {
          heading: "Where the tools fit",
          body: "Toolslify is best used for planning, comparison, and first-pass estimates. It is not positioned as a replacement for payroll systems, filed tax returns, lender disclosures, contractor bids, or medical care.",
        },
        {
          heading: "How the catalog is organized",
          body: "The catalog is intentionally grouped into focused categories and related-tool paths so users can keep moving through a decision instead of bouncing between unrelated utilities.",
        },
        {
          heading: "What will improve over time",
          body: "The product roadmap focuses on stronger methodology notes, better examples, category-specific review standards, richer result views, and more useful scenario comparison inside each calculator.",
        },
      ]}
    />
  );
}
