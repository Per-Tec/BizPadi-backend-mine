const User = require("../../models/user");
const { generatePasswordCode } = require("../../utils/auth.utils");
const logger = require("../../utils/logger");
const { sendResetEmail } = require("../../utils/mailer.utils");

require("dotenv").config();
const { AUTH_URL } = process.env;

const { passwordresetcode, passwordresetexpire } = generatePasswordCode()


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if(!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    try{
        logger.info(`START: Sending password reset email`);
        const exisitingEmail = await User.findOne({
            where: {email: email}
        })
        if(!exisitingEmail) {
            return res.status(404).json({
                success: false,
                message: "Email not found"
            });
        }

        if(exisitingEmail.account_type !== "local") {
            return res.status(400).json({
                success: false,
                message: "Google | Facebook account cannot reset password"
            });
        }

        const password_reset_token = passwordresetcode
        const password_reset_expiry = passwordresetexpire
        await User.update({
            password_reset_token: password_reset_token,
            password_reset_token_expiry: password_reset_expiry
        },
        {
            where: {email: email}
        })
        const resetLink = `${AUTH_URL}/reset-password/${password_reset_token}`
        await sendResetEmail(exisitingEmail.email, resetLink);
        logger.info(`END: Password reset email sent successfully`);
        return res.status(200).json({
            success: true,
            message: "Password reset email sent successfully"
        });
    }
    catch(error) {
        logger.error(`ERROR:Failed to send reset mail ${error.message}`);
        return res.status(500).json({ success: false, message: "Internal Server error" });
    }

}