"use client";

import Link from "next/link";
import { LanguageAvailability } from "@/components/marketing/language-availability";
import { usePreferences } from "@/components/providers/preferences-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SeoPageHero({ page }) {
  const { text } = usePreferences();

  return (
    <Card className="overflow-hidden border-[var(--primary-edge)] p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-end">
        <div className="space-y-4">
          <Badge tone="accent">SEO guide</Badge>
          <h1 className="section-title font-semibold">{page.heroTitle}</h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">{page.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge>{page.searchPhrase}</Badge>
            <Badge>{page.audience}</Badge>
          </div>
          <LanguageAvailability />
          <div className="flex flex-wrap gap-3">
            <Button as={Link} href={page.ctaHref}>
              {text.openTool}
            </Button>
            <Button as={Link} href="/tools" variant="secondary">
              {text.exploreToolSuite}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">Before</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{page.exampleBefore}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-semibold text-[var(--foreground)]">After</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{page.exampleAfter}</p>
          </Card>
        </div>
      </div>
    </Card>
  );
}
