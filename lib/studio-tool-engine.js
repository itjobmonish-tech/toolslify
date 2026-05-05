import { PDFParse } from "pdf-parse";
import { sanitizeFilename, sanitizeTextInput } from "./security.js";
import { translateText, translateTextBatch } from "./translate.js";
import { titleCase } from "./utils.js";
import { extractImageTextWithWindowsOcr } from "./windows-ocr.js";

export async function runStudioTool(tool, payload = {}) {
  const processor = tool.settings?.processor;

  if (processor === "document-draft") return runDocumentDraftTool(tool, payload);
  if (processor === "table-export") return runTableExportTool(tool, payload);
  if (processor === "analysis-report") return runAnalysisReportTool(tool, payload);
  if (processor === "compare") return runCompareTool(tool, payload);
  if (processor === "subtitle") return runSubtitleTool(tool, payload);
  if (processor === "transcript") return runTranscriptTool(tool, payload);
  if (processor === "chat") return runChatTool(tool, payload);
  if (processor === "vision") return runVisionTool(tool, payload);

  throw new Error("Unsupported tool");
}

async function runTableExportTool(tool, payload) {
  const source = await extractPrimarySource(tool, payload);
  const table = parseStructuredTable(source.text, tool.name);
  const rows = table.rows.slice(0, 120);

  if (!rows.length) {
    throw new Error("No structured rows were detected in the uploaded source.");
  }

  const exportRows =
    tool.name === "Statement to QuickBooks Converter"
      ? rows.map((row) => ({
          Date: row.Date || row["Column 1"] || "",
          Description: row.Description || row.Detail || row["Column 2"] || "",
          Account: "Imported Bank Feed",
          Amount: row.Amount || row["Column 3"] || "",
          Memo: row.Reference || row.Note || "",
        }))
      : rows;
  const headers = Object.keys(exportRows[0] || {});
  const csv = createCsv(exportRows, headers);
  const output = createTablePreview(tool.name, headers, exportRows);

  return {
    output,
    meta: {
      notes: [
        { label: "Rows", value: String(exportRows.length) },
        { label: "Columns", value: headers.join(", ") },
        { label: "Source", value: source.label },
      ],
      chips: [source.kind, tool.settings?.outputFormat === "qbo-csv" ? "QuickBooks-ready CSV" : "CSV export ready"],
    },
    view: {
      kind: "table-export",
      headers,
      rows: exportRows.slice(0, 10),
      totalRows: exportRows.length,
      sourceLabel: source.label,
      sourceKind: source.kind,
      exportLabel: tool.settings?.outputFormat === "qbo-csv" ? "QuickBooks-ready CSV" : "CSV export ready",
    },
    download: {
      content: csv,
      filename: `${sanitizeFilename(tool.slug)}.csv`,
      mimeType: "text/csv;charset=utf-8",
    },
  };
}

async function runAnalysisReportTool(tool, payload) {
  if (tool.name === "Proof of Payment PDF Builder") {
    const proofText = sanitizeTextInput(payload.input, { maxLength: 12000 });
    if (!proofText) throw new Error("Add the payment details first so the builder has something to format.");

    const details = parseKeyValueLines(proofText);
    const lines = [
      "Proof of Payment",
      "",
      `Payer: ${details.payer || "Not provided"}`,
      `Payee: ${details.payee || "Not provided"}`,
      `Amount: ${details.amount || "Not provided"}`,
      `Reference: ${details.reference || details.invoice || "Not provided"}`,
      `Date: ${details.date || details.paid || "Not provided"}`,
      details.note ? `Note: ${details.note}` : "",
      "",
      "This summary was prepared for quick review and export.",
    ].filter(Boolean);
    const output = lines.join("\n");

    return {
      output,
      meta: {
        notes: [
          { label: "Fields", value: String(Object.keys(details).length || 4) },
          { label: "Format", value: "Payment proof" },
          { label: "Export", value: "PDF download" },
        ],
        chips: ["proof builder", "ready to export"],
      },
      view: {
        kind: "proof-sheet",
        fields: [
          { label: "Payer", value: details.payer || "Not provided" },
          { label: "Payee", value: details.payee || "Not provided" },
          { label: "Amount", value: details.amount || "Not provided" },
          { label: "Reference", value: details.reference || details.invoice || "Not provided" },
          { label: "Date", value: details.date || details.paid || "Not provided" },
        ],
        note: details.note || "",
      },
      download: {
        content: createSimplePdfDocument("Proof of Payment", output),
        filename: `${sanitizeFilename(tool.slug)}.pdf`,
        mimeType: "application/pdf",
      },
    };
  }

  if (tool.name === "Contract Renewal Date Extractor") {
    const source = await extractPrimarySource(tool, payload);
    const dateMatches = findRenewalDates(source.text);
    const output = [
      "Contract renewal review",
      "",
      `Source: ${source.label}`,
      "",
      dateMatches.length
        ? "Potential renewal or deadline dates"
        : "No strong renewal date matches were found.",
      ...(dateMatches.length
        ? dateMatches.map((item, index) => `${index + 1}. ${item.date} - ${item.context}`)
        : ["Review the contract manually around renewal, expiration, termination, notice, and effective-date clauses."]),
    ].join("\n");

    return {
      output,
      meta: {
        notes: [
          { label: "Matches", value: String(dateMatches.length) },
          { label: "Source", value: source.label },
          { label: "Review mode", value: "Renewal scan" },
        ],
        chips: ["contract review", "date extraction"],
      },
      view: {
        kind: "renewal-report",
        sourceLabel: source.label,
        matches: dateMatches,
      },
      download: createTextDownload(tool.slug, output),
    };
  }

  const sourceA = await extractPrimarySource(tool, payload);
  const sourceB = tool.settings?.inputMode === "merge" ? await extractSecondarySource(payload) : null;
  const mergedText = [sourceA.text, sourceB?.text].filter(Boolean).join("\n");
  const table = parseStructuredTable(mergedText, tool.name);
  const rows = table.rows.slice(0, 160);

  if (!rows.length) {
    throw new Error("No usable rows were found in the uploaded source.");
  }

  const finance = analyzeFinanceRows(rows);
  const report = buildFinanceReport(tool.name, rows, finance, sourceB ? [sourceA.label, sourceB.label] : [sourceA.label]);

  if (tool.name === "Receipt to Expense Report Converter" || tool.name === "Bank Statement Merger") {
    const csv = createCsv(rows, Object.keys(rows[0]));
    return {
      output: report,
      meta: {
        notes: [
          { label: "Rows", value: String(rows.length) },
          { label: "Categories", value: String(Object.keys(finance.categories).length) },
          { label: "Source", value: sourceB ? "Merged files" : sourceA.label },
        ],
        chips: ["report ready", sourceB ? "merged export" : "expense export"],
      },
      view: {
        kind: "analysis-report",
        sources: sourceB ? [sourceA.label, sourceB.label] : [sourceA.label],
        categories: sortCategoryCounts(finance.categories),
        recurring: finance.recurring.map((item) => item.label),
        duplicates: finance.duplicates,
        topDescriptions: finance.topDescriptions,
        narrative: report,
        previewTable: {
          headers: Object.keys(rows[0] || {}),
          rows: rows.slice(0, 8),
        },
      },
      download: {
        content: csv,
        filename: `${sanitizeFilename(tool.slug)}.csv`,
        mimeType: "text/csv;charset=utf-8",
      },
    };
  }

  return {
    output: report,
    meta: {
      notes: [
        { label: "Rows", value: String(rows.length) },
        { label: "Estimated total", value: formatAmount(finance.total) },
        { label: "Top merchant", value: finance.topDescriptions[0]?.label || "No clear merchant" },
      ],
      chips: [
        finance.duplicates.length ? `${finance.duplicates.length} duplicates` : "no strong duplicates",
        finance.recurring.length ? `${finance.recurring.length} recurring patterns` : "recurring scan complete",
      ],
    },
    view: {
      kind: "analysis-report",
      sources: sourceB ? [sourceA.label, sourceB.label] : [sourceA.label],
      categories: sortCategoryCounts(finance.categories),
      recurring: finance.recurring.map((item) => item.label),
      duplicates: finance.duplicates,
      topDescriptions: finance.topDescriptions,
      narrative: report,
    },
    download: createTextDownload(tool.slug, report),
  };
}

