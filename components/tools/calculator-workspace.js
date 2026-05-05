"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getCalculatorConfig } from "@/lib/calculator-tools";
import { getToolBySlug } from "@/lib/site-data";
import { recordToolUsage } from "@/lib/tool-usage";
import { useToast } from "@/components/providers/toast-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  StatusBanner,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";

export function CalculatorWorkspace({ slug, onContentReadyChange }) {
  const config = getCalculatorConfig(slug);
  const tool = getToolBySlug(slug);
  const { showToast } = useToast();
  const { text } = usePreferences();
  const [draft, setDraft, hydrated] = usePersistentState(`toolslify:calculator:${slug}:draft`, config?.defaults || {});
  const [comparisonItems, setComparisonItems, comparisonHydrated] = usePersistentState(
    `toolslify:calculator:${slug}:compare`,
    [],
  );
  const [committedResult, setCommittedResult] = useState(null);
  const [copyState, setCopyState] = useState("idle");
  const [shareState, setShareState] = useState("idle");
  const [error, setError] = useState("");
  const hasAppliedSharedDraftRef = useRef(false);

  const validationError = useMemo(
    () => (config ? config.validate(draft) : "Tool configuration is missing."),
    [config, draft],
  );
  const interior = tool?.interior || {};
  const themeStyle = createWorkspaceThemeVars(interior.theme);
  const previewResult = useMemo(() => {
    if (!config || validationError) return null;
    return config.compute(normalizeValues(draft, config));
  }, [config, draft, validationError]);
  const result = committedResult;
  const liveResult = committedResult || previewResult;
  const leadCard = result?.summaryCards?.[0] || null;
  const hasStarted = Boolean(committedResult);
  const surfaceStyle = interior.surfaceStyle || "conversionStrip";
  const fieldGroups = useMemo(() => buildFieldGroups(config, tool, text), [config, text, tool]);
  const mobileLeadRow = liveResult ? getLeadRow(getSummaryRows(liveResult, 1, surfaceStyle)) : null;

  useSubmitShortcut({
    enabled: Boolean(previewResult),
    onSubmit: handleCalculate,
  });

  useEffect(() => {
    onContentReadyChange?.(hasStarted);
  }, [hasStarted, onContentReadyChange]);

  useEffect(() => {
    if (!config || !hydrated || hasAppliedSharedDraftRef.current || typeof window === "undefined") {
      return;
    }

    const sharedDraft = decodeDraftFromUrl(window.location.search, config);
    if (sharedDraft) {
      const sharedResult = config.validate(sharedDraft) ? null : config.compute(sharedDraft);
      setDraft(sharedDraft);
      setCommittedResult(sharedResult);
    }

    hasAppliedSharedDraftRef.current = true;
  }, [config, hydrated, setDraft]);

  useEffect(() => {
    if (!config || !hydrated || !hasAppliedSharedDraftRef.current || typeof window === "undefined") {
      return;
    }

    const nextUrl = buildShareUrl(window.location.href, draft, config);
    window.history.replaceState(null, "", nextUrl);
  }, [config, draft, hydrated]);

  if (!config) {
    return <StatusBanner tone="warning">This calculator is not configured yet.</StatusBanner>;
  }

  function handleCalculate() {
    if (validationError || !previewResult) {
      setError(validationError || "Please review the entered values.");
      return;
    }

    setError("");
    setCommittedResult(previewResult);
    recordToolUsage(slug);
    showToast({
      title: `${config.title} ready`,
      description: "The latest estimate is ready below.",
      tone: "success",
    });
  }

  async function handleCopy() {
    const report = committedResult?.report || previewResult?.report;
    if (!report) return;

    try {
      await navigator.clipboard.writeText(report);
      setCopyState("done");
      setTimeout(() => setCopyState("idle"), 1500);
      showToast({
        title: "Copied result",
        description: "The calculator summary is ready to paste.",
        tone: "success",
      });
    } catch {
      showToast({
        title: "Copy failed",
        description: "Clipboard access was blocked. Try again after allowing copy permissions.",
        tone: "warning",
      });
    }
  }

  async function handleShare() {
    if (typeof window === "undefined") return;

    try {
      const nextUrl = buildShareUrl(window.location.href, draft, config);
      await navigator.clipboard.writeText(nextUrl);
      setShareState("done");
      setTimeout(() => setShareState("idle"), 1500);
      showToast({
        title: "Share link copied",
        description: "This calculator state is ready to send.",
        tone: "success",
      });
    } catch {
      showToast({
        title: "Share failed",
        description: "Clipboard access was blocked. Try again after allowing copy permissions.",
        tone: "warning",
      });
    }
  }

  function handleDownload() {
    const activeResult = committedResult;
    if (!activeResult) return;

    const table = buildResultTable(activeResult);
    const csvLines = [
      table.headers,
      ...table.rows.map((row) => row.cells),
    ].map((row) => row.map(toCsvCell).join(","));
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${slug}-result.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast({
      title: "CSV downloaded",
      description: "The latest calculation table has been downloaded.",
      tone: "success",
    });
  }

  function handleReset() {
    setDraft(config.defaults);
    setCommittedResult(null);
    setError("");
  }

  function handleReload() {
    setCommittedResult(null);
    setError("");
  }

  function handleFieldChange(name, value) {
    setDraft((current) => ({ ...current, [name]: value }));
  }

  function handleSaveScenario() {
    if (!result) return;

    const nextScenario = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      label: `Scenario ${Math.min(comparisonItems.length + 1, 3)}`,
      result,
    };

    setComparisonItems((current) => [nextScenario, ...current].slice(0, 3));
    showToast({
      title: "Scenario saved",
      description: "This result was added to the comparison tray.",
      tone: "success",
    });
  }

  function handleRemoveScenario(id) {
    setComparisonItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="calculator-workspace calculator-stack-shell space-y-4" style={themeStyle} data-surface-style={surfaceStyle}>
      {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}
      {mobileLeadRow ? (
        <MobileEstimateCard
          row={mobileLeadRow}
          actionLabel={config.actionLabel}
          onCalculate={handleCalculate}
        />
      ) : null}

      <section id="tool-workspace" className="scroll-mt-28 space-y-4">
        <CalculatorSurface
          config={config}
          tool={tool}
          fieldGroups={fieldGroups}
          draft={draft}
          onFieldChange={handleFieldChange}
          actionLabel={config.actionLabel}
          onCalculate={handleCalculate}
          liveResult={liveResult}
          hasCommittedResult={Boolean(result)}
          surfaceStyle={surfaceStyle}
        />

        {result ? (
          <>
            {result.warning ? <StatusBanner tone="warning">{result.warning}</StatusBanner> : null}
            <CalculatorResultBoard
              tool={tool}
              leadCard={leadCard}
              result={result}
              outputTitle={tool?.outputTitle || config.summaryLabel}
              copyLabel={copyState === "done" ? text.copied : "Copy summary"}
              shareLabel={shareState === "done" ? text.copied : "Copy share link"}
              onCopy={handleCopy}
              onShare={handleShare}
              onDownload={handleDownload}
              onSaveScenario={handleSaveScenario}
              onReset={handleReset}
              onReload={handleReload}
            />
            {comparisonHydrated && comparisonItems.length ? (
              <ScenarioComparisonBoard
                items={comparisonItems}
                onRemove={handleRemoveScenario}
                onClear={() => setComparisonItems([])}
              />
            ) : null}
          </>
        ) : null}
      </section>
    </div>
  );
}

