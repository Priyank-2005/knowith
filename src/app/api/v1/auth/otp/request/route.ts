import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOtp, hashOtp } from '@/lib/auth/password';
import { clientIp } from '@/lib/auth/session';
import { formatLockMessage, hitThrottle, lockedUntil } from '@/lib/auth/guards';
import { sendOtpEmail } from '@/lib/auth/otpEmail';

export const dynamic = 'force-dynamic';

const OTP_TTL_MS = 10 * 60_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /api/v1/auth/otp/request — { email } → emails a 6-digit code to approved clients */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const normalized = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!EMAIL_RE.test(normalized)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // A lock from repeated wrong codes applies to sending as well
    const verifyLock = await lockedUntil(`otp-verify:${normalized}`);
    if (verifyLock) return NextResponse.json({ error: formatLockMessage(verifyLock) }, { status: 429 });

    // Per-IP guard against spraying many addresses
    const ipLock = await hitThrottle(`otp-ip:${clientIp(req.headers) || 'unknown'}`, { limit: 20, windowMs: 60 * 60_000, lockMs: 60 * 60_000 });
    if (ipLock) return NextResponse.json({ error: formatLockMessage(ipLock) }, { status: 429 });

    const client = await prisma.approvedClient.findUnique({ where: { email: normalized } });
    if (!client || !client.isActive) {
      return NextResponse.json({
        error: "This email isn't registered with Knowith Capital. Please use the email you share with us, or contact us to get access.",
        code: 'NOT_APPROVED',
      }, { status: 403 });
    }

    // At most 3 codes per email per hour, then a 1-hour lock
    const sendLock = await hitThrottle(`otp-send:${normalized}`, { limit: 3, windowMs: 60 * 60_000, lockMs: 60 * 60_000 });
    if (sendLock) return NextResponse.json({ error: formatLockMessage(sendLock) }, { status: 429 });

    const code = generateOtp();
    // Only the newest code is valid
    await prisma.loginOtp.updateMany({ where: { email: normalized, consumedAt: null }, data: { consumedAt: new Date() } });
    await prisma.loginOtp.create({
      data: { email: normalized, codeHash: hashOtp(normalized, code), expiresAt: new Date(Date.now() + OTP_TTL_MS) },
    });
    await sendOtpEmail(normalized, code, client.name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[OTP request] Failed:', error);
    return NextResponse.json({ error: 'Could not send the code. Please try again shortly.' }, { status: 500 });
  }
}
