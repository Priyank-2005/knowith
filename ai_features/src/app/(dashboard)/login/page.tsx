"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Users, ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [adminMode, setAdminMode] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      router.push('/admin/campaigns'); // Default admin landing
    } else {
      setError('Invalid admin password. Try "admin123"');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0A0A0F]/80 backdrop-blur-2xl border border-[#2E2E3E] rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
            Welcome to Knowith
          </h1>
          <p className="text-gray-400 text-sm">Select your login portal to continue</p>
        </div>

        {!adminMode ? (
          <div className="space-y-4">
            <button
              onClick={() => router.push('/client/dashboard')}
              className="w-full group flex items-center justify-between p-4 bg-[#151515] border border-[#2E2E3E] hover:border-blue-500/50 rounded-xl transition-all hover:bg-[#1A1A24]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-white">Clients Login</h3>
                  <p className="text-xs text-gray-500">For existing Knowith clients</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
            </button>

            <button
              onClick={() => router.push('/features')}
              className="w-full group flex items-center justify-between p-4 bg-[#151515] border border-[#2E2E3E] hover:border-indigo-500/50 rounded-xl transition-all hover:bg-[#1A1A24]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-white">Non-Clients Login</h3>
                  <p className="text-xs text-gray-500">Explore our AI tools & features</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 transition-colors" />
            </button>

            <div className="pt-6 mt-6 border-t border-[#2E2E3E]">
              <button
                onClick={() => setAdminMode(true)}
                className="w-full group flex items-center justify-between p-4 bg-transparent border border-transparent hover:border-[#2E2E3E] rounded-xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#151515] flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-400 group-hover:text-white transition-colors">Admin Login</h3>
                  </div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <button 
              onClick={() => { setAdminMode(false); setError(''); setPassword(''); }}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to options
            </button>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Admin Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#151515] border border-[#2E2E3E] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter password..."
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Access Admin Panel
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Return to Website
        </Link>
      </div>
    </div>
  );
}
