const { z } = require('zod');

const registerSchema = z.object({
  fullName: z.string()
    .min(1, 'Full name is required')
    .max(100, 'Full name cannot exceed 100 characters')
    .trim(),
  
  email: z.string()
    .email('Invalid email format')
    .regex(/^[\w.-]+@[\w.-]+\.iitr\.ac\.in$/, 'Must use a valid IITR email (e.g., user@abc.iitr.ac.in)')
    .min(1, 'Email is required'),
  
  phone: z.string()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .min(1, 'Phone number is required'),
  
  enrollmentNumber: z.string()
    .regex(/^\d{8}$/, 'Enrollment number must be exactly 8 digits')
    .min(1, 'Enrollment number is required'),
  
  branch: z.enum([
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
  ], { required_error: 'Branch is required' }),
  
  year: z.enum([
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    '5th Year'
  ], { required_error: 'Year is required' }),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .min(1, 'Password is required')
  
  // ❌ REMOVED confirmPassword - this should only be validated on frontend
});


const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .regex(/^[\w.-]+@[\w.-]+\.iitr\.ac\.in$/, 'Must use a valid IITR email'),
  password: z.string().min(1, 'Password is required')
});

const otpVerificationSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .regex(/^[\w.-]+@[\w.-]+\.iitr\.ac\.in$/, 'Must use a valid IITR email'),
  otp: z.string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers')
});

const profileUpdateSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  phone: z.string().regex(/^\d{10}$/).optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string().trim()).optional(),
  interests: z.array(z.string().trim()).optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  otpVerificationSchema,
  profileUpdateSchema
};
