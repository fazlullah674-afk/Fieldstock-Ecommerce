import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'
import OrderSummary from '../components/OrderSummary'
import EmptyState from '../components/EmptyState'
import { useCart } from '../context/CartContext'
import { validateCoupon } from '../services/api'

export default function Cart() {
  const { items, totals, coupon, applyCoupon, removeCoupon, clearCart } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState(null)
  const [applying, setApplying] = useState(false)
  const navigate = useNavigate()

  async function handleApplyCoupon(e) {
    e.preventDefault()
    setCouponError(null)
    setApplying(true)
    try {
      const result = await validateCoupon(couponInput)
      applyCoupon(result)
      setCouponInput('')
    } catch (err) {
      setCouponError(err.message)
    } finally {
      setApplying(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container page-section">
        <EmptyState icon="🛒" title="Your cart is empty" message="Looks like you haven't added anything yet." actionLabel="Continue Shopping" actionTo="/products" />
      </div>
    )
  }

  return (
    <div className="container page-section">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          {items.map((item) => <CartItem key={item.key} item={item} />)}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <Link to="/products" className="btn btn-ghost btn-sm">Continue Shopping</Link>
            <button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear Cart</button>
          </div>
        </div>

        <div>
          <form className="coupon-row" onSubmit={handleApplyCoupon}>
            <label htmlFor="coupon" className="visually-hidden">Coupon code</label>
            <input id="coupon" placeholder="Coupon code (try SAVE10)" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
            <button className={`btn btn-outline ${applying ? 'btn-loading' : ''}`} disabled={applying || !couponInput}>Apply</button>
          </form>
          {couponError && <p className="form-error">{couponError}</p>}

          <OrderSummary
            totals={totals}
            coupon={coupon}
            onRemoveCoupon={removeCoupon}
            footer={<button className="btn btn-primary btn-block" style={{ marginTop: '1rem' }} onClick={() => navigate('/checkout')}>Proceed to Checkout</button>}
          />
        </div>
      </div>
    </div>
  )
}
