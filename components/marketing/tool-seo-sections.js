import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ToolSidebarLists } from "@/components/marketing/tool-sidebar-lists";

export function ToolSeoSections({ tool, content, sidebarSections = [] }) {
  const searchChips = buildUniqueSearchChips([
    content.primaryKeyword,
    content.secondaryKeyword,
    ...(tool.keywords || []),
  ]).slice(0, 8);
  const articleSections = (content.sections || []).map((section, index) => ({
    ...section,
    id: `${toSectionId(section.heading)}-${index + 1}`,
  }));

  return (
    <section className="mt-16 space-y-8">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-6 sm:p-7">
          <Badge tone="accent">Quick guide</Badge>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl">
            How to use {tool.shortName.toLowerCase()} in three steps
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Enter the main details, run the calculation, then review or export the result from the same screen.
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-semibold text-[var(--foreground)]">Related searches</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {searchChips.map((keyword) => (
              <Badge key={keyword}>{keyword}</Badge>
            ))}
          </div>
        </Card>
      </div>

      {content.intentPaths?.length ? (
        <Card className="p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            Next steps
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            Common paths after this result
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Most people continue into one of these related checks once they have the first answer.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {content.intentPaths.map((path) => (
              <Badge key={path}>{path}</Badge>
            ))}
          </div>
        </Card>
      ) : null}

      {content.calculatorSupport ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Card className="p-6 sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Methodology
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              Formula and review approach
            </h2>
            <p className="mt-4 text-sm leading-8 text-[var(--muted-foreground)]">
              {content.calculatorSupport.formula}
            </p>
            <div className="mt-5 space-y-3">
              {content.calculatorSupport.methodology.map((step) => (
                <div key={step} className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                  <p className="text-sm leading-7 text-[var(--muted-foreground)]">{step}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            {content.calculatorSupport.example ? (
              <Card className="p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Example
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {content.calculatorSupport.example.title}
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[var(--foreground)]">Starter inputs</p>
                    {content.calculatorSupport.example.inputs.map((item) => (
                      <div key={item.label} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{item.label}</p>
                        <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[var(--foreground)]">Expected outputs</p>
                    {content.calculatorSupport.example.outputs.map((item) => (
                      <div key={item.label} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{item.label}</p>
                        <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                  {content.calculatorSupport.example.note}
                </p>
              </Card>
            ) : null}

            <Card className="p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Reliability
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                Assumptions and common failure cases
              </h2>
              <div className="mt-5 space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">Assumptions</p>
                  {content.calculatorSupport.assumptions.map((item) => (
                    <div key={item} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                      <p className="text-sm leading-7 text-[var(--muted-foreground)]">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">When this result is wrong</p>
                  {content.calculatorSupport.whenWrong.map((item) => (
                    <div key={item} className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                      <p className="text-sm leading-7 text-[var(--muted-foreground)]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {content.linkSections?.length ? (
        <div className="space-y-4">
          {content.linkSections.map((section) => (
            <Card key={section.title} className="p-6 sm:p-7">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Related tools
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {section.title}
                </h2>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {section.items.map((item) => (
                  <Link
                    key={`${section.title}-${item.href}`}
                    href={item.href}
                    className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--primary-edge)] hover:text-[var(--primary)]"
                  >
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                    {item.description ? (
                      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{item.description}</p>
                    ) : null}
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {content.howToSteps.map((step, index) => (
          <Card key={step.title} className="p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Step {index + 1}
            </p>
            <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{step.body}</p>
          </Card>
        ))}
      </div>

      {content.articleIntro?.length ? (
        <Card className="p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            Overview
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            Before you use {tool.shortName.toLowerCase()}
          </h2>
          <div className="mt-4 space-y-4">
            {content.articleIntro.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-8 text-[var(--muted-foreground)]">
                {paragraph}
              </p>
            ))}
          </div>
        </Card>
      ) : null}

      {articleSections.length ? (
        <Card className="p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            Table of contents
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            Jump to the part you need
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {articleSections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:border-[var(--primary-edge)] hover:text-[var(--primary)]"
              >
                <span className="mr-2 text-[var(--muted-foreground)]">{index + 1}.</span>
                {section.heading}
              </a>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="space-y-8">
          {articleSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7"
            >
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{section.heading}</h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-8 text-[var(--muted-foreground)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {sidebarSections.length ? <ToolSidebarLists sections={sidebarSections} /> : null}

          {content.calculatorSupport?.sourceReview ? (
            <Card className="p-6">
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">Source and review notes</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                {content.calculatorSupport.sourceReview.note}
              </p>
              <div className="mt-5 space-y-3">
                {content.calculatorSupport.sourceReview.sources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary-edge)] hover:text-[var(--primary)]"
                  >
                    {source.label}
                  </a>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {content.calculatorSupport.sourceReview.reviewLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex min-h-[38px] items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary-edge)] hover:text-[var(--primary)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </Card>
          ) : null}

          <Card className="p-6">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">Common uses</h2>
            <div className="mt-5 space-y-4">
              {tool.useCases.map((useCase) => (
                <div key={useCase} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm leading-7 text-[var(--muted-foreground)]">{useCase}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              Planning notes
            </h2>
            <div className="mt-5 space-y-4">
              {content.comparisonCards.map((card) => (
                <div key={card.title} className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{card.title}</p>
                  <div className="mt-3 space-y-2">
                    {card.points.map((point) => (
                      <p key={point} className="text-sm leading-7 text-[var(--muted-foreground)]">
                        {point}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">What to expect</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>The tool is available without creating an account.</p>
              <p>The main action stays clear, with copy and download controls available when a result is ready.</p>
              <p>Related tools stay close enough to continue planning without interrupting the first calculation.</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function buildUniqueSearchChips(items) {
  const seen = new Set();

  return items
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function toSectionId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}
