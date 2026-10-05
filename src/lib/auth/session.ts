// ────────────────────────────────────────────────────────────────
// Signed session cookies (HMAC-SHA256 via Web Crypto — usable from
// proxy.ts, route handlers and server components).
//
// Two independent sessions:
//   kc_admin  — staff signed in at /admin (role ADMIN)
//   kc_member — approved clients signed in with an email OTP
// ────────────────────────────────────────────────────────────────

export const ADMIN_COOKIE = 'kc_admin';
export const MEMBER_COOKIE = 'kc_member';

export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;        // 8 hours
export const MEMBER_SESSION_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface AdminSession { kind: 'admin'; uid: string; email: string; name?: string | null; exp: number }
export interface MemberSession { kind: 'member'; cid: string; email: string; name?: string | null; exp: number }
type Session = AdminSession | MemberSession;

const DEV_SECRET = 'knowith-dev-only-secret-change-me';

export function authSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET must be set (at least 32 characters) to sign sessions');
  }
  return DEV_SECRET;
}

const encoder = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): Uint8Array {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(authSecret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signSession(session: Session): Promise<string> {
  const payload = b64url(encoder.encode(JSON.stringify(session)));
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(), encoder.encode(payload)));
  return `${payload}.${b64url(sig)}`;
}

async function verify<T extends Session>(token: string | undefined, kind: T['kind']): Promise<T | null> {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(), fromB64url(sig) as BufferSource, encoder.encode(payload));
    if (!ok) return null;
    const session = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as T;
    if (session.kind !== kind || session.exp * 1000 < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export const verifyAdminToken = (token?: string) => verify<AdminSession>(token, 'admin');
export const verifyMemberToken = (token?: string) => verify<MemberSession>(token, 'member');

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

/** Client IP as seen by the platform (Vercel sets x-forwarded-for / x-real-ip). */
export function clientIp(headers: Headers): string {
  return (headers.get('x-forwarded-for')?.split(',')[0] || headers.get('x-real-ip') || '').trim();
}

/** ADMIN_IP_ALLOWLIST="1.2.3.4, 5.6.7.8" — empty/unset allows all. */
export function adminIpAllowed(ip: string): boolean {
  const list = (process.env.ADMIN_IP_ALLOWLIST || '').split(',').map(s => s.trim()).filter(Boolean);
  if (list.length === 0) return true;
  return list.includes(ip);
}
