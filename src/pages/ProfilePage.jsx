import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/button';
import Input from '../components/ui/Input';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, 
  Trophy, Users, Star, BookOpen, Settings
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    year: user?.year || '',
    department: user?.department || '',
    bio: user?.bio || ''
  });

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const stats = [
    {
      icon: Users,
      label: 'Clubs Joined',
      value: user?.joinedClubs?.length || 0,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      label: 'Events Attended',
      value: user?.eventsAttended || 0,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Trophy,
      label: 'Achievements',
      value: '5',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Star,
      label: 'Rating',
      value: '4.8',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-start space-x-6">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
              />
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Year"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                      />
                      <Input
                        label="Department"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
                    <p className="text-gray-600 mb-4">{user?.department} • {user?.year}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {user?.email}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {user?.memberSince}
                      </span>
                    </div>
                    
                    <p className="text-gray-600">
                      {user?.bio || "Passionate student exploring various opportunities and making connections on campus."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <div className="text-center">
                    <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* My Clubs */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Clubs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.joinedClubs?.map((club, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{club}</p>
                    <p className="text-sm text-gray-500">Active Member</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 col-span-2">No clubs joined yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" size="small" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-3" />
                Account Settings
              </Button>
              <Button variant="outline" size="small" className="w-full justify-start">
                <Users className="h-4 w-4 mr-3" />
                Find New Clubs
              </Button>
              <Button variant="outline" size="small" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-3" />
                My Events
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Event Completed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Joined New Club</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
