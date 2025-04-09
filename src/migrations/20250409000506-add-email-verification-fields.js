'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.addColumn('users', 'email_verification_code', {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'email_verification_expiry', {
      type: DataTypes.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('users', 'email_verification_code');
    await queryInterface.removeColumn('users', 'email_verification_expiry');
  }
};
