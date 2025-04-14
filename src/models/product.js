const { DataTypes } = require('sequelize')
const db = require('../configs/db')

const productSchema = {
  product_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  //  allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}

const Product = db.sequelize.define('Product', productSchema, {
  timestamps: false,
  tableName: 'products'
})

module.exports = Product
