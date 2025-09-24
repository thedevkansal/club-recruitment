import React from 'react';
import Card from '../ui/card';
import { Users, Calendar, Trophy, Star } from 'lucide-react';

const UserStats = ({ user }) => {
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
  );
};

export default UserStats;