async function runCompareTool(tool, payload) {
  const sourceA = await extractPrimarySource(tool, payload);
  const sourceB = await extractSecondarySource(payload);
  const linesA = unique(splitLines(sourceA.text).map(normalizeLine).filter(Boolean));
  const linesB = unique(splitLines(sourceB.text).map(normalizeLine).filter(Boolean));
  const onlyA = linesA.filter((line) => !linesB.includes(line));
  const onlyB = linesB.filter((line) => !linesA.includes(line));
  const shared = linesA.filter((line) => linesB.includes(line));

  const output = [
    `${tool.name}`,
    "",
    `File A: ${sourceA.label}`,
    `File B: ${sourceB.label}`,
    "",
    "Summary",
    `- Shared lines: ${shared.length}`,
    `- Only in file A: ${onlyA.length}`,
    `- Only in file B: ${onlyB.length}`,
    "",
    "File A only",
    ...(onlyA.length ? onlyA.slice(0, 10).map((line) => `- ${line}`) : ["- No unique lines detected."]),
    "",
    "File B only",
    ...(onlyB.length ? onlyB.slice(0, 10).map((line) => `- ${line}`) : ["- No unique lines detected."]),
  ].join("\n");

  return {
    output,
    meta: {
      notes: [
        { label: "Shared", value: String(shared.length) },
        { label: "File A only", value: String(onlyA.length) },
        { label: "File B only", value: String(onlyB.length) },
      ],
      chips: ["compare complete", "difference report"],
    },
    view: {
      kind: "compare-report",
      fileA: sourceA.label,
      fileB: sourceB.label,
      shared: shared.slice(0, 12),
      onlyA: onlyA.slice(0, 12),
      onlyB: onlyB.slice(0, 12),
    },
    download: createTextDownload(tool.slug, output),
  };
}

