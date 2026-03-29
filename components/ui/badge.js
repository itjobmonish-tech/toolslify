import { cn } from "@/lib/utils";

export function Badge({ className, children, tone = "default" }) {
  const tones = {
    default: "border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--muted-foreground)]",
    accent: "border-[var(--accent-soft)] bg-[var(--accent-faint)] text-[var(--accent-stronger)]",
    success: "border-[rgba(22,163,74,0.18)] bg-[rgba(22,163,74,0.12)] text-[rgb(21,128,61)] dark:text-[rgb(74,222,128)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.02em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

