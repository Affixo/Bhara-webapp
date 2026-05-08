import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MapPicker from '../components/MapPicker';
import toast from 'react-hot-toast';
import { FiTrash2, FiUpload, FiAlertCircle } from 'react-icons/fi';

const AMENITIES_OPTIONS = [
  'Gas', 'WiFi', 'Parking', 'Generator', 'Lift',
  'Security', 'CCTV', 'Water 24/7', 'Rooftop', 'Garden',
];

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_IMAGES = 8;

export default function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', type: 'family', rent: '',
    negotiable: false, bedrooms: 1, bathrooms: 1, area: '',
    floor: '', furnished: 'unfurnished', address: '', city: '',
    locationArea: '', availableFrom: '',
  });

  const [amenities, setAmenities]   = useState([]);
  const [lat, setLat]               = useState(null);
  const [lng, setLng]               = useState(null);

  // Each entry: { file: File, preview: string, error: string|null }
  const [selectedImages, setSelectedImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleAmenity = (a) =>
    setAmenities((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]);

  const handleLocationSelect = useCallback((newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
  }, []);

  // ✅ Pick images — validates size immediately, shows per-file errors
  const handleImageChange = (e) => {
    const picked = Array.from(e.target.files);
    const remaining = MAX_IMAGES - selectedImages.filter((i) => !i.error).length;

    if (picked.length > remaining) {
      toast.error(`You can only add ${remaining} more photo(s). Max ${MAX_IMAGES} total.`);
    }

    const entries = picked.slice(0, remaining).map((file) => {
      const tooBig = file.size > MAX_FILE_SIZE_BYTES;
      return {
        file,
        preview: URL.createObjectURL(file),
        error: tooBig
          ? `Too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is ${MAX_FILE_SIZE_MB} MB.`
          : null,
      };
    });

    setSelectedImages((prev) => [...prev, ...entries]);
    // reset input so same files can be re-picked after removal
    e.target.value = '';
  };

  // ✅ Remove a selected image before posting
  const removeImage = (index) => {
    setSelectedImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview); // free memory
      updated.splice(index, 1);
      return updated;
    });
  };

  const validImages   = selectedImages.filter((i) => !i.error);
  const invalidImages = selectedImages.filter((i) => i.error);
  const hasErrors     = invalidImages.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.rent || !form.address || !form.city) {
      return toast.error('Please fill all required fields');
    }

    if (hasErrors) {
      return toast.error(`Remove the ${invalidImages.length} oversized photo(s) before posting.`);
    }

    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('amenities', JSON.stringify(amenities));
    if (lat !== null && lng !== null) {
      fd.append('lat', lat.toString());
      fd.append('lng', lng.toString());
    }
    validImages.forEach((img) => fd.append('images', img.file));

    try {
      const { data } = await api.post('/listings', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Listing posted successfully!');
      navigate(`/listings/${data._id}`);
    } catch (err) {
      const msg = err.response?.data?.message;
      // ✅ Clear, specific error messages
      if (err.response?.status === 413 || msg?.toLowerCase().includes('size')) {
        toast.error('One or more photos are too large. Please use images under 5 MB.');
      } else if (err.response?.status === 401) {
        toast.error('Session expired — please log in again.');
      } else {
        toast.error(msg || 'Failed to post listing. Please try again.');
      }
    }

    setLoading(false);
  };

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-white';
  const labelCls = 'block text-sm font-medium text-gray-600 mb-1';

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Post Your Property</h1>
      <p className="text-gray-500 mb-8">Fill in the details to list your rental property</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Basic Info ──────────────────────────────────── */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 className="font-bold text-gray-700 text-lg">📝 Basic Information</h2>

          <div>
            <label className={labelCls}>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} className={inputCls}
              placeholder="e.g. Spacious 3 Bedroom Flat in Gulshan" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type *</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputCls}>
                {['family','bachelor','sublet','office','seat'].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Monthly Rent (৳) *</label>
              <input name="rent" type="number" value={form.rent} onChange={handleChange}
                className={inputCls} placeholder="e.g. 15000" required />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={4} className={inputCls}
              placeholder="Describe the property, neighbourhood, nearby facilities..." required />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="negotiable" checked={form.negotiable}
              onChange={handleChange} className="accent-emerald-600 w-4 h-4" />
            <span className="text-sm text-gray-600">Rent is negotiable</span>
          </label>
        </section>

        {/* ── Property Details ────────────────────────────── */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 className="font-bold text-gray-700 text-lg">🏠 Property Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Bedrooms</label>
              <select name="bedrooms" value={form.bedrooms} onChange={handleChange} className={inputCls}>
                {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Bathrooms</label>
              <select name="bathrooms" value={form.bathrooms} onChange={handleChange} className={inputCls}>
                {[1,2,3,4].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Area (sqft)</label>
              <input name="area" type="number" value={form.area} onChange={handleChange}
                className={inputCls} placeholder="e.g. 1200" />
            </div>
            <div>
              <label className={labelCls}>Floor</label>
              <input name="floor" value={form.floor} onChange={handleChange}
                className={inputCls} placeholder="e.g. 4th" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Furnished Status</label>
              <select name="furnished" value={form.furnished} onChange={handleChange} className={inputCls}>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="furnished">Furnished</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Available From</label>
              <input name="availableFrom" type="date" value={form.availableFrom}
                onChange={handleChange} className={inputCls} />
            </div>
          </div>
        </section>

        {/* ── Amenities ───────────────────────────────────── */}
        <section className="card">
          <h2 className="font-bold text-gray-700 text-lg mb-4">✨ Amenities</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {AMENITIES_OPTIONS.map((a) => (
              <button type="button" key={a} onClick={() => toggleAmenity(a)}
                className={`amenity-btn ${amenities.includes(a) ? 'selected' : ''}`}>
                {a}
              </button>
            ))}
          </div>
        </section>

        {/* ── Location ────────────────────────────────────── */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 className="font-bold text-gray-700 text-lg">📍 Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Address *</label>
              <input name="address" value={form.address} onChange={handleChange}
                className={inputCls} placeholder="House, Road, Block..." required />
            </div>
            <div>
              <label className={labelCls}>City *</label>
              <input name="city" value={form.city} onChange={handleChange}
                className={inputCls} placeholder="e.g. Dhaka" required />
            </div>
          </div>
          <div>
            <label className={labelCls}>Area / Thana</label>
            <input name="locationArea" value={form.locationArea} onChange={handleChange}
              className={inputCls} placeholder="e.g. Gulshan, Dhanmondi..." />
          </div>
          <div>
            <label className={labelCls}>
              Pin Location on Map
              <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: '0.4rem', fontSize: '0.8rem' }}>
                (click the map to drop a pin)
              </span>
            </label>
            <MapPicker onLocationSelect={handleLocationSelect} initialLat={lat} initialLng={lng} />
          </div>
          {lat !== null && lng !== null && (
            <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '0.75rem', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#065f46', display: 'flex', gap: '0.4rem' }}>
              ✅ Location saved: <strong>{lat.toFixed(5)}, {lng.toFixed(5)}</strong>
            </div>
          )}
        </section>

        {/* ── Photos ──────────────────────────────────────── */}
        <section className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 className="font-bold text-gray-700 text-lg">📷 Photos</h2>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              {validImages.length} / {MAX_IMAGES} selected
            </span>
          </div>

          {/* ✅ Size rule reminder */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.6rem', padding: '0.5rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#1d4ed8' }}>
            <FiAlertCircle style={{ flexShrink: 0 }} />
            Each photo must be under <strong>5 MB</strong>. Supported formats: JPG, PNG, WEBP.
          </div>

          {/* Upload zone */}
          {selectedImages.length < MAX_IMAGES && (
            <label className="upload-zone" style={{ display: 'block' }}>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                onChange={handleImageChange} style={{ display: 'none' }} />
              <FiUpload style={{ fontSize: '1.75rem', color: '#9ca3af', display: 'block', margin: '0 auto 0.4rem' }} />
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Click to select photos ({MAX_IMAGES - selectedImages.length} slots remaining)
              </p>
            </label>
          )}

          {/* ✅ Preview grid with remove button on each image */}
          {selectedImages.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))', gap: '0.6rem', marginTop: '0.75rem' }}>
              {selectedImages.map((item, i) => (
                <div key={i} style={{ position: 'relative', borderRadius: '0.6rem', overflow: 'hidden', border: `2px solid ${item.error ? '#fca5a5' : '#d1fae5'}` }}>
                  <img src={item.preview} alt=""
                    style={{ width: '100%', height: '6rem', objectFit: 'cover', display: 'block',
                      filter: item.error ? 'brightness(0.6)' : 'none' }} />

                  {/* ✅ Remove button */}
                  <button type="button" onClick={() => removeImage(i)}
                    style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', background: '#dc2626', border: 'none', color: '#fff', borderRadius: '9999px', width: '1.5rem', height: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    title="Remove photo">
                    <FiTrash2 />
                  </button>

                  {/* ✅ Error badge for oversized files */}
                  {item.error && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#dc2626', color: '#fff', fontSize: '0.6rem', padding: '0.2rem 0.3rem', textAlign: 'center', fontWeight: '600' }}>
                      Too large — remove
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ✅ Oversized file error summary */}
          {hasErrors && (
            <div style={{ marginTop: '0.75rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.6rem', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#dc2626' }}>
              <strong>⚠️ {invalidImages.length} photo(s) are too large and must be removed:</strong>
              <ul style={{ marginTop: '0.3rem', paddingLeft: '1rem' }}>
                {invalidImages.map((img, i) => (
                  <li key={i}>{img.file.name} — {img.error}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <button type="submit" disabled={loading || hasErrors}
          style={{ width: '100%', background: loading || hasErrors ? '#9ca3af' : '#059669', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '1rem', fontWeight: '700', fontSize: '1rem', cursor: loading || hasErrors ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}>
          {loading ? '⏳ Posting…' : hasErrors ? '⚠️ Fix oversized photos first' : '🚀 Post Listing'}
        </button>
      </form>
    </div>
  );
}