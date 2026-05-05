import { ToolDirectory } from "@/components/marketing/tool-directory";
import {
  HOME_FAQ,
  getHomepageFeaturedToolCards,
  getPopularToolCards,
  getQuickAccessToolCards,
  getToolCategorySummaries,
} from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/seo-metadata";
import {
  createHomepageFaqSchema,
  createOrganizationSchema,
  createWebsiteSchema,
} from "@/lib/structured-data";

export const metadata = buildPageMetadata({
  title: "Free Online Calculators and Tools",
  description:
    "Use Toolslify for salary, mortgage, tax, cost of living, health, home project, math, time, cooking, conversion, and everyday calculators.",
  canonical: "/",
  twitterTitle: "Toolslify | Free Online Calculators and Tools",
  twitterDescription:
    "Fast browser tools for salary, mortgage, tax, city comparison, home cost, health, math, time, conversions, and everyday planning.",
});

export default function HomePage() {
  const displayTools = getHomepageFeaturedToolCards();
  const quickAccessTools = getQuickAccessToolCards();
  const popularTools = getPopularToolCards();
  const categoryCollections = getToolCategorySummaries();
  const organizationSchema = createOrganizationSchema();
  const websiteSchema = createWebsiteSchema();
  const faqSchema = createHomepageFaqSchema(HOME_FAQ);

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolDirectory
        displayTools={displayTools}
        quickAccessTools={quickAccessTools}
        popularTools={popularTools}
        categoryCollections={categoryCollections}
        heading="Free calculators for real decisions"
        description="Estimate salary, mortgage payments, taxes, city costs, home projects, health targets, dates, conversions, and everyday numbers in one place."
        showIntro
      />
    </div>
  );
}
