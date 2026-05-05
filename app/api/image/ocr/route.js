import { NextResponse } from "next/server";
import { extractImageTextWithWindowsOcr } from "@/lib/windows-ocr";
import { sanitizeOption, sanitizeTextInput } from "@/lib/security";
import { SUPPORTED_LANGUAGE_CODES, translateText } from "@/lib/translate";

export const runtime = "nodejs";

const MAX_IMAGE_OCR_BYTES = 10 * 1024 * 1024;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const mode = sanitizeOption(formData.get("mode"), ["text", "word", "translate"], "text");
    const targetLanguage = sanitizeOption(formData.get("targetLanguage"), SUPPORTED_LANGUAGE_CODES, "en");

    if (!file || typeof file !== "object" || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ ok: false, error: "Image file is required." }, { status: 400 });
    }

    if (typeof file.size === "number" && file.size > MAX_IMAGE_OCR_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Images must be 10 MB or smaller for OCR." },
        { status: 413 },
      );
    }

    const { text, lines } = await extractImageTextWithWindowsOcr(file);

    let translatedText = "";
    let translationNote = "";

    if (mode === "translate") {
      const translated = await translateText(text, targetLanguage).catch(() => null);
      if (translated) {
        translatedText = translated;
      } else {
        translatedText = text;
        translationNote = "Translation fallback used. The extracted text is shown as-is.";
      }
    }

    return NextResponse.json({
      ok: true,
      text,
      lines,
      lineCount: lines.length,
      wordCount: countWords(text),
      translatedText: translatedText ? sanitizeTextInput(translatedText, { maxLength: 40000 }) : "",
      translationNote,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to process that image right now.",
      },
      { status: 500 },
    );
  }
}

function countWords(text) {
  return sanitizeTextInput(text, { maxLength: 40000, preserveNewlines: false })
    .split(/\s+/)
    .filter(Boolean).length;
}
