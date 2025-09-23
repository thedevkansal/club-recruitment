import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import EditProfileModal from '../components/profile/EditProfileModal';
import { User, Mail, Phone, Hash, GraduationCap, Calendar, Edit3, Camera } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      // Here you would upload to your server/cloud storage
      // For now, we'll just update the user profile with the preview URL
      try {
        await updateProfile({
          ...user,
          profileImage: imageUrl
        });
        alert('Profile picture updated successfully!');
      } catch (error) {
        console.error('Failed to update profile picture:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Profile Found</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Header with Edit Button */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-white relative">
            {/* FIXED EDIT BUTTON - Now with proper contrast */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-6 right-6 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all duration-200 border border-white border-opacity-30 hover:border-opacity-50 shadow-lg hover:shadow-xl"
              title="Edit Profile"
            >
              <Edit3 className="h-5 w-5 text-white" />
            </button>
            
            <div className="flex items-center space-x-6">
              {/* Profile Picture with Upload */}
              <div className="relative group">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
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
                
                {/* Pencil Icon */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <Edit3 className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold">{user.name || user.fullName || 'Student'}</h2>
                <p className="text-lg opacity-90">{user.branch || 'Computer Science'}</p>
                <p className="text-base opacity-75">{user.year || '3rd Year'}</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {user.name || user.fullName || 'John Doe'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex items-center text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      {user.email || 'john.doe@example.com'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="flex items-center text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      {user.phone || '+91 98765 43210'}
                    </div>
                  </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>
                    <div className="flex items-center text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      <Hash className="h-4 w-4 mr-2 text-gray-500" />
                      {user.enrollmentNumber || 'CS2021001'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <div className="flex items-center text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                      {user.branch || 'Computer Science Engineering'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Year</label>
                    <div className="flex items-center text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {user.year || '3rd Year'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-green-800">Account Active</span>
                <span className="ml-auto text-sm text-green-600">
                  Member since {user.memberSince || 'August 2023'}
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
        />
      )}
    </div>
  );
};

export default ProfilePage;
