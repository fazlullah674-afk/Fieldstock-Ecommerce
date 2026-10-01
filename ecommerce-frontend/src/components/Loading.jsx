export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="loading-center" role="status" aria-live="polite">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-card" />
      ))}
    </div>
  )
}
