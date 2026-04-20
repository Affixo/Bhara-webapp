// routes/requests.js
const express = require("express");
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequest,
} = require("../controllers/requestController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createRequest);
router.get("/my", protect, getMyRequests);
router.get("/received", protect, getReceivedRequests);
router.put("/:id", protect, updateRequest);

module.exports = router;
