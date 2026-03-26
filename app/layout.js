import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: "Toolslify - Humanize AI Free | Premium AI Text Humanizer",
  description: "Transform AI-generated text into human-like content with our advanced AI humanizer. Perfect for students, writers, and professionals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-DXZK3NK4V0"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DXZK3NK4V0');
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
