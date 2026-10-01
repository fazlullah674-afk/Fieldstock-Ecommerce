const jwt = require('jsonwebtoken')
const { User } = require('../models')

async function protect(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. Please log in.' })
  }
  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)
    if (!user) return res.status(401).json({ message: 'User no longer exists.' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid. Please log in again.' })
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' })
  }
  next()
}

module.exports = { protect, requireAdmin }
