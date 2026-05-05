import { SITE_URL, getCategoryPagePath, getToolBySlug } from "./site-data.js";

const SEO_PAGE_DATA = [
  {
    slug: "salary-to-hourly-calculator",
    toolSlug: "salary-to-hourly-calculator",
    title: "Salary to Hourly Calculator",
    description: "Convert annual salary into a clean hourly estimate without opening a spreadsheet.",
    heroTitle: "Salary comparisons feel easier when the hourly equivalent is visible right away",
    searchPhrase: "salary to hourly calculator",
    promise: "a direct way to compare salaried pay against hourly and freelance work",
    audience: "employees, job seekers, contractors, and managers comparing offers",
    exampleBefore: "An annual salary number that is hard to compare against hourly work.",
    exampleAfter: "A clearer hourly, weekly, and monthly breakdown you can use immediately.",
    useCases: ["offer comparison", "contractor benchmarking", "pay planning"],
  },
  {
    slug: "take-home-pay-calculator",
    toolSlug: "take-home-pay-calculator",
    title: "Take-Home Pay Calculator",
    description: "Estimate monthly take-home pay after tax and deductions with a simple browser calculator.",
    heroTitle: "Take-home pay should be quick to estimate, not hidden behind a spreadsheet tab",
    searchPhrase: "take home pay calculator",
    promise: "a fast way to turn gross salary into a clearer net-pay picture",
    audience: "job seekers, employees, and anyone reviewing new compensation offers",
    exampleBefore: "A gross salary figure with too much uncertainty around the real monthly number.",
    exampleAfter: "A clearer net-pay estimate with tax and deduction assumptions kept visible.",
    useCases: ["salary offer review", "budget planning", "monthly cash-flow checks"],
  },
  {
    slug: "freelance-rate-calculator",
    toolSlug: "freelancer-rate-reality-calculator",
    title: "Freelance Rate Calculator",
    description: "Work backward from income goals, expenses, and billable time to estimate a stronger freelance rate.",
    heroTitle: "Freelance pricing works better when the math feels grounded instead of hopeful",
    searchPhrase: "freelance rate calculator",
    promise: "a more realistic route from income targets to client pricing",
    audience: "freelancers, consultants, solo operators, and agency owners",
    exampleBefore: "A rough rate guess that ignores expenses, taxes, and unbilled time.",
    exampleAfter: "A clearer pricing estimate tied to revenue targets and realistic billable hours.",
    useCases: ["setting a new freelance rate", "reviewing underpriced work", "planning a move from salary to independent work"],
  },
];

function createSections(page, tool) {
  return [
    {
      heading: `Why people search for ${page.searchPhrase}`,
      paragraphs: [
        `${page.description} People usually want a direct path from raw input to a result they can trust, copy, and reuse quickly.`,
        `Toolslify is built around ${page.promise}. The input stays visible first, the action stays obvious, and the result remains on the same screen.`,
      ],
    },
    {
      heading: "What a better tool experience feels like",
      paragraphs: [
        `The difference shows up in the move from "${page.exampleBefore}" to "${page.exampleAfter}". The output matters, but the real improvement is that the journey feels cleaner from first paste to final result.`,
        `That matters for ${page.audience}. When the page is simpler and more polished, people are more likely to finish the job and come back later instead of bouncing.`,
      ],
    },
    {
      heading: `Best use cases for ${tool.shortName.toLowerCase()}`,
      paragraphs: [
        `This route is useful for ${page.useCases.join(", ")}. Those are the moments where users want one focused tool instead of a heavy platform or a noisy directory page.`,
        "That is why every landing page here points directly into the live tool instead of stopping at theory or filler copy.",
      ],
    },
  ];
}

export function getSeoPage(slug) {
  const page = SEO_PAGE_DATA.find((item) => item.slug === slug);
  if (!page) return null;

  const tool = getToolBySlug(page.toolSlug);
  if (!tool) return null;

  return {
    ...page,
    sections: createSections(page, tool),
    faq: tool.faq,
    internalLinks: [
      { href: tool.path, label: tool.name },
      { href: "/tools", label: "Browse all tools" },
      { href: getCategoryPagePath(tool.categorySlug), label: `${tool.category} category` },
    ],
    ctaTitle: `Open ${tool.name} and use the live tool`,
    ctaHref: tool.path,
    canonical: `/${slug}`,
    url: `${SITE_URL}/${slug}`,
  };
}

export function getSeoSlugs() {
  return SEO_PAGE_DATA.map((page) => page.slug);
}

export function createSeoFaqSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: page.title,
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
