"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Modal({ open, onClose, title, description, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center px-4 py-6 sm:items-center sm:px-6 lg:px-8">
          <motion.button
            type="button"
            className="absolute inset-0 bg-[rgba(10,17,30,0.52)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close modal"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-[1] w-full max-w-2xl rounded-[22px] border border-[var(--border-strong)] bg-[var(--surface-raised)] p-5 shadow-[var(--shadow-soft)] sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 id="modal-title" className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {title}
                </h2>
                {description ? (
                  <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">{description}</p>
                ) : null}
              </div>
              <Button variant="ghost" size="sm" className="h-9 min-w-9 px-2" onClick={onClose}>
                Close
              </Button>
            </div>
            <div className="mt-5">{children}</div>
            {footer ? <div className="mt-6 flex flex-wrap gap-3">{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
