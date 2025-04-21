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
    type: DataTypes.STRING
  },
  quantity:{
    type: DataTypes.INTEGER
  },
  price:{
    type: DataTypes.FLOAT
  }
}

const Product = db.sequelize.define('Product', productSchema, {
  timestamps: false,
  tableName: 'products', 
})



module.exports = Product

  
