"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrandMark } from "@/components/brand-mark";
import { ToolGlyph } from "@/components/marketing/tool-glyph";
import { HeaderSettingsPanel } from "@/components/header-settings-panel";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslatedValues } from "@/lib/runtime-localization";
import { getPopularTools, getToolCategoryCollections, NAV_ITEMS } from "@/lib/site-data";
import { getLocalizedCategoryTitle } from "@/lib/tool-categories";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [openMenuHref, setOpenMenuHref] = useState(null);
  const pathname = usePathname();
  const desktopNavRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { text } = usePreferences();
  const navItems = useMemo(() => NAV_ITEMS, []);
  const translatedCtas = useTranslatedValues(["Browse tools", "Open tools", "Calculator tools"]);
  const categoryMenus = useMemo(() => {
    const popularSet = new Set(getPopularTools().map((tool) => tool.slug));

    return getToolCategoryCollections().map((category) => {
      const orderedTools = [...(category.tools || [])].sort((left, right) => {
        const leftPopularScore = popularSet.has(left.slug) ? 1 : 0;
        const rightPopularScore = popularSet.has(right.slug) ? 1 : 0;
        if (leftPopularScore !== rightPopularScore) return rightPopularScore - leftPopularScore;
        return left.name.localeCompare(right.name);
      });

      return {
        href: `/tools#${category.slug}`,
        pagePath: category.pagePath,
        slug: category.slug,
        title: getLocalizedCategoryTitle(category.slug, text, category.title),
        accent: category.accent,
        tint: category.tint,
        featuredTools: orderedTools.slice(0, 5),
        otherTools: orderedTools.slice(5, 13),
      };
    });
  }, [text]);
  const categoryMenuMap = useMemo(
    () => new Map(categoryMenus.map((menu) => [menu.href, menu])),
    [categoryMenus],
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncHash = () => setActiveHash(window.location.hash || "");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    setOpenMenuHref(null);
  }, [pathname, activeHash]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!desktopNavRef.current?.contains(event.target)) {
        setOpenMenuHref(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function isItemActive(item) {
    const [itemPath, itemHash = ""] = item.href.split("#");
    if (pathname !== itemPath && !(pathname?.startsWith("/tools/") && itemPath === "/tools")) {
      return false;
    }

    if (!itemHash) {
      return (pathname === itemPath || pathname?.startsWith("/tools/")) && !activeHash;
    }

    return activeHash === `#${itemHash}`;
  }

  const activeNavHref = useMemo(
    () => navItems.find((item) => isItemActive(item))?.href || null,
    [activeHash, navItems, pathname],
  );
  const visualActiveHref = openMenuHref || activeNavHref;
  const openMenu = openMenuHref ? categoryMenuMap.get(openMenuHref) || null : null;

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.18 : 0.48, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-[rgba(18,24,31,0.08)] bg-[color:color-mix(in_srgb,white_86%,transparent)] shadow-[0_14px_34px_-30px_rgba(15,23,42,0.24)] backdrop-blur-2xl"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-5 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5">
              <BrandMark compact />
            </Link>
            <div className="hidden rounded-full border border-[rgba(18,24,31,0.08)] bg-[rgba(255,255,255,0.82)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#6c7485] shadow-[0_16px_30px_-28px_rgba(15,23,42,0.18)] xl:inline-flex">
              {translatedCtas[2]}
            </div>
          </div>

          <div
            ref={desktopNavRef}
            className="relative hidden lg:block"
            onMouseLeave={() => setOpenMenuHref(null)}
          >
            <motion.nav
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0.18 : 0.5, delay: reduceMotion ? 0 : 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-8 border-b border-[rgba(18,24,31,0.08)] px-2 py-1"
            >
              {navItems.map((item) => {
                const active = visualActiveHref === item.href;
                const menu = categoryMenuMap.get(item.href);

                if (menu) {
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onMouseEnter={() => setOpenMenuHref(item.href)}
                      onFocus={() => setOpenMenuHref(item.href)}
                      onClick={() => setOpenMenuHref((current) => (current === item.href ? null : item.href))}
                      aria-expanded={openMenuHref === item.href}
                      className={cn(
                        "group/nav relative inline-flex items-center gap-2 px-0 py-3 text-[0.96rem] font-semibold uppercase tracking-[0.04em] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        active
                          ? "text-[#b3402e]"
                          : "text-[#2d313d] hover:text-[#b3402e]",
                      )}
                    >
                      <span>
                        {item.labelKey ? text[item.labelKey] || item.label : item.label}
                      </span>
                      <span className="inline-flex">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className={cn(
                            "transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            openMenuHref === item.href && "rotate-180",
                          )}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                      <span
                        className={cn(
                          "pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-center rounded-full bg-current transition duration-300",
                          active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover/nav:scale-x-100 group-hover/nav:opacity-100",
                        )}
                      />
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => setOpenMenuHref(null)}
                    className={cn(
                      "group/nav relative px-0 py-3 text-[0.96rem] font-semibold uppercase tracking-[0.04em] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      active
                        ? "text-[#b3402e]"
                        : "text-[#2d313d] hover:text-[#b3402e]",
                    )}
                  >
                    <span>
                      {item.labelKey ? text[item.labelKey] || item.label : item.label}
                    </span>
                    <span
                      className={cn(
                        "pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-center rounded-full bg-current transition duration-300",
                        active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover/nav:scale-x-100 group-hover/nav:opacity-100",
                      )}
                    />
                  </Link>
                );
              })}
            </motion.nav>

            <AnimatePresence>
              {openMenu ? (
                <motion.div
                  initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: reduceMotion ? 0.18 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 top-[calc(100%+14px)] z-30 w-[min(760px,calc(100vw-4rem))] -translate-x-1/2 rounded-[24px] border border-[rgba(18,24,31,0.08)] bg-[rgba(255,255,255,0.985)] shadow-[0_28px_64px_-38px_rgba(15,23,42,0.22)] backdrop-blur-2xl"
                >
                  <div className="pointer-events-none absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[4px] border-l border-t border-[rgba(18,24,31,0.08)] bg-white" />
                  <div className="grid lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
                    <div className="border-b border-[rgba(18,24,31,0.08)] p-6 lg:border-b-0 lg:border-r">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#7c8597]">
                          Featured {openMenu.title}
                        </p>
                        <Link
                          href={openMenu.pagePath}
                          onClick={() => setOpenMenuHref(null)}
                          className="text-sm font-semibold text-[#b3402e] transition hover:text-[#8d301f]"
                        >
                          All {openMenu.title}
                        </Link>
                      </div>

                      <div className="mt-4 space-y-1">
                        {openMenu.featuredTools.map((tool) => (
                          <Link
                            key={tool.slug}
                            href={tool.path}
                            onClick={() => setOpenMenuHref(null)}
                            className="group flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition hover:bg-[#f7f9fc]"
                          >
                            <span
                              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border"
                              style={{
                                backgroundColor: openMenu.tint || "rgba(18,24,31,0.06)",
                                borderColor: `${openMenu.accent || "#121821"}24`,
                              }}
                            >
                              <ToolGlyph slug={tool.slug} categorySlug={tool.categorySlug} className="h-7 w-7" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[1rem] font-semibold tracking-[-0.02em] text-[#202530]">
                                {tool.name}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#7c8597]">
                        More {openMenu.title}
                      </p>
                      <div className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2">
                        {openMenu.otherTools.map((tool) => (
                          <Link
                            key={tool.slug}
                            href={tool.path}
                            onClick={() => setOpenMenuHref(null)}
                            className="group flex min-h-[42px] items-center justify-between gap-3 rounded-[12px] px-3 py-2 text-[0.98rem] font-medium text-[#202530] transition hover:bg-[#f7f9fc]"
                          >
                            <span className="truncate">{tool.name}</span>
                            <span className="text-[#8a91a2] transition group-hover:translate-x-0.5 group-hover:text-[#202530]">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M5 12h14" />
                                <path d="m13 5 7 7-7 7" />
                              </svg>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tools"
              className="hidden rounded-full border border-transparent px-3 py-2 text-[0.95rem] font-semibold text-[#2d313d] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[rgba(18,24,31,0.08)] hover:bg-[rgba(255,255,255,0.72)] hover:text-[#11151d] sm:inline-flex"
            >
              {translatedCtas[0]}
            </Link>
            <Link
              href="/tools"
              className="hidden rounded-full bg-[#11151d] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_32px_-24px_rgba(15,23,42,0.34)] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#1a202b] hover:shadow-[0_24px_40px_-24px_rgba(15,23,42,0.32)] sm:inline-flex"
            >
              {translatedCtas[1]}
            </Link>
            <HeaderSettingsPanel className="hidden sm:block" />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] text-[#2d313d] transition hover:bg-[rgba(45,49,61,0.05)] lg:hidden"
              onClick={() => setIsOpen((current) => !current)}
              aria-label={text.menu}
            >
              <span className="sr-only">{text.menu}</span>
              <span className="flex flex-col gap-1.5">
                <span className={cn("h-0.5 w-4 rounded-full bg-current transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", isOpen && "translate-y-2 rotate-45")} />
                <span className={cn("h-0.5 w-4 rounded-full bg-current transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", isOpen && "opacity-0")} />
                <span className={cn("h-0.5 w-4 rounded-full bg-current transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", isOpen && "-translate-y-2 -rotate-45")} />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              initial={reduceMotion ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -10 }}
              transition={{ duration: reduceMotion ? 0.18 : 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-[#dfe4ed] lg:hidden"
            >
              <div className="flex flex-col gap-2 py-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0.18 : 0.3, delay: reduceMotion ? 0 : index * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="rounded-[14px] px-3 py-3 text-sm font-semibold text-[#2d313d] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#f4f6fa] hover:translate-x-1"
                    >
                      {item.labelKey ? text[item.labelKey] || item.label : item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0.18 : 0.34, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between pt-2"
                >
                  <Link
                    href="/tools"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full bg-[#11151d] px-4 py-2.5 text-sm font-semibold text-white transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#1a202b]"
                  >
                    {translatedCtas[1]}
                  </Link>
                  <HeaderSettingsPanel />
                </motion.div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
