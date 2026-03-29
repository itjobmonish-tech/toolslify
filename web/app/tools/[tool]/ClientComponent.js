"use client";

import { memo, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { analyzeText, createSeededRandom, getDiffSegments } from "@/lib/humanizer";
import { runTool } from "@/lib/tool-engine";
import { cn, formatRelativeTime } from "@/lib/utils";

const tones = ["friendly", "formal", "casual"];
const strengths = ["low", "medium", "high"];

export default function ClientComponent({ tool }) {
  const inputRef = useRef(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tone, setTone] = useState("friendly");
  const [strength, setStrength] = useState("medium");
  const [compareMode, setCompareMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const [savedAt, setSavedAt] = useState(null);

  const inputKey = `toolslify:${tool.slug}:input`;
  const outputKey = `toolslify:${tool.slug}:output`;
  const historyKey = `toolslify:${tool.slug}:history`;
  const compareKey = `toolslify:${tool.slug}:compare`;

  const deferredInput = useDeferredValue(input);
  const deferredOutput = useDeferredValue(output);
  const inputMetrics = useMemo(() => analyzeText(deferredInput), [deferredInput]);
  const outputMetrics = useMemo(() => analyzeText(deferredOutput), [deferredOutput]);
  const diffSegments = useMemo(() => {
    if (!compareMode || !input.trim() || !output.trim()) return [];
    return getDiffSegments(input, output);
  }, [compareMode, input, output]);

  useEffect(() => {
    try {
      const savedInput = localStorage.getItem(inputKey);
      const savedOutput = localStorage.getItem(outputKey);
      const savedHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
      const savedCompare = localStorage.getItem(compareKey);

      if (savedInput) setInput(savedInput);
      if (savedOutput) setOutput(savedOutput);
      if (Array.isArray(savedHistory)) setHistory(savedHistory.slice(0, 5));
      if (savedCompare === "true") setCompareMode(true);
    } catch {}
  }, [compareKey, historyKey, inputKey, outputKey]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(inputKey, input);
        localStorage.setItem(outputKey, output);
        setSavedAt(input || output ? new Date().toISOString() : null);
      } catch {}
    }, 220);

    return () => clearTimeout(timeout);
  }, [input, output, inputKey, outputKey]);

  useEffect(() => {
    try {
      localStorage.setItem(compareKey, String(compareMode));
    } catch {}
  }, [compareKey, compareMode]);

  useEffect(() => {
    if (copyLabel === "Copy") return undefined;
    const timeout = setTimeout(() => setCopyLabel("Copy"), 1600);
    return () => clearTimeout(timeout);
  }, [copyLabel]);

  async function handleGenerate({ remix = false } = {}) {
    if (!input.trim()) return;

    setIsLoading(true);
    const random = createSeededRandom(Date.now() + (remix ? 99 : 0));
    await new Promise((resolve) => setTimeout(resolve, 520));

    const nextOutput = runTool(tool.slug, input, { tone, strength, random });
    setOutput(nextOutput);
    setIsLoading(false);
    saveHistory({
      key: historyKey,
      input,
      output: nextOutput,
      tone,
      strength,
      setHistory,
    });
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setCopyLabel("Copy");
    inputRef.current?.focus();
  }

  async function handleCopy() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopyLabel("Copied");
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = output;
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopyLabel("Copied");
      } catch {
        setCopyLabel("Retry");
      }
    }
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${tool.slug}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  function handleRestore(item) {
    setInput(item.input);
    setOutput(item.output);
    setTone(item.tone);
    setStrength(item.strength);
    inputRef.current?.focus();
  }

  function handleKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      handleGenerate();
    }
  }

  return (
    <Card className="overflow-hidden border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--surface),var(--surface-elevated))] p-5 sm:p-7">
      <div className="flex flex-col gap-6 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge tone="accent">{tool.heroBadge}</Badge>
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              {tool.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
              {tool.introSummary}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge>{inputMetrics.words} words in input</Badge>
          <Badge>{outputMetrics.words} words in output</Badge>
          <Badge>{savedAt ? `Saved ${formatRelativeTime(savedAt)}` : "Autosave ready"}</Badge>
        </div>
      </div>

      <div className="mt-7 grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-7">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <ControlGroup label="Tone" help="Choose how the final output should sound.">
              <SegmentedOptions options={tones} value={tone} onChange={setTone} />
            </ControlGroup>
            <ControlGroup label="Strength" help="Control how direct or transformative the rewrite should feel.">
              <SegmentedOptions options={strengths} value={strength} onChange={setStrength} />
            </ControlGroup>
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">Compare mode</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">Highlight wording changes side by side.</p>
                </div>
                <Toggle checked={compareMode} onCheckedChange={setCompareMode} label="Toggle compare mode" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title={tool.inputLabel} description="Add your prompt, notes, or original text here." metrics={inputMetrics}>
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tool.inputPlaceholder}
              />
            </Panel>

            <Panel title={tool.outputLabel} description="Review, copy, compare, and download the result." metrics={outputMetrics}>
              {isLoading ? (
                <LoadingPreview />
              ) : (
                <OutputPreview output={output} compareMode={compareMode} diffSegments={diffSegments} placeholder={tool.outputPlaceholder} />
              )}
            </Panel>
          </div>

          <div className="flex flex-col gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => handleGenerate()} disabled={isLoading || !input.trim()} size="lg">
                {isLoading ? "Working..." : tool.primaryAction}
              </Button>
              <Button variant="secondary" onClick={() => handleGenerate({ remix: true })} disabled={isLoading || !input.trim()} size="lg">
                Generate variation
              </Button>
              <Button variant="secondary" onClick={handleCopy} disabled={!output} size="lg">
                {copyLabel}
              </Button>
              <Button variant="secondary" onClick={handleDownload} disabled={!output} size="lg">
                Download
              </Button>
              <Button variant="ghost" onClick={handleClear} disabled={!input && !output} size="lg">
                Clear
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">Ctrl + Enter</Badge>
              <Badge>{(output || input) ? `${(output || input).trim().split(/\s+/).filter(Boolean).length} total words` : "No text yet"}</Badge>
              <Badge>{output ? outputMetrics.readabilityLabel : inputMetrics.readabilityLabel}</Badge>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <Card className="p-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">Recent history</p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
              Your latest five outputs stay in local storage so you can restore a stronger version quickly.
            </p>
            <HistoryList history={history} onRestore={handleRestore} />
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">Tool metrics</p>
            <div className="mt-4 grid gap-3">
              <MetricRow label="Input words" value={String(inputMetrics.words)} />
              <MetricRow label="Output words" value={String(outputMetrics.words)} />
              <MetricRow label="Characters" value={String(outputMetrics.characters || inputMetrics.characters)} />
              <MetricRow label="Readability score" value={String(output ? outputMetrics.readabilityScore : inputMetrics.readabilityScore)} />
            </div>
          </Card>
        </aside>
      </div>
    </Card>
  );
}

