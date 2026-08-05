export default function BlogLoading() {
  return (
    <div className="min-h-screen pt-32 px-6 max-w-3xl mx-auto">
      <div className="section-label mb-2">
        <div className="h-3 w-16 bg-surface rounded animate-pulse" />
      </div>
      <div className="h-10 w-64 bg-surface rounded animate-pulse mb-4" />
      <div className="h-5 w-96 bg-surface rounded animate-pulse mb-12" />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-4 w-16 bg-surface rounded-full" />
              <div className="h-4 w-24 bg-surface rounded" />
            </div>
            <div className="h-6 w-3/4 bg-surface rounded mb-2" />
            <div className="h-4 w-full bg-surface rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
