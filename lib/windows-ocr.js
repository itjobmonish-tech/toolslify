import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { sanitizeFilename, sanitizeTextInput } from "./security.js";

const execFileAsync = promisify(execFile);
const OCR_POWERSHELL_SCRIPT = [
  '$ErrorActionPreference = "Stop"',
  "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8",
  "$ImagePath = $args[0]",
  "Add-Type -AssemblyName System.Runtime.WindowsRuntime",
  "$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]",
  "$null = [Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime]",
  "$null = [Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime]",
  "$AsTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.ContainsGenericParameters -and $_.GetParameters().Count -eq 1 } | Select-Object -First 1",
  "function Await([object]$Operation, [Type]$ResultType) { $Method = $AsTaskGeneric.MakeGenericMethod($ResultType); $Task = $Method.Invoke($null, @($Operation)); $Task.Wait(-1) | Out-Null; return $Task.Result }",
  "$StorageFile = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($ImagePath)) ([Windows.Storage.StorageFile])",
  "$Stream = Await ($StorageFile.OpenReadAsync()) ([Windows.Storage.Streams.IRandomAccessStreamWithContentType])",
  "$Decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($Stream)) ([Windows.Graphics.Imaging.BitmapDecoder])",
  "$SoftwareBitmap = Await ($Decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])",
  "$OcrEngine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()",
  "if (-not $OcrEngine) { throw 'Windows OCR is not available for the current user profile languages.' }",
  "$OcrResult = Await ($OcrEngine.RecognizeAsync($SoftwareBitmap)) ([Windows.Media.Ocr.OcrResult])",
  "$Payload = [ordered]@{ text = ($OcrResult.Text -replace \"`r\", \"\").Trim(); lines = @($OcrResult.Lines | ForEach-Object { $_.Text.Trim() } | Where-Object { $_ }) }",
  "$Payload | ConvertTo-Json -Compress -Depth 4",
].join("\n");
const OCR_POWERSHELL_COMMAND = Buffer.from(OCR_POWERSHELL_SCRIPT, "utf16le").toString("base64");

export async function extractImageTextWithWindowsOcr(file) {
  if (process.platform !== "win32") {
    throw new Error("Local OCR is only available on Windows in this build.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const extension = path.extname(file.name || "") || ".png";
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "toolslify-ocr-"));
  const tempFile = path.join(
    tempDir,
    `${sanitizeFilename(path.basename(file.name || "image", extension)) || "image"}${extension}`,
  );

  try {
    await fs.writeFile(tempFile, Buffer.from(arrayBuffer));

    const { stdout, stderr } = await execFileAsync(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-EncodedCommand", OCR_POWERSHELL_COMMAND, tempFile],
      {
        encoding: "utf8",
        maxBuffer: 8 * 1024 * 1024,
      },
    );

    if (stderr?.trim()) {
      throw new Error(stderr.trim());
    }

    const payload = JSON.parse((stdout || "").trim() || "{}");
    const text = sanitizeTextInput(payload.text || "", { maxLength: 40000 });

    if (!text) {
      throw new Error("No readable text was found in that image.");
    }

    return {
      text,
      lines: Array.isArray(payload.lines)
        ? payload.lines
            .map((line) => sanitizeTextInput(line || "", { maxLength: 400 }))
            .filter(Boolean)
        : [],
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Unable to run OCR on that image.",
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}
