// components/LoadingSpinner.js

import React from 'react';

export default function LoadingSpinner({ size = 48, fullPage = true }) {
  const spinnerEl = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{
        width: size, height: size,
        border: `4px solid #f0d9c8`,
        borderTop: `4px solid #c9956a`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#c9956a', fontFamily: 'Playfair Display, serif', fontSize: '0.9rem' }}>Loading…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!fullPage) return spinnerEl;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      {spinnerEl}
    </div>
  );
}
