const User = require("../../models/user");
const logger = require("../../utils/logger");
const { Op } = require("sequelize");


exports.verifyEmail = async (req, res) => {
    const { otp } = req.params;

    if(!otp) {
        return res.status(400).json({
            success: false,
            message: "OTP is required"
        });
    }

    try{
        logger.info(`START: Verifying email with OTP`);
        const currentTime = new Date().toISOString() ;
        const validOTP = await User.findOne({
            where: {
                [Op.and]: [
                    {email_verified: false},
                    {email_verification_code : otp},
                    {email_verification_expiry: {[Op.gt]: currentTime}}
                ]
            } })

        if(!validOTP) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
        await User.update({
            email_verified: true,
            email_verification_code: null,
            email_verification_expiry: null
        },
        {
            where: {email_verification_code: otp}
        })
        logger.info(`END: Successfully verified email`);
        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    }
    catch(error) {
        logger.error(`ERROR: ${error.message}`);
        return res.status(500).json({ success: false, message: error.message });
    }

}