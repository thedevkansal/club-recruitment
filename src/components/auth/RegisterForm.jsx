import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Hash, GraduationCap, Calendar, Lock, Check, Shield } from 'lucide-react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    enrollmentNumber: '',
    branch: '',
    year: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const branches = [
    'Computer Science Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
    'Chemical Engineering',
    'Biotechnology',
    'MBA',
    'BBA',
    'Other'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict phone & enrollment fields to digits only
    if (name === 'phone') {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData(prev => ({ ...prev, phone: value }));
      }
      return;
    }
    if (name === 'enrollmentNumber') {
      if (/^\d*$/.test(value) && value.length <= 8) {
        setFormData(prev => ({ ...prev, enrollmentNumber: value }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[\w.-]+@[\w.-]+\.iitr\.ac\.in$/.test(formData.email))
      newErrors.email = 'Must use a valid IITR email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = 'Phone number must be 10 digits';
    if (!formData.enrollmentNumber.trim()) newErrors.enrollmentNumber = 'Enrollment number is required';
    else if (!/^\d{8}$/.test(formData.enrollmentNumber))
      newErrors.enrollmentNumber = 'Enrollment number must be exactly 8 digits';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const registrationData = {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        enrollmentNumber: formData.enrollmentNumber.trim(),
        branch: formData.branch,
        year: formData.year,
        password: formData.password
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Show OTP step instead of redirecting
        setShowOTPStep(true);
        setIsLoading(false);
      } else {
        if (data.errors) {
          const backendErrors = {};
          data.errors.forEach(error => {
            backendErrors[error.field] = error.message;
          });
          setErrors(backendErrors);
        } else {
          setErrors({ general: data.message || 'Registration failed. Please try again.' });
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        general: 'Unable to connect to server. Please check your internet connection and try again.' 
      });
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('Email verified successfully! You can now login.');
        navigate('/login');
      } else {
        setOtpError(data.message || 'Invalid or expired OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setOtpError('Unable to verify OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('OTP sent again! Check your email.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
    }
  };

  // If showing OTP step, render OTP verification form
  if (showOTPStep) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h3>
          <p className="text-gray-600">
            We've sent a 6-digit OTP to <br />
            <span className="font-semibold text-purple-600">{formData.email}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Check your backend console for the OTP (Development mode)
          </p>
        </div>

        <form onSubmit={handleOTPSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
              Enter OTP <span className="text-red-500">*</span>
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value) && e.target.value.length <= 6) {
                  setOtp(e.target.value);
                  setOtpError('');
                }
              }}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full px-4 py-3 text-center text-2xl font-bold border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none 
              transition-colors bg-white text-gray-900"
            />
            {otpError && <p className="mt-1 text-sm text-red-600">{otpError}</p>}
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm 
            text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 
            hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 
            focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isVerifying ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify Email"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={resendOTP}
              className="text-sm text-purple-600 hover:text-purple-500 transition-colors"
            >
              Didn't receive OTP? Resend
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowOTPStep(false)}
              className="text-sm text-gray-600 hover:text-gray-500 transition-colors"
            >
              ← Back to registration
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Original registration form (rest of your existing form code...)
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none 
              transition-colors bg-white text-gray-900 placeholder-gray-400 ${
                errors.fullName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            />
          </div>
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            College Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your IITR email"
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none 
              transition-colors bg-white text-gray-900 placeholder-gray-400 ${
                errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none 
              transition-colors bg-white text-gray-900 placeholder-gray-400 ${
                errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* Enrollment Number */}
        <div>
          <label htmlFor="enrollmentNumber" className="block text-sm font-semibold text-gray-700 mb-2">
            Enrollment Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="enrollmentNumber"
              type="text"
              name="enrollmentNumber"
              value={formData.enrollmentNumber}
              onChange={handleChange}
              placeholder="Enter 8-digit enrollment number"
              maxLength={8}
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none 
              transition-colors bg-white text-gray-900 placeholder-gray-400 ${
                errors.enrollmentNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            />
          </div>
          {errors.enrollmentNumber && <p className="mt-1 text-sm text-red-600">{errors.enrollmentNumber}</p>}
        </div>

        {/* Branch */}
        <div>
          <label htmlFor="branch" className="block text-sm font-semibold text-gray-700 mb-2">
            Branch <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none 
              transition-colors bg-white text-gray-900 appearance-none ${
                errors.branch ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            >
              <option value="">Select your branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          {errors.branch && <p className="mt-1 text-sm text-red-600">{errors.branch}</p>}
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
            Current Year <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none 
              transition-colors bg-white text-gray-900 appearance-none ${
                errors.year ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            >
              <option value="">Select your year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none 
              transition-colors bg-white text-gray-900 placeholder-gray-400 ${
                errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            />
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Check className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none 
              transition-colors bg-white text-gray-900 placeholder-gray-400 ${
                errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      <div className="flex items-start">
        <input
          id="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
        />
        <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
          I agree to the{' '}
          <button type="button" className="text-purple-600 hover:underline">Terms and Conditions</button>{' '}
          and{' '}
          <button type="button" className="text-purple-600 hover:underline">Privacy Policy</button>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm 
        text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 
        hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Creating Account...</span>
          </div>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
