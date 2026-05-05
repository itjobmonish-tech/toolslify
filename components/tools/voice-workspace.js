"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { analyzeText } from "@/lib/humanizer";
import { LANGUAGES } from "@/lib/i18n";
import { getToolBySlug } from "@/lib/site-data";
import { downloadTextFile } from "@/lib/utils";
import { recordToolUsage } from "@/lib/tool-usage";
import { useToast } from "@/components/providers/toast-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HistoryPanel,
  InlineInfo,
  OutputSurface,
  PanelCard,
  SegmentedControl,
  StatusBanner,
  TextEditor,
  useHistoryStorage,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";

const LANGUAGE_OPTIONS = LANGUAGES.map((item) => ({
  label: item.nativeName || item.name,
  value: item.code,
}));

function getInitialState() {
  return {
    transcript: "",
    language: "en",
    output: "",
  };
}

export function VoiceWorkspace({ slug, onContentReadyChange }) {
  const tool = getToolBySlug(slug);
  const { text, language } = usePreferences();
  const { showToast } = useToast();
  const [draft, setDraft] = usePersistentState(`toolslify:voice:${slug}:draft`, getInitialState());
  const { history, pushHistory } = useHistoryStorage(`toolslify:voice:${slug}:history`);
  const [copyState, setCopyState] = useState("idle");
  const [error, setError] = useState("");
  const [speechSupport, setSpeechSupport] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const inputMetrics = useMemo(() => analyzeText(draft.transcript || ""), [draft.transcript]);
  const outputMetrics = useMemo(() => analyzeText(draft.output || ""), [draft.output]);

  useSubmitShortcut({
    enabled: Boolean(draft.transcript.trim()),
    onSubmit: handleConvert,
  });

  useEffect(() => {
    setDraft((current) => {
      if (current.transcript || current.output || current.language === language) {
        return current;
      }

      return {
        ...current,
        language,
      };
    });
  }, [language, setDraft]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return undefined;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = mapLanguage(draft.language);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ");

      setDraft((current) => ({ ...current, transcript }));
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    setSpeechSupport(true);

    return () => {
      recognition.stop();
    };
  }, [draft.language, setDraft]);

  if (!tool) {
    return <StatusBanner tone="warning">This speech tool is not configured yet.</StatusBanner>;
  }

  const hasStarted = Boolean(draft.output) || history.length > 0;
  const controlsVisible = Boolean(draft.transcript.trim());

  useEffect(() => {
    onContentReadyChange?.(hasStarted);
  }, [hasStarted, onContentReadyChange]);

  function toggleRecording() {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    setError("");
    recognitionRef.current.lang = mapLanguage(draft.language);
    recognitionRef.current.start();
    setIsRecording(true);
    showToast({
      title: "Recording started",
      description: "Speak naturally and Toolslify will fill the transcript live.",
      tone: "success",
    });
  }

  function handleConvert() {
    if (!draft.transcript.trim()) {
      setError("Start recording or paste speech notes first.");
      return;
    }

    const output = polishTranscriptPreview(draft.transcript);
    setDraft((current) => ({ ...current, output }));
    setError("");
    pushHistory({
      label: tool.shortName,
      preview: output,
      payload: {
        ...draft,
        output,
      },
    });
    recordToolUsage(slug);
    showToast({
      title: `${tool.shortName} ready`,
      description: "Your transcript is updated below with copy and download actions.",
      tone: "success",
    });
  }

  async function handleCopy() {
    if (!draft.output) return;

    try {
      await navigator.clipboard.writeText(draft.output);
      setCopyState("done");
      setTimeout(() => setCopyState("idle"), 1500);
      showToast({
        title: "Copied transcript",
        description: "The transcript is ready to paste.",
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
      filename: `${slug}.txt`,
    });
    showToast({
      title: "Download started",
      description: `Saving ${slug}.txt locally.`,
      tone: "success",
    });
  }

  function restoreHistory(item) {
    if (!item.payload) return;
    setDraft(item.payload);
    setError("");
  }

  function resetDraft() {
    setDraft(getInitialState());
    setError("");
  }

  return (
    <div className="space-y-6">
      {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}

      <div id="tool-workspace" className="workspace-grid scroll-mt-28">
        <PanelCard
          eyebrow="Capture"
          title={tool.inputTitle}
          minimal
          className="workspace-input-pane"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
              <Badge tone={speechSupport ? "success" : "default"}>
                {isRecording ? "Recording" : speechSupport ? "Ready" : "Unavailable"}
              </Badge>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={toggleRecording} disabled={!speechSupport} variant="secondary">
                  {isRecording ? "Stop recording" : "Start recording"}
                </Button>
              </div>
            </div>

            <TextEditor
              value={draft.transcript}
              onChange={(transcript) => setDraft((current) => ({ ...current, transcript }))}
              placeholder="Record or paste speech notes here."
              className="min-h-[240px]"
            />

            {controlsVisible ? (
              <>
                <SegmentedControl
                  label="Recognition language"
                  help="Used for live microphone capture in supported browsers."
                  options={LANGUAGE_OPTIONS}
                  value={draft.language}
                  onChange={(language) => setDraft((current) => ({ ...current, language }))}
                />

                <InlineInfo
                  items={[
                    `${inputMetrics.words} words`,
                    draft.language.toUpperCase(),
                    text.noDataStored,
                  ]}
                />

                <div id="tool-action" className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button onClick={handleConvert} size="lg" className="min-w-[220px]">
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
            <OutputSurface output={draft.output} placeholder={tool.outputPlaceholder} />

            {draft.output ? (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button onClick={handleCopy} size="lg">
                    {copyState === "done" ? text.copied : text.copy}
                  </Button>
                  <Button onClick={handleDownload} variant="secondary" size="lg">
                    {text.download}
                  </Button>
                  <Button onClick={resetDraft} variant="secondary" size="lg">
                    {text.clear}
                  </Button>
                </div>

                <InlineInfo
                  items={[
                    `${outputMetrics.words} words`,
                    `${outputMetrics.sentences} sentences`,
                    "Ready to export",
                  ]}
                />
              </>
            ) : (
              <StatusBanner>
                Record a voice note or paste spoken text on the left, then keep the cleaned transcript on this same screen.
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
          emptyMessage="Transcript runs stay here in this browser so you can reopen them quickly."
        />
      ) : null}
    </div>
  );
}

function polishTranscriptPreview(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, char) => `${prefix}${char.toUpperCase()}`)
    .trim();
}

function mapLanguage(language) {
  if (language === "ar") return "ar-SA";
  if (language === "bn") return "bn-BD";
  if (language === "de") return "de-DE";
  if (language === "es") return "es-ES";
  if (language === "fr") return "fr-FR";
  if (language === "hi") return "hi-IN";
  if (language === "id") return "id-ID";
  if (language === "it") return "it-IT";
  if (language === "ja") return "ja-JP";
  if (language === "ko") return "ko-KR";
  if (language === "nl") return "nl-NL";
  if (language === "pl") return "pl-PL";
  if (language === "pt") return "pt-PT";
  if (language === "ru") return "ru-RU";
  if (language === "ta") return "ta-IN";
  if (language === "th") return "th-TH";
  if (language === "tr") return "tr-TR";
  if (language === "uk") return "uk-UA";
  if (language === "ur") return "ur-PK";
  if (language === "vi") return "vi-VN";
  if (language === "zh") return "zh-CN";
  return "en-US";
}
