// =============================================
// components/Navbar.js
// =============================================

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    background: 'linear-gradient(135deg, #2c1a0e 0%, #4a2512 100%)',
    boxShadow: '0 2px 20px rgba(44,26,14,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const linkStyle = (active) => ({
    color: active ? '#f0d9c8' : '#c9956a',
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: active ? '600' : '400',
    fontSize: '0.95rem',
    padding: '0.4rem 0',
    borderBottom: active ? '2px solid #c9956a' : '2px solid transparent',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    cursor: 'pointer',
  });

  return (
    <nav style={navStyle}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', height: '64px' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌸</span>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: '#fdf8f3', lineHeight: 1.2 }}>
              Bridal Orna
            </div>
            <div style={{ fontSize: '0.65rem', color: '#c9956a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Wedding Dupatta
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link to="/" style={linkStyle(isActive('/'))}>Home</Link>
          <Link to="/products" style={linkStyle(isActive('/products'))}>Products</Link>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" style={linkStyle(isActive('/admin'))}>Dashboard</Link>
                  <Link to="/admin/products" style={linkStyle(isActive('/admin/products'))}>Products</Link>
                  <Link to="/admin/orders" style={linkStyle(isActive('/admin/orders'))}>Orders</Link>
                </>
              ) : (
                <>
                  <Link to="/my-orders" style={linkStyle(isActive('/my-orders'))}>My Orders</Link>
                  <Link to="/profile" style={linkStyle(isActive('/profile'))}>Profile</Link>
                </>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#f0d9c8', fontSize: '0.85rem' }}>
                  👤 {user?.name ? user.name.split(' ')[0] : 'User'}
                  {user.role === 'shop' && <span style={{ color: '#c9956a', fontSize: '0.75rem', marginLeft: '4px' }}>(Shop)</span>}
                </span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: '#c9956a', borderColor: '#c9956a' }}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ color: '#c9956a', borderColor: '#c9956a' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'none' }}
          className="hamburger"
        >
          <span style={{ fontSize: '1.5rem', color: '#c9956a' }}>{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: '#3d2314', padding: '1rem 1.5rem', borderTop: '1px solid rgba(201,149,106,0.3)' }} className="mobile-menu">
          <Link to="/" style={{ display: 'block', padding: '0.75rem 0', color: '#f0d9c8', borderBottom: '1px solid rgba(201,149,106,0.2)' }} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" style={{ display: 'block', padding: '0.75rem 0', color: '#f0d9c8', borderBottom: '1px solid rgba(201,149,106,0.2)' }} onClick={() => setMenuOpen(false)}>Products</Link>
          {user ? (
            <>
              {user.role !== 'admin' && <Link to="/my-orders" style={{ display: 'block', padding: '0.75rem 0', color: '#f0d9c8', borderBottom: '1px solid rgba(201,149,106,0.2)' }} onClick={() => setMenuOpen(false)}>My Orders</Link>}
              {user.role !== 'admin' && <Link to="/profile" style={{ display: 'block', padding: '0.75rem 0', color: '#f0d9c8', borderBottom: '1px solid rgba(201,149,106,0.2)' }} onClick={() => setMenuOpen(false)}>Profile</Link>}
              {user.role === 'admin' && <>
                <Link to="/admin" style={{ display: 'block', padding: '0.75rem 0', color: '#f0d9c8', borderBottom: '1px solid rgba(201,149,106,0.2)' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/admin/products" style={{ display: 'block', padding: '0.75rem 0', color: '#f0d9c8', borderBottom: '1px solid rgba(201,149,106,0.2)' }} onClick={() => setMenuOpen(false)}>Manage Products</Link>
                <Link to="/admin/orders" style={{ display: 'block', padding: '0.75rem 0', color: '#f0d9c8', borderBottom: '1px solid rgba(201,149,106,0.2)' }} onClick={() => setMenuOpen(false)}>Manage Orders</Link>
              </>}
              <button onClick={handleLogout} style={{ display: 'block', padding: '0.75rem 0', color: '#c9956a', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', width: '100%', textAlign: 'left' }}>Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)} style={{ color: '#c9956a', borderColor: '#c9956a' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
