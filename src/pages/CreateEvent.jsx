import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Mail,
  Phone,
  Globe,
  ImageIcon,
  Upload,
  Plus,
  X,
  Save,
  ArrowLeft,
  DollarSign,
  UserCheck,
  Tag,
  Trophy,
  Target,
  List,
  AlertCircle,
  Award,
  UserPlus,
  Link,
  ExternalLink,
} from "lucide-react";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  // Image upload states
  const [bannerPreview, setBannerPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    shortDescription: "",
    description: "",
    eventType: "",
    category: "",

    // Date & Time
    eventDate: "",
    startTime: "",

    // Location
    venue: "",
    address: "",

    // Team & Participation
    teamSize: "Individual",
    minTeamSize: 1,
    maxTeamSize: 1,

    // Registration
    registrationRequired: true,
    registrationDeadline: "",
    registrationLink: "",
    maxParticipants: "",
    registrationFee: 0,

    // Competition Details - Enhanced rounds
    numberOfRounds: 1,
    rounds: [
      {
        roundNumber: 1,
        name: "",
        description: "",
        duration: "",
        briefing: "",
        submissionLink: "",
      },
    ],

    // Media
    bannerImage: "",

    // Event Schedule/Agenda
    agenda: [{ date: "", time: "", activity: "", duration: "" }],

    // Details
    eligibility: [""],
    requirements: [""],

    // Contact & Links
    contactEmail: "",
    contacts: [{ name: "", phone: "" }],
    eventWebsite: "",

    // Organizer
    organizerClub: "",

    // Tags
    tags: [""],
  });

  const eventTypes = [
    "Workshop",
    "Seminar",
    "Competition",
    "Meeting",
    "Social",
    "Networking",
    "Conference",
    "Training",
    "Hackathon",
    "Other",
  ];

  const categories = [
    "Technical",
    "Cultural",
    "Sports",
    "Academic",
    "Social Service",
    "Entrepreneurship",
    "Arts & Crafts",
    "Music & Dance",
    "Literary",
    "Science & Research",
    "Gaming",
    "Photography",
    "Other",
  ];

  const teamSizeOptions = [
    "Individual",
    "Team (2-3)",
    "Team (4-5)",
    "Team (6-10)",
    "Large Team (10+)",
    "Custom",
  ];

  // 12-HOUR TIME CONVERSION FUNCTIONS
  const convert24to12 = (time24) => {
    if (!time24) return { hour: "12", minute: "00", period: "AM" };

    const [hours, minutes] = time24.split(":");
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? "PM" : "AM";

    return {
      hour: String(hour12).padStart(2, "0"),
      minute: minutes,
      period: period,
    };
  };

  const convert12to24 = (hour, minute, period) => {
    let hour24 = parseInt(hour);

    if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    } else if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    }

    return `${String(hour24).padStart(2, "0")}:${minute}`;
  };

  // Fetch ALL clubs from database
  useEffect(() => {
    const fetchAllClubs = async () => {
      try {
        console.log("🏛️ Fetching all clubs from database...");

        const response = await fetch("http://localhost:5000/api/clubs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        console.log("📥 All clubs response:", data);

        if (data.status === "success") {
          setClubs(data.data.clubs || []);
          console.log("🏛️ Total clubs loaded:", data.data.clubs?.length);
        }
      } catch (error) {
        console.error("💥 Error fetching clubs:", error);
        setErrors({
          general: "Failed to load clubs. Please refresh the page.",
        });
      } finally {
        setLoadingClubs(false);
      }
    };

    fetchAllClubs();
  }, []);

  // Handle team size change
  useEffect(() => {
    if (formData.teamSize === "Individual") {
      setFormData((prev) => ({ ...prev, minTeamSize: 1, maxTeamSize: 1 }));
    } else if (formData.teamSize === "Team (2-3)") {
      setFormData((prev) => ({ ...prev, minTeamSize: 2, maxTeamSize: 3 }));
    } else if (formData.teamSize === "Team (4-5)") {
      setFormData((prev) => ({ ...prev, minTeamSize: 4, maxTeamSize: 5 }));
    } else if (formData.teamSize === "Team (6-10)") {
      setFormData((prev) => ({ ...prev, minTeamSize: 6, maxTeamSize: 10 }));
    } else if (formData.teamSize === "Large Team (10+)") {
      setFormData((prev) => ({ ...prev, minTeamSize: 10, maxTeamSize: 50 }));
    }
  }, [formData.teamSize]);

  // Handle number of rounds change - SIMPLIFIED (1-5 only)
  useEffect(() => {
    const numRounds = parseInt(formData.numberOfRounds) || 1;
    const currentRounds = formData.rounds.length;

    if (numRounds !== currentRounds) {
      const newRounds = [...formData.rounds];

      if (numRounds > currentRounds) {
        for (let i = currentRounds; i < numRounds; i++) {
          newRounds.push({
            roundNumber: i + 1,
            name: "",
            description: "",
            duration: "",
            briefing: "",
            submissionLink: "",
          });
        }
      } else {
        newRounds.splice(numRounds);
      }

      setFormData((prev) => ({ ...prev, rounds: newRounds }));
    }
  }, [formData.numberOfRounds]);

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target.result);
        setFormData((prev) => ({ ...prev, bannerImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setBannerPreview(null);
    setFormData((prev) => ({ ...prev, bannerImage: "" }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayChange = (field, index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index
          ? typeof item === "object"
            ? { ...item, [key]: value }
            : value
          : item
      ),
    }));
  };

  const addArrayItem = (field, defaultValue = "") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.description.trim())
      newErrors.description = "Event description is required";
    if (!formData.eventType) newErrors.eventType = "Event type is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.eventDate) newErrors.eventDate = "Event date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";
    if (!formData.organizerClub)
      newErrors.organizerClub = "Organizing club is required";

    // Registration deadline validation (HTML5 handles format)
    if (
      formData.registrationRequired &&
      formData.registrationDeadline &&
      formData.eventDate
    ) {
      if (
        new Date(formData.registrationDeadline) > new Date(formData.eventDate)
      ) {
        newErrors.registrationDeadline =
          "Registration deadline must be before event date";
      }
    }

    // Team size validation for custom
    if (formData.teamSize === "Custom") {
      if (!formData.minTeamSize || formData.minTeamSize < 1) {
        newErrors.minTeamSize = "Minimum team size must be at least 1";
      }
      if (
        !formData.maxTeamSize ||
        formData.maxTeamSize < formData.minTeamSize
      ) {
        newErrors.maxTeamSize =
          "Maximum team size must be greater than minimum";
      }
    }

    // Email validation
    if (
      formData.contactEmail &&
      !/^\S+@\S+\.\S+$/.test(formData.contactEmail)
    ) {
      newErrors.contactEmail = "Please enter a valid email";
    }

    // Contact phone validation
    formData.contacts.forEach((contact, index) => {
      if (contact.phone && !/^\d{10}$/.test(contact.phone)) {
        newErrors[`contact_${index}_phone`] = "Phone number must be 10 digits";
      }
    });

    // URL validation
    if (
      formData.registrationLink &&
      !/^https?:\/\/.+/.test(formData.registrationLink)
    ) {
      newErrors.registrationLink = "Registration link must be a valid URL";
    }

    if (
      formData.eventWebsite &&
      !/^https?:\/\/.+/.test(formData.eventWebsite)
    ) {
      newErrors.eventWebsite = "Website must be a valid URL";
    }

    // Round submission links validation
    formData.rounds.forEach((round, index) => {
      if (
        round.submissionLink &&
        !/^https?:\/\/.+/.test(round.submissionLink)
      ) {
        newErrors[`round_${index}_submission`] =
          "Submission link must be a valid URL";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(true);

    try {
      // Clean up data - ENHANCED CLEANING
      let organizerClubId = formData.organizerClub;
      // If organizerClub is an object, extract its _id
      if (
        organizerClubId &&
        typeof organizerClubId === "object" &&
        organizerClubId._id
      ) {
        organizerClubId = organizerClubId._id;
      }
      const cleanData = {
        ...formData,
        organizerClub: organizerClubId,
        startDate: formData.eventDate,
        endDate: formData.eventDate,
        endTime: formData.startTime,

        // ✅ FIX: Clean agenda - only items with both activity AND time
        agenda: formData.agenda
          .filter((item) => item.activity?.trim() && item.time?.trim())
          .map((item) => ({
            ...item,
            date: item.date || formData.eventDate,
          })),

        // ✅ FIX: Clean rounds - remove completely empty ones
        rounds: formData.rounds.filter(
          (round) =>
            round.description?.trim() ||
            round.briefing?.trim() ||
            round.name?.trim()
        ),

        // ✅ FIX: Clean contacts - remove empty ones
        contacts: formData.contacts.filter(
          (contact) => contact.name?.trim() || contact.phone?.trim()
        ),

        // ✅ FIX: Clean other arrays
        eligibility: formData.eligibility.filter((req) => req?.trim()),
        requirements: formData.requirements.filter((req) => req?.trim()),
        tags: formData.tags.filter((tag) => tag?.trim()),

        // ✅ FIX: Ensure numeric values
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : null,
        registrationFee: parseFloat(formData.registrationFee) || 0,
        numberOfRounds:
          formData.rounds.filter(
            (round) =>
              round.description?.trim() ||
              round.briefing?.trim() ||
              round.name?.trim()
          ).length || 1,
      };

      const token = localStorage.getItem("token");
      console.log("📅 Creating event:", cleanData.title);
      console.log("🧹 Clean data being sent:", cleanData);

      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();
      console.log("📥 Event creation response:", data);

      if (data.status === "success") {
        alert(`🎉 Event "${cleanData.title}" created successfully!`);
        navigate("/events");
      } else {
        if (data.errors) {
          const backendErrors = {};
          data.errors.forEach((error) => {
            backendErrors[error.field] = error.message;
          });
          setErrors(backendErrors);
        } else {
          setErrors({ general: data.message || "Failed to create event" });
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("💥 Event creation error:", error);
      setErrors({ general: "Unable to connect to server. Please try again." });
      window.scrollTo({ top: 0, behavior: "smooth" });
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <CalendarDays className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Event
              </h1>
              <p className="text-gray-600 mt-1">
                Organize an amazing event for your community
              </p>
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
                <h3 className="text-sm font-medium text-red-800">
                  Error Creating Event
                </h3>
                <p className="mt-1 text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <CalendarDays className="h-6 w-6 mr-3" />
                Basic Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Tech Workshop 2025"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.title ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Event Type, Category & Organizing Club */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none ${
                      errors.eventType ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.eventType && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.eventType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none ${
                      errors.category ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organizing Club <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="organizerClub"
                    value={formData.organizerClub}
                    onChange={handleChange}
                    disabled={loadingClubs}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none ${
                      errors.organizerClub
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">
                      {loadingClubs
                        ? "Loading clubs..."
                        : clubs.length === 0
                        ? "No clubs found"
                        : "Select organizing club"}
                    </option>
                    {clubs.map((club) => (
                      <option key={club._id} value={club._id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                  {errors.organizerClub && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.organizerClub}
                    </p>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Brief description for event cards (max 200 characters)"
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.shortDescription.length}/200
                </p>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Detailed description of your event..."
                  maxLength={2000}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.description.length}/2000
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time - HTML5 DATE + 12-HOUR TIME */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Clock className="h-6 w-6 mr-3" />
                Date & Time
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* HTML5 Date Input - PROPER DATE PICKER */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]} // No past dates
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors ${
                        errors.eventDate ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.eventDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.eventDate}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Click to open date picker
                  </p>
                </div>

                {/* Custom 12-Hour Time Input - MAIN TIME */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                    <div
                      className={`flex items-center space-x-2 w-full pl-10 pr-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-colors bg-white ${
                        errors.startTime ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      {/* Hour */}
                      <select
                        value={convert24to12(formData.startTime).hour}
                        onChange={(e) => {
                          const current = convert24to12(formData.startTime);
                          const newTime = convert12to24(
                            e.target.value,
                            current.minute,
                            current.period
                          );
                          setFormData((prev) => ({
                            ...prev,
                            startTime: newTime,
                          }));
                        }}
                        className="border-0 outline-none bg-transparent text-center w-12"
                      >
                        {Array.from({ length: 12 }, (_, i) => {
                          const hour = i === 0 ? 12 : i;
                          return (
                            <option
                              key={hour}
                              value={String(hour).padStart(2, "0")}
                            >
                              {String(hour).padStart(2, "0")}
                            </option>
                          );
                        })}
                      </select>

                      <span className="text-gray-500">:</span>

                      {/* Minute */}
                      <select
                        value={convert24to12(formData.startTime).minute}
                        onChange={(e) => {
                          const current = convert24to12(formData.startTime);
                          const newTime = convert12to24(
                            current.hour,
                            e.target.value,
                            current.period
                          );
                          setFormData((prev) => ({
                            ...prev,
                            startTime: newTime,
                          }));
                        }}
                        className="border-0 outline-none bg-transparent text-center w-12"
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={String(i).padStart(2, "0")}>
                            {String(i).padStart(2, "0")}
                          </option>
                        ))}
                      </select>

                      {/* AM/PM */}
                      <select
                        value={convert24to12(formData.startTime).period}
                        onChange={(e) => {
                          const current = convert24to12(formData.startTime);
                          const newTime = convert12to24(
                            current.hour,
                            current.minute,
                            e.target.value
                          );
                          setFormData((prev) => ({
                            ...prev,
                            startTime: newTime,
                          }));
                        }}
                        className="border-0 outline-none bg-transparent text-center w-12 text-sm font-medium"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  {errors.startTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startTime}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    12-hour format (e.g., 02:30 PM)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Schedule/Agenda - HTML5 DATE + 12-HOUR TIME */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <List className="h-6 w-6 mr-3" />
                Event Schedule
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Create a detailed agenda for your event
              </p>
              <div className="space-y-4">
                {formData.agenda.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      {/* HTML5 Date Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <div className="relative">
                          <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                          <input
                            type="date"
                            value={item.date || formData.eventDate}
                            onChange={(e) =>
                              handleArrayChange(
                                "agenda",
                                index,
                                "date",
                                e.target.value
                              )
                            }
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Custom 12-Hour Time Input - AGENDA */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                          <div className="flex items-center space-x-1 w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-colors bg-white">
                            {/* Hour */}
                            <select
                              value={convert24to12(item.time).hour}
                              onChange={(e) => {
                                const current = convert24to12(item.time);
                                const newTime = convert12to24(
                                  e.target.value,
                                  current.minute,
                                  current.period
                                );
                                handleArrayChange(
                                  "agenda",
                                  index,
                                  "time",
                                  newTime
                                );
                              }}
                              className="border-0 outline-none bg-transparent text-center w-10 text-sm"
                            >
                              {Array.from({ length: 12 }, (_, i) => {
                                const hour = i === 0 ? 12 : i;
                                return (
                                  <option
                                    key={hour}
                                    value={String(hour).padStart(2, "0")}
                                  >
                                    {String(hour).padStart(2, "0")}
                                  </option>
                                );
                              })}
                            </select>

                            <span className="text-gray-500 text-sm">:</span>

                            {/* Minute */}
                            <select
                              value={convert24to12(item.time).minute}
                              onChange={(e) => {
                                const current = convert24to12(item.time);
                                const newTime = convert12to24(
                                  current.hour,
                                  e.target.value,
                                  current.period
                                );
                                handleArrayChange(
                                  "agenda",
                                  index,
                                  "time",
                                  newTime
                                );
                              }}
                              className="border-0 outline-none bg-transparent text-center w-10 text-sm"
                            >
                              {["00", "15", "30", "45"].map((minute) => (
                                <option key={minute} value={minute}>
                                  {minute}
                                </option>
                              ))}
                            </select>

                            {/* AM/PM */}
                            <select
                              value={convert24to12(item.time).period}
                              onChange={(e) => {
                                const current = convert24to12(item.time);
                                const newTime = convert12to24(
                                  current.hour,
                                  current.minute,
                                  e.target.value
                                );
                                handleArrayChange(
                                  "agenda",
                                  index,
                                  "time",
                                  newTime
                                );
                              }}
                              className="border-0 outline-none bg-transparent text-center w-8 text-xs font-medium"
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={item.duration}
                          onChange={(e) =>
                            handleArrayChange(
                              "agenda",
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 30 mins"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                        />
                      </div>

                      {/* Activity */}
                      <div className="flex items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Activity
                          </label>
                          <input
                            type="text"
                            value={item.activity}
                            onChange={(e) =>
                              handleArrayChange(
                                "agenda",
                                index,
                                "activity",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Opening Ceremony"
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                          />
                        </div>
                        {formData.agenda.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem("agenda", index)}
                            className="ml-2 p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    addArrayItem("agenda", {
                      date: formData.eventDate,
                      time: "",
                      activity: "",
                      duration: "",
                    })
                  }
                  className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Schedule Item
                </button>
              </div>
            </div>
          </div>

          {/* Event Rounds & Stages */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Trophy className="h-6 w-6 mr-3" />
                Event Rounds & Stages
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Number of Rounds */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Rounds/Stages
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  For competitions, workshops, or multi-stage events. Leave
                  fields empty if not needed.
                </p>
                <div className="flex items-center space-x-4">
                  <select
                    name="numberOfRounds"
                    value={formData.numberOfRounds}
                    onChange={handleChange}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors appearance-none"
                  >
                    <option value={1}>1 Round</option>
                    <option value={2}>2 Rounds</option>
                    <option value={3}>3 Rounds</option>
                    <option value={4}>4 Rounds</option>
                    <option value={5}>5 Rounds</option>
                  </select>

                  <span className="text-sm text-gray-600">
                    {formData.numberOfRounds > 1
                      ? "Multi-stage event"
                      : "Single stage event"}
                  </span>
                </div>
              </div>

              {/* Round Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Round Details & Briefing
                </h3>
                <div className="space-y-6">
                  {formData.rounds.map((round, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-800 flex items-center">
                          <Award className="h-6 w-6 mr-3 text-orange-600" />
                          Round {round.roundNumber}
                        </h4>
                        {formData.rounds.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newRounds = formData.rounds.filter(
                                (_, i) => i !== index
                              );
                              setFormData((prev) => ({
                                ...prev,
                                rounds: newRounds.map((r, i) => ({
                                  ...r,
                                  roundNumber: i + 1,
                                })),
                                numberOfRounds: newRounds.length,
                              }));
                            }}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        {/* Round Name & Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Round Name
                            </label>
                            <input
                              type="text"
                              value={round.name}
                              onChange={(e) =>
                                handleArrayChange(
                                  "rounds",
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder={`e.g., ${
                                index === 0
                                  ? "Preliminary Round"
                                  : index === formData.rounds.length - 1
                                  ? "Final Round"
                                  : `Round ${index + 1}`
                              }`}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={round.duration}
                              onChange={(e) =>
                                handleArrayChange(
                                  "rounds",
                                  index,
                                  "duration",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 2 hours, 30 minutes"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                            />
                          </div>
                        </div>

                        {/* Round Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Round Description
                          </label>
                          <textarea
                            value={round.description}
                            onChange={(e) =>
                              handleArrayChange(
                                "rounds",
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows={3}
                            placeholder="Describe what happens in this round, the format, objectives..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none"
                          />
                        </div>

                        {/* Round Briefing */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Detailed Briefing & Rules
                          </label>
                          <textarea
                            value={round.briefing}
                            onChange={(e) =>
                              handleArrayChange(
                                "rounds",
                                index,
                                "briefing",
                                e.target.value
                              )
                            }
                            rows={5}
                            placeholder="Detailed briefing, rules, judging criteria, submission requirements, evaluation parameters, dos and don'ts..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Include specific rules, scoring criteria, submission
                            requirements, evaluation parameters, timeline, and
                            any important instructions for participants.
                          </p>
                        </div>

                        {/* Submission Link for Round */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Submission Link
                          </label>
                          <div className="relative">
                            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="url"
                              value={round.submissionLink || ""}
                              onChange={(e) =>
                                handleArrayChange(
                                  "rounds",
                                  index,
                                  "submissionLink",
                                  e.target.value
                                )
                              }
                              placeholder="https://forms.gle/... (for submissions, registrations, etc.)"
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors ${
                                errors[`round_${index}_submission`]
                                  ? "border-red-300"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>
                          {errors[`round_${index}_submission`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`round_${index}_submission`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Round Button */}
                  {formData.rounds.length < 5 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newRoundNumber = formData.rounds.length + 1;
                        setFormData((prev) => ({
                          ...prev,
                          rounds: [
                            ...prev.rounds,
                            {
                              roundNumber: newRoundNumber,
                              name: "",
                              description: "",
                              duration: "",
                              briefing: "",
                              submissionLink: "",
                            },
                          ],
                          numberOfRounds: newRoundNumber,
                        }));
                      }}
                      className="w-full border-2 border-dashed border-orange-300 rounded-xl p-6 text-orange-600 hover:text-orange-700 hover:border-orange-400 hover:bg-orange-50 transition-all flex items-center justify-center"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Another Round (Max 5)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Team Size & Participation */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Users className="h-6 w-6 mr-3" />
                Team Size & Participation
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Size
                  </label>
                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors appearance-none"
                  >
                    {teamSizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    placeholder="Leave empty for unlimited"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Custom Team Size Settings */}
              {formData.teamSize === "Custom" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-green-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Minimum Team Size <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="minTeamSize"
                      value={formData.minTeamSize}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
                        errors.minTeamSize
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.minTeamSize && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.minTeamSize}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Maximum Team Size <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="maxTeamSize"
                      value={formData.maxTeamSize}
                      onChange={handleChange}
                      min={formData.minTeamSize}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${
                        errors.maxTeamSize
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.maxTeamSize && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.maxTeamSize}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Team Size Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Current Team Size Configuration:
                </h4>
                <p className="text-sm text-gray-600">
                  {formData.teamSize === "Individual"
                    ? "Individual participation only"
                    : `Teams of ${formData.minTeamSize}${
                        formData.minTeamSize !== formData.maxTeamSize
                          ? `-${formData.maxTeamSize}`
                          : ""
                      } members`}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <MapPin className="h-6 w-6 mr-3" />
                Location
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Venue <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      placeholder="e.g., Main Auditorium, Room 101"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
                        errors.venue ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.venue && (
                    <p className="mt-1 text-sm text-red-600">{errors.venue}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Complete address with landmarks"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Registration Details - HTML5 DATE INPUT */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <UserCheck className="h-6 w-6 mr-3" />
                Registration Details
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="registrationRequired"
                  name="registrationRequired"
                  checked={formData.registrationRequired}
                  onChange={handleChange}
                  className="w-5 h-5 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                />
                <label
                  htmlFor="registrationRequired"
                  className="text-sm font-semibold text-gray-700"
                >
                  Registration Required
                </label>
              </div>

              {formData.registrationRequired && (
                <div className="space-y-6 p-4 bg-amber-50 rounded-lg">
                  {/* Registration Deadline - HTML5 DATE INPUT */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Registration Deadline{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                      <input
                        type="date"
                        name="registrationDeadline"
                        value={formData.registrationDeadline}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        max={formData.eventDate} // Must be before event date
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors ${
                          errors.registrationDeadline
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.registrationDeadline && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.registrationDeadline}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Must be before the event date
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Registration Fee */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Registration Fee (₹)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="registrationFee"
                          value={formData.registrationFee}
                          onChange={handleChange}
                          placeholder="0 for free"
                          min="0"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Registration Link */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Registration Link
                    </label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        name="registrationLink"
                        value={formData.registrationLink}
                        onChange={handleChange}
                        placeholder="https://forms.gle/... (Google Form, website, etc.)"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors ${
                          errors.registrationLink
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.registrationLink && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.registrationLink}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Link where participants can register for your event
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Banner */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <ImageIcon className="h-6 w-6 mr-3" />
                Event Banner
              </h2>
            </div>

            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-pink-400 transition-colors">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 font-medium">
                          Event Banner Preview
                        </p>
                        <p className="text-xs text-gray-400">
                          1200 x 400 recommended
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <input
                      type="file"
                      id="banner-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />

                    <label
                      htmlFor="banner-upload"
                      className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600 mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {bannerPreview ? "Change Banner" : "Upload Banner"}
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {bannerPreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove Banner
                </button>
              )}
            </div>
          </div>

          {/* Eligibility & Requirements */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Target className="h-6 w-6 mr-3" />
                Eligibility & Requirements
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Eligibility Criteria */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Eligibility Criteria
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Who can participate in this event?
                </p>
                <div className="space-y-3">
                  {formData.eligibility.map((criterion, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={criterion}
                        onChange={(e) =>
                          handleArrayChange(
                            "eligibility",
                            index,
                            null,
                            e.target.value
                          )
                        }
                        placeholder={`Eligibility criterion ${index + 1}`}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                      />
                      {formData.eligibility.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem("eligibility", index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("eligibility")}
                    className="flex items-center text-cyan-600 hover:text-cyan-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Eligibility Criterion
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requirements
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  What do participants need to bring or prepare?
                </p>
                <div className="space-y-3">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) =>
                          handleArrayChange(
                            "requirements",
                            index,
                            null,
                            e.target.value
                          )
                        }
                        placeholder={`Requirement ${index + 1}`}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem("requirements", index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("requirements")}
                    className="flex items-center text-cyan-600 hover:text-cyan-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Mail className="h-6 w-6 mr-3" />
                Contact Information
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Primary Contact Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Primary Contact Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="event@example.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors ${
                      errors.contactEmail ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              {/* Multiple Contact Numbers */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Numbers
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Add multiple contacts with names and phone numbers
                </p>

                <div className="space-y-4">
                  {formData.contacts.map((contact, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Person Name
                          </label>
                          <div className="relative">
                            <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={contact.name}
                              onChange={(e) =>
                                handleArrayChange(
                                  "contacts",
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., John Doe"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div className="flex items-end">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="tel"
                                value={contact.phone}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "contacts",
                                    index,
                                    "phone",
                                    e.target.value
                                  )
                                }
                                placeholder="9876543210"
                                maxLength={10}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors ${
                                  errors[`contact_${index}_phone`]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                              />
                            </div>
                            {errors[`contact_${index}_phone`] && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors[`contact_${index}_phone`]}
                              </p>
                            )}
                          </div>
                          {formData.contacts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem("contacts", index)}
                              className="ml-2 p-2 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("contacts", { name: "", phone: "" })
                    }
                    className="flex items-center text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact Person
                  </button>
                </div>
              </div>

              {/* Event Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    name="eventWebsite"
                    value={formData.eventWebsite}
                    onChange={handleChange}
                    placeholder="https://event-website.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors ${
                      errors.eventWebsite ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.eventWebsite && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.eventWebsite}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Event Tags */}
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Tag className="h-6 w-6 mr-3" />
                Event Tags
              </h2>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Add tags to help people find your event
              </p>
              <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) =>
                        handleArrayChange("tags", index, null, e.target.value)
                      }
                      placeholder={`Tag ${index + 1}`}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("tags", index)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("tags")}
                  className="flex items-center text-violet-600 hover:text-violet-700 transition-colors"
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
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Event...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
