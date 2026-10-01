const express = require('express')
const { createReview } = require('../controllers/reviewController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post('/', protect, createReview)

module.exports = router