async function runDocumentDraftTool(tool, payload) {
  const input = sanitizeTextInput(payload.input, { maxLength: 40000 });
  const detail = sanitizeTextInput(payload.detail, { maxLength: 16000 });

  if (!input) {
    throw new Error("Paste your notes first so this tool has something to work with.");
  }

  const details = parseKeyValueLines(input);
  const lines = splitLines(input);
  const plainLines = extractListLines(lines);
  const person = pickValue(details, ["name", "candidate", "employee"], "Candidate");
  const role = pickValue(details, ["role", "title", "position"], plainLines[0] || "Professional");
  const company = pickValue(details, ["company", "client", "business", "employer"], "Not provided");
  const docKeywords = extractKeywords(detail || input, 10);

  if (tool.name === "ATS Resume Checker" || tool.name === "Resume Keyword Matcher") {
    if (!detail) {
      throw new Error("Paste the target job description in the second field before running this check.");
    }

    const jobKeywords = extractKeywords(detail, 10);
    const source = input.toLowerCase();
    const matched = jobKeywords.filter((keyword) => source.includes(keyword));
    const missing = jobKeywords.filter((keyword) => !source.includes(keyword));
    const score = jobKeywords.length ? Math.round((matched.length / jobKeywords.length) * 100) : 0;
    const output = [
      tool.name,
      "",
      `Match score: ${score}%`,
      "",
      "Matched keywords",
      ...(matched.length ? matched.map((item) => `- ${titleCase(item)}`) : ["- No strong keyword matches detected yet."]),
      "",
      "Missing or weak coverage",
      ...(missing.length ? missing.map((item) => `- ${titleCase(item)}`) : ["- No obvious gaps detected in the first pass."]),
      "",
      "Recommendation",
      `- Rework the resume summary and experience bullets around ${matched.slice(0, 3).map((item) => titleCase(item)).join(", ") || "the strongest required themes"}.`,
    ].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Match score", value: `${score}%` },
      { label: "Matched keywords", value: String(matched.length) },
      { label: "Missing keywords", value: String(missing.length) },
    ], ["resume review", "job match"]);
  }

  if (tool.name === "Job Description Keyword Extractor") {
    const keywordList = extractKeywords(input, 12);
    const output = [
      tool.name,
      "",
      "Priority keywords",
      ...(keywordList.length ? keywordList.map((item) => `- ${titleCase(item)}`) : ["- No strong keywords detected."]),
      "",
      "Suggested focus",
      `- Prioritize the first ${Math.min(5, keywordList.length)} terms in your headline, summary, and top experience bullets.`,
    ].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Keywords found", value: String(keywordList.length) },
      { label: "Source lines", value: String(lines.length) },
      { label: "Primary theme", value: titleCase(keywordList[0] || "General fit") },
    ], ["keyword extraction", "job description"]);
  }

  if (tool.name === "Resume Bullet Rewriter") {
    const bullets = plainLines.length ? plainLines : lines;
    const rewritten = bullets.slice(0, 8).map((line, index) => rewriteBulletLine(line, index));
    const output = [
      tool.name,
      "",
      "Rewritten bullets",
      ...rewritten.map((item) => `- ${item}`),
      "",
      "Tip",
      "- Add one metric, scope marker, or business result to each bullet before using it in a live application.",
    ].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Bullets rewritten", value: String(rewritten.length) },
      { label: "Role focus", value: detail || role },
      { label: "Source lines", value: String(lines.length) },
    ], ["bullet rewrite", "resume polish"]);
  }

  if (tool.name === "LinkedIn Headline Generator") {
    const themes = docKeywords.slice(0, 5);
    const options = [
      `${role} | ${themes.slice(0, 2).map(titleCase).join(" | ")}`,
      `${titleCase(person)} | ${titleCase(role)} focused on ${titleCase(themes[0] || "growth")}`,
      `${titleCase(role)} helping teams improve ${titleCase(themes[0] || "performance")}`,
      `${titleCase(role)} | ${titleCase(themes[1] || "strategy")} | ${titleCase(themes[2] || "execution")}`,
      `${titleCase(role)} building momentum through ${titleCase(themes[0] || "delivery")}`,
    ];
    const output = [tool.name, "", "Headline options", ...options.map((item) => `- ${item}`)].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Options", value: String(options.length) },
      { label: "Core role", value: titleCase(role) },
      { label: "Primary theme", value: titleCase(themes[0] || "Professional growth") },
    ], ["linkedin", "profile draft"]);
  }

  if (tool.name === "LinkedIn About Generator") {
    const themes = docKeywords.slice(0, 4).map((item) => titleCase(item));
    const about = [
      `I am a ${role.toLowerCase()} who likes turning messy projects into clearer momentum.`,
      `My work usually sits around ${themes.join(", ").toLowerCase() || "strategy, execution, and communication"}, with a strong bias toward outcomes people can actually feel.`,
      `I do my best work with teams that value ownership, clarity, and calm execution over noise.`,
    ].join(" ");
    const output = [tool.name, "", "About section", about].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Core role", value: titleCase(role) },
      { label: "Theme count", value: String(themes.length) },
      { label: "Audience", value: detail || "Recruiters and collaborators" },
    ], ["linkedin", "about draft"]);
  }

  if (tool.name === "Interview Question Generator") {
    const themes = docKeywords.slice(0, 6);
    const questions = themes.map((item) => `How have you handled ${item} in a real project or team setting?`);
    const output = [tool.name, "", "Question set", ...questions.map((item) => `- ${normalizeSentence(item)}`)].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Questions", value: String(questions.length) },
      { label: "Role focus", value: titleCase(role) },
      { label: "Interview type", value: detail || "General" },
    ], ["interview prep", "question bank"]);
  }

  if (tool.name === "Interview Answer Builder") {
    const answer = [
      "Situation",
      `- ${pickValue(details, ["situation"], plainLines[0] || "A meaningful work challenge or project context.")}`,
      "Task",
      `- ${pickValue(details, ["task"], plainLines[1] || "The responsibility or outcome that mattered most.")}`,
      "Action",
      `- ${pickValue(details, ["action"], plainLines[2] || "The steps you took, including how you collaborated and decided what to do.")}`,
      "Result",
      `- ${pickValue(details, ["result"], plainLines[3] || "The measurable improvement, learning, or final business impact.")}`,
    ].join("\n");
    const output = [tool.name, "", `Question: ${pickValue(details, ["question"], "Add the interview question here.")}`, "", answer].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Answer style", value: "STAR" },
      { label: "Role focus", value: detail || titleCase(role) },
      { label: "Sections", value: "4" },
    ], ["interview prep", "answer draft"]);
  }

  if (tool.name === "Thank You Email Generator" || tool.name === "Follow-Up Email Generator") {
    const subject = tool.name === "Thank You Email Generator" ? `Thank you for the conversation${company !== "Not provided" ? ` with ${company}` : ""}` : `Following up on the ${role.toLowerCase()} process`;
    const body = [
      `Subject: ${subject}`,
      "",
      `Hi ${company !== "Not provided" ? company : "team"},`,
      "",
      tool.name === "Thank You Email Generator"
        ? `Thank you again for the conversation about the ${role.toLowerCase()} role. I enjoyed hearing more about the work, and I left the discussion even more interested in the opportunity.`
        : `I wanted to follow up on the ${role.toLowerCase()} process and check whether there are any updates on timing or next steps.`,
      "",
      "I appreciate the time and context you shared. If anything else would be useful from my side, I would be happy to send it across.",
      "",
      `Best,`,
      person,
    ].join("\n");

    return buildDraftResponse(tool, body, [
      { label: "Email type", value: tool.name.replace(" Generator", "") },
      { label: "Role focus", value: titleCase(role) },
      { label: "Company", value: company },
    ], ["email draft", "follow-up"]);
  }

  if (tool.name === "Resignation Letter Generator") {
    const output = [
      "Resignation Letter",
      "",
      `Dear ${company !== "Not provided" ? company : "Manager"},`,
      "",
      `Please accept this letter as formal notice of my resignation from my role as ${role.toLowerCase()}.`,
      `My intended final working day is ${pickValue(details, ["last day", "final day"], "to be confirmed based on notice terms")}.`,
      "",
      "Thank you for the opportunity, support, and experience. I will do my best to support a smooth handover during the notice period.",
      "",
      `Sincerely,`,
      person,
    ].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Notice", value: pickValue(details, ["notice"], "Not provided") },
      { label: "Last day", value: pickValue(details, ["last day", "final day"], "Not provided") },
      { label: "Company", value: company },
    ], ["resignation", "letter draft"]);
  }

  if (tool.name === "Cover Letter Generator") {
    const output = [
      "Cover Letter Draft",
      "",
      `Dear ${company !== "Not provided" ? company : "Hiring Team"},`,
      "",
      `I am excited to be considered for the ${role.toLowerCase()} opportunity. My background lines up well with the work described, especially around ${docKeywords.slice(0, 3).join(", ") || "delivery, communication, and ownership"}.`,
      "",
      `In my recent work, I have focused on ${plainLines.slice(0, 2).join(" ") || "turning complex priorities into clear execution and measurable progress"}. That mix of hands-on delivery and calm follow-through is a strong fit for this role.`,
      "",
      "Thank you for your time and consideration. I would welcome the opportunity to discuss how I could contribute.",
      "",
      `Sincerely,`,
      person,
    ].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Role", value: titleCase(role) },
      { label: "Company", value: company },
      { label: "Themes used", value: String(docKeywords.slice(0, 3).length) },
    ], ["cover letter", "application draft"]);
  }

  if (tool.name === "Resume Builder" || tool.name === "Resume Summary Generator" || tool.name === "CV to Resume Converter") {
    const themes = extractKeywords(input, 8).map((item) => titleCase(item));
    const output = [
      tool.name === "Resume Summary Generator" ? "Resume Summary" : "Resume Draft",
      "",
      `${titleCase(person)}`,
      `${titleCase(role)}`,
      "",
      "Professional Summary",
      `${pickValue(details, ["experience"], plainLines[0] || `${titleCase(role)} with a track record of steady execution and measurable progress.`)}`,
      "",
      "Core Skills",
      ...(themes.length ? themes.slice(0, 6).map((item) => `- ${item}`) : ["- Add top skills here"]),
      "",
      "Experience Highlights",
      ...(plainLines.length ? plainLines.slice(0, 4).map((item) => `- ${normalizeSentence(item)}`) : ["- Add measurable wins and project impact here."]),
    ].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Core role", value: titleCase(role) },
      { label: "Skills surfaced", value: String(themes.length) },
      { label: "Target role", value: detail || "General use" },
    ], ["resume draft", "career docs"]);
  }

  if (isInvoiceLikeTool(tool.name)) {
    const label = tool.name.replace(" Generator", "");
    const docNumber = pickValue(details, ["invoice", "quote", "estimate", "po", "receipt", "number"], `${label.slice(0, 3).toUpperCase()}-001`);
    const items = plainLines.length ? plainLines : ["Add line items here"];
    const output = [
      label,
      "",
      `From: ${pickValue(details, ["business", "company", "from"], "Your business")}`,
      `To: ${pickValue(details, ["client", "customer", "buyer", "to"], "Client")}`,
      `Reference: ${docNumber}`,
      `Date: ${pickValue(details, ["date"], "Not provided")}`,
      `Amount: ${pickValue(details, ["amount", "total"], "Add total")}`,
      "",
      "Line Items",
      ...items.map((item) => `- ${item}`),
    ].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Document", value: label },
      { label: "Client", value: pickValue(details, ["client", "customer", "buyer"], "Not provided") },
      { label: "Line items", value: String(items.length) },
    ], ["business draft", "billing"]);
  }

  if (tool.name === "Expense Report Generator") {
    const items = plainLines.length ? plainLines : ["Add expense lines here"];
    const total = items.reduce((sum, item) => sum + toNumber(item), 0);
    const output = [
      "Expense Report",
      "",
      `Employee: ${pickValue(details, ["employee", "name"], person)}`,
      `Project: ${pickValue(details, ["project"], "Not provided")}`,
      `Period: ${detail || "Not provided"}`,
      "",
      "Expenses",
      ...items.map((item) => `- ${item}`),
      "",
      `Estimated total: ${formatAmount(total)}`,
    ].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Expense lines", value: String(items.length) },
      { label: "Estimated total", value: formatAmount(total) },
      { label: "Project", value: pickValue(details, ["project"], "Not provided") },
    ], ["expense report", "ops admin"]);
  }

  if (tool.name === "Proposal Generator" || tool.name === "Scope of Work Generator" || tool.name === "Freelance Contract Generator") {
    const output = renderSectionedText(tool.name.replace(" Generator", ""), {
      Overview: pickValue(details, ["project", "services"], plainLines[0] || "Add a short project overview."),
      Goals: pickValue(details, ["goals"], plainLines[1] || "List the main business outcomes or deliverables."),
      Deliverables: pickValue(details, ["deliverables"], plainLines[2] || "List the main outputs included in the work."),
      Timeline: pickValue(details, ["timeline"], detail || "Add the timeline or cadence."),
      Commercials: pickValue(details, ["budget", "fee", "payment terms"], "Add pricing, payment, or approval terms."),
    });

    return buildDraftResponse(tool, output, [
      { label: "Document", value: tool.name.replace(" Generator", "") },
      { label: "Client", value: company },
      { label: "Sections", value: "5" },
    ], ["business draft", "client docs"]);
  }

  if (tool.name === "Client Onboarding Form Builder") {
    const questions = [
      "What are the primary goals for this project or engagement?",
      "Who are the key stakeholders and approvers?",
      "What access, assets, or logins are required at kickoff?",
      "What deadlines, launch dates, or reporting rhythms matter most?",
      "How should feedback, approvals, and billing be handled?",
    ];
    const output = [tool.name, "", `Project type: ${detail || pickValue(details, ["service"], "Not provided")}`, "", "Suggested questions", ...questions.map((item) => `- ${item}`)].join("\n");

    return buildDraftResponse(tool, output, [
      { label: "Questions", value: String(questions.length) },
      { label: "Project type", value: detail || pickValue(details, ["service"], "Not provided") },
      { label: "Business", value: company },
    ], ["onboarding", "client ops"]);
  }

  const output = [
    tool.name,
    "",
    "Working draft",
    ...lines.map((item) => `- ${normalizeSentence(item)}`),
  ].join("\n");

  return buildDraftResponse(tool, output, [
    { label: "Source lines", value: String(lines.length) },
    { label: "Theme count", value: String(docKeywords.length) },
    { label: "Primary role", value: titleCase(role) },
  ], ["draft output", "text tool"]);
}

