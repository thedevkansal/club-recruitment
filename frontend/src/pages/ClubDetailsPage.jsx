import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Globe,
  UserPlus,
  Loader,
  Building2,
  Users,
  Facebook,
  Twitter,
  Youtube,
  CalendarDays,
  ExternalLink
} from "lucide-react";

const ClubDetailsPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch club details from backend
  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        console.log('🏛️ Fetching club details for ID:', clubId);
        
        const response = await fetch(`http://localhost:5000/api/clubs/${clubId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('📥 Club details response:', data);

        if (data.status === 'success') {
          setClub(data.data.club);
        } else {
          setError(data.message || 'Club not found');
        }
      } catch (error) {
        console.error('💥 Error fetching club details:', error);
        setError('Unable to load club details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchClubDetails();
    }
  }, [clubId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement actual follow/unfollow API call
  };

  const handleBack = () => {
    navigate("/clubs");
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getSocialColor = (platform) => {
    switch (platform) {
      case 'instagram': return 'from-pink-500 to-red-500';
      case 'facebook': return 'bg-blue-600';
      case 'twitter': return 'bg-blue-400';
      case 'linkedin': return 'bg-blue-700';
      case 'youtube': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  // Mock events data - you can replace this with real events from backend later
  const mockEvents = [
    {
      id: 1,
      title: "Club Introduction Meeting",
      date: "Oct 15, 2025",
      time: "3:00 PM",
      location: "Main Hall"
    },
    {
      id: 2,
      title: "Workshop on Club Activities",
      date: "Oct 20, 2025",
      time: "2:00 PM",
      location: "Conference Room A"
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading club details...</p>
        </div>
      </div>
    );
  }

  // Error or club not found
  if (error || !club) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Club not found"}
          </h2>
          <p className="text-gray-600 mb-4">
            The club you're looking for doesn't exist or couldn't be loaded.
          </p>
          <button
            onClick={handleBack}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="min-h-screen bg-gray-50">
        <div className="relative">
          {/* Header with Cover Image */}
          <div className="relative h-80 overflow-hidden">
            {club.coverImage ? (
              <>
                <img
                  src={club.coverImage}
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </>
            ) : (
              // Beautiful gradient fallback instead of black
              <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                {/* Optional: Add some pattern or texture */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='5' cy='5' r='5'/%3E%3Ccircle cx='25' cy='25' r='5'/%3E%3Ccircle cx='45' cy='45' r='5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                </div>
              </div>
            )}

            {/* Club Logo - Bigger and centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              {club.logo ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src={club.logo}
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gradient-to-r from-white to-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                  <span className="text-purple-600 text-4xl font-bold">
                    {club.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg border border-gray-200 transition-colors"
            style={{ zIndex: 10 }}
            title="Back to Clubs"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Club Name */}
          <div className="pt-8 pb-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Left side - Club name and description */}
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {club.name}
                </h1>
                <p className="text-gray-600 max-w-xl">{club.shortDescription}</p>
                
                {/* Tags */}
                {club.tags && club.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {club.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right side - Follow button */}
              <div className="flex-shrink-0 ml-8">
                <button
                  onClick={handleFollow}
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center space-x-2 shadow-md ${
                    isFollowing
                      ? "bg-gray-800 text-white hover:bg-gray-900"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{isFollowing ? "Following" : "Follow"}</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {club.fullDescription}
                </p>
                
                {/* Club Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {club.memberCount > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{club.memberCount}</p>
                      <p className="text-sm text-gray-600">Members</p>
                    </div>
                  )}
                  
                  {club.foundedYear && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">{club.foundedYear}</p>
                      <p className="text-sm text-gray-600">Founded</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-900">{club.category}</p>
                    <p className="text-sm text-gray-600">Category</p>
                  </div>
                </div>
              </div>

              {/* Active Events Section - ADDED THIS */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CalendarDays className="h-6 w-6 mr-2 text-purple-600" />
                  Active Events
                </h2>
                
                {/* Check if club has events (you can replace mockEvents with club.events when available) */}
                {mockEvents && mockEvents.length > 0 ? (
                  <div className="space-y-4">
                    {mockEvents.map((event) => (
                      <div
                        key={event.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {event.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{event.time}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center space-x-1">
                            <span>Register</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Empty state for no events
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Active Events
                    </h3>
                    <p className="text-gray-600 mb-4">
                      There are no active events at the moment. Check back later for upcoming events!
                    </p>
                    <div className="inline-flex items-center text-sm text-purple-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Stay tuned for updates
                    </div>
                  </div>
                )}
              </div>

              {/* Eligibility Requirements */}
              {club.eligibility && club.eligibility.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Eligibility Requirements
                  </h2>
                  <ul className="space-y-2">
                    {club.eligibility.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-600">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Us Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Contact Us
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${club.email}`}
                        className="text-purple-600 hover:text-purple-700 transition-colors font-medium text-sm"
                      >
                        {club.email}
                      </a>
                    </div>
                  </div>

                  {club.phone && (
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                          Phone
                        </p>
                        <a
                          href={`tel:${club.phone}`}
                          className="text-purple-600 hover:text-purple-700 transition-colors font-medium text-sm"
                        >
                          {club.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {club.meetingLocation && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                          Location
                        </p>
                        <span className="text-gray-700 font-medium text-sm">
                          {club.meetingLocation}
                        </span>
                      </div>
                    </div>
                  )}

                  {club.meetingTime && (
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                          Meeting Time
                        </p>
                        <span className="text-gray-700 font-medium text-sm">
                          {club.meetingTime}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Connect with us */}
              {(club.socialMedia || club.website) && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Connect with us
                  </h2>
                  <div className="space-y-3">
                    {/* Website */}
                    {club.website && (
                      <a
                        href={club.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="p-2 bg-gray-600 text-white rounded-lg group-hover:bg-gray-700 group-hover:shadow-lg transition-all">
                          <Globe className="h-4 w-4" />
                        </div>
                        <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                          Website
                        </span>
                      </a>
                    )}

                    {/* Social Media Links */}
                    {club.socialMedia && Object.entries(club.socialMedia).map(([platform, url]) => (
                      url && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className={`p-2 bg-gradient-to-r ${getSocialColor(platform)} text-white rounded-lg group-hover:shadow-lg transition-all`}>
                            {getSocialIcon(platform)}
                          </div>
                          <span className="text-gray-700 group-hover:text-gray-900 font-medium capitalize">
                            {platform}
                          </span>
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Recruitment Status */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Recruitment Status
                </h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  club.recruitmentStatus === 'Open' 
                    ? 'bg-green-100 text-green-800'
                    : club.recruitmentStatus === 'Coming Soon'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {club.recruitmentStatus}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailsPage;
