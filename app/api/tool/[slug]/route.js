import { NextResponse } from "next/server";
import { getToolBySlug } from "@/lib/site-data";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  MAX_AUDIO_UPLOAD_BYTES,
  MAX_PDF_UPLOAD_BYTES,
  getRequestIp,
  isAudioFile,
  isFileTooLarge,
  isPdfFile,
} from "@/lib/security";
import { runTool } from "@/lib/tool-engine";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return NextResponse.json({ ok: false, error: "Tool not found." }, { status: 404 });
  }

  const ip = getRequestIp(request);
  const rateLimit = checkRateLimit({ key: `${slug}:${ip}`, limit: 10, windowMs: 60000 });
  const responseHeaders = {
    "Cache-Control": "no-store, max-age=0",
    "X-RateLimit-Limit": "10",
    "X-RateLimit-Remaining": String(rateLimit.remaining),
  };

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many requests from this IP. Please wait a minute and try again.",
      },
      {
        status: 429,
        headers: {
          ...responseHeaders,
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let payload = {};

    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      payload = {
        file: file && typeof file === "object" && "arrayBuffer" in file ? file : undefined,
        format: formData.get("format"),
        language: formData.get("language"),
        transcript: formData.get("transcript"),
      };

      if (slug === "voice-note-to-text" && payload.file && !isAudioFile(payload.file)) {
        return NextResponse.json(
          { ok: false, error: "Unsupported audio file format." },
          { status: 400, headers: responseHeaders },
        );
      }

      if (slug === "voice-note-to-text" && payload.file && isFileTooLarge(payload.file, MAX_AUDIO_UPLOAD_BYTES)) {
        return NextResponse.json(
          { ok: false, error: "Audio files must be 15 MB or smaller." },
          { status: 413, headers: responseHeaders },
        );
      }

      if (slug === "pdf-all-format-converter" && payload.file && !isPdfFile(payload.file)) {
        return NextResponse.json(
          { ok: false, error: "Only PDF files are supported here." },
          { status: 400, headers: responseHeaders },
        );
      }

      if (slug === "pdf-all-format-converter" && payload.file && isFileTooLarge(payload.file, MAX_PDF_UPLOAD_BYTES)) {
        return NextResponse.json(
          { ok: false, error: "PDF files must be 12 MB or smaller." },
          { status: 413, headers: responseHeaders },
        );
      }
    } else {
      return NextResponse.json({ ok: false, error: "Unsupported request type." }, { status: 415, headers: responseHeaders });
    }

    const result = await runTool(slug, payload);

    return NextResponse.json(
      { ok: true, ...result },
      {
        headers: responseHeaders,
      },
    );
  } catch (error) {
    console.error("[tool-api]", slug, error);
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to process the request right now. Please review your input and try again.",
        ...(process.env.NODE_ENV !== "production"
          ? { debug: error instanceof Error ? error.message : String(error) }
          : {}),
      },
      { status: 500, headers: responseHeaders },
    );
  }
}
