import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "border border-[color:color-mix(in_srgb,var(--primary)_74%,rgba(20,32,51,0.14))] bg-[var(--primary)] text-white shadow-[0_10px_20px_-18px_rgba(36,56,92,0.18)] hover:-translate-y-0.5 hover:bg-[color:color-mix(in_srgb,var(--primary)_88%,#1b2d45_12%)] hover:shadow-[0_14px_24px_-18px_rgba(36,56,92,0.2)]",
  secondary:
    "border border-[var(--border)] bg-white text-[var(--foreground)] shadow-[0_8px_18px_-18px_rgba(36,56,92,0.1)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)] hover:shadow-[0_12px_22px_-18px_rgba(36,56,92,0.12)]",
  ghost:
    "text-[var(--muted-foreground)] hover:-translate-y-0.5 hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
};

const SIZES = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-4.5 text-sm",
  lg: "h-12 px-5 text-sm",
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
        "inline-flex max-w-full items-center justify-center gap-2 rounded-[14px] text-center font-semibold whitespace-normal transition duration-300 ease-out will-change-transform disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
