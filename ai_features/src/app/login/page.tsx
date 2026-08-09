"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Navbar from '@/components/Navbar';

const TABS = [
  { key: 'client', label: 'Clients', color: '#60a5fa', desc: 'For existing Knowith Capital clients' },
  { key: 'non-client', label: 'Non-Clients', color: '#818cf8', desc: 'Explore our AI-powered financial tools' },
  { key: 'admin', label: 'Admin', color: '#f59e0b', desc: 'Internal admin & email marketing panel' },
];

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Seed users on first load
  useEffect(() => {
    fetch('/api/v1/auth/seed', { method: 'POST' }).catch(() => {});
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Store user info for sidebar role filtering
      localStorage.setItem('knowith_user', JSON.stringify(data.user));

      // Route based on role
      switch (data.user.role) {
        case 'CLIENT':
          router.push('/client/dashboard');
          break;
        case 'NON_CLIENT':
          router.push('/features');
          break;
        case 'ADMIN':
          router.push('/admin/campaigns');
          break;
        default:
          router.push('/features');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const currentTab = TABS.find(t => t.key === activeTab);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <div style={{ width: '100%', zIndex: 10 }}>
        <Navbar />
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        width: '100%',
        position: 'relative',
      }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '20%', left: '-10%',
        width: 500, height: 500,
        background: `${currentTab.color}22`, borderRadius: '50%',
        filter: 'blur(120px)', pointerEvents: 'none',
        transition: 'background 0.5s ease',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '-10%',
        width: 500, height: 500,
        background: 'rgba(99,102,241,0.12)', borderRadius: '50%',
        filter: 'blur(120px)', pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 440,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid #2E2E3E',
        borderRadius: 24, padding: 36,
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        position: 'relative', zIndex: 10,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 700,
            background: 'linear-gradient(to right, #60a5fa, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}>
            Welcome to Knowith
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 14 }}>Sign in to your account</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4,
          background: '#151515', borderRadius: 12,
          padding: 4, marginBottom: 28,
          border: '1px solid #2E2E3E',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setError(''); setEmail(''); setPassword(''); }}
              style={{
                flex: 1, padding: '10px 0',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                transition: 'all 0.2s',
                background: activeTab === tab.key ? '#2E2E3E' : 'transparent',
                color: activeTab === tab.key ? tab.color : '#6b7280',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <p style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', marginBottom: 24 }}>
          {currentTab.desc}
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9ca3af', marginBottom: 6 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', background: '#151515', border: '1px solid #2E2E3E',
                  borderRadius: 8, padding: '12px 16px 12px 40px',
                  color: 'white', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                placeholder={
                  activeTab === 'client' ? 'client@knowith.com' :
                  activeTab === 'non-client' ? 'user@knowith.com' :
                  'admin@knowith.com'
                }
                onFocus={(e) => e.target.style.borderColor = currentTab.color}
                onBlur={(e) => e.target.style.borderColor = '#2E2E3E'}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#9ca3af', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', background: '#151515', border: '1px solid #2E2E3E',
                  borderRadius: 8, padding: '12px 16px 12px 40px',
                  color: 'white', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                placeholder="Enter your password"
                onFocus={(e) => e.target.style.borderColor = currentTab.color}
                onBlur={(e) => e.target.style.borderColor = '#2E2E3E'}
              />
            </div>
          </div>

          {error && (
            <p style={{
              color: '#f87171', fontSize: 13, margin: 0,
              background: 'rgba(248,113,113,0.08)',
              padding: '8px 12px', borderRadius: 8,
              border: '1px solid rgba(248,113,113,0.2)',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: 13, marginTop: 4,
              background: `linear-gradient(to right, ${currentTab.color}, #6366f1)`,
              borderRadius: 10, fontSize: 14, fontWeight: 600,
              color: 'white', border: 'none', cursor: loading ? 'wait' : 'pointer',
              transition: 'opacity 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Credentials hint */}
        <div style={{
          marginTop: 24, padding: 16,
          background: '#0f0f14', borderRadius: 10,
          border: '1px solid #1f1f2e',
        }}>
          <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>
            Demo Credentials
          </p>
          <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.8 }}>
            {activeTab === 'client' && <><b style={{ color: '#60a5fa' }}>Email:</b> client@knowith.com &nbsp;|&nbsp; <b style={{ color: '#60a5fa' }}>Pass:</b> client@123</>}
            {activeTab === 'non-client' && <><b style={{ color: '#818cf8' }}>Email:</b> user@knowith.com &nbsp;|&nbsp; <b style={{ color: '#818cf8' }}>Pass:</b> user@123</>}
            {activeTab === 'admin' && <><b style={{ color: '#f59e0b' }}>Email:</b> admin@knowith.com &nbsp;|&nbsp; <b style={{ color: '#f59e0b' }}>Pass:</b> admin@123</>}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}>
        <Link href="/" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#d1d5db'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
        >
          Return to Website
        </Link>
      </div>
    </div>
    </div>
  );
}
