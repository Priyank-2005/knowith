import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ADMIN_COOKIE, MEMBER_COOKIE, verifyAdminToken, verifyMemberToken } from './session';

/** Current admin session (route handlers / server components). */
export async function getAdminSession() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function getMemberSession() {
  const jar = await cookies();
  return verifyMemberToken(jar.get(MEMBER_COOKIE)?.value);
}

/** Returns a 401 response when the caller is not a signed-in admin, otherwise null. */
export async function requireAdmin(): Promise<NextResponse | null> {
  return (await getAdminSession()) ? null : NextResponse.json({ error: 'Admin sign-in required' }, { status: 401 });
}

// ── Throttling ──────────────────────────────────────────────────

/**
 * Fixed-window counter with lockout. Returns the time the key is locked until
 * (if locked), after recording this hit.
 */
export async function hitThrottle(key: string, opts: { limit: number; windowMs: number; lockMs: number }): Promise<Date | null> {
  const now = new Date();
  const row = await prisma.authThrottle.findUnique({ where: { key } });

  if (row?.lockedUntil && row.lockedUntil > now) return row.lockedUntil;

  const windowExpired = !row || now.getTime() - row.windowStart.getTime() > opts.windowMs;
  const count = windowExpired ? 1 : row!.count + 1;
  const lockedUntil = count > opts.limit ? new Date(now.getTime() + opts.lockMs) : null;

  await prisma.authThrottle.upsert({
    where: { key },
    create: { key, count, windowStart: now, lockedUntil },
    update: { count: lockedUntil ? 0 : count, windowStart: windowExpired ? now : undefined, lockedUntil },
  });
  return lockedUntil;
}

export async function lockedUntil(key: string): Promise<Date | null> {
  const row = await prisma.authThrottle.findUnique({ where: { key } });
  return row?.lockedUntil && row.lockedUntil > new Date() ? row.lockedUntil : null;
}

export async function clearThrottle(key: string) {
  await prisma.authThrottle.deleteMany({ where: { key } });
}

export function formatLockMessage(until: Date): string {
  const mins = Math.max(1, Math.ceil((until.getTime() - Date.now()) / 60000));
  return `Too many attempts. Please try again in ${mins >= 60 ? `${Math.ceil(mins / 60)} hour${mins > 60 ? 's' : ''}` : `${mins} minute${mins > 1 ? 's' : ''}`}.`;
}
