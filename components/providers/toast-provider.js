"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslatedValues } from "@/lib/runtime-localization";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function dismissToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function showToast({
    title,
    description,
    tone = "default",
    duration = 3200,
  }) {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const nextToast = { id, title, description, tone };

    setToasts((current) => [...current, nextToast].slice(-4));

    window.setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  const value = useMemo(
    () => ({
      dismissToast,
      showToast,
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex justify-end sm:inset-x-6 lg:inset-x-8">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <AnimatePresence initial={false}>
            {toasts.map((toast) => (
              <ToastCard key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);

  if (!value) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return value;
}

function ToastCard({ toast, onDismiss }) {
  const translatedText = useTranslatedValues([toast.title || "", toast.description || ""]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.98 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "pointer-events-auto rounded-[18px] border bg-[var(--surface-raised)] p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl",
        toast.tone === "success"
          ? "border-[rgba(34,197,94,0.22)]"
          : toast.tone === "warning"
            ? "border-[rgba(245,158,11,0.26)]"
            : "border-[var(--border-strong)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">{translatedText[0] || toast.title}</p>
          {toast.description ? (
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">{translatedText[1] || toast.description}</p>
          ) : null}
        </div>
        <Button variant="ghost" size="sm" className="h-8 min-w-8 px-2" onClick={onDismiss}>
          Close
        </Button>
      </div>
    </motion.div>
  );
}
