'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('users', 'google_id', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'profile_photo', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'account_type', {
      type: DataTypes.ENUM('local', 'google', 'facebook', 'twitter'),
      defaultValue: 'local'
    });
  },

  async down (queryInterface, Sequelize) {
    await  queryInterface.removeColumn('users', 'google_id');
    await queryInterface.removeColumn('users', 'profile_photo');
    await queryInterface.removeColumn('users', 'account_type');
  }
};
