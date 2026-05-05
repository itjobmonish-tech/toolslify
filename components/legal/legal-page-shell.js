"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useTranslatedValues } from "@/lib/runtime-localization";

export function LegalPageShell({ badge, title, intro, cardSection, sections }) {
  const translatedPage = useTranslatedValues([
    badge || "",
    title || "",
    intro || "",
    cardSection?.heading || "",
    cardSection?.body || "",
    ...sections.flatMap((section) => [section.heading || "", section.body || ""]),
  ]);

  return (
    <div className="page-shell">
      <div className="prose-shell">
        <Badge tone="accent">{translatedPage[0] || badge}</Badge>
        <h1 className="mt-5">{translatedPage[1] || title}</h1>
        <p>{translatedPage[2] || intro}</p>

        {cardSection ? (
          <Card className="mt-8 p-6">
            <h2>{translatedPage[3] || cardSection.heading}</h2>
            <p>{translatedPage[4] || cardSection.body}</p>
          </Card>
        ) : null}

        {sections.map((section, index) => {
          const offset = 5 + index * 2;
          return (
            <div key={section.heading}>
              <h2>{translatedPage[offset] || section.heading}</h2>
              <p>{translatedPage[offset + 1] || section.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
