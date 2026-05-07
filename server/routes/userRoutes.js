const express = require('express');

const {
  getAllUsers,
  getTeammates,
  getUserStats,
  updateUserRole,
  deleteUser,
} = require('../controllers/userController');

const {
  protect,
  authorize,
} = require('../middleware/authMiddleware');

const router = express.Router();

/*
========================================
Protected Routes
========================================
*/

// All routes require login
router.use(protect);

/*
========================================
Member Routes
========================================
*/

// Get teammates
router.get(
  '/teammates',
  getTeammates
);

/*
========================================
Admin Routes
========================================
*/

// Get all users
router.get(
  '/',
  authorize('admin'),
  getAllUsers
);

// Get user stats
router.get(
  '/:id/stats',
  authorize('admin'),
  getUserStats
);

// Update role
router.put(
  '/:id/role',
  authorize('admin'),
  updateUserRole
);

// Delete user
router.delete(
  '/:id',
  authorize('admin'),
  deleteUser
);

module.exports = router;