const { Coupon } = require('../models')
const asyncHandler = require('../utils/asyncHandler')

const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body
  if (!code) {
    res.status(400)
    throw new Error('A coupon code is required.')
  }
  const coupon = await Coupon.findOne({ where: { code: code.toUpperCase(), active: true } })
  if (!coupon) {
    res.status(404)
    throw new Error('Invalid or expired coupon code.')
  }
  res.json({ code: coupon.code, percent: coupon.percent })
})

module.exports = { validateCoupon }
