import { Link } from 'react-router-dom'
import Rating from './Rating'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatCurrency, calcDiscountPercent } from '../utils/format'

export default function ProductCard({ product, onQuickView }) {
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const discount = calcDiscountPercent(product.price, product.salePrice)
  const outOfStock = product.stock <= 0
  const wished = isWishlisted(product.id)

  return (
    <div className="card product-card">
      <div className="product-media">
        <Link to={`/products/${product.id}`} aria-label={product.name}>
          <span className="emoji-fallback" role="img" aria-hidden="true">{product.image}</span>
        </Link>
        {discount > 0 && <span className="discount-tag">-{discount}%</span>}
        {outOfStock && <span className="stock-tag">Out of stock</span>}
        <button
          type="button"
          className="quick-view-btn"
          onClick={() => onQuickView && onQuickView(product)}
        >
          Quick View
        </button>
        <button
          type="button"
          className={`wishlist-toggle ${wished ? 'active' : ''}`}
          aria-pressed={wished}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => toggleWishlist(product)}
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>
      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product.id}`} className="product-name">{product.name}</Link>
        <Rating value={product.rating} reviewCount={product.reviewCount} />
        <div className="price-row">
          <span className="price-current">{formatCurrency(product.salePrice)}</span>
          {discount > 0 && <span className="price-original">{formatCurrency(product.price)}</span>}
        </div>
        <div className="product-actions">
          <button
            type="button"
            className="btn btn-primary btn-block btn-sm"
            disabled={outOfStock}
            onClick={() => addItem(product, 1)}
          >
            {outOfStock ? 'Out of stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
