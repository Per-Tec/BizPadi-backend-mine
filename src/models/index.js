// const { Sequelize } = require('sequelize');
// const dbConfig = require('../configs/db'); 
// const ProductModel = require('./product');
// const SaleModel = require('./sales');
// const UserModel = require('./user');

// // Initialize Sequelize
// const sequelize = dbConfig.sequelize;

// // Create db object
// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// // Load models
// db.Product = ProductModel;
// db.Sale = SaleModel;
// db.User = UserModel;

// // Run associations if they exist
// if (db.Product.associate) db.Product.associate(db);
// if (db.Sale.associate) db.Sale.associate(db);
// if (db.User.associate) db.User.associate(db);

// module.exports = db;


// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const dbConfig = require('../configs/db'); 
// const basename = path.basename(__filename);

// const db = {};

// // Reuse Sequelize instance from dbConfig
// const sequelize = dbConfig.sequelize;


// fs.readdirSync(__dirname)
//   .filter(file => file !== basename && file.endsWith('.js'))
//   .forEach(file => {
//     const model = require(path.join(__dirname, file));
//     const modelInstance = model(sequelize, Sequelize.DataTypes);
//     db[modelInstance.name] = modelInstance;
//   });

// // Setting up associations
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// // Export the db object
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;


