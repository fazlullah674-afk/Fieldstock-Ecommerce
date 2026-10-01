import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container page-section state-block" style={{ padding: '5rem 1rem' }}>
      <div className="icon">🧭</div>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <div className="actions">
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  )
}
