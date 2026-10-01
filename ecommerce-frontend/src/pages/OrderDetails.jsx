import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { getOrderById } from '../services/api'
import { formatCurrency, formatDate } from '../utils/format'

const STAGES = ['Ordered', 'Confirmed', 'Processing', 'Shipped', 'Delivered']

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  function load() {
    setError(null); setOrder(null)
    getOrderById(id).then(setOrder).catch((e) => setError(e.message))
  }
  useEffect(load, [id])

  if (error) return <div className="container page-section"><ErrorMessage title="Order not found" message={error} onRetry={load} /></div>
  if (!order) return <div className="container page-section"><Spinner label="Loading order…" /></div>

  const currentStageIndex = order.status === 'Cancelled' ? -1 : STAGES.indexOf(order.status === 'Pending' ? 'Ordered' : order.status)

  return (
    <div className="container page-section">
      <h1>Order {order.id}</h1>
      <p>Placed on {formatDate(order.date)} · <span className={`status-badge status-${order.status}`}>{order.status}</span></p>

      {order.status !== 'Cancelled' && (
        <div className="tracking-timeline">
          {STAGES.map((s, i) => (
            <div key={s} className={`tracking-step ${i <= currentStageIndex ? 'done' : ''}`}>
              <div className="tracking-dot">{i <= currentStageIndex ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3>Items</h3>
        {order.items.map((i) => (
          <div key={i.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
            <span>{i.name} × {i.quantity}</span>
            <span>{formatCurrency(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="summary-row total"><span>Total</span><span>{formatCurrency(order.totals.total)}</span></div>
        <p style={{ marginTop: '1rem' }}><strong>Shipping address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
        <p><strong>Payment method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'card' ? 'Card' : 'Online Payment'}</p>
      </div>
    </div>
  )
}
