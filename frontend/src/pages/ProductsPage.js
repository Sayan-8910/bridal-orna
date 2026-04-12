// =============================================
// pages/ProductsPage.js - Product Listing
// =============================================

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import WhatsAppButton from '../components/WhatsAppButton';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      const queryString = params.toString();
      const res = await axios.get(`/api/products${queryString ? `?${queryString}` : ''}`);
      setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load products right now. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearFilters = () => {
    setSearch(''); setCategory(''); setSearchInput('');
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1>Our Collection</h1>
        <p>Discover handcrafted bridal dupattas for every bride</p>
      </div>

      <div className="container section-padding">
        {/* Search & Filter Bar */}
        <div style={{
          background: 'white', borderRadius: '12px', padding: '1.25rem 1.5rem',
          boxShadow: '0 2px 12px rgba(44,26,14,0.08)', marginBottom: '2rem',
          border: '1px solid #e8d5c4',
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {/* Search */}
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label className="form-label">Search Products</label>
              <input
                className="form-input"
                placeholder="Search by name, description..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </div>

            {/* Category filter */}
            <div style={{ minWidth: '180px' }}>
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Bridal Dupatta">Bridal Dupatta</option>
                <option value="Wedding Orna">Wedding Orna</option>
                <option value="Embroidered">Embroidered</option>
                <option value="Zari Work">Zari Work</option>
                <option value="Silk">Silk</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              🔍 Search
            </button>

            {(search || category) && (
              <button type="button" className="btn btn-outline" onClick={clearFilters}>
                ✕ Clear
              </button>
            )}
          </form>
        </div>

        {/* Results info */}
        {!loading && (
          <p style={{ color: '#a08070', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {products.length === 0 ? 'No products found.' : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
            {search && ` for "${search}"`}
          </p>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌸</div>
            <h3 style={{ color: '#2c1a0e', marginBottom: '0.5rem' }}>No products found</h3>
            <p style={{ color: '#a08070' }}>Try a different search term or clear the filters.</p>
            <button className="btn btn-outline" onClick={clearFilters} style={{ marginTop: '1rem' }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>

      <WhatsAppButton />
    </div>
  );
}
