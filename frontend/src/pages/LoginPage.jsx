// src/pages/LoginPage.jsx
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import { GraduationCap } from 'lucide-react';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="flex flex-col justify-center px-8 xl:px-12 w-full max-w-2xl mx-auto relative z-10">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
              Club Recruit
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with amazing student organizations and discover your passion on campus.
            </p>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-4"></div>
                <span className="text-lg">Explore 50+ student clubs and organizations</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                <span className="text-lg">Attend exciting events and workshops</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-4"></div>
                <span className="text-lg">Build your network and develop new skills</span>
              </div>
            </div>
          </div>
        </div>
        {/* Animated Background */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white min-h-screen">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="text-center lg:hidden">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 mb-6 shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600 mb-4">Sign in to continue your journey</p>
          </div>

          {/* Desktop Header */}
          <div className="text-center hidden lg:block">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Welcome back! Please sign in to your account.</p>
          </div>

          <LoginForm />

          {/* Register Link */}
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">New to campus?</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-purple-600 hover:text-purple-500 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Demo Access</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Use any email and password to explore the demo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
