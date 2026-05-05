"use client";

import { useEffect, useRef, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTranslatedValue, useTranslatedValues } from "@/lib/runtime-localization";
import { cn, formatFileSize, formatRelativeTime, safeJsonParse } from "@/lib/utils";

export function usePersistentState(key, initialValue) {
  const initialValueRef = useRef(initialValue);
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        setValue(safeJsonParse(raw, initialValueRef.current));
      }
    } catch {}

    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [hydrated, key, value]);

  return [value, setValue, hydrated];
}

export function useHistoryStorage(key) {
  const [history, setHistory, hydrated] = usePersistentState(key, []);

  function pushHistory(entry) {
    setHistory((current) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        ...entry,
      },
      ...current,
    ].slice(0, 6));
  }

  return { history, pushHistory, setHistory, hydrated };
}

export function useSubmitShortcut({ enabled = true, onSubmit }) {
  useEffect(() => {
    if (!enabled) return undefined;

    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        onSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onSubmit]);
}

export function WorkspaceHero({ badge, title, description, stats }) {
  const translatedBadge = useTranslatedValue(badge || "");
  const translatedTitle = useTranslatedValue(title || "");
  const translatedDescription = useTranslatedValue(description || "");
  const translatedStatLabels = useTranslatedValues(stats.map((item) => item.label || ""));

  return (
    <Card
      className="workspace-hero-panel overflow-hidden border-[var(--border)] p-6 sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-4">
          <Badge tone="accent">{translatedBadge}</Badge>
          <div className="space-y-4">
            <h1 className="section-title text-4xl font-semibold sm:text-5xl">{translatedTitle}</h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted-foreground)]">{translatedDescription}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className="rounded-[18px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--background-strong),var(--surface-elevated))] p-4 shadow-[var(--shadow-soft)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {translatedStatLabels[index] || item.label}
              </p>
              <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function WorkflowSteps({ steps, currentStep = 1 }) {
  const { language } = usePreferences();
  const translatedStepWord = useTranslatedValue("Step");
  const translatedStepText = useTranslatedValues(
    steps.flatMap((step) => [step.title || "", step.body || ""]),
  );

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {steps.map((step, index) => {
        const active = currentStep === index + 1;
        const complete = currentStep > index + 1;
        const offset = index * 2;

        return (
          <div
            key={step.title}
            className={cn(
              "rounded-[18px] border p-4 transition duration-300",
              active || complete
                ? "border-[var(--primary-edge)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary-soft)_82%,white),var(--background-strong))] shadow-[var(--shadow-soft)]"
                : "border-[var(--border)] bg-[linear-gradient(180deg,var(--background-strong),var(--surface-elevated))] hover:border-[var(--border-strong)]",
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              {language === "en" ? `Step ${index + 1}` : `${translatedStepWord} ${index + 1}`}
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--foreground)]">{translatedStepText[offset] || step.title}</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{translatedStepText[offset + 1] || step.body}</p>
          </div>
        );
      })}
    </div>
  );
}

export function PanelCard({ eyebrow, title, description, children, className, minimal = false }) {
  const translatedEyebrow = useTranslatedValue(eyebrow || "");
  const translatedTitle = useTranslatedValue(title || "");
  const translatedDescription = useTranslatedValue(description || "");

  return (
    <Card
      className={cn(
        minimal
          ? "workbench-pane workbench-pane-minimal p-4 sm:p-5"
          : "workbench-pane p-5 sm:p-6",
        className,
      )}
    >
      {(eyebrow || title || description) && (
        <div className="relative mb-5 space-y-2 border-b border-black/5 pb-5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-24 after:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--tool-primary)_28%,transparent),transparent)]">
          {eyebrow ? <Badge tone="accent">{translatedEyebrow}</Badge> : null}
          {title ? <h2 className="text-[1.04rem] font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-[1.18rem]">{translatedTitle}</h2> : null}
          {description ? <p className="max-w-2xl text-[0.92rem] leading-7 text-[var(--muted-foreground)]">{translatedDescription}</p> : null}
        </div>
      )}
      {children}
    </Card>
  );
}

