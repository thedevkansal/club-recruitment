const express = require('express');
const { validate } = require('../middleware/validation');
const { authenticate, requireEmailVerification } = require('../middleware/auth');
const { profileUpdateSchema } = require('../utils/validation');
const {
  updateProfile,
  getUserById,
  uploadProfilePicture
} = require('../controllers/userController');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Update profile
router.put('/profile', validate(profileUpdateSchema), updateProfile);

// Upload profile picture
router.post('/profile-picture', uploadProfilePicture);

// Get user by ID (public profile view)
router.get('/:userId', getUserById);

module.exports = router;
