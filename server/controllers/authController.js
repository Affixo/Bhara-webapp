const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// @POST /api/auth/register
const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password)
    return res.status(400).json({ message: "All fields are required" });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ message: "Email already registered" });

  const user = await User.create({ name, email, phone, password });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id),
  });
};

// @POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid email or password" });
  if (!user.isActive)
    return res.status(403).json({ message: "Account has been deactivated" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

// @PUT /api/auth/profile
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  if (req.file) user.avatar = `/uploads/${req.file.filename}`;
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
    role: updated.role,
    avatar: updated.avatar,
    token: generateToken(updated._id),
  });
};

module.exports = { register, login, getMe, updateProfile };
