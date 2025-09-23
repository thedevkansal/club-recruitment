import { useState, useEffect } from 'react';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mockEvents = [
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
      description: 'Explore how AI is revolutionizing healthcare.',
      tags: ['Technology', 'AI', 'Healthcare'],
      isFeatured: true
    }
  ];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(mockEvents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId) => {
    console.log('Registering for event:', eventId);
    return { success: true };
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, fetchEvents, registerForEvent };
};

export default useEvents;
