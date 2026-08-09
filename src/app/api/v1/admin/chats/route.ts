import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const feature = searchParams.get('feature');

    const whereClause = feature ? { feature } : {};

    const sessions = await prisma.session.findMany({
      where: whereClause,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        },
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error: any) {
    console.error('Admin Chats API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat logs' },
      { status: 500 }
    );
  }
}
