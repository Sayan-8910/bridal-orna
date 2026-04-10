// components/WhatsAppButton.js
// Floating WhatsApp button shown on all pages

import React from 'react';

const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '919876543210';

export default function WhatsAppButton({ message = 'Hello! I am interested in your bridal dupattas.' }) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      title="Chat on WhatsApp"
      style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        width: '56px', height: '56px', borderRadius: '50%',
        background: '#25D366',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.5)',
        zIndex: 999,
        transition: 'all 0.25s ease',
        textDecoration: 'none',
        fontSize: '1.6rem',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,211,102,0.6)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.5)'; }}
    >
      💬
    </a>
  );
}
