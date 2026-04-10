// components/OrderStatusBadge.js

import React from 'react';

export default function OrderStatusBadge({ status }) {
  const map = {
    'Pending':     { bg: '#fef9e7', color: '#d4a017', icon: '⏳' },
    'In Progress': { bg: '#eaf4fd', color: '#2471a3', icon: '🔧' },
    'Delivered':   { bg: '#eafaf1', color: '#1e8449', icon: '✅' },
    'Cancelled':   { bg: '#fdedec', color: '#c0392b', icon: '❌' },
  };
  const style = map[status] || { bg: '#f0f0f0', color: '#666', icon: '•' };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.3rem 0.75rem', borderRadius: '20px',
      background: style.bg, color: style.color,
      fontSize: '0.78rem', fontWeight: '600',
    }}>
      {style.icon} {status}
    </span>
  );
}
