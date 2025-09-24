const User = require('../models/user');

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Remove fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email;
    delete updates.enrollmentNumber;
    delete updates.isEmailVerified;
    delete updates.isActive;

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
};

// Get user profile by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password -otpCode -otpExpires');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user'
    });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profilePicture } = req.body; // Cloudinary URL

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      message: 'Profile picture updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Profile picture update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile picture'
    });
  }
};

module.exports = {
  updateProfile,
  getUserById,
  uploadProfilePicture
};
