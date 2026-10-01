import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import Rating from '../components/Rating'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="container page-section">
        <EmptyState icon="♡" title="Your wishlist is empty" message="Save items you love to find them here later." actionLabel="Browse Products" actionTo="/products" />
      </div>
    )
  }

  return (
    <div className="container page-section">
      <h1>Wishlist</h1>
      <div className="product-grid">
        {items.map((product) => (
          <div key={product.id} className="card product-card">
            <div className="product-media">
              <Link to={`/products/${product.id}`}>
                <span className="emoji-fallback" role="img" aria-hidden="true">{product.image}</span>
              </Link>
              {product.stock <= 0 && <span className="stock-tag">Out of stock</span>}
            </div>
            <div className="product-body">
              <Link to={`/products/${product.id}`} className="product-name">{product.name}</Link>
              <Rating value={product.rating} reviewCount={product.reviewCount} />
              <div className="price-row"><span className="price-current">{formatCurrency(product.salePrice)}</span></div>
              <div className="product-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" disabled={product.stock <= 0} onClick={() => { addItem(product, 1); removeFromWishlist(product.id) }}>
                  Move to Cart
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => removeFromWishlist(product.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
