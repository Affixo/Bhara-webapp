import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ListingCard from '../components/ListingCard';
import { FiSearch, FiArrowRight, FiHome, FiTrendingUp } from 'react-icons/fi';

const TYPES = [
  { label: 'Family',  value: 'family',  emoji: '👨‍👩‍👧‍👦' },
  { label: 'Bachelor',value: 'bachelor', emoji: '🧑' },
  { label: 'Sub-let', value: 'sublet',  emoji: '🔑' },
  { label: 'Office',  value: 'office',  emoji: '🏢' },
  { label: 'Seat',    value: 'seat',    emoji: '🛏️' },
];

const POPULAR_CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Comilla'];

const STATS = [
  { value: '500+',   label: 'Active Listings' },
  { value: '1,200+', label: 'Happy Tenants'   },
  { value: '6',      label: 'Major Cities'    },
  { value: '100%',   label: 'Verified Posts'  },
];

export default function Home() {
  const [search, setSearch]             = useState('');
  const [city, setCity]                 = useState('');
  const [listings, setListings]         = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/listings', { params: { limit: 8, sort: '-createdAt' } })
      .then(({ data }) => setListings(data.listings || []))
      .catch(() => setListings([]))
      .finally(() => setLoadingListings(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city)   params.set('city', city);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #065f46 0%, #059669 60%, #0d9488 100%)', color: '#fff', padding: '4rem 1rem 3.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '52rem', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', fontWeight: '900', lineHeight: 1.15, marginBottom: '0.75rem' }}>
            Find Your Perfect <br />
            <span style={{ color: '#6ee7b7' }}>To-Let</span> in Bangladesh
          </h1>
          <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)', color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', maxWidth: '34rem', marginLeft: 'auto', marginRight: 'auto' }}>
            Thousands of verified rental listings — Family, Bachelor, Sub-let, Office &amp; more
          </p>

          {/* Search bar — stacks vertically on mobile */}
          <form onSubmit={handleSearch}
            style={{ background: '#fff', borderRadius: '1rem', padding: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '40rem', margin: '0 auto', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by area, title, keyword…"
                style={{ width: '100%', border: 'none', outline: 'none', paddingLeft: '2.4rem', paddingRight: '0.75rem', paddingTop: '0.7rem', paddingBottom: '0.7rem', fontSize: '0.9rem', color: '#374151', fontFamily: 'Inter, sans-serif', background: 'transparent', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <select value={city} onChange={(e) => setCity(e.target.value)}
                style={{ flex: 1, padding: '0.7rem 0.75rem', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '0.6rem', outline: 'none', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', background: '#f9fafb' }}>
                <option value="">All Cities</option>
                {POPULAR_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit"
                style={{ flex: 1, background: '#059669', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.7rem 1rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}>
                <FiSearch /> Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section style={{ background: '#065f46', padding: '1rem' }}>
        <div style={{ maxWidth: '52rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}
          className="sm-stats-grid">
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <div style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: '900', color: '#6ee7b7' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse by Type ───────────────────────────────── */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '3rem 1rem 1.5rem', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.875rem)', fontWeight: '800', color: '#1f2937', marginBottom: '0.3rem' }}>Browse by Type</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Choose the rental type that fits your lifestyle</p>
        </div>
        {/* ✅ Responsive: 2 cols mobile, 3 cols tablet, 5 cols desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }} className="type-cards-grid">
          {TYPES.map((t) => (
            <button key={t.value} onClick={() => navigate(`/listings?type=${t.value}`)} className="type-card">
              <span className="type-emoji">{t.emoji}</span>
              <span className="type-label">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Latest Listings ──────────────────────────────── */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem 1rem 3rem', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <FiTrendingUp style={{ color: '#059669', fontSize: '1.15rem' }} />
              <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.75rem)', fontWeight: '800', color: '#1f2937' }}>Latest Listings</h2>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Fresh rentals just posted</p>
          </div>
          <button onClick={() => navigate('/listings')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: '2px solid #059669', color: '#059669', fontWeight: '700', fontSize: '0.875rem', padding: '0.5rem 1.2rem', borderRadius: '0.75rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#059669'; }}>
            See All <FiArrowRight />
          </button>
        </div>

        {loadingListings ? (
          <div className="listings-grid">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                <div className="skeleton" style={{ height: '11rem' }} />
                <div style={{ padding: '1rem', background: '#fff', border: '1px solid #f1f5f9', borderTop: 'none', borderRadius: '0 0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="skeleton" style={{ height: '0.9rem', width: '75%' }} />
                  <div className="skeleton" style={{ height: '0.75rem', width: '50%' }} />
                  <div className="skeleton" style={{ height: '1rem', width: '35%', marginTop: '0.3rem' }} />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f9fafb', borderRadius: '1rem', border: '1.5px dashed #e5e7eb' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>🏠</div>
            <h3 style={{ fontWeight: '600', color: '#4b5563', marginBottom: '0.4rem' }}>No listings yet</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1rem' }}>Be the first to post a rental!</p>
            <button onClick={() => navigate('/create')}
              style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.65rem 1.5rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>
              Post a Listing
            </button>
          </div>
        ) : (
          <>
            <div className="listings-grid">
              {listings.map((l) => <ListingCard key={l._id} listing={l} />)}
            </div>

            {/* Bottom CTA banner */}
            <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #ecfdf5, #f0fdfa)', border: '1.5px solid #a7f3d0', borderRadius: '1rem', padding: '1.75rem 1rem', textAlign: 'center' }}>
              <FiHome style={{ fontSize: '1.75rem', color: '#059669', display: 'block', margin: '0 auto 0.4rem' }} />
              <h3 style={{ fontWeight: '700', color: '#065f46', fontSize: '1.05rem', marginBottom: '0.3rem' }}>Want to see more?</h3>
              <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Browse all listings with filters — price, area, rooms and more.
              </p>
              <button onClick={() => navigate('/listings')}
                style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 2rem', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(5,150,105,0.3)', transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}>
                Browse All Listings <FiArrowRight />
              </button>
            </div>
          </>
        )}
      </section>

      {/* ── Popular Cities ───────────────────────────────── */}
      <section style={{ background: '#f3f4f6', padding: '3rem 1rem', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.75rem)', fontWeight: '800', color: '#1f2937', marginBottom: '0.3rem' }}>Popular Cities</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Find rentals across Bangladesh</p>
          </div>
          {/* ✅ 2 cols on mobile, 3 on tablet, 6 on desktop */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }} className="city-cards-grid">
            {POPULAR_CITIES.map((c) => (
              <button key={c} onClick={() => navigate(`/listings?city=${c}`)} className="city-card">
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Post CTA ─────────────────────────────────────── */}
      <section style={{ padding: '4rem 1rem', textAlign: 'center', background: '#fff', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏠</div>
          <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.875rem)', fontWeight: '800', color: '#1f2937', marginBottom: '0.6rem' }}>
            Have a Property to Rent?
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.9rem' }}>
            List your property for free and reach thousands of tenants across Bangladesh.
          </p>
          <button onClick={() => navigate('/create')}
            style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '0.75rem', padding: '0.9rem 2rem', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 16px rgba(5,150,105,0.3)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#047857'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(5,150,105,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(5,150,105,0.3)'; }}>
            Post Your Rental <FiArrowRight />
          </button>
        </div>
      </section>

    </div>
  );
}