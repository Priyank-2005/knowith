"use client";

import { useEffect } from "react";
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

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className={`${fraunces.variable} ${manrope.variable} ${ibmMono.variable} ${manrope.className}`}>
      <Navbar />
      <main className="section-light" style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 20px' }}>
        <h1 style={{ fontSize: '6rem', marginBottom: '1rem', color: 'var(--maroon)', lineHeight: 1 }}>500</h1>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--ink)' }}>Something went wrong</h2>
        <p style={{ maxWidth: '500px', margin: '0 auto 2.5rem', color: 'var(--slate)', fontSize: '1.1rem' }}>
          We are experiencing an unexpected server error. Our technical team has been notified. Please try again in a few moments.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => reset()} className="btn btn-ghost" style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }}>
            Try Again
          </button>
          <Link href="/" className="btn btn-gold">
            Return to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
