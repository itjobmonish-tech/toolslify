export const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "hi", label: "HI" },
];

export const UI_TEXT = {
  en: {
    startFree: "Start Free",
    openSuite: "Open suite",
    language: "Language",
    theme: "Theme",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    clear: "Clear",
    history: "History",
    noDataStored: "No data stored",
    light: "Light",
    dark: "Dark",
  },
  es: {
    startFree: "Comenzar gratis",
    openSuite: "Abrir suite",
    language: "Idioma",
    theme: "Tema",
    copy: "Copiar",
    copied: "Copiado",
    download: "Descargar",
    clear: "Limpiar",
    history: "Historial",
    noDataStored: "Sin datos guardados",
    light: "Claro",
    dark: "Oscuro",
  },
  hi: {
    startFree: "Free shuru karein",
    openSuite: "Suite kholen",
    language: "Bhasha",
    theme: "Theme",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    clear: "Clear",
    history: "History",
    noDataStored: "Data save nahin hota",
    light: "Light",
    dark: "Dark",
  },
};

export function getUIText(language) {
  return UI_TEXT[language] || UI_TEXT.en;
}
