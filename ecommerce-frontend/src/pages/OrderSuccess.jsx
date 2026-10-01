import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Spinner } from '../components/Loading'
import { getOrderById } from '../services/api'
import { formatCurrency, formatDate } from '../utils/format'

export default function OrderSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = location.state?.orderId
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (!orderId) { navigate('/'); return }
    getOrderById(orderId).then(setOrder)
  }, [orderId])

  if (!order) return <div className="container page-section"><Spinner label="Loading confirmation…" /></div>

  const estDelivery = new Date(order.date)
  estDelivery.setDate(estDelivery.getDate() + (order.deliveryMethod?.id === 'express' ? 2 : 5))

  return (
    <div className="container page-section" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="state-block card" style={{ padding: '2.5rem' }}>
        <div className="icon">✅</div>
        <h1>Thank you — your order is confirmed!</h1>
        <p>Order <strong>{order.id}</strong> placed on {formatDate(order.date)}</p>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
        <h3>Order Summary</h3>
        {order.items.map((i) => (
          <div key={i.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
            <span>{i.name} × {i.quantity}</span>
            <span>{formatCurrency(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="summary-row total"><span>Total</span><span>{formatCurrency(order.totals.total)}</span></div>
        <p style={{ marginTop: '1rem' }}><strong>Shipping to:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
        <p><strong>Payment method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'card' ? 'Card' : 'Online Payment'}</p>
        <p><strong>Estimated delivery:</strong> {formatDate(estDelivery)}</p>
      </div>

      <div className="actions" style={{ marginTop: '1.5rem' }}>
        <Link to="/orders" className="btn btn-outline">View Orders</Link>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    </div>
  )
}
