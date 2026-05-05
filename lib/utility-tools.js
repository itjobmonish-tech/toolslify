import { titleCase } from "./utils.js";

export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateMetaTags({ topic = "", keyword = "", brand = "", tone = "balanced" }) {
  const cleanTopic = topic.trim() || "Untitled page";
  const cleanKeyword = keyword.trim();
  const cleanBrand = brand.trim() || "Toolslify";
  const tonePrefix =
    tone === "growth" ? "Best" : tone === "premium" ? "Premium" : tone === "simple" ? "Easy" : "Smart";
  const seoTitle = [cleanKeyword || cleanTopic, tonePrefix, cleanBrand].filter(Boolean).join(" | ");
  const metaDescription = `${cleanTopic}${cleanKeyword ? ` for ${cleanKeyword}` : ""}. Clear, user-friendly content built to attract clicks and explain the page quickly.`;
  const ogTitle = `${cleanTopic} | ${cleanBrand}`;
  const ogDescription = `Explore ${cleanTopic.toLowerCase()} with a cleaner experience, sharper messaging, and faster next steps.`;
  const slug = slugify(cleanKeyword || cleanTopic);

  return {
    title: seoTitle.slice(0, 62),
    description: metaDescription.slice(0, 158),
    ogTitle: ogTitle.slice(0, 62),
    ogDescription: ogDescription.slice(0, 155),
    slug,
  };
}

export function generateTitleIdeas({ topic = "", keyword = "", tone = "balanced" }) {
  const cleanTopic = topic.trim() || "Online tool";
  const cleanKeyword = keyword.trim() || cleanTopic;
  const prefix = tone === "growth" ? "Best" : tone === "premium" ? "Professional" : tone === "simple" ? "Easy" : "Smart";
  return [...new Set([
    `${prefix} ${cleanKeyword} for Faster Results`,
    `${titleCase(cleanTopic)} Made Simpler`,
    `${cleanKeyword}: Clean Workflow, Better Output`,
    `${titleCase(cleanTopic)} for Teams That Move Fast`,
    `${cleanKeyword} Without the Clutter`,
    `${titleCase(cleanTopic)} With a Smoother User Flow`,
    `${cleanKeyword} That Feels Built Like a Real Product`,
    `${titleCase(cleanTopic)} for Modern Web Workflows`,
  ])];
}

export function generateSlugVariants(title = "") {
  const primary = slugify(title);
  const words = primary.split("-").filter(Boolean);
  return [primary, words.slice(0, 6).join("-"), words.slice(0, 4).join("-")].filter(Boolean);
}

export function generateFaqSchema(source = "") {
  const pairs = parseFaqPairs(source);
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pairs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    null,
    2,
  );
}

export function generateRobotsTxt({
  siteUrl = "",
  blockAdmin = true,
  blockSearch = false,
  includeSitemap = true,
}) {
  const lines = ["User-agent: *", "Allow: /"];

  if (blockAdmin) {
    lines.push("Disallow: /admin/");
    lines.push("Disallow: /dashboard/");
  }

  if (blockSearch) {
    lines.push("Disallow: /search");
    lines.push("Disallow: /*?q=");
  }

  if (includeSitemap && siteUrl.trim()) {
    lines.push("", `Sitemap: ${siteUrl.replace(/\/$/, "")}/sitemap.xml`);
  }

  return lines.join("\n");
}

export function generateSitemapXml(urlList = "", lastModified = "") {
  const urls = urlList
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter(Boolean);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => [
      "  <url>",
      `    <loc>${escapeXml(url)}</loc>`,
      ...(lastModified ? [`    <lastmod>${escapeXml(lastModified)}</lastmod>`] : []),
      "  </url>",
    ].join("\n")),
    "</urlset>",
  ].join("\n");
}

export function formatJson(source = "") {
  return JSON.stringify(JSON.parse(source), null, 2);
}

export function transformUrl(source = "") {
  return {
    encoded: encodeURI(source),
    decoded: decodeURI(source),
  };
}

