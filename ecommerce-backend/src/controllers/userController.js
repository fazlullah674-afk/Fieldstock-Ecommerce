const asyncHandler = require('../utils/asyncHandler')
const { publicUser } = require('./authController')

const getProfile = asyncHandler(async (req, res) => {
  res.json(publicUser(req.user))
})

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body
  if (name) req.user.name = name
  if (phone !== undefined) req.user.phone = phone
  if (address !== undefined) req.user.address = address
  await req.user.save()
  res.json(publicUser(req.user))
})

module.exports = { getProfile, updateProfile }
