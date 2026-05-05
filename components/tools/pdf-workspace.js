"use client";

import { useEffect, useMemo, useState } from "react";
import { analyzeText } from "@/lib/humanizer";
import { getToolBySlug } from "@/lib/site-data";
import { useToast } from "@/components/providers/toast-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileDropzone,
  HistoryPanel,
  InlineInfo,
  LoadingSurface,
  MetaNotes,
  OutputSurface,
  PanelCard,
  StatusBanner,
  useHistoryStorage,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";
import { requestFormTool } from "@/components/tools/tool-client-utils";
import { formatFileSize, downloadTextFile } from "@/lib/utils";

function getInitialState(mode) {
  return {
    output: "",
    format: mode || "text",
  };
}

export function PdfWorkspace({ slug, onContentReadyChange }) {
  const tool = getToolBySlug(slug);
  const { text } = usePreferences();
  const { showToast } = useToast();
  const [draft, setDraft] = usePersistentState(`toolslify:pdf:${slug}:draft`, getInitialState(tool?.mode));
  const { history, pushHistory } = useHistoryStorage(`toolslify:pdf:${slug}:history`);
  const [pdfFile, setPdfFile] = useState(null);
  const [responseMeta, setResponseMeta] = useState(null);
  const [download, setDownload] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyState, setCopyState] = useState("idle");

  const outputMetrics = useMemo(() => analyzeText(draft.output), [draft.output]);

  useSubmitShortcut({
    enabled: Boolean(pdfFile) && !isLoading,
    onSubmit: handleConvert,
  });

  if (!tool) {
    return <StatusBanner tone="warning">This PDF tool is not configured yet.</StatusBanner>;
  }

  const hasPdf = Boolean(pdfFile);
  const hasStarted = isLoading || Boolean(draft.output) || Boolean(responseMeta) || history.length > 0;
  const seoReady = Boolean(draft.output) || Boolean(responseMeta) || history.length > 0;

  useEffect(() => {
    onContentReadyChange?.(seoReady);
  }, [onContentReadyChange, seoReady]);

  async function handleConvert() {
    if (!pdfFile) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await requestFormTool(slug, {
        file: pdfFile,
        format: tool.mode,
      });

      setDraft({
        output: result.output,
        format: tool.mode,
      });
      setResponseMeta(result.meta);
      setDownload(result.download || null);
      pushHistory({
        label: tool.shortName,
        preview: result.output,
        payload: {
          output: result.output,
          format: tool.mode,
        },
      });
      showToast({
        title: `${tool.shortName} ready`,
        description: "Your PDF result is ready on the right.",
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
        title: "Copied PDF result",
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
    if (!download) return;

    downloadTextFile({
      content: download.content,
      filename: download.filename,
      mimeType: download.mimeType,
    });
    showToast({
      title: "Download started",
      description: `Saving ${download.filename} locally.`,
      tone: "success",
    });
  }

  function handleReset() {
    setPdfFile(null);
    setDraft(getInitialState(tool.mode));
    setDownload(null);
    setResponseMeta(null);
    setError("");
  }

  function restoreHistory(item) {
    if (!item.payload) return;
    setDraft(item.payload);
  }

  return (
    <div className="space-y-6">
      {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}

      <div id="tool-workspace" className="workspace-grid scroll-mt-28">
        <PanelCard
          eyebrow="Upload"
          title={tool.inputTitle}
          minimal
          className="workspace-input-pane"
        >
          <div className="space-y-5">
            <FileDropzone
              title="Drop your PDF"
              description="Choose a PDF once and this route will process it in the selected mode."
              accept="application/pdf"
              file={pdfFile}
              onFileChange={setPdfFile}
              accentLabel={tool.shortName}
            />

            {hasPdf ? (
              <>
                <InlineInfo
                  items={[
                    pdfFile.name,
                    formatFileSize(pdfFile.size),
                    text.noDataStored,
                  ]}
                />

                <div id="tool-action" className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button onClick={handleConvert} disabled={isLoading || !pdfFile} size="lg" className="min-w-[220px]">
                    {isLoading ? "Processing..." : tool.ctaLabel}
                  </Button>
                  <Button onClick={handleReset} variant="secondary" size="lg">
                    {text.clear}
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </PanelCard>

        <PanelCard
          eyebrow="Preview"
          title={tool.outputTitle}
          className="workspace-output-pane p-6 sm:p-7"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{text.result}</h2>
              <Badge>{pdfFile ? text.readyToProcess : text.waitingForFile}</Badge>
            </div>

            {isLoading ? (
              <LoadingSurface title={text.processing} />
            ) : (
              <OutputSurface
                output={draft.output}
                placeholder="Upload a PDF on the left and the processed result will appear here."
              />
            )}

            {draft.output ? (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button onClick={handleCopy} size="lg">
                    {copyState === "done" ? text.copied : text.copy}
                  </Button>
                  <Button onClick={handleDownload} disabled={!download} variant="secondary" size="lg">
                    {text.download}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{responseMeta?.pages || 0} pages</Badge>
                  <Badge>{responseMeta?.extractedWords || 0} extracted words</Badge>
                  <Badge>{outputMetrics.words || 0} output words</Badge>
                </div>
              </>
            ) : (
              <StatusBanner>
                Upload a PDF, run the tool once, and keep the output, summary, and download on this same screen.
              </StatusBanner>
            )}
          </div>
        </PanelCard>
      </div>

      {responseMeta ? (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <PanelCard title={text.summary} description="A fast overview of the uploaded document.">
            <p className="text-sm leading-8 text-[var(--muted-foreground)]">
              {responseMeta.summary || text.noSummaryAvailable}
            </p>
          </PanelCard>

          <PanelCard title={text.quickNotes} description="Useful when you need a faster skim of the document.">
            <MetaNotes
              items={(responseMeta.noteBullets || []).map((item, index) => ({
                label: `Item ${index + 1}`,
                value: item,
              }))}
            />
          </PanelCard>
        </div>
      ) : null}

      {hasStarted ? (
        <HistoryPanel
          title={`${tool.shortName} history`}
          history={history}
          onRestore={restoreHistory}
          emptyMessage="PDF results will show up here once you process your first file."
        />
      ) : null}
    </div>
  );
}
