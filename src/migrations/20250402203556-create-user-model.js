'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
   await queryInterface.createTable('users', {
   user_id: {
           type: DataTypes.STRING,
           primaryKey : true,
           allowNull: false,
       },

       business_name: {
           type: DataTypes.STRING,
           allowNull: false,

       },

       industry: {
            type: DataTypes.STRING,
            allowNull: false,
  
        },

       first_name: {
           type: DataTypes.STRING,
           allowNull: false,
       },

       last_name: {
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

       email_verified: {
           type: DataTypes.BOOLEAN,
           defaultValue: false
       },

       password_hash: {
           type: DataTypes.STRING,
           allowNull: false,
       },

       isdeleted: {
           type: DataTypes.BOOLEAN,
           defaultValue: false
       },

       password_reset_token: {
           type: DataTypes.STRING,
           allowNull: true,
       },

       password_reset_token_expiry: {
           type: DataTypes.DATE,
           allowNull: true,
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
    await queryInterface.dropTable('users')
  }
};
