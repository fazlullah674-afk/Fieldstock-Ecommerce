export function formatCurrency(value) {
  const n = Number(value) || 0
  return `$${n.toFixed(2)}`
}

export function calcDiscountPercent(original, sale) {
  if (!original || original <= sale) return 0
  return Math.round(((original - sale) / original) * 100)
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function passwordStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

export function formatDate(dateString) {
  const d = new Date(dateString)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
