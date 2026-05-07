import { Link } from 'react-router-dom';
import { FiMapPin, FiHome, FiEye } from 'react-icons/fi';
import { imgUrl } from '../api/axios';

const TYPE_COLORS = {
  family:   'badge-family',
  bachelor: 'badge-bachelor',
  sublet:   'badge-sublet',
  office:   'badge-office',
  seat:     'badge-seat',
};

export default function ListingCard({ listing }) {
  const img = listing.images?.[0]
    ? imgUrl(listing.images[0])
    : 'https://placehold.co/400x250/e2e8f0/64748b?text=No+Image';

  return (
    <Link to={`/listings/${listing._id}`} className="listing-card" style={{ textDecoration: 'none' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={img}
          alt={listing.title}
          style={{ width: '100%', height: '12rem', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
        />
        <span className={`badge ${TYPE_COLORS[listing.type] || ''}`}
          style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', textTransform: 'capitalize' }}>
          {listing.type}
        </span>
        {listing.status === 'rented' && (
          <span className="badge badge-rented" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
            Rented
          </span>
        )}
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontWeight: '600', color: '#1f2937', fontSize: '1rem', lineHeight: '1.3', marginBottom: '0.3rem' }}
          className="line-clamp-1">
          {listing.title}
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
          <FiMapPin style={{ color: '#059669', flexShrink: 0 }} />
          {listing.location?.area && `${listing.location.area}, `}{listing.location?.city}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FiHome /> {listing.bedrooms} Bed
          </span>
          <span style={{ textTransform: 'capitalize' }}>{listing.furnished}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto', color: '#9ca3af' }}>
            <FiEye /> {listing.views}
          </span>
        </div>
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#059669', fontWeight: '800', fontSize: '1.1rem' }}>
            ৳{listing.rent.toLocaleString()}
            <span style={{ color: '#9ca3af', fontWeight: '400', fontSize: '0.8rem' }}>/mo</span>
          </p>
          {listing.negotiable && (
            <span style={{ fontSize: '0.7rem', color: '#6b7280', background: '#f3f4f6', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
              Negotiable
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}