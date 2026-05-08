import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { imgUrl } from '../api/axios';
import MapPicker from '../components/MapPicker';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiUpload, FiAlertCircle } from 'react-icons/fi';

const AMENITIES_OPTIONS = [
  'Gas', 'WiFi', 'Parking', 'Generator', 'Lift',
  'Security', 'CCTV', 'Water 24/7', 'Rooftop', 'Garden',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 8;

export default function EditListing() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [form, setForm]                   = useState({});
  const [amenities, setAmenities]         = useState([]);
  const [lat, setLat]                     = useState(null);
  const [lng, setLng]                     = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages]         = useState([]); // { file, preview, error }
  const [deletingUrl, setDeletingUrl]     = useState(null);

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
    }).catch(() => {
      toast.error('Failed to load listing');
      navigate('/profile');
    });
  }, [id]);

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

  // ✅ Delete an existing Cloudinary image
  const handleDeleteExisting = async (imageUrl) => {
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

  // ✅ Pick new images with size validation
  const handleNewImages = (e) => {
    const picked = Array.from(e.target.files);
    const remaining = MAX_IMAGES - existingImages.length - newImages.length;
    const entries = picked.slice(0, remaining).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      error: file.size > MAX_FILE_SIZE_BYTES
        ? `Too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 5 MB.`
        : null,
    }));
    setNewImages((prev) => [...prev, ...entries]);
    e.target.value = '';
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const validNewImages = newImages.filter((i) => !i.error);
  const hasErrors      = newImages.some((i) => i.error);
  const totalPhotos    = existingImages.length + newImages.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasErrors) return toast.error('Remove oversized photos before saving.');
    setSaving(true);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('amenities', JSON.stringify(amenities));
    if (lat !== null && lng !== null) {
      fd.append('lat', lat.toString());
      fd.append('lng', lng.toString());
    }
    validNewImages.forEach((img) => fd.append('images', img.file));

    try {
      await api.put(`/listings/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Listing updated!');
      navigate(`/listings/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 413 || msg?.toLowerCase().includes('size')) {
        toast.error('One or more photos are too large. Max 5 MB each.');
      } else {
        toast.error(msg || 'Update failed. Please try again.');
      }
    }
    setSaving(false);
  };

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-white';
  const labelCls = 'block text-sm font-medium text-gray-600 mb-1';

  if (loading) return <div className="spinner-page"><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Listing</h1>
      <p className="text-gray-500 mb-8">Update your rental property details</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Basic Info ──────────────────────────────────── */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Available From</label>
              <input name="availableFrom" type="date" value={form.availableFrom || ''} onChange={handleChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Floor</label>
              <input name="floor" value={form.floor || ''} onChange={handleChange} className={inputCls} placeholder="e.g. 3rd" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="negotiable" checked={!!form.negotiable} onChange={handleChange} className="accent-emerald-600 w-4 h-4" />
            <span className="text-sm text-gray-600">Rent is negotiable</span>
          </label>
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
              <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: '0.4rem', fontSize: '0.8rem' }}>
                {lat !== null ? `Current: ${lat.toFixed(5)}, ${lng.toFixed(5)}` : 'Not set — click map to pin'}
              </span>
            </label>
            <MapPicker onLocationSelect={handleLocationSelect} initialLat={lat} initialLng={lng} />
          </div>
        </section>

        {/* ── Photos ──────────────────────────────────────── */}
        <section className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="font-bold text-gray-700 text-lg">📷 Photos</h2>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{totalPhotos} / {MAX_IMAGES}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.6rem', padding: '0.5rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#1d4ed8' }}>
            <FiAlertCircle style={{ flexShrink: 0 }} />
            Each photo must be under <strong style={{ marginLeft: '0.2rem' }}>5 MB</strong>. JPG, PNG, WEBP only.
          </div>

          {/* ✅ Existing photos — loaded via imgUrl() so Cloudinary URLs work */}
          {existingImages.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.5rem' }}>
                Current Photos ({existingImages.length})
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))', gap: '0.6rem' }}>
                {existingImages.map((img) => (
                  <div key={img} style={{ position: 'relative', borderRadius: '0.6rem', overflow: 'hidden', border: '1.5px solid #e5e7eb' }}>
                    {/* ✅ imgUrl() handles both Cloudinary https:// and old /uploads/ paths */}
                    <img
                      src={imgUrl(img)}
                      alt=""
                      style={{ width: '100%', height: '6rem', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = '#f3f4f6';
                      }}
                    />
                    <button type="button"
                      onClick={() => handleDeleteExisting(img)}
                      disabled={deletingUrl === img}
                      style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', background: deletingUrl === img ? '#9ca3af' : '#dc2626', border: 'none', color: '#fff', borderRadius: '9999px', width: '1.5rem', height: '1.5rem', cursor: deletingUrl === img ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}
                      title="Remove photo">
                      {deletingUrl === img ? '…' : <FiTrash2 />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new photos */}
          {totalPhotos < MAX_IMAGES && (
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#4b5563', marginBottom: '0.5rem' }}>
                Add More Photos
              </p>
              <label className="upload-zone" style={{ display: 'block', cursor: 'pointer' }}>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                  onChange={handleNewImages} style={{ display: 'none' }} />
                <FiUpload style={{ fontSize: '1.5rem', color: '#9ca3af', display: 'block', margin: '0 auto 0.3rem' }} />
                <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  Click to add photos ({MAX_IMAGES - totalPhotos} slots left)
                </p>
              </label>

              {newImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))', gap: '0.6rem', marginTop: '0.6rem' }}>
                  {newImages.map((item, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: '0.6rem', overflow: 'hidden', border: `2px solid ${item.error ? '#fca5a5' : '#6ee7b7'}` }}>
                      <img src={item.preview} alt="" style={{ width: '100%', height: '6rem', objectFit: 'cover', display: 'block', filter: item.error ? 'brightness(0.6)' : 'none' }} />
                      <button type="button" onClick={() => removeNewImage(i)}
                        style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', background: '#dc2626', border: 'none', color: '#fff', borderRadius: '9999px', width: '1.5rem', height: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                        <FiTrash2 />
                      </button>
                      {!item.error && (
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#059669', color: '#fff', fontSize: '0.6rem', padding: '0.15rem', textAlign: 'center', fontWeight: '700' }}>NEW</div>
                      )}
                      {item.error && (
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#dc2626', color: '#fff', fontSize: '0.6rem', padding: '0.15rem', textAlign: 'center', fontWeight: '700' }}>TOO LARGE</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {hasErrors && (
            <div style={{ marginTop: '0.75rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.6rem', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#dc2626' }}>
              ⚠️ Remove photos marked <strong>TOO LARGE</strong> before saving.
            </div>
          )}
        </section>

        <button type="submit" disabled={saving || hasErrors}
          style={{ width: '100%', background: saving || hasErrors ? '#9ca3af' : '#059669', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '1rem', fontWeight: '700', fontSize: '1rem', cursor: saving || hasErrors ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif' }}>
          {saving ? '⏳ Saving…' : hasErrors ? '⚠️ Fix oversized photos first' : '💾 Save Changes'}
        </button>
      </form>
    </div>
  );
}