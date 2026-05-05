import Link from "next/link";
import { Card } from "@/components/ui/card";

export function ToolSidebarLists({ sections }) {
  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.title} className="overflow-hidden rounded-[22px] border-[rgba(18,24,31,0.08)] bg-white/96 shadow-[0_22px_40px_-36px_rgba(15,23,42,0.12)]">
          <div className="border-b border-[rgba(18,24,31,0.08)] bg-[#fbfcfd] px-4 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
              <h3 className="text-[13px] font-semibold text-[var(--foreground)]">{section.title}</h3>
            </div>
          </div>
          <div className="divide-y divide-[rgba(18,24,31,0.06)]">
            {section.items.map((item, index) => (
              <Link
                key={`${section.title}-${item.label}-${item.href}`}
                href={item.href}
                className="flex items-center justify-between gap-3 px-4 py-3.5 text-[13px] leading-6 text-[var(--foreground)] transition hover:bg-[#fbfcfe] hover:text-[var(--primary)]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f3f6fa] text-[10px] font-semibold text-[var(--muted-foreground)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{item.label}</span>
                </span>
                <span className="text-[var(--muted-foreground)]">{"->"}</span>
              </Link>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
