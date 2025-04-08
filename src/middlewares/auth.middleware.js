const { validateAccessToken } = require("../utils/auth.utils.js");
const logger = require("../utils/logger");

const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const header = req.headers["authorization"];
    if (!header) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check bearer format
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = header.replace("Bearer ", "");

    // Validate token
    const payload = validateAccessToken(token);
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    // Add user data to request
    req.user_id = payload.id

    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = { authenticate };
