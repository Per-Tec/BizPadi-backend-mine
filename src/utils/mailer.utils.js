const nodemailer = require('nodemailer');
const logger = require('./logger');
require('dotenv').config();



const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});


const sendResetEmail = async (email_address, link) => {
  try {
    logger.info(`START: Sending password reset link to ${email_address}`);
    await transporter.sendMail({
      from: `"BizPadi" <${process.env.GMAIL_USER}>`,
      to: email_address,
      subject: 'Your Password Reset Link',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f8ff; border-radius: 10px;">
          <h1 style="color: #1a73e8; text-align: center;">Password Reset Link</h1>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5; text-align: center;">Use this Link to reset your password:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${link}" style="background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 20px;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center;"><em>This OTP will expire in 10 minutes.</em></p>
        </div>
      `
    });
    logger.info(`END: Sent reset link to ${email_address}`);
  } catch (error) {
    logger.error(`END: Email send failed: ${error.message}`);
    throw error;
  }
};

const sendVerificationEmail = async (email_address, link) => {
  try {
    await transporter.sendMail({
      from: `"BizPadi" <${process.env.GMAIL_USER}>`,
      to: email_address,
      subject: 'Your Verification Link',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f8ff; border-radius: 10px;">
          <h1 style="color: #1a73e8; text-align: center;">Email Verification</h1>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.5;">Please click the link below to verify your account:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${link}" style="background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Account</a>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center;"><em>This link will expire in 10 minutes.</em></p>
        </div>
      `
    });
    logger.info(`Verification email sent to ${email_address}`);
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
    throw error;
  }
}

module.exports = { sendResetEmail, sendVerificationEmail };