const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    salePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    specsJson: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'specs_json',
    },

    colorsJson: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'colors_json',
    },

    sizesJson: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'sizes_json',
    },
  },
  {
    tableName: 'Products',
    timestamps: true,
  }
);

module.exports = Product;