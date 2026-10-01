import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/format'

function ProfileTab() {
  const { user, updateProfile } = useAuth()
  const { addToast } = useToast()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', address: user?.address || '' })
  const [saving, setSaving] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    updateProfile(form)
    setTimeout(() => { setSaving(false); addToast('Profile updated', 'success') }, 300)
  }

  return (
    <form onSubmit={handleSave} className="card" style={{ padding: '1.5rem', maxWidth: '480px' }}>
      <h3>Profile Information</h3>
      <div className="form-row"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div className="form-row"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
      <div className="form-row"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
      <div className="form-row"><label>Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
      <button className={`btn btn-primary ${saving ? 'btn-loading' : ''}`} disabled={saving}>Save Changes</button>

      <h3 style={{ marginTop: '2rem' }}>Change Password</h3>
      <div className="form-row"><label>Current password</label><input type="password" /></div>
      <div className="form-row"><label>New password</label><input type="password" /></div>
      <button type="button" className="btn btn-outline">Update Password</button>
    </form>
  )
}

function AddressesTab() {
  const [addresses, setAddresses] = useState(() => JSON.parse(localStorage.getItem('sw_addresses') || '[]'))
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: '', state: '', postalCode: '', country: '' })
  const [editingIdx, setEditingIdx] = useState(null)
  const { addToast } = useToast()

  function persist(next) {
    setAddresses(next)
    localStorage.setItem('sw_addresses', JSON.stringify(next))
  }

  function handleAdd(e) {
    e.preventDefault()
    if (editingIdx !== null) {
      const next = addresses.map((a, i) => (i === editingIdx ? { ...form, isDefault: a.isDefault } : a))
      persist(next)
      setEditingIdx(null)
    } else {
      persist([...addresses, { ...form, isDefault: addresses.length === 0 }])
    }
    setForm({ fullName: '', phone: '', address: '', city: '', state: '', postalCode: '', country: '' })
    addToast('Address saved', 'success')
  }

  function handleDelete(idx) {
    persist(addresses.filter((_, i) => i !== idx))
  }

  function setDefault(idx) {
    persist(addresses.map((a, i) => ({ ...a, isDefault: i === idx })))
  }

  return (
    <div>
      <h3>Saved Addresses</h3>
      {addresses.map((a, i) => (
        <div key={i} className="address-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong>{a.fullName}</strong> {a.isDefault && <span className="default-badge">Default</span>}
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>{a.address}, {a.city}, {a.state} {a.postalCode}, {a.country}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
              {!a.isDefault && <button className="btn btn-ghost btn-sm" onClick={() => setDefault(i)}>Set default</button>}
              <button className="btn btn-ghost btn-sm" onClick={() => { setForm(a); setEditingIdx(i) }}>Edit</button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(i)}>Delete</button>
            </div>
          </div>
        </div>
      ))}

      <form onSubmit={handleAdd} className="card" style={{ padding: '1.25rem', marginTop: '1rem' }}>
        <h4>{editingIdx !== null ? 'Edit address' : 'Add new address'}</h4>
        <div className="form-grid-2">
          <div className="form-row"><label>Full name</label><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></div>
          <div className="form-row"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="form-row" style={{ gridColumn: '1 / -1' }}><label>Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
          <div className="form-row"><label>City</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
          <div className="form-row"><label>State/Province</label><input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
          <div className="form-row"><label>Postal code</label><input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required /></div>
          <div className="form-row"><label>Country</label><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary">{editingIdx !== null ? 'Save Address' : 'Add Address'}</button>
      </form>
    </div>
  )
}

function WishlistTab() {
  const { items } = useWishlist()
  if (items.length === 0) return <p>Your wishlist is empty. <Link to="/products">Browse products</Link>.</p>
  return (
    <div>
      {items.map((p) => (
        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
          <Link to={`/products/${p.id}`}>{p.image} {p.name}</Link>
          <span>{formatCurrency(p.salePrice)}</span>
        </div>
      ))}
    </div>
  )
}

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'orders', label: 'Orders' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'addresses', label: 'Addresses' },
]

export default function Profile() {
  const [tab, setTab] = useState('profile')
  return (
    <div className="container page-section">
      <h1>My Account</h1>
      <div className="profile-layout">
        <nav className="profile-nav" aria-label="Account sections">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </nav>
        <div>
          {tab === 'profile' && <ProfileTab />}
          {tab === 'orders' && <p>See your full order history on the <Link to="/orders">Orders page</Link>.</p>}
          {tab === 'wishlist' && <WishlistTab />}
          {tab === 'addresses' && <AddressesTab />}
        </div>
      </div>
    </div>
  )
}
