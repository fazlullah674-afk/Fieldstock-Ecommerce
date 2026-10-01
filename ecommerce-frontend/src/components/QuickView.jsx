import { Link } from 'react-router-dom'
import { useState } from 'react'
import Modal from './Modal'
import Rating from './Rating'
import QuantitySelector from './QuantitySelector'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'

export default function QuickView({ product, onClose }) {
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  return (
    <Modal isOpen={!!product} onClose={onClose} labelledBy="quickview-title">
      {product && (
        <div className="quickview-grid">
          <div className="product-media">
            <span className="emoji-fallback" role="img" aria-hidden="true">{product.image}</span>
          </div>
          <div>
            <h3 id="quickview-title">{product.name}</h3>
            <Rating value={product.rating} reviewCount={product.reviewCount} />
            <p style={{ margin: '0.75rem 0' }}>{formatCurrency(product.salePrice)}</p>
            <p>{product.description}</p>
            <div style={{ margin: '1rem 0' }}>
              <QuantitySelector value={qty} onChange={setQty} max={product.stock || 10} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                disabled={product.stock <= 0}
                onClick={() => { addItem(product, qty); onClose() }}
              >
                Add to Cart
              </button>
              <Link to={`/products/${product.id}`} className="btn btn-outline" onClick={onClose}>
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
