"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import MarketTicker from './MarketTicker';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoSerif}>Knowith</span>
            <span className={styles.logoMono}>CAPITAL · UDAIPUR</span>
          </Link>

          {/* Links */}
          <div className={styles.navLinks}>
            <Link href="/#approach" style={{ color: pathname === '/#approach' ? 'var(--gold)' : '' }}>Approach</Link>
            <Link href="/services" style={{ color: pathname === '/services' ? 'var(--gold)' : '' }}>Services</Link>
            <Link href="/#products" style={{ color: pathname === '/#products' ? 'var(--gold)' : '' }}>Products</Link>
            <Link href="/calculators" style={{ color: pathname === '/calculators' ? 'var(--gold)' : '' }}>Calculators</Link>
            <Link href="/games" style={{ color: pathname.startsWith('/games') ? 'var(--gold)' : '' }}>Games</Link>
            <Link href="/market-concentration" style={{ color: pathname === '/market-concentration' ? 'var(--gold)' : '' }}>Markets</Link>
            <Link href="/insights" style={{ color: pathname === '/insights' ? 'var(--gold)' : '' }}>Insights</Link>
            <Link href="/contact" style={{ color: pathname === '/contact' ? 'var(--gold)' : '' }}>Contact</Link>
          </div>

          {/* Right Nav */}
          <div className={styles.navRight}>
            <span className={styles.phone}>+91 98765 43210</span>
            <Link href="/login" className={styles.loginBtn}>Login</Link>
            <Link href="/contact" className={styles.bookBtn}>Book a Consultation</Link>
          </div>

          <button className={styles.mobileToggle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

        </div>
      </nav>
      <MarketTicker />
    </header>
  );
}
