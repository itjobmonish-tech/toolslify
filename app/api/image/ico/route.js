import { NextResponse } from "next/server";
import { PNG } from "pngjs";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
      return NextResponse.json({ error: "PNG input is required." }, { status: 400 });
    }

    const isPngUpload =
      (typeof file.type === "string" && file.type === "image/png") ||
      /\.png$/i.test(typeof file.name === "string" ? file.name : "");

    if (!isPngUpload) {
      return NextResponse.json({ error: "Only PNG files are supported for ICO export." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const normalizedBuffer = createSquarePngBuffer(buffer);
    const icoModule = await import("png-to-ico");
    const pngToIco = icoModule.default || icoModule;
    const icoBuffer = await pngToIco(normalizedBuffer);

    return new NextResponse(icoBuffer, {
      headers: {
        "Content-Type": "image/x-icon",
        "Content-Disposition": 'attachment; filename="icon.ico"',
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create ICO output.",
      },
      { status: 500 },
    );
  }
}

function createSquarePngBuffer(buffer) {
  const source = PNG.sync.read(buffer);

  if (source.width === source.height) {
    return buffer;
  }

  const size = Math.max(source.width, source.height);
  const target = new PNG({ width: size, height: size });
  const offsetX = Math.floor((size - source.width) / 2);
  const offsetY = Math.floor((size - source.height) / 2);

  PNG.bitblt(source, target, 0, 0, source.width, source.height, offsetX, offsetY);
  return PNG.sync.write(target);
}
