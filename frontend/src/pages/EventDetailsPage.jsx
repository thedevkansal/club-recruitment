import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  Heart,
  Share2,
  Eye,
  ArrowLeft,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  Trophy,
  Target,
  CheckCircle,
  AlertCircle,
  User,
  Building2,
  Tag as TagIcon,
  Star,
  Timer,
  Calendar,
  UserPlus,
  Link2,
  Award,
  FileText,
  Info,
  DollarSign,
  Users2,
  MessageSquare,
  ThumbsUp,
  Send,
  Copy,
  Download,
  Edit
} from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek, differenceInDays } from 'date-fns';

const EventDetailsPage = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ CRITICAL DEBUGGING - Add extensive logging
  console.log('🔍 EventDetailsPage Debug Info:');
  console.log('- Current URL:', window.location.href);
  console.log('- useParams():', params);
  console.log('- params.eventId:', params.eventId);
  console.log('- typeof params.eventId:', typeof params.eventId);
  console.log('- location.pathname:', location.pathname);
  console.log('- All URL params:', Object.keys(params));

  const { eventId } = params; // ✅ CHANGED: Using eventId instead of id
  
  // ✅ IMMEDIATE VALIDATION - Check eventId before proceeding
  if (!eventId || eventId === 'undefined' || eventId === undefined) {
    console.error('❌ INVALID EVENT ID DETECTED:');
    console.error('- Raw ID value:', eventId);
    console.error('- ID type:', typeof eventId);
    console.error('- URL pathname:', location.pathname);
    
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Event ID</h2>
            <div className="bg-red-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <p className="text-red-800 text-sm mb-2"><strong>Debug Info:</strong></p>
              <p className="text-red-700 text-sm">ID received: "{eventId}"</p>
              <p className="text-red-700 text-sm">ID type: {typeof eventId}</p>
              <p className="text-red-700 text-sm">Current URL: {window.location.href}</p>
              <p className="text-red-700 text-sm">Pathname: {location.pathname}</p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    console.log('🔄 useEffect triggered with eventId:', eventId);
    console.log('🔄 eventId validation - Is valid?', eventId && eventId !== 'undefined' && eventId !== undefined);
    
    if (eventId && eventId !== 'undefined' && eventId !== undefined) {
      fetchEventDetails();
    } else {
      console.error('❌ useEffect: Invalid eventId detected:', eventId);
      setError(`Invalid event ID: ${eventId}`);
      setLoading(false);
    }
  }, [eventId]); // ✅ CHANGED: Using eventId

  const fetchEventDetails = async () => {
    try {
      console.log('📡 Fetching event details for eventId:', eventId);
      console.log('📡 API URL:', `http://localhost:5000/api/events/${eventId}`);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No token found');
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, { // ✅ CHANGED: Using eventId
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      const data = await response.json();
      console.log('📥 Response data:', data);
      
      if (response.ok && data.status === 'success') {
        console.log('✅ Event loaded successfully:', data.data.event.title);
        setEvent(data.data.event);
        setLikesCount(data.data.event.likesCount || 0);
        setComments(data.data.event.comments || []);
        // Check if user already liked this event
        const userId = localStorage.getItem('userId');
        setIsLiked(data.data.event.likes?.some(like => like.user === userId) || false);
      } else {
        console.error('❌ API Error:', data);
        setError(data.message || 'Event not found');
      }
    } catch (error) {
      console.error('💥 Network Error fetching event details:', error);
      setError('Unable to load event details. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateStr) => {
    if (!dateStr) return 'Date not specified';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Invalid date';
      if (isToday(date)) return 'Today';
      if (isTomorrow(date)) return 'Tomorrow';
      return format(date, 'EEEE, MMMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date formatting error';
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Time not specified';
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${period}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeStr;
    }
  };

  const getEventStatus = () => {
    if (!event || !event.startDate || !event.startTime) {
      return { status: 'unknown', color: 'text-gray-600', bg: 'bg-gray-50', label: 'Unknown' };
    }
    
    try {
      const now = new Date();
      const eventStart = new Date(`${event.startDate.split('T')[0]}T${event.startTime}:00`);
      const eventEnd = new Date(`${event.endDate.split('T')[0]}T${event.endTime}:00`);
      
      if (now < eventStart) {
        return { status: 'upcoming', color: 'text-blue-600', bg: 'bg-blue-50', label: 'Upcoming' };
      } else if (now >= eventStart && now <= eventEnd) {
        return { status: 'ongoing', color: 'text-green-600', bg: 'bg-green-50', label: 'Live Now' };
      } else {
        return { status: 'completed', color: 'text-gray-600', bg: 'bg-gray-50', label: 'Completed' };
      }
    } catch (error) {
      console.error('Error getting event status:', error);
      return { status: 'unknown', color: 'text-gray-600', bg: 'bg-gray-50', label: 'Unknown' };
    }
  };

  const getRegistrationStatus = () => {
    if (!event || !event.registrationRequired) {
      return { status: 'not-required', color: 'text-gray-600', label: 'No Registration Required' };
    }
    
    try {
      const now = new Date();
      if (event.registrationDeadline && new Date(event.registrationDeadline) < now) {
        return { status: 'closed', color: 'text-red-600', label: 'Registration Closed' };
      }
      
      if (event.maxParticipants && event.registrationCount >= event.maxParticipants) {
        return { status: 'full', color: 'text-orange-600', label: 'Registration Full' };
      }
      
      return { status: 'open', color: 'text-green-600', label: 'Registration Open' };
    } catch (error) {
      console.error('Error getting registration status:', error);
      return { status: 'unknown', color: 'text-gray-600', label: 'Unknown' };
    }
  };

  const getTeamSizeDisplay = () => {
    if (!event) return 'Unknown';
    
    try {
      if (event.teamSize === 'Individual') {
        return 'Individual participation';
      }
      
      if (event.minTeamSize === event.maxTeamSize) {
        return `Teams of exactly ${event.minTeamSize} ${event.minTeamSize === 1 ? 'person' : 'people'}`;
      }
      
      return `Teams of ${event.minTeamSize || 1}-${event.maxTeamSize || 1} people`;
    } catch (error) {
      console.error('Error getting team size display:', error);
      return 'Team size not specified';
    }
  };

  const getDaysUntilEvent = () => {
    if (!event || !event.startDate) return 0;
    try {
      const eventDate = new Date(event.startDate);
      const now = new Date();
      return differenceInDays(eventDate, now);
    } catch (error) {
      console.error('Error calculating days until event:', error);
      return 0;
    }
  };

  const handleLike = async () => {
    if (!eventId || eventId === 'undefined') { // ✅ CHANGED: Using eventId
      console.error('❌ Cannot like event: Invalid eventId');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/like`, { // ✅ CHANGED: Using eventId
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error liking event:', error);
    }
  };

  const handleShare = async () => {
    if (!event) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.shortDescription || event.description?.substring(0, 100) || '',
          url: window.location.href,
        });
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback for clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'rounds', label: 'Rounds & Stages', icon: Trophy },
    { id: 'requirements', label: 'Requirements', icon: CheckCircle },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading event details...</p>
              <p className="text-sm text-gray-500 mt-2">Event ID: {eventId}</p> {/* ✅ CHANGED: Using eventId */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Event</h2>
            <div className="bg-red-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <p className="text-red-800 text-sm mb-2"><strong>Error Details:</strong></p>
              <p className="text-red-700 text-sm">Message: {error}</p>
              <p className="text-red-700 text-sm">Event ID: {eventId}</p> {/* ✅ CHANGED: Using eventId */}
              <p className="text-red-700 text-sm">URL: {window.location.href}</p>
            </div>
            <div className="space-x-4">
              <Link
                to="/events"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Events
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ SAFETY CHECK: Ensure event exists before rendering
  if (!event) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const eventStatus = getEventStatus();
  const registrationStatus = getRegistrationStatus();
  const daysUntil = getDaysUntilEvent();

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Events
        </button>

        {/* Event Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          
          {/* Banner Image */}
          <div className="relative h-64 lg:h-80 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {event.bannerImage ? (
              <img 
                src={event.bannerImage} 
                alt={event.title || 'Event banner'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
                <CalendarDays className="h-24 w-24 text-white/80" />
              </div>
            )}
            
            {/* Overlay Badges */}
            <div className="absolute top-6 left-6 flex flex-col space-y-2">
              {event.isFeatured && (
                <span className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  <Star className="h-4 w-4 mr-2" />
                  Featured Event
                </span>
              )}
              <span className={`inline-flex items-center px-3 py-1.5 ${eventStatus.bg} ${eventStatus.color} text-sm font-medium rounded-full`}>
                {eventStatus.label}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-6 right-6 flex space-x-3">
              <button
                onClick={handleLike}
                className={`p-3 backdrop-blur-sm rounded-xl border transition-all ${
                  isLiked 
                    ? 'bg-red-500 text-white border-red-500' 
                    : 'bg-white/90 text-gray-700 border-white/20 hover:bg-white'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-white/90 backdrop-blur-sm text-gray-700 border border-white/20 rounded-xl hover:bg-white transition-all"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Event Info */}
          <div className="p-8">
            
            {/* Event Type & Category */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                <Trophy className="h-4 w-4 mr-2" />
                {event.eventType || 'Event'}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                <TagIcon className="h-4 w-4 mr-2" />
                {event.category || 'General'}
              </span>
              {event.numberOfRounds > 1 && (
                <span className="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                  <Award className="h-4 w-4 mr-2" />
                  {event.numberOfRounds} Rounds
                </span>
              )}
            </div>

            {/* Title & Description */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{event.title || 'Event Title'}</h1>
            
            {event.shortDescription && (
              <p className="text-xl text-gray-600 mb-6">{event.shortDescription}</p>
            )}

            {/* Key Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Date & Time */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">When</h3>
                  <p className="text-gray-600 text-sm">{formatEventDate(event.startDate)}</p>
                  <p className="text-gray-500 text-sm">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                  {daysUntil > 0 && (
                    <p className="text-blue-600 text-sm font-medium mt-1">
                      {daysUntil} day{daysUntil !== 1 ? 's' : ''} to go
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Where</h3>
                  <p className="text-gray-600 text-sm">{event.venue || 'Venue TBD'}</p>
                  {event.address && (
                    <p className="text-gray-500 text-sm">{event.address}</p>
                  )}
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Organizer</h3>
                  <p className="text-gray-600 text-sm">{event.organizerClub?.name || 'Unknown'}</p>
                  <p className="text-gray-500 text-sm">Campus Club</p>
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Team Size</h3>
                  <p className="text-gray-600 text-sm">{getTeamSizeDisplay()}</p>
                  {event.maxParticipants && (
                    <p className="text-gray-500 text-sm">
                      {event.registrationCount || 0} / {event.maxParticipants} registered
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Registration Section */}
            {event.registrationRequired && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Information</h3>
                    <div className="flex items-center space-x-4 mb-2">
                      <span className={`inline-flex items-center px-3 py-1 ${registrationStatus.color} bg-current/10 text-sm font-medium rounded-full`}>
                        {registrationStatus.label}
                      </span>
                      {event.registrationFee > 0 && (
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ₹{event.registrationFee}
                        </span>
                      )}
                    </div>
                    {event.registrationDeadline && (
                      <p className="text-gray-600 text-sm">
                        Deadline: {formatEventDate(event.registrationDeadline)}
                      </p>
                    )}
                  </div>
                  {registrationStatus.status === 'open' && event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Register Now
                      <ExternalLink className="h-5 w-5 ml-2" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Event Stats */}
            <div className="flex items-center justify-between text-gray-600 border-t pt-6">
              <div className="flex items-center space-x-6">
                <span className="flex items-center text-sm">
                  <Eye className="h-4 w-4 mr-2" />
                  {event.viewCount || 0} views
                </span>
                <span className="flex items-center text-sm">
                  <Heart className="h-4 w-4 mr-2" />
                  {likesCount} likes
                </span>
                <span className="flex items-center text-sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  {event.shares || 0} shares
                </span>
              </div>
              <div className="text-sm">
                {event.createdAt && `Created ${format(new Date(event.createdAt), 'MMM dd, yyyy')}`}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100 border-b-0">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 border-t-0 p-8 mb-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {event.description || 'No description available.'}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Duration</dt>
                      <dd className="text-sm text-gray-900">
                        {event.startDate === event.endDate ? 'Single day event' : `Multi-day event`}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Event Status</dt>
                      <dd className="text-sm text-gray-900">{eventStatus.label}</dd>
                    </div>
                    {event.eventWebsite && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Website</dt>
                        <dd className="text-sm">
                          <a 
                            href={event.eventWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 inline-flex items-center"
                          >
                            Visit Website
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Participation</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Team Configuration</dt>
                      <dd className="text-sm text-gray-900">{getTeamSizeDisplay()}</dd>
                    </div>
                    {event.maxParticipants && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Participant Limit</dt>
                        <dd className="text-sm text-gray-900">
                          {event.registrationCount || 0} / {event.maxParticipants} registered
                        </dd>
                      </div>
                    )}
                    {event.registrationFee > 0 && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Registration Fee</dt>
                        <dd className="text-sm text-gray-900">₹{event.registrationFee}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Schedule</h2>
              {event.agenda && event.agenda.length > 0 ? (
                <div className="space-y-4">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Clock className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{item.activity}</h3>
                            {item.duration && (
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {item.duration}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="inline-flex items-center mr-4">
                              <Calendar className="h-4 w-4 mr-1" />
                              {item.date ? formatEventDate(item.date) : 'Date TBD'}
                            </span>
                            <span className="inline-flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatTime(item.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No detailed schedule available yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Rounds Tab */}
          {activeTab === 'rounds' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Competition Rounds & Stages
                {event.numberOfRounds > 1 && (
                  <span className="ml-3 text-base font-normal text-gray-500">
                    ({event.numberOfRounds} rounds)
                  </span>
                )}
              </h2>
              
              {event.rounds && event.rounds.length > 0 ? (
                <div className="space-y-8">
                  {event.rounds.map((round, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                            <Award className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {round.name || `Round ${round.roundNumber}`}
                            </h3>
                            <p className="text-gray-600">
                              Round {round.roundNumber} of {event.numberOfRounds}
                            </p>
                          </div>
                        </div>
                        {round.duration && (
                          <span className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 text-sm font-medium rounded-xl">
                            <Timer className="h-4 w-4 mr-2" />
                            {round.duration}
                          </span>
                        )}
                      </div>

                      {round.description && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Round Overview</h4>
                          <p className="text-gray-700 leading-relaxed">{round.description}</p>
                        </div>
                      )}

                      {round.briefing && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Detailed Briefing & Rules</h4>
                          <div className="bg-blue-50 rounded-xl p-6">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{round.briefing}</p>
                          </div>
                        </div>
                      )}

                      {round.submissionLink && (
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Submission Portal</h4>
                            <p className="text-sm text-gray-600">Submit your work for this round</p>
                          </div>
                          <a
                            href={round.submissionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Submit Work
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">This is a single-stage event with no detailed round information.</p>
                </div>
              )}
            </div>
          )}

          {/* Requirements Tab */}
          {activeTab === 'requirements' && (
            <div className="space-y-8">
              
              {/* Eligibility */}
              {event.eligibility && event.eligibility.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Target className="h-6 w-6 mr-3 text-blue-600" />
                    Eligibility Criteria
                  </h2>
                  <div className="space-y-3">
                    {event.eligibility.map((criterion, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{criterion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {event.requirements && event.requirements.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-6 w-6 mr-3 text-purple-600" />
                    What You Need to Bring
                  </h2>
                  <div className="space-y-3">
                    {event.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{requirement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!event.eligibility || event.eligibility.length === 0) && 
               (!event.requirements || event.requirements.length === 0) && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No specific requirements or eligibility criteria specified.</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Primary Contact */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Primary Contact</h3>
                  
                  {event.contactEmail && (
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <a 
                          href={`mailto:${event.contactEmail}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {event.contactEmail}
                        </a>
                      </div>
                    </div>
                  )}

                  {event.eventWebsite && (
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <Globe className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Website</p>
                        <a 
                          href={event.eventWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 inline-flex items-center"
                        >
                          Visit Website
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Contacts */}
                {event.contacts && event.contacts.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Contacts</h3>
                    <div className="space-y-4">
                      {event.contacts.map((contact, index) => (
                        contact.name && contact.phone && (
                          <div key={index} className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-100 rounded-xl">
                              <User className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{contact.name}</p>
                              <a 
                                href={`tel:${contact.phone}`}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                {contact.phone}
                              </a>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Organizing Club Info */}
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 bg-white rounded-xl shadow-sm">
                        <Building2 className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Organized by</h3>
                        <p className="text-lg text-gray-700">{event.organizerClub?.name || 'Unknown Organizer'}</p>
                        <p className="text-gray-600">Campus Student Organization</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Registration Button for Mobile */}
        {event.registrationRequired && registrationStatus.status === 'open' && event.registrationLink && (
          <div className="fixed bottom-6 right-6 lg:hidden z-50">
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-full shadow-2xl hover:from-green-700 hover:to-blue-700 transition-all"
            >
              Register Now
              <ExternalLink className="h-5 w-5 ml-2" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailsPage;
