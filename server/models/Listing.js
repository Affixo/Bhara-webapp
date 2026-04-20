const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["family", "bachelor", "sublet", "office", "seat"],
      required: true,
    },
    rent: { type: Number, required: true },
    negotiable: { type: Boolean, default: false },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    area: { type: Number }, // sq ft
    floor: { type: String },
    furnished: {
      type: String,
      enum: ["furnished", "semi-furnished", "unfurnished"],
      default: "unfurnished",
    },
    amenities: [{ type: String }], // ['gas', 'wifi', 'parking', 'generator']
    images: [{ type: String }],
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String },
      lat: { type: Number },
      lng: { type: Number },
    },
    availableFrom: { type: Date },
    status: {
      type: String,
      enum: ["available", "rented", "pending"],
      default: "available",
    },
    isApproved: { type: Boolean, default: true }, // admin can toggle
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Text index for search
listingSchema.index({
  title: "text",
  description: "text",
  "location.address": "text",
  "location.city": "text",
  "location.area": "text",
});

module.exports = mongoose.model("Listing", listingSchema);