export function transformBase64(source = "") {
  let decoded = "";
  let encoded = "";

  try {
    const binary = atob(source);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    decoded = new TextDecoder().decode(bytes);
  } catch {
    decoded = "Invalid Base64 input";
  }

  try {
    const bytes = new TextEncoder().encode(source);
    encoded = btoa(String.fromCharCode(...bytes));
  } catch {
    encoded = "";
  }

  return {
    encoded,
    decoded,
  };
}

export function minifyHtml(source = "") {
  return source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function generateCitation({
  title = "",
  author = "",
  publisher = "",
  url = "",
  date = "",
  style = "apa",
}) {
  const cleanTitle = title.trim() || "Untitled source";
  const cleanAuthor = author.trim() || "Unknown author";
  const cleanPublisher = publisher.trim() || "Toolslify";
  const cleanUrl = url.trim() || "https://example.com";
  const cleanDate = date.trim() || "n.d.";

  const apa = `${cleanAuthor}. (${cleanDate}). ${cleanTitle}. ${cleanPublisher}. ${cleanUrl}`;
  const mla = `${cleanAuthor}. "${cleanTitle}." ${cleanPublisher}, ${cleanDate}, ${cleanUrl}.`;
  const chicago = `${cleanAuthor}. "${cleanTitle}." ${cleanPublisher}. ${cleanDate}. ${cleanUrl}.`;

  const selected =
    style === "mla" ? mla : style === "chicago" ? chicago : apa;

  return {
    selected,
    apa,
    mla,
    chicago,
  };
}

export function generatePrivacyPolicy({
  businessName = "",
  businessType = "",
  siteUrl = "",
  supportEmail = "",
  policyRegion = "general",
  dataCollected = "",
  thirdParties = "",
  usesCookies = true,
  collectsAnalytics = true,
  effectiveDate = "",
}) {
  const cleanBusinessName = businessName.trim() || "Your business";
  const cleanBusinessType = businessType.trim() || "website";
  const cleanSiteUrl = siteUrl.trim() || "https://example.com";
  const cleanSupportEmail = supportEmail.trim() || "support@example.com";
  const cleanEffectiveDate = effectiveDate.trim() || new Date().toISOString().slice(0, 10);
  const collectedItems = parseList(dataCollected, [
    "Name and contact information",
    "Messages or support requests",
    "Usage and device information",
  ]);
  const providerItems = parseList(thirdParties, [
    "Hosting provider",
    collectsAnalytics ? "Analytics provider" : "",
    "Payment or infrastructure partner",
  ]);

  const rightsSection =
    policyRegion === "gdpr"
      ? [
          "If you are located in the European Economic Area, you may have rights to access, correct, delete, restrict, or object to certain processing of your personal data.",
          "You may also request data portability and withdraw consent where processing relies on consent.",
        ]
      : policyRegion === "ccpa"
        ? [
            "If you are a California resident, you may have rights to know what personal information is collected, request deletion, and ask for disclosure about how information is used or shared.",
            "You may also have the right to opt out of certain data sharing where applicable.",
          ]
        : [
            "Depending on your location, you may have rights to access, update, or request deletion of your personal information.",
            "Contact us if you want to make a privacy-related request or ask how your data is handled.",
          ];

  const cookieLine = usesCookies
    ? "We may use cookies or similar technologies to remember preferences, keep the service running smoothly, and improve the overall experience."
    : "We do not rely on optional marketing cookies, though essential technical storage may still be used to keep the service functioning.";
  const analyticsLine = collectsAnalytics
    ? "We may collect analytics data such as pages visited, device signals, and referral information to understand product usage and improve performance."
    : "We do not currently use optional analytics tooling beyond basic service and security logging.";

  const content = [
    `Privacy Policy for ${cleanBusinessName}`,
    `Effective date: ${cleanEffectiveDate}`,
    "",
    `This Privacy Policy explains how ${cleanBusinessName} collects, uses, and protects information when you use our ${cleanBusinessType} at ${cleanSiteUrl}.`,
    "",
    "1. Information we collect",
    ...collectedItems.map((item) => `- ${item}`),
    "",
    "2. How we use information",
    "- To provide, operate, and improve the service.",
    "- To respond to inquiries, support requests, or account-related messages.",
    "- To maintain security, monitor misuse, and comply with legal obligations.",
    "",
    "3. Cookies and analytics",
    cookieLine,
    analyticsLine,
    "",
    "4. Third-party services",
    `We may rely on third-party providers to support hosting, payments, communications, analytics, or other operational needs. Examples include: ${providerItems.join(", ")}.`,
    "These providers may only process information as needed to deliver their services to us.",
    "",
    "5. Data retention",
    "We keep personal information only for as long as needed to provide the service, meet legal obligations, resolve disputes, or enforce agreements.",
    "",
    "6. Your privacy rights",
    ...rightsSection,
    "",
    "7. Security",
    "We use reasonable technical and organizational safeguards to protect information, but no online system can guarantee absolute security.",
    "",
    "8. Contact",
    `For privacy questions or requests, contact ${cleanSupportEmail}.`,
    "",
    "9. Legal note",
    "This draft is a practical starting point and should be reviewed for your specific business, jurisdiction, and legal requirements before publishing.",
  ].join("\n");

  return {
    content,
    collectedItems,
    providerItems,
  };
}

export function generateInvoicePackage({
  businessName = "",
  businessAddress = "",
  supportEmail = "",
  clientName = "",
  clientEmail = "",
  clientAddress = "",
  invoiceNumber = "",
  invoiceDate = "",
  dueDate = "",
  taxRate = 0,
  currencyCode = "INR",
  lineItems = "",
  paymentNote = "",
}) {
  const cleanBusinessName = businessName.trim() || "Your business";
  const cleanClientName = clientName.trim() || "Client";
  const cleanInvoiceNumber = invoiceNumber.trim() || "INV-1001";
  const cleanInvoiceDate = invoiceDate.trim() || new Date().toISOString().slice(0, 10);
  const cleanDueDate = dueDate.trim() || cleanInvoiceDate;
  const cleanCurrencyCode = normalizeCurrencyCode(currencyCode);
  const items = parseInvoiceItems(lineItems);
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * (Math.max(0, Number(taxRate) || 0) / 100);
  const total = subtotal + taxAmount;

  const summaryLines = [
    `Invoice ${cleanInvoiceNumber}`,
    "",
    "From",
    cleanBusinessName,
    businessAddress.trim() || "Business address not provided",
    supportEmail.trim() || "Contact email not provided",
    "",
    "Bill to",
    cleanClientName,
    clientEmail.trim() || "Client email not provided",
    clientAddress.trim() || "Client address not provided",
    "",
    `Invoice date: ${cleanInvoiceDate}`,
    `Due date: ${cleanDueDate}`,
    "",
    "Items",
    ...items.map(
      (item, index) =>
        `${index + 1}. ${item.description} / ${formatQuantity(item.quantity)} x ${formatMoney(item.rate, cleanCurrencyCode)} = ${formatMoney(item.total, cleanCurrencyCode)}`,
    ),
    "",
    `Subtotal: ${formatMoney(subtotal, cleanCurrencyCode)}`,
    `Tax (${Math.max(0, Number(taxRate) || 0)}%): ${formatMoney(taxAmount, cleanCurrencyCode)}`,
    `Total: ${formatMoney(total, cleanCurrencyCode)}`,
    "",
    "Payment note",
    paymentNote.trim() || "Payment due by the due date shown above.",
  ];

  const pdfBlob = createSimplePdfBlob({
    title: `Invoice ${cleanInvoiceNumber}`,
    lines: summaryLines,
  });

  return {
    summary: summaryLines.join("\n"),
    itemCount: items.length,
    subtotal,
    taxAmount,
    total,
    formattedSubtotal: formatMoney(subtotal, cleanCurrencyCode),
    formattedTaxAmount: formatMoney(taxAmount, cleanCurrencyCode),
    formattedTotal: formatMoney(total, cleanCurrencyCode),
    filename: `${slugify(`${cleanBusinessName}-${cleanInvoiceNumber}`) || "invoice"}.pdf`,
    pdfBlob,
  };
}

function parseFaqPairs(source) {
  const sections = source
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const pairs = sections
    .map((block) => {
      const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const questionLine = lines.find((line) => line.toLowerCase().startsWith("q:"));
      const answerLine = lines.find((line) => line.toLowerCase().startsWith("a:"));
      return {
        question: questionLine ? questionLine.slice(2).trim() : "",
        answer: answerLine ? answerLine.slice(2).trim() : "",
      };
    })
    .filter((item) => item.question && item.answer);

  return pairs.length
    ? pairs
    : [
        {
          question: "What does this page cover?",
          answer: "Replace this sample pair with your own question and answer blocks.",
        },
      ];
}

function parseList(source = "", fallback = []) {
  const items = source
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length ? items : fallback.filter(Boolean);
}

function parseInvoiceItems(source = "") {
  const rows = source
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!rows.length) {
    throw new Error("Add at least one invoice line item in the format Description | Quantity | Rate.");
  }

  return rows.map((row) => {
    const parts = row.includes("|")
      ? row.split("|").map((item) => item.trim()).filter(Boolean)
      : row.split(",").map((item) => item.trim()).filter(Boolean);

    if (parts.length < 3) {
      throw new Error("Each invoice line must use Description | Quantity | Rate.");
    }

    const description = parts.slice(0, -2).join(" / ");
    const quantity = parseNumericValue(parts.at(-2));
    const rate = parseNumericValue(parts.at(-1));

    if (!description || quantity <= 0 || rate < 0) {
      throw new Error("Invoice items need a description, a quantity above zero, and a valid rate.");
    }

    return {
      description,
      quantity,
      rate,
      total: quantity * rate,
    };
  });
}

