module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT
  }, {
    tableName: 'products',
    timestamps: false,
  });

  Product.associate = models => {
    Product.hasMany(models.Sale, {
      foreignKey: 'product_id',
      as: 'sales'
    });
  };

  return Product;
};


// const { DataTypes } = require('sequelize')
// const db = require('../configs/db')

// const productSchema = {
//   product_id: {
//     type: DataTypes.STRING,
//     primaryKey: true,
//     allowNull: false,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.TEXT,
//   },
//   price: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   quantity: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   image_url: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   category: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   updated_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   }
// }

// const Product = db.sequelize.define('Product', productSchema, {
//   timestamps: false,
//   tableName: 'products', // ensure this matches DB table name
//   freezeTableName: false, // prevents Sequelize from pluralizing to 'Products'
// })
// Product.associate = (models) => {
//   Product.hasMany(models.Sale, {
//     foreignKey: 'product_id',
//     as: 'sales',
//   });
// };

// module.exports = Product


