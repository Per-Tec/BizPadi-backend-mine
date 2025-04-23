'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
   await queryInterface.createTable('clients', {
   client_id: {
           type: DataTypes.STRING,
           primaryKey : true,
           allowNull: false,
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
   
       email: {
           type: DataTypes.STRING,
           allowNull: false,
           unique: true,
       },
   
       phone_number: {
           type: DataTypes.STRING,
           allowNull: false,
           unique: true,
       },
       address: {
           type: DataTypes.STRING,
           allowNull: false,
           unique: true,
       },
   
   
       created_at: {
           type: DataTypes.DATE,
           defaultValue: DataTypes.NOW
       },
   
       updated_at: {
           type: DataTypes.DATE,
           defaultValue: DataTypes.NOW
       },
      }
   )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('clients')
  }
};
