import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { totals } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setDrawerOpen(false)
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button className="hamburger" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>☰</button>
        <Link to="/" className="brand">Field<span>Stock</span></Link>

        <nav aria-label="Main">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <SearchBar />
          <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wishlistItems.length} items`}>
            ♡
            {wishlistItems.length > 0 && <span className="badge-count">{wishlistItems.length}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" aria-label={`Cart, ${totals.itemCount} items`}>
            🛒
            {totals.itemCount > 0 && <span className="badge-count">{totals.itemCount}</span>}
          </Link>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <details>
                <summary className="icon-btn" style={{ listStyle: 'none', cursor: 'pointer' }}>👤 {user?.name}</summary>
                <div className="card" style={{ position: 'absolute', right: 0, top: '2.2rem', padding: '0.5rem', display: 'flex', flexDirection: 'column', minWidth: '160px', zIndex: 30 }}>
                  <Link to="/profile" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Profile</Link>
                  <Link to="/orders" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Orders</Link>
                  <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }} onClick={handleLogout}>Logout</button>
                </div>
              </details>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="mobile-drawer" onClick={() => setDrawerOpen(false)}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="brand">Field<span>Stock</span></span>
              <button className="btn btn-ghost btn-sm" onClick={() => setDrawerOpen(false)} aria-label="Close menu">✕</button>
            </div>
            <SearchBar className="mobile-search" />
            <ul className="nav-links" style={{ marginTop: '1rem' }}>
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end} onClick={() => setDrawerOpen(false)}>{l.label}</NavLink>
                </li>
              ))}
              <li><NavLink to="/wishlist" onClick={() => setDrawerOpen(false)}>Wishlist ({wishlistItems.length})</NavLink></li>
              <li><NavLink to="/cart" onClick={() => setDrawerOpen(false)}>Cart ({totals.itemCount})</NavLink></li>
              {isAuthenticated ? (
                <>
                  <li><NavLink to="/profile" onClick={() => setDrawerOpen(false)}>Profile</NavLink></li>
                  <li><NavLink to="/orders" onClick={() => setDrawerOpen(false)}>Orders</NavLink></li>
                  <li><button className="btn btn-ghost" onClick={handleLogout}>Logout</button></li>
                </>
              ) : (
                <>
                  <li><NavLink to="/login" onClick={() => setDrawerOpen(false)}>Login</NavLink></li>
                  <li><NavLink to="/register" onClick={() => setDrawerOpen(false)}>Register</NavLink></li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
