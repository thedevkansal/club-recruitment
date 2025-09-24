import React from 'react';
import Card from '../ui/card';
import Button from '../ui/button';
import { Calendar, Clock, MapPin, Users, Star } from 'lucide-react';

const EventCard = ({ event, onRegister, isRegistered = false }) => {
  return (
    <Card hover className="overflow-hidden">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        {event.isFeatured && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        {isRegistered && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Registered
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-sm text-indigo-600 font-medium mb-3">{event.club}</p>
        <p className="text-gray-600 mb-4">{event.description}</p>
        
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {event.date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {event.time}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {event.attendees}/{event.maxAttendees} attending
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags?.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <Button 
          size="small" 
          className="w-full" 
          variant={isRegistered ? 'secondary' : 'primary'}
          onClick={() => onRegister?.(event)}
        >
          {isRegistered ? 'Registered' : 'Register'}
        </Button>
      </div>
    </Card>
  );
};

export default EventCard;
