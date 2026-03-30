import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { getAllTools } from "@/lib/site-data";

const seoLinks = [
  { href: "/humanize-ai-text", label: "Humanize AI Text" },
  { href: "/ai-humanizer-free", label: "AI Humanizer Free" },
  { href: "/ai-paraphraser", label: "AI Paraphraser" },
  { href: "/rewrite-ai-text", label: "Rewrite AI Text" },
];

export function SiteFooter() {
  const tools = getAllTools();

  return (
    <footer className="relative border-t border-[var(--border)] bg-[linear-gradient(180deg,var(--surface),rgba(255,255,255,0.75))] dark:bg-[linear-gradient(180deg,var(--surface),rgba(3,7,18,0.84))]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.8fr] lg:px-8">
        <div className="space-y-5">
          <BrandMark />
          <p className="max-w-md text-sm leading-7 text-[var(--muted-foreground)]">
            Toolslify is a polished AI utility suite for people who want fast results, clean interfaces, and zero confusion between input, action, and export.
          </p>
          <p className="text-sm font-medium text-[var(--foreground)]">No data stored after processing.</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Tools</p>
          <div className="mt-4 space-y-3">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.path}
                className="block text-sm text-[var(--foreground)] transition hover:text-[var(--accent-end)]"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">SEO Pages</p>
          <div className="mt-4 space-y-3">
            {seoLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-[var(--foreground)] transition hover:text-[var(--accent-end)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Company</p>
          <div className="mt-4 space-y-3">
            <Link href="/" className="block text-sm text-[var(--foreground)] transition hover:text-[var(--accent-end)]">
              Home
            </Link>
            <Link href="/tools" className="block text-sm text-[var(--foreground)] transition hover:text-[var(--accent-end)]">
              Tool suite
            </Link>
            <Link href="/privacy" className="block text-sm text-[var(--foreground)] transition hover:text-[var(--accent-end)]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="block text-sm text-[var(--foreground)] transition hover:text-[var(--accent-end)]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
