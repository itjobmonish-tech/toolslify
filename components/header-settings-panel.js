"use client";

import { useEffect, useRef, useState } from "react";
import { LANGUAGES } from "@/lib/i18n";
import { usePreferences } from "@/components/providers/preferences-provider";
import { cn } from "@/lib/utils";

export function HeaderSettingsPanel({ className }) {
  const { language, setLanguage, text } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event) {
      if (!panelRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={panelRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={text.settings}
        aria-expanded={isOpen}
        className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] text-[#2d313d] transition hover:bg-[rgba(45,49,61,0.05)]"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
          <circle cx="3" cy="3" r="1.2" />
          <circle cx="9" cy="3" r="1.2" />
          <circle cx="15" cy="3" r="1.2" />
          <circle cx="3" cy="9" r="1.2" />
          <circle cx="9" cy="9" r="1.2" />
          <circle cx="15" cy="9" r="1.2" />
          <circle cx="3" cy="15" r="1.2" />
          <circle cx="9" cy="15" r="1.2" />
          <circle cx="15" cy="15" r="1.2" />
        </svg>
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-full z-50 mt-3 max-h-[70vh] overflow-y-auto rounded-[20px] border border-[#d8dde7] bg-white p-4 shadow-[0_24px_46px_-30px_rgba(33,35,44,0.22)]"
          style={{ width: "min(92vw, 320px)" }}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#858d9f]">
              {text.language}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {LANGUAGES.map((item) => {
                const active = item.code === language;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLanguage(item.code)}
                    className={cn(
                      "rounded-[14px] border px-3 py-3 text-left transition",
                      active
                        ? "border-[#cf7b69] bg-[#b3402e] text-white"
                        : "border-[#d8dde7] bg-[#fbfbfd] text-[#2d313d] hover:border-[#cad1de] hover:bg-white",
                    )}
                  >
                    <span className="block text-sm font-semibold">{item.nativeName || item.name}</span>
                    <span className={cn("mt-1 block text-xs", active ? "text-[#f2cec8]" : "text-[#7a8294]")}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
