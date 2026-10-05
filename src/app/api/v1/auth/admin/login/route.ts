import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, adminIpAllowed, clientIp, cookieOptions, signSession } from '@/lib/auth/session';
import { clearThrottle, formatLockMessage, hitThrottle, lockedUntil } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

const INVALID = 'Invalid email or password';

/** POST /api/v1/auth/admin/login — { email, password } → sets the admin session cookie */
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!adminIpAllowed(ip)) return new NextResponse('Not found', { status: 404 });

  try {
    const { email, password } = await req.json();
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const normalized = email.trim().toLowerCase();
    const throttleKey = `admin-login:${ip || 'unknown'}`;

    const locked = await lockedUntil(throttleKey);
    if (locked) return NextResponse.json({ error: formatLockMessage(locked) }, { status: 429 });

    const user = await prisma.user.findFirst({ where: { email: { equals: normalized, mode: 'insensitive' } } });
    const check = user && user.role === 'ADMIN' ? await verifyPassword(password, user.password) : { ok: false, needsRehash: false };

    if (!user || !check.ok) {
      // 5 failed attempts per 15 minutes, then a 1-hour lock for this IP
      const lock = await hitThrottle(throttleKey, { limit: 5, windowMs: 15 * 60_000, lockMs: 60 * 60_000 });
      return NextResponse.json({ error: lock ? formatLockMessage(lock) : INVALID }, { status: lock ? 429 : 401 });
    }

    // The old public seed endpoint created accounts with these published passwords
    if (check.needsRehash && ['admin@123', 'client@123', 'user@123'].includes(password)) {
      return NextResponse.json({
        error: 'This account still uses the default demo password, which is disabled. Reset it with `npm run admin:create -- <email>`.',
      }, { status: 403 });
    }

    await clearThrottle(throttleKey);
    if (check.needsRehash) {
      await prisma.user.update({ where: { id: user.id }, data: { password: await hashPassword(password) } });
    }

    const token = await signSession({
      kind: 'admin', uid: user.id, email: user.email, name: user.name,
      exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS,
    });
    const res = NextResponse.json({ success: true, user: { email: user.email, name: user.name } });
    res.cookies.set(ADMIN_COOKIE, token, cookieOptions(ADMIN_SESSION_SECONDS));
    return res;
  } catch (error) {
    console.error('[AdminLogin] Failed:', error);
    return NextResponse.json({ error: 'Sign-in failed' }, { status: 500 });
  }
}
