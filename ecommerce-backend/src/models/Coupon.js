const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Coupon = sequelize.define('Coupon', {
  code: { type: DataTypes.STRING, primaryKey: true },
  percent: { type: DataTypes.INTEGER, allowNull: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'Coupons',
  timestamps: false,
})

module.exports = Coupon
