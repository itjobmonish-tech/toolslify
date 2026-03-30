import { SITE_URL } from "./site-data.js";

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Toolslify",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "Premium AI utility suite for humanizing text, generating assignments, summarizing meetings, converting voice notes, and extracting value from PDFs.",
  };
}

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Toolslify",
    url: SITE_URL,
    description:
      "All-in-one AI writing toolkit for students, creators, and professionals.",
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

export function createCollectionPageSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Toolslify AI Tool Suite",
    url: `${SITE_URL}/tools`,
    hasPart: items.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${tool.path}`,
      name: tool.name,
    })),
  };
}

export function createToolSchema(tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: tool.seoDescription,
    url: `${SITE_URL}${tool.path}`,
    featureList: tool.featureCards.map((item) => item.title),
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
    publisher: {
      "@type": "Organization",
      name: "Toolslify",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
    author: {
      "@type": "Organization",
      name: "Toolslify",
    },
  };
}
