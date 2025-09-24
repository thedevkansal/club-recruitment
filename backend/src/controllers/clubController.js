const Club = require('../models/club');
const User = require('../models/user');
const mongoose = require('mongoose');

// Create a new club
const createClub = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check if user is authorized to create clubs
    const user = await User.findById(userId);
    if (!user || !['club_admin', 'super_admin'].includes(user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to create clubs. Contact admin for permissions.'
      });
    }

    const clubData = {
      ...req.body,
      createdBy: userId,
      admins: [{
        user: userId,
        role: 'Super Admin'
      }]
    };

    console.log('🏛️ Creating club:', clubData.name);

    const club = new Club(clubData);
    const savedClub = await club.save();
    await savedClub.populate('createdBy admins.user', 'fullName email');

    console.log('✅ Club created successfully:', savedClub._id);

    res.status(201).json({
      status: 'success',
      message: 'Club created successfully!',
      data: { club: savedClub }
    });

  } catch (error) {
    console.error('Club creation error:', error);
    
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
      message: 'Failed to create club'
    });
  }
};

// Get all clubs
const getAllClubs = async (req, res) => {
  try {
    const { category, search, status = 'active', page = 1, limit = 12 } = req.query;
    
    const query = { isActive: status === 'active' };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const clubs = await Club.find(query)
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Club.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        clubs,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch clubs'
    });
  }
};

// Get single club
const getClub = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid club ID'
      });
    }

    const club = await Club.findById(id)
      .populate('createdBy admins.user', 'fullName email branch year');

    if (!club) {
      return res.status(404).json({
        status: 'error',
        message: 'Club not found'
      });
    }

    // Increment views
    await Club.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.status(200).json({
      status: 'success',
      data: { club }
    });

  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch club'
    });
  }
};

// Update club (admin only)
const updateClub = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const club = await Club.findById(id);
    if (!club) {
      return res.status(404).json({
        status: 'error',
        message: 'Club not found'
      });
    }

    // Check if user is admin of this club
    const isAdmin = club.admins.some(admin => 
      admin.user.toString() === userId.toString()
    ) || req.user.role === 'super_admin';

    if (!isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this club'
      });
    }

    const updatedClub = await Club.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('createdBy admins.user', 'fullName email');

    res.status(200).json({
      status: 'success',
      message: 'Club updated successfully',
      data: { club: updatedClub }
    });

  } catch (error) {
    console.error('Update club error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update club'
    });
  }
};

// Get user's managed clubs
const getUserClubs = async (req, res) => {
  try {
    const userId = req.user._id;

    const clubs = await Club.find({
      'admins.user': userId
    }).populate('createdBy', 'fullName');

    res.status(200).json({
      status: 'success',
      data: { clubs }
    });

  } catch (error) {
    console.error('Get user clubs error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch your clubs'
    });
  }
};

module.exports = {
  createClub,
  getAllClubs,
  getClub,
  updateClub,
  getUserClubs
};
