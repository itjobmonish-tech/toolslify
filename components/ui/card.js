import { cn } from "@/lib/utils";

export function Card({ className, children, as: Component = "div" }) {
  return (
    <Component
      className={cn(
        "rounded-[32px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-raised),var(--surface))] shadow-[var(--shadow-soft)] ring-1 ring-white/45 backdrop-blur-2xl dark:ring-white/[0.04]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
