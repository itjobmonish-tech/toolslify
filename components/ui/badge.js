import { cn } from "@/lib/utils";

export function Badge({ className, children, tone = "default" }) {
  const tones = {
    default: "border-[var(--border-strong)] bg-[rgba(255,255,255,0.72)] text-[var(--muted-foreground)] dark:bg-[rgba(255,255,255,0.04)]",
    accent: "border-[var(--accent-edge)] bg-[var(--accent-surface)] text-[var(--accent-text)]",
    success: "border-[rgba(34,197,94,0.26)] bg-[rgba(34,197,94,0.12)] text-[rgb(22,163,74)] dark:text-[rgb(134,239,172)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
