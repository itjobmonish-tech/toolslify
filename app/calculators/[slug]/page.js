import { notFound } from "next/navigation";
import { CategoryLandingShell } from "@/components/marketing/category-landing-shell";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { getCategoryPageBySlug, getCategoryPages } from "@/lib/site-data";
import { createBreadcrumbSchema, createCollectionPageSchema } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategoryPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getCategoryPageBySlug(slug);
  if (!page) return {};

  return buildPageMetadata({
    title: page.pageTitle,
    description: page.description,
    canonical: page.path,
    keywords: [
      `${page.title.toLowerCase()} calculators`,
      `${page.title.toLowerCase()} tools`,
      `${page.title.toLowerCase()} online`,
      "free online calculators",
    ],
  });
}

export default async function CalculatorCategoryPage({ params }) {
  const { slug } = await params;
  const page = getCategoryPageBySlug(slug);
  if (!page) {
    notFound();
  }

  const collectionSchema = createCollectionPageSchema(page.tools, {
    name: page.pageTitle,
    description: page.description,
    url: page.path,
  });
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/tools" },
    { name: page.title, path: page.path },
  ]);
  const siblingPages = getCategoryPages().filter((item) => item.slug !== page.slug);

  return (
    <div className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <CategoryLandingShell page={page} siblingPages={siblingPages} />
    </div>
  );
}
