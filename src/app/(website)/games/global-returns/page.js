"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function GlobalReturnsGamePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[85vh] bg-[#050505]">
        <iframe 
          src="/games/global-returns-prediction/index.html" 
          className="w-full h-[85vh] border-none"
          title="Knowith Global Asset Allocator Game"
        />
      </main>
      <Footer />
    </>
  );
}
