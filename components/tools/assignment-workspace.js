"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { analyzeText } from "@/lib/humanizer";
import { downloadTextFile } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  CollapsiblePanel,
  FieldGroup,
  HistoryPanel,
  InlineInfo,
  InputField,
  LoadingSurface,
  MetaNotes,
  OutputSurface,
  PanelCard,
  RangeField,
  StatusBanner,
  TextEditor,
  TypewriterText,
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

const EMPTY_STATE = {
  question: "",
  subject: "",
  context: "",
  depthValue: 60,
  academicTone: true,
  output: "",
};

export function AssignmentWorkspace() {
  const { text } = usePreferences();
  const { showToast } = useToast();
  const [draft, setDraft] = usePersistentState("toolslify:assignment:draft", EMPTY_STATE);
  const { history, pushHistory } = useHistoryStorage("toolslify:assignment:history");
  const [responseMeta, setResponseMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("idle");
  const [pasteDetected, setPasteDetected] = useState(false);

  const deferredOutput = useDeferredValue(draft.output);
  const outputMetrics = useMemo(() => analyzeText(deferredOutput), [deferredOutput]);
  const depth = sliderToDepth(draft.depthValue);
  const liveOutline = useMemo(() => buildPreviewOutline(draft.question, depth, draft.subject), [depth, draft.question, draft.subject]);

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
      showToast({
        title: "Assignment draft ready",
        description: "Your structured answer is ready on the right.",
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
        description: "The latest answer draft is ready to paste.",
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
      filename: "toolslify-assignment-answer.doc",
      mimeType: "application/msword",
    });
    showToast({
      title: "Download started",
      description: "The answer draft is being saved as a Word file.",
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
      ...ASSIGNMENT_EXAMPLE,
      depthValue: 60,
      academicTone: true,
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
          Assignment prompt pasted. The outline preview updated instantly, and the main CTA will generate the full draft.
        </StatusBanner>
      ) : null}

      <div id="tool-workspace" className="workspace-grid scroll-mt-28">
        <PanelCard className="p-6 sm:p-7">
          <div className="space-y-5">
            <FieldGroup label="Assignment question" help="Paste the exact prompt from your worksheet or LMS.">
              <TextEditor
                value={draft.question}
                onChange={(question) => setDraft((current) => ({ ...current, question }))}
                onPaste={() => setPasteDetected(true)}
                placeholder="Example: Explain the causes and effects of the Industrial Revolution in Europe."
                className="min-h-[280px]"
                autoFocus
              />
            </FieldGroup>

            <InlineInfo
              items={[
                draft.academicTone ? "Academic tone" : "Simple tone",
                `${depth} depth`,
                text.noDataStored,
              ]}
            />

            <CollapsiblePanel title="Optional settings" description="Subject, notes, and tone">
              <div className="grid gap-4">
                <FieldGroup label="Subject" help="Useful if you want the draft framed more clearly for class context.">
                  <InputField
                    value={draft.subject}
                    onChange={(subject) => setDraft((current) => ({ ...current, subject }))}
                    placeholder="History, Biology, Economics..."
                  />
                </FieldGroup>

                <FieldGroup label="Supporting notes" help="Facts, dates, bullet points, or source hints you want included.">
                  <TextEditor
                    value={draft.context}
                    onChange={(context) => setDraft((current) => ({ ...current, context }))}
                    placeholder="Paste source notes, keywords, or details here."
                    className="min-h-[180px]"
                  />
                </FieldGroup>

                <RangeField
                  label="Answer depth"
                  help="Use higher depth for more developed body paragraphs."
                  value={draft.depthValue}
                  onChange={(depthValue) => setDraft((current) => ({ ...current, depthValue }))}
                />

                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">Academic tone</p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        Keep the wording formal and classroom-ready by default.
                      </p>
                    </div>
                    <Toggle
                      checked={draft.academicTone}
                      onCheckedChange={(academicTone) => setDraft((current) => ({ ...current, academicTone }))}
                      label="Toggle academic tone"
                    />
                  </div>
                </div>
              </div>
            </CollapsiblePanel>

            <div id="tool-action" className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={handleGenerate} disabled={isLoading || !draft.question.trim()} size="lg" className="min-w-[220px]">
                {isLoading ? "Generating..." : "Generate answer"}
              </Button>
              <p className="text-sm text-[var(--muted-foreground)]">Ctrl+Enter to run.</p>
            </div>
          </div>
        </PanelCard>

        <PanelCard className="p-6 sm:p-7">
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Result</h2>
              <Badge>{draft.output ? "Editable export" : "Live guidance"}</Badge>
            </div>

            {isLoading ? (
              <LoadingSurface title="Generating structured answer..." />
            ) : draft.output ? (
              <OutputSurface output={draft.output} placeholder="Your structured assignment answer will appear here.">
                <TypewriterText text={draft.output} />
              </OutputSurface>
            ) : (
              <OutputSurface placeholder="Add the assignment question on the left to see the preview outline here.">
                <div className="space-y-3">
                  {liveOutline.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-7 text-[var(--foreground)]"
                    >
                      {item}
                    </div>
                  ))}
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
                The preview outline is instant. Use the main CTA to generate the full structured answer and export it.
              </StatusBanner>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge>{draft.subject || "General subject"}</Badge>
              <Badge>{responseMeta?.estimatedReadingTime || "1 min read"}</Badge>
              <Badge>{outputMetrics.words || 0} words</Badge>
            </div>
          </div>
        </PanelCard>
      </div>

      {responseMeta ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <PanelCard title="Answer outline" description="A quick structure check before you finalize the draft.">
            <MetaNotes
              items={(responseMeta.outline || []).map((item, index) => ({
                label: `Point ${index + 1}`,
                value: item,
              }))}
            />
          </PanelCard>

          <PanelCard title="Study notes" description="Prompts you can use to personalize the answer before submission.">
            <MetaNotes
              items={(responseMeta.studyNotes || []).map((item, index) => ({
                label: `Note ${index + 1}`,
                value: item,
              }))}
            />
          </PanelCard>
        </div>
      ) : null}

      <HistoryPanel
        title={text.history}
        history={history}
        onRestore={restoreHistory}
        emptyMessage="Generated assignment drafts will stay here so you can reopen a previous version quickly."
      />
    </div>
  );
}

function buildPreviewOutline(question, depth, subject) {
  if (!question.trim()) {
    return [
      "Introduction that answers the prompt directly",
      "Main body section with evidence or explanation",
      "Conclusion that ties the argument back to the question",
    ];
  }

  const subjectLine = subject ? `${subject}: ` : "";
  const pointCount = depth === "detailed" ? 4 : depth === "standard" ? 3 : 2;

  return [
    `${subjectLine}Introduction that reframes "${trimQuestion(question)}"`,
    ...Array.from({ length: pointCount }).map((_, index) => `Body point ${index + 1} with explanation and support`),
    "Conclusion that restates the strongest takeaway",
  ];
}

function trimQuestion(question) {
  return question.replace(/[?]+$/, "").trim();
}
