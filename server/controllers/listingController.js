const Listing = require('../models/Listing');

// @GET /api/listings
const getListings = async (req, res) => {
  const {
    search, type, city, area, minRent, maxRent,
    bedrooms, furnished, page = 1, limit = 12, sort = '-createdAt',
  } = req.query;

  const query = { isApproved: true, status: 'available' };

  if (search)   query.$text = { $search: search };
  if (type)     query.type = type;
  if (city)     query['location.city']  = { $regex: city,  $options: 'i' };
  if (area)     query['location.area']  = { $regex: area,  $options: 'i' };
  if (bedrooms) query.bedrooms = Number(bedrooms);
  if (furnished) query.furnished = furnished;
  if (minRent || maxRent) {
    query.rent = {};
    if (minRent) query.rent.$gte = Number(minRent);
    if (maxRent) query.rent.$lte = Number(maxRent);
  }

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Listing.countDocuments(query);
  const listings = await Listing.find(query)
    .populate('owner', 'name phone avatar')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  res.json({ listings, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

// @GET /api/listings/:id
const getListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate('owner', 'name phone email avatar');
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  listing.views += 1;
  await listing.save();
  res.json(listing);
};

// @POST /api/listings
const createListing = async (req, res) => {
  const {
    title, description, type, rent, negotiable,
    bedrooms, bathrooms, area, floor, furnished,
    amenities, address, city, locationArea,
    lat, lng, availableFrom,
  } = req.body;

  // ✅ Cloudinary returns the full https:// URL in f.path
  const images = req.files ? req.files.map((f) => f.path) : [];

  let parsedLat = null;
  let parsedLng = null;
  if (lat !== undefined && lat !== null && lat !== '' && lat !== 'null') {
    const n = parseFloat(lat);
    if (!isNaN(n)) parsedLat = n;
  }
  if (lng !== undefined && lng !== null && lng !== '' && lng !== 'null') {
    const n = parseFloat(lng);
    if (!isNaN(n)) parsedLng = n;
  }

  const listing = await Listing.create({
    owner:       req.user._id,
    title,
    description,
    type,
    rent:        Number(rent),
    negotiable:  negotiable === 'true' || negotiable === true,
    bedrooms:    Number(bedrooms) || 1,
    bathrooms:   Number(bathrooms) || 1,
    area:        area ? Number(area) : undefined,
    floor,
    furnished,
    amenities:   amenities ? JSON.parse(amenities) : [],
    images,
    location: {
      address,
      city,
      area:  locationArea || '',
      lat:   parsedLat,
      lng:   parsedLng,
    },
    availableFrom: availableFrom || undefined,
  });

  res.status(201).json(listing);
};

// @PUT /api/listings/:id
const updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  if (
    listing.owner.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const fields = [
    'title', 'description', 'type', 'rent', 'negotiable',
    'bedrooms', 'bathrooms', 'floor', 'furnished', 'availableFrom', 'status',
  ];
  fields.forEach((f) => { if (req.body[f] !== undefined) listing[f] = req.body[f]; });

  if (req.body.address)      listing.location.address = req.body.address;
  if (req.body.city)         listing.location.city    = req.body.city;
  if (req.body.locationArea) listing.location.area    = req.body.locationArea;

  if (req.body.lat !== undefined && req.body.lat !== null && req.body.lat !== '' && req.body.lat !== 'null') {
    const n = parseFloat(req.body.lat);
    if (!isNaN(n)) listing.location.lat = n;
  }
  if (req.body.lng !== undefined && req.body.lng !== null && req.body.lng !== '' && req.body.lng !== 'null') {
    const n = parseFloat(req.body.lng);
    if (!isNaN(n)) listing.location.lng = n;
  }

  if (req.body.amenities) listing.amenities = JSON.parse(req.body.amenities);

  // ✅ Cloudinary: new uploads return full https:// URLs via f.path
  if (req.files && req.files.length > 0) {
    listing.images = [...listing.images, ...req.files.map((f) => f.path)];
  }

  listing.markModified('location');
  await listing.save();
  res.json(listing);
};

// @DELETE /api/listings/:id
const deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  if (
    listing.owner.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await listing.deleteOne();
  res.json({ message: 'Listing removed' });
};

// @GET /api/listings/my
const getMyListings = async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id }).sort('-createdAt');
  res.json(listings);
};

module.exports = {
  getListings, getListing, createListing,
  updateListing, deleteListing, getMyListings,
};