// module.exports = (sequelize, DataTypes) => {
//   const Product = sequelize.define('Product', {
//     product_id: {
//       type: DataTypes.STRING,
//       primaryKey: true,
//     },
//     name: DataTypes.STRING,
//     quantity: DataTypes.INTEGER,
//     price: DataTypes.FLOAT
//   }, {
//     tableName: 'products',
//     timestamps: false,
//   });

//   Product.associate = models => {
//     Product.hasMany(models.Sale, {
//       foreignKey: 'product_id',
//       as: 'sales'
//     });
//   };

//   return Product;
// };


const { DataTypes } = require('sequelize')
const db = require('../configs/db')

const productSchema = {
  product_id: {
    type: DataTypes.STRING,
    primaryKey: true,
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
  tableName: 'products', // ensure this matches DB table name
})



module.exports = Product


