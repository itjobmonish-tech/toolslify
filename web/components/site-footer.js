import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/humanize-ai-free", label: "Humanize AI Free" },
  { href: "/#features", label: "Features" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-12 sm:px-6 lg:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Toolslify
          </p>
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            Cleaner AI-assisted writing without the template feel.
          </h2>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            Rewrite drafts, compare changes, and keep your best outputs close at hand with a focused SaaS workflow.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

