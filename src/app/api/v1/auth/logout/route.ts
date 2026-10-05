import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, MEMBER_COOKIE } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/** POST /api/v1/auth/logout — { scope?: 'admin' | 'member' } (default: both) */
export async function POST(req: NextRequest) {
  const { scope } = await req.json().catch(() => ({}));
  const res = NextResponse.json({ success: true });
  if (scope !== 'member') res.cookies.delete(ADMIN_COOKIE);
  if (scope !== 'admin') res.cookies.delete(MEMBER_COOKIE);
  return res;
}
