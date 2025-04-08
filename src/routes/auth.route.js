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
router.post('/login', login);
router.post('/register', register);
router.post('/logout', authenticate, logout);
router.patch('/change-password', authenticate, changePassword);


//Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'],
    prompt: 'select_account',
 }));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
}), handleGoogleCallback);

router.post('/complete-profile', authenticate, completeProfile);

module.exports = router;