import { ARCHIVED_TOOL_REDIRECTS } from "./lib/archived-tools.mjs";

const isDev = process.env.NODE_ENV !== "production";

function createSecurityHeaders({ isDevMode }) {
  const scriptSrc = ["'self'", "'unsafe-inline'"];
  const connectSrc = ["'self'", "https://api.openai.com"];

  if (isDevMode) {
    scriptSrc.push("'unsafe-eval'");
    connectSrc.push("ws://127.0.0.1:*", "ws://localhost:*", "http://127.0.0.1:*", "http://localhost:*");
  }

  return [
    {
      key: "Content-Security-Policy",
      value: [
        "default-src 'self'",
        `script-src ${scriptSrc.join(" ")}`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "media-src 'self' blob: data:",
        `connect-src ${connectSrc.join(" ")}`,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
      ].join("; "),
    },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self), payment=(), usb=()" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  async redirects() {
    return [
      ...Object.entries(ARCHIVED_TOOL_REDIRECTS).map(([slug, destination]) => ({
        source: `/tools/${slug}`,
        destination,
        permanent: true,
      })),
      {
        source: "/salary-to-hourly-calculator",
        destination: "/tools/salary-to-hourly-calculator",
        permanent: true,
      },
      {
        source: "/take-home-pay-calculator",
        destination: "/tools/take-home-pay-calculator",
        permanent: true,
      },
      {
        source: "/freelance-rate-calculator",
        destination: "/tools/freelancer-rate-reality-calculator",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecurityHeaders({ isDevMode: isDev }),
      },
    ];
  },
};

export default nextConfig;
