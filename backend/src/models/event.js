const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Round/Stage Schema for competitions
const RoundSchema = new Schema({
  roundNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  duration: {
    type: String,
    trim: true,
    default: ''
  },
  briefing: {
    type: String,
    trim: true,
    default: ''
  },
  submissionLink: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Submission link must be a valid URL'
    }
  }
}, { _id: false });

// Agenda/Schedule Schema
const AgendaSchema = new Schema({
  date: {
    type: String, // YYYY-MM-DD format
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'Date must be in YYYY-MM-DD format'
    }
  },
  time: {
    type: String, // HH:MM format (24-hour)
    required: true,
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Time must be in HH:MM format (24-hour)'
    }
  },
  activity: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  duration: {
    type: String,
    trim: true,
    default: ''
  }
}, { _id: false });

// Contact Person Schema
const ContactSchema = new Schema({
  name: {
    type: String,
    required: function() {
      return this.phone && this.phone.trim(); // Only required if phone is provided
    },
    trim: true,
    maxlength: 100,
    default: ''
  },
  phone: {
    type: String,
    required: function() {
      return this.name && this.name.trim(); // Only required if name is provided
    },
    validate: {
      validator: function(v) {
        return !v || /^\d{10}$/.test(v);
      },
      message: 'Phone number must be exactly 10 digits'
    },
    default: ''
  }
}, { _id: false });

// Main Event Schema - COMPLETELY SEPARATE FROM CLUB
const EventSchema = new Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    index: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters'],
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: {
      values: ['Workshop', 'Seminar', 'Competition', 'Meeting', 'Social', 'Networking', 'Conference', 'Training', 'Hackathon', 'Other'],
      message: 'Please select a valid event type'
    },
    index: true
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: {
      values: ['Technical', 'Cultural', 'Sports', 'Academic', 'Social Service', 'Entrepreneurship', 'Arts & Crafts', 'Music & Dance', 'Literary', 'Science & Research', 'Gaming', 'Photography', 'Other'],
      message: 'Please select a valid category'
    },
    index: true
  },

  // Date & Time Information
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(v) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: 'Event date cannot be in the past'
    },
    index: true
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(v) {
        return v >= this.startDate;
      },
      message: 'End date cannot be before start date'
    }
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Start time must be in HH:MM format (24-hour)'
    }
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    validate: {
      validator: function(v) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'End time must be in HH:MM format (24-hour)'
    }
  },

  // Location Information
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true,
    maxlength: [200, 'Venue name cannot exceed 200 characters'],
    index: true
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters'],
    default: ''
  },

  // Team & Participation
  teamSize: {
    type: String,
    required: true,
    enum: ['Individual', 'Team (2-3)', 'Team (4-5)', 'Team (6-10)', 'Large Team (10+)', 'Custom'],
    default: 'Individual'
  },
  minTeamSize: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    default: 1
  },
  maxTeamSize: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
    default: 1,
    validate: {
      validator: function(v) {
        return v >= this.minTeamSize;
      },
      message: 'Maximum team size must be greater than or equal to minimum team size'
    }
  },
  maxParticipants: {
    type: Number,
    min: 1,
    max: 10000,
    default: null
  },

  // Registration Information
  registrationRequired: {
    type: Boolean,
    required: true,
    default: true
  },
  registrationDeadline: {
    type: Date,
    validate: {
      validator: function(v) {
        if (!this.registrationRequired) return true;
        if (!v) return !this.registrationRequired; // Only required if registration is required
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today && v <= this.startDate;
      },
      message: 'Registration deadline must be between today and event start date'
    }
  },
  registrationLink: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Registration link must be a valid URL'
    }
  },
  registrationFee: {
    type: Number,
    min: 0,
    max: 100000,
    default: 0
  },

  // Competition/Multi-stage Details
  numberOfRounds: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  rounds: {
    type: [RoundSchema],
    default: function() {
      return [{
        roundNumber: 1,
        name: '',
        description: '',
        duration: '',
        briefing: '',
        submissionLink: ''
      }];
    }
  },

  // Event Schedule/Agenda - OPTIONAL
  agenda: {
    type: [AgendaSchema],
    default: []
  },

  // Eligibility & Requirements - OPTIONAL
  eligibility: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr) {
        return arr.every(item => !item || item.trim().length <= 500);
      },
      message: 'Each eligibility criterion cannot exceed 500 characters'
    }
  },
  requirements: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr) {
        return arr.every(item => !item || item.trim().length <= 500);
      },
      message: 'Each requirement cannot exceed 500 characters'
    }
  },

  // Contact Information - OPTIONAL
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  contacts: {
    type: [ContactSchema],
    default: function() {
      return [{ name: '', phone: '' }];
    }
  },
  eventWebsite: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Event website must be a valid URL'
    }
  },

  // Media & Branding
  bannerImage: {
    type: String,
    trim: true,
    default: ''
  },
  images: {
    type: [String],
    default: []
  },

  // Organization - REQUIRED
  organizerClub: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    required: [true, 'Organizing club is required'],
    index: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required'],
    index: true
  },

  // Classification & Discovery
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr) {
        return arr.length <= 20 && arr.every(tag => !tag || tag.trim().length <= 50);
      },
      message: 'Maximum 20 tags allowed, each tag cannot exceed 50 characters'
    },
    index: true
  },

  // Event Status & Analytics
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Cancelled', 'Completed'],
    default: 'Published',
    index: true
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  registrationCount: {
    type: Number,
    default: 0,
    min: 0
  },
  attendanceCount: {
    type: Number,
    default: 0,
    min: 0
  },

  // Social & Engagement
  likes: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    commentedAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: {
    type: Number,
    default: 0,
    min: 0
  },

  // SEO & Search
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160,
    default: ''
  },

  // System Fields
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for likes count
EventSchema.virtual('likesCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for comments count
EventSchema.virtual('commentsCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Virtual for event duration in days
EventSchema.virtual('durationDays').get(function() {
  if (!this.startDate || !this.endDate) return 0;
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
});

// Virtual for event status based on dates
EventSchema.virtual('eventStatus').get(function() {
  const now = new Date();
  const eventStart = new Date(`${this.startDate.toISOString().split('T')[0]}T${this.startTime}:00`);
  const eventEnd = new Date(`${this.endDate.toISOString().split('T')[0]}T${this.endTime}:00`);
  
  if (now < eventStart) {
    return 'upcoming';
  } else if (now >= eventStart && now <= eventEnd) {
    return 'ongoing';
  } else {
    return 'completed';
  }
});

// Virtual for registration status
EventSchema.virtual('registrationStatus').get(function() {
  if (!this.registrationRequired) return 'not-required';
  
  const now = new Date();
  if (this.registrationDeadline && now > this.registrationDeadline) {
    return 'closed';
  }
  
  if (this.maxParticipants && this.registrationCount >= this.maxParticipants) {
    return 'full';
  }
  
  return 'open';
});

// Indexes for optimal query performance
EventSchema.index({ startDate: 1, status: 1, isActive: 1 });
EventSchema.index({ organizerClub: 1, startDate: -1 });
EventSchema.index({ category: 1, eventType: 1, startDate: 1 });
EventSchema.index({ tags: 1 });
EventSchema.index({ createdAt: -1 });
EventSchema.index({ isFeatured: -1, priority: -1, startDate: 1 });
EventSchema.index({ venue: 'text', title: 'text', description: 'text' });

// Pre-save middleware to generate slug
EventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Add random suffix to ensure uniqueness
    this.slug += '-' + Math.random().toString(36).substr(2, 6);
  }
  
  if (this.isModified('description') && !this.metaDescription) {
    this.metaDescription = this.description.substring(0, 157) + '...';
  }
  
  next();
});

