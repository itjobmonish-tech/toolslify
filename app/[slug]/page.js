import { notFound, permanentRedirect } from "next/navigation";
import { getSeoPage, getSeoSlugs } from "@/lib/seo-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return getSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.ctaHref,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SeoLandingPage({ params }) {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page) {
    notFound();
  }

  permanentRedirect(page.ctaHref);
}
