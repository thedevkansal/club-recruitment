const User = require("../models/user");
const { generateToken } = require("../utils/jwt");
const mongoose = require("mongoose");
const { sendOTPEmail, sendWelcomeEmail } = require("../utils/emailService");

// Register user
const register = async (req, res) => {
  try {
    console.log("📩 Registration request received:");
    console.log("Body:", req.body);
    console.log("Headers:", req.headers);

    const { fullName, email, phone, enrollmentNumber, branch, year, password } =
      req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !enrollmentNumber ||
      !branch ||
      !year ||
      !password
    ) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
        errors: [
          { field: "general", message: "Please fill in all required fields" },
        ],
      });
    }

    console.log("✅ All required fields present");

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { enrollmentNumber }],
    });

    if (existingUser) {
      const field =
        existingUser.email === email ? "email" : "enrollment number";
      return res.status(400).json({
        status: "error",
        message: `User with this ${field} already exists`,
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      phone,
      enrollmentNumber,
      branch,
      year,
      password,
    });

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, fullName);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail registration if email fails in development
      if (process.env.NODE_ENV === "development") {
        console.log(`🔐 FALLBACK - OTP for ${email}: ${otp}`);
      }
    }

    res.status(201).json({
      status: "success",
      message:
        "Registration successful! Please verify your email with the OTP sent.",
      data: {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Registration failed. Please try again.",
    });
  }
};

// Verify email with OTP
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified",
      });
    }

    // Check OTP
    if (!user.isOTPValid(otp)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP",
      });
    }

    // ✅ VERIFY EMAIL AND CLEAR OTP
    user.isEmailVerified = true; // This should set to true
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    console.log(
      "✅ Email verified for:",
      email,
      "Status:",
      user.isEmailVerified
    );

    // Send welcome email
    try {
      await sendWelcomeEmail(email, user.fullName);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    // Generate JWT token
    const token = generateToken({ userId: user._id });

    res.status(200).json({
      status: "success",
      message: "Email verified successfully!",
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          enrollmentNumber: user.enrollmentNumber,
          branch: user.branch,
          year: user.year,
          isEmailVerified: user.isEmailVerified, // Should be true now
        },
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      status: "error",
      message: "Email verification failed",
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified",
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp, user.fullName);

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully!",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to resend OTP",
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: "error",
        message: "Account is deactivated",
      });
    }

    // Generate JWT token
    const token = generateToken({ userId: user._id });

    res.status(200).json({
      status: "success",
      message: "Login successful!",
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          enrollmentNumber: user.enrollmentNumber,
          branch: user.branch,
          year: user.year,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          profilePicture: user.profilePicture,
          bio: user.bio,
          skills: user.skills,
          interests: user.interests,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Login failed",
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch profile",
    });
  }
};

const testDB = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const users = await User.find().select("email fullName createdAt");

    res.status(200).json({
      status: "success",
      message: "Database connection working",
      data: {
        totalUsers: userCount,
        users: users,
        dbConnection:
          mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      },
    });
  } catch (error) {
    console.error("DB Test Error:", error);
    res.status(500).json({
      status: "error",
      message: "Database test failed",
      error: error.message,
    });
  }
};

// Add this to authController.js
const getDBInfo = async (req, res) => {
  try {
    const dbName = mongoose.connection.db.databaseName;
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    res.json({
      status: "success",
      databaseName: dbName,
      collections: collections.map((c) => c.name),
      connectionString: process.env.MONGODB_URI?.split("@")[1] || "hidden",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVerificationStatus = async (req, res) => {
  try {
    const { email, isEmailVerified } = req.body;

    const user = await User.findOneAndUpdate(
      { email: email },
      { isEmailVerified: isEmailVerified },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: `Email verification ${isEmailVerified ? "enabled" : "disabled"}`,
      data: { user },
    });
  } catch (error) {
    console.error("Update verification error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update verification status",
    });
  }
};

// Add to exports
module.exports = {
  register,
  verifyEmail,
  resendOTP,
  login,
  getProfile,
  testDB,
  getDBInfo,
  updateVerificationStatus,
};
