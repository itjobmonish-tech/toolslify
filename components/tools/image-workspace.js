"use client";

import { useEffect, useState } from "react";
import { applyPalette, GIFEncoder, quantize } from "gifenc";
import JSZip from "jszip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useToast } from "@/components/providers/toast-provider";
import { requestBlobEndpoint, requestJsonEndpoint } from "@/components/tools/tool-client-utils";
import {
  FileDropzone,
  InlineInfo,
  InputField,
  LoadingSurface,
  MetaNotes,
  OutputSurface,
  PanelCard,
  RangeField,
  SegmentedControl,
  StatusBanner,
  TextEditor,
  usePersistentState,
  useSubmitShortcut,
} from "@/components/tools/workspace-primitives";
import { LANGUAGES } from "@/lib/i18n";
import { getToolBySlug } from "@/lib/site-data";
import { recordToolUsage } from "@/lib/tool-usage";
import { clamp, downloadBlobFile, downloadTextFile, formatFileSize } from "@/lib/utils";

const RATIO_OPTIONS = [
  { label: "Free", value: "free" },
  { label: "Square", value: "square" },
  { label: "Portrait", value: "portrait" },
  { label: "Landscape", value: "landscape" },
];

const FACE_SCALE_OPTIONS = [
  { label: "Narrow", value: "narrow" },
  { label: "Balanced", value: "balanced" },
  { label: "Wide", value: "wide" },
];

const FACE_LENGTH_OPTIONS = [
  { label: "Short", value: "short" },
  { label: "Balanced", value: "balanced" },
  { label: "Long", value: "long" },
];

const CHIN_OPTIONS = [
  { label: "Rounded", value: "rounded" },
  { label: "Pointed", value: "pointed" },
  { label: "Square", value: "square" },
];

const OCR_TARGET_OPTIONS = LANGUAGES.map((item) => ({
  label: item.nativeName || item.name,
  value: item.code,
}));

const EMOJI_LIBRARY = [
  { char: "😀", label: "grinning smile happy", category: "faces" },
  { char: "😂", label: "laugh tears funny", category: "faces" },
  { char: "😍", label: "heart eyes love", category: "faces" },
  { char: "🤔", label: "thinking idea hmm", category: "faces" },
  { char: "🥳", label: "party celebrate yay", category: "faces" },
  { char: "😎", label: "cool sunglasses", category: "faces" },
  { char: "🔥", label: "fire hot trending", category: "symbols" },
  { char: "✨", label: "sparkles shine wow", category: "symbols" },
  { char: "💜", label: "violet purple heart", category: "symbols" },
  { char: "❤️", label: "red heart love", category: "symbols" },
  { char: "💙", label: "blue heart", category: "symbols" },
  { char: "💚", label: "green heart", category: "symbols" },
  { char: "🚀", label: "rocket launch growth", category: "objects" },
  { char: "🎉", label: "party popper celebration", category: "objects" },
  { char: "📈", label: "chart growth seo", category: "objects" },
  { char: "🧠", label: "brain smart ai", category: "objects" },
  { char: "💡", label: "idea lightbulb", category: "objects" },
  { char: "📌", label: "pin marker", category: "objects" },
  { char: "🎯", label: "target focus", category: "objects" },
  { char: "🛠️", label: "tools work builder", category: "objects" },
  { char: "🌐", label: "globe web world", category: "nature" },
  { char: "🌈", label: "rainbow color", category: "nature" },
  { char: "🌟", label: "star feature highlight", category: "nature" },
  { char: "🍀", label: "clover luck green", category: "nature" },
  { char: "📷", label: "camera image photo", category: "media" },
  { char: "🖼️", label: "frame image picture", category: "media" },
  { char: "🎬", label: "video movie clip", category: "media" },
  { char: "🎞️", label: "film gif motion", category: "media" },
  { char: "🔍", label: "search find zoom", category: "tools" },
  { char: "🧩", label: "piece puzzle fit", category: "tools" },
  { char: "✅", label: "check success done", category: "symbols" },
  { char: "⚡", label: "lightning fast", category: "symbols" },
  { char: "🪄", label: "magic wand design", category: "objects" },
  { char: "📣", label: "announcement launch", category: "objects" },
  { char: "👔", label: "business suit card", category: "people" },
  { char: "💼", label: "briefcase business", category: "objects" },
  { char: "📅", label: "calendar date invitation", category: "objects" },
  { char: "📍", label: "location place map", category: "objects" },
  { char: "😅", label: "awkward smile meme", category: "faces" },
  { char: "😭", label: "crying meme sad", category: "faces" },
];

const NORMALIZED_BLOB_CACHE = new WeakMap();
const DECODED_IMAGE_CACHE = new WeakMap();

function getInitialState(tool, language = "en") {
  return {
    searchUrl: "",
    red: 124,
    green: 58,
    blue: 237,
    mbValue: 1,
    emojiQuery: "",
    quality: 82,
    maxWidth: 1600,
    targetKb: tool?.settings?.targetBytes ? Math.round(tool.settings.targetBytes / 1024) : 200,
    cropRatio: "square",
    backgroundColor: "#12142a",
    traceColors: 12,
    fps: 8,
    maxSeconds: 4,
    gifWidth: 540,
    title: tool?.settings?.template === "business-card" ? "Toolslify Studio" : "You're Invited",
    subtitle: tool?.settings?.template === "business-card" ? "Founder & Creative Operator" : "A violet evening of design, music, and good people.",
    brand: "Toolslify",
    details: "Friday, 7:30 PM • Studio Hall • RSVP today",
    topText: "WHEN THE EXPORT",
    bottomText: "ACTUALLY WORKS",
    name: "Monis Ahmed",
    role: "Product Builder",
    email: "hello@toolslify.com",
    phone: "+91 98765 43210",
    website: "toolslify.com",
    faceLength: "balanced",
    foreheadWidth: "balanced",
    cheekboneWidth: "wide",
    jawWidth: "balanced",
    chinShape: "rounded",
    ocrTargetLanguage: language,
  };
}

