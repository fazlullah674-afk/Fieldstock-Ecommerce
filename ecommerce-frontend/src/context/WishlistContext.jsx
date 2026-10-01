import { createContext, useContext, useEffect, useState } from 'react'
import { useToast } from './ToastContext'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'sw_wishlist'

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
  })
  const { addToast } = useToast()

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }, [items])

  function isWishlisted(productId) {
    return items.some((p) => p.id === productId)
  }

  function toggleWishlist(product) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      if (exists) {
        addToast('Removed from wishlist', 'info')
        return prev.filter((p) => p.id !== product.id)
      }
      addToast('Added to wishlist', 'success')
      return [...prev, product]
    })
  }

  function removeFromWishlist(productId) {
    setItems((prev) => prev.filter((p) => p.id !== productId))
  }

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
