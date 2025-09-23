import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { X, User, Mail, Phone, Hash, GraduationCap, Calendar, Save } from 'lucide-react';

const EditProfileModal = ({ user, isOpen, onClose }) => {
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user.name || user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
    enrollmentNumber: user.enrollmentNumber || '',
    branch: user.branch || '',
    year: user.year || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  // ✅ Only up to 5th year  
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ Restrict phone & enrollment fields to digits only
    if (name === 'phone') {
      if (/^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, phone: value }));
      }
      return;
    }
    if (name === 'enrollmentNumber') {
      if (/^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, enrollmentNumber: value }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    // ✅ College email must end with .iitr.ac.in
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[\w.-]+@[\w.-]+\.iitr\.ac\.in$/.test(formData.email))
      newErrors.email = 'Must use a valid IITR email (e.g., user@abc.iitr.ac.in)';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = 'Phone number must be 10 digits';
    
    // ✅ Enrollment must be 8 digits
    if (!formData.enrollmentNumber.trim())
      newErrors.enrollmentNumber = 'Enrollment number is required';
    else if (!/^\d{8}$/.test(formData.enrollmentNumber))
      newErrors.enrollmentNumber = 'Enrollment number must be exactly 8 digits';
    
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.year) newErrors.year = 'Year is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await updateProfile({
        name: formData.fullName,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        enrollmentNumber: formData.enrollmentNumber,
        branch: formData.branch,
        year: formData.year
      });
      
      alert('Profile updated successfully!');
      onClose();
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
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
                    style={{ color: '#1f2937' }}
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  IITR Email <span className="text-red-500">*</span>
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
                    style={{ color: '#1f2937' }}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
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
                    style={{ color: '#1f2937' }}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Enrollment Number */}
              <div>
                <label htmlFor="enrollmentNumber" className="block text-sm font-medium text-gray-700 mb-2">
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
                    style={{ color: '#1f2937' }}
                  />
                </div>
                {errors.enrollmentNumber && <p className="mt-1 text-sm text-red-600">{errors.enrollmentNumber}</p>}
              </div>

              {/* Branch */}
              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
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
                    style={{ color: '#1f2937' }}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch} style={{ color: '#1f2937' }}>{branch}</option>
                    ))}
                  </select>
                </div>
                {errors.branch && <p className="mt-1 text-sm text-red-600">{errors.branch}</p>}
              </div>

              {/* Year */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
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
                    style={{ color: '#1f2937' }}
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year} style={{ color: '#1f2937' }}>{year}</option>
                    ))}
                  </select>
                </div>
                {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
              </div>

            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Update Error</h3>
                    <p className="mt-1 text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
