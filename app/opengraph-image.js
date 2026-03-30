import { ImageResponse } from "next/og";

export const alt = "Toolslify premium AI tool suite";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const tags = ["AI Humanizer", "Assignments", "Meeting Notes", "Voice to Text", "PDF Converter"];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(5,13,24,1) 0%, rgba(10,25,46,1) 52%, rgba(20,184,166,0.9) 100%)",
          color: "#eff6ff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 16% 18%, rgba(91,140,255,0.24), transparent 28%), radial-gradient(circle at 84% 18%, rgba(20,184,166,0.24), transparent 24%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -80,
            right: -40,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: "rgba(20,184,166,0.14)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: -90,
            left: -20,
            width: 280,
            height: 280,
            borderRadius: 9999,
            background: "rgba(91,140,255,0.14)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "54px 58px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 18px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 30,
                  height: 30,
                  borderRadius: 9999,
                  background: "linear-gradient(135deg, #5b8cff, #2dd4bf)",
                }}
              />
              Toolslify
            </div>

            <div
              style={{
                display: "flex",
                padding: "10px 16px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.08)",
                color: "#dbeafe",
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              10,000+ users
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 880 }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "10px 18px",
                borderRadius: 9999,
                background: "rgba(91,140,255,0.14)",
                color: "#bfdbfe",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Premium AI utility suite
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 72,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: "-0.06em",
              }}
            >
              Make AI text sound human and run cleaner workflows across the full suite.
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.5,
                color: "rgba(219,234,254,0.86)",
                maxWidth: 820,
              }}
            >
              Humanize writing, generate assignments, summarize meetings, transcribe voice notes, and convert PDFs with a polished SaaS-grade experience.
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, maxWidth: 860 }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    padding: "12px 18px",
                    borderRadius: 9999,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "right" }}>
              <div style={{ fontSize: 20, color: "#99f6e4", fontWeight: 700 }}>No data stored</div>
              <div style={{ fontSize: 18, color: "rgba(219,234,254,0.78)" }}>toolslify.com</div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
