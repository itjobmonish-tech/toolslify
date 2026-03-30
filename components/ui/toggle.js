"use client";

import { cn } from "@/lib/utils";

export function Toggle({ checked, onCheckedChange, label, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full border transition duration-200",
        checked
          ? "border-transparent bg-[linear-gradient(135deg,var(--accent-start),var(--accent-end))]"
          : "border-[var(--border-strong)] bg-[var(--surface-strong)]",
        className,
      )}
    >
      <span
        className={cn(
          "block h-5 w-5 rounded-full bg-white shadow-sm transition duration-200",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}
