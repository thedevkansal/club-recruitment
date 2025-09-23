import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/button';
import Input from '../components/ui/Input';
import { 
  Calendar, Clock, MapPin, Users, Search, Filter, 
  ChevronLeft, ChevronRight, Grid, List
} from 'lucide-react';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  const filters = ['All', 'This Week', 'This Month', 'My Events', 'Popular'];

  const events = [
    {
      id: 1,
      title: 'Tech Talk: AI in Healthcare',
      club: 'Tech Innovation Club',
      date: '2025-09-25',
      time: '6:00 PM',
      location: 'Auditorium A',
      attendees: 45,
      maxAttendees: 100,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      description: 'Explore how artificial intelligence is revolutionizing healthcare with industry experts.',
      tags: ['Technology', 'AI', 'Healthcare'],
      isRegistered: false,
      isFeatured: true
    },
    {
      id: 2,
      title: 'Open Mic Night',
      club: 'Music Harmony Society',
      date: '2025-09-26',
      time: '7:30 PM',
      location: 'Student Center',
      attendees: 32,
      maxAttendees: 80,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      description: 'Showcase your musical talents or enjoy performances by fellow students.',
      tags: ['Music', 'Performance', 'Entertainment'],
      isRegistered: true,
      isFeatured: false
    },
    {
      id: 3,
      title: 'Sustainability Workshop',
      club: 'Environmental Action',
      date: '2025-09-28',
      time: '3:00 PM',
      location: 'Science Building Room 201',
      attendees: 28,
      maxAttendees: 50,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      description: 'Learn practical ways to reduce your environmental impact on campus.',
      tags: ['Environment', 'Workshop', 'Sustainability'],
      isRegistered: false,
      isFeatured: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
          <p className="text-gray-600 mt-1">Discover exciting events happening around campus</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="small">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          
          <div className="flex items-center bg-white border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search events, clubs, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {events.map((event) => (
          <Card key={event.id} hover className="overflow-hidden">
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
              {event.isRegistered && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Registered
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
              </div>
              
              <p className="text-sm text-indigo-600 font-medium mb-2">{event.club}</p>
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
                {event.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <Button size="small" className="w-full" variant={event.isRegistered ? 'secondary' : 'primary'}>
                {event.isRegistered ? 'Registered' : 'Register'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
