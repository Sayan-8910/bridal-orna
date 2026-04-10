// =============================================
// pages/ForgotPasswordPage.js
// 3-step flow: Email → OTP → New Password
// =============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // step 1 = enter email, step 2 = enter OTP, step 3 = new password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Step 1: Send OTP ──
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setSuccess(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post('/api/auth/verify-otp', { email, otp });
      setSuccess(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ──
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/reset-password', { email, otp, newPassword });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step indicator labels
  const steps = ['Enter Email', 'Verify OTP', 'New Password'];

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fdf8f3, #f5ede3)',
      padding: '2rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', justifyContent: 'center' }}>
          {steps.map((label, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '0.9rem',
                  background: step > i + 1 ? '#5a8a5a' : step === i + 1 ? '#c9956a' : '#e8d5c4',
                  color: step >= i + 1 ? 'white' : '#a08070',
                  transition: 'all 0.3s',
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{
                  fontSize: '0.7rem', color: step === i + 1 ? '#c9956a' : '#a08070',
                  fontWeight: step === i + 1 ? '600' : '400',
                  whiteSpace: 'nowrap',
                }}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: '2px', margin: '0 0.5rem', marginBottom: '1.2rem',
                  background: step > i + 1 ? '#5a8a5a' : '#e8d5c4',
                  transition: 'background 0.3s',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2.5rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {step === 1 ? '🔑' : step === 2 ? '📩' : '🔒'}
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem' }}>
              {step === 1 ? 'Forgot Password?' : step === 2 ? 'Check Your Email' : 'Set New Password'}
            </h2>
            <p style={{ color: '#a08070', fontSize: '0.875rem', marginTop: '0.4rem' }}>
              {step === 1 && 'Enter your registered email to receive an OTP'}
              {step === 2 && `We sent a 6-digit OTP to ${email}`}
              {step === 3 && 'Choose a strong new password'}
            </p>
          </div>

          {/* Alerts */}
          {error && <div className="alert alert-error">{error}</div>}
          {success && step !== 3 && <div className="alert alert-success">{success}</div>}

          {/* ── Step 1 Form ── */}
          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Sending OTP…' : '📧 Send OTP'}
              </button>
            </form>
          )}

          {/* ── Step 2 Form ── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label className="form-label">Enter 6-digit OTP</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. 123456"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                  style={{
                    fontSize: '1.75rem', letterSpacing: '0.5rem',
                    textAlign: 'center', fontWeight: '700',
                  }}
                />
                <p style={{ fontSize: '0.78rem', color: '#a08070', marginTop: '0.4rem' }}>
                  ⏰ OTP expires in 10 minutes
                </p>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Verifying…' : '✓ Verify OTP'}
              </button>
              {/* Resend OTP */}
              <button
                type="button"
                className="btn btn-outline btn-full"
                style={{ marginTop: '0.75rem' }}
                onClick={() => { setStep(1); setOtp(''); setError(''); setSuccess(''); }}
              >
                ↩ Change Email / Resend OTP
              </button>
            </form>
          )}

          {/* ── Step 3 Form ── */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              {success && <div className="alert alert-success">{success}</div>}
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Resetting…' : '🔒 Reset Password'}
              </button>
            </form>
          )}

          {/* Back to login */}
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#a08070', fontSize: '0.875rem' }}>
            Remembered your password?{' '}
            <Link to="/login" style={{ color: '#c9956a', fontWeight: '600' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
