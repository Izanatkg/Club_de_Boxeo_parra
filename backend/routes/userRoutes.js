const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Quitar protect del registro para poder crear el primer usuario
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.get('/all', protect, getAllUsers);

module.exports = router;
