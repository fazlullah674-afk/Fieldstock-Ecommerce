const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  variantJson: { type: DataTypes.TEXT, allowNull: true, field: 'variant_json' },
}, {
  tableName: 'CartItems',
  timestamps: true,
})

module.exports = CartItem
