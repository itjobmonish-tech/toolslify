"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { getDiffSegments, analyzeText } from "@/lib/humanizer";
import { downloadTextFile } from "@/lib/utils";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import {
  ActionButton,
  ActionRow,
  HistoryPanel,
  LoadingSurface,
  MetaNotes,
  MetricStrip,
  OutputSurface,
  PanelCard,
  RangeField,
  SegmentedControl,
  StarterCard,
  StatusBanner,
  TextEditor,
  useHistoryStorage,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";
import { requestJsonTool, sliderToStrength } from "@/components/tools/tool-client-utils";

const toneOptions = [
  { label: "Friendly", value: "friendly" },
  { label: "Formal", value: "formal" },
  { label: "Casual", value: "casual" },
];

const HUMANIZER_EXAMPLE =
  "The platform leverages advanced artificial intelligence capabilities to optimize productivity outcomes for students, creators, and professional teams. In addition, users can utilize the interface to generate improved text outputs with enhanced consistency and maximum efficiency across multiple workflow scenarios.";

export function HumanizerWorkspace() {
  const { text } = usePreferences();
  const [draft, setDraft] = usePersistentState("toolslify:humanizer:draft", {
    input: "",
    output: "",
    tone: "friendly",
    strengthValue: 62,
    compareMode: true,
  });
  const { history, pushHistory } = useHistoryStorage("toolslify:humanizer:history");
  const [responseMeta, setResponseMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const [error, setError] = useState("");

  const deferredInput = useDeferredValue(draft.input);
  const deferredOutput = useDeferredValue(draft.output);
  const diffSegments = useMemo(() => {
    if (!draft.compareMode || !draft.input.trim() || !draft.output.trim()) return [];
    return getDiffSegments(draft.input, draft.output);
  }, [draft.compareMode, draft.input, draft.output]);

  const inputMetrics = useMemo(() => analyzeText(deferredInput), [deferredInput]);
  const outputMetrics = useMemo(() => analyzeText(deferredOutput), [deferredOutput]);
  const strength = sliderToStrength(draft.strengthValue);

  useSubmitShortcut({
    enabled: Boolean(draft.input.trim()) && !isLoading,
    onSubmit: handleGenerate,
  });

  async function handleGenerate() {
    if (!draft.input.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await requestJsonTool("ai-humanizer", {
        input: draft.input,
        tone: draft.tone,
        strength,
      });

      setDraft((current) => ({ ...current, output: result.output }));
      setResponseMeta(result.meta);
      pushHistory({
        label: `${draft.tone} / ${strength}`,
        preview: result.output,
        payload: {
          input: draft.input,
          output: result.output,
          tone: draft.tone,
          strengthValue: draft.strengthValue,
          compareMode: draft.compareMode,
        },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!draft.output) return;

    try {
      await navigator.clipboard.writeText(draft.output);
      setCopyState("done");
      setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("idle");
    }
  }

  function handleDownload() {
    if (!draft.output) return;
    downloadTextFile({
      content: draft.output,
      filename: "toolslify-humanized-text.txt",
    });
  }

  function restoreHistory(item) {
    if (!item.payload) return;
    setDraft(item.payload);
  }

  function loadExample() {
    setError("");
    setResponseMeta(null);
    setDraft((current) => ({
      ...current,
      input: HUMANIZER_EXAMPLE,
      output: "",
      tone: "friendly",
      strengthValue: 62,
      compareMode: true,
    }));
  }

  const metricItems = [
    { label: "Input words", value: String(inputMetrics.words) },
    { label: "Output words", value: String(outputMetrics.words || inputMetrics.words) },
    { label: "Detection", value: responseMeta?.detection?.label || "Waiting" },
    { label: "Score", value: responseMeta?.detection ? `${responseMeta.detection.score}%` : "--" },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <MetricStrip items={metricItems} />

        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_220px]">
          <SegmentedControl
            label="Tone"
            help="Choose how natural or polished the rewrite should feel."
            options={toneOptions}
            value={draft.tone}
            onChange={(tone) => setDraft((current) => ({ ...current, tone }))}
          />
          <RangeField
            label="Rewrite strength"
            help="Lower values protect more of the original wording."
            value={draft.strengthValue}
            onChange={(strengthValue) => setDraft((current) => ({ ...current, strengthValue }))}
          />
          <PanelCard title="Compare mode" description="Review changed words before you copy the result." className="h-full">
            <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3">
              <span className="text-sm text-[var(--foreground)]">
                {draft.compareMode ? "Highlight differences" : "Simple output view"}
              </span>
              <Toggle
                checked={draft.compareMode}
                onCheckedChange={(compareMode) => setDraft((current) => ({ ...current, compareMode }))}
                label="Toggle compare mode"
              />
            </div>
          </PanelCard>
        </div>

        {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}

        <div className="grid gap-6 xl:grid-cols-2">
          <PanelCard title="Step 1: Paste text" description="Add the AI-generated draft you want to humanize.">
            <div className="space-y-4">
              <StarterCard
                title="Need a quick test?"
                description="Load a realistic AI-style paragraph so you can see the rewrite, compare mode, and score panel instantly."
                onAction={loadExample}
              />
              <TextEditor
                value={draft.input}
                onChange={(input) => setDraft((current) => ({ ...current, input }))}
                placeholder="Paste AI-generated text here. Then click Humanize text to generate a cleaner version."
              />
            </div>
          </PanelCard>

          <PanelCard title="Step 3: Review result" description="Check the rewritten version, then copy or download it.">
            {isLoading ? (
              <LoadingSurface title="Humanizing your draft..." />
            ) : (
              <OutputSurface
                output={draft.output}
                placeholder="Your humanized version will appear here with cleaner phrasing, more varied rhythm, and a softer AI score."
              >
                {draft.output && draft.compareMode ? (
                  <div className="whitespace-pre-wrap">
                    {diffSegments.map((segment, index) => (
                      <span
                        key={`${segment.value}-${index}`}
                        className={segment.changed ? "rounded-md bg-[var(--accent-surface)] px-1 text-[var(--foreground)]" : undefined}
                      >
                        {segment.value}
                      </span>
                    ))}
                  </div>
                ) : null}
              </OutputSurface>
            )}
          </PanelCard>
        </div>

        <ActionRow
          meta={[
            <Badge key="readability">{outputMetrics.readabilityLabel || inputMetrics.readabilityLabel}</Badge>,
            <Badge key="complexity">{outputMetrics.complexity || inputMetrics.complexity}</Badge>,
            <Badge key="privacy" tone="accent">
              {text.noDataStored}
            </Badge>,
          ]}
        >
          <ActionButton onClick={handleGenerate} disabled={isLoading || !draft.input.trim()}>
            {isLoading ? "Rewriting..." : "Step 2: Humanize text"}
          </ActionButton>
          <ActionButton onClick={handleCopy} disabled={!draft.output}>
            {copyState === "done" ? text.copied : text.copy}
          </ActionButton>
          <ActionButton onClick={handleDownload} disabled={!draft.output}>
            {text.download}
          </ActionButton>
          <ActionButton
            onClick={() =>
              setDraft({
                input: "",
                output: "",
                tone: "friendly",
                strengthValue: 62,
                compareMode: true,
              })
            }
            disabled={!draft.input && !draft.output}
          >
            {text.clear}
          </ActionButton>
        </ActionRow>
      </div>

      <div className="space-y-6">
        <PanelCard title="AI score panel" description="A quick simulation of how human the output feels after the rewrite.">
          <MetaNotes
            items={[
              {
                label: "AI signal",
                value: responseMeta?.detection ? `${responseMeta.detection.score}%` : "Generate a result to see the score shift.",
              },
              {
                label: "Readability",
                value: `${outputMetrics.readabilityScore || inputMetrics.readabilityScore}`,
              },
              {
                label: "Trust note",
                value: responseMeta?.trustNote || "Inputs are processed in memory and not stored after the response returns.",
              },
            ]}
          />
        </PanelCard>

        <HistoryPanel
          title={text.history}
          history={history}
          onRestore={restoreHistory}
          emptyMessage="Generate a few versions and your best rewrites will stay here for quick recovery."
        />
      </div>
    </div>
  );
}
