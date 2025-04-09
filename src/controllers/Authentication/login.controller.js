const logger = require('../../utils/logger');
const User = require('../../models/user');
const { generateAccessToken, generateRefreshToken, validatePassword, doHashValidation } = require('../../utils/auth.utils');

exports.login = async (req, res) => {
    const { email, password } = req.body;

	if (!email || !password) {
		         return res.status(400).json({
		             success: false,
		             message: "Email and password are required"
		         });
		     }

    try {
        logger.info(`START: Attempting to log in a user`);

        // Validate email & password input
        const { error } = validatePassword({ email, password });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // Fetch user from database
        const existingUser = await User.findOne({
            where: { email },
            attributes: ['user_id', 'email', 'password_hash'],
        });

        if (!existingUser) {
            return res.status(401).json({ success: false, message: 'User does not exist!' });
        }

        if(existingUser.email_verified === false) {
            return res.status(401).json({ success: false, message: 'Email not verified!' });
        }

        // Validate password
        const isValidPassword = await doHashValidation(password, existingUser.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials!' });
        }

        // Generate Tokens
        const accessToken = generateAccessToken(
            existingUser.user_id,
);

        const refreshToken = generateRefreshToken(
            existingUser.user_id,
);

        // Set Cookies for tokens
        res.cookie('AccessToken', 'Bearer ' + accessToken, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        });

        res.cookie('RefreshToken', 'Bearer ' + refreshToken, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        });

        // Prepare response data
        const existingUserData = {
            user_id: existingUser.user_id,
            email: existingUser.email,
           // verified: existingUser.verified,
        };

        logger.info(`END: User with user_id: ${existingUser.user_id} successfully logged in`);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            existingUserData: {
						user_id: existingUser.user_id,
                		first_name: existingUser.first_name,
               			last_name: existingUser.last_name,
                 		email: existingUser.email,
                		accessToken,
                 		refreshToken
					}

        });

    } catch (error) {
        logger.error(`Error logging in user: ${error.message}\nStack trace: ${error.stack}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};




