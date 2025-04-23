const { DataTypes } = require('sequelize')
const db = require('../configs/db')


const clientSchema = {
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

const Client = db.sequelize.define("Client", clientSchema, {timestamps: false, tableName: 'clients'})


module.exports = Client