function createWorkspaceThemeVars(theme = {}) {
  return {
    "--tool-primary": "#35527c",
    "--tool-strong": "#24364f",
    "--tool-soft": "rgba(53, 82, 124, 0.1)",
    "--tool-surface": "rgba(245, 248, 252, 0.98)",
    "--tool-edge": "rgba(53, 82, 124, 0.18)",
    "--tool-glow": "rgba(36, 54, 79, 0.08)",
    "--tool-ink": "#24364f",
    "--tool-track": "rgba(53, 82, 124, 0.08)",
    "--tool-muted": "#f5f8fc",
  };
}

function buildFieldGroups(config, tool, text) {
  if (config.fieldGroups?.length) {
    const fieldMap = new Map([...(config.mainFields || []), ...(config.advancedFields || [])].map((field) => [field.name, field]));

    return config.fieldGroups
      .map((group, index) => ({
        id: group.id || `custom-group-${index}`,
        title: group.title || getFieldGroupTitle(group.fields.map((name) => fieldMap.get(name)).filter(Boolean), index, tool, config.title),
        mutedLabel: group.mutedLabel || "",
        fields: group.fields.map((name) => fieldMap.get(name)).filter(Boolean),
      }))
      .filter((group) => group.fields.length);
  }

  const mainGroups = chunkFields(config.mainFields, 3).map((fields, index) => ({
    id: `main-group-${index}`,
    title: getFieldGroupTitle(fields, index, tool, config.title),
    mutedLabel: "",
    fields,
  }));

  const advancedGroups = chunkFields(config.advancedFields, 3).map((fields, index) => ({
    id: `advanced-group-${index}`,
    title: index === 0 ? text.advancedSettings : `${text.advancedSettings} ${index + 1}`,
    mutedLabel: text.moreAssumptions,
    fields,
  }));

  return [...mainGroups, ...advancedGroups].filter((group) => group.fields.length);
}

function CalculatorSurface({
  config,
  tool,
  fieldGroups,
  draft,
  onFieldChange,
  actionLabel,
  onCalculate,
  liveResult,
  hasCommittedResult,
  surfaceStyle,
}) {
  const props = {
    config,
    tool,
    fieldGroups,
    draft,
    onFieldChange,
    actionLabel,
    onCalculate,
    liveResult,
    hasCommittedResult,
  };

  switch (surfaceStyle) {
    case "commuteStack":
      return <CommuteStackSurface {...props} />;
    case "salarySplit":
      return <SalarySplitSurface {...props} />;
    case "investment":
      return <InvestmentSurface {...props} />;
    case "loanSplit":
      return <LoanSplitSurface {...props} />;
    case "taxGrid":
      return <TaxGridSurface {...props} />;
    case "ledger":
      return <LedgerSurface {...props} />;
    case "wellnessSplit":
      return <WellnessSplitSurface {...props} />;
    default:
      return <ConversionStripSurface {...props} />;
  }
}

