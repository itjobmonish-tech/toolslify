import { cn } from "@/lib/utils";

export function BrandMark({ className, compact = false }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[18px] border border-white/20 bg-[linear-gradient(140deg,var(--accent-start),var(--accent-end))] text-sm font-black text-white shadow-[0_22px_50px_-24px_rgba(8,15,28,0.65)]">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_46%)]" />
        <span className="relative">TL</span>
      </span>
      {!compact ? (
        <span className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--muted-foreground)]">
            Toolslify
          </span>
          <span className="text-sm font-semibold text-[var(--foreground)]">
            Premium AI utility suite
          </span>
        </span>
      ) : null}
    </div>
  );
}
