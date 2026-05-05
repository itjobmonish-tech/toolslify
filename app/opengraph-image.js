import { ImageResponse } from "next/og";

export const alt = "Toolslify professional tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const tags = ["Free Calculators", "Salary Data", "Mortgage Planning", "Everyday Tools"];

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
          background: "linear-gradient(135deg, #090611 0%, #1b1031 48%, #33215c 100%)",
          color: "#f8f7ff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 12% 14%, rgba(124,58,237,0.38), transparent 28%), radial-gradient(circle at 84% 20%, rgba(59,130,246,0.26), transparent 26%), radial-gradient(circle at 78% 84%, rgba(34,197,94,0.16), transparent 22%), radial-gradient(circle at 24% 88%, rgba(239,68,68,0.18), transparent 18%)",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 18px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 32,
                  height: 32,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
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
                color: "#ddd6fe",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Online tools
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 900 }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "10px 18px",
                borderRadius: 9999,
                background: "rgba(124,58,237,0.18)",
                color: "#e9ddff",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Free calculators
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 74,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: "-0.06em",
              }}
            >
              Fast calculators for real decisions.
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.5,
                color: "rgba(240,235,255,0.84)",
                maxWidth: 840,
              }}
            >
              Salary, cost of living, mortgage, tax, home cost, conversions, and everyday planning tools in one place.
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
                    color: "#f3f0ff",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "right" }}>
              <div style={{ fontSize: 20, color: "#c4b5fd", fontWeight: 700 }}>No account required</div>
              <div style={{ fontSize: 18, color: "rgba(240,235,255,0.78)" }}>toolslify.com</div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
