const express = require('express');
const passport = require('passport');
const router = express.Router();

const {register} = require('../controllers/Authentication/register.controller')
const {login} = require('../controllers/Authentication/login.controller');
const { logout } = require('../controllers/Authentication/logout.controller');
const { changePassword } = require('../controllers/Authentication/changePassword.controller')
const { handleGoogleCallback } = require('../controllers/Authentication/googleLogin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { completeProfile } = require('../controllers/Authentication/profile.controller');
const { verifyEmail } = require('../controllers/Authentication/verifyEmail.controller');
const { forgotPassword } = require('../controllers/Authentication/forgotPassword.controller');
const { resetPassword } = require('../controllers/Authentication/resetPassword.controller');


// Register Route
router.post('/register', register);
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with business and personal information
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - business_name
 *               - industry
 *               - email
 *               - phone_number
 *               - password
 *               - confirm_password
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: User's first name
 *                 example: John
 *               last_name:
 *                 type: string
 *                 description: User's last name
 *                 example: Doe
 *               business_name:
 *                 type: string
 *                 description: Name of the user's business
 *                 example: Acme Corporation
 *               industry:
 *                 type: string
 *                 description: Business industry sector
 *                 example: Technology
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (must be unique)
 *                 example: john.doe@example.com
 *               phone_number:
 *                 type: string
 *                 description: User's phone number (must be unique)
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (must meet complexity requirements)
 *                 example: "Password123!"
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 description: Confirmation of the password (must match password)
 *                 example: "Password123!"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "Xy5pZ2kLmn"
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     business_name:
 *                       type: string
 *                       example: Acme Corporation
 *                     industry:
 *                       type: string
 *                       example: Technology
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     email_verified:
 *                       type: boolean
 *                       example: false
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-02T10:00:00.000Z"
 *       400:
 *         description: Bad request - validation failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *       409:
 *         description: Conflict - user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */


router.patch('/change-password', authenticate, changePassword);
/**
 * @swagger
 * /api/v1/auth/change-password:
 *   patch:
 *     tags:
 *       - Authentication
 *     summary: Change User Password
 *     description: Allows an authenticated user to change their password by providing current and new passwords.
 *     security:
 *       - bearerAuth: []   # Assuming you use Bearer token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *               - new_password
 *               - confirm_new_password
 *             properties:
 *               current_password:
 *                 type: string
 *                 example: OldPassword123!
 *               new_password:
 *                 type: string
 *                 example: NewPassword123!
 *               confirm_new_password:
 *                 type: string
 *                 example: NewPassword123!
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       '400':
 *         description: Bad Request - Missing fields, invalid password format, or passwords don't match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: New passwords do not match
 *       '401':
 *         description: Unauthorized - Invalid current password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Current password is incorrect
 *       '404':
 *         description: Not Found - User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

// Verify Email Route
router.get('/verify-email/:otp', verifyEmail)
/**
 * @swagger
 * /api/v1/auth/verify-email/{otp}:
 *   get:
 *     summary: Verify user email
 *     description: Verifies a user's email address using a one-time password (OTP).
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: otp
 *         required: true
 *         schema:
 *           type: string
 *         description: The OTP sent to the user's email for verification
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid or expired OTP
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

// Login Route
router.post('/login', login);
/** 
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User Login
 *     description: Logs in a user using email and password. Returns access and refresh tokens on success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: testuser@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 existingUserData:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: 123
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: testuser@example.com
 *                     accessToken:
 *                       type: string
 *                       example: Bearer eyJhbGciOiJIUzI1...
 *                     refreshToken:
 *                       type: string
 *                       example: Bearer eyJhbGciOiJIUzI1...
 *       '400':
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email and password are required
 *       '401':
 *         description: Invalid credentials or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User does not exist!
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error

*/

// Forgot Password Route
router.post('/forgot-password', forgotPassword);
/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Send a password reset link to user's email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's registered email address
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset email sent successfully
 *       400:
 *         description: Bad request - email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

// Logout Route
router.post('/logout', authenticate, logout);
/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out user
 *     description: Clears access and refresh token cookies to log out the user.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User logged out successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */



//Password Reset Route
router.post('/reset-password/:token', resetPassword);
/**
 * @swagger
 * /api/v1/auth/reset-password/{token}:
 *   post:
 *     summary: Reset user password
 *     description: Resets a user's password using a valid reset token.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token sent to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirm_password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass@123
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass@123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Bad request (missing fields, invalid token, password mismatch, or invalid password format)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Passwords do not match
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */


//Google Passport Auth Route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'],
    prompt: 'select_account',
 }));
 /**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects the user to Google for authentication.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to Google login
 *         headers:
 *           Location:
 *             description: The URL to the Google authentication page
 *             schema:
 *               type: string
 *               example: https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID...
 * 
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     description: Processes the Google authentication callback, retrieves the user's information, and logs them in.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully logged in
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     profilePhoto:
 *                       type: string
 *                       example: https://googleusercontent.com/profile.jpg
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized - User not found in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User does not exist!
 *       500:
 *         description: Internal server error during Google login process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */


// Google Login Route 
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
}), handleGoogleCallback);
/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     description: Processes the Google authentication callback, generates access and refresh tokens, and logs the user in.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully authenticated with Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Successfully logged in
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: User does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User does not exist!
 *       500:
 *         description: Internal server error during Google login process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */



router.put('/complete-profile', authenticate, completeProfile);

/**
 * @swagger
 * /api/v1/auth/complete-profile:
 *   post:
 *     summary: Complete user profile
 *     description: Allows an authenticated user to complete their profile by providing business name, industry, and phone number.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - business_name
 *               - industry
 *               - phone_number
 *             properties:
 *               business_name:
 *                 type: string
 *                 example: Acme Corp
 *               industry:
 *                 type: string
 *                 example: E-commerce
 *               phone_number:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Profile completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile completed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "abc123"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *                     business_name:
 *                       type: string
 *                       example: "Acme Corp"
 *                     industry:
 *                       type: string
 *                       example: "E-commerce"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     email_verified:
 *                       type: boolean
 *                       example: true
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     profile_photo:
 *                       type: string
 *                       example: "https://example.com/photo.jpg"
 *                     phone_number:
 *                       type: string
 *                       example: "+1234567890"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Business name, industry, and phone number are required
 *       401:
 *         description: User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not authenticated
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

module.exports = router;