function parseNumericValue(value = "") {
  return Number(String(value).replace(/[^0-9.-]/g, "")) || 0;
}

function formatQuantity(value) {
  const number = Number(value) || 0;
  return Number.isInteger(number) ? String(number) : number.toFixed(2);
}

function normalizeCurrencyCode(value = "INR") {
  const cleaned = value.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(cleaned) ? cleaned : "INR";
}

function formatMoney(value = 0, currencyCode = "INR") {
  const safeValue = Number.isFinite(value) ? value : 0;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(safeValue);
  } catch {
    return `${currencyCode} ${safeValue.toFixed(2)}`;
  }
}

function createSimplePdfBlob({ title = "Document", lines = [] }) {
  const printableLines = [title, "", ...lines]
    .flatMap((line) => wrapPdfLine(line, 84))
    .slice(0, 46);

  const contentCommands = [
    "BT",
    "/F1 18 Tf",
    "48 796 Td",
  ];

  printableLines.forEach((line, index) => {
    if (index === 1) {
      contentCommands.push("0 -22 Td");
      contentCommands.push("/F1 10 Tf");
    } else if (index > 0) {
      contentCommands.push("0 -14 Td");
    }

    contentCommands.push(`(${escapePdfText(normalizePdfText(line))}) Tj`);
  });

  contentCommands.push("ET");

  const stream = contentCommands.join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Count 1 /Kids [3 0 R] >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${byteLength(stream)} >>\nstream\n${stream}\nendstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(byteLength(pdf));
    pdf += object;
  });

  const xrefOffset = byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

function wrapPdfLine(line = "", maxLength = 84) {
  if (!line) return [""];

  const words = normalizePdfText(line).split(/\s+/).filter(Boolean);
  const wrapped = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxLength && currentLine) {
      wrapped.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine) {
    wrapped.push(currentLine);
  }

  return wrapped;
}

function normalizePdfText(value = "") {
  return String(value).replace(/[^\x20-\x7E]/g, "?");
}

function escapePdfText(value = "") {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function byteLength(value = "") {
  return new TextEncoder().encode(value).length;
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
