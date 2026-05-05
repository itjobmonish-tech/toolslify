"use client";

import { useEffect, useState } from "react";
import { ToolCard } from "@/components/marketing/tool-card";
import { getRecentToolUsage } from "@/lib/tool-usage";

export function RecentlyUsedTools({ toolsBySlug }) {
  const [recentTools, setRecentTools] = useState([]);

  useEffect(() => {
    const usage = getRecentToolUsage(3)
      .map((item) => toolsBySlug[item.slug])
      .filter(Boolean);

    setRecentTools(usage);
  }, [toolsBySlug]);

  if (!recentTools.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-5 py-10 text-center">
        <p className="text-lg font-semibold text-[var(--foreground)]">Your recently used tools will show up here</p>
        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
          Run any tool once and Toolslify will keep the last few tools close so returning users can jump back in without searching again.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {recentTools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} actionLabel="Recent tool" compact />
      ))}
    </div>
  );
}