export function MetricStrip({ items }) {
  const translatedLabels = useTranslatedValues(items.map((item) => item.label || ""));

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="rounded-[20px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--background-strong),var(--surface-elevated))] px-4 py-3 shadow-[var(--shadow-soft)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {translatedLabels[index] || item.label}
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function SegmentedControl({ label, options, value, onChange, help }) {
  const translatedValues = useTranslatedValues([label || "", help || "", ...options.map((option) => option.label || "")]);
  const translatedLabel = translatedValues[0] || label;
  const translatedHelp = translatedValues[1] || help;

  return (
    <div className="rounded-[20px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--background-strong),var(--surface-elevated))] p-4 shadow-[var(--shadow-soft)]">
      <div className="mb-4">
        <p className="text-sm font-semibold text-[var(--foreground)]">{translatedLabel}</p>
        {help ? <p className="mt-1 text-xs text-[var(--muted-foreground)]">{translatedHelp}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-[14px] border px-4 py-2.5 text-sm font-semibold capitalize transition duration-300",
                active
                  ? "border-[var(--primary-edge)] bg-[color:color-mix(in_srgb,var(--primary-soft)_72%,white)] text-[var(--accent-stronger)] shadow-[0_16px_28px_-26px_rgba(15,23,42,0.14)]"
                  : "border-[var(--border)] bg-[var(--background-strong)] text-[var(--muted-foreground)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--foreground)]",
              )}
            >
              {translatedValues[index + 2] || option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RangeField({ label, help, value, min = 0, max = 100, step = 1, onChange }) {
  const [translatedLabel, translatedHelp] = useTranslatedValues([label || "", help || ""]);

  return (
    <div className="rounded-[20px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--background-strong),var(--surface-elevated))] p-4 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">{translatedLabel || label}</p>
          {help ? <p className="mt-1 text-xs text-[var(--muted-foreground)]">{translatedHelp || help}</p> : null}
        </div>
        <Badge>{value}%</Badge>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--accent-surface)]"
      />
    </div>
  );
}

export function ActionRow({ children, meta }) {
  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--background-strong),var(--surface-elevated))] p-4 shadow-[var(--shadow-soft)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-3">{children}</div>
      {meta ? <div className="flex flex-wrap gap-2">{meta}</div> : null}
    </div>
  );
}

export function OutputSurface({ output, placeholder, children, className }) {
  const [translatedPlaceholder, translatedTitle] = useTranslatedValues([
    placeholder || "",
    "Result appears here",
  ]);

  if (!output && !children) {
    return (
      <div className="workspace-output-empty flex min-h-[280px] items-center justify-center px-5 py-10 text-center">
        <div className="max-w-sm">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-[16px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,249,252,0.98))] shadow-[0_18px_36px_-28px_rgba(15,23,42,0.14)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-[#546074]">
              <path d="M7 7h10v10H7z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <p className="mt-5 text-[1.02rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">{translatedTitle}</p>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{translatedPlaceholder}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "workspace-document-surface min-h-[280px] px-5 pb-5 pt-[64px] text-sm leading-7 text-[var(--foreground)] sm:px-6 sm:pb-6 sm:pt-[68px]",
        className,
      )}
    >
      {children || <div className="whitespace-pre-wrap">{output}</div>}
    </div>
  );
}

export function HistoryPanel({ title, history, onRestore, emptyMessage }) {
  const { text } = usePreferences();
  const translatedEmptyMessage = useTranslatedValue(emptyMessage || "");

  return (
    <PanelCard title={title} description={text.recentResultsStored}>
      {!history.length ? (
        <div className="rounded-[10px] border border-dashed border-[var(--border-strong)] px-4 py-5 text-sm leading-7 text-[var(--muted-foreground)]">
          {translatedEmptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onRestore(item)}
              className="w-full rounded-[22px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--background-strong),var(--surface-elevated))] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--background-strong)] hover:shadow-[var(--shadow-soft-strong)]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--foreground)]">{item.label || text.savedResult}</p>
                <span className="text-xs text-[var(--muted-foreground)]">{formatRelativeTime(item.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{truncate(item.preview, 132)}</p>
            </button>
          ))}
        </div>
      )}
    </PanelCard>
  );
}

