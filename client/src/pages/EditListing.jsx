import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import MapPicker from "../components/MapPicker";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

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

export default function EditListing() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [amenities, setAmenities] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    api.get(`/listings/${id}`).then(({ data }) => {
      if (data.owner._id !== user?._id && user?.role !== "admin") {
        toast.error("Not authorized");
        navigate("/");
        return;
      }
      setForm({
        title: data.title,
        description: data.description,
        type: data.type,
        rent: data.rent,
        negotiable: data.negotiable,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area || "",
        floor: data.floor || "",
        furnished: data.furnished,
        address: data.location.address,
        city: data.location.city,
        locationArea: data.location.area || "",
        availableFrom: data.availableFrom
          ? data.availableFrom.slice(0, 10)
          : "",
        status: data.status,
      });
      setAmenities(data.amenities || []);
      setLat(data.location?.lat || "");
      setLng(data.location?.lng || "");
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleAmenity = (a) =>
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  const handleLocationSelect = useCallback((lat, lng) => {
    setLat(lat);
    setLng(lng);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("amenities", JSON.stringify(amenities));
    if (lat) fd.append("lat", lat);
    if (lng) fd.append("lng", lng);
    newImages.forEach((img) => fd.append("images", img));

    try {
      await api.put(`/listings/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Listing updated!");
      navigate(`/listings/${id}`);
    } catch {
      toast.error("Update failed");
    }
    setSaving(false);
  };

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm";
  const labelCls = "block text-sm font-medium text-gray-600 mb-1";

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg">Basic Information</h2>
          <div>
            <label className={labelCls}>Title</label>
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className={inputCls}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputCls}
              >
                {["family", "bachelor", "sublet", "office", "seat"].map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Rent (৳)</label>
              <input
                name="rent"
                type="number"
                value={form.rent || ""}
                onChange={handleChange}
                className={inputCls}
                required
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={4}
              className={inputCls}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Furnished</label>
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
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg mb-4">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_OPTIONS.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${amenities.includes(a) ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg">Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Address</label>
              <input
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input
                name="city"
                value={form.city || ""}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Update Map Location</label>
            <MapPicker
              onLocationSelect={handleLocationSelect}
              initialLat={lat}
              initialLng={lng}
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg mb-4">
            Add More Photos
          </h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewImages(Array.from(e.target.files))}
            className="text-sm text-gray-500"
          />
        </section>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-70"
        >
          {saving ? "Saving..." : "💾 Save Changes"}
        </button>
      </form>
    </div>
  );
}
