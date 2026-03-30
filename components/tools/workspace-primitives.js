"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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

export function WorkspaceHero({ badge, title, description, stats, theme }) {
  return (
    <Card
      className="overflow-hidden border-[var(--border-strong)] p-6 sm:p-8"
      style={{
        background: `linear-gradient(135deg, ${theme.surface}, var(--surface) 52%, var(--surface-raised))`,
      }}
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-4">
          <Badge tone="accent">{badge}</Badge>
          <div className="space-y-4">
            <h1 className="section-title text-4xl font-semibold sm:text-5xl">{title}</h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted-foreground)]">{description}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-semibold text-[var(--foreground)]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function PanelCard({ eyebrow, title, description, children, className }) {
  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      {(eyebrow || title || description) && (
        <div className="mb-5 space-y-2">
          {eyebrow ? <Badge tone="accent">{eyebrow}</Badge> : null}
          {title ? <h2 className="text-2xl font-semibold text-[var(--foreground)]">{title}</h2> : null}
          {description ? <p className="text-sm leading-7 text-[var(--muted-foreground)]">{description}</p> : null}
        </div>
      )}
      {children}
    </Card>
  );
}

export function MetricStrip({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {item.label}
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function SegmentedControl({ label, options, value, onChange, help }) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
      <div className="mb-4">
        <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
        {help ? <p className="mt-1 text-xs text-[var(--muted-foreground)]">{help}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold capitalize transition",
                active
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:border-[var(--accent-edge)] hover:text-[var(--foreground)]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RangeField({ label, help, value, min = 0, max = 100, step = 1, onChange }) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
          {help ? <p className="mt-1 text-xs text-[var(--muted-foreground)]">{help}</p> : null}
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
    <div className="flex flex-col gap-4 rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-3">{children}</div>
      {meta ? <div className="flex flex-wrap gap-2">{meta}</div> : null}
    </div>
  );
}

export function OutputSurface({ output, placeholder, children, className }) {
  if (!output && !children) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-[28px] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 text-center text-sm leading-7 text-[var(--muted-foreground)]">
        {placeholder}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-[260px] rounded-[28px] border border-[var(--border-strong)] bg-[var(--surface)] p-5 text-[15px] leading-7 text-[var(--foreground)]",
        className,
      )}
    >
      {children || <div className="whitespace-pre-wrap">{output}</div>}
    </div>
  );
}

export function HistoryPanel({ title, history, onRestore, emptyMessage }) {
  return (
    <PanelCard title={title} description="Recent results stay in your browser so you can restore a stronger version later.">
      {!history.length ? (
        <div className="rounded-[22px] border border-dashed border-[var(--border-strong)] px-4 py-5 text-sm leading-7 text-[var(--muted-foreground)]">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onRestore(item)}
              className="w-full rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-left transition hover:border-[var(--accent-edge)] hover:bg-[var(--surface-raised)]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[var(--foreground)]">{item.label || "Saved result"}</p>
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

export function FileDropzone({ title, description, accept, file, onFileChange, accentLabel }) {
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col rounded-[28px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-strong)] p-6 transition hover:border-[var(--accent-edge)] hover:bg-[var(--surface-raised)]",
        isDragging && "border-[var(--accent-edge)] bg-[var(--accent-surface)]",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-[var(--foreground)]">{title}</p>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{description}</p>
        </div>
        <Badge tone="accent">{accentLabel}</Badge>
      </div>
      <div className="mt-5 rounded-[22px] border border-[var(--border)] bg-[var(--surface)] px-4 py-5 text-sm text-[var(--muted-foreground)]">
        {file ? `${file.name} - ${formatFileSize(file.size)}` : isDragging ? "Drop the file here" : "Click to upload or drag a file here"}
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
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
        {help ? <p className="mt-1 text-xs text-[var(--muted-foreground)]">{help}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function InputField({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-12 w-full rounded-[18px] border border-[var(--border-strong)] bg-[var(--surface-strong)] px-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
    />
  );
}

export function TextEditor({ value, onChange, placeholder, className }) {
  return <Textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={className} />;
}

export function MetaNotes({ items }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{item.label}</p>
          <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function LoadingSurface({ title = "Working on it..." }) {
  return (
    <div className="flex min-h-[260px] flex-col justify-center gap-3 rounded-[28px] border border-[var(--border-strong)] bg-[var(--surface)] p-6">
      <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-4 animate-pulse rounded-full bg-[var(--accent-surface)]"
          style={{ width: `${100 - index * 12}%` }}
        />
      ))}
    </div>
  );
}

export function StatusBanner({ tone = "default", children }) {
  return (
    <div
      className={cn(
        "rounded-[22px] border px-4 py-3 text-sm leading-7",
        tone === "warning"
          ? "border-[rgba(245,158,11,0.28)] bg-[rgba(245,158,11,0.12)] text-[var(--foreground)]"
          : "border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted-foreground)]",
      )}
    >
      {children}
    </div>
  );
}

export function StarterCard({ title = "Quick start", description, actionLabel = "Use example", onAction }) {
  return (
    <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">{description}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
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
  return (
    <button
      type="button"
      className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-edge)] hover:bg-[var(--surface-raised)] disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}

function truncate(text = "", maxLength = 120) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
