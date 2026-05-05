import { LegalPageShell } from "@/components/legal/legal-page-shell";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";

export const metadata = {
  title: "Contact",
  description: "Find the support, corrections, and privacy contact expectations for Toolslify.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <LegalPageShell
      badge="Contact"
      title="Contact Toolslify"
      intro="Toolslify should publish a clear contact path for support, corrections, privacy questions, and business inquiries. This page keeps those expectations in one place."
      cardSection={{
        heading: "Primary contact channel",
        body: CONTACT_EMAIL
          ? `The current public support inbox is ${CONTACT_EMAIL}. Use it for product support, factual corrections, and general business inquiries.`
          : "A public support inbox has not been configured in this environment yet. Add NEXT_PUBLIC_CONTACT_EMAIL before launch so users have a visible correction and support channel.",
      }}
      sections={[
        {
          heading: "Support requests",
          body: "Use the published contact channel for product issues, broken pages, incorrect calculations, or questions about how a tool behaves in practice.",
        },
        {
          heading: "Corrections and feedback",
          body: "If you spot a factual issue, confusing methodology note, or misleading assumption, send the route, the input used, and the expected behavior so the issue can be reviewed quickly.",
        },
        {
          heading: "Privacy and legal requests",
          body: "Privacy, policy, or compliance questions should be routed through the same published contact path until a dedicated legal or privacy inbox is added.",
        },
        {
          heading: "Launch checklist",
          body: "Before production launch, publish a monitored email address, expected response window, business entity details if required, and any region-specific compliance contact information that applies to your operation.",
        },
      ]}
    />
  );
}
