// =============================================
// pages/HomePage.js — Full screen hero
// =============================================

import React from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from '../components/WhatsAppButton';

export default function HomePage() {
  return (
    <div>
      {/* HERO — Full screen */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a0a04 0%, #3d1a0a 50%, #5c2d1a 100%)',
      }}>
        {/* Dot pattern */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(201,149,106,0.1) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }} />

        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: '10%', top: '15%', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(201,149,106,0.08)', zIndex: 0 }} />
        <div style={{ position: 'absolute', right: '8%', top: '13%', width: '360px', height: '360px', borderRadius: '50%', border: '1px solid rgba(201,149,106,0.05)', zIndex: 0 }} />
        <div style={{ position: 'absolute', left: '-5%', bottom: '10%', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(201,149,106,0.06)', zIndex: 0 }} />

        {/* Rose gold accent bar */}
        <div style={{
          position: 'absolute', left: 0, top: '20%', bottom: '20%',
          width: '4px',
          background: 'linear-gradient(to bottom, transparent, #c9956a, #f0d9c8, #c9956a, transparent)',
          borderRadius: '2px', zIndex: 1,
        }} />

        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '150px', zIndex: 1,
          background: 'linear-gradient(to top, #fdf8f3, transparent)',
        }} />

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '640px' }}>
            <p style={{
              color: '#c9956a', fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              fontSize: '0.75rem', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <span style={{ display: 'inline-block', width: '32px', height: '1px', background: '#c9956a' }} />
              Handcrafted with Love
            </p>

            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              color: '#fdf8f3', lineHeight: 1.1,
              marginBottom: '1.5rem',
              textShadow: '0 2px 30px rgba(0,0,0,0.3)',
            }}>
              Exquisite Bridal<br />
              <em style={{ color: '#c9956a' }}>Orna & Dupatta</em>
            </h1>

            <p style={{
              color: '#c9b5a0', fontSize: '1.1rem',
              lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '460px',
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

            <div style={{
              display: 'flex', gap: '2.5rem',
              marginTop: '4rem', paddingTop: '2rem',
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
                  <div style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{icon}</div>
                  <div style={{ color: '#fdf8f3', fontSize: '0.8rem', fontWeight: '600', lineHeight: 1.3 }}>{l1}</div>
                  <div style={{ color: '#c9956a', fontSize: '0.75rem' }}>{l2}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: '#f5ede3', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              ['🚚', 'Cash on Delivery', 'Pay when you receive. No online payment needed.'],
              ['🏷️', 'Shop Bulk Pricing', 'Special lower prices for registered shops.'],
              ['🎨', 'Custom Designs', 'Request a custom design with your reference image.'],
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

      {/* Shop CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #c9956a, #a0714f)',
        padding: '4rem 0', textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ color: 'white', fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>
            Are You a Shop Owner?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Register as a shop to get exclusive bulk pricing on all products.
          </p>
          <Link to="/register" className="btn btn-lg"
            style={{ background: 'white', color: '#c9956a', fontWeight: '600' }}>
            Register as Shop →
          </Link>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
}