function ControlGroup({ label, help, children }) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
      <div className="mb-4">
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">{help}</p>
      </div>
      {children}
    </div>
  );
}

function Panel({ title, description, metrics, children }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Badge>{metrics.words} words</Badge>
          <Badge>{metrics.characters} chars</Badge>
        </div>
      </div>
      {children}
    </div>
  );
}

function SegmentedOptions({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium capitalize transition duration-200",
              active
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "border border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:border-[var(--accent-soft)] hover:text-[var(--foreground)]",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

const OutputPreview = memo(function OutputPreview({ output, compareMode, diffSegments, placeholder }) {
  if (!output) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-[24px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-elevated)] px-6 text-center text-sm leading-7 text-[var(--muted-foreground)]">
        {placeholder}
      </div>
    );
  }

  if (!compareMode) {
    return (
      <div className="min-h-[240px] whitespace-pre-wrap rounded-[24px] border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-5 py-4 text-[15px] leading-7 text-[var(--foreground)]">
        {output}
      </div>
    );
  }

  return (
    <div className="min-h-[240px] whitespace-pre-wrap rounded-[24px] border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-5 py-4 text-[15px] leading-7 text-[var(--foreground)]">
      {diffSegments.map((segment, index) => (
        <span
          key={`${segment.value}-${index}`}
          className={segment.changed ? "rounded-md bg-[var(--accent-faint)] px-1 text-[var(--accent-stronger)]" : undefined}
        >
          {segment.value}
        </span>
      ))}
    </div>
  );
});

const LoadingPreview = memo(function LoadingPreview() {
  return (
    <div className="flex min-h-[240px] flex-col gap-3 rounded-[24px] border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={index}
          className="h-4 rounded-full bg-[var(--accent-faint)]"
          animate={{ opacity: [0.4, 1, 0.4], scaleX: [0.97, 1, 0.97] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: index * 0.08 }}
          style={{ width: `${100 - index * 10}%`, transformOrigin: "left center" }}
        />
      ))}
    </div>
  );
});

const HistoryList = memo(function HistoryList({ history, onRestore }) {
  if (!history.length) {
    return (
      <div className="mt-4 rounded-[20px] border border-dashed border-[var(--border-strong)] px-4 py-5 text-sm leading-7 text-[var(--muted-foreground)]">
        No saved outputs yet. Generate a version and your latest results will appear here.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {history.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onRestore(item)}
          className="w-full rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition hover:border-[var(--accent-soft)] hover:bg-[var(--surface-elevated)]"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium capitalize text-[var(--foreground)]">
              {item.tone} tone · {item.strength}
            </p>
            <span className="text-xs text-[var(--muted-foreground)]">{formatRelativeTime(item.createdAt)}</span>
          </div>
          <p className="mt-2 line-clamp-3 text-sm leading-7 text-[var(--muted-foreground)]">{item.output}</p>
        </button>
      ))}
    </div>
  );
});

function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <span className="text-sm text-[var(--muted-foreground)]">{label}</span>
      <span className="text-sm font-medium text-[var(--foreground)]">{value}</span>
    </div>
  );
}

function saveHistory({ key, input, output, tone, strength, setHistory }) {
  setHistory((current) => {
    const next = [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        input,
        output,
        tone,
        strength,
      },
      ...current,
    ].slice(0, 5);

    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}

    return next;
  });
}
