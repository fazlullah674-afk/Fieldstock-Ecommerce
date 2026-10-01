const express = require('express')
const { getProducts, getProductById, getFeaturedProducts } = require('../controllers/productController')
const { getReviewsForProduct, createReview } = require('../controllers/reviewController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/featured', getFeaturedProducts)
router.get('/:id/reviews', getReviewsForProduct)
router.get('/', getProducts)
router.get('/:id', getProductById)

module.exports = router
