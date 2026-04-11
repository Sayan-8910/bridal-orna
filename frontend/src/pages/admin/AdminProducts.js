// =============================================
// pages/admin/AdminProducts.js
// =============================================

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getImageUrl } from '../../utils/imageUrl';

const emptyForm = {
  name: '', description: '', customerPrice: '', shopPrice: '',
  stock: '', category: 'Bridal Dupatta', isActive: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://bridal-orna.onrender.com/api/products');
      setProducts(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAddForm = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setImages([]);
    setExistingImages([]);
    setShowForm(true);
    setMessage({ type: '', text: '' });
  };

  const openEditForm = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name, description: product.description || '',
      customerPrice: product.customerPrice, shopPrice: product.shopPrice,
      stock: product.stock, category: product.category || 'Bridal Dupatta',
      isActive: product.isActive,
    });
    setImages([]);
    setExistingImages(product.images || []);
    setShowForm(true);
    setMessage({ type: '', text: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(img => fd.append('images', img));
      existingImages.forEach(img => fd.append('existingImages', img));

      if (editProduct) {
        await axios.put(`https://bridal-orna.onrender.com/api/products/${editProduct._id}`, fd);
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        await axios.post('https://bridal-orna.onrender.com/api/products', fd);
        setMessage({ type: 'success', text: 'Product added successfully!' });
      }

      fetchProducts();
      setShowForm(false);
      setEditProduct(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error saving product.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`https://bridal-orna.onrender.com/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const removeExistingImage = (img) => {
    setExistingImages(prev => prev.filter(i => i !== img));
  };

  return (
    <div>
      <div className="page-header">
        <h1>Manage Products</h1>
        <p>Add, edit, and manage your product catalogue</p>
      </div>

      <div className="container section-padding">
        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>
        )}

        {/* Add Product Form */}
        {showForm ? (
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem' }}>
                {editProduct ? '✏️ Edit Product' : '➕ Add New Product'}
              </h2>
              <button className="btn btn-outline btn-sm" onClick={() => setShowForm(false)}>✕ Cancel</button>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Embroidered Bridal Dupatta" />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." />
                </div>

                <div className="form-group">
                  <label className="form-label">Customer Price (₹) *</label>
                  <input className="form-input" type="number" min="0" value={form.customerPrice} onChange={e => setForm({ ...form, customerPrice: e.target.value })} required placeholder="e.g. 1500" />
                </div>

                <div className="form-group">
                  <label className="form-label">Shop/Bulk Price (₹) *</label>
                  <input className="form-input" type="number" min="0" value={form.shopPrice} onChange={e => setForm({ ...form, shopPrice: e.target.value })} required placeholder="e.g. 1200" />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input className="form-input" type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required placeholder="e.g. 50" />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {['Bridal Dupatta', 'Wedding Orna', 'Embroidered', 'Zari Work', 'Silk', 'Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Product Images (up to 10)</label>
                  <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files))} style={{ fontSize: '0.875rem' }} />
                  <p style={{ fontSize: '0.75rem', color: '#a08070', marginTop: '0.25rem' }}>Max 5MB per image. JPG, PNG, WebP supported.</p>
                </div>

                {/* Show existing images when editing */}
                {existingImages.length > 0 && (
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Existing Images (click × to remove)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {existingImages.map(img => (
                        <div key={img} style={{ position: 'relative' }}>
                          <img src={getImageUrl(img)} alt="existing" style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e8d5c4' }} />
                          <button type="button" onClick={() => removeExistingImage(img)} style={{
                            position: 'absolute', top: '-6px', right: '-6px',
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: '#c0392b', color: 'white', border: 'none',
                            cursor: 'pointer', fontSize: '0.7rem', lineHeight: 1,
                          }}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#c9956a' }} />
                  <label htmlFor="isActive" style={{ cursor: 'pointer', fontWeight: '500' }}>Active (visible to customers)</label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={submitting}>
                {submitting ? 'Saving…' : editProduct ? '✓ Update Product' : '➕ Add Product'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <button className="btn btn-primary" onClick={openAddForm}>➕ Add New Product</button>
          </div>
        )}

        {/* Products Table */}
        {loading ? <LoadingSpinner /> : (
          <div style={{ overflowX: 'auto' }}>
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#a08070' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌸</div>
                <p>No products yet. Add your first product!</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(44,26,14,0.08)' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #2c1a0e, #4a2512)' }}>
                    {['Image', 'Name', 'Customer ₹', 'Shop ₹', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.875rem 1rem', color: '#f0d9c8', fontWeight: '600', fontSize: '0.8rem', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid #f0e4d8', background: i % 2 === 0 ? 'white' : '#fdf8f3' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {p.images?.length > 0 ? (
                          <img src={getImageUrl(p.images[0])} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e8d5c4' }} />
                        ) : <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: '#f5ede3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌸</div>}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <p style={{ fontWeight: '600', color: '#2c1a0e', fontSize: '0.9rem' }}>{p.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#a08070' }}>{p.category}</p>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#c9956a' }}>₹{p.customerPrice?.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#5a8a5a', fontWeight: '600' }}>₹{p.shopPrice?.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={p.stock === 0 ? 'stock-out' : p.stock < 5 ? 'stock-low' : 'stock-ok'}>
                          {p.stock === 0 ? '✗ Out' : p.stock < 5 ? `⚠️ ${p.stock}` : `✓ ${p.stock}`}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>{p.isActive ? 'Active' : 'Hidden'}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => openEditForm(p)}>✏️ Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
