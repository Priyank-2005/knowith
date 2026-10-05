import { NextResponse } from 'next/server';
import { getAdminSession, getMemberSession } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

/** GET /api/v1/auth/session — who is signed in (used by the UI only; access is enforced server-side). */
export async function GET() {
  const [admin, member] = await Promise.all([getAdminSession(), getMemberSession()]);
  return NextResponse.json({
    admin: admin ? { email: admin.email, name: admin.name } : null,
    member: member ? { email: member.email, name: member.name } : null,
  });
}
