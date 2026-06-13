export function MarketGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-xl border border-border bg-card"
        />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-8 h-16 animate-pulse rounded-lg bg-muted" />
      <div className="mb-6 h-10 animate-pulse rounded-lg bg-muted" />
      <MarketGridSkeleton />
    </div>
  );
}
