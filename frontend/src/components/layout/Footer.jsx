import React from 'react';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CR</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Club Recruit
              </span>
            </div>
            <p className="text-gray-600 max-w-md">
              Connecting students with amazing campus organizations. 
              Discover your passion, build your network, and create lasting memories.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Browse Clubs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Events Calendar</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">My Profile</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 Club Recruit. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
