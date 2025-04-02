//Dependencies
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');


const logger = require('../../utils/logger');
const User = require('../../models/user');
const { hashPassword, validatePassword} = require('../../utils/auth.utils');

//Definitions

exports.register = async (req, res) => {
    const {first_name, last_name, business_name, industry, email, phone_number, password, confirm_password} = req.body;
    if (!first_name || !last_name || !business_name || !industry || !email || !phone_number || !password || !confirm_password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
    })
}

    if (password !== confirm_password) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
    })
}

    if (!validatePassword(password)) {
        return res.status(400).json({
            success: false,
            message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
    })
}

    try {
        logger.info(`START: Attempting to register a new user`);
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone_number: phone_number }
                ]
            }
            });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
        })
    }

        const hashedPassword = await hashPassword(password);
        const user_id = uuidv4()
        const created_at = new Date().toISOString();
        const updated_at = new Date().toISOString();
        const newUser = await User.create({
            user_id,
            first_name,
            last_name,
            business_name,
            industry,
            email,
            phone_number,
            password_hash: hashedPassword,
            created_at,
            updated_at
        });

        const userData = {
            user_id: newUser.user_id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            business_name: newUser.business_name,
            industry: newUser.industry,
            email: newUser.email,
            email_verified: newUser.email_verified,
            created_at: newUser.created_at
        };

        logger.info(`END: Successfully registered user with user_id: ${user_id}`)
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userData
        });
    } catch (error) {
        logger.error(`Error registering user: ${error.message}\nStack trace: ${error.stack}`);
            res.status(500).json({
                success: false,
                message: "Internal server error",
        });
    }
    }