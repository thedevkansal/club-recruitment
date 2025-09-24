import React from 'react';
import Card from '../ui/card';
import { Mail, Phone, MapPin, Calendar, Edit3 } from 'lucide-react';

const ProfileCard = ({ user, onEdit }) => {
  return (
    <Card>
      <div className="flex items-start space-x-6">
        <img
          src={user?.avatar}
          alt={user?.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              <p className="text-gray-600 mb-4">{user?.department} • {user?.year}</p>
            </div>
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
            >
              <Edit3 className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-3" />
              {user?.email}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-3" />
              Member since {user?.memberSince}
            </div>
          </div>
          
          <p className="text-gray-600 mt-4">
            {user?.bio || "Passionate student exploring various opportunities and making connections on campus."}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
