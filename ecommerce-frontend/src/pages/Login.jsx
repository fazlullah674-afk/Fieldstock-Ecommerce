import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { isValidEmail } from '../utils/format'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  function validate() {
    const e = {}
    if (!isValidEmail(form.email)) e.email = 'Enter a valid email address.'
    if (!form.password) e.password = 'Password is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setFormError(null)
    if (!validate()) return
    setSubmitting(true)
    try {
      await login(form)
      addToast('Welcome back!', 'success')
      navigate(location.state?.from || '/')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <div className="card form-card">
        <h1>Log in</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} aria-invalid={!!errors.password} />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <label className="filter-option" style={{ marginBottom: '1rem' }}>
            <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
            Remember me
          </label>
          {formError && <p className="form-error">{formError}</p>}
          <button className={`btn btn-primary btn-block ${submitting ? 'btn-loading' : ''}`} disabled={submitting}>Log In</button>
        </form>
        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  )
}