export function FileDropzone({ title, description, accept, file, onFileChange, accentLabel, variant = "default" }) {
  const [isDragging, setIsDragging] = useState(false);
  const { text } = usePreferences();
  const [translatedTitle, translatedDescription, translatedReady] = useTranslatedValues([
    title || "",
    description || "",
    "Ready for processing",
  ]);
  const buttonLabel = file ? text.replaceFile : getFileSelectLabel(title, text);

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const nextFile = event.dataTransfer?.files?.[0] || null;
    onFileChange(nextFile);
  }

  if (variant === "hero") {
    return (
      <label
        className={cn("block cursor-pointer", isDragging && "scale-[1.01]")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="rounded-[22px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,253,0.99))] p-4 shadow-[0_22px_42px_-34px_rgba(15,23,42,0.12)] sm:p-5">
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[20px] border border-dashed border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(249,250,252,0.98))] px-6 py-8 text-center">
            <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-[16px] border border-[var(--primary-edge)] bg-[linear-gradient(180deg,var(--accent-end),var(--primary))] text-white shadow-[0_22px_34px_-24px_color-mix(in_srgb,var(--tool-glow)_86%,rgba(15,23,42,0.22))]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 16V5" />
                <path d="m7 10 5-5 5 5" />
                <path d="M4 19h16" />
              </svg>
            </div>
            <span className="inline-flex min-h-[44px] items-center justify-center rounded-[12px] border border-[var(--primary-edge)] bg-[linear-gradient(180deg,var(--accent-end),var(--primary))] px-5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_18px_28px_-22px_color-mix(in_srgb,var(--tool-glow)_84%,rgba(15,23,42,0.22))] transition duration-300 hover:-translate-y-0.5">
              {buttonLabel}
            </span>
            <p className="mt-4 max-w-md text-[1.02rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              {file ? file.name : translatedTitle || title}
            </p>
            <p className="mt-2 max-w-md text-sm leading-7 text-[var(--muted-foreground)]">
              {file ? formatFileSize(file.size) : `or ${text.dropFileHere.toLowerCase()}`}
            </p>
          </div>
        </div>
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => onFileChange(event.target.files?.[0] || null)}
        />
      </label>
    );
  }

  return (
    <label
      className={cn(
        "block cursor-pointer rounded-[20px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.985),rgba(248,250,253,0.995))] p-4 transition duration-300 hover:border-[color:color-mix(in_srgb,var(--tool-edge)_54%,rgba(18,24,31,0.08))] hover:shadow-[0_18px_36px_-30px_rgba(15,23,42,0.12)]",
        isDragging && "border-[var(--primary-edge)] bg-[color:color-mix(in_srgb,var(--primary-soft)_56%,white)]",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--foreground)]">{translatedTitle || title}</p>
          <p className="mt-1 text-xs leading-6 text-[var(--muted-foreground)]">
            {translatedDescription || description}
          </p>
        </div>
        <span className="inline-flex min-h-[32px] shrink-0 items-center rounded-full border border-black/5 bg-white/80 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          {file ? translatedReady : accentLabel || "Upload"}
        </span>
      </div>

      <div className="relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-[18px] border border-dashed border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(249,250,252,0.99))] px-6 py-8 text-center">
        <span className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(15,23,42,0.14),transparent)]" aria-hidden="true" />
        {accentLabel ? (
          <span className="absolute left-4 top-4 rounded-full border border-[var(--primary-edge)] bg-[color:color-mix(in_srgb,var(--primary-soft)_72%,white)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-stronger)]">
            {accentLabel}
          </span>
        ) : null}
        <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-[14px] border border-[var(--primary-edge)] bg-[linear-gradient(180deg,var(--accent-end),var(--primary))] text-white shadow-[0_20px_30px_-22px_color-mix(in_srgb,var(--tool-glow)_86%,rgba(15,23,42,0.22))]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 16V5" />
            <path d="m7 10 5-5 5 5" />
            <path d="M4 19h16" />
          </svg>
        </div>
        <span className="relative mt-5 inline-flex h-11 items-center justify-center rounded-[12px] border border-[var(--primary-edge)] bg-[linear-gradient(180deg,var(--accent-end),var(--primary))] px-5 text-sm font-semibold text-white shadow-[0_18px_28px_-22px_color-mix(in_srgb,var(--tool-glow)_84%,rgba(15,23,42,0.22))]">
          {buttonLabel}
        </span>
        <p className="mt-4 max-w-md text-[1.02rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          {file ? file.name : isDragging ? text.dropFileHere : translatedDescription || description}
        </p>
        <p className="mt-2 max-w-md text-sm leading-7 text-[var(--muted-foreground)]">
          {file
            ? `${formatFileSize(file.size)}`
            : isDragging
              ? "Release to add the file."
              : `or ${text.dropFileHere.toLowerCase()}`}
        </p>
        {accept ? (
          <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#8a91a2]">
            {formatAcceptLabel(accept)}
          </p>
        ) : null}
      </div>
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => onFileChange(event.target.files?.[0] || null)}
      />
    </label>
  );
}

