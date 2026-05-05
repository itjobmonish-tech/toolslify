import { ToolDirectory } from "@/components/marketing/tool-directory";
import {
  getDirectoryPageData,
  getPopularToolCards,
  getQuickAccessToolCards,
  getToolCategorySummaries,
} from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { createBreadcrumbSchema, createCollectionPageSchema } from "@/lib/structured-data";

const TOOLS_PAGE_TITLE = "All Tools Directory";
const TOOLS_PAGE_DESCRIPTION =
  "Search Toolslify for salary, mortgage, tax, cost of living, home project, health, math, time, cooking, converter, and everyday tools.";

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const rawQuery = typeof resolvedSearchParams?.query === "string" ? resolvedSearchParams.query.trim() : "";
  const hasQuery = rawQuery.length > 0;

  return buildPageMetadata({
    title: hasQuery ? `Search Toolslify Tools for "${rawQuery}"` : TOOLS_PAGE_TITLE,
    description: hasQuery
      ? `Search Toolslify for ${rawQuery} and browse matching tools across salary, mortgage, tax, home cost, health, and more.`
      : TOOLS_PAGE_DESCRIPTION,
    canonical: "/tools",
    robots: hasQuery
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        }
      : undefined,
    twitterTitle: TOOLS_PAGE_TITLE,
    twitterDescription:
      "Browse Toolslify tools for salary, money, home cost, health, math, time, conversions, and everyday planning.",
  });
}

export default async function ToolsIndexPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const pageData = getDirectoryPageData({
    query: typeof resolvedSearchParams?.query === "string" ? resolvedSearchParams.query : "",
    category: typeof resolvedSearchParams?.category === "string" ? resolvedSearchParams.category : "",
    page: typeof resolvedSearchParams?.page === "string" ? resolvedSearchParams.page : "1",
  });
  const popularTools = getPopularToolCards();
  const quickAccessTools = getQuickAccessToolCards();
  const categoryCollections = getToolCategorySummaries();
  const collectionSchema = createCollectionPageSchema(pageData.tools, {
    name: "Toolslify Tools Directory",
    description: TOOLS_PAGE_DESCRIPTION,
    url: "/tools",
  });
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
  ]);
  const initialQuery = typeof resolvedSearchParams?.query === "string" ? resolvedSearchParams.query : "";
  const activeCategory = typeof resolvedSearchParams?.category === "string" ? resolvedSearchParams.category.trim().toLowerCase() : "";

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ToolDirectory
        displayTools={pageData.tools}
        quickAccessTools={quickAccessTools}
        popularTools={popularTools}
        categoryCollections={categoryCollections}
        heading="Find the right calculator fast"
        description="Search salary tools, cost of living comparisons, mortgage planners, tax and budget calculators, home cost estimators, health tools, math tools, time calculators, converters, and cooking helpers."
        initialQuery={initialQuery}
        activeCategory={activeCategory}
        pagination={{
          currentPage: pageData.currentPage,
          totalPages: pageData.totalPages,
          totalCount: pageData.totalCount,
        }}
      />
    </div>
  );
}
