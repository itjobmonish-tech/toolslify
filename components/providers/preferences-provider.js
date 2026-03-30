"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUIText } from "@/lib/i18n";

const THEME_STORAGE_KEY = "toolslify-theme";
const LANGUAGE_STORAGE_KEY = "toolslify-language";

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const root = document.documentElement;
    const initialTheme = root.dataset.theme || "light";
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";

    setTheme(initialTheme);
    setLanguage(savedLanguage);
  }, []);

  function updateTheme(nextTheme) {
    const root = document.documentElement;
    root.dataset.theme = nextTheme;
    root.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  function updateLanguage(nextLanguage) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setLanguage(nextLanguage);
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage: updateLanguage,
      theme,
      setTheme: updateTheme,
      text: getUIText(language),
    }),
    [language, theme],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferencesContext);

  if (!value) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }

  return value;
}
