const { Op } = require('sequelize')
const { Product } = require('../models')
const asyncHandler = require('../utils/asyncHandler')

const getProducts = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, minRating, inStockOnly, discountedOnly, sort } = req.query
  const where = {}

  if (category) where.categoryId = category
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { brand: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { categoryId: { [Op.like]: `%${search}%` } },
    ]
  }
  if (minPrice) where.salePrice = { ...(where.salePrice || {}), [Op.gte]: Number(minPrice) }
  if (maxPrice) where.salePrice = { ...(where.salePrice || {}), [Op.lte]: Number(maxPrice) }
  if (minRating) where.rating = { [Op.gte]: Number(minRating) }
  if (inStockOnly === '1' || inStockOnly === 'true') where.stock = { [Op.gt]: 0 }

  let order = [['id', 'ASC']]
  switch (sort) {
    case 'price-asc': order = [['salePrice', 'ASC']]; break
    case 'price-desc': order = [['salePrice', 'DESC']]; break
    case 'rating': order = [['rating', 'DESC']]; break
    case 'newest': order = [['id', 'DESC']]; break
    case 'popular': order = [['reviewCount', 'DESC']]; break
    default: break
  }

  let products = await Product.findAll({ where, order })
  let result = products.map((p) => p.toPublicJSON())

  // discountedOnly can't be expressed cleanly in SQL across dialects with two
  // plain columns, so it's filtered in application code after the query.
  if (discountedOnly === '1' || discountedOnly === 'true') {
    result = result.filter((p) => p.salePrice < p.price)
  }

  res.json(result)
})

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('Product not found.')
  }
  res.json(product.toPublicJSON())
})

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({ order: [['rating', 'DESC']], limit: 8 })
  res.json(products.map((p) => p.toPublicJSON()))
})

module.exports = { getProducts, getProductById, getFeaturedProducts }
