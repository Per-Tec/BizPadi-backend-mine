 const Product = require('./products');

//const Product = require('./products');
const { DataTypes } = require('sequelize');
const User = require('./user');
const db = require('../configs/db');

const saleSchema = {
  sale_id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
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
  product_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'products',
      key: 'product_id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  cost_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  selling_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  profit_made: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}

const Sale = db.sequelize.define("Sale", saleSchema, {timestamps: false, tableName: 'sales'})

Sale.belongsTo(Product, {
  foreignKey: 'product_id',
});
Product.hasMany(Sale, {
  foreignKey: 'product_id',
});

Sale.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasMany(Sale, {
  foreignKey: 'user_id',
});

module.exports = Sale





