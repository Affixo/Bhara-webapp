import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { imgUrl } from '../api/axios';
import { FiHome, FiMenu, FiX, FiUser, FiLogOut, FiPlusCircle, FiGrid } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen]           = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="bhara-navbar">
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: '4rem', alignItems: 'center' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: '900', color: '#059669', textDecoration: 'none' }}>
            <FiHome style={{ fontSize: '1.75rem' }} />
            Bhara
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
            <Link to="/listings" style={{ color: '#4b5563', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.target.style.color = '#059669')}
              onMouseLeave={(e) => (e.target.style.color = '#4b5563')}>
              Browse To-Let
            </Link>

            {user && (
              <Link to="/create" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#059669', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.6rem', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem', transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}>
                <FiPlusCircle /> Post Rental
              </Link>
            )}

            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#374151' }}>
                  <div className="avatar avatar-md">
                    {user.avatar
                      ? <img src={imgUrl(user.avatar)} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '9999px' }} />
                      : user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '2.5rem', width: '12rem', background: '#fff', borderRadius: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9', padding: '0.25rem 0', zIndex: 100 }}>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', color: '#374151', textDecoration: 'none', fontSize: '0.9rem' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <FiUser /> My Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', color: '#374151', textDecoration: 'none', fontSize: '0.9rem' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <FiGrid /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem 1rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/login" style={{ color: '#4b5563', fontWeight: '500', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" style={{ background: '#059669', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.6rem', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>Register</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#4b5563' }} className="mobile-toggle">
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#fff', borderTop: '1px solid #f1f5f9', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link to="/listings" onClick={() => setOpen(false)} style={{ color: '#374151', fontWeight: '500', textDecoration: 'none' }}>Browse To-Let</Link>
          {user && <Link to="/create" onClick={() => setOpen(false)} style={{ color: '#059669', fontWeight: '500', textDecoration: 'none' }}>Post Rental</Link>}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} style={{ color: '#374151', fontWeight: '500', textDecoration: 'none' }}>My Profile</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)} style={{ color: '#374151', fontWeight: '500', textDecoration: 'none' }}>Admin Panel</Link>}
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: '500', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} style={{ color: '#374151', fontWeight: '500', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} style={{ color: '#059669', fontWeight: '500', textDecoration: 'none' }}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}