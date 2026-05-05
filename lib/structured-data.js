import { SITE_NAME, SITE_URL } from "./site-data.js";

const ORGANIZATION_ID = `${SITE_URL}#organization`;
const WEBSITE_ID = `${SITE_URL}#website`;
const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/opengraph-image`;

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "Fast online calculators for salary, cost of living, mortgage, tax, budget, home cost, health, math, time, conversions, cooking, and everyday planning.",
  };
}

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Tool-first workspace for salary, cost of living, mortgage, tax, budget, home cost, health, math, time, conversion, and everyday planning tools.",
    inLanguage: "en",
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/tools?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function createHomepageFaqSchema(faqItems) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createCollectionPageSchema(items, options = {}) {
  const itemList = items.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}${tool.path}`,
    name: tool.name,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name || `${SITE_NAME} Tool Directory`,
    description: options.description,
    url: options.url ? `${SITE_URL}${options.url}` : `${SITE_URL}/tools`,
    inLanguage: "en",
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    hasPart: itemList,
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: items.length,
      itemListElement: itemList,
    },
  };
}

export function createToolSchema(tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.seoDescription,
    url: `${SITE_URL}${tool.path}`,
    image: DEFAULT_SOCIAL_IMAGE,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: tool.category || tool.categorySlug,
    applicationSuite: SITE_NAME,
    operatingSystem: "Any",
    browserRequirements: "Requires a modern browser with JavaScript enabled.",
    softwareRequirements: "Requires a modern browser with JavaScript enabled.",
    isAccessibleForFree: true,
    inLanguage: "en",
    keywords: tool.keywords?.join(", "),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    featureList: tool.featureCards.map((item) => item.title),
  };
}

export function createHowToSchema(title, steps, path) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    url: `${SITE_URL}${path}`,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  };
}

export function createToolFaqSchema(tool) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: tool.name,
    mainEntity: tool.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function createSeoArticleSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    url: page.url,
    image: DEFAULT_SOCIAL_IMAGE,
    inLanguage: "en",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": page.url,
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    author: {
      "@id": ORGANIZATION_ID,
    },
  };
}
