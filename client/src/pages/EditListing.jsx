import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import MapPicker from '../components/MapPicker';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const AMENITIES_OPTIONS = [
  'Gas', 'WiFi', 'Parking', 'Generator', 'Lift',
  'Security', 'CCTV', 'Water 24/7', 'Rooftop', 'Garden',
];

const BASE = 'http://localhost:5000';

export default function EditListing() {
  const { id }     = useParams();
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  const [form, setForm]         = useState({});
  const [amenities, setAmenities] = useState([]);
  const [lat, setLat]           = useState(null);
  const [lng, setLng]           = useState(null);

  // Existing images (URLs already on server)
  const [existingImages, setExistingImages] = useState([]);
  // New images picked by user (File objects)
  const [newImageFiles, setNewImageFiles]   = useState([]);
  const [newPreviews, setNewPreviews]       = useState([]);

  // Images being deleted (optimistic)
  const [deletingUrl, setDeletingUrl] = useState(null);

  useEffect(() => {
    api.get(`/listings/${id}`).then(({ data }) => {
      if (data.owner._id !== user?._id && user?.role !== 'admin') {
        toast.error('Not authorized');
        navigate('/');
        return;
      }
      setForm({
        title:        data.title,
        description:  data.description,
        type:         data.type,
        rent:         data.rent,
        negotiable:   data.negotiable,
        bedrooms:     data.bedrooms,
        bathrooms:    data.bathrooms,
        area:         data.area || '',
        floor:        data.floor || '',
        furnished:    data.furnished,
        address:      data.location.address,
        city:         data.location.city,
        locationArea: data.location.area || '',
        availableFrom: data.availableFrom ? data.availableFrom.slice(0, 10) : '',
        status:       data.status,
      });
      setAmenities(data.amenities || []);
      setLat(data.location?.lat ?? null);
      setLng(data.location?.lng ?? null);
      setExistingImages(data.images || []);
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleAmenity = (a) =>
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const handleLocationSelect = useCallback((newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
  }, []);

  // ✅ Delete an existing image from server
  const handleDeleteImage = async (imageUrl) => {
    if (!window.confirm('Remove this photo?')) return;
    setDeletingUrl(imageUrl);
    try {
      await api.delete(`/listings/${id}/images`, { data: { imageUrl } });
      setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
      toast.success('Photo removed');
    } catch {
      toast.error('Failed to remove photo');
    }
    setDeletingUrl(null);
  };

  // ✅ Handle new image file picks
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 8 - existingImages.length);
    setNewImageFiles(files);
    setNewPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // Remove a newly picked (not yet uploaded) image
  const removeNewPreview = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('amenities', JSON.stringify(amenities));
    if (lat !== null && lng !== null) {
      fd.append('lat', lat.toString());
      fd.append('lng', lng.toString());
    }
    newImageFiles.forEach((img) => fd.append('images', img));

    try {
      await api.put(`/listings/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Listing updated!');
      navigate(`/listings/${id}`);
    } catch {
      toast.error('Update failed');
    }
    setSaving(false);
  };

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-white';
  const labelCls = 'block text-sm font-medium text-gray-600 mb-1';

  if (loading) return <div className="spinner-page"><div className="spinner" /></div>;

  const totalPhotos = existingImages.length + newImageFiles.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Listing</h1>
      <p className="text-gray-500 mb-8">Update your rental property details</p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic Info ──────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg">📝 Basic Information</h2>

          <div>
            <label className={labelCls}>Title</label>
            <input name="title" value={form.title || ''} onChange={handleChange} className={inputCls} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type</label>
              <select name="type" value={form.type || 'family'} onChange={handleChange} className={inputCls}>
                {['family','bachelor','sublet','office','seat'].map((t) => (
                  <option key={t} value={t} className="capitalize">{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Monthly Rent (৳)</label>
              <input name="rent" type="number" value={form.rent || ''} onChange={handleChange} className={inputCls} required />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea name="description" value={form.description || ''} onChange={handleChange} rows={4} className={inputCls} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={form.status || 'available'} onChange={handleChange} className={inputCls}>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Furnished</label>
              <select name="furnished" value={form.furnished || 'unfurnished'} onChange={handleChange} className={inputCls}>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="furnished">Furnished</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="negotiable" checked={!!form.negotiable} onChange={handleChange} className="accent-emerald-600 w-4 h-4" />
            <span className="text-sm text-gray-600">Rent is negotiable</span>
          </label>
        </section>

        {/* ── Property Details ────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg">🏠 Property Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[['bedrooms','Bedrooms',[1,2,3,4,5,6]],['bathrooms','Bathrooms',[1,2,3,4]]].map(([name, label, opts]) => (
              <div key={name}>
                <label className={labelCls}>{label}</label>
                <select name={name} value={form[name] || 1} onChange={handleChange} className={inputCls}>
                  {opts.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className={labelCls}>Area (sqft)</label>
              <input name="area" type="number" value={form.area || ''} onChange={handleChange} className={inputCls} placeholder="e.g. 1200" />
            </div>
            <div>
              <label className={labelCls}>Floor</label>
              <input name="floor" value={form.floor || ''} onChange={handleChange} className={inputCls} placeholder="e.g. 3rd" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Available From</label>
            <input name="availableFrom" type="date" value={form.availableFrom || ''} onChange={handleChange} className={inputCls} style={{ maxWidth: '14rem' }} />
          </div>
        </section>

        {/* ── Amenities ───────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg mb-4">✨ Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_OPTIONS.map((a) => (
              <button type="button" key={a} onClick={() => toggleAmenity(a)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                  amenities.includes(a)
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        {/* ── Location ────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-gray-700 text-lg">📍 Location</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Address</label>
              <input name="address" value={form.address || ''} onChange={handleChange} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input name="city" value={form.city || ''} onChange={handleChange} className={inputCls} required />
            </div>
          </div>
          <div>
            <label className={labelCls}>Area / Thana</label>
            <input name="locationArea" value={form.locationArea || ''} onChange={handleChange} className={inputCls} placeholder="e.g. Gulshan" />
          </div>
          <div>
            <label className={labelCls}>
              Update Map Pin
              <span className="text-gray-400 font-normal ml-1">
                {lat !== null ? `(current: ${lat.toFixed(5)}, ${lng.toFixed(5)})` : '(not set — click map to pin)'}
              </span>
            </label>
            <MapPicker onLocationSelect={handleLocationSelect} initialLat={lat} initialLng={lng} />
          </div>
        </section>

        {/* ── Photos ──────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="font-bold text-gray-700 text-lg">📷 Photos</h2>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{totalPhotos} / 8 photos</span>
          </div>

          {/* ✅ Existing photos with delete button */}
          {existingImages.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.5rem' }}>Current Photos</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
                {existingImages.map((img) => (
                  <div key={img} style={{ position: 'relative', borderRadius: '0.6rem', overflow: 'hidden', border: '1.5px solid #e5e7eb' }}>
                    <img
                      src={`${BASE}${img}`}
                      alt=""
                      style={{ width: '100%', height: '5.5rem', objectFit: 'cover', display: 'block' }}
                    />
                    {/* ✅ Delete button overlay */}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img)}
                      disabled={deletingUrl === img}
                      style={{
                        position: 'absolute', top: '0.25rem', right: '0.25rem',
                        background: deletingUrl === img ? '#9ca3af' : '#dc2626',
                        border: 'none', color: '#fff', borderRadius: '9999px',
                        width: '1.6rem', height: '1.6rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', transition: 'background 0.2s',
                      }}
                      title="Remove photo"
                    >
                      {deletingUrl === img ? '…' : <FiTrash2 />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Add new photos */}
          {totalPhotos < 8 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.5rem' }}>Add New Photos</p>
              <label style={{ display: 'block', border: '2px dashed #d1d5db', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#059669')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
              >
                <input type="file" accept="image/*" multiple onChange={handleNewImages} className="hidden" />
                <FiPlus style={{ fontSize: '1.5rem', color: '#9ca3af', margin: '0 auto 0.4rem' }} />
                <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Click to add photos ({8 - existingImages.length} remaining)</p>
              </label>

              {/* New image previews */}
              {newPreviews.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginTop: '0.6rem' }}>
                  {newPreviews.map((p, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: '0.6rem', overflow: 'hidden', border: '1.5px solid #6ee7b7' }}>
                      <img src={p} alt="" style={{ width: '100%', height: '5.5rem', objectFit: 'cover', display: 'block' }} />
                      <button
                        type="button"
                        onClick={() => removeNewPreview(i)}
                        style={{
                          position: 'absolute', top: '0.25rem', right: '0.25rem',
                          background: '#dc2626', border: 'none', color: '#fff',
                          borderRadius: '9999px', width: '1.6rem', height: '1.6rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '0.8rem',
                        }}
                      >
                        <FiTrash2 />
                      </button>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#059669', color: '#fff', fontSize: '0.65rem', padding: '0.15rem 0.3rem', textAlign: 'center' }}>
                        New
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {existingImages.length === 0 && newImageFiles.length === 0 && (
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center', padding: '1rem' }}>
              No photos yet — add some above!
            </p>
          )}
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-70"
        >
          {saving ? 'Saving…' : '💾 Save Changes'}
        </button>
      </form>
    </div>
  );
}