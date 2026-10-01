import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function SearchBar({ className = '' }) {
  const [params] = useSearchParams()
  const [value, setValue] = useState(params.get('search') || '')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    navigate(`/products?search=${encodeURIComponent(value.trim())}`)
  }

  return (
    <form className={`search-bar ${className}`} role="search" onSubmit={handleSubmit}>
      <label htmlFor="site-search" className="visually-hidden">Search products</label>
      <input
        id="site-search"
        type="search"
        placeholder="Search products…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" aria-label="Search">🔍</button>
    </form>
  )
}
