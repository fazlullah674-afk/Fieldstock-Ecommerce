const sequelize = require('../config/db')
const User = require('./User')
const Category = require('./Category')
const Product = require('./Product')
const Review = require('./Review')
const CartItem = require('./CartItem')
const Coupon = require('./Coupon')
const Order = require('./Order')
const OrderItem = require('./OrderItem')

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId' })
Product.belongsTo(Category, { foreignKey: 'categoryId' })

Product.hasMany(Review, { foreignKey: 'productId' })
Review.belongsTo(Product, { foreignKey: 'productId' })

User.hasMany(Review, { foreignKey: 'userId' })
Review.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(CartItem, { foreignKey: 'userId' })
CartItem.belongsTo(User, { foreignKey: 'userId' })
Product.hasMany(CartItem, { foreignKey: 'productId' })
CartItem.belongsTo(Product, { foreignKey: 'productId' })

User.hasMany(Order, { foreignKey: 'userId' })
Order.belongsTo(User, { foreignKey: 'userId' })
Order.hasMany(OrderItem, { foreignKey: 'orderId' })
OrderItem.belongsTo(Order, { foreignKey: 'orderId' })

module.exports = { sequelize, User, Category, Product, Review, CartItem, Coupon, Order, OrderItem }
