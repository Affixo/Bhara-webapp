const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllListings,
  toggleListingApproval,
  adminDeleteListing,
  getAllRequests,
} = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/admin");

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle", toggleUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/listings", getAllListings);
router.put("/listings/:id/toggle", toggleListingApproval);
router.delete("/listings/:id", adminDeleteListing);
router.get("/requests", getAllRequests);

module.exports = router;
