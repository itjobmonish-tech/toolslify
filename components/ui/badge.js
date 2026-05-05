"use client";

import { useTranslatedValue } from "@/lib/runtime-localization";
import { cn } from "@/lib/utils";

export function Badge({ className, children, tone = "default" }) {
  const translatedChildren = useTranslatedValue(typeof children === "string" ? children : "");
  const tones = {
    default:
      "border-[var(--border)] bg-[linear-gradient(180deg,var(--background-strong),var(--surface-elevated))] text-[var(--muted-foreground)]",
    accent:
      "border-[var(--primary-edge)] bg-[color:color-mix(in_srgb,var(--primary-soft)_82%,white)] text-[var(--accent-stronger)]",
    success: "border-[rgba(22,130,93,0.28)] bg-[rgba(22,130,93,0.12)] text-[var(--success)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[999px] border px-2.5 py-1 text-[11px] font-semibold shadow-[0_12px_26px_-24px_rgba(15,23,42,0.5)]",
        tones[tone],
        className,
      )}
    >
      {typeof children === "string" ? translatedChildren : children}
    </span>
  );
}
