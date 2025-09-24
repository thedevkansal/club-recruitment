const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    // Extract token from header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is deactivated.'
      });
    }

    // Add user to request object
    req.user = user;
    next();
    
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token.'
    });
  }
};

const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      status: 'error',
      message: 'Please verify your email before accessing this resource.'
    });
  }
  next();
};

module.exports = {
  authenticate,
  requireEmailVerification
};
