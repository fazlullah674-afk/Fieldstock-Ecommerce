import { Link } from 'react-router-dom'
import { CATEGORIES } from '../services/api'

export default function Categories() {
  return (
    <div className="container page-section">
      <h1>Categories</h1>
      <p>Browse the full range, grouped by what you're shopping for.</p>
      <div className="category-grid">
        {CATEGORIES.map((c) => (
          <Link key={c.id} to={`/products?category=${c.id}`} className="category-card">
            <span className="category-icon" role="img" aria-hidden="true">{c.icon}</span>
            <span>{c.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
