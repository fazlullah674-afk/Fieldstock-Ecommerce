const { CartItem, Product } = require('../models')
const asyncHandler = require('../utils/asyncHandler')

function serializeCartItem(item, product) {
  return {
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    variant: item.variantJson ? JSON.parse(item.variantJson) : {},
    product: product ? product.toPublicJSON() : undefined,
  }
}

const getCart = asyncHandler(async (req, res) => {
  const items = await CartItem.findAll({ where: { userId: req.user.id } })
  const withProducts = await Promise.all(
    items.map(async (item) => serializeCartItem(item, await Product.findByPk(item.productId)))
  )
  res.json(withProducts)
})

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variant = {} } = req.body
  const product = await Product.findByPk(productId)
  if (!product) {
    res.status(404)
    throw new Error('Product not found.')
  }

  const variantJson = JSON.stringify(variant)
  let item = await CartItem.findOne({ where: { userId: req.user.id, productId, variantJson } })

  if (item) {
    item.quantity = Math.min(item.quantity + Number(quantity), product.stock || 99)
    await item.save()
  } else {
    item = await CartItem.create({ userId: req.user.id, productId, quantity: Number(quantity), variantJson })
  }

  res.status(201).json(serializeCartItem(item, product))
})

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body
  const item = await CartItem.findOne({ where: { id: req.params.id, userId: req.user.id } })
  if (!item) {
    res.status(404)
    throw new Error('Cart item not found.')
  }
  item.quantity = Math.max(1, Number(quantity))
  await item.save()
  const product = await Product.findByPk(item.productId)
  res.json(serializeCartItem(item, product))
})

const removeCartItem = asyncHandler(async (req, res) => {
  const item = await CartItem.findOne({ where: { id: req.params.id, userId: req.user.id } })
  if (!item) {
    res.status(404)
    throw new Error('Cart item not found.')
  }
  await item.destroy()
  res.json({ success: true })
})

module.exports = { getCart, addToCart, updateCartItem, removeCartItem }
