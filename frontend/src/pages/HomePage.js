// =============================================
// pages/HomePage.js
// =============================================

import React from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from '../components/WhatsAppButton';

export default function HomePage() {
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
                <img
                  src={heroBg}
                  alt="Bride wearing beautiful bridal orna"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center top',
                    display: 'block',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, #1a0a04 0%, transparent 30%)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
                  background: 'linear-gradient(to top, rgba(26,10,4,0.6), transparent)',
                  pointerEvents: 'none',
                }} />
              </>
            ) : (
              <div style={{
                width: '100%', height: '100%', minHeight: '500px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'radial-gradient(circle at 30% 30%, rgba(201,149,106,0.22), transparent 35%), linear-gradient(160deg, #2c1a0e, #6b3a1f)',
                padding: '3rem',
              }}>
                <div style={{
                  width: '78%', maxWidth: '340px', aspectRatio: '3 / 4',
                  borderRadius: '24px',
                  border: '1px solid rgba(201,149,106,0.25)',
                  background: 'linear-gradient(180deg, rgba(253,248,243,0.08), rgba(253,248,243,0.02))',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                }} />
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

      <WhatsAppButton />
    </div>
  );
}
