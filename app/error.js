"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-shell">
      <Card className="mx-auto max-w-3xl p-8 text-center sm:p-12">
        <h1 className="text-4xl font-semibold text-[var(--foreground)]">Something went wrong</h1>
        <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
          The request did not complete as expected. No internal stack traces are shown here, and you can safely retry or
          head back into the tool suite.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={() => reset()}>Try again</Button>
          <Button as={Link} href="/tools" variant="secondary">
            View tools
          </Button>
        </div>
      </Card>
    </div>
  );
}