function ConversionStripSurface({ fieldGroups, draft, onFieldChange, actionLabel, onCalculate, liveResult }) {
  const rows = getSummaryRows(liveResult, 4, "conversionStrip");

  return (
    <SurfaceCard className="space-y-4 p-4 sm:p-5">
      <div className="calculator-stack-flow">
        {fieldGroups.map((group) => (
          <CalculatorSectionCard key={group.id} title={group.title} mutedLabel={group.mutedLabel}>
            <div className="calculator-stack-fields">
              {group.fields.map((field) => (
                <CalculatorField
                  key={field.name}
                  field={field}
                  value={draft[field.name]}
                  onChange={(value) => onFieldChange(field.name, value)}
                  appearance="standard"
                />
              ))}
            </div>
          </CalculatorSectionCard>
        ))}

        <CalculatorSectionCard title="Live estimate" mutedLabel="Preview updates as you adjust the inputs.">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {rows.map((row, index) => (
              <SmallResultCard key={`${row.label}-${index}`} row={row} />
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={onCalculate} className="calculator-submit-button w-full sm:w-auto sm:min-w-[220px]">
              {actionLabel}
            </Button>
          </div>
        </CalculatorSectionCard>
      </div>
    </SurfaceCard>
  );
}

function CommuteStackSurface({ fieldGroups, draft, onFieldChange, actionLabel, onCalculate, liveResult }) {
  const carOutputs = liveResult?.customSections?.car || [];
  const transitOutputs = liveResult?.customSections?.transit || [];
  const comparisonOutputs = liveResult?.customSections?.comparison || [];

  return (
    <SurfaceCard className="space-y-4 p-4 sm:p-5">
      <div className="calculator-stack-flow">
        {fieldGroups.map((group, index) => (
          <CalculatorSectionCard key={group.id} title={group.title} mutedLabel={group.mutedLabel}>
            <div className="calculator-stack-fields">
              {group.fields.map((field) => (
                <CalculatorField
                  key={field.name}
                  field={field}
                  value={draft[field.name]}
                  onChange={(value) => onFieldChange(field.name, value)}
                  appearance="standard"
                />
              ))}
              {index === 1
                ? carOutputs.map((item) => <ReadonlyResultField key={item.label} label={item.label} value={item.value} />)
                : null}
              {index === 2
                ? transitOutputs.map((item) => <ReadonlyResultField key={item.label} label={item.label} value={item.value} />)
                : null}
            </div>
          </CalculatorSectionCard>
        ))}

        {comparisonOutputs.length ? (
          <CalculatorSectionCard title="Commute comparison" mutedLabel="See which option is lighter on your monthly budget.">
            <div className="calculator-stack-fields">
              {comparisonOutputs.map((item) => (
                <ReadonlyResultField key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </CalculatorSectionCard>
        ) : null}

        <div className="flex justify-end">
          <Button type="button" onClick={onCalculate} className="calculator-submit-button w-full sm:w-auto sm:min-w-[220px]">
            {actionLabel}
          </Button>
        </div>
      </div>
    </SurfaceCard>
  );
}

function SalarySplitSurface({ fieldGroups, draft, onFieldChange, actionLabel, onCalculate, liveResult }) {
  const rows = getSummaryRows(liveResult, 4, "salarySplit");
  const leadRow = getLeadRow(rows);

  return (
    <SurfaceCard className="mx-auto max-w-5xl space-y-6 p-5 sm:p-7">
      <div className="space-y-5">
        {fieldGroups.map((group) => (
          <div key={group.id} className="space-y-4 border-b border-[#e7edf5] pb-5 last:border-b-0 last:pb-0">
            <SurfaceGroupHeader title={group.title} mutedLabel={group.mutedLabel} subtle />
            <div className="grid gap-4 md:grid-cols-2">
              {group.fields.map((field) => (
                <CalculatorField
                  key={field.name}
                  field={field}
                  value={draft[field.name]}
                  onChange={(value) => onFieldChange(field.name, value)}
                  appearance="flat"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 border-t border-[#e7edf5] pt-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="space-y-3">
          <SurfaceGroupHeader
            title="Quick estimate"
            mutedLabel="A clean preview of the main salary numbers while you edit the form."
            subtle
          />
          <SummaryRail rows={rows} accent="solid" />
        </div>
        <div className="rounded-[18px] border border-[#dbe3ef] bg-[#f8fbfe] px-5 py-4">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            Highlight
          </p>
          <p className="mt-3 text-[1.15rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            {leadRow.label}: <span className="text-[var(--tool-ink)]">{leadRow.value}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-center border-t border-[#e7edf5] pt-5">
        <Button type="button" onClick={onCalculate} className="calculator-submit-button w-full sm:w-auto sm:min-w-[220px]">
          {actionLabel}
        </Button>
      </div>
    </SurfaceCard>
  );
}

function InvestmentSurface({ fieldGroups, draft, onFieldChange, actionLabel, onCalculate, liveResult, tool }) {
  const rows = getSummaryRows(liveResult, 3, "investment");
  const chart = getChartData(liveResult, "investment");

  return (
    <SurfaceCard className="mx-auto max-w-5xl space-y-6 p-5 sm:p-7">
      <div className="space-y-5">
        {fieldGroups.map((group) => (
          <div key={group.id} className="space-y-4 border-b border-[#e7edf5] pb-5 last:border-b-0 last:pb-0">
            {group.title ? <SurfaceGroupHeader title={group.title} mutedLabel={group.mutedLabel} subtle /> : null}
            <div className="space-y-5">
              {group.fields.map((field) => (
                <CalculatorField
                  key={field.name}
                  field={field}
                  value={draft[field.name]}
                  onChange={(value) => onFieldChange(field.name, value)}
                  appearance="sliderPill"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 border-t border-[#e7edf5] pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
        <div className="space-y-4">
          <SurfaceGroupHeader
            title={`${tool?.shortName?.split(" ")[0] || "Plan"} preview`}
            mutedLabel="Projected totals refresh with the assumptions above."
            subtle
          />
          <SimpleMetricList rows={rows} />
        </div>

        <div className="space-y-4">
          <SurfaceGroupHeader
            title="Allocation mix"
            mutedLabel="A simple visual split of the current estimate."
            subtle
          />
          <div className="rounded-[18px] border border-[#dbe3ef] bg-[#f8fbfe] p-5">
            <LegendRow items={chart.items} />
            <div className="mt-5 flex justify-center">
              <DonutVisual items={chart.items} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center border-t border-[#e7edf5] pt-5">
        <Button type="button" onClick={onCalculate} className="w-full sm:w-auto sm:min-w-[200px]">
          {actionLabel}
        </Button>
      </div>
    </SurfaceCard>
  );
}

function LoanSplitSurface({ fieldGroups, draft, onFieldChange, actionLabel, onCalculate, liveResult }) {
  const rows = getSummaryRows(liveResult, 4, "loanSplit");
  const leadRow = getLeadRow(rows);
  const chart = getChartData(liveResult, "loanSplit");

  return (
    <SurfaceCard className="mx-auto max-w-5xl space-y-6 p-5 sm:p-7">
      <div className="space-y-5">
        {fieldGroups.map((group) => (
          <div key={group.id} className="space-y-4 border-b border-[#e7edf5] pb-5 last:border-b-0 last:pb-0">
            <SurfaceGroupHeader title={group.title} mutedLabel={group.mutedLabel} subtle />
            <div className="space-y-5">
              {group.fields.map((field) => (
                <CalculatorField
                  key={field.name}
                  field={field}
                  value={draft[field.name]}
                  onChange={(value) => onFieldChange(field.name, value)}
                  appearance="sliderBox"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 border-t border-[#e7edf5] pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
        <div className="space-y-4">
          <SurfaceGroupHeader
            title="Repayment preview"
            mutedLabel="Review the payment totals before you lock in the calculation."
            subtle
          />
          <SummaryRail rows={rows} />
        </div>

        <div className="space-y-4">
          <SurfaceGroupHeader
            title="Balance split"
            mutedLabel="A quick view of how the payment is distributed."
            subtle
          />
          <div className="rounded-[18px] border border-[#dbe3ef] bg-[#f8fbfe] p-5">
            <GaugeVisual items={chart.items} />
            <LegendRow items={chart.items} className="mt-4 justify-center lg:justify-start" />
            <div className="mt-4 rounded-[14px] border border-[#dbe3ef] bg-white px-4 py-3 text-sm font-semibold text-[var(--tool-ink)]">
              {leadRow.label}: {leadRow.value}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center border-t border-[#e7edf5] pt-5">
        <Button type="button" onClick={onCalculate} className="w-full sm:w-auto sm:min-w-[200px]">
          {actionLabel}
        </Button>
      </div>
    </SurfaceCard>
  );
}

function TaxGridSurface({ fieldGroups, draft, onFieldChange, actionLabel, onCalculate, liveResult }) {
  const rows = getSummaryRows(liveResult, 4, "taxGrid");

  return (
    <SurfaceCard className="mx-auto max-w-5xl space-y-6 p-5 sm:p-7">
      <div className="space-y-6">
        {fieldGroups.map((group) => (
          <div key={group.id} className="space-y-3 border-b border-[#e7edf5] pb-4 last:border-b-0 last:pb-0">
            <SurfaceGroupHeader title={group.title} mutedLabel={group.mutedLabel} subtle />
            <div className="grid gap-3 md:grid-cols-2">
              {group.fields.map((field) => (
                <CalculatorField
                  key={field.name}
                  field={field}
                  value={draft[field.name]}
                  onChange={(value) => onFieldChange(field.name, value)}
                  appearance="tax"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 border-t border-[#e7edf5] pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="flex justify-center lg:justify-start">
          <Button type="button" onClick={onCalculate} className="w-full sm:w-auto sm:min-w-[180px]">
            {actionLabel}
          </Button>
        </div>
        <div className="space-y-3">
          <SurfaceGroupHeader
            title="Quick estimate"
            mutedLabel="The main tax outputs stay visible while you review the inputs."
            subtle
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {rows.map((row, index) => (
              <SmallResultCard key={`${row.label}-${index}`} row={row} />
            ))}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}

function LedgerSurface({ fieldGroups, draft, onFieldChange, actionLabel, onCalculate, liveResult }) {
  const rows = getSummaryRows(liveResult, 4, "ledger");
  const leadRow = getLeadRow(rows);

  return (
    <SurfaceCard className="space-y-6 p-5 sm:p-7">
      <div className="space-y-5">
        {fieldGroups.map((group) => (
          <div key={group.id} className="space-y-4 border-b border-[#e7edf5] pb-5 last:border-b-0 last:pb-0">
            <SurfaceGroupHeader title={group.title} mutedLabel={group.mutedLabel} subtle />
            <div className="grid gap-4 lg:grid-cols-2">
              {group.fields.map((field) => (
                <CalculatorField
                  key={field.name}
                  field={field}
                  value={draft[field.name]}
                  onChange={(value) => onFieldChange(field.name, value)}
                  appearance="ledger"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 border-t border-[#e7edf5] pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <SurfaceGroupHeader title="Working totals" mutedLabel="Key numbers update as you refine the entries." subtle />
          <SimpleMetricList rows={rows} dense />
        </div>
        <div className="rounded-[18px] border border-[#dbe3ef] bg-[#f8fbfe] px-5 py-4">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Headline result</p>
          <p className="mt-2 text-[1.2rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
            {leadRow.label}: <span className="text-[var(--tool-ink)]">{leadRow.value}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-center border-t border-[#e7edf5] pt-5">
        <Button type="button" onClick={onCalculate} className="w-full sm:w-auto sm:min-w-[220px]">
          {actionLabel}
        </Button>
      </div>
    </SurfaceCard>
  );
}

function WellnessSplitSurface({ fieldGroups, draft, onFieldChange, actionLabel, onCalculate, liveResult }) {
  const rows = getSummaryRows(liveResult, 4, "wellnessSplit");

  return (
    <SurfaceCard className="mx-auto max-w-5xl space-y-6 p-5 sm:p-7">
      <div className="space-y-5">
        {fieldGroups.map((group) => (
          <div key={group.id} className="space-y-4 border-b border-[#e7edf5] pb-5 last:border-b-0 last:pb-0">
            <SurfaceGroupHeader title={group.title} mutedLabel={group.mutedLabel} subtle />
            <div className="grid gap-4 md:grid-cols-2">
              {group.fields.map((field) => (
                <CalculatorField
                  key={field.name}
                  field={field}
                  value={draft[field.name]}
                  onChange={(value) => onFieldChange(field.name, value)}
                  appearance="flat"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-[#e7edf5] pt-5">
        <SurfaceGroupHeader
          title="Health snapshot"
          mutedLabel="Keep the main body metrics visible while you review the inputs."
          subtle
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {rows.map((row, index) => (
            <SmallResultCard key={`${row.label}-${index}`} row={row} emphasis />
          ))}
        </div>
      </div>

      <div className="flex justify-center border-t border-[#e7edf5] pt-5">
        <Button type="button" onClick={onCalculate} className="w-full sm:w-auto sm:min-w-[220px]">
          {actionLabel}
        </Button>
      </div>
    </SurfaceCard>
  );
}

function SurfaceCard({ className, children }) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[24px] border border-[#dbe3ef] bg-white",
        className,
      )}
    >
      {children}
    </section>
  );
}

function SurfaceGroupHeader({ title, mutedLabel, minimal = false, subtle = false }) {
  if (!title) return null;

  return (
    <div className={cn("space-y-1", minimal ? "" : "pb-1")}>
      <p
        className={cn(
          subtle
            ? "text-[0.88rem] font-semibold tracking-[-0.02em] text-[var(--foreground)]"
            : "text-[0.98rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]",
        )}
      >
        {title}
      </p>
      {mutedLabel ? <p className="text-[0.74rem] leading-6 text-[var(--muted-foreground)]">{mutedLabel}</p> : null}
    </div>
  );
}

function SummaryRail({ title, rows, accent = "ghost", className }) {
  return (
    <div className={cn("space-y-4", className)}>
      {title ? (
        <div className="space-y-1">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            {title}
          </p>
        </div>
      ) : null}

      <div
        className={cn(
          "divide-y divide-[#e7edf5] rounded-[18px] border bg-white",
          accent === "solid" ? "border-[#35527c]" : "border-[#dbe3ef]",
        )}
      >
        {rows.map((row, index) => (
          <div key={`${row.label}-${index}`} className="flex items-center justify-between gap-4 px-5 py-4">
            <p className="text-[0.96rem] font-medium text-[var(--foreground)]">{row.label}</p>
            <p className="text-[1rem] font-semibold tracking-[-0.03em] text-[var(--tool-ink)]">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadActionStrip({ row, actionLabel, onCalculate }) {
  return (
    <div className="flex flex-col gap-4 border-t border-[#e7edf5] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Live estimate</p>
        <p className="mt-2 text-[1.15rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          {row.label}: <span className="text-[var(--tool-ink)]">{row.value}</span>
        </p>
      </div>
      <Button type="button" onClick={onCalculate} className="w-full sm:w-auto sm:min-w-[180px]">
        {actionLabel}
      </Button>
    </div>
  );
}

function MobileEstimateCard({ row, actionLabel, onCalculate }) {
  return (
    <div className="rounded-[18px] border border-[#dbe3ef] bg-white px-4 py-4 md:hidden">
      <div className="min-w-0">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          Live estimate
        </p>
        <p className="mt-1 break-words text-[1rem] font-semibold text-[var(--foreground)]">
          {row.label}: <span className="text-[var(--tool-ink)]">{row.value}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={onCalculate}
        className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center rounded-[13px] border border-[#35527c] bg-[#35527c] px-4 text-sm font-semibold text-white shadow-[0_10px_20px_-18px_rgba(36,56,92,0.16)]"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function SmallResultCard({ row, emphasis = false }) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-[#dbe3ef] bg-white px-4 py-3",
        emphasis ? "bg-[#f8fbfe]" : "",
      )}
    >
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{row.label}</p>
      <p className="mt-2 text-[1rem] font-semibold tracking-[-0.03em] text-[var(--tool-ink)]">{row.value}</p>
    </div>
  );
}

function SimpleMetricList({ rows, dense = false }) {
  return (
    <div className="min-w-0 space-y-3">
      {rows.map((row, index) => (
        <div
          key={`${row.label}-${index}`}
          className={cn(
            "flex min-w-0 items-center justify-between gap-4 border-b border-[#e7edf5] pb-3 last:border-b-0 last:pb-0",
            dense ? "text-[0.96rem]" : "text-[1rem]",
          )}
        >
          <p className="min-w-0 font-medium text-[var(--muted-foreground)]">{row.label}</p>
          <p className="min-w-0 text-right font-semibold text-[var(--foreground)]">{row.value}</p>
        </div>
      ))}
    </div>
  );
}

function LegendRow({ items, className }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          <span
            className="h-3.5 w-3.5 rounded-[4px]"
            style={{ background: index === 0 ? "var(--tool-primary)" : "color-mix(in srgb, var(--tool-primary) 24%, white)" }}
          />
          <span className="text-sm font-medium text-[var(--muted-foreground)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutVisual({ items }) {
  const stop = `${Math.max(8, Math.min(92, items[0].share * 100))}%`;

  return (
    <div className="relative h-[min(220px,54vw)] w-[min(220px,54vw)]">
      <div
        className="h-full w-full rounded-full"
        style={{
          background: `conic-gradient(var(--tool-primary) 0 ${stop}, color-mix(in srgb, var(--tool-primary) 18%, white) ${stop} 100%)`,
        }}
      />
      <div className="absolute inset-[46px] rounded-full bg-white" />
    </div>
  );
}

function GaugeVisual({ items }) {
  const stop = `${Math.max(8, Math.min(92, items[0].share * 100))}%`;

  return (
    <div className="relative mx-auto h-[min(148px,34vw)] w-[min(260px,68vw)] overflow-hidden">
      <div
        className="absolute left-1/2 top-0 h-[250px] w-[250px] -translate-x-1/2 rounded-full"
        style={{
          background: `conic-gradient(var(--tool-primary) 0 ${stop}, color-mix(in srgb, var(--tool-primary) 24%, white) ${stop} 100%)`,
        }}
      />
      <div className="absolute left-1/2 top-[60px] h-[126px] w-[126px] -translate-x-1/2 rounded-full bg-white" />
      <div className="absolute inset-x-0 bottom-0 h-[72px] bg-white" />
    </div>
  );
}

function CalculatorSectionCard({ title, children, mutedLabel }) {
  return (
    <section className="calculator-stack-card">
      <div className="calculator-stack-card-head">
        <div>
          <h2 className="calculator-stack-card-title">{title}</h2>
          {mutedLabel ? <p className="calculator-stack-card-muted">{mutedLabel}</p> : null}
        </div>
      </div>
      <div className="calculator-stack-card-body">{children}</div>
    </section>
  );
}

function CalculatorResultBoard({
  tool,
  leadCard,
  result,
  outputTitle,
  copyLabel,
  shareLabel,
  onCopy,
  onShare,
  onDownload,
  onSaveScenario,
  onReset,
  onReload,
}) {
  const stats = result.summaryCards?.length ? result.summaryCards : leadCard ? [leadCard] : [];
  const table = buildResultTable(result);
  const chartRows = buildChartRows(result, tool?.categorySlug);

  return (
    <div className="space-y-4">
      <CalculatorSectionCard title={outputTitle}>
        <div className="calculator-stack-result-hero">
          <p className="calculator-micro-label">Result</p>
          <h3 className="calculator-result-heading">{result.title}</h3>
        </div>
      </CalculatorSectionCard>

      {stats.length ? (
        <section className="calculator-result-grid">
          {stats.map((item, index) => (
            <div key={item.label} className="calculator-result-stat" data-tone={index % 6}>
              <p className="calculator-result-label">{item.label}</p>
              <p className="calculator-result-number">{item.value}</p>
            </div>
          ))}
        </section>
      ) : null}

      {chartRows.length ? (
        <CalculatorSectionCard title="Visual breakdown" mutedLabel="A quick view of the largest result drivers">
          <div className="space-y-3">
            {chartRows.map((row) => (
              <div key={row.label} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[var(--foreground)]">{row.label}</p>
                  <p className="text-sm font-semibold text-[var(--tool-ink)]">{row.displayValue}</p>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[color:color-mix(in_srgb,var(--tool-soft)_34%,white)]">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--tool-primary),color-mix(in_srgb,var(--tool-primary)_54%,white))]"
                    style={{ width: `${row.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CalculatorSectionCard>
      ) : null}

      {table.rows.length ? (
        <CalculatorSectionCard title={table.title}>
          <div className="calculator-table-wrap">
            <table className="calculator-result-table">
              <thead>
                <tr>
                  {table.headers.map((header, index) => (
                    <th key={`${header}-${index}`}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, index) => (
                  <tr key={`${row.cells.join("-")}-${index}`} data-tone={row.tone || "default"}>
                    {row.cells.map((cell, cellIndex) => (
                      <td key={`${row.cells[0]}-${cellIndex}`} data-strong={cellIndex === row.cells.length - 1 ? "true" : "false"}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.footnote ? <p className="calculator-result-footnote">{table.footnote}</p> : null}
        </CalculatorSectionCard>
      ) : null}

      {result.meta?.length ? (
        <CalculatorSectionCard title="Supporting values">
          <div className="calculator-support-grid">
            {result.meta.map((item) => (
              <div key={item.label} className="calculator-summary-card">
                <p className="calculator-micro-label">{item.label}</p>
                <p className="mt-3 text-[1.1rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">{item.value}</p>
              </div>
            ))}
          </div>
        </CalculatorSectionCard>
      ) : null}

      <section className="calculator-result-actions">
        <button type="button" onClick={onCopy} className="calculator-action-pill">
          {copyLabel}
        </button>
        <button type="button" onClick={onShare} className="calculator-action-pill">
          {shareLabel}
        </button>
        <button type="button" onClick={onDownload} className="calculator-action-pill">
          Download CSV
        </button>
        <button type="button" onClick={onSaveScenario} className="calculator-action-pill">
          Save scenario
        </button>
        <button type="button" onClick={onReload} className="calculator-action-pill">
          Recalculate
        </button>
        <button type="button" onClick={onReset} className="calculator-action-pill">
          Start over
        </button>
      </section>
    </div>
  );
}

function ScenarioComparisonBoard({ items, onRemove, onClear }) {
  const rows = buildScenarioComparisonRows(items);

  if (!rows.length) return null;

  return (
    <CalculatorSectionCard title="Scenario comparison" mutedLabel="Save up to three result snapshots side by side">
      <div className="calculator-table-wrap">
        <table className="calculator-result-table">
          <thead>
            <tr>
              <th>Metric</th>
              {items.map((item) => (
                <th key={item.id}>{item.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td data-strong="false">{row.label}</td>
                {row.values.map((value, index) => (
                  <td key={`${row.label}-${items[index]?.id || index}`} data-strong="true">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <button key={item.id} type="button" onClick={() => onRemove(item.id)} className="calculator-action-pill">
            Remove {item.label}
          </button>
        ))}
        <button type="button" onClick={onClear} className="calculator-action-pill">
          Clear comparison
        </button>
      </div>
    </CalculatorSectionCard>
  );
}

function CalculatorField({ field, value, onChange, appearance = "standard" }) {
  const dateInputRef = useRef(null);

  if ((appearance === "sliderPill" || appearance === "sliderBox") && isSliderField(field)) {
    return <CalculatorSliderField field={field} value={value} onChange={onChange} variant={appearance === "sliderBox" ? "boxed" : "pill"} />;
  }

  if (field.type === "boolean" && appearance !== "standard") {
    return (
      <CalculatorFieldShell label={field.label} help={field.help} appearance={appearance}>
        <BooleanChoiceField value={Boolean(value)} onChange={onChange} />
      </CalculatorFieldShell>
    );
  }

  if (field.type === "select") {
    return (
      <CalculatorFieldShell label={field.label} help={field.help} appearance={appearance}>
        <div className="calculator-field-shell-control">
          <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={buildInputClassName({ appearance, type: field.type, hasPrefix: false })}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value} className="text-[1rem] font-semibold">
                {option.label}
              </option>
            ))}
          </select>
          <span className="calculator-field-adornment" aria-hidden="true">
            <SelectChevronIcon />
          </span>
        </div>
      </CalculatorFieldShell>
    );
  }

  if (field.type === "boolean") {
    return (
      <CalculatorFieldShell label={field.label} help={field.help} appearance={appearance}>
        <div className="calculator-toggle-card">
          <span className="text-sm font-semibold text-[var(--foreground)]">{field.label}</span>
          <Toggle checked={Boolean(value)} onCheckedChange={onChange} label={field.label} />
        </div>
      </CalculatorFieldShell>
    );
  }

  if (field.type === "date") {
    return (
      <CalculatorFieldShell label={field.label} help={field.help} appearance={appearance}>
        <div className="calculator-field-shell-control">
          <input
            ref={dateInputRef}
            type="date"
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            className={buildInputClassName({ appearance, type: field.type, hasPrefix: false })}
          />
          <button
            type="button"
            className="calculator-field-trigger"
            aria-label={`Open ${field.label}`}
            onClick={() => {
              const input = dateInputRef.current;
              if (!input) return;
              if (typeof input.showPicker === "function") {
                input.showPicker();
              } else {
                input.focus();
              }
            }}
          >
            <CalendarFieldIcon />
          </button>
        </div>
      </CalculatorFieldShell>
    );
  }

  return (
    <CalculatorFieldShell label={field.label} help={field.help} appearance={appearance}>
      <div className="relative">
        {field.type === "currency" ? (
          <span
            className={cn(
              "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-[var(--muted-foreground)]",
              appearance === "tax" ? "text-[0.86rem]" : "text-sm",
            )}
          >
            {field.prefix || "$"}
          </span>
        ) : null}
        <input
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
          inputMode="decimal"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className={buildInputClassName({ appearance, type: field.type, hasPrefix: field.type === "currency" })}
        />
        {field.suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            {field.suffix}
          </span>
        ) : null}
      </div>
    </CalculatorFieldShell>
  );
}

function CalculatorSliderField({ field, value, onChange, variant }) {
  const numericValue = toFiniteNumber(value);
  const { min, max, step } = getRangeSpec(field, numericValue);
  const percent = max === min ? 0 : ((numericValue - min) / (max - min)) * 100;

  const inputValue = (
    <div className="relative">
      {field.type === "currency" ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[0.82rem] font-semibold text-[var(--tool-ink)]">
          {field.prefix || "$"}
        </span>
      ) : null}
      <input
        type="number"
        min={field.min}
        max={max}
        step={field.step}
        inputMode="decimal"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-[46px] w-full rounded-[12px] border border-[#dbe3ef] bg-[#f8fbfe] text-right font-semibold tracking-[-0.02em] text-[var(--tool-ink)] shadow-none outline-none transition duration-200 focus:border-[color:color-mix(in_srgb,var(--tool-primary)_42%,rgba(18,24,31,0.12))]",
          field.type === "currency" ? "pl-8 pr-3" : "px-3",
          field.suffix ? "pr-10" : "",
        )}
      />
      {field.suffix ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--tool-ink)]">
          {field.suffix}
        </span>
      ) : null}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className={cn("min-w-0 gap-3", variant === "boxed" ? "grid md:grid-cols-[minmax(0,1fr)_156px] md:items-end" : "flex flex-col sm:flex-row sm:items-center sm:justify-between")}>
        <div className="min-w-0 space-y-1">
          <p className="text-[0.96rem] font-medium tracking-[-0.02em] text-[var(--foreground)]">{field.label}</p>
          {field.help ? <p className="text-[0.74rem] leading-6 text-[var(--muted-foreground)]">{field.help}</p> : null}
        </div>
        {variant === "pill" ? <div className="w-full sm:max-w-[132px]">{inputValue}</div> : null}
      </div>

      <div className={cn(variant === "boxed" ? "grid gap-4 md:grid-cols-[minmax(0,1fr)_156px] md:items-center" : "space-y-3")}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numericValue}
          onChange={(event) => onChange(event.target.value)}
          className="calculator-range"
          style={{ "--range-percent": `${percent}%` }}
        />
        {variant === "boxed" ? <div>{inputValue}</div> : null}
      </div>
    </div>
  );
}

function BooleanChoiceField({ value, onChange }) {
  return (
    <div className="inline-flex overflow-hidden rounded-[12px] border border-[#dbe3ef] bg-white">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={cn(
          "min-w-[56px] px-4 py-2 text-sm font-semibold transition duration-200",
          value ? "bg-[var(--tool-primary)] text-white" : "bg-white text-[var(--tool-ink)]",
        )}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={cn(
          "min-w-[56px] border-l border-[#dbe3ef] px-4 py-2 text-sm font-semibold transition duration-200",
          !value ? "bg-[var(--tool-primary)] text-white" : "bg-white text-[var(--tool-ink)]",
        )}
      >
        No
      </button>
    </div>
  );
}

function CalculatorFieldShell({ label, help, children, appearance = "standard" }) {
  if (appearance === "standard") {
    return (
      <div className="calculator-stack-field">
        <div className="calculator-stack-label-row">
          <p className="calculator-stack-label">{label}</p>
          <div className="calculator-stack-label-tools">
            {help ? <span className="calculator-stack-info">i</span> : null}
            <span className="calculator-stack-dots calculator-stack-dots-compact" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>
        </div>
        {help ? <p className="calculator-stack-help">{help}</p> : null}
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p
            className={cn(
              appearance === "tax"
                ? "text-[0.78rem] font-semibold tracking-[-0.01em] text-[var(--foreground)]"
                : "text-[0.92rem] font-medium tracking-[-0.02em] text-[var(--foreground)]",
            )}
          >
            {label}
          </p>
          {help ? <p className="text-[0.72rem] leading-6 text-[var(--muted-foreground)]">{help}</p> : null}
        </div>
      </div>
      {children}
    </div>
  );
}

function ReadonlyResultField({ label, value }) {
  return (
    <div className="calculator-stack-field">
      <div className="calculator-stack-label-row">
        <p className="calculator-stack-label">{label}</p>
        <div className="calculator-stack-label-tools">
          <span className="calculator-stack-dots calculator-stack-dots-compact" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </div>
      </div>
      <div className="h-[50px] rounded-[14px] border border-[color:color-mix(in_srgb,var(--tool-edge)_34%,rgba(188,196,212,0.9))] bg-[color:color-mix(in_srgb,var(--tool-surface)_28%,white)] px-4 text-[0.96rem] font-semibold tracking-[-0.02em] text-[var(--tool-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] flex items-center">
        {value}
      </div>
    </div>
  );
}

function buildInputClassName({ appearance, type, hasPrefix }) {
  const base = "calculator-field-control w-full appearance-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]";

  if (appearance === "compact") {
    return cn(
      base,
      "h-[52px] rounded-[14px] border-[#dbe3ef] bg-white px-4 text-[0.96rem] font-semibold tracking-[-0.02em] shadow-none",
      hasPrefix ? "pl-10 pr-4" : "px-4",
      type === "select" || type === "date" ? "pr-[3.2rem]" : "",
    );
  }

  if (appearance === "flat") {
    return cn(
      base,
      "h-[52px] rounded-[12px] border-[#dbe3ef] bg-white px-4 text-[0.98rem] font-medium tracking-[-0.02em] shadow-none",
      hasPrefix ? "pl-10 pr-4" : "px-4",
      type === "select" || type === "date" ? "pr-[3.2rem]" : "",
    );
  }

  if (appearance === "ledger") {
    return cn(
      base,
      "h-[48px] rounded-[12px] border-[#dbe3ef] bg-[#f6f9fd] px-4 text-right text-[0.96rem] font-semibold tracking-[-0.02em] shadow-none",
      hasPrefix ? "pl-10 pr-4" : "px-4",
      type === "select" || type === "date" ? "pr-[3.2rem] text-left" : "",
    );
  }

  if (appearance === "tax") {
    return cn(
      base,
      "h-[44px] rounded-[10px] border-[#dbe3ef] bg-[#f6f9fd] px-3 text-[0.9rem] font-medium shadow-none",
      hasPrefix ? "pl-9 pr-3" : "px-3",
      type === "select" || type === "date" ? "pr-[3rem]" : "",
    );
  }

  return cn(
    base,
    "h-[48px] rounded-[16px] text-[0.98rem] font-semibold tracking-[-0.02em]",
    hasPrefix ? "pl-10 pr-4" : "px-4",
    type === "select" || type === "date" ? "pr-[3.2rem]" : "",
  );
}

function isSliderField(field) {
  return field.type !== "select" && field.type !== "date" && field.type !== "boolean";
}

function getRangeSpec(field, value) {
  const min = Number.isFinite(field.min) ? field.min : 0;
  const step = Number.isFinite(field.step) && field.step > 0 ? field.step : 1;
  const safeValue = Number.isFinite(value) ? value : min;
  let max = Number.isFinite(field.max) ? field.max : null;

  if (!Number.isFinite(max)) {
    if (field.type === "percent") {
      max = 100;
    } else if (field.type === "currency") {
      max = Math.max(min + step * 150, Math.ceil(Math.max(safeValue, step * 10) * 2.4 / step) * step);
    } else {
      max = Math.max(min + step * 40, Math.ceil(Math.max(safeValue, step * 8) * 2 / step) * step);
    }
  }

  if (max <= min) {
    max = min + step * 10;
  }

  return { min, max, step };
}

function getSummaryRows(result, limit = 4, surfaceStyle = "conversionStrip") {
  const rows = [];
  const used = new Set();

  for (const item of result?.summaryCards || []) {
    if (!item?.label || used.has(item.label)) continue;
    rows.push({ label: item.label, value: item.value });
    used.add(item.label);
    if (rows.length >= limit) return rows;
  }

  for (const item of result?.breakdown || []) {
    if (!item?.label || used.has(item.label)) continue;
    rows.push({
      label: item.label,
      value: item.displayValue || (typeof item.value === "number" ? formatValue(item.value) : String(item.value)),
    });
    used.add(item.label);
    if (rows.length >= limit) return rows;
  }

  return rows.length ? rows : getSurfacePlaceholderRows(surfaceStyle).slice(0, limit);
}

function getSurfacePlaceholderRows(surfaceStyle) {
  switch (surfaceStyle) {
    case "salarySplit":
      return [
        { label: "Net monthly pay", value: "Waiting" },
        { label: "Net annual pay", value: "Waiting" },
        { label: "Tax amount", value: "Waiting" },
        { label: "Retention", value: "Waiting" },
      ];
    case "investment":
      return [
        { label: "Invested amount", value: "Waiting" },
        { label: "Est. returns", value: "Waiting" },
        { label: "Total value", value: "Waiting" },
      ];
    case "loanSplit":
      return [
        { label: "Monthly payment", value: "Waiting" },
        { label: "Total payable", value: "Waiting" },
        { label: "Interest component", value: "Waiting" },
        { label: "Loan timeline", value: "Waiting" },
      ];
    case "taxGrid":
      return [
        { label: "Estimated tax", value: "Waiting" },
        { label: "Taxable income", value: "Waiting" },
        { label: "Effective rate", value: "Waiting" },
        { label: "Net after tax", value: "Waiting" },
      ];
    case "ledger":
      return [
        { label: "Primary result", value: "Waiting" },
        { label: "Supporting total", value: "Waiting" },
        { label: "Secondary view", value: "Waiting" },
        { label: "Working figure", value: "Waiting" },
      ];
    case "wellnessSplit":
      return [
        { label: "Primary score", value: "Waiting" },
        { label: "Interpretation", value: "Waiting" },
        { label: "Supporting value", value: "Waiting" },
        { label: "Range view", value: "Waiting" },
      ];
    default:
      return [
        { label: "Primary result", value: "Waiting" },
        { label: "Monthly view", value: "Waiting" },
        { label: "Annual view", value: "Waiting" },
        { label: "Supporting rate", value: "Waiting" },
      ];
  }
}

function getLeadRow(rows) {
  return rows[0] || { label: "Live estimate", value: "Waiting" };
}

function getChartData(result, surfaceStyle) {
  const items = (result?.breakdown || [])
    .filter((item) => typeof item.value === "number" && Number.isFinite(item.value) && Math.abs(item.value) > 0)
    .slice(0, 2)
    .map((item) => ({
      label: item.label,
      amount: Math.abs(item.value),
    }));

  if (items.length < 2) {
    const fallback =
      surfaceStyle === "loanSplit"
        ? [
            { label: "Principal", amount: 68 },
            { label: "Interest", amount: 32 },
          ]
        : [
            { label: "Primary", amount: 54 },
            { label: "Secondary", amount: 46 },
          ];

    return {
      items: fallback.map((item) => ({
        ...item,
        share: item.amount / fallback.reduce((sum, entry) => sum + entry.amount, 0),
      })),
    };
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0) || 1;
  return {
    items: items.map((item) => ({
      ...item,
      share: item.amount / total,
    })),
  };
}

function buildChartRows(result, categorySlug) {
  const supportedCategories = new Set([
    "finance",
    "salary-data",
    "mortgage-data",
    "tax-budget",
    "health",
    "home-costs",
    "home",
  ]);

  if (!supportedCategories.has(categorySlug)) {
    return [];
  }

  const numericBreakdown = (result?.breakdown || [])
    .filter((item) => typeof item.value === "number" && Number.isFinite(item.value))
    .slice(0, 5);

  if (!numericBreakdown.length) {
    return [];
  }

  const maxValue = Math.max(...numericBreakdown.map((item) => Math.abs(item.value)), 1);

  return numericBreakdown.map((item) => ({
    label: item.label,
    displayValue: item.displayValue || formatValue(item.value),
    width: Math.max(12, Math.round((Math.abs(item.value) / maxValue) * 100)),
  }));
}

function buildScenarioComparisonRows(items) {
  const labels = [];

  items.forEach((item) => {
    (item.result?.summaryCards || []).forEach((card) => {
      if (card?.label && !labels.includes(card.label)) {
        labels.push(card.label);
      }
    });
  });

  return labels.map((label) => ({
    label,
    values: items.map((item) => {
      const match = (item.result?.summaryCards || []).find((card) => card.label === label);
      return match?.value || "Waiting";
    }),
  }));
}

function SelectChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="m2.6 4.4 3.4 3.4 3.4-3.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarFieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1.9" y="2.6" width="9.2" height="8.3" rx="1.9" stroke="currentColor" strokeWidth="1.35" />
      <path d="M4.1 1.4v2.1M8.9 1.4v2.1M1.9 4.9h9.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4.7 7.1h1.5M7.3 7.1h1.1M4.7 9.1h1.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}

function getFieldGroupTitle(fields, index, tool, fallbackTitle) {
  const labelText = fields.map((field) => String(field.label || "").toLowerCase()).join(" ");

  if (/location|city|region|country|cost of living/.test(labelText)) return "Location and compensation assumptions";
  if (/salary|income|pay|gross|net|wage|earnings/.test(labelText)) return index === 0 ? "Pay inputs" : "Income assumptions";
  if (/rate|margin|raise|bonus|commission|price|return/.test(labelText)) return "Rate assumptions";
  if (/hours|days|weeks|months|years|period|frequency|schedule|tenure/.test(labelText)) return "Work period";
  if (/tax|deduction|gst|vat|reserve|benefit/.test(labelText)) return "Tax and deductions";
  if (/budget|expense|cost|rent|loan|principal/.test(labelText)) return "Cost inputs";
  if (/weight|height|body|calorie|protein|macro|heart|pace/.test(labelText)) return "Body and activity inputs";
  if (index === 0) return tool?.shortName || fallbackTitle || "Inputs";
  return `Additional inputs ${index + 1}`;
}

function chunkFields(fields, size) {
  const groups = [];
  for (let index = 0; index < fields.length; index += size) {
    groups.push(fields.slice(index, index + size));
  }
  return groups;
}

function formatValue(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.abs(value) < 100 ? 2 : 0,
  }).format(value);
}

function buildResultTable(result) {
  if (result.table?.rows?.length) return result.table;

  return {
    title: "Calculation breakdown",
    headers: ["Metric", "Value"],
    rows: (result.breakdown || []).map((item, index) => ({
      cells: [
        item.label,
        item.displayValue || (typeof item.value === "number" ? formatValue(item.value) : String(item.value)),
      ],
      tone: index === (result.breakdown?.length || 1) - 1 ? "highlight" : "default",
    })),
  };
}

function buildShareUrl(currentUrl, draft, config) {
  const url = new URL(currentUrl);
  const encodedState = encodeDraftState(normalizeValues(draft, config));

  if (encodedState) {
    url.searchParams.set("state", encodedState);
  } else {
    url.searchParams.delete("state");
  }

  return url.toString();
}

function decodeDraftFromUrl(search, config) {
  try {
    const searchParams = new URLSearchParams(search);
    const encodedState = searchParams.get("state");
    if (!encodedState) return null;
    const parsed = JSON.parse(decodeBase64Url(encodedState));
    return normalizeValues(parsed, config);
  } catch {
    return null;
  }
}

function toCsvCell(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function normalizeValues(values, config) {
  const fields = [...config.mainFields, ...config.advancedFields];
  return fields.reduce((accumulator, field) => {
    if (field.type === "boolean") {
      accumulator[field.name] = Boolean(values[field.name]);
      return accumulator;
    }

    if (field.type === "select") {
      accumulator[field.name] = values[field.name];
      return accumulator;
    }

    if (field.type === "date") {
      accumulator[field.name] = values[field.name] || "";
      return accumulator;
    }

    const numericValue = Number(values[field.name]);
    accumulator[field.name] = Number.isFinite(numericValue) ? numericValue : 0;
    return accumulator;
  }, {});
}

function encodeDraftState(values) {
  const json = JSON.stringify(values);
  if (!json || json === "{}") return "";
  return encodeBase64Url(json);
}

function toFiniteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function encodeBase64Url(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = `${normalized}${"=".repeat((4 - (normalized.length % 4 || 4)) % 4)}`;
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
