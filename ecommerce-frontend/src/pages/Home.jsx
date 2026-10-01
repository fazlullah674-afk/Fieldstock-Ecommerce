import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import QuickView from '../components/QuickView'
import { ProductGridSkeleton } from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { getFeaturedProducts, CATEGORIES } from '../services/api'

export default function Home() {
  const [products, setProducts] = useState(null)
  const [error, setError] = useState(null)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  function load() {
    setError(null)
    setProducts(null)
    getFeaturedProducts().then(setProducts).catch((e) => setError(e.message))
  }

  useEffect(load, [])

  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <h1>Gear for the everyday, made to outlast the season.</h1>
          <p>FieldStock stocks the essentials — bags, footwear, and home goods built from honest materials, sold at honest prices.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
            <Link to="/categories" className="btn btn-outline">Browse Categories</Link>
          </div>
        </div>
        <div className="hero-art">
          <span className="tag">New arrivals weekly</span>
        </div>
      </section>

      <section className="container page-section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/products?category=${c.id}`} className="category-card">
              <span className="category-icon" role="img" aria-hidden="true">{c.icon}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="toolbar">
          <h2 style={{ margin: 0 }}>Featured Products</h2>
          <Link to="/products" className="btn btn-ghost btn-sm">View all</Link>
        </div>
        {error ? (
          <ErrorMessage message={error} onRetry={load} />
        ) : products === null ? (
          <ProductGridSkeleton />
        ) : (
          <ProductGrid products={products} onQuickView={setQuickViewProduct} />
        )}
      </section>

      <section className="container page-section">
        <div className="promo-grid">
          <div className="promo-card promo-1">
            <h3 style={{ color: '#fff' }}>New Arrivals</h3>
            <p style={{ color: '#d8e2dc' }}>Fresh cuts for the season ahead.</p>
          </div>
          <div className="promo-card promo-2">
            <h3 style={{ color: '#fff' }}>Seasonal Sale — up to 30% off</h3>
            <p style={{ color: '#f2e6c8' }}>Selected styles, while stock lasts.</p>
          </div>
          <div className="promo-card promo-3">
            <h3 style={{ color: '#fff' }}>Limited-Time Bundles</h3>
            <p style={{ color: '#dfe7e1' }}>Pair essentials and save more.</p>
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div className="benefits-grid">
          <div className="benefit-item"><span className="benefit-icon">🚚</span><div><strong>Free Shipping</strong><p>On orders over $75.</p></div></div>
          <div className="benefit-item"><span className="benefit-icon">🔒</span><div><strong>Secure Payment</strong><p>Your details stay protected.</p></div></div>
          <div className="benefit-item"><span className="benefit-icon">↩️</span><div><strong>Easy Returns</strong><p>30-day return window.</p></div></div>
          <div className="benefit-item"><span className="benefit-icon">💬</span><div><strong>Customer Support</strong><p>We reply within a day.</p></div></div>
        </div>
      </section>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  )
}