// Pre-save validation for rounds
EventSchema.pre('save', function(next) {
  // Filter out empty rounds
  this.rounds = this.rounds.filter(round => 
    round.description?.trim() || round.briefing?.trim() || round.name?.trim()
  );
  
  // Update numberOfRounds based on filtered rounds
  this.numberOfRounds = Math.max(1, this.rounds.length);
  
  // If no rounds, create default round
  if (this.rounds.length === 0) {
    this.rounds = [{
      roundNumber: 1,
      name: '',
      description: '',
      duration: '',
      briefing: '',
      submissionLink: ''
    }];
  }
  
  next();
});

// Pre-save validation for contacts
EventSchema.pre('save', function(next) {
  // Filter out empty contacts
  this.contacts = this.contacts.filter(contact => 
    contact.name?.trim() || contact.phone?.trim()
  );
  
  // If no contacts, create empty default
  if (this.contacts.length === 0) {
    this.contacts = [{ name: '', phone: '' }];
  }
  
  next();
});

// Static method to get events by filters
EventSchema.statics.getFiltered = function(filters = {}) {
  const query = { isActive: true, status: 'Published' };
  
  if (filters.category) query.category = filters.category;
  if (filters.eventType) query.eventType = filters.eventType;
  if (filters.organizerClub) query.organizerClub = filters.organizerClub;
  if (filters.upcoming) {
    query.startDate = { $gte: new Date() };
  }
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  
  return this.find(query)
    .populate('organizerClub', 'name logo')
    .populate('createdBy', 'name email')
    .sort({ isFeatured: -1, priority: -1, startDate: 1 });
};

// Instance method to check if user can edit
EventSchema.methods.canEdit = function(userId) {
  return this.createdBy.toString() === userId.toString();
};

// Instance method to increment view count
EventSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// ✅ FIXED: Export with proper model check
module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);
