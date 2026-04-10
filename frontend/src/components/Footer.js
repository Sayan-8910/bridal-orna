// =============================================
// components/Footer.js
// =============================================

import React from 'react';
import { Link } from 'react-router-dom';

const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '919876543210';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #2c1a0e 0%, #4a2512 100%)',
      color: '#f0d9c8',
      padding: '1.75rem 0 1rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🌸</span>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#fdf8f3', lineHeight: 1.2 }}>
                Bridal Orna
              </div>
              <div style={{ fontSize: '0.68rem', color: '#c9956a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Wedding Dupatta
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {[['/', 'Home'], ['/products', 'Products'], ['/register', 'Register'], ['/login', 'Login']].map(([path, label]) => (
              <Link
                key={path}
                to={path}
                style={{ color: '#b58f79', fontSize: '0.84rem', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.target.style.color = '#c9956a'; }}
                onMouseLeave={(e) => { e.target.style.color = '#b58f79'; }}
              >
                {label}
              </Link>
            ))}
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#25D366',
              color: 'white',
              padding: '0.45rem 0.9rem',
              borderRadius: '7px',
              fontSize: '0.78rem',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            <span>💬</span> WhatsApp
          </a>
        </div>

        <div style={{ borderTop: '1px solid rgba(201,149,106,0.2)', paddingTop: '0.8rem', textAlign: 'center' }}>
          <p style={{ color: '#8d6a56', fontSize: '0.76rem' }}>
            Payment: Cash on Delivery / Pay Later
          </p>
          <p style={{ color: '#6a4a3a', fontSize: '0.76rem', marginTop: '0.25rem' }}>
            © {new Date().getFullYear()} Bridal Orna. All rights reserved. Made with ❤️ for brides.
          </p>
        </div>
      </div>
    </footer>
  );
}
