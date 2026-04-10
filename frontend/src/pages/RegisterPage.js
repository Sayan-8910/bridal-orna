// pages/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', role: 'customer', shopName: '', address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (!form.phone.trim()) {
      return setError('Phone number is required.');
    }

    setLoading(true);
    try {
      await register({
        name: form.name, email: form.email, password: form.password,
        phone: form.phone, role: form.role,
        shopName: form.role === 'shop' ? form.shopName : undefined,
        address: form.address,
      });
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fdf8f3, #f5ede3)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌸</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }}>Create Account</h2>
            <p style={{ color: '#a08070', fontSize: '0.875rem', marginTop: '0.25rem' }}>Join Bridal Orna today</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Account Type */}
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[['customer', '👤 Individual Customer', 'For single purchases'],
                  ['shop', '🏪 Shop / Retailer', 'Get bulk pricing']].map(([val, label, sub]) => (
                  <label key={val} style={{
                    border: `2px solid ${form.role === val ? '#c9956a' : '#e8d5c4'}`,
                    borderRadius: '8px', padding: '0.875rem', cursor: 'pointer',
                    background: form.role === val ? '#fdf3ea' : 'white',
                    transition: 'all 0.2s',
                  }}>
                    <input type="radio" name="role" value={val} checked={form.role === val} onChange={handleChange} style={{ display: 'none' }} />
                    <div style={{ fontWeight: '600', fontSize: '0.875rem', color: form.role === val ? '#c9956a' : '#2c1a0e' }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#a08070', marginTop: '0.2rem' }}>{sub}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>

            {form.role === 'shop' && (
              <div className="form-group">
                <label className="form-label">Shop Name *</label>
                <input className="form-input" name="shopName" placeholder="Your shop name" value={form.shopName} onChange={handleChange} required />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input className="form-input" name="phone" placeholder="91XXXXXXXXX" value={form.phone} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" name="address" placeholder="Your delivery address" value={form.address} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className="form-input" type="password" name="confirmPassword" placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#a08070', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#c9956a', fontWeight: '600' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
