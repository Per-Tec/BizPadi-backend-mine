const { DataTypes } = require('sequelize')
const db = require('../configs/db')


const userSchema = {
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

    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    google_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    profile_photo: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    account_type: {
        type: DataTypes.ENUM('local', 'google', 'facebook', 'twitter'),
        defaultValue: 'local'
    },

    password_reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    password_reset_token_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    email_verification_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    email_verification_expiry: {
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

const User = db.sequelize.define("User", userSchema, {timestamps: false, tableName: 'users'})


module.exports = User