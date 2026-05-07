const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  try {
    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get User
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    });
  }
};

// Role Authorization Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};