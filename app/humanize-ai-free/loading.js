export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="space-y-6 rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8">
        <div className="h-5 w-40 rounded-full bg-[var(--accent-faint)]" />
        <div className="h-12 w-2/3 rounded-full bg-[var(--accent-faint)]" />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-[320px] rounded-[28px] bg-[var(--surface-elevated)]" />
          <div className="h-[320px] rounded-[28px] bg-[var(--surface-elevated)]" />
        </div>
      </div>
    </div>
  );
}

