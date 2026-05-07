const express = require('express');

const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/authController');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

router.get('/me', protect, getMe);

module.exports = router;