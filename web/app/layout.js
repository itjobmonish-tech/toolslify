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
    default: "Toolslify | Humanize AI Text with a Professional Rewrite Workflow",
    template: "%s | Toolslify",
  },
  description:
    "Toolslify turns AI-generated drafts into cleaner, more natural writing with tone controls, compare mode, recent history, and a polished SaaS workflow.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Toolslify",
    description:
      "Humanize AI text with a polished SaaS editor built for faster review, better readability, and stronger conversions.",
    url: "https://www.toolslify.com",
    siteName: "Toolslify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolslify",
    description:
      "Rewrite AI-generated content into more natural copy with tone controls, compare mode, and saved history.",
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

