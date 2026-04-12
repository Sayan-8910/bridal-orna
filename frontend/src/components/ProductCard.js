// =============================================
// components/ProductCard.js
// =============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

export default function ProductCard({ product }) {
  const { user } = useAuth();

  // Pick price based on role
  const price = user?.role === 'shop' ? product.shopPrice : product.customerPrice;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  // Images are now full Cloudinary URLs
  const imageUrl = product.images && product.images.length > 0
    ? getImageUrl(product.images[0])
    : null;

  return (
    <div className="card" style={{ position: 'relative', cursor: 'pointer' }}>
      {/* Image */}
      <Link to={`/products/${product._id}`} style={{ display: 'block', overflow: 'hidden' }}>
        <div style={{
          width: '100%', paddingBottom: '110%', position: 'relative',
          background: 'linear-gradient(135deg, #f5ede3, #fdf8f3)',
          overflow: 'hidden',
        }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', transition: 'transform 0.4s ease',
              }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem', opacity: 0.4,
            }}>🌸</div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(44,26,14,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                background: '#c0392b', color: 'white', padding: '0.4rem 1rem',
                borderRadius: '4px', fontWeight: '700', fontSize: '0.85rem',
                transform: 'rotate(-8deg)', letterSpacing: '0.05em',
              }}>OUT OF STOCK</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '1rem' }}>
        {/* Stock badges */}
        {isLowStock && (
          <div style={{ marginBottom: '0.4rem' }}>
            <span className="badge" style={{ background: '#fef3e2', color: '#d4a017', fontSize: '0.7rem' }}>
              ⚠️ Only {product.stock} left!
            </span>
          </div>
        )}

        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1rem', color: '#2c1a0e',
            marginBottom: '0.35rem',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{product.name}</h3>
        </Link>

        {product.category && (
          <p style={{ fontSize: '0.75rem', color: '#a08070', marginBottom: '0.5rem' }}>
            {product.category}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#c9956a' }}>
              ₹{price?.toLocaleString()}
            </span>
            {user?.role === 'shop' && (
              <span style={{ fontSize: '0.7rem', color: '#a08070', marginLeft: '4px' }}>shop price</span>
            )}
          </div>

          <Link
            to={isOutOfStock ? '#' : `/products/${product._id}`}
            className="btn btn-primary btn-sm"
            style={{ pointerEvents: isOutOfStock ? 'none' : 'auto', opacity: isOutOfStock ? 0.4 : 1 }}
          >
            {isOutOfStock ? 'Sold Out' : 'View'}
          </Link>
        </div>
      </div>
    </div>
  );
}
