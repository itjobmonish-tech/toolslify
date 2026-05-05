import { NextResponse } from "next/server";
import { sanitizeTextInput } from "@/lib/security";
import { SUPPORTED_LANGUAGE_CODES, translateTextBatch } from "@/lib/translate";

export const runtime = "nodejs";

const MAX_VALUES = 1400;

export async function POST(request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const language = SUPPORTED_LANGUAGE_CODES.includes(payload?.language) ? payload.language : "en";
    const values = Array.isArray(payload?.values)
      ? payload.values.slice(0, MAX_VALUES).map((value) =>
          sanitizeTextInput(value, {
            maxLength: 4000,
            preserveNewlines: true,
          }),
        )
      : [];

    const translatedValues = await translateTextBatch(values, language);

    return NextResponse.json({
      ok: true,
      values: translatedValues,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to translate the requested content right now.",
      },
      { status: 500 },
    );
  }
}
