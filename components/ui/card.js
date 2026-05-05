import { cn } from "@/lib/utils";

export function Card({ className, children, as: Component = "div", ...props }) {
  return (
    <Component
      className={cn(
        "card-surface rounded-[20px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--background-strong),var(--surface-elevated))] shadow-[var(--shadow-soft)] backdrop-blur-[10px]",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
