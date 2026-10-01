import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../services/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'sw_user'
const TOKEN_KEY = 'sw_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Never store real passwords — only the mock user profile and a token.
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setUser(JSON.parse(raw))
    setLoading(false)
  }, [])

  function persist(u, token) {
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    if (token) localStorage.setItem(TOKEN_KEY, token)
  }

  async function login(credentials) {
    const { user: u, token } = await api.loginUser(credentials)
    persist(u, token)
    return u
  }

  async function register(data) {
    const { user: u, token } = await api.registerUser(data)
    persist(u, token)
    return u
  }

  function updateProfile(patch) {
    const next = { ...user, ...patch }
    persist(next)
    return next
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
