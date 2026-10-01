const express = require('express')
const { getCart, addToCart, updateCartItem, removeCartItem } = require('../controllers/cartController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.use(protect)
router.get('/', getCart)
router.post('/', addToCart)
router.put('/:id', updateCartItem)
router.delete('/:id', removeCartItem)

module.exports = router
