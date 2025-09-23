import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  Award,
} from "lucide-react";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  // Updated sample event data
  const events = [
    {
      id: 1,
      title: "Tech Innovation Workshop",
      shortDescription:
        "Learn cutting-edge technologies and build innovative solutions",
      description:
        "Join us for an intensive hands-on workshop covering the latest in web development, AI, and mobile app creation. This workshop is designed for students who want to dive deep into modern technology stacks and build real-world projects.",
      date: "October 15, 2025",
      time: "2:00 PM - 6:00 PM",
      venue: "Computer Lab A, Engineering Building",
      deadline: "October 10, 2025",
      category: "Workshop",
      clubName: "Tech Club",
      teamSize: "Individual",
      duration: "4 hours",
      image:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&h=400&fit=crop",
      eligibility: [
        "Currently enrolled students",
        "Basic programming knowledge required",
        "Laptop with development environment setup",
        "Interest in learning new technologies",
      ],
      timeline: [
        {
          time: "2:00 PM",
          activity: "Registration & Welcome",
          status: "upcoming",
        },
        {
          time: "2:30 PM",
          activity: "Introduction to Modern Web Dev",
          status: "upcoming",
        },
        {
          time: "3:30 PM",
          activity: "Hands-on Project Building",
          status: "upcoming",
        },
        { time: "4:30 PM", activity: "Coffee Break", status: "upcoming" },
        {
          time: "5:00 PM",
          activity: "AI Integration Workshop",
          status: "upcoming",
        },
        {
          time: "6:00 PM",
          activity: "Project Showcase & Wrap-up",
          status: "upcoming",
        },
      ],
      applicationUrl: "https://forms.google.com/tech-workshop",
      requirements: [
        "Bring your own laptop",
        "Install Node.js and VS Code beforehand",
        "Basic HTML/CSS/JavaScript knowledge",
      ],
    },
    {
      id: 2,
      title: "Startup Pitch Competition",
      shortDescription:
        "Present your innovative startup ideas and win exciting prizes",
      description:
        "A competitive event where aspiring entrepreneurs present their startup ideas to a panel of industry experts and investors. Participants will have the opportunity to receive feedback, network with professionals, and compete for seed funding and mentorship opportunities.",
      date: "October 20, 2025",
      time: "9:00 AM - 5:00 PM",
      venue: "Main Auditorium, Business Building",
      deadline: "October 15, 2025",
      category: "Competition",
      clubName: "Entrepreneurship Club",
      teamSize: "2-5 members",
      duration: "Full Day",
      rounds: 3,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop",
      eligibility: [
        "University students and recent graduates",
        "Teams of 2-5 members allowed",
        "Original business ideas only",
        "Pitch deck preparation required",
      ],
      timeline: [
        {
          time: "9:00 AM",
          activity: "Registration & Breakfast",
          status: "upcoming",
        },
        {
          time: "9:30 AM",
          activity: "Round 1: Elevator Pitch (2 min)",
          status: "upcoming",
        },
        {
          time: "11:00 AM",
          activity: "Round 1 Results Announcement",
          status: "upcoming",
        },
        {
          time: "11:30 AM",
          activity: "Round 2: Detailed Presentation (10 min)",
          status: "upcoming",
        },
        {
          time: "1:00 PM",
          activity: "Lunch Break & Networking",
          status: "upcoming",
        },
        {
          time: "2:30 PM",
          activity: "Round 2 Results & Final Selection",
          status: "upcoming",
        },
        {
          time: "3:00 PM",
          activity: "Final Round: Investor Pitch (15 min)",
          status: "upcoming",
        },
        {
          time: "4:30 PM",
          activity: "Judging & Deliberation",
          status: "upcoming",
        },
        { time: "5:00 PM", activity: "Awards Ceremony", status: "upcoming" },
      ],
      prizes: [
        "1st Place: $5000 seed funding + 3-month mentorship",
        "2nd Place: $2000 + Business consultation",
        "3rd Place: $1000 + Networking opportunities",
      ],
      applicationUrl: "https://forms.google.com/startup-pitch",
      requirements: [
        "Prepare a 10-slide pitch deck",
        "Business model canvas (optional)",
        "Financial projections",
        "Team member details",
      ],
    },
  ];

  useEffect(() => {
    const foundEvent = events.find((e) => e.id === parseInt(eventId));
    setEvent(foundEvent);
  }, [eventId]);

  const handleBack = () => {
    navigate("/events");
  };

  const handleApply = () => {
    window.open(event.applicationUrl, "_blank");
  };

  if (!event) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h2>
          <p className="text-gray-600 mb-4">
            The event you're looking for doesn't exist.
          </p>
          <button
            onClick={handleBack}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isDeadlinePassed = new Date() > new Date(event.deadline);

  <Link
    to={`/clubs/${event.clubId}`}
    className="text-2xl font-bold text-purple-300 bg-transparent hover:text-purple-200 transition-colors"
  >
    {event.clubName}
  </Link>;

  return (
    <div className="pt-20">
      <div className="min-h-screen bg-gray-50">
        <div className="relative">
          {/* Hero Section with Event Banner */}
          <div className="relative h-64 bg-gray-900 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Back Button */}
            <button
              onClick={handleBack}
              className="absolute top-6 left-6 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg border border-gray-200 transition-colors"
              style={{ zIndex: 10 }}
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>

            {/* Event Title Overlay - FIXED */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-black bg-opacity-60 px-8 py-6 rounded-xl backdrop-blur-sm">
                <h1 className="text-4xl font-bold mb-2 text-white">
                  {event.title}
                </h1>
                <p className="text-lg text-gray-200 mb-4">
                  {event.shortDescription}
                </p>

                {/* Club Name - Larger, highlighted, no pill */}
                <button
                  onClick={() => navigate(`/clubs/${event.clubId}`)}
                  className="text-2xl font-bold text-purple-300 bg-transparent hover:text-purple-200 transition-colors cursor-pointer"
                >
                  {event.clubName}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Date Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Date
                  </p>
                  <p className="font-semibold text-gray-900">{event.date}</p>
                </div>
              </div>
            </div>

            {/* Time Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Time
                  </p>
                  <p className="font-semibold text-gray-900">{event.time}</p>
                </div>
              </div>
            </div>

            {/* Venue Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Venue
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {event.venue}
                  </p>
                </div>
              </div>
            </div>

            {/* Deadline Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <AlertCircle
                  className={`h-5 w-5 ${
                    isDeadlinePassed ? "text-red-500" : "text-orange-500"
                  }`}
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Deadline
                  </p>
                  <p
                    className={`font-semibold ${
                      isDeadlinePassed ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {event.deadline}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  About This Event
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Eligibility */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Eligibility Criteria
                </h2>
                <ul className="space-y-2">
                  {event.eligibility.map((criterion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timeline/Schedule */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {event.category === "Competition"
                    ? "Competition Timeline"
                    : "Event Schedule"}
                </h2>
                <div className="space-y-4">
                  {event.timeline.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-20">
                        <span className="text-sm font-medium text-purple-600">
                          {item.time}
                        </span>
                      </div>
                      <div className="flex-1 border-l-2 border-gray-200 pl-4 pb-4">
                        <p className="font-medium text-gray-900">
                          {item.activity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prizes (for competitions) */}
              {event.prizes && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span>Prizes</span>
                  </h2>
                  <ul className="space-y-2">
                    {event.prizes.map((prize, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Award className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{prize}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Button - FIXED */}
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Ready to Join?
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Registration open until {event.deadline}
                  </p>

                  <button
                    onClick={handleApply}
                    disabled={isDeadlinePassed}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                      isDeadlinePassed
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <span>
                      {isDeadlinePassed ? "Registration Closed" : "Apply Now"}
                    </span>
                    {!isDeadlinePassed && <ExternalLink className="h-4 w-4" />}
                  </button>

                  {!isDeadlinePassed && (
                    <p className="text-xs text-gray-500 mt-2">
                      You'll be redirected to the application form
                    </p>
                  )}
                </div>
              </div>

              {/* Event Stats - UPDATED */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Event Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Team Size</span>
                    <span className="font-medium text-gray-900">
                      {event.teamSize}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">
                      {event.duration}
                    </span>
                  </div>

                  {event.rounds && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rounds</span>
                      <span className="font-medium text-gray-900">
                        {event.rounds}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements */}
              {event.requirements && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {event.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-sm text-gray-600">
                          {requirement}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
