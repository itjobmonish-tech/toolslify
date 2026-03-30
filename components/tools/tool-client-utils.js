"use client";

const REQUEST_TIMEOUT_MS = 25000;

export async function requestJsonTool(slug, payload) {
  const response = await fetchWithTimeout(`/api/tool/${slug}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseToolResponse(response);
}

export async function requestFormTool(slug, fields) {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, value);
  });

  const response = await fetchWithTimeout(`/api/tool/${slug}`, {
    method: "POST",
    body: formData,
  });

  return parseToolResponse(response);
}

export function sliderToStrength(value) {
  if (value <= 33) return "low";
  if (value <= 67) return "medium";
  return "high";
}

export function sliderToDepth(value) {
  if (value <= 33) return "short";
  if (value <= 67) return "standard";
  return "detailed";
}

export function createSamplePdfFile() {
  const sampleLines = [
    "Toolslify sample PDF",
    "This file demonstrates PDF text extraction, summaries, and note generation.",
    "Use it to test the converter before uploading a real document.",
    "The sample covers onboarding, clarity, and quick study takeaways.",
  ];
  const stream = [
    "BT",
    "/F1 18 Tf",
    "72 720 Td",
    ...sampleLines.flatMap((line, index) => [index === 0 ? `(${escapePdfText(line)}) Tj` : `0 -28 Td (${escapePdfText(line)}) Tj`]),
    "ET",
  ].join("\n");

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

  return new File([new TextEncoder().encode(pdf)], "toolslify-sample.pdf", {
    type: "application/pdf",
  });
}

async function fetchWithTimeout(input, init) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The request took too long. Try a shorter input or try again in a moment.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseToolResponse(response) {
  const json = await response.json().catch(() => null);

  if (!response.ok || !json?.ok) {
    const retryAfter = response.headers.get("Retry-After");
    const baseError = json?.error || "Unable to process the request.";
    throw new Error(retryAfter ? `${baseError} Try again in ${retryAfter}s.` : baseError);
  }

  return json;
}

function escapePdfText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
