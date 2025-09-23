import React, { useState } from 'react';
import Card from '../ui/card';
import Button from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EventCalendar = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="small">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="small">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="text-center py-8 text-gray-500">
        Calendar view coming soon
      </div>
    </Card>
  );
};

export default EventCalendar;
