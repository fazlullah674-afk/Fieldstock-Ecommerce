import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import QuickView from '../components/QuickView'
import { ProductGridSkeleton } from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { getProducts, CATEGORIES } from '../services/api'

const PAGE_SIZE = 8

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [allResults, setAllResults] = useState(null)
  const [error, setError] = useState(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  const category = params.get('category') || ''
  const search = params.get('search') || ''
  const sort = params.get('sort') || 'featured'
  const minRating = Number(params.get('minRating') || 0)
  const inStockOnly = params.get('inStock') === '1'
  const discountedOnly = params.get('discounted') === '1'
  const maxPrice = params.get('maxPrice') ? Number(params.get('maxPrice')) : null

  function load() {
    setError(null)
    setAllResults(null)
    getProducts({ category, search, sort: sort === 'featured' ? null : sort, minRating: minRating || null, inStockOnly, discountedOnly, maxPrice })
      .then(setAllResults)
      .catch((e) => setError(e.message))
  }

  useEffect(() => { load(); setVisibleCount(PAGE_SIZE) }, [category, search, sort, minRating, inStockOnly, discountedOnly, maxPrice])

  function updateParam(key, value) {
    const next = new URLSearchParams(params)
    if (value === '' || value == null || value === false) next.delete(key)
    else next.set(key, value)
    setParams(next)
  }

  function clearFilters() { setParams({}) }

  const visible = allResults ? allResults.slice(0, visibleCount) : null

  return (
    <div className="container page-section">
      <h1>{category ? CATEGORIES.find((c) => c.id === category)?.name : 'Shop All'}</h1>
      {search && <p>{allResults ? allResults.length : '…'} results for "{search}"</p>}

      <div className="shop-layout">
        <aside className="filter-sidebar" aria-label="Filters">
          <div className="filter-group">
            <h4>Category</h4>
            {CATEGORIES.map((c) => (
              <label key={c.id} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={category === c.id}
                  onChange={() => updateParam('category', c.id)}
                />
                {c.name}
              </label>
            ))}
            <label className="filter-option">
              <input type="radio" name="category" checked={!category} onChange={() => updateParam('category', '')} />
              All categories
            </label>
          </div>

          <div className="filter-group">
            <h4>Price</h4>
            {[50, 100, 150].map((p) => (
              <label key={p} className="filter-option">
                <input type="radio" name="price" checked={maxPrice === p} onChange={() => updateParam('maxPrice', p)} />
                Under ${p}
              </label>
            ))}
            <label className="filter-option">
              <input type="radio" name="price" checked={!maxPrice} onChange={() => updateParam('maxPrice', '')} />
              Any price
            </label>
          </div>

          <div className="filter-group">
            <h4>Rating</h4>
            {[4, 3].map((r) => (
              <label key={r} className="filter-option">
                <input type="radio" name="rating" checked={minRating === r} onChange={() => updateParam('minRating', r)} />
                {r}★ &amp; up
              </label>
            ))}
            <label className="filter-option">
              <input type="radio" name="rating" checked={!minRating} onChange={() => updateParam('minRating', '')} />
              Any rating
            </label>
          </div>

          <div className="filter-group">
            <h4>Availability &amp; Offers</h4>
            <label className="filter-option">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => updateParam('inStock', e.target.checked ? '1' : '')} />
              In stock only
            </label>
            <label className="filter-option">
              <input type="checkbox" checked={discountedOnly} onChange={(e) => updateParam('discounted', e.target.checked ? '1' : '')} />
              On sale
            </label>
          </div>

          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>Clear Filters</button>
        </aside>

        <div>
          <div className="toolbar">
            <span>{allResults ? `${allResults.length} products` : 'Loading…'}</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              Sort by
              <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
              </select>
            </label>
          </div>

          {error ? (
            <ErrorMessage message={error} onRetry={load} />
          ) : visible === null ? (
            <ProductGridSkeleton />
          ) : (
            <>
              <ProductGrid
                products={visible}
                onQuickView={setQuickViewProduct}
                emptyMessage={search ? `No products found for "${search}".` : undefined}
              />
              {allResults.length > visible.length && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button className="btn btn-outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  )
}
