import ProductCard from './ProductCard'
import EmptyState from './EmptyState'

export default function ProductGrid({ products, onQuickView, emptyMessage }) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No products found"
        message={emptyMessage || "Try adjusting your filters or search terms."}
        actionLabel="Clear filters"
        actionTo="/products"
      />
    )
  }
  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
      ))}
    </div>
  )
}
