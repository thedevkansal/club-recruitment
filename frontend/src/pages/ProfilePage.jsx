import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/profile/EditProfileModal";
import {
  User,
  Mail,
  Phone,
  Hash,
  GraduationCap,
  Calendar,
  Edit3,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile from backend
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      console.log("🔍 Fetching user profile...");

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("📥 Profile data:", data);

      if (data.status === "success") {
        setUser(data.data.user);
        setProfileImage(data.data.user.profilePicture);
        setError("");
      } else {
        setError(data.message || "Failed to fetch profile");
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("💥 Profile fetch error:", error);
      setError("Unable to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);

    try {
      // In a real app, you'd upload to cloud storage (Cloudinary, AWS S3, etc.)
      // For now, we'll simulate an upload
      const formData = new FormData();
      formData.append("profilePicture", file);

      // Update profile picture via API
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/users/profile-picture",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setUser(data.data.user);
        alert("Profile picture updated successfully!");
      } else {
        // Revert on error
        setProfileImage(user?.profilePicture || null);
        alert("Failed to update profile picture");
      }
    } catch (error) {
      console.error("Failed to update profile picture:", error);
      setProfileImage(user?.profilePicture || null);
      alert("Failed to update profile picture");
    }
  };

  const formatMemberSince = (dateString) => {
    if (!dateString) return "Recently joined";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="pt-24">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Loading Profile...
            </h2>
            <p className="text-gray-600">
              Please wait while we fetch your information
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <div className="pt-24">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to Load Profile
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setIsLoading(true);
                fetchUserProfile();
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No user state
  if (!user) {
    return (
      <div className="pt-24">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Profile Found
            </h2>
            <p className="text-gray-600">Please log in to view your profile.</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            {/* Header with Edit Button */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-white relative">
              {/* REPLACE THE EDIT BUTTON WITH THIS */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-6 right-6 p-2 bg-black bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-200 backdrop-blur-sm border border-white border-opacity-20"
                title="Edit Profile"
              >
                <Edit3 className="h-5 w-5 text-white" />
              </button>

              <div className="flex items-center space-x-6">
                {/* Profile Picture with Upload */}
                <div className="relative group">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white border-opacity-30">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-white" />
                    )}
                  </div>

                  {/* Camera/Edit Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer">
                    <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                    title="Click to change profile picture"
                  />

                  {/* Edit Icon */}
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <Edit3 className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold">{user.fullName}</h2>
                  <p className="text-lg opacity-90">{user.branch}</p>
                  <p className="text-base opacity-75">{user.year}</p>
                  {/* Email verification status */}
                  <div className="flex items-center mt-2">
                    {user.isEmailVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-sm text-green-200">
                          Email Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-yellow-400 mr-2" />
                        <span className="text-sm text-yellow-200">
                          Email Not Verified
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-indigo-600" />
                    Personal Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        {user.fullName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        {user.email}
                        {user.isEmailVerified && (
                          <CheckCircle
                            className="h-4 w-4 ml-2 text-green-500"
                            title="Verified"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="flex items-center text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        +91 {user.phone}
                      </div>
                    </div>

                    {user.bio && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {user.bio}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" />
                    Academic Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enrollment Number
                      </label>
                      <div className="flex items-center text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        <Hash className="h-4 w-4 mr-2 text-gray-500" />
                        {user.enrollmentNumber}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch
                      </label>
                      <div className="flex items-center text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                        {user.branch}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Year
                      </label>
                      <div className="flex items-center text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {user.year}
                      </div>
                    </div>

                    {/* Skills */}
                    {user.skills && user.skills.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interests */}
                    {user.interests && user.interests.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Interests
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {user.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div
                className={`mt-8 p-4 border rounded-lg ${
                  user.isActive
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-3 ${
                      user.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span
                    className={`text-sm font-medium ${
                      user.isActive ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    Account {user.isActive ? "Active" : "Inactive"}
                  </span>
                  <span
                    className={`ml-auto text-sm ${
                      user.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Member since {formatMemberSince(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <EditProfileModal
            user={user}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={(updatedUser) => {
              setUser(updatedUser);
              setIsEditModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
