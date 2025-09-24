// src/pages/ClubsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Search, Instagram, ExternalLink, Building2, Users, Loader } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ClubsPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch clubs from backend
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        console.log('🏛️ Fetching clubs from backend...');
        
        const response = await fetch('http://localhost:5000/api/clubs', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('📥 Clubs response:', data);

        if (data.status === 'success') {
          setClubs(data.data.clubs || []);
        } else {
          setError(data.message || 'Failed to fetch clubs');
        }
      } catch (error) {
        console.error('💥 Error fetching clubs:', error);
        setError('Unable to load clubs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Get unique categories from clubs
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(clubs.map(club => club.category))];
    return ["All", ...uniqueCategories.sort()];
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesSearch =
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (club.tags && club.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      const matchesCategory =
        selectedCategory === "All" || club.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, clubs]);

  const handleExploreClick = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  const handleSocialClick = (url, e) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading clubs...</p>
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
                <Building2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Clubs</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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
              key={club._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group"
              onClick={() => handleExploreClick(club._id)}
            >
              <div className="relative p-6 pb-4 flex flex-col items-center">
                {/* Circular Logo */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300 bg-gray-100">
                  {club.logo ? (
                    <img
                      src={club.logo}
                      alt={`${club.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <span className="text-xl font-bold">
                        {club.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Social Media - Show if available */}
                {club.socialMedia && (club.socialMedia.instagram || club.socialMedia.facebook || club.socialMedia.twitter) && (
                  <button
                    onClick={(e) => handleSocialClick(
                      club.socialMedia.instagram || club.socialMedia.facebook || club.socialMedia.twitter, 
                      e
                    )}
                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-pink-100 rounded-full transition-colors group-hover:scale-110"
                    title="Follow on Social Media"
                  >
                    <Instagram className="h-4 w-4 text-gray-600 hover:text-pink-600" />
                  </button>
                )}
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

                {/* Member count if available */}
                {club.memberCount > 0 && (
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{club.memberCount} members</span>
                  </div>
                )}

                <p className="text-gray-600 text-sm text-center mb-5 leading-relaxed line-clamp-3">
                  {club.shortDescription}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExploreClick(club._id);
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
        {filteredClubs.length === 0 && clubs.length > 0 && (
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

        {/* No clubs at all */}
        {clubs.length === 0 && !loading && (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No clubs available
            </h3>
            <p className="text-gray-600">
              Be the first to create a club!
            </p>
          </div>
        )}

        {/* Stats */}
        {clubs.length > 0 && (
          <div className="mt-12 text-center text-gray-600">
            Showing {filteredClubs.length} of {clubs.length} clubs
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsPage;
