import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/card';
import Button from '../components/ui/button';
import { 
  Users, Calendar, TrendingUp, Star, Clock, ArrowRight, Trophy, BookOpen
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  const stats = [
    {
      icon: Users,
      label: 'Active Clubs',
      value: '24',
      change: '+3 new',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      label: 'Upcoming Events', 
      value: '12',
      change: 'This week',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: TrendingUp,
      label: 'Your Applications',
      value: '3',
      change: '2 pending',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Trophy,
      label: 'Events Attended',
      value: user?.eventsAttended || '0',
      change: 'This semester',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const featuredClubs = [
    {
      id: 1,
      name: 'Tech Innovation Club',
      category: 'Technology',
      members: 156,
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
      description: 'Building the future with code and creativity',
      trending: true
    },
    {
      id: 2,
      name: 'Music Harmony Society',
      category: 'Arts',
      members: 89,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      description: 'Express yourself through music and performance'
    },
    {
      id: 3,
      name: 'Environmental Action',
      category: 'Activism',
      members: 134,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      description: 'Creating a sustainable future for our planet'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-indigo-100 text-lg">
              Ready to explore new opportunities and connect with amazing people?
            </p>
            <div className="mt-4 flex items-center space-x-4 text-sm text-indigo-100">
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {user?.department}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {user?.year}
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-20 w-20 rounded-full border-4 border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Featured Clubs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Clubs</h2>
          <Button variant="outline" size="small">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredClubs.map((club) => (
            <Card key={club.id} hover className="overflow-hidden">
              <div className="relative">
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-48 object-cover"
                />
                {club.trending && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Trending
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                  {club.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{club.name}</h3>
                <p className="text-gray-600 mb-4">{club.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {club.members} members
                  </div>
                  <Button size="small">
                    Join Club
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
