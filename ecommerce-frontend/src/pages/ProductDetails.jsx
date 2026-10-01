import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Rating from '../components/Rating'
import QuantitySelector from '../components/QuantitySelector'
import { Spinner } from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { getProductById, getReviews, submitReview } from '../services/api'
import { formatCurrency, formatDate } from '../utils/format'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState([])
  const [qty, setQty] = useState(1)
  const [color, setColor] = useState(null)
  const [size, setSize] = useState(null)
  const [tab, setTab] = useState('description')
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' })
  const [submitting, setSubmitting] = useState(false)

  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()

  function load() {
    setError(null)
    setProduct(null)
    getProductById(id).then((p) => {
      setProduct(p)
      setColor(p.colors?.[0] || null)
      setSize(p.sizes?.[0] || null)
      setQty(1)
      getReviews(id).then(setReviews)
    }).catch((e) => setError(e.message))
  }

  useEffect(load, [id])

  if (error) return <div className="container page-section"><ErrorMessage title="Product not found" message={error} onRetry={load} /></div>
  if (!product) return <div className="container page-section"><Spinner label="Loading product…" /></div>

  const variant = { color, size }
  const outOfStock = product.stock <= 0
  const wished = isWishlisted(product.id)

  async function handleSubmitReview(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitReview(product.id, { name: 'You', rating: Number(reviewForm.rating), text: reviewForm.text })
      const updated = await getReviews(product.id)
      setReviews(updated)
      setReviewForm({ rating: 5, text: '' })
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : product.rating

  return (
    <div className="container page-section">
      <div className="pd-layout">
        <div>
          <div className="pd-gallery-main">
            <span style={{ fontSize: '5rem' }} role="img" aria-hidden="true">{product.image}</span>
          </div>
          <div className="pd-thumbs">
            {[product.image, '🔎', '📦'].map((thumb, i) => (
              <button key={i} className={i === 0 ? 'active' : ''} aria-label={`View image ${i + 1}`}>
                <span style={{ fontSize: '1.4rem' }}>{thumb}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="product-category">{product.category} · {product.brand}</span>
          <h1>{product.name}</h1>
          <Rating value={product.rating} reviewCount={product.reviewCount} />
          <div className="price-row" style={{ margin: '0.75rem 0' }}>
            <span className="price-current" style={{ fontSize: '1.4rem' }}>{formatCurrency(product.salePrice)}</span>
            {product.salePrice < product.price && <span className="price-original">{formatCurrency(product.price)}</span>}
          </div>
          <p>{outOfStock ? <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Out of stock</span> : <span style={{ color: 'var(--success)', fontWeight: 600 }}>In stock</span>} — {product.stock} available</p>

          {product.colors && (
            <div>
              <label>Color</label>
              <div className="variant-row">
                {product.colors.map((c) => (
                  <button key={c} type="button" className={`variant-swatch ${color === c ? 'active' : ''}`} onClick={() => setColor(c)}>{c}</button>
                ))}
              </div>
            </div>
          )}
          {product.sizes && (
            <div>
              <label>Size</label>
              <div className="variant-row">
                {product.sizes.map((s) => (
                  <button key={s} type="button" className={`variant-swatch ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <label>Quantity</label>
          <div style={{ margin: '0.4rem 0' }}>
            <QuantitySelector value={qty} onChange={setQty} max={product.stock || 1} />
          </div>

          <div className="pd-actions">
            <button className="btn btn-primary" disabled={outOfStock} onClick={() => addItem(product, qty, variant)}>Add to Cart</button>
            <button className="btn btn-accent" disabled={outOfStock} onClick={() => { addItem(product, qty, variant); navigate('/cart') }}>Buy Now</button>
            <button className={`btn btn-outline ${wished ? 'active' : ''}`} onClick={() => toggleWishlist(product)}>
              {wished ? '♥ Wishlisted' : '♡ Add to Wishlist'}
            </button>
          </div>

          <div className="card" style={{ padding: '1rem', fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
            <p style={{ margin: 0 }}>🚚 Free shipping on orders over $75. Estimated delivery in 3–6 business days.</p>
            <p style={{ margin: '0.4rem 0 0' }}>↩️ Free returns within 30 days of delivery.</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <div className="tabs">
          <button className={`tab-btn ${tab === 'description' ? 'active' : ''}`} onClick={() => setTab('description')}>Description</button>
          <button className={`tab-btn ${tab === 'specs' ? 'active' : ''}`} onClick={() => setTab('specs')}>Specifications</button>
          <button className={`tab-btn ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>Reviews ({reviews.length})</button>
        </div>

        {tab === 'description' && <p style={{ maxWidth: '70ch' }}>{product.description}</p>}

        {tab === 'specs' && (
          <table style={{ width: '100%', maxWidth: '60ch', borderCollapse: 'collapse' }}>
            <tbody>
              {Object.entries(product.specs || {}).map(([k, v]) => (
                <tr key={k} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: 600 }}>{k}</td>
                  <td style={{ padding: '0.5rem 0', color: 'var(--ink-soft)' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'reviews' && (
          <div style={{ maxWidth: '60ch' }}>
            <p><strong>{avgRating.toFixed(1)}</strong> average out of {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            {reviews.length === 0 && <p>No reviews yet. Be the first to share your thoughts.</p>}
            {reviews.map((r) => (
              <div key={r.id} className="review-item">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{r.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{formatDate(r.date)}</span>
                </div>
                <Rating value={r.rating} />
                <p style={{ margin: '0.35rem 0 0' }}>{r.text}</p>
              </div>
            ))}

            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview} style={{ marginTop: '1.5rem' }}>
                <h4>Write a review</h4>
                <div className="form-row">
                  <label htmlFor="review-rating">Rating</label>
                  <select id="review-rating" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}>
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <label htmlFor="review-text">Your review</label>
                  <textarea id="review-text" rows={3} required value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} />
                </div>
                <button className={`btn btn-primary ${submitting ? 'btn-loading' : ''}`} disabled={submitting}>Submit Review</button>
              </form>
            ) : (
              <p style={{ marginTop: '1.5rem' }}><Link to="/login">Log in</Link> to write a review.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
