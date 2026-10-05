'use client';

import { useEffect, useState } from 'react';

export interface SessionState {
  loading: boolean;
  admin: { email: string; name?: string | null } | null;
  member: { email: string; name?: string | null } | null;
}

/** Who is signed in — for UI only; access is enforced server-side (proxy.ts / route handlers). */
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ loading: true, admin: null, member: null });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/v1/auth/session', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (!cancelled) setState({ loading: false, admin: d.admin, member: d.member }); })
      .catch(() => { if (!cancelled) setState({ loading: false, admin: null, member: null }); });
    return () => { cancelled = true; };
  }, []);

  return state;
}

export async function signOut(scope?: 'admin' | 'member') {
  await fetch('/api/v1/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scope }),
  });
}
