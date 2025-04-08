const logger = require('../../utils/logger');
const User = require('../../models/user');
const { hashPassword, verifyPassword, validatePassword } = require('../../utils/auth.utils');


exports.changePassword = async (req, res) => {
    const user_id = req.user_id; 
    const { current_password, new_password, confirm_new_password } = req.body;

    if (!current_password || !new_password || !confirm_new_password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
 
    if (new_password !== confirm_new_password) {
        return res.status(400).json({
            success: false,
            message: "New passwords do not match"
        });
    }

    if (!validatePassword(new_password)) {
        return res.status(400).json({
            success: false,
            message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        });
    }

    try {
        logger.info(`START: Attempting to change password for user_id: ${user_id}`);

        const user = await User.findOne({ where: { user_id } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await verifyPassword(current_password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const hashedNewPassword = await hashPassword(new_password);

        await User.update(
            { password_hash: hashedNewPassword, updated_at: new Date().toISOString() },
            { where: { user_id } }
        );

        logger.info(`END: Successfully changed password for user_id: ${user_id}`);

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        logger.error(`Error changing password for user_id: ${user_id} | ${error.message}\nStack trace: ${error.stack}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
