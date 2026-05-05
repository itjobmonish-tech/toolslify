"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getToolBySlug } from "@/lib/site-data";
import { downloadTextFile } from "@/lib/utils";
import { StudioResultView } from "@/components/tools/studio-result-view";
import { useToast } from "@/components/providers/toast-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Button } from "@/components/ui/button";
import {
  FileDropzone,
  InputField,
  InlineInfo,
  LoadingSurface,
  OutputSurface,
  PanelCard,
  StarterCard,
  StatusBanner,
  TextEditor,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";
import { requestFormTool, requestJsonTool } from "@/components/tools/tool-client-utils";

function getInitialState(tool) {
  return {
    input: tool?.settings?.starterInput || "",
    detail: "",
  };
}

export function StudioWorkspace({ slug, onContentReadyChange }) {
  const tool = getToolBySlug(slug);
  const { text } = usePreferences();
  const { showToast } = useToast();
  const reduceMotion = useReducedMotion();
  const [draft, setDraft] = usePersistentState(`toolslify:studio:${slug}:draft`, getInitialState(tool));
  const [file, setFile] = useState(null);
  const [fileTwo, setFileTwo] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const autoRunSignatureRef = useRef("");

  const inputMode = tool?.settings?.inputMode || "text";
  const canRun = useMemo(() => {
    if (inputMode === "compare" || inputMode === "merge") return Boolean(file && fileTwo);
    if (inputMode === "file" || inputMode === "image") return Boolean(file);
    return Boolean(draft.input.trim());
  }, [draft.input, file, fileTwo, inputMode]);

  const hasStarted = Boolean(result);
  const interior = tool?.interior || {};
  const themeStyle = createWorkspaceThemeVars(interior.theme);

  useSubmitShortcut({
    enabled: canRun && !isLoading,
    onSubmit: handleRun,
  });

  useEffect(() => {
    onContentReadyChange?.(hasStarted);
  }, [hasStarted, onContentReadyChange]);

  useEffect(() => {
    if (!tool || isLoading) return;
    if (!(inputMode === "file" || inputMode === "image")) return;
    if (tool.settings.detailLabel) return;
    if (!file) {
      autoRunSignatureRef.current = "";
      return;
    }

    const signature = `${file.name}:${file.size}:${file.lastModified}`;
    if (autoRunSignatureRef.current === signature) return;
    autoRunSignatureRef.current = signature;
    handleRun();
  }, [file, inputMode, isLoading, tool]);

  if (!tool) {
    return <StatusBanner tone="warning">This tool is not configured yet.</StatusBanner>;
  }

  async function handleRun() {
    if (!canRun) {
      setError("Add the required input first so the tool has something to process.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const nextResult =
        inputMode === "text"
          ? await requestJsonTool(slug, {
              input: draft.input,
              detail: draft.detail,
              format: tool.settings.outputFormat,
            })
          : await requestFormTool(slug, {
              file,
              fileTwo,
              input: draft.input,
              detail: draft.detail,
              format: tool.settings.outputFormat,
            });

      setResult(nextResult);

      showToast({
        title: `${tool.shortName} ready`,
        description: "Your processed result is ready on the same screen with copy and export actions.",
        tone: "success",
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
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
        description: "Use the download action if clipboard access is blocked.",
        tone: "warning",
      });
    }
  }

  function handleDownload() {
    if (!result?.download && !result?.output) return;

    downloadTextFile({
      content: result?.download?.content || result.output,
      filename: result?.download?.filename || `${slug}.txt`,
      mimeType: result?.download?.mimeType || "text/plain;charset=utf-8",
    });

    showToast({
      title: "Download started",
      description: `Saving ${(result?.download?.filename || `${slug}.txt`)} locally.`,
      tone: "success",
    });
  }

  function handleReset() {
    setDraft(getInitialState(tool));
    setFile(null);
    setFileTwo(null);
    setResult(null);
    setError("");
    autoRunSignatureRef.current = "";
  }

  const revealUp = reduceMotion
    ? { initial: { opacity: 1, y: 0 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.18 } }
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <div className="space-y-6" style={themeStyle}>
      {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}

      <motion.div
        id="tool-workspace"
        viewport={{ once: true, margin: "-80px" }}
        {...revealUp}
        className="workspace-grid scroll-mt-28"
      >
        <PanelCard
          eyebrow="Draft"
          title={tool.inputTitle}
          minimal
          className="workspace-input-pane"
        >
          <div className="space-y-5">
            {inputMode === "text" && tool.settings.starterInput ? (
              <StarterCard
                title={interior.starter?.title || "Start from a real example"}
                description={interior.starter?.description || "Load a structured sample brief, then tailor it before you generate the draft."}
                actionLabel={interior.starter?.actionLabel || "Use example"}
                onAction={() =>
                  setDraft((current) => ({
                    ...current,
                    input: tool.settings.starterInput,
                  }))
                }
              />
            ) : null}

            {renderPrimaryInput({ tool, draft, setDraft, file, setFile, fileTwo, setFileTwo })}

            {inputMode === "text" ? (
              <InlineInfo
                items={[
                  interior.inlineChips?.[0] || tool.badge,
                  draft.input.trim() ? interior.inlineChips?.[1] || "Editable source loaded" : "Same-screen draft flow",
                  interior.inlineChips?.[2] || text.noDataStored,
                ]}
              />
            ) : null}

            {tool.settings.detailLabel ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">{tool.settings.detailLabel}</p>
                <InputField
                  value={draft.detail}
                  onChange={(detail) => setDraft((current) => ({ ...current, detail }))}
                  placeholder={tool.settings.detailPlaceholder}
                />
              </div>
            ) : null}

            {showActionRow({ inputMode, tool }) ? (
              <div
                className="rounded-[18px] border p-4"
                style={{
                  borderColor: "color-mix(in srgb, var(--tool-edge) 38%, rgba(18,24,31,0.08))",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(248,250,253,0.995))",
                  boxShadow: "0 18px 32px -28px color-mix(in srgb, var(--tool-glow) 54%, rgba(15,23,42,0.14))",
                }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Button onClick={handleRun} disabled={!canRun || isLoading} size="lg" className="min-w-[220px]">
                    {isLoading ? "Processing..." : tool.ctaLabel}
                  </Button>
                  {(draft.input || file || fileTwo || result) ? (
                    <Button onClick={handleReset} variant="secondary" size="lg">
                      {text.clear}
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </PanelCard>

        <PanelCard
          eyebrow="Preview"
          title={tool.outputTitle}
          className="workspace-output-pane p-6 sm:p-7"
        >
          <div className="space-y-5">
            {isLoading ? (
              <LoadingSurface title={text.processing} />
            ) : result ? (
              <StudioResultView tool={tool} result={result} />
            ) : (
              <OutputSurface placeholder={tool.outputPlaceholder} />
            )}

            {result ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button onClick={handleCopy} size="lg">
                  {copyState === "done" ? text.copied : text.copy}
                </Button>
                <Button onClick={handleDownload} variant="secondary" size="lg">
                  {text.download}
                </Button>
              </div>
            ) : (
              <StatusBanner>
                {interior.pendingMessage || "Add the source on the left, run the tool once, and the reviewed result will stay here ready to copy or export."}
              </StatusBanner>
            )}
          </div>
        </PanelCard>
      </motion.div>
    </div>
  );
}

function createWorkspaceThemeVars(theme = {}) {
  return {
    "--tool-primary": theme.primary || "#4f67d8",
    "--tool-strong": theme.strong || "#223588",
    "--tool-soft": theme.soft || "rgba(79, 103, 216, 0.14)",
    "--tool-surface": theme.surface || "rgba(235, 240, 255, 0.96)",
    "--tool-edge": theme.edge || "rgba(79, 103, 216, 0.2)",
    "--tool-glow": theme.glow || "rgba(79, 103, 216, 0.18)",
    "--tool-ink": theme.ink || "#223588",
  };
}

function renderPrimaryInput({ tool, draft, setDraft, file, setFile, fileTwo, setFileTwo }) {
  const inputMode = tool.settings.inputMode;

  if (inputMode === "text") {
    return (
      <TextEditor
        value={draft.input}
        onChange={(input) => setDraft((current) => ({ ...current, input }))}
        placeholder={tool.inputPlaceholder}
        className="min-h-[320px]"
      />
    );
  }

  if (inputMode === "compare" || inputMode === "merge") {
    return (
      <div className="grid gap-5 xl:grid-cols-2">
        <FileDropzone
          title="Primary file"
          description="Choose the first file in the comparison or merge flow."
          accept={tool.settings.accept}
          file={file}
          onFileChange={setFile}
          accentLabel="File A"
          variant="hero"
        />
        <FileDropzone
          title="Secondary file"
        description="Choose the second file so the tool can review both together."
          accept={tool.settings.accept}
          file={fileTwo}
          onFileChange={setFileTwo}
          accentLabel="File B"
          variant="hero"
        />
      </div>
    );
  }

  if (inputMode === "file" || inputMode === "image") {
    return (
      <FileDropzone
        title={inputMode === "image" ? "Drop your image" : "Drop your file"}
        description={`Choose the ${inputMode === "image" ? "image" : "file"} once to start this tool.`}
        accept={tool.settings.accept}
        file={file}
        onFileChange={setFile}
        accentLabel={tool.shortName}
        variant="hero"
      />
    );
  }

  return (
    <TextEditor
      value={draft.input}
      onChange={(input) => setDraft((current) => ({ ...current, input }))}
      placeholder={tool.inputPlaceholder}
      className="mx-auto min-h-[280px] max-w-3xl text-[1rem]"
    />
  );
}

function showActionRow({ inputMode, tool }) {
  if (inputMode === "text") return true;
  if (inputMode === "compare" || inputMode === "merge") return true;
  return Boolean(tool.settings.detailLabel);
}
