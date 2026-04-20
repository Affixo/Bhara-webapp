const express = require("express");
const router = express.Router();
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
} = require("../controllers/listingController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getListings);
router.get("/my", protect, getMyListings);
router.get("/:id", getListing);
router.post("/", protect, upload.array("images", 8), createListing);
router.put("/:id", protect, upload.array("images", 8), updateListing);
router.delete("/:id", protect, deleteListing);

module.exports = router;