export function FieldGroup({ label, help, children }) {
  const [translatedLabel, translatedHelp] = useTranslatedValues([label || "", help || ""]);

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">{translatedLabel || label}</p>
        {help ? <p className="mt-1 text-xs text-[var(--muted-foreground)]">{translatedHelp || help}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function InputField({ value, onChange, placeholder, ...props }) {
  const translatedPlaceholder = useTranslatedValue(placeholder || "");

  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={translatedPlaceholder}
      className="workspace-field h-[54px] w-full px-5 text-[15px] font-medium tracking-[-0.01em] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition duration-300 hover:border-[var(--border-strong)] focus:border-[var(--primary)] focus:outline-none"
      {...props}
    />
  );
}

export function TextEditor({ value, onChange, placeholder, className, ...props }) {
  return (
    <Textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
}

export function MetaNotes({ items }) {
  const translatedLabels = useTranslatedValues(items.map((item) => item.label || ""));

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div key={item.label} className="rounded-[18px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--background-strong),var(--surface-elevated))] px-4 py-3 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{translatedLabels[index] || item.label}</p>
          <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function LoadingSurface({ title }) {
  const { text } = usePreferences();
  const translatedTitle = useTranslatedValue(title || text.processing);
  const translatedSubtitle = useTranslatedValue("Preparing the result and smoothing the final output.");

  return (
    <div className="flex min-h-[220px] flex-col justify-center gap-4 rounded-[20px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(248,250,253,0.995))] p-6 shadow-[0_22px_40px_-34px_rgba(15,23,42,0.12)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-[var(--primary-edge)] bg-[color:color-mix(in_srgb,var(--primary-soft)_82%,white)] text-[var(--accent-stronger)] shadow-[0_16px_26px_-22px_rgba(15,23,42,0.16)]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">{translatedTitle}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{translatedSubtitle}</p>
        </div>
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-3 animate-pulse rounded-full bg-[linear-gradient(90deg,color-mix(in_srgb,var(--primary-soft)_88%,white),rgba(24,31,41,0.12),color-mix(in_srgb,var(--primary-soft)_72%,white))]"
          style={{
            width: `${100 - index * 12}%`,
            animationDelay: `${index * 120}ms`,
            animationDuration: "1.3s",
          }}
        />
      ))}
    </div>
  );
}

export function StatusBanner({ tone = "default", children }) {
  const translatedChildren = useTranslatedValue(typeof children === "string" ? children : "");

  return (
    <div
      className={cn(
        "rounded-[15px] border px-4 py-3 text-sm leading-7 shadow-[0_16px_26px_-22px_rgba(15,23,42,0.1)]",
        tone === "warning"
          ? "border-[rgba(245,158,11,0.24)] bg-[linear-gradient(180deg,rgba(245,158,11,0.12),rgba(245,158,11,0.07))] text-[var(--foreground)]"
          : tone === "success"
            ? "border-[rgba(22,130,93,0.24)] bg-[linear-gradient(180deg,rgba(22,130,93,0.12),rgba(22,130,93,0.07))] text-[var(--foreground)]"
            : "border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.985),rgba(248,250,253,0.99))] text-[var(--muted-foreground)]",
      )}
    >
      {typeof children === "string" ? translatedChildren : children}
    </div>
  );
}

