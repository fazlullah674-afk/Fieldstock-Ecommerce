const { Category } = require('../models')
const asyncHandler = require('../utils/asyncHandler')

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll()
  res.json(categories)
})

module.exports = { getCategories }
