import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isValidEmail } from '../utils/format'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  function handleSubscribe(e) {
    e.preventDefault()
    if (!isValidEmail(email)) { setStatus('error'); return }
    setStatus('success')
    setEmail('')
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="brand" style={{ color: '#fff' }}>Field<span style={{ color: 'var(--ochre)' }}>Stock</span></span>
            <p style={{ color: '#a9b8b0', marginTop: '0.75rem', fontSize: '0.88rem' }}>Everyday goods, built to last.</p>
          </div>
          <div>
            <h4>Customer Service</h4>
            <ul>
              <li><Link to="/about">Contact Us</Link></li>
              <li><Link to="/about">FAQ</Link></li>
              <li><Link to="/about">Shipping Information</Link></li>
              <li><Link to="/about">Returns</Link></li>
              <li><Link to="/about">Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/about">Careers</Link></li>
              <li><Link to="/about">Privacy Policy</Link></li>
              <li><Link to="/about">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4>Account</h4>
            <ul>
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4>Stay in the loop</h4>
            <p style={{ color: '#a9b8b0', fontSize: '0.85rem' }}>New arrivals and seasonal offers, twice a month.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <label htmlFor="footer-email" className="visually-hidden">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus(null) }}
              />
              <button type="submit" className="btn btn-accent btn-sm">Subscribe</button>
            </form>
            {status === 'success' && <p style={{ color: 'var(--sage)', fontSize: '0.8rem', marginTop: '0.4rem' }}>Subscribed! Check your inbox.</p>}
            {status === 'error' && <p style={{ color: '#e3897c', fontSize: '0.8rem', marginTop: '0.4rem' }}>Enter a valid email address.</p>}
            <div className="footer-social">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">ig</a>
              <a href="#" aria-label="YouTube">yt</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} FieldStock. All rights reserved. · Built by Engr Fazl Ullah</div>
      </div>
    </footer>
  )
}
