const { DataTypes } = require('sequelize')
const db = require('../configs/db')

const productSchema = {
  product_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cost_price:{
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image_url:{
    type: DataTypes.STRING,
    allowNull: true,
  },

  description: {
    type: DataTypes.TEXT,
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
  },
}

const Product = db.sequelize.define('Product', productSchema, {
  timestamps: false,
  tableName: 'products',
})



module.exports = Product

  
