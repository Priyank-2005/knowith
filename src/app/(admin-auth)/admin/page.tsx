'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { safeNext } from '@/lib/config/site';

// Staff sign-in. Not linked from the public site; when ADMIN_IP_ALLOWLIST is
// set, this page (and the whole admin area) returns 404 to other IPs.
export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'), '/admin/insights', '/admin/');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Sign-in failed');
      router.replace(next);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm bg-[#111] border border-[#2E2E3E] rounded-2xl p-8 shadow-2xl space-y-5">
      <div>
        <div className="text-2xl font-serif text-[#F6F3EC]">Knowith Admin</div>
        <div className="text-[10px] text-[#D9B978] mt-1 tracking-widest uppercase font-mono">Restricted access</div>
      </div>
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm text-gray-400">Email</label>
        <input id="email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)}
          className="w-full bg-[#0A0A0F] border border-[#2E2E3E] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#B8873D]" />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm text-gray-400">Password</label>
        <input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}
          className="w-full bg-[#0A0A0F] border border-[#2E2E3E] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#B8873D]" />
      </div>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={busy}
        className="w-full py-2.5 rounded-lg bg-[#B8873D] hover:bg-[#a27530] text-white text-sm font-semibold disabled:opacity-60">
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
