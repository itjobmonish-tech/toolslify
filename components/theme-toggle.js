"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "toolslify-theme";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;
    const initial = root.dataset.theme || "light";
    setTheme(initial);
    setMounted(true);
  }, []);

  function handleToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.dataset.theme = nextTheme;
    root.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleToggle}
      aria-label="Toggle color theme"
      className="h-10 min-w-[108px]"
    >
      <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
        {mounted ? theme : "light"}
      </span>
    </Button>
  );
}

