"use client";

import { usePreferences } from "@/components/providers/preferences-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }) {
  const { theme, setTheme, text } = usePreferences();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label="Toggle color theme"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--muted-foreground)] shadow-[var(--shadow-soft)] transition hover:border-[var(--accent-edge)] hover:text-[var(--foreground)]",
        className,
      )}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-[var(--foreground)]" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
        {theme === "dark" ? text.dark : text.light}
      </span>
    </button>
  );
}
