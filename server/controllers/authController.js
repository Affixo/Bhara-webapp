const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const parseError = (err) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    if (field === 'email') return 'This email is already registered. Please login or use a different email.';
    if (field === 'phone') return 'This phone number is already linked to another account. Please use a different number.';
    return 'A duplicate value was found. Please check your details.';
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return messages[0];
  }
  return err.message || 'Something went wrong. Please try again.';
};

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!/^\d{11}$/.test(phone)) {
    return res.status(400).json({ message: 'Phone number must be exactly 11 digits and contain numbers only (e.g. 01XXXXXXXXX)' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const user = await User.create({ name, email: email.toLowerCase().trim(), phone, password });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      phone: user.phone, role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ message: parseError(err) });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'No account found with this email address' });
    if (!user.isActive) return res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    res.json({
      _id: user._id, name: user.name, email: user.email,
      phone: user.phone, role: user.role, avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (req.body.phone && !/^\d{11}$/.test(req.body.phone)) {
    return res.status(400).json({ message: 'Phone number must be exactly 11 digits and contain numbers only' });
  }
  user.name  = req.body.name  || user.name;
  user.phone = req.body.phone || user.phone;
  if (req.file) user.avatar = req.file.path;
  if (req.body.password) {
    if (req.body.password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    user.password = req.body.password;
  }
  try {
    const updated = await user.save();
    res.json({
      _id: updated._id, name: updated.name, email: updated.email,
      phone: updated.phone, role: updated.role, avatar: updated.avatar,
      token: generateToken(updated._id),
    });
  } catch (err) {
    res.status(400).json({ message: parseError(err) });
  }
};

module.exports = { register, login, getMe, updateProfile };