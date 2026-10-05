import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';
import { hashOtp } from '@/lib/auth/password';
import { MEMBER_COOKIE, MEMBER_SESSION_SECONDS, cookieOptions, signSession } from '@/lib/auth/session';
import { clearThrottle, formatLockMessage, hitThrottle, lockedUntil } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

const WRONG = 'That code is incorrect or has expired.';

/** POST /api/v1/auth/otp/verify — { email, code } → sets the member session cookie */
export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    const normalized = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const digits = typeof code === 'string' ? code.replace(/\D/g, '') : '';
    if (!normalized || digits.length !== 6) {
      return NextResponse.json({ error: 'Enter the 6-digit code from your email' }, { status: 400 });
    }

    const throttleKey = `otp-verify:${normalized}`;
    const locked = await lockedUntil(throttleKey);
    if (locked) return NextResponse.json({ error: formatLockMessage(locked) }, { status: 429 });

    const otp = await prisma.loginOtp.findFirst({
      where: { email: normalized, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    const expected = otp ? Buffer.from(otp.codeHash) : null;
    const actual = Buffer.from(hashOtp(normalized, digits));
    const match = expected && expected.length === actual.length && timingSafeEqual(expected, actual);

    if (!otp || !match) {
      if (otp) await prisma.loginOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      // 3 wrong codes → 1-hour lock (also blocks requesting new codes)
      const lock = await hitThrottle(throttleKey, { limit: 2, windowMs: 60 * 60_000, lockMs: 60 * 60_000 });
      if (lock && otp) await prisma.loginOtp.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
      return NextResponse.json({ error: lock ? formatLockMessage(lock) : WRONG }, { status: lock ? 429 : 401 });
    }

    const client = await prisma.approvedClient.findUnique({ where: { email: normalized } });
    if (!client || !client.isActive) {
      return NextResponse.json({ error: 'Access for this email has been removed. Please contact us.' }, { status: 403 });
    }

    await prisma.loginOtp.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
    await prisma.approvedClient.update({ where: { id: client.id }, data: { lastLoginAt: new Date() } });
    await clearThrottle(throttleKey);
    await clearThrottle(`otp-send:${normalized}`);

    const token = await signSession({
      kind: 'member', cid: client.id, email: client.email, name: client.name,
      exp: Math.floor(Date.now() / 1000) + MEMBER_SESSION_SECONDS,
    });
    const res = NextResponse.json({ success: true, member: { email: client.email, name: client.name } });
    res.cookies.set(MEMBER_COOKIE, token, cookieOptions(MEMBER_SESSION_SECONDS));
    return res;
  } catch (error) {
    console.error('[OTP verify] Failed:', error);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
