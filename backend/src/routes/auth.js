const express = require('express');
const { validate } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const {
  registerSchema,
  loginSchema,
  otpVerificationSchema
} = require('../utils/validation');
const {
  register,
  verifyEmail,
  resendOTP,
  login,
  getProfile,
  testDB,
  getDBInfo
} = require('../controllers/authController');
const test = require('node:test');

const router = express.Router();

// Add logging to see if routes are being hit
router.use((req, res, next) => {
  console.log(`🛣️ Auth route hit: ${req.method} ${req.path}`);
  next();
});

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/verify-email', validate(otpVerificationSchema), verifyEmail);
router.post('/resend-otp', resendOTP);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.get('/test-db', testDB);
router.get('/db-info', getDBInfo);

module.exports = router;