export function ImageWorkspace({ slug, onContentReadyChange }) {
  const tool = getToolBySlug(slug);
  const { text, language } = usePreferences();
  const { showToast } = useToast();
  const [draft, setDraft] = usePersistentState(`toolslify:image:${slug}:draft`, getInitialState(tool, language));
  const [sourceFile, setSourceFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState("");

  useEffect(() => {
    if (!sourceFile) {
      setSourcePreviewUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(sourceFile);
    setSourcePreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [sourceFile]);

  useSubmitShortcut({
    enabled: canRunTool(tool, draft, sourceFile) && !isLoading,
    onSubmit: handleRun,
  });

  useEffect(() => {
    setDraft((current) => {
      if ((sourceFile || result) && current.ocrTargetLanguage) {
        return current;
      }

      if (current.ocrTargetLanguage === language) {
        return current;
      }

      return {
        ...current,
        ocrTargetLanguage: language,
      };
    });
  }, [language, result, setDraft, sourceFile]);

  useEffect(() => {
    return () => {
      if (result?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(result.previewUrl);
      }
    };
  }, [result?.previewUrl]);

  if (!tool) {
    return <StatusBanner tone="warning">This image tool is not configured yet.</StatusBanner>;
  }

  const uploadFirst = isUploadFirstTool(tool);
  const controlsUnlocked = !uploadFirst || Boolean(sourceFile);
  const hasStarted = isLoading || Boolean(result);
  const seoReady = Boolean(result);

  useEffect(() => {
    onContentReadyChange?.(seoReady);
  }, [onContentReadyChange, seoReady]);

  async function handleRun() {
    setIsLoading(true);
    setError("");

    try {
      await waitForNextPaint();
      const nextResult = await runImageTool({ tool, draft, file: sourceFile });

      setResult((current) => {
        if (current?.previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(current.previewUrl);
        }
        return nextResult;
      });
      recordToolUsage(slug);
      showToast({
        title: `${tool.shortName} ready`,
        description: "The processed result is ready below.",
        tone: "success",
      });
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Unable to process that image right now.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    const payload = result?.copyText;
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
        description: "Use download if clipboard access is blocked.",
        tone: "warning",
      });
    }
  }

  function handleDownload() {
    if (!result) return;

    if (result.download?.blob) {
      downloadBlobFile(result.download.blob, result.download.filename);
      showToast({
        title: "Download started",
        description: `Saving ${result.download.filename} locally.`,
        tone: "success",
      });
      return;
    }

    if (result.copyText) {
      downloadTextFile({
        content: result.copyText,
        filename: `${slug}.txt`,
      });
    }
  }

  async function handleEmojiCopy(emoji) {
    try {
      await navigator.clipboard.writeText(emoji);
      showToast({
        title: "Emoji copied",
        description: `${emoji} is ready to paste.`,
        tone: "success",
      });
    } catch {
      showToast({
        title: "Copy failed",
        description: "Clipboard access is blocked in this browser.",
        tone: "warning",
      });
    }
  }

  function handleReset() {
    setSourceFile(null);
    setResult((current) => {
      if (current?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(current.previewUrl);
      }
      return null;
    });
    setDraft(getInitialState(tool));
    setError("");
  }

  return (
    <div className="space-y-6">
      {error ? <StatusBanner tone="warning">{error}</StatusBanner> : null}

      <div id="tool-workspace" className="workspace-grid scroll-mt-28">
        <PanelCard
          eyebrow="Inputs"
          title={tool.inputTitle}
          minimal
          className="workspace-input-pane"
        >
          <div className="space-y-5">
            {renderInputControls({ tool, draft, setDraft, sourceFile, setSourceFile })}

            {controlsUnlocked ? (
              <>
                <InlineInfo
                  items={[
                    tool.shortName,
                    sourceFile
                      ? formatFileSize(sourceFile.size)
                      : tool.settings?.task === "creative-maker" && tool.settings?.template !== "meme"
                        ? "Template mode"
                        : "Ready",
                    tool.settings?.task === "search" ? "Public URL only" : text.noDataStored,
                  ]}
                />

                <div id="tool-action" className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Button onClick={handleRun} disabled={!canRunTool(tool, draft, sourceFile) || isLoading} size="lg" className="min-w-[220px]">
                    {isLoading ? "Processing..." : tool.ctaLabel}
                  </Button>
                  {(sourceFile || result || !uploadFirst) ? (
                    <Button onClick={handleReset} variant="secondary" size="lg">
                      {text.clear}
                    </Button>
                  ) : null}
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{text.result}</h2>
              <Badge>{sourceFile ? text.readyToProcess : result ? text.result : text.waitingForFile}</Badge>
            </div>

            {isLoading ? (
              <LoadingSurface title={text.processing} />
            ) : (
              renderResultContent({
                result,
                sourcePreviewUrl,
                sourceFileType: sourceFile?.type || "",
                onEmojiCopy: handleEmojiCopy,
                placeholder: tool.outputPlaceholder,
              })
            )}

            {result ? (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {result.copyText ? (
                    <Button onClick={handleCopy} size="lg">
                      {copyState === "done" ? text.copied : text.copy}
                    </Button>
                  ) : null}
                  {result.download ? (
                    <Button onClick={handleDownload} variant="secondary" size="lg">
                      {text.download}
                    </Button>
                  ) : null}
                </div>
                {result.notes?.length ? <MetaNotes items={result.notes} /> : null}
              </>
            ) : (
              <StatusBanner>
                Upload the source, run the tool once, and keep the preview and export on this same screen.
              </StatusBanner>
            )}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}

function renderInputControls({ tool, draft, setDraft, sourceFile, setSourceFile }) {
  const task = tool.settings?.task;

  if (task === "search") {
    return (
      <InputField
        value={draft.searchUrl}
        onChange={(searchUrl) => setDraft((current) => ({ ...current, searchUrl }))}
        placeholder={tool.inputPlaceholder}
      />
    );
  }

  if (task === "color-converter") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <InputField
          type="number"
          value={String(draft.red)}
          onChange={(red) => setDraft((current) => ({ ...current, red: sanitizeChannel(red) }))}
          placeholder="Red"
        />
        <InputField
          type="number"
          value={String(draft.green)}
          onChange={(green) => setDraft((current) => ({ ...current, green: sanitizeChannel(green) }))}
          placeholder="Green"
        />
        <InputField
          type="number"
          value={String(draft.blue)}
          onChange={(blue) => setDraft((current) => ({ ...current, blue: sanitizeChannel(blue) }))}
          placeholder="Blue"
        />
      </div>
    );
  }

  if (task === "unit-converter") {
    return (
      <InputField
        type="number"
        value={String(draft.mbValue)}
        onChange={(mbValue) => setDraft((current) => ({ ...current, mbValue: sanitizeDecimal(mbValue, 1) }))}
        placeholder="Enter MB value"
      />
    );
  }

  if (task === "emoji-browser") {
    return (
      <InputField
        value={draft.emojiQuery}
        onChange={(emojiQuery) => setDraft((current) => ({ ...current, emojiQuery }))}
        placeholder={tool.inputPlaceholder}
      />
    );
  }

  if (task === "face-shape") {
    return (
      <div className="space-y-4">
        <SegmentedControl
          label="Face length"
          options={FACE_LENGTH_OPTIONS}
          value={draft.faceLength}
          onChange={(faceLength) => setDraft((current) => ({ ...current, faceLength }))}
        />
        <SegmentedControl
          label="Forehead width"
          options={FACE_SCALE_OPTIONS}
          value={draft.foreheadWidth}
          onChange={(foreheadWidth) => setDraft((current) => ({ ...current, foreheadWidth }))}
        />
        <SegmentedControl
          label="Cheekbone width"
          options={FACE_SCALE_OPTIONS}
          value={draft.cheekboneWidth}
          onChange={(cheekboneWidth) => setDraft((current) => ({ ...current, cheekboneWidth }))}
        />
        <SegmentedControl
          label="Jaw width"
          options={FACE_SCALE_OPTIONS}
          value={draft.jawWidth}
          onChange={(jawWidth) => setDraft((current) => ({ ...current, jawWidth }))}
        />
        <SegmentedControl
          label="Chin shape"
          options={CHIN_OPTIONS}
          value={draft.chinShape}
          onChange={(chinShape) => setDraft((current) => ({ ...current, chinShape }))}
        />
      </div>
    );
  }

  if (task === "ocr" || task === "ocr-word" || task === "ocr-translate") {
    return (
      <div className="space-y-4">
        <FileDropzone
          title="Drop your image"
          description="Clear JPG and PNG files with readable text work best."
          accept="image/png,image/jpeg,image/jpg,image/bmp,image/gif,image/tiff"
          file={sourceFile}
          onFileChange={setSourceFile}
          accentLabel={tool.shortName}
        />
        {sourceFile ? (
          task === "ocr-translate" ? (
            <SegmentedControl
              label="Translate into"
              options={OCR_TARGET_OPTIONS}
              value={draft.ocrTargetLanguage}
              onChange={(ocrTargetLanguage) => setDraft((current) => ({ ...current, ocrTargetLanguage }))}
            />
          ) : null
        ) : null}
      </div>
    );
  }

  if (task === "creative-maker") {
    if (tool.settings?.template === "meme") {
      return (
        <div className="space-y-4">
          <FileDropzone
            title="Drop your meme image"
            description="Choose the image once, then add the headline text above and below."
            accept="image/*,.heic,.avif,.webp"
            file={sourceFile}
            onFileChange={setSourceFile}
            accentLabel={tool.shortName}
          />
          {sourceFile ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                value={draft.topText}
                onChange={(topText) => setDraft((current) => ({ ...current, topText }))}
                placeholder="Top text"
              />
              <InputField
                value={draft.bottomText}
                onChange={(bottomText) => setDraft((current) => ({ ...current, bottomText }))}
                placeholder="Bottom text"
              />
            </div>
          ) : null}
        </div>
      );
    }

    if (tool.settings?.template === "text-poster") {
      return (
        <div className="space-y-4">
          <InputField value={draft.title} onChange={(title) => setDraft((current) => ({ ...current, title }))} placeholder="Main text" />
          <TextEditor
            value={draft.subtitle}
            onChange={(subtitle) => setDraft((current) => ({ ...current, subtitle }))}
            placeholder="Short supporting line"
            className="min-h-[140px]"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField value={draft.brand} onChange={(brand) => setDraft((current) => ({ ...current, brand }))} placeholder="Footer label" />
            <InputField value={draft.backgroundColor} onChange={(backgroundColor) => setDraft((current) => ({ ...current, backgroundColor }))} placeholder="#12142a" />
          </div>
        </div>
      );
    }

    if (tool.settings?.template === "business-card") {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField value={draft.name} onChange={(name) => setDraft((current) => ({ ...current, name }))} placeholder="Full name" />
            <InputField value={draft.role} onChange={(role) => setDraft((current) => ({ ...current, role }))} placeholder="Role" />
            <InputField value={draft.email} onChange={(email) => setDraft((current) => ({ ...current, email }))} placeholder="Email" />
            <InputField value={draft.phone} onChange={(phone) => setDraft((current) => ({ ...current, phone }))} placeholder="Phone" />
            <InputField value={draft.website} onChange={(website) => setDraft((current) => ({ ...current, website }))} placeholder="Website" />
            <InputField value={draft.brand} onChange={(brand) => setDraft((current) => ({ ...current, brand }))} placeholder="Brand" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField value={draft.backgroundColor} onChange={(backgroundColor) => setDraft((current) => ({ ...current, backgroundColor }))} placeholder="#12142a" />
            <InputField value={draft.subtitle} onChange={(subtitle) => setDraft((current) => ({ ...current, subtitle }))} placeholder="Tagline" />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <InputField value={draft.title} onChange={(title) => setDraft((current) => ({ ...current, title }))} placeholder="Main title" />
        <TextEditor
          value={draft.subtitle}
          onChange={(subtitle) => setDraft((current) => ({ ...current, subtitle }))}
          placeholder="Short supporting invitation line"
          className="min-h-[140px]"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField value={draft.details} onChange={(details) => setDraft((current) => ({ ...current, details }))} placeholder="Date, time, venue" />
          <InputField value={draft.brand} onChange={(brand) => setDraft((current) => ({ ...current, brand }))} placeholder="Host or brand" />
        </div>
      </div>
    );
  }

  if (task === "video-to-gif") {
    return (
      <div className="space-y-4">
        <FileDropzone
          title="Drop your video"
          description="Short MP4 and WebM clips work best for fast GIF output."
          accept="video/mp4,video/webm,video/quicktime"
          file={sourceFile}
          onFileChange={setSourceFile}
          accentLabel={tool.shortName}
        />
        {sourceFile ? (
          <>
            <RangeField
              label="Frames per second"
              help="Lower FPS makes a lighter GIF. Higher FPS feels smoother."
              value={draft.fps}
              min={4}
              max={12}
              onChange={(fps) => setDraft((current) => ({ ...current, fps }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                type="number"
                value={String(draft.gifWidth)}
                onChange={(gifWidth) => setDraft((current) => ({ ...current, gifWidth: sanitizeDimension(gifWidth, 540) }))}
                placeholder="GIF width"
              />
              <InputField
                type="number"
                value={String(draft.maxSeconds)}
                onChange={(maxSeconds) => setDraft((current) => ({ ...current, maxSeconds: sanitizeDecimal(maxSeconds, 4) }))}
                placeholder="Max seconds"
              />
            </div>
          </>
        ) : null}
      </div>
    );
  }

  const accept = getAcceptForTool(tool);

  return (
    <div className="space-y-4">
      <FileDropzone
        title="Drop your source file"
        description="Choose the file once and keep the preview plus export on the same page."
        accept={accept}
        file={sourceFile}
        onFileChange={setSourceFile}
        accentLabel={tool.shortName}
      />

      {sourceFile ? (
        <>
          {task === "compress" || task === "target-size" || task === "custom-target-size" || task === "convert" ? (
            <RangeField
              label="Output quality"
              help="Lower quality reduces file size more aggressively."
              value={draft.quality}
              min={35}
              max={95}
              onChange={(quality) => setDraft((current) => ({ ...current, quality }))}
            />
          ) : null}

          {task === "crop" ? (
            <SegmentedControl
              label="Crop ratio"
              options={RATIO_OPTIONS}
              value={draft.cropRatio}
              onChange={(cropRatio) => setDraft((current) => ({ ...current, cropRatio }))}
            />
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            {(task === "target-size" || task === "custom-target-size" || task === "compress" || task === "convert" || task === "svg-to-png") ? (
              <InputField
                type="number"
                value={String(draft.maxWidth)}
                onChange={(maxWidth) => setDraft((current) => ({ ...current, maxWidth: sanitizeDimension(maxWidth, 1600) }))}
                placeholder="Max width in pixels"
              />
            ) : null}

            {task === "custom-target-size" ? (
              <InputField
                type="number"
                value={String(draft.targetKb)}
                onChange={(targetKb) => setDraft((current) => ({ ...current, targetKb: sanitizeDecimal(targetKb, 200) }))}
                placeholder="Target size in KB"
              />
            ) : null}

            {(task === "convert" && tool.settings?.outputFormat === "image/jpeg") || task === "heic-convert" ? (
              <InputField
                value={draft.backgroundColor}
                onChange={(backgroundColor) => setDraft((current) => ({ ...current, backgroundColor }))}
                placeholder="#12142a"
              />
            ) : null}

            {task === "trace-svg" || task === "svg-converter" ? (
              <InputField
                type="number"
                value={String(draft.traceColors)}
                onChange={(traceColors) => setDraft((current) => ({ ...current, traceColors: sanitizeDimension(traceColors, 12) }))}
                placeholder="Trace colors"
              />
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}

function renderResultContent({ result, sourcePreviewUrl, sourceFileType, onEmojiCopy, placeholder }) {
  if (!result) {
    return <OutputSurface placeholder={placeholder} />;
  }

  if (result.kind === "links") {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {result.links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-4 text-sm text-[var(--foreground)] transition hover:border-[var(--primary-edge)]"
            >
              <p className="font-semibold">{item.label}</p>
              <p className="mt-2 text-[13px] leading-6 text-[var(--muted-foreground)]">{item.body}</p>
            </a>
          ))}
        </div>
        <OutputSurface output={result.copyText} placeholder="" />
      </div>
    );
  }

  if (result.kind === "emoji") {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {result.emojis.map((item) => (
            <button
              key={`${item.char}-${item.label}`}
              type="button"
              onClick={() => onEmojiCopy(item.char)}
              className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-4 text-left transition hover:border-[var(--primary-edge)]"
            >
              <div className="text-3xl">{item.char}</div>
              <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">{item.category}</p>
              <p className="mt-1 text-[13px] leading-6 text-[var(--muted-foreground)]">{item.label}</p>
            </button>
          ))}
        </div>
        <OutputSurface output={result.copyText} placeholder="" />
      </div>
    );
  }

  if (result.previewUrl) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          {sourcePreviewUrl ? (
            <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Source</p>
              {sourceFileType.startsWith("video/") ? (
                <video src={sourcePreviewUrl} className="mt-4 w-full rounded-[14px]" controls muted playsInline />
              ) : (
                <img src={sourcePreviewUrl} alt="Source preview" className="mt-4 w-full rounded-[14px] object-contain" />
              )}
            </div>
          ) : null}
          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Output</p>
            {result.previewType === "image/gif" ? (
              <img src={result.previewUrl} alt="Output preview" className="mt-4 w-full rounded-[14px] object-contain" />
            ) : result.previewType?.startsWith("image/") || result.previewType === "image/svg+xml" ? (
              <img src={result.previewUrl} alt="Output preview" className="mt-4 w-full rounded-[14px] object-contain" />
            ) : (
              <OutputSurface output={result.copyText || ""} placeholder="" />
            )}
          </div>
        </div>
        {result.copyText ? <OutputSurface output={result.copyText} placeholder="" /> : null}
      </div>
    );
  }

  return <OutputSurface output={result.copyText || result.outputText} placeholder={placeholder} />;
}

function canRunTool(tool, draft, file) {
  if (!tool) return false;
  const task = tool.settings?.task;

  if (task === "search") return Boolean(draft.searchUrl.trim());
  if (task === "emoji-browser") return true;
  if (task === "color-converter") return true;
  if (task === "unit-converter") return true;
  if (task === "face-shape") return true;
  if (task === "creative-maker" && tool.settings?.template !== "meme") return true;
  return Boolean(file);
}

function isUploadFirstTool(tool) {
  const task = tool?.settings?.task;
  if (!tool) return false;
  if (task === "search" || task === "emoji-browser" || task === "color-converter" || task === "unit-converter" || task === "face-shape") {
    return false;
  }
  if (task === "creative-maker" && tool.settings?.template !== "meme") {
    return false;
  }
  return true;
}

function getUploadUnlockMessage(tool) {
  const task = tool?.settings?.task;

  if (task === "crop") {
    return "Upload the source image first and the crop ratio options will unlock below it.";
  }

  if (task === "video-to-gif") {
    return "Upload a video first and the GIF timing controls will unlock below it.";
  }

  if (task === "compress" || task === "target-size" || task === "custom-target-size") {
    return "Upload an image first and the quality plus sizing controls will unlock below the drop zone.";
  }

  return "Upload the source file first and the editing settings will unlock below the drop zone.";
}

async function runImageTool({ tool, draft, file }) {
  const task = tool.settings?.task;

  if (task === "search") {
    const sourceUrl = draft.searchUrl.trim();
    const links = getSearchLinks(sourceUrl, tool.settings?.searchType);
    return {
      kind: "links",
      copyText: links.map((item) => `${item.label}: ${item.href}`).join("\n"),
      links,
      notes: [
        { label: "Mode", value: tool.settings?.searchType === "face" ? "Face-focused lookup" : "Reverse lookup" },
        { label: "Providers", value: String(links.length) },
      ],
    };
  }

  if (task === "color-converter") {
    const red = clamp(Number(draft.red) || 0, 0, 255);
    const green = clamp(Number(draft.green) || 0, 0, 255);
    const blue = clamp(Number(draft.blue) || 0, 0, 255);
    const hex = rgbToHex(red, green, blue);

    return {
      kind: "text",
      copyText: `${hex}\nRGB(${red}, ${green}, ${blue})`,
      outputText: hex,
      notes: [
        { label: "Hex", value: hex },
        { label: "RGB", value: `${red}, ${green}, ${blue}` },
      ],
    };
  }

  if (task === "unit-converter") {
    const mbValue = Number(draft.mbValue) || 0;
    const kbValue = mbValue * 1024;
    return {
      kind: "text",
      copyText: `${mbValue} MB = ${kbValue.toFixed(2)} KB`,
      outputText: `${mbValue} MB = ${kbValue.toFixed(2)} KB`,
      notes: [
        { label: "MB", value: `${mbValue}` },
        { label: "KB", value: `${kbValue.toFixed(2)}` },
      ],
    };
  }

  if (task === "emoji-browser") {
    const query = draft.emojiQuery.trim().toLowerCase();
    const emojis = EMOJI_LIBRARY.filter((item) => !query || item.label.includes(query)).slice(0, 24);
    return {
      kind: "emoji",
      emojis,
      copyText: emojis.map((item) => item.char).join(" "),
      notes: [
        { label: "Matches", value: String(emojis.length) },
        { label: "Query", value: query || "All emojis" },
      ],
    };
  }

  if (task === "face-shape") {
    const faceShape = detectFaceShape(draft);
    return {
      kind: "text",
      copyText: `${faceShape.shape}\n\n${faceShape.summary}\n\nSuggestions:\n- ${faceShape.tips.join("\n- ")}`,
      outputText: faceShape.summary,
      notes: [
        { label: "Estimated shape", value: faceShape.shape },
        { label: "Forehead", value: draft.foreheadWidth },
        { label: "Jaw", value: draft.jawWidth },
      ],
    };
  }

  if (task === "ocr" || task === "ocr-word" || task === "ocr-translate") {
    const payload = await requestImageOcr({
      file,
      mode: task === "ocr-word" ? "word" : task === "ocr-translate" ? "translate" : "text",
      targetLanguage: draft.ocrTargetLanguage || "en",
    });

    const outputText = task === "ocr-translate" ? payload.translatedText || payload.text : payload.text;
    const wordBlob =
      task === "ocr-word"
        ? createWordDocumentBlob(stripExtension(file.name), outputText)
        : null;
    const textBlob =
      task !== "ocr-word"
        ? new Blob([outputText], { type: "text/plain;charset=utf-8" })
        : null;

    return {
      kind: "text",
      outputText,
      copyText: outputText,
      notes: [
        { label: "Words", value: String(payload.wordCount || 0) },
        { label: "Lines", value: String(payload.lineCount || payload.lines?.length || 0) },
        { label: "Mode", value: task === "ocr-word" ? "Word draft" : task === "ocr-translate" ? "Translated text" : "Extracted text" },
        ...(payload.translationNote ? [{ label: "Translation", value: payload.translationNote }] : []),
      ],
      ...(wordBlob
        ? {
            download: {
              blob: wordBlob,
              filename: `${stripExtension(file.name)}.doc`,
            },
          }
        : textBlob
          ? {
              download: {
                blob: textBlob,
                filename: `${stripExtension(file.name)}.txt`,
              },
            }
          : {}),
    };
  }

  if (task === "creative-maker") {
    const design = await createDesignOutput(tool, draft, file);
    return buildBlobResult({
      blob: design.blob,
      filename: design.filename,
      previewType: "image/png",
      copyText: design.summary,
      notes: design.notes,
    });
  }

  if (task === "video-to-gif") {
    const gif = await convertVideoToGif(file, draft);
    return buildBlobResult({
      blob: gif.blob,
      filename: gif.filename,
      previewType: "image/gif",
      copyText: gif.summary,
      notes: gif.notes,
    });
  }

  if (task === "favicon-pack") {
    const pack = await createFaviconPack(file);
    return buildBlobResult({
      blob: pack.blob,
      filename: pack.filename,
      previewBlob: pack.previewBlob,
      previewType: "image/png",
      copyText: pack.summary,
      notes: pack.notes,
    });
  }

  if (task === "png-to-ico") {
    const output = await convertPngToIco(file);
    return buildBlobResult({
      blob: output.blob,
      filename: output.filename,
      previewBlob: output.previewBlob,
      previewType: "image/png",
      copyText: output.summary,
      notes: output.notes,
    });
  }

  if (task === "svg-converter") {
    if (isSvgFile(file)) {
      const raster = await convertSvgToPng(file, draft);
      return buildBlobResult({
        blob: raster.blob,
        filename: raster.filename,
        previewType: raster.blob.type,
        copyText: raster.summary,
        notes: raster.notes,
      });
    }

    const traced = await traceImageToSvg(file, draft);
    return buildBlobResult({
      blob: traced.blob,
      filename: traced.filename,
      previewType: "image/svg+xml",
      copyText: traced.summary,
      notes: traced.notes,
    });
  }

  if (task === "trace-svg") {
    const traced = await traceImageToSvg(file, draft);
    return buildBlobResult({
      blob: traced.blob,
      filename: traced.filename,
      previewType: "image/svg+xml",
      copyText: traced.summary,
      notes: traced.notes,
    });
  }

  if (task === "svg-to-png") {
    const raster = await convertSvgToPng(file, draft);
    return buildBlobResult({
      blob: raster.blob,
      filename: raster.filename,
      previewType: raster.blob.type,
      copyText: raster.summary,
      notes: raster.notes,
    });
  }

  if (task === "ai-detector") {
    const report = await runAiImageDetector(file);
    return buildBlobResult({
      blob: report.previewBlob,
      filename: report.filename,
      previewBlob: report.previewBlob,
      previewType: report.previewBlob.type,
      copyText: report.summary,
      notes: report.notes,
    });
  }

  const output = await processImageFile(tool, file, draft);
  return buildBlobResult({
    blob: output.blob,
    filename: output.filename,
    previewType: output.blob.type || "image/png",
    copyText: output.summary,
    notes: output.notes,
  });
}

function buildBlobResult({ blob, filename, previewBlob, previewType, copyText, notes }) {
  const previewUrl = URL.createObjectURL(previewBlob || blob);
  return {
    kind: "image",
    previewUrl,
    previewType,
    copyText,
    notes,
    download: {
      blob,
      filename,
    },
  };
}

async function processImageFile(tool, file, draft) {
  const task = tool.settings?.task;
  const outputType = resolveOutputType(tool, file);
  const targetBytes =
    task === "custom-target-size"
      ? Math.max(8 * 1024, Math.round((Number(draft.targetKb) || 200) * 1024))
      : tool.settings?.targetBytes || null;

  const processed = await rasterizeImage(file, {
    outputType,
    quality: clamp((Number(draft.quality) || 82) / 100, 0.35, 0.96),
    maxWidth: Number(draft.maxWidth) || 1600,
    cropRatio: task === "crop" ? draft.cropRatio : "free",
    backgroundColor: draft.backgroundColor || "#ffffff",
    targetBytes,
    resizeFirst: Boolean(tool.settings?.resizeFirst),
  });

  return {
    blob: processed.blob,
    filename: renameFileExtension(file.name, extensionFromMime(outputType)),
    summary: `Original: ${formatFileSize(file.size)}\nOutput: ${formatFileSize(processed.blob.size)}\nDimensions: ${processed.width} x ${processed.height}`,
    notes: [
      { label: "Original size", value: formatFileSize(file.size) },
      { label: "Output size", value: formatFileSize(processed.blob.size) },
      { label: "Output", value: `${processed.width} x ${processed.height}` },
    ],
  };
}

async function createDesignOutput(tool, draft, file) {
  if (tool.settings?.template === "meme") {
    const source = await loadImageForCanvas(file);
    const canvas = document.createElement("canvas");
    canvas.width = source.width;
    canvas.height = source.height;
    const context = canvas.getContext("2d");
    context.drawImage(source.image, 0, 0, canvas.width, canvas.height);
    drawMemeText(context, draft.topText || "", 36, canvas.width, canvas.height);
    drawMemeText(context, draft.bottomText || "", canvas.height - 74, canvas.width, canvas.height, true);
    const blob = await canvasToBlob(canvas, "image/png");
    return {
      blob,
      filename: "meme-generator.png",
      summary: `${draft.topText || ""} ${draft.bottomText || ""}`.trim(),
      notes: [
        { label: "Format", value: "PNG" },
        { label: "Canvas", value: `${canvas.width} x ${canvas.height}` },
      ],
    };
  }

  const canvas = document.createElement("canvas");

  if (tool.settings?.template === "business-card") {
    canvas.width = 1200;
    canvas.height = 650;
    drawBusinessCard(canvas, draft);
    const blob = await canvasToBlob(canvas, "image/png");
    return {
      blob,
      filename: "business-card.png",
      summary: `${draft.name} • ${draft.role}`,
      notes: [
        { label: "Format", value: "PNG" },
        { label: "Brand", value: draft.brand || "Toolslify" },
      ],
    };
  }

  if (tool.settings?.template === "text-poster") {
    canvas.width = 1400;
    canvas.height = 1400;
    drawTextPoster(canvas, draft);
    const blob = await canvasToBlob(canvas, "image/png");
    return {
      blob,
      filename: "text-to-image.png",
      summary: `${draft.title}\n${draft.subtitle}`.trim(),
      notes: [
        { label: "Format", value: "PNG" },
        { label: "Canvas", value: `${canvas.width} x ${canvas.height}` },
      ],
    };
  }

  canvas.width = 1400;
  canvas.height = 900;
  drawInvitation(canvas, draft);
  const blob = await canvasToBlob(canvas, "image/png");
  return {
    blob,
    filename: "invitation-card.png",
    summary: `${draft.title}\n${draft.details}`,
    notes: [
      { label: "Format", value: "PNG" },
      { label: "Host", value: draft.brand || "Toolslify" },
    ],
  };
}

async function createFaviconPack(file) {
  const squareBlob = await createSquarePngBlob(file, 512);
  const zip = new JSZip();
  const sizes = [16, 32, 48, 180, 192, 512];
  let previewBlob = squareBlob;

  for (const size of sizes) {
    const variant = await resizePngBlob(squareBlob, size, size);
    if (size === 512) previewBlob = variant;
    zip.file(`favicon-${size}x${size}.png`, variant);
  }

  const icoBlob = await requestIcoBlob(await resizePngBlob(squareBlob, 256, 256));
  zip.file("favicon.ico", icoBlob);

  const blob = await zip.generateAsync({ type: "blob" });
  return {
    blob,
    previewBlob,
    filename: "favicon-pack.zip",
    summary: "Included 16, 32, 48, 180, 192, 512 PNG sizes and favicon.ico",
    notes: [
      { label: "Files", value: "7 assets" },
      { label: "Format", value: "ZIP + ICO + PNG" },
      { label: "Preview", value: "512 x 512" },
    ],
  };
}

async function convertPngToIco(file) {
  const squareBlob = await createSquarePngBlob(file, 256);
  const blob = await requestIcoBlob(squareBlob);
  return {
    blob,
    previewBlob: squareBlob,
    filename: "icon.ico",
    summary: "Converted PNG to ICO format for favicon and desktop icon use.",
    notes: [
      { label: "Input", value: "PNG" },
      { label: "Output", value: "ICO" },
      { label: "Base size", value: "256 x 256" },
    ],
  };
}

async function convertSvgToPng(file, draft) {
  const blob = await normalizeFileBlob(file);
  const image = await loadImageFromBlob(blob);
  const maxWidth = Number(draft.maxWidth) || 1600;
  const scale = Math.min(1, maxWidth / image.width);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const pngBlob = await canvasToBlob(canvas, "image/png");

  return {
    blob: pngBlob,
    filename: renameFileExtension(file.name, "png"),
    summary: `SVG rasterized to PNG at ${width} x ${height}.`,
    notes: [
      { label: "Output", value: "PNG" },
      { label: "Canvas", value: `${width} x ${height}` },
      { label: "Size", value: formatFileSize(pngBlob.size) },
    ],
  };
}

async function traceImageToSvg(file, draft) {
  const { image, width, height } = await loadImageForCanvas(file);
  const maxWidth = 900;
  const scale = Math.min(1, maxWidth / width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const tracerModule = await import("imagetracerjs");
  const tracer = tracerModule.default || tracerModule;
  const svg = tracer.imagedataToSVG(imageData, {
    numberofcolors: clamp(Number(draft.traceColors) || 12, 4, 24),
    ltres: 1,
    qtres: 1,
    pathomit: 8,
  });
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });

  return {
    blob,
    filename: renameFileExtension(file.name, "svg"),
    summary: `Raster image traced into SVG with ${clamp(Number(draft.traceColors) || 12, 4, 24)} colors.`,
    notes: [
      { label: "Output", value: "SVG" },
      { label: "Trace colors", value: String(clamp(Number(draft.traceColors) || 12, 4, 24)) },
      { label: "Canvas", value: `${canvas.width} x ${canvas.height}` },
    ],
  };
}

async function runAiImageDetector(file) {
  const { image, width, height, blob } = await loadImageForCanvas(file);
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 320 / Math.max(width, height));
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const metrics = analyzeVisualPattern(imageData.data);
  const verdict =
    metrics.syntheticScore >= 62 ? "AI-leaning" : metrics.syntheticScore <= 42 ? "Natural-leaning" : "Unclear";

  return {
    previewBlob: blob,
    filename: renameFileExtension(file.name, extensionFromMime(blob.type || file.type || "png")),
    summary: `Verdict: ${verdict}\nSynthetic score: ${metrics.syntheticScore}/100\nTexture noise: ${metrics.noiseScore}\nColor variety: ${metrics.colorVariety}`,
    notes: [
      { label: "Verdict", value: verdict },
      { label: "Synthetic score", value: `${metrics.syntheticScore}/100` },
      { label: "Color variety", value: `${metrics.colorVariety}/100` },
    ],
  };
}

async function convertVideoToGif(file, draft) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const video = await loadVideo(objectUrl);
    const fps = clamp(Number(draft.fps) || 8, 4, 12);
    const limitSeconds = clamp(Number(draft.maxSeconds) || 4, 1, 8);
    const duration = Math.min(video.duration || limitSeconds, limitSeconds);
    const frames = Math.max(6, Math.min(24, Math.round(duration * fps)));
    const targetWidth = clamp(Number(draft.gifWidth) || 540, 240, 900);
    const scale = targetWidth / video.videoWidth;
    const width = Math.max(1, Math.round(video.videoWidth * scale));
    const height = Math.max(1, Math.round(video.videoHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const encoder = GIFEncoder();
    encoder.writeHeader();

    for (let index = 0; index < frames; index += 1) {
      await yieldToMainThread();
      if (index > 0) {
        const time = duration * (index / Math.max(frames - 1, 1));
        await seekVideo(video, time);
      }
      context.drawImage(video, 0, 0, width, height);
      const imageData = context.getImageData(0, 0, width, height);
      const palette = quantize(imageData.data, 256);
      const indexed = applyPalette(imageData.data, palette);
      encoder.writeFrame(indexed, width, height, {
        palette,
        delay: Math.round(100 / fps),
      });
    }

    encoder.finish();
    const blob = new Blob([encoder.bytesView()], { type: "image/gif" });
    return {
      blob,
      filename: `${stripExtension(file.name)}.gif`,
      summary: `GIF created from ${Math.round(duration * 10) / 10}s of video at ${fps} FPS.`,
      notes: [
        { label: "Frames", value: String(frames) },
        { label: "Canvas", value: `${width} x ${height}` },
        { label: "Size", value: formatFileSize(blob.size) },
      ],
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function rasterizeImage(file, options) {
  const { image, width: sourceWidth, height: sourceHeight } = await loadImageForCanvas(file);
  const cropRect = getCropRect(sourceWidth, sourceHeight, options.cropRatio);
  let targetWidth = cropRect.width;
  let targetHeight = cropRect.height;

  if (options.maxWidth && targetWidth > options.maxWidth) {
    const scale = options.maxWidth / targetWidth;
    targetWidth = Math.max(1, Math.round(targetWidth * scale));
    targetHeight = Math.max(1, Math.round(targetHeight * scale));
  }

  let quality = clamp(options.quality || 0.82, 0.35, 0.96);
  let width = targetWidth;
  let height = targetHeight;
  let bestBlob = null;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));
    const context = canvas.getContext("2d");

    if (options.outputType === "image/jpeg") {
      context.fillStyle = options.backgroundColor || "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    context.drawImage(
      image,
      cropRect.x,
      cropRect.y,
      cropRect.width,
      cropRect.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const blob = await canvasToBlob(canvas, options.outputType, quality);
    bestBlob = blob;

    if (!options.targetBytes || blob.size <= options.targetBytes) {
      return { blob, width: canvas.width, height: canvas.height };
    }

    const targetRatio = clamp(options.targetBytes / Math.max(blob.size, 1), 0.28, 0.98);

    if (quality > 0.46) {
      const nextQuality = clamp(quality * Math.max(0.72, Math.min(0.92, targetRatio + 0.08)), 0.35, 0.96);
      quality = nextQuality >= quality ? quality - 0.06 : nextQuality;
    } else {
      const shrink = clamp(Math.sqrt(targetRatio) * (options.resizeFirst ? 0.98 : 0.94), 0.68, 0.92);
      width *= shrink;
      height *= shrink;
    }
  }

  return { blob: bestBlob, width: Math.round(width), height: Math.round(height) };
}

function detectFaceShape(draft) {
  if (draft.faceLength === "long" && draft.jawWidth === "balanced") {
    return {
      shape: "Oblong",
      summary: "The face looks longer than it is wide, with relatively balanced sides.",
      tips: ["Try styles that add width around the cheeks", "Avoid adding too much height at the crown"],
    };
  }

  if (draft.foreheadWidth === "wide" && draft.chinShape === "pointed") {
    return {
      shape: "Heart",
      summary: "The forehead appears wider while the chin narrows to a stronger point.",
      tips: ["Balance the forehead with side volume", "Soft curves usually work well around the jaw"],
    };
  }

  if (draft.cheekboneWidth === "wide" && draft.foreheadWidth === "narrow" && draft.jawWidth === "narrow") {
    return {
      shape: "Diamond",
      summary: "The cheekbones stand out as the widest point with narrower forehead and jaw.",
      tips: ["Try styles that soften cheekbone contrast", "A little width at the forehead often balances the face"],
    };
  }

  if (draft.faceLength === "balanced" && draft.foreheadWidth === "wide" && draft.jawWidth === "wide") {
    return {
      shape: "Square",
      summary: "The face looks balanced in length, with a stronger forehead and jaw line.",
      tips: ["Softer layers can reduce angularity", "Rounded frames usually contrast well with this shape"],
    };
  }

  if (draft.faceLength === "balanced" && draft.cheekboneWidth === "wide" && draft.chinShape === "rounded") {
    return {
      shape: "Oval",
      summary: "The face looks gently balanced with softer tapering from cheekbones to chin.",
      tips: ["Most styles work well on this shape", "Keep the top and sides balanced for the cleanest look"],
    };
  }

  return {
    shape: "Round",
    summary: "The face appears softer and fuller, with less sharp contrast between forehead, cheeks, and jaw.",
    tips: ["Extra height can help lengthen the silhouette", "Sharper lines often add definition around the face"],
  };
}

function getSearchLinks(sourceUrl, searchType = "reverse") {
  const encoded = encodeURIComponent(sourceUrl);
  const baseLinks = [
    { label: "Google Lens", href: `https://lens.google.com/uploadbyurl?url=${encoded}`, body: "Great for visual matches and similar products." },
    { label: "Yandex Images", href: `https://yandex.com/images/search?rpt=imageview&url=${encoded}`, body: "Useful for broad reverse-image matching." },
    { label: "TinEye", href: `https://tineye.com/search?url=${encoded}`, body: "Strong for source tracing and duplicates." },
  ];

  if (searchType === "face") {
    return [
      ...baseLinks,
      { label: "Bing Images", href: `https://www.bing.com/images/search?q=imgurl:${encoded}&view=detailv2&iss=sbi`, body: "Another broad visual search path for portraits and similar faces." },
    ];
  }

  return baseLinks;
}

function analyzeVisualPattern(data) {
  let edgeTotal = 0;
  let noiseTotal = 0;
  let saturationTotal = 0;
  const seen = new Set();

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const luma = red * 0.299 + green * 0.587 + blue * 0.114;
    const sat = Math.max(red, green, blue) - Math.min(red, green, blue);
    saturationTotal += sat;

    const signature = `${Math.round(red / 16)}-${Math.round(green / 16)}-${Math.round(blue / 16)}`;
    seen.add(signature);

    if (index + 8 < data.length) {
      const nextLuma = data[index + 4] * 0.299 + data[index + 5] * 0.587 + data[index + 6] * 0.114;
      const diff = Math.abs(luma - nextLuma);
      edgeTotal += diff;
      noiseTotal += diff < 6 ? 1 : 0;
    }
  }

  const pixelCount = data.length / 4 || 1;
  const colorVariety = clamp(Math.round((seen.size / Math.max(pixelCount / 14, 1)) * 100), 8, 100);
  const edgeScore = clamp(Math.round(edgeTotal / pixelCount), 8, 100);
  const noiseScore = clamp(Math.round((noiseTotal / pixelCount) * 100), 0, 100);
  const saturationScore = clamp(Math.round((saturationTotal / pixelCount) / 2.55), 0, 100);
  const syntheticScore = clamp(
    Math.round((100 - edgeScore) * 0.35 + saturationScore * 0.25 + (100 - colorVariety) * 0.25 + noiseScore * 0.15),
    0,
    100,
  );

  return {
    syntheticScore,
    colorVariety,
    noiseScore,
  };
}

function drawInvitation(canvas, draft) {
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#2f145f");
  gradient.addColorStop(0.5, "#1f4ea8");
  gradient.addColorStop(1, "#0f7a4d");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(255,255,255,0.08)";
  context.beginPath();
  context.arc(230, 180, 180, 0, Math.PI * 2);
  context.arc(1160, 720, 220, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#f8f7ff";
  context.font = "700 84px sans-serif";
  context.fillText(draft.title || "You're Invited", 110, 240);
  context.font = "400 34px sans-serif";
  wrapCanvasText(context, draft.subtitle || "", 110, 320, 1180, 48);

  context.fillStyle = "rgba(255,255,255,0.9)";
  context.fillRect(110, 520, 1180, 2);
  context.font = "600 34px sans-serif";
  context.fillText(draft.details || "", 110, 600);
  context.font = "600 26px sans-serif";
  context.fillText(`Hosted by ${draft.brand || "Toolslify"}`, 110, 700);
}

function drawBusinessCard(canvas, draft) {
  const context = canvas.getContext("2d");
  context.fillStyle = draft.backgroundColor || "#12142a";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#8b5cf6");
  gradient.addColorStop(1, "#2563eb");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 360, canvas.height);

  context.fillStyle = "#f8f7ff";
  context.font = "700 54px sans-serif";
  context.fillText(draft.brand || "Toolslify", 72, 114);
  context.font = "700 62px sans-serif";
  context.fillText(draft.name || "Your Name", 430, 210);
  context.font = "500 34px sans-serif";
  context.fillStyle = "rgba(248,247,255,0.84)";
  context.fillText(draft.role || "Role", 432, 268);

  const lines = [draft.email, draft.phone, draft.website].filter(Boolean);
  context.font = "500 28px sans-serif";
  lines.forEach((line, index) => {
    context.fillText(line, 432, 390 + index * 52);
  });
}

function drawTextPoster(canvas, draft) {
  const context = canvas.getContext("2d");
  const background = draft.backgroundColor || "#12142a";
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "rgba(124,58,237,0.42)");
  gradient.addColorStop(0.5, "rgba(59,130,246,0.18)");
  gradient.addColorStop(1, "rgba(239,68,68,0.18)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "rgba(255,255,255,0.08)";
  context.beginPath();
  context.arc(240, 220, 180, 0, Math.PI * 2);
  context.arc(1170, 1170, 210, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#f8f7ff";
  context.font = "700 112px sans-serif";
  context.textAlign = "left";
  wrapCanvasText(context, draft.title || "Turn text into image", 120, 220, 1100, 122);

  context.font = "500 38px sans-serif";
  context.fillStyle = "rgba(248,247,255,0.84)";
  wrapCanvasText(context, draft.subtitle || "Clean poster output ready for captions, launches, and social shares.", 120, 760, 980, 52);

  context.fillStyle = "rgba(248,247,255,0.95)";
  context.fillRect(120, 1160, 1160, 2);
  context.font = "600 28px sans-serif";
  context.fillText(draft.brand || "Toolslify", 120, 1230);
}

function drawMemeText(context, value, y, canvasWidth, canvasHeight, bottom = false) {
  if (!value.trim()) return;

  const maxWidth = canvasWidth - 80;
  let fontSize = Math.max(34, Math.round(canvasWidth / 10));
  context.textAlign = "center";
  context.lineJoin = "round";

  while (fontSize > 26) {
    context.font = `900 ${fontSize}px sans-serif`;
    if (context.measureText(value).width <= maxWidth) break;
    fontSize -= 2;
  }

  context.lineWidth = Math.max(6, fontSize * 0.12);
  context.strokeStyle = "#000000";
  context.fillStyle = "#ffffff";
  context.textBaseline = bottom ? "bottom" : "top";
  context.strokeText(value.toUpperCase(), canvasWidth / 2, y);
  context.fillText(value.toUpperCase(), canvasWidth / 2, y);
}

async function requestImageOcr({ file, mode, targetLanguage }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("mode", mode);
  formData.append("targetLanguage", targetLanguage || "en");

  return requestJsonEndpoint("/api/image/ocr", {
    method: "POST",
    body: formData,
  });
}

function createWordDocumentBlob(title, content) {
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title || "OCR Export"}</title>
      </head>
      <body>
        <h1>${title || "OCR Export"}</h1>
        ${String(content || "")
          .split(/\n{2,}/)
          .map((block) => `<p>${block.replace(/\n/g, "<br />")}</p>`)
          .join("")}
      </body>
    </html>
  `.trim();

  return new Blob([html], {
    type: "application/msword",
  });
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/).filter(Boolean);
  let line = "";
  let offsetY = y;

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;
    if (context.measureText(nextLine).width > maxWidth && line) {
      context.fillText(line, x, offsetY);
      line = word;
      offsetY += lineHeight;
      return;
    }
    line = nextLine;
  });

  if (line) {
    context.fillText(line, x, offsetY);
  }
}

function sanitizeChannel(value) {
  return clamp(Number(value) || 0, 0, 255);
}

function sanitizeDimension(value, fallback) {
  return Math.max(1, Number(value) || fallback);
}

function sanitizeDecimal(value, fallback) {
  return Math.max(0.1, Number(value) || fallback);
}

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function renameFileExtension(name, nextExtension) {
  return `${stripExtension(name)}.${nextExtension}`;
}

function stripExtension(name) {
  return name.replace(/\.[^.]+$/, "");
}

function extensionFromMime(type) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/svg+xml") return "svg";
  if (type === "image/x-icon") return "ico";
  return "png";
}

function resolveOutputType(tool, file) {
  if (tool.settings?.outputFormat && tool.settings.outputFormat !== "auto") return tool.settings.outputFormat;
  if (file.type === "image/png" || file.type === "image/webp") return file.type;
  return "image/jpeg";
}

function isSvgFile(file) {
  return file?.type === "image/svg+xml" || /\.svg$/i.test(file?.name || "");
}

function getAcceptForTool(tool) {
  const task = tool.settings?.task;
  if (task === "video-to-gif") return "video/mp4,video/webm,video/quicktime";
  if (task === "heic-convert") return ".heic,image/heic";
  if (task === "svg-to-png") return ".svg,image/svg+xml";
  if (task === "png-to-ico") return ".png,image/png";
  if (task === "trace-svg") return "image/png,image/jpeg,image/jpg,image/webp";
  if (task === "ocr" || task === "ocr-word" || task === "ocr-translate") return "image/png,image/jpeg,image/jpg,image/bmp,image/gif,image/tiff";
  return "image/*,.heic,.avif,.webp,.svg";
}

function getCropRect(width, height, ratioKey = "free") {
  if (ratioKey === "free") return { x: 0, y: 0, width, height };

  const ratio = ratioKey === "square" ? 1 : ratioKey === "portrait" ? 4 / 5 : 16 / 9;
  let cropWidth = width;
  let cropHeight = Math.round(cropWidth / ratio);

  if (cropHeight > height) {
    cropHeight = height;
    cropWidth = Math.round(cropHeight * ratio);
  }

  return {
    x: Math.round((width - cropWidth) / 2),
    y: Math.round((height - cropHeight) / 2),
    width: cropWidth,
    height: cropHeight,
  };
}

async function normalizeFileBlob(file) {
  if (!file) throw new Error("Upload a source file first.");

  if (NORMALIZED_BLOB_CACHE.has(file)) {
    return NORMALIZED_BLOB_CACHE.get(file);
  }

  const normalizedPromise = (async () => {
    if (file.type === "image/heic" || /\.heic$/i.test(file.name)) {
      const heicModule = await import("heic2any");
      const heic2any = heicModule.default || heicModule;
      const converted = await heic2any({ blob: file, toType: "image/png" });
      return Array.isArray(converted) ? converted[0] : converted;
    }

    return file;
  })();

  NORMALIZED_BLOB_CACHE.set(file, normalizedPromise);
  return normalizedPromise;
}

async function loadImageForCanvas(file) {
  const blob = await normalizeFileBlob(file);
  const image = await loadImageFromBlob(blob);
  return {
    blob,
    image,
    width: image.width || image.naturalWidth,
    height: image.height || image.naturalHeight,
  };
}

function loadImageFromBlob(blob) {
  if (DECODED_IMAGE_CACHE.has(blob)) {
    return DECODED_IMAGE_CACHE.get(blob);
  }

  const decodePromise = (async () => {
    if (typeof createImageBitmap === "function") {
      try {
        return await createImageBitmap(blob);
      } catch {}
    }

    const objectUrl = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Unable to read this image file in the browser."));
      };
      image.src = objectUrl;
    });
  })();

  DECODED_IMAGE_CACHE.set(blob, decodePromise);
  return decodePromise;
}

function loadVideo(objectUrl) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.onloadeddata = () => resolve(video);
    video.onerror = () => reject(new Error("Unable to read that video file here."));
    video.src = objectUrl;
  });
}

function seekVideo(video, time) {
  return new Promise((resolve, reject) => {
    const handleSeek = () => {
      video.removeEventListener("seeked", handleSeek);
      resolve();
    };
    const handleError = () => {
      video.removeEventListener("error", handleError);
      reject(new Error("Unable to sample frames from that video."));
    };
    video.addEventListener("seeked", handleSeek, { once: true });
    video.addEventListener("error", handleError, { once: true });
    video.currentTime = Math.min(Math.max(time, 0), Math.max((video.duration || 0) - 0.05, 0));
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Unable to export the processed image."));
        return;
      }
      resolve(blob);
    }, type, quality);
  });
}

async function createSquarePngBlob(file, size) {
  const { image, width, height } = await loadImageForCanvas(file);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, size, size);

  const scale = Math.min(size / width, size / height);
  const drawWidth = Math.round(width * scale);
  const drawHeight = Math.round(height * scale);
  const x = Math.round((size - drawWidth) / 2);
  const y = Math.round((size - drawHeight) / 2);
  context.drawImage(image, x, y, drawWidth, drawHeight);
  return canvasToBlob(canvas, "image/png");
}

async function resizePngBlob(blob, width, height) {
  const image = await loadImageFromBlob(blob);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return canvasToBlob(canvas, "image/png");
}

async function requestIcoBlob(pngBlob) {
  const formData = new FormData();
  formData.append("file", new File([pngBlob], "icon.png", { type: "image/png" }));
  return requestBlobEndpoint(
    "/api/image/ico",
    {
      method: "POST",
      body: formData,
    },
    "Unable to create the ICO file.",
  );
}

function waitForNextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 0);
    });
  });
}

function yieldToMainThread() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