function buildDraftResponse(tool, output, notes = [], chips = []) {
  return {
    output,
    meta: { notes, chips },
    download: createTextDownload(tool.slug, output),
  };
}

function pickValue(details, keys, fallback = "") {
  for (const key of keys) {
    if (details[key]) return details[key];
  }
  return fallback;
}

function extractListLines(lines) {
  return lines
    .filter((line) => !/^[A-Za-z][A-Za-z\s/-]+:\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function rewriteBulletLine(line, index) {
  const verbs = ["Led", "Built", "Improved", "Delivered", "Streamlined", "Owned"];
  const cleaned = normalizeLine(line).replace(/^[-*]\s*/, "").replace(/\.$/, "");
  const lower = cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  return `${verbs[index % verbs.length]} ${lower} with clear ownership and visible impact`;
}

function isInvoiceLikeTool(name) {
  return [
    "Invoice Generator",
    "Quote Generator",
    "Estimate Generator",
    "Purchase Order Generator",
    "Receipt Generator",
    "Retainer Invoice Generator",
  ].includes(name);
}

function renderSectionedText(title, sections) {
  return [
    title,
    "",
    ...Object.entries(sections).flatMap(([heading, body]) => [heading, `${body}`, ""]),
  ].join("\n");
}

async function extractPrimarySource(tool, payload) {
  if (payload.file) return extractSourceText(payload.file);

  const input = sanitizeTextInput(payload.input, { maxLength: 40000 });
  if (!input) throw new Error("Add the source input first.");
  return { text: input, kind: "text", label: "pasted text" };
}

async function extractSecondarySource(payload) {
  if (!payload.fileTwo) throw new Error("Add the second file before running this tool.");
  return extractSourceText(payload.fileTwo);
}

async function extractSourceText(file) {
  if (!file) throw new Error("File is required.");

  if (isPdfLike(file)) {
    return { text: await extractPdfText(file), kind: "pdf", label: file.name || "PDF file" };
  }

  if (isImageLike(file)) {
    const result = await extractImageTextWithWindowsOcr(file);
    return { text: result.text, kind: "image", label: file.name || "image file" };
  }

  const buffer = await file.arrayBuffer();
  const text = sanitizeTextInput(new TextDecoder("utf-8", { fatal: false }).decode(buffer), { maxLength: 40000 });
  if (!text) throw new Error("No readable text was found in that file.");
  return { text, kind: "text", label: file.name || "text file" };
}

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
  const result = await parser.getText();
  await parser.destroy();
  const text = sanitizeTextInput(result.text, { maxLength: 50000 });
  if (!text) throw new Error("This PDF does not appear to contain extractable text.");
  return text;
}

async function runSubtitleTool(tool, payload) {
  const input = sanitizeTextInput(payload.input, { maxLength: 40000 });
  if (!input) throw new Error("Paste subtitle text first so the tool has something to process.");

  const blocks = parseSubtitleBlocks(input);
  const detail = sanitizeTextInput(payload.detail, { maxLength: 40, preserveNewlines: false });

  if (tool.name === "Subtitle Sync Checker") {
    const issues = auditSubtitleBlocks(blocks);
    const report = createSubtitleSyncReport(blocks, issues);
    return {
      output: report,
      meta: {
        notes: [
          { label: "Blocks", value: String(blocks.length) },
          { label: "Mode", value: "Sync audit" },
          { label: "Output", value: "QA report" },
        ],
        chips: ["subtitle QA", "timing review"],
      },
      view: {
        kind: "subtitle-qa",
        modeLabel: "Sync audit",
        blocks: blocks.slice(0, 6),
        issues,
      },
      download: createTextDownload(tool.slug, report),
    };
  }

  if (tool.name === "Subtitle Line Break Fixer") {
    const fixedBlocks = blocks.map((block) => ({ ...block, lines: block.lines.flatMap((line) => wrapSubtitleLine(line)) }));
    const fixed = rebuildSubtitleBlocks(fixedBlocks);
    return {
      output: fixed,
      meta: {
        notes: [
          { label: "Blocks", value: String(blocks.length) },
          { label: "Mode", value: "Line break cleanup" },
          { label: "Output", value: "Subtitle text" },
        ],
        chips: ["subtitle QA", "line break cleanup"],
      },
      view: {
        kind: "subtitle-flow",
        modeLabel: "Line break cleanup",
        blocks: fixedBlocks.slice(0, 8),
        rawOutput: fixed,
      },
      download: createTextDownload(tool.slug, fixed, "srt"),
    };
  }

  if (tool.name === "Subtitle Format Converter") {
    const targetFormat = detail.toLowerCase().includes("vtt") ? "vtt" : detail.toLowerCase().includes("txt") ? "txt" : "srt";
    const converted = convertSubtitleFormat(blocks, targetFormat);
    return {
      output: converted,
      meta: {
        notes: [
          { label: "Blocks", value: String(blocks.length) },
          { label: "Target", value: targetFormat.toUpperCase() },
          { label: "Output", value: "Converted subtitles" },
        ],
        chips: ["subtitle tool", `format ${targetFormat.toUpperCase()}`],
      },
      view: {
        kind: "subtitle-flow",
        modeLabel: `Format conversion to ${targetFormat.toUpperCase()}`,
        blocks: targetFormat === "txt" ? [] : blocks.slice(0, 8),
        rawOutput: converted,
        outputFormat: targetFormat.toUpperCase(),
      },
      download: createTextDownload(tool.slug, converted, targetFormat),
    };
  }

  const targetLanguage = normalizeLanguage(detail) || "en";
  const dialogueLines = blocks.flatMap((block) => block.lines);
  const translated = await translateTextBatch(dialogueLines, targetLanguage).catch(() => dialogueLines);
  let cursor = 0;
  const translatedBlocks = blocks.map((block) => {
    const nextLines = block.lines.map(() => translated[cursor++] || "");
    return { ...block, lines: nextLines };
  });

  if (tool.name === "Bilingual Subtitle Generator") {
    const bilingual = rebuildSubtitleBlocks(
      blocks.map((block, index) => ({
        ...block,
        lines: block.lines.flatMap((line, lineIndex) => [line, translatedBlocks[index].lines[lineIndex] || line]),
      })),
    );
    return {
      output: bilingual,
      meta: {
        notes: [
          { label: "Blocks", value: String(blocks.length) },
          { label: "Second language", value: targetLanguage.toUpperCase() },
          { label: "Output", value: "Bilingual subtitles" },
        ],
        chips: ["subtitle tool", "dual-language output"],
      },
      view: {
        kind: "subtitle-flow",
        modeLabel: "Bilingual subtitle draft",
        blocks: blocks
          .map((block, index) => ({
            ...block,
            lines: block.lines.flatMap((line, lineIndex) => [line, translatedBlocks[index].lines[lineIndex] || line]),
          }))
          .slice(0, 8),
        rawOutput: bilingual,
        secondaryLanguage: targetLanguage.toUpperCase(),
      },
      download: createTextDownload(tool.slug, bilingual, "srt"),
    };
  }

  const translatedOutput = rebuildSubtitleBlocks(translatedBlocks);
  return {
    output: translatedOutput,
    meta: {
      notes: [
        { label: "Blocks", value: String(blocks.length) },
        { label: "Target language", value: targetLanguage.toUpperCase() },
        { label: "Output", value: "Translated subtitles" },
      ],
      chips: ["subtitle tool", "translation pass"],
    },
    view: {
      kind: "subtitle-flow",
      modeLabel: "Translated subtitle draft",
      blocks: translatedBlocks.slice(0, 8),
      rawOutput: translatedOutput,
      targetLanguage: targetLanguage.toUpperCase(),
    },
    download: createTextDownload(tool.slug, translatedOutput, "srt"),
  };
}

async function runTranscriptTool(tool, payload) {
  const input = sanitizeTextInput(payload.input, { maxLength: 40000 });
  if (!input) throw new Error("Paste transcript text first so the tool has something to process.");

  const cleaned = cleanTranscript(input);
  const lines = splitLines(cleaned);
  const summary = summarizeText(cleaned, 3);
  const actions = extractActionItems(lines);
  const decisions = extractDecisionLines(lines);
  const questions = lines.filter((line) => line.includes("?")).slice(0, 5);
  const themes = extractKeywords(cleaned, 6).map(titleCase);
  const chapters = lines.filter((line) => /^\d{1,2}:\d{2}/.test(line)).slice(0, 8).map(normalizeSentence);

  let output = cleaned;
  let view = {
    kind: "transcript-insights",
    variant: "cleaner",
    summary,
    cleaned,
    actions,
    decisions,
    questions: questions.map(normalizeSentence),
    themes,
  };
  if (tool.name === "Meeting Transcript Cleaner") {
    output = ["Cleaned transcript", "", cleaned, "", "Quick summary", `- ${summary}`].join("\n");
    view = {
      kind: "transcript-insights",
      variant: "cleaner",
      summary,
      cleaned,
      actions,
      decisions,
      questions: questions.map(normalizeSentence),
      themes,
    };
  } else if (tool.name === "Transcript to Action Items") {
    output = ["Action items", "", `Summary: ${summary}`, "", ...(actions.length ? actions.map((item) => `- ${item}`) : ["- No clear action items were detected."])].join("\n");
    view = {
      kind: "transcript-insights",
      variant: "action-items",
      summary,
      actions,
      decisions,
      questions: questions.map(normalizeSentence),
      themes,
    };
  } else if (tool.name === "Transcript to Meeting Minutes") {
    output = [
      "Meeting minutes",
      "",
      `Summary: ${summary}`,
      "",
      "Decisions",
      ...(decisions.length ? decisions.map((item) => `- ${item}`) : ["- No clear decisions were detected."]),
      "",
      "Action items",
      ...(actions.length ? actions.map((item) => `- ${item}`) : ["- No clear action items were detected."]),
      "",
      "Open questions",
      ...(questions.length ? questions.map((item) => `- ${normalizeSentence(item)}`) : ["- No open questions were detected."]),
    ].join("\n");
    view = {
      kind: "transcript-insights",
      variant: "meeting-minutes",
      summary,
      actions,
      decisions,
      questions: questions.map(normalizeSentence),
      themes,
    };
  } else if (tool.name === "Audio Notes to Summary Converter") {
    output = [
      "Audio note summary",
      "",
      summary,
      "",
      "Next actions",
      ...(actions.length ? actions.map((item) => `- ${item}`) : ["- No clear next actions were detected."]),
      "",
      "Themes",
      ...themes.slice(0, 5).map((item) => `- ${item}`),
    ].join("\n");
    view = {
      kind: "transcript-insights",
      variant: "audio-summary",
      summary,
      actions,
      themes: themes.slice(0, 5),
    };
  } else if (tool.name === "YouTube Transcript to Notes") {
    output = [
      "YouTube transcript notes",
      "",
      `Summary: ${summary}`,
      "",
      "Chapter cues",
      ...(chapters.length ? chapters.map((item) => `- ${item}`) : ["- No timestamp cues were detected."]),
      "",
      "Key notes",
      ...themes.map((item) => `- ${item}`),
    ].join("\n");
    view = {
      kind: "transcript-insights",
      variant: "youtube-notes",
      summary,
      chapters,
      themes,
    };
  }

  return {
    output,
    meta: {
      notes: [
        { label: "Lines", value: String(lines.length) },
        { label: "Actions", value: String(actions.length) },
        { label: "Summary size", value: `${countWords(summary)} words` },
      ],
      chips: ["transcript tool", `${countWords(cleaned)} source words`],
    },
    view,
    download: createTextDownload(tool.slug, output),
  };
}

async function runChatTool(tool, payload) {
  const input = sanitizeTextInput(payload.input, { maxLength: 40000 });
  if (!input) throw new Error("Paste the chat export first so the tool has something to process.");

  const entries = parseChatEntries(input);
  const detail = sanitizeTextInput(payload.detail, { maxLength: 100, preserveNewlines: false }).toLowerCase();
  const viewer = formatChatEntries(entries);

  if (tool.name === "Chat Search Viewer") {
    const matches = entries.filter((entry) => entry.message.toLowerCase().includes(detail || ""));
    const output = [
      "Chat search view",
      "",
      `Search focus: ${detail || "not provided"}`,
      "",
      ...(matches.length ? matches.map((entry) => `- ${entry.when} | ${entry.author}: ${entry.message}`) : ["- No matching lines were found."]),
    ].join("\n");
    return {
      output,
      meta: {
        notes: [
          { label: "Entries", value: String(entries.length) },
          { label: "Matches", value: String(matches.length) },
          { label: "Search", value: detail || "None" },
        ],
        chips: ["chat review", "search results"],
      },
      view: {
        kind: "chat-search",
        query: detail || "",
        matches: matches.slice(0, 16),
      },
      download: createTextDownload(tool.slug, output),
    };
  }

  if (tool.name === "Chat Timeline Builder") {
    const timeline = entries.slice(0, 20).map((entry) => `- ${entry.when} | ${entry.author}: ${entry.message}`);
    const output = ["Chat timeline", "", ...timeline].join("\n");
    return {
      output,
      meta: {
        notes: [
          { label: "Entries", value: String(entries.length) },
          { label: "Timeline items", value: String(timeline.length) },
          { label: "Mode", value: "Chronological view" },
        ],
        chips: ["chat review", "timeline output"],
      },
      view: {
        kind: "chat-timeline",
        items: entries.slice(0, 20),
      },
      download: createTextDownload(tool.slug, output),
    };
  }

  if (tool.name === "Evidence Bundle Builder") {
    const summary = summarizeText(viewer, 2);
    const output = [
      "Evidence bundle",
      "",
      `Conversation summary: ${summary}`,
      "",
      "Key lines",
      ...entries.slice(0, 8).map((entry) => `- ${entry.when} | ${entry.author}: ${entry.message}`),
    ].join("\n");
    return {
      output,
      meta: {
        notes: [
          { label: "Entries", value: String(entries.length) },
          { label: "Key lines", value: String(Math.min(entries.length, 8)) },
          { label: "Export", value: "PDF download" },
        ],
        chips: ["evidence ready", "chat report"],
      },
      view: {
        kind: "evidence-bundle",
        summary,
        highlights: entries.slice(0, 8),
      },
      download: {
        content: createSimplePdfDocument("Evidence Bundle", output),
        filename: `${sanitizeFilename(tool.slug)}.pdf`,
        mimeType: "application/pdf",
      },
    };
  }

  if (tool.name === "WhatsApp Chat to PDF Converter") {
    return {
      output: viewer,
      meta: {
        notes: [
          { label: "Entries", value: String(entries.length) },
          { label: "Authors", value: String(unique(entries.map((entry) => entry.author)).length) },
          { label: "Export", value: "PDF download" },
        ],
        chips: ["chat export", "pdf ready"],
      },
      view: {
        kind: "chat-thread",
        entries: entries.slice(0, 24),
        authors: unique(entries.map((entry) => entry.author)),
      },
      download: {
        content: createSimplePdfDocument("WhatsApp Chat", viewer),
        filename: `${sanitizeFilename(tool.slug)}.pdf`,
        mimeType: "application/pdf",
      },
    };
  }

  return {
    output: viewer,
    meta: {
      notes: [
        { label: "Entries", value: String(entries.length) },
        { label: "Authors", value: String(unique(entries.map((entry) => entry.author)).length) },
        { label: "View", value: "Readable thread" },
      ],
      chips: ["chat review", "export viewer"],
    },
    view: {
      kind: "chat-thread",
      entries: entries.slice(0, 24),
      authors: unique(entries.map((entry) => entry.author)),
    },
    download: createTextDownload(tool.slug, viewer),
  };
}

async function runVisionTool(tool, payload) {
  const source = await extractPrimarySource(tool, payload);
  const detail = sanitizeTextInput(payload.detail, { maxLength: 60, preserveNewlines: false });
  const targetLanguage = normalizeLanguage(detail) || "en";

  if (tool.name === "Screenshot Translator") {
    const translated = await translateText(source.text, targetLanguage).catch(() => source.text);
    const output = [`Extracted text`, "", source.text, "", `Translated (${targetLanguage.toUpperCase()})`, "", translated].join("\n");
    return {
      output,
      meta: {
        notes: [
          { label: "Source", value: source.label },
          { label: "Words", value: String(countWords(source.text)) },
          { label: "Target", value: targetLanguage.toUpperCase() },
        ],
        chips: ["screenshot OCR", "translation output"],
      },
      view: {
        kind: "translation-review",
        sourceText: source.text,
        translatedText: translated,
        targetLanguage: targetLanguage.toUpperCase(),
        sourceLabel: source.label,
      },
      download: createTextDownload(tool.slug, output),
    };
  }

  if (tool.name === "App Screenshot Localizer") {
    const translated = await translateText(source.text, targetLanguage).catch(() => source.text);
    const output = [
      "App screenshot localization brief",
      "",
      `Target market: ${detail || "General market"}`,
      "",
      "Detected UI copy",
      ...splitLines(source.text).slice(0, 12).map((line) => `- ${line}`),
      "",
      "Localized draft",
      translated,
      "",
      "Review notes",
      "- Check button widths after translation.",
      "- Confirm line breaks on smaller mobile screens.",
      "- Re-export screenshots after legal and pricing copy is final.",
    ].join("\n");
    return {
      output,
      meta: {
        notes: [
          { label: "Source", value: source.label },
          { label: "Target market", value: detail || "General" },
          { label: "Output", value: "Localization brief" },
        ],
        chips: ["localization", "screen review"],
      },
      view: {
        kind: "localization-brief",
        targetMarket: detail || "General market",
        detectedCopy: splitLines(source.text).slice(0, 12),
        localizedDraft: translated,
        reviewNotes: [
          "Check button widths after translation.",
          "Confirm line breaks on smaller mobile screens.",
          "Re-export screenshots after legal and pricing copy is final.",
        ],
      },
      download: createTextDownload(tool.slug, output),
    };
  }

  if (tool.name === "Image to Prompt Generator") {
    const keywords = extractKeywords(source.text, 6).map(titleCase);
    const prompt = `Create a ${detail || "high-quality"} scene inspired by the uploaded image. Keep the composition clean, modern, and polished. Include visual cues around ${keywords.join(", ") || "the detected UI and text elements"}. Preserve a professional tone, balanced lighting, crisp edges, and a polished commercial finish.`;
    const output = [
      "Prompt draft",
      "",
      prompt,
    ].join("\n");
    return {
      output,
      meta: {
        notes: [
          { label: "Keywords", value: String(keywords.length) },
          { label: "Style", value: detail || "General prompt" },
          { label: "Source", value: source.label },
        ],
        chips: ["prompt draft", "image insight"],
      },
      view: {
        kind: "prompt-brief",
        prompt,
        keywords,
        style: detail || "General prompt",
      },
      download: createTextDownload(tool.slug, output),
    };
  }

  if (tool.name === "Alt Text Generator for Images") {
    const summary = summarizeText(source.text, 1);
    const altText = `${summary || "Uploaded image"}${detail ? ` for ${detail}` : ""}.`;
    const output = ["Alt text", "", altText, "", "Long description", source.text || "No readable text was detected in the image."].join("\n");
    return {
      output,
      meta: {
        notes: [
          { label: "Alt length", value: `${altText.length} chars` },
          { label: "Context", value: detail || "General" },
          { label: "Source", value: source.label },
        ],
        chips: ["accessibility", "image description"],
      },
      view: {
        kind: "alt-text",
        altText,
        longDescription: source.text || "No readable text was detected in the image.",
        context: detail || "General",
      },
      download: createTextDownload(tool.slug, output),
    };
  }

  if (tool.name === "Payment Screenshot Checker") {
    const flags = evaluatePaymentProof(source.text);
    const output = [
      "Payment screenshot review",
      "",
      `Detected amount: ${flags.amount || "Not found"}`,
      `Detected date: ${flags.date || "Not found"}`,
      `Detected reference: ${flags.reference || "Not found"}`,
      "",
      "Review notes",
      ...(flags.notes.length ? flags.notes.map((item) => `- ${item}`) : ["- No strong warning signs were detected from the OCR text alone."]),
      "",
      "Important",
      "- OCR review is not a final fraud decision.",
      "- Always confirm against the original payment rail or statement when possible.",
    ].join("\n");
    return {
      output,
      meta: {
        notes: [
          { label: "Warnings", value: String(flags.notes.length) },
          { label: "Source", value: source.label },
          { label: "Mode", value: "Proof review" },
        ],
        chips: ["payment check", flags.notes.length ? "manual review recommended" : "basic check complete"],
      },
      view: {
        kind: "payment-review",
        amount: flags.amount || "Not found",
        date: flags.date || "Not found",
        reference: flags.reference || "Not found",
        warnings: flags.notes,
      },
      download: createTextDownload(tool.slug, output),
    };
  }

  const checklist = [
    "Use an evenly lit, recent photo with no strong shadows.",
    "Make sure the full face is centered and clearly visible.",
    "Avoid cluttered backgrounds, text overlays, or compression damage.",
    "Double-check country-specific size and headroom requirements before submitting.",
  ];
  const output = [
    `${tool.name}`,
    "",
    `Source: ${source.label}`,
    "",
    "Compliance checklist",
    ...checklist.map((item) => `- ${item}`),
    "",
    "OCR notes",
    source.text ? source.text : "No readable text was detected in the image, which is usually expected for a portrait photo.",
  ].join("\n");

  return {
    output,
    meta: {
      notes: [
        { label: "Source", value: source.label },
        { label: "Mode", value: "Photo checklist" },
        { label: "Review", value: "Manual confirmation still required" },
      ],
      chips: ["photo compliance", "manual check"],
    },
    view: {
      kind: "photo-checklist",
      checklist,
      notes: source.text ? source.text : "No readable text was detected in the image, which is usually expected for a portrait photo.",
    },
    download: createTextDownload(tool.slug, output),
  };
}

function parseStructuredTable(text, toolName) {
  const lines = splitLines(text);
  const delimitedLines = lines
    .map((line) => line.split(/\t+|\s{2,}/).map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length >= 2);

  if (delimitedLines.length >= 3) {
    const width = Math.min(Math.max(...delimitedLines.map((cells) => cells.length)), 5);
    const headers = inferHeaders(toolName, width);
    const rows = delimitedLines.slice(0, 120).map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])));
    return { headers, rows };
  }

  const headers = inferHeaders(toolName, 4);
  const rows = lines.slice(0, 120).map((line, index) => {
    const amount = findAmount(line);
    const date = findDate(line);
    const normalized = line.replace(date || "", "").replace(amount || "", "").replace(/\s{2,}/g, " ").trim();
    return {
      [headers[0]]: date || `Row ${index + 1}`,
      [headers[1]]: normalized || line,
      [headers[2]]: amount || "",
      [headers[3]]: extractReference(line),
    };
  });

  return { headers, rows };
}

