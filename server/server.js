const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const cloudinary = require('cloudinary').v2;
const connectDB  = require('./config/db');

dotenv.config();
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allowed origins: your Vercel URL + localhost for development
const allowedOrigins = [
  'https://bhara-webapp.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const isAllowedVercelPreview = (origin) => {
  try {
    const { hostname } = new URL(origin);
    return hostname.startsWith('bhara-webapp') && hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || isAllowedVercelPreview(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests for ALL routes
app.options('*', cors(corsOptions));

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/listings',      require('./routes/listings'));
app.use('/api/requests',      require('./routes/requests'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/conversations', require('./routes/conversations'));

// ── Delete image from Cloudinary ──────────────────────────────────────────────
const { protect } = require('./middleware/auth');
const Listing     = require('./models/Listing');

app.delete('/api/listings/:id/images', protect, async (req, res) => {
  const { imageUrl } = req.body;
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  if (
    listing.owner.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  listing.images = listing.images.filter((img) => img !== imageUrl);
  listing.markModified('images');
  await listing.save();

  try {
    const parts    = imageUrl.split('/');
    const fileName = parts[parts.length - 1].split('.')[0];
    const folder   = parts[parts.length - 2];
    await cloudinary.uploader.destroy(`${folder}/${fileName}`);
  } catch (e) {
    console.log('Cloudinary delete error (non-fatal):', e.message);
  }

  res.json({ message: 'Image removed', images: listing.images });
});

app.get('/', (req, res) => res.send('Bhara API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
