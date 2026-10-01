const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.STRING, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  variantJson: { type: DataTypes.TEXT, allowNull: true, field: 'variant_json' },
}, {
  tableName: 'OrderItems',
  timestamps: false,
})

module.exports = OrderItem
