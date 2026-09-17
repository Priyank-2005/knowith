"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./(website)/website.css";

const fraunces = Fraunces({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: '--font-display'
});

const manrope = Manrope({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: '--font-body'
});

const ibmMono = IBM_Plex_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  variable: '--font-mono'
});

export default function NotFound() {
  return (
    <div className={`${fraunces.variable} ${manrope.variable} ${ibmMono.variable} ${manrope.className}`}>
      <Navbar />
      <main className="section-light" style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 20px' }}>
        <h1 style={{ fontSize: '6rem', marginBottom: '1rem', color: 'var(--gold)', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--ink)' }}>Page Not Found</h2>
        <p style={{ maxWidth: '500px', margin: '0 auto 2.5rem', color: 'var(--slate)', fontSize: '1.1rem' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/" className="btn-gold">
          Return to Homepage
        </Link>
      </main>
      <Footer />
    </div>
  );
}
