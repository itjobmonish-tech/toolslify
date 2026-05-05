"use client";

import { usePreferences } from "@/components/providers/preferences-provider";
import { LANGUAGES } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageAvailability({ className, compact = false }) {
  const { language, text } = usePreferences();

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
        {compact ? text.availableShort : text.availableLanguages}
      </p>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((item) => {
          const active = item.code === language;
          return (
            <span
              key={item.code}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                active
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                  : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--muted-foreground)]",
              )}
            >
              <span>{item.label}</span>
              <span>{item.nativeName}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
