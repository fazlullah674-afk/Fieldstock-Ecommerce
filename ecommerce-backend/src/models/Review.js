const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  text: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'Reviews',
  timestamps: true,
})

module.exports = Review
