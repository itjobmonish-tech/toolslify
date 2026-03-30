"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { analyzeText } from "@/lib/humanizer";
import { downloadTextFile } from "@/lib/utils";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import {
  ActionButton,
  ActionRow,
  FieldGroup,
  HistoryPanel,
  InputField,
  LoadingSurface,
  MetaNotes,
  MetricStrip,
  OutputSurface,
  PanelCard,
  RangeField,
  StarterCard,
  StatusBanner,
  TextEditor,
  useHistoryStorage,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";
import { requestJsonTool, sliderToDepth } from "@/components/tools/tool-client-utils";

const ASSIGNMENT_EXAMPLE = {
  question: "Explain the causes and effects of the Industrial Revolution in Europe.",
  subject: "History",
  context:
    "Mention factory production, urbanization, labor changes, transportation, and long-term economic growth. Keep the answer easy to revise before submission.",
};

export function AssignmentWorkspace() {
  const { text } = usePreferences();
  const [draft, setDraft] = usePersistentState("toolslify:assignment:draft", {
    question: "",
    subject: "",
    context: "",
    depthValue: 60,
    academicTone: true,
    output: "",
  });
  const { history, pushHistory } = useHistoryStorage("toolslify:assignment:history");
  const [responseMeta, setResponseMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("idle");

  const deferredOutput = useDeferredValue(draft.output);
  const outputMetrics = useMemo(() => analyzeText(deferredOutput), [deferredOutput]);
  const depth = sliderToDepth(draft.depthValue);

  useSubmitShortcut({
    enabled: Boolean(draft.question.trim()) && !isLoading,
    onSubmit: handleGenerate,
  });

  async function handleGenerate() {
    if (!draft.question.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await requestJsonTool("assignment-answer-generator", {
        question: draft.question,
        subject: draft.subject,
        context: draft.context,
        depth,
        academicTone: draft.academicTone,
      });

      setDraft((current) => ({ ...current, output: result.output }));
      setResponseMeta(result.meta);
      pushHistory({
        label: `${draft.academicTone ? "Academic" : "Standard"} / ${depth}`,
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
      filename: "toolslify-assignment-answer.doc",
      mimeType: "application/msword",
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
      ...ASSIGNMENT_EXAMPLE,
      depthValue: 60,
      academicTone: true,
      output: "",
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <MetricStrip
          items={[
            { label: "Answer tone", value: draft.academicTone ? "Academic" : "Standard" },
            { label: "Depth", value: depth },
            { label: "Output words", value: String(outputMetrics.words) },
            { label: "Reading time", value: responseMeta?.estimatedReadingTime || "--" },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <PanelCard title="Step 1: Build the prompt" description="Enter the assignment question and any notes you want the answer to use.">
            <div className="space-y-5">
              <StarterCard
                title="Try a realistic student example"
                description="Load a sample history prompt with notes so you can test the structure, academic tone, and study support panels right away."
                onAction={loadExample}
              />
              <FieldGroup label="Assignment question" help="Use the exact prompt from the worksheet or LMS.">
                <TextEditor
                  value={draft.question}
                  onChange={(question) => setDraft((current) => ({ ...current, question }))}
                  placeholder="Example: Explain the causes and effects of the Industrial Revolution in Europe."
                  className="min-h-[170px]"
                />
              </FieldGroup>

              <FieldGroup label="Subject" help="Optional but useful for steering the style and examples.">
                <InputField
                  value={draft.subject}
                  onChange={(subject) => setDraft((current) => ({ ...current, subject }))}
                  placeholder="History, Biology, Economics..."
                />
              </FieldGroup>

              <FieldGroup label="Supporting notes" help="Add class notes, facts, keywords, or points you want included.">
                <TextEditor
                  value={draft.context}
                  onChange={(context) => setDraft((current) => ({ ...current, context }))}
                  placeholder="Paste source notes, facts, dates, or bullet points here."
                  className="min-h-[180px]"
                />
              </FieldGroup>
            </div>
          </PanelCard>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
              <RangeField
                label="Answer depth"
                help="Use higher depth for more developed body paragraphs."
                value={draft.depthValue}
                onChange={(depthValue) => setDraft((current) => ({ ...current, depthValue }))}
              />

              <PanelCard title="Academic tone" description="Toggle a more formal classroom-ready style.">
                <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3">
                  <span className="text-sm text-[var(--foreground)]">
                    {draft.academicTone ? "Formal wording on" : "Simpler wording on"}
                  </span>
                  <Toggle
                    checked={draft.academicTone}
                    onCheckedChange={(academicTone) => setDraft((current) => ({ ...current, academicTone }))}
                    label="Toggle academic tone"
                  />
                </div>
              </PanelCard>
            </div>

            {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}

            <PanelCard title="Step 3: Review the answer" description="Generate the draft, then refine or export it.">
              {isLoading ? (
                <LoadingSurface title="Generating structured answer..." />
              ) : (
                <OutputSurface
                  output={draft.output}
                  placeholder="Your structured assignment answer will appear here with an introduction, body points, and a conclusion."
                />
              )}
            </PanelCard>
          </div>
        </div>

        <ActionRow
          meta={[
            <Badge key="words">{outputMetrics.words || 0} words</Badge>,
            <Badge key="privacy" tone="accent">
              {text.noDataStored}
            </Badge>,
          ]}
        >
          <ActionButton onClick={handleGenerate} disabled={isLoading || !draft.question.trim()}>
            {isLoading ? "Generating..." : "Step 2: Generate answer"}
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
                question: "",
                subject: "",
                context: "",
                depthValue: 60,
                academicTone: true,
                output: "",
              })
            }
            disabled={!draft.question && !draft.context && !draft.output}
          >
            {text.clear}
          </ActionButton>
        </ActionRow>
      </div>

      <div className="space-y-6">
        <PanelCard title="Answer outline" description="A quick structure you can compare against your class expectations.">
          <MetaNotes
            items={(responseMeta?.outline || [
              "Generate a draft to see the suggested answer outline.",
            ]).map((item, index) => ({
              label: `Point ${index + 1}`,
              value: item,
            }))}
          />
        </PanelCard>

        <PanelCard title="Study notes" description="Condensed prompts you can use to personalize the answer before submission.">
          <MetaNotes
            items={(responseMeta?.studyNotes || ["Key reminders will appear here after generation."]).map((item, index) => ({
              label: `Note ${index + 1}`,
              value: item,
            }))}
          />
        </PanelCard>

        <HistoryPanel
          title={text.history}
          history={history}
          onRestore={restoreHistory}
          emptyMessage="Generated assignment drafts will stay here so you can compare different versions."
        />
      </div>
    </div>
  );
}
