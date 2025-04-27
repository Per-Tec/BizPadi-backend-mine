const User = require("../../models/user");
const { validateRefreshToken, generateAccessToken, generateRefreshToken } = require("../../utils/auth.utils");
const logger = require("../../utils/logger");



exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Refresh token not found' });
    }

    try {
        logger.info(`START: Attempting to refresh token`);

        const decoded = validateRefreshToken(refreshToken)
            // Fetch user from database
            const existingUser = await User.findOne({
                where: { user_id: decoded.id },
            });

            if (!existingUser) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Generate new tokens
            const accessToken = generateAccessToken(existingUser.user_id);
            const newRefreshToken = generateRefreshToken(existingUser.user_id);

            // Set Cookies for new tokens
            res.cookie('accessToken', 'Bearer ' + accessToken, {
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
            });

            res.cookie('refreshToken', 'Bearer ' + newRefreshToken, {
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
            });


            logger.info(`END: Token refreshed successfully`);
            return res.status(200).json({
                success: true,
                accessToken,
                refreshToken: newRefreshToken,
            });
        }
    catch (error) {
        logger.error(`ERROR: ${error.message}`);
        console.error('Error refreshing token:', error);
        res.status(500).json({ success: false, message: 'Failed to refresh token' });
    }
}