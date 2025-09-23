import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const EventsPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState("all");
  const [selectedTime, setSelectedTime] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notifiedEvents, setNotifiedEvents] = useState(new Set());

  // Check if user is a club member
  const isClubMember = user?.role === "club_member" || user?.clubs?.length > 0;

  // Sample events data
  const events = [
    {
      id: 1,
      title: "Tech Innovation Workshop",
      date: "Sep 18",
      time: "2:00 PM",
      location: "Computer Lab A",
      club: "Tech Club",
      category: "Workshop",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&h=160&fit=crop",
    },
    {
      id: 2,
      title: "Music Society Concert",
      date: "Sep 17",
      time: "6:00 PM",
      location: "Main Auditorium",
      club: "Music Society",
      category: "Concert",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=160&fit=crop",
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      date: "Sep 16",
      time: "10:00 AM",
      location: "Conference Hall",
      club: "Entrepreneurship Club",
      category: "Competition",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=160&fit=crop",
    },
    {
      id: 4,
      title: "Art Exhibition Opening",
      date: "Sep 15",
      time: "11:00 AM",
      location: "Gallery Room",
      club: "Art Club",
      category: "Exhibition",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=160&fit=crop",
    },
    {
      id: 5,
      title: "AI & Machine Learning Seminar",
      date: "Sep 14",
      time: "3:00 PM",
      location: "Engineering Block",
      club: "Tech Club",
      category: "Seminar",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=160&fit=crop",
    },
    {
      id: 6,
      title: "Dance Battle Championship",
      date: "Sep 13",
      time: "7:00 PM",
      location: "Main Stage",
      club: "Dance Club",
      category: "Competition",
      image:
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=160&fit=crop",
    },
    {
      id: 7,
      title: "Photography Workshop",
      date: "Sep 12",
      time: "1:00 PM",
      location: "Media Room",
      club: "Photography Club",
      category: "Workshop",
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=160&fit=crop",
    },
    {
      id: 8,
      title: "Coding Bootcamp",
      date: "Sep 11",
      time: "9:00 AM",
      location: "Computer Lab B",
      club: "Programming Society",
      category: "Workshop",
      image:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=160&fit=crop",
    },
  ];

  // Filter options
  const clubs = ["all", ...new Set(events.map((event) => event.club))];
  const categories = [
    "all",
    "Workshop",
    "Concert",
    "Competition",
    "Exhibition",
    "Seminar",
    "Conference",
  ];
  const timeFilters = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.club.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClub = selectedClub === "all" || event.club === selectedClub;
      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;
      const matchesTime = selectedTime === "all";

      return matchesSearch && matchesClub && matchesCategory && matchesTime;
    });
  }, [searchQuery, selectedClub, selectedTime, selectedCategory]);

  const handleNotifyMe = (eventId) => {
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

  const handleApplyNow = (eventId) => {
    alert(`Applying for event ${eventId}`);
  };

  const handleAddEvent = () => {
    alert("Opening Add Event form...");
    // You can implement: navigate('/events/add') or setShowAddEventModal(true)
  };

  return (
    <div className="pt-24">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Add Event Button */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
              <p className="text-gray-600">
                Discover and join exciting events happening around campus
              </p>
            </div>

            {/* Add Event Button - Visible for demo purposes */}
            <button
              onClick={handleAddEvent}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Event
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Events
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Club Filter */}
              <div className="min-w-[160px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club
                </label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                >
                  {clubs.map((club) => (
                    <option key={club} value={club}>
                      {club === "all" ? "All Clubs" : club}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="min-w-[140px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Filter */}
              <div className="min-w-[130px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                >
                  {timeFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedClub("all");
                  setSelectedTime("all");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEvents.map((event) => {
              const isNotified = notifiedEvents.has(event.id);

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden cursor-pointer"
                >
                  {/* Event Image */}
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-36 object-cover"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-4">
                    {/* Date */}
                    <div className="flex items-center text-purple-600 text-sm font-medium mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{event.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                      {event.title}
                    </h3>

                    {/* Club Info */}
                    <p className="text-xs text-gray-500 mb-3">{event.club}</p>

                    {/* Time and Location */}
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center text-gray-600 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {/* Notify Me Button */}
                      <button
                        onClick={() => handleNotifyMe(event.id)}
                        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-xs ${
                          isNotified
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {isNotified ? (
                          <>
                            <BellRing className="h-3 w-3 mr-1" />
                            Notification On
                          </>
                        ) : (
                          <>
                            <Bell className="h-3 w-3 mr-1" />
                            Notify Me
                          </>
                        )}
                      </button>

                      {/* Apply Now Button */}
                      <button
                        onClick={() => handleApplyNow(event.id)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
