import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setResetLink('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data?.message || 'If this email exists, a reset link has been generated.');
      if (res.data?.resetLink) {
        setResetLink(res.data.resetLink);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fdf8f3, #f5ede3)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }}>Forgot Password</h2>
            <p style={{ color: '#a08070', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Enter your email to get a reset link
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Generating link…' : 'Generate Reset Link'}
            </button>
          </form>

          {resetLink && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fdf3ea', borderRadius: '8px', border: '1px solid #e8d5c4' }}>
              <p style={{ fontSize: '0.8rem', color: '#7a5a47', marginBottom: '0.5rem' }}>
                Reset link (development):
              </p>
              <a href={resetLink} style={{ color: '#c9956a', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                {resetLink}
              </a>
            </div>
          )}

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#a08070', fontSize: '0.9rem' }}>
            Remember your password?{' '}
            <Link to="/login" style={{ color: '#c9956a', fontWeight: '600' }}>
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
