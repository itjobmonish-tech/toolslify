import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata = {
  title: "Privacy Policy",
  description: "Read how Toolslify handles inputs, local history, and product security across its online tools.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      badge="Legal"
      title="Privacy Policy"
      intro="Toolslify is designed around a simple principle: inputs should be processed to deliver a result, not stored as a hidden product asset. This page explains how the current platform handles information, browser storage, and security behavior."
      cardSection={{
        heading: "What we process",
        body: "Toolslify processes the text and values that you submit to the tool you are actively using. The request is handled in memory for the purpose of generating the result you asked for.",
      }}
      sections={[
        {
          heading: "What we do not store",
          body: "Toolslify does not persist tool inputs or outputs on the server after the request is completed. The current platform is designed to avoid long-term request storage for core tools.",
        },
        {
          heading: "Local browser storage",
          body: "Theme preference, language preference, and recent history are stored in your browser so the product can feel fast and familiar when you come back. That data stays on the device unless you clear browser storage.",
        },
        {
          heading: "File handling",
          body: "If you use a tool that accepts pasted notes or uploaded content, the request is processed only for the current response and is not intended to become a long-term stored dataset.",
        },
        {
          heading: "Security measures",
          body: "Toolslify applies request sanitization, rate limiting, and common security headers including Content Security Policy, X-Frame-Options, X-Content-Type-Options, and Strict-Transport-Security.",
        },
        {
          heading: "Contact",
          body: "If you operate Toolslify in production, you should replace this placeholder privacy contact section with your business email, address, and jurisdiction-specific compliance details.",
        },
      ]}
    />
  );
}
