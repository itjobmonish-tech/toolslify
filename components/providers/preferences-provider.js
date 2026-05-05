"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { formatUiText, getUIText, LANGUAGES } from "@/lib/i18n";

const THEME_STORAGE_KEY = "toolslify-theme";
const LANGUAGE_STORAGE_KEY = "toolslify-language";

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const root = document.documentElement;
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const browserLanguage = (navigator.language || "en").slice(0, 2).toLowerCase();
    const supportedLanguage = LANGUAGES.some((item) => item.code === browserLanguage) ? browserLanguage : "en";
    const nextLanguage = savedLanguage || supportedLanguage;

    root.dataset.theme = "light";
    root.classList.remove("dark");
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    setTheme("light");
    setLanguage(nextLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${language}; path=/; max-age=31536000`;
  }, [language]);

  function updateTheme(nextTheme) {
    const root = document.documentElement;
    root.dataset.theme = "light";
    root.classList.remove("dark");
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    setTheme("light");
  }

  function updateLanguage(nextLanguage) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setLanguage(nextLanguage);
  }

  const value = useMemo(
    () => ({
      t: (key, replacements) => formatUiText(getUIText(language)[key] || key, replacements),
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
