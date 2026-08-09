"use client";

import React from 'react';
import Link from 'next/link';

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          Client Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          This feature will come soon. We are actively working on an exclusive experience for our clients.
        </p>
        <div>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#1A1A24] hover:bg-[#2E2E3E] text-white rounded-lg transition-colors font-medium border border-[#2E2E3E]"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
