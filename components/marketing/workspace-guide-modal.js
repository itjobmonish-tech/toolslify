"use client";

import Link from "next/link";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function WorkspaceGuideModal({ tool }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        See 30-sec walkthrough
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`${tool.shortName} quick start`}
        description="This lightweight guide keeps the path obvious for first-time users: one input, one action, then a clean result with export controls."
        footer={[
          <Button key="start" as={Link} href="#workspace" onClick={() => setOpen(false)}>
            Jump to workspace
          </Button>,
          <Button key="suite" as={Link} href="/tools" variant="secondary" onClick={() => setOpen(false)}>
            Browse all tools
          </Button>,
        ]}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <GuideCard
            step="01"
            title={tool.inputTitle}
            body={`Start with ${tool.inputTitle.toLowerCase()}. Keep the source clear and complete so the output has enough context to be useful.`}
          />
          <GuideCard
            step="02"
            title={tool.ctaLabel}
            body={`Run ${tool.shortName.toLowerCase()} once, watch the progress feedback, and stay on the same screen while the result is prepared.`}
          />
          <GuideCard
            step="03"
            title={tool.outputTitle}
            body={`Review the output, copy or download it, and use local history if you want to compare versions later.`}
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Best for</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tool.useCases.slice(0, 3).map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>

          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">Trust signals</p>
            <div className="mt-3 grid gap-2">
              <Badge tone="accent">No login required to start</Badge>
              <Badge tone="accent">Inputs processed in memory</Badge>
              <Badge tone="accent">Copy and download built in</Badge>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function GuideCard({ step, title, body }) {
  return (
    <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{step}</p>
      <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{body}</p>
    </div>
  );
}
