"use client";

import { useEffect, useState } from "react";
import { getToolBySlug } from "@/lib/site-data";
import {
  formatJson,
  generateFaqSchema,
  generateCitation,
  generateInvoicePackage,
  generateMetaTags,
  generatePrivacyPolicy,
  generateRobotsTxt,
  generateSitemapXml,
  generateSlugVariants,
  generateTitleIdeas,
  minifyHtml,
  transformBase64,
  transformUrl,
} from "@/lib/utility-tools";
import { downloadBlobFile, downloadTextFile } from "@/lib/utils";
import { recordToolUsage } from "@/lib/tool-usage";
import { useToast } from "@/components/providers/toast-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Button } from "@/components/ui/button";
import {
  HistoryPanel,
  InputField,
  MetaNotes,
  OutputSurface,
  PanelCard,
  SegmentedControl,
  StatusBanner,
  TextEditor,
  useHistoryStorage,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";

function getInitialState(mode) {
  const today = new Date().toISOString().slice(0, 10);
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return {
    text: "",
    keyword: "",
    brand: "Toolslify",
    author: "",
    tone: "balanced",
    style: "apa",
    siteUrl: "https://example.com",
    blockAdmin: true,
    blockSearch: false,
    includeSitemap: true,
    lastModified: "",
    supportEmail: "hello@toolslify.com",
    businessType: "website",
    policyRegion: "general",
    dataCollected: "Name\nEmail address\nUsage data",
    thirdParties: "Hosting provider\nAnalytics provider",
    usesCookies: true,
    collectsAnalytics: true,
    effectiveDate: today,
    businessAddress: "Bangalore, India",
    clientName: "Acme Client",
    clientEmail: "client@example.com",
    clientAddress: "Client address",
    invoiceNumber: "INV-1001",
    invoiceDate: today,
    dueDate,
    taxRate: 18,
    currencyCode: "INR",
    lineItems: "Design sprint | 1 | 18000\nContent update support | 2 | 4500",
    paymentNote: "Payment due within 14 days by bank transfer.",
  };
}

const TONE_OPTIONS = [
  { label: "Balanced", value: "balanced" },
  { label: "Simple", value: "simple" },
  { label: "Premium", value: "premium" },
  { label: "Growth", value: "growth" },
];

const CITATION_STYLE_OPTIONS = [
  { label: "APA", value: "apa" },
  { label: "MLA", value: "mla" },
  { label: "Chicago", value: "chicago" },
];

const POLICY_REGION_OPTIONS = [
  { label: "General", value: "general" },
  { label: "GDPR", value: "gdpr" },
  { label: "CCPA", value: "ccpa" },
];

export function UtilityWorkspace({ slug, onContentReadyChange }) {
  const tool = getToolBySlug(slug);
  const { text } = usePreferences();
  const { showToast } = useToast();
  const [draft, setDraft] = usePersistentState(`toolslify:utility:${slug}:draft`, getInitialState(tool?.mode));
  const { history, pushHistory } = useHistoryStorage(`toolslify:utility:${slug}:history`);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("idle");

  useSubmitShortcut({
    enabled: true,
    onSubmit: handleRun,
  });

  if (!tool) {
    return <StatusBanner tone="warning">This utility tool is not configured yet.</StatusBanner>;
  }

  const hasStarted = Boolean(result) || history.length > 0;

  useEffect(() => {
    onContentReadyChange?.(hasStarted);
  }, [hasStarted, onContentReadyChange]);

  function handleRun() {
    try {
      const nextResult = runUtilityTool(tool.mode, draft);
      setResult(nextResult);
      setError("");
      pushHistory({
        label: tool.shortName,
        preview: nextResult.output.slice(0, 120),
        payload: { draft, result: nextResult },
      });
      recordToolUsage(slug);
      showToast({
        title: `${tool.shortName} ready`,
        description: "The generated result is ready below.",
        tone: "success",
      });
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Unable to generate the result.");
    }
  }

  async function handleCopy() {
    if (!result?.output) return;

    try {
      await navigator.clipboard.writeText(result.output);
      setCopyState("done");
      setTimeout(() => setCopyState("idle"), 1400);
      showToast({
        title: "Copied result",
        description: "The latest output is ready to paste.",
        tone: "success",
      });
    } catch {
      showToast({
        title: "Copy failed",
        description: "Use download if clipboard access is blocked.",
        tone: "warning",
      });
    }
  }

  function handleDownload() {
    if (result?.download?.blob) {
      downloadBlobFile(result.download.blob, result.download.filename);
      showToast({
        title: "Download started",
        description: `Saving ${result.download.filename} locally.`,
        tone: "success",
      });
      return;
    }

    if (!result?.output) return;

    downloadTextFile({
      content: result.output,
      filename: `${slug}.txt`,
    });
    showToast({
      title: "Download started",
      description: `Saving ${slug}.txt locally.`,
      tone: "success",
    });
  }

  function handleReset() {
    setDraft(getInitialState(tool.mode));
    setResult(null);
    setError("");
  }

  function restoreHistory(item) {
    if (!item.payload) return;
    setDraft(item.payload.draft || getInitialState(tool.mode));
    setResult(item.payload.result || null);
    setError("");
  }

  return (
    <div className="space-y-6">
      {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}

      <div id="tool-workspace" className="workspace-grid scroll-mt-28">
        <PanelCard
          eyebrow="Inputs"
          title={tool.inputTitle}
          minimal
          className="workspace-input-pane"
        >
          <div className="space-y-5">
            {renderUtilityFields(tool.mode, draft, setDraft)}

            <div id="tool-action" className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={handleRun} size="lg" className="min-w-[220px]">
                {tool.ctaLabel}
              </Button>
            </div>
          </div>
        </PanelCard>

        <PanelCard
          eyebrow="Preview"
          title={tool.outputTitle}
          className="workspace-output-pane p-6 sm:p-7"
        >
          <div className="space-y-5">
            <OutputSurface output={result?.output} placeholder={tool.outputPlaceholder} />

            {result ? (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button onClick={handleCopy} size="lg">
                    {copyState === "done" ? text.copied : text.copy}
                  </Button>
                  <Button onClick={handleDownload} variant="secondary" size="lg">
                    {text.download}
                  </Button>
                  <Button onClick={handleReset} variant="secondary" size="lg">
                    {text.clear}
                  </Button>
                </div>
                {result.notes?.length ? <MetaNotes items={result.notes} /> : null}
              </>
            ) : (
              <StatusBanner>
                Fill in the fields, run the tool once, and keep the generated output on the same screen.
              </StatusBanner>
            )}
          </div>
        </PanelCard>
      </div>

      {hasStarted ? (
        <HistoryPanel
          title={`${tool.shortName} history`}
          history={history}
          onRestore={restoreHistory}
          emptyMessage="Generated results will stay here in this browser for quick reuse."
        />
      ) : null}
    </div>
  );
}

function renderUtilityFields(mode, draft, setDraft) {
  if (mode === "meta-tag-generator") {
    return (
      <div className="space-y-4">
        <InputField
          value={draft.text}
          onChange={(text) => setDraft((current) => ({ ...current, text }))}
          placeholder="Enter the page topic or content brief."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            value={draft.keyword}
            onChange={(keyword) => setDraft((current) => ({ ...current, keyword }))}
            placeholder="Primary keyword"
          />
          <InputField
            value={draft.brand}
            onChange={(brand) => setDraft((current) => ({ ...current, brand }))}
            placeholder="Brand name"
          />
        </div>
        <SegmentedControl
          label="Tone"
          help="Choose the style of the generated metadata."
          options={TONE_OPTIONS}
          value={draft.tone}
          onChange={(tone) => setDraft((current) => ({ ...current, tone }))}
        />
      </div>
    );
  }

  if (mode === "title-idea-generator") {
    return (
      <div className="space-y-4">
        <InputField
          value={draft.text}
          onChange={(text) => setDraft((current) => ({ ...current, text }))}
          placeholder="Enter the page topic or campaign idea."
        />
        <InputField
          value={draft.keyword}
          onChange={(keyword) => setDraft((current) => ({ ...current, keyword }))}
          placeholder="Optional focus keyword"
        />
        <SegmentedControl
          label="Title direction"
          help="Choose the tone for the generated title ideas."
          options={TONE_OPTIONS}
          value={draft.tone}
          onChange={(tone) => setDraft((current) => ({ ...current, tone }))}
        />
      </div>
    );
  }

  if (mode === "slug-generator") {
    return (
      <InputField
        value={draft.text}
        onChange={(text) => setDraft((current) => ({ ...current, text }))}
        placeholder="Enter the title you want to turn into a slug."
      />
    );
  }

  if (mode === "citation-generator") {
    return (
      <div className="space-y-4">
        <InputField
          value={draft.text}
          onChange={(text) => setDraft((current) => ({ ...current, text }))}
          placeholder="Source title"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            value={draft.author}
            onChange={(author) => setDraft((current) => ({ ...current, author }))}
            placeholder="Author name"
          />
          <InputField
            value={draft.brand}
            onChange={(brand) => setDraft((current) => ({ ...current, brand }))}
            placeholder="Publisher or website"
          />
          <InputField
            value={draft.siteUrl}
            onChange={(siteUrl) => setDraft((current) => ({ ...current, siteUrl }))}
            placeholder="https://example.com/article"
          />
          <InputField
            value={draft.lastModified}
            onChange={(lastModified) => setDraft((current) => ({ ...current, lastModified }))}
            placeholder="2026-04-07"
          />
        </div>
        <SegmentedControl
          label="Citation style"
          help="Choose which citation style should be shown first."
          options={CITATION_STYLE_OPTIONS}
          value={draft.style}
          onChange={(style) => setDraft((current) => ({ ...current, style }))}
        />
      </div>
    );
  }

  if (mode === "faq-schema-generator" || mode === "json-formatter" || mode === "html-minifier") {
    return (
      <TextEditor
        value={draft.text}
        onChange={(text) => setDraft((current) => ({ ...current, text }))}
        placeholder={mode === "faq-schema-generator" ? "Q: What does this tool do?\nA: It converts FAQ blocks into JSON-LD." : "Paste your source input here."}
        className="min-h-[260px]"
      />
    );
  }

  if (mode === "robots-txt-generator") {
    return (
      <div className="space-y-4">
        <InputField
          value={draft.siteUrl}
          onChange={(siteUrl) => setDraft((current) => ({ ...current, siteUrl }))}
          placeholder="https://example.com"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={draft.blockAdmin}
              onChange={(event) => setDraft((current) => ({ ...current, blockAdmin: event.target.checked }))}
              className="mr-2"
            />
            Block admin paths
          </label>
          <label className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={draft.blockSearch}
              onChange={(event) => setDraft((current) => ({ ...current, blockSearch: event.target.checked }))}
              className="mr-2"
            />
            Block search URLs
          </label>
          <label className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={draft.includeSitemap}
              onChange={(event) => setDraft((current) => ({ ...current, includeSitemap: event.target.checked }))}
              className="mr-2"
            />
            Include sitemap
          </label>
        </div>
      </div>
    );
  }

  if (mode === "privacy-policy-generator") {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            value={draft.brand}
            onChange={(brand) => setDraft((current) => ({ ...current, brand }))}
            placeholder="Business or site name"
          />
          <InputField
            value={draft.businessType}
            onChange={(businessType) => setDraft((current) => ({ ...current, businessType }))}
            placeholder="Website, app, store, or SaaS"
          />
          <InputField
            value={draft.siteUrl}
            onChange={(siteUrl) => setDraft((current) => ({ ...current, siteUrl }))}
            placeholder="https://example.com"
          />
          <InputField
            value={draft.supportEmail}
            onChange={(supportEmail) => setDraft((current) => ({ ...current, supportEmail }))}
            placeholder="support@example.com"
          />
          <InputField
            type="date"
            value={draft.effectiveDate}
            onChange={(effectiveDate) => setDraft((current) => ({ ...current, effectiveDate }))}
            placeholder="Effective date"
          />
        </div>

        <SegmentedControl
          label="Compliance focus"
          help="Choose the rights language that best matches the main audience for the site or app."
          options={POLICY_REGION_OPTIONS}
          value={draft.policyRegion}
          onChange={(policyRegion) => setDraft((current) => ({ ...current, policyRegion }))}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={draft.usesCookies}
              onChange={(event) => setDraft((current) => ({ ...current, usesCookies: event.target.checked }))}
              className="mr-2"
            />
            Uses cookies or local storage
          </label>
          <label className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={draft.collectsAnalytics}
              onChange={(event) => setDraft((current) => ({ ...current, collectsAnalytics: event.target.checked }))}
              className="mr-2"
            />
            Uses analytics tooling
          </label>
        </div>

        <TextEditor
          value={draft.dataCollected}
          onChange={(dataCollected) => setDraft((current) => ({ ...current, dataCollected }))}
          placeholder={`Name\nEmail address\nUsage data`}
          className="min-h-[150px]"
        />
        <TextEditor
          value={draft.thirdParties}
          onChange={(thirdParties) => setDraft((current) => ({ ...current, thirdParties }))}
          placeholder={`Hosting provider\nAnalytics provider\nPayment processor`}
          className="min-h-[150px]"
        />
      </div>
    );
  }

  if (mode === "free-invoice-generator") {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            value={draft.brand}
            onChange={(brand) => setDraft((current) => ({ ...current, brand }))}
            placeholder="Your business name"
          />
          <InputField
            value={draft.businessAddress}
            onChange={(businessAddress) => setDraft((current) => ({ ...current, businessAddress }))}
            placeholder="Business address"
          />
          <InputField
            value={draft.supportEmail}
            onChange={(supportEmail) => setDraft((current) => ({ ...current, supportEmail }))}
            placeholder="Billing email"
          />
          <InputField
            value={draft.clientName}
            onChange={(clientName) => setDraft((current) => ({ ...current, clientName }))}
            placeholder="Client name"
          />
          <InputField
            value={draft.clientEmail}
            onChange={(clientEmail) => setDraft((current) => ({ ...current, clientEmail }))}
            placeholder="Client email"
          />
          <InputField
            value={draft.clientAddress}
            onChange={(clientAddress) => setDraft((current) => ({ ...current, clientAddress }))}
            placeholder="Client address"
          />
          <InputField
            value={draft.invoiceNumber}
            onChange={(invoiceNumber) => setDraft((current) => ({ ...current, invoiceNumber }))}
            placeholder="Invoice number"
          />
          <InputField
            type="date"
            value={draft.invoiceDate}
            onChange={(invoiceDate) => setDraft((current) => ({ ...current, invoiceDate }))}
            placeholder="Invoice date"
          />
          <InputField
            type="date"
            value={draft.dueDate}
            onChange={(dueDate) => setDraft((current) => ({ ...current, dueDate }))}
            placeholder="Due date"
          />
          <InputField
            type="number"
            value={String(draft.taxRate)}
            onChange={(taxRate) => setDraft((current) => ({ ...current, taxRate: Math.max(0, Number(taxRate) || 0) }))}
            placeholder="Tax rate"
          />
          <InputField
            value={draft.currencyCode}
            onChange={(currencyCode) => setDraft((current) => ({ ...current, currencyCode }))}
            placeholder="INR"
          />
        </div>

        <TextEditor
          value={draft.lineItems}
          onChange={(lineItems) => setDraft((current) => ({ ...current, lineItems }))}
          placeholder={`Design sprint | 1 | 18000\nRevision support | 2 | 4500`}
          className="min-h-[180px]"
        />
        <TextEditor
          value={draft.paymentNote}
          onChange={(paymentNote) => setDraft((current) => ({ ...current, paymentNote }))}
          placeholder="Optional payment note"
          className="min-h-[120px]"
        />
      </div>
    );
  }

  if (mode === "sitemap-xml-generator") {
    return (
      <div className="space-y-4">
        <TextEditor
          value={draft.text}
          onChange={(textValue) => setDraft((current) => ({ ...current, text: textValue }))}
          placeholder="https://example.com/\nhttps://example.com/tools\nhttps://example.com/tools/pdf-to-text"
          className="min-h-[240px]"
        />
        <InputField
          value={draft.lastModified}
          onChange={(lastModified) => setDraft((current) => ({ ...current, lastModified }))}
          placeholder="Optional lastmod date, for example 2026-04-06"
        />
      </div>
    );
  }

  return (
    <TextEditor
      value={draft.text}
      onChange={(textValue) => setDraft((current) => ({ ...current, text: textValue }))}
      placeholder="Paste your source input here."
      className="min-h-[240px]"
    />
  );
}

