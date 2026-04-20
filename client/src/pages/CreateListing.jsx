import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MapPicker from "../components/MapPicker";
import toast from "react-hot-toast";

const AMENITIES_OPTIONS = [
  "Gas",
  "WiFi",
  "Parking",
  "Generator",
  "Lift",
  "Security",
  "CCTV",
  "Water 24/7",
  "Rooftop",
  "Garden",
];

export default function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "family",
    rent: "",
    negotiable: false,
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    floor: "",
    furnished: "unfurnished",
    address: "",
    city: "",
    locationArea: "",
    availableFrom: "",
  });

  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // ✅ lat/lng stored as numbers (or null), not empty strings
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 8);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const toggleAmenity = (a) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  // ✅ Receives numbers from MapPicker; null means cleared
  const handleLocationSelect = useCallback((newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.rent ||
      !form.address ||
      !form.city
    ) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);

    const fd = new FormData();

    // Append all text fields
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    // Append amenities as JSON string
    fd.append("amenities", JSON.stringify(amenities));

    // ✅ Only append lat/lng if they are real numbers
    if (lat !== null && lng !== null) {
      fd.append("lat", lat.toString());
      fd.append("lng", lng.toString());
    }

    // Append images
    images.forEach((img) => fd.append("images", img));

    try {
      const { data } = await api.post("/listings", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Listing posted successfully!");
      navigate(`/listings/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing");
    }

    setLoading(false);
  };

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-white";
  const labelCls = "block text-sm font-medium text-gray-600 mb-1";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Post Your Property
      </h1>
      <p className="text-gray-500 mb-8">
        Fill in the details to list your rental property
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Basic Info ─────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg">
            📝 Basic Information
          </h2>

          <div>
            <label className={labelCls}>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. Spacious 3 Bedroom Flat in Gulshan"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputCls}
              >
                {["family", "bachelor", "sublet", "office", "seat"].map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Monthly Rent (৳) *</label>
              <input
                name="rent"
                type="number"
                value={form.rent}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. 15000"
                required
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={inputCls}
              placeholder="Describe the property, neighbourhood, nearby facilities..."
              required
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="negotiable"
              checked={form.negotiable}
              onChange={handleChange}
              className="accent-emerald-600 w-4 h-4"
            />
            <span className="text-sm text-gray-600">Rent is negotiable</span>
          </label>
        </section>

        {/* ── Property Details ───────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg">
            🏠 Property Details
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Bedrooms</label>
              <select
                name="bedrooms"
                value={form.bedrooms}
                onChange={handleChange}
                className={inputCls}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Bathrooms</label>
              <select
                name="bathrooms"
                value={form.bathrooms}
                onChange={handleChange}
                className={inputCls}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Area (sqft)</label>
              <input
                name="area"
                type="number"
                value={form.area}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. 1200"
              />
            </div>
            <div>
              <label className={labelCls}>Floor</label>
              <input
                name="floor"
                value={form.floor}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. 4th"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Furnished Status</label>
              <select
                name="furnished"
                value={form.furnished}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="furnished">Furnished</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Available From</label>
              <input
                name="availableFrom"
                type="date"
                value={form.availableFrom}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>
        </section>

        {/* ── Amenities ──────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg mb-4">✨ Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_OPTIONS.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                  amenities.includes(a)
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        {/* ── Location ───────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg">📍 Location</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Address *</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className={inputCls}
                placeholder="House no, Road, Block..."
                required
              />
            </div>
            <div>
              <label className={labelCls}>City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. Dhaka"
                required
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Area / Thana</label>
            <input
              name="locationArea"
              value={form.locationArea}
              onChange={handleChange}
              className={inputCls}
              placeholder="e.g. Gulshan, Dhanmondi..."
            />
          </div>

          {/* ✅ Map Picker */}
          <div>
            <label className={labelCls}>
              Pin Location on Map
              <span className="text-gray-400 font-normal ml-1">
                (click the map to place a pin)
              </span>
            </label>
            <MapPicker
              onLocationSelect={handleLocationSelect}
              initialLat={lat}
              initialLng={lng}
            />
          </div>

          {/* ✅ Show saved coordinates so user knows it's stored */}
          {lat !== null && lng !== null && (
            <div
              style={{
                background: "#ecfdf5",
                border: "1px solid #6ee7b7",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                fontSize: "0.85rem",
                color: "#065f46",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>✅</span>
              <span>
                Location will be saved: <strong>{lat.toFixed(6)}</strong>,{" "}
                <strong>{lng.toFixed(6)}</strong>
              </span>
            </div>
          )}
        </section>

        {/* ── Photos ─────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg mb-4">
            📷 Photos (up to 8)
          </h2>
          <label className="block border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-xl p-8 text-center cursor-pointer transition">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-gray-400 text-sm">
              Click to upload or drag &amp; drop photos
            </p>
            <p className="text-gray-300 text-xs mt-1">
              JPG, PNG, WEBP — max 5 MB each
            </p>
          </label>
          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {previews.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt=""
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-70"
        >
          {loading ? "Posting…" : "🚀 Post Listing"}
        </button>
      </form>
    </div>
  );
}
