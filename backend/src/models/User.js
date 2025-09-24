const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Basic Info - matches your form exactly
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w.-]+@[\w.-]+\.iitr\.ac\.in$/, "Must use a valid IITR email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    },
    enrollmentNumber: {
      type: String,
      required: [true, "Enrollment number is required"],
      unique: true,
      match: [/^\d{8}$/, "Enrollment number must be exactly 8 digits"],
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
      enum: [
        "Computer Science Engineering",
        "Electronics & Communication",
        "Mechanical Engineering",
        "Civil Engineering",
        "Electrical Engineering",
        "Information Technology",
        "Chemical Engineering",
        "Biotechnology",
        "MBA",
        "BBA",
        "Other",
      ],
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },

    // Additional Profile Info (can be added later via profile update)
    profilePicture: {
      type: String, // Cloudinary URL
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    interests: [
      {
        type: String,
        trim: true,
      },
    ],

    // Account Status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Add this field to existing User schema
    role: {
      type: String,
      enum: ["student", "club_admin", "super_admin"],
      default: "student",
    },

    // OTP and Verification
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    otpCode: String,
    otpExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otpCode = otp;
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

// Check if OTP is valid
userSchema.methods.isOTPValid = function (otp) {
  return this.otpCode === otp && this.otpExpires > Date.now();
};

// Add this before module.exports
userSchema.post("save", function (doc) {
  console.log("✅ User saved to database:", doc.email, "ID:", doc._id);
});

userSchema.post("save", function (error, doc, next) {
  if (error) {
    console.log("❌ User save failed:", error);
  }
  next();
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
