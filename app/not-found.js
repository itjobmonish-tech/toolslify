import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <div className="page-shell">
      <Card className="mx-auto max-w-3xl p-8 text-center sm:p-12">
        <Badge tone="accent">404</Badge>
        <h1 className="mt-5 text-5xl font-semibold text-[var(--foreground)]">Page not found</h1>
        <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
          The page you were looking for does not exist or has moved into the new Toolslify platform structure.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button as={Link} href="/">
            Go home
          </Button>
          <Button as={Link} href="/tools" variant="secondary">
            Browse tools
          </Button>
        </div>
      </Card>
    </div>
  );
}
