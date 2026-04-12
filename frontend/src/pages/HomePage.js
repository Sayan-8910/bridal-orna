// =============================================
// pages/HomePage.js
// =============================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import WhatsAppButton from '../components/WhatsAppButton';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://bridal-orna.onrender.com/api/products?limit=6')
      .then(res => setFeaturedProducts(res.data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Put your bridal model image inside:
  // frontend/src/assets/hero-model.jpg  (or .png / .webp)
  // Any photo of a bride wearing your orna/dupatta works perfectly.
  // If the file is missing, a beautiful gradient fallback is shown.
  let heroBg = null;
  try { heroBg = require('../assets/hero-model.jpg'); } catch (e) {
    try { heroBg = require('../assets/hero-model.png'); } catch (e2) {
      try { heroBg = require('../assets/hero-model.webp'); } catch (e3) { heroBg = null; }
    }
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        minHeight: '92vh',
        display: 'flex', alignItems: 'stretch',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* LEFT — Text side */}
        <div style={{
          flex: '1 1 50%',
          background: 'linear-gradient(160deg, #1a0a04 0%, #3d1a0a 60%, #5c2d1a 100%)',
          display: 'flex', alignItems: 'center',
          padding: '5rem 4rem 5rem 5rem',
          position: 'relative', zIndex: 2,
        }}>
          {/* Dot pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(201,149,106,0.1) 1px, transparent 0)',
            backgroundSize: '28px 28px', pointerEvents: 'none',
          }} />
          {/* Rose gold accent bar */}
          <div style={{
            position: 'absolute', left: 0, top: '15%', bottom: '15%',
            width: '4px',
            background: 'linear-gradient(to bottom, transparent, #c9956a, #f0d9c8, #c9956a, transparent)',
            borderRadius: '2px',
          }} />

          <div style={{ position: 'relative', maxWidth: '480px' }}>
            <p style={{
              color: '#c9956a', fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              fontSize: '0.75rem', marginBottom: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <span style={{ display: 'inline-block', width: '32px', height: '1px', background: '#c9956a' }} />
              Handcrafted with Love
            </p>

            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
              color: '#fdf8f3', lineHeight: 1.15,
              marginBottom: '1.5rem',
            }}>
              Exquisite<br />
              Bridal <em style={{ color: '#c9956a' }}>Orna</em><br />
              & Dupatta
            </h1>

            <p style={{
              color: '#b09080', fontSize: '1rem',
              lineHeight: 1.8, marginBottom: '2.5rem',
              maxWidth: '380px',
            }}>
              Beautifully crafted wedding dupattas for brides and shops.
              Special bulk pricing available for retailers.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary btn-lg">
                🌸 Browse Collection
              </Link>
              <a
                href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER || '919876543210'}`}
                target="_blank" rel="noreferrer"
                className="btn btn-lg"
                style={{ background: '#25D366', color: 'white' }}
              >
                💬 WhatsApp Us
              </a>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'flex', gap: '2rem', marginTop: '3.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(201,149,106,0.2)',
            }}>
              {[['🌸', 'Premium', 'Products'], ['💍', 'Bridal', 'Designs'], ['🏪', 'Bulk', 'Pricing']].map(([icon, l1, l2]) => (
                <div key={l1}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>{icon}</div>
                  <div style={{ color: '#fdf8f3', fontSize: '0.8rem', fontWeight: '600', lineHeight: 1.3 }}>{l1}</div>
                  <div style={{ color: '#c9956a', fontSize: '0.75rem' }}>{l2}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Model image side */}
        <div style={{
          flex: '1 1 50%',
          position: 'relative',
          minHeight: '500px',
          background: 'linear-gradient(135deg, #2c1a0e, #6b3a1f)',
          overflow: 'hidden',
        }}>
          {heroBg ? (
            <>
              {/* Actual model photo */}
              <img
                src={heroBg}
                alt="Bride wearing beautiful bridal orna"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center top',
                  display: 'block',
                }}
              />
              {/* Gradient overlay — left edge blends into text side */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, #1a0a04 0%, transparent 30%)',
                pointerEvents: 'none',
              }} />
              {/* Bottom fade */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
                background: 'linear-gradient(to top, rgba(26,10,4,0.6), transparent)',
                pointerEvents: 'none',
              }} />
            </>
          ) : (
            /* ── Placeholder shown when no image is added yet ── */
            <div style={{
              width: '100%', height: '100%', minHeight: '500px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(160deg, #2c1a0e, #6b3a1f)',
              gap: '1.5rem', padding: '3rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '5rem', opacity: 0.4 }}>👰</div>
              <div style={{
                border: '2px dashed rgba(201,149,106,0.4)',
                borderRadius: '16px', padding: '2rem 2.5rem',
                maxWidth: '320px',
              }}>
                <p style={{ color: '#c9956a', fontWeight: '600', marginBottom: '0.5rem' }}>
                  📸 Add Your Model Photo
                </p>
                <p style={{ color: '#8a6050', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Place your bridal orna model image at:
                </p>
                <code style={{
                  display: 'block', marginTop: '0.75rem',
                  background: 'rgba(201,149,106,0.1)', padding: '0.5rem 0.75rem',
                  borderRadius: '6px', fontSize: '0.75rem', color: '#f0d9c8',
                  wordBreak: 'break-all',
                }}>
                  frontend/src/assets/<br/>hero-model.jpg
                </code>
                <p style={{ color: '#8a6050', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                  Supports .jpg .png .webp<br/>
                  Best size: 800×1200px (portrait)
                </p>
              </div>
            </div>
          )}

          {/* Decorative corner flourish */}
          <div style={{
            position: 'absolute', top: '2rem', right: '2rem',
            width: '80px', height: '80px',
            border: '1px solid rgba(201,149,106,0.3)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '2.5rem', right: '2.5rem',
            width: '60px', height: '60px',
            border: '1px solid rgba(201,149,106,0.2)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
        </div>

        {/* Mobile: stack layout override */}
        <style>{`
          @media (max-width: 768px) {
            section > div:first-child { padding: 3rem 1.5rem !important; }
            section > div:last-child { min-height: 320px !important; flex: 0 0 320px !important; }
            section { flex-direction: column !important; }
          }
        `}</style>
      </section>

      {/* ── Features ── */}
      <section style={{ background: '#f5ede3', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              ['🚚', 'Cash on Delivery', 'Pay when you receive. No online payment needed.'],
              ['🏷️', 'Shop Bulk Pricing', 'Special lower prices for registered shops.'],
              ['🎨', 'Custom Designs', 'Request a custom design with your own reference image.'],
              ['💬', 'WhatsApp Support', 'Reach us directly on WhatsApp anytime.'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{
                background: 'white', borderRadius: '12px', padding: '1.5rem',
                textAlign: 'center', boxShadow: '0 2px 8px rgba(44,26,14,0.06)',
                border: '1px solid #e8d5c4',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: '#2c1a0e' }}>{title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#a08070' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section-padding">
        <div className="container">
          <div className="section-title">
            <h2>Featured Collection</h2>
            <p style={{ color: '#a08070', marginTop: '0.5rem' }}>Our most loved bridal dupattas</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : featuredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a08070' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌸</div>
              <p>Products will appear here once added by the admin.</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/products" className="btn btn-outline btn-lg">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Shop ── */}
      <section style={{
        background: 'linear-gradient(135deg, #c9956a, #a0714f)',
        padding: '4rem 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ color: 'white', fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>
            Are You a Shop Owner?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Register as a shop to get exclusive bulk pricing on all products.
          </p>
          <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: '#c9956a', fontWeight: '600' }}>
            Register as Shop →
          </Link>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
}
