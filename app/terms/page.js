import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata = {
  title: "Terms of Service",
  description: "Review the baseline terms for using Toolslify and the responsibilities that come with calculator tools.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPageShell
      badge="Legal"
      title="Terms of Service"
      intro="These terms are a production-ready starter policy for Toolslify. If you launch the platform commercially, you should replace placeholder language with counsel-reviewed terms that match your jurisdiction and business model."
      sections={[
        {
          heading: "Using the service",
          body: "Toolslify provides browser-based tools for checking work, pay, and calculator scenarios. You are responsible for reviewing the output before using it in professional, financial, legal, medical, or other high-stakes settings.",
        },
        {
          heading: "User responsibility",
          body: "You agree not to use Toolslify for unlawful activity, harmful content, or dishonest academic or professional misrepresentation. AI output should always be reviewed for factual accuracy and policy compliance before use.",
        },
        {
          heading: "Availability",
          body: "The platform may change, evolve, or be interrupted without notice while features are improved or scaled. No uptime guarantee is implied by this placeholder version of the terms.",
        },
        {
          heading: "Intellectual property",
          body: "Toolslify retains rights in the product, site design, and underlying code. You retain responsibility for the content you submit and for how you use the generated result.",
        },
        {
          heading: "Limitation of liability",
          body: "Toolslify is provided on an as-is basis. To the maximum extent allowed by law, the operator is not liable for losses resulting from misuse, inaccurate output, service interruption, or failure to review generated content.",
        },
        {
          heading: "Updates",
          body: "These terms can be updated as the product evolves. If you operate Toolslify in production, add an effective date and a change-notice process before launch.",
        },
      ]}
    />
  );
}
