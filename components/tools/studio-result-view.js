"use client";

import { cn } from "@/lib/utils";

export function StudioResultView({ tool, result }) {
  const notes = Array.isArray(result?.meta?.notes) ? result.meta.notes : [];
  const chips = Array.isArray(result?.meta?.chips) ? result.meta.chips : [];
  const theme = tool?.interior?.theme;

  return (
    <div className="space-y-6">
      {notes.length || chips.length ? <ResultMetaStrip notes={notes} chips={chips} theme={theme} /> : null}
      {renderView({ tool, result, view: result?.view })}
    </div>
  );
}

function renderView({ tool, result, view }) {
  if (!view) {
    return <RawTextPanel title="Result output" text={result?.output || ""} />;
  }

  switch (view.kind) {
    case "table-export":
      return <TableExportView view={view} />;
    case "analysis-report":
      return <AnalysisReportView view={view} />;
    case "proof-sheet":
      return <ProofSheetView view={view} />;
    case "renewal-report":
      return <RenewalReportView view={view} />;
    case "compare-report":
      return <CompareReportView view={view} />;
    case "subtitle-flow":
      return <SubtitleFlowView view={view} />;
    case "subtitle-qa":
      return <SubtitleQaView view={view} />;
    case "transcript-insights":
      return <TranscriptInsightsView view={view} result={result} />;
    case "chat-thread":
      return <ChatThreadView view={view} />;
    case "chat-search":
      return <ChatSearchView view={view} />;
    case "chat-timeline":
      return <ChatTimelineView view={view} />;
    case "evidence-bundle":
      return <EvidenceBundleView view={view} />;
    case "translation-review":
      return <TranslationReviewView view={view} />;
    case "localization-brief":
      return <LocalizationBriefView view={view} />;
    case "prompt-brief":
      return <PromptBriefView view={view} />;
    case "alt-text":
      return <AltTextView view={view} />;
    case "payment-review":
      return <PaymentReviewView view={view} />;
    case "photo-checklist":
      return <PhotoChecklistView view={view} />;
    default:
      return <RawTextPanel title={tool?.outputTitle || "Result output"} text={result?.output || ""} />;
  }
}