function inferHeaders(toolName, width) {
  const name = toolName.toLowerCase();
  if (name.includes("statement") || name.includes("quickbooks")) return ["Date", "Description", "Amount", "Reference", "Note"].slice(0, width);
  if (name.includes("receipt") || name.includes("invoice") || name.includes("quote") || name.includes("bill")) return ["Item", "Detail", "Amount", "Note", "Extra"].slice(0, width);
  if (name.includes("form")) return ["Field", "Value", "Detail", "Note", "Extra"].slice(0, width);
  return Array.from({ length: width }).map((_, index) => `Column ${index + 1}`);
}

function createTablePreview(title, headers, rows) {
  return [
    `${title}`,
    "",
    headers.join(" | "),
    ...rows.slice(0, 12).map((row) => headers.map((header) => row[header] || "").join(" | ")),
    "",
    rows.length > 12 ? `Showing 12 of ${rows.length} rows in the preview.` : `Showing ${rows.length} rows in the preview.`,
  ].join("\n");
}

function analyzeFinanceRows(rows) {
  const descriptions = new Map();
  const categories = {};
  let total = 0;

  rows.forEach((row) => {
    const description = normalizeLine(row.Description || row.Detail || row.Item || row["Column 2"] || row["Column 1"] || "");
    const category = categorizeDescription(description);
    const amount = toNumber(row.Amount || row["Column 3"] || row["Column 2"]);
    if (description) descriptions.set(description, (descriptions.get(description) || 0) + 1);
    if (category) categories[category] = (categories[category] || 0) + 1;
    total += amount;
  });

  return {
    total,
    categories,
    topDescriptions: [...descriptions.entries()].sort((left, right) => right[1] - left[1]).slice(0, 5).map(([label, count]) => ({ label, count })),
    duplicates: findDuplicates(rows),
    recurring: findRecurring(rows),
  };
}

