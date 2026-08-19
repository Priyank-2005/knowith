"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../(website)/website.css'; // Import the heritage CSS

// @ts-ignore
import Navbar from '@/components/Navbar';

const TABS = [
  { key: 'client', label: 'Clients', desc: 'For existing Knowith Capital clients' },
  { key: 'non-client', label: 'Non-Clients', desc: 'Explore our AI-powered financial tools' },
  { key: 'admin', label: 'Admin', desc: 'Internal admin & email marketing panel' },
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

  const handleLogin = async (e: any) => {
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
          router.push('/advisor');
          break;
        case 'ADMIN':
          router.push('/admin/campaigns');
          break;
        default:
          router.push('/advisor');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const currentTab = TABS.find(t => t.key === activeTab)!;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
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
        <div style={{
          width: '100%', maxWidth: 440,
          background: 'var(--ink-2)',
          border: '1px solid rgba(217, 185, 120, 0.22)',
          borderRadius: 'var(--radius-sharp)', 
          padding: 36,
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          position: 'relative', zIndex: 10,
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{
              fontFamily: 'var(--font-display), serif',
              fontSize: 32,
              fontWeight: 400,
              color: 'var(--marble)',
              marginBottom: 8,
            }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--on-dark-soft)', fontSize: 14 }}>Secure portal access</p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 1,
            background: 'var(--ink)',
            border: '1px solid rgba(217, 185, 120, 0.22)',
            marginBottom: 28,
          }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setError(''); setEmail(''); setPassword(''); }}
                style={{
                  flex: 1, padding: '12px 0',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em',
                  transition: 'all 0.2s',
                  background: activeTab === tab.key ? 'var(--gold)' : 'transparent',
                  color: activeTab === tab.key ? 'var(--ink)' : 'var(--on-dark-soft)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Description */}
          <p style={{ color: 'var(--on-dark-soft)', fontSize: 13, textAlign: 'center', marginBottom: 24, fontStyle: 'italic' }}>
            {currentTab.desc}
          </p>

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)',
                  padding: '12px 0', color: 'var(--marble)', fontSize: 15, outline: 'none',
                  transition: 'border-color 0.2s', fontFamily: 'inherit'
                }}
                placeholder={
                  activeTab === 'client' ? 'client@knowith.com' :
                  activeTab === 'non-client' ? 'user@knowith.com' :
                  'admin@knowith.com'
                }
                onFocus={(e) => e.target.style.borderBottomColor = 'var(--gold)'}
                onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: 6, marginTop: 8 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)',
                  padding: '12px 0', color: 'var(--marble)', fontSize: 15, outline: 'none',
                  transition: 'border-color 0.2s', fontFamily: 'inherit'
                }}
                placeholder="Enter your password"
                onFocus={(e) => e.target.style.borderBottomColor = 'var(--gold)'}
                onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
              />
            </div>

            {error && (
              <p style={{
                color: '#ef4444', fontSize: 13, margin: '8px 0 0 0',
                padding: '8px 0',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold"
              style={{
                width: '100%', padding: '16px', marginTop: 24,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1, border: 'none'
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'SECURE SIGN IN'}
            </button>
          </form>

          {/* Credentials hint */}
          <div style={{
            marginTop: 32, padding: 16,
            background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--gold)', fontSize: 10, fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 0' }}>
              Demo Access
            </p>
            <div style={{ fontSize: 13, color: 'var(--on-dark-soft)' }}>
              {activeTab === 'client' && <>Email: client@knowith.com<br/>Pass: client@123</>}
              {activeTab === 'non-client' && <>Email: user@knowith.com<br/>Pass: user@123</>}
              {activeTab === 'admin' && <>Email: admin@knowith.com<br/>Pass: admin@123</>}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)' }}>
          <Link href="/" style={{ fontSize: 12, fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--marble)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gold)'}
          >
            ← Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
}

