"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { humanizeText, analyzeText, createSeededRandom, estimateAiDetectionScore } from "@/lib/humanizer";

const SAMPLE_INPUT =
  "Our tool helps teams write clearer updates, improve handoffs, and keep communication simple without adding extra steps.";

const toneOptions = [
  { label: "Natural", value: "friendly" },
  { label: "Professional", value: "formal" },
  { label: "Simple", value: "casual" },
];

export function LiveWorkbenchDemo() {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [tone, setTone] = useState("friendly");
  const deferredInput = useDeferredValue(input);

  const output = useMemo(() => {
    if (!deferredInput.trim()) return "";
    return humanizeText(deferredInput, {
      tone,
      strength: "medium",
      random: createSeededRandom(24),
    });
  }, [deferredInput, tone]);

  const inputMetrics = useMemo(() => analyzeText(deferredInput), [deferredInput]);
  const detection = useMemo(
    () => (deferredInput && output ? estimateAiDetectionScore(deferredInput, output) : null),
    [deferredInput, output],
  );

  return (
    <div className="rounded-[16px] border border-[var(--border)] bg-[var(--surface-raised)] p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge tone="accent">Live preview</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Try the rewrite before opening the full tool
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
            Type a sentence, switch the tone, and see the result update instantly before you move into the full workspace.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{inputMetrics.words} words</Badge>
          <Badge>{detection ? `${100 - detection.score}% human score` : "Ready"}</Badge>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {toneOptions.map((option) => {
              const active = option.value === tone;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTone(option.value)}
                  className={
                    active
                      ? "rounded-[10px] border border-[var(--primary)] bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white"
                      : "rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)]"
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Paste AI text here to see the live rewrite."
            className="min-h-[220px] w-full resize-none rounded-[12px] border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-4 text-sm leading-7 text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-ring)]"
          />
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--foreground)]">Preview result</p>
            <Badge tone={detection?.score <= 44 ? "success" : "accent"}>
              {detection?.label || "Ready"}
            </Badge>
          </div>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">
            {output || "Your rewritten result appears here instantly."}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button as={Link} href="/tools/ai-humanizer">
          Open AI Humanizer
        </Button>
        <Button as={Link} href="/tools" variant="secondary">
          Browse all tools
        </Button>
      </div>
    </div>
  );
}
