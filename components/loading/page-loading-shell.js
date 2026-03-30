import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PageLoadingShell({ variant = "default" }) {
  const isArticle = variant === "article";
  const isTool = variant === "tool";

  return (
    <div className="page-shell animate-pulse">
      <section className="space-y-6">
        <div className="h-8 w-32 rounded-full bg-[var(--accent-surface)]" />
        <div className="space-y-3">
          <div className={cn("h-12 rounded-[28px] bg-[var(--surface-strong)]", isArticle ? "max-w-4xl" : "max-w-3xl")} />
          <div className={cn("h-12 rounded-[28px] bg-[var(--surface-strong)]", isTool ? "max-w-2xl" : "max-w-xl")} />
        </div>
        <div className="space-y-3">
          <div className="h-4 max-w-3xl rounded-full bg-[var(--surface-strong)]" />
          <div className="h-4 max-w-2xl rounded-full bg-[var(--surface-strong)]" />
          <div className="h-4 max-w-xl rounded-full bg-[var(--surface-strong)]" />
        </div>
      </section>

      {isTool ? (
        <div className="mt-10">
          <InlineWorkspaceSkeleton />
        </div>
      ) : (
        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: isArticle ? 4 : 3 }).map((_, index) => (
            <Card key={index} className="space-y-4 p-6">
              <div className="h-5 w-28 rounded-full bg-[var(--surface-strong)]" />
              <div className="h-8 rounded-[20px] bg-[var(--surface-strong)]" />
              <div className="space-y-3">
                <div className="h-4 rounded-full bg-[var(--surface-strong)]" />
                <div className="h-4 rounded-full bg-[var(--surface-strong)]" />
                <div className="h-4 w-4/5 rounded-full bg-[var(--surface-strong)]" />
              </div>
            </Card>
          ))}
        </section>
      )}

      {isArticle ? (
        <section className="mt-10 space-y-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="h-8 w-2/3 rounded-[20px] bg-[var(--surface-strong)]" />
              <div className="h-4 rounded-full bg-[var(--surface-strong)]" />
              <div className="h-4 rounded-full bg-[var(--surface-strong)]" />
              <div className="h-4 w-5/6 rounded-full bg-[var(--surface-strong)]" />
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function InlineWorkspaceSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
      <Card className="space-y-5 p-6">
        <div className="flex flex-wrap gap-3">
          <div className="h-10 w-32 rounded-full bg-[var(--surface-strong)]" />
          <div className="h-10 w-32 rounded-full bg-[var(--surface-strong)]" />
          <div className="h-10 w-32 rounded-full bg-[var(--surface-strong)]" />
        </div>
        <div className="h-64 rounded-[28px] bg-[var(--surface-strong)]" />
        <div className="flex flex-wrap gap-3">
          <div className="h-12 w-40 rounded-full bg-[var(--accent-surface)]" />
          <div className="h-12 w-32 rounded-full bg-[var(--surface-strong)]" />
        </div>
      </Card>

      <Card className="space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 rounded-[24px] bg-[var(--surface-strong)]" />
          ))}
        </div>
        <div className="h-56 rounded-[28px] bg-[var(--surface-strong)]" />
      </Card>
    </div>
  );
}
