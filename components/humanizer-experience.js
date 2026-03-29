"use client";

import { memo, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { analyzeText, createSeededRandom, getDiffSegments, humanizeText } from "@/lib/humanizer";
import { cn, formatRelativeTime } from "@/lib/utils";

const INPUT_STORAGE_KEY = "toolslify-humanizer-input";
const HISTORY_STORAGE_KEY = "toolslify-humanizer-history";
const COMPARE_STORAGE_KEY = "toolslify-humanizer-compare";

const toneOptions = ["friendly", "formal", "casual"];
const strengthOptions = ["low", "medium", "high"];

const featureCards = [
  {
    title: "Intentional rewriting",
    body: "Choose tone and rewrite strength so the output fits a real workflow, not a generic one-size-fits-all spinner.",
  },
  {
    title: "Built for review",
    body: "Compare your original and rewritten text side by side, with changed words highlighted for fast QA.",
  },
  {
    title: "Keeps momentum",
    body: "Autosave, keyboard shortcuts, and recent history let you keep refining without losing a strong version.",
  },
];

export default function HumanizerExperience() {
  const inputRef = useRef(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tone, setTone] = useState("friendly");
  const [strength, setStrength] = useState("medium");
  const [compareMode, setCompareMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [copyState, setCopyState] = useState("idle");
  const [lastSavedAt, setLastSavedAt] = useState(null);

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
      const savedInput = localStorage.getItem(INPUT_STORAGE_KEY);
      const savedHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
      const savedCompare = localStorage.getItem(COMPARE_STORAGE_KEY);

      if (savedInput) setInput(savedInput);
      if (Array.isArray(savedHistory)) setHistory(savedHistory.slice(0, 5));
      if (savedCompare === "true") setCompareMode(true);
    } catch {}
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(INPUT_STORAGE_KEY, input);
        setLastSavedAt(input ? new Date().toISOString() : null);
      } catch {}
    }, 220);

    return () => clearTimeout(timeout);
  }, [input]);

  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, String(compareMode));
    } catch {}
  }, [compareMode]);

  useEffect(() => {
    if (copyState !== "done") return undefined;

    const timeout = setTimeout(() => setCopyState("idle"), 1800);
    return () => clearTimeout(timeout);
  }, [copyState]);

  async function handleRewrite({ variation = false } = {}) {
    const trimmed = input.trim();
    if (!trimmed) return;

    setIsLoading(true);
    const seed = Date.now() + (variation ? Math.floor(Math.random() * 1000) : 0);
    const random = createSeededRandom(seed);

    await new Promise((resolve) => setTimeout(resolve, 550));

    const rewritten = humanizeText(trimmed, {
      tone,
      strength,
      random,
    });

    setOutput(rewritten);
    setIsLoading(false);
    persistHistory({ input: trimmed, output: rewritten, tone, strength }, setHistory);
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setCopyState("idle");

    try {
      localStorage.removeItem(INPUT_STORAGE_KEY);
    } catch {}

    inputRef.current?.focus();
  }

  async function handleCopy() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopyState("done");
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = output;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopyState("done");
      } catch {
        setCopyState("idle");
      }
    }
  }

  function handleDownload() {
    if (!output) return;

    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "toolslify-humanized-text.txt";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  function restoreHistory(item) {
    setInput(item.input);
    setOutput(item.output);
    setTone(item.tone);
    setStrength(item.strength);
    inputRef.current?.focus();
  }

  function handleKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      handleRewrite();
    }
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-6"
        >
          <Badge tone="accent">SEO-ready rewrite workflow</Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Humanize AI writing with the polish of a real SaaS tool.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
              Refine robotic drafts into cleaner, more natural copy with tone controls, rewrite depth, side-by-side review, and saved history built right into the editor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <Badge>Ctrl + Enter to rewrite</Badge>
            <Badge>Auto-saves your draft</Badge>
            <Badge>Last 5 results in history</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {featureCards.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.4 }}
              >
                <Card className="h-full p-5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{item.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
        >
          <Card className="overflow-hidden border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--surface),var(--surface-elevated))] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">At-a-glance impact</p>
                <p className="mt-2 max-w-sm text-sm leading-7 text-[var(--muted-foreground)]">
                  Watch readability, length, and structural change update as soon as you generate a refined version.
                </p>
              </div>
              <Badge tone="success">Live metrics</Badge>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <MetricTile label="Input words" value={String(inputMetrics.words)} />
              <MetricTile label="Output words" value={String(outputMetrics.words)} />
              <MetricTile label="Readability" value={output ? `${outputMetrics.readabilityScore}` : `${inputMetrics.readabilityScore}`} />
              <MetricTile label="Reading time" value={`${output ? outputMetrics.readingMinutes : inputMetrics.readingMinutes} min`} />
            </div>

            <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Editor guidance</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                Use a full paragraph for the cleanest rewrite, then switch to compare mode to confirm which words changed before you publish.
              </p>
            </div>
          </Card>
        </motion.div>
      </section>

      <section id="tool">
        <Card className="overflow-hidden border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--surface),var(--surface-elevated))] p-5 sm:p-7">
          <div className="flex flex-col gap-6 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <Badge tone="accent">Humanize AI Free</Badge>
              <div>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  Rewrite with more control and less friction.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
                  Tune tone, select rewrite strength, toggle compare mode, and keep every strong draft close by in local history.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge>{inputMetrics.words} words in draft</Badge>
              <Badge>{outputMetrics.characters} characters out</Badge>
              <Badge>{lastSavedAt ? `Saved ${formatRelativeTime(lastSavedAt)}` : "Autosave ready"}</Badge>
            </div>
          </div>

          <div className="mt-7 grid gap-8 xl:grid-cols-[1fr_320px]">
            <div className="space-y-7">
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                <ControlGroup label="Tone" help="Choose the voice your rewrite should land in.">
                  <SegmentedOptions options={toneOptions} value={tone} onChange={setTone} />
                </ControlGroup>
                <ControlGroup label="Rewrite strength" help="Higher strength applies deeper phrasing changes.">
                  <SegmentedOptions options={strengthOptions} value={strength} onChange={setStrength} />
                </ControlGroup>
                <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">Compare mode</p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">Side-by-side review with changed words highlighted.</p>
                    </div>
                    <Toggle checked={compareMode} onCheckedChange={setCompareMode} label="Toggle compare mode" />
                  </div>
                </div>
              </div>

              <div className={cn("grid gap-6", compareMode ? "lg:grid-cols-2" : "lg:grid-cols-[1fr_1fr]")}>
                <Panel
                  title="Original draft"
                  description="Paste the text you want to rewrite."
                  metrics={inputMetrics}
                >
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste your AI-generated text here, then press Ctrl + Enter to rewrite it."
                  />
                </Panel>

                <Panel
                  title={compareMode ? "Rewritten draft" : "Output"}
                  description={compareMode ? "Review the changes word by word before you copy." : "Your rewritten text appears here."}
                  metrics={outputMetrics}
                >
                  {isLoading ? <LoadingPreview /> : <OutputPanel output={output} compareMode={compareMode} diffSegments={diffSegments} />}
                </Panel>
              </div>

              <div className="flex flex-col gap-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => handleRewrite()} disabled={isLoading || !input.trim()} size="lg">
                    {isLoading ? "Rewriting..." : "Rewrite text"}
                  </Button>
                  <Button variant="secondary" onClick={() => handleRewrite({ variation: true })} disabled={isLoading || !input.trim()} size="lg">
                    Generate variation
                  </Button>
                  <Button variant="secondary" onClick={handleCopy} disabled={!output} size="lg">
                    {copyState === "done" ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="secondary" onClick={handleDownload} disabled={!output} size="lg">
                    Download .txt
                  </Button>
                  <Button variant="ghost" onClick={handleClear} disabled={!input && !output} size="lg">
                    Clear
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge tone="accent">{(output || input) ? `${(output || input).trim().split(/\s+/).filter(Boolean).length} total words` : "No text yet"}</Badge>
                  <Badge>{output ? outputMetrics.readabilityLabel : inputMetrics.readabilityLabel}</Badge>
                  <Badge>{output ? outputMetrics.complexity : inputMetrics.complexity}</Badge>
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <Card className="p-5">
                <p className="text-sm font-semibold text-[var(--foreground)]">Recent outputs</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  The last five rewrites stay in local history so you can restore a strong version instantly.
                </p>
                <HistoryList history={history} onRestore={restoreHistory} />
              </Card>

              <Card className="p-5">
                <p className="text-sm font-semibold text-[var(--foreground)]">Current output profile</p>
                <div className="mt-4 grid gap-3">
                  <MetricRow label="Word count" value={String(outputMetrics.words || inputMetrics.words)} />
                  <MetricRow label="Character count" value={String(outputMetrics.characters || inputMetrics.characters)} />
                  <MetricRow label="Readability score" value={String(output ? outputMetrics.readabilityScore : inputMetrics.readabilityScore)} />
                  <MetricRow label="Readability label" value={output ? outputMetrics.readabilityLabel : inputMetrics.readabilityLabel} />
                </div>
              </Card>
            </aside>
          </div>
        </Card>
      </section>
    </div>
  );
}

