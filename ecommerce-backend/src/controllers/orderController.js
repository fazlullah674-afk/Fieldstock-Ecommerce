const { Order, OrderItem, Product, CartItem, Coupon } = require('../models')
const asyncHandler = require('../utils/asyncHandler')

const TAX_RATE = 0.07
const FREE_SHIPPING_THRESHOLD = 75
const STANDARD_SHIPPING = 6.99
const EXPRESS_SHIPPING = 12.99

function serializeOrder(order, items) {
  return {
    id: order.id,
    date: order.createdAt,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    shippingAddress: JSON.parse(order.shippingAddressJson),
    deliveryMethod: order.deliveryMethodJson ? JSON.parse(order.deliveryMethodJson) : null,
    couponCode: order.couponCode,
    totals: {
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
    },
    items: items.map((i) => ({
      key: `${i.productId}-${i.id}`,
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      variant: i.variantJson ? JSON.parse(i.variantJson) : {},
    })),
  }
}

// Prices are always re-derived from the database here — never trusted from
// the client — so a tampered request body can't change what gets charged.
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, deliveryMethod, paymentMethod, couponCode } = req.body

  if (!items || items.length === 0) {
    res.status(400)
    throw new Error('Cannot place an order with an empty cart.')
  }
  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
    res.status(400)
    throw new Error('A shipping address is required.')
  }
  if (!paymentMethod) {
    res.status(400)
    throw new Error('A payment method is required.')
  }

  let subtotal = 0
  const resolvedItems = []
  for (const line of items) {
    const product = await Product.findByPk(line.productId)
    if (!product) {
      res.status(404)
      throw new Error(`Product ${line.productId} no longer exists.`)
    }
    if (product.stock < line.quantity) {
      res.status(409)
      throw new Error(`${product.name} only has ${product.stock} left in stock.`)
    }
    const lineTotal = product.salePrice * line.quantity
    subtotal += lineTotal
    resolvedItems.push({ product, quantity: line.quantity, variant: line.variant || {} })
  }

  let discount = 0
  let appliedCoupon = null
  if (couponCode) {
    const coupon = await Coupon.findOne({ where: { code: couponCode.toUpperCase(), active: true } })
    if (coupon) {
      discount = subtotal * (coupon.percent / 100)
      appliedCoupon = coupon.code
    }
  }

  const afterDiscount = subtotal - discount
  const deliveryId = deliveryMethod?.id || 'standard'
  const shippingCost = afterDiscount === 0 ? 0
    : deliveryId === 'express' ? EXPRESS_SHIPPING
    : afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0
    : STANDARD_SHIPPING
  const tax = afterDiscount * TAX_RATE
  const total = afterDiscount + shippingCost + tax

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
  const order = await Order.create({
    id: orderId,
    userId: req.user.id,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
    shippingAddressJson: JSON.stringify(shippingAddress),
    deliveryMethodJson: deliveryMethod ? JSON.stringify(deliveryMethod) : null,
    couponCode: appliedCoupon,
    subtotal,
    discount,
    shipping: shippingCost,
    tax,
    total,
  })

  const createdItems = []
  for (const line of resolvedItems) {
    const item = await OrderItem.create({
      orderId: order.id,
      productId: line.product.id,
      name: line.product.name,
      price: line.product.salePrice,
      quantity: line.quantity,
      variantJson: JSON.stringify(line.variant),
    })
    createdItems.push(item)
    line.product.stock -= line.quantity
    await line.product.save()
  }

  // Empty the user's server-side cart now that the order is placed.
  await CartItem.destroy({ where: { userId: req.user.id } })

  res.status(201).json(serializeOrder(order, createdItems))
})

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] })
  const result = await Promise.all(
    orders.map(async (o) => serializeOrder(o, await OrderItem.findAll({ where: { orderId: o.id } })))
  )
  res.json(result)
})

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } })
  if (!order) {
    res.status(404)
    throw new Error('Order not found.')
  }
  const items = await OrderItem.findAll({ where: { orderId: order.id } })
  res.json(serializeOrder(order, items))
})

module.exports = { createOrder, getOrders, getOrderById }
