import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '../services/api'
import { isValidEmail } from '../utils/format'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValidEmail(email)) { setError('Enter a valid email address.'); return }
    setError(null)
    setSubmitting(true)
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <div className="card form-card">
        <h1>Reset your password</h1>
        {sent ? (
          <p>If an account exists for <strong>{email}</strong>, we've sent a link to reset your password.</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p>Enter the email linked to your account and we'll send you a reset link.</p>
            <div className="form-row">
              <label htmlFor="reset-email">Email</label>
              <input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {error && <p className="form-error">{error}</p>}
            </div>
            <button className={`btn btn-primary btn-block ${submitting ? 'btn-loading' : ''}`} disabled={submitting}>Send Reset Link</button>
          </form>
        )}
        <div className="auth-links">
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  )
}