function buildFinanceReport(name, rows, finance, sourceLabels) {
  return [
    `${name}`,
    "",
    `Sources: ${sourceLabels.join(" + ")}`,
    "",
    "Summary",
    `- Parsed rows: ${rows.length}`,
    `- Estimated amount footprint: ${formatAmount(finance.total)}`,
    `- Top repeated descriptions: ${finance.topDescriptions.length ? finance.topDescriptions.map((item) => `${item.label} (${item.count})`).join(", ") : "No strong repeats detected"}`,
    "",
    "Categories",
    ...Object.entries(finance.categories).sort((left, right) => right[1] - left[1]).slice(0, 6).map(([label, count]) => `- ${label}: ${count}`),
    "",
    "Recurring patterns",
    ...(finance.recurring.length ? finance.recurring.map((item) => `- ${item.label}`) : ["- No strong recurring patterns were detected."]),
    "",
    "Duplicate checks",
    ...(finance.duplicates.length ? finance.duplicates.map((item) => `- ${item}`) : ["- No strong duplicates were detected."]),
  ].join("\n");
}

function sortCategoryCounts(categories) {
  return Object.entries(categories)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([label, count]) => ({ label, count }));
}

function findDuplicates(rows) {
  const seen = new Map();
  const duplicates = [];
  rows.forEach((row) => {
    const description = normalizeLine(row.Description || row.Detail || row.Item || row["Column 2"] || "");
    const amount = normalizeLine(String(row.Amount || row["Column 3"] || ""));
    const key = `${description}::${amount}`;
    const count = (seen.get(key) || 0) + 1;
    seen.set(key, count);
    if (count === 2 && description) duplicates.push(`${description}${amount ? ` / ${amount}` : ""}`);
  });
  return duplicates.slice(0, 8);
}

