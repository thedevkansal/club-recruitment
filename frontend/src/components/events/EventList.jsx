import React from 'react';
import EventCard from './EventCard';

const EventList = ({ events, loading, onRegister, viewMode = 'grid' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
      {events?.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRegister={onRegister}
        />
      ))}
    </div>
  );
};

export default EventList;
