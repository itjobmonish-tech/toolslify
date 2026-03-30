import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Terms of Service",
  description: "Review the baseline terms for using Toolslify and the responsibilities that come with AI-assisted writing tools.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="page-shell">
      <div className="prose-shell">
        <Badge tone="accent">Legal</Badge>
        <h1 className="mt-5">Terms of Service</h1>
        <p>
          These terms are a production-ready starter policy for Toolslify. If you launch the platform commercially, you
          should replace placeholder language with counsel-reviewed terms that match your jurisdiction and business
          model.
        </p>

        <h2>Using the service</h2>
        <p>
          Toolslify provides AI-assisted utilities for writing, summarization, transcription, and document conversion.
          You are responsible for reviewing the output before using it in academic, professional, legal, medical, or
          other high-stakes settings.
        </p>

        <h2>User responsibility</h2>
        <p>
          You agree not to use Toolslify for unlawful activity, harmful content, or dishonest academic or professional
          misrepresentation. AI output should always be reviewed for factual accuracy and policy compliance before use.
        </p>

        <h2>Availability</h2>
        <p>
          The platform may change, evolve, or be interrupted without notice while features are improved or scaled. No
          uptime guarantee is implied by this placeholder version of the terms.
        </p>

        <h2>Intellectual property</h2>
        <p>
          Toolslify retains rights in the product, site design, and underlying code. You retain responsibility for the
          content you submit and for how you use the generated result.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          Toolslify is provided on an as-is basis. To the maximum extent allowed by law, the operator is not liable for
          losses resulting from misuse, inaccurate output, service interruption, or failure to review generated content.
        </p>

        <h2>Updates</h2>
        <p>
          These terms can be updated as the product evolves. If you operate Toolslify in production, add an effective
          date and a change-notice process before launch.
        </p>
      </div>
    </div>
  );
}
