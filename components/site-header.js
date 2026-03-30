"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/providers/preferences-provider";
import { NAV_ITEMS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { text } = usePreferences();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color:var(--header-bg)]/80 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <ThemeToggle />
          <Button as={Link} href="/tools/ai-humanizer" size="sm">
            {text.startFree}
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-strong)] text-[var(--foreground)] md:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle mobile menu"
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span className={cn("h-0.5 w-5 rounded-full bg-current transition", isOpen && "translate-y-2 rotate-45")} />
            <span className={cn("h-0.5 w-5 rounded-full bg-current transition", isOpen && "opacity-0")} />
            <span className={cn("h-0.5 w-5 rounded-full bg-current transition", isOpen && "-translate-y-2 -rotate-45")} />
          </span>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)]"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <Button as={Link} href="/tools/ai-humanizer" onClick={() => setIsOpen(false)}>
              {text.startFree}
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
