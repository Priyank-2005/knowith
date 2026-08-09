"use client";

import React from 'react';
import Link from 'next/link';

export default function ClientDashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(59,130,246,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <h1 style={{
          fontSize: 36, fontWeight: 700,
          background: 'linear-gradient(to right, #60a5fa, #818cf8)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 16,
        }}>
          Client Dashboard
        </h1>
        <p style={{ color: '#9ca3af', fontSize: 18, lineHeight: 1.6, marginBottom: 32 }}>
          This feature will come soon. We are actively working on an exclusive experience for our clients.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#1A1A24',
            color: 'white',
            borderRadius: 8,
            fontWeight: 500,
            border: '1px solid #2E2E3E',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
