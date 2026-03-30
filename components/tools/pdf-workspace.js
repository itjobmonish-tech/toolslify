"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { analyzeText } from "@/lib/humanizer";
import { downloadTextFile } from "@/lib/utils";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Badge } from "@/components/ui/badge";
import {
  ActionButton,
  ActionRow,
  FileDropzone,
  HistoryPanel,
  LoadingSurface,
  MetaNotes,
  MetricStrip,
  OutputSurface,
  PanelCard,
  SegmentedControl,
  StarterCard,
  StatusBanner,
  useHistoryStorage,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";
import { createSamplePdfFile, requestFormTool } from "@/components/tools/tool-client-utils";

const formatOptions = [
  { label: "Text", value: "text" },
  { label: "Word", value: "word" },
  { label: "Summary", value: "summary" },
  { label: "Notes", value: "notes" },
];

export function PdfWorkspace() {
  const { text } = usePreferences();
  const [draft, setDraft] = usePersistentState("toolslify:pdf:draft", {
    format: "text",
    output: "",
  });
  const { history, pushHistory } = useHistoryStorage("toolslify:pdf:history");
  const [pdfFile, setPdfFile] = useState(null);
  const [responseMeta, setResponseMeta] = useState(null);
  const [download, setDownload] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyState, setCopyState] = useState("idle");

  const deferredOutput = useDeferredValue(draft.output);
  const outputMetrics = useMemo(() => analyzeText(deferredOutput), [deferredOutput]);

  useSubmitShortcut({
    enabled: Boolean(pdfFile) && !isLoading,
    onSubmit: handleConvert,
  });

  async function handleConvert() {
    if (!pdfFile) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await requestFormTool("pdf-all-format-converter", {
        file: pdfFile,
        format: draft.format,
      });

      setDraft((current) => ({ ...current, output: result.output }));
      setResponseMeta(result.meta);
      setDownload(result.download || null);
      pushHistory({
        label: `${draft.format} export`,
        preview: result.output,
        payload: {
          format: draft.format,
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
    if (!download) return;

    downloadTextFile({
      content: download.content,
      filename: download.filename,
      mimeType: download.mimeType,
    });
  }

  function restoreHistory(item) {
    if (!item.payload) return;
    setDraft(item.payload);
  }

  function loadExample() {
    setError("");
    setResponseMeta(null);
    setDownload(null);
    setPdfFile(createSamplePdfFile());
    setDraft({
      format: "summary",
      output: "",
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <MetricStrip
          items={[
            { label: "Format", value: draft.format },
            { label: "Pages", value: String(responseMeta?.pages || 0) },
            { label: "Extracted words", value: String(responseMeta?.extractedWords || 0) },
            { label: "Output words", value: String(outputMetrics.words) },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <PanelCard title="Step 1: Upload PDF" description="Drop in a document once, then choose the output mode you want.">
              <div className="space-y-4">
                <StarterCard
                  title="Load a sample PDF"
                  description="Generate a small demo PDF instantly so you can test extraction, summary mode, and note output before using your own file."
                  onAction={loadExample}
                />
                <FileDropzone
                  title="PDF upload"
                  description="Toolslify extracts text from the uploaded PDF and reshapes it into the format you choose below."
                  accept="application/pdf"
                  file={pdfFile}
                  onFileChange={setPdfFile}
                  accentLabel="PDF only"
                />
              </div>
            </PanelCard>

            <SegmentedControl
              label="Output mode"
              help="Switch between raw text, a Word-ready export, a compact summary, or note-style output."
              options={formatOptions}
              value={draft.format}
              onChange={(format) => setDraft((current) => ({ ...current, format }))}
            />
          </div>

          <div className="space-y-6">
            {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}

            <PanelCard title="Step 3: Review converted output" description="Copy the result or download the export that matches your workflow.">
              {isLoading ? (
                <LoadingSurface title="Extracting PDF text..." />
              ) : (
                <OutputSurface
                  output={draft.output}
                  placeholder="Your extracted PDF content will appear here after conversion."
                />
              )}
            </PanelCard>

            <div className="grid gap-4 md:grid-cols-2">
              <PanelCard title="Summary">
                <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                  {responseMeta?.summary || "Run a conversion to generate a quick summary of the uploaded document."}
                </p>
              </PanelCard>
              <PanelCard title="Format note">
                <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                  The Word mode exports an editable `.doc` file, while text, summary, and notes are downloaded as `.txt` outputs.
                </p>
              </PanelCard>
            </div>
          </div>
        </div>

        <ActionRow
          meta={[
            <Badge key="file">{pdfFile ? pdfFile.name : "PDF not selected"}</Badge>,
            <Badge key="privacy" tone="accent">
              {text.noDataStored}
            </Badge>,
          ]}
        >
          <ActionButton onClick={handleConvert} disabled={isLoading || !pdfFile}>
            {isLoading ? "Converting..." : "Step 2: Convert PDF"}
          </ActionButton>
          <ActionButton onClick={handleCopy} disabled={!draft.output}>
            {copyState === "done" ? text.copied : text.copy}
          </ActionButton>
          <ActionButton onClick={handleDownload} disabled={!download}>
            {text.download}
          </ActionButton>
          <ActionButton
            onClick={() => {
              setPdfFile(null);
              setDraft({ format: "text", output: "" });
              setDownload(null);
              setResponseMeta(null);
            }}
            disabled={!pdfFile && !draft.output}
          >
            {text.clear}
          </ActionButton>
        </ActionRow>
      </div>

      <div className="space-y-6">
        <PanelCard title="Quick note view" description="Useful when you choose Notes mode or need a study-ready breakdown.">
          <MetaNotes
            items={(responseMeta?.noteBullets || ["Convert a PDF to preview note bullets."]).map((item, index) => ({
              label: `Item ${index + 1}`,
              value: item,
            }))}
          />
        </PanelCard>

        <HistoryPanel
          title={text.history}
          history={history}
          onRestore={restoreHistory}
          emptyMessage="PDF conversions will show up here once you generate your first export."
        />
      </div>
    </div>
  );
}
