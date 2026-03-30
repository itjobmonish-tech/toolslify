"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  TextEditor,
  useHistoryStorage,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";
import { requestFormTool, requestJsonTool } from "@/components/tools/tool-client-utils";

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "Hindi", value: "hi" },
];

const VOICE_EXAMPLE =
  "Need to clean up tomorrow's launch notes. Update the homepage CTA, double-check the AI Humanizer demo, and send the new PDF converter screenshots to the team before 4 PM. Also remind Marcus to review the pricing copy after lunch.";

export function VoiceWorkspace() {
  const { text } = usePreferences();
  const [draft, setDraft] = usePersistentState("toolslify:voice:draft", {
    transcript: "",
    language: "en",
    output: "",
  });
  const { history, pushHistory } = useHistoryStorage("toolslify:voice:history");
  const [audioFile, setAudioFile] = useState(null);
  const [responseMeta, setResponseMeta] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const [speechSupport, setSpeechSupport] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const outputMetrics = useMemo(() => analyzeText(draft.output), [draft.output]);

  useSubmitShortcut({
    enabled: Boolean(draft.transcript.trim() || audioFile) && !isLoading,
    onSubmit: handleConvert,
  });

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = draft.language === "hi" ? "hi-IN" : draft.language === "es" ? "es-ES" : "en-US";

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

  function toggleRecording() {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    setError("");
    setAudioFile(null);
    recognitionRef.current.lang = draft.language === "hi" ? "hi-IN" : draft.language === "es" ? "es-ES" : "en-US";
    recognitionRef.current.start();
    setIsRecording(true);
  }

  async function handleConvert() {
    if (!draft.transcript.trim() && !audioFile) return;

    setIsLoading(true);
    setError("");

    try {
      const result = audioFile
        ? await requestFormTool("voice-note-to-text", {
            file: audioFile,
            language: draft.language,
            transcript: draft.transcript,
          })
        : await requestJsonTool("voice-note-to-text", {
            transcript: draft.transcript,
            language: draft.language,
          });

      setDraft((current) => ({ ...current, output: result.output }));
      setResponseMeta(result.meta);
      pushHistory({
        label: audioFile ? audioFile.name : "Live transcript",
        preview: result.output || result.meta?.guidance || draft.transcript,
        payload: {
          transcript: draft.transcript,
          language: draft.language,
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
      filename: "toolslify-voice-transcript.txt",
    });
  }

  function restoreHistory(item) {
    if (!item.payload) return;
    setDraft(item.payload);
    setAudioFile(null);
  }

  function loadExample() {
    setError("");
    setResponseMeta(null);
    setAudioFile(null);
    setDraft({
      transcript: VOICE_EXAMPLE,
      language: "en",
      output: "",
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <MetricStrip
          items={[
            { label: "Input mode", value: audioFile ? "Upload" : isRecording ? "Recording" : "Voice note" },
            { label: "Language", value: draft.language.toUpperCase() },
            { label: "Output words", value: String(outputMetrics.words) },
            { label: "Speech API", value: speechSupport ? "Supported" : "Upload only" },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <PanelCard title="Step 1: Record or upload" description="Use live browser speech capture or upload an audio file for server processing.">
              <div className="space-y-5">
                <StarterCard
                  title="Use a sample voice memo"
                  description="Load a realistic spoken note so you can test cleanup, summary points, and export actions without recording first."
                  onAction={loadExample}
                />
                <SegmentedControl
                  label="Recognition language"
                  help="Used for live browser recording and for upload processing when a server key is configured."
                  options={languageOptions}
                  value={draft.language}
                  onChange={(language) => setDraft((current) => ({ ...current, language }))}
                />

                <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-[var(--foreground)]">Live browser recording</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                        Capture quick voice notes directly in supported browsers. Toolslify only keeps the text locally until you choose to convert it.
                      </p>
                    </div>
                    <Badge tone={speechSupport ? "success" : "default"}>
                      {speechSupport ? "Ready" : "Unavailable"}
                    </Badge>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <ActionButton onClick={toggleRecording} disabled={!speechSupport}>
                      {isRecording ? "Stop recording" : "Start recording"}
                    </ActionButton>
                    <Badge>{isRecording ? "Listening..." : "Microphone idle"}</Badge>
                  </div>
                </div>

                <FileDropzone
                  title="Audio upload"
                  description="Upload MP3, WAV, M4A, OGG, or WebM audio. Add OPENAI_API_KEY later to enable production transcription for uploaded files."
                  accept="audio/*"
                  file={audioFile}
                  onFileChange={setAudioFile}
                  accentLabel="API-ready"
                />
              </div>
            </PanelCard>

            <PanelCard title="Captured transcript" description="Edit the live transcript before sending it through the cleaner.">
              <TextEditor
                value={draft.transcript}
                onChange={(transcript) => setDraft((current) => ({ ...current, transcript }))}
                placeholder="Recorded or pasted transcript text will appear here."
                className="min-h-[260px]"
              />
            </PanelCard>
          </div>

          <div className="space-y-6">
            {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}
            {responseMeta?.guidance ? <StatusBanner tone="warning">{responseMeta.guidance}</StatusBanner> : null}
            {!speechSupport ? (
              <StatusBanner>
                This browser does not expose the SpeechRecognition API. Upload mode still works, and live capture can be used in compatible Chromium browsers.
              </StatusBanner>
            ) : null}

            <PanelCard title="Step 3: Transcript output" description="Clean the transcript, copy it, or download it for later editing.">
              {isLoading ? (
                <LoadingSurface title="Converting voice note..." />
              ) : (
                <OutputSurface
                  output={draft.output}
                  placeholder="Your cleaned transcript will appear here after you convert the voice note."
                />
              )}
            </PanelCard>

            <div className="grid gap-4 md:grid-cols-2">
              <PanelCard title="Quality note">
                <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                  {responseMeta?.qualityNote || "Transcript cleanup and source details will appear here after conversion."}
                </p>
              </PanelCard>
              <PanelCard title="Source">
                <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                  {responseMeta?.source || "Live recording or upload"}
                </p>
              </PanelCard>
            </div>
          </div>
        </div>

        <ActionRow
          meta={[
            <Badge key="source">{audioFile ? audioFile.name : "Live transcript"}</Badge>,
            <Badge key="privacy" tone="accent">
              {text.noDataStored}
            </Badge>,
          ]}
        >
          <ActionButton onClick={handleConvert} disabled={isLoading || (!draft.transcript.trim() && !audioFile)}>
            {isLoading ? "Converting..." : "Step 2: Convert audio"}
          </ActionButton>
          <ActionButton onClick={handleCopy} disabled={!draft.output}>
            {copyState === "done" ? text.copied : text.copy}
          </ActionButton>
          <ActionButton onClick={handleDownload} disabled={!draft.output}>
            {text.download}
          </ActionButton>
          <ActionButton
            onClick={() => {
              setDraft({ transcript: "", language: "en", output: "" });
              setAudioFile(null);
            }}
            disabled={!draft.transcript && !audioFile && !draft.output}
          >
            {text.clear}
          </ActionButton>
        </ActionRow>
      </div>

      <div className="space-y-6">
        <PanelCard title="Summary points" description="Useful follow-up reminders after you transcribe a voice note.">
          <MetaNotes
            items={(responseMeta?.summaryPoints || ["Convert a voice note to see quick summary points."]).map((item, index) => ({
              label: `Point ${index + 1}`,
              value: item,
            }))}
          />
        </PanelCard>

        <HistoryPanel
          title={text.history}
          history={history}
          onRestore={restoreHistory}
          emptyMessage="Voice note transcripts will stay here so you can reopen a previous recording result."
        />
      </div>
    </div>
  );
}
