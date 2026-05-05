"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ToolGlyph } from "@/components/marketing/tool-glyph";
import { cn } from "@/lib/utils";

export function ToolCard({
  tool,
  compact = false,
  featured = false,
  className,
  priority = false,
  index = 0,
}) {
  const title = tool.name;
  const tileAccent = tool.categoryColor || "#b3402e";
  const reduceMotion = useReducedMotion();
  const delay = Math.min(index * 0.035, 0.24);
  const boxVariants = reduceMotion
    ? undefined
    : {
        rest: { y: 0, scale: 1 },
        hover: { y: -5, scale: 1.028 },
        tap: { y: -1, scale: 0.99 },
      };
  const glyphVariants = reduceMotion
    ? undefined
    : {
        rest: { scale: 1, y: 0 },
        hover: { scale: 1.04, y: -1.5 },
        tap: { scale: 0.985, y: 0 },
      };

  return (
    <Link
      href={tool.path}
      className={cn(
        "group block h-full",
        className,
      )}
    >
      <motion.div
        initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: reduceMotion ? 0.2 : 0.42, ease: [0.22, 1, 0.36, 1], delay }}
        className={cn(
          "relative flex h-full flex-col items-center text-center",
          compact ? "gap-5 py-2" : "gap-6 py-3",
        )}
      >
        <motion.span
          initial={false}
          animate="rest"
          whileHover={reduceMotion ? undefined : "hover"}
          whileTap={reduceMotion ? undefined : "tap"}
          variants={boxVariants}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          style={{ "--tool-accent": tileAccent }}
          className={cn(
            "relative flex items-center justify-center overflow-visible rounded-[12px] border border-[rgba(17,21,29,0.08)] bg-white shadow-[0_12px_24px_-20px_rgba(35,40,55,0.1)] transition-[box-shadow,border-color,background-color,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-[rgba(17,21,29,0.16)] group-hover:bg-[#ffffff] group-hover:shadow-[0_18px_28px_-22px_rgba(35,40,55,0.12)]",
            compact ? "h-[98px] w-[98px]" : "h-[116px] w-[116px]",
            featured && "h-[124px] w-[124px]",
            priority && "ring-1 ring-[#eef2f7]",
          )}
        >
          <span className="pointer-events-none absolute inset-[0] rounded-[11px] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(249,250,252,0.92))] opacity-100 transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span className="pointer-events-none absolute inset-[10%] rounded-[8px] bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.92),transparent_42%)] opacity-70 transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100" />
          <span className="pointer-events-none absolute inset-0 rounded-[12px] opacity-0 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-focus-visible:opacity-100">
            <span
              className="absolute left-[-1px] top-[-1px] h-[15px] w-[15px] rounded-tl-[12px] border-l-[1.5px] border-t-[1.5px]"
              style={{ borderColor: "var(--tool-accent)" }}
            />
            <span
              className="absolute bottom-[-1px] right-[-1px] h-[15px] w-[15px] rounded-br-[12px] border-b-[1.5px] border-r-[1.5px]"
              style={{ borderColor: "var(--tool-accent)" }}
            />
          </span>
          <motion.span
            variants={glyphVariants}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 inline-flex items-center justify-center"
          >
            <ToolGlyph
              slug={tool.slug}
              categorySlug={tool.categorySlug}
              className={cn(featured ? "h-[96px] w-[96px]" : compact ? "h-[84px] w-[84px]" : "h-[92px] w-[92px]")}
            />
          </motion.span>
        </motion.span>

        <motion.h3
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "max-w-[16ch] font-medium tracking-[-0.04em] text-[#262b36] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:text-[#11151d]",
            featured ? "text-[1.08rem] leading-[1.24]" : compact ? "text-[1.02rem] leading-[1.28]" : "text-[1.08rem] leading-[1.26]",
          )}
        >
          {title}
        </motion.h3>
      </motion.div>
    </Link>
  );
}
