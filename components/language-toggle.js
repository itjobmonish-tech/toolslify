"use client";

import { LANGUAGES } from "@/lib/i18n";
import { usePreferences } from "@/components/providers/preferences-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }) {
  const { language, setLanguage } = usePreferences();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] p-1 shadow-[var(--shadow-soft)]",
        className,
      )}
      aria-label="Choose interface language"
    >
      {LANGUAGES.map((item) => {
        const active = item.code === language;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] transition",
              active
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
