const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes, createHash } = require("crypto");
const logger = require('./logger.js')

require('dotenv').config()

const { access_secret_key, access_secret_lifetime, refresh_secret_key, refresh_secret_lifetime } = process.env

exports.generatePasswordCode = async () => {
    const setToken = randomBytes(20).toString("hex");
    const passwordresetcode =  createHash("sha256").update(setToken).digest("hex");
    const passwordresetexpire = Date.now() + 15 * 60 * 1000;

    return { passwordresetcode, passwordresetexpire }
}

exports.hashPassword = async(password) => {
        const saltRounds = 10
        return await bcrypt.hash(password, saltRounds)
}

exports.verifyPassword = async(pass1, pass2)=>{
    return await bcrypt.compare(pass1, pass2)
}

exports.generateAccessToken = (id) =>{
    return jwt.sign({id}, access_secret_key,
        {expiresIn: access_secret_lifetime}
    )
}

exports.generateRefreshToken = (id) =>{
    return jwt.sign({id}, refresh_secret_key,
        {expiresIn: refresh_secret_lifetime}
    )
}

exports.validateAccessToken = (token) =>{
    try {
        return jwt.verify(token, access_secret_key)
    } catch (error) {
        logger.error(`Invalid Access token: ${error.message}`)
        return false
    }
}

exports.validateRefreshToken = (token) => {
    try {
        return jwt.verify(token, refresh_secret_key)
    } catch (error) {
        logger.error(`Invalid refresh token: ${error.message}`)
        return false
    }
}

exports.validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#./*?&])[A-Za-z\d@$!%#./*?&]{8,}$/;
    return passwordRegex.test(password);
}
