import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Clock,
  ImageIcon,
  Upload,
  Camera,
  Plus,
  X,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Save,
  ArrowLeft
} from 'lucide-react';

const CreateClub = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Image upload states
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [uploading, setUploading] = useState({ logo: false, cover: false });
  
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    foundedYear: new Date().getFullYear(),
    
    // Images
    logo: '',
    coverImage: '',
    
    // Contact Information
    email: '',
    phone: '',
    website: '',
    
    // Social Media
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      youtube: ''
    },
    
    // Meeting & Location
    meetingLocation: '',
    meetingTime: '',
    
    // Requirements
    eligibility: [''],
    recruitmentStatus: 'Closed',
    
    // Tags
    tags: [''],
    
    // Statistics
    memberCount: 0
  });

  const categories = [
    'Technical', 'Cultural', 'Sports', 'Academic', 'Social Service',
    'Entrepreneurship', 'Arts & Crafts', 'Music & Dance', 'Literary',
    'Science & Research', 'Gaming', 'Photography', 'Other'
  ];

  const recruitmentOptions = ['Open', 'Closed', 'Coming Soon'];

  // Image upload helper functions
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'logo') {
          setLogoPreview(e.target.result);
          setFormData(prev => ({ ...prev, logo: e.target.result }));
        } else {
          setCoverPreview(e.target.result);
          setFormData(prev => ({ ...prev, coverImage: e.target.result }));
        }
      };
      reader.readAsDataURL(file);

      console.log(`📸 ${type} image selected:`, file.name);

    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      alert(`Failed to upload ${type}. Please try again.`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const removeImage = (type) => {
    if (type === 'logo') {
      setLogoPreview(null);
      setFormData(prev => ({ ...prev, logo: '' }));
    } else {
      setCoverPreview(null);
      setFormData(prev => ({ ...prev, coverImage: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialMedia.')) {
      const social = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [social]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Club name is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.fullDescription.trim()) newErrors.fullDescription = 'Full description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.email.trim()) newErrors.email = 'Contact email is required';
    
    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    // Website validation
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must be a valid URL (http/https)';
    }
    
    // Year validation
    const currentYear = new Date().getFullYear();
    if (formData.foundedYear < 2000 || formData.foundedYear > currentYear) {
      newErrors.foundedYear = `Founded year must be between 2000 and ${currentYear}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsLoading(true);

    try {
      // Clean up data
      const cleanData = {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        eligibility: formData.eligibility.filter(req => req.trim() !== ''),
        // Remove empty social media fields
        socialMedia: Object.fromEntries(
          Object.entries(formData.socialMedia).filter(([_, v]) => v.trim() !== '')
        )
      };

      const token = localStorage.getItem('token');
      console.log('🏛️ Creating club:', cleanData.name);

      const response = await fetch('http://localhost:5000/api/clubs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanData)
      });

      const data = await response.json();
      console.log('📥 Club creation response:', data);

      if (data.status === 'success') {
        alert(`🎉 Club "${cleanData.name}" created successfully!`);
        navigate('/clubs'); // Navigate to clubs listing
      } else {
        if (data.errors) {
          const backendErrors = {};
          data.errors.forEach(error => {
            backendErrors[error.field] = error.message;
          });
          setErrors(backendErrors);
        } else {
          setErrors({ general: data.message || 'Failed to create club' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('💥 Club creation error:', error);
      setErrors({ general: 'Unable to connect to server. Please try again.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Club</h1>
              <p className="text-gray-600 mt-1">Fill out the details to create your club profile</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Creating Club</h3>
                <p className="mt-1 text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Building2 className="h-6 w-6 mr-3" />
                Basic Information
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Club Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Club Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Programming Club IITR"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors appearance-none ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Brief description that appears in club listings (max 200 characters)"
                  maxLength={200}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors resize-none ${
                    errors.shortDescription ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.shortDescription && <p className="text-sm text-red-600">{errors.shortDescription}</p>}
                  <p className="text-xs text-gray-500 ml-auto">{formData.shortDescription.length}/200</p>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Detailed description of your club, its mission, activities, and goals..."
                  maxLength={2000}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors resize-none ${
                    errors.fullDescription ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.fullDescription && <p className="text-sm text-red-600">{errors.fullDescription}</p>}
                  <p className="text-xs text-gray-500 ml-auto">{formData.fullDescription.length}/2000</p>
                </div>
              </div>

              {/* Founded Year & Member Count */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    min="2000"
                    max={new Date().getFullYear()}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                      errors.foundedYear ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.foundedYear && <p className="mt-1 text-sm text-red-600">{errors.foundedYear}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Member Count
                  </label>
                  <input
                    type="number"
                    name="memberCount"
                    value={formData.memberCount}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Club Images Section */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-orange-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <ImageIcon className="h-6 w-6 mr-3" />
                Club Images
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Club Logo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Club Logo
                </label>
                <div className="flex items-start space-x-6">
                  {/* Logo Preview */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 overflow-hidden">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="text-center">
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">Logo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-pink-400 transition-colors">
                      <div className="text-center">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-900 mb-1">Upload Club Logo</p>
                        <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 2MB</p>
                        
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'logo')}
                        />
                        
                        <label
                          htmlFor="logo-upload"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          {uploading.logo ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600 mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Choose Image
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                    
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => removeImage('logo')}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Cover Image
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-pink-400 transition-colors">
                  {/* Cover Preview */}
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {coverPreview ? (
                        <img 
                          src={coverPreview} 
                          alt="Cover preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 font-medium">Cover Image Preview</p>
                          <p className="text-xs text-gray-400">1200 x 400 recommended</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <input
                        type="file"
                        id="cover-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'cover')}
                      />
                      
                      <label
                        htmlFor="cover-upload"
                        className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                      >
                        {uploading.cover ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600 mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            {coverPreview ? 'Change Cover' : 'Upload Cover'}
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                
                {coverPreview && (
                  <button
                    type="button"
                    onClick={() => removeImage('cover')}
                    className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove Cover Image
                  </button>
                )}
              </div>

              {/* Image Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Image Guidelines</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>Logo:</strong> Square format, minimum 200x200px, clear background preferred</li>
                  <li>• <strong>Cover:</strong> Landscape format, 1200x400px recommended, represents your club</li>
                  <li>• <strong>File size:</strong> Maximum 2MB per image</li>
                  <li>• <strong>Formats:</strong> JPG, PNG, WEBP supported</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Mail className="h-6 w-6 mr-3" />
                Contact Information
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="club@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourclub.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                      errors.website ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-500" />
                    <input
                      type="url"
                      name="socialMedia.instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleChange}
                      placeholder="Instagram URL"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
                    <input
                      type="url"
                      name="socialMedia.facebook"
                      value={formData.socialMedia.facebook}
                      onChange={handleChange}
                      placeholder="Facebook URL"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                    <input
                      type="url"
                      name="socialMedia.twitter"
                      value={formData.socialMedia.twitter}
                      onChange={handleChange}
                      placeholder="Twitter URL"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-700" />
                    <input
                      type="url"
                      name="socialMedia.linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={handleChange}
                      placeholder="LinkedIn URL"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Information */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Clock className="h-6 w-6 mr-3" />
                Meeting Information
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meeting Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meeting Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="meetingLocation"
                      value={formData.meetingLocation}
                      onChange={handleChange}
                      placeholder="e.g., Main Building Room 101"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Meeting Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meeting Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="meetingTime"
                      value={formData.meetingTime}
                      onChange={handleChange}
                      placeholder="e.g., Every Friday 5:00 PM"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Recruitment Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recruitment Status
                </label>
                <select
                  name="recruitmentStatus"
                  value={formData.recruitmentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors appearance-none"
                >
                  {recruitmentOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Tags</h2>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Club Tags
              </label>
              <p className="text-sm text-gray-500 mb-4">Add tags to help students find your club</p>
              <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                      placeholder={`Tag ${index + 1}`}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('tags', index)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('tags')}
                  className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Club...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Create Club
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClub;
