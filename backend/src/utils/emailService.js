const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp, userName) => {
  try {
    // For development - just log the OTP
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 OTP for ${email}: ${otp}`);
      return { success: true, messageId: 'dev-mode' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Club Recruitment IITR',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Email Verification - Club Recruitment IITR',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed; text-align: center;">Club Recruitment IITR</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>Hi ${userName},</h3>
            <p>Thank you for registering with Club Recruitment IITR. Please use the following OTP to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; background-color: #7c3aed; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 8px; letter-spacing: 5px;">
                ${otp}
              </span>
            </div>
            <p style="color: #ef4444; font-weight: bold;">⚠️ This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    
    // For development - still return success but log error
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 DEV MODE - OTP for ${email}: ${otp}`);
      return { success: true, messageId: 'dev-mode-fallback' };
    }
    
    throw new Error('Failed to send email');
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, userName) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎉 Welcome email would be sent to ${email}`);
      return { success: true };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Club Recruitment IITR',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Welcome to Club Recruitment IITR! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed; text-align: center;">Welcome to Club Recruitment IITR! 🎉</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3>Hi ${userName},</h3>
            <p>Congratulations! Your email has been verified successfully.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/login" 
                 style="display: inline-block; background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Start Exploring
              </a>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Welcome email failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail
};