export function StarterCard({ title = "Quick start", description, actionLabel = "Use example", onAction }) {
  const translatedValues = useTranslatedValues([title || "", description || "", actionLabel || ""]);

  return (
    <div className="rounded-[18px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(248,250,253,0.995))] p-4 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.1)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">{translatedValues[0] || title}</p>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">{translatedValues[1] || description}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onAction}>
          {translatedValues[2] || actionLabel}
        </Button>
      </div>
    </div>
  );
}

export function ToolbarButton({ children, ...props }) {
  return (
    <Button variant="secondary" size="sm" {...props}>
      {children}
    </Button>
  );
}

export function ActionButton({ children, ...props }) {
  const translatedChildren = useTranslatedValue(typeof children === "string" ? children : "");

  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-center rounded-[14px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--background-strong),var(--surface-elevated))] px-5 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)] hover:shadow-[var(--shadow-soft-strong)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      {...props}
    >
      {typeof children === "string" ? translatedChildren : children}
    </button>
  );
}

export function CollapsiblePanel({ title, description, defaultOpen = false, children }) {
  const { text } = usePreferences();
  const [translatedTitle, translatedDescription] = useTranslatedValues([title || "", description || text.open]);

  return (
    <details className="workspace-details" open={defaultOpen}>
      <summary>
        <span>{translatedTitle || title}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          {translatedDescription || description || text.open}
        </span>
      </summary>
      <div className="workspace-details-body">{children}</div>
    </details>
  );
}

export function SectionKicker({ children }) {
  const translatedChildren = useTranslatedValue(typeof children === "string" ? children : "");
  return <p className="workspace-kicker">{typeof children === "string" ? translatedChildren : children}</p>;
}

export function TypewriterText({ text, className }) {
  const [visibleText, setVisibleText] = useState(text);

  useEffect(() => {
    if (!text) {
      setVisibleText("");
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || text.length > 1400) {
      setVisibleText(text);
      return undefined;
    }

    const maxDuration = text.length > 800 ? 320 : text.length > 320 ? 420 : 520;
    const frames = Math.max(10, Math.round(maxDuration / 16));
    const chunkSize = Math.max(8, Math.ceil(text.length / frames));
    let frame = chunkSize;
    let frameId = 0;

    setVisibleText("");

    function reveal() {
      if (frame >= text.length) {
        setVisibleText(text);
        frameId = 0;
        return;
      }

      setVisibleText(text.slice(0, frame));
      frame += chunkSize;
      frameId = window.requestAnimationFrame(reveal);
    }

    frameId = window.requestAnimationFrame(reveal);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [text]);

  return <div className={cn("whitespace-pre-wrap", className)}>{visibleText}</div>;
}

export function InlineInfo({ items }) {
  return (
    <div className="workspace-inline-metrics">
      {items.map((item) => (
        <span
          key={item}
          className="workspace-inline-chip"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function truncate(text = "", maxLength = 120) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function getFileSelectLabel(title = "", text = {}) {
  const normalized = title.toLowerCase();

  if (normalized.includes("pdf")) return text.selectPdfFile || "Select PDF file";
  if (normalized.includes("video")) return text.selectVideoFile || "Select video file";
  if (normalized.includes("image")) return text.selectImageFile || "Select image file";

  return text.selectFile || "Select file";
}

function formatAcceptLabel(accept = "") {
  if (!accept) return "";
  if (accept.includes("image/*")) return "Accepts image files";
  if (accept.includes("audio/*")) return "Accepts audio files";
  if (accept.includes(".pdf")) return "Accepts PDF documents";

  return `Accepts ${accept.replaceAll(",", ", ").replaceAll(".", "").toUpperCase()}`;
}