const MetricTile = memo(function MetricTile({ label, value }) {
  return (
    <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{value}</p>
    </div>
  );
});

function Panel({ title, description, metrics, children }) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2 text-xs text-[var(--muted-foreground)]">
          <Badge>{metrics.words} words</Badge>
          <Badge>{metrics.characters} chars</Badge>
        </div>
      </div>
      {children}
    </div>
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

const OutputPanel = memo(function OutputPanel({ output, compareMode, diffSegments }) {
  if (!output) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-[24px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-elevated)] px-6 text-center text-sm leading-7 text-[var(--muted-foreground)]">
        Your rewritten draft will appear here with clean formatting, copy controls, and compare-ready highlighting.
      </div>
    );
  }

  if (!compareMode) {
    return (
      <div className="min-h-[240px] rounded-[24px] border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-5 py-4 text-[15px] leading-7 text-[var(--foreground)] whitespace-pre-wrap">
        {output}
      </div>
    );
  }

  return (
    <div className="min-h-[240px] rounded-[24px] border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-5 py-4 text-[15px] leading-7 text-[var(--foreground)] whitespace-pre-wrap">
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
          animate={{ opacity: [0.35, 1, 0.35], scaleX: [0.96, 1, 0.96] }}
          transition={{ repeat: Infinity, duration: 1.3, delay: index * 0.08 }}
          style={{ width: `${100 - index * 9}%`, transformOrigin: "left center" }}
        />
      ))}
    </div>
  );
});

const HistoryList = memo(function HistoryList({ history, onRestore }) {
  if (!history.length) {
    return (
      <div className="mt-4 rounded-[20px] border border-dashed border-[var(--border-strong)] px-4 py-5 text-sm leading-7 text-[var(--muted-foreground)]">
        No saved outputs yet. Generate a rewrite and it will appear here automatically.
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

function persistHistory(entry, setHistory) {
  const nextEntry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    ...entry,
  };

  setHistory((current) => {
    const next = [nextEntry, ...current].slice(0, 5);

    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
    } catch {}

    return next;
  });
}