function findRecurring(rows) {
  const grouped = new Map();
  rows.forEach((row) => {
    const description = normalizeLine(row.Description || row.Detail || row.Item || row["Column 2"] || "");
    if (!description) return;
    grouped.set(description, (grouped.get(description) || 0) + 1);
  });
  return [...grouped.entries()].filter(([, count]) => count >= 2).sort((left, right) => right[1] - left[1]).slice(0, 6).map(([label, count]) => ({ label: `${label} (${count} hits)` }));
}

function findRenewalDates(text) {
  return splitLines(text)
    .filter((line) => /(renew|expiry|expire|termination|notice|effective)/i.test(line))
    .map((line) => ({ date: findDate(line) || "Date not detected", context: normalizeLine(line) }))
    .slice(0, 8);
}

function parseKeyValueLines(text) {
  return Object.fromEntries(splitLines(text).map((line) => line.split(/:\s+/)).filter((parts) => parts.length >= 2).map(([key, ...rest]) => [key.trim().toLowerCase(), rest.join(": ").trim()]));
}

function parseSubtitleBlocks(text) {
  return String(text)
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((block) => block.split("\n").map((line) => line.trim()).filter(Boolean))
    .filter((lines) => lines.length)
    .map((lines, index) => {
      const nextLines = [...lines];
      const maybeIndex = /^\d+$/.test(nextLines[0]) ? nextLines.shift() : String(index + 1);
      const maybeTime = nextLines[0]?.includes("-->") ? nextLines.shift() : `${index + 1}`;
      return { index: maybeIndex || String(index + 1), time: maybeTime || `${index + 1}`, lines: nextLines };
    });
}

function rebuildSubtitleBlocks(blocks) {
  return blocks.map((block, index) => [block.index || String(index + 1), block.time, ...block.lines].filter(Boolean).join("\n")).join("\n\n");
}

function wrapSubtitleLine(line) {
  if (line.length <= 42) return [line];
  const mid = Math.floor(line.length / 2);
  const splitIndex = line.lastIndexOf(" ", mid);
  if (splitIndex <= 0) return [line];
  return [line.slice(0, splitIndex).trim(), line.slice(splitIndex + 1).trim()];
}

