const logger = require("../../utils/logger")
exports.logout = async (req, res) => {
    try {
        logger.info(`START: Attempting to log out a user`);
      // Clear cookies
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // only send over https in production
        sameSite: 'strict',
      });
  
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
  
      return res.status(200).json({
        success: true, 
        message: 'User logged out successfully',
      });
    } catch (error) {
      logger.error(`Logout Error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  