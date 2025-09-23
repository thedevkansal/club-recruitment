import React, { useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const eventsScrollRef = useRef(null);
  const clubsScrollRef = useRef(null);

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Sample data
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Club Workshop",
      date: "Oct 15, 2025",
      time: "2:00 PM",
      location: "Computer Lab A",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Music Society Concert",
      date: "Oct 18, 2025", 
      time: "6:00 PM",
      location: "Main Auditorium",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Debate Competition",
      date: "Oct 20, 2025",
      time: "10:00 AM", 
      location: "Conference Hall",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Art Exhibition",
      date: "Oct 22, 2025",
      time: "11:00 AM",
      location: "Gallery Room",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop"
    },
    {
      id: 5,
      title: "Robotics Showcase", 
      date: "Oct 25, 2025",
      time: "3:00 PM",
      location: "Engineering Block",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop"
    }
  ];

  const featuredClubs = [
    {
      id: 1,
      name: "Tech Innovation Club",
      description: "Building the future through technology and innovation",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop",
      category: "Technology"
    },
    {
      id: 2,
      name: "Music Society",
      description: "Harmonizing melodies and creating musical experiences",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
      category: "Arts"
    },
    {
      id: 3,
      name: "Debate & Literary Club", 
      description: "Enhancing communication and critical thinking skills",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      category: "Literature"
    },
    {
      id: 4,
      name: "Photography Club",
      description: "Capturing moments and creating visual stories",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=200&fit=crop",
      category: "Creative"
    },
    {
      id: 5,
      name: "Sports & Fitness Club",
      description: "Promoting health and wellness through sports",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop", 
      category: "Sports"
    }
  ];

  return (
    <div className="pt-24">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white mb-12 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4">
                Welcome back, {user?.name || user?.fullName || 'John'}! 👋
              </h1>
              <p className="text-xl opacity-90 mb-6">
                Ready to explore new opportunities and connect with amazing people?
              </p>
              <div className="flex items-center space-x-6 text-sm opacity-75">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white bg-opacity-30 rounded"></div>
                  <span>{user?.branch || 'Computer Science'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white bg-opacity-30 rounded-full"></div>
                  <span>{user?.year || '3rd Year'}</span>
                </div>
              </div>
            </div>
            
            {/* Profile Picture */}
            <div className="absolute top-6 right-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full"></div>
                )}
              </div>
            </div>
          </div>

          {/* EVENTS WRAPPER */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 relative">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            </div>

            <div
              ref={eventsScrollRef}
              className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex-shrink-0 w-80 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-indigo-600">
                      {event.date}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                      Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Left Arrow */}
            <button
              onClick={() => scrollLeft(eventsScrollRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 
                         w-12 h-12 bg-indigo-600 text-white rounded-full 
                         hover:bg-indigo-700 transition-colors shadow-lg 
                         flex items-center justify-center z-20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scrollRight(eventsScrollRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                         w-12 h-12 bg-indigo-600 text-white rounded-full 
                         hover:bg-indigo-700 transition-colors shadow-lg 
                         flex items-center justify-center z-20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* CLUBS WRAPPER */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 relative">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Clubs</h2>
            </div>

            <div
              ref={clubsScrollRef}
              className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredClubs.map((club) => (
                <div key={club.id} className="flex-shrink-0 w-80 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="relative">
                    <img
                      src={club.image}
                      alt={club.name}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-purple-600">
                      {club.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{club.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{club.description}</p>
                    <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                      Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Left Arrow */}
            <button
              onClick={() => scrollLeft(clubsScrollRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 
                         w-12 h-12 bg-purple-600 text-white rounded-full 
                         hover:bg-purple-700 transition-colors shadow-lg 
                         flex items-center justify-center z-20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scrollRight(clubsScrollRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                         w-12 h-12 bg-purple-600 text-white rounded-full 
                         hover:bg-purple-700 transition-colors shadow-lg 
                         flex items-center justify-center z-20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
