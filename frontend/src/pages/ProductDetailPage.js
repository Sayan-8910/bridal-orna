// =============================================
// pages/ProductDetailPage.js
// =============================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import WhatsAppButton from '../components/WhatsAppButton';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE = 'https://bridal-orna.onrender.com';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios.get(`https://bridal-orna.onrender.com/api/products/${id}`)
      .then(res => { setProduct(res.data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!product) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>Product not found</h2>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Products</Link>
    </div>
  );

  const price = user?.role === 'shop' ? product.shopPrice : product.customerPrice;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const handleBook = () => {
    if (!user) return navigate('/login');
    navigate(`/book/${product._id}`, { state: { quantity } });
  };

  return (
    <div>
      <div className="container section-padding">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#a08070' }}>
          <Link to="/" style={{ color: '#c9956a' }}>Home</Link> {' › '}
          <Link to="/products" style={{ color: '#c9956a' }}>Products</Link> {' › '}
          {product.name}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {/* Images */}
          <div>
            {/* Main image */}
            <div style={{
              borderRadius: '12px', overflow: 'hidden', marginBottom: '0.75rem',
              background: 'linear-gradient(135deg, #f5ede3, #fdf8f3)',
              aspectRatio: '1', position: 'relative',
              border: '1px solid #e8d5c4',
            }}>
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '4rem', opacity: 0.3 }}>🌸</div>
              )}
              {isOutOfStock && (
                <div style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: '#c0392b', color: 'white', padding: '0.35rem 0.75rem',
                  borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700',
                }}>OUT OF STOCK</div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} style={{
                    width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden',
                    border: selectedImage === i ? '2px solid #c9956a' : '2px solid #e8d5c4',
                    cursor: 'pointer', padding: 0, background: 'none',
                  }}>
                    <img src={img} alt={`view ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.category && (
              <span className="badge badge-rose" style={{ marginBottom: '0.75rem' }}>{product.category}</span>
            )}
            <h1 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '0.75rem' }}>{product.name}</h1>

            {/* Price */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: '#c9956a' }}>
                ₹{price?.toLocaleString()}
              </span>
              {user?.role === 'shop' && (
                <span style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: '#a08070', textDecoration: 'line-through' }}>
                  ₹{product.customerPrice?.toLocaleString()} retail
                </span>
              )}
              {user?.role === 'shop' && (
                <div><span className="badge badge-success" style={{ marginTop: '0.35rem' }}>Shop Bulk Price</span></div>
              )}
            </div>

            {/* Stock */}
            <div style={{ marginBottom: '1.25rem' }}>
              {isOutOfStock ? (
                <span className="stock-out">✗ Out of Stock</span>
              ) : isLowStock ? (
                <span className="stock-low">⚠️ Only {product.stock} left — Order soon!</span>
              ) : (
                <span className="stock-ok">✓ In Stock ({product.stock} available)</span>
              )}
            </div>

            {product.description && (
              <p style={{ color: '#6a4a3a', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.description}</p>
            )}

            <hr className="divider" />

            {/* Payment note */}
            <div style={{
              background: '#fdf8f3', border: '1px solid #e8d5c4',
              borderRadius: '8px', padding: '0.875rem', marginBottom: '1.5rem',
            }}>
              <p style={{ color: '#a08070', fontSize: '0.875rem', margin: 0 }}>
                💳 Payment: <strong style={{ color: '#2c1a0e' }}>Cash on Delivery / Pay Later</strong>
              </p>
            </div>

            {/* Quantity & Book */}
            {!isOutOfStock && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Quantity</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      border: '1.5px solid #e8d5c4', background: 'white',
                      cursor: 'pointer', fontSize: '1.1rem', color: '#c9956a',
                    }}
                  >−</button>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      border: '1.5px solid #e8d5c4', background: 'white',
                      cursor: 'pointer', fontSize: '1.1rem', color: '#c9956a',
                    }}
                  >+</button>
                  <span style={{ color: '#a08070', fontSize: '0.85rem' }}>
                    Total: ₹{(price * quantity)?.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleBook}
                disabled={isOutOfStock}
                style={{ flex: 1 }}
              >
                {isOutOfStock ? 'Out of Stock' : user ? '📦 Book Now' : '🔐 Login to Book'}
              </button>
              <a
                href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER || '919876543210'}?text=${encodeURIComponent(`Hi! I'm interested in: ${product.name}`)}`}
                target="_blank" rel="noreferrer"
                className="btn btn-lg"
                style={{ background: '#25D366', color: 'white' }}
              >
                💬 Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton message={`Hi! I'm interested in: ${product.name}`} />
    </div>
  );
}
