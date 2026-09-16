"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className="section-light" style={{ minHeight: '80vh', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>Our Products</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--slate)', maxWidth: '600px', margin: '1rem auto' }}>
              Institutional-grade mutual fund portfolios and advisory products tailored for sophisticated investors.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--ink)', marginBottom: '1rem' }}>Core Equity Portfolio</h3>
              <p style={{ color: 'var(--slate)', lineHeight: 1.6, marginBottom: '2rem' }}>
                A concentrated portfolio of high-quality large and mid-cap mutual funds designed for long-term wealth creation. We focus on funds with consistent alpha generation and low downside capture.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: 'var(--slate)' }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ 15-20% Expected CAGR</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ 5+ Years Horizon</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ High Risk Tolerance</li>
              </ul>
              <button style={{ width: '100%', padding: '1rem', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>View Details</button>
            </div>

            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--ink)', marginBottom: '1rem' }}>Balanced Yield Fund</h3>
              <p style={{ color: 'var(--slate)', lineHeight: 1.6, marginBottom: '2rem' }}>
                A hybrid approach blending aggressive equity with stable fixed-income debt funds. Perfect for investors seeking inflation-beating returns with significantly reduced volatility.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: 'var(--slate)' }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ 10-12% Expected CAGR</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ 3+ Years Horizon</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ Moderate Risk Tolerance</li>
              </ul>
              <button style={{ width: '100%', padding: '1rem', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>View Details</button>
            </div>

            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--ink)', marginBottom: '1rem' }}>Tax Shield (ELSS)</h3>
              <p style={{ color: 'var(--slate)', lineHeight: 1.6, marginBottom: '2rem' }}>
                Maximize your Section 80C deductions while building equity wealth. Our curated selection of Equity Linked Savings Schemes offers the shortest lock-in period with maximum upside.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: 'var(--slate)' }}>
                <li style={{ marginBottom: '0.5rem' }}>✓ Tax Savings under 80C</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ 3 Year Lock-in</li>
                <li style={{ marginBottom: '0.5rem' }}>✓ High Risk Tolerance</li>
              </ul>
              <button style={{ width: '100%', padding: '1rem', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>View Details</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
