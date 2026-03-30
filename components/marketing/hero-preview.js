"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const comparisonRows = [
  { before: "In addition, the platform facilitates optimization.", after: "It also helps teams improve the way they work." },
  { before: "Users can utilize the feature for maximum efficiency.", after: "Teams can use the feature to move faster day to day." },
  { before: "The solution demonstrates improved consistency.", after: "The workflow stays clearer and more consistent." },
];

export function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="relative"
    >
      <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[rgba(18,63,116,0.18)] blur-3xl" />
      <div className="absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-[rgba(20,184,166,0.16)] blur-3xl" />

      <Card className="relative overflow-hidden border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--surface-raised),var(--surface))] p-5 sm:p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.85),transparent)]" />
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
          <div>
            <Badge tone="accent">Live product demo</Badge>
            <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Three simple steps</h3>
          </div>
          <div className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            No data stored
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <StepCard index="01" title="Paste AI text" body="Drop in the source draft, notes, or raw transcript." />
            <StepCard index="02" title="Choose a tool action" body="Humanize, summarize, convert, or generate the output you need." />
            <StepCard index="03" title="Review and export" body="Copy or download the result once the clean version is ready." />
          </div>

          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">AI Humanizer preview</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Before and after comparison with highlighted changes.
                </p>
              </div>
              <Badge tone="success">More human</Badge>
            </div>

            <div className="mt-5 space-y-3">
              {comparisonRows.map((row, index) => (
                <motion.div
                  key={row.before}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + index * 0.1, duration: 0.35 }}
                  className="grid gap-2 rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-3 sm:grid-cols-2"
                >
                  <div className="rounded-[18px] bg-[var(--surface-strong)] px-3 py-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {row.before}
                  </div>
                  <div className="rounded-[18px] bg-[var(--accent-surface)] px-3 py-2 text-sm leading-6 text-[var(--foreground)]">
                    {row.after}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric label="AI score" value="31%" />
              <Metric label="Words" value="228" />
              <Metric label="Readability" value="Balanced" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function StepCard({ index, title, body }) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{index}</p>
      <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{body}</p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}
