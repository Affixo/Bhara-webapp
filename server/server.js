const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');
const cloudinary = require('cloudinary').v2;
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Configure Cloudinary globally
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/listings',      require('./routes/listings'));
app.use('/api/requests',      require('./routes/requests'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/conversations', require('./routes/conversations'));

// ✅ Delete a specific image from a listing (Cloudinary version)
const { protect } = require('./middleware/auth');
const Listing     = require('./models/Listing');

app.delete('/api/listings/:id/images', protect, async (req, res) => {
  const { imageUrl } = req.body; // full Cloudinary https:// URL

  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  if (
    listing.owner.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Remove from the images array in DB
  listing.images = listing.images.filter((img) => img !== imageUrl);
  listing.markModified('images');
  await listing.save();

  // ✅ Delete from Cloudinary using the public_id
  try {
    // Cloudinary URL format: https://res.cloudinary.com/<cloud>/image/upload/v123/<folder>/<public_id>.<ext>
    const urlParts  = imageUrl.split('/');
    const fileName  = urlParts[urlParts.length - 1].split('.')[0]; // e.g. "abc123xyz"
    const folder    = urlParts[urlParts.length - 2];               // e.g. "bhara"
    const publicId  = `${folder}/${fileName}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.log('Cloudinary delete error (non-fatal):', e.message);
  }

  res.json({ message: 'Image removed', images: listing.images });
});

app.get('/', (req, res) => res.send('Bhara API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));