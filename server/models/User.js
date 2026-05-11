const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Name is required'],
    trim:     true,
    minlength: [2, 'Name must be at least 2 characters'],
  },

  email: {
    type:     String,
    required: [true, 'Email is required'],
    unique:   true,
    lowercase: true,
    trim:     true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address',
    ],
  },

  phone: {
    type:     String,
    required: [true, 'Phone number is required'],
    unique:   true,           // ✅ no duplicate phone numbers
    trim:     true,
    match: [
      /^\d{11}$/,             // ✅ exactly 11 digits, numbers only
      'Phone number must be exactly 11 digits (numbers only)',
    ],
  },

  password: {
    type:      String,
    required:  [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },

  avatar:   { type: String,  default: '' },
  role:     { type: String,  enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },

}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);