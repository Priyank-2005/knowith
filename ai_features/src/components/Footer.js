"use client";

import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        
        <div className={styles.footerGrid}>
          {/* Brand Col */}
          <div className={styles.brandCol}>
            <span className={styles.logoSerif}>Knowith</span>
            <span className={styles.logoMono}>CAPITAL · UDAIPUR</span>
            <p className={styles.brandDesc}>
              Institutional-grade mutual fund advisory and financial planning for those who value structure, clarity, and uncompromising elegance.
            </p>
          </div>

          {/* Services Links */}
          <div className={styles.linkGroup}>
            <h4>Services</h4>
            <ul>
              <li><Link href="/services">Mutual Funds</Link></li>
              <li><Link href="/services">Portfolio Management</Link></li>
              <li><Link href="/services">Direct Equity</Link></li>
              <li><Link href="/services">NRI Solutions</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className={styles.linkGroup}>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">Our Approach</Link></li>
              <li><Link href="/why-choose-us">Why Choose Us</Link></li>
              <li><Link href="/insights">Insights</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className={styles.linkGroup}>
            <h4>Legal</h4>
            <ul>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
              <li><Link href="#">Disclosures</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.disclaimer}>
          <p>
            Regulatory Disclaimer: Knowith Capital is a registered Mutual Fund Distributor (Fake ARN-123456). Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not an indicator of future returns. The information provided on this website is for educational purposes only and should not be construed as financial advice. All AUM figures and testimonials are placeholder data for demonstration purposes until updated with real firm metrics.
          </p>
        </div>

        <div className={styles.bottomBar}>
          <p>© {new Date().getFullYear()} Knowith Capital. All rights reserved.</p>
          <div className={styles.socials}>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
