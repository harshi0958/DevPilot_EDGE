export default function LoadingDashboard() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="flex flex-col gap-4 border-b border-border/40 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-muted/70" />
          <div className="h-4 w-72 rounded bg-muted/40" />
        </div>
        <div className="h-8 w-24 rounded bg-muted/70" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-border/60 bg-muted/30 p-5" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-72 rounded-xl border border-border/60 bg-muted/30" />
        <div className="h-72 rounded-xl border border-border/60 bg-muted/30" />
      </div>
    </div>
  );
}