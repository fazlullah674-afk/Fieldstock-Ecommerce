import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import { Spinner } from '../components/Loading'
import { getOrders } from '../services/api'
import { formatCurrency, formatDate } from '../utils/format'

export default function Orders() {
  const [orders, setOrders] = useState(null)

  useEffect(() => { getOrders().then(setOrders) }, [])

  if (orders === null) return <div className="container page-section"><Spinner label="Loading orders…" /></div>

  if (orders.length === 0) {
    return (
      <div className="container page-section">
        <EmptyState icon="📦" title="No orders yet" message="Once you place an order, it will show up here." actionLabel="Start Shopping" actionTo="/products" />
      </div>
    )
  }

  return (
    <div className="container page-section">
      <h1>My Orders</h1>
      {orders.map((o) => (
        <div key={o.id} className="order-row">
          <div>
            <strong>{o.id}</strong>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}>{formatDate(o.date)} · {o.items.length} item(s) · {formatCurrency(o.totals.total)}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className={`status-badge status-${o.status}`}>{o.status}</span>
            <Link to={`/orders/${o.id}`} className="btn btn-ghost btn-sm">View Details</Link>
          </div>
        </div>
      ))}
    </div>
  )
}
