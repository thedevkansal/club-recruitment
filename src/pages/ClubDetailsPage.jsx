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
} from "lucide-react";

const ClubDetailsPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Sample club data
  const clubs = [
    {
      id: 1,
      name: "Coding Club",
      shortName: "CC",
      description:
        "For all students passionate about software development and technology.",
      fullDescription:
        "The Coding Club is a vibrant community of passionate developers, programmers, and tech enthusiasts. We organize workshops, hackathons, and coding competitions to help students enhance their programming skills and stay updated with the latest technology trends. Whether you're a beginner or an experienced coder, there's something for everyone in our club.",
      color: "bg-blue-500",
      instagramUrl: "https://instagram.com/codingclub",
      linkedinUrl: "https://linkedin.com/company/codingclub",
      websiteUrl: "https://codingclub.com",
      email: "contact@codingclub.com",
      phone: "+91 98765 43210",
      location: "Computer Science Department, Room 101",
      coverImage:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&h=400&fit=crop",
      activeEvents: [
        {
          id: 1,
          title: "React Workshop",
          date: "Oct 15, 2025",
          time: "2:00 PM",
        },
        {
          id: 2,
          title: "Hackathon 2025",
          date: "Oct 20, 2025",
          time: "9:00 AM",
        },
      ],
    },
    {
      id: 2,
      name: "Design Hub",
      shortName: "DH",
      description:
        "A place for designers to collaborate, learn, and create stunning visuals.",
      fullDescription:
        "Design Hub is where creativity meets innovation. We're a community of designers, artists, and creative minds who come together to explore the world of visual design, UI/UX, and digital art. Our club focuses on hands-on learning through workshops, design challenges, and collaborative projects.",
      color: "bg-purple-500",
      instagramUrl: "https://instagram.com/designhub",
      linkedinUrl: "https://linkedin.com/company/designhub",
      websiteUrl: "https://designhub.com",
      email: "hello@designhub.com",
      phone: "+91 98765 43211",
      location: "Arts Building, Room 205",
      coverImage:
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=400&fit=crop",
      activeEvents: [
        {
          id: 3,
          title: "UI/UX Design Workshop",
          date: "Oct 18, 2025",
          time: "3:00 PM",
        },
      ],
    },
    {
      id: 3,
      name: "Entrepreneurship Society",
      shortName: "ES",
      description:
        "Connect with aspiring entrepreneurs and build the next big thing.",
      fullDescription:
        "The Entrepreneurship Society is dedicated to fostering innovation and entrepreneurial thinking among students. We provide a platform for aspiring entrepreneurs to network, learn, and develop their business ideas through mentorship, workshops, and startup competitions.",
      color: "bg-orange-500",
      instagramUrl: "https://instagram.com/entrepreneursoc",
      linkedinUrl: "https://linkedin.com/company/entrepreneursoc",
      websiteUrl: "https://entrepreneursoc.com",
      email: "hello@entrepreneursoc.com",
      phone: "+91 98765 43212",
      location: "Business Building, Room 301",
      coverImage:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=400&fit=crop",
      activeEvents: [
        {
          id: 4,
          title: "Startup Pitch Competition",
          date: "Oct 25, 2025",
          time: "1:00 PM",
        },
      ],
    },
  ];

  useEffect(() => {
    const foundClub = clubs.find((c) => c.id === parseInt(clubId));
    setClub(foundClub);
  }, [clubId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleBack = () => {
    navigate("/clubs");
  };

  if (!club) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Club not found
          </h2>
          <p className="text-gray-600 mb-4">
            The club you're looking for doesn't exist.
          </p>
          <button
            onClick={handleBack}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {" "}
      {/* Reduced from pt-24 to pt-16 to ensure navbar is visible */}
      <div className="min-h-screen bg-gray-50">
        <div className="relative">
          {" "}
          {/* Container for cover image and back button */}
          {/* Header with Cover Image */}
          <div className="relative h-80 bg-gray-900 overflow-hidden">
            <img
              src={club.coverImage}
              alt={club.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Follow Button - Top Right */}

            {/* Club Logo - Bigger and centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-32 h-32 ${club.color} rounded-full flex items-center justify-center border-4 border-white shadow-2xl`}
              >
                <span className="text-white text-4xl font-bold">
                  {club.shortName}
                </span>
              </div>
            </div>
          </div>
          {/* Back Button OUTSIDE cover image container - White button */}
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
          // Replace the Club Name section with this:
          {/* Club Name - Fixed alignment */}
          <div className="pt-8 pb-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Left side - Club name and description */}
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {club.name}
                </h1>
                <p className="text-gray-600 max-w-xl">{club.description}</p>
              </div>

              {/* Right side - Follow button */}
              <div className="flex-shrink-0 ml-8">
                <button
                  onClick={handleFollow}
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center space-x-2 shadow-md ${
                    isFollowing
                      ? "bg-gray-800 text-white hover:bg-gray-900" // Dark color instead of green
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
                <p className="text-gray-600 leading-relaxed">
                  {club.fullDescription}
                </p>
              </div>

              {/* Active Events Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Active Events
                </h2>
                {club.activeEvents.length > 0 ? (
                  <div className="space-y-4">
                    {club.activeEvents.map((event) => (
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
                            </div>
                          </div>
                          <button className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                            Register
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No active events at the moment.
                  </p>
                )}
              </div>
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

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                        Location
                      </p>
                      <span className="text-gray-700 font-medium text-sm">
                        {club.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connect with us */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Connect with us
                </h2>
                <div className="space-y-3">
                  <a
                    href={club.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg group-hover:shadow-lg transition-all">
                      <Instagram className="h-4 w-4" />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                      Instagram
                    </span>
                  </a>

                  <a
                    href={club.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 bg-blue-600 text-white rounded-lg group-hover:bg-blue-700 group-hover:shadow-lg transition-all">
                      <Linkedin className="h-4 w-4" />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                      LinkedIn
                    </span>
                  </a>

                  <a
                    href={club.websiteUrl}
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
