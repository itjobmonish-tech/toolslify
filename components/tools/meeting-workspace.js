"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { analyzeText } from "@/lib/humanizer";
import { downloadTextFile } from "@/lib/utils";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Badge } from "@/components/ui/badge";
import {
  ActionButton,
  ActionRow,
  HistoryPanel,
  LoadingSurface,
  MetricStrip,
  OutputSurface,
  PanelCard,
  SegmentedControl,
  StarterCard,
  StatusBanner,
  TextEditor,
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
- Decide to launch AI Humanizer first, followed by assignment and PDF tools next week
- Marcus will send final SEO headings by Thursday
- Nina to review FAQ wording and trust badges before publishing
- Need confirmation on analytics setup for the new tool pages
- Follow up with design on mobile spacing around the comparison demo`;

export function MeetingWorkspace() {
  const { text } = usePreferences();
  const [draft, setDraft] = usePersistentState("toolslify:meeting:draft", {
    notes: "",
    format: "bullets",
    output: "",
  });
  const { history, pushHistory } = useHistoryStorage("toolslify:meeting:history");
  const [responseMeta, setResponseMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("idle");

  const deferredOutput = useDeferredValue(draft.output);
  const outputMetrics = useMemo(() => analyzeText(deferredOutput), [deferredOutput]);

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
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!draft.output) return;
    await navigator.clipboard.writeText(draft.output);
    setCopyState("done");
    setTimeout(() => setCopyState("idle"), 1500);
  }

  function handleDownload() {
    if (!draft.output) return;
    downloadTextFile({
      content: draft.output,
      filename: "toolslify-meeting-summary.txt",
    });
  }

  function restoreHistory(item) {
    if (!item.payload) return;
    setDraft(item.payload);
  }

  function loadExample() {
    setError("");
    setResponseMeta(null);
    setDraft({
      notes: MEETING_EXAMPLE,
      format: "bullets",
      output: "",
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <MetricStrip
          items={[
            { label: "Format", value: draft.format },
            { label: "Output words", value: String(outputMetrics.words) },
            { label: "Decisions", value: String(responseMeta?.decisions?.length || 0) },
            { label: "Action items", value: String(responseMeta?.actionItems?.length || 0) },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <PanelCard title="Step 1: Paste meeting notes" description="Drop in rough notes, action items, or a raw transcript from a team call.">
            <div className="space-y-4">
              <StarterCard
                title="Load a team sync example"
                description="Use a realistic meeting note sample to preview the summary, decisions, action items, and open questions instantly."
                onAction={loadExample}
              />
              <TextEditor
                value={draft.notes}
                onChange={(notes) => setDraft((current) => ({ ...current, notes }))}
                placeholder="Paste standup notes, workshop notes, or a transcript here. The tool will separate summary points, decisions, and next steps."
                className="min-h-[360px]"
              />
            </div>
          </PanelCard>

          <div className="space-y-6">
            <SegmentedControl
              label="Output format"
              help="Choose a concise bullet digest or a smoother paragraph summary."
              options={formatOptions}
              value={draft.format}
              onChange={(format) => setDraft((current) => ({ ...current, format }))}
            />

            {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}

            <PanelCard title="Step 3: Share the result" description="Review the digest, then copy it into Slack, email, or your docs.">
              {isLoading ? (
                <LoadingSurface title="Summarizing meeting notes..." />
              ) : (
                <OutputSurface
                  output={draft.output}
                  placeholder="Your clean meeting summary will appear here after the notes are converted."
                />
              )}
            </PanelCard>

            <div className="grid gap-4 md:grid-cols-3">
              <BoardCard
                title="Summary"
                items={[responseMeta?.summary || "Generate a result to see the top-line summary."]}
              />
              <BoardCard
                title="Decisions"
                items={responseMeta?.decisions?.length ? responseMeta.decisions : ["No decisions yet."]}
              />
              <BoardCard
                title="Action items"
                items={responseMeta?.actionItems?.length ? responseMeta.actionItems : ["No action items yet."]}
              />
            </div>
          </div>
        </div>

        <ActionRow
          meta={[
            <Badge key="questions">{responseMeta?.openQuestions?.length || 0} open questions</Badge>,
            <Badge key="privacy" tone="accent">
              {text.noDataStored}
            </Badge>,
          ]}
        >
          <ActionButton onClick={handleGenerate} disabled={isLoading || !draft.notes.trim()}>
            {isLoading ? "Summarizing..." : "Step 2: Create summary"}
          </ActionButton>
          <ActionButton onClick={handleCopy} disabled={!draft.output}>
            {copyState === "done" ? text.copied : text.copy}
          </ActionButton>
          <ActionButton onClick={handleDownload} disabled={!draft.output}>
            {text.download}
          </ActionButton>
          <ActionButton
            onClick={() => setDraft({ notes: "", format: "bullets", output: "" })}
            disabled={!draft.notes && !draft.output}
          >
            {text.clear}
          </ActionButton>
        </ActionRow>
      </div>

      <div className="space-y-6">
        <PanelCard title="Digest tips" description="Use the paragraph format for status emails and bullet format for team docs.">
          <div className="space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
            <p>Paste rough notes first. The summary gets better when the original capture is fuller, even if the notes are messy.</p>
            <p>Use the bullet mode for internal docs, then switch to paragraph mode when you need a polished narrative update.</p>
            <p>Action items and decisions are split into separate buckets so follow-up feels more obvious after the meeting ends.</p>
          </div>
        </PanelCard>

        <HistoryPanel
          title={text.history}
          history={history}
          onRestore={restoreHistory}
          emptyMessage="Saved summaries will appear here once you generate your first meeting digest."
        />
      </div>
    </div>
  );
}

function BoardCard({ title, items }) {
  return (
    <PanelCard title={title} className="h-full">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm leading-7 text-[var(--foreground)]">
            {item}
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
