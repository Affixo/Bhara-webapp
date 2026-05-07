const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/listings", require("./routes/listings"));
app.use("/api/requests", require("./routes/requests"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/conversations", require("./routes/conversations")); // ✅ NEW

// ✅ DELETE a specific image from a listing
// DELETE /api/listings/:id/images  body: { imageUrl }
const { protect } = require("./middleware/auth");
const Listing = require("./models/Listing");

app.delete("/api/listings/:id/images", protect, async (req, res) => {
  const { imageUrl } = req.body; // e.g. "/uploads/abc123.jpg"
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  if (
    listing.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Remove from array
  listing.images = listing.images.filter((img) => img !== imageUrl);
  listing.markModified("images");
  await listing.save();

  // Delete physical file
  const filePath = path.join(__dirname, imageUrl);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  res.json({ message: "Image removed", images: listing.images });
});

app.get("/", (req, res) => res.send("Bhara API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
