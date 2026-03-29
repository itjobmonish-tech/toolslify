import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "All Tools" },
  { href: "/tools/humanize-ai-free", label: "AI Humanizer" },
  { href: "/tools/ai-email-writer", label: "AI Email Writer" },
  { href: "/tools/resume-bullet-generator", label: "Resume Bullet Generator" },
  { href: "/tools/cover-letter-generator", label: "Cover Letter Generator" },
  { href: "/tools/instagram-caption-generator", label: "Instagram Caption Generator" },
  { href: "/tools/tweet-rewriter", label: "Tweet Rewriter" },
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
            Long-form tool pages built for rankings, retention, and better product trust.
          </h2>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            Browse AI writing, career, and social media tools with richer content, semantic structure, internal linking, and cleaner user workflows.
          </p>
        </div>

        <div className="flex max-w-2xl flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
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
