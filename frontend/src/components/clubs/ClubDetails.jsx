import React, { useState } from 'react';
import Card from '../ui/card';
import Button from '../ui/button';
import Modal from '../ui/Modal';
import { Users, MapPin, Calendar, Star, Heart, ExternalLink, Mail, Globe } from 'lucide-react';

const ClubDetails = ({ club, isOpen, onClose, onJoin }) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await onJoin?.(club);
    } finally {
      setIsJoining(false);
    }
  };

  if (!club) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="space-y-6">
        <div className="flex items-start space-x-6">
          <img
            src={club.image}
            alt={club.name}
            className="w-24 h-24 object-cover rounded-2xl"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{club.name}</h2>
            <p className="text-gray-600 mb-3">{club.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {club.members} members
              </span>
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-amber-400" />
                {club.rating}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <Button className="flex-1" isLoading={isJoining} onClick={handleJoin}>
            Join Club
          </Button>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Website
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClubDetails;