function runUtilityTool(mode, draft) {
  if (mode === "meta-tag-generator") {
    if (!draft.text.trim()) {
      throw new Error("Add the page topic first so the tool can generate metadata.");
    }

    const payload = generateMetaTags({
      topic: draft.text,
      keyword: draft.keyword,
      brand: draft.brand,
      tone: draft.tone,
    });
    const output = [
      `Title: ${payload.title}`,
      `Description: ${payload.description}`,
      `OG Title: ${payload.ogTitle}`,
      `OG Description: ${payload.ogDescription}`,
      `Slug: ${payload.slug}`,
    ].join("\n\n");

    return {
      output,
      notes: [
        { label: "Title length", value: `${payload.title.length} chars` },
        { label: "Description length", value: `${payload.description.length} chars` },
        { label: "Slug", value: payload.slug },
      ],
    };
  }

  if (mode === "title-idea-generator") {
    if (!draft.text.trim()) {
      throw new Error("Add the page topic first so the tool can generate title ideas.");
    }

    const titles = generateTitleIdeas({
      topic: draft.text,
      keyword: draft.keyword,
      tone: draft.tone,
    });
    return {
      output: titles.map((title, index) => `${index + 1}. ${title}`).join("\n"),
      notes: [
        { label: "Ideas", value: String(titles.length) },
        { label: "Tone", value: draft.tone },
      ],
    };
  }

  if (mode === "slug-generator") {
    if (!draft.text.trim()) {
      throw new Error("Add a title first so the tool can generate slug variants.");
    }

    const variants = generateSlugVariants(draft.text);
    return {
      output: variants.join("\n"),
      notes: [
        { label: "Variants", value: String(variants.length) },
        { label: "Primary slug", value: variants[0] || "None" },
      ],
    };
  }

  if (mode === "citation-generator") {
    if (!draft.text.trim()) {
      throw new Error("Add the source title first so the citation can be generated.");
    }

    const payload = generateCitation({
      title: draft.text,
      author: draft.author,
      publisher: draft.brand,
      url: draft.siteUrl,
      date: draft.lastModified,
      style: draft.style,
    });

    return {
      output: [
        `Selected (${draft.style.toUpperCase()}):`,
        payload.selected,
        "",
        "APA:",
        payload.apa,
        "",
        "MLA:",
        payload.mla,
        "",
        "Chicago:",
        payload.chicago,
      ].join("\n"),
      notes: [
        { label: "Style", value: draft.style.toUpperCase() },
        { label: "Author", value: draft.author || "Unknown author" },
        { label: "Publisher", value: draft.brand || "Toolslify" },
      ],
    };
  }

  if (mode === "faq-schema-generator") {
    if (!draft.text.trim()) {
      throw new Error("Add at least one question and answer pair first.");
    }

    const output = generateFaqSchema(draft.text);
    return {
      output,
      notes: [
        { label: "Type", value: "FAQPage JSON-LD" },
        { label: "Format", value: "schema.org" },
      ],
    };
  }

  if (mode === "robots-txt-generator") {
    const output = generateRobotsTxt(draft);
    return {
      output,
      notes: [
        { label: "Admin block", value: draft.blockAdmin ? "On" : "Off" },
        { label: "Search block", value: draft.blockSearch ? "On" : "Off" },
        { label: "Sitemap", value: draft.includeSitemap ? "Included" : "Skipped" },
      ],
    };
  }

  if (mode === "privacy-policy-generator") {
    if (!draft.brand.trim()) {
      throw new Error("Add the business or site name first so the privacy policy can be drafted.");
    }

    const policy = generatePrivacyPolicy({
      businessName: draft.brand,
      businessType: draft.businessType,
      siteUrl: draft.siteUrl,
      supportEmail: draft.supportEmail,
      policyRegion: draft.policyRegion,
      dataCollected: draft.dataCollected,
      thirdParties: draft.thirdParties,
      usesCookies: draft.usesCookies,
      collectsAnalytics: draft.collectsAnalytics,
      effectiveDate: draft.effectiveDate,
    });

    return {
      output: policy.content,
      notes: [
        { label: "Region", value: draft.policyRegion.toUpperCase() },
        { label: "Data points", value: String(policy.collectedItems.length) },
        { label: "Third parties", value: String(policy.providerItems.length) },
      ],
    };
  }

  if (mode === "free-invoice-generator") {
    if (!draft.brand.trim()) {
      throw new Error("Add your business name first so the invoice can be generated.");
    }

    const invoice = generateInvoicePackage({
      businessName: draft.brand,
      businessAddress: draft.businessAddress,
      supportEmail: draft.supportEmail,
      clientName: draft.clientName,
      clientEmail: draft.clientEmail,
      clientAddress: draft.clientAddress,
      invoiceNumber: draft.invoiceNumber,
      invoiceDate: draft.invoiceDate,
      dueDate: draft.dueDate,
      taxRate: draft.taxRate,
      currencyCode: draft.currencyCode,
      lineItems: draft.lineItems,
      paymentNote: draft.paymentNote,
    });

    return {
      output: invoice.summary,
      download: {
        blob: invoice.pdfBlob,
        filename: invoice.filename,
      },
      notes: [
        { label: "Items", value: String(invoice.itemCount) },
        { label: "Subtotal", value: invoice.formattedSubtotal },
        { label: "Tax", value: invoice.formattedTaxAmount },
        { label: "Total", value: invoice.formattedTotal },
      ],
    };
  }

  if (mode === "sitemap-xml-generator") {
    if (!draft.text.trim()) {
      throw new Error("Paste one URL per line first so the sitemap can be generated.");
    }

    const output = generateSitemapXml(draft.text, draft.lastModified);
    const urlCount = draft.text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean).length;
    return {
      output,
      notes: [
        { label: "URLs", value: String(urlCount) },
        { label: "Last modified", value: draft.lastModified || "Not set" },
      ],
    };
  }

  if (mode === "json-formatter") {
    if (!draft.text.trim()) {
      throw new Error("Paste JSON first so it can be validated and formatted.");
    }

    const output = formatJson(draft.text);
    return {
      output,
      notes: [
        { label: "Status", value: "Valid JSON" },
        { label: "Lines", value: String(output.split("\n").length) },
      ],
    };
  }

  if (mode === "url-encoder-decoder") {
    const payload = transformUrl(draft.text || "");
    return {
      output: `Encoded:\n${payload.encoded}\n\nDecoded:\n${payload.decoded}`,
      notes: [
        { label: "Encoded length", value: String(payload.encoded.length) },
        { label: "Decoded length", value: String(payload.decoded.length) },
      ],
    };
  }

  if (mode === "base64-encoder-decoder") {
    const payload = transformBase64(draft.text || "");
    return {
      output: `Encoded:\n${payload.encoded}\n\nDecoded:\n${payload.decoded}`,
      notes: [
        { label: "Encoded length", value: String(payload.encoded.length) },
        { label: "Decoded status", value: payload.decoded === "Invalid Base64 input" ? "Invalid input" : "Decoded" },
      ],
    };
  }

  if (!draft.text.trim()) {
    throw new Error("Paste HTML first so it can be minified.");
  }

  const output = minifyHtml(draft.text);
  return {
    output,
    notes: [
      { label: "Original length", value: `${draft.text.length} chars` },
      { label: "Minified length", value: `${output.length} chars` },
    ],
  };
}
