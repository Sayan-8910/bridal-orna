// pages/admin/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/dashboard')
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders, icon: '📦', color: '#c9956a', bg: '#fdf3ea' },
    { label: 'Pending Orders', value: stats?.pendingOrders, icon: '⏳', color: '#d4a017', bg: '#fef9e7' },
    { label: 'In Progress', value: stats?.inProgressOrders, icon: '🔧', color: '#2471a3', bg: '#eaf4fd' },
    { label: 'Delivered', value: stats?.deliveredOrders, icon: '✅', color: '#1e8449', bg: '#eafaf1' },
    { label: 'Total Products', value: stats?.totalProducts, icon: '🌸', color: '#7b2d8b', bg: '#f9f0ff' },
    { label: 'Total Customers', value: stats?.customerUsers, icon: '👤', color: '#c9956a', bg: '#fdf3ea' },
    { label: 'Shop Accounts', value: stats?.shopUsers, icon: '🏪', color: '#5a8a5a', bg: '#eafaf1' },
    { label: 'Revenue (Delivered)', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: '💰', color: '#c9956a', bg: '#fdf3ea' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's your business overview.</p>
      </div>

      <div className="container section-padding">
        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {statCards.map(card => (
            <div key={card.label} style={{
              background: card.bg, border: `1px solid ${card.color}30`,
              borderRadius: '12px', padding: '1.25rem',
              boxShadow: '0 2px 8px rgba(44,26,14,0.06)',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: card.color }}>{card.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#6a4a3a', marginTop: '0.25rem' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { to: '/admin/products', icon: '➕', label: 'Add New Product', desc: 'Upload images and set pricing', color: '#c9956a' },
            { to: '/admin/orders', icon: '📋', label: 'Manage Orders', desc: 'View and update order statuses', color: '#2471a3' },
            { to: '/admin/products', icon: '📦', label: 'Manage Products', desc: 'Edit, delete or update stock', color: '#7b2d8b' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '0.95rem', color: item.color, marginBottom: '0.3rem' }}>{item.label}</h3>
                <p style={{ fontSize: '0.8rem', color: '#a08070' }}>{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Low Stock Alert */}
        {stats?.lowStockProducts?.length > 0 && (
          <div style={{ background: '#fef9e7', border: '1px solid #f0c040', borderRadius: '10px', padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#d4a017', marginBottom: '0.75rem' }}>
              ⚠️ Low Stock Alert
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {stats.lowStockProducts.map(p => (
                <span key={p._id} style={{ background: 'white', border: '1px solid #f0c040', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.85rem', color: '#8a6000' }}>
                  {p.name} — <strong>{p.stock} left</strong>
                </span>
              ))}
            </div>
            {stats.outOfStockCount > 0 && (
              <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                ❌ {stats.outOfStockCount} product(s) are completely out of stock.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
