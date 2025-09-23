// src/pages/ClubsPage.jsx
import React, { useState, useMemo } from "react";
import { Search, Instagram, ExternalLink } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ClubsPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const clubs = [
    {
      id: 1,
      name: "Coding",
      shortName: "CC",
      description:
        "For all students passionate about software development and technology.",
      category: "Tech",
      instagramUrl: "https://instagram.com/codingclub",
      memberCount: 120,
      logo: "https://source.unsplash.com/random/200x200?code",
    },
    {
      id: 2,
      name: "Design Hub",
      shortName: "DH",
      description:
        "A place for designers to collaborate, learn, and create stunning visuals.",
      category: "Creative",
      instagramUrl: "https://instagram.com/designhub",
      memberCount: 85,
      logo: "https://source.unsplash.com/random/200x200?design",
    },
    {
      id: 3,
      name: "Entrepreneurship",
      shortName: "ES",
      description:
        "Connect with aspiring entrepreneurs and build the next big thing.",
      category: "Business",
      instagramUrl: "https://instagram.com/entrepreneursoc",
      memberCount: 95,
      logo: "https://source.unsplash.com/random/200x200?startup",
    },
    {
      id: 4,
      name: "Photography",
      shortName: "PC",
      description:
        "Capture the world through your lens. All skill levels welcome.",
      category: "Creative",
      instagramUrl: "https://instagram.com/photoclub",
      memberCount: 60,
      logo: "https://source.unsplash.com/random/200x200?camera",
    },
    {
      id: 5,
      name: "Music",
      shortName: "MS",
      description:
        "Harmonizing melodies and creating unforgettable musical experiences.",
      category: "Creative",
      instagramUrl: "https://instagram.com/musicsociety",
      memberCount: 75,
      logo: "https://source.unsplash.com/random/200x200?music",
    },
    {
      id: 6,
      name: "Data Science",
      shortName: "DS",
      description:
        "Exploring the world of data analytics, ML, and artificial intelligence.",
      category: "Tech",
      instagramUrl: "https://instagram.com/datascienceclub",
      memberCount: 90,
      logo: "https://source.unsplash.com/random/200x200?data",
    },
    {
      id: 7,
      name: "Debate",
      shortName: "DB",
      description:
        "Enhancing communication skills and critical thinking through debates.",
      category: "Academic",
      instagramUrl: "https://instagram.com/debatesociety",
      memberCount: 55,
      logo: "https://source.unsplash.com/random/200x200?speech",
    },
    {
      id: 8,
      name: "Robotics",
      shortName: "RC",
      description:
        "Building the future through innovative robotics and automation.",
      category: "Tech",
      instagramUrl: "https://instagram.com/roboticsclub",
      memberCount: 65,
      logo: "https://source.unsplash.com/random/200x200?robot",
    },
  ];

  const categories = ["All", "Tech", "Creative", "Business", "Academic"];

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesSearch =
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || club.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleExploreClick = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  const handleInstagramClick = (url, e) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Clubs</h1>
          <p className="text-lg text-gray-600">
            Find your passion and connect with like-minded students.
          </p>
        </div>

        {/* Search + Category Filter */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full md:w-auto max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clubs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group"
              onClick={() => handleExploreClick(club.id)}
            >
              <div className="relative p-6 pb-4 flex flex-col items-center">
                {/* Circular Logo */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={club.logo}
                    alt={`${club.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Instagram */}
                <button
                  onClick={(e) => handleInstagramClick(club.instagramUrl, e)}
                  className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-pink-100 rounded-full transition-colors group-hover:scale-110"
                  title="Follow on Instagram"
                >
                  <Instagram className="h-4 w-4 text-gray-600 hover:text-pink-600" />
                </button>
              </div>

              <div className="px-6 pb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center group-hover:text-purple-600 transition-colors">
                  {club.name}
                </h3>

                <div className="text-center mb-3">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {club.category}
                  </span>
                </div>

                <p className="text-gray-600 text-sm text-center mb-5 leading-relaxed">
                  {club.description}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExploreClick(club.id);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 px-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 group-hover:scale-105"
                >
                  <span>Explore</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClubs.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No clubs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 text-center text-gray-600">
          Showing {filteredClubs.length} of {clubs.length} clubs
        </div>
      </div>
    </div>
  );
};

export default ClubsPage;