function ResultMetaStrip({ notes, chips, theme }) {
  return (
    <div className="space-y-3">
      {notes.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {notes.map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-[16px] border px-4 py-3 shadow-[0_18px_30px_-26px_rgba(15,23,42,0.1)]"
              style={{
                borderColor: theme?.edge || "rgba(18,24,31,0.08)",
                background: theme?.surface || "linear-gradient(180deg,#ffffff,#f8fafc)",
              }}
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em]" style={{ color: theme?.ink || "#8a91a2" }}>{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-[#202530]">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      {chips.length ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full border px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] shadow-[0_12px_20px_-20px_rgba(15,23,42,0.12)]"
              style={{
                borderColor: theme?.edge || "rgba(18,24,31,0.08)",
                background: theme?.surface || "#fbfcfe",
                color: theme?.ink || "#5f687a",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TableExportView({ view }) {
  return (
    <div className="space-y-4">
      <SurfaceCard
        title="Extracted rows"
        description={`${view.exportLabel} ready. Review the first rows before you export the full file.`}
        aside={view.totalRows ? `Showing ${Math.min(view.rows.length, view.totalRows)} of ${view.totalRows}` : ""}
      >
        <TablePreview headers={view.headers} rows={view.rows} />
      </SurfaceCard>
    </div>
  );
}

function AnalysisReportView({ view }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <SurfaceCard title="Category mix" description="Top categories stay visible first so the scan feels immediate.">
          {view.categories?.length ? <CategoryBars items={view.categories} /> : <EmptyStateCopy text="No strong category mix was detected yet." />}
        </SurfaceCard>
        <SurfaceCard title="Repeat patterns" description="Recurring activity and repeated merchants are grouped into one review surface.">
          <div className="grid gap-4 lg:grid-cols-2">
            <SimpleList
              title="Top descriptions"
              items={(view.topDescriptions || []).map((item) => `${item.label} (${item.count})`)}
              emptyText="No strong repeated descriptions were found."
            />
            <SimpleList
              title="Recurring patterns"
              items={view.recurring || []}
              emptyText="No recurring patterns were detected."
            />
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <SurfaceCard title="Duplicate checks" description="Potential repeats stay separate so they are easier to verify.">
          <SimpleList items={view.duplicates || []} emptyText="No strong duplicate patterns were detected." />
        </SurfaceCard>
        <RawTextPanel title="Narrative summary" text={view.narrative || ""} />
      </div>

      {view.previewTable ? (
        <SurfaceCard title="Preview rows" description="A quick look at the export shape before download.">
          <TablePreview headers={view.previewTable.headers} rows={view.previewTable.rows} />
        </SurfaceCard>
      ) : null}
    </div>
  );
}

function ProofSheetView({ view }) {
  return (
    <div className="mx-auto max-w-3xl rounded-[30px] border border-[rgba(18,24,31,0.08)] bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-6 shadow-[0_24px_52px_-36px_rgba(15,23,42,0.22)] sm:p-7">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8a91a2]">Proof sheet</p>
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#202530]">Payment confirmation layout</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {view.fields.map((item) => (
            <div key={item.label} className="rounded-[22px] border border-[rgba(18,24,31,0.08)] bg-white px-4 py-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#8a91a2]">{item.label}</p>
              <p className="mt-3 text-sm font-semibold text-[#202530]">{item.value}</p>
            </div>
          ))}
        </div>
        {view.note ? (
          <div className="rounded-[24px] border border-[rgba(18,24,31,0.08)] bg-[#fbfcfe] px-5 py-4">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#8a91a2]">Note</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#4d5566]">{view.note}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RenewalReportView({ view }) {
  return (
    <SurfaceCard title="Potential renewal dates" description={`Detected from ${view.sourceLabel}. Review the strongest date cues first.`}>
      <div className="space-y-3">
        {view.matches?.length ? (
          view.matches.map((item, index) => (
            <div key={`${item.date}-${index}`} className="rounded-[22px] border border-[rgba(18,24,31,0.08)] bg-white px-4 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[rgba(18,24,31,0.08)] bg-[#f7f9fc] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#5f687a]">
                  {item.date}
                </span>
                <p className="text-sm leading-7 text-[#4d5566]">{item.context}</p>
              </div>
            </div>
          ))
        ) : (
          <EmptyStateCopy text="No strong renewal date matches were detected in the first pass." />
        )}
      </div>
    </SurfaceCard>
  );
}

function CompareReportView({ view }) {
  return (
    <div className="space-y-4">
      <SurfaceCard
        title="File comparison"
        description={`${view.fileA} vs ${view.fileB}. Keep shared lines and mismatches visible at the same time.`}
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <SimpleList title="Only in file A" items={view.onlyA} emptyText="No unique lines detected." />
          <SimpleList title="Shared lines" items={view.shared} emptyText="No shared lines detected." />
          <SimpleList title="Only in file B" items={view.onlyB} emptyText="No unique lines detected." />
        </div>
      </SurfaceCard>
    </div>
  );
}

function SubtitleFlowView({ view }) {
  return (
    <div className="space-y-4">
      <SurfaceCard
        title={view.modeLabel}
        description="Subtitle output stays structured first, then the export text stays available below."
        aside={view.targetLanguage || view.secondaryLanguage || view.outputFormat || ""}
      >
        {view.blocks?.length ? (
          <div className="grid gap-3">
            {view.blocks.map((block, index) => (
              <div key={`${block.index || index}-${block.time}-${index}`} className="rounded-[22px] border border-[rgba(18,24,31,0.08)] bg-white px-4 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full border border-[rgba(18,24,31,0.08)] bg-[#f7f9fc] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#5f687a]">
                    {block.time}
                  </span>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#8a91a2]">Block {block.index || index + 1}</p>
                </div>
                <div className="mt-3 space-y-2">
                  {block.lines.map((line, lineIndex) => (
                    <p key={`${block.index || index}-${lineIndex}`} className="text-sm leading-7 text-[#202530]">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyStateCopy text="This output is text-first, so the exported subtitle text is shown below." />
        )}
      </SurfaceCard>

      <RawTextPanel title="Export text" text={view.rawOutput || ""} />
    </div>
  );
}

function SubtitleQaView({ view }) {
  return (
    <div className="space-y-4">
      <SurfaceCard title={view.modeLabel} description="Flagged subtitle issues are grouped before the raw report so review stays quick.">
        <SimpleList
          title="QA findings"
          items={(view.issues || []).map((item) => `Block ${item.block} ${item.message}`)}
          emptyText="No strong subtitle issues were detected."
        />
      </SurfaceCard>

      {view.blocks?.length ? (
        <SurfaceCard title="Sample blocks" description="The first blocks stay visible for a quick timing check.">
          <div className="grid gap-3">
            {view.blocks.map((block, index) => (
              <div key={`${block.index || index}-${block.time}-${index}`} className="rounded-[22px] border border-[rgba(18,24,31,0.08)] bg-white px-4 py-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#8a91a2]">{block.time}</p>
                <div className="mt-3 space-y-2">
                  {block.lines.map((line, lineIndex) => (
                    <p key={`${block.index || index}-${lineIndex}`} className="text-sm leading-7 text-[#202530]">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      ) : null}
    </div>
  );
}

function TranscriptInsightsView({ view, result }) {
  return (
    <div className="space-y-4">
      <SurfaceCard title="Summary" description="The main takeaway stays first so the output feels useful immediately.">
        <p className="text-[1rem] leading-8 text-[#202530]">{view.summary || "No summary was generated."}</p>
      </SurfaceCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {view.actions?.length ? <SimpleList title="Action items" items={view.actions} /> : null}
        {view.decisions?.length ? <SimpleList title="Decisions" items={view.decisions} /> : null}
        {view.questions?.length ? <SimpleList title="Open questions" items={view.questions} /> : null}
        {view.themes?.length ? <TokenList title={view.variant === "youtube-notes" ? "Key notes" : "Themes"} items={view.themes} /> : null}
        {view.chapters?.length ? <SimpleList title="Chapter cues" items={view.chapters} /> : null}
      </div>

      {view.cleaned || result?.output ? (
        <RawTextPanel title={view.variant === "cleaner" ? "Cleaned transcript" : "Structured output"} text={view.cleaned || result?.output || ""} />
      ) : null}
    </div>
  );
}

function ChatThreadView({ view }) {
  return (
    <SurfaceCard title="Conversation preview" description="The thread is reformatted into a clean readable stream before export.">
      <div className="space-y-3">
        {view.entries?.map((entry, index) => (
          <div key={`${entry.when}-${entry.author}-${index}`} className="rounded-[22px] border border-[rgba(18,24,31,0.08)] bg-white px-4 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-[rgba(18,24,31,0.08)] bg-[#f7f9fc] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#5f687a]">
                {entry.author}
              </span>
              <p className="text-xs text-[#8a91a2]">{entry.when}</p>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#202530]">{entry.message}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

function ChatSearchView({ view }) {
  return (
    <SurfaceCard
      title="Search matches"
      description={view.query ? `Results filtered by "${view.query}".` : "Search results from the current chat export."}
    >
      <div className="space-y-3">
        {view.matches?.length ? (
          view.matches.map((entry, index) => (
            <div key={`${entry.when}-${entry.author}-${index}`} className="rounded-[22px] border border-[rgba(18,24,31,0.08)] bg-white px-4 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold text-[#202530]">{entry.author}</p>
                <p className="text-xs text-[#8a91a2]">{entry.when}</p>
              </div>
              <p className="mt-2 text-sm leading-7 text-[#4d5566]">{entry.message}</p>
            </div>
          ))
        ) : (
          <EmptyStateCopy text="No matching chat lines were found for this search." />
        )}
      </div>
    </SurfaceCard>
  );
}

function ChatTimelineView({ view }) {
  return (
    <SurfaceCard title="Timeline view" description="Entries are arranged in sequence so incidents and follow-ups stay easier to trace.">
      <div className="space-y-3">
        {view.items?.map((entry, index) => (
          <div key={`${entry.when}-${entry.author}-${index}`} className="relative rounded-[22px] border border-[rgba(18,24,31,0.08)] bg-white px-4 py-4 pl-6">
            <span className="absolute left-3 top-6 h-2.5 w-2.5 rounded-full bg-[#202530]" />
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a91a2]">{entry.when}</p>
            <p className="mt-2 text-sm font-semibold text-[#202530]">{entry.author}</p>
            <p className="mt-2 text-sm leading-7 text-[#4d5566]">{entry.message}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

function EvidenceBundleView({ view }) {
  return (
    <div className="space-y-4">
      <SurfaceCard title="Conversation summary" description="The bundle starts with the core storyline before the key evidence lines.">
        <p className="text-[1rem] leading-8 text-[#202530]">{view.summary}</p>
      </SurfaceCard>
      <SurfaceCard title="Key lines" description="Highlighted messages prepared for a faster evidence scan.">
        <div className="space-y-3">
          {view.highlights?.map((entry, index) => (
            <div key={`${entry.when}-${entry.author}-${index}`} className="rounded-[22px] border border-[rgba(18,24,31,0.08)] bg-white px-4 py-4">
              <p className="text-xs text-[#8a91a2]">{entry.when}</p>
              <p className="mt-2 text-sm font-semibold text-[#202530]">{entry.author}</p>
              <p className="mt-2 text-sm leading-7 text-[#4d5566]">{entry.message}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}

function TranslationReviewView({ view }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <RawTextPanel title="Extracted text" text={view.sourceText || ""} />
      <RawTextPanel title={`Translated (${view.targetLanguage})`} text={view.translatedText || ""} />
    </div>
  );
}

function LocalizationBriefView({ view }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <SurfaceCard title="Detected UI copy" description={`Target market: ${view.targetMarket}.`}>
        <SimpleList items={view.detectedCopy || []} emptyText="No UI copy was detected in the screenshot." />
      </SurfaceCard>
      <div className="space-y-4">
        <RawTextPanel title="Localized draft" text={view.localizedDraft || ""} />
        <SimpleList title="Review notes" items={view.reviewNotes || []} />
      </div>
    </div>
  );
}

function PromptBriefView({ view }) {
  return (
    <div className="space-y-4">
      <SurfaceCard title="Prompt draft" description={`Style focus: ${view.style}.`}>
        <p className="whitespace-pre-wrap text-sm leading-8 text-[#202530]">{view.prompt}</p>
      </SurfaceCard>
      {view.keywords?.length ? <TokenList title="Detected cues" items={view.keywords} /> : null}
    </div>
  );
}

function AltTextView({ view }) {
  return (
    <div className="space-y-4">
      <SurfaceCard title="Alt text" description={`Context: ${view.context}.`}>
        <p className="text-[1rem] leading-8 text-[#202530]">{view.altText}</p>
      </SurfaceCard>
      <RawTextPanel title="Long description" text={view.longDescription || ""} />
    </div>
  );
}

function PaymentReviewView({ view }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <InfoCard label="Amount" value={view.amount} />
        <InfoCard label="Date" value={view.date} />
        <InfoCard label="Reference" value={view.reference} />
      </div>
      <SurfaceCard title="Review notes" description="Warnings stay separate so manual verification is easier.">
        <SimpleList
          items={view.warnings || []}
          emptyText="No strong warning signs were detected from the OCR text alone."
        />
      </SurfaceCard>
    </div>
  );
}

function PhotoChecklistView({ view }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <SimpleList title="Compliance checklist" items={view.checklist || []} emptyText="Checklist unavailable." />
      <RawTextPanel title="OCR notes" text={view.notes || ""} />
    </div>
  );
}

function SurfaceCard({ title, description, aside, children, className }) {
  return (
    <section
      className={cn(
        "rounded-[20px] border border-[rgba(18,24,31,0.08)] bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-[0_22px_44px_-38px_rgba(15,23,42,0.14)] sm:p-6",
        className,
      )}
    >
      {(title || description || aside) ? (
        <div className="mb-5 flex flex-col gap-3 border-b border-[rgba(18,24,31,0.08)] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            {title ? <h3 className="text-lg font-semibold tracking-[-0.04em] text-[#202530]">{title}</h3> : null}
            {description ? <p className="max-w-2xl text-sm leading-7 text-[#5f687a]">{description}</p> : null}
          </div>
          {aside ? (
            <span className="inline-flex rounded-full border border-[rgba(18,24,31,0.08)] bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#5f687a]">
              {aside}
            </span>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function RawTextPanel({ title, text }) {
  return (
    <SurfaceCard title={title} description="Kept readable and copy-friendly after processing.">
      <div className="rounded-[18px] border border-[rgba(18,24,31,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfcfe)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
        <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-[#202530]">{text}</pre>
      </div>
    </SurfaceCard>
  );
}

function SimpleList({ title, items, emptyText = "Nothing to show yet." }) {
  return (
    <div className="rounded-[16px] border border-[rgba(18,24,31,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfcfe)] px-4 py-4 shadow-[0_16px_28px_-28px_rgba(15,23,42,0.08)]">
      {title ? <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#8a91a2]">{title}</p> : null}
      {items?.length ? (
        <div className={cn("space-y-3", title ? "mt-4" : "")}>
          {items.map((item, index) => (
            <div key={`${item}-${index}`} className="rounded-[14px] border border-[rgba(18,24,31,0.06)] bg-[linear-gradient(180deg,#fbfcfe,#f7f9fc)] px-4 py-3 text-sm leading-7 text-[#202530]">
              {item}
            </div>
          ))}
        </div>
      ) : (
        <EmptyStateCopy text={emptyText} className={title ? "mt-4" : ""} />
      )}
    </div>
  );
}

function TokenList({ title, items }) {
  return (
    <SurfaceCard title={title} description="Grouped into quick reusable tokens.">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center rounded-full border border-[rgba(18,24,31,0.08)] bg-white px-3 py-1.5 text-sm font-semibold text-[#202530]"
          >
            {item}
          </span>
        ))}
      </div>
    </SurfaceCard>
  );
}

function TablePreview({ headers = [], rows = [] }) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[rgba(18,24,31,0.08)] bg-[linear-gradient(180deg,#ffffff,#fbfcfe)] shadow-[0_16px_28px_-28px_rgba(15,23,42,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[#f8fafc]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="border-b border-[rgba(18,24,31,0.08)] px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#8a91a2]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="align-top">
                {headers.map((header) => (
                  <td key={`${rowIndex}-${header}`} className="border-b border-[rgba(18,24,31,0.06)] px-4 py-3 text-sm leading-7 text-[#202530]">
                    {String(row?.[header] || "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryBars({ items }) {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#202530]">{item.label}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a91a2]">{item.count}</p>
          </div>
          <div className="h-2.5 rounded-full bg-[#edf1f5]">
            <div
              className="h-2.5 rounded-full bg-[linear-gradient(90deg,#202530,#556070)]"
              style={{ width: `${Math.max(12, (item.count / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-[18px] border border-[rgba(18,24,31,0.08)] bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-4 py-4 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.12)]">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#8a91a2]">{label}</p>
      <p className="mt-3 text-sm font-semibold text-[#202530]">{value}</p>
    </div>
  );
}

function EmptyStateCopy({ text, className }) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-dashed border-[rgba(18,24,31,0.12)] bg-[linear-gradient(180deg,#fbfcfe,#f8fafc)] px-4 py-4 text-sm leading-7 text-[#5f687a]",
        className,
      )}
    >
      {text}
    </div>
  );
}
