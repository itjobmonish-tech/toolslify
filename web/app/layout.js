import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://www.toolslify.com"),
  title: {
    default: "Toolslify | AI Tools for Writing, Career, and Social Growth",
    template: "%s | Toolslify",
  },
  description:
    "Toolslify publishes SEO-friendly AI tools with long-form content, canonical /tools routes, and polished SaaS workflows for writing, career, and social media use cases.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Toolslify",
    description:
      "Explore Toolslify's AI tools for writing, career growth, and social media with richer SEO pages and stronger product UX.",
    url: "https://www.toolslify.com",
    siteName: "Toolslify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolslify",
    description:
      "AI tool pages built with long-form content, internal linking, and stronger SaaS UX.",
  },
};

const themeScript = `
  (function () {
    try {
      var saved = localStorage.getItem('toolslify-theme');
      var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.dataset.theme = theme;
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch (error) {
      document.documentElement.dataset.theme = 'light';
    }
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Script id="toolslify-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <div className="app-shell">
          <div className="ambient-grid" aria-hidden="true" />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
