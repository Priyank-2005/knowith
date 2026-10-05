import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 100;

/**
 * GET /api/v1/admin/chats?feature=ADVISOR&q=search
 * Conversations with at least one message, newest activity first.
 * `q` matches the person's name/email or any message text.
 */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const feature = request.nextUrl.searchParams.get('feature');
    const q = request.nextUrl.searchParams.get('q')?.trim();

    const where: Prisma.SessionWhereInput = {
      messages: { some: {} },
      ...(feature && feature !== 'ALL' ? { feature } : {}),
      ...(q
        ? {
            OR: [
              { actorEmail: { contains: q, mode: 'insensitive' } },
              { actorName: { contains: q, mode: 'insensitive' } },
              { client: { is: { OR: [{ email: { contains: q, mode: 'insensitive' } }, { name: { contains: q, mode: 'insensitive' } }] } } },
              { user: { is: { OR: [{ email: { contains: q, mode: 'insensitive' } }, { name: { contains: q, mode: 'insensitive' } }] } } },
              { messages: { some: { content: { contains: q, mode: 'insensitive' } } } },
            ],
          }
        : {}),
    };

    const [sessions, counts] = await Promise.all([
      prisma.session.findMany({
        where,
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
          client: { select: { name: true, email: true, isActive: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { updatedAt: 'desc' },
        take: PAGE_SIZE,
      }),
      prisma.session.groupBy({ by: ['feature'], where: { messages: { some: {} } }, _count: { _all: true } }),
    ]);

    // Contact details captured by the support assistant in these conversations
    const leads = await prisma.lead.findMany({
      where: { sessionId: { in: sessions.map(s => s.id) } },
      select: { sessionId: true, name: true, email: true, phone: true, city: true, investmentRange: true, status: true },
    });
    const leadBySession = new Map(leads.map(l => [l.sessionId, l]));

    return NextResponse.json({
      success: true,
      sessions: sessions.map(s => ({ ...s, lead: leadBySession.get(s.id) ?? null })),
      counts: Object.fromEntries(counts.map(c => [c.feature, c._count._all])),
      truncated: sessions.length === PAGE_SIZE,
    });
  } catch (error) {
    console.error('Admin Chats API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch chat logs' }, { status: 500 });
  }
}
