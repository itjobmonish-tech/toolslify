import { cn } from "@/lib/utils";

export function Card({ className, children, as: Component = "div" }) {
  return (
    <Component
      className={cn(
        "rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_25px_80px_-45px_rgba(15,23,42,0.45)] backdrop-blur",
        className,
      )}
    >
      {children}
    </Component>
  );
}

