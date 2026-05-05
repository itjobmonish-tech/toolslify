"use client";

import { forwardRef } from "react";
import { useTranslatedValue } from "@/lib/runtime-localization";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef(function Textarea({ className, placeholder, ...props }, ref) {
  const translatedPlaceholder = useTranslatedValue(placeholder || "");

  return (
    <textarea
      ref={ref}
      placeholder={translatedPlaceholder}
      className={cn(
        "workspace-editor min-h-[260px] w-full resize-none px-5 pb-6 pt-[58px] text-[15px] font-medium leading-7 tracking-[-0.01em] text-[var(--foreground)] outline-none transition duration-300 placeholder:text-[#8390a3] hover:border-[var(--border-strong)] focus:border-[var(--primary)] sm:px-6 sm:pb-7 sm:pt-[60px]",
        className,
      )}
      {...props}
    />
  );
});
