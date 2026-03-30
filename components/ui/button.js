import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "border border-white/10 bg-[linear-gradient(135deg,var(--accent-start),var(--accent-end))] text-white shadow-[0_24px_54px_-24px_rgba(9,17,31,0.5)] hover:-translate-y-0.5 hover:brightness-105",
  secondary:
    "border border-[var(--border-strong)] bg-[linear-gradient(180deg,var(--surface-raised),var(--surface-strong))] text-[var(--foreground)] shadow-[0_20px_40px_-34px_rgba(9,17,31,0.3)] hover:-translate-y-0.5 hover:border-[var(--accent-edge)] hover:bg-[var(--surface-raised)]",
  ghost: "text-[var(--muted-foreground)] hover:bg-[var(--surface-strong)] hover:text-[var(--foreground)]",
};

const SIZES = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
};

export const Button = forwardRef(function Button(
  { className, variant = "primary", size = "md", type = "button", as: Component = "button", ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      {...(Component === "button" ? { type } : {})}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
