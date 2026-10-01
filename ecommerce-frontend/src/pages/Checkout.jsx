import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OrderSummary from '../components/OrderSummary'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/api'
import { formatCurrency } from '../utils/format'

const STEPS = ['Shipping', 'Delivery', 'Payment', 'Review']

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', cost: 0, eta: '4–6 business days' },
  { id: 'express', label: 'Express Delivery', cost: 12.99, eta: '1–2 business days' },
]

export default function Checkout() {
  const { items, totals, coupon, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [savedAddresses] = useState(() => JSON.parse(localStorage.getItem('sw_addresses') || '[]'))
  const [addressMode, setAddressMode] = useState(savedAddresses.length ? 'saved' : 'new')
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0)
  const [newAddress, setNewAddress] = useState({ fullName: user?.name || '', phone: '', address: '', city: '', state: '', postalCode: '', country: '' })
  const [delivery, setDelivery] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' })
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)

  const shippingAddress = addressMode === 'saved' ? savedAddresses[selectedAddressIdx] : newAddress
  const deliveryCost = DELIVERY_OPTIONS.find((d) => d.id === delivery).cost
  const grandTotal = totals.total + deliveryCost

  function canProceed() {
    if (step === 0) {
      if (addressMode === 'saved') return !!shippingAddress
      return newAddress.fullName && newAddress.address && newAddress.city && newAddress.postalCode
    }
    if (step === 2 && paymentMethod === 'card') return card.number.length >= 12 && card.expiry && card.cvc
    return true
  }

  async function handlePlaceOrder() {
    setError(null)
    setPlacing(true)
    try {
      const order = await createOrder({
        items,
        totals: { ...totals, shipping: totals.shipping + deliveryCost, total: grandTotal },
        coupon,
        shippingAddress,
        deliveryMethod: DELIVERY_OPTIONS.find((d) => d.id === delivery),
        paymentMethod,
      })
      clearCart()
      navigate('/order-success', { state: { orderId: order.id } })
    } catch (err) {
      setError(err.message || 'Something went wrong placing your order.')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container page-section">
        <h1>Checkout</h1>
        <p>Your cart is empty. Add products before checking out.</p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Continue Shopping</button>
      </div>
    )
  }

  return (
    <div className="container page-section">
      <h1>Checkout</h1>
      <div className="steps-bar">
        {STEPS.map((s, i) => (
          <div key={s} className={`step-pill ${i === step ? 'active' : i < step ? 'done' : ''}`}>{i + 1}. {s}</div>
        ))}
      </div>

      <div className="cart-layout">
        <div className="card" style={{ padding: '1.5rem' }}>
          {step === 0 && (
            <div>
              <h3>Shipping Address</h3>
              {savedAddresses.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  {savedAddresses.map((a, i) => (
                    <div key={i} className={`address-card ${addressMode === 'saved' && selectedAddressIdx === i ? 'selected' : ''}`} onClick={() => { setAddressMode('saved'); setSelectedAddressIdx(i) }}>
                      <strong>{a.fullName}</strong> {a.isDefault && <span className="default-badge">Default</span>}
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>{a.address}, {a.city}, {a.state} {a.postalCode}, {a.country}</p>
                    </div>
                  ))}
                </div>
              )}
              <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }} onClick={() => setAddressMode('new')}>+ Add new address</button>
              {addressMode === 'new' && (
                <div className="form-grid-2">
                  <div className="form-row"><label>Full name</label><input value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} /></div>
                  <div className="form-row"><label>Phone</label><input value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} /></div>
                  <div className="form-row" style={{ gridColumn: '1 / -1' }}><label>Address</label><input value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} /></div>
                  <div className="form-row"><label>City</label><input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} /></div>
                  <div className="form-row"><label>State/Province</label><input value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} /></div>
                  <div className="form-row"><label>Postal code</label><input value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} /></div>
                  <div className="form-row"><label>Country</label><input value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} /></div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h3>Delivery Method</h3>
              {DELIVERY_OPTIONS.map((opt) => (
                <label key={opt.id} className="address-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <span>
                    <input type="radio" name="delivery" checked={delivery === opt.id} onChange={() => setDelivery(opt.id)} style={{ width: 'auto', marginRight: '0.6rem' }} />
                    <strong>{opt.label}</strong> — {opt.eta}
                  </span>
                  <span>{opt.cost === 0 ? 'Free' : formatCurrency(opt.cost)}</span>
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div>
              <h3>Payment Method</h3>
              {[
                { id: 'cod', label: 'Cash on Delivery' },
                { id: 'card', label: 'Credit / Debit Card' },
                { id: 'online', label: 'Online Payment' },
              ].map((m) => (
                <label key={m.id} className="address-card" style={{ cursor: 'pointer' }}>
                  <input type="radio" name="payment" checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} style={{ width: 'auto', marginRight: '0.6rem' }} />
                  {m.label}
                </label>
              ))}
              {paymentMethod === 'card' && (
                <div className="form-grid-2" style={{ marginTop: '1rem' }}>
                  <div className="form-row" style={{ gridColumn: '1 / -1' }}><label>Card number</label><input placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} /></div>
                  <div className="form-row"><label>Expiry</label><input placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} /></div>
                  <div className="form-row"><label>CVC</label><input placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} /></div>
                </div>
              )}
              {paymentMethod !== 'cod' && (
                <p style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>This is a UI-only payment form for the frontend prototype. No real payment is processed; a payment gateway will be integrated on the backend.</p>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h3>Review Your Order</h3>
              {items.map((i) => (
                <div key={i.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span>{i.name} × {i.quantity}</span>
                  <span>{formatCurrency(i.price * i.quantity)}</span>
                </div>
              ))}
              <p style={{ marginTop: '1rem' }}><strong>Shipping to:</strong> {shippingAddress?.fullName}, {shippingAddress?.address}, {shippingAddress?.city}</p>
              <p><strong>Delivery:</strong> {DELIVERY_OPTIONS.find((d) => d.id === delivery).label}</p>
              <p><strong>Payment:</strong> {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Online Payment'}</p>
              {error && <p className="form-error">{error}</p>}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button className="btn btn-ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</button>
            {step < STEPS.length - 1 ? (
              <button className="btn btn-primary" disabled={!canProceed()} onClick={() => setStep((s) => s + 1)}>Continue</button>
            ) : (
              <button className={`btn btn-accent ${placing ? 'btn-loading' : ''}`} disabled={placing} onClick={handlePlaceOrder}>Place Order</button>
            )}
          </div>
        </div>

        <OrderSummary totals={{ ...totals, shipping: totals.shipping + deliveryCost, total: grandTotal }} coupon={coupon} />
      </div>
    </div>
  )
}
