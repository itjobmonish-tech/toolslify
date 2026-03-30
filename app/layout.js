import Script from "next/script";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { PreferencesProvider } from "@/components/providers/preferences-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL, SOCIAL_IMAGE, TWITTER_IMAGE_PATH } from "@/lib/site-data";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Toolslify",
  title: {
    default: "Toolslify | Premium AI Utility Suite",
    template: "%s | Toolslify",
  },
  description:
    "Toolslify is a premium multi-tool AI platform for humanizing text, generating assignments, summarizing meetings, transcribing voice notes, and converting PDFs.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Toolslify",
    description:
      "All-in-one AI writing toolkit for students, creators, and professionals with premium UX and production-ready workflows.",
    url: SITE_URL,
    siteName: "Toolslify",
    type: "website",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolslify",
    description:
      "Premium AI utility suite for humanizing text, summarizing notes, converting voice and PDFs, and shipping cleaner outputs faster.",
    images: [TWITTER_IMAGE_PATH],
  },
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <PreferencesProvider>
          <div className="app-shell">
            <div className="ambient-rings" aria-hidden="true" />
            <div className="ambient-grid" aria-hidden="true" />
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </PreferencesProvider>
      </body>
    </html>
  );
}
