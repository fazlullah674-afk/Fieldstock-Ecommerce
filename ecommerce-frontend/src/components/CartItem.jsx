import QuantitySelector from './QuantitySelector'
import { formatCurrency } from '../utils/format'
import { useCart } from '../context/CartContext'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()
  const variantLabel = Object.values(item.variant || {}).filter(Boolean).join(' / ')

  return (
    <div className="cart-item-row">
      <span className="emoji-fallback" style={{ fontSize: '2.2rem', textAlign: 'center' }} role="img" aria-hidden="true">
        {item.image}
      </span>
      <div>
        <div style={{ fontWeight: 600 }}>{item.name}</div>
        {variantLabel && <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{variantLabel}</div>}
        <div style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{formatCurrency(item.price)}</div>
      </div>
      <QuantitySelector value={item.quantity} onChange={(q) => updateQuantity(item.key, q)} max={item.stock || 99} />
      <strong>{formatCurrency(item.price * item.quantity)}</strong>
      <button className="btn btn-ghost btn-sm" onClick={() => removeItem(item.key)}>Remove</button>
    </div>
  )
}
