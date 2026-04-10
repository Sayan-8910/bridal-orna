// =============================================
// pages/HomePage.js — Clean: Video hero only
// =============================================

import React from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from '../components/WhatsAppButton';

export default function HomePage() {
  return (
    <div>
      {/* ══════════════════════════════════════
          HERO — Full screen cinematic video
      ══════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>

        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
          }}
        >
          <source src="/videos/bridal_hero.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay — left side darker for text readability */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right, rgba(15,5,2,0.85) 0%, rgba(15,5,2,0.55) 55%, rgba(15,5,2,0.15) 100%)',
        }} />

        {/* Bottom fade into page */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '180px', zIndex: 1,
          background: 'linear-gradient(to top, #fdf8f3, transparent)',
        }} />

        {/* Hero Text Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '0 1.5rem' }}>
          <div style={{ maxWidth: '560px' }}>

            {/* Tagline */}
            <p style={{
              color: '#c9956a',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <span style={{
                display: 'inline-block',
                width: '32px', height: '1px',
                background: '#c9956a',
              }} />
              Handcrafted with Love
            </p>

            {/* Main heading */}
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
              color: '#fdf8f3',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
              textShadow: '0 2px 30px rgba(0,0,0,0.5)',
            }}>
              Exquisite Bridal<br />
              <em style={{ color: '#c9956a' }}>Orna & Dupatta</em>
            </h1>

            {/* Subtitle */}
            <p style={{
              color: '#d4b8a0',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
              maxWidth: '420px',
              textShadow: '0 1px 10px rgba(0,0,0,0.5)',
            }}>
              Beautifully crafted wedding dupattas for brides and shops.
              Special bulk pricing available for retailers.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary btn-lg">
                🌸 Browse Collection
              </Link>
              <a
                href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER || '919876543210'}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-lg"
                style={{ background: '#25D366', color: 'white' }}
              >
                💬 WhatsApp Us
              </a>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              gap: '2.5rem',
              marginTop: '3.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(201,149,106,0.2)',
              flexWrap: 'wrap',
            }}>
              {[
                ['🌸', 'Premium', 'Products'],
                ['💍', 'Bridal', 'Designs'],
                ['🏪', 'Bulk', 'Pricing'],
                ['🚚', 'Cash on', 'Delivery'],
              ].map(([icon, l1, l2]) => (
                <div key={l1}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{icon}</div>
                  <div style={{ color: '#fdf8f3', fontSize: '0.8rem', fontWeight: '600', lineHeight: 1.3 }}>{l1}</div>
                  <div style={{ color: '#c9956a', fontSize: '0.75rem' }}>{l2}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Mobile styles */}
        <style>{`
          @media (max-width: 768px) {
            section { height: 100svh !important; }
          }
        `}</style>
      </section>

      <WhatsAppButton />
    </div>
  );
}