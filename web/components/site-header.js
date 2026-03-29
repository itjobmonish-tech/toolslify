import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/tools", label: "Tools" },
  { href: "/tools/humanize-ai-free", label: "AI Humanizer" },
  { href: "/tools/ai-email-writer", label: "AI Email Writer" },
  { href: "/#featured-tools", label: "Featured" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color:var(--header-bg)]/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-strong),var(--accent-soft))] text-sm font-semibold text-white shadow-[0_18px_36px_-20px_rgba(37,99,235,0.75)]">
            TS
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-[0.18em] text-[var(--foreground)] uppercase">
              Toolslify
            </span>
            <span className="block text-sm text-[var(--muted-foreground)]">
              Search-ready AI tools
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-[var(--muted-foreground)] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/tools"
            className="inline-flex h-10 items-center rounded-full bg-[var(--foreground)] px-4 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
          >
            View tools
          </Link>
        </div>
      </div>
    </header>
  );
}
