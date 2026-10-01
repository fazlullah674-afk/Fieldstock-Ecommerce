import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { isValidEmail, passwordStrength } from '../utils/format'

const STRENGTH_LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['#c0483a', '#c0483a', '#d9a62e', '#7c9a82', '#2f7a4f']

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const strength = passwordStrength(form.password)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required.'
    if (!isValidEmail(form.email)) e.email = 'Enter a valid email address.'
    if (strength < 2) e.password = 'Use at least 8 characters with a number or symbol.'
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setFormError(null)
    if (!validate()) return
    setSubmitting(true)
    try {
      await register(form)
      addToast('Account created!', 'success')
      navigate('/')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-page">
      <div className="card form-card">
        <h1>Create an account</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="name">Full name</label>
            <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          <div className="form-row">
            <label htmlFor="reg-email">Email</label>
            <input id="reg-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-row">
            <label htmlFor="reg-password">Password</label>
            <input id="reg-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} aria-invalid={!!errors.password} />
            {form.password && (
              <div className="strength-meter">
                <div className="strength-fill" style={{ width: `${(strength / 4) * 100}%`, background: STRENGTH_COLORS[strength] }} />
              </div>
            )}
            {form.password && <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', marginTop: '0.2rem' }}>{STRENGTH_LABELS[strength]}</p>}
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <div className="form-row">
            <label htmlFor="confirm-password">Confirm password</label>
            <input id="confirm-password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} aria-invalid={!!errors.confirmPassword} />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>
          {formError && <p className="form-error">{formError}</p>}
          <button className={`btn btn-primary btn-block ${submitting ? 'btn-loading' : ''}`} disabled={submitting}>Create Account</button>
        </form>
        <div className="auth-links">
          <span>Already have an account?</span>
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}
