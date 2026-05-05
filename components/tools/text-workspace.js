"use client";

import { useEffect, useMemo, useState } from "react";
import { analyzeText } from "@/lib/humanizer";
import { getToolBySlug } from "@/lib/site-data";
import {
  convertCase,
  createAiContentDetectorReport,
  createBulletReport,
  createEditorReport,
  createInvisibleCharacterReport,
  createKeywordDensityReport,
  createMorseCodeReport,
  createPlagiarismReport,
  createReadabilityReport,
  createSummaryReport,
  createWordCombinerReport,
  createWritingCheckReport,
  createReverseTextReport,
  createWordCounterReport,
  generateStyledText,
  normalizeInput,
  rewriteParagraph,
  shortenText,
  translateEnglishToEnglish,
} from "@/lib/text-tools";
import { downloadTextFile } from "@/lib/utils";
import { recordToolUsage } from "@/lib/tool-usage";
import { useToast } from "@/components/providers/toast-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Button } from "@/components/ui/button";
import {
  CollapsiblePanel,
  HistoryPanel,
  InlineInfo,
  InputField,
  MetaNotes,
  OutputSurface,
  PanelCard,
  SegmentedControl,
  StatusBanner,
  TextEditor,
  useHistoryStorage,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";

const CASE_OPTIONS = [
  { label: "Sentence", value: "sentence" },
  { label: "Lower", value: "lower" },
  { label: "Upper", value: "upper" },
  { label: "Title", value: "title" },
];

const SUMMARY_OPTIONS = [
  { label: "Short", value: "short" },
  { label: "Medium", value: "medium" },
  { label: "Detailed", value: "detailed" },
];

const TONE_OPTIONS = [
  { label: "Natural", value: "friendly" },
  { label: "Professional", value: "formal" },
  { label: "Simple", value: "casual" },
];

const STRENGTH_OPTIONS = [
  { label: "Light", value: "low" },
  { label: "Balanced", value: "medium" },
  { label: "Strong", value: "high" },
];

const SUMMARY_MODES = new Set(["summary-generator"]);
const REWRITE_MODES = new Set(["paragraph-rewriter", "paraphrase-tool", "sentence-rewriter"]);
const CHECKER_MODES = new Set(["writing-checker", "spell-checker", "punctuation-checker", "proofreader"]);
const STYLED_TEXT_MODES = new Set([
  "small-text-generator",
  "bold-text-generator",
  "small-caps-generator",
  "upside-down-text-generator",
]);
const NO_INPUT_REQUIRED_MODES = new Set(["invisible-character"]);

function getInitialState(mode) {
  return {
    input: "",
    option: mode === "case-converter" ? "sentence" : "medium",
    strength: "medium",
    focusKeyword: "",
  };
}

export function TextWorkspace({ slug, onContentReadyChange }) {
  const tool = getToolBySlug(slug);
  const { text } = usePreferences();
  const { showToast } = useToast();
  const [draft, setDraft] = usePersistentState(`toolslify:text:${slug}:draft`, getInitialState(tool?.mode));
  const { history, pushHistory } = useHistoryStorage(`toolslify:text:${slug}:history`);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("idle");

  const inputMetrics = useMemo(() => analyzeText(draft.input || ""), [draft.input]);

  useSubmitShortcut({
    enabled: Boolean(draft.input?.trim()) || NO_INPUT_REQUIRED_MODES.has(tool?.mode),
    onSubmit: handleRun,
  });

  if (!tool) {
    return <StatusBanner tone="warning">This text tool is not configured yet.</StatusBanner>;
  }

  const hasStarted = Boolean(result) || history.length > 0;
  const controlsVisible = Boolean(draft.input.trim()) || NO_INPUT_REQUIRED_MODES.has(tool.mode);

  useEffect(() => {
    onContentReadyChange?.(hasStarted);
  }, [hasStarted, onContentReadyChange]);

  function handleRun() {
    const cleaned = normalizeInput(draft.input);
    if (!cleaned && !NO_INPUT_REQUIRED_MODES.has(tool.mode)) {
      setError("Add some text first so the tool has something to work with.");
      return;
    }

    const nextResult = runTextTool(tool.mode, draft, cleaned, tool.slug);
    setResult(nextResult);
    setError("");
    pushHistory({
      label: tool.shortName,
      preview: nextResult.output || nextResult.report,
      payload: { draft, result: nextResult },
    });
    recordToolUsage(slug);
    showToast({
      title: `${tool.shortName} ready`,
      description: "Your result is updated below with copy and download actions.",
      tone: "success",
    });
  }

  async function handleCopy() {
    const payload = result?.copyText || result?.output || result?.report;
    if (!payload) return;

    try {
      await navigator.clipboard.writeText(payload);
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
    const payload = result?.copyText || result?.output || result?.report;
    if (!payload) return;

    downloadTextFile({
      content: payload,
      filename: `${slug}.txt`,
    });
    showToast({
      title: "Download started",
      description: `Saving ${slug}.txt locally.`,
      tone: "success",
    });
  }

  function handleReset() {
    setDraft(getInitialState(tool.mode));
    setResult(null);
    setError("");
  }

  function restoreHistory(item) {
    if (!item.payload) return;
    setDraft(item.payload.draft || getInitialState(tool.mode));
    setResult(item.payload.result || null);
    setError("");
  }

  return (
    <div className="space-y-6">
      {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}

      <div id="tool-workspace" className="workspace-grid scroll-mt-28">
        <PanelCard
          eyebrow="Editor"
          title={tool.inputTitle}
          minimal
          className="workspace-input-pane"
        >
          <div className="space-y-5">
            <TextEditor
              value={draft.input}
              onChange={(value) => setDraft((current) => ({ ...current, input: value }))}
              placeholder={tool.inputPlaceholder}
              className="min-h-[320px]"
            />

            <InlineInfo
              items={[
                `${inputMetrics.words} words`,
                `${inputMetrics.sentences} sentences`,
                text.noDataStored,
              ]}
            />

            {controlsVisible ? renderControls(tool.mode, draft, setDraft) : null}

            {controlsVisible ? (
              <>
                <div id="tool-action" className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button onClick={handleRun} size="lg" className="min-w-[220px]">
                    {tool.ctaLabel}
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
            <OutputSurface
              output={result?.output || result?.report}
              placeholder={tool.outputPlaceholder}
            />

            {result ? (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button onClick={handleCopy} size="lg">
                    {copyState === "done" ? text.copied : text.copy}
                  </Button>
                  <Button onClick={handleDownload} variant="secondary" size="lg">
                    {text.download}
                  </Button>
                  <Button onClick={handleReset} variant="secondary" size="lg">
                    {text.clear}
                  </Button>
                </div>

                {result.notes?.length ? <MetaNotes items={result.notes} /> : null}
              </>
            ) : (
              <StatusBanner>
                Paste your source, choose the option that fits, and keep the result on the same screen.
              </StatusBanner>
            )}
          </div>
        </PanelCard>
      </div>

      {hasStarted ? (
        <HistoryPanel
          title={`${tool.shortName} history`}
          history={history}
          onRestore={restoreHistory}
          emptyMessage="Recent runs stay here in this browser so you can reopen stronger versions quickly."
        />
      ) : null}
    </div>
  );
}

function renderControls(mode, draft, setDraft) {
  if (mode === "case-converter") {
    return (
      <SegmentedControl
        label="Case style"
        help="Switch between sentence, lower, upper, or title case."
        options={CASE_OPTIONS}
        value={draft.option}
        onChange={(option) => setDraft((current) => ({ ...current, option }))}
      />
    );
  }

  if (SUMMARY_MODES.has(mode) || mode === "bullet-point-generator") {
    return (
      <SegmentedControl
        label="Summary depth"
        help="Choose how short or detailed the result should be."
        options={SUMMARY_OPTIONS}
        value={draft.option}
        onChange={(option) => setDraft((current) => ({ ...current, option }))}
      />
    );
  }

  if (REWRITE_MODES.has(mode)) {
    return (
      <div className="space-y-4">
        <SegmentedControl
          label="Rewrite tone"
          help="Pick the tone that best matches the final use case."
          options={TONE_OPTIONS}
          value={draft.option}
          onChange={(option) => setDraft((current) => ({ ...current, option }))}
        />
        <SegmentedControl
          label="Rewrite strength"
          help="Use a lighter pass for gentle cleanup or a stronger pass for a bigger shift."
          options={STRENGTH_OPTIONS}
          value={draft.strength}
          onChange={(strength) => setDraft((current) => ({ ...current, strength }))}
        />
      </div>
    );
  }

  if (mode === "keyword-density-checker") {
    return (
      <CollapsiblePanel title="Optional focus keyword" description={draft.focusKeyword || "Add focus keyword"}>
        <InputField
          value={draft.focusKeyword}
          onChange={(focusKeyword) => setDraft((current) => ({ ...current, focusKeyword }))}
          placeholder="Enter the keyword you want to track more closely."
        />
      </CollapsiblePanel>
    );
  }

  return null;
}

function runTextTool(mode, draft, cleaned, slug) {
  if (mode === "word-counter") {
    const payload = createWordCounterReport(cleaned);
    return {
      output: payload.report,
      report: payload.report,
      copyText: payload.report,
      notes: [
        { label: "Words", value: String(payload.metrics.words) },
        { label: "Paragraphs", value: String(payload.paragraphs) },
        { label: "Read time", value: `${payload.metrics.readingMinutes} min` },
      ],
    };
  }

  if (mode === "case-converter") {
    const output = convertCase(cleaned, draft.option);
    const metrics = analyzeText(output);
    return {
      output,
      report: output,
      copyText: output,
      notes: [
        { label: "Mode", value: draft.option },
        { label: "Words", value: String(metrics.words) },
        { label: "Characters", value: String(metrics.characters) },
      ],
    };
  }

  if (mode === "upper-to-lowercase") {
    const output = convertCase(cleaned, "lower");
    const metrics = analyzeText(output);
    return {
      output,
      report: output,
      copyText: output,
      notes: [
        { label: "Mode", value: "lowercase" },
        { label: "Words", value: String(metrics.words) },
        { label: "Characters", value: String(metrics.characters) },
      ],
    };
  }

  if (REWRITE_MODES.has(mode)) {
    const output = rewriteParagraph(cleaned, draft.option || "friendly", draft.strength || "medium");
    const beforeMetrics = analyzeText(cleaned);
    const afterMetrics = analyzeText(output);
    return {
      output,
      report: output,
      copyText: output,
      notes: [
        { label: "Tone", value: draft.option || "friendly" },
        { label: "Strength", value: draft.strength || "medium" },
        { label: "Before / after words", value: `${beforeMetrics.words} / ${afterMetrics.words}` },
      ],
    };
  }

  if (SUMMARY_MODES.has(mode)) {
    const payload = createSummaryReport(cleaned, draft.option || "medium");
    return {
      output: payload.output,
      report: payload.report,
      copyText: payload.output,
      notes: [
        { label: "Level", value: draft.option || "medium" },
        { label: "Original words", value: String(payload.originalMetrics.words) },
        { label: "Summary words", value: String(payload.summaryMetrics.words) },
      ],
    };
  }

  if (mode === "bullet-point-generator") {
    const payload = createBulletReport(cleaned, draft.option || "medium");
    return {
      output: payload.output,
      report: payload.report,
      copyText: payload.output,
      notes: [
        { label: "Level", value: draft.option || "medium" },
        { label: "Bullets", value: String(payload.bulletLines.length) },
      ],
    };
  }

  if (mode === "sentence-shortener") {
    const output = shortenText(cleaned);
    const metrics = analyzeText(output);
    return {
      output,
      report: output,
      copyText: output,
      notes: [
        { label: "Words", value: String(metrics.words) },
        { label: "Sentences", value: String(metrics.sentences) },
      ],
    };
  }

  if (mode === "plagiarism-checker") {
    const payload = createPlagiarismReport(cleaned);
    return {
      output: payload.report,
      report: payload.report,
      copyText: payload.report,
      notes: [
        { label: "Score", value: `${payload.originalityScore}/100` },
        { label: "Repeated sentences", value: String(payload.duplicateSentences.length) },
        { label: "Phrase repeats", value: String(payload.repeatedPhrases.length) },
      ],
    };
  }

  if (CHECKER_MODES.has(mode) || mode === "spell-checker" || mode === "punctuation-checker" || mode === "proofreader") {
    const focus =
      mode === "spell-checker"
        ? "spell"
        : mode === "punctuation-checker"
          ? "punctuation"
          : "general";
    const payload = createWritingCheckReport(cleaned, focus);
    return {
      output: payload.report,
      report: payload.report,
      copyText: payload.report,
      notes: [
        { label: "Score", value: `${payload.score}/100` },
        { label: "Spelling flags", value: String(payload.spellingMatches.length) },
        { label: "Punctuation flags", value: String(payload.punctuationFlags.length) },
      ],
    };
  }

  if (mode === "ai-content-detector") {
    const payload = createAiContentDetectorReport(cleaned, slug === "chatgpt-detector" ? "chatgpt" : "ai");
    return {
      output: payload.report,
      report: payload.report,
      copyText: payload.report,
      notes: [
        { label: "Result", value: payload.label },
        { label: "Score", value: `${payload.riskScore}/100` },
        { label: "Unique-word ratio", value: String(payload.lexicalDiversity) },
      ],
    };
  }

  if (mode === "word-combiner") {
    const payload = createWordCombinerReport(cleaned);
    return {
      output: payload.output,
      report: payload.report,
      copyText: payload.output,
      notes: [
        { label: "Inputs", value: String(cleaned.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean).length) },
        { label: "Combinations", value: String(payload.combinations.length) },
      ],
    };
  }

  if (mode === "plain-english") {
    const output = translateEnglishToEnglish(cleaned);
    const beforeMetrics = analyzeText(cleaned);
    const afterMetrics = analyzeText(output);
    return {
      output,
      report: output,
      copyText: output,
      notes: [
        { label: "Before words", value: String(beforeMetrics.words) },
        { label: "After words", value: String(afterMetrics.words) },
        { label: "Tone", value: "Plain English" },
      ],
    };
  }

  if (mode === "online-editor") {
    const payload = createEditorReport(cleaned);
    return {
      output: payload.output,
      report: payload.report,
      copyText: payload.output,
      notes: [
        { label: "Words", value: String(payload.metrics.words) },
        { label: "Characters", value: String(payload.metrics.characters) },
        { label: "Read time", value: `${payload.metrics.readingMinutes} min` },
      ],
    };
  }

  if (mode === "reverse-text-generator") {
    const payload = createReverseTextReport(cleaned);
    return {
      output: payload.output,
      report: payload.report,
      copyText: payload.output,
      notes: [
        { label: "Characters", value: String(payload.characterReverse.length) },
        { label: "Words", value: String(payload.wordReverse.split(/\s+/).filter(Boolean).length) },
      ],
    };
  }

  if (STYLED_TEXT_MODES.has(mode)) {
    const style =
      mode === "bold-text-generator"
        ? "bold"
        : mode === "small-caps-generator"
          ? "small-caps"
          : mode === "upside-down-text-generator"
            ? "upside-down"
            : "small";
    const output = generateStyledText(cleaned, style);
    return {
      output,
      report: output,
      copyText: output,
      notes: [
        { label: "Style", value: style },
        { label: "Characters", value: String(output.length) },
      ],
    };
  }

  if (mode === "invisible-character") {
    const payload = createInvisibleCharacterReport();
    return {
      output: payload.output,
      report: payload.report,
      copyText: payload.copyText,
      notes: [
        { label: "Type", value: "Zero-width space" },
        { label: "Copy", value: "Use the copy button" },
      ],
    };
  }

  if (mode === "morse-code-translator") {
    const payload = createMorseCodeReport(cleaned);
    return {
      output: payload.output,
      report: payload.report,
      copyText: payload.output,
      notes: [
        { label: "Direction", value: payload.direction === "decode" ? "Morse to text" : "Text to Morse" },
        { label: "Length", value: String(payload.output.length) },
      ],
    };
  }

  if (mode === "keyword-density-checker") {
    const payload = createKeywordDensityReport(cleaned, draft.focusKeyword || "");
    return {
      output: payload.report,
      report: payload.report,
      copyText: payload.report,
      notes: [
        { label: "Total words", value: String(payload.metrics.words) },
        { label: "Focus density", value: payload.focus ? `${payload.focusDensity}%` : "Not set" },
        { label: "Top keyword", value: payload.density[0]?.keyword || "None" },
      ],
    };
  }

  if (mode === "readability-checker") {
    const payload = createReadabilityReport(cleaned);
    return {
      output: payload.report,
      report: payload.report,
      copyText: payload.report,
      notes: [
        { label: "Score", value: `${payload.metrics.readabilityScore}` },
        { label: "Label", value: payload.metrics.readabilityLabel },
        { label: "Avg sentence", value: `${payload.averageWordsPerSentence} words` },
      ],
    };
  }

  const payload = createReadabilityReport(cleaned);
  return {
    output: payload.report,
    report: payload.report,
    copyText: payload.report,
    notes: [
      { label: "Score", value: `${payload.metrics.readabilityScore}` },
      { label: "Label", value: payload.metrics.readabilityLabel },
      { label: "Avg sentence", value: `${payload.averageWordsPerSentence} words` },
    ],
  };
}
