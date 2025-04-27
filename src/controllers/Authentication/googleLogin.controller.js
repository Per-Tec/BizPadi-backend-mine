const { generateAccessToken, generateRefreshToken, validatePassword, doHashValidation } = require('../../utils/auth.utils');
const User = require('../../models/user');
const logger = require('../../utils/logger');

exports.handleGoogleCallback = async (req, res) => {
    try {
        logger.info(`START: Processing successful Google authentication for user ${req.user.user_id}`);

        // Fetch user from database
        const existingUser = await User.findOne({
            where: { email: req.user.email },
            attributes: ['user_id', 'email', 'password_hash'],
        });

        if (!existingUser) {
            return res.status(401).json({ success: false, message: 'User does not exist!' });
        }

        // Generate Tokens
        const accessToken = generateAccessToken(existingUser.user_id);

        const refreshToken = generateRefreshToken(existingUser.user_id)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        });

        logger.info(`END: Successfully logged in a user with Google`);
        return res.status(200).json({
            success: true,
            message: "Successfully logged in",
            data: {
                userId: existingUser.user_id,
                email: existingUser.email,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        logger.error(`ERROR: ${error.message}`);
        return res.status(500).json({ success: false, message: error.message });
    }
}