const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'admin', assignedGym = 'Villas del Parque' } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Por favor llena los campos requeridos');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('El usuario ya existe');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    assignedGym,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedGym: user.assignedGym,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Datos de usuario inválidos');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email);

  try {
    // Check for user email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found');
      res.status(401);
      throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (isMatch) {
      const token = generateToken(user._id);
      console.log('Token generated successfully');

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedGym: user.assignedGym,
        token,
      });
    } else {
      console.log('Invalid password');
      res.status(401);
      throw new Error('Credenciales inválidas');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(401);
    throw new Error('Error al iniciar sesión: ' + error.message);
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
