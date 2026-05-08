import { useEffect, useState } from 'react';
import api, { imgUrl } from '../../api/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/admin/listings')
      .then((r) => setListings(r.data))
      .finally(() => setLoading(false));
  }, []);

  const toggleApproval = async (id) => {
    try {
      const { data } = await api.put(`/admin/listings/${id}/toggle`);
      setListings((prev) =>
        prev.map((l) => l._id === id ? { ...l, isApproved: data.isApproved } : l)
      );
      toast.success(data.message);
    } catch { toast.error('Action failed'); }
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      await api.delete(`/admin/listings/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
      toast.success('Listing deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="spinner-page"><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2.5rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link to="/admin" style={{ color: '#059669', fontSize: '0.875rem', textDecoration: 'none', fontWeight: '600' }}>
          ← Dashboard
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937' }}>
          All Listings ({listings.length})
        </h1>
      </div>

      {listings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h3>No listings yet</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {listings.map((l) => (
            <div key={l._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>

              {/* ✅ Listing thumbnail using imgUrl() */}
              <img
                src={
                  l.images?.[0]
                    ? imgUrl(l.images[0])
                    : 'https://placehold.co/80x80/e2e8f0/64748b?text=No+Img'
                }
                alt=""
                style={{ width: '4.5rem', height: '4.5rem', borderRadius: '0.75rem', objectFit: 'cover', flexShrink: 0, background: '#f3f4f6' }}
                onError={(e) => { e.target.src = 'https://placehold.co/80x80/e2e8f0/64748b?text=No+Img'; }}
              />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/listings/${l._id}`}
                  style={{ fontWeight: '700', color: '#1f2937', textDecoration: 'none', fontSize: '0.95rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  onMouseEnter={(e) => (e.target.style.color = '#059669')}
                  onMouseLeave={(e) => (e.target.style.color = '#1f2937')}>
                  {l.title}
                </Link>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.2rem' }}>
                  {l.location?.city}
                  {l.location?.area ? ` · ${l.location.area}` : ''}
                  {` · ৳${l.rent?.toLocaleString()}/mo`}
                  {` · `}
                  <span style={{ textTransform: 'capitalize' }}>{l.type}</span>
                  {` · By: `}<strong>{l.owner?.name}</strong>
                </p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.1rem' }}>
                  {new Date(l.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <span className={`badge ${l.isApproved ? 'badge-approved' : 'badge-pending'}`}>
                  {l.isApproved ? 'Visible' : 'Hidden'}
                </span>
                <button onClick={() => toggleApproval(l._id)}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
                  {l.isApproved ? 'Hide' : 'Approve'}
                </button>
                <button onClick={() => deleteListing(l._id)}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}