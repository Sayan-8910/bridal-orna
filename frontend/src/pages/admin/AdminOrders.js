// =============================================
// pages/admin/AdminOrders.js
// =============================================

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_BASE = 'https://bridal-orna.onrender.com';
const STATUSES = ['Pending', 'In Progress', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      const res = await axios.get(`${API_BASE}/api/admin/orders?${params}`);
      // Ensure data is always an array
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); setOrders([]); }
    finally { setLoading(false); }
  }, [roleFilter, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await axios.put(`${API_BASE}/api/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) { alert('Failed to update status.'); }
    finally { setUpdatingId(null); }
  };

  const toggleExpand = (id) => setExpandedOrder(prev => prev === id ? null : id);

  return (
    <div>
      <div className="page-header">
        <h1>Manage Orders</h1>
        <p>View, filter, and update all customer orders</p>
      </div>

      <div className="container section-padding">
        {/* Filters */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #e8d5c4', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Customer Type</label>
            <select className="form-select" style={{ minWidth: '150px' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="all">All Customers</option>
              <option value="shop">Shops Only</option>
              <option value="customer">Individual Customers</option>
            </select>
          </div>
          <div>
            <label className="form-label">Order Status</label>
            <select className="form-select" style={{ minWidth: '150px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ color: '#a08070', fontSize: '0.875rem', paddingBottom: '0.75rem' }}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#a08070' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
            <p>No orders found for the selected filters.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div key={order._id} className="card" style={{ overflow: 'visible' }}>
                {/* Order Summary Row */}
                <div
                  style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
                  onClick={() => toggleExpand(order._id)}
                >
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#a08070' }}>Order ID</p>
                    <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#2c1a0e', fontWeight: '600' }}>#{order._id.slice(-8).toUpperCase()}</p>
                    <p style={{ fontSize: '0.75rem', color: '#a08070', marginTop: '2px' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div style={{ flex: 1, minWidth: '140px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#a08070' }}>Customer</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2c1a0e' }}>{order.userSnapshot?.name}</p>
                    <span className={`badge ${order.userSnapshot?.role === 'shop' ? 'badge-rose' : 'badge-info'}`} style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                      {order.userSnapshot?.role === 'shop' ? '🏪 Shop' : '👤 Customer'}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <p style={{ fontSize: '0.75rem', color: '#a08070' }}>Amount</p>
                    <p style={{ fontSize: '1.05rem', fontWeight: '700', color: '#c9956a' }}>৳{order.totalAmount?.toLocaleString()}</p>
                  </div>

                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  {/* Status Updater */}
                  <div onClick={e => e.stopPropagation()} style={{ minWidth: '160px' }}>
                    <select
                      className="form-select"
                      value={order.status}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <span style={{ color: '#c9956a', fontSize: '1.2rem' }}>{expandedOrder === order._id ? '▲' : '▼'}</span>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order._id && (
                  <div style={{ borderTop: '1px solid #f0e4d8', padding: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                      {/* Customer Details */}
                      <div>
                        <h4 style={{ fontSize: '0.875rem', color: '#2c1a0e', marginBottom: '0.75rem', fontFamily: 'Playfair Display, serif' }}>👤 Customer Details</h4>
                        <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <p><strong>Name:</strong> {order.userSnapshot?.name}</p>
                          <p><strong>Email:</strong> {order.userSnapshot?.email}</p>
                          <p><strong>Phone:</strong> {order.userSnapshot?.phone || 'N/A'}</p>
                          {order.userSnapshot?.shopName && <p><strong>Shop:</strong> {order.userSnapshot.shopName}</p>}
                          <p><strong>Address:</strong> {order.userSnapshot?.address || 'N/A'}</p>
                          {order.userSnapshot?.phone && (
                            <a href={`https://wa.me/${order.userSnapshot.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#25D366', fontWeight: '600', marginTop: '0.25rem' }}>
                              💬 WhatsApp
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <h4 style={{ fontSize: '0.875rem', color: '#2c1a0e', marginBottom: '0.75rem', fontFamily: 'Playfair Display, serif' }}>📦 Order Items</h4>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                            {item.product?.images?.length > 0 ? (
                              <img src={item.product.images[0]} alt={item.productName} style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e8d5c4' }} />
                            ) : <div style={{ width: '44px', height: '44px', borderRadius: '6px', background: '#f5ede3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌸</div>}
                            <div style={{ flex: 1, fontSize: '0.85rem' }}>
                              <p style={{ fontWeight: '600', color: '#2c1a0e' }}>{item.productName}</p>
                              <p style={{ color: '#a08070' }}>Qty: {item.quantity} × ৳{item.pricePerUnit?.toLocaleString()}</p>
                            </div>
                            <p style={{ fontWeight: '700', color: '#c9956a', fontSize: '0.9rem' }}>৳{item.totalPrice?.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      {/* Custom Design & Notes */}
                      <div>
                        {order.customDesign?.requested && (
                          <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '0.875rem', color: '#7b2d8b', marginBottom: '0.5rem', fontFamily: 'Playfair Display, serif' }}>🎨 Custom Design Request</h4>
                            {order.customDesign.description && <p style={{ fontSize: '0.85rem', color: '#6a4a3a', marginBottom: '0.5rem' }}>{order.customDesign.description}</p>}
                            {order.customDesign.imagePath && (
                              <a href={order.customDesign.imagePath} target="_blank" rel="noreferrer">
                                <img src={order.customDesign.imagePath} alt="Design reference"
                                  style={{ maxWidth: '120px', borderRadius: '8px', border: '1px solid #e8d5c4' }} />
                              </a>
                            )}
                          </div>
                        )}
                        {order.notes && (
                          <div>
                            <h4 style={{ fontSize: '0.875rem', color: '#2c1a0e', marginBottom: '0.35rem', fontFamily: 'Playfair Display, serif' }}>📝 Notes</h4>
                            <p style={{ fontSize: '0.85rem', color: '#6a4a3a' }}>{order.notes}</p>
                          </div>
                        )}
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fdf8f3', borderRadius: '8px', border: '1px solid #e8d5c4' }}>
                          <p style={{ fontSize: '0.8rem', color: '#6a4a3a' }}>💳 {order.paymentMethod}</p>
                          <p style={{ fontSize: '1rem', fontWeight: '700', color: '#c9956a', marginTop: '0.25rem' }}>
                            Total: ৳{order.totalAmount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
