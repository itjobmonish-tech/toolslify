"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  analyzeText,
  createSeededRandom,
  estimateAiDetectionScore,
  getDiffSegments,
  humanizeText,
} from "@/lib/humanizer";
import { downloadTextFile } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  CollapsiblePanel,
  HistoryPanel,
  InlineInfo,
  LoadingSurface,
  MetaNotes,
  OutputSurface,
  PanelCard,
  RangeField,
  SegmentedControl,
  StatusBanner,
  TextEditor,
  TypewriterText,
  useHistoryStorage,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";
import { requestJsonTool, sliderToStrength } from "@/components/tools/tool-client-utils";

const toneOptions = [
  { label: "Natural", value: "friendly" },
  { label: "Professional", value: "formal" },
  { label: "Relaxed", value: "casual" },
];

const HUMANIZER_EXAMPLE =
  "This tool helps students, creators, and teams rewrite rough drafts into clearer, more natural copy. It keeps the main ideas intact while improving flow, tone, and readability.";

const EMPTY_STATE = {
  input: "",
  output: "",
  tone: "friendly",
  strengthValue: 62,
  compareMode: true,
};

export function HumanizerWorkspace() {
  const { text } = usePreferences();
  const { showToast } = useToast();
  const [draft, setDraft] = usePersistentState("toolslify:humanizer:draft", EMPTY_STATE);
  const { history, pushHistory } = useHistoryStorage("toolslify:humanizer:history");
  const [responseMeta, setResponseMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const [error, setError] = useState("");
  const [pasteDetected, setPasteDetected] = useState(false);

  const deferredInput = useDeferredValue(draft.input);
  const strength = sliderToStrength(draft.strengthValue);
  const livePreview = useMemo(() => {
    if (!deferredInput.trim()) return "";

    return humanizeText(deferredInput, {
      tone: draft.tone,
      strength,
      random: createSeededRandom(Math.max(17, deferredInput.length * 17 + draft.strengthValue)),
    });
  }, [deferredInput, draft.strengthValue, draft.tone, strength]);
  const liveMetrics = useMemo(() => analyzeText(livePreview), [livePreview]);
  const inputMetrics = useMemo(() => analyzeText(deferredInput), [deferredInput]);
  const outputMetrics = useMemo(() => analyzeText(draft.output || livePreview), [draft.output, livePreview]);
  const activeOutput = draft.output || livePreview;
  const detection = useMemo(
    () => (deferredInput && activeOutput ? estimateAiDetectionScore(deferredInput, activeOutput) : null),
    [activeOutput, deferredInput],
  );
  const diffSegments = useMemo(() => {
    if (!draft.compareMode || !draft.input.trim() || !draft.output.trim()) return [];
    return getDiffSegments(draft.input, draft.output);
  }, [draft.compareMode, draft.input, draft.output]);

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
      showToast({
        title: "Humanized draft ready",
        description: "Your rewritten text is ready on the right.",
        tone: "success",
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
      showToast({
        title: "Copied to clipboard",
        description: "Your rewritten draft is ready to paste.",
        tone: "success",
      });
    } catch {
      setCopyState("idle");
      showToast({
        title: "Copy failed",
        description: "Use download if clipboard access is blocked.",
        tone: "warning",
      });
    }
  }

  function handleDownload() {
    if (!draft.output) return;

    downloadTextFile({
      content: draft.output,
      filename: "toolslify-humanized-text.txt",
    });
    showToast({
      title: "Download started",
      description: "The rewritten text file is being saved locally.",
      tone: "success",
    });
  }

  function restoreHistory(item) {
    if (!item.payload) return;
    setDraft(item.payload);
    setPasteDetected(false);
  }

  function loadExample() {
    setError("");
    setResponseMeta(null);
    setPasteDetected(false);
    setDraft({
      input: HUMANIZER_EXAMPLE,
      output: "",
      tone: "friendly",
      strengthValue: 62,
      compareMode: true,
    });
  }

  function resetDraft() {
    setDraft(EMPTY_STATE);
    setResponseMeta(null);
    setPasteDetected(false);
    setError("");
  }

  return (
    <div className="space-y-6">
      {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}
      {pasteDetected ? (
        <StatusBanner tone="success">
          Pasted draft detected. The live preview is already updating, and the main CTA will run the full rewrite.
        </StatusBanner>
      ) : null}

      <div id="tool-workspace" className="workspace-grid scroll-mt-28">
        <PanelCard className="p-6 sm:p-7">
          <div className="space-y-5">
            <TextEditor
              value={draft.input}
              onChange={(input) => setDraft((current) => ({ ...current, input }))}
              onPaste={() => setPasteDetected(true)}
              placeholder="Paste AI-generated text here."
              className="min-h-[340px]"
              autoFocus
            />

            <InlineInfo
              items={[
                `${inputMetrics.words} input words`,
                `${strength} rewrite`,
                text.noDataStored,
              ]}
            />

            <CollapsiblePanel title="Advanced settings" description="Tone and compare">
              <div className="grid gap-4">
                <SegmentedControl
                  label="Tone"
                  help="Choose how polished or conversational the final draft should feel."
                  options={toneOptions}
                  value={draft.tone}
                  onChange={(tone) => setDraft((current) => ({ ...current, tone }))}
                />
                <RangeField
                  label="Rewrite strength"
                  help="Lower values keep more of the original wording. Higher values push for a stronger rewrite."
                  value={draft.strengthValue}
                  onChange={(strengthValue) => setDraft((current) => ({ ...current, strengthValue }))}
                />
                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">Before vs after comparison</p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        Keep a side-by-side review block below the result.
                      </p>
                    </div>
                    <Toggle
                      checked={draft.compareMode}
                      onCheckedChange={(compareMode) => setDraft((current) => ({ ...current, compareMode }))}
                      label="Toggle compare mode"
                    />
                  </div>
                </div>
              </div>
            </CollapsiblePanel>

            <div id="tool-action" className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={handleGenerate} disabled={isLoading || !draft.input.trim()} size="lg" className="min-w-[220px]">
                {isLoading ? "Humanizing..." : "Humanize text"}
              </Button>
              <p className="text-sm text-[var(--muted-foreground)]">Ctrl+Enter to run.</p>
            </div>
          </div>
        </PanelCard>

        <PanelCard className="p-6 sm:p-7">
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{draft.output ? "Result" : "Result"}</h2>
              <Badge tone={detection?.score <= 44 ? "success" : "accent"}>
                {detection?.label || "Ready for input"}
              </Badge>
            </div>

            {isLoading ? (
              <LoadingSurface title="Humanizing your draft..." />
            ) : draft.output ? (
              <OutputSurface output={draft.output} placeholder="Your rewritten result will appear here.">
                <TypewriterText text={draft.output} />
              </OutputSurface>
            ) : livePreview ? (
              <OutputSurface output={livePreview} placeholder="Your rewritten result will appear here.">
                <TypewriterText text={livePreview} />
              </OutputSurface>
            ) : (
              <OutputSurface placeholder="Paste text on the left and the live preview will appear here immediately." />
            )}

            {draft.output ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button onClick={handleCopy} disabled={!draft.output} size="lg">
                  {copyState === "done" ? text.copied : text.copy}
                </Button>
                <Button onClick={handleDownload} disabled={!draft.output} variant="secondary" size="lg">
                  {text.download}
                </Button>
                <Button onClick={resetDraft} variant="secondary" size="lg">
                  {text.clear}
                </Button>
              </div>
            ) : (
              <StatusBanner>
                Live preview is for instant feedback. Use the main CTA to save the final result to history and unlock export actions.
              </StatusBanner>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge>{outputMetrics.words || liveMetrics.words || 0} output words</Badge>
              <Badge>{detection ? `${detection.score}% AI score` : "Waiting"}</Badge>
              <Badge>{outputMetrics.readabilityLabel || liveMetrics.readabilityLabel || "Balanced"} readability</Badge>
            </div>
          </div>
        </PanelCard>
      </div>

      {draft.output && draft.compareMode ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <PanelCard title="Before" description="Original source text">
            <OutputSurface output={draft.input} placeholder="Original text appears here." />
          </PanelCard>
          <PanelCard title="After" description="Changed words are highlighted for faster review.">
            <OutputSurface output={draft.output} placeholder="Rewritten text appears here.">
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
            </OutputSurface>
          </PanelCard>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PanelCard title="Rewrite signals" description="Helpful context for quick review before you copy the result.">
          <MetaNotes
            items={[
              {
                label: "AI signal",
                value: responseMeta?.detection ? `${responseMeta.detection.score}% / ${responseMeta.detection.label}` : detection ? `${detection.score}% / ${detection.label}` : "Waiting for text",
              },
              {
                label: "Readability",
                value: responseMeta?.outputMetrics?.readabilityLabel || outputMetrics.readabilityLabel || "Balanced",
              },
              {
                label: "Trust note",
                value: responseMeta?.trustNote || "Inputs are processed in memory. Recent history stays in this browser only.",
              },
            ]}
          />
        </PanelCard>

        <HistoryPanel
          title={text.history}
          history={history}
          onRestore={restoreHistory}
          emptyMessage="Generate a few versions and your best rewrites will stay here for quick restore."
        />
      </div>
    </div>
  );
}
