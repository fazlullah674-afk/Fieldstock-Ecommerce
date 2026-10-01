/**
 * API layer — now wired to the real FieldStock backend (Node.js/Express +
 * Sequelize, see /ecommerce-backend). Every function below calls a real
 * endpoint; nothing here is mocked anymore. Components never construct
 * fetch() calls directly — they only ever import from this file.
 *
 * If the backend isn't running, every call below will reject with a network
 * error, which the calling page already surfaces via its existing error
 * state + "Try Again" button.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'

const TOKEN_KEY = 'sw_token'

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } 
  catch {
   throw new Error('Could not reach the server. Is the backend running?')
  }

  let data = null
  try { data = await res.json() } catch { /* empty body, e.g. some DELETEs */ }

  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`)
  return data
}

function toQueryString(params = {}) {
  const usable = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  if (usable.length === 0) return ''
  return '?' + new URLSearchParams(usable).toString()
}

// ---------------------------------------------------------------------------
// Categories — a static fallback so the nav/home render instantly; the same
// six categories the backend seeds, kept here as a client-side cache.
// ---------------------------------------------------------------------------

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: '🎧' },
  { id: 'fashion', name: 'Fashion', icon: '🧥' },
  { id: 'shoes', name: 'Shoes', icon: '👟' },
  { id: 'accessories', name: 'Accessories', icon: '🎒' },
  { id: 'home', name: 'Home', icon: '🏺' },
  { id: 'beauty', name: 'Beauty', icon: '🧴' },
]

export async function getCategories() {
  return request('/categories')
}

// ---------------------------------------------------------------------------
// Products & reviews
// ---------------------------------------------------------------------------

export async function getProducts(params = {}) {
  const { category, search, minPrice, maxPrice, minRating, inStockOnly, discountedOnly, sort } = params
  return request(`/products${toQueryString({
    category, search, minPrice, maxPrice, minRating,
    inStockOnly: inStockOnly ? '1' : undefined,
    discountedOnly: discountedOnly ? '1' : undefined,
    sort,
  })}`)
}

export async function getProductById(id) {
  return request(`/products/${id}`)
}

export async function getProductsByCategory(category) {
  return getProducts({ category })
}

export async function searchProducts(query) {
  return getProducts({ search: query })
}

export async function getFeaturedProducts() {
  return request('/products/featured')
}

export async function getReviews(productId) {
  return request(`/products/${productId}/reviews`)
}

export async function submitReview(productId, review) {
  return request('/reviews', { method: 'POST', body: { productId, rating: review.rating, text: review.text } })
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function loginUser({ email, password }) {
  return request('/auth/login', { method: 'POST', body: { email, password } })
}

export async function registerUser({ name, email, password }) {
  return request('/auth/register', { method: 'POST', body: { name, email, password } })
}

export async function requestPasswordReset(email) {
  return request('/auth/forgot-password', { method: 'POST', body: { email } })
}

export async function getUserProfile() {
  return request('/users/profile')
}

export async function updateUserProfile(data) {
  return request('/users/profile', { method: 'PUT', body: data })
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

export async function validateCoupon(code) {
  return request('/coupons/validate', { method: 'POST', body: { code } })
}

// ---------------------------------------------------------------------------
// Server-side cart (optional — the app primarily uses the localStorage cart
// in CartContext for guests; these are here for a signed-in, multi-device
// cart if you choose to wire them in later).
// ---------------------------------------------------------------------------

export async function getServerCart() {
  return request('/cart')
}

export async function addServerCartItem(productId, quantity, variant) {
  return request('/cart', { method: 'POST', body: { productId, quantity, variant } })
}

export async function updateServerCartItem(id, quantity) {
  return request(`/cart/${id}`, { method: 'PUT', body: { quantity } })
}

export async function removeServerCartItem(id) {
  return request(`/cart/${id}`, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function createOrder({ items, coupon, shippingAddress, deliveryMethod, paymentMethod }) {
  return request('/orders', {
    method: 'POST',
    body: {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, variant: i.variant })),
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      couponCode: coupon?.code,
    },
  })
}

export async function getOrders() {
  return request('/orders')
}

export async function getOrderById(id) {
  return request(`/orders/${id}`)
}

