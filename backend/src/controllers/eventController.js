const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');

// Create a new event
const createEvent = async (req, res) => {
  try {
    console.log('📅 Creating event:', req.body.title);
    console.log('👤 User ID from token:', req.user._id);

    // Clean up agenda - remove empty items and validate required fields
    let cleanAgenda = [];
    if (req.body.agenda && Array.isArray(req.body.agenda)) {
      cleanAgenda = req.body.agenda.filter(item => {
        // Only include agenda items that have both activity and time
        return item.activity && item.activity.trim() && item.time && item.time.trim();
      }).map(item => ({
        ...item,
        date: item.date || req.body.eventDate // Use event date if agenda date is missing
      }));
    }

    // Clean up rounds - remove empty ones
    let cleanRounds = [];
    if (req.body.rounds && Array.isArray(req.body.rounds)) {
      cleanRounds = req.body.rounds.filter(round => 
        round.description?.trim() || round.briefing?.trim() || round.name?.trim()
      );
    }

    // If no valid rounds, create a default one
    if (cleanRounds.length === 0) {
      cleanRounds = [{
        roundNumber: 1,
        name: '',
        description: '',
        duration: '',
        briefing: '',
        submissionLink: ''
      }];
    }

    // Clean up contacts - remove empty ones
    let cleanContacts = [];
    if (req.body.contacts && Array.isArray(req.body.contacts)) {
      cleanContacts = req.body.contacts.filter(contact => 
        contact.name?.trim() || contact.phone?.trim()
      );
    }

    // If no valid contacts, create empty default
    if (cleanContacts.length === 0) {
      cleanContacts = [{ name: '', phone: '' }];
    }

    // Clean up other array fields
    const cleanEligibility = req.body.eligibility?.filter(item => item?.trim()) || [];
    const cleanRequirements = req.body.requirements?.filter(item => item?.trim()) || [];
    const cleanTags = req.body.tags?.filter(item => item?.trim()) || [];

    // Prepare event data
    const eventData = {
      ...req.body,
      createdBy: req.user._id, // ✅ FIX: Add user ID from token
      agenda: cleanAgenda, // ✅ FIX: Only valid agenda items
      rounds: cleanRounds,
      contacts: cleanContacts,
      eligibility: cleanEligibility,
      requirements: cleanRequirements,
      tags: cleanTags,
      numberOfRounds: cleanRounds.length,
      
      // Convert dates to proper format
      startDate: new Date(req.body.eventDate),
      endDate: new Date(req.body.eventDate),
      registrationDeadline: req.body.registrationDeadline 
        ? new Date(req.body.registrationDeadline) 
        : null
    };

    console.log('🧹 Cleaned event data created');

    // Validate required fields
    if (!eventData.title?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Event title is required'
      });
    }

    if (!eventData.organizerClub) {
      return res.status(400).json({
        status: 'error',
        message: 'Organizing club is required'
      });
    }

    // Verify the organizing club exists
    const club = await Club.findById(eventData.organizerClub);
    if (!club) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid organizing club'
      });
    }

    // Create the event
    const event = new Event(eventData);
    await event.save();

    // Populate the event with club and user details
    await event.populate([
      { path: 'organizerClub', select: 'name logo' },
      { path: 'createdBy', select: 'name email' }
    ]);

    console.log('✅ Event created successfully:', event._id);

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: {
        event
      }
    });

  } catch (error) {
    console.error('💥 Event creation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const { 
      category, 
      eventType, 
      organizerClub,
      startDate,
      endDate,
      status = 'Published',
      page = 1,
      limit = 20,
      search
    } = req.query;

    // Build filter object
    const filter = { 
      isActive: true,
      status: status
    };

    if (category) filter.category = category;
    if (eventType) filter.eventType = eventType;
    if (organizerClub) filter.organizerClub = organizerClub;
    
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const events = await Event.find(filter)
      .populate('organizerClub', 'name logo')
      .populate('createdBy', 'name email')
      .sort({ isFeatured: -1, priority: -1, startDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Event.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        events,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalEvents: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch events'
    });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerClub', 'name logo description')
      .populate('createdBy', 'name email')
      .populate({
        path: 'likes.user',
        select: 'name'
      })
      .populate({
        path: 'comments.user',
        select: 'name'
      });

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Increment view count
    await Event.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.json({
      status: 'success',
      data: {
        event
      }
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Check permissions
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this event'
      });
    }

    // Clean up data similar to create
    let cleanAgenda = [];
    if (req.body.agenda && Array.isArray(req.body.agenda)) {
      cleanAgenda = req.body.agenda.filter(item => 
        item.activity?.trim() && item.time?.trim()
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        agenda: cleanAgenda,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'organizerClub', select: 'name logo' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.json({
      status: 'success',
      message: 'Event updated successfully',
      data: {
        event: updatedEvent
      }
    });

  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Check permissions
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this event'
      });
    }

    // Soft delete
    await Event.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      status: 'success',
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Like/Unlike event
const toggleLike = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    const userId = req.user._id;
    const existingLike = event.likes.find(like => like.user.toString() === userId.toString());

    if (existingLike) {
      // Unlike
      event.likes = event.likes.filter(like => like.user.toString() !== userId.toString());
    } else {
      // Like
      event.likes.push({ user: userId });
    }

    await event.save();

    res.json({
      status: 'success',
      message: existingLike ? 'Event unliked' : 'Event liked',
      data: {
        likesCount: event.likes.length,
        isLiked: !existingLike
      }
    });

  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ✅ CRITICAL: Make sure ALL functions are exported
module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  toggleLike
};
