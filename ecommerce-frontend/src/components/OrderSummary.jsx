import { formatCurrency } from '../utils/format'

export default function OrderSummary({ totals, coupon, onRemoveCoupon, footer }) {
  return (
    <div className="card order-summary">
      <h3>Order Summary</h3>
      <div className="summary-row"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
      {coupon && (
        <div className="summary-row">
          <span>Coupon ({coupon.code})</span>
          <span>
            −{formatCurrency(totals.discount)}{' '}
            {onRemoveCoupon && (
              <button className="btn btn-ghost btn-sm" style={{ padding: '0.1rem 0.4rem' }} onClick={onRemoveCoupon}>✕</button>
            )}
          </span>
        </div>
      )}
      <div className="summary-row"><span>Shipping</span><span>{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</span></div>
      <div className="summary-row"><span>Tax</span><span>{formatCurrency(totals.tax)}</span></div>
      <div className="summary-row total"><span>Total</span><span>{formatCurrency(totals.total)}</span></div>
      {footer}
    </div>
  )
}
