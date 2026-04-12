// pages/MyOrdersPage.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE = 'https://bridal-orna.onrender.com';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://bridal-orna.onrender.com/api/orders/my')
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>My Orders</h1>
        <p>Track all your bookings and order history</p>
      </div>

      <div className="container section-padding" style={{ maxWidth: '800px' }}>
        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ color: '#2c1a0e', marginBottom: '0.5rem' }}>No orders yet</h3>
            <p style={{ color: '#a08070', marginBottom: '1.5rem' }}>You haven't placed any orders. Browse our collection!</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map(order => (
              <div key={order._id} className="card" style={{ padding: '1.25rem' }}>
                {/* Order header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#a08070' }}>Order ID</p>
                    <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#2c1a0e' }}>#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      {item.product?.images?.length > 0 ? (
                        <img src={item.product.images[0]} alt={item.productName}
                          style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e8d5c4' }} />
                      ) : (
                        <div style={{ width: '52px', height: '52px', borderRadius: '8px', background: '#f5ede3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌸</div>
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '500', color: '#2c1a0e', fontSize: '0.9rem' }}>{item.productName}</p>
                        <p style={{ fontSize: '0.8rem', color: '#a08070' }}>Qty: {item.quantity} × ৳{item.pricePerUnit?.toLocaleString()}</p>
                      </div>
                      <p style={{ fontWeight: '600', color: '#c9956a' }}>৳{item.totalPrice?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Custom design badge */}
                {order.customDesign?.requested && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span className="badge" style={{ background: '#f0e6ff', color: '#7b2d8b', fontSize: '0.75rem' }}>🎨 Custom Design Requested</span>
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f0e4d8' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#a08070' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#6a4a3a' }}>💳 {order.paymentMethod}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: '#a08070' }}>Total</p>
                    <p style={{ fontWeight: '700', fontSize: '1.1rem', color: '#c9956a' }}>৳{order.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
