import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastContext'

const CartContext = createContext(null)
const STORAGE_KEY = 'sw_cart'
const COUPON_KEY = 'sw_coupon'

const SHIPPING_FLAT = 6.99
const FREE_SHIPPING_THRESHOLD = 75
const TAX_RATE = 0.07

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
  })
  const [coupon, setCoupon] = useState(() => {
    try { return JSON.parse(localStorage.getItem(COUPON_KEY)) || null } catch { return null }
  })
  const { addToast } = useToast()

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }, [items])
  useEffect(() => {
    if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon))
    else localStorage.removeItem(COUPON_KEY)
  }, [coupon])

  function addItem(product, quantity = 1, variant = {}) {
    setItems((prev) => {
      const key = product.id + JSON.stringify(variant)
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock || 99) } : i
        )
      }
      return [...prev, {
        key,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.salePrice ?? product.price,
        stock: product.stock,
        variant,
        quantity,
      }]
    })
    addToast(`${product.name} added to cart`, 'success')
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key))
    addToast('Item removed from cart', 'info')
  }

  function updateQuantity(key, quantity) {
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock || 99)) } : i))
    )
  }

  function clearCart() {
    setItems([])
    setCoupon(null)
  }

  function applyCoupon(couponData) {
    setCoupon(couponData)
    addToast(`Coupon ${couponData.code} applied`, 'success')
  }

  function removeCoupon() {
    setCoupon(null)
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const discount = coupon ? subtotal * (coupon.percent / 100) : 0
    const afterDiscount = subtotal - discount
    const shipping = items.length === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
    const tax = afterDiscount * TAX_RATE
    const total = afterDiscount + shipping + tax
    return { subtotal, discount, shipping, tax, total, itemCount: items.reduce((n, i) => n + i.quantity, 0) }
  }, [items, coupon])

  return (
    <CartContext.Provider value={{ items, coupon, addItem, removeItem, updateQuantity, clearCart, applyCoupon, removeCoupon, totals }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
