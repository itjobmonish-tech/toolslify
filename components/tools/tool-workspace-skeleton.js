import { Card } from "@/components/ui/card";

export function ToolWorkspaceSkeleton() {
  return (
    <div className="workspace-grid">
      <Card className="workbench-pane animate-pulse p-5 sm:p-6">
        <div className="space-y-5 pt-10">
          <div className="space-y-3">
            <div className="h-3 w-20 rounded-full bg-[var(--surface-muted)]" />
            <div className="h-7 w-48 rounded-full bg-[var(--surface-muted)]" />
            <div className="h-4 w-full max-w-[420px] rounded-full bg-[var(--surface-muted)]" />
          </div>
          <div className="h-[280px] rounded-[20px] border border-[var(--border)] bg-[var(--background-strong)]" />
          <div className="flex flex-wrap gap-3">
            <div className="h-11 w-36 rounded-[14px] bg-[var(--accent-surface)]" />
            <div className="h-11 w-28 rounded-[14px] bg-[var(--surface-muted)]" />
          </div>
        </div>
      </Card>

      <Card className="workbench-pane animate-pulse p-5 sm:p-6">
        <div className="space-y-5 pt-10">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="h-3 w-16 rounded-full bg-[var(--surface-muted)]" />
              <div className="h-7 w-40 rounded-full bg-[var(--surface-muted)]" />
            </div>
            <div className="h-8 w-20 rounded-full bg-[var(--surface-muted)]" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`rounded-[18px] border border-[var(--border)] bg-[var(--background-strong)] p-4 ${index === 0 ? "sm:col-span-2" : ""}`}>
                <div className="h-3 w-16 rounded-full bg-[var(--surface-muted)]" />
                <div className="mt-3 h-8 w-28 rounded-full bg-[var(--surface-muted)]" />
                {index === 0 ? <div className="mt-3 h-3 w-40 rounded-full bg-[var(--surface-muted)]" /> : null}
              </div>
            ))}
          </div>
          <div className="rounded-[20px] border border-[var(--border)] bg-[var(--background-strong)] p-4">
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-3 rounded-full bg-[var(--surface-muted)]" style={{ width: `${100 - index * 10}%` }} />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
