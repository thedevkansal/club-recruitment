import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Home, 
  Users, 
  Calendar, 
  Bell, 
  LogOut,
  GraduationCap,
  User
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/clubs', label: 'Clubs', icon: Users },
    { path: '/events', label: 'Events', icon: Calendar }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-2' : 'py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-white rounded-full shadow-lg border border-gray-100 transition-all duration-300 ${
          scrolled ? 'shadow-xl' : 'shadow-lg'
        }`}>
          <div className="flex items-center justify-between px-6 py-3">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:block">
                Club Recruit
              </span>
            </Link>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1 bg-gray-50 rounded-full p-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 ${
                    isActive(path)
                      ? 'bg-white text-indigo-600 shadow-md font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-1 bg-gray-50 rounded-full p-1">
              {navItems.map(({ path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-white text-indigo-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                  }`}
                  title={navItems.find(item => item.path === path)?.label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>

            {/* SIMPLIFIED Right Section */}
            <div className="flex items-center space-x-3">
              
              {/* Notifications */}
              <div className="relative dropdown">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-full transition-colors duration-200"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                        <p className="text-sm font-medium text-gray-900">New event: Tech Club Meetup</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                        <p className="text-sm font-medium text-gray-900">Application accepted</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                        <p className="text-sm font-medium text-gray-900">Workshop reminder</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SIMPLIFIED Profile Icon - Links to Profile Page */}
              <Link
                to="/profile"
                className="p-1 hover:bg-gray-50 rounded-full transition-colors duration-200 group"
                title="View Profile"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
              </Link>

              {/* SIMPLIFIED Sign Out Icon */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
