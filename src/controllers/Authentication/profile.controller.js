const { profile } = require('winston');
const User = require('../../models/user');
const logger = require('../../utils/logger');

exports.completeProfile = async (req, res) => {
    const user_id = req.user_id;
    if (!user_id) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated"
        });
    }
    const {business_name, industry, phone_number } = req.body;
 // Validate input
    if (!business_name || !industry || !phone_number) {
      return res.status(400).json({
        success: false,
        message: "Business name, industry, and phone number are required"
      });
    }


  try {
    logger.info(`START: Completing profile for user ${user_id}`);
    // Update user
    await User.update(
      {
        business_name,
        industry,
        phone_number,
        updated_at: new Date().toISOString()
      },
      {
        where: { user_id }
      }
    );

    logger.info(`Profile completed for user ${user_id}`);
    const updatedUser = await User.findOne({
      where: { user_id }
        });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const userData = {
        user_id: updatedUser.user_id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        business_name: updatedUser.business_name,
        industry: updatedUser.industry,
        email: updatedUser.email,
        email_verified: updatedUser.email_verified,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
        profile_photo: updatedUser.profile_photo,
        phone_number: updatedUser.phone_number,
    };
    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      data: userData
    });
  } catch (error) {
    logger.error(`Error completing profile: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};