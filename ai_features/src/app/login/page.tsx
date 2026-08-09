"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [adminMode, setAdminMode] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      router.push('/admin/campaigns');
    } else {
      setError('Invalid admin password. Try "admin123"');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '25%', left: '-15%',
        width: 500, height: 500,
        background: 'rgba(59,130,246,0.15)', borderRadius: '50%',
        filter: 'blur(120px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '25%', right: '-15%',
        width: 500, height: 500,
        background: 'rgba(99,102,241,0.15)', borderRadius: '50%',
        filter: 'blur(120px)', pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid #2E2E3E',
        borderRadius: 24, padding: 32,
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 700,
            background: 'linear-gradient(to right, #60a5fa, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}>
            Welcome to Knowith
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 14 }}>Select your login portal to continue</p>
        </div>

        {!adminMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Clients Login */}
            <button
              onClick={() => router.push('/client/dashboard')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 16, background: '#151515', border: '1px solid #2E2E3E',
                borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                color: 'white',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f680'; e.currentTarget.style.background = '#1A1A24'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2E2E3E'; e.currentTarget.style.background = '#151515'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 500, margin: 0, color: 'white' }}>Clients Login</h3>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>For existing Knowith clients</p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>

            {/* Non-Clients Login */}
            <button
              onClick={() => router.push('/features')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 16, background: '#151515', border: '1px solid #2E2E3E',
                borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                color: 'white',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366f180'; e.currentTarget.style.background = '#1A1A24'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2E2E3E'; e.currentTarget.style.background = '#151515'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 500, margin: 0, color: 'white' }}>Non-Clients Login</h3>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Explore our AI tools & features</p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>

            {/* Admin Login */}
            <div style={{ paddingTop: 24, marginTop: 24, borderTop: '1px solid #2E2E3E' }}>
              <button
                onClick={() => setAdminMode(true)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                  padding: 16, background: 'transparent', border: '1px solid transparent',
                  borderRadius: 12, cursor: 'pointer', color: '#9ca3af',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2E2E3E'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#151515', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>Admin Login</h3>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => { setAdminMode(false); setError(''); setPassword(''); }}
              style={{
                fontSize: 14, color: '#9ca3af', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 24, padding: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
              Back to options
            </button>
            
            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#9ca3af', marginBottom: 8 }}>Admin Password</label>
                <div style={{ position: 'relative' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%', background: '#151515', border: '1px solid #2E2E3E',
                      borderRadius: 8, padding: '12px 16px 12px 40px',
                      color: 'white', fontSize: 14, outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Enter password..."
                    autoFocus
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#2E2E3E'}
                  />
                </div>
                {error && <p style={{ color: '#f87171', fontSize: 12, marginTop: 8 }}>{error}</p>}
              </div>
              
              <button
                type="submit"
                style={{
                  width: '100%', padding: 12,
                  background: 'linear-gradient(to right, #3b82f6, #6366f1)',
                  borderRadius: 8, fontSize: 14, fontWeight: 500,
                  color: 'white', border: 'none', cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Access Admin Panel
              </button>
            </form>
          </div>
        )}
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
  );
}
