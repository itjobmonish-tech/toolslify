"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { analyzeText } from "@/lib/humanizer";
import { downloadTextFile } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CollapsiblePanel,
  HistoryPanel,
  InlineInfo,
  LoadingSurface,
  OutputSurface,
  PanelCard,
  SegmentedControl,
  StatusBanner,
  TextEditor,
  TypewriterText,
  useHistoryStorage,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";
import { requestJsonTool } from "@/components/tools/tool-client-utils";

const formatOptions = [
  { label: "Bullets", value: "bullets" },
  { label: "Paragraph", value: "paragraph" },
];

const MEETING_EXAMPLE = `Weekly product sync
- Reviewed homepage redesign progress and approved the new premium hero direction
- Decided to launch AI Humanizer first, followed by assignment and PDF tools next week
- Marcus will send final SEO headings by Thursday
- Nina to review FAQ wording and trust badges before publishing
- Need confirmation on analytics setup for the new tool pages
- Follow up with design on mobile spacing around the comparison demo`;

const EMPTY_STATE = {
  notes: "",
  format: "bullets",
  output: "",
};

export function MeetingWorkspace() {
  const { text } = usePreferences();
  const { showToast } = useToast();
  const [draft, setDraft] = usePersistentState("toolslify:meeting:draft", EMPTY_STATE);
  const { history, pushHistory } = useHistoryStorage("toolslify:meeting:history");
  const [responseMeta, setResponseMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("idle");
  const [pasteDetected, setPasteDetected] = useState(false);

  const deferredOutput = useDeferredValue(draft.output);
  const outputMetrics = useMemo(() => analyzeText(deferredOutput), [deferredOutput]);
  const liveSignals = useMemo(() => analyzeMeetingInput(draft.notes), [draft.notes]);

  useSubmitShortcut({
    enabled: Boolean(draft.notes.trim()) && !isLoading,
    onSubmit: handleGenerate,
  });

  async function handleGenerate() {
    if (!draft.notes.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await requestJsonTool("meeting-notes-summary", {
        notes: draft.notes,
        format: draft.format,
      });

      setDraft((current) => ({ ...current, output: result.output }));
      setResponseMeta(result.meta);
      pushHistory({
        label: `${draft.format} summary`,
        preview: result.output,
        payload: {
          ...draft,
          output: result.output,
        },
      });
      showToast({
        title: "Meeting summary ready",
        description: "Your recap is ready on the right.",
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
        title: "Copied summary",
        description: "The meeting recap is ready to paste.",
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
    if (!draft.output) return;

    downloadTextFile({
      content: draft.output,
      filename: "toolslify-meeting-summary.txt",
    });
    showToast({
      title: "Download started",
      description: "The meeting summary is being saved locally.",
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
      notes: MEETING_EXAMPLE,
      format: "bullets",
      output: "",
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
          Notes pasted. Toolslify already detected likely decisions, action items, and open questions before generation.
        </StatusBanner>
      ) : null}

      <div id="tool-workspace" className="workspace-grid scroll-mt-28">
        <PanelCard className="p-6 sm:p-7">
          <div className="space-y-5">
            <TextEditor
              value={draft.notes}
              onChange={(notes) => setDraft((current) => ({ ...current, notes }))}
              onPaste={() => setPasteDetected(true)}
              placeholder="Paste standup notes, workshop notes, or a rough transcript here."
              className="min-h-[320px]"
              autoFocus
            />

            <InlineInfo
              items={[
                `${liveSignals.lineCount} lines detected`,
                `${liveSignals.actionCount} likely actions`,
                text.noDataStored,
              ]}
            />

            <CollapsiblePanel title="Output format" description={draft.format}>
              <SegmentedControl
                label="Summary style"
                help="Default bullets work well for async updates. Switch to paragraph if you need a smoother narrative recap."
                options={formatOptions}
                value={draft.format}
                onChange={(format) => setDraft((current) => ({ ...current, format }))}
              />
            </CollapsiblePanel>

            <div id="tool-action" className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={handleGenerate} disabled={isLoading || !draft.notes.trim()} size="lg" className="min-w-[220px]">
                {isLoading ? "Creating summary..." : "Create summary"}
              </Button>
              <p className="text-sm text-[var(--muted-foreground)]">Ctrl+Enter to run.</p>
            </div>
          </div>
        </PanelCard>

        <PanelCard className="p-6 sm:p-7">
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Result</h2>
              <Badge>{draft.output ? "Ready to share" : "Instant scan"}</Badge>
            </div>

            {isLoading ? (
              <LoadingSurface title="Summarizing meeting notes..." />
            ) : draft.output ? (
              <OutputSurface output={draft.output} placeholder="Your meeting summary will appear here.">
                <TypewriterText text={draft.output} />
              </OutputSurface>
            ) : (
              <OutputSurface placeholder="Paste meeting notes on the left to see the detected signals here.">
                <div className="grid gap-3 sm:grid-cols-3">
                  <SignalCard title="Likely decisions" items={liveSignals.decisions} fallback="No obvious decisions detected yet." />
                  <SignalCard title="Likely actions" items={liveSignals.actions} fallback="No obvious action items detected yet." />
                  <SignalCard title="Open questions" items={liveSignals.questions} fallback="No open questions detected yet." />
                </div>
              </OutputSurface>
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
                The live scan is only a preview. Use the main CTA to generate the full summary, decisions, and action items.
              </StatusBanner>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge>{draft.format} format</Badge>
              <Badge>{responseMeta?.decisions?.length || liveSignals.decisionCount} decisions</Badge>
              <Badge>{responseMeta?.actionItems?.length || liveSignals.actionCount} action items</Badge>
            </div>
          </div>
        </PanelCard>
      </div>

      {responseMeta ? (
        <div className="grid gap-6 md:grid-cols-3">
          <SmallBoard title="Summary" items={[responseMeta.summary || "No summary yet."]} />
          <SmallBoard title="Decisions" items={responseMeta.decisions?.length ? responseMeta.decisions : ["No decisions yet."]} />
          <SmallBoard title="Action items" items={responseMeta.actionItems?.length ? responseMeta.actionItems : ["No action items yet."]} />
        </div>
      ) : null}

      <HistoryPanel
        title={text.history}
        history={history}
        onRestore={restoreHistory}
        emptyMessage="Saved summaries will appear here once you generate your first result."
      />
    </div>
  );
}

function SmallBoard({ title, items }) {
  return (
    <PanelCard title={title} className="h-full">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-7 text-[var(--foreground)]">
            {item}
          </div>
        ))}
      </div>
    </PanelCard>
  );
}

function SignalCard({ title, items, fallback }) {
  const content = items.length ? items.slice(0, 3) : [fallback];

  return (
    <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      <div className="mt-3 space-y-2">
        {content.map((item) => (
          <p key={item} className="text-sm leading-7 text-[var(--muted-foreground)]">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function analyzeMeetingInput(notes) {
  const lines = notes
    .split(/\n+/)
    .map((line) => line.replace(/^[\u2022\-]+\s*/, "").trim())
    .filter(Boolean);

  const decisions = lines.filter((line) => /(decided|approved|agreed|confirmed|launch)/i.test(line));
  const actions = lines.filter((line) => /(will|follow up|send|review|prepare|share|owner|next step)/i.test(line));
  const questions = lines.filter((line) => line.includes("?"));

  return {
    lineCount: lines.length,
    decisionCount: decisions.length,
    actionCount: actions.length,
    decisions,
    actions,
    questions,
  };
}
