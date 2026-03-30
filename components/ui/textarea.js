"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[250px] w-full resize-none rounded-[28px] border border-[var(--border-strong)] bg-[var(--surface-strong)] px-5 py-4 text-[15px] leading-7 text-[var(--foreground)] outline-none transition duration-200 placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent-edge)] focus:bg-[var(--surface-raised)] focus:ring-4 focus:ring-[var(--accent-ring)]",
        className,
      )}
      {...props}
    />
  );
});
