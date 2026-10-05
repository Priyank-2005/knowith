import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isStoredFileUrl } from '@/lib/storage';
import { getAdminSession, requireAdmin } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

const INSIGHT_TYPES = ['REPORT', 'ARTICLE', 'INFOGRAPHIC'];

/**
 * GET /api/v1/insights          → published insights (list fields only)
 * GET /api/v1/insights?all=1    → every insight incl. drafts (admin panel)
 */
export async function GET(req: NextRequest) {
  try {
    const includeDrafts = req.nextUrl.searchParams.get('all') === '1' && Boolean(await getAdminSession());
    const insights = await prisma.insight.findMany({
      where: includeDrafts ? {} : { isActive: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true, title: true, description: true, type: true, contentUrl: true,
        thumbnailUrl: true, publishedAt: true, isActive: true, createdAt: true,
      },
    });
    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Failed to fetch insights:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}

/**
 * Creates an ARTICLE (editor) or INFOGRAPHIC (image) insight.
 * Files are uploaded beforehand via /api/v1/uploads; this receives their URLs.
 * PDF reports are created through /api/v1/insights/convert instead.
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await req.json();
    const { title, description, type, contentBody, contentUrl, thumbnailUrl } = body ?? {};

    if (!INSIGHT_TYPES.includes(type)) {
      return NextResponse.json({ error: 'A valid type is required' }, { status: 400 });
    }
    if (type !== 'INFOGRAPHIC' && !title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    for (const url of [contentUrl, thumbnailUrl]) {
      if (url && !isStoredFileUrl(url)) return NextResponse.json({ error: 'Files must be uploaded first' }, { status: 400 });
    }
    if (type === 'INFOGRAPHIC' && !contentUrl) {
      return NextResponse.json({ error: 'An image is required for infographics' }, { status: 400 });
    }

    const insight = await prisma.insight.create({
      data: {
        title: title || '',
        description: description || '',
        type,
        contentUrl: contentUrl || null,
        thumbnailUrl: thumbnailUrl || (type === 'INFOGRAPHIC' ? contentUrl : null),
        contentBody: contentBody || '',
        publishedAt: new Date(),
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error('Failed to create insight:', error);
    return NextResponse.json({ error: 'Failed to create insight' }, { status: 500 });
  }
}
