"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[240px] w-full resize-none rounded-[24px] border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-5 py-4 text-[15px] leading-7 text-[var(--foreground)] outline-none transition duration-200 placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent-soft)] focus:bg-[var(--surface)] focus:ring-4 focus:ring-[var(--accent-ring)]",
        className,
      )}
      {...props}
    />
  );
});

