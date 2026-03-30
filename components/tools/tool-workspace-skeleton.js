import { Card } from "@/components/ui/card";

export function ToolWorkspaceSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
      <Card className="animate-pulse space-y-5 p-6">
        <div className="flex flex-wrap gap-3">
          <div className="h-10 w-28 rounded-full bg-[var(--surface-strong)]" />
          <div className="h-10 w-32 rounded-full bg-[var(--surface-strong)]" />
          <div className="h-10 w-24 rounded-full bg-[var(--surface-strong)]" />
        </div>
        <div className="h-64 rounded-[28px] bg-[var(--surface-strong)]" />
        <div className="flex flex-wrap gap-3">
          <div className="h-12 w-40 rounded-full bg-[var(--accent-surface)]" />
          <div className="h-12 w-32 rounded-full bg-[var(--surface-strong)]" />
        </div>
      </Card>

      <Card className="animate-pulse space-y-5 p-6">
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
