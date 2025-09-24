const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true,
    maxlength: [100, 'Club name cannot exceed 100 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required'],
    trim: true,
    maxlength: [2000, 'Full description cannot exceed 2000 characters']
  },
  
  // Visual Assets
  logo: {
    type: String, // Base64 string or URL to club logo
    default: null
  },
  coverImage: {
    type: String, // Base64 string or URL to cover image
    default: null
  },

  // Categories & Tags
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Technical', 'Cultural', 'Sports', 'Academic', 'Social Service',
      'Entrepreneurship', 'Arts & Crafts', 'Music & Dance', 'Literary',
      'Science & Research', 'Gaming', 'Photography', 'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],

  // Contact Information
  email: {
    type: String,
    required: [true, 'Contact email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  socialMedia: {
    instagram: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    youtube: { type: String }
  },

  // Location & Meeting
  meetingLocation: {
    type: String,
    maxlength: [200, 'Meeting location cannot exceed 200 characters']
  },
  meetingTime: {
    type: String,
    maxlength: [100, 'Meeting time cannot exceed 100 characters']
  },

  // Requirements
  eligibility: [{
    type: String,
    trim: true
  }],
  recruitmentStatus: {
    type: String,
    enum: ['Open', 'Closed', 'Coming Soon'],
    default: 'Closed'
  },
  
  // Statistics
  memberCount: {
    type: Number,
    default: 0,
    min: [0, 'Member count cannot be negative']
  },
  foundedYear: {
    type: Number,
    min: [2000, 'Founded year must be 2000 or later'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },

  // Management
  admins: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['Super Admin', 'Admin', 'Moderator'],
      default: 'Admin'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false // Admin verification required
  },
  
  // Metadata
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
clubSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for searching
clubSchema.index({ name: 'text', shortDescription: 'text', tags: 'text' });
clubSchema.index({ category: 1, isActive: 1, isVerified: 1 });

module.exports = mongoose.models.Club || mongoose.model('Club', clubSchema);
