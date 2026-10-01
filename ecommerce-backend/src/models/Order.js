const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Order = sequelize.define('Order', {
  id: { type: DataTypes.STRING, primaryKey: true }, // e.g. ORD-482913
  userId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' }, // Pending/Confirmed/Processing/Shipped/Delivered/Cancelled
  paymentStatus: { type: DataTypes.STRING, defaultValue: 'Pending' },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  shippingAddressJson: { type: DataTypes.TEXT, allowNull: false, field: 'shipping_address_json' },
  deliveryMethodJson: { type: DataTypes.TEXT, allowNull: true, field: 'delivery_method_json' },
  couponCode: { type: DataTypes.STRING, allowNull: true },
  subtotal: { type: DataTypes.FLOAT, allowNull: false },
  discount: { type: DataTypes.FLOAT, defaultValue: 0 },
  shipping: { type: DataTypes.FLOAT, defaultValue: 0 },
  tax: { type: DataTypes.FLOAT, defaultValue: 0 },
  total: { type: DataTypes.FLOAT, allowNull: false },
}, {
  tableName: 'Orders',
  timestamps: true,
})

module.exports = Order
