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
        "relative inline-flex h-8 w-14 items-center rounded-full border transition duration-300",
        checked
          ? "border-[var(--primary)] bg-[var(--primary)]"
          : "border-[var(--border)] bg-white",
        className,
      )}
    >
      <span
        className={cn(
          "block h-6 w-6 rounded-full border border-[#dbe3ef] bg-white transition duration-300",
          checked ? "translate-x-7" : "translate-x-1",
        )}
      />
    </button>
  );
}
