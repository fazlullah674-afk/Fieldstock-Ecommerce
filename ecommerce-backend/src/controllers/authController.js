const bcrypt = require('bcryptjs')
const { User } = require('../models')
const generateToken = require('../utils/generateToken')
const asyncHandler = require('../utils/asyncHandler')

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role }
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Name, email, and password are all required.')
  }
  if (password.length < 8) {
    res.status(400)
    throw new Error('Password must be at least 8 characters.')
  }

  const existing = await User.findOne({ where: { email } })
  if (existing) {
    res.status(409)
    throw new Error('An account with that email already exists.')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash })

  res.status(201).json({ user: publicUser(user), token: generateToken(user) })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required.')
  }

  const user = await User.findOne({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401)
    throw new Error('Invalid email or password.')
  }

  res.json({ user: publicUser(user), token: generateToken(user) })
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) {
    res.status(400)
    throw new Error('Email is required.')
  }
  // In production this would email a signed reset link. We intentionally
  // don't reveal whether the account exists, to avoid leaking user emails.
  res.json({ success: true, message: 'If an account exists for that email, a reset link has been sent.' })
})

module.exports = { register, login, forgotPassword, publicUser }
