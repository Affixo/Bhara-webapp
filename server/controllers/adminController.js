const User = require("../models/User");
const Listing = require("../models/Listing");
const RentRequest = require("../models/RentRequest");

const getDashboardStats = async (req, res) => {
  const [totalUsers, totalListings, totalRequests, availableListings] =
    await Promise.all([
      User.countDocuments({ role: "user" }),
      Listing.countDocuments(),
      RentRequest.countDocuments(),
      Listing.countDocuments({ status: "available" }),
    ]);
  res.json({ totalUsers, totalListings, totalRequests, availableListings });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" })
    .select("-password")
    .sort("-createdAt");
  res.json(users);
};

const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isActive = !user.isActive;
  await user.save();
  res.json({
    message: `User ${user.isActive ? "activated" : "deactivated"}`,
    isActive: user.isActive,
  });
};

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

const getAllListings = async (req, res) => {
  const listings = await Listing.find()
    .populate("owner", "name email")
    .sort("-createdAt");
  res.json(listings);
};

const toggleListingApproval = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  listing.isApproved = !listing.isApproved;
  await listing.save();
  res.json({
    message: `Listing ${listing.isApproved ? "approved" : "unapproved"}`,
    isApproved: listing.isApproved,
  });
};

const adminDeleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ message: "Listing deleted" });
};

const getAllRequests = async (req, res) => {
  const requests = await RentRequest.find()
    .populate("listing", "title rent location")
    .populate("requester", "name email")
    .populate("owner", "name email")
    .sort("-createdAt");
  res.json(requests);
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllListings,
  toggleListingApproval,
  adminDeleteListing,
  getAllRequests,
};
