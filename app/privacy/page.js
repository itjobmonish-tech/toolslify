import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy",
  description: "Read how Toolslify handles inputs, local history, and product security across the multi-tool platform.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="page-shell">
      <div className="prose-shell">
        <Badge tone="accent">Legal</Badge>
        <h1 className="mt-5">Privacy Policy</h1>
        <p>
          Toolslify is designed around a simple principle: inputs should be processed to deliver a result, not stored as
          a hidden product asset. This page explains how the current platform handles information, browser storage, and
          security behavior.
        </p>

        <Card className="mt-8 p-6">
          <h2>What we process</h2>
          <p>
            Toolslify processes the text, files, and transcript content that you submit to the tool you are actively
            using. The request is handled in memory for the purpose of generating the result you asked for.
          </p>
        </Card>

        <h2>What we do not store</h2>
        <p>
          Toolslify does not persist tool inputs or outputs on the server after the request is completed. The current
          platform is intentionally designed to avoid long-term request storage in the core workflow.
        </p>

        <h2>Local browser storage</h2>
        <p>
          Theme preference, language preference, and recent history are stored in your browser so the product can feel
          fast and familiar when you come back. That data stays on the device unless you clear browser storage.
        </p>

        <h2>File handling</h2>
        <p>
          Uploaded PDFs and audio files are processed only for the current conversion request. PDF extraction happens in
          the server runtime for the response you requested. Audio uploads can be routed through an external
          transcription provider only when a server API key is configured.
        </p>

        <h2>Security measures</h2>
        <p>
          Toolslify applies request sanitization, rate limiting, and common security headers including Content Security
          Policy, X-Frame-Options, X-Content-Type-Options, and Strict-Transport-Security.
        </p>

        <h2>Contact</h2>
        <p>
          If you operate Toolslify in production, you should replace this placeholder privacy contact section with your
          business email, address, and jurisdiction-specific compliance details.
        </p>
      </div>
    </div>
  );
}
