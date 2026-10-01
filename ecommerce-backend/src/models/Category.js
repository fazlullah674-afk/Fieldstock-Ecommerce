const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Category = sequelize.define('Category', {
  id: { type: DataTypes.STRING, primaryKey: true }, // slug, e.g. "electronics"
  name: { type: DataTypes.STRING, allowNull: false },
  icon: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'Categories',
  timestamps: false,
})

module.exports = Category
