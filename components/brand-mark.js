import { cn } from "@/lib/utils";

export function BrandMark({ className, compact = false }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#c24f3a,#9f3526)] shadow-[0_18px_34px_-22px_rgba(179,64,46,0.42)]">
        <span className="absolute left-[8px] top-[8px] h-4 w-4 rounded-[6px] bg-white/22" />
        <span className="absolute bottom-[7px] right-[7px] h-5 w-5 rounded-[7px] border border-white/30 bg-white/12" />
        <span className="relative text-[10px] font-black uppercase tracking-[0.24em] text-white">TL</span>
      </span>

      {compact ? (
        <span className="flex flex-col leading-none">
          <span className="text-[1.3rem] font-black tracking-[-0.08em] text-[#171a24]">Toolslify</span>
          <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#7d8496]">
            Online Tools
          </span>
        </span>
      ) : (
        <span className="flex flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Toolslify
          </span>
          <span className="text-sm font-semibold text-[var(--foreground)]">
            Practical browser tools for everyday decisions
          </span>
        </span>
      )}
    </div>
  );
}
