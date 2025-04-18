module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define('Sale', {
    sale_id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'sales',
    timestamps: false,
  });

  // Optional association
  Sale.associate = models => {
    Sale.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return Sale;
};


// const { DataTypes } = require('sequelize');
// const db = require('../configs/db')

// //module.exports = (sequelize) => {
//   const Sale = db.sequelize.define('Sale', {
//     sale_id: {
//       type: DataTypes.STRING,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     product_id: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     quantity: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     total_price: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     updated_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     }
//   }, {
//     tableName: 'sales',
//     timestamps: false,
//   });

  
//   Sale.associate = (models) => {
//     Sale.belongsTo(models.Product, {
//       foreignKey: 'product_id',
//       as: 'product',
//     });
//   };

//   module.exports = Sale;

  
// //};


