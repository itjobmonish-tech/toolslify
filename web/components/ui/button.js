"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-[var(--accent-strong)] text-white shadow-[0_20px_45px_-24px_rgba(15,23,42,0.75)] hover:-translate-y-0.5 hover:bg-[var(--accent-stronger)]",
  secondary: "border border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--foreground)] hover:-translate-y-0.5 hover:border-[var(--accent-soft)] hover:bg-[var(--surface-raised)]",
  ghost: "text-[var(--muted-foreground)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]",
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
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});

