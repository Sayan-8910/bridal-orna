import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    shopName: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      shopName: user.shopName || '',
    });
  }, [user]);

  if (loading || !user) return <LoadingSpinner />;

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      };

      if (user.role === 'shop') {
        payload.shopName = form.shopName;
      }

      await updateProfile(payload);
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>View and edit your account details</p>
      </div>

      <div className="container section-padding">
        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        <div className="card" style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => onChange('name', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => onChange('email', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                value={form.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                placeholder="Optional"
              />
            </div>

            {user.role === 'shop' && (
              <div className="form-group">
                <label className="form-label">Shop Name</label>
                <input
                  className="form-input"
                  value={form.shopName}
                  onChange={(e) => onChange('shopName', e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                className="form-textarea"
                value={form.address}
                onChange={(e) => onChange('address', e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <p style={{ color: '#a08070', fontSize: '0.85rem', margin: 0 }}>
                Account Type: <strong style={{ color: '#2c1a0e' }}>{user.role}</strong>
              </p>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
