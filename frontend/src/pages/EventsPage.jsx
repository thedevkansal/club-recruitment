import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  Bell,
  BellRing,
  Send,
  Plus,
  Loader,
  CalendarDays,
  Users,
  Eye,
  Heart,
  Star,
  Trophy,
  Tag as TagIcon,
  Building2,
  ExternalLink
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';

const EventsPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState("all");
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notifiedEvents, setNotifiedEvents] = useState(new Set());
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ FIXED: Proper authentication check for creating events
  const canCreateEvents = user && ['club_admin', 'super_admin', 'event_manager'].includes(user.role);

  // ✅ FIXED: Comprehensive event fetch with proper error handling
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('📅 Fetching events from backend...');
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view events');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/events', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('📥 Events response:', data);

        if (data.status === 'success') {
          const eventsData = data.data.events || [];
          console.log('📊 All events with IDs:');
          eventsData.forEach(event => {
            console.log(`Event: ${event.title}, ID: ${event._id}, Type: ${typeof event._id}`);
          });
          setEvents(eventsData);
        } else {
          setError(data.message || 'Failed to fetch events');
        }
      } catch (error) {
        console.error('💥 Error fetching events:', error);
        setError('Unable to load events. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/clubs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setClubs(data.data.clubs || []);
        }
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    fetchEvents();
    fetchClubs();
  }, []);

  // ✅ FIXED: Better category and type extraction
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(events.map(event => event.category).filter(Boolean))];
    return ["all", ...uniqueCategories.sort()];
  }, [events]);

  const eventTypes = useMemo(() => {
    const uniqueTypes = [...new Set(events.map(event => event.eventType).filter(Boolean))];
    return ["all", ...uniqueTypes.sort()];
  }, [events]);

  // ✅ FIXED: Proper club name extraction from organizerClub field
  const clubOptions = useMemo(() => {
    const clubNames = [...new Set(
      events
        .map(event => event.organizerClub?.name)
        .filter(Boolean)
    )];
    return ["all", ...clubNames.sort()];
  }, [events]);

  // ✅ FIXED: Comprehensive event filtering
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!event._id) {
        console.warn('⚠️ Event missing _id:', event);
        return false;
      }

      const matchesSearch = 
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizerClub?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.tags && event.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      
      const matchesClub = selectedClub === "all" || 
        event.organizerClub?.name === selectedClub;
      
      const matchesEventType = selectedEventType === "all" || 
        event.eventType === selectedEventType;
      
      const matchesCategory = selectedCategory === "all" || 
        event.category === selectedCategory;

      return matchesSearch && matchesClub && matchesEventType && matchesCategory;
    });
  }, [searchQuery, selectedClub, selectedEventType, selectedCategory, events]);

  // ✅ FIXED: Date formatting helpers
  const formatEventDate = (dateStr) => {
    if (!dateStr) return 'Date not specified';
    try {
      const date = new Date(dateStr);
      if (isToday(date)) return 'Today';
      if (isTomorrow(date)) return 'Tomorrow';
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date error';
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

  // ✅ FIXED: Event status helpers
  const getEventStatus = (event) => {
    if (!event || !event.startDate) {
      return { status: 'unknown', color: 'text-gray-600', bg: 'bg-gray-50', label: 'Unknown' };
    }
    
    try {
      const now = new Date();
      const eventStart = new Date(`${event.startDate.split('T')[0]}T${event.startTime || '00:00'}:00`);
      const eventEnd = new Date(`${event.endDate?.split('T')[0] || event.startDate.split('T')[0]}T${event.endTime || '23:59'}:00`);
      
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

  const getRegistrationStatus = (event) => {
    if (!event || !event.registrationRequired) {
      return { status: 'not-required', color: 'text-gray-600', label: 'No Registration' };
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

  const handleNotifyMe = (eventId) => {
    console.log('🔔 Notify me clicked for event:', eventId);
    setNotifiedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  // ✅ FIXED: Enhanced navigation function with debugging
  const handleEventClick = (eventId) => {
    console.log('🔗 Navigation Debug:');
    console.log('- Event ID to navigate:', eventId);
    console.log('- Event ID type:', typeof eventId);
    console.log('- Is undefined?', eventId === undefined);
    console.log('- Is string "undefined"?', eventId === 'undefined');
    console.log('- Is falsy?', !eventId);
    
    if (!eventId || eventId === 'undefined' || eventId === undefined) {
      console.error('❌ Invalid event ID for navigation:', eventId);
      alert(`Invalid event ID: ${eventId}`);
      return;
    }
    
    const targetURL = `/events/${eventId}`;
    console.log('🎯 Navigating to:', targetURL);
    navigate(targetURL);
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  // Loading state
  if (loading) {
    return (
      <div className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading events...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Events</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">Discover and join amazing events happening on campus</p>
          </div>
          
          {/* ✅ FIXED: Create Event Button with proper auth and styling */}
          {canCreateEvents && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateEvent}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </button>
            </div>
          )}
        </div>

        {/* ✅ FIXED: Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, venues, organizers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>

            {/* Club Filter */}
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white"
            >
              {clubOptions.map(club => (
                <option key={club} value={club}>
                  {club === 'all' ? 'All Clubs' : club}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedClub("all");
                setSelectedEventType("all");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredEvents.length}</span> events
            {searchQuery && (
              <span> for "<span className="font-semibold text-blue-600">{searchQuery}</span>"</span>
            )}
          </p>
        </div>

        {/* ✅ FIXED: Events Grid with proper validation */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'all' || selectedEventType !== 'all' || selectedClub !== 'all'
                ? 'Try adjusting your filters to see more events.'
                : 'Be the first to create an event for your community!'}
            </p>
            {canCreateEvents && (
              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              // ✅ VALIDATION: Skip events without valid IDs
              if (!event._id) {
                console.warn('⚠️ Event missing _id:', event);
                return null;
              }

              const eventStatus = getEventStatus(event);
              const registrationStatus = getRegistrationStatus(event);
              const isNotified = notifiedEvents.has(event._id);
              
              console.log('🎫 Rendering event card:', {
                title: event.title,
                id: event._id,
                idType: typeof event._id
              });
              
              return (
                <div key={event._id} className="group">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                    
                    {/* ✅ FIXED: Event Banner - Clickable */}
                    <div 
                      className="relative h-48 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden cursor-pointer"
                      onClick={() => {
                        console.log('🖱️ Banner clicked for event:', event._id);
                        handleEventClick(event._id);
                      }}
                    >
                      {event.bannerImage ? (
                        <img 
                          src={event.bannerImage} 
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
                          <CalendarDays className="h-16 w-16 text-white/80" />
                        </div>
                      )}
                      
                      {/* Status Badges */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {event.isFeatured && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-1 ${eventStatus.bg} ${eventStatus.color} text-xs font-medium rounded-full`}>
                          {eventStatus.label}
                        </span>
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle like functionality
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                        >
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotifyMe(event._id);
                          }}
                          className={`p-2 backdrop-blur-sm rounded-lg transition-colors ${
                            isNotified 
                              ? 'bg-green-500 text-white' 
                              : 'bg-white/90 hover:bg-white text-gray-600'
                          }`}
                        >
                          {isNotified ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* ✅ FIXED: Event Content - Clickable */}
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => {
                        console.log('🖱️ Content area clicked for event:', event._id);
                        handleEventClick(event._id);
                      }}
                    >
                      
                      {/* Event Type & Category */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          <Trophy className="h-3 w-3 mr-1" />
                          {event.eventType}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          <TagIcon className="h-3 w-3 mr-1" />
                          {event.category}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>

                      {/* Short Description */}
                      {event.shortDescription && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.shortDescription}
                        </p>
                      )}

                      {/* Event Details */}
                      <div className="space-y-3 mb-4">
                        
                        {/* Date & Time */}
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatEventDate(event.startDate)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTime(event.startTime)} - {formatTime(event.endTime)}
                            </p>
                          </div>
                        </div>

                        {/* Venue */}
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{event.venue}</p>
                            {event.address && (
                              <p className="text-xs text-gray-500 line-clamp-1">{event.address}</p>
                            )}
                          </div>
                        </div>

                        {/* Organizer */}
                        <div className="flex items-center text-gray-600">
                          <Building2 className="h-4 w-4 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {event.organizerClub?.name || 'Unknown Organizer'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Registration Status */}
                      {event.registrationRequired && (
                        <div className="mb-4">
                          <span className={`inline-flex items-center px-3 py-1 ${registrationStatus.color} bg-current/10 text-sm font-medium rounded-full`}>
                            {registrationStatus.label}
                          </span>
                          {event.registrationDeadline && (
                            <p className="text-xs text-gray-500 mt-1">
                              Deadline: {formatEventDate(event.registrationDeadline)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Event Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {event.viewCount || 0}
                          </span>
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            {event.likesCount || 0}
                          </span>
                        </div>
                        {event.registrationFee > 0 && (
                          <span className="font-medium text-green-600">
                            ₹{event.registrationFee}
                          </span>
                        )}
                      </div>

                      {/* ✅ FIXED: Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('🔗 View Details clicked for event:', event._id);
                            handleEventClick(event._id);
                          }}
                          className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                          View Details
                        </button>
                        {event.registrationRequired && registrationStatus.status === 'open' && event.registrationLink && (
                          <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-center px-4 py-3 border border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