function convertSubtitleFormat(blocks, targetFormat) {
  if (targetFormat === "txt") return blocks.map((block) => block.lines.join(" ")).join("\n");
  if (targetFormat === "vtt") return ["WEBVTT", "", ...blocks.map((block) => `${String(block.time).replace(/,/g, ".")}\n${block.lines.join("\n")}`)].join("\n\n");
  return rebuildSubtitleBlocks(blocks.map((block, index) => ({ ...block, index: String(index + 1), time: String(block.time).replace(/\./g, ",") })));
}

function auditSubtitleBlocks(blocks) {
  const issues = [];
  blocks.forEach((block, index) => {
    const fullLine = block.lines.join(" ");
    if (fullLine.length > 84) {
      issues.push({
        block: index + 1,
        message: "Runs long and may need shorter line breaks.",
      });
    }
    if (!String(block.time).includes("-->")) {
      issues.push({
        block: index + 1,
        message: "Is missing a visible timing marker.",
      });
    }
  });
  return issues;
}

function createSubtitleSyncReport(blocks, issues = auditSubtitleBlocks(blocks)) {
  return [
    "Subtitle sync report",
    "",
    `Blocks reviewed: ${blocks.length}`,
    "",
    ...(issues.length ? issues.map((item) => `- Block ${item.block} ${item.message}`) : ["- No strong subtitle sync issues were detected in the first pass."]),
  ].join("\n");
}

function cleanTranscript(text) {
  return splitLines(text).map((line) => normalizeSentence(line)).join("\n");
}

function extractActionItems(lines) {
  return lines.filter((line) => /(will|need to|follow up|send|share|review|prepare|confirm|ship)/i.test(line)).slice(0, 8).map(normalizeSentence);
}

function extractDecisionLines(lines) {
  return lines.filter((line) => /(decided|agreed|approved|confirmed|final)/i.test(line)).slice(0, 6).map(normalizeSentence);
}

function parseChatEntries(text) {
  return splitLines(text).map((line, index) => {
    const match = line.match(/^\[?([^\]]+)\]?\s*([^:]+):\s*(.+)$/);
    if (!match) return { when: `Line ${index + 1}`, author: "Unknown", message: normalizeLine(line) };
    return { when: normalizeLine(match[1]), author: normalizeLine(match[2]), message: normalizeLine(match[3]) };
  });
}

function formatChatEntries(entries) {
  return entries.map((entry) => `${entry.when} | ${entry.author}: ${entry.message}`).join("\n");
}

function evaluatePaymentProof(text) {
  const amount = findAmount(text);
  const date = findDate(text);
  const reference = extractReference(text);
  const notes = [];
  if (!amount) notes.push("No clear payment amount was detected.");
  if (!date) notes.push("No visible payment date was detected.");
  if (!reference) notes.push("No transaction or reference code was detected.");
  if (countWords(text) < 6) notes.push("Very little OCR text was captured, so the screenshot may need manual review.");
  return { amount, date, reference, notes };
}

function createSimplePdfDocument(title, content) {
  const cleanLines = [title, "", ...String(content).replace(/\r/g, "").split("\n")].map((line) => line.replace(/[^\x20-\x7E]/g, " ").trimEnd()).slice(0, 42);
  const stream = ["BT", "/F1 16 Tf", "54 770 Td", ...cleanLines.flatMap((line, index) => [index === 0 ? `(${escapePdfText(line)}) Tj` : `0 -18 Td (${escapePdfText(line || " ")}) Tj`]), "ET"].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function createTextDownload(slug, output, extension = "txt") {
  return { content: output, filename: `${sanitizeFilename(slug)}.${extension}`, mimeType: "text/plain;charset=utf-8" };
}

function createCsv(rows, headers) {
  return [headers.join(","), ...rows.map((row) => headers.map((header) => `"${String(row[header] || "").replace(/"/g, '""')}"`).join(","))].join("\n");
}

function splitLines(text) {
  return sanitizeTextInput(text, { maxLength: 50000 }).split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function summarizeText(text, sentenceCount = 3) {
  const sentences = sanitizeTextInput(text, { maxLength: 30000, preserveNewlines: false }).split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter((sentence) => sentence.length > 20);
  return (sentences.length ? sentences.slice(0, sentenceCount) : splitLines(text).slice(0, sentenceCount)).map(normalizeSentence).join(" ");
}

function extractKeywords(text, limit = 6) {
  const stopWords = new Set(["the", "and", "for", "with", "that", "this", "from", "have", "will", "your", "into", "about", "been"]);
  const counts = new Map();
  sanitizeTextInput(text, { maxLength: 12000, preserveNewlines: false }).toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((word) => word.length > 3 && !stopWords.has(word)).forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));
  return [...counts.entries()].sort((left, right) => right[1] - left[1]).slice(0, limit).map(([word]) => word);
}

function normalizeSentence(text) {
  const cleaned = normalizeLine(text);
  if (!cleaned) return "";
  const sentence = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
}

function normalizeLine(text) {
  return sanitizeTextInput(text, { maxLength: 500, preserveNewlines: false }).replace(/\s+/g, " ").trim();
}

function findDate(text) {
  const match = String(text).match(/\b(?:\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\b/);
  return match?.[0] || "";
}

function findAmount(text) {
  const match = String(text).match(/(?:USD|EUR|GBP|INR|\$|€|£)?\s*-?\d[\d,]*(?:\.\d{2})?/);
  return match?.[0]?.trim() || "";
}

function extractReference(text) {
  const match = String(text).match(/\b(?:ref|reference|txn|transaction|invoice|id)[:#\s-]*([A-Z0-9-]{4,})/i);
  return match?.[1] || "";
}

function categorizeDescription(text) {
  const value = text.toLowerCase();
  if (!value) return "Uncategorized";
  if (/(uber|taxi|fuel|gas|metro|flight|air|travel|hotel)/.test(value)) return "Travel";
  if (/(amazon|store|shop|mart|retail|grocery|market)/.test(value)) return "Shopping";
  if (/(netflix|spotify|adobe|subscription|cloud|saas|zoom|notion)/.test(value)) return "Subscriptions";
  if (/(rent|lease|office|cowork)/.test(value)) return "Operations";
  if (/(utility|electric|water|internet|phone|telecom)/.test(value)) return "Utilities";
  if (/(restaurant|coffee|cafe|food|swiggy|doordash|ubereats)/.test(value)) return "Food";
  return "General";
}

function toNumber(value) {
  const numeric = String(value || "").replace(/[^\d.-]/g, "");
  const parsed = Number.parseFloat(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatAmount(value) {
  if (!Number.isFinite(value)) return "0";
  return `${value < 0 ? "-" : ""}$${Math.abs(value).toFixed(2)}`;
}

function countWords(text) {
  return sanitizeTextInput(text, { maxLength: 50000, preserveNewlines: false }).split(/\s+/).filter(Boolean).length;
}

function unique(values) {
  return [...new Set(values)];
}

function normalizeLanguage(value) {
  const cleaned = String(value || "").trim().toLowerCase();
  const map = {
    english: "en",
    spanish: "es",
    french: "fr",
    german: "de",
    portuguese: "pt",
    italian: "it",
    dutch: "nl",
    polish: "pl",
    turkish: "tr",
    vietnamese: "vi",
    indonesian: "id",
    russian: "ru",
    ukrainian: "uk",
    arabic: "ar",
    bengali: "bn",
    urdu: "ur",
    tamil: "ta",
    japanese: "ja",
    korean: "ko",
    chinese: "zh",
    thai: "th",
  };
  if (!cleaned) return "";
  if (cleaned.length === 2) return cleaned;
  return map[cleaned] || "";
}

function isPdfLike(file) {
  return file?.type === "application/pdf" || /\.pdf$/i.test(file?.name || "");
}

function isImageLike(file) {
  return /^image\//.test(file?.type || "") || /\.(png|jpe?g|webp|bmp|gif|tiff?)$/i.test(file?.name || "");
}

function escapePdfText(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
