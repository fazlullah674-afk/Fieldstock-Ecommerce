const { Review, Product } = require('../models')
const asyncHandler = require('../utils/asyncHandler')

const getReviewsForProduct = asyncHandler(async (req, res) => {
  const reviews = await Review.findAll({
    where: { productId: req.params.productId },
    order: [['createdAt', 'DESC']],
  })
  res.json(reviews)
})

const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, text } = req.body
  if (!productId || !rating || !text) {
    res.status(400)
    throw new Error('productId, rating, and text are required.')
  }

  const product = await Product.findByPk(productId)
  if (!product) {
    res.status(404)
    throw new Error('Product not found.')
  }

  const review = await Review.create({
    productId,
    userId: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    text,
  })

  // Recalculate the product's aggregate rating so the catalog stays in sync.
  const allReviews = await Review.findAll({ where: { productId } })
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
  product.rating = Math.round(avg * 10) / 10
  product.reviewCount = allReviews.length
  await product.save()

  res.status(201).json(review)
})

module.exports = { getReviewsForProduct, createReview }
