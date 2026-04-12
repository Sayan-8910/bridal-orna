// =============================================
// pages/BookingPage.js - Place an Order
// =============================================

import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE = 'https://bridal-orna.onrender.com';

export default function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [quantity, setQuantity] = useState(location.state?.quantity || 1);
  const [notes, setNotes] = useState('');
  const [customDesign, setCustomDesign] = useState(false);
  const [designDesc, setDesignDesc] = useState('');
  const [designImage, setDesignImage] = useState(null);

  useEffect(() => {
    axios.get(`https://bridal-orna.onrender.com/api/products/${id}`)
      .then(res => { setProduct(res.data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <div style={{ padding: '3rem', textAlign: 'center' }}>Product not found.</div>;

  const price = user?.role === 'shop' ? product.shopPrice : product.customerPrice;
  const total = price * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('items', JSON.stringify([{ productId: product._id, quantity }]));
      formData.append('notes', notes);
      formData.append('customDesignRequested', customDesign);
      if (customDesign) formData.append('customDesignDescription', designDesc);
      if (customDesign && designImage) formData.append('designImage', designImage);

      await axios.post('https://bridal-orna.onrender.com/api/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px', padding: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#2c1a0e', marginBottom: '0.75rem' }}>Order Placed!</h2>
          <p style={{ color: '#a08070', marginBottom: '2rem' }}>
            Your order has been received. Payment is Cash on Delivery.
            We will contact you soon on WhatsApp or phone.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/my-orders')}>View My Orders</button>
            <button className="btn btn-outline" onClick={() => navigate('/products')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ maxWidth: '680px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem' }}>Book Your Order</h1>
      <p style={{ color: '#a08070', marginBottom: '2rem' }}>Review your order and confirm the details below.</p>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Product Summary */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {product.images?.length > 0 ? (
          <img src={product.images[0]} alt={product.name}
            style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: '#f5ede3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🌸</div>
        )}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem' }}>{product.name}</h3>
          <p style={{ color: '#c9956a', fontWeight: '600' }}>৳{price?.toLocaleString()} per piece</p>
          {user?.role === 'shop' && <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>Shop Price</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Quantity */}
        <div className="form-group">
          <label className="form-label">Quantity (max: {product.stock})</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="button"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid #e8d5c4', background: 'white', cursor: 'pointer', fontSize: '1.2rem', color: '#c9956a' }}>
              −
            </button>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
            <button type="button"
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid #e8d5c4', background: 'white', cursor: 'pointer', fontSize: '1.2rem', color: '#c9956a' }}>
              +
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Special Notes (optional)</label>
          <textarea className="form-textarea" placeholder="Any special requests or delivery notes..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        {/* Custom Design */}
        <div className="form-group" style={{ background: '#fdf8f3', border: '1px solid #e8d5c4', borderRadius: '10px', padding: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={customDesign} onChange={e => setCustomDesign(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#c9956a' }} />
            <div>
              <span style={{ fontWeight: '600', color: '#2c1a0e' }}>🎨 Request Custom Design</span>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#a08070' }}>Upload a reference image or describe your design</p>
            </div>
          </label>

          {customDesign && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e8d5c4' }}>
              <div className="form-group">
                <label className="form-label">Design Description</label>
                <textarea className="form-textarea" placeholder="Describe the design you want..."
                  value={designDesc} onChange={e => setDesignDesc(e.target.value)} style={{ minHeight: '80px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Reference Image (optional)</label>
                <input type="file" accept="image/*"
                  onChange={e => setDesignImage(e.target.files[0])}
                  style={{ display: 'block', fontSize: '0.875rem', color: '#6a4a3a' }} />
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ background: 'linear-gradient(135deg, #fdf3ea, #fdf8f3)', border: '1px solid #e8d5c4', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', marginBottom: '0.75rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: '#6a4a3a' }}>{product.name} × {quantity}</span>
            <span style={{ fontWeight: '600' }}>৳{total.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: '#6a4a3a' }}>Payment</span>
            <span style={{ color: '#5a8a5a', fontWeight: '600' }}>Cash on Delivery</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e8d5c4', margin: '0.75rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '700', color: '#2c1a0e' }}>Total</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#c9956a' }}>৳{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Delivery info */}
        <div style={{ background: '#f0f9f0', border: '1px solid #b2d8b2', borderRadius: '8px', padding: '0.875rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#3a7a3a' }}>
          📦 Order will be delivered to: <strong>{user?.address || 'Address on file'}</strong>
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={submitting}>
          {submitting ? 'Placing Order…' : `✅ Confirm Order — ৳${total.toLocaleString()}`}
        </button>
      </form>
    </div>
  );
}
