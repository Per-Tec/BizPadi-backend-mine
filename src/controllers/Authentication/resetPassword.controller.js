const { validatePassword, hashPassword } = require("../../utils/auth.utils");
const logger = require("../../utils/logger");
const  User = require("../../models/user");
const { Op } = require("sequelize");



exports.resetPassword = async(req, res) =>  {
    const { token } = req.params;
    if(!token) {
        return res.status(400).json({
            success: false,
            message: "Token is required"
        });
    }
    const { password, confirm_password } = req.body;

    if(!password || !confirm_password) {
        return res.status(400).json({
            success: false,
            message: "Password and confirm password are required"
        });
    }

    if(password !== confirm_password) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        });
    }

    if(!validatePassword(password)) {
        return res.status(400).json({
            success: false,
            message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        });
    }

    try{
        logger.info('START: Attempting to reset password');
        const existingUser = await User.findOne({
            where: {
                [Op.and]: [
                    { password_reset_token: token },
                    { password_reset_token_expiry: { [Op.gt]: new Date().toISOString() } }
                ]
            }
        });

        if(!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        const hashedPassword = await hashPassword(password)
        await User.update({
            password: hashedPassword,
            password_reset_token: null,
            password_reset_token_expiry: null
        },
        {
            where: { password_reset_token: token }
        });
        logger.info('END: Password reset successfully');
        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    }
    catch(error){
        logger.error(`END: Failed to reset password : ${error.message} \n ${error.stack}`,